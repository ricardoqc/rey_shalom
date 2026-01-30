import { Database } from '@/types/supabase'
import { Star } from 'lucide-react'

type Profile = Database['public']['Tables']['profiles']['Row']
type RankRequirement = Database['public']['Tables']['rank_requirements']['Row']

interface RankProgressProps {
  profile: Profile
  rankRequirements: RankRequirement[]
}

export function RankProgress({ profile, rankRequirements }: RankProgressProps) {
  const currentRank = profile.status_level || 'BRONCE'
  const currentPoints = profile.current_points || 0

  // Ordenar rangos por puntos
  const sortedRanks = [...rankRequirements].sort(
    (a, b) => a.min_points - b.min_points
  )

  // Encontrar el rango actual y el siguiente
  const currentRankIndex = sortedRanks.findIndex(
    (r) => r.rank_name === currentRank
  )
  const nextRank = sortedRanks[currentRankIndex + 1]

  if (!nextRank) {
    // Ya está en el rango más alto
    return (
      <div className="rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 text-black shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">¡Felicidades!</h3>
            <p className="text-sm opacity-90">
              Has alcanzado el rango máximo: {currentRank}
            </p>
          </div>
          <div className="text-3xl">🏆</div>
        </div>
      </div>
    )
  }

  const pointsNeeded = nextRank.min_points - currentPoints
  const pointsFromCurrentRank = currentPoints - sortedRanks[currentRankIndex].min_points
  const pointsToNextRank = nextRank.min_points - sortedRanks[currentRankIndex].min_points
  const progressPercentage = Math.min(
    Math.max((pointsFromCurrentRank / pointsToNextRank) * 100, 0),
    100
  )

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'ORO':
        return 'from-[#FFD700] to-[#FFA500]'
      case 'PLATA':
        return 'from-gray-400 to-gray-600'
      case 'BRONCE':
        return 'from-orange-400 to-orange-600'
      default:
        return 'from-gray-300 to-gray-500'
    }
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-[2.5rem] relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="p-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] block mb-2">ROADMAP DE RANGO</span>
            <h3 className="text-3xl font-black text-text-dark tracking-tighter">
              Aspirando a <span className="text-primary italic underline underline-offset-8 decoration-primary/20">{nextRank.rank_name}</span>
            </h3>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
            <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-black">
              {currentRankIndex + 1}
            </div>
            <div>
              <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Paso Actual</p>
              <p className="text-xs font-black text-text-dark uppercase tracking-widest">{currentRank}</p>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-text-dark tracking-tighter">{currentPoints}</span>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">/ {nextRank.min_points} PV</span>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
              {progressPercentage.toFixed(0)}% COMPLETADO
            </div>
          </div>

          <div className="h-6 w-full overflow-hidden rounded-full bg-gray-50 border border-gray-100 p-1">
            <div
              className={`h-full rounded-full shadow-lg shadow-primary/20 transition-all duration-1000 ease-out relative group`}
              style={{
                width: `${progressPercentage}%`,
                background: `linear-gradient(90deg, var(--primary) 0%, var(--gold) 100%)`
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Mensaje motivador */}
        <div className="mt-12 flex items-center gap-6 p-8 rounded-[1.5rem] bg-gradient-to-br from-primary to-[#3d8b40] text-white shadow-xl shadow-primary/20 relative overflow-hidden group/alert">
          <div className="absolute right-0 bottom-0 size-32 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl group-hover/alert:scale-150 transition-transform duration-700"></div>

          <div className="size-16 hidden sm:flex shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 transform rotate-12">
            <Star className="size-8 text-white fill-white" />
          </div>

          <div className="relative z-10">
            {pointsNeeded > 0 ? (
              <>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-75">PRÓXIMO OBJETIVO</p>
                <p className="text-xl font-bold tracking-tight">
                  ¡Solo te faltan <span className="text-2xl font-black italic">{pointsNeeded}</span> PV para convertirte en <span className="underline underline-offset-4 decoration-white/40">{nextRank.rank_name}</span> oficialmente!
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-75">TOTALMENTE CALIFICADO</p>
                <p className="text-xl font-bold tracking-tight">
                  ¡Increíble! Ya tienes los puntos para el rango <span className="font-black italic">{nextRank.rank_name}</span>. ¡Muy pronto se actualizará tu perfil!
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
