# #06 管理画面 レイアウト

## 概要

管理画面（`/(admin)` Route Group）の `layout.tsx` に AdminSidebar と AdminHeader を実装する。
RootLayout（`app/layout.tsx`）は **一切編集しない**。

## 対象ファイル

```
app/(admin)/
  layout.tsx
  _components/
    AdminSidebar.tsx
    AdminHeader.tsx
    SidebarLink.tsx
```

## タスク

### `app/(admin)/layout.tsx`

- [x] `getServerSession` でセッションを取得し、未認証なら `/admin/login` にリダイレクト
  - ただし `pathname === "/admin/login"` の場合はリダイレクトしない
- [x] 全体レイアウト：`<div className="flex h-full">` → Sidebar（固定幅）+ 右側コンテンツ列
- [x] 右側コンテンツ列：`<div className="flex flex-col flex-1 min-w-0">` → AdminHeader + `<main>`
- [x] Noto Sans JP を読み込む（公開サイトと分離して個別ロード）

### `AdminSidebar`

- [x] 固定幅 `w-60`、縦スクロール可能
- [x] `bg-ink text-paper` で暗い背景（管理画面を公開サイトと視覚的に区別）
- [x] ロゴ・アプリ名「ServiceHub」を上部に表示
- [x] ナビゲーション項目（`SidebarLink`）：
  | ラベル | href |
  |--------|------|
  | ダッシュボード | `/admin` |
  | 問い合わせ | `/admin/inquiries` |
  | 案件 | `/admin/orders` |
  | 顧客 | `/admin/customers` |
  | 業者 | `/admin/contractors` |
  | 請求 | `/admin/invoices` |
  | CMS | `/admin/cms` |
  | 設定 | `/admin/settings` |
- [x] 現在のパスに一致するリンクは `bg-accent text-ink`（アクティブ状態）

### `SidebarLink`

- [x] `usePathname` で現在パスを取得
- [x] `aria-current="page"` をアクティブ時に付与

### `AdminHeader`

- [x] 右端にログインユーザー名とサインアウトボタン
- [x] モバイル時にサイドバーを隠してハンバーガーアイコンを表示（サイドバーの開閉を state 管理）

## デザイン制約

- サイドバー背景は `bg-ink`、本文エリアは `bg-background`
- gray-* ユーティリティ・生 HEX 禁止

## 依存チケット

- #01 デザインシステム
- #02 共通 UI コンポーネント
- #04 認証基盤（セッション確認）
