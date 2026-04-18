/**
 * TIPOS DE BASE DE DATOS — Supabase
 * ------------------------------------
 * Ruta: src/types/database.ts
 *
 * Estos tipos reflejan exactamente el schema.sql.
 * Para regenerarlos automáticamente después de cambios:
 *   npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/database.ts
 */

export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id:         string;
          name:       string;
          slug:       string;
          parent_id:  string | null;
          position:   number;
          is_active:  boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:        string;
          name:       string;
          slug:       string;
          parent_id?: string | null;
          position?:  number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };

      products: {
        Row: {
          id:                string;
          slug:              string;
          name:              string;
          description:       string;
          short_description: string | null;
          material:          string | null;
          care_instructions: string[] | null;
          price:             number;
          compare_at_price:  number | null;
          currency:          string;
          category_id:       string;
          tags:              string[];
          badges:            string[];
          seo_title:         string | null;
          seo_description:   string | null;
          seo_keywords:      string[] | null;
          is_active:         boolean;
          published_at:      string;
          created_at:        string;
          updated_at:        string;
        };
        Insert: {
          id?:               string;
          slug:              string;
          name:              string;
          description?:      string;
          short_description?: string | null;
          material?:         string | null;
          care_instructions?: string[] | null;
          price:             number;
          compare_at_price?: number | null;
          currency?:         string;
          category_id:       string;
          tags?:             string[];
          badges?:           string[];
          seo_title?:        string | null;
          seo_description?:  string | null;
          seo_keywords?:     string[] | null;
          is_active?:        boolean;
          published_at?:     string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };

      product_images: {
        Row: {
          id:         string;
          product_id: string;
          url:        string;
          alt:        string;
          position:   number;
          width:      number | null;
          height:     number | null;
          created_at: string;
        };
        Insert: {
          id?:        string;
          product_id: string;
          url:        string;
          alt?:       string;
          position?:  number;
          width?:     number | null;
          height?:    number | null;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };

      product_variants: {
        Row: {
          id:         string;
          product_id: string;
          sku:        string;
          color_name: string;
          color_hex:  string;
          size:       string;
          stock:      number;
          price:      number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:        string;
          product_id: string;
          sku:        string;
          color_name: string;
          color_hex:  string;
          size:       string;
          stock?:     number;
          price?:     number | null;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };

      orders: {
        Row: {
          id:                    string;
          order_number:          string;
          customer_email:        string;
          customer_name:         string;
          customer_phone:        string | null;
          shipping_address:      Json;
          subtotal:              number;
          shipping_cost:         number;
          discount_amount:       number;
          total:                 number;
          currency:              string;
          payment_status:        "pending" | "approved" | "declined" | "voided" | "error";
          payment_method:        string | null;
          wompi_transaction_id:  string | null;
          wompi_reference:       string | null;
          paid_at:               string | null;
          status:                "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          notes:                 string | null;
          created_at:            string;
          updated_at:            string;
        };
        Insert: {
          id?:                    string;
          order_number?:          string;
          customer_email:         string;
          customer_name:          string;
          customer_phone?:        string | null;
          shipping_address:       Json;
          subtotal:               number;
          shipping_cost?:         number;
          discount_amount?:       number;
          total:                  number;
          currency?:              string;
          payment_status?:        "pending" | "approved" | "declined" | "voided" | "error";
          payment_method?:        string | null;
          wompi_transaction_id?:  string | null;
          wompi_reference?:       string | null;
          paid_at?:               string | null;
          status?:                "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          notes?:                 string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };

      order_items: {
        Row: {
          id:           string;
          order_id:     string;
          product_id:   string;
          variant_id:   string | null;
          product_name: string;
          product_slug: string;
          image_url:    string;
          color_name:   string;
          color_hex:    string;
          size:         string;
          sku:          string;
          unit_price:   number;
          quantity:     number;
          subtotal:     number; // columna generada
          created_at:   string;
        };
        Insert: {
          id?:          string;
          order_id:     string;
          product_id:   string;
          variant_id?:  string | null;
          product_name: string;
          product_slug: string;
          image_url?:   string;
          color_name:   string;
          color_hex:    string;
          size:         string;
          sku:          string;
          unit_price:   number;
          quantity:     number;
        };
        Update: never; // order_items son inmutables
      };
    };
    Views: {
      catalog_view: {
        Row: {
          id:                string;
          slug:              string;
          name:              string;
          description:       string;
          short_description: string | null;
          material:          string | null;
          care_instructions: string[] | null;
          price:             number;
          compare_at_price:  number | null;
          currency:          string;
          tags:              string[];
          badges:            string[];
          seo_title:         string | null;
          seo_description:   string | null;
          seo_keywords:      string[] | null;
          is_active:         boolean;
          published_at:      string;
          updated_at:        string;
          category:          Json;
          images:            Json;
          variants:          Json;
        };
      };
    };
    Functions: {
      generate_order_number: {
        Args:    Record<string, never>;
        Returns: string;
      };
    };
  };
}
