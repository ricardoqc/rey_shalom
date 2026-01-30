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
  paymentProofUrl: string,
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

    const warehouseId = (warehouses as any).id

    // 4. Validar stock y calcular totales
    let subtotal = 0
    let totalPoints = 0

    for (const item of cartItems) {
      // Verificar stock
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory_items')
        .select('quantity')
        .eq('product_id', (item as any).id)
        .eq('warehouse_id', warehouseId)
        .single()

      if (inventoryError || !inventory) {
        return {
          success: false,
          error: `Producto ${(item as any).name} no disponible en inventario`,
        }
      }

      if ((inventory as any).quantity < (item as any).quantity) {
        return {
          success: false,
          error: `Stock insuficiente para ${(item as any).name}. Disponible: ${(inventory as any).quantity}`,
        }
      }

      subtotal += (item as any).price * (item as any).quantity
      totalPoints += (item as any).points * (item as any).quantity
    }

    const shippingCost = 0 // Por ahora gratis, puedes calcular según ubicación
    const discountAmount = 0 // Puedes calcular descuentos adicionales aquí
    const totalAmount = subtotal + shippingCost - discountAmount

    // 5. Validar que se proporcionó el comprobante de pago
    if (!paymentProofUrl) {
      return {
        success: false,
        error: 'Debes adjuntar un comprobante de pago',
      }
    }

    // 6. Crear la orden con status 'pending'
    const { data: order, error: orderError } = await supabase
      .from('orders')
      // @ts-ignore - TypeScript inference issue with Supabase client types
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
        payment_status: 'pending', // Pendiente de aprobación
        payment_proof_url: paymentProofUrl,
        payment_method: 'VOUCHER',
      })
      .select()
      .single()

    if (orderError || !order) {
      return {
        success: false,
        error: 'Error al crear la orden',
      }
    }

    // 7. Crear items de la orden
    const orderItems = cartItems.map((item) => ({
      order_id: (order as any).id,
      product_id: (item as any).id,
      quantity: (item as any).quantity,
      unit_price: (item as any).price,
      total_price: (item as any).price * (item as any).quantity,
      points_per_unit: (item as any).points,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      // @ts-ignore - TypeScript inference issue with Supabase client types
      .insert(orderItems)

    if (itemsError) {
      // Rollback: eliminar la orden si falla
      await supabase.from('orders').delete().eq('id', (order as any).id)
      return {
        success: false,
        error: 'Error al crear items de la orden',
      }
    }

    // 8. Reservar stock usando la función SQL (p_reserve: true)
    // Esto reserva el stock pero no lo descuenta hasta que se apruebe el pago
    for (const item of cartItems) {
      // @ts-ignore - TypeScript inference issue with Supabase RPC functions
      const { error: stockError } = await supabase.rpc('decrease_stock', {
        p_warehouse_id: warehouseId,
        p_product_id: (item as any).id,
        p_quantity: (item as any).quantity,
        p_reserve: true, // Reservar stock, no descontar todavía
      })

      if (stockError) {
        console.error(`Error reservando stock para ${(item as any).name}:`, stockError)
        // Rollback: eliminar la orden si falla la reserva de stock
        await supabase.from('orders').delete().eq('id', (order as any).id)
        return {
          success: false,
          error: `Error al reservar stock para ${(item as any).name}`,
        }
      }
    }

    // NOTA: Las comisiones NO se calculan aquí
    // Se calcularán cuando el admin apruebe el pago (payment_status = 'approved')
    // Los puntos tampoco se otorgan hasta que se apruebe el pago

    revalidatePath('/dashboard')
    revalidatePath('/checkout')

    return {
      success: true,
      orderId: (order as any).id,
      orderNumber: (order as any).order_number,
    }
  } catch (error: any) {
    console.error('Error procesando orden:', error)
    return {
      success: false,
      error: error.message || 'Error inesperado al procesar la orden',
    }
  }
}

export async function getProducts(options?: { category?: string; featured?: boolean }) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
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
    quantity: (inventory as any).quantity,
    warehouseId: (inventory as any).warehouse_id,
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
    new Set(data.map((p: any) => p.category).filter(Boolean))
  ) as string[]

  return categories
}

