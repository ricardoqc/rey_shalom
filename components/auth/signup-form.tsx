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
      // Preparar metadata - solo incluir referral_code si existe y es válido
      const userMetadata: Record<string, any> = {
        public_name: publicName || email.split('@')[0],
      }

      // Solo agregar referral_code si existe y es válido
      if (referralCode && referralCodeValid) {
        userMetadata.referral_code = referralCode.toUpperCase().trim()
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label
            htmlFor="publicName"
            className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-4"
          >
            Nombre Público <span className="text-gray-300 font-medium">(Opcional)</span>
          </label>
          <input
            id="publicName"
            name="publicName"
            type="text"
            value={publicName}
            onChange={(e) => setPublicName(e.target.value)}
            className="block w-full rounded-full bg-gray-50 border border-gray-100 px-6 py-4 text-text-dark placeholder-gray-400 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Tu nombre de aliado"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="email"
            className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-4"
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
            className="block w-full rounded-full bg-gray-50 border border-gray-100 px-6 py-4 text-text-dark placeholder-gray-400 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="pro@ejemplo.com"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="referralCode"
            className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-4"
          >
            Código de Patrocinador {referralCodeLocked && <span className="text-primary font-black ml-2">✓detectado</span>}
          </label>
          <div className="relative group">
            <input
              id="referralCode"
              name="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              disabled={referralCodeLocked}
              className={`block w-full rounded-full px-6 py-4 text-text-dark font-black tracking-widest placeholder-gray-400 shadow-sm outline-none transition-all border ${referralCodeLocked
                  ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-80'
                  : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                } ${referralCodeValid === true
                  ? 'border-primary bg-primary/5'
                  : referralCodeValid === false
                    ? 'border-red-500 bg-red-50'
                    : ''
                }`}
              placeholder="ABC123"
            />
            {referralCode && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                {validatingCode ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : referralCodeValid === true ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : referralCodeValid === false ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
          {referralCode && referralCodeValid === false && !validatingCode && (
            <p className="mt-2 ml-4 text-[10px] font-black uppercase tracking-widest text-red-500">
              ¡Código no encontrado en el sistema!
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-4"
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
            className="block w-full rounded-full bg-gray-50 border border-gray-100 px-6 py-4 text-text-dark placeholder-gray-400 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-4"
          >
            Confirmar
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full rounded-full bg-gray-50 border border-gray-100 px-6 py-4 text-text-dark placeholder-gray-400 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm text-red-600 font-bold">{error}</p>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || (referralCode ? referralCodeValid === false : false)}
          className="group w-full flex justify-center items-center py-5 px-6 border border-transparent rounded-full shadow-lg text-lg font-black text-white bg-primary hover:bg-[#3d8b40] hover:-translate-y-0.5 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-3" />
              Creando tu cuenta...
            </>
          ) : (
            'Comenzar Ahora'
          )}
        </button>
      </div>
    </form>
  )
}
