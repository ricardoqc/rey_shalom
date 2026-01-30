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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-gold rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">INFRAESTRUCTURA</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Gestión de Sucursales</h1>
          <p className="mt-2 text-text-muted font-medium">
            Administración centralizada de bodegas y centros de distribución
          </p>
        </div>
      </div>

      <WarehouseTable warehouses={warehouses || []} />
    </div>
  )
}

