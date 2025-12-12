import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            ¡Cuenta Creada!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hemos enviado un correo de confirmación a tu email.
            Por favor, verifica tu cuenta antes de iniciar sesión.
          </p>
        </div>
        <div>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

