# ServiceHub チケット一覧

開発順に番号を振っています。依存チケットを先に完了させてから着手してください。

## フェーズ 0：基盤

| # | チケット | 概要 | 依存 |
|---|---------|------|------|
| [#01](./%2301-design-system.md) | デザインシステム | globals.css・@theme トークン定義 | なし |
| [#02](./%2302-ui-components.md) | 共通 UI コンポーネント | Button / Input / Badge / Table / Modal 等 | #01 |
| [#03](./%2303-db-schema.md) | DB スキーマ・Prisma 設定 | Supabase PostgreSQL にスキーマ適用 | なし |
| [#04](./%2304-auth.md) | 認証基盤（NextAuth.js） | Admin / Contractor ロール認証・middleware | #03 |

## フェーズ 1：レイアウト

| # | チケット | 概要 | 依存 |
|---|---------|------|------|
| [#05](./%2305-layout-public.md) | 公開サイトレイアウト | `(public)/layout.tsx` Header / Footer | #01 #02 |
| [#06](./%2306-layout-admin.md) | 管理画面レイアウト | `(admin)/layout.tsx` AdminSidebar | #01 #02 #04 |
| [#07](./%2307-layout-contractor.md) | 業者ポータルレイアウト | `(contractor)/layout.tsx` ContractorSidebar | #01 #02 #04 |

## フェーズ 2：公開サイト

| # | チケット | 画面 | 依存 |
|---|---------|------|------|
| [#08](./%2308-page-top.md) | トップページ | P-01 | #05 #03 |
| [#09](./%2309-page-contact.md) | 問い合わせフォーム | P-04 P-05 | #05 #02 #03 |
| [#10](./%2310-page-apply.md) | 業者登録申請フォーム | P-06 P-07 | #05 #02 #03 |
| [#11](./%2311-page-cases.md) | 事例一覧・詳細 | P-02 P-03 | #05 #03 |

## フェーズ 3：管理画面（MVP）

| # | チケット | 画面 | 依存 |
|---|---------|------|------|
| [#12](./%2312-admin-login.md) | 管理画面ログイン | A-01 | #01 #02 #04 |
| [#13](./%2313-admin-inquiries.md) | 問い合わせ管理 | A-03 A-04 | #06 #02 #03 |
| [#14](./%2314-admin-orders.md) | 案件管理 | A-05 A-06 A-07 | #06 #02 #03 #13 |
| [#15](./%2315-admin-customers.md) | 顧客管理 | A-08 A-09 | #06 #02 #03 |
| [#16](./%2316-admin-dashboard.md) | ダッシュボード | A-02 | #06 #02 #03 #13 |

## フェーズ 4：管理画面（Phase 2）

| # | チケット | 画面 | 依存 |
|---|---------|------|------|
| [#17](./%2317-admin-contractors.md) | 業者管理 | A-10 A-11 A-12 | #06 #02 #03 #04 |
| [#18](./%2318-admin-invoices.md) | 帳票・請求管理 + PDF | A-13 A-14 | #06 #02 #03 #14 |
| [#19](./%2319-email-notification.md) | メール通知（Resend） | - | #09 #17 #24 |

## フェーズ 5：管理画面（Phase 3）

| # | チケット | 画面 | 依存 |
|---|---------|------|------|
| [#20](./%2320-admin-cms.md) | CMS 機能 | A-15 A-16 | #06 #02 #03 #11 |
| [#21](./%2321-admin-settings.md) | システム設定 | A-17 | #06 #02 #04 #19 |

## フェーズ 6：業者ポータル

| # | チケット | 画面 | 依存 |
|---|---------|------|------|
| [#22](./%2322-contractor-login.md) | 業者ポータルログイン | C-01 | #01 #02 #04 #07 |
| [#23](./%2323-contractor-orders.md) | 案件一覧・詳細 | C-02 C-03 | #07 #02 #03 #22 |
| [#24](./%2324-contractor-report.md) | 作業報告登録 | C-04 | #07 #02 #03 #23 |
| [#25](./%2325-contractor-profile.md) | 自社情報管理 | C-05 | #07 #02 #03 #23 |

---

## 共通ルール（全チケット適用）

- `app/layout.tsx`（RootLayout）は **絶対に編集しない**
- レイアウトは各セクションの `layout.tsx` に実装する（`(public)` / `(admin)` / `(contractor)`）
- スタイルは CSS 変数トークン（`bg-background` / `text-foreground` / `bg-ink` 等）のみ使用
- `bg-gray-*` / `text-gray-*` ユーティリティおよび生 HEX 値の直書き **禁止**
- Next.js 16 / React 19 / Tailwind CSS v4 / Prisma v7 の仕様を必ず確認してから実装
  - Tailwind v4 は `tailwind.config.js` なし。トークンは `globals.css` の `@theme` で定義
  - `node_modules/next/dist/docs/` のガイドを参照すること（AGENTS.md 参照）
