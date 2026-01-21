'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import Link from 'next/link'

export function CartIcon() {
  const { getTotalItems } = useCart()
  const itemCount = getTotalItems()

  return (
    <Link
      href="/checkout"
      className="relative flex items-center justify-center rounded-full p-2 text-white hover:bg-white/10 transition-colors"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ea2a33] text-xs font-bold text-white">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  )
}
