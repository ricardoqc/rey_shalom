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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-royal-blue rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-royal-blue">VENTAS</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Gestión de Pedidos</h1>
          <p className="mt-2 text-text-muted font-medium">
            Revisión y aprobación centralizada de transacciones
          </p>
        </div>
      </div>

      <OrdersTable initialOrders={orders || []} allOrders={allOrders || []} />
    </div>
  )
}
