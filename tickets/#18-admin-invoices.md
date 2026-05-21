# #18 管理画面 - 帳票・請求管理 + PDF 生成（A-13, A-14）

## 概要

`/admin/invoices`（請求一覧）と `/admin/invoices/[id]`（請求詳細・発行）を実装する。
PDF 出力（請求書・見積書）も本チケットで実装する。

## 対象ファイル

```
app/(admin)/invoices/
  page.tsx
  new/
    page.tsx
    _components/
      InvoiceForm.tsx
    actions.ts
  [id]/
    page.tsx
    _components/
      InvoiceEditor.tsx
      PaymentForm.tsx
      InvoicePdfButton.tsx
    actions.ts
  _components/
    InvoiceTable.tsx
    InvoiceFilters.tsx
lib/
  pdf/
    invoice-template.tsx   # react-pdf テンプレート
    estimate-template.tsx
```

## タスク

### `/admin/invoices`（請求一覧）

- [x] `InvoiceFilters`：期間（from/to）+ 入金状況（UNPAID / PARTIAL / PAID）フィルタ
- [x] `InvoiceTable`：請求番号 / 顧客名 / 発行日 / 金額 / 入金状況
- [ ] 売上サマリー（月別）は月別に `groupBy` で集計してテキスト表示（グラフは #16 の TODO に追従）

### `/admin/invoices/new`（請求書作成）

- [ ] `searchParams.orderId` から案件を自動選択した状態で開く
- [ ] `InvoiceForm`：
  - 案件選択（未請求の Order から）
  - 請求明細行（複数行追加・削除）：説明 / 数量 / 単価 → 合計自動計算
  - 発行日・支払期限
- [x] Server Action `createInvoice`：`prisma.invoice.create` + `InvoiceItem` まとめて作成

### `/admin/invoices/[id]`（請求詳細）

- [x] 請求情報の確認・編集（`InvoiceEditor`）
- [x] `PaymentForm`：入金日・金額・備考を登録する Server Action フォーム
  - `prisma.payment.create` + Invoice の `status` を再計算（PARTIAL / PAID）
- [x] `InvoicePdfButton`（Client Component）：「PDF 出力」ボタン

### PDF 生成（`lib/pdf/`）

- [ ] `@react-pdf/renderer` パッケージを追加
- [ ] `invoice-template.tsx`：請求書レイアウト
  - 会社名・顧客名・発行日・支払期限
  - 明細テーブル（説明 / 数量 / 単価 / 小計）
  - 合計金額・振込先情報（`INVOICE_BANK_INFO` 環境変数から取得）
- [ ] `estimate-template.tsx`：見積書レイアウト（請求書と同構成）
- [ ] PDF ダウンロード用 API Route `app/api/pdf/invoice/[id]/route.ts`：
  ```ts
  export async function GET(request: Request, { params }: { params: { id: string } }) {
    // Prisma でデータ取得 → renderToBuffer → Response(buffer, { headers: { "Content-Type": "application/pdf" } })
  }
  ```

### Server Actions

```ts
// app/(admin)/invoices/[id]/actions.ts
"use server"
export async function addPayment(invoiceId: string, data: PaymentInput): Promise<void>
export async function updateInvoice(invoiceId: string, data: InvoiceUpdateInput): Promise<void>
```

## 環境変数

```
INVOICE_BANK_INFO="○○銀行 ○○支店 普通 1234567 サービスハブ"
INVOICE_COMPANY_NAME="ServiceHub"
INVOICE_COMPANY_ADDRESS="東京都○○区..."
```

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Table, Badge, Button, Input）
- #03 DB スキーマ（Invoice, InvoiceItem, Payment テーブル）
- #14 案件管理（請求書発行ボタンからの遷移先）
