import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { Badge } from '@/components/ui/badge'

type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const getRankColor = (rank: string) => {
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

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-[#121212]/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6 flex-1">
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            <div className="flex items-center gap-x-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-white">
                  {profile?.public_name || user.email?.split('@')[0]}
                </p>
                <Badge
                  className={getRankColor(profile?.status_level || 'BRONCE')}
                >
                  Nivel {profile?.status_level || 'BRONCE'}
                </Badge>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#ea2a33] flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {(profile?.public_name || user.email?.[0] || 'U').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
