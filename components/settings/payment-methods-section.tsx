'use client'

import { useState } from 'react'
import { addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Edit, Check, X } from 'lucide-react'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Métodos de Pago</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configura los métodos donde recibirás tus retiros
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
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Agregar Método
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Método *
              </label>
              <select
                value={formData.method_type}
                onChange={(e) => setFormData({ ...formData, method_type: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                {methodTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proveedor/Banco
              </label>
              <input
                type="text"
                value={formData.provider_name}
                onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Ej: BCP, Interbank, Yape, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de Cuenta/Teléfono *
              </label>
              <input
                type="text"
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Número de cuenta o teléfono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Titular
              </label>
              <input
                type="text"
                value={formData.account_holder_name}
                onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Nombre completo"
              />
            </div>

            {formData.method_type === 'BANK_ACCOUNT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CCI / Routing Number
                  </label>
                  <input
                    type="text"
                    value={formData.routing_number}
                    onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Código de cuenta interbancario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    value={formData.swift_code}
                    onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Para transferencias internacionales"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Moneda
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="PEN">PEN (Soles)</option>
                <option value="USD">USD (Dólares)</option>
                <option value="EUR">EUR (Euros)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Marcar como método predeterminado</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lista de métodos */}
      {paymentMethods.length === 0 && !showForm ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">No has agregado ningún método de pago</p>
        </div>
      ) : (
        !showForm && (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {getMethodTypeLabel(method.method_type)}
                    </span>
                    {method.is_default && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        Predeterminado
                      </span>
                    )}
                  </div>
                  {method.provider_name && (
                    <p className="text-sm text-gray-500">{method.provider_name}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {method.account_number.substring(0, 4)}****{method.account_number.substring(method.account_number.length - 4)}
                  </p>
                  {method.currency && (
                    <p className="text-xs text-gray-500">Moneda: {method.currency}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(method)}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-600"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="rounded-md p-2 text-gray-400 hover:text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

