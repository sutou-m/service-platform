# #19 メール通知（Resend）

## 概要

Resend を使ってメール通知を送信する共通モジュールを実装する。
各トリガーポイントは他チケットで `TODO: メール通知` としてコメントアウト済みのため、本チケットでそれらを有効化する。

## 対象ファイル

```
lib/
  email/
    client.ts            # Resend クライアントシングルトン
    templates/
      inquiry-confirm.tsx   # 顧客への問い合わせ確認メール
      inquiry-notify.tsx    # 管理者への新規問い合わせ通知
      contractor-approved.tsx # 業者承認メール（初期パスワード含む）
      report-notify.tsx      # 作業報告受信通知（管理者向け）
    send.ts              # sendEmail ヘルパー
```

## タスク

### Resend クライアント（`lib/email/client.ts`）

- [x] `resend` パッケージを追加（`npm install resend`）
- [x] `RESEND_API_KEY` 環境変数から初期化するシングルトン

### メールテンプレート（React Email）

- [ ] `@react-email/components` パッケージを追加
- [x] `inquiry-confirm.tsx`：
  - 件名「【ServiceHub】お問い合わせを受け付けました」
  - 顧客の入力内容サマリー（氏名・作業内容・希望日時）を本文に含める
- [x] `inquiry-notify.tsx`：
  - 件名「【ServiceHub】新規問い合わせが届きました」
  - 管理者通知先アドレスへ送信
- [x] `contractor-approved.tsx`：
  - 件名「【ServiceHub】業者登録が承認されました」
  - ログイン URL・初期パスワードを本文に含める
- [x] `report-notify.tsx`：
  - 件名「【ServiceHub】作業報告が登録されました」

### `sendEmail` ヘルパー（`lib/email/send.ts`）

```ts
export async function sendEmail(options: {
  to: string | string[]
  subject: string
  react: ReactElement
}): Promise<void>
```

- [x] `resend.emails.send` を呼び出す
- [ ] 送信結果を `prisma.notification.create` でログ記録（成功・失敗どちらも）
- [x] 失敗時は例外をスローせずコンソールエラーのみ（メール失敗でユーザー操作をブロックしない）

### トリガーポイントの有効化

- [x] `app/(public)/contact/actions.ts`：問い合わせ送信後に `inquiry-confirm` と `inquiry-notify` を送信
- [x] `app/(admin)/contractors/applications/actions.ts`：業者承認後に `contractor-approved` を送信
- [x] `app/(contractor)/orders/[id]/report/actions.ts`：作業報告登録後に `report-notify` を管理者へ送信

## 環境変数

```
RESEND_API_KEY=re_xxxxxx
ADMIN_NOTIFY_EMAIL=admin@example.com
RESEND_FROM_EMAIL="ServiceHub <noreply@yourdomain.com>"
```

> Resend 無料プランは 100 通/日。開発環境では `@resend.dev` ドメインの送信アドレスを使用。

## 依存チケット

- #09 問い合わせフォーム（トリガー箇所）
- #17 業者管理（承認フロー）
- #24 作業報告登録（報告通知）
