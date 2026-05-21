# #10 公開サイト - 業者登録申請フォーム（P-06, P-07）

## 概要

`/apply` の業者登録申請フォームと `/apply/thanks` の完了ページを実装する。

## 対象ファイル

```
app/(public)/apply/
  page.tsx
  thanks/
    page.tsx
  _components/
    ApplyForm.tsx
  actions.ts
```

## タスク

### `ApplyForm`（Client Component）

入力項目：

| フィールド | 型 | バリデーション |
|-----------|-----|---------------|
| 会社名（屋号） | text | 必須 |
| 代表者名 | text | 必須 |
| 住所 | text | 必須 |
| 電話番号 | tel | 必須・電話番号形式 |
| メールアドレス | email | 必須・メール形式 |
| 対応可能エリア | checkbox group | 1 つ以上選択必須 |
| 対応可能作業種別 | checkbox group | 1 つ以上選択必須 |
| 自己紹介・実績 | textarea | 任意 |

- [x] エリア・作業種別の選択肢は `lib/data/service-types.ts` の定数から生成
- [x] `useActionState` でフォーム送信状態を管理
- [x] 送信中は Submit ボタンを disabled＋Spinner

### `actions.ts`（Server Action）

```ts
"use server"
export async function submitApply(formData: FormData): Promise<ActionResult>
```

- [x] zod でバリデーション
- [x] `prisma.contractor.create`（`status: "PENDING"`）で保存
- [x] 成功時 → `/apply/thanks` にリダイレクト

### `/apply/thanks`

- [x] 申請受付メッセージを表示（「審査後、登録メールアドレスにご連絡します」）

## 依存チケット

- #05 公開サイトレイアウト
- #02 共通 UI コンポーネント
- #03 DB スキーマ（Contractor テーブル）
