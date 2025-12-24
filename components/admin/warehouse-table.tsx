'use client'

import { useState } from 'react'
import { Warehouse, Edit2, Trash2, Plus } from 'lucide-react'
import { Database } from '@/types/supabase'
import { WarehouseDialog } from './warehouse-dialog'
import { deleteWarehouse } from '@/app/actions/warehouses'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

type WarehouseRow = Database['public']['Tables']['warehouses']['Row']

interface WarehouseTableProps {
  warehouses: WarehouseRow[]
}

export function WarehouseTable({ warehouses }: WarehouseTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseRow | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleEdit = (warehouse: WarehouseRow) => {
    setSelectedWarehouse(warehouse)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de desactivar la sucursal "${name}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      const result = await deleteWarehouse(id)

      if (result.success) {
        toast.success('Sucursal desactivada exitosamente')
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al desactivar sucursal')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setDeletingId(null)
    }
  }

  const handleNew = () => {
    setSelectedWarehouse(null)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sucursales</h2>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Sucursal
          </button>
        </div>

        {warehouses.length === 0 ? (
          <div className="p-12 text-center">
            <Warehouse className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay sucursales
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza agregando tu primera sucursal
            </p>
            <div className="mt-6">
              <button
                onClick={handleNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Nueva Sucursal
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {warehouse.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{warehouse.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {warehouse.city && (
                          <span>{warehouse.city}</span>
                        )}
                        {warehouse.city && warehouse.country && ', '}
                        {warehouse.country && <span>{warehouse.country}</span>}
                        {!warehouse.city && !warehouse.country && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      {warehouse.address && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {warehouse.address}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {warehouse.is_active ? (
                        <Badge className="bg-green-100 text-green-800">
                          Activa
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Inactiva
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {warehouse.is_central ? (
                        <Badge className="bg-blue-100 text-blue-800">
                          Central
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(warehouse)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(warehouse.id, warehouse.name)}
                          disabled={deletingId === warehouse.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Desactivar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <WarehouseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        warehouse={selectedWarehouse}
      />
    </>
  )
}

