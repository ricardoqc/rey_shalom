import { createClient } from '@/utils/supabase/server'
import { getProducts, getCategories, getProductInventory } from '@/app/actions/shop'
import { ProductCard } from '@/components/shop/product-card'
import { Filter } from 'lucide-react'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  // En Next.js 16, searchParams es una Promise y debe ser await
  const params = await searchParams
  
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Obtener perfil y rango del usuario
  let userRank: 'BRONCE' | 'PLATA' | 'ORO' | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('status_level')
      .eq('id', user.id)
      .single()

    userRank = ((profile as any)?.status_level as 'BRONCE' | 'PLATA' | 'ORO') || null
  }

  // Obtener requisitos de rango para calcular descuentos
  const { data: rankRequirements } = await supabase
    .from('rank_requirements')
    .select('*')
    .order('min_points', { ascending: true })

  // Obtener productos y categorías
  const products = await getProducts(params.category)
  const categories = await getCategories()

  // Obtener inventario para cada producto
  const productsWithInventory = await Promise.all(
    products.map(async (product: any) => {
      const inventory = await getProductInventory(product.id)
      return { product, inventory }
    })
  )

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Tienda</h1>
          <p className="mt-2 text-sm text-white/60">
            {userRank
              ? `Bienvenido, disfruta de precios especiales para ${userRank}`
              : 'Explora nuestros productos'}
          </p>
        </div>

        {/* Filtros de categoría */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <a
              href="/shop"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !params.category
                  ? 'bg-[#ea2a33] text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Filter className="h-4 w-4" />
              Todos
            </a>
            {categories.map((category) => (
            <a
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                params.category === category
                  ? 'bg-[#ea2a33] text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
              }`}
            >
              {category}
            </a>
            ))}
          </div>
        )}

        {/* Grid de productos */}
        {productsWithInventory.length === 0 ? (
          <div className="rounded-xl bg-white/5 border border-white/10 p-12 text-center backdrop-blur-sm">
            <p className="text-white/60">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsWithInventory.map(({ product, inventory }) => (
              <ProductCard
                key={product.id}
                product={product}
                userRank={userRank}
                rankRequirements={rankRequirements || []}
                inventory={inventory || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
