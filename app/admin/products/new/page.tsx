'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createProduct } from '@/app/actions/admin'
import { useImageUpload } from '@/hooks/use-image-upload'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

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

export default function NewProductPage() {
  const router = useRouter()
  const { uploadImage, isUploading: isUploadingImage } = useImageUpload()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      points_per_unit: 0,
      base_price: 0,
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

    const url = await uploadImage(imageFile, 'products')
    if (url) {
      setValue('image_url', url)
    }
    return url
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Subir imagen si hay una seleccionada
      let imageUrl = data.image_url
      if (imageFile && !imageUrl) {
        imageUrl = await handleImageUpload()
        if (!imageUrl) {
          toast.error('Error al subir la imagen')
          return
        }
      }

      const result = await createProduct({
        ...data,
        image_url: imageUrl || undefined,
      })

      if (result.success) {
        toast.success('Producto creado exitosamente')
        router.push('/admin/products')
      } else {
        toast.error(result.error || 'Error al crear el producto')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="mt-1 text-sm text-gray-500">
          Agrega un nuevo producto al catálogo
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Información Básica */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información Básica
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-700"
              >
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                {...register('sku')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="base_price"
                className="block text-sm font-medium text-gray-700"
              >
                Precio Base *
              </label>
              <input
                type="number"
                id="base_price"
                step="0.01"
                min="0"
                {...register('base_price', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.base_price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.base_price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="points_per_unit"
                className="block text-sm font-medium text-gray-700"
              >
                Puntos por Unidad *
              </label>
              <input
                type="number"
                id="points_per_unit"
                min="0"
                {...register('points_per_unit', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.points_per_unit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.points_per_unit.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Categoría
              </label>
              <input
                type="text"
                id="category"
                {...register('category')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700"
              >
                Marca
              </label>
              <input
                type="text"
                id="brand"
                {...register('brand')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Imagen del Producto */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Imagen del Producto
          </h2>

          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setImageFile(null)
                    setValue('image_url', '')
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click para subir</span> o
                      arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB
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
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo imagen...
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Producto'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

