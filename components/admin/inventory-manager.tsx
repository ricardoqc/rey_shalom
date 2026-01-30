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
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-20 text-center">
        <div className="mx-auto h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
          <Loader2 className="h-10 w-10 text-gray-200" />
        </div>
        <p className="text-xl font-black text-text-dark tracking-tight">No hay productos disponibles</p>
        <p className="text-text-muted mt-2">Agrega productos para gestionar su stock</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                Producto
              </th>
              {warehouses.map((warehouse) => (
                <th
                  key={warehouse.id}
                  className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted"
                >
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-gold"></span>
                    {warehouse.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                      {product.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-black text-text-dark group-hover:text-primary transition-colors tracking-tight">
                        {product.name}
                      </div>
                      <div className="text-[10px] font-bold text-text-muted font-mono tracking-widest uppercase">
                        {product.sku}
                      </div>
                    </div>
                  </div>
                </td>
                {warehouses.map((warehouse) => {
                  const currentStock = getCurrentStock(product.id, warehouse.id)
                  const inputValue = quantities[product.id]?.[warehouse.id] || ''
                  const isLoading = loading === `${product.id}-${warehouse.id}`

                  return (
                    <td key={warehouse.id} className="px-8 py-6 whitespace-nowrap">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xl font-black tracking-tighter ${currentStock > 0 ? 'text-text-dark' : 'text-gray-300'}`}>
                            {currentStock}
                          </span>
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">unidades</span>
                        </div>
                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-full border border-gray-100 group-hover:bg-white group-hover:border-primary/20 transition-all">
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
                            placeholder="0"
                            className="w-20 bg-transparent px-4 py-2 text-sm font-black text-text-dark outline-none placeholder:text-gray-300"
                          />
                          <button
                            onClick={() =>
                              handleAddStock(product.id, warehouse.id)
                            }
                            disabled={isLoading || !inputValue || (inputValue ? parseInt(String(inputValue)) <= 0 : true)}
                            className="flex items-center justify-center size-8 bg-primary text-white rounded-full hover:bg-[#3d8b40] shadow-md shadow-primary/20 disabled:opacity-30 disabled:grayscale transition-all hover:scale-110 active:scale-95"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
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

