'use client'

import { useState } from 'react'
import { Copy, Check, Share2, MessageCircle, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReferralLinkProps {
  referralCode: string
}

export function ReferralLink({ referralCode }: ReferralLinkProps) {
  const [copied, setCopied] = useState(false)
  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : ''
  const referralUrl = `${baseUrl}?ref=${referralCode}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Únete a Rey Shalom usando mi código de referido! ${referralUrl}`
    )
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const shareFacebook = () => {
    const url = encodeURIComponent(referralUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    )
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] relative overflow-hidden flex flex-col h-full group">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 size-48 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/10 transition-colors duration-700"></div>

      <div className="p-10 relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Share2 className="size-4" />
            </div>
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">MKT TOOLS</span>
          </div>
          <h3 className="text-3xl font-black text-text-dark tracking-tighter mb-2">
            Tu Link de Referido
          </h3>
          <p className="text-text-muted font-medium pr-10">
            Comparte tu enlace personalizado y comienza a generar comisiones automáticas por cada nuevo aliado.
          </p>
        </div>

        {/* Input con código */}
        <div className="mb-10 group/input">
          <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-full focus-within:bg-white focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/10 transition-all shadow-inner">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 bg-transparent px-6 py-3 text-sm font-bold text-text-dark placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className={cn(
                "px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                copied
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-gray-100 text-text-muted hover:text-text-dark hover:border-gray-200 shadow-sm"
              )}
            >
              <div className="flex items-center gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? '¡Copiado!' : 'Copiar'}
              </div>
            </button>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Código destacado */}
          <div className="text-center sm:text-left">
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Código Único</p>
            <p className="text-4xl font-black tracking-tighter text-text-dark group-hover:text-gold transition-colors">{referralCode}</p>
          </div>

          {/* Botones de compartir */}
          <div className="flex gap-3">
            <button
              onClick={shareWhatsApp}
              className="size-14 flex items-center justify-center rounded-2xl bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20 hover:bg-[#45a049] hover:-translate-y-1 active:scale-95 transition-all"
              title="Compartir en WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button
              onClick={shareFacebook}
              className="size-14 flex items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow-lg shadow-[#1877F2]/20 hover:bg-[#166fe5] hover:-translate-y-1 active:scale-95 transition-all"
              title="Compartir en Facebook"
            >
              <Facebook className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
