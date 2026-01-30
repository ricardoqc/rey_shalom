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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-primary rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">AJUSTES DE CUENTA</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Configuración</h1>
          <p className="mt-2 text-text-muted font-medium">
            Personaliza tu perfil, seguridad y preferencias de red
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-[3rem] overflow-hidden">
        <SettingsTabs
          user={user}
          profile={settingsData.profile}
          paymentMethods={settingsData.paymentMethods}
          socialLinks={settingsData.socialLinks}
          store={settingsData.store}
        />
      </div>
    </div>
  )
}
