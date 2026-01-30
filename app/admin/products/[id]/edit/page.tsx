import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'

interface EditProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single() as { data: any }

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Editar Producto</h1>
                <p className="mt-1 text-sm text-white/60">
                    Modifica los detalles del producto: <span className="text-white font-medium">{product.name}</span>
                </p>
            </div>

            <ProductForm initialData={product} />
        </div>
    )
}
