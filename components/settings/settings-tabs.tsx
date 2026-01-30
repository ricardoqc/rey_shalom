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
    <div className="bg-transparent">
      {/* Tabs Navigation */}
      <div className="px-10 py-2 bg-gray-50/50 border-b border-gray-100">
        <nav className="flex gap-4 overflow-x-auto scrollbar-hide py-3" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                  ${isActive
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white border-gray-100 text-text-muted hover:border-gray-200 hover:text-text-dark shadow-sm'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-10">
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
