'use client'

import { useState } from 'react'
import { Copy, Check, Share2, MessageCircle, Facebook } from 'lucide-react'

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
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#ea2a33] to-[#d11a23] shadow-lg">
      <div className="p-6 text-white">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">
            Tu Link de Referido
          </h3>
          <p className="text-sm opacity-90">
            Comparte este link y gana comisiones por cada persona que se registre
          </p>
        </div>

        {/* Input con código */}
        <div className="mb-4">
          <div className="flex rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/70 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 transition-colors rounded-r-lg flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-medium">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span className="text-sm font-medium">Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Botones de compartir */}
        <div className="flex gap-2">
          <button
            onClick={shareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#4CAF50] px-4 py-2 text-sm font-medium hover:bg-[#45a049] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button
            onClick={shareFacebook}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </button>
        </div>

        {/* Código destacado */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs opacity-75 mb-1">Tu código:</p>
          <p className="text-2xl font-bold tracking-wider">{referralCode}</p>
        </div>
      </div>
    </div>
  )
}
