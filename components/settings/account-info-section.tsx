'use client'

import { Copy, CheckCircle2, Mail, User, CreditCard, Calendar, Shield } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface AccountInfoSectionProps {
  user: any
  profile: any
}

export function AccountInfoSection({ user, profile }: AccountInfoSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success('Copiado al portapapeles')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getReferralLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}?ref=${profile?.referral_code}`
    }
    return ''
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Información de Cuenta</h2>
        <p className="mt-1 text-sm text-gray-500">
          Información de tu cuenta (solo lectura). Contacta al administrador para cambiar nombre, DNI o correo.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                <p className="text-sm text-gray-900">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Solo Admin
            </span>
          </div>
        </div>

        {/* Nombre */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                <p className="text-sm text-gray-900">{profile?.public_name || 'No especificado'}</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Solo Admin
            </span>
          </div>
        </div>

        {/* DNI */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">DNI</p>
                <p className="text-sm text-gray-900">{profile?.dni || 'No especificado'}</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Solo Admin
            </span>
          </div>
        </div>

        {/* Código de Referido */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Código de Referido</p>
              <p className="text-sm font-mono text-gray-900">{profile?.referral_code || 'N/A'}</p>
            </div>
            <button
              onClick={() => copyToClipboard(profile?.referral_code || '', 'referral_code')}
              className="ml-4 rounded-md p-2 text-gray-400 hover:text-gray-600"
              title="Copiar código"
            >
              {copiedField === 'referral_code' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Link de Referido */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 mb-1">Link de Referido</p>
              <p className="text-sm text-gray-900 truncate">{getReferralLink()}</p>
            </div>
            <button
              onClick={() => copyToClipboard(getReferralLink(), 'referral_link')}
              className="ml-4 rounded-md p-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
              title="Copiar link"
            >
              {copiedField === 'referral_link' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Sponsor */}
        {profile?.sponsor_id && (
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Patrocinador / Líder</p>
                <p className="text-sm text-gray-900">
                  {profile?.sponsor?.public_name || profile?.sponsor?.email || 'Patrocinador'}
                  {profile?.sponsor?.referral_code && (
                    <span className="text-xs text-gray-500 ml-2">
                      ({profile.sponsor.referral_code})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fecha de Registro */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
              <p className="text-sm text-gray-900">
                {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Estado de Cuenta */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Estado de Cuenta</p>
                <p className="text-sm text-gray-900">
                  {profile?.is_active ? 'Activa' : 'Inactiva'}
                </p>
              </div>
            </div>
            {profile?.is_active ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Activa
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Inactiva
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nota sobre cambios */}
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              ¿Necesitas cambiar tu nombre, DNI o correo?
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Por seguridad, estos datos solo pueden ser modificados por un administrador.
                Contacta a soporte para solicitar cambios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





