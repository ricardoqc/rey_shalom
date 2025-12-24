import { createClient } from '@/utils/supabase/server'
import { WarehouseTable } from '@/components/admin/warehouse-table'

export default async function WarehousesPage() {
  const supabase = await createClient()

  // Obtener todas las sucursales
  const { data: warehouses } = await supabase
    .from('warehouses')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Sucursales</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra las sucursales y bodegas del sistema
        </p>
      </div>

      <WarehouseTable warehouses={warehouses || []} />
    </div>
  )
}

