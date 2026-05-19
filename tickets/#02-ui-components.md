# #02 共通 UI コンポーネント

## 概要

公開サイト・管理画面・業者ポータルで共通利用するプリミティブな UI コンポーネントを `components/ui/` に実装する。
スタイルは **デザイントークン（CSS 変数）のみ** 使用し、gray-* ユーティリティや HEX 直書きは禁止。

## 対象ファイル

```
components/
  ui/
    button.tsx
    input.tsx
    textarea.tsx
    select.tsx
    label.tsx
    badge.tsx
    card.tsx
    table.tsx
    modal.tsx
    alert.tsx
    avatar.tsx
    spinner.tsx
    pagination.tsx
    status-badge.tsx   # 案件ステータス専用バッジ
```

## タスク

### Button（`components/ui/button.tsx`）

- [x] variant: `primary` | `secondary` | `danger` | `ghost`
- [x] size: `sm` | `md` | `lg`
- [x] `disabled` / `loading`（Spinner を内包）状態
- [x] `asChild` パターンは不要、シンプルな `<button>` ラッパーで実装

### フォーム系

- [x] `Input`：ラベルなし素の input。`error` prop で境界色を `--color-danger` に変更
- [x] `Textarea`：Input と同仕様
- [x] `Select`：ネイティブ `<select>` ラッパー（Unicode ▾ シェブロン付き）
- [x] `Label`：`htmlFor` を必須 prop にしてアクセシビリティを確保

### フィードバック系

- [x] `Badge`：variant `default` | `success` | `warning` | `danger` | `info`
- [x] `Alert`：上記 variant に対応、icon / title スロットあり
- [x] `Spinner`：CSS アニメーション、size `sm` | `md` | `lg`

### レイアウト系

- [x] `Card`：`header` / `body` / `footer` スロットを持つシンプルなコンテナ
- [x] `Modal`：`<dialog>` 要素ベース、`open` / `onClose` prop。backdrop は globals.css に追加

### データ表示系

- [x] `Table`：`Table / Thead / Tbody / Tr / Th / Td` を Tailwind スタイル付きでラップ
- [x] `Pagination`：ページ番号・前後ボタン、省略記号付き。`currentPage` / `totalPages` / `onChange` prop
- [x] `Avatar`：正方形サムネイル（1:1）、`src` なし時はイニシャル表示

### 業務専用

- [x] `StatusBadge`：案件ステータス（新規 / 訪問調整中 / 作業予定 / 作業中 / 作業完了 / 請求済 / 入金済 / クローズ）を色分け表示。`STATUS_CONFIG` 定数でマッピング定数化

## 制約

- スタイルは `bg-background` `text-foreground` `border-border` `text-muted` `bg-accent` 等のトークンクラスのみ使用
- `className` prop を受け取り外部からの追加スタイルをマージできるようにする（`clsx` または `cn` ユーティリティを `lib/cn.ts` に用意）
- サードパーティ UI ライブラリ（shadcn, Radix, etc.）は導入しない

## 依存チケット

- #01 デザインシステム（トークン定義が先に必要）
