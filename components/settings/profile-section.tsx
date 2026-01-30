'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

interface ProfileSectionProps {
  profile: any
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    whatsapp_number: profile?.whatsapp_number || '',
    whatsapp_type: profile?.whatsapp_type || 'personal',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || 'Perú',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateProfile(formData)

      if (result.success) {
        toast.success('Perfil actualizado exitosamente')
      } else {
        toast.error(result.error || 'Error al actualizar perfil')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-black text-text-dark tracking-tight">Datos de Contacto y Dirección</h2>
        <p className="mt-1 text-sm text-text-muted font-medium">
          Actualiza tu información de contacto y dirección para envíos y bonificaciones
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teléfono */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Teléfono Principal
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
              placeholder="+51 987 654 321"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="whatsapp_number" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Número de WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
              placeholder="+51 987 654 321"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="whatsapp_type" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Tipo de Cuenta WhatsApp
            </label>
            <select
              id="whatsapp_type"
              value={formData.whatsapp_type}
              onChange={(e) => setFormData({ ...formData, whatsapp_type: e.target.value as 'personal' | 'business' })}
              className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold appearance-none cursor-pointer"
            >
              <option value="personal">Cuenta Personal</option>
              <option value="business">Cuenta Business</option>
            </select>
          </div>

          {/* País */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              País de Residencia
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
              placeholder="Perú"
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
            Dirección Completa
          </label>
          <textarea
            id="address"
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="block w-full rounded-3xl bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
            placeholder="Calle, número, urbanización, referencia..."
          />
        </div>

        {/* Ciudad */}
        <div className="space-y-2">
          <label htmlFor="city" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
            Ciudad / Distrito
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
            placeholder="Lima"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}





