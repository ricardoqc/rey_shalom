'use server'

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export async function createDefaultAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return {
      success: false,
      error: 'Service Role Key no configurada en .env.local',
    }
  }

  // Crear cliente con Service Role (tiene permisos completos)
  const supabase = createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@reyshalom.com'
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123456'

  try {
    // Verificar si el usuario ya existe
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(
      (u) => u.email === adminEmail
    )

    let userId: string

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Crear usuario en Supabase Auth
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true, // Confirmar email automáticamente
          user_metadata: {
            role: 'admin',
            public_name: 'Super Admin',
          },
        })

      if (createError) throw createError
      if (!newUser.user) throw new Error('No se pudo crear el usuario')

      userId = newUser.user.id
    }

    // Verificar si el perfil existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      // Crear perfil
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        public_name: 'Super Admin',
        referral_code: 'ADMIN-001',
        status_level: 'ORO',
        current_points: 9999,
        total_points_earned: 9999,
        is_active: true,
      })

      if (profileError) throw profileError
    } else {
      // Actualizar perfil existente
      await supabase
        .from('profiles')
        .update({
          status_level: 'ORO',
          current_points: 9999,
        })
        .eq('id', userId)
    }

    return {
      success: true,
      email: adminEmail,
      password: adminPassword,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}