# #14 管理画面 - 案件管理（A-05, A-06, A-07）

## 概要

`/admin/orders`（一覧）・`/admin/orders/new`（新規登録）・`/admin/orders/[id]`（詳細・編集）を実装する。

## 対象ファイル

```
app/(admin)/orders/
  page.tsx
  new/
    page.tsx
    _components/
      OrderForm.tsx
    actions.ts
  [id]/
    page.tsx
    edit/
      page.tsx
    _components/
      OrderEditForm.tsx
      StatusChanger.tsx
      AssignContractor.tsx
    actions.ts
  _components/
    OrderTable.tsx
    OrderFilters.tsx
```

## タスク

### `/admin/orders`（一覧）

- [x] `searchParams` から `status` / `contractorId` / `from` / `to` / `q`（顧客名）フィルタを取得
- [x] Prisma で案件を取得（`include: { customer: true, contractor: true }`）
- [x] `OrderFilters`：ステータス セレクト + 業者セレクト + 期間 DateRange + 顧客名テキスト
- [x] `OrderTable`：案件番号（`id` 先頭 8 文字）/ 顧客名 / ステータス / 担当業者 / 作業予定日 / 作成日
- [x] 「新規案件登録」ボタン

### `/admin/orders/new`（新規登録）

- [x] `OrderForm`：
  - 顧客選択（既存顧客からコンボボックス検索 or 新規顧客情報入力）
  - 作業内容・作業場所・訪問予定日時・作業予定日時
  - 担当業者（Contractor `ACTIVE` 一覧からセレクト、任意）
  - 内部メモ
- [x] Server Action `createOrder`：`prisma.order.create` + 最初の `OrderStatusHistory` レコード作成

### `/admin/orders/[id]`（詳細）

- [x] 基本情報カード（顧客・担当業者・作業内容・日時）
- [x] ステータス履歴タイムライン
- [x] `StatusChanger`（Client Component）：ステータスをドロップダウンで変更 → Server Action `changeStatus`
  - `OrderStatusHistory` にレコード追加
- [x] `AssignContractor`（Client Component）：業者を変更できるフォーム
- [x] 作業報告の一覧（`OrderReport`、写真サムネイル含む）
- [x] 紐付き請求書の表示（`Invoice`）と「請求書発行」ボタン → `/admin/invoices/new?orderId=...`

### Server Actions

```ts
// app/(admin)/orders/[id]/actions.ts
"use server"
export async function changeStatus(orderId: string, status: OrderStatus): Promise<void>
export async function assignContractor(orderId: string, contractorId: string | null): Promise<void>
export async function updateOrder(orderId: string, data: OrderUpdateInput): Promise<void>
```

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Table, StatusBadge, Button, Select）
- #03 DB スキーマ（Order, OrderStatusHistory, Contractor テーブル）
- #13 問い合わせ管理（「案件に変換」からの遷移先）
