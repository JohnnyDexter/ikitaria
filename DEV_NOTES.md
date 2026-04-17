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

## ⚠️ 未完了 / 要作業

### Formspree ID 設定（最重要）
フォーム送信が現在機能していない。Formspree でアカウント作成 → フォームID取得 → 以下の3ファイルの `YOUR_FORM_ID` を置き換える:
```
contact.html      → action="https://formspree.io/f/YOUR_FORM_ID"
en/contact.html   → action="https://formspree.io/f/YOUR_FORM_ID"
ja/contact.html   → action="https://formspree.io/f/YOUR_FORM_ID"
```

### プッシュ保留中（pre-push フック）
コミット `39a75ac` がローカルに存在するが未プッシュ。
Avisail プロジェクトの code-review フックが静的HTMLサイトの直接プッシュをブロック中。
以下で手動プッシュ可能:
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
├── style.css          ← デザイントークン + Wabi-sabi upgrades (1960+ lines)
├── nav.js             ← ハンバーガーメニュー / back-to-top
├── sitemap.xml        ← 27 URL
├── robots.txt
├── favicon.svg
├── images/            ← hero画像、olive-oil、matcha、farm、biz、brand各画像
├── en/                ← 英語版（about/shop/events/contact/farm/support/brand/faq/thanks/privacy）
└── ja/                ← 日本語版（about/shop/events/contact/farm/biz/brand/faq/thanks/privacy）
```
