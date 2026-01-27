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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-[#4CAF50]/20">
      {/* Badge de descuento */}
      {discountPercentage > 0 && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-[#4CAF50] px-2 py-1 text-xs font-semibold text-white">
          -{discountPercentage}%
        </div>
      )}

      {/* Badge de PV */}
      {product.points_per_unit > 0 && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-[#D4AF37] text-white px-2 py-1 text-xs font-bold shadow-lg">
          {product.points_per_unit} PV
        </div>
      )}

      {/* Imagen del producto */}
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-gray-300">📦</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A] line-clamp-2 group-hover:text-[#4CAF50] transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-2 text-sm text-[#666666] line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Precios */}
        <div className="mt-4 flex flex-col gap-1">
          {discountPercentage > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#666666] line-through">
                  ${product.base_price.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-lg font-bold text-[#4CAF50]">
                  ${finalPrice.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <p className="text-xs text-[#666666]">
                Precio especial para {userRank}
              </p>
            </>
          ) : (
            <span className="text-lg font-bold text-[#1A1A1A]">
              ${finalPrice.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        {/* Stock */}
        {inventory && (
          <div className="mt-2">
            {isOutOfStock ? (
              <span className="text-sm font-medium text-red-500">
                Sin stock
              </span>
            ) : isLowStock ? (
              <span className="text-sm font-medium text-[#D4AF37]">
                Últimas {inventory.quantity} unidades
              </span>
            ) : (
              <span className="text-sm text-[#666666]">
                En stock
              </span>
            )}
          </div>
        )}

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3d8b40] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}
