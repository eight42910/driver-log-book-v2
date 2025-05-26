import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';
import type {
  LoginFormData,
  SignupFormData,
  ResetPasswordFormData,
  AuthResult,
} from '../types';

/**
 * 認証サービス - クライアントサイド操作
 *
 * 【学習ポイント】
 * - Supabase認証APIの使用方法
 * - エラーハンドリングの実装
 * - 型安全な認証操作
 * - ユーザーフィードバックの提供
 *
 * 【使用技術】
 * - Supabase Auth: 認証機能
 * - TypeScript: 型安全性
 * - Error Handling: 適切なエラー処理
 */

export const authService = {
  /**
   * メールアドレスとパスワードでログイン
   */
  async signIn(data: LoginFormData): Promise<AuthResult> {
    try {
      const supabase = createClient();

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: this.getErrorMessage(error.message),
            field: this.getErrorField(error.message),
          },
        };
      }

      return {
        success: true,
        data: authData,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: '予期しないエラーが発生しました',
        },
      };
    }
  },

  /**
   * 新規ユーザー登録
   */
  async signUp(data: SignupFormData): Promise<AuthResult> {
    try {
      const supabase = createClient();

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || '',
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            message: this.getErrorMessage(error.message),
            field: this.getErrorField(error.message),
          },
        };
      }

      return {
        success: true,
        data: authData,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: '予期しないエラーが発生しました',
        },
      };
    }
  },

  /**
   * ログアウト
   */
  async signOut(): Promise<AuthResult> {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: {
            message: 'ログアウトに失敗しました',
          },
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          message: '予期しないエラーが発生しました',
        },
      };
    }
  },

  /**
   * パスワードリセット
   */
  async resetPassword(data: ResetPasswordFormData): Promise<AuthResult> {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: this.getErrorMessage(error.message),
          },
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          message: '予期しないエラーが発生しました',
        },
      };
    }
  },

  /**
   * 現在のユーザー情報を取得
   */
  async getCurrentUser() {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error };
      }

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  /**
   * エラーメッセージの日本語化
   */
  getErrorMessage(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials':
        'メールアドレスまたはパスワードが正しくありません',
      'Email not confirmed': 'メールアドレスが確認されていません',
      'User already registered': 'このメールアドレスは既に登録されています',
      'Password should be at least 6 characters':
        'パスワードは6文字以上で入力してください',
      'Invalid email': 'メールアドレスの形式が正しくありません',
      'Signup is disabled': '新規登録は現在無効になっています',
      'Email rate limit exceeded':
        'メール送信の制限に達しました。しばらく待ってから再試行してください',
    };

    return errorMap[errorMessage] || errorMessage;
  },

  /**
   * エラーが発生したフィールドを特定
   */
  getErrorField(errorMessage: string): string | undefined {
    if (errorMessage.includes('email') || errorMessage.includes('Email')) {
      return 'email';
    }
    if (
      errorMessage.includes('password') ||
      errorMessage.includes('Password')
    ) {
      return 'password';
    }
    return undefined;
  },
};

/**
 * サーバーサイド認証サービス
 */
export const serverAuthService = {
  /**
   * サーバーサイドでユーザー情報を取得
   */
  async getCurrentUser() {
    try {
      const supabase = createServerClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  },

  /**
   * サーバーサイドでセッション情報を取得
   */
  async getSession() {
    try {
      const supabase = createServerClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      return { session, error };
    } catch (error) {
      return { session: null, error };
    }
  },
};
