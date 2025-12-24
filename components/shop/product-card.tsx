'use client'

import { ShoppingCart, Award } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { Database } from '@/types/supabase'
import { calculateProductPrice } from '@/lib/pricing'

type Product = Database['public']['Tables']['products']['Row']
type RankRequirement = Database['public']['Tables']['rank_requirements']['Row']

interface ProductCardProps {
  product: Product
  userRank: 'BRONCE' | 'PLATA' | 'ORO' | null
  rankRequirements?: RankRequirement[]
  inventory?: {
    quantity: number
    warehouseId: string
  }
}

export function ProductCard({
  product,
  userRank,
  rankRequirements = [],
  inventory,
}: ProductCardProps) {
  const { addItem } = useCart()

  const { finalPrice, discountPercentage } = calculateProductPrice(
    product.base_price,
    userRank,
    rankRequirements
  )

  const isOutOfStock = inventory ? inventory.quantity <= 0 : false
  const isLowStock = inventory ? inventory.quantity > 0 && inventory.quantity < 10 : false

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      basePrice: product.base_price,
      points: product.points_per_unit || 0,
      sku: product.sku,
      image: product.image_url || undefined,
    })
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Badge de descuento */}
      {discountPercentage > 0 && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
          -{discountPercentage}%
        </div>
      )}

      {/* Imagen del producto */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-gray-400">📦</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Precios */}
        <div className="mt-4 flex flex-col gap-1">
          {discountPercentage > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through">
                  ${product.base_price.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-lg font-bold text-red-600">
                  ${finalPrice.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Precio especial para {userRank}
              </p>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${finalPrice.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        {/* Puntos */}
        {product.points_per_unit > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm text-blue-600">
            <Award className="h-4 w-4" />
            <span>
              {product.points_per_unit} punto{product.points_per_unit !== 1 ? 's' : ''} por unidad
            </span>
          </div>
        )}

        {/* Stock */}
        {inventory && (
          <div className="mt-2">
            {isOutOfStock ? (
              <span className="text-sm font-medium text-red-600">
                Sin stock
              </span>
            ) : isLowStock ? (
              <span className="text-sm font-medium text-orange-600">
                Últimas {inventory.quantity} unidades
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                En stock
              </span>
            )}
          </div>
        )}

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-4 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}

