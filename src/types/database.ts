/**
 * Supabaseデータベースの型定義
 *
 * 【学習ポイント】
 * - Supabaseのテーブル構造をTypeScriptの型として定義
 * - 型安全なデータベース操作を可能にする
 * - Insert, Update, Selectの各操作に対応した型を提供
 *
 * 【使用技術】
 * - TypeScript: 静的型チェック
 * - Supabase: PostgreSQLベースのBaaS
 * - 型推論: データベーススキーマからの自動型生成
 */

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
      // ユーザープロフィールテーブル
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // 日報テーブル
      daily_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          start_time: string | null;
          end_time: string | null;
          start_mileage: number | null;
          end_mileage: number | null;
          total_distance: number | null;
          fuel_cost: number | null;
          toll_cost: number | null;
          parking_cost: number | null;
          other_expenses: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          start_time?: string | null;
          end_time?: string | null;
          start_mileage?: number | null;
          end_mileage?: number | null;
          total_distance?: number | null;
          fuel_cost?: number | null;
          toll_cost?: number | null;
          parking_cost?: number | null;
          other_expenses?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          start_time?: string | null;
          end_time?: string | null;
          start_mileage?: number | null;
          end_mileage?: number | null;
          total_distance?: number | null;
          fuel_cost?: number | null;
          toll_cost?: number | null;
          parking_cost?: number | null;
          other_expenses?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // 車両情報テーブル
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          license_plate: string;
          fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          license_plate: string;
          fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          license_plate?: string;
          fuel_type?: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// 便利な型エイリアス
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// 具体的なテーブル型
export type Profile = Tables<'profiles'>;
export type DailyLog = Tables<'daily_logs'>;
export type Vehicle = Tables<'vehicles'>;

// Insert用の型
export type ProfileInsert = TablesInsert<'profiles'>;
export type DailyLogInsert = TablesInsert<'daily_logs'>;
export type VehicleInsert = TablesInsert<'vehicles'>;

// Update用の型
export type ProfileUpdate = TablesUpdate<'profiles'>;
export type DailyLogUpdate = TablesUpdate<'daily_logs'>;
export type VehicleUpdate = TablesUpdate<'vehicles'>;
