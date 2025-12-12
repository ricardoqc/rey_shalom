import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Settings } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona tu perfil y preferencias
        </p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-gray-400" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Configuración
            </h3>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <p className="text-sm text-gray-500">
            La configuración de perfil estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}

