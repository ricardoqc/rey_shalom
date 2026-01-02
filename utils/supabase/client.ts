import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '❌ Variables de entorno de Supabase no configuradas.\n' +
        'Crea un archivo .env.local en app/ con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
        'Ver SETUP_ENV.md para más detalles.'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options = {}) => {
        // Crear un AbortController para timeout si está disponible
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
    auth: {
      // Configuración de autenticación
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  })
}

