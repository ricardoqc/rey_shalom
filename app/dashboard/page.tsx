import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getDashboardStats } from '@/app/actions/dashboard'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RankProgress } from '@/components/dashboard/rank-progress'
import { ReferralLink } from '@/components/dashboard/referral-link'
import { DollarSign, TrendingUp, Users, Award } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido a tu oficina virtual
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ganancias Totales"
          value={`$${stats.totalEarnings.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Puntos del Mes"
          value={stats.pointsThisMonth}
          icon={TrendingUp}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Afiliados Directos"
          value={stats.directAffiliates}
          icon={Users}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Rango Actual"
          value={stats.profile.status_level || 'BRONCE'}
          icon={Award}
          iconColor="text-yellow-600"
        />
      </div>

      {/* Gamificación - Barra de Progreso */}
      <RankProgress
        profile={stats.profile}
        rankRequirements={stats.rankRequirements}
      />

      {/* Herramienta de Marketing - Link de Referido */}
      <ReferralLink referralCode={stats.profile.referral_code} />
    </div>
  )
}
