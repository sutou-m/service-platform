# #04 認証基盤（NextAuth.js）

## 概要

NextAuth.js v4 で Admin と Contractor の 2 ロール認証を実装する。
セッション情報にロールを含め、middleware でルートを保護する。

## 対象ファイル

```
app/api/auth/[...nextauth]/route.ts
lib/auth.ts               # NextAuth options（共有設定）
lib/auth-helpers.ts       # getServerSession ラッパー
middleware.ts             # ルート保護
types/next-auth.d.ts      # セッション型拡張
```

## タスク

### NextAuth 設定（`lib/auth.ts`）

- [ ] `PrismaAdapter` を使用（`@auth/prisma-adapter` パッケージを追加）
- [x] Provider: **Credentials**（メール＋パスワード）のみ
  - `authorize` でメールアドレスと bcrypt ハッシュ済みパスワードを照合
  - 認証成功時に `role` をトークンに付与
- [x] `callbacks.jwt`：`role` をトークンに保持
- [x] `callbacks.session`：`session.user.role` に `token.role` を反映
- [x] `pages.signIn` を `/admin/login`（Admin）と `/contractor/login`（Contractor）に分ける
  - ログインページ URL によって適切な signIn ページにリダイレクトする設定
- [x] `session.strategy: "jwt"`

### 型拡張（`types/next-auth.d.ts`）

```ts
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "CONTRACTOR"
    } & DefaultSession["user"]
  }
}
```

### ルート保護（`middleware.ts`）

- [x] `/admin/*` パスは `role === "ADMIN"` のみ許可、未認証は `/admin/login` へリダイレクト
- [x] `/contractor/*` パスは `role === "CONTRACTOR"` のみ許可、未認証は `/contractor/login` へリダイレクト
- [ ] `matcher` に公開パス（`/`、`/cases/*`、`/contact/*`、`/apply/*`、`/api/auth/*`）は含めない

### パスワードハッシュ

- [x] `bcryptjs` パッケージを追加（`@types/bcryptjs` も）
- [x] `lib/auth-helpers.ts` に `hashPassword` / `verifyPassword` ヘルパーを実装

### API Route（`app/api/auth/[...nextauth]/route.ts`）

- [x] `lib/auth.ts` の options をインポートして `GET` / `POST` をエクスポート

## 環境変数（`.env.local`）

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32 で生成>
DATABASE_URL=<Supabase connection string>
```

## 依存チケット

- #03 DB スキーマ（User / Account / Session テーブルが必要）
