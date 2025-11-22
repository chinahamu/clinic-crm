# Clinic CRM - AI Coding Instructions

## プロジェクト概要
- **スタック**: Laravel 12 (PHP 8.2+)、Inertia.js 2.0、React 19、Tailwind CSS 4.0。
- **アーキテクチャ**: Laravel バックエンドと React フロントエンドを Inertia.js で連携するモノリシックアプリケーション。
- **認証**: Laravel Fortify を使用したマルチガードシステム。
  - `web` ガード: 標準ユーザー (`App\Models\User`)。
  - `staff` ガード: スタッフメンバー (`App\Models\Staff`)。

## アーキテクチャパターン

### バックエンド (Laravel)
- **コントローラー**: ページビューには `Inertia::render()` を、状態変更アクションには `redirect()` を返すことを推奨します。
- **マルチ認証**:
  - スタッフロジックは `App\Http\Controllers\Staff` に配置します。
  - スタッフルートは `staff` で始まり、`staff.*` という名前になります。
  - スタッフ認証を扱う際は、必ずガードを指定してください（例: `Auth::guard('staff')`）。
- **モデル**: `app/Models` に配置。`Staff` は `Authenticatable` を継承します。
- **リクエスト**: バリデーションにはフォームリクエストを使用してください。

### フロントエンド (React + Inertia)
- **ページ**: `resources/js/Pages` に配置。構造はコントローラー/ビューのロジックを反映（例: `Staff/Auth/Login.jsx`）。
- **フォーム**: フォーム処理（データ、処理、エラー）には `@inertiajs/react` の `useForm` フックを使用。
- **スタイリング**: Tailwind CSS 4.0 ユーティリティクラスを使用。
- **コンポーネント**: React フックを使用した関数型コンポーネント。

## 重要なワークフロー

### 開発
- **サーバー起動**: `npm run dev` (Laravel Serve、Queue、Pail、Viteを同時に実行)。
- **データベース**: スキーマ更新には`php artisan migrate`を実行。
- **コード生成**: ファイルのスケルトン生成には常に`php artisan make:*`コマンドを使用。

### テスト
- **テスト実行**: `php artisan test` (PHPUnitを使用)。
- **スコープ**: `User`と`Staff`の両方の認証フローをテストでカバーすることを確認。

## プロジェクト固有の規約
- **スタッフ認証**: `App\Http\Controllers\Staff\Auth\AuthenticatedSessionController`でのカスタム実装。
- **ルーティング**: 
  - ユーザーダッシュボード: `/home` -> `Dashboard.jsx`
  - スタッフダッシュボード: `/staff/dashboard` -> `Staff/Dashboard.jsx`
- **Vite設定**: ReactとTailwind 4.0用に構成済み。

## ファイル構造のキーポイント
- `app/Http/Controllers/Staff/`: スタッフ専用のコントローラー。
- `resources/js/Pages/Staff/`: スタッフ専用のReactページ。
- `routes/web.php`: メインのルーティングファイル（ユーザーとスタッフの両方のルートを含む）。

## 注意事項
- 回答には日本語を使用してください。
- ソースコード中のコメントは日本語にすること。