'use client'

import { useState } from 'react'
import { changePassword } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Save, Eye, EyeOff, Shield } from 'lucide-react'

export function SecuritySection() {
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await changePassword(formData)

      if (result.success) {
        toast.success('Contraseña actualizada exitosamente')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(result.error || 'Error al cambiar contraseña')
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
        <h2 className="text-xl font-black text-text-dark tracking-tight">Seguridad de la Cuenta</h2>
        <p className="mt-1 text-sm text-text-muted font-medium">
          Mantén tu cuenta protegida actualizando tu contraseña periódicamente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        {/* Contraseña Actual */}
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
            Contraseña Actual
          </label>
          <div className="relative group/input">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold pr-14"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-primary transition-colors"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Nueva Contraseña
            </label>
            <div className="relative group/input">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold pr-14"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-primary transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-[9px] font-black text-text-muted uppercase tracking-wider ml-4">
              Mínimo 6 caracteres alfanuméricos
            </p>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
              Confirmar Contraseña
            </label>
            <div className="relative group/input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="block w-full rounded-full bg-gray-50 border-gray-100 text-text-dark placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold pr-14"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-primary transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info sobre 2FA */}
        <div className="rounded-3xl bg-secondary p-8 border border-primary/10 relative overflow-hidden group/2fa">
          <div className="absolute right-0 top-0 size-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover/2fa:scale-150 transition-transform duration-700"></div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-black text-text-dark uppercase tracking-tight">
                Autenticación Segura (2FA)
              </h3>
              <div className="mt-2 text-sm text-text-muted font-medium">
                <p>
                  Estamos trabajando en añadir protección de 2 factores vía App o SMS.
                  Esta función añadirá una capa adicional de seguridad blindada a tu oficina virtual muy pronto.
                </p>
              </div>
            </div>
          </div>
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
                Cambiando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Cambiar Contraseña
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}





