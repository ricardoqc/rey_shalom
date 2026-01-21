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
        return 'bg-[#FFD700] text-black'
      case 'PLATA':
        return 'bg-gray-400 text-black'
      case 'BRONCE':
        return 'bg-orange-400 text-black'
      default:
        return 'bg-white/10 text-white'
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
      <div className="bg-white/5 border border-white/10 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Header con búsqueda y filtros */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nombre, DNI o código de referido..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:ring-[#ea2a33] focus:border-[#ea2a33] focus:outline-none"
              />
            </div>

            {/* Filtro de rango */}
            <div className="sm:w-48">
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value as typeof rankFilter)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:ring-[#ea2a33] focus:border-[#ea2a33] focus:outline-none"
              >
                <option value="ALL" className="bg-[#121212]">Todos los rangos</option>
                <option value="BRONCE" className="bg-[#121212]">Bronce</option>
                <option value="PLATA" className="bg-[#121212]">Plata</option>
                <option value="ORO" className="bg-[#121212]">Oro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-white/40" />
            <h3 className="mt-2 text-sm font-medium text-white">
              No se encontraron usuarios
            </h3>
            <p className="mt-1 text-sm text-white/60">
              {searchQuery || rankFilter !== 'ALL'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay usuarios registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Rango
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Puntos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/60">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {filteredProfiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => handleEdit(profile)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#ea2a33] flex items-center justify-center text-white font-medium">
                          {getInitials(profile.public_name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {profile.public_name || 'Sin nombre'}
                          </div>
                          <div className="text-sm text-white/60">
                            {profile.referral_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {profile.dni || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRankBadgeColor(profile.status_level)}>
                        {profile.status_level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {profile.current_points.toLocaleString('es-PE')}
                      </div>
                      <div className="text-xs text-white/60">
                        Total: {profile.total_points_earned.toLocaleString('es-PE')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30">
                        Usuario
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {profile.is_active ? (
                        <Badge className="bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30">
                          Activo
                        </Badge>
                      ) : (
                        <Badge className="bg-[#ea2a33]/20 text-[#ea2a33] border border-[#ea2a33]/30">
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
                        className="text-[#ea2a33] hover:text-[#d11a23] transition-colors"
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
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          <p className="text-sm text-white/60">
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

