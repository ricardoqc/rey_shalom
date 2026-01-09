'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema de validación para productos
const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  points_per_unit: z.number().int().min(0, 'Los puntos deben ser mayor o igual a 0'),
  category: z.string().optional(),
  brand: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  sku: z.string().min(1, 'El SKU es requerido'),
})

export async function createProduct(data: z.infer<typeof productSchema>) {
  const supabase = await createClient()

  // Verificar que el usuario es admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    // Validar datos
    const validatedData = productSchema.parse(data)

    // Verificar que el SKU no existe
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('sku', validatedData.sku)
      .single()

    if (existingProduct) {
      return { success: false, error: 'El SKU ya existe' }
    }

    // Crear producto
    const { data: product, error } = await supabase
      .from('products')
      // @ts-ignore - TypeScript inference issue with products table
      .insert({
        sku: validatedData.sku,
        name: validatedData.name,
        description: validatedData.description || null,
        base_price: validatedData.base_price,
        points_per_unit: validatedData.points_per_unit,
        category: validatedData.category || null,
        brand: validatedData.brand || null,
        image_url: validatedData.image_url && validatedData.image_url !== '' ? validatedData.image_url : null,
        is_active: true,
        is_pack: false,
        is_featured: false,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true, product }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Error de validación' }
    }
    return { success: false, error: error.message || 'Error al crear producto' }
  }
}

export async function updateProduct(
  id: string,
  data: Partial<z.infer<typeof productSchema>>
) {
  const supabase = await createClient()

  // Verificar admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    const validatedData = productSchema.partial().parse(data)

    const { error } = await supabase
      .from('products')
      // @ts-ignore - TypeScript inference issue with products table
      .update(validatedData)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Error de validación' }
    }
    return { success: false, error: error.message || 'Error al actualizar producto' }
  }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  // Verificar admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar producto' }
  }
}

// Server Action para agregar stock
export async function addStock(
  productId: string,
  warehouseId: string,
  quantity: number
) {
  const supabase = await createClient()

  // Verificar admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    if (quantity <= 0) {
      return { success: false, error: 'La cantidad debe ser mayor a 0' }
    }

    // Verificar si existe el registro de inventario
    // @ts-ignore - TypeScript inference issue with inventory_items table
    const { data: existingInventory } = await supabase
      .from('inventory_items')
      .select('quantity')
      .eq('product_id', productId)
      .eq('warehouse_id', warehouseId)
      .single()

    if (existingInventory) {
      // Actualizar stock existente (sumar)
      const { error } = await supabase
        .from('inventory_items')
        // @ts-ignore - TypeScript inference issue with inventory_items table
        .update({
          quantity: (existingInventory as any).quantity + quantity,
        })
        .eq('product_id', productId)
        .eq('warehouse_id', warehouseId)

      if (error) throw error
    } else {
      // Crear nuevo registro de inventario
      // @ts-ignore - TypeScript inference issue with inventory_items table
      const { error } = await supabase.from('inventory_items').insert({
        product_id: productId,
        warehouse_id: warehouseId,
        quantity: quantity,
        reserved_quantity: 0,
      })

      if (error) throw error
    }

    revalidatePath('/admin/inventory')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al agregar stock' }
  }
}

// Schema de validación para crear usuarios
const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  public_name: z.string().min(1, 'El nombre es requerido'),
  referral_code: z.string().optional(),
  role: z.enum(['admin', 'user']).default('user'),
  status_level: z.enum(['BRONCE', 'PLATA', 'ORO']).default('BRONCE'),
  sponsor_code: z.string().optional(),
})

export async function createUser(data: z.infer<typeof createUserSchema>) {
  // Verificar que el usuario actual es admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado. Solo los administradores pueden crear usuarios.' }
  }

  // Obtener service role key para crear usuarios
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return {
      success: false,
      error: 'Service Role Key no configurada. Configura SUPABASE_SERVICE_ROLE_KEY en .env.local',
    }
  }

  // Crear cliente con Service Role (tiene permisos completos)
  const supabaseAdmin = createServiceClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  try {
    // Validar datos
    const validatedData = createUserSchema.parse(data)

    // Verificar si el email ya existe
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(
      (u) => u.email === validatedData.email
    )

    if (existingUser) {
      return { success: false, error: 'El email ya está registrado' }
    }

    // Buscar sponsor si hay código de referido
    let sponsorId = null
    if (validatedData.sponsor_code) {
      const { data: sponsor, error: sponsorError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('referral_code', validatedData.sponsor_code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (sponsorError || !sponsor) {
        return {
          success: false,
          error: `Código de referido "${validatedData.sponsor_code}" no encontrado`,
        }
      }

      sponsorId = (sponsor as { id: string }).id
    }

    // Generar código de referido único si no se proporciona
    let referralCode = validatedData.referral_code?.toUpperCase()
    if (!referralCode) {
      const namePrefix = validatedData.public_name
        .substring(0, 6)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
      referralCode = `${namePrefix}-${randomSuffix}`
    }

    // Verificar que el código de referido sea único
    const { data: existingCode } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single()

    if (existingCode) {
      // Si el código existe, generar uno nuevo
      referralCode = `${validatedData.public_name.substring(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}`
    }

    // Crear usuario en Supabase Auth
    const { data: newUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: validatedData.email,
        password: validatedData.password,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: {
          role: validatedData.role,
          public_name: validatedData.public_name,
        },
        app_metadata: {
          role: validatedData.role,
        },
      })

    if (authError) {
      return { success: false, error: `Error al crear usuario: ${authError.message}` }
    }

    if (!newUser.user) {
      return { success: false, error: 'No se pudo crear el usuario' }
    }

    const userId = newUser.user.id

    // Esperar un momento para que el trigger se ejecute (si existe)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar si el perfil fue creado por el trigger
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      // Crear perfil manualmente si el trigger no lo hizo
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        // @ts-ignore - TypeScript inference issue with profiles table
        .insert({
          id: userId,
          public_name: validatedData.public_name,
          referral_code: referralCode,
          sponsor_id: sponsorId,
          status_level: validatedData.status_level,
          current_points: 0,
          total_points_earned: 0,
          is_active: true,
        })

      if (profileError) {
        // Si falla crear el perfil, intentar eliminar el usuario de auth
        await supabaseAdmin.auth.admin.deleteUser(userId)
        return {
          success: false,
          error: `Error al crear perfil: ${profileError.message}`,
        }
      }
    } else {
      // Actualizar perfil existente con los datos proporcionados
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        // @ts-ignore - TypeScript inference issue with profiles table
        .update({
          public_name: validatedData.public_name,
          referral_code: referralCode,
          sponsor_id: sponsorId || (existingProfile as { sponsor_id: string | null }).sponsor_id,
          status_level: validatedData.status_level,
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error actualizando perfil:', updateError)
      }
    }

    revalidatePath('/admin/users')
    revalidatePath('/admin/create-users')

    return {
      success: true,
      user: {
        id: userId,
        email: validatedData.email,
        public_name: validatedData.public_name,
        referral_code: referralCode,
      },
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Error de validación' }
    }
    return { success: false, error: error.message || 'Error al crear usuario' }
  }
}
