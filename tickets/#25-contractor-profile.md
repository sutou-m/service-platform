# #25 業者ポータル - 自社情報管理（C-05）

## 概要

`/contractor/profile` の自社情報確認・変更申請ページを実装する。

## 対象ファイル

```
app/(contractor)/profile/
  page.tsx
  _components/
    ProfileView.tsx
    ProfileEditForm.tsx
    CreditInfo.tsx
  actions.ts
```

## タスク

### `page.tsx`（Server Component）

- [x] `getContractorSession()` で業者情報を取得
- [x] `ProfileView` と `CreditInfo` を配置

### `ProfileView`

- [x] 表示項目：会社名・代表者名・住所・電話番号・メールアドレス・対応エリア・作業種別・自己紹介
- [x] 「変更を申請する」ボタンで `ProfileEditForm` を開く（モーダルまたはインライン展開）

### `ProfileEditForm`（Client Component）

- [x] 全フィールドを編集可能フォームで表示
- [x] 保存すると Server Action `requestProfileUpdate` を呼び出す
  - `prisma.contractor.update` で情報を更新
  - 本番運用なら「変更申請」として別テーブルに保留するが、MVP では即時反映で OK
- [x] zod でバリデーション

### `CreditInfo`

- [x] 紹介料クレジット残高・上限を表示
- [x] 「残高 ○ 円 / 上限 ○ 円」の形式

### `actions.ts`

```ts
"use server"
export async function requestProfileUpdate(contractorId: string, formData: FormData): Promise<void>
```

## 依存チケット

- #07 業者ポータルレイアウト
- #02 共通 UI コンポーネント（Button, Input, Textarea）
- #03 DB スキーマ（Contractor テーブル）
- #23 業者ポータル案件管理（共通セッションヘルパー）
