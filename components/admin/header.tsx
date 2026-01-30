import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { Badge } from '@/components/ui/badge'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AdminHeaderProps {
  user: User
  profile: Profile | null
}

export function AdminHeader({ user, profile }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6 flex-1">
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            <div className="flex items-center gap-x-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold text-text-dark leading-tight">
                  {profile?.public_name || user.email?.split('@')[0]}
                </p>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  ADMINISTRADOR
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#3d8b40] flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-sm font-black text-white">
                  {(profile?.public_name || user.email?.[0] || 'A').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
