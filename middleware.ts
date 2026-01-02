import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  // Validar que las variables de entorno estén definidas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '❌ ERROR: Variables de entorno de Supabase no configuradas.\n' +
        'Por favor, crea un archivo .env.local en la carpeta app/ con:\n' +
        'NEXT_PUBLIC_SUPABASE_URL=tu-url\n' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key\n' +
        'Ver SETUP_ENV.md para más detalles.'
    )
    // Retornar respuesta sin procesar Supabase
    return NextResponse.next()
  }

  // 1. Crear cliente de Supabase para el middleware
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Actualizar sesión (con manejo de errores)
  let user = null
  try {
    const {
      data: { user: fetchedUser },
      error,
    } = await supabase.auth.getUser()
    
    if (!error && fetchedUser) {
      user = fetchedUser
    }
  } catch (error) {
    // Ignorar errores de fetch en el middleware - la sesión se refrescará en el cliente
    // Esto previene que errores de red bloqueen el acceso a la aplicación
    console.debug('Error al obtener usuario en middleware (se ignorará):', error)
  }

  const { pathname } = request.nextUrl
  let response = supabaseResponse

  // 2. RASTREO DE REFERIDOS (MLM) - Funciona en CUALQUIER página
  const refCode = request.nextUrl.searchParams.get('ref')
  if (refCode) {
    try {
      // Validar que el código de referido existe en la base de datos
      const { data: sponsorProfile } = await supabase
        .from('profiles')
        .select('id, referral_code')
        .eq('referral_code', refCode)
        .eq('is_active', true)
        .single()

      if (sponsorProfile) {
        // Guardar en cookie con 30 días de expiración
        response.cookies.set('sponsor_ref', refCode, {
          maxAge: 60 * 60 * 24 * 30, // 30 días
          httpOnly: false, // Necesario para leerlo desde el cliente
          sameSite: 'lax',
          path: '/',
        })
      }
    } catch (error) {
      // Ignorar errores de base de datos en el middleware
      console.debug('Error al validar código de referido (se ignorará):', error)
    }
  }

  // 3. PROTECCIÓN DE RUTAS

  // Rutas de autenticación - Solo para usuarios NO autenticados
  if (pathname.startsWith('/auth')) {
    if (user) {
      // Usuario autenticado intentando acceder a /auth, redirigir al dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Rutas protegidas - Solo para usuarios autenticados
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      // Usuario no autenticado, redirigir a login con returnUrl
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // Rutas de admin - Solo para usuarios con rol admin
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verificar rol de admin desde metadata o perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      // Obtener el rol desde user_metadata (configurado en Supabase Auth)
      const userRole = user.user_metadata?.role || user.app_metadata?.role

      if (userRole !== 'admin') {
        // No es admin, redirigir al dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Si hay error al verificar, redirigir al dashboard por seguridad
      console.debug('Error al verificar rol de admin (se ignorará):', error)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

