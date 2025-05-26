/**
 * サーバーサイドSupabase設定
 * 
 * 【学習ポイント】
 * - サーバーサイドでのSupabase利用
 * - 環境変数の活用
 * - セキュアな認証処理
 * 
 * 【使用技術】
 * - Supabase: BaaS
 * - Next.js: サーバーサイド処理
 * - TypeScript: 型安全性
 */

import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

