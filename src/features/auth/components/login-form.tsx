'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { useAuthStore } from '../stores/auth-store';
import { loginSchema, type LoginFormData } from '../validations/auth-schemas';

/**
 * ログインフォームコンポーネント
 *
 * 【学習ポイント】
 * - React Hook Formを使用したフォーム管理
 * - Zodを使用したバリデーション
 * - Zustandを使用した状態管理
 * - shadcn/uiコンポーネントの活用
 *
 * 【使用技術】
 * - React Hook Form: フォーム状態管理
 * - Zod: スキーマバリデーション
 * - Zustand: グローバル状態管理
 * - Next.js: ルーティング
 * - Tailwind CSS: スタイリング
 */

export function LoginForm() {
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();

      const success = await signIn(data);

      if (success) {
        router.push('/dashboard');
        router.refresh();
      } else if (error?.field) {
        // フィールド固有のエラーを設定
        setError(error.field as keyof LoginFormData, {
          message: error.message,
        });
      }
    } catch (err) {
      console.error('ログインエラー:', err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          ログイン
        </CardTitle>
        <CardDescription className="text-center">
          アカウントにログインしてください
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* グローバルエラー表示 */}
          {error && !error.field && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* メールアドレス入力 */}
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* パスワード入力 */}
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="パスワードを入力"
                {...register('password')}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* パスワードリセットリンク */}
          <div className="text-right">
            <Link
              href="/auth/reset-password"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              パスワードを忘れた方
            </Link>
          </div>

          {/* ログインボタン */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ログイン中...
              </>
            ) : (
              'ログイン'
            )}
          </Button>

          {/* サインアップリンク */}
          <div className="text-center text-sm">
            <span className="text-gray-600">アカウントをお持ちでない方は </span>
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              新規登録
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
