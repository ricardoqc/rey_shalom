'use client'

import { useState } from 'react'
import { updateStore } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Save, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface StoreSectionProps {
  store: any
  profile: any
}

const themes = [
  { value: 'default', label: 'Por Defecto', color: 'bg-gray-500' },
  { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
  { value: 'green', label: 'Verde', color: 'bg-green-500' },
  { value: 'purple', label: 'Morado', color: 'bg-purple-500' },
  { value: 'orange', label: 'Naranja', color: 'bg-orange-500' },
  { value: 'pink', label: 'Rosa', color: 'bg-pink-500' },
  { value: 'dark', label: 'Oscuro', color: 'bg-gray-900' },
]

export function StoreSection({ store, profile }: StoreSectionProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    store_name: store?.store_name || profile?.public_name || '',
    store_description: store?.store_description || '',
    store_banner_url: store?.store_banner_url || '',
    store_logo_url: store?.store_logo_url || '',
    store_theme: store?.store_theme || 'default',
    seo_keywords: store?.seo_keywords || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateStore(formData)

      if (result.success) {
        toast.success('Tienda actualizada exitosamente')
      } else {
        toast.error(result.error || 'Error al actualizar tienda')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Mi Tienda Personalizada</h2>
          <p className="mt-1 text-sm text-gray-500">
            Personaliza cómo se ve tu tienda para tus clientes
          </p>
        </div>
        {profile?.referral_code && (
          <Link
            href={`/store/${profile.referral_code}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Mi Tienda
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de la Tienda */}
        <div>
          <label htmlFor="store_name" className="block text-sm font-medium text-gray-700">
            Nombre de la Tienda
          </label>
          <input
            type="text"
            id="store_name"
            value={formData.store_name}
            onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={profile?.public_name || 'Nombre de tu tienda'}
          />
          <p className="mt-1 text-xs text-gray-500">
            Si no especificas un nombre, se usará tu nombre público
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="store_description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="store_description"
            rows={4}
            value={formData.store_description}
            onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe tu tienda, productos destacados, etc."
          />
        </div>

        {/* Banner URL */}
        <div>
          <label htmlFor="store_banner_url" className="block text-sm font-medium text-gray-700">
            URL del Banner
          </label>
          <input
            type="url"
            id="store_banner_url"
            value={formData.store_banner_url}
            onChange={(e) => setFormData({ ...formData, store_banner_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://ejemplo.com/banner.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL de la imagen del banner (recomendado: 1200x300px)
          </p>
        </div>

        {/* Logo URL */}
        <div>
          <label htmlFor="store_logo_url" className="block text-sm font-medium text-gray-700">
            URL del Logo
          </label>
          <input
            type="url"
            id="store_logo_url"
            value={formData.store_logo_url}
            onChange={(e) => setFormData({ ...formData, store_logo_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://ejemplo.com/logo.png"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL del logo (recomendado: 200x200px, formato PNG con fondo transparente)
          </p>
        </div>

        {/* Tema */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema de Colores
          </label>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {themes.map((theme) => (
              <button
                key={theme.value}
                type="button"
                onClick={() => setFormData({ ...formData, store_theme: theme.value })}
                className={`
                  flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all
                  ${
                    formData.store_theme === theme.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className={`h-8 w-8 rounded-full ${theme.color}`} />
                <span className="text-xs font-medium text-gray-700">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SEO Keywords */}
        <div>
          <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700">
            Palabras Clave (SEO)
          </label>
          <input
            type="text"
            id="seo_keywords"
            value={formData.seo_keywords}
            onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="productos, belleza, salud, etc."
          />
          <p className="mt-1 text-xs text-gray-500">
            Palabras clave separadas por comas para mejorar la búsqueda
          </p>
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





