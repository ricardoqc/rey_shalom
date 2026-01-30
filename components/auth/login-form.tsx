'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  returnUrl?: string
}

export function LoginForm({ returnUrl }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirigir después del login
      router.push(returnUrl || '/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-black uppercase tracking-widest text-[#666666] mb-2 ml-4"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-full bg-gray-50 border border-gray-100 px-6 py-4 text-[#1A1A1A] placeholder-gray-400 shadow-sm focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] outline-none transition-all"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-black uppercase tracking-widest text-[#666666] mb-2 ml-4"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-full bg-gray-50 border border-gray-100 px-6 py-4 text-[#1A1A1A] placeholder-gray-400 shadow-sm focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-lg text-lg font-black text-white bg-[#4CAF50] hover:bg-[#3d8b40] hover:-translate-y-0.5 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </div>

      <div className="text-center text-sm">
        <span className="text-[#666666] font-medium">¿No tienes cuenta? </span>
        <Link
          href="/auth/signup"
          className="font-black text-[#4CAF50] hover:text-[#3d8b40] transition-colors"
        >
          Regístrate aquí
        </Link>
      </div>
    </form>
  )
}
