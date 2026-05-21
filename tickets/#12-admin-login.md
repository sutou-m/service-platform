# #12 管理画面 - ログイン（A-01）

## 概要

`/admin/login` のログインページを実装する。NextAuth の `signIn` を使用する。

## 対象ファイル

```
app/(admin)/login/
  page.tsx
  _components/
    LoginForm.tsx
```

## 注意

- このページは `app/(admin)/layout.tsx` のセッションチェックを **通過させる必要がある**
  - layout.tsx で `pathname === "/admin/login"` の場合はリダイレクトしない処理を入れておくこと（#06 参照）
- あるいは `/admin/login` を Route Group 外（`app/admin/login/`）に配置して layout を分離する方法も可

## タスク

### `LoginForm`（Client Component）

- [x] メールアドレス・パスワードの入力フォーム
- [x] `signIn("credentials", { email, password, callbackUrl: "/admin" })` を呼び出し
- [x] エラー時（`?error=CredentialsSignin`）はエラーメッセージを表示
- [x] 送信中は Button を disabled + Spinner

### `page.tsx`

- [x] ページ中央にカードレイアウトでフォームを配置（`min-h-screen flex items-center justify-center bg-paper`）
- [x] 「ServiceHub 管理画面」の見出し

## 依存チケット

- #01 デザインシステム
- #02 共通 UI コンポーネント
- #04 認証基盤
