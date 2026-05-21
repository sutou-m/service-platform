# #01 デザインシステム（globals.css・@theme トークン定義）

## 概要

Tailwind CSS v4 の `@theme` ディレクティブを使ってデザイントークンを定義する。
`globals.css` のみを編集し、`tailwind.config.js` は作成しない（v4 では不要）。
RootLayout（`app/layout.tsx`）は **一切編集しない**。

## 対象ファイル

- `app/globals.css`（既存ファイルを拡張）

## タスク

### CSS 変数・デザイントークン定義

- [x] `:root` にブランドカラーの CSS 変数を定義
  ```css
  :root {
    /* Palette */
    --color-ink:     #1A1A1A;
    --color-paper:   #F5F5F5;
    --color-accent:  #E8E0D5;
    --color-surface: #FFFFFF;
    --color-muted:   #757575;
    --color-border:  #E0E0E0;

    /* Semantic */
    --background:    var(--color-paper);
    --foreground:    var(--color-ink);

    /* Status */
    --color-success: #2E7D32;
    --color-warning: #F57C00;
    --color-danger:  #C62828;
    --color-info:    #1565C0;
  }
  ```
- [x] `@theme inline` ブロックに Tailwind ユーティリティとして公開するトークンを追加
  ```css
  @theme inline {
    /* 既存の --color-background / --color-foreground はそのまま維持 */
    --color-ink:     var(--color-ink);
    --color-paper:   var(--color-paper);
    --color-accent:  var(--color-accent);
    --color-surface: var(--color-surface);
    --color-muted:   var(--color-muted);
    --color-border:  var(--color-border);
    --color-success: var(--color-success);
    --color-warning: var(--color-warning);
    --color-danger:  var(--color-danger);
    --color-info:    var(--color-info);

    /* Typography */
    --font-sans:  "Noto Sans JP", Arial, sans-serif;
    --font-serif: "Noto Serif JP", Georgia, serif;

    /* Spacing scale（必要に応じて追加） */
  }
  ```
- [x] ダークモード対応は `@media (prefers-color-scheme: dark)` で上書き（ink ↔ paper 反転）

### フォント設定

- [x] `next/font/google` で `Noto_Sans_JP` と `Noto_Serif_JP` を読み込む（#05/#06/#07 で実装）
  - **追加場所は `app/(public)/layout.tsx` および `app/(admin)/layout.tsx`**（RootLayout には追加しない）
  - CSS 変数 `--font-noto-sans` / `--font-noto-serif` に注入する（globals.css の @theme inline で参照済み）

### ベーススタイル

- [x] `body` に `font-family: var(--font-sans)` を設定（フォールバックあり）
- [x] リンク・リスト・見出しのリセットスタイルを追加
- [x] `lib/cn.ts`（クラス結合ユーティリティ）を作成

## 制約

- `bg-gray-*` `text-gray-*` など Tailwind 組み込みの gray ユーティリティ **使用禁止**
- 生の HEX 値（例：`#1A1A1A`）を Tailwind クラスに直書き **禁止**
- 代わりに `bg-ink` `text-foreground` `border-border` 等のカスタムトークンを使う
- RootLayout（`app/layout.tsx`）は **編集対象外**

## 依存チケット

なし（最初に着手）
