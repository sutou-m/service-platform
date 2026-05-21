# #20 管理画面 - CMS 機能（A-15, A-16）

## 概要

`/admin/cms`（事例記事一覧）と `/admin/cms/[id]`（事例記事編集）を実装する。
管理者が事例記事を作成・編集・公開/非公開切替・削除できる。

## 対象ファイル

```
app/(admin)/cms/
  page.tsx                  # 事例一覧（公開/非公開タブ）
  new/
    page.tsx
    _components/
      CmsPostForm.tsx
    actions.ts
  [id]/
    page.tsx
    _components/
      CmsPostForm.tsx       # new と共用（edit モード）
      PublishToggle.tsx
      DeleteButton.tsx
    actions.ts
  _components/
    CmsPostTable.tsx
```

## タスク

### `/admin/cms`（事例一覧）

- [x] `searchParams.published`（`true` / `false`）でタブ切替
- [x] `CmsPostTable`：タイトル / エリア / 作業種別 / 公開状態 / 作成日
- [x] 「新規作成」ボタン

### `CmsPostForm`（新規・編集共通、Client Component）

入力項目：

| フィールド | 型 | バリデーション |
|-----------|-----|---------------|
| タイトル | text | 必須 |
| スラッグ | text | 必須・英数字ハイフン・一意性チェック |
| 概要 | textarea | 任意 |
| 本文 | textarea（Markdown） | 必須 |
| 対応エリア | text | 任意 |
| 作業種別 | select | 任意 |
| 完了日 | date | 任意 |
| 画像 | file（multiple） | 任意・JPEG/PNG・最大 10 枚 |

- [x] 画像は Supabase Storage（`cms/` バケット）にアップロード
- [x] 既存画像はプレビュー表示＋削除ボタン

### `PublishToggle`（Client Component）

- [x] `published` を切り替えるトグルスイッチ
- [x] Server Action `togglePublish`

### `DeleteButton`（Client Component）

- [x] 確認ダイアログ（`window.confirm` またはカスタム Modal）を出してから削除
- [x] Server Action `deletePost`：Supabase Storage の画像も合わせて削除

### Server Actions

```ts
// app/(admin)/cms/new/actions.ts
"use server"
export async function createPost(formData: FormData): Promise<{ id: string }>

// app/(admin)/cms/[id]/actions.ts
"use server"
export async function updatePost(id: string, formData: FormData): Promise<void>
export async function togglePublish(id: string, published: boolean): Promise<void>
export async function deletePost(id: string): Promise<void>
```

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Table, Button, Input, Textarea）
- #03 DB スキーマ（CmsPost テーブル）
- #11 公開サイト事例ページ（CMS 更新後に公開サイトに反映されることを確認）
