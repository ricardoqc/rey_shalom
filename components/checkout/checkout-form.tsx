'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { processOrder } from '@/app/actions/shop'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Profile = Database['public']['Tables']['profiles']['Row']

interface CheckoutFormProps {
  user: User | null
  profile: Profile | null
}

export function CheckoutForm({ user, profile }: CheckoutFormProps) {
  const router = useRouter()
  const { items, clearCart, getTotalPrice } = useCart()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: profile?.public_name || user?.user_metadata?.name || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || 'Perú',
    phone: profile?.phone || '',
  })

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <p className="text-center text-gray-500">
          Tu carrito está vacío.{' '}
          <a href="/shop" className="text-blue-600 hover:underline">
            Ir a la tienda
          </a>
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        affiliateId
      )

      if (result.success) {
        toast.success(`¡Compra exitosa! Orden #${result.orderNumber}`)
        clearCart()
        router.push(`/checkout/success?order=${result.orderNumber}`)
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
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-900">Información de Envío</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre Completo *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Teléfono *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Dirección *
        </label>
        <textarea
          id="address"
          required
          rows={3}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad *
          </label>
          <input
            type="text"
            id="city"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            País *
          </label>
          <input
            type="text"
            id="country"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Confirmar Compra'
          )}
        </button>
      </div>
    </form>
  )
}

