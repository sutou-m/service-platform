# #13 管理画面 - 問い合わせ管理（A-03, A-04）

## 概要

`/admin/inquiries`（一覧）と `/admin/inquiries/[id]`（詳細）を実装する。

## 対象ファイル

```
app/(admin)/inquiries/
  page.tsx                  # 一覧（Server Component）
  [id]/
    page.tsx                # 詳細（Server Component）
    _components/
      InquiryActions.tsx    # 「案件に変換」ボタン等（Client Component）
      MemoForm.tsx          # メモ追記フォーム
  _components/
    InquiryTable.tsx
    StatusFilter.tsx
```

## タスク

### `/admin/inquiries`（一覧）

- [ ] 検索クエリ（`searchParams`）から `status` フィルタを取得
- [ ] Prisma で問い合わせを新着順取得（`include: { customer: true }`）
- [ ] `StatusFilter`：NEW / CONVERTED / CLOSED のタブ or セレクト UI
- [ ] `InquiryTable`：氏名 / 電話番号 / 作業内容 / 受付日時 / ステータス のカラム
  - 行クリックで詳細ページへ遷移

### `/admin/inquiries/[id]`（詳細）

- [ ] 問い合わせの全フィールド表示（氏名・電話・メール・住所・作業内容・希望日時・備考）
- [ ] 添付写真をギャラリー表示（`next/image`）
- [ ] `InquiryActions`（Client Component）：
  - 「案件に変換」ボタン → Server Action `convertToOrder` を呼び出す
    - `prisma.order.create` で案件を作成し、`inquiry.status` を `CONVERTED` に更新
    - 作成した案件の詳細ページ（`/admin/orders/[id]`）にリダイレクト
  - ステータス変更ボタン（CLOSED 等）
- [ ] `MemoForm`：対応メモを textarea で追記できる Server Action フォーム

### API Route or Server Action

```ts
// app/(admin)/inquiries/[id]/actions.ts
"use server"
export async function convertToOrder(inquiryId: string): Promise<{ orderId: string }>
export async function updateMemo(inquiryId: string, memo: string): Promise<void>
```

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Table, Badge, Button）
- #03 DB スキーマ（Inquiry, Order テーブル）
