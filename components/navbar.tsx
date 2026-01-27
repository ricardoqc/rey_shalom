'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { User, LogOut, Menu, X } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { CartIcon } from '@/components/shop/cart-icon'

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [sponsorCode, setSponsorCode] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    const refCode = getCookie('sponsor_ref')
    setSponsorCode(refCode)

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const menuItems = [
    { href: '/', label: 'Inicio' },
    { href: '/shop', label: 'Productos' },
    { href: '/#negocio', label: 'Negocio' },
    { href: '/#testimonios', label: 'Testimonios' },
  ]

  // Estado A: Visitante con cookie de sponsor
  if (!user && sponsorCode) {
    return (
      <>
        <div className="bg-[#2196F3] text-white py-2 px-4 text-sm text-center">
          <span>
            Estás comprando con la asesoría de:{' '}
            <strong className="font-semibold">{sponsorCode}</strong>
          </span>
        </div>

        <header className="fixed top-0 left-0 right-0 z-50 glass-nav-light border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 text-[#4CAF50]">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                </svg>
              </div>
              <Link href="/" className="hidden sm:block">
                <span className="block text-xl font-black leading-none tracking-tighter text-[#4CAF50] italic uppercase">Rey Shalom</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">S.A.C.</span>
              </Link>
              <Link href="/" className="sm:hidden">
                <h1 className="text-xl font-black tracking-tighter uppercase italic text-[#4CAF50]">Rey Shalom</h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-colors ${
                    pathname === item.href ? 'text-[#4CAF50]' : 'text-[#1A1A1A] hover:text-[#4CAF50]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="hidden md:flex items-center gap-4">
              <CartIcon />
              <Link
                href="/auth/login"
                className="px-6 py-2 rounded-full text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-all border border-gray-200"
              >
                Ingresar
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 rounded-full text-sm font-bold bg-[#D4AF37] text-white hover:bg-[#c29d2f] transition-all shadow-md"
              >
                Únete Ahora
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#1A1A1A]"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
              <div className="px-4 py-4 space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#1A1A1A] hover:text-[#4CAF50]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="px-3 py-2">
                    <CartIcon />
                  </div>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#1A1A1A] hover:bg-gray-50 text-center border border-gray-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-[#D4AF37] text-white text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Únete Ahora
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>
      </>
    )
  }

  // Estado B: Usuario logueado
  if (user) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav-light border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 text-[#4CAF50]">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <Link href="/" className="hidden sm:block">
              <span className="block text-xl font-black leading-none tracking-tighter text-[#4CAF50] italic uppercase">Rey Shalom</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">S.A.C.</span>
            </Link>
            <Link href="/" className="sm:hidden">
              <h1 className="text-xl font-black tracking-tighter uppercase italic text-[#4CAF50]">Rey Shalom</h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === item.href ? 'text-[#4CAF50]' : 'text-[#1A1A1A] hover:text-[#4CAF50]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <CartIcon />
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#4CAF50] transition-colors flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Mi Oficina</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#4CAF50] transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1A1A1A]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#1A1A1A] hover:text-[#4CAF50]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="px-3 py-2">
                  <CartIcon />
                </div>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#1A1A1A] hover:text-[#4CAF50] flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Mi Oficina</span>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#1A1A1A] hover:text-[#4CAF50] flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    )
  }

  // Estado C: Visitante limpio
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav-light border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 text-[#4CAF50]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <Link href="/" className="hidden sm:block">
            <span className="block text-xl font-black leading-none tracking-tighter text-[#4CAF50] italic uppercase">Rey Shalom</span>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">S.A.C.</span>
          </Link>
          <Link href="/" className="sm:hidden">
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-[#4CAF50]">Rey Shalom</h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === item.href ? 'text-[#4CAF50]' : 'text-[#1A1A1A] hover:text-[#4CAF50]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <CartIcon />
          <Link
            href="/auth/login"
            className="px-6 py-2 rounded-full text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-all border border-gray-200"
          >
            Ingresar
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-2 rounded-full text-sm font-bold bg-[#D4AF37] text-white hover:bg-[#c29d2f] transition-all shadow-md"
          >
            Únete Ahora
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#1A1A1A]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#1A1A1A] hover:text-[#4CAF50]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="px-3 py-2">
                <CartIcon />
              </div>
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-[#1A1A1A] hover:bg-gray-50 text-center border border-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ingresar
              </Link>
              <Link
                href="/auth/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-[#D4AF37] text-white text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Únete Ahora
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
