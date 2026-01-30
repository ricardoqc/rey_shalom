import { createClient } from '@/utils/supabase/server'
import { InventoryManager } from '@/components/admin/inventory-manager'

export default async function InventoryPage() {
  const supabase = await createClient()

  // Obtener todos los productos
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  // Obtener todas las bodegas
  const { data: warehouses } = await supabase
    .from('warehouses')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  // Obtener inventario actual
  const { data: inventory } = await supabase
    .from('inventory_items')
    .select('*, products(name, sku), warehouses(name)')

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-gold rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">LOGÍSTICA</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Gestión de Inventario</h1>
          <p className="mt-2 text-text-muted font-medium">
            Control de existencias y movimientos entre sucursales
          </p>
        </div>
      </div>

      <InventoryManager
        products={products || []}
        warehouses={warehouses || []}
        currentInventory={inventory || []}
      />
    </div>
  )
}

