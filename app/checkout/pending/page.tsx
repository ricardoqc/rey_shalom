import { CheckCircle, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const params = await searchParams
  const orderNumber = params.order || 'N/A'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icono */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido en Revisión
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 mb-6">
            Tu pedido <span className="font-semibold text-gray-900">#{orderNumber}</span> ha sido recibido y está siendo revisado.
          </p>

          {/* Información */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">¿Qué sigue?</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Hemos recibido tu comprobante de pago y lo estamos verificando.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>
                  El proceso de revisión puede tomar de 24 a 48 horas hábiles.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Recibirás una notificación por email cuando tu pedido sea aprobado.
                </span>
              </li>
            </ul>
          </div>

          {/* Estado del pedido */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex items-center justify-center gap-2 text-yellow-600">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Estado: Pendiente de Aprobación</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Ir a Mi Dashboard
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}






