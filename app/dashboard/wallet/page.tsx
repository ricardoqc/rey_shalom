import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getWalletTransactions, getDashboardStats } from '@/app/actions/dashboard'
import { DollarSign, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { WithdrawalButton } from '@/components/dashboard/withdrawal-button'

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
        return <ArrowUpRight className="h-5 w-5 text-green-600" />
      case 'PURCHASE':
      case 'WITHDRAWAL':
        return <ArrowDownRight className="h-5 w-5 text-red-600" />
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billetera</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona tus ganancias y retiros
          </p>
        </div>
        <WithdrawalButton currentBalance={stats.currentBalance} />
      </div>

      {/* Balance Card */}
      <div className="overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
        <div className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Balance Disponible</p>
              <p className="mt-1 text-3xl font-bold">
                $
                {Number(stats.currentBalance).toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-full bg-white/20 p-4">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Historial de Transacciones
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Todas tus transacciones de comisiones, compras y retiros
          </p>
        </div>
        <div className="border-t border-gray-200">
          {transactions.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay transacciones aún
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tus transacciones aparecerán aquí cuando comiences a ganar
                comisiones
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Tipo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Descripción
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Monto
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions.map((transaction) => {
                    const isPositive = Number(transaction.amount) > 0
                    return (
                      <tr key={transaction.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.transaction_type)}
                            <span className="text-sm text-gray-900">
                              {getTransactionLabel(transaction.transaction_type)}
                            </span>
                            {transaction.commission_level && (
                              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                Nivel {transaction.commission_level}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {transaction.description || '-'}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-right text-sm font-medium ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          $
                          {Math.abs(Number(transaction.amount)).toLocaleString(
                            'es-PE',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          $
                          {Number(transaction.balance_after).toLocaleString(
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
    </div>
  )
}

