'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'

interface ApproveOrderResult {
  success: boolean
  error?: string
}

interface RejectOrderResult {
  success: boolean
  error?: string
}

/**
 * Server Action para aprobar un pedido
 * 
 * Esta función ejecuta la lógica crítica del negocio:
 * 1. Actualiza payment_status a 'approved'
 * 2. Verifica y aplica lógica de Packs (ascenso automático de rango)
 * 3. Confirma stock reservado (convierte reservado en descuento real)
 * 4. Calcula y distribuye comisiones MLM
 * 5. Otorga puntos al usuario
 * 
 * IMPORTANTE: Esta función debe ejecutarse en orden estricto
 */
export async function approveOrder(orderId: string): Promise<ApproveOrderResult> {
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
    return { success: false, error: 'No autorizado. Solo administradores pueden aprobar pedidos.' }
  }

  try {
    // PASO 1: Obtener la orden con sus items y productos
    // @ts-ignore - TypeScript inference issue with orders table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            is_pack,
            target_rank
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { success: false, error: 'Orden no encontrada' }
    }

    // Validar que la orden esté en estado pendiente
    if ((order as any).payment_status !== 'pending') {
      return {
        success: false,
        error: `La orden ya fue procesada. Estado actual: ${(order as any).payment_status}`,
      }
    }

    // Validar que tenga usuario asociado
    if (!(order as any).user_id) {
      return { success: false, error: 'La orden no tiene usuario asociado' }
    }

    // PASO 2: LÓGICA DE PACKS - Verificar si hay productos pack y actualizar rango
    const packProducts = (order as any).order_items?.filter(
      (item: any) => item.products?.is_pack === true && item.products?.target_rank
    ) || []

    if (packProducts.length > 0) {
      // Obtener el rango más alto de los packs comprados
      const targetRanks = packProducts
        .map((item: any) => item.products?.target_rank)
        .filter(Boolean) as string[]

      // Mapear rangos a formato de base de datos (BRONCE, PLATA, ORO)
      const rankMap: Record<string, 'BRONCE' | 'PLATA' | 'ORO'> = {
        bronze: 'BRONCE',
        silver: 'PLATA',
        gold: 'ORO',
        BRONCE: 'BRONCE',
        PLATA: 'PLATA',
        ORO: 'ORO',
      }

      // Determinar el rango objetivo más alto
      let highestRank: 'BRONCE' | 'PLATA' | 'ORO' | null = null
      const rankOrder = { BRONCE: 1, PLATA: 2, ORO: 3 }

      for (const rank of targetRanks) {
        const normalizedRank = rankMap[rank.toLowerCase()] || rank as 'BRONCE' | 'PLATA' | 'ORO'
        if (!highestRank || rankOrder[normalizedRank] > rankOrder[highestRank]) {
          highestRank = normalizedRank
        }
      }

      if (highestRank) {
        // Obtener el rango actual del usuario
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('status_level')
          .eq('id', (order as any).user_id)
          .single()

        // Solo actualizar si el nuevo rango es mayor que el actual
        if (userProfile && rankOrder[highestRank] > rankOrder[(userProfile as any).status_level as 'BRONCE' | 'PLATA' | 'ORO']) {
          // Actualizar el rango del usuario
          const { error: rankUpdateError } = await supabase
            .from('profiles')
            // @ts-ignore - TypeScript inference issue with Supabase client types for profiles table
            .update({ status_level: highestRank })
            .eq('id', (order as any).user_id)

          if (rankUpdateError) {
            console.error('Error actualizando rango del usuario:', rankUpdateError)
            // No fallar la orden por esto, pero registrar el error
          }
        }
      }
    }

    // PASO 3: Confirmar stock reservado (convertir reservado en descuento real)
    // Necesitamos confirmar el stock para cada item de la orden
    if ((order as any).fulfillment_warehouse_id && (order as any).order_items) {
      for (const item of (order as any).order_items) {
        // @ts-ignore - TypeScript inference issue with Supabase RPC functions
        const { error: confirmStockError } = await supabase.rpc('confirm_reserved_stock', {
          p_warehouse_id: (order as any).fulfillment_warehouse_id,
          p_product_id: (item as any).product_id,
          p_quantity: (item as any).quantity,
        })

        if (confirmStockError) {
          console.error(`Error confirmando stock para producto ${item.product_id}:`, confirmStockError)
          // Continuar con otros items, pero registrar el error
        }
      }
    }

    // PASO 4: Actualizar payment_status a 'approved'
    // Nota: Usamos 'approved' en lugar de 'PAID' para diferenciar pagos manuales
    const { error: updateStatusError } = await supabase
      .from('orders')
      // @ts-ignore - TypeScript inference issue with orders table
      .update({
        payment_status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateStatusError) {
      return { success: false, error: 'Error al actualizar estado de la orden' }
    }

    // PASO 5: Otorgar puntos al usuario
    if ((order as any).points_earned > 0) {
      // @ts-ignore - TypeScript inference issue with Supabase RPC functions
      const { error: pointsError } = await supabase.rpc('update_user_points', {
        p_user_id: (order as any).user_id,
        p_points: (order as any).points_earned,
      })

      if (pointsError) {
        console.error('Error otorgando puntos:', pointsError)
        // No fallar la orden por esto, pero registrar el error
      }
    }

    // PASO 6: Calcular comisiones MLM
    // Nota: La función calculate_commissions espera payment_status = 'PAID'
    // Actualizamos temporalmente a 'PAID' para que la función lo acepte,
    // luego lo cambiamos a 'approved' para mantener consistencia con nuestro sistema
    
    // Actualizar temporalmente a 'PAID' para que calculate_commissions funcione
    const { error: tempPaidError } = await supabase
      .from('orders')
      // @ts-ignore - TypeScript inference issue with orders table
      .update({ payment_status: 'PAID' })
      .eq('id', orderId)

    if (tempPaidError) {
      console.error('Error al preparar cálculo de comisiones:', tempPaidError)
      // Continuar aunque falle, pero registrar el error
    } else {
      // Ejecutar cálculo de comisiones solo si la actualización fue exitosa
      // @ts-ignore - TypeScript inference issue with Supabase RPC functions
      const { error: commissionError } = await supabase.rpc('calculate_commissions', {
        p_order_id: orderId,
      })

      if (commissionError) {
        console.error('Error calculando comisiones:', commissionError)
        // No fallar la orden por esto, pero registrar el error
        // Las comisiones pueden calcularse manualmente después si es necesario
      }

      // Actualizar de vuelta a 'approved' para mantener consistencia con nuestro sistema
      const { error: finalStatusError } = await supabase
        .from('orders')
        // @ts-ignore - TypeScript inference issue with orders table
        .update({ payment_status: 'approved' })
        .eq('id', orderId)

      if (finalStatusError) {
        console.error('Error actualizando estado final:', finalStatusError)
        // Si falla, dejar en 'PAID' es aceptable, pero registrar el error
      }
    }

    revalidatePath('/admin/orders')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error: any) {
    console.error('Error aprobando orden:', error)
    return {
      success: false,
      error: error.message || 'Error inesperado al aprobar la orden',
    }
  }
}

/**
 * Server Action para rechazar un pedido
 * 
 * Esta función:
 * 1. Actualiza payment_status a 'rejected'
 * 2. Libera el stock reservado
 * 3. Opcionalmente puede agregar una razón de rechazo
 */
export async function rejectOrder(
  orderId: string,
  reason?: string
): Promise<RejectOrderResult> {
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
    return { success: false, error: 'No autorizado. Solo administradores pueden rechazar pedidos.' }
  }

  try {
    // Obtener la orden con sus items
    // @ts-ignore - TypeScript inference issue with orders table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { success: false, error: 'Orden no encontrada' }
    }

    // Validar que la orden esté en estado pendiente
    if ((order as any).payment_status !== 'pending') {
      return {
        success: false,
        error: `La orden ya fue procesada. Estado actual: ${(order as any).payment_status}`,
      }
    }

    // Liberar stock reservado para cada item
    if ((order as any).fulfillment_warehouse_id && (order as any).order_items) {
      for (const item of (order as any).order_items) {
        // @ts-ignore - TypeScript inference issue with Supabase RPC functions
        const { error: releaseStockError } = await supabase.rpc('release_reserved_stock', {
          p_warehouse_id: (order as any).fulfillment_warehouse_id,
          p_product_id: (item as any).product_id,
          p_quantity: (item as any).quantity,
        })

        if (releaseStockError) {
          console.error(`Error liberando stock para producto ${item.product_id}:`, releaseStockError)
          // Continuar con otros items, pero registrar el error
        }
      }
    }

    // Actualizar estado a 'rejected'
    const { error: updateError } = await supabase
      .from('orders')
      // @ts-ignore - TypeScript inference issue with orders table
      .update({
        payment_status: 'rejected',
        admin_notes: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      return { success: false, error: 'Error al rechazar la orden' }
    }

    revalidatePath('/admin/orders')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error: any) {
    console.error('Error rechazando orden:', error)
    return {
      success: false,
      error: error.message || 'Error inesperado al rechazar la orden',
    }
  }
}

