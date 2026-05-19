# #11 公開サイト - 事例一覧・詳細（P-02, P-03）

## 概要

`/cases`（事例一覧）と `/cases/[id]`（事例詳細）を実装する。
CMS で公開された記事のみ表示する。

## 対象ファイル

```
app/(public)/cases/
  page.tsx            # 事例一覧（SSG）
  [id]/
    page.tsx          # 事例詳細（SSG + generateStaticParams）
  _components/
    CaseCard.tsx
    CaseDetail.tsx
```

## タスク

### `/cases`（事例一覧 - `page.tsx`）

- [ ] Prisma で `published: true` の CmsPost を全件取得（`orderBy: createdAt desc`）
- [ ] BRUTUS 風の大小混在グリッド（#08 の `CasesGrid` を流用または同様に実装）
- [ ] 件数 0 の場合は「事例を準備中です」表示
- [ ] `export const revalidate = 60`（ISR：1 分ごとに再生成）

### `CaseCard`

- [ ] 正方形サムネイル（`aspect-square`）に `next/image` で表示
- [ ] タイトル・エリア・完了日を下部に表示
- [ ] `href="/cases/[id]"` のリンクカード

### `/cases/[id]`（事例詳細）

- [ ] `generateStaticParams`：`published: true` の全スラッグを返す
- [ ] 対応内容テキスト・画像ギャラリー（複数画像を横スクロール or グリッド）・担当エリア・完了日を表示
- [ ] 存在しない id → `notFound()` を返す
- [ ] OGP `metadata` を動的生成（`generateMetadata`）
- [ ] 「← 事例一覧に戻る」リンク

## デザイン制約

- カードホバー：画像ズーム `scale-[1.03] transition-transform`
- 色は `bg-surface` `text-foreground` `text-muted` `bg-paper` のトークンのみ

## 依存チケット

- #05 公開サイトレイアウト
- #03 DB スキーマ（CmsPost テーブル）
