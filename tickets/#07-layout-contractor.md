# #07 業者ポータル レイアウト

## 概要

業者ポータル（`/(contractor)` Route Group）の `layout.tsx` に ContractorSidebar と ContractorHeader を実装する。
RootLayout（`app/layout.tsx`）は **一切編集しない**。

## 対象ファイル

```
app/(contractor)/
  layout.tsx
  _components/
    ContractorSidebar.tsx
    ContractorHeader.tsx
```

## タスク

### `app/(contractor)/layout.tsx`

- [ ] `getServerSession` でセッションを取得し、`role !== "CONTRACTOR"` なら `/contractor/login` にリダイレクト
  - `pathname === "/contractor/login"` の場合はリダイレクトしない
- [ ] 全体レイアウト：`<div className="flex h-full">` → Sidebar（固定幅）+ 右側コンテンツ列
- [ ] 右側コンテンツ列：AdminLayout と同様の構成

### `ContractorSidebar`

- [ ] 固定幅 `w-56`
- [ ] `bg-surface border-r border-border` のライトテーマ（管理画面の ink とは異なる）
- [ ] ナビゲーション項目：
  | ラベル | href |
  |--------|------|
  | 案件一覧 | `/contractor` |
  | 自社情報 | `/contractor/profile` |
- [ ] 現在パスに一致するリンクはアクティブスタイル（`bg-accent text-ink`）

### `ContractorHeader`

- [ ] ログイン中の業者名を表示
- [ ] サインアウトボタン

## デザイン制約

- サイドバーは `bg-surface`、`text-foreground`、`border-border` のみ使用
- gray-* ユーティリティ・生 HEX 禁止

## 依存チケット

- #01 デザインシステム
- #02 共通 UI コンポーネント
- #04 認証基盤（セッション確認）
