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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Seguridad</h2>
        <p className="mt-1 text-sm text-gray-500">
          Cambia tu contraseña para mantener tu cuenta segura
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contraseña Actual */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Contraseña Actual
          </label>
          <div className="mt-1 relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Nueva Contraseña */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nueva Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mínimo 6 caracteres
          </p>
        </div>

        {/* Confirmar Nueva Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Nueva Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Info sobre 2FA */}
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Autenticación de Dos Factores (2FA)
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  La autenticación de dos factores estará disponible próximamente.
                  Esta función añadirá una capa adicional de seguridad a tu cuenta.
                </p>
              </div>
            </div>
          </div>
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





