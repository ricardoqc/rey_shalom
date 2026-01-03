'use server'

import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row']

export async function getDashboardStats(userId: string) {
  const supabase = await createClient()

  // Obtener perfil
  // @ts-ignore - TypeScript inference issue with profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // Calcular fecha de inicio del mes (reutilizable)
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Calcular ganancias totales (suma de todas las transacciones positivas)
  // @ts-ignore - TypeScript inference issue with wallet_transactions table
  const { data: transactions } = await supabase
    .from('wallet_transactions')
    .select('amount, created_at, transaction_type')
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')
    .gt('amount', 0)

  const totalEarnings =
    (transactions as any)?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0

  // Calcular ganancias del mes actual
  const monthlyEarnings =
    (transactions as any)
      ?.filter((t: any) => new Date(t.created_at) >= startOfMonth)
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0

  // Calcular ganancias de referidos (comisiones por ventas de afiliados directos)
  // Obtener IDs de afiliados directos
  // @ts-ignore - TypeScript inference issue with profiles table
  const { data: directAffiliatesList } = await supabase
    .from('profiles')
    .select('id')
    .eq('sponsor_id', userId)
    .eq('is_active', true)

  let referralsEarnings = 0
  if (directAffiliatesList && directAffiliatesList.length > 0) {
    const affiliateIds = (directAffiliatesList as any).map((a: any) => a.id)
    
    // Obtener transacciones de comisión donde related_user_id está en la lista de afiliados
    // @ts-ignore - TypeScript inference issue with wallet_transactions table
    const { data: referralTransactions } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'COMPLETED')
      .eq('transaction_type', 'COMMISSION')
      .in('related_user_id', affiliateIds)
      .gt('amount', 0)

    referralsEarnings =
      (referralTransactions as any)?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0
  }

  // Obtener balance actual (última transacción)
  // @ts-ignore - TypeScript inference issue with wallet_transactions table
  const { data: lastTransaction } = await supabase
    .from('wallet_transactions')
    .select('balance_after')
    .eq('user_id', userId)
    .eq('status', 'COMPLETED')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const currentBalance = (lastTransaction as any)?.balance_after || 0

  // Contar afiliados directos (donde sponsor_id = userId)
  // @ts-ignore - TypeScript inference issue with profiles table
  const { count: directAffiliates } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('sponsor_id', userId)
    .eq('is_active', true)

  // Obtener puntos del mes actual

  // @ts-ignore - TypeScript inference issue with orders table
  const { data: monthlyPoints } = await supabase
    .from('orders')
    .select('points_earned')
    .eq('user_id', userId)
    .in('payment_status', ['PAID', 'approved'])
    .gte('created_at', startOfMonth.toISOString())

  const pointsThisMonth =
    (monthlyPoints as any)?.reduce((sum: number, o: any) => sum + (o.points_earned || 0), 0) || 0

  // Obtener requisitos de rango
  const { data: rankRequirements } = await supabase
    .from('rank_requirements')
    .select('*')
    .order('min_points', { ascending: true })

  return {
    profile,
    totalEarnings,
    monthlyEarnings,
    referralsEarnings,
    currentBalance,
    directAffiliates: directAffiliates || 0,
    pointsThisMonth,
    rankRequirements: rankRequirements || [],
  }
}

export async function getNetworkData(userId: string) {
  const supabase = await createClient()

  // Obtener afiliados directos (nivel 1)
  // @ts-ignore - TypeScript inference issue with profiles table
  const { data: directAffiliates } = await supabase
    .from('profiles')
    .select('id, public_name, referral_code, status_level, current_points, created_at')
    .eq('sponsor_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!directAffiliates) return []

  // Para cada afiliado directo, obtener sus ventas del mes
  const networkData = await Promise.all(
    (directAffiliates as any).map(async (affiliate: any) => {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      // Contar órdenes del mes
      const { count: monthlyOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', affiliate.id)
        .in('payment_status', ['PAID', 'approved'])
        .gte('created_at', startOfMonth.toISOString())

      // Calcular ventas totales del mes
      // @ts-ignore - TypeScript inference issue with orders table
      const { data: monthlyOrdersData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('user_id', affiliate.id)
        .in('payment_status', ['PAID', 'approved'])
        .gte('created_at', startOfMonth.toISOString())

      const monthlySales =
        (monthlyOrdersData as any)?.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0) || 0

      // Determinar si está activo (compró este mes)
      const isActive = (monthlyOrders || 0) > 0

      return {
        ...affiliate,
        level: 1,
        monthlyOrders: monthlyOrders || 0,
        monthlySales,
        isActive,
      }
    })
  )

  return networkData
}

export async function getWalletTransactions(userId: string) {
  const supabase = await createClient()

  // @ts-ignore - TypeScript inference issue with wallet_transactions table
  const { data: transactions, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return transactions || []
}

