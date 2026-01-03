'use client'

import { useState, useMemo } from 'react'
import { Search, CheckCircle, XCircle, Eye, FileText, Clock } from 'lucide-react'
import { Database } from '@/types/supabase'
import { approveOrder, rejectOrder } from '@/app/actions/orders'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

type Order = Database['public']['Tables']['orders']['Row'] & {
  profiles?: {
    id: string
    public_name: string | null
    referral_code: string
    status_level: 'BRONCE' | 'PLATA' | 'ORO'
  }
}

interface OrdersTableProps {
  initialOrders: Order[]
  allOrders: Order[]
}

export function OrdersTable({ initialOrders, allOrders }: OrdersTableProps) {
  const [orders] = useState<Order[]>(allOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null)
  const [viewingVoucher, setViewingVoucher] = useState<string | null>(null)

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchQuery === '' ||
        order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.profiles?.public_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.profiles?.referral_code?.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtro de estado
      const matchesStatus =
        statusFilter === 'all' || order.payment_status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  const handleApprove = async (orderId: string) => {
    if (!confirm('¿Estás seguro de aprobar este pedido? Esto ejecutará la lógica de comisiones y packs.')) {
      return
    }

    setProcessingOrderId(orderId)
    try {
      const result = await approveOrder(orderId)

      if (result.success) {
        toast.success('Pedido aprobado exitosamente')
        // Recargar página para ver cambios
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al aprobar el pedido')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setProcessingOrderId(null)
    }
  }

  const handleReject = async (orderId: string) => {
    const reason = prompt('Ingresa la razón del rechazo (opcional):')
    
    if (reason === null) {
      return // Usuario canceló
    }

    setProcessingOrderId(orderId)
    try {
      const result = await rejectOrder(orderId, reason || undefined)

      if (result.success) {
        toast.success('Pedido rechazado exitosamente')
        // Recargar página para ver cambios
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al rechazar el pedido')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setProcessingOrderId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'ORO':
        return 'bg-yellow-100 text-yellow-800'
      case 'PLATA':
        return 'bg-gray-100 text-gray-800'
      case 'BRONCE':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header con búsqueda y filtros */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número de orden, nombre o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro de estado */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobados</option>
                <option value="rejected">Rechazados</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron pedidos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay pedidos registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Comprobante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const isProcessing = processingOrderId === order.id
                  const canApprove = order.payment_status === 'pending'
                  const canReject = order.payment_status === 'pending'

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.order_number || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.points_earned} puntos
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.profiles?.public_name || 'Sin nombre'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.profiles?.referral_code}
                        </div>
                        {order.profiles?.status_level && (
                          <Badge className={`mt-1 ${getRankBadgeColor(order.profiles.status_level)}`}>
                            {order.profiles.status_level}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${order.total_amount.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.payment_proof_url ? (
                          <button
                            onClick={() => setViewingVoucher(order.payment_proof_url!)}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Voucher
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">Sin comprobante</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {canApprove && (
                            <button
                              onClick={() => handleApprove(order.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Aprobar pedido"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Aprobar
                            </button>
                          )}
                          {canReject && (
                            <button
                              onClick={() => handleReject(order.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Rechazar pedido"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Rechazar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer con contador */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </p>
        </div>
      </div>

      {/* Modal para ver voucher */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto m-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Comprobante de Pago</h2>
              <button
                onClick={() => setViewingVoucher(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {viewingVoucher.endsWith('.pdf') ? (
                <iframe
                  src={viewingVoucher}
                  className="w-full h-[600px] border"
                  title="Comprobante de pago PDF"
                />
              ) : (
                <img
                  src={viewingVoucher}
                  alt="Comprobante de pago"
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}






