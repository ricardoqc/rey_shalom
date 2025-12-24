'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createWarehouse, updateWarehouse } from '@/app/actions/warehouses'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Database } from '@/types/supabase'

type Warehouse = Database['public']['Tables']['warehouses']['Row']

const warehouseFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_central: z.boolean().optional(),
})

type WarehouseFormData = z.infer<typeof warehouseFormSchema>

interface WarehouseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse?: Warehouse | null
}

export function WarehouseDialog({
  open,
  onOpenChange,
  warehouse,
}: WarehouseDialogProps) {
  const isEditing = !!warehouse
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      city: '',
      country: 'Perú',
      is_central: false,
    },
  })

  // Resetear formulario cuando cambia el warehouse o se abre/cierra
  useEffect(() => {
    if (open) {
      if (warehouse) {
        reset({
          name: warehouse.name,
          code: warehouse.code,
          address: warehouse.address || '',
          city: warehouse.city || '',
          country: warehouse.country || 'Perú',
          latitude: warehouse.latitude || undefined,
          longitude: warehouse.longitude || undefined,
          is_central: warehouse.is_central || false,
        })
      } else {
        reset({
          name: '',
          code: '',
          address: '',
          city: '',
          country: 'Perú',
          is_central: false,
        })
      }
    }
  }, [open, warehouse, reset])

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      let result
      if (isEditing && warehouse) {
        result = await updateWarehouse(warehouse.id, data)
      } else {
        result = await createWarehouse(data)
      }

      if (result.success) {
        toast.success(
          isEditing
            ? 'Sucursal actualizada exitosamente'
            : 'Sucursal creada exitosamente'
        )
        onOpenChange(false)
        // Recargar página para ver cambios
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al guardar sucursal')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Código *
              </label>
              <input
                type="text"
                id="code"
                {...register('code')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Dirección
              </label>
              <textarea
                id="address"
                rows={2}
                {...register('address')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                {...register('city')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                País
              </label>
              <input
                type="text"
                id="country"
                {...register('country')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700"
              >
                Latitud
              </label>
              <input
                type="number"
                id="latitude"
                step="0.00000001"
                {...register('latitude', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700"
              >
                Longitud
              </label>
              <input
                type="number"
                id="longitude"
                step="0.00000001"
                {...register('longitude', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_central"
                  {...register('is_central')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="is_central"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Marcar como bodega central
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                isEditing ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

