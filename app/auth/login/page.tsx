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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="size-20 bg-white rounded-3xl shadow-xl shadow-primary/10 flex items-center justify-center p-4 border border-gray-50 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img
                alt="Logo"
                className="h-full w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXQ-Ub8KSIvLy27nHLJZtQ1yr4qDoJ7uWIZW9XYPVS7-24K8Lvp-CaJFuVoFdrhtm0yzG0cEqUnSHXq2zNQmtADNQJlz1woQyaVGrv74tD94GdCTGoYsMC4rS3HCXkMiKZPA_cneii2TdCWE8mni7BNuzl4c8mrDOnzPDmM1EWZ-FFrufnRA5WLv514jVeLpPVm-l-R-Brcu9vc2OB9rUElkjNa8rT7SQRYGvuzRgExl3kcztXv0lpyfRvdUhJ_lWDm13XanGF51s"
              />
            </div>
            <div>
              <span className="block text-2xl font-black leading-none tracking-tighter text-primary italic uppercase">Rey Shalom</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.4em] uppercase mt-1">Oficina Virtual</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter mb-2">
            ¡Bienvenido de nuevo!
          </h1>
          <p className="text-text-muted font-medium">
            Ingresa tus credenciales para acceder al panel administrativo
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-2xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-gold to-primary"></div>
          <LoginForm returnUrl={params.returnUrl} />
        </div>

        {params.message && (
          <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-center gap-3">
            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm text-primary font-bold">{params.message}</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted font-medium">
            ¿No tienes una cuenta? <span className="text-primary font-black hover:underline cursor-pointer">Contacta a tu administrador</span>
          </p>
        </div>
      </div>
    </div>
  )
}
