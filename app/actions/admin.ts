'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema de validación para productos
const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  points_per_unit: z.number().int().min(0, 'Los puntos deben ser mayor o igual a 0'),
  category: z.string().optional(),
  brand: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  sku: z.string().min(1, 'El SKU es requerido'),
})

export async function createProduct(data: z.infer<typeof productSchema>) {
  const supabase = await createClient()

  // Verificar que el usuario es admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    // Validar datos
    const validatedData = productSchema.parse(data)

    // Verificar que el SKU no existe
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('sku', validatedData.sku)
      .single()

    if (existingProduct) {
      return { success: false, error: 'El SKU ya existe' }
    }

    // Crear producto
    const { data: product, error } = await supabase
      .from('products')
      // @ts-ignore - TypeScript inference issue with products table
      .insert({
        sku: validatedData.sku,
        name: validatedData.name,
        description: validatedData.description || null,
        base_price: validatedData.base_price,
        points_per_unit: validatedData.points_per_unit,
        category: validatedData.category || null,
        brand: validatedData.brand || null,
        image_url: validatedData.image_url && validatedData.image_url !== '' ? validatedData.image_url : null,
        is_active: true,
        is_pack: false,
        is_featured: false,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true, product }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Error de validación' }
    }
    return { success: false, error: error.message || 'Error al crear producto' }
  }
}

export async function updateProduct(
  id: string,
  data: Partial<z.infer<typeof productSchema>>
) {
  const supabase = await createClient()

  // Verificar admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    const validatedData = productSchema.partial().parse(data)

    const { error } = await supabase
      .from('products')
      // @ts-ignore - TypeScript inference issue with products table
      .update(validatedData)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Error de validación' }
    }
    return { success: false, error: error.message || 'Error al actualizar producto' }
  }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  // Verificar admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar producto' }
  }
}

// Server Action para agregar stock
export async function addStock(
  productId: string,
  warehouseId: string,
  quantity: number
) {
  const supabase = await createClient()

  // Verificar admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    return { success: false, error: 'No autorizado' }
  }

  try {
    if (quantity <= 0) {
      return { success: false, error: 'La cantidad debe ser mayor a 0' }
    }

    // Verificar si existe el registro de inventario
    const { data: existingInventory } = await supabase
      .from('inventory_items')
      .select('quantity')
      .eq('product_id', productId)
      .eq('warehouse_id', warehouseId)
      .single()

    if (existingInventory) {
      // Actualizar stock existente (sumar)
      const { error } = await supabase
        .from('inventory_items')
        // @ts-ignore - TypeScript inference issue with inventory_items table
        .update({
          quantity: existingInventory.quantity + quantity,
        })
        .eq('product_id', productId)
        .eq('warehouse_id', warehouseId)

      if (error) throw error
    } else {
      // Crear nuevo registro de inventario
      // @ts-ignore - TypeScript inference issue with inventory_items table
      const { error } = await supabase.from('inventory_items').insert({
        product_id: productId,
        warehouse_id: warehouseId,
        quantity: quantity,
        reserved_quantity: 0,
      })

      if (error) throw error
    }

    revalidatePath('/admin/inventory')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al agregar stock' }
  }
}

