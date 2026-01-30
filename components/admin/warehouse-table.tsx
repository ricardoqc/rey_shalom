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
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Warehouse className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-text-dark tracking-tighter">Sucursales</h2>
          </div>
          <button
            onClick={handleNew}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#3d8b40] hover:-translate-y-1 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            Nueva Sucursal
          </button>
        </div>

        {warehouses.length === 0 ? (
          <div className="p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/50 -z-10"></div>
            <div className="mx-auto h-20 w-20 bg-white rounded-3xl shadow-inner flex items-center justify-center mb-6">
              <Warehouse className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-text-dark tracking-tight">
              No hay sucursales
            </h3>
            <p className="mt-2 text-text-muted font-medium">
              Comienza agregando tu primera sucursal al sistema
            </p>
            <div className="mt-8">
              <button
                onClick={handleNew}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#3d8b40] transition-all"
              >
                <Plus className="h-4 w-4" />
                Registrar Sucursal
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Nombre
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Código
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Ubicación
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Estado
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Tipo
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-black text-text-dark group-hover:text-primary transition-colors tracking-tight">
                        {warehouse.name}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-[10px] font-black text-text-muted font-mono tracking-widest uppercase bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                        {warehouse.code}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-text-dark">
                        {warehouse.city && (
                          <span>{warehouse.city}</span>
                        )}
                        {warehouse.city && warehouse.country && ', '}
                        {warehouse.country && <span>{warehouse.country}</span>}
                        {!warehouse.city && !warehouse.country && (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>
                      {warehouse.address && (
                        <div className="text-[10px] text-text-muted font-medium line-clamp-1 mt-0.5">
                          {warehouse.address}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {warehouse.is_active ? (
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-primary"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Activa</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-gray-300"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inactiva</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {warehouse.is_central ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-royal-blue/10 text-royal-blue text-[10px] font-black tracking-widest uppercase border border-royal-blue/20">
                          Central
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sucursal</span>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(warehouse)}
                          className="p-2 text-text-muted hover:text-royal-blue hover:bg-royal-blue/5 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(warehouse.id, warehouse.name)}
                          disabled={deletingId === warehouse.id}
                          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30"
                          title="Desactivar"
                        >
                          <Trash2 className="h-5 w-5" />
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

