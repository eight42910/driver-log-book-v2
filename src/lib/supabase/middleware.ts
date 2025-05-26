import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '../../types/database';

/**
 * Next.jsミドルウェア用のSupabaseクライアント
 *
 * 【学習ポイント】
 * - リクエストの前処理でSupabaseを使用
 * - 認証ガードの実装に使用
 * - ページアクセス前の認証チェック
 * - リダイレクト処理の実装
 *
 * 【使用技術】
 * - createMiddlewareClient: ミドルウェア環境用のクライアント
 * - NextRequest/NextResponse: Next.jsのリクエスト/レスポンス処理
 * - Database型: 型安全なデータベース操作
 *
 * 【実装パターン】
 * - 認証が必要なページへのアクセス制御
 * - ユーザーの権限チェック
 * - 自動リダイレクト処理
 */
export const createSupabaseMiddlewareClient = (req: NextRequest) => {
  const res = NextResponse.next();
  return createMiddlewareClient<Database>({ req, res });
};

/**
 * 認証ガード用のミドルウェア関数
 *
 * 【使用例】
 * ```typescript
 * // middleware.ts
 * import { authGuard } from '@/lib/supabase/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   return await authGuard(request)
 * }
 * ```
 */
export const authGuard = async (request: NextRequest) => {
  const supabase = createMiddlewareClient(request);

  // 認証状態をチェック
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 保護されたルートの定義
  const protectedRoutes = ['/dashboard', '/logs', '/profile'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 認証が必要なページで未認証の場合、ログインページにリダイレクト
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 認証済みユーザーがログインページにアクセスした場合、ダッシュボードにリダイレクト
  if (request.nextUrl.pathname === '/auth/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
};

export default createMiddlewareClient;

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
