import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="mt-1 text-sm text-white/60">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#ea2a33] text-white rounded-md hover:bg-[#d11a23] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </Link>
      </div>

      {products && products.length === 0 ? (
        <div className="bg-white/5 border border-white/10 shadow-lg rounded-xl p-12 text-center backdrop-blur-sm">
          <Package className="mx-auto h-12 w-12 text-white/40" />
          <h3 className="mt-2 text-sm font-medium text-white">
            No hay productos
          </h3>
          <p className="mt-1 text-sm text-white/60">
            Comienza agregando tu primer producto
          </p>
          <div className="mt-6">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ea2a33] text-white rounded-md hover:bg-[#d11a23] transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nuevo Producto
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                  Puntos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/60">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10">
              {products?.map((product: any) => (
                <tr key={product.id} className="hover:bg-white/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-sm text-white/60 line-clamp-1">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    $
                    {product.base_price.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {product.points_per_unit || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.is_active ? (
                      <span className="inline-flex rounded-full bg-[#4CAF50]/20 text-[#4CAF50] px-2 py-1 text-xs font-medium border border-[#4CAF50]/30">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-white/10 text-white/60 px-2 py-1 text-xs font-medium border border-white/10">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-[#FFD700] hover:text-yellow-400 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
