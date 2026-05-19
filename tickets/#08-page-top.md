# #08 公開サイト - トップページ（P-01）

## 概要

`/` のトップページを実装する。BRUTUS 風のグリッドデザインで事例をサムネイル表示する。

## 対象ファイル

```
app/(public)/page.tsx
app/(public)/_components/
  HeroSection.tsx
  ServicesSection.tsx
  CasesGrid.tsx        # 大小混在グリッド
  FaqSection.tsx
  ContractorCta.tsx
```

## タスク

### `page.tsx`

- [ ] SSG（`export const dynamic = "force-static"` または `generateStaticParams` なしの Server Component）
- [ ] 公開済み CMS 事例を最大 6 件取得（Prisma で `published: true`, `orderBy: createdAt desc`）
- [ ] FAQ データは定数ファイル（`lib/data/faq.ts`）から読み込む

### `HeroSection`

- [ ] 大きな serif 見出し（`font-serif text-4xl md:text-7xl`）
- [ ] キャッチコピー：「依頼から完了まで、ひとつの場所で。」
- [ ] CTA ボタン「無料相談はこちら」→ `/contact`
- [ ] 背景：`bg-paper text-ink`、余白を広く（`py-24 md:py-40`）

### `CasesGrid`（BRUTUS 風大小混在グリッド）

- [ ] 2 カラムグリッドで奇数番目のカードを大きく（`col-span-2` または `row-span-2`）
- [ ] 各カードはアスペクト比 1:1 の `next/image`（`aspect-square object-cover`）
- [ ] ホバーで画像が 1.03 倍にズーム（`transition-transform`）
- [ ] 事例がゼロ件の場合は「事例を準備中です」プレースホルダーを表示
- [ ] `<a href="/cases">すべて見る</a>` リンクをグリッド下部に配置

### `ServicesSection`

- [ ] リフォーム / 清掃 / 引越しサポート / IT サポート の 4 サービスをカードで表示
- [ ] アイコンは SVG（`public/icons/` に配置）または Heroicons（無償OSS）

### `FaqSection`

- [ ] `<details>/<summary>` による折りたたみアコーディオン（JS ライブラリ不要）
- [ ] `lib/data/faq.ts` から Q&A 配列を読み込む

### `ContractorCta`

- [ ] 「業者として登録する」バナーセクション
- [ ] `bg-accent text-ink` の背景、「業者登録はこちら」ボタン → `/apply`

## デザイン制約

- 色は `bg-paper` `bg-ink` `text-foreground` `bg-accent` `text-muted` 等のトークンのみ
- gray-* ユーティリティ・生 HEX 禁止
- 画像は `next/image` を使用（`alt` 属性必須）

## 依存チケット

- #05 公開サイトレイアウト
- #03 DB スキーマ（CmsPost テーブル）
