import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { CartSummary } from '@/components/checkout/cart-summary'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Obtener perfil para pre-llenar datos
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Checkout</h1>
          <p className="mt-2 text-sm text-[#666666]">
            Completa tu información para finalizar la compra
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Formulario de checkout */}
          <div>
            <CheckoutForm user={user} profile={profile} />
          </div>

          {/* Resumen del carrito */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
