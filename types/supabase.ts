// Tipos generados automáticamente por Supabase CLI
// Ejecuta: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
// Por ahora, definimos tipos básicos

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          public_name: string | null
          referral_code: string
          sponsor_id: string | null
          status_level: 'BRONCE' | 'PLATA' | 'ORO'
          current_points: number
          total_points_earned: number
          dni: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          is_active: boolean
          last_activity_at: string | null
          whatsapp_number: string | null
          whatsapp_type: 'personal' | 'business'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          public_name?: string | null
          referral_code: string
          sponsor_id?: string | null
          status_level?: 'BRONCE' | 'PLATA' | 'ORO'
          current_points?: number
          total_points_earned?: number
          dni?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          is_active?: boolean
          last_activity_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          public_name?: string | null
          referral_code?: string
          sponsor_id?: string | null
          status_level?: 'BRONCE' | 'PLATA' | 'ORO'
          current_points?: number
          total_points_earned?: number
          dni?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          is_active?: boolean
          last_activity_at?: string | null
          whatsapp_number?: string | null
          whatsapp_type?: 'personal' | 'business'
          created_at?: string
          updated_at?: string
        }
      }
      user_payment_methods: {
        Row: {
          id: string
          user_id: string
          method_type: 'BANK_ACCOUNT' | 'PAYPAL' | 'WISE' | 'WESTERN_UNION' | 'YAPE' | 'PLIN' | 'OTHER'
          provider_name: string | null
          account_number: string
          account_holder_name: string | null
          routing_number: string | null
          swift_code: string | null
          currency: 'PEN' | 'USD' | 'EUR'
          is_default: boolean
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          method_type: 'BANK_ACCOUNT' | 'PAYPAL' | 'WISE' | 'WESTERN_UNION' | 'YAPE' | 'PLIN' | 'OTHER'
          provider_name?: string | null
          account_number: string
          account_holder_name?: string | null
          routing_number?: string | null
          swift_code?: string | null
          currency?: 'PEN' | 'USD' | 'EUR'
          is_default?: boolean
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          method_type?: 'BANK_ACCOUNT' | 'PAYPAL' | 'WISE' | 'WESTERN_UNION' | 'YAPE' | 'PLIN' | 'OTHER'
          provider_name?: string | null
          account_number?: string
          account_holder_name?: string | null
          routing_number?: string | null
          swift_code?: string | null
          currency?: 'PEN' | 'USD' | 'EUR'
          is_default?: boolean
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_social_links: {
        Row: {
          id: string
          user_id: string
          platform: 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'TIKTOK' | 'YOUTUBE' | 'LINKEDIN' | 'TWITTER' | 'OTHER'
          url: string
          display_name: string | null
          is_public: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'TIKTOK' | 'YOUTUBE' | 'LINKEDIN' | 'TWITTER' | 'OTHER'
          url: string
          display_name?: string | null
          is_public?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'TIKTOK' | 'YOUTUBE' | 'LINKEDIN' | 'TWITTER' | 'OTHER'
          url?: string
          display_name?: string | null
          is_public?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_stores: {
        Row: {
          id: string
          user_id: string
          store_name: string | null
          store_description: string | null
          store_banner_url: string | null
          store_logo_url: string | null
          store_theme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'dark'
          is_active: boolean
          custom_domain: string | null
          seo_keywords: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          store_name?: string | null
          store_description?: string | null
          store_banner_url?: string | null
          store_logo_url?: string | null
          store_theme?: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'dark'
          is_active?: boolean
          custom_domain?: string | null
          seo_keywords?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          store_name?: string | null
          store_description?: string | null
          store_banner_url?: string | null
          store_logo_url?: string | null
          store_theme?: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'dark'
          is_active?: boolean
          custom_domain?: string | null
          seo_keywords?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          transaction_type: 'COMMISSION' | 'PURCHASE' | 'WITHDRAWAL' | 'ADJUSTMENT' | 'BONUS'
          amount: number
          balance_after: number
          order_id: string | null
          related_user_id: string | null
          commission_level: number | null
          description: string | null
          status: 'COMPLETED' | 'PENDING' | 'CANCELLED'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_type: 'COMMISSION' | 'PURCHASE' | 'WITHDRAWAL' | 'ADJUSTMENT' | 'BONUS'
          amount: number
          balance_after: number
          order_id?: string | null
          related_user_id?: string | null
          commission_level?: number | null
          description?: string | null
          status?: 'COMPLETED' | 'PENDING' | 'CANCELLED'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_type?: 'COMMISSION' | 'PURCHASE' | 'WITHDRAWAL' | 'ADJUSTMENT' | 'BONUS'
          amount?: number
          balance_after?: number
          order_id?: string | null
          related_user_id?: string | null
          commission_level?: number | null
          description?: string | null
          status?: 'COMPLETED' | 'PENDING' | 'CANCELLED'
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          affiliate_id: string | null
          total_amount: number
          points_earned: number
          payment_status: 'pending' | 'approved' | 'rejected'
          payment_proof_url: string | null
          admin_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          affiliate_id?: string | null
          total_amount: number
          points_earned?: number
          payment_status?: 'pending' | 'approved' | 'rejected'
          payment_proof_url?: string | null
          admin_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          affiliate_id?: string | null
          total_amount?: number
          points_earned?: number
          payment_status?: 'pending' | 'approved' | 'rejected'
          payment_proof_url?: string | null
          admin_notes?: string | null
          created_at?: string
        }
      }
      rank_requirements: {
        Row: {
          id: string
          rank_name: 'BRONCE' | 'PLATA' | 'ORO'
          min_points: number
          commission_bonus_percentage: number
          purchase_discount_percentage: number
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rank_name: 'BRONCE' | 'PLATA' | 'ORO'
          min_points: number
          commission_bonus_percentage?: number
          purchase_discount_percentage?: number
          display_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rank_name?: 'BRONCE' | 'PLATA' | 'ORO'
          min_points?: number
          commission_bonus_percentage?: number
          purchase_discount_percentage?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          sku: string
          name: string
          description: string | null
          base_price: number
          points_per_unit: number
          category: string | null
          brand: string | null
          image_url: string | null
          is_pack: boolean
          target_rank: string | null
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          name: string
          description?: string | null
          base_price: number
          points_per_unit?: number
          category?: string | null
          brand?: string | null
          image_url?: string | null
          is_pack?: boolean
          target_rank?: string | null
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          name?: string
          description?: string | null
          base_price?: number
          points_per_unit?: number
          category?: string | null
          brand?: string | null
          image_url?: string | null
          is_pack?: boolean
          target_rank?: string | null
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          product_id: string
          warehouse_id: string
          quantity: number
          reserved_quantity: number
          min_stock_level: number
          reorder_point: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          warehouse_id: string
          quantity?: number
          reserved_quantity?: number
          min_stock_level?: number
          reorder_point?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          warehouse_id?: string
          quantity?: number
          reserved_quantity?: number
          min_stock_level?: number
          reorder_point?: number
          created_at?: string
          updated_at?: string
        }
      }
      warehouses: {
        Row: {
          id: string
          name: string
          code: string
          address: string | null
          city: string | null
          country: string | null
          latitude: number | null
          longitude: number | null
          is_active: boolean
          is_central: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          address?: string | null
          city?: string | null
          country?: string | null
          latitude?: number | null
          longitude?: number | null
          is_active?: boolean
          is_central?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          address?: string | null
          city?: string | null
          country?: string | null
          latitude?: number | null
          longitude?: number | null
          is_active?: boolean
          is_central?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          discount_percentage: number
          total_price: number
          points_per_unit: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          discount_percentage?: number
          total_price: number
          points_per_unit?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          discount_percentage?: number
          total_price?: number
          points_per_unit?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

