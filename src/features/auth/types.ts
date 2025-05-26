/**
 * 認証機能の型定義
 *
 * 【学習ポイント】
 * - 認証フォームのデータ型定義
 * - エラーハンドリングの型安全性
 * - Supabase認証APIとの型整合性
 *
 * 【使用技術】
 * - TypeScript: 型安全性の確保
 * - Zod: ランタイム型検証（後で追加）
 * - Supabase Auth: 認証サービス
 */

// 不要なインポートを削除
// import { AnyARecord } from "dns"
// import { interceptors } from "undici-types"

/**
 * ログインフォームのデータ型
 * email: ユーザーのメールアドレス
 * password: ユーザーのパスワード
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * サインアップフォームのデータ型
 * email: ユーザーのメールアドレス
 * password: 設定するパスワード
 * confirmPassword: パスワード確認用
 * fullName: ユーザーのフルネーム(オプション)
 */
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

/**
 * パスワードリセットフォームのデータ型
 * email: パスワードをリセットするアカウントのメールアドレス
 */
export interface ResetPasswordFormData {
  email: string;
}

/**
 * 認証エラーの型定義
 * message: エラーメッセージ
 * field: エラーが発生したフォームのフィールド名(オプション)
 */
export interface AuthError {
  message: string;
  field?: string;
}

/**
 * 認証の状態を管理する型
 * user: 現在のユーザー情報
 * loading: 認証処理の実行中状態
 * error: 発生したエラー情報
 */
export interface AuthState {
  user: any | null;
  loading: boolean;
  error: AuthError | null;
}

/**
 * 認証アクションの結果型
 * success: 処理の成功/失敗
 * error: エラー情報(オプション)
 * data: 処理結果のデータ(オプション)
 */
export interface AuthResult {
  success: boolean;
  error?: AuthError;
  data?: any;
}
