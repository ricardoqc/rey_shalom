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
        return <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">Pendiente</Badge>
      case 'approved':
        return <Badge className="bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30">Aprobado</Badge>
      case 'rejected':
        return <Badge className="bg-[#ea2a33]/20 text-[#ea2a33] border border-[#ea2a33]/30">Rechazado</Badge>
      default:
        return <Badge className="bg-white/10 text-white/60 border border-white/10">{status}</Badge>
    }
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'ORO':
        return 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30'
      case 'PLATA':
        return 'bg-white/10 text-white/60 border border-white/10'
      case 'BRONCE':
        return 'bg-[#ea2a33]/20 text-[#ea2a33] border border-[#ea2a33]/30'
      default:
        return 'bg-white/10 text-white/60 border border-white/10'
    }
  }

  return (
    <>
      <div className="bg-white/5 border border-white/10 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Header con búsqueda y filtros */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por número de orden, nombre o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:ring-[#ea2a33] focus:border-[#ea2a33] focus:outline-none"
              />
            </div>

            {/* Filtro de estado */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:ring-[#ea2a33] focus:border-[#ea2a33] focus:outline-none"
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
            <Clock className="mx-auto h-12 w-12 text-white/40" />
            <h3 className="mt-2 text-sm font-medium text-white">
              No se encontraron pedidos
            </h3>
            <p className="mt-1 text-sm text-white/60">
              {searchQuery || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay pedidos registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Comprobante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/60">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {filteredOrders.map((order) => {
                  const isProcessing = processingOrderId === order.id
                  const canApprove = order.payment_status === 'pending'
                  const canReject = order.payment_status === 'pending'

                  return (
                    <tr key={order.id} className="hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {order.order_number || 'N/A'}
                        </div>
                        <div className="text-xs text-white/60">
                          {order.points_earned} puntos
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {order.profiles?.public_name || 'Sin nombre'}
                        </div>
                        <div className="text-xs text-white/60">
                          {order.profiles?.referral_code}
                        </div>
                        {order.profiles?.status_level && (
                          <Badge className={`mt-1 ${getRankBadgeColor(order.profiles.status_level)}`}>
                            {order.profiles.status_level}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
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
                            className="inline-flex items-center gap-1 text-sm text-[#FFD700] hover:text-yellow-400 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Voucher
                          </button>
                        ) : (
                          <span className="text-sm text-white/40">Sin comprobante</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
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
                              className="inline-flex items-center gap-1 px-3 py-1 bg-[#4CAF50] text-white text-sm rounded-md hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                              className="inline-flex items-center gap-1 px-3 py-1 bg-[#ea2a33] text-white text-sm rounded-md hover:bg-[#d11a23] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          <p className="text-sm text-white/60">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </p>
        </div>
      </div>

      {/* Modal para ver voucher */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="relative bg-[#121212] border border-white/10 rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-auto m-4">
            <div className="sticky top-0 bg-[#121212] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Comprobante de Pago</h2>
              <button
                onClick={() => setViewingVoucher(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {viewingVoucher.endsWith('.pdf') ? (
                <iframe
                  src={viewingVoucher}
                  className="w-full h-[600px] border border-white/10 rounded"
                  title="Comprobante de pago PDF"
                />
              ) : (
                <img
                  src={viewingVoucher}
                  alt="Comprobante de pago"
                  className="max-w-full h-auto mx-auto rounded"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}






