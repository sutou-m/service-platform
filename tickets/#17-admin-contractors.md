# #17 管理画面 - 業者管理（A-10, A-11, A-12）

## 概要

`/admin/contractors/applications`（申請一覧）・`/admin/contractors`（業者一覧）・`/admin/contractors/[id]`（業者詳細）を実装する。

## 対象ファイル

```
app/(admin)/contractors/
  page.tsx                     # 業者一覧（ACTIVE/INACTIVE）
  applications/
    page.tsx                   # 申請一覧（PENDING）
    _components/
      ApplicationActions.tsx   # 承認/却下ボタン
    actions.ts
  [id]/
    page.tsx                   # 業者詳細
    _components/
      CreditLimitForm.tsx      # クレジット上限設定
      ContractorStatusToggle.tsx
    actions.ts
  _components/
    ContractorTable.tsx
```

## タスク

### `/admin/contractors/applications`（申請一覧）

- [ ] `status: "PENDING"` の Contractor を一覧表示
- [ ] `ApplicationActions`（Client Component）：
  - 「承認」ボタン → Server Action `approveContractor`
    - `status: "ACTIVE"` に更新
    - NextAuth の User を作成し `Contractor.userId` に紐付け（ランダムパスワードを生成してメールで通知 → #19 メール通知）
  - 「却下」ボタン → `status: "INACTIVE"` に更新

### `/admin/contractors`（業者一覧）

- [ ] `searchParams.status`（`ACTIVE` / `INACTIVE`）でフィルタ
- [ ] `ContractorTable`：会社名 / 担当者名 / エリア / 担当案件数 / ステータス

### `/admin/contractors/[id]`（業者詳細）

- [ ] 基本情報（会社名・担当者名・住所・電話・メール・対応エリア・作業種別・自己紹介）
- [ ] 担当案件一覧（直近 10 件、ステータス付き）
- [ ] 紹介料クレジット残高・上限
- [ ] `CreditLimitForm`：クレジット上限額を設定する Server Action フォーム
- [ ] `ContractorStatusToggle`：ACTIVE ↔ INACTIVE を切り替えるトグルボタン

### Server Actions

```ts
// app/(admin)/contractors/applications/actions.ts
"use server"
export async function approveContractor(contractorId: string): Promise<void>
export async function rejectContractor(contractorId: string): Promise<void>

// app/(admin)/contractors/[id]/actions.ts
"use server"
export async function setCreditLimit(contractorId: string, limit: number): Promise<void>
export async function toggleContractorStatus(contractorId: string): Promise<void>
```

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Table, Badge, Button）
- #03 DB スキーマ（Contractor, User テーブル）
- #04 認証基盤（業者 User 作成）
