# #21 管理画面 - システム設定（A-17）

## 概要

`/admin/settings` のシステム設定画面を実装する。
管理者アカウント管理・メール通知設定・サービス種別マスタ管理を一画面にタブ構成でまとめる。

## 対象ファイル

```
app/(admin)/settings/
  page.tsx
  _components/
    AdminAccountsPanel.tsx
    NotifySettingsPanel.tsx
    ServiceTypesPanel.tsx
  actions.ts
```

## タスク

### `AdminAccountsPanel`

- [x] 管理者アカウント一覧（メール・名前）を表示
- [x] 新規管理者追加フォーム（名前・メール・パスワード）
  - Server Action `createAdmin`：bcrypt でパスワードハッシュ → `prisma.user.create`（`role: "ADMIN"`）
- [x] 管理者の削除（自分自身は削除不可）

### `NotifySettingsPanel`

- [x] 通知先メールアドレスの確認・変更フォーム
- [x] 環境変数 `ADMIN_NOTIFY_EMAIL` をここで管理する（ただし `.env` ではなく DB の設定テーブルに保存することを推奨）
  - `SystemConfig` テーブルをスキーマに追加（`key: String @unique, value: String`）
  - `prisma.systemConfig.upsert` で更新

### `ServiceTypesPanel`

- [x] サービス種別マスタ（`lib/data/service-types.ts` の定数）の確認用表示
- [x] MVP 段階ではコード定数で管理し、DB 管理への移行は後回し

### ページ構成

- [x] タブ UI（ページ内タブ、`searchParams.tab` で制御）
- [x] ナビゲーション：「アカウント管理」「メール通知」「サービス種別」

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Table, Button, Input）
- #04 認証基盤（管理者アカウント作成）
- #19 メール通知（通知設定の参照先）
