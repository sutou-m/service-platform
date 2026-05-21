# #24 業者ポータル - 作業報告登録（C-04）

## 概要

`/contractor/orders/[id]/report` の作業報告登録ページを実装する。
報告後に管理者へメール通知を送信する（#19 完了後）。

## 対象ファイル

```
app/(contractor)/orders/[id]/report/
  page.tsx
  _components/
    ReportForm.tsx
  actions.ts
```

## タスク

### `ReportForm`（Client Component）

入力項目：

| フィールド | 型 | バリデーション |
|-----------|-----|---------------|
| 作業日時 | datetime-local | 必須 |
| 作業内容 | textarea | 必須 |
| 写真 | file（multiple） | 任意・JPEG/PNG・最大 10 枚・1 枚 10MB 以下 |

- [x] 写真は Supabase Storage（`reports/` バケット）にアップロード
- [x] `useActionState` で送信状態を管理
- [x] 送信中は Submit ボタンを disabled + Spinner

### `actions.ts`（Server Action）

```ts
"use server"
export async function submitReport(orderId: string, formData: FormData): Promise<ActionResult>
```

- [x] `getContractorSession()` で業者を確認（自社案件か検証）
- [x] zod でバリデーション
- [x] 写真を Supabase Storage にアップロード
- [x] `prisma.orderReport.create` で保存
- [x] `order.status` が `WORK_SCHEDULED` の場合は `WORKING` に自動遷移（`OrderStatusHistory` も追加）
- [x] `sendEmail(reportNotify(...))` で管理者に通知（#19 実装後にアンコメント）
- [x] 成功時 → `/contractor/orders/[id]` にリダイレクト

### `page.tsx`

- [x] 案件情報（作業内容・作業場所）を上部に表示
- [x] `ReportForm` を配置

## 依存チケット

- #07 業者ポータルレイアウト
- #02 共通 UI コンポーネント（Button, Input, Textarea, Label）
- #03 DB スキーマ（OrderReport テーブル）
- #23 業者ポータル案件一覧・詳細（遷移元）
- #19 メール通知（通知送信 - オプション）
