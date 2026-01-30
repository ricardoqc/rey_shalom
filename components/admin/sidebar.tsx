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
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center border-b border-gray-50 px-6">
            <div className="flex items-center gap-3">
              <img
                alt="Logo"
                className="h-8 w-auto"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXQ-Ub8KSIvLy27nHLJZtQ1yr4qDoJ7uWIZW9XYPVS7-24K8Lvp-CaJFuVoFdrhtm0yzG0cEqUnSHXq2zNQmtADNQJlz1woQyaVGrv74tD94GdCTGoYsMC4rS3HCXkMiKZPA_cneii2TdCWE8mni7BNuzl4c8mrDOnzPDmM1EWZ-FFrufnRA5WLv514jVeLpPVm-l-R-Brcu9vc2OB9rUElkjNa8rT7SQRYGvuzRgExl3kcztXv0lpyfRvdUhJ_lWDm13XanGF51s"
              />
              <div className="hidden sm:block">
                <span className="block text-sm font-black leading-none tracking-tighter text-primary italic uppercase">Rey Shalom</span>
                <span className="text-[8px] font-bold text-gray-400 tracking-[0.2em]">ADMIN</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1.5 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : 'text-text-muted hover:bg-gray-50 hover:text-text-dark'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                      isActive ? 'text-primary' : 'text-gray-400 group-hover:text-text-dark'
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
