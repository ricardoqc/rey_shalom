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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-primary rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">INVENTARIO</span>
          </div>
          <h1 className="text-4xl font-black text-text-dark tracking-tighter">Catálogo de Productos</h1>
          <p className="mt-2 text-text-muted font-medium">
            Gestión centralizada de productos y existencias
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#3d8b40] hover:-translate-y-1 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </Link>
      </div>

      {products && products.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-50/50 -z-10"></div>
          <div className="mx-auto h-24 w-24 bg-white rounded-3xl shadow-inner flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-text-dark tracking-tight">
            No hay productos
          </h3>
          <p className="mt-2 text-text-muted font-medium">
            Comienza agregando tu primer producto al catálogo
          </p>
          <div className="mt-10">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#3d8b40] transition-all"
            >
              <Plus className="h-5 w-5" />
              Crear Producto
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Producto
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    SKU
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Precio
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Puntos
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Estado
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products?.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gray-100/50 overflow-hidden flex-shrink-0 border border-gray-100">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="size-full object-cover" />
                          ) : (
                            <div className="size-full flex items-center justify-center">
                              <Package className="size-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-black text-text-dark tracking-tight group-hover:text-primary transition-colors">
                            {product.name}
                          </div>
                          {product.category && (
                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                              {product.category}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-text-muted font-mono">
                      {product.sku}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-text-dark">
                      S/ {product.base_price.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black tracking-widest uppercase border border-gold/20">
                        {product.points_per_unit || 0} PV
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {product.is_active ? (
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-gray-300"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inactivo</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
