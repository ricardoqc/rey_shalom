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
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        {/* Header con búsqueda y filtros */}
        <div className="px-8 py-6 border-b border-gray-50">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Búsqueda */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Buscar por nombre, DNI o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-full text-text-dark placeholder:text-gray-300 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            {/* Filtro de rango */}
            <div className="lg:w-64">
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value as typeof rankFilter)}
                className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-full text-text-dark font-black text-sm uppercase tracking-widest focus:bg-white focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">🌟 Todos los rangos</option>
                <option value="BRONCE">🥉 Bronce</option>
                <option value="PLATA">🥈 Plata</option>
                <option value="ORO">🥇 Oro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        {filteredProfiles.length === 0 ? (
          <div className="p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/50 -z-10"></div>
            <div className="mx-auto h-20 w-20 bg-white rounded-3xl shadow-inner flex items-center justify-center mb-6">
              <UserIcon className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-text-dark tracking-tight">
              No se encontraron usuarios
            </h3>
            <p className="mt-2 text-text-muted font-medium">
              {searchQuery || rankFilter !== 'ALL'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay usuarios registrados actualmente'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Usuario
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    DNI
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Rango
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Puntos
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Estado
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProfiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                    onClick={() => handleEdit(profile)}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-royal-blue/10 flex items-center justify-center text-royal-blue font-black shadow-inner">
                          {getInitials(profile.public_name)}
                        </div>
                        <div>
                          <div className="text-sm font-black text-text-dark group-hover:text-royal-blue transition-colors tracking-tight">
                            {profile.public_name || 'Sin nombre'}
                          </div>
                          <div className="text-[10px] font-bold text-text-muted font-mono tracking-widest uppercase mt-0.5">
                            {profile.referral_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-text-muted font-mono">
                      {profile.dni || '-'}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${profile.status_level === 'ORO' ? 'bg-gold/10 text-gold border-gold/20' :
                          profile.status_level === 'PLATA' ? 'bg-gray-100 text-gray-400 border-gray-200' :
                            'bg-red-50 text-red-500 border-red-100'
                        }`}>
                        {profile.status_level}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-black text-text-dark tracking-tight">
                        {profile.current_points.toLocaleString('es-PE')} <span className="text-[10px] text-text-muted">PV</span>
                      </div>
                      <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                        Total acumulado: {profile.total_points_earned.toLocaleString('es-PE')}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {profile.is_active ? (
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-red-400"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Baneado</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(profile)
                        }}
                        className="p-2 text-text-muted hover:text-royal-blue hover:bg-royal-blue/5 rounded-xl transition-all"
                        title="Gestionar usuario"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer con contador */}
        <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-royal-blue/30"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              Mostrando {filteredProfiles.length} de {profiles.length} aliados registrados
            </p>
          </div>
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
