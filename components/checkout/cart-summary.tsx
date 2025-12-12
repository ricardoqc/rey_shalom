'use client'

import { useCart } from '@/lib/cart-context'
import { Award, Trash2 } from 'lucide-react'
import Link from 'next/link'

export function CartSummary() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalPoints } =
    useCart()

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <p className="text-center text-gray-500">Tu carrito está vacío</p>
        <Link
          href="/shop"
          className="mt-4 block text-center text-blue-600 hover:underline"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Resumen del Pedido
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b pb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              {item.points > 0 && (
                <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                  <Award className="h-3 w-3" />
                  <span>{item.points * item.quantity} puntos</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                $
                {(item.price * item.quantity).toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="space-y-2 border-t pt-4">
        {getTotalPoints() > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Puntos a ganar:</span>
            <span className="font-medium text-blue-600">
              {getTotalPoints()} puntos
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-lg font-bold">
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

