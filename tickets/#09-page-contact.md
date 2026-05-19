# #09 公開サイト - 問い合わせフォーム（P-04, P-05）

## 概要

`/contact` の問い合わせフォームと `/contact/thanks` の完了ページを実装する。
Server Actions でバリデーション・DB 保存・メール送信を行う。

## 対象ファイル

```
app/(public)/contact/
  page.tsx            # フォームページ（Client Component）
  thanks/
    page.tsx          # 送信完了ページ
  _components/
    ContactForm.tsx
  actions.ts          # Server Action
```

## タスク

### `ContactForm`（Client Component）

入力項目：

| フィールド | 型 | バリデーション |
|-----------|-----|---------------|
| 氏名 | text | 必須 |
| 電話番号 | tel | 必須・`/^0\d{1,4}-\d{1,4}-\d{4}$/` |
| メールアドレス | email | 必須・メール形式 |
| 住所 | text | 必須 |
| 希望作業内容 | textarea | 必須 |
| 希望日時 | datetime-local | 任意 |
| 備考 | textarea | 任意 |
| 写真 | file（multiple） | 任意・JPEG/PNG・最大 5 枚・1 枚 5MB 以下 |

- [ ] React の `useActionState`（Next.js 16 / React 19 の新 hook）でフォーム送信状態を管理
- [ ] バリデーションはサーバーサイド（Server Action）で行い、エラーをフォームに表示
- [ ] 送信中は Submit ボタンを `Spinner` 付きで disabled にする
- [ ] 写真アップロードは Supabase Storage（`inquiries/` バケット）に保存し、URLを DB に記録

### `actions.ts`（Server Action）

```ts
"use server"
export async function submitContact(formData: FormData): Promise<ActionResult>
```

- [ ] zod でバリデーション（`zod` パッケージ追加）
- [ ] 写真を Supabase Storage にアップロードして URL 配列を取得
- [ ] `prisma.inquiry.create` で保存
- [ ] Resend でメール送信（#19 メール通知チケットの実装後にアンコメント、今は TODO コメントのみ）
- [ ] 成功時 → `/contact/thanks` にリダイレクト
- [ ] 失敗時 → `{ errors: {...} }` を返してフォームに再表示

### `/contact/thanks`

- [ ] 送信完了メッセージを表示
- [ ] 「トップへ戻る」リンク

## 環境変数

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 依存チケット

- #05 公開サイトレイアウト
- #02 共通 UI コンポーネント（Input, Textarea, Button, Label, Alert）
- #03 DB スキーマ（Inquiry テーブル）
