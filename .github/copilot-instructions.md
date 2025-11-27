# Clinic CRM - AI Coding Instructions

## プロジェクト概要
- **スタック**: Laravel 12 (PHP 8.2+)、Inertia.js 2.0、React 19、Tailwind CSS 4.0。
- **管理パネル**: Filament 4.0 (システム管理者向け)、Inertia/React (クリニックスタッフ向け)。
- **アーキテクチャ**: モノリシック。LaravelがバックエンドAPIとInertiaページを提供。
- **認証**: Laravel Fortifyによるマルチガード + Spatie Permission。
  - `web`: 患者 (`App\Models\User`)
  - `staff`: クリニックスタッフ (`App\Models\Staff`)
  - `admin`: Filamentユーザー (デフォルト設定)

## アーキテクチャとパターン

### バックエンド (Laravel)
- **コントローラー**:
  - **Inertia**: `App\Http\Controllers\Staff` (スタッフ用) や `App\Http\Controllers` (患者用)。`Inertia::render()` を返す。
  - **Filament**: `App\Filament\Resources` にリソース定義。
- **モデル**: `app/Models`。
  - `User`: `HasRoles` (Spatie) を使用。
  - `Staff`: `HasRoles`, `LogsActivity` (Spatie) を使用。`Clinic` に所属。
- **認証と権限**:
  - ガードを明示的に指定すること (`Auth::guard('staff')`)。
  - 権限チェックには `$user->can()` や Middleware を使用。
- **リクエスト**: バリデーションロジックは FormRequest に分離。

### フロントエンド (React + Inertia)
- **構造**: `resources/js/Pages`。
  - `Staff/`: スタッフ用ダッシュボードと機能。
  - `Dashboard.jsx`: 患者用ダッシュボード。
- **フォーム**: `@inertiajs/react` の `useForm` を使用してデータ送信とエラーハンドリングを行う。
- **スタイリング**: Tailwind CSS 4.0。`@tailwindcss/vite` プラグインを使用。
- **コンポーネント**: 関数型コンポーネント + Hooks。

## 重要なワークフロー

### 開発環境
- **起動**: `composer run dev` (推奨) または `npm run dev`。
  - `php artisan serve`, `queue:listen`, `pail`, `vite` が並列実行されます。
- **DB更新**: `php artisan migrate`。
- **コード生成**: `php artisan make:model`, `php artisan make:controller` 等を使用。

### テスト
- **実行**: `php artisan test`。
- **方針**: `User` (患者) と `Staff` (スタッフ) の両方の認証コンテキストでのテストを作成すること。

## プロジェクト固有の規約
- **ルーティング**:
  - 患者/一般: `/` (Welcome), `/home` (Dashboard), `/reservation/*`.
  - スタッフ: `/staff/*` (プレフィックス), `staff.*` (名前付きルート).
  - Filament: `/NE4SxGSnkpzQB/*` (デフォルトパス変更済み).
- **スタッフ機能**:
  - コントローラーは `App\Http\Controllers\Staff` 名前空間に配置。
  - ビューは `resources/js/Pages/Staff` に配置。
- **ログ**: `Staff` モデルの変更は `spatie/laravel-activitylog` で自動記録される。

## 主要パッケージ
- `filament/filament`: 管理画面 (Super Admin)。
- `spatie/laravel-permission`: ロールと権限管理。
- `spatie/laravel-activitylog`: 操作ログ。
- `laravel/fortify`: 認証バックエンド。
- `inertiajs/inertia-laravel`: フロントエンド連携。

## 注意事項
- 回答とコード内のコメントは**日本語**を使用してください。
- ファイルを作成する際は、既存のディレクトリ構造 (`Staff` サブディレクトリなど) に従ってください。