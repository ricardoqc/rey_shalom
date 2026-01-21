import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getNetworkData } from '@/app/actions/dashboard'
import { Users, TrendingUp, DollarSign, Circle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function NetworkPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const networkData = await getNetworkData(user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Equipo</h1>
        <p className="mt-1 text-sm text-white/60">
          Gestiona y visualiza tu red de afiliados
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-[#4CAF50]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-white/60">
                    Total Afiliados
                  </dt>
                  <dd className="text-2xl font-semibold text-white">
                    {networkData.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-[#FFD700]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-white/60">
                    Afiliados Activos
                  </dt>
                  <dd className="text-2xl font-semibold text-white">
                    {networkData.filter((a) => a.isActive).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-[#ea2a33]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-white/60">
                    Ventas del Mes
                  </dt>
                  <dd className="text-2xl font-semibold text-white">
                    $
                    {networkData
                      .reduce((sum, a) => sum + a.monthlySales, 0)
                      .toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Table */}
      <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-white">
            Afiliados Directos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-white/60">
            Personas que se registraron usando tu código de referido
          </p>
        </div>
        <div className="border-t border-white/10">
          {networkData.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6">
              <Users className="mx-auto h-12 w-12 text-white/40" />
              <h3 className="mt-2 text-sm font-medium text-white">
                No tienes afiliados aún
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Comparte tu link de referido para comenzar a construir tu red
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Afiliado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Nivel
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Ventas del Mes
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Puntos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-white/5">
                  {networkData.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-white/10 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ea2a33]">
                              <span className="text-sm font-medium text-white">
                                {(affiliate.public_name || affiliate.referral_code || 'U')[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {affiliate.public_name || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-white/60">
                              {affiliate.referral_code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white/60">
                        <Badge className="bg-[#ea2a33]/20 text-[#ea2a33] border border-[#ea2a33]/30">
                          Nivel {affiliate.level}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {affiliate.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#4CAF50]/20 text-[#4CAF50] px-2.5 py-0.5 text-xs font-medium border border-[#4CAF50]/30">
                            <Circle className="h-2 w-2 fill-current" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white/60 px-2.5 py-0.5 text-xs font-medium border border-white/10">
                            <Circle className="h-2 w-2 fill-current" />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                        $
                        {affiliate.monthlySales.toLocaleString('es-PE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white/60">
                        {affiliate.current_points || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
