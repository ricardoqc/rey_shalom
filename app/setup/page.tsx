'use client'

import { useState } from 'react'
import { createDefaultAdmin } from '@/app/actions/setup'
import { Loader2, Shield, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateAdmin = async () => {
    setLoading(true)
    setCreating('admin')

    try {
      const result = await createDefaultAdmin()

      if (result.success) {
        toast.success('✅ Super Admin creado exitosamente!')
        toast.info(
          `Email: ${result.email}\nContraseña: ${result.password}\n\nGuarda estas credenciales.`
        )
      } else {
        toast.error(`Error: ${result.error}`)
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
      setCreating(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Configuración Inicial
          </h1>
          <p className="text-lg text-gray-600">
            Crea el Super Admin por defecto
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-10 w-10 text-blue-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Super Admin
              </h2>
              <p className="text-sm text-gray-600">
                Crea el administrador por defecto
              </p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Credenciales por defecto:</strong>
            </p>
            <p className="text-sm text-blue-700">
              Email: <code>admin@reyshalom.com</code>
            </p>
            <p className="text-sm text-blue-700">
              Contraseña: <code>admin123456</code>
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Puedes cambiar estos valores en <code>.env.local</code>
            </p>
          </div>

          <button
            onClick={handleCreateAdmin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {creating === 'admin' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Crear Super Admin
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Asegúrate de tener configurado{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> en tu <code>.env.local</code>
          </p>
        </div>
      </div>
    </div>
  )
}