'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateUserProfile } from '@/app/actions/users'
import { Loader2, X, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Database } from '@/types/supabase'
import { Badge } from '@/components/ui/badge'

type Profile = Database['public']['Tables']['profiles']['Row']

const userFormSchema = z.object({
  public_name: z.string().min(1, 'El nombre es requerido').optional().or(z.literal('')),
  dni: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status_level: z.enum(['BRONCE', 'PLATA', 'ORO']),
  is_active: z.boolean(),
})

type UserFormData = z.infer<typeof userFormSchema>

interface UserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null
}

export function UserEditDialog({
  open,
  onOpenChange,
  profile,
}: UserEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      public_name: '',
      dni: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      status_level: 'BRONCE',
      is_active: true,
    },
  })

  const isActive = watch('is_active')
  const statusLevel = watch('status_level')

  // Resetear formulario cuando cambia el perfil o se abre/cierra
  useEffect(() => {
    if (open && profile) {
      reset({
        public_name: profile.public_name || '',
        dni: profile.dni || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        status_level: profile.status_level,
        is_active: profile.is_active,
      })
    }
  }, [open, profile, reset])

  const onSubmit = async (data: UserFormData) => {
    if (!profile) return

    setLoading(true)
    try {
      const result = await updateUserProfile(profile.id, {
        public_name: data.public_name || null,
        dni: data.dni || null,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        country: data.country || null,
        status_level: data.status_level,
        is_active: data.is_active,
      })

      if (result.success) {
        toast.success('Usuario actualizado exitosamente')
        onOpenChange(false)
        // Recargar página para ver cambios
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al actualizar usuario')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'ORO':
        return 'bg-yellow-100 text-yellow-800'
      case 'PLATA':
        return 'bg-gray-100 text-gray-800'
      case 'BRONCE':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!open || !profile) return null

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
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-lg">
              {getInitials(profile.public_name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Editar Usuario
              </h2>
              <p className="text-sm text-gray-500">
                {profile.referral_code}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="public_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre/Alias
                </label>
                <input
                  type="text"
                  id="public_name"
                  {...register('public_name')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
                {errors.public_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.public_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dni"
                  className="block text-sm font-medium text-gray-700"
                >
                  DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  {...register('dni')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  type="text"
                  id="phone"
                  {...register('phone')}
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
            </div>
          </div>

          {/* Rango y Estado */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rango y Estado
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="status_level"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Rango Actual
                </label>
                <select
                  id="status_level"
                  {...register('status_level')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="BRONCE">Bronce</option>
                  <option value="PLATA">Plata</option>
                  <option value="ORO">Oro</option>
                </select>
                {statusLevel && (
                  <div className="mt-2">
                    <Badge className={getRankBadgeColor(statusLevel)}>
                      {statusLevel}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de la Cuenta
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setValue('is_active', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Usuario activo
                    </span>
                  </label>
                  {!isActive && (
                    <Badge className="bg-red-100 text-red-800">
                      Baneado
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {isActive
                    ? 'El usuario puede acceder al sistema normalmente'
                    : 'El usuario está baneado y no puede acceder al sistema'}
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Información Adicional
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Puntos actuales:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {profile.current_points.toLocaleString('es-PE')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Puntos totales:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {profile.total_points_earned.toLocaleString('es-PE')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Código de referido:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {profile.referral_code}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Fecha de registro:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('es-PE')}
                </span>
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
              disabled={isSubmitting || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isSubmitting || loading) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

