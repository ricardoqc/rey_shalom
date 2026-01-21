import { Database } from '@/types/supabase'

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
    <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">
            Progreso hacia {nextRank.rank_name}
          </h3>
          <p className="mt-1 text-sm text-white/60">
            Rango actual: <span className="font-medium text-white">{currentRank}</span>
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/60">
              {currentPoints} / {nextRank.min_points} puntos
            </span>
            <span className="font-medium text-white">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full bg-gradient-to-r ${getRankColor(nextRank.rank_name)} transition-all duration-500 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Mensaje motivador */}
        <div
          className={`rounded-lg bg-gradient-to-r ${getRankColor(nextRank.rank_name)} p-4 text-black`}
        >
          <p className="text-sm font-medium">
            {pointsNeeded > 0 ? (
              <>
                ¡Estás a <span className="text-lg font-bold">{pointsNeeded}</span>{' '}
                puntos de ser <span className="font-bold">{nextRank.rank_name}</span>!
              </>
            ) : (
              <>
                ¡Ya alcanzaste los puntos necesarios para{' '}
                <span className="font-bold">{nextRank.rank_name}</span>!
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
