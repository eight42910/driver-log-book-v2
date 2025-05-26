import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../types/database';

/**
 * クライアントサイド（ブラウザ）用のSupabaseクライアント
 *
 * 【学習ポイント】
 * - ブラウザ環境で実行されるコンポーネントで使用
 * - ユーザーの操作に応じたデータ取得・更新に使用
 * - 認証状態の管理も行う
 * - 環境変数から自動的にURLとキーを取得
 *
 * 【使用技術】
 * - createClientComponentClient: Supabase公式のクライアント作成関数
 * - Database型: 型安全なデータベース操作を提供
 * - 環境変数: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * 【使用例】
 * ```typescript
 * import { createClient } from '@/lib/supabase/client'
 *
 * const supabase = createClient()
 *
 * // データ取得
 * const { data, error } = await supabase
 *   .from('daily_logs')
 *   .select('*')
 *   .eq('user_id', userId)
 *
 * // データ挿入
 * const { error } = await supabase
 *   .from('daily_logs')
 *   .insert({
 *     user_id: userId,
 *     date: '2024-01-01',
 *     start_mileage: 1000
 *   })
 * ```
 */
export const createClient = () => createClientComponentClient<Database>();

// デフォルトエクスポートも提供（使いやすさのため）
export default createClient;

/*
解説：
- このファイルはブラウザ側で実行されるコードでSupabaseを使用する際に使います
- createClientComponentClient: ブラウザ環境で動作するSupabaseクライアントを作成
- Database型: 作成したテーブルの型定義を適用（型安全性を確保）

使用例：
import { createClient } from '@/lib/supabase/client'

// コンポーネント内で使用
const supabase = createClient()
const { data, error } = await supabase.from('daily_logs').select('*')
*/
