'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface SignupFormProps {
  sponsorRef: string | null
}

export function SignupForm({ sponsorRef }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [publicName, setPublicName] = useState('')
  const [referralCode, setReferralCode] = useState(sponsorRef || '')
  const [referralCodeLocked, setReferralCodeLocked] = useState(!!sponsorRef)
  const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [validatingCode, setValidatingCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Validar código de referido cuando cambia
  useEffect(() => {
    const validateReferralCode = async () => {
      if (!referralCode || referralCode.length < 3) {
        setReferralCodeValid(null)
        return
      }

      setValidatingCode(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('referral_code', referralCode.toUpperCase())
          .eq('is_active', true)
          .single()

        if (error || !data) {
          setReferralCodeValid(false)
        } else {
          setReferralCodeValid(true)
        }
      } catch (err) {
        setReferralCodeValid(false)
      } finally {
        setValidatingCode(false)
      }
    }

    // Debounce de validación
    const timeoutId = setTimeout(validateReferralCode, 500)
    return () => clearTimeout(timeoutId)
  }, [referralCode, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    // Si hay código de referido, validar que existe
    if (referralCode && !referralCodeValid) {
      setError('El código de patrocinador no es válido')
      setLoading(false)
      return
    }

    try {
      // Registrar usuario con metadata del referral_code
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            public_name: publicName || email.split('@')[0],
            referral_code: referralCode ? referralCode.toUpperCase() : null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // El trigger handle_new_user() creará automáticamente el perfil
        // Redirigir a página de confirmación
        router.push('/auth/signup/success')
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="publicName"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre Público (Opcional)
          </label>
          <input
            id="publicName"
            name="publicName"
            type="text"
            value={publicName}
            onChange={(e) => setPublicName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Tu nombre público"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="referralCode"
            className="block text-sm font-medium text-gray-700"
          >
            Código de Patrocinador {referralCodeLocked && '(Pre-llenado)'}
          </label>
          <div className="mt-1 relative">
            <input
              id="referralCode"
              name="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              disabled={referralCodeLocked}
              className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 ${
                referralCodeLocked
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'border-gray-300 focus:border-blue-500'
              } ${
                referralCodeValid === true
                  ? 'border-green-500'
                  : referralCodeValid === false
                  ? 'border-red-500'
                  : ''
              }`}
              placeholder="ABC123"
            />
            {referralCode && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validatingCode ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : referralCodeValid === true ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : referralCodeValid === false ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
          {referralCodeLocked && (
            <p className="mt-1 text-xs text-gray-500">
              Este código fue detectado automáticamente desde tu enlace de
              referido
            </p>
          )}
          {referralCode && referralCodeValid === false && !validatingCode && (
            <p className="mt-1 text-xs text-red-600">
              Código de patrocinador no válido
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Repite tu contraseña"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading || (referralCode ? referralCodeValid === false : false)}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">¿Ya tienes cuenta? </span>
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Inicia sesión aquí
        </Link>
      </div>
    </form>
  )
}

