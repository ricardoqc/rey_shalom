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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-royal-blue rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-royal-blue">EQUIPO</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Gestión de Usuarios</h1>
          <p className="mt-2 text-text-muted font-medium">
            Administración centralizada de aliados, rangos y permisos
          </p>
        </div>
      </div>

      <UsersTable initialProfiles={profiles || []} />
    </div>
  )
}

