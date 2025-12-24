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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra el stock de productos en cada sucursal
        </p>
      </div>

      <InventoryManager
        products={products || []}
        warehouses={warehouses || []}
        currentInventory={inventory || []}
      />
    </div>
  )
}

