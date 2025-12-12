import { Database } from '@/types/supabase'

type RankRequirement = Database['public']['Tables']['rank_requirements']['Row']

export function calculateProductPrice(
  basePrice: number,
  userRank: 'BRONCE' | 'PLATA' | 'ORO' | null,
  rankRequirements: RankRequirement[]
): {
  finalPrice: number
  discountPercentage: number
} {
  // Si no hay usuario o no hay rango, retornar precio base
  if (!userRank || rankRequirements.length === 0) {
    return {
      finalPrice: basePrice,
      discountPercentage: 0,
    }
  }

  // Buscar el descuento del rango del usuario
  const rankConfig = rankRequirements.find((r) => r.rank_name === userRank)

  if (!rankConfig || !rankConfig.purchase_discount_percentage) {
    return {
      finalPrice: basePrice,
      discountPercentage: 0,
    }
  }

  const discountPercentage = Number(rankConfig.purchase_discount_percentage)
  const discountAmount = (basePrice * discountPercentage) / 100
  const finalPrice = basePrice - discountAmount

  return {
    finalPrice: Math.round(finalPrice * 100) / 100, // Redondear a 2 decimales
    discountPercentage: Math.round(discountPercentage),
  }
}

