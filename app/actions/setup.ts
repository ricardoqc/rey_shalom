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

  // Validar que la contraseña tenga al menos 6 caracteres
  if (adminPassword.length < 6) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 6 caracteres',
    }
  }

  try {
    // Verificar si el usuario ya existe
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listando usuarios:', listError)
      return {
        success: false,
        error: `Error al verificar usuarios existentes: ${listError.message}`,
      }
    }

    const existingUser = existingUsers?.users?.find(
      (u) => u.email === adminEmail
    )

    let userId: string | undefined

    if (existingUser) {
      userId = existingUser.id
      console.log('Usuario admin ya existe:', userId)
    } else {
      // Intentar crear usuario con admin.createUser
      // Si falla por el trigger, intentaremos una solución alternativa
      let userCreated = false
      let createError: any = null

      // Método 1: Intentar crear con admin.createUser (método preferido)
      const { data: newUser, error: adminCreateError } =
        await supabase.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            role: 'admin',
            public_name: 'Super Admin',
          },
          app_metadata: {
            role: 'admin',
          },
        })

      if (adminCreateError) {
        console.error('Error con admin.createUser:', adminCreateError)
        createError = adminCreateError
        
        // Si el error es 500 y parece ser del trigger, intentar método alternativo
        if (adminCreateError.status === 500) {
          console.log('Error 500 detectado, intentando método alternativo...')
          
          // Método 2: Crear usuario sin confirmar email primero (puede evitar el trigger)
          const { data: newUserAlt, error: altError } =
            await supabase.auth.admin.createUser({
              email: adminEmail,
              password: adminPassword,
              email_confirm: false, // No confirmar inmediatamente
              user_metadata: {
                role: 'admin',
                public_name: 'Super Admin',
              },
              app_metadata: {
                role: 'admin',
              },
            })

          if (!altError && newUserAlt?.user) {
            userId = newUserAlt.user.id
            userCreated = true
            console.log('Usuario creado con método alternativo (sin email_confirm):', userId)
            
            // Confirmar el email manualmente
            const { error: confirmError } = await supabase.auth.admin.updateUserById(
              userId,
              { email_confirm: true }
            )
            
            if (confirmError) {
              console.warn('No se pudo confirmar el email automáticamente:', confirmError)
            }
          } else if (altError) {
            console.error('Método alternativo también falló:', altError)
            // Continuar con el error original
          }
        }
      } else if (newUser?.user) {
        userId = newUser.user.id
        userCreated = true
        console.log('Usuario admin creado exitosamente:', userId)
      }

      // Si ambos métodos fallaron, retornar error detallado
      if (!userCreated) {
        const errorMessage = createError?.message || 'Error desconocido al crear usuario'
        const errorStatus = createError?.status || 'N/A'
        
        let detailedError = `No se pudo crear el usuario admin.\n\n`
        detailedError += `Error: ${errorMessage}\n`
        detailedError += `Status: ${errorStatus}\n\n`
        
        if (errorStatus === 500) {
          detailedError += `🔧 SOLUCIÓN REQUERIDA:\n\n`
          detailedError += `El trigger handle_new_user() en Supabase está fallando.\n\n`
          detailedError += `Pasos para solucionarlo:\n`
          detailedError += `1. Ve al Dashboard de Supabase → Database → Functions\n`
          detailedError += `2. Busca el trigger o función handle_new_user()\n`
          detailedError += `3. Revisa los logs de errores en Supabase\n`
          detailedError += `4. Verifica que el trigger pueda insertar en la tabla profiles\n`
          detailedError += `5. Asegúrate de que:\n`
          detailedError += `   - La tabla profiles tenga permisos correctos\n`
          detailedError += `   - El referral_code sea único (ADMIN-001 no debe existir)\n`
          detailedError += `   - Las políticas RLS permitan la inserción\n\n`
          detailedError += `Alternativa temporal:\n`
          detailedError += `Puedes crear el usuario manualmente desde el dashboard de Supabase\n`
          detailedError += `y luego ejecutar esta función nuevamente para crear el perfil.`
        }
        
        return {
          success: false,
          error: detailedError,
        }
      }
    }

    // Verificar que userId esté definido
    if (!userId) {
      return {
        success: false,
        error: 'Error: No se pudo obtener el ID del usuario',
      }
    }

    // Esperar un momento para que el trigger se ejecute (si existe)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar si el perfil existe
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      // PGRST116 es "no rows returned", que es esperado si el perfil no existe
      console.error('Error verificando perfil:', profileCheckError)
    }

    if (!existingProfile) {
      // Crear perfil manualmente
      // @ts-ignore - TypeScript inference issue with Supabase client types
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        public_name: 'Super Admin',
        referral_code: 'ADMIN-001',
        status_level: 'ORO',
        current_points: 9999,
        total_points_earned: 9999,
        is_active: true,
      })

      if (profileError) {
        console.error('Error creando perfil:', profileError)
        return {
          success: false,
          error: `Error creando perfil: ${profileError.message}. Usuario creado pero perfil no.`,
        }
      }
      console.log('Perfil admin creado exitosamente')
    } else {
      // Actualizar perfil existente
      const { error: updateError } = await supabase
        .from('profiles')
        // @ts-ignore - TypeScript inference issue with Supabase client types
        .update({
          status_level: 'ORO',
          current_points: 9999,
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error actualizando perfil:', updateError)
      } else {
        console.log('Perfil admin actualizado exitosamente')
      }
    }

    return {
      success: true,
      email: adminEmail,
      password: adminPassword,
    }
  } catch (error: any) {
    console.error('Error inesperado en createDefaultAdmin:', error)
    return {
      success: false,
      error: error?.message || 'Error inesperado al crear el administrador',
    }
  }
}