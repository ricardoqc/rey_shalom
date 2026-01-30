'use client'

import { useState } from 'react'
import { addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Edit, Check, X, CreditCard } from 'lucide-react'

interface PaymentMethodsSectionProps {
  paymentMethods: any[]
}

const methodTypes = [
  { value: 'BANK_ACCOUNT', label: 'Cuenta Bancaria' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'WISE', label: 'Wise' },
  { value: 'WESTERN_UNION', label: 'Western Union' },
  { value: 'OTHER', label: 'Otro' },
]

export function PaymentMethodsSection({ paymentMethods: initialMethods }: PaymentMethodsSectionProps) {
  const [paymentMethods, setPaymentMethods] = useState(initialMethods)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    method_type: 'BANK_ACCOUNT' as const,
    provider_name: '',
    account_number: '',
    account_holder_name: '',
    routing_number: '',
    swift_code: '',
    currency: 'PEN' as const,
    is_default: false,
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result
      if (editingId) {
        result = await updatePaymentMethod(editingId, formData)
      } else {
        result = await addPaymentMethod(formData)
      }

      if (result.success) {
        toast.success(editingId ? 'Método de pago actualizado' : 'Método de pago agregado')
        setShowForm(false)
        setEditingId(null)
        setFormData({
          method_type: 'BANK_ACCOUNT',
          provider_name: '',
          account_number: '',
          account_holder_name: '',
          routing_number: '',
          swift_code: '',
          currency: 'PEN',
          is_default: false,
          notes: '',
        })
        // Recargar página para ver cambios
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al guardar método de pago')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (method: any) => {
    setEditingId(method.id)
    setFormData({
      method_type: method.method_type,
      provider_name: method.provider_name || '',
      account_number: method.account_number || '',
      account_holder_name: method.account_holder_name || '',
      routing_number: method.routing_number || '',
      swift_code: method.swift_code || '',
      currency: method.currency || 'PEN',
      is_default: method.is_default || false,
      notes: method.notes || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este método de pago?')) {
      return
    }

    setLoading(true)
    try {
      const result = await deletePaymentMethod(id)
      if (result.success) {
        toast.success('Método de pago eliminado')
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al eliminar método de pago')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const getMethodTypeLabel = (type: string) => {
    return methodTypes.find((m) => m.value === type)?.label || type
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-text-dark tracking-tight">Métodos de Cobro</h2>
          <p className="mt-1 text-sm text-text-muted font-medium">
            Configura las cuentas donde recibirás tus comisiones acumuladas
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({
                method_type: 'BANK_ACCOUNT',
                provider_name: '',
                account_number: '',
                account_holder_name: '',
                routing_number: '',
                swift_code: '',
                currency: 'PEN',
                is_default: false,
                notes: '',
              })
            }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all"
          >
            <Plus className="h-4 w-4" />
            Vincular Nuevo
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                Tipo de Plataforma *
              </label>
              <select
                value={formData.method_type}
                onChange={(e) => setFormData({ ...formData, method_type: e.target.value as any })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold appearance-none cursor-pointer"
                required
              >
                {methodTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                Entidad Financiera
              </label>
              <input
                type="text"
                value={formData.provider_name}
                onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
                placeholder="Ej: BCP, BBVA, Yape, PayPal"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                Número de Cuenta / ID *
              </label>
              <input
                type="text"
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
                placeholder="Ingresa los dígitos de tu cuenta"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                Nombre del Titular
              </label>
              <input
                type="text"
                value={formData.account_holder_name}
                onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
                placeholder="Nombre exacto en el banco"
              />
            </div>

            {formData.method_type === 'BANK_ACCOUNT' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                    Código Interbancario (CCI)
                  </label>
                  <input
                    type="text"
                    value={formData.routing_number}
                    onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                    className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
                    placeholder="20 dígitos para transferencias"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                    Código SWIFT / BIC
                  </label>
                  <input
                    type="text"
                    value={formData.swift_code}
                    onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                    className="block w-full rounded-full bg-white border-gray-100 text-text-dark placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold"
                    placeholder="Solo para transferencias globales"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">
                Divisa de Recepción
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="block w-full rounded-full bg-white border-gray-100 text-text-dark focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-6 py-4 text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="PEN">Soles (PEN)</option>
                <option value="USD">Dólares (USD)</option>
                <option value="EUR">Euros (EUR)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="size-5 rounded border-gray-200 text-primary focus:ring-primary transition-all cursor-pointer"
            />
            <label htmlFor="is_default" className="text-sm font-bold text-text-muted cursor-pointer hover:text-text-dark transition-colors">
              Establecer como método principal de retiro
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="rounded-full bg-white border border-gray-200 px-8 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-dark hover:border-text-dark transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Vincular Cuenta
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lista de métodos */}
      {paymentMethods.length === 0 && !showForm ? (
        <div className="text-center py-24 border border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/30">
          <div className="size-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <CreditCard className="size-8 text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-text-dark tracking-tight">No hay cuentas vinculadas</h3>
          <p className="mt-2 text-text-muted font-medium">Necesitas agregar al menos un método para recibir tus pagos</p>
        </div>
      ) : (
        !showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="group relative overflow-hidden bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-xl hover:border-primary/20 transition-all"
              >
                <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-dark group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        {method.method_type === 'YAPE' ? 'Y' : method.method_type === 'PLIN' ? 'P' : <CreditCard size={20} />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-muted uppercase tracking-widest">
                          {getMethodTypeLabel(method.method_type)}
                        </p>
                        <p className="text-sm font-black text-text-dark group-hover:text-primary transition-colors">
                          {method.provider_name || 'Sin proveedor'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-lg font-black text-text-dark tracking-tight">
                        {method.account_number.substring(0, 4)}
                        <span className="text-gray-200 opacity-50 px-1">••••</span>
                        {method.account_number.substring(method.account_number.length - 4)}
                      </p>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                        CCI: {method.routing_number ? `${method.routing_number.slice(0, 4)}...` : 'No configurado'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                        {method.currency || 'PEN'}
                      </span>
                      {method.is_default && (
                        <span className="text-[10px] font-black text-gold px-3 py-1 rounded-full bg-gold/5 border border-gold/10">
                          PRINCIPAL
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(method)}
                      className="size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}





