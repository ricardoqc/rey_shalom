'use client'

import { useState, useMemo } from 'react'
import { Search, Edit2, User as UserIcon } from 'lucide-react'
import { Database } from '@/types/supabase'
import { UserEditDialog } from './user-edit-dialog'
import { Badge } from '@/components/ui/badge'

type Profile = Database['public']['Tables']['profiles']['Row']

interface UsersTableProps {
  initialProfiles: Profile[]
}

export function UsersTable({ initialProfiles }: UsersTableProps) {
  const [profiles] = useState<Profile[]>(initialProfiles)
  const [searchQuery, setSearchQuery] = useState('')
  const [rankFilter, setRankFilter] = useState<'ALL' | 'BRONCE' | 'PLATA' | 'ORO'>('ALL')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  // Filtrar perfiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchQuery === '' ||
        profile.public_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.dni?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.referral_code.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtro de rango
      const matchesRank = rankFilter === 'ALL' || profile.status_level === rankFilter

      return matchesSearch && matchesRank
    })
  }, [profiles, searchQuery, rankFilter])

  const handleEdit = (profile: Profile) => {
    setSelectedProfile(profile)
    setDialogOpen(true)
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

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header con búsqueda y filtros */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, DNI o código de referido..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro de rango */}
            <div className="sm:w-48">
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value as typeof rankFilter)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos los rangos</option>
                <option value="BRONCE">Bronce</option>
                <option value="PLATA">Plata</option>
                <option value="ORO">Oro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron usuarios
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || rankFilter !== 'ALL'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay usuarios registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rango
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Puntos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEdit(profile)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {getInitials(profile.public_name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {profile.public_name || 'Sin nombre'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {profile.referral_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {profile.dni || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRankBadgeColor(profile.status_level)}>
                        {profile.status_level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {profile.current_points.toLocaleString('es-PE')}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: {profile.total_points_earned.toLocaleString('es-PE')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* El rol se obtiene desde auth.users, por ahora mostramos 'user' por defecto */}
                      {/* En producción, deberías obtenerlo desde auth.users usando Admin API */}
                      <Badge className="bg-blue-100 text-blue-800">
                        Usuario
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {profile.is_active ? (
                        <Badge className="bg-green-100 text-green-800">
                          Activo
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          Baneado
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(profile)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer con contador */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Mostrando {filteredProfiles.length} de {profiles.length} usuarios
          </p>
        </div>
      </div>

      <UserEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={selectedProfile}
      />
    </>
  )
}

