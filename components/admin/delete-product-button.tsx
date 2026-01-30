'use client'

import { useState } from 'react'
import { deleteProduct } from '@/app/actions/admin'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar "${productName}"?`)) {
      return
    }

    setLoading(true)
    try {
      const result = await deleteProduct(productId)

      if (result.success) {
        toast.success('Producto eliminado exitosamente')
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al eliminar producto')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
      title="Eliminar producto"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </button>
  )
}

