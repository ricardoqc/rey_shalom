import { createClient } from '@/utils/supabase/server'
import { UsersTable } from '@/components/admin/users-table'

export default async function UsersPage() {
  const supabase = await createClient()

  // Obtener todos los perfiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Obtener información de usuarios de auth (email y rol)
  // Nota: Para obtener emails necesitaríamos usar Admin API con Service Role Key
  // Por ahora, los perfiles ya tienen la información necesaria para mostrar
  // El email se puede obtener del cliente si es necesario, pero no es crítico para la gestión

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra usuarios, rangos y permisos del sistema
        </p>
      </div>

      <UsersTable initialProfiles={profiles || []} />
    </div>
  )
}

