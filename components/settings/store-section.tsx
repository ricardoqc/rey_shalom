'use client'

import { useState } from 'react'
import { updateStore } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Save, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-text-dark tracking-tight">Mi Tienda Personalizada</h2>
          <p className="mt-1 text-sm text-text-muted font-medium">
            Configura la identidad visual de tu portal de ventas directo
          </p>
        </div>
        {profile?.referral_code && (
          <Link
            href={`/store/${profile.referral_code}`}
            target="_blank"
            className="inline-flex items-center gap-3 rounded-full bg-white border border-gray-200 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-text-dark shadow-sm hover:bg-gray-50 hover:border-primary/30 transition-all"
          >
            <ExternalLink className="h-4 w-4 text-primary" />
            Previsualizar Tienda
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Store Name */}
          <div className="space-y-2">
            <label htmlFor="store_name" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Nombre de la Tienda
            </label>
            <input
              type="text"
              id="store_name"
              value={formData.store_name}
              onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
              className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
              placeholder={profile?.public_name || 'Nombre comercial'}
            />
          </div>

          {/* SEO Keywords */}
          <div className="space-y-2">
            <label htmlFor="seo_keywords" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Etiquetas de Búsqueda (SEO)
            </label>
            <input
              type="text"
              id="seo_keywords"
              value={formData.seo_keywords}
              onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
              className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
              placeholder="belleza, salud, emprendimiento..."
            />
          </div>

          {/* Banner URL */}
          <div className="space-y-2">
            <label htmlFor="store_banner_url" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Imagen de Portada (URL)
            </label>
            <input
              type="url"
              id="store_banner_url"
              value={formData.store_banner_url}
              onChange={(e) => setFormData({ ...formData, store_banner_url: e.target.value })}
              className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
              placeholder="https://..."
            />
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <label htmlFor="store_logo_url" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Logo de Marca (URL)
            </label>
            <input
              type="url"
              id="store_logo_url"
              value={formData.store_logo_url}
              onChange={(e) => setFormData({ ...formData, store_logo_url: e.target.value })}
              className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="store_description" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
            Mensaje de Bienvenida / Descripción
          </label>
          <textarea
            id="store_description"
            rows={4}
            value={formData.store_description}
            onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
            className="block w-full rounded-[2rem] bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
            placeholder="Cuenta la historia de tu negocio o destaca promociones..."
          />
        </div>

        {/* Theme */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
            Esquema Cromático del Portal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.value}
                type="button"
                onClick={() => setFormData({ ...formData, store_theme: theme.value })}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all",
                  formData.store_theme === theme.value
                    ? 'border-primary bg-primary/5 shadow-inner shadow-primary/10'
                    : 'border-gray-50 bg-white hover:border-gray-200 hover:bg-gray-50'
                )}
              >
                <div className={cn("size-8 rounded-full shadow-lg", theme.color)} />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  {theme.label}
                </span>
                {formData.store_theme === theme.value && <div className="size-2 bg-primary rounded-full animate-pulse"></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Actualizando Portal...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Publicar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}





