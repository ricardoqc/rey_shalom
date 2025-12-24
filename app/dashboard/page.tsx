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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido a tu oficina virtual
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
          >
            <Shield className="h-5 w-5" />
            Panel de Administración
          </Link>
        )}
      </div>

      {/* KPI Cards - Primera fila */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card combinada de Balance y Ganancias */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-3">
            <div className={`rounded-md bg-green-100 p-3`}>
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Balance y Ganancias</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                ${stats.currentBalance.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    ${stats.monthlyEarnings.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>{' '}
                  ganancias del mes
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    ${stats.referralsEarnings.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>{' '}
                  ganancias de referidos
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Card combinada de Puntos */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-3">
            <div className={`rounded-md bg-yellow-100 p-3`}>
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Puntos</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {stats.profile.total_points_earned || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{stats.pointsThisMonth}</span> puntos este mes
              </p>
            </div>
          </div>
        </div>
        <StatsCard
          title="Rango Actual"
          value={stats.profile.status_level || 'BRONCE'}
          icon={Award}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Afiliados Directos"
          value={stats.directAffiliates}
          icon={Users}
          iconColor="text-blue-600"
        />
      </div>

      {/* KPI Cards - Segunda fila */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/store/${stats.profile.referral_code}`} target="_blank">
          <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Mi Tienda</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">Personalizada</p>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Store className="h-8 w-8" />
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Ver mi tienda personalizada</p>
          </div>
        </Link>
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
