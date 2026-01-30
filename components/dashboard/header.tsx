import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { Badge } from '@/components/ui/badge'

const getRankColor = (rank: string) => {
  switch (rank) {
    case 'ORO':
      return 'bg-gold/10 text-gold border-gold/20'
    case 'PLATA':
      return 'bg-gray-100 text-gray-400 border-gray-200'
    case 'BRONCE':
      return 'bg-red-50 text-red-400 border-red-100'
    default:
      return 'bg-gray-50 text-gray-400 border-gray-100'
  }
}

type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6 flex-1">
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            <div className="flex items-center gap-x-3 group cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-text-dark group-hover:text-primary transition-colors tracking-tight">
                  {profile?.public_name || user.email?.split('@')[0]}
                </p>
                <div className={`mt-0.5 inline-flex items-center px-3 py-0.5 rounded-full text-[8px] font-black tracking-[0.2em] uppercase border ${getRankColor(profile?.status_level || 'BRONCE')}`}>
                  {profile?.status_level || 'BRONCE'}
                </div>
              </div>
              <div className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/20 transform group-hover:scale-105 transition-transform">
                <span className="text-sm">
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
