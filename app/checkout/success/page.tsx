import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  // En Next.js 16, searchParams es una Promise y debe ser await
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Compra Exitosa!
        </h1>
        {params.order && (
          <p className="text-gray-600 mb-6">
            Tu orden #{params.order} ha sido procesada correctamente
          </p>
        )}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ir a Mi Oficina Virtual
          </Link>
          <Link
            href="/shop"
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

