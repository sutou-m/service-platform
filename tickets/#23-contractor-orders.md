# #23 業者ポータル - 案件一覧・詳細（C-02, C-03）

## 概要

`/contractor`（案件一覧）と `/contractor/orders/[id]`（案件詳細）を実装する。
ログイン中の業者に割り当てられた案件のみ表示する（他業者の案件は一切参照不可）。

## 対象ファイル

```
app/(contractor)/
  page.tsx                   # 案件一覧
  orders/
    [id]/
      page.tsx               # 案件詳細
  _components/
    ContractorOrderTable.tsx
    StatusFilter.tsx
```

## タスク

### セッションから業者情報を取得するヘルパー

```ts
// lib/contractor-session.ts
export async function getContractorSession() {
  const session = await getServerSession()
  const contractor = await prisma.contractor.findUnique({
    where: { userId: session!.user.id },
  })
  if (!contractor) redirect("/contractor/login")
  return contractor
}
```

### `/contractor`（案件一覧）

- [x] `getContractorSession()` で業者を取得
- [x] `where: { contractorId: contractor.id }` で自社案件のみ取得
- [x] `searchParams.status` でフィルタ（全て / 作業予定 / 作業中 / 作業完了）
- [x] `ContractorOrderTable`：作業内容 / 作業場所 / 作業予定日 / ステータス
- [x] 各行の「詳細」ボタンで `/contractor/orders/[id]` へ

### `/contractor/orders/[id]`（案件詳細）

- [x] `getContractorSession()` で業者を取得し、`order.contractorId !== contractor.id` なら 404
- [x] 表示項目（閲覧のみ）：
  - 作業内容
  - 作業場所
  - 訪問予定日時・作業予定日時
  - 顧客連絡先（氏名・電話番号・メールアドレス）
  - ステータス
- [x] 「作業報告を登録する」ボタン → `/contractor/orders/[id]/report`（#24）
- [x] 既存の作業報告一覧（自社分のみ）を下部に表示

## 制約

- `order.contractorId` がセッションの業者 ID と一致しない場合は絶対に表示しない（サーバーサイドで必ず確認）

## 依存チケット

- #07 業者ポータルレイアウト
- #02 共通 UI コンポーネント（Table, StatusBadge）
- #03 DB スキーマ（Order, Customer テーブル）
- #22 業者ポータルログイン
