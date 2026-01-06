'use client'

import { useState } from 'react'
import { addSocialLink, updateSocialLink, deleteSocialLink } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Edit, Check, X, Globe } from 'lucide-react'

interface SocialLinksSectionProps {
  socialLinks: any[]
}

const platforms = [
  { value: 'FACEBOOK', label: 'Facebook', placeholder: 'https://facebook.com/tu-perfil' },
  { value: 'INSTAGRAM', label: 'Instagram', placeholder: 'https://instagram.com/tu-perfil' },
  { value: 'WHATSAPP', label: 'WhatsApp', placeholder: '+51987654321' },
  { value: 'TIKTOK', label: 'TikTok', placeholder: 'https://tiktok.com/@tu-perfil' },
  { value: 'YOUTUBE', label: 'YouTube', placeholder: 'https://youtube.com/@tu-canal' },
  { value: 'LINKEDIN', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/tu-perfil' },
  { value: 'TWITTER', label: 'Twitter/X', placeholder: 'https://twitter.com/tu-perfil' },
  { value: 'OTHER', label: 'Otro', placeholder: 'https://ejemplo.com' },
]

export function SocialLinksSection({ socialLinks: initialLinks }: SocialLinksSectionProps) {
  const [socialLinks, setSocialLinks] = useState(initialLinks)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    platform: 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'TIKTOK' | 'YOUTUBE' | 'LINKEDIN' | 'TWITTER' | 'OTHER'
    url: string
    display_name: string
    is_public: boolean
  }>({
    platform: 'FACEBOOK',
    url: '',
    display_name: '',
    is_public: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result
      if (editingId) {
        result = await updateSocialLink(editingId, formData)
      } else {
        result = await addSocialLink(formData)
      }

      if (result.success) {
        toast.success(editingId ? 'Red social actualizada' : 'Red social agregada')
        setShowForm(false)
        setEditingId(null)
        setFormData({
          platform: 'FACEBOOK',
          url: '',
          display_name: '',
          is_public: true,
        })
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al guardar red social')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (link: any) => {
    setEditingId(link.id)
    setFormData({
      platform: link.platform,
      url: link.url || '',
      display_name: link.display_name || '',
      is_public: link.is_public !== false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta red social?')) {
      return
    }

    setLoading(true)
    try {
      const result = await deleteSocialLink(id)
      if (result.success) {
        toast.success('Red social eliminada')
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al eliminar red social')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const getPlatformLabel = (platform: string) => {
    return platforms.find((p) => p.value === platform)?.label || platform
  }

  const getCurrentPlaceholder = () => {
    return platforms.find((p) => p.value === formData.platform)?.placeholder || ''
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Redes Sociales</h2>
          <p className="mt-1 text-sm text-gray-500">
            Agrega tus redes sociales para que aparezcan en tu tienda personalizada
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({
                platform: 'FACEBOOK',
                url: '',
                display_name: '',
                is_public: true,
              })
            }}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Agregar Red Social
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plataforma *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as any, url: '' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre a Mostrar (Opcional)
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Ej: Mi Facebook Personal"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                URL o Número *
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder={getCurrentPlaceholder()}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.platform === 'WHATSAPP'
                  ? 'Formato: +51987654321 (incluye código de país)'
                  : 'Ingresa la URL completa de tu perfil'}
              </p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Mostrar en mi tienda personalizada
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lista de redes sociales */}
      {socialLinks.length === 0 && !showForm ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No has agregado ninguna red social</p>
        </div>
      ) : (
        !showForm && (
          <div className="space-y-4">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {link.display_name || getPlatformLabel(link.platform)}
                    </span>
                    {link.is_public && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Público
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-600"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="rounded-md p-2 text-gray-400 hover:text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}





