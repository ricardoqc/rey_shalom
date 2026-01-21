import { createClient } from '@/utils/supabase/server'
import { OrdersTable } from '@/components/admin/orders-table'

export default async function OrdersPage() {
  const supabase = await createClient()

  // Obtener pedidos pendientes por defecto
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        id,
        public_name,
        referral_code,
        status_level
      ),
      order_items (
        id,
        quantity,
        unit_price,
        products (
          id,
          name,
          is_pack,
          target_rank
        )
      )
    `)
    .eq('payment_status', 'pending')
    .order('created_at', { ascending: false })

  // Obtener también pedidos aprobados y rechazados para el filtro
  const { data: allOrders } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        id,
        public_name,
        referral_code,
        status_level
      ),
      order_items (
        id,
        quantity,
        unit_price,
        products (
          id,
          name,
          is_pack,
          target_rank
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100) // Limitar para performance

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Pedidos</h1>
        <p className="mt-1 text-sm text-white/60">
          Revisa y aprueba pedidos pendientes de pago
        </p>
      </div>

      <OrdersTable initialOrders={orders || []} allOrders={allOrders || []} />
    </div>
  )
}
