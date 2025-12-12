'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, UserPlus, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateUsersPage() {
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState<string | null>(null)
  const supabase = createClient()

  const createSuperAdmin = async () => {
    setLoading(true)
    setCreating('admin')
    try {
      const email = prompt('Ingresa el email para el Super Admin:')
      const password = prompt('Ingresa la contraseña (mínimo 6 caracteres):')

      if (!email || !password) {
        toast.error('Email y contraseña son requeridos')
        return
      }

      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres')
        return
      }

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
            public_name: 'Super Admin',
          },
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario')
      }

      // Actualizar metadata para asignar rol de admin
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role: 'admin',
        },
      })

      if (updateError) {
        console.error('Error actualizando metadata:', updateError)
      }

      // El trigger handle_new_user() debería crear el perfil automáticamente
      // Pero por si acaso, verificamos y creamos manualmente si es necesario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        // Crear perfil manualmente si no existe
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            public_name: 'Super Admin',
            referral_code: `ADMIN-${Date.now().toString(36).toUpperCase()}`,
            status_level: 'ORO',
            current_points: 9999,
            is_active: true,
          })

        if (createProfileError) {
          console.error('Error creando perfil:', createProfileError)
        }
      }

      toast.success('Super Admin creado exitosamente!')
      toast.info(
        `Email: ${email}\nRevisa tu correo para confirmar la cuenta.`
      )
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
      setCreating(null)
    }
  }

  const createTestUser = async () => {
    setLoading(true)
    setCreating('user')
    try {
      const email = prompt('Ingresa el email para el usuario de prueba:')
      const password = prompt('Ingresa la contraseña (mínimo 6 caracteres):')
      const referralCode = prompt(
        'Ingresa el código de referido (opcional, deja vacío si no hay):'
      )

      if (!email || !password) {
        toast.error('Email y contraseña son requeridos')
        return
      }

      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres')
        return
      }

      // Buscar sponsor si hay código de referido
      let sponsorId = null
      if (referralCode) {
        const { data: sponsor } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode.toUpperCase())
          .single()

        if (sponsor) {
          sponsorId = sponsor.id
        } else {
          toast.warning(
            `Código de referido "${referralCode}" no encontrado. Creando usuario sin sponsor.`
          )
        }
      }

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            public_name: email.split('@')[0],
            referral_code: referralCode || null,
            sponsor_id: sponsorId,
          },
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario')
      }

      // El trigger handle_new_user() debería crear el perfil automáticamente
      // Esperamos un momento y verificamos
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        // Crear perfil manualmente si no existe
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            public_name: email.split('@')[0],
            referral_code: `${email.split('@')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
            sponsor_id: sponsorId,
            status_level: 'BRONCE',
            current_points: 0,
            is_active: true,
          })

        if (createProfileError) {
          console.error('Error creando perfil:', createProfileError)
        }
      }

      toast.success('Usuario de prueba creado exitosamente!')
      toast.info(
        `Email: ${email}\nRevisa tu correo para confirmar la cuenta.`
      )
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
      setCreating(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Crear Usuarios
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Utiliza estas herramientas para crear usuarios de prueba
            </p>
          </div>

          <div className="space-y-6">
            {/* Super Admin Card */}
            <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Super Admin
                  </h2>
                  <p className="text-sm text-gray-600">
                    Crea un usuario con permisos de administrador
                  </p>
                </div>
              </div>
              <button
                onClick={createSuperAdmin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating === 'admin' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Crear Super Admin
                  </>
                )}
              </button>
            </div>

            {/* Test User Card */}
            <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Usuario de Prueba
                  </h2>
                  <p className="text-sm text-gray-600">
                    Crea un usuario normal para probar el sistema
                  </p>
                </div>
              </div>
              <button
                onClick={createTestUser}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating === 'user' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Crear Usuario de Prueba
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Los usuarios creados recibirán un email de
              confirmación. En desarrollo, puedes verificar el email directamente
              desde el dashboard de Supabase o usar el enlace de confirmación que
              aparece en la consola del servidor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

