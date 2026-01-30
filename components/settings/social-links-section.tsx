'use client'

import { useState } from 'react'
import { addSocialLink, updateSocialLink, deleteSocialLink } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Edit, Check, X, Globe, Facebook, Share2, MessageCircle } from 'lucide-react'

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
  const [formData, setFormData] = useState({
    platform: 'FACEBOOK' as 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'TIKTOK' | 'YOUTUBE' | 'LINKEDIN' | 'TWITTER' | 'OTHER',
    url: '',
    display_name: '',
    is_public: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result: any
      if (editingId) {
        result = await updateSocialLink(editingId, formData)
      } else {
        result = await addSocialLink(formData)
      }

      if (result.success) {
        toast.success(editingId ? 'Enlace actualizado' : 'Enlace agregado')
        if (result.data) setSocialLinks(result.data)
        setShowForm(false)
        setEditingId(null)
      } else {
        toast.error(result.error || 'Error al guardar enlace')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este enlace?')) return

    try {
      const result: any = await deleteSocialLink(id)
      if (result.success) {
        toast.success('Enlace eliminado')
        setSocialLinks(socialLinks.filter(l => l.id !== id))
      } else {
        toast.error(result.error || 'Error al eliminar enlace')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    }
  }

  const handleEdit = (link: any) => {
    setEditingId(link.id)
    setFormData({
      platform: link.platform,
      url: link.url,
      display_name: link.display_name || '',
      is_public: link.is_public,
    })
    setShowForm(true)
  }

  const getPlatformLabel = (value: string) => {
    return platforms.find((p) => p.value === value)?.label || value
  }

  const getCurrentPlaceholder = () => {
    return platforms.find((p) => p.value === formData.platform)?.placeholder || ''
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-text-dark tracking-tight">Vínculos de Redes</h2>
          <p className="mt-1 text-sm text-text-muted font-medium">
            Conecta tus redes para que tus clientes puedan contactarte directamente
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
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all"
          >
            <Plus className="h-4 w-4" />
            Conectar Red
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                Plataforma Social *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as any, url: '' })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold appearance-none cursor-pointer"
                required
              >
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                Etiqueta Personalizada
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
                placeholder="Ej: Mi Fanpage, WhatsApp Ventas..."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                URL del Perfil o Número *
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
                placeholder={getCurrentPlaceholder()}
                required
              />
              <p className="mt-1 text-[9px] font-black text-text-muted uppercase tracking-wider ml-6">
                {formData.platform === 'WHATSAPP'
                  ? 'Usa el formato internacional: +51 987 654 321'
                  : 'Asegúrate de incluir https:// en el enlace'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="size-5 rounded border-gray-200 text-primary focus:ring-primary transition-all cursor-pointer"
            />
            <label htmlFor="is_public" className="text-sm font-bold text-text-muted cursor-pointer hover:text-text-dark transition-colors">
              Visible en mi landing page de afiliado
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="rounded-full bg-white border border-gray-200 px-8 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-dark hover:border-text-dark transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Guardar Conexión
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lista de redes sociales */}
      {socialLinks.length === 0 && !showForm ? (
        <div className="text-center py-24 border border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/30">
          <div className="size-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Globe className="size-8 text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-text-dark tracking-tight">Sin redes conectadas</h3>
          <p className="mt-2 text-text-muted font-medium">Añade tus perfiles para aumentar tu alcance y confianza</p>
        </div>
      ) : (
        !showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="group relative overflow-hidden bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-xl hover:border-primary/20 transition-all"
              >
                <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-dark group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        {link.platform === 'WHATSAPP' ? <MessageCircle size={20} /> :
                          link.platform === 'FACEBOOK' ? <Facebook size={20} /> : <Share2 size={20} />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-muted uppercase tracking-widest">
                          {getPlatformLabel(link.platform)}
                        </p>
                        <p className="text-sm font-black text-text-dark group-hover:text-primary transition-colors">
                          {link.display_name || 'Mi Perfil'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-text-muted truncate max-w-[150px]">
                      {link.url}
                    </p>

                    <div className="flex items-center gap-3">
                      {link.is_public && (
                        <span className="text-[10px] font-black text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10 uppercase tracking-widest">
                          VISIBLE EN TIENDA
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(link)}
                      className="size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
