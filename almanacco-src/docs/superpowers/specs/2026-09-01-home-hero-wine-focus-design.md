# Home: ヒーロー演出強化 + ワイン訴求優先 設計書

## 背景・目的

横須賀の実店舗は「ワインショップ」を事業方針として確定している。ワインは自社所有の畑(スペイン)と提携生産者(スペイン・イタリア)によるもの、オリーブオイルはマルケ州の自社農場で生産したものを主軸に扱う。現行の Home ページはオイルとワインが並列の扱いで、ヒーローに動きの演出も無く、産地・生産体制も正確に反映されていない。

今回の変更は Home ページに限定し、以下3点を実現する。

1. ヒーローセクションに控えめなアニメーションを追加し、ページの第一印象を強める
2. ワインの訴求順位をオイルより先に上げる
3. ヒーロー文言を、実際の生産体制(自社畑・提携生産者、スペイン・イタリア)に即した表現に更新する

## 対象範囲

- `src/components/HomeHero.astro`
- `src/components/CategoryGrid.astro`
- `src/i18n/content.ts` の `hero.text` と `categories.items` (it / en / ja の3言語)

### 対象外(今回は変更しない)

- Shop ページのカテゴリ順序(`src/components/ShopPage.astro` の `groups` 配列) — Home限定のため
- About ページの文言
- 実際の商品データ(ヨーロッパ産品の追加、在庫構成の変更)
- `hero.subtitle` / `italyJapan` セクションの文言
- GSAP 等の外部アニメーションライブラリの導入

## 変更内容

### 1. ヒーローのアニメーション(`HomeHero.astro`)

- **ロード時の stagger フェードイン**: ロゴ → タイトル → サブタイトル → 説明文 → CTAボタン群の順に、0.1〜0.15秒ずつ遅れて `opacity: 0 → 1` + `translateY(12px) → 0` のトランジションで出現する
- **スクロール連動パララックス**: `BackgroundMotif` の背景写真が、スクロール量の約70〜80%の速度で追従する(`transform: translateY()` をスクロールイベントで更新、`will-change: transform` を指定)
- **燕の飛行ルートSVG**: ページ表示時に `stroke-dasharray` / `stroke-dashoffset` を使い、パスが左から右へ「描かれる」ように見えるアニメーションを追加(既存の燕アイコン画像自体は変更しない)
- 実装は Astro の `<script>` ブロック内の vanilla JS + CSS `@keyframes`/`transition` のみで完結させる。外部ライブラリは追加しない
- `prefers-reduced-motion: reduce` を尊重し、モーションを削減するユーザーには即時表示にフォールバックする

### 2. カテゴリ並び替え(`CategoryGrid.astro` / `content.ts`)

`categories.items` の配列順を、3言語すべてで以下のように変更する。

- 変更前: `[オイル&調味料, ワイン&飲料, 陶器と手仕事, 日記帳]`
- 変更後: `[ワイン&飲料, オイル&調味料, 陶器と手仕事, 日記帳]`

`CategoryGrid.astro` 内の `i === 2` によるプレースホルダー分岐(画像なしの陶器/日記帳向けの手描きSVG)は、陶器(index 2)・日記帳(index 3)の位置が変わらないため変更不要。オイル・ワインは両方とも画像付きの通常表示なので、単純な入れ替えで完結する。

### 3. ヒーロー文言の更新(`content.ts` の `hero.text`)

ワインを先頭に置き、「自社畑・提携生産者」「スペイン・イタリア」という実際の生産体制を明示する。産地不明瞭な「ヨーロッパから」という表現は使わない。

| 言語 | 変更後の文言 |
|---|---|
| ja | 横須賀にあるイタリアの小さな店。自社の畑や提携生産者が手がける、スペインとイタリアのワインとオリーブオイル。 |
| it | Una bottega italiana a Yokosuka: vini e olio dai nostri vigneti e da produttori partner, tra Spagna e Italia. |
| en | An Italian shop in Yokosuka: wines and olive oil from our own vineyards and partner producers, across Spain and Italy. |

`hero.subtitle` (「イタリアから、季節とともに。」等) は変更しない。店の運営主体(Ikitaria)はイタリアだが、扱う産品はスペインを含む点に注意 — subtitleとtextの間で産地表現が重複・矛盾しないよう、subtitle側は店の性格、text側は産品の産地、と役割を分けている。

## 技術方針

- 追加の npm 依存は入れない(既存の `astro` + `tailwindcss` のみで実装)
- アニメーションは CSS `@keyframes`/`transition` + 最小限の vanilla JS(`IntersectionObserver` または `scroll` イベント)
- `prefers-reduced-motion` 対応必須

## 検証方法

- `npm run dev` でローカル起動し、it/en/ja 3言語それぞれで Home ページの表示・アニメーション・カテゴリ並び順を目視確認
- `npm run build && npm run preview` で本番ビルド相当の動作も確認
- ブラウザで `prefers-reduced-motion: reduce` を有効にした状態でアニメーションが即時表示にフォールバックすることを確認
- 既存のリンク・レイアウト(ヘッダー高さ、モバイル表示)にリグレッションがないことを確認
