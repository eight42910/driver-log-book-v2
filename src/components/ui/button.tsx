import { ButtonHTMLAttributes, forwardRef } from 'react';

import { clsx } from 'clsx';

/**

* Buttonコンポーネント

*

* 【学習ポイント】

* - Tailwind CSSでのスタイリング基礎

* - TypeScriptでのProps型定義

* - forwardRefの使用方法

* - 条件付きスタイリング（variant, size）

*

* 【使用技術】

* - clsx: 条件付きクラス名の結合

* - forwardRef: ref の転送（フォームライブラリとの連携で重要）

* - ButtonHTMLAttributes: HTML button要素の標準属性を継承

*/

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type ButtonSize = 'sm' | 'md' | 'lg';

//propsの型定義

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;

  size?: ButtonSize;

  isLoading?: boolean;

  children: React.ReactNode;
}

//スタイルの定義オブジェクト（管理しやすくするため）
const buttonStles = {
  base: 'inline-flex items-center justify-center rouded-md font-medium transiton-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',

  //バリデーションスタイル
  variants: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible-blue-500',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visivle:ring-gray-500',
    outline:
      'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  },
  // サイズ別スタイル
  sizes: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          buttonStyles.base,
          buttonStyles.variants[variant],
          buttonStyles.sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            {/* ローディングスピナー */}
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            読み込み中...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * 【使用例】
 *
 * // 基本的な使用
 * <Button>クリック</Button>
 *
 * // バリエーション指定
 * <Button variant="secondary">キャンセル</Button>
 * <Button variant="danger">削除</Button>
 *
 * // サイズ指定
 * <Button size="lg">大きなボタン</Button>
 *
 * // ローディング状態
 * <Button isLoading>保存中...</Button>
 *
 * // カスタムスタイル追加
 * <Button className="w-full">全幅ボタン</Button>
 */
