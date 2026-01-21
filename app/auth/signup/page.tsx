import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SignupForm } from '@/components/auth/signup-form'
import { cookies } from 'next/headers'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  // En Next.js 16, searchParams es una Promise y debe ser await
  const params = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si ya está autenticado, redirigir
  if (user) {
    redirect('/dashboard')
  }

  // Obtener código de sponsor de la cookie
  const cookieStore = await cookies()
  const sponsorRef = cookieStore.get('sponsor_ref')?.value || null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="size-8 text-[#ea2a33]">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">
              Rey Shalom
            </h2>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Únete a nuestra comunidad
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
          <SignupForm sponsorRef={sponsorRef} />
        </div>

        {params.message && (
          <div className="rounded-md bg-[#ea2a33]/20 border border-[#ea2a33]/30 p-4">
            <p className="text-sm text-[#ea2a33]">{params.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
