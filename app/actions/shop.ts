'use server'

import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  points: number
  sku: string
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  country: string
  phone: string
  latitude?: number
  longitude?: number
}

interface ProcessOrderResult {
  success: boolean
  orderId?: string
  orderNumber?: string
  error?: string
}

export async function processOrder(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress,
  affiliateId?: string
): Promise<ProcessOrderResult> {
  const supabase = await createClient()

  try {
    // 1. Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Debes estar autenticado para realizar una compra',
      }
    }

    // 2. Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return {
        success: false,
        error: 'Error al obtener perfil del usuario',
      }
    }

    // 3. Obtener bodega más cercana (por ahora usar la central)
    const { data: warehouses } = await supabase
      .from('warehouses')
      .select('id')
      .eq('is_central', true)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (!warehouses) {
      return {
        success: false,
        error: 'No hay bodegas disponibles',
      }
    }

    const warehouseId = warehouses.id

    // 4. Validar stock y calcular totales
    let subtotal = 0
    let totalPoints = 0

    for (const item of cartItems) {
      // Verificar stock
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory_items')
        .select('quantity')
        .eq('product_id', item.id)
        .eq('warehouse_id', warehouseId)
        .single()

      if (inventoryError || !inventory) {
        return {
          success: false,
          error: `Producto ${item.name} no disponible en inventario`,
        }
      }

      if (inventory.quantity < item.quantity) {
        return {
          success: false,
          error: `Stock insuficiente para ${item.name}. Disponible: ${inventory.quantity}`,
        }
      }

      subtotal += item.price * item.quantity
      totalPoints += item.points * item.quantity
    }

    const shippingCost = 0 // Por ahora gratis, puedes calcular según ubicación
    const discountAmount = 0 // Puedes calcular descuentos adicionales aquí
    const totalAmount = subtotal + shippingCost - discountAmount

    // 5. Crear la orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        affiliate_id: affiliateId || null,
        shipping_name: shippingAddress.name,
        shipping_address: shippingAddress.address,
        shipping_city: shippingAddress.city,
        shipping_country: shippingAddress.country,
        shipping_phone: shippingAddress.phone,
        shipping_latitude: shippingAddress.latitude || null,
        shipping_longitude: shippingAddress.longitude || null,
        subtotal,
        discount_amount: discountAmount,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        points_earned: totalPoints,
        fulfillment_warehouse_id: warehouseId,
        fulfillment_status: 'PENDING',
        payment_status: 'PAID', // Mock payment - cambiar cuando integres Stripe
        payment_method: 'MOCK',
      })
      .select()
      .single()

    if (orderError || !order) {
      return {
        success: false,
        error: 'Error al crear la orden',
      }
    }

    // 6. Crear items de la orden
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      points_per_unit: item.points,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // Rollback: eliminar la orden si falla
      await supabase.from('orders').delete().eq('id', order.id)
      return {
        success: false,
        error: 'Error al crear items de la orden',
      }
    }

    // 7. Disminuir stock usando la función SQL
    for (const item of cartItems) {
      const { error: stockError } = await supabase.rpc('decrease_stock', {
        p_warehouse_id: warehouseId,
        p_product_id: item.id,
        p_quantity: item.quantity,
        p_reserve: false,
      })

      if (stockError) {
        console.error(`Error disminuyendo stock para ${item.name}:`, stockError)
        // Continuar con otros items, pero registrar el error
      }
    }

    // 8. Calcular comisiones usando la función SQL
    const { error: commissionError } = await supabase.rpc('calculate_commissions', {
      p_order_id: order.id,
    })

    if (commissionError) {
      console.error('Error calculando comisiones:', commissionError)
      // No fallar la orden por esto, pero registrar el error
    }

    // 9. Actualizar puntos del usuario (el trigger debería hacerlo, pero por si acaso)
    const { error: pointsError } = await supabase.rpc('update_user_points', {
      p_user_id: user.id,
      p_points: totalPoints,
    })

    if (pointsError) {
      console.error('Error actualizando puntos:', pointsError)
    }

    revalidatePath('/dashboard')
    revalidatePath('/checkout')

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    }
  } catch (error: any) {
    console.error('Error procesando orden:', error)
    return {
      success: false,
      error: error.message || 'Error inesperado al procesar la orden',
    }
  }
}

export async function getProducts(category?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductInventory(productId: string, warehouseId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('inventory_items')
    .select('quantity, warehouse_id, warehouses(id, name)')
    .eq('product_id', productId)
    .gt('quantity', 0)

  if (warehouseId) {
    query = query.eq('warehouse_id', warehouseId)
  }

  const { data, error } = await query

  if (error || !data || data.length === 0) {
    return null
  }

  // Retornar el inventario de la bodega central o la primera disponible
  const centralWarehouse = data.find((item: any) => item.warehouses?.is_central)
  const inventory = centralWarehouse || data[0]

  return {
    quantity: inventory.quantity,
    warehouseId: inventory.warehouse_id,
  }
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true)
    .not('category', 'is', null)

  if (error) {
    return []
  }

  // Obtener categorías únicas
  const categories = Array.from(
    new Set(data.map((p) => p.category).filter(Boolean))
  ) as string[]

  return categories
}

