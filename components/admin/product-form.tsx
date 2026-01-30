'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createProduct, updateProduct } from '@/app/actions/admin'
import { useImageUpload } from '@/hooks/use-image-upload'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Database } from '@/types/supabase'

const productFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().optional(),
    base_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    points_per_unit: z.number().int().min(0, 'Los puntos deben ser mayor o igual a 0'),
    category: z.string().optional(),
    brand: z.string().optional(),
    sku: z.string().min(1, 'El SKU es requerido'),
    image_url: z.string().optional(),
})

type ProductFormData = z.infer<typeof productFormSchema>

type Product = Database['public']['Tables']['products']['Row']

interface ProductFormProps {
    initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter()
    const { uploadImage, isUploading: isUploadingImage } = useImageUpload()
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const isEditing = !!initialData

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            base_price: initialData?.base_price || 0,
            points_per_unit: initialData?.points_per_unit || 0,
            category: initialData?.category || '',
            brand: initialData?.brand || '',
            sku: initialData?.sku || '',
            image_url: initialData?.image_url || '',
        },
    })

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            toast.error('El archivo debe ser una imagen')
            return
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no puede ser mayor a 5MB')
            return
        }

        setImageFile(file)

        // Crear preview local
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleImageUpload = async () => {
        if (!imageFile) return null

        const url = await uploadImage(imageFile, 'product-images')
        if (url) {
            setValue('image_url', url)
        }
        return url
    }

    const onSubmit = async (data: ProductFormData) => {
        try {
            // Subir imagen si hay una seleccionada
            let imageUrl = data.image_url
            if (imageFile) {
                imageUrl = await handleImageUpload() || ''
                if (!imageUrl) {
                    toast.error('Error al subir la imagen')
                    return
                }
            }

            let result
            if (isEditing) {
                result = await updateProduct(initialData.id, {
                    ...data,
                    image_url: imageUrl || undefined,
                })
            } else {
                result = await createProduct({
                    ...data,
                    image_url: imageUrl || undefined,
                })
            }

            if (result.success) {
                toast.success(isEditing ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente')
                router.push('/admin/products')
            } else {
                toast.error(result.error || `Error al ${isEditing ? 'actualizar' : 'crear'} el producto`)
            }
        } catch (error: any) {
            toast.error(error.message || 'Error inesperado')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary/20"></div>
                    {/* Información Básica */}
                    <h2 className="text-2xl font-black text-text-dark mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Información Básica
                    </h2>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-xs font-black uppercase tracking-widest text-text-muted ml-4"
                            >
                                Nombre del Producto *
                            </label>
                            <input
                                type="text"
                                id="name"
                                {...register('name')}
                                className="block w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Ej. Clorofila Gold"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500 font-medium ml-4">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="sku"
                                className="block text-xs font-black uppercase tracking-widest text-text-muted ml-4"
                            >
                                SKU *
                            </label>
                            <input
                                type="text"
                                id="sku"
                                {...register('sku')}
                                className="block w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="RS-001"
                            />
                            {errors.sku && (
                                <p className="mt-1 text-sm text-red-500 font-medium ml-4">{errors.sku.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="base_price"
                                className="block text-xs font-black uppercase tracking-widest text-text-muted ml-4"
                            >
                                Precio Base (S/.) *
                            </label>
                            <input
                                type="number"
                                id="base_price"
                                step="0.01"
                                min="0"
                                {...register('base_price', { valueAsNumber: true })}
                                className="block w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            {errors.base_price && (
                                <p className="mt-1 text-sm text-red-500 font-medium ml-4">
                                    {errors.base_price.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="points_per_unit"
                                className="block text-xs font-black uppercase tracking-widest text-text-muted ml-4"
                            >
                                Puntos (PV) *
                            </label>
                            <input
                                type="number"
                                id="points_per_unit"
                                min="0"
                                {...register('points_per_unit', { valueAsNumber: true })}
                                className="block w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            {errors.points_per_unit && (
                                <p className="mt-1 text-sm text-red-500 font-medium ml-4">
                                    {errors.points_per_unit.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="category"
                                className="block text-xs font-black uppercase tracking-widest text-text-muted ml-4"
                            >
                                Categoría
                            </label>
                            <input
                                type="text"
                                id="category"
                                {...register('category')}
                                className="block w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="brand"
                                className="block text-xs font-black uppercase tracking-widest text-text-muted ml-4"
                            >
                                Marca
                            </label>
                            <input
                                type="text"
                                id="brand"
                                {...register('brand')}
                                className="block w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-8 space-y-2">
                        <label
                            htmlFor="description"
                            className="block text-xs font-black uppercase tracking-widest text-text-muted ml-4"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            {...register('description')}
                            className="block w-full rounded-[1.5rem] border border-gray-100 bg-gray-50 px-6 py-4 text-text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="Describe los beneficios del producto..."
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Imagen del Producto */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gold/20"></div>
                    <h2 className="text-2xl font-black text-text-dark mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-gold">image</span>
                        Imagen
                    </h2>

                    <div className="space-y-4">
                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="aspect-square w-full object-cover rounded-[1.5rem] border border-gray-100 shadow-inner"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null)
                                        setImageFile(null)
                                        setValue('image_url', '')
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110 active:scale-95"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-100 border-dashed rounded-[1.5rem] cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-12 h-12 mb-4 text-gray-300 group-hover:text-primary transition-colors" />
                                        <p className="mb-2 text-sm text-text-muted">
                                            <span className="font-bold text-text-dark">Subir imagen</span>
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            PNG, JPG hasta 5MB
                                        </p>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            </div>
                        )}

                        {isUploadingImage && (
                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-gold">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Subiendo imagen...
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploadingImage}
                        className="w-full flex justify-center items-center py-5 px-6 border border-transparent rounded-full shadow-lg text-lg font-black text-white bg-primary hover:bg-[#3d8b40] hover:-translate-y-1 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            isEditing ? 'Actualizar Producto' : 'Guardar Producto'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full py-5 px-6 border border-gray-100 rounded-full text-lg font-bold text-text-muted hover:bg-white hover:text-text-dark bg-transparent transition-all"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    )
}
