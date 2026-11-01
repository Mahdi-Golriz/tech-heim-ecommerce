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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          color: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          user_id: string
        }
        Update: {
          color?: string
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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          position: number
          slug: string
          thumbnail_path: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          position?: number
          slug: string
          thumbnail_path?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          position?: number
          slug?: string
          thumbnail_path?: string | null
          title?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          title: string
          unit_price: number
        }
        Insert: {
          color: string
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          title: string
          unit_price: number
        }
        Update: {
          color?: string
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          title?: string
          unit_price?: number
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
          billing_address: string
          card_last4: string
          created_at: string
          delivery_address: string
          discount: number
          email: string
          id: string
          shipping_cost: number
          shipping_method: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          user_id: string
        }
        Insert: {
          billing_address: string
          card_last4: string
          created_at?: string
          delivery_address: string
          discount: number
          email: string
          id?: string
          shipping_cost: number
          shipping_method: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          user_id: string
        }
        Update: {
          billing_address?: string
          card_last4?: string
          created_at?: string
          delivery_address?: string
          discount?: number
          email?: string
          id?: string
          shipping_cost?: number
          shipping_method?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_method_fkey"
            columns: ["shipping_method"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["code"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          id: string
          position: number
          product_id: string
          storage_path: string
        }
        Insert: {
          alt?: string | null
          id?: string
          position?: number
          product_id: string
          storage_path: string
        }
        Update: {
          alt?: string | null
          id?: string
          position?: number
          product_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number
          colors: string[]
          created_at: string
          description: string | null
          details: Json
          discount_percentage: number | null
          final_price: number | null
          id: string
          is_new: boolean
          on_sale: boolean | null
          price: number
          rate: number | null
          search_vector: unknown
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id: number
          colors?: string[]
          created_at?: string
          description?: string | null
          details?: Json
          discount_percentage?: number | null
          final_price?: number | null
          id?: string
          is_new?: boolean
          on_sale?: boolean | null
          price: number
          rate?: number | null
          search_vector?: unknown
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: number
          colors?: string[]
          created_at?: string
          description?: string | null
          details?: Json
          discount_percentage?: number | null
          final_price?: number | null
          id?: string
          is_new?: boolean
          on_sale?: boolean | null
          price?: number
          rate?: number | null
          search_vector?: unknown
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          postal_code: string | null
          updated_at: string
          username: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      shipping_methods: {
        Row: {
          code: string
          position: number
          price: number
        }
        Insert: {
          code: string
          position?: number
          price: number
        }
        Update: {
          code?: string
          position?: number
          price?: number
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
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
      add_to_cart: {
        Args: { p_color: string; p_product_id: string; p_quantity?: number }
        Returns: undefined
      }
      merge_cart: { Args: { p_items: Json }; Returns: undefined }
      place_order: {
        Args: {
          p_billing_address: string
          p_card_last4: string
          p_delivery_address: string
          p_shipping_method: string
        }
        Returns: string
      }
      set_cart_item_quantity: {
        Args: { p_item_id: string; p_quantity: number }
        Returns: undefined
      }
    }
    Enums: {
      order_status: "paid" | "cancelled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      order_status: ["paid", "cancelled"],
    },
  },
} as const
