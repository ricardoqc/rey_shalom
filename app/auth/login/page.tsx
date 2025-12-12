import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LoginForm } from '@/components/auth/login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string; message?: string }>
}) {
  // En Next.js 16, searchParams es una Promise y debe ser await
  const params = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si ya está autenticado, redirigir
  if (user) {
    redirect(params.returnUrl || '/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu oficina virtual
          </p>
        </div>

        <LoginForm returnUrl={params.returnUrl} />

        {params.message && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{params.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

