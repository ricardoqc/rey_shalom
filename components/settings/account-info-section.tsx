'use client'

import { Copy, CheckCircle2, Mail, User, CreditCard, Calendar, Shield } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-black text-text-dark tracking-tight">Información de Seguridad</h2>
        <p className="mt-1 text-sm text-text-muted font-medium">
          Datos sensibles de identidad y cuenta. Para cambios contacte a soporte central.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Email */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Mail size={18} />
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Correo Principal</span>
          </div>
          <p className="text-sm font-bold text-text-dark break-all">{user?.email || 'N/A'}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="size-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Inmutable</span>
          </div>
        </div>

        {/* Nombre */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <User size={18} />
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Titular</span>
          </div>
          <p className="text-sm font-bold text-text-dark">{profile?.public_name || 'No especificado'}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="size-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Verificado</span>
          </div>
        </div>

        {/* DNI */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <CreditCard size={18} />
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Documento ID</span>
          </div>
          <p className="text-sm font-bold text-text-dark">{profile?.dni || 'No especificado'}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="size-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">KYC Aprobado</span>
          </div>
        </div>
      </div>

      {/* Referidos info and Link */}
      <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-10 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-2 bg-primary rounded-full"></div>
              <h3 className="text-xs font-black text-text-dark uppercase tracking-widest">Tu Enlace de Crecimiento</h3>
            </div>
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-full pl-6 pr-2 py-2">
              <p className="text-xs font-bold text-text-muted truncate flex-1">{getReferralLink()}</p>
              <button
                onClick={() => copyToClipboard(getReferralLink(), 'referral_link')}
                className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                {copiedField === 'referral_link' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-2 bg-gold rounded-full"></div>
              <h3 className="text-xs font-black text-text-dark uppercase tracking-widest">Tu Código Único</h3>
            </div>
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-full pl-6 pr-2 py-2">
              <p className="text-xs font-black text-primary tracking-[0.2em] flex-1">{profile?.referral_code || '---'}</p>
              <button
                onClick={() => copyToClipboard(profile?.referral_code || '', 'referral_code')}
                className="size-10 rounded-full bg-gold text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold/20"
              >
                {copiedField === 'referral_code' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sponsor & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Shield className="size-7 text-primary/40" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Liderazgo</p>
              <p className="text-sm font-bold text-text-dark">
                {profile?.sponsor?.public_name || profile?.sponsor?.email || 'Sistema Central'}
                {profile?.sponsor?.referral_code && <span className="text-primary ml-2 font-black">[{profile.sponsor.referral_code}]</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Calendar className="size-7 text-text-muted/30" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Antiguedad</p>
              <p className="text-sm font-bold text-text-dark">
                {profile?.created_at ? formatDate(profile.created_at) : 'Desde el inicio'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status Alert */}
      <div className={cn(
        "rounded-[2rem] p-8 flex items-center justify-between gap-6",
        profile?.is_active ? "bg-primary/5 border border-primary/10" : "bg-red-50 border border-red-100"
      )}>
        <div className="flex items-center gap-6">
          <div className={cn(
            "size-14 rounded-full flex items-center justify-center shadow-lg",
            profile?.is_active ? "bg-primary text-white" : "bg-red-500 text-white"
          )}>
            <Shield className="size-7" />
          </div>
          <div>
            <h4 className="text-lg font-black text-text-dark tracking-tight">Estado de la Membresía</h4>
            <p className="text-sm font-medium text-text-muted">Tu cuenta se encuentra actualmente {profile?.is_active ? 'plenamente operativa' : 'restringida o inactiva'}</p>
          </div>
        </div>
        <div className={cn(
          "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
          profile?.is_active ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-100 text-red-600 border border-red-200"
        )}>
          {profile?.is_active ? 'Cuenta Activa' : 'Acceso Limitado'}
        </div>
      </div>
    </div>
  )
}





