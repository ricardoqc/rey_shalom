'use client'

import { useCart } from '@/lib/cart-context'
import { Award, Trash2 } from 'lucide-react'
import Link from 'next/link'

export function CartSummary() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalPoints } =
    useCart()

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
        <p className="text-center text-white/60">Tu carrito está vacío</p>
        <Link
          href="/shop"
          className="mt-4 block text-center text-[#FFD700] hover:underline"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white mb-4">
        Resumen del Pedido
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{item.name}</h3>
              <p className="text-sm text-white/60">SKU: {item.sku}</p>
              {item.points > 0 && (
                <div className="mt-1 flex items-center gap-1 text-xs text-[#FFD700]">
                  <Award className="h-3 w-3" />
                  <span>{item.points * item.quantity} puntos</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-sm text-white hover:bg-white/10 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-sm text-white hover:bg-white/10 transition-colors"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-white">
                $
                {(item.price * item.quantity).toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-[#ea2a33] hover:text-[#d11a23] transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="space-y-2 border-t border-white/10 pt-4">
        {getTotalPoints() > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Puntos a ganar:</span>
            <span className="font-medium text-[#FFD700]">
              {getTotalPoints()} puntos
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-lg font-bold text-white">
          <span>Total:</span>
          <span>
            ${getTotalPrice().toLocaleString('es-PE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
