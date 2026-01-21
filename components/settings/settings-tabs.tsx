'use client'

import { useState } from 'react'
import { User, Lock, CreditCard, Share2, Store, Info } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { SecuritySection } from './security-section'
import { PaymentMethodsSection } from './payment-methods-section'
import { SocialLinksSection } from './social-links-section'
import { StoreSection } from './store-section'
import { AccountInfoSection } from './account-info-section'

interface SettingsTabsProps {
  user: any
  profile: any
  paymentMethods: any[]
  socialLinks: any[]
  store: any
}

const tabs = [
  { id: 'profile', name: 'Perfil', icon: User },
  { id: 'security', name: 'Seguridad', icon: Lock },
  { id: 'payment', name: 'Métodos de Pago', icon: CreditCard },
  { id: 'social', name: 'Redes Sociales', icon: Share2 },
  { id: 'store', name: 'Mi Tienda', icon: Store },
  { id: 'account', name: 'Información de Cuenta', icon: Info },
]

export function SettingsTabs({
  user,
  profile,
  paymentMethods,
  socialLinks,
  store,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="bg-white/5 border border-white/10 shadow-lg rounded-xl backdrop-blur-sm">
      {/* Tabs Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${
                    isActive
                      ? 'border-[#ea2a33] text-[#ea2a33]'
                      : 'border-transparent text-white/60 hover:text-white hover:border-white/30'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'profile' && (
          <ProfileSection profile={profile} />
        )}
        {activeTab === 'security' && (
          <SecuritySection />
        )}
        {activeTab === 'payment' && (
          <PaymentMethodsSection paymentMethods={paymentMethods} />
        )}
        {activeTab === 'social' && (
          <SocialLinksSection socialLinks={socialLinks} />
        )}
        {activeTab === 'store' && (
          <StoreSection store={store} profile={profile} />
        )}
        {activeTab === 'account' && (
          <AccountInfoSection user={user} profile={profile} />
        )}
      </div>
    </div>
  )
}
