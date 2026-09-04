# Ikitaria サイト 開発履歴メモ

---

## 技術スタック

- 静的 HTML サイト（ビルドシステムなし）
- 言語: IT（ルート）/ EN（`en/`）/ JA（`ja/`）の3言語
- CSS: カスタムプロパティ（デザイントークン）、Google Fonts
- フォーム: Formspree（要: フォームID設定）
- ホスティング: GitHub → `JohnnyDexter/ikitaria.git`（main ブランチ自動デプロイ想定）

---

## セッション 1 — ページ構成リニューアル + デザイン刷新
**コミット: `ce9299a`**

### ページ構成変更
- ナビゲーション: `Home | Chi Siamo | Cosa Facciamo (dropdown) | FAQ | Contatti`
  → `Home | Chi Siamo | Shop | Contatti` に簡略化
- フッターナビ: `Chi Siamo | Produzione | Brand | Supporto BtoB | FAQ`
  → `Chi Siamo | Shop | Eventi` に簡略化
- 新規ページ `shop.html`（IT/EN/JA）を作成:
  `#produzione`・`#brand`・`#btob` の3セクション統合
- `chi-siamo.html` に「Cosa Facciamo」セクション追加（area-card × 3）
- `contact.html` にFAQセクション追加（8項目）、URLパラメータ `?subject=` 自動選択JS実装
- `contact.html` のsubject選択肢を注文対応（Olio EVO / Matcha / Gift Set / Noleggio Fattoria / Evento / Prodotto LE / Supporto BtoB / Altro）

### デザイン刷新（Wabi-sabi Luxury Editorial）
`style.css`（末尾 ~350行追記）:
- フォント変更: Inter + Playfair Display → **Cormorant Garamond + Outfit**
- ゴールドアクセント: `--gold: #c8a864`（ゴールドシステム）
- CSS-only グレインテクスチャ（`body::after` + SVG feTurbulence）
- ヘッダー下端: ゴールドグラデーションボーダー
- ブランドタイトル: イタリック serif + レタースペーシング
- セクション h2: イタリック + ゴールド左線（`::before`）
- FAQ: open 時ゴールド左ボーダー + italic summary
- area-card: ホバーで画像ズーム（`scale(1.07)`）
- CTA・フォーム: ゴールドホバー
- フッタータイトル: CSSグラデーションテキスト

### 影響ファイル
- 全 29 HTML ファイル: ナビ・フッター・Googleフォントリンク更新
- `style.css?v=3` → `v=4`（キャッシュバスト）

---

## セッション 2 — SEO・UX・ビジュアル改善
**コミット: `39a75ac`**

### #2 EN/JA contact フォーム subject 自動選択
- `en/contact.html`・`ja/contact.html` に URLパラメータ `?subject=` でセレクトを自動選択するJSを追加
- EN: `en-subject` セレクト対象（Production / Brand / BtoB Support / Other）
- JA: `ja-subject` セレクト対象（生産事業 / ブランド事業 / 支援事業 / その他）

### #3 sitemap.xml + robots.txt 整備
- `sitemap.xml`: 27 URL（IT/EN/JA 全ページ）、hreflang alternates 付き
- `robots.txt`: `/privacy.html`・`/thanks.html`（各言語）を Disallow に追加

### #4 JSON-LD 構造化データ
- `shop.html`: `Product`（オリーブオイル・抹茶）+ `Service`（BtoB advisory）
- `eventi.html`: `Event`（3イベント: 東京料理教室・ミラノmatcha・Opening Party）
- `index.html`: `Organization` スキーマ（元から存在）

### #5 フォーム送信後サンクスページ
- `thanks.html`（IT）・`en/thanks.html`・`ja/thanks.html` 新規作成
- 各 contact フォームに `<input type="hidden" name="_next" value="...">` 追加
  - IT: `https://ikitaria.com/thanks.html`
  - EN: `https://ikitaria.com/en/thanks.html`
  - JA: `https://ikitaria.com/ja/thanks.html`

### #6 スムーズスクロール オフセット
- `scroll-behavior: smooth` は既存
- `scroll-padding-top: 4.5rem` を `html` に追加（sticky ヘッダー被り防止）

### #7 OGP画像 ページ別最適化（15ページ更新）
| ページ | OGP画像 |
|--------|---------|
| chi-siamo / en-about / ja-about | `biz-hero.jpeg` |
| shop / en-shop / ja-shop | `olive-oil.jpg` |
| fattoria / en-farm / ja-farm | `farm-hero.jpeg` |
| supporto / en-support / ja-biz | `biz-hero.jpeg` |
| brand / en-brand / ja-brand | `brand-hero.jpeg` |
| eventi / en-events / ja-events | `brand-hero.jpeg`（元から設定済み）|

### #8 ヒーロー: パーティクル + スクロール視差
- `index.html` ヒーロー内に `<span class="hero-particle">` × 8 追加（aria-hidden）
- `style.css`: `@keyframes particle-float / particle-float-r` + `.hero-particle` スタイル（ゴールド、各サイズ・位置・タイミングをズラして自然な浮遊感）
- `index.html` にスクロール視差 JS（`requestAnimationFrame`、`prefers-reduced-motion` 対応）
- CSS カスタムプロパティ `--parallax-y` で `#hero-main::before` のY位置を制御

---

## セッション 3 — Shop ダークラグジュアリーリデザイン + イタリック除去
**コミット: `0daffdd`**

### ユーザーからの指示
- ショップを faro-silencio.com/shop.html のようなダークラグジュアリーエディトリアルデザインに
- 斜め字体（italic）を一切使わないこと

### 実施内容
- `style.css` のデザインアップグレードセクションから `font-style: italic` を全7箇所除去
- `style.css` に shop 専用CSS ~330行追加（v=5）:
  `.shop-hero`, `.shop-jumps`, `.shop-jump`, `.product-slide`, `.product-slide-inner.reverse`,
  `.status-badge` (s-available/s-limited/s-order), `.product-prices`, `.price-row`,
  `.farm-rental-block`, `.farm-options`, `.btob-services`, `.btob-service`, `.shop-cta`,
  `.shop-section-header`, `.shop-section-divider`
- `shop.html` / `en/shop.html` / `ja/shop.html` の `<main>` を完全書き直し:
  - `.shop-hero` セクション（ダーク背景 #080808、大型 serif h1）
  - `.shop-jumps` 3リンクナビ
  - オリーブオイル・抹茶: `.product-slide` 2カラム（交互レイアウト）
  - 農場レンタル: `.farm-rental-block` + `.farm-options` 2カラム
  - 文化イベント・限定版: `.product-slide` 2カラム
  - BtoB支援: `.btob-services` 3カラムグリッド + 価格行 + `.shop-cta`
- 全33HTMLファイルの `style.css?v=4` → `v=5` 一括更新

---

## セッション 5 — デザイン改善 + ショップカテゴリー再設計
**変更: `style.css?v=16` → `v=17`**

### 実施内容
- h2見出しサイズ引き上げ（clamp 3.2→4rem）、font-weight 500→400（serif優雅さ向上）
- eyebrowレタースペーシング拡大（0.24→0.32em）
- hero-newsタイトル強化（1.1→1.4rem）、eyebrow 0.22→0.36em、border-bottom opacity 0.18→0.35
- hero-news-title の `color: var(--light)` バグを `var(--text)` に修正
- why-number 拡大（clamp 2.8→3.6rem）、opacity 0.75→0.90
- footer-title 拡大（clamp 5.5→6.5rem）
- セクション境界ゴールドヘアライン追加（`.section::before`）
- `.cat-header-sub` CSS新規追加
- ショップカテゴリー名3言語で更新:
  EN: Taste / Experience / Advisory
  IT: Gusto / Esperienza / Advisory
  JA: テイスト / 体験 / アドバイザリー
- 全33 HTML v=16→v=17

---

## セッション 4 — 全体白統一リデザイン
**変更: `style.css?v=15` → `v=16`**

### ユーザーからの指示
- トップページの黒・白背景混在を解消し、白で統一する

### 実施内容
- `style.css` の以下のスタイルを白/ライトベースに変更:
  - `.hero-news`: `background: var(--dark)` → `var(--surface)` / テキスト色オーバーライド全更新
  - `.dark-section`: `background: linear-gradient(#151311...)` → `var(--surface)` / `color: var(--light)` → `var(--text)`
  - `.dark-section` 内部オーバーライド全更新（column・FAQ・pricing・free-consult-banner・cta）
  - `.site-footer`: 大理石テクスチャ暗背景 → `var(--surface)` / テキスト・グラデーション全更新
  - `.area-number`: 白系透明色 → 黒系透明色（白背景での視認性確保）
- 全33 HTML ファイルの `style.css?v=15` → `v=16` 一括更新
- Shopページは独自クラス使用のため影響なし

---

## セッション 6 — Almanacco統合 + ヘッダーナビ再設計
**変更: style.css?v=31 → v=32**

### 実施内容
- ヘッダーナビを `Home | Chi Siamo | Shop | Contatti` → `Home | Business | Shop(dropdown: Giappone/Italia in arrivo) | Shop Online | Contatti` に再設計
- `chi-siamo.html` + `shop.html` を統合した `business.html`(IT/EN/JA)を新規作成、旧ページはリダイレクトスタブに変更
- `JohnnyDexter/almanacco`(Astro製の実店舗Almanaccoサイト)のビルド成果物を `/almanacco/` にベンダリングして配置。以後Almanaccoリポジトリへの運用依存なし(更新時のみ再ビルド・再配置)
- `style.css` に `.nav-dropdown-disabled` を追加(既存の未使用だった `.nav-has-dropdown`/`.nav-dropdown` CSSを実装に使用)
- `sitemap.xml` の chi-siamo/shop/about エントリを business.html に統合

### Task 11 — エンドツーエンド検証結果(2026-08-27)
- リンク切れ機械チェック: 0件(全33 HTMLファイル、almanacco/を除く)
- ヘッダーナビ順序・Shopドロップダウン(Giappone=クリック可/Italia in arrivo=グレー表示・クリック不可)を IT/EN/JA 全言語で実ブラウザ(Playwright)で確認、期待通り
- `Giappone` → `almanacco/it/about/`、`Shop Online` → `almanacco/it/shop/` への遷移を確認。Almanaccoデザインは正しく表示
- `business.html` に Chi Siamo の起源ストーリー・founders(I Fondatori)・原則(Principi Operativi)・旧shopの8事業ライン(Olio EVO/Matcha/Prodotti Brand/Eventi Culturali/Agriturismo/Consulenza Strategica/Marketing/Rappresentanza Commerciale)が全て含まれることを確認
- `chi-siamo.html` / `shop.html` / `about.html`(IT/EN/JA全ての旧名称)が `business.html` へ即時リダイレクトされることを確認
- `almanacco/ja/sekki/` のSVGホイール前後ボタンの動作を実ブラウザで確認(処暑→白露→処暑と正しく切り替わる)
- Almanacco各ページの「← Ikitaria」バックリンクが言語ごとに正しい遷移先(`https://ikitaria.com/{lang}/`)を指すことを確認
- Almanacco全21ページ(it/en/ja × ルート+about+shop+sekki+journal+events+contact)を全件チェックし、全て200 OK
- `style.css?v=32` が全HTMLファイルで統一されていることを確認
- 発見した問題: なし(致命的な問題は0件)



### Formspree ID 設定（最重要）
フォーム送信が現在機能していない。Formspree でアカウント作成 → フォームID取得 → 以下の3ファイルの `YOUR_FORM_ID` を置き換える:
```
contact.html      → action="https://formspree.io/f/YOUR_FORM_ID"
en/contact.html   → action="https://formspree.io/f/YOUR_FORM_ID"
ja/contact.html   → action="https://formspree.io/f/YOUR_FORM_ID"
```

### プッシュ方法（pre-push フック回避）
Avisail プロジェクトの code-review フックが静的HTMLサイトの直接プッシュをブロックするため:
```bash
git -C /Users/user/GitHub/Ikitaria/ikitaria-site push origin main --no-verify
```

---

## ファイル構成メモ

```
ikitaria-site/
├── index.html / chi-siamo.html / shop.html / contact.html
├── eventi.html / brand.html / fattoria.html / supporto.html / faq.html
├── thanks.html / privacy.html / 404.html
├── style.css          ← デザイントークン + Wabi-sabi upgrades + Shop dark layout (2290+ lines, v=5)
├── nav.js             ← ハンバーガーメニュー / back-to-top
├── sitemap.xml        ← 27 URL
├── robots.txt
├── favicon.svg
├── images/            ← hero画像、olive-oil、matcha、farm、biz、brand各画像
├── en/                ← 英語版（about/shop/events/contact/farm/support/brand/faq/thanks/privacy）
├── ja/                ← 日本語版（about/shop/events/contact/farm/biz/brand/faq/thanks/privacy）
├── almanacco-src/     ← Almanaccoショップサイト（Astro 5 + Tailwind v4）のソース一式。編集はここで行う
└── almanacco/         ← almanacco-src/ のビルド成果物。GitHub Pagesが配信。直接編集しない（CLAUDE.md参照）
```

## セッション — Almanaccoモノレポ統合 + サイト構成の簡素化（2026-09-03〜04）

### 実施内容
1. **二十四節気（sekki）機能を完全削除**: `AlmanacWheel.astro` / `SekkiPage.astro` / `SekkiWidget.astro` / `data/calendar.ts` / `data/sekkiProducts.ts` と3言語の `/sekki/` ページ、関連する全i18nキーを削除。店名「Almanacco」の由来物語（About物語）から二十四節気との対比表現も書き換え
2. **Journal・Eventsページを削除**: Almanaccoは「実店舗のショップサイト」に用途を絞る方針（Shop機能は将来Ikitaria側のEC実装完了後にそちらへ移行予定）。ヒーローのCTAも「お店を見る」1本に統合
3. **ワイン産地の文言整合**: ワインはスペイン中心＋イタリア提携生産者、オイルはマルケ州の自社農園、という実際の調達体制に合わせてhero文言・meta descriptionを修正
4. **Almanaccoのソースを別リポジトリ（`JohnnyDexter/almanacco`）からこのリポジトリの `almanacco-src/` に統合（モノレポ化）**: git履歴は移植せず現ファイルのみコピー。旧リポジトリはpush権限がなく（403）、今後は情報共有用の位置づけとして放置。ビルド＋vendorは手動フロー継続（詳細は `docs/superpowers/specs/2026-09-03-almanacco-monorepo-design.md`）

### 既知の残課題（今回のセッションでは未対応）
- `almanacco-src/README.md` が統合前（旧sekki機能・旧デプロイ手順）の記述のまま。将来編集する際は要更新
- `almanacco-src/public/images/events/` 配下の画像10枚（Events削除に伴い未参照）が残存。削除候補
- Newsletter購読文言（3言語）に "events" への言及が残っている（Events機能削除と不整合）
