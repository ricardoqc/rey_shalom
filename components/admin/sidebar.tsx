'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Building2,
  Users,
  ShoppingCart,
  X,
  Menu,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard General', href: '/admin', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Productos', href: '/admin/products', icon: Package },
  { name: 'Inventario', href: '/admin/inventory', icon: Warehouse },
  { name: 'Sucursales', href: '/admin/warehouses', icon: Building2 },
  { name: 'Usuarios/Afiliados', href: '/admin/users', icon: Users },
  { name: 'Crear Usuario', href: '/admin/create-users', icon: UserPlus },
]

export function AdminSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md bg-white/10 backdrop-blur-md p-2 text-white hover:bg-white/20 transition-colors border border-white/10"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
            <div className="flex items-center gap-3">
              <div className="size-6 text-[#ea2a33]">
                <svg fill="currentColor" viewBox="0 0 48 48">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                </svg>
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
                Admin Panel
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#ea2a33]/20 text-[#ea2a33] border border-[#ea2a33]/30'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive ? 'text-[#ea2a33]' : 'text-white/40 group-hover:text-white/60'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
