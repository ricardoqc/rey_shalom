'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  updateUserProfile, 
  getUserAffiliates, 
  addAffiliate, 
  removeAffiliate,
  searchUsersForSponsor 
} from '@/app/actions/users'
import { createClient } from '@/utils/supabase/client'
import { Loader2, X, User as UserIcon, Users, UserPlus, UserMinus, Search } from 'lucide-react'
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

type Affiliate = {
  id: string
  public_name: string | null
  referral_code: string
  status_level: 'BRONCE' | 'PLATA' | 'ORO'
  current_points: number
  created_at: string
  is_active: boolean
}

type SponsorOption = {
  id: string
  public_name: string | null
  referral_code: string
  status_level: 'BRONCE' | 'PLATA' | 'ORO'
  is_active: boolean
}

export function UserEditDialog({
  open,
  onOpenChange,
  profile,
}: UserEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loadingAffiliates, setLoadingAffiliates] = useState(false)
  const [sponsor, setSponsor] = useState<{ id: string; name: string; code: string } | null>(null)
  const [loadingSponsor, setLoadingSponsor] = useState(false)
  const [showSponsorSearch, setShowSponsorSearch] = useState(false)
  const [sponsorSearchQuery, setSponsorSearchQuery] = useState('')
  const [sponsorOptions, setSponsorOptions] = useState<SponsorOption[]>([])
  const [loadingSponsorSearch, setLoadingSponsorSearch] = useState(false)
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

  // Cargar datos del usuario cuando se abre el diálogo
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

      // Cargar sponsor actual
      loadSponsor()
      // Cargar afiliados
      loadAffiliates()
    }
  }, [open, profile, reset])

  // Cargar sponsor actual
  const loadSponsor = async () => {
    if (!profile?.sponsor_id) {
      setSponsor(null)
      return
    }

    setLoadingSponsor(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, public_name, referral_code')
        .eq('id', profile.sponsor_id)
        .single()

      if (!error && data) {
        setSponsor({
          id: (data as any).id,
          name: (data as any).public_name || 'Sin nombre',
          code: (data as any).referral_code,
        })
      } else {
        setSponsor(null)
      }
    } catch (error) {
      console.error('Error al cargar sponsor:', error)
      setSponsor(null)
    } finally {
      setLoadingSponsor(false)
    }
  }

  // Cargar afiliados directos
  const loadAffiliates = async () => {
    if (!profile) return

    setLoadingAffiliates(true)
    try {
      const result = await getUserAffiliates(profile.id)
      if (result.success && result.data) {
        setAffiliates(result.data)
      }
    } catch (error) {
      console.error('Error al cargar afiliados:', error)
    } finally {
      setLoadingAffiliates(false)
    }
  }

  // Buscar usuarios para asignar como sponsor
  const handleSponsorSearch = async (query: string) => {
    setSponsorSearchQuery(query)
    if (!query || query.length < 2) {
      setSponsorOptions([])
      return
    }

    setLoadingSponsorSearch(true)
    try {
      const result = await searchUsersForSponsor(query, profile?.id)
      if (result.success && result.data) {
        setSponsorOptions(result.data)
      }
    } catch (error) {
      console.error('Error al buscar usuarios:', error)
    } finally {
      setLoadingSponsorSearch(false)
    }
  }

  // Asignar nuevo sponsor
  const handleAssignSponsor = async (sponsorId: string) => {
    if (!profile) return

    setLoading(true)
    try {
      const result = await addAffiliate(profile.id, sponsorId)
      if (result.success) {
        toast.success('Sponsor asignado exitosamente')
        setShowSponsorSearch(false)
        setSponsorSearchQuery('')
        setSponsorOptions([])
        await loadSponsor()
        await loadAffiliates()
      } else {
        toast.error(result.error || 'Error al asignar sponsor')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  // Eliminar sponsor
  const handleRemoveSponsor = async () => {
    if (!profile) return

    if (!confirm('¿Estás seguro de que deseas eliminar el sponsor de este usuario?')) {
      return
    }

    setLoading(true)
    try {
      const result = await removeAffiliate(profile.id)
      if (result.success) {
        toast.success('Sponsor eliminado exitosamente')
        setSponsor(null)
        await loadAffiliates()
      } else {
        toast.error(result.error || 'Error al eliminar sponsor')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UserFormData) => {
    if (!profile) return

    setLoading(true)
    try {
      const result = await updateUserProfile(profile.id, {
        public_name: data.public_name || undefined,
        dni: data.dni || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        country: data.country || undefined,
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

          {/* Gestión de Afiliados (Solo Super Admin) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Afiliados
            </h3>
            
            {/* Sponsor Actual */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Sponsor Actual</h4>
                {sponsor && (
                  <button
                    type="button"
                    onClick={handleRemoveSponsor}
                    disabled={loading}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
                  >
                    <UserMinus className="h-3 w-3" />
                    Eliminar
                  </button>
                )}
              </div>
              {loadingSponsor ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando...
                </div>
              ) : sponsor ? (
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{sponsor.name}</p>
                  <p className="text-gray-500">Código: {sponsor.code}</p>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Este usuario no tiene sponsor asignado
                </div>
              )}
              
              {/* Botón para agregar/cambiar sponsor */}
              {!showSponsorSearch ? (
                <button
                  type="button"
                  onClick={() => setShowSponsorSearch(true)}
                  disabled={loading}
                  className="mt-3 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                >
                  <UserPlus className="h-3 w-3" />
                  {sponsor ? 'Cambiar Sponsor' : 'Asignar Sponsor'}
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o código de referido..."
                      value={sponsorSearchQuery}
                      onChange={(e) => handleSponsorSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {loadingSponsorSearch && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Buscando...
                    </div>
                  )}
                  {sponsorOptions.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                      {sponsorOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleAssignSponsor(option.id)}
                          disabled={loading}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 disabled:opacity-50"
                        >
                          <div className="font-medium text-gray-900">
                            {option.public_name || 'Sin nombre'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {option.referral_code} • {option.status_level}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSponsorSearch(false)
                      setSponsorSearchQuery('')
                      setSponsorOptions([])
                    }}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Lista de Afiliados Directos */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Afiliados Directos ({affiliates.length})
              </h4>
              {loadingAffiliates ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando afiliados...
                </div>
              ) : affiliates.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {affiliates.map((affiliate) => (
                    <div
                      key={affiliate.id}
                      className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {affiliate.public_name || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {affiliate.referral_code} • {affiliate.status_level} •{' '}
                          {affiliate.current_points.toLocaleString('es-PE')} pts
                        </p>
                      </div>
                      <Badge
                        className={
                          affiliate.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {affiliate.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Este usuario no tiene afiliados directos
                </p>
              )}
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

