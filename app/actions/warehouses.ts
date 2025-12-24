'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema de validación para warehouses
const warehouseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_central: z.boolean().optional(),
})

export async function createWarehouse(data: z.infer<typeof warehouseSchema>) {
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
    const validatedData = warehouseSchema.parse(data)

    // Verificar que el código no existe
    const { data: existingWarehouse } = await supabase
      .from('warehouses')
      .select('id')
      .eq('code', validatedData.code)
      .single()

    if (existingWarehouse) {
      return { success: false, error: 'El código de sucursal ya existe' }
    }

    // Crear warehouse
    const { data: warehouse, error } = await supabase
      .from('warehouses')
      .insert({
        ...validatedData,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/warehouses')

    return { success: true, warehouse }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error.message || 'Error al crear sucursal' }
  }
}

export async function updateWarehouse(
  id: string,
  data: Partial<z.infer<typeof warehouseSchema>>
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
    const validatedData = warehouseSchema.partial().parse(data)

    // Si se actualiza el código, verificar que no exista en otro warehouse
    if (validatedData.code) {
      const { data: existingWarehouse } = await supabase
        .from('warehouses')
        .select('id')
        .eq('code', validatedData.code)
        .neq('id', id)
        .single()

      if (existingWarehouse) {
        return { success: false, error: 'El código de sucursal ya existe' }
      }
    }

    const { error } = await supabase
      .from('warehouses')
      .update(validatedData)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/warehouses')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar sucursal' }
  }
}

export async function deleteWarehouse(id: string) {
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
    // Soft delete: cambiar is_active a false
    const { error } = await supabase
      .from('warehouses')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/warehouses')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar sucursal' }
  }
}

