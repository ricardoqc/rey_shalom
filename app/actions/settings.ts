'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ============================================================================
// SCHEMAS DE VALIDACIÓN
// ============================================================================

const updateProfileSchema = z.object({
  phone: z.string().optional().nullable(),
  whatsapp_number: z.string().optional().nullable(),
  whatsapp_type: z.enum(['personal', 'business']).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
})

const paymentMethodSchema = z.object({
  method_type: z.enum(['BANK_ACCOUNT', 'PAYPAL', 'WISE', 'WESTERN_UNION', 'YAPE', 'PLIN', 'OTHER']),
  provider_name: z.string().optional().nullable(),
  account_number: z.string().min(1, 'El número de cuenta es requerido'),
  account_holder_name: z.string().optional().nullable(),
  routing_number: z.string().optional().nullable(),
  swift_code: z.string().optional().nullable(),
  currency: z.enum(['PEN', 'USD', 'EUR']).default('PEN'),
  is_default: z.boolean().default(false),
  notes: z.string().optional().nullable(),
})

const socialLinkSchema = z.object({
  platform: z.enum(['FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'TWITTER', 'OTHER']),
  url: z.string().url('Debe ser una URL válida').or(z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Número de WhatsApp inválido')),
  display_name: z.string().optional().nullable(),
  is_public: z.boolean().default(true),
})

const storeSchema = z.object({
  store_name: z.string().optional().nullable(),
  store_description: z.string().optional().nullable(),
  store_banner_url: z.string().url().optional().nullable(),
  store_logo_url: z.string().url().optional().nullable(),
  store_theme: z.enum(['default', 'blue', 'green', 'purple', 'orange', 'pink', 'dark']).default('default'),
  seo_keywords: z.string().optional().nullable(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// ============================================================================
// ACTUALIZAR PERFIL (Datos de contacto y dirección)
// ============================================================================

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validatedData = updateProfileSchema.parse(data)

    const { error } = await supabase
      .from('profiles')
      .update({
        phone: validatedData.phone,
        whatsapp_number: validatedData.whatsapp_number,
        whatsapp_type: validatedData.whatsapp_type,
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al actualizar perfil' }
  }
}

// ============================================================================
// MÉTODOS DE PAGO
// ============================================================================

export async function addPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validatedData = paymentMethodSchema.parse(data)

    // Si se marca como default, desmarcar otros métodos default del usuario
    if (validatedData.is_default) {
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true)
    }

    const { data: paymentMethod, error } = await supabase
      .from('user_payment_methods')
      .insert({
        user_id: user.id,
        ...validatedData,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true, data: paymentMethod }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al agregar método de pago' }
  }
}

export async function updatePaymentMethod(
  methodId: string,
  data: z.infer<typeof paymentMethodSchema>
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validatedData = paymentMethodSchema.parse(data)

    // Verificar que el método pertenece al usuario
    const { data: existingMethod } = await supabase
      .from('user_payment_methods')
      .select('user_id')
      .eq('id', methodId)
      .single()

    if (!existingMethod || existingMethod.user_id !== user.id) {
      return { success: false, error: 'Método de pago no encontrado' }
    }

    // Si se marca como default, desmarcar otros métodos default del usuario
    if (validatedData.is_default) {
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true)
        .neq('id', methodId)
    }

    const { error } = await supabase
      .from('user_payment_methods')
      .update(validatedData)
      .eq('id', methodId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al actualizar método de pago' }
  }
}

export async function deletePaymentMethod(methodId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const { error } = await supabase
    .from('user_payment_methods')
    .delete()
    .eq('id', methodId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

// ============================================================================
// REDES SOCIALES
// ============================================================================

export async function addSocialLink(data: z.infer<typeof socialLinkSchema>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validatedData = socialLinkSchema.parse(data)

    const { data: socialLink, error } = await supabase
      .from('user_social_links')
      .insert({
        user_id: user.id,
        ...validatedData,
      })
      .select()
      .single()

    if (error) {
      // Si ya existe, actualizar
      if (error.code === '23505') {
        const { data: updatedLink, error: updateError } = await supabase
          .from('user_social_links')
          .update(validatedData)
          .eq('user_id', user.id)
          .eq('platform', validatedData.platform)
          .select()
          .single()

        if (updateError) {
          return { success: false, error: updateError.message }
        }

        revalidatePath('/dashboard/settings')
        return { success: true, data: updatedLink }
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true, data: socialLink }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al agregar red social' }
  }
}

export async function updateSocialLink(
  linkId: string,
  data: z.infer<typeof socialLinkSchema>
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validatedData = socialLinkSchema.parse(data)

    const { error } = await supabase
      .from('user_social_links')
      .update(validatedData)
      .eq('id', linkId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al actualizar red social' }
  }
}

export async function deleteSocialLink(linkId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const { error } = await supabase
    .from('user_social_links')
    .delete()
    .eq('id', linkId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

// ============================================================================
// TIENDA PERSONALIZADA
// ============================================================================

export async function updateStore(data: z.infer<typeof storeSchema>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validatedData = storeSchema.parse(data)

    // Verificar si existe la tienda
    const { data: existingStore } = await supabase
      .from('user_stores')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let result
    if (existingStore) {
      // Actualizar
      const { error } = await supabase
        .from('user_stores')
        .update(validatedData)
        .eq('user_id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }
      result = { success: true }
    } else {
      // Crear
      const { data: newStore, error } = await supabase
        .from('user_stores')
        .insert({
          user_id: user.id,
          ...validatedData,
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }
      result = { success: true, data: newStore }
    }

    revalidatePath('/dashboard/settings')
    revalidatePath(`/store/${user.id}`)
    return result
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al actualizar tienda' }
  }
}

// ============================================================================
// CAMBIAR CONTRASEÑA
// ============================================================================

export async function changePassword(data: z.infer<typeof changePasswordSchema>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    const validatedData = changePasswordSchema.parse(data)

    // Verificar contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: validatedData.currentPassword,
    })

    if (signInError) {
      return { success: false, error: 'La contraseña actual es incorrecta' }
    }

    // Actualizar contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.newPassword,
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al cambiar contraseña' }
  }
}

// ============================================================================
// OBTENER DATOS PARA LA PÁGINA DE CONFIGURACIÓN
// ============================================================================

export async function getSettingsData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Obtener perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Obtener métodos de pago
  const { data: paymentMethods } = await supabase
    .from('user_payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  // Obtener redes sociales
  const { data: socialLinks } = await supabase
    .from('user_social_links')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Obtener tienda
  const { data: store } = await supabase
    .from('user_stores')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return {
    user,
    profile,
    paymentMethods: paymentMethods || [],
    socialLinks: socialLinks || [],
    store,
  }
}

