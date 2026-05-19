# #22 業者ポータル - ログイン（C-01）

## 概要

`/contractor/login` の業者ポータル専用ログインページを実装する。
管理者ログイン（#12）とほぼ同様の構成。

## 対象ファイル

```
app/(contractor)/login/
  page.tsx
  _components/
    ContractorLoginForm.tsx
```

## タスク

### `ContractorLoginForm`（Client Component）

- [ ] メールアドレス・パスワードの入力フォーム
- [ ] `signIn("credentials", { email, password, callbackUrl: "/contractor" })` を呼び出し
- [ ] エラー時はメッセージ表示
- [ ] 送信中は Button を disabled + Spinner

### `page.tsx`

- [ ] ページ中央にカードレイアウト（`min-h-screen flex items-center justify-center bg-paper`）
- [ ] 「ServiceHub 業者ポータル」の見出し
- [ ] このページは `/(contractor)/layout.tsx` のセッションチェックをバイパスさせること

## 依存チケット

- #01 デザインシステム
- #02 共通 UI コンポーネント
- #04 認証基盤
- #07 業者ポータルレイアウト
