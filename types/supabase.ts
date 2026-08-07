// types/supabase.ts
// TypeScript types untuk schema Supabase (dihasilkan manual sesuai migration 0001)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          parent_name: string;
          email: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          parent_name?: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_name?: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      children: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          age: number;
          special_needs: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          age: number;
          special_needs?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          age?: number;
          special_needs?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          category: string;
          age_range: string;
          price: number;
          seats: number;
          image: string | null;
          description: string | null;
          facilitator: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          age_range: string;
          price?: number;
          seats?: number;
          image?: string | null;
          description?: string | null;
          facilitator?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          age_range?: string;
          price?: number;
          seats?: number;
          image?: string | null;
          description?: string | null;
          facilitator?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      vouchers: {
        Row: {
          id: string;
          code: string;
          discount_amount: number;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_amount?: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_amount?: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          profile_id: string | null;
          course_id: string | null;
          child_name: string | null;
          whatsapp: string | null;
          voucher_code: string | null;
          discount: number;
          total_amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          course_id?: string | null;
          child_name?: string | null;
          whatsapp?: string | null;
          voucher_code?: string | null;
          discount?: number;
          total_amount?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          course_id?: string | null;
          child_name?: string | null;
          whatsapp?: string | null;
          voucher_code?: string | null;
          discount?: number;
          total_amount?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      screening_results: {
        Row: {
          id: string;
          child_id: string | null;
          category: string;
          status: string;
          score_date: string;
          psychologist_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id?: string | null;
          category: string;
          status?: string;
          score_date?: string;
          psychologist_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string | null;
          category?: string;
          status?: string;
          score_date?: string;
          psychologist_notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      worksheets: {
        Row: {
          id: string;
          title: string;
          age_group: string;
          category: string;
          pages: number;
          file_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          age_group: string;
          category: string;
          pages?: number;
          file_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          age_group?: string;
          category?: string;
          pages?: number;
          file_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
