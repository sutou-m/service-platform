# #16 管理画面 - ダッシュボード（A-02）

## 概要

`/admin`（ダッシュボード）を実装する。サマリーカード・未入金情報・最近の問い合わせを表示する。
売上グラフは Phase 3 相当なので、このチケットではテキストサマリーのみ実装し、グラフは TODO として残す。

## 対象ファイル

```
app/(admin)/page.tsx
app/(admin)/_components/
  SummaryCards.tsx
  RecentInquiriesTable.tsx
  UnpaidSummary.tsx
```

## タスク

### `page.tsx`（Server Component）

一度の Prisma クエリでまとめて集計：

```ts
const [todayCount, statusCounts, unpaid, recentInquiries] = await Promise.all([
  // 本日の新規問い合わせ件数
  prisma.inquiry.count({ where: { createdAt: { gte: startOfToday } } }),
  // ステータス別案件数
  prisma.order.groupBy({ by: ["status"], _count: true }),
  // 未入金請求
  prisma.invoice.findMany({ where: { status: "UNPAID" }, include: { order: true } }),
  // 最近の問い合わせ 5 件
  prisma.inquiry.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { customer: true } }),
])
```

### `SummaryCards`

- [x] 本日の新規問い合わせ件数（カード）
- [x] ステータス別案件数（新規 / 対応中 / 完了 / 請求済）を各カードで表示
- [x] カードは `Card` コンポーネントを使用、数値を大きく表示

### `UnpaidSummary`

- [x] 未入金件数と合計金額を表示
- [x] 請求一覧（`/admin/invoices?status=UNPAID`）へのリンク

### `RecentInquiriesTable`

- [x] 最近 5 件の問い合わせを Table で表示（氏名 / 作業内容 / 受付日時 / ステータス）
- [x] 各行に詳細リンク

### 売上グラフ（TODO）

- [x] グラフ描画部分は `{/* TODO: 売上グラフ (#16-chart) */}` のコメントプレースホルダーで残す
- [x] Chart.js または Recharts を後のチケットで追加予定

## 依存チケット

- #06 管理画面レイアウト
- #02 共通 UI コンポーネント（Card, Table）
- #03 DB スキーマ（全テーブル）
- #13 問い合わせ管理（データ確認用）
