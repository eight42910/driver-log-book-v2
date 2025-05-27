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

/**
 * JSONデータ型の定義
 * - 文字列、数値、真偽値、null、オブジェクト、配列をサポート
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Supabaseデータベースのスキーマ定義
 * - publicスキーマ内のテーブル、ビュー、関数、列挙型を定義
 */
export interface Database {
  public: {
    Tables: {
      /**
       * ユーザープロフィールテーブル
       * - ユーザーの基本情報を管理
       * - 認証情報とプロフィール情報を紐付け
       */
      users: {
        Row: {
          id: string; // ユーザーID（主キー）
          email: string; // メールアドレス
          full_name: string | null; // フルネーム
          company_name: string | null; //会社名
          phone: string | null;
          created_at: string; // 作成日時
          updated_at: string; // 更新日時
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      /**
       * 日報テーブル
       * - 日々の運転記録を管理
       * - 走行距離、経費などを記録
       */
      daily_logs: {
        Row: {
          id: string; // 日報ID（主キー）
          user_id: string; // ユーザーID（外部キー）
          date: string; // 記録日
          //走行距離関連
          start_distance: number | null; // 開始時の走行距離
          end_distance: number | null; // 終了時の走行距離
          total_distance: number | null; // 総走行距離

          //業務記録関連
          start_time: string | null; // 開始時刻
          end_time: string | null; // 終了時刻
          work_hours: number | null; //トータル就業時間
          delivery: number | null; //配達件数

          //その日の主要経費関連
          toll_cost: number | null; // 通行料
          parking_cost: number | null; // 駐車場代
          other_expenses: number | null; // その他経費

          //備考関連
          notes: string | null; // 備考

          //システムフィールド
          created_at: string; // 作成日時
          updated_at: string; // 更新日時
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          start_time?: string | null;
          end_time?: string | null;
          work_hours?: number | null; //トータル就業時間
          delivery?: number | null; //配達件数
          start_distance?: number | null; // 開始時の走行距離
          end_distance?: number | null; // 終了時の走行距離
          total_distance?: number | null; // 総走行距離
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
          work_hours?: number | null; //トータル就業時間
          delivery?: number | null; //配達件数
          start_distance?: number | null; // 開始時の走行距離
          end_distance?: number | null; // 終了時の走行距離
          toll_cost?: number | null;
          parking_cost?: number | null;
          other_expenses?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      /**
       * 経費テーブル（詳細管理用）
       * - 領収書管理
       * - 詳細な経費記録
       * - 日報との関連付け
       */
      expenses: {
        Row: {
          id: string; // 経費ID（主キー）
          user_id: string; // ユーザーID（外部キー）
          daily_log_id: string | null; // 日報ID（外部キー、オプション）
          amount: number; // 金額
          category: Database['public']['Enums']['expense_category']; // カテゴリー
          date: string; // 発生日（YYYY-MM-DD）
          description: string | null; // 説明・詳細
          receipt_url: string | null; // 領収書画像URL
          is_business_expense: boolean; // 事業経費フラグ
          created_at: string; // 作成日時
          updated_at: string; // 更新日時
        };
        Insert: {
          id?: string;
          user_id: string;
          daily_log_id?: string | null;
          amount: number;
          category: Database['public']['Enums']['expense_category'];
          date: string;
          description?: string | null;
          receipt_url?: string | null;
          is_business_expense?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          daily_log_id?: string | null;
          amount?: number;
          category?: Database['public']['Enums']['expense_category'];
          date?: string;
          description?: string | null;
          receipt_url?: string | null;
          is_business_expense?: boolean;
          updated_at?: string;
        };
      };
      /**
       * 車両情報テーブル
       * - 使用車両の基本情報を管理
       * - 車両の識別情報や状態を記録
       */
      vehicles: {
        Row: {
          id: string; // 車両ID（主キー）
          user_id: string; // ユーザーID（外部キー）
          name: string; // 車両名
          license_plate: string; // ナンバープレート
          next_license_renewal_date: string | null; // 次回の免許更新日
          //オイル交換関連
          oil_change_date: string | null; // オイル交換日
          element_change_date: string | null; // エレメント交換日
          next_oil_change_date: string | null; // 次回のオイル交換日
          next_element_change_date: string | null; // 次回のエレメント交換日
          oil_change_mileage: number | null; // オイル交換走行距離
          element_change_mileage: number | null; // エレメント交換走行距離
          //車検
          next_inspection_date: string | null; // 次回の車検日
          //メンテナンス関連(ここはまだ増える、細かいチェック項目を追加していく)
          maintenance_date: string | null; // メンテナンス日
          is_active: boolean; // 使用中フラグ
          created_at: string; // 作成日時
          updated_at: string; // 更新日時
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          license_plate: string;
          next_license_renewal_date?: string | null;
          oil_change_date?: string | null;
          element_change_date?: string | null;
          next_oil_change_date?: string | null;
          next_element_change_date?: string | null;
          oil_change_mileage?: number | null;
          element_change_mileage?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string; //車両名
          license_plate?: string;
          next_license_renewal_date?: string | null;
          oil_change_date?: string | null;
          element_change_date?: string | null;
          next_oil_change_date?: string | null;
          next_element_change_date?: string | null;
          oil_change_mileage?: number | null;
          element_change_mileage?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      /**
       * 売上テーブル
       * - 委託先別売上管理
       * - 請求書管理
       * - 支払い状況追跡
       */
      revenues: {
        Row: {
          id: string; // 売上ID（主キー）
          user_id: string; // ユーザーID（外部キー）
          amount: number; // 金額
          client_name: string; // 委託先名
          revenue_type: string; // 売上種別
          date: string; // 売上日（YYYY-MM-DD）
          description: string | null; // 説明・詳細
          invoice_number: string | null; // 請求書番号
          payment_status: Database['public']['Enums']['payment_status']; // 支払い状況
          created_at: string; // 作成日時
          updated_at: string; // 更新日時
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          client_name: string;
          revenue_type: string;
          date: string;
          description?: string | null;
          invoice_number?: string | null;
          payment_status?: Database['public']['Enums']['payment_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          client_name?: string;
          revenue_type?: string;
          date?: string;
          description?: string | null;
          payment_status?: Database['public']['Enums']['payment_status'];
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
      payment_status: 'pending' | 'paid' | 'overdue';
      expense_category:
        | 'fuel'
        | 'maintenance'
        | 'insurance'
        | 'parking'
        | 'toll'
        | 'meal'
        | 'other';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

/**
 * 便利な型エイリアス
 * - テーブル操作用の型を簡単に取得するためのヘルパー型
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

/**
 * 具体的なテーブル型
 * - 各テーブルの行データ型を定義
 */
export type Profile = Tables<'users'>;
export type DailyLog = Tables<'daily_logs'>;
export type Expense = Tables<'expenses'>;
export type Vehicle = Tables<'vehicles'>;
export type Revenue = Tables<'revenues'>;

/**
 * Insert用の型
 * - 各テーブルの挿入用データ型を定義
 */
export type ProfileInsert = TablesInsert<'users'>;
export type DailyLogInsert = TablesInsert<'daily_logs'>;
export type VehicleInsert = TablesInsert<'vehicles'>;
export type ExpenseInsert = TablesInsert<'expenses'>;
export type RevenueInsert = TablesInsert<'revenues'>;

/**
 * Update用の型
 * - 各テーブルの更新用データ型を定義
 */
export type ProfileUpdate = TablesUpdate<'users'>;
export type DailyLogUpdate = TablesUpdate<'daily_logs'>;
export type VehicleUpdate = TablesUpdate<'vehicles'>;
export type ExpenseUpdate = TablesUpdate<'expenses'>;
export type RevenueUpdate = TablesUpdate<'revenues'>;

// =============================================================================
// 列挙型の再エクスポート
// =============================================================================

/**
 * 列挙型の便利なエイリアス
 * - フォームやバリデーションで使用
 */
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type ExpenseCategory = Database['public']['Enums']['expense_category'];

// =============================================================================
// 便利な定数とヘルパー
// =============================================================================

/**
 * 列挙型の値を配列として取得
 * - セレクトボックスなどで使用
 */
export const PAYMENT_STATUSES: PaymentStatus[] = ['pending', 'paid', 'overdue'];
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'fuel',
  'maintenance',
  'insurance',
  'parking',
  'toll',
  'meal',
  'other',
];

/**
 * ラベル表示用のマッピング
 * - UI表示で使用
 */

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: '未払い',
  paid: '支払済み',
  overdue: '延滞',
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  fuel: '燃料費',
  maintenance: 'メンテナンス',
  insurance: '保険',
  parking: '駐車場代',
  toll: '通行料',
  meal: '食事代',
  other: 'その他',
};

// =============================================================================
// 関係性を表す型
// =============================================================================

/**
 * 関連データを含む型
 * - JOIN結果などで使用
 */
export type DailyLogWithExpenses = DailyLog & {
  expenses?: Expense[];
};

/**
 * フォーム用の型
 * - UIコンポーネントで使用
 */
export type DailyLogFormData = Omit<
  DailyLogInsert,
  'user_id' | 'created_at' | 'updated_at'
>;
export type ExpenseFormData = Omit<
  ExpenseInsert,
  'user_id' | 'created_at' | 'updated_at'
>;
export type RevenueFormData = Omit<
  RevenueInsert,
  'user_id' | 'created_at' | 'updated_at'
>;
export type VehicleFormData = Omit<
  VehicleInsert,
  'user_id' | 'created_at' | 'updated_at'
>;
