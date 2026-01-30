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
        return <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black tracking-widest uppercase border border-gold/20">Pendiente</div>
      case 'approved':
        return <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase border border-primary/20">Aprobado</div>
      case 'rejected':
        return <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black tracking-widest uppercase border border-red-100">Rechazado</div>
      default:
        return <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black tracking-widest uppercase border border-gray-100">{status}</div>
    }
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'ORO':
        return 'bg-gold/10 text-gold border-gold/20'
      case 'PLATA':
        return 'bg-gray-100 text-gray-400 border-gray-200'
      case 'BRONCE':
        return 'bg-red-50 text-red-400 border-red-100'
      default:
        return 'bg-gray-50 text-gray-400 border-gray-100'
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        {/* Header con búsqueda y filtros */}
        <div className="px-8 py-6 border-b border-gray-50">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Búsqueda */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Buscar por orden, cliente o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-full text-text-dark placeholder:text-gray-300 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            {/* Filtro de estado */}
            <div className="lg:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-full text-text-dark font-black text-sm uppercase tracking-widest focus:bg-white focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="pending">⏳ Pendientes</option>
                <option value="approved">✅ Aprobados</option>
                <option value="rejected">❌ Rechazados</option>
                <option value="all">📁 Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        {filteredOrders.length === 0 ? (
          <div className="p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/50 -z-10"></div>
            <div className="mx-auto h-20 w-20 bg-white rounded-3xl shadow-inner flex items-center justify-center mb-6">
              <Clock className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-text-dark tracking-tight">
              No se encontraron pedidos
            </h3>
            <p className="mt-2 text-text-muted font-medium">
              {searchQuery || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay transacciones registradas actualmente'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Orden
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Cliente
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Monto
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Comprobante
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Estado
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Fecha
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const isProcessing = processingOrderId === order.id
                  const canApprove = order.payment_status === 'pending'
                  const canReject = order.payment_status === 'pending'

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-black text-text-dark tracking-tight">
                          #{order.order_number || 'N/A'}
                        </div>
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                          {order.points_earned} PTS
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-royal-blue/10 flex items-center justify-center text-royal-blue font-black">
                            {order.profiles?.public_name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-black text-text-dark group-hover:text-royal-blue transition-colors">
                              {order.profiles?.public_name || 'Sin nombre'}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-text-muted font-mono tracking-widest uppercase">
                                {order.profiles?.referral_code}
                              </span>
                              {order.profiles?.status_level && (
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter ${getRankBadgeColor(order.profiles.status_level)}`}>
                                  {order.profiles.status_level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-text-dark">
                        S/ {order.total_amount.toLocaleString('es-PE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {order.payment_proof_url ? (
                          <button
                            onClick={() => setViewingVoucher(order.payment_proof_url!)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-gold/20 hover:bg-gold hover:text-white transition-all shadow-sm active:scale-95"
                          >
                            <Eye className="h-3 w-3" />
                            Voucher
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sin adjunto</span>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {getStatusBadge(order.payment_status)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                          {new Date(order.created_at).toLocaleTimeString('es-PE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          {canApprove && (
                            <button
                              onClick={() => handleApprove(order.id)}
                              disabled={isProcessing}
                              className="size-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-[#3d8b40] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                              title="Aprobar pedido"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-5 w-5" />
                              )}
                            </button>
                          )}
                          {canReject && (
                            <button
                              onClick={() => handleReject(order.id)}
                              disabled={isProcessing}
                              className="size-10 flex items-center justify-center bg-white border border-red-100 text-red-500 rounded-xl shadow-sm hover:bg-red-50 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                              title="Rechazar pedido"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <XCircle className="h-5 w-5" />
                              )}
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
        <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary/30"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              Mostrando {filteredOrders.length} de {orders.length} registros totales
            </p>
          </div>
        </div>
      </div>

      {/* Modal para ver voucher */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-text-dark/95 backdrop-blur-xl"
            onClick={() => setViewingVoucher(null)}
          ></div>
          <div className="relative bg-white border border-gray-100 rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold block mb-1">DOCUMENTO</span>
                <h2 className="text-2xl font-black text-text-dark tracking-tighter">Comprobante de Pago</h2>
              </div>
              <button
                onClick={() => setViewingVoucher(null)}
                className="size-12 flex items-center justify-center rounded-full bg-gray-50 text-text-muted hover:text-text-dark hover:bg-gray-100 transition-all border border-gray-100"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-10 overflow-auto flex-1 bg-gray-50/50">
              {viewingVoucher.endsWith('.pdf') ? (
                <iframe
                  src={viewingVoucher}
                  className="w-full h-[600px] border border-gray-100 rounded-[2rem] shadow-inner bg-white"
                  title="Comprobante de pago PDF"
                />
              ) : (
                <img
                  src={viewingVoucher}
                  alt="Comprobante de pago"
                  className="max-w-full h-auto mx-auto rounded-[2rem] shadow-2xl border-4 border-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}






