'use client'

import { useState } from 'react'
import { createUser } from '@/app/actions/admin'
import { Loader2, UserPlus, Shield, Mail, Lock, User, Award, Users } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateUsersPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    public_name: '',
    referral_code: '',
    role: 'user' as 'admin' | 'user',
    status_level: 'BRONCE' as 'BRONCE' | 'PLATA' | 'ORO',
    sponsor_code: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createUser({
        email: formData.email,
        password: formData.password,
        public_name: formData.public_name,
        referral_code: formData.referral_code || undefined,
        role: formData.role,
        status_level: formData.status_level,
        sponsor_code: formData.sponsor_code || undefined,
      })

      if (result.success) {
        toast.success('Usuario creado exitosamente!', {
          description: `Email: ${result.user?.email}`,
        })
        // Limpiar formulario
        setFormData({
          email: '',
          password: '',
          public_name: '',
          referral_code: '',
          role: 'user',
          status_level: 'BRONCE',
          sponsor_code: '',
        })
      } else {
        toast.error('Error al crear usuario', {
          description: result.error,
        })
      }
    } catch (error: any) {
      toast.error('Error inesperado', {
        description: error.message || 'Ocurrió un error al crear el usuario',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
        <p className="mt-1 text-sm text-gray-500">
          Crea usuarios nuevos que serán agregados automáticamente a Supabase
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Básica
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
            </div>

            {/* Nombre público */}
            <div>
              <label
                htmlFor="public_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre Público <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="public_name"
                  required
                  value={formData.public_name}
                  onChange={(e) =>
                    setFormData({ ...formData, public_name: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nombre completo"
                />
              </div>
            </div>
          </div>

          {/* Configuración de rol y nivel */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuración de Rol y Nivel
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Rol */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rol
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'admin' | 'user',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* Nivel de estado */}
              <div>
                <label
                  htmlFor="status_level"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nivel de Estado
                </label>
                <select
                  id="status_level"
                  value={formData.status_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status_level: e.target.value as 'BRONCE' | 'PLATA' | 'ORO',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="BRONCE">Bronce</option>
                  <option value="PLATA">Plata</option>
                  <option value="ORO">Oro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Referidos y código de referido */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sistema de Referidos (Opcional)
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Código de referido del sponsor */}
              <div>
                <label
                  htmlFor="sponsor_code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Código de Referido del Sponsor
                </label>
                <input
                  type="text"
                  id="sponsor_code"
                  value={formData.sponsor_code}
                  onChange={(e) =>
                    setFormData({ ...formData, sponsor_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Código del sponsor (opcional)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Si se proporciona, el usuario será vinculado a este sponsor
                </p>
              </div>

              {/* Código de referido personalizado */}
              <div>
                <label
                  htmlFor="referral_code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Código de Referido Personalizado
                </label>
                <input
                  type="text"
                  id="referral_code"
                  value={formData.referral_code}
                  onChange={(e) =>
                    setFormData({ ...formData, referral_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Se generará automáticamente si se deja vacío"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Si se deja vacío, se generará automáticamente
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  email: '',
                  password: '',
                  public_name: '',
                  referral_code: '',
                  role: 'user',
                  status_level: 'BRONCE',
                  sponsor_code: '',
                })
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={loading}
            >
              Limpiar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Crear Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Información Importante
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            Los usuarios creados serán agregados automáticamente a Supabase Auth
            y a la tabla de perfiles
          </li>
          <li>El email será confirmado automáticamente</li>
          <li>
            Si no se proporciona un código de referido, se generará uno
            automáticamente basado en el nombre
          </li>
          <li>
            Si se proporciona un código de sponsor, el usuario será vinculado
            al sistema MLM
          </li>
        </ul>
      </div>
    </div>
  )
}
