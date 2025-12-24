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
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6 flex-1">
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            <div className="flex items-center gap-x-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.public_name || user.email?.split('@')[0]}
                </p>
                <Badge className="bg-red-100 text-red-800">Admin</Badge>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
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

