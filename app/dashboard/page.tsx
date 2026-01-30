import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getDashboardStats } from '@/app/actions/dashboard'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RankProgress } from '@/components/dashboard/rank-progress'
import { ReferralLink } from '@/components/dashboard/referral-link'
import { DollarSign, TrendingUp, Users, Award, Wallet, Star, Store, ExternalLink, Shield } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const stats = await getDashboardStats(user.id)

  if (!stats.profile) {
    redirect('/auth/login')
  }

  // Verificar si el usuario es admin
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  const isAdmin = userRole === 'admin'

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-primary rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">RESUMEN GENERAL</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Tu Oficina Virtual</h1>
          <p className="mt-2 text-text-muted font-medium">
            Bienvenido de nuevo, <span className="text-primary font-bold">{(stats.profile as any).public_name}</span>. Gestiona tu red y ganancias.
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-primary rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary/80 transition-all border border-primary/10"
          >
            <Shield className="h-4 w-4" />
            Panel Control
          </Link>
        )}
      </div>

      {/* KPI Cards - Primera fila */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card combinada de Balance y Ganancias */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Balance Global</span>
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-text-dark tracking-tighter">
              S/ {stats.currentBalance.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Este Mes</span>
                <span className="text-xs font-black text-primary">
                  S/ {stats.monthlyEarnings.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Referidos</span>
                <span className="text-xs font-black text-gold">
                  S/ {stats.referralsEarnings.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card combinada de Puntos */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gold"></div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mis Puntos</span>
              <div className="size-10 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <Star className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-text-dark tracking-tighter">
              {(stats.profile as any).total_points_earned || 0} <span className="text-sm text-text-muted uppercase">PV</span>
            </p>
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Acumulados este mes</span>
              <span className="text-xs font-black text-gold">{stats.pointsThisMonth}</span>
            </div>
          </div>
        </div>

        <StatsCard
          title="Rango Actual"
          value={(stats.profile as any).status_level || 'BRONCE'}
          icon={Award}
          iconColor="text-royal-blue"
        />
        <StatsCard
          title="Aliados Directos"
          value={stats.directAffiliates}
          icon={Users}
          iconColor="text-primary"
        />
      </div>

      {/* KPI Cards - Segunda fila */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Link href={`/store/${(stats.profile as any).referral_code}`} target="_blank">
          <div className="premium-card p-10 group relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-primary/5 -skew-x-12 translate-x-1/2 group-hover:translate-x-0 transition-transform duration-700"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">En Línea</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-text-dark tracking-tighter">Mi Tienda Rey Shalom</h3>
                  <p className="text-text-muted font-medium mt-1">Tu escaparate personalizado listo para vender</p>
                </div>
                <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all">
                  <span className="text-xs font-black uppercase tracking-widest">Ver Catálogo</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
              <div className="hidden sm:flex size-24 rounded-3xl bg-white shadow-2xl border border-gray-50 items-center justify-center text-primary transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <Store className="h-10 w-10" />
              </div>
            </div>
          </div>
        </Link>

        {/* Referral Link Redesigned Placeholder - Will be the ReferralLink component */}
        <ReferralLink referralCode={(stats.profile as any).referral_code} />
      </div>

      {/* Gamificación - Barra de Progreso */}
      <div className="max-w-4xl mx-auto">
        <RankProgress
          profile={stats.profile}
          rankRequirements={stats.rankRequirements}
        />
      </div>
    </div>
  )
}
