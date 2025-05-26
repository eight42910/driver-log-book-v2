# 📘 Driver Logbook v2

> 本ドキュメントは「開発チーム・AI コーディング支援ツール（例：Cursor）にも意図を正確に伝えるための内部 README」です。

## 🚚 プロダクト概要

Driver Logbook v2 は、**軽貨物・委託ドライバー向けの業務記録・提出効率化アプリケーション**です。
**紙の日報／手書き提出／FAX による事務負担**を完全にデジタル化し、**日々の入力・提出・月次管理を 1 日 5 分で完結**させることを目指しています。

## 🎯 主な目的と特徴

- **個人ドライバーが主導で導入できる業務アプリ**
- **日報・売上・経費・車両メンテナンス記録の一元管理**
- **PDF 提出／月次レポートがボタン一つで完結**
- **オフライン対応・スマホ UI 最適化・提出ミス防止**
- **データは Supabase に保存し、Edge Functions で集計・PDF 出力処理を実行**

## 👥 想定ユーザー（ペルソナ）

### A. 個人事業主ドライバー（一次ターゲット）

- 日々の記録が紙や LINE・Excel で煩雑
- 確定申告に必要な情報をまとめておきたい
- 複数の委託先にそれぞれのフォーマットで提出が必要

### B. 小規模運送会社（次ステップ）

- 委託ドライバーからの提出を紙・FAX で受け取っている
- 労働時間集計や確定申告補助が負担

## 📦 実装範囲（MVP）

| カテゴリ       | 内容                                                                              |
| :------------- | :-------------------------------------------------------------------------------- |
| 認証           | Supabase Auth (Email/Password) によるログイン／ログアウト／サインアップ           |
| 日報           | 走行距離・労働時間などの記録。PostgreSQL に保存                                   |
| 経費入力       | 金額／種別／日付を記録。領収書画像は Supabase Storage に保存                      |
| 売上入力       | 売上種別・金額・委託先を記録                                                      |
| 車両管理       | オイル交換・タイヤ・点検履歴など                                                  |
| 月次レポート   | Edge Function で PDF 生成し、ユーザーへ DL またはメール送信                       |
| ダッシュボード | 今月の売上・経費・差分、未提出日報一覧などを表示                                  |
| 設定           | 委託先管理、カテゴリー追加、プロフィール編集など                                  |
| 非機能要件     | オフライン入力対応（IndexedDB + PWA）／レスポンシブ UI／P95 ≤ 500ms／99.5% Uptime |

## 🧱 技術方針

| 層           | 技術選定                                           | 理由                                                    |
| :----------- | :------------------------------------------------- | :------------------------------------------------------ |
| フロント     | Next.js 14 App Router + TypeScript                 | 最新 RSC／SEO／高速起動／Pages Router より柔軟          |
| UI           | Tailwind CSS + shadcn/ui                           | スタイリングしやすく、デザイン再利用性が高い            |
| 状態管理     | Zustand（Context は最小）                          | 複雑なグローバル管理が不要なため、Redux より軽量        |
| フォーム     | React Hook Form + Zod                              | 型安全・バリデーションが簡潔・学習コスト低い            |
| バックエンド | Supabase (Auth, Database, Storage, Edge Functions) | MVP に最適な BaaS 構成。PostgreSQL ベースで拡張性が高い |
| CI/CD        | GitHub Actions + Vercel                            | ステージング環境が自動生成され、レビューが容易          |

## 📁 フォルダ構成

```
src/
├── app/(auth) # 認証不要ページ (ログイン・サインアップ)
├── app/(main) # 認証済みページ (ダッシュボード・記録入力)
├── features/ # 機能ごとにUI + ロジックをまとめて保持
├── lib/ # Supabase周り、PDF生成、共通util
├── store/ # Zustand ストア（状態管理）
├── hooks/ # 再利用可能なReactフック
├── styles/ # グローバルCSS・Tailwind設定
├── types/ # 型定義まとめ
```

- Atomic Design ではなく **"機能別 (feature-based)"** で構成
- 再利用性より"分かりやすさ"重視 → onboarding が容易

## 🗄️ データベース設計

### 主要テーブル構成

```sql
-- ユーザー（Supabase Auth連携）
users (
  id uuid primary key references auth.users,
  email text,
  full_name text,
  company_name text,
  created_at timestamp,
  updated_at timestamp
)

-- 日報
daily_logs (
  id uuid primary key,
  user_id uuid references users(id),
  date date,
  mileage integer,
  work_hours decimal,
  delivery_count integer,
  notes text,
  created_at timestamp,
  updated_at timestamp
)

-- 経費
expenses (
  id uuid primary key,
  user_id uuid references users(id),
  amount decimal,
  category text,
  date date,
  description text,
  receipt_url text,
  created_at timestamp,
  updated_at timestamp
)

-- 売上
revenues (
  id uuid primary key,
  user_id uuid references users(id),
  amount decimal,
  client_name text,
  revenue_type text,
  date date,
  description text,
  created_at timestamp,
  updated_at timestamp
)
```

## 🔐 セキュリティ・公開ポリシー

- `.env.local` に Supabase 機密値を格納し、 `.gitignore` 済
- RLS（Row Level Security）でユーザーデータを保護
- 認証が必要なページには `(main)/layout.tsx` にて Guard 実装
- 本リポジトリは Public で公開予定（ポートフォリオ用）
- `.env.local.example` に変数テンプレートを提供

## 🛤 今後の拡張見込み

- OCR による領収書自動入力（Supabase Edge Functions + AI）
- 管理者ダッシュボード／ドライバー権限管理（RBAC）
- 会計ソフト (freee / マネフォ) へのデータエクスポート
- 再配達率低下を目的とした配送履歴の可視化
- リアルタイム通知（Supabase Realtime）

## 🤝 開発方針

- **このアプリは日報・経費記録を"モバイルで素早く"入力し、月報や提出処理まで完結する業務アプリです**
- 優先するのは "シンプルな入力体験・提出作業の自動化・データの一元化"
- 開発時の注意点：
  - 状態管理は「Zustand or Context」→ Redux は使わない
  - コンポーネントは Atomic でなく"feature ベース"
  - Supabase は直接使わず、lib 内の API 経由
  - スタイルは Tailwind ベースで、shadcn/ui を使って統一感のある UI を構築する
  - RLS ポリシーでデータセキュリティを確保

## 🚀 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# Supabase関連パッケージの追加
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 開発サーバーの起動
npm run dev
```

### 環境変数設定

`.env.local` ファイルを作成し、以下の変数を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて開発を開始できます。

> 👨‍�� 本リポジトリは現在「Supabase 構成での MVP 構築フェーズ」です。
> コンポーネント単位、Hook 単位で AI コーディング支援やレビューを受けながら開発を進めています。
