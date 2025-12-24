'use client'

import { useState } from 'react'
import { addStock } from '@/app/actions/admin'
import { Database } from '@/types/supabase'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

type Product = Database['public']['Tables']['products']['Row']
type Warehouse = Database['public']['Tables']['warehouses']['Row']
type InventoryItem = Database['public']['Tables']['inventory_items']['Row'] & {
  products?: { name: string; sku: string }
  warehouses?: { name: string }
}

interface InventoryManagerProps {
  products: Product[]
  warehouses: Warehouse[]
  currentInventory: InventoryItem[]
}

export function InventoryManager({
  products,
  warehouses,
  currentInventory,
}: InventoryManagerProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, Record<string, number>>>({})

  const getCurrentStock = (productId: string, warehouseId: string) => {
    const item = currentInventory.find(
      (inv) => inv.product_id === productId && inv.warehouse_id === warehouseId
    )
    return item?.quantity || 0
  }

  const handleQuantityChange = (
    productId: string,
    warehouseId: string,
    value: string
  ) => {
    const numValue = parseInt(value) || 0
    setQuantities((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [warehouseId]: numValue,
      },
    }))
  }

  const handleAddStock = async (productId: string, warehouseId: string) => {
    const quantity = quantities[productId]?.[warehouseId] || 0

    if (quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0')
      return
    }

    const key = `${productId}-${warehouseId}`
    setLoading(key)

    try {
      const result = await addStock(productId, warehouseId, quantity)

      if (result.success) {
        toast.success('Stock agregado exitosamente')
        // Limpiar el input
        setQuantities((prev) => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            [warehouseId]: 0,
          },
        }))
        // Recargar página para ver cambios
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al agregar stock')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-12 text-center">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Producto
              </th>
              {warehouses.map((warehouse) => (
                <th
                  key={warehouse.id}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {warehouse.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                  </div>
                </td>
                {warehouses.map((warehouse) => {
                  const currentStock = getCurrentStock(product.id, warehouse.id)
                  const inputValue =
                    quantities[product.id]?.[warehouse.id] || ''
                  const isLoading = loading === `${product.id}-${warehouse.id}`

                  return (
                    <td key={warehouse.id} className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900">
                          Stock actual: <strong>{currentStock}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={inputValue}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.id,
                                warehouse.id,
                                e.target.value
                              )
                            }
                            placeholder="Cantidad"
                            className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          />
                          <button
                            onClick={() =>
                              handleAddStock(product.id, warehouse.id)
                            }
                            disabled={isLoading || !inputValue || parseInt(inputValue) <= 0}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            Agregar
                          </button>
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

