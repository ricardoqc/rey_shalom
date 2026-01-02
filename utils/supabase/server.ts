import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '❌ Variables de entorno de Supabase no configuradas.\n' +
        'Crea un archivo .env.local en app/ con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
        'Ver SETUP_ENV.md para más detalles.'
    )
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      global: {
        fetch: (url, options = {}) => {
          // Crear un AbortController para timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos

          return fetch(url, {
            ...options,
            signal: options.signal || controller.signal,
          })
            .finally(() => clearTimeout(timeoutId))
            .catch((error) => {
              // Silenciar errores de red esperados - se manejarán en el componente
              if (error.name === 'AbortError' || error.name === 'TypeError') {
                // Solo loguear en desarrollo, no en producción
                if (process.env.NODE_ENV === 'development') {
                  console.debug('Error de red en Supabase (se ignorará):', error.message)
                }
              }
              throw error
            })
        },
      },
    }
  )
}

