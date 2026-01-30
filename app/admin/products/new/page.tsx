import { ProductForm } from '@/components/admin/product-form'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Nuevo Producto</h1>
        <p className="mt-1 text-sm text-white/60">
          Agrega un nuevo producto al catálogo
        </p>
      </div>

      <ProductForm />
    </div>
  )
}

