# #05 公開サイト レイアウト

## 概要

公開サイト（`/(public)` Route Group）の `layout.tsx` に Header と Footer を実装する。
RootLayout（`app/layout.tsx`）は **一切編集しない**。

## 対象ファイル

```
app/(public)/
  layout.tsx
  _components/
    PublicHeader.tsx
    PublicFooter.tsx
    MobileMenu.tsx
```

## タスク

### Route Group 作成

- [ ] `app/(public)/` ディレクトリを作成（カッコ付きで URL に影響しない）
- [ ] 既存の `app/page.tsx` を `app/(public)/page.tsx` に移動（後続チケットで上書き）

### `app/(public)/layout.tsx`

- [ ] Noto Serif JP / Noto Sans JP を `next/font/google` で読み込み CSS 変数に注入
- [ ] `<div className="flex flex-col min-h-full">` で Header + `<main>` + Footer を縦積みレイアウト
- [ ] `metadata` export を定義（`title: "ServiceHub"`, `description`）

### `PublicHeader`

- [ ] 上部固定（`sticky top-0 z-50`）
- [ ] 左：ロゴテキスト「ServiceHub」（font-serif、`text-foreground`）
- [ ] 右：ナビゲーションリンク（ホーム / 事例 / お問い合わせ）＋ CTA ボタン「無料相談」
- [ ] スクロールで背景を `bg-surface/90 backdrop-blur-sm` に変化（`scroll` イベント or IntersectionObserver）
- [ ] モバイル：ハンバーガーメニュー → `MobileMenu` をスライドイン表示

### `PublicFooter`

- [ ] `bg-ink text-paper` で暗い背景
- [ ] コピーライト・主要リンク（事例 / お問い合わせ / 業者登録）

### `MobileMenu`

- [ ] `<dialog>` または `fixed inset-0` のオーバーレイ
- [ ] `aria-label="メニュー"` でアクセシビリティ確保

## デザイン制約

- 色は `bg-surface` `text-foreground` `text-muted` `bg-ink` `text-paper` `bg-accent` のみ使用
- gray-* ユーティリティ・生 HEX 禁止

## 依存チケット

- #01 デザインシステム
- #02 共通 UI コンポーネント（Button 使用）
