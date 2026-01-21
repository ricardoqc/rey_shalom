import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?returnUrl=/admin')
  }

  // Verificar rol de admin
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  // Obtener perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#121212]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={user} profile={profile} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
