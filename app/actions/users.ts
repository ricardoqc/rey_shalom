'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema de validación para actualizar perfil de usuario
const updateProfileSchema = z.object({
  public_name: z.string().optional(),
  dni: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status_level: z.enum(['BRONCE', 'PLATA', 'ORO']).optional(),
  is_active: z.boolean().optional(),
})

export async function updateUserProfile(
  userId: string,
  data: z.infer<typeof updateProfileSchema>
) {
  const supabase = await createClient()

  // Verificar que el usuario es admin
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado. Solo administradores pueden actualizar perfiles.' }
  }

  // No permitir que un admin se desactive a sí mismo
  if (userId === currentUser.id && data.is_active === false) {
    return { success: false, error: 'No puedes desactivar tu propia cuenta' }
  }

  try {
    // Validar datos
    const validatedData = updateProfileSchema.parse(data)

    // Actualizar perfil
    const { error } = await supabase
      .from('profiles')
      // @ts-ignore - TypeScript inference issue with Supabase client types
      .update(validatedData)
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin/users')

    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues && error.issues.length > 0 
        ? error.issues[0].message 
        : 'Error de validación'
      return { success: false, error: firstError }
    }
    return { success: false, error: error.message || 'Error al actualizar perfil' }
  }
}

export async function getUserRole(userId: string): Promise<'admin' | 'user'> {
  const supabase = await createClient()

  // Obtener el usuario desde auth.users usando Admin API
  // Nota: Esto requiere permisos especiales, por ahora usamos metadata del perfil
  // o podemos hacer una consulta directa si tenemos acceso
  
  // Por ahora, verificamos si existe en la tabla de usuarios con rol admin
  // Esto es una aproximación - idealmente deberías tener una tabla de roles o verificar auth.users
  
  // Por defecto retornamos 'user' y el frontend puede verificar el rol desde user_metadata
  return 'user'
}

/**
 * Obtener lista de afiliados directos de un usuario
 * Ahora permite que cualquier usuario vea sus propios afiliados
 */
export async function getUserAffiliates(userId: string) {
  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'No autenticado', data: null }
  }

  const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role
  const isAdmin = userRole === 'admin'
  
  // Solo permitir ver afiliados propios o si es admin puede ver cualquier usuario
  if (!isAdmin && currentUser.id !== userId) {
    return { success: false, error: 'No autorizado. Solo puedes ver tus propios afiliados.', data: null }
  }

  try {
    // Obtener afiliados directos (donde sponsor_id = userId)
    const { data: affiliates, error } = await supabase
      .from('profiles')
      .select('id, public_name, referral_code, status_level, current_points, created_at, is_active')
      .eq('sponsor_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: affiliates || [], error: null }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al obtener afiliados', data: null }
  }
}

/**
 * Agregar un afiliado a un usuario (cambiar sponsor_id)
 * Solo el super admin puede hacer esto
 */
export async function addAffiliate(userId: string, sponsorId: string) {
  const supabase = await createClient()

  // Verificar que el usuario es admin
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado. Solo administradores pueden gestionar afiliados.' }
  }

  try {
    // Validar que ambos usuarios existen
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('id, sponsor_id')
      .eq('id', userId)
      .single()

    if (userError || !userProfile) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    const { data: sponsorProfile, error: sponsorError } = await supabase
      .from('profiles')
      .select('id, is_active')
      .eq('id', sponsorId)
      .single()

    if (sponsorError || !sponsorProfile) {
      return { success: false, error: 'Sponsor no encontrado' }
    }

    if (!(sponsorProfile as any).is_active) {
      return { success: false, error: 'El sponsor no está activo' }
    }

    // Validar que no se cree un ciclo (el sponsor no puede ser el mismo usuario o un descendiente)
    if (userId === sponsorId) {
      return { success: false, error: 'Un usuario no puede ser su propio sponsor' }
    }

    // Verificar que el sponsor no sea un descendiente del usuario
    // Subimos por la cadena de sponsors del sponsorId para ver si encontramos userId
    let currentSponsorId: string | null = sponsorId
    let depth = 0
    const maxDepth = 20 // Prevenir bucles infinitos

    while (currentSponsorId && depth < maxDepth) {
      // Si encontramos el userId en la cadena, entonces es un ciclo
      if (currentSponsorId === userId) {
        return { success: false, error: 'No se puede asignar un descendiente como sponsor (crearía un ciclo)' }
      }

      // Obtener el sponsor del sponsor actual
      const { data: sponsorProfile }: { data: any } = await supabase
        .from('profiles')
        .select('sponsor_id')
        .eq('id', currentSponsorId)
        .eq('is_active', true)
        .single()

      currentSponsorId = (sponsorProfile as any)?.sponsor_id || null
      depth++
    }

    // Actualizar el sponsor_id
    const { error: updateError } = await supabase
      .from('profiles')
      // @ts-ignore - TypeScript inference issue with Supabase client types
      .update({ sponsor_id: sponsorId, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) throw updateError

    // Actualizar la genealogía MLM usando la función SQL
    // @ts-ignore - TypeScript inference issue with Supabase RPC functions
    const { error: genealogyError } = await supabase.rpc('update_mlm_genealogy', {
      p_user_id: userId,
      p_sponsor_id: sponsorId,
    })

    if (genealogyError) {
      console.error('Error al actualizar genealogía:', genealogyError)
      // No fallar si la genealogía falla, pero registrar el error
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al agregar afiliado' }
  }
}

/**
 * Eliminar un afiliado (poner sponsor_id a NULL)
 * Solo el super admin puede hacer esto
 */
export async function removeAffiliate(userId: string) {
  const supabase = await createClient()

  // Verificar que el usuario es admin
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado. Solo administradores pueden gestionar afiliados.' }
  }

  try {
    // Verificar que el usuario existe
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('id, sponsor_id')
      .eq('id', userId)
      .single()

    if (userError || !userProfile) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    if (!(userProfile as any).sponsor_id) {
      return { success: false, error: 'El usuario no tiene sponsor asignado' }
    }

    // Eliminar el sponsor_id
    const { error: updateError } = await supabase
      .from('profiles')
      // @ts-ignore - TypeScript inference issue with Supabase client types
      .update({ sponsor_id: null, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) throw updateError

    // Eliminar registros de genealogía para este usuario
    const { error: genealogyError } = await supabase
      .from('mlm_genealogy')
      .delete()
      .eq('user_id', userId)

    if (genealogyError) {
      console.error('Error al eliminar genealogía:', genealogyError)
      // No fallar si la genealogía falla, pero registrar el error
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar afiliado' }
  }
}

/**
 * Buscar usuarios por nombre o código de referido (para el selector de sponsor)
 */
export async function searchUsersForSponsor(searchQuery: string, excludeUserId?: string) {
  const supabase = await createClient()

  // Verificar que el usuario es admin
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: 'No autenticado', data: [] }
  }

  const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado', data: [] }
  }

  try {
    let query = supabase
      .from('profiles')
      .select('id, public_name, referral_code, status_level, is_active')
      .eq('is_active', true)
      .limit(20)

    if (excludeUserId) {
      query = query.neq('id', excludeUserId)
    }

    if (searchQuery) {
      query = query.or(
        `public_name.ilike.%${searchQuery}%,referral_code.ilike.%${searchQuery}%`
      )
    }

    const { data: users, error } = await query.order('public_name', { ascending: true })

    if (error) throw error

    return { success: true, data: users || [], error: null }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al buscar usuarios', data: [] }
  }
}

