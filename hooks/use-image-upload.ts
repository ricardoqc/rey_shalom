'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface UseImageUploadReturn {
  uploadImage: (
    file: File,
    bucket: 'product-images' | 'payment-proofs',
    folder?: string
  ) => Promise<string | null>
  isUploading: boolean
  error: string | null
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const uploadImage = async (
    file: File,
    bucket: 'product-images' | 'payment-proofs' = 'product-images',
    folder: string = 'products'
  ): Promise<string | null> => {
    setIsUploading(true)
    setError(null)

    try {
      // Validar tipo de archivo (imágenes o PDFs para comprobantes)
      const isImage = file.type.startsWith('image/')
      const isPdf = file.type === 'application/pdf'
      
      if (!isImage && !isPdf) {
        throw new Error('El archivo debe ser una imagen o PDF')
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo no puede ser mayor a 5MB')
      }

      // Para payment-proofs, necesitamos el user_id en el path
      let filePath: string
      if (bucket === 'payment-proofs') {
        // Obtener el usuario actual
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('Debes estar autenticado para subir comprobantes')
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        filePath = `${user.id}/${fileName}`
      } else {
        // Para product-images, usar el folder proporcionado
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        filePath = `${folder}/${fileName}`
      }

      // Subir archivo a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Obtener URL (pública para product-images, signed para payment-proofs)
      let fileUrl: string
      if (bucket === 'payment-proofs') {
        // Para buckets privados, necesitamos una URL firmada
        const { data: signedData, error: signedError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, 31536000) // 1 año de validez

        if (signedError || !signedData) {
          throw new Error('Error al generar URL del archivo')
        }
        fileUrl = signedData.signedUrl
      } else {
        // Para buckets públicos, usar URL pública
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath)
        fileUrl = publicUrl
      }

      toast.success('Archivo subido exitosamente')
      return fileUrl
    } catch (err: any) {
      const errorMessage = err.message || 'Error al subir el archivo'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadImage,
    isUploading,
    error,
  }
}

