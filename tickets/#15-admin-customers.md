# #15 管理画面 - 顧客管理（A-08, A-09）

## 概要

`/admin/customers`（一覧）と `/admin/customers/[id]`（詳細）を実装する。

## 対象ファイル

```
app/(admin)/customers/
  page.tsx
  [id]/
    page.tsx
    _components/
      CustomerMemoForm.tsx
  _components/
    CustomerTable.tsx
```

## タスク

### `/admin/customers`（一覧）

- [ ] `searchParams.q` でメール・氏名の部分一致検索
- [ ] `CustomerTable`：氏名 / メール / 電話番号 / 案件数 / 登録日
- [ ] 行クリックで詳細ページへ

### `/admin/customers/[id]`（詳細）

基本情報カード：

- [ ] 氏名 / メール / 電話番号 / 住所 / 登録日

履歴タブ（タブ UI を `_components` に実装）：

- [ ] **問い合わせ履歴**：受付日 / 作業内容 / ステータス の一覧（詳細へのリンク付き）
- [ ] **案件履歴**：作成日 / 作業内容 / ステータス の一覧（詳細へのリンク付き）
- [ ] **請求履歴**：請求日 / 金額 / 支払状況 の一覧

担当メモ：

- [ ] `CustomerMemoForm`：メモを保存する Server Action フォーム
  ```ts
  "use server"
  export async function updateCustomerMemo(customerId: string, memo: string): Promise<void>
  ```

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Table, Badge）
- #03 DB スキーマ（Customer, Inquiry, Order, Invoice テーブル）
