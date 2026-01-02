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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Datos de Contacto y Dirección</h2>
        <p className="mt-1 text-sm text-gray-500">
          Actualiza tu información de contacto y dirección de envío
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="+51 987 654 321"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
            Número de WhatsApp
          </label>
          <input
            type="tel"
            id="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="+51 987 654 321"
          />
          <p className="mt-1 text-xs text-gray-500">
            Formato: +51 987 654 321 (incluye código de país)
          </p>
        </div>

        {/* Tipo de WhatsApp */}
        <div>
          <label htmlFor="whatsapp_type" className="block text-sm font-medium text-gray-700">
            Tipo de WhatsApp
          </label>
          <select
            id="whatsapp_type"
            value={formData.whatsapp_type}
            onChange={(e) => setFormData({ ...formData, whatsapp_type: e.target.value as 'personal' | 'business' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <textarea
            id="address"
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Calle, número, referencia"
          />
        </div>

        {/* Ciudad */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Lima"
          />
        </div>

        {/* País */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            País
          </label>
          <input
            type="text"
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Perú"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
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



