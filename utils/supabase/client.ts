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

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

