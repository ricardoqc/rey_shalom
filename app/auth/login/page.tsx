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
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 pt-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="size-8 text-[#4CAF50]">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-[#4CAF50]">
              Rey Shalom
            </h2>
          </div>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-[#666666]">
            Accede a tu oficina virtual
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <LoginForm returnUrl={params.returnUrl} />
        </div>

        {params.message && (
          <div className="rounded-md bg-[#4CAF50]/10 border border-[#4CAF50]/20 p-4">
            <p className="text-sm text-[#4CAF50]">{params.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
