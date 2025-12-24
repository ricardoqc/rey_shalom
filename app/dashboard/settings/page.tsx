import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getSettingsData } from '@/app/actions/settings'
import { SettingsTabs } from '@/components/settings/settings-tabs'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const settingsData = await getSettingsData()

  if (!settingsData) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona tu perfil, seguridad y preferencias
        </p>
      </div>

      <SettingsTabs
        user={user}
        profile={settingsData.profile}
        paymentMethods={settingsData.paymentMethods}
        socialLinks={settingsData.socialLinks}
        store={settingsData.store}
      />
    </div>
  )
}
