export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_reports: {
        Row: {
          admin_action: string | null
          created_at: string
          description: string
          id: string
          order_id: string | null
          reporter_id: string
          reporter_name: string
          seller_id: string
          seller_name: string
          status: Database["public"]["Enums"]["fraud_report_status"]
          type: Database["public"]["Enums"]["fraud_report_type"]
          updated_at: string
        }
        Insert: {
          admin_action?: string | null
          created_at?: string
          description?: string
          id?: string
          order_id?: string | null
          reporter_id: string
          reporter_name?: string
          seller_id: string
          seller_name?: string
          status?: Database["public"]["Enums"]["fraud_report_status"]
          type: Database["public"]["Enums"]["fraud_report_type"]
          updated_at?: string
        }
        Update: {
          admin_action?: string | null
          created_at?: string
          description?: string
          id?: string
          order_id?: string | null
          reporter_id?: string
          reporter_name?: string
          seller_id?: string
          seller_name?: string
          status?: Database["public"]["Enums"]["fraud_report_status"]
          type?: Database["public"]["Enums"]["fraud_report_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          aadhaar_back_url: string | null
          aadhaar_front_url: string | null
          aadhaar_number: string
          address: string
          bank_account: string | null
          full_name: string
          id: string
          ifsc_code: string | null
          pan_card_url: string | null
          pan_number: string
          phone: string
          rejection_reason: string | null
          reviewed_at: string | null
          seller_id: string
          shop_photo_url: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          submitted_at: string
          upi_id: string | null
        }
        Insert: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_number?: string
          address?: string
          bank_account?: string | null
          full_name?: string
          id?: string
          ifsc_code?: string | null
          pan_card_url?: string | null
          pan_number?: string
          phone?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          seller_id: string
          shop_photo_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
          upi_id?: string | null
        }
        Update: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_number?: string
          address?: string
          bank_account?: string | null
          full_name?: string
          id?: string
          ifsc_code?: string | null
          pan_card_url?: string | null
          pan_number?: string
          phone?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          seller_id?: string
          shop_photo_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price: number
          product_id: string
          product_image: string
          product_name: string
          quantity: number
          seller_id: string
          seller_name: string
        }
        Insert: {
          id?: string
          order_id: string
          price: number
          product_id: string
          product_image?: string
          product_name?: string
          quantity?: number
          seller_id: string
          seller_name?: string
        }
        Update: {
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_image?: string
          product_name?: string
          quantity?: number
          seller_id?: string
          seller_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          buyer_id: string
          buyer_name: string
          created_at: string
          delivery_partner_id: string | null
          id: string
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
        }
        Insert: {
          address?: string
          buyer_id: string
          buyer_name?: string
          created_at?: string
          delivery_partner_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Update: {
          address?: string
          buyer_id?: string
          buyer_name?: string
          created_at?: string
          delivery_partner_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image: string
          mrp: number
          name: string
          price: number
          rating: number
          rejection_reason: string | null
          review_count: number
          seller_id: string
          seller_name: string
          status: Database["public"]["Enums"]["product_status"]
          stock: number
          trust_score: number
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          mrp: number
          name: string
          price: number
          rating?: number
          rejection_reason?: string | null
          review_count?: number
          seller_id: string
          seller_name?: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          trust_score?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          mrp?: number
          name?: string
          price?: number
          rating?: number
          rejection_reason?: string | null
          review_count?: number
          seller_id?: string
          seller_name?: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          trust_score?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          is_suspended: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string
          id: string
          is_suspended?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          is_suspended?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      trust_scores: {
        Row: {
          badge: Database["public"]["Enums"]["trust_badge"]
          buyer_rating: number
          complaint_count: number
          id: string
          kyc_verified: boolean
          order_completion_rate: number
          seller_id: string
          total_score: number
          updated_at: string
        }
        Insert: {
          badge?: Database["public"]["Enums"]["trust_badge"]
          buyer_rating?: number
          complaint_count?: number
          id?: string
          kyc_verified?: boolean
          order_completion_rate?: number
          seller_id: string
          total_score?: number
          updated_at?: string
        }
        Update: {
          badge?: Database["public"]["Enums"]["trust_badge"]
          buyer_rating?: number
          complaint_count?: number
          id?: string
          kyc_verified?: boolean
          order_completion_rate?: number
          seller_id?: string
          total_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_trust_score: { Args: { _seller_id: string }; Returns: number }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "buyer" | "seller" | "admin" | "delivery"
      fraud_report_status:
        | "pending"
        | "investigating"
        | "resolved"
        | "dismissed"
      fraud_report_type: "fake_product" | "wrong_delivery" | "scam"
      kyc_status: "not_submitted" | "pending" | "approved" | "rejected"
      order_status:
        | "placed"
        | "confirmed"
        | "shipped"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      product_status: "pending" | "approved" | "rejected"
      trust_badge: "bronze" | "silver" | "gold" | "diamond"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["buyer", "seller", "admin", "delivery"],
      fraud_report_status: [
        "pending",
        "investigating",
        "resolved",
        "dismissed",
      ],
      fraud_report_type: ["fake_product", "wrong_delivery", "scam"],
      kyc_status: ["not_submitted", "pending", "approved", "rejected"],
      order_status: [
        "placed",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      product_status: ["pending", "approved", "rejected"],
      trust_badge: ["bronze", "silver", "gold", "diamond"],
    },
  },
} as const
