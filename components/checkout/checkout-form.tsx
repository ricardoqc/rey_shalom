'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { processOrder } from '@/app/actions/shop'
import { useImageUpload } from '@/hooks/use-image-upload'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { Loader2, Upload, X, FileText } from 'lucide-react'
import { toast } from 'sonner'

type Profile = Database['public']['Tables']['profiles']['Row']

interface CheckoutFormProps {
  user: User | null
  profile: Profile | null
}

export function CheckoutForm({ user, profile }: CheckoutFormProps) {
  const router = useRouter()
  const { items, clearCart, getTotalPrice } = useCart()
  const { uploadImage, isUploading: isUploadingProof } = useImageUpload()
  const [loading, setLoading] = useState(false)
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null)
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: profile?.public_name || user?.user_metadata?.name || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || 'Perú',
    phone: profile?.phone || '',
  })

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-gray-100 p-8 shadow-sm">
        <p className="text-center text-[#666666]">
          Tu carrito está vacío.{' '}
          <a href="/shop" className="text-[#4CAF50] hover:underline">
            Ir a la tienda
          </a>
        </p>
      </div>
    )
  }

  const handlePaymentProofSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo (imagen o PDF)
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'

    if (!isImage && !isPdf) {
      toast.error('El archivo debe ser una imagen o PDF')
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no puede ser mayor a 5MB')
      return
    }

    setPaymentProofFile(file)

    // Crear preview si es imagen
    if (isImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPaymentProofPreview(null)
    }

    // Subir archivo inmediatamente
    const url = await uploadImage(file, 'payment-proofs')
    if (url) {
      setPaymentProofUrl(url)
    }
  }

  const handleRemoveProof = () => {
    setPaymentProofFile(null)
    setPaymentProofPreview(null)
    setPaymentProofUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que se haya subido el comprobante
    if (!paymentProofUrl) {
      toast.error('Debes adjuntar un comprobante de pago')
      return
    }

    setLoading(true)

    try {
      // Obtener código de referido de la cookie si existe
      const sponsorRef = document.cookie
        .split('; ')
        .find((row) => row.startsWith('sponsor_ref='))
        ?.split('=')[1]

      // Buscar el affiliate_id si hay código de referido
      let affiliateId: string | undefined = undefined
      if (sponsorRef) {
        // Aquí deberías hacer una llamada al servidor para obtener el ID
        // Por ahora lo dejamos undefined
      }

      const result = await processOrder(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          points: item.points,
          sku: item.sku,
        })),
        {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          phone: formData.phone,
        },
        paymentProofUrl,
        affiliateId
      )

      if (result.success) {
        toast.success(`¡Pedido creado! Orden #${result.orderNumber}`)
        clearCart()
        router.push(`/checkout/pending?order=${result.orderNumber}`)
      } else {
        toast.error(result.error || 'Error al procesar la orden')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white/5 border border-gray-100 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#1A1A1A]">Información de Envío</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A]">
          Nombre Completo *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md bg-white/5 border border-gray-100 px-3 py-2 text-[#1A1A1A] placeholder-white/40 shadow-sm focus:border-[#ea2a33] focus:outline-none focus:ring-1 focus:ring-[#ea2a33]"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#1A1A1A]">
          Teléfono *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md bg-white/5 border border-gray-100 px-3 py-2 text-[#1A1A1A] placeholder-white/40 shadow-sm focus:border-[#ea2a33] focus:outline-none focus:ring-1 focus:ring-[#ea2a33]"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#1A1A1A]">
          Dirección *
        </label>
        <textarea
          id="address"
          required
          rows={3}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full rounded-md bg-white/5 border border-gray-100 px-3 py-2 text-[#1A1A1A] placeholder-white/40 shadow-sm focus:border-[#ea2a33] focus:outline-none focus:ring-1 focus:ring-[#ea2a33]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-[#1A1A1A]">
            Ciudad *
          </label>
          <input
            type="text"
            id="city"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1 block w-full rounded-md bg-white/5 border border-gray-100 px-3 py-2 text-[#1A1A1A] placeholder-white/40 shadow-sm focus:border-[#ea2a33] focus:outline-none focus:ring-1 focus:ring-[#ea2a33]"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-[#1A1A1A]">
            País *
          </label>
          <input
            type="text"
            id="country"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="mt-1 block w-full rounded-md bg-white/5 border border-gray-100 px-3 py-2 text-[#1A1A1A] placeholder-white/40 shadow-sm focus:border-[#ea2a33] focus:outline-none focus:ring-1 focus:ring-[#ea2a33]"
          />
        </div>
      </div>

      {/* Sección de Comprobante de Pago */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
          Comprobante de Pago *
        </h3>
        <p className="text-sm text-[#1A1A1A]/60 mb-4">
          Adjunta una foto o PDF de tu comprobante de pago (transferencia, depósito, etc.)
        </p>

        {paymentProofPreview ? (
          <div className="relative">
            <div className="border-2 border-gray-100 rounded-lg p-4 bg-white/5">
              <img
                src={paymentProofPreview}
                alt="Preview del comprobante"
                className="max-w-full h-auto max-h-64 mx-auto rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveProof}
              className="absolute top-2 right-2 p-1 bg-[#4CAF50] text-white rounded-full hover:bg-[#3d8b40] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            {paymentProofUrl && (
              <p className="mt-2 text-sm text-[#4CAF50] flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Comprobante subido exitosamente
              </p>
            )}
          </div>
        ) : paymentProofFile && !paymentProofPreview ? (
          <div className="border-2 border-gray-100 rounded-lg p-4 bg-white/5">
            <div className="flex items-center gap-2 text-[#1A1A1A]">
              <FileText className="h-5 w-5" />
              <span className="text-sm">{paymentProofFile.name}</span>
            </div>
            {isUploadingProof && (
              <p className="mt-2 text-sm text-[#D4AF37] flex items-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo comprobante...
              </p>
            )}
            {paymentProofUrl && (
              <p className="mt-2 text-sm text-[#4CAF50] flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Comprobante subido exitosamente
              </p>
            )}
            <button
              type="button"
              onClick={handleRemoveProof}
              className="mt-2 text-sm text-[#ea2a33] hover:text-[#d11a23] transition-colors"
            >
              Eliminar
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-100 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="mb-2 text-sm text-[#1A1A1A]/60">
                <span className="font-semibold text-[#1A1A1A]">Click para subir</span> o arrastra y suelta
              </p>
              <p className="text-xs text-[#666666]">
                PNG, JPG, PDF hasta 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handlePaymentProofSelect}
              required
            />
          </label>
        )}

        {isUploadingProof && (
          <div className="mt-2 flex items-center gap-2 text-sm text-[#D4AF37]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Subiendo comprobante...
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || isUploadingProof || !paymentProofUrl}
          className="w-full flex items-center justify-center rounded-md bg-[#4CAF50] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#3d8b40] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Confirmar Pedido'
          )}
        </button>
        <p className="mt-2 text-xs text-[#666666] text-center">
          Tu pedido será revisado y aprobado manualmente. Recibirás una notificación cuando esté listo.
        </p>
      </div>
    </form>
  )
}
