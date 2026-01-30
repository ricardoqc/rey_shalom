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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-primary rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">TUS ALIADOS</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Mi Equipo</h1>
          <p className="mt-2 text-text-muted font-medium">
            Gestiona y visualiza el crecimiento de tu red directa en tiempo real
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 group hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Global</span>
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Total Afiliados</p>
          <p className="text-4xl font-black text-text-dark tracking-tighter">{networkData.length}</p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 group hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black text-gold uppercase tracking-widest">Activos</span>
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Cuentas Activas</p>
          <p className="text-4xl font-black text-text-dark tracking-tighter">
            {networkData.filter((a) => a.isActive).length}
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 group hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 rounded-2xl bg-royal-blue/10 flex items-center justify-center text-royal-blue group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black text-royal-blue uppercase tracking-widest">Productividad</span>
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Ventas del Mes</p>
          <p className="text-4xl font-black text-text-dark tracking-tighter">
            S/ {networkData
              .reduce((sum, a) => sum + a.monthlySales, 0)
              .toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </p>
        </div>
      </div>

      {/* Network Table */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50">
          <h3 className="text-xl font-black text-text-dark tracking-tight">
            Afiliados Directos
          </h3>
          <p className="mt-1 text-sm text-text-muted font-medium">
            Lista de socios referidos directamente por tu código
          </p>
        </div>

        {networkData.length === 0 ? (
          <div className="px-10 py-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/50 -z-10"></div>
            <div className="mx-auto h-20 w-20 bg-white rounded-3xl shadow-inner flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-text-dark tracking-tight">
              Aún no tienes aliados
            </h3>
            <p className="mt-2 text-text-muted font-medium">
              Tu red de crecimiento comienza cuando compartes tu link de referido
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-10 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Socio Aliado
                  </th>
                  <th className="px-10 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Nivel Red
                  </th>
                  <th className="px-10 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Estado Actual
                  </th>
                  <th className="px-10 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Ventas Mes
                  </th>
                  <th className="px-10 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Puntos (PV)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {networkData.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-gray-50/50 transition-colors group cursor-default">
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                          {(affiliate.public_name || affiliate.referral_code || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-text-dark group-hover:text-primary transition-colors tracking-tight">
                            {affiliate.public_name || 'Sin nombre'}
                          </p>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-0.5">
                            ID: {affiliate.referral_code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-all">
                        Nivel {affiliate.level}
                      </span>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      {affiliate.isActive ? (
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Operativo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-gray-300"></span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Inactivo</span>
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-sm font-black text-text-dark">
                      S/ {affiliate.monthlySales.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-right">
                      <span className="text-sm font-black text-text-muted group-hover:text-text-dark transition-colors">
                        {affiliate.current_points || 0} <span className="text-[10px] opacity-50">PV</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
