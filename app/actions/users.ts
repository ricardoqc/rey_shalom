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
      .update(validatedData)
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin/users')

    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
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

