import { createClient } from '@/utils/supabase/server'
import { Package, Users, Warehouse, DollarSign } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Obtener estadísticas
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: totalWarehouses } = await supabase
    .from('warehouses')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('payment_status', 'PAID')

  const totalRevenue =
    orders?.reduce((sum, order: any) => sum + Number(order.total_amount), 0) || 0

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-primary rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">ADMINSTRACIÓN</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Dashboard General</h1>
          <p className="mt-2 text-text-muted font-medium">
            Resumen operacional del ecosistema Rey Shalom
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Productos"
          value={totalProducts || 0}
          icon={Package}
          iconColor="text-primary"
        />
        <StatsCard
          title="Aliados"
          value={totalUsers || 0}
          icon={Users}
          iconColor="text-royal-blue"
        />
        <StatsCard
          title="Sucursales"
          value={totalWarehouses || 0}
          icon={Warehouse}
          iconColor="text-gold"
        />
        <StatsCard
          title="Ingresos"
          value={`S/ ${totalRevenue.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={DollarSign}
          iconColor="text-primary"
        />
      </div>
    </div>
  )
}
