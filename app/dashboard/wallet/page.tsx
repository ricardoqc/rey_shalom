import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getWalletTransactions, getDashboardStats } from '@/app/actions/dashboard'
import { DollarSign, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { WithdrawalButton } from '@/components/dashboard/withdrawal-button'
import { cn } from '@/lib/utils'

export default async function WalletPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const transactions = await getWalletTransactions(user.id)
  const stats = await getDashboardStats(user.id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'COMMISSION':
        return <ArrowUpRight className="h-5 w-5 text-[#4CAF50]" />
      case 'PURCHASE':
      case 'WITHDRAWAL':
        return <ArrowDownRight className="h-5 w-5 text-[#ea2a33]" />
      default:
        return <DollarSign className="h-5 w-5 text-white/40" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'COMMISSION':
        return 'Comisión'
      case 'PURCHASE':
        return 'Compra'
      case 'WITHDRAWAL':
        return 'Retiro'
      case 'ADJUSTMENT':
        return 'Ajuste'
      case 'BONUS':
        return 'Bono'
      default:
        return type
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-primary rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">MIS FINANZAS</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Tu Billetera</h1>
          <p className="mt-2 text-text-muted font-medium">
            Control total de tus comisiones y retiros automatizados
          </p>
        </div>
        <WithdrawalButton currentBalance={stats.currentBalance} />
      </div>

      {/* Balance Card */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-[3rem] relative p-12 group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -skew-x-12 translate-x-1/3 group-hover:translate-x-0 transition-transform duration-1000"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <DollarSign className="size-6" />
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Disponible para retiro</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-primary">S/</span>
              <span className="text-6xl font-black text-text-dark tracking-tighter">
                {Number(stats.currentBalance).toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="h-2 w-32 bg-gray-50 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3"></div>
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Nivel de Actividad: Alto</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-text-dark tracking-tight">
              Historial de Movimientos
            </h3>
            <p className="mt-1 text-sm text-text-muted font-medium">
              Detalle chronológico de comisiones y egresos
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="px-10 py-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/50 -z-10"></div>
            <div className="mx-auto h-20 w-20 bg-white rounded-3xl shadow-inner flex items-center justify-center mb-6">
              <DollarSign className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-text-dark tracking-tight">
              Aún no tienes movimientos
            </h3>
            <p className="mt-2 text-text-muted font-medium">
              Comienza a construir tu red para ver tus ganancias aquí
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-10 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Fecha y Hora
                  </th>
                  <th className="px-10 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Tipo de Operación
                  </th>
                  <th className="px-10 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Descripción
                  </th>
                  <th className="px-10 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Monto
                  </th>
                  <th className="px-10 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Nuevo Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((transaction: any) => {
                  const isPositive = Number(transaction.amount) > 0
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-10 py-6 whitespace-nowrap text-sm font-bold text-text-muted">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-8 rounded-xl flex items-center justify-center shadow-sm",
                            isPositive ? "bg-primary/10 text-primary" : "bg-red-50 text-red-500"
                          )}>
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-text-dark group-hover:text-primary transition-colors tracking-tight">
                              {getTransactionLabel(transaction.transaction_type)}
                            </span>
                            {transaction.commission_level && (
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                                Nivel {transaction.commission_level} aliado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm font-medium text-text-dark/70">
                        {transaction.description || '-'}
                      </td>
                      <td
                        className={cn(
                          "px-10 py-6 whitespace-nowrap text-right text-sm font-black tracking-tight",
                          isPositive ? 'text-primary' : 'text-red-500'
                        )}
                      >
                        {isPositive ? '+' : ''}
                        S/ {Math.abs(Number(transaction.amount)).toLocaleString(
                          'es-PE',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap text-right text-sm font-bold text-text-dark">
                        S/ {Number(transaction.balance_after).toLocaleString(
                          'es-PE',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
