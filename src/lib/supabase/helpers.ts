import { createClient } from './client';
import { createServerClient } from './server';
import type { Database, DailyLog, Profile, Vehicle } from '@/types/database';

/**
 * Supabase操作のヘルパー関数集
 *
 * 【学習ポイント】
 * - 型安全なデータベース操作の抽象化
 * - 再利用可能な関数の作成
 * - エラーハンドリングの統一
 * - ビジネスロジックの分離
 */

// クライアントサイド用のヘルパー関数
export const clientHelpers = {
  /**
   * 現在のユーザー情報を取得
   */
  async getCurrentUser() {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('ユーザー取得エラー:', error);
      return { user: null, error };
    }

    return { user, error: null };
  },

  /**
   * ユーザーの日報一覧を取得
   */
  async getDailyLogs(userId: string, limit?: number) {
    const supabase = createClient();

    let query = supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('日報取得エラー:', error);
      return { logs: [], error };
    }

    return { logs: data as DailyLog[], error: null };
  },

  /**
   * 日報を作成
   */
  async createDailyLog(
    logData: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('daily_logs')
      .insert(logData)
      .select()
      .single();

    if (error) {
      console.error('日報作成エラー:', error);
      return { log: null, error };
    }

    return { log: data as DailyLog, error: null };
  },

  /**
   * プロフィールを更新
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('プロフィール更新エラー:', error);
      return { profile: null, error };
    }

    return { profile: data as Profile, error: null };
  },
};

// サーバーサイド用のヘルパー関数
export const serverHelpers = {
  /**
   * サーバーサイドでユーザー情報を取得
   */
  async getCurrentUser() {
    const supabase = createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    return { user, error };
  },

  /**
   * サーバーサイドで日報一覧を取得
   */
  async getDailyLogs(userId: string, limit?: number) {
    const supabase = createServerClient();

    let query = supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    return { logs: data as DailyLog[] | null, error };
  },
};

/**
 * 型安全なクエリビルダー
 *
 * 【学習ポイント】
 * - TypeScriptの型推論を活用
 * - 再利用可能なクエリパターン
 * - エラーハンドリングの統一
 */
export const queryBuilder = {
  /**
   * 日報の詳細検索
   */
  dailyLogs: {
    byDateRange: (userId: string, startDate: string, endDate: string) => {
      const supabase = createClient();
      return supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
    },

    withTotalExpenses: (userId: string) => {
      const supabase = createClient();
      return supabase
        .from('daily_logs')
        .select(
          `
          *,
          total_expenses:fuel_cost + toll_cost + parking_cost + other_expenses
        `
        )
        .eq('user_id', userId);
    },
  },
};
