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
    orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard General</h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Productos Activos"
          value={totalProducts || 0}
          icon={Package}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Usuarios Activos"
          value={totalUsers || 0}
          icon={Users}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Sucursales"
          value={totalWarehouses || 0}
          icon={Warehouse}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Ingresos Totales"
          value={`$${totalRevenue.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={DollarSign}
          iconColor="text-yellow-600"
        />
      </div>
    </div>
  )
}

