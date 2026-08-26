# Almanacco統合 + ヘッダーナビ再設計 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ikitariaサイト(`ikitaria-site`)に実店舗ブランドAlmanaccoの全ページを `/almanacco/` として統合し、ヘッダーナビを `Home / Business(事業概要) / Shop▾(日本/イタリア準備中) / オンラインショップ / Contatti` に再設計する。

**Architecture:** `almanacco`リポジトリ(Astro)を1回だけビルドし、生成された静的HTML/CSS/JS (`dist/`) を `ikitaria-site/almanacco/` にそのままコピーして配置する(以後 `almanacco` リポジトリへの運用依存はなくなる)。`ikitaria-site` は現行同様ビルドレスの静的HTMLのままとし、既存の `shop.html`(事業ライン紹介)と `chi-siamo.html`(会社紹介)を統合した新規 `business.html` を作成、旧ページはリダイレクトスタブに置き換える。全ページ共通のヘッダー/フッターは、サイト全体に対する一括テキスト置換で更新する。

**Tech Stack:** 静的HTML/CSS/JS(ビルドシステムなし)、Astro 5(almanaccoリポジトリのビルド時のみ)、GitHub Pages。

## Global Constraints

- `ikitaria-site` はビルドシステムを持たない。HTML/CSS/JSを直接編集してコミット・pushする(既存運用と同一)。
- CSSバージョンは `style.css?v=31` が現行の統一バージョン。変更時は `v=32` に一括で引き上げる。
- 既存の言語構成: IT(ルート、既定言語) / EN(`en/`) / JA(`ja/`)。ファイル名は言語ごとに異なる場合がある(例: IT `chi-siamo.html` ↔ EN `about.html` ↔ JA `about.html`)。
- push時は `git -C /Users/user/GitHub/Ikitaria/ikitaria-site push origin main --no-verify` を使う(DEV_NOTES.mdに記載された既知の運用: Avisailのpre-pushフックが誤って本サイトをブロックするため)。
- 設計spec: `docs/superpowers/specs/2026-08-26-almanacco-integration-design.md`

---

### Task 1: Almanaccoリポジトリのビルド設定修正 + Ikitariaへの戻りリンク追加

**Files:**
- Modify (別リポジトリ `/Users/user/GitHub/Ikitaria/Almanacco`, remote `JohnnyDexter/almanacco`): `astro.config.mjs`
- Modify: `src/components/Header.astro`(または `Footer.astro`。実際にIkitariaへの戻りリンクを置くのに適した箇所を確認して追加する)

**Interfaces:**
- Produces: `dist/` ビルド成果物(Task 2で使用)

- [ ] **Step 1: astro.config.mjsのsiteフィールドを修正**

`/Users/user/GitHub/Ikitaria/Almanacco/astro.config.mjs` を開き、以下の1行を変更する:

変更前:
```js
export default defineConfig({
  site: "https://johnnydexter.github.io",
  base,
```

変更後:
```js
export default defineConfig({
  site: "https://ikitaria.com",
  base,
```

- [ ] **Step 2: Header.astroの構造を確認する**

Run: `sed -n '1,80p' src/components/Header.astro`

出力を見て、`</header>` 直前、もしくはロゴ/ナビの外側に1行追加できる箇所を特定する(既存のAstroコンポーネント構文・`lang`変数の扱いに合わせること)。

- [ ] **Step 3: Ikitariaへの戻りリンクを追加**

`Header.astro` の `</header>` 閉じタグの直前に、現在の `lang` 変数を使って以下のリンクを追加する(ロジックは他の言語分岐と同じ書き方に合わせる):

```astro
<a
  class="ikitaria-backlink"
  href={lang === "ja" ? "https://ikitaria.com/ja/" : lang === "it" ? "https://ikitaria.com/" : "https://ikitaria.com/en/"}
>
  ← Ikitaria
</a>
```

`src/styles/global.css` に以下を追記し、控えめな見た目にする:

```css
.ikitaria-backlink {
  font-size: 0.75rem;
  opacity: 0.6;
  text-decoration: none;
}
.ikitaria-backlink:hover {
  opacity: 1;
  text-decoration: underline;
}
```

- [ ] **Step 4: ビルドして目視確認**

Run:
```bash
cd /Users/user/GitHub/Ikitaria/Almanacco
npm run build
grep -o '← Ikitaria' dist/ja/index.html dist/it/index.html dist/en/index.html
grep -o 'https://ikitaria.com/[a-z/]*"' dist/ja/about/index.html dist/it/about/index.html dist/en/about/index.html
```
Expected: 各言語のトップページ・aboutページに `← Ikitaria` リンクが存在し、それぞれ `https://ikitaria.com/ja/`, `https://ikitaria.com/`, `https://ikitaria.com/en/` を指していること。

- [ ] **Step 5: コミット**

```bash
git add astro.config.mjs src/components/Header.astro src/styles/global.css
git commit -m "Point site URL to ikitaria.com and add back-link to Ikitaria"
```

---

### Task 2: Almanaccoビルド成果物を ikitaria-site/almanacco/ にベンダリング

**Files:**
- Create: `ikitaria-site/almanacco/`(Task 1で生成した `dist/` の中身を丸ごとコピー)

**Interfaces:**
- Consumes: Task 1で生成された `/Users/user/GitHub/Ikitaria/Almanacco/dist/`
- Produces: `ikitaria-site/almanacco/{it,en,ja}/{about,contact,events,journal,sekki,shop}/index.html` を含む静的ファイル一式。他タスクのナビからはこれらのパスへリンクする。

- [ ] **Step 1: distをコピー**

```bash
mkdir -p /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco
rm -rf /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco/*
cp -R /Users/user/GitHub/Ikitaria/Almanacco/dist/. /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco/
```

- [ ] **Step 2: 配置結果を確認**

Run: `find /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco -maxdepth 2 | sort`

Expected: `almanacco/it`, `almanacco/en`, `almanacco/ja`, `almanacco/_astro`, `almanacco/images`, `almanacco/index.html` などが存在すること。

- [ ] **Step 3: アセットパスが `/almanacco/...` になっていることを確認**

Run: `grep -o 'href="/almanacco[^"]*"\|src="/almanacco[^"]*"' /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco/ja/index.html | head -5`

Expected: `/almanacco/_astro/...` のような絶対パスが出力されること(Astroの`base`設定により既にこうなっているはず)。

- [ ] **Step 4: ローカルサーバーで実際に開いて確認**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site && python3 -m http.server 8000
```
ブラウザで `http://localhost:8000/almanacco/ja/about/` を開き、Almanaccoのデザイン・画像・「← Ikitaria」リンクが正しく表示されることを確認する。`http://localhost:8000/almanacco/ja/sekki/` でSVGホイールの前後ボタンが動作することも確認する。確認後 `Ctrl+C` でサーバーを止める。

- [ ] **Step 5: コミット(pushはまだしない。全タスク完了後に一括push)**

```bash
git -C /Users/user/GitHub/Ikitaria/ikitaria-site add almanacco/
git -C /Users/user/GitHub/Ikitaria/ikitaria-site commit -m "Vendor Almanacco static build under /almanacco/"
```

---

### Task 3: style.cssにナビドロップダウンの「準備中」表示スタイルを追加

**Files:**
- Modify: `style.css:290-292`

**Interfaces:**
- Consumes: 既存の `.nav-has-dropdown .nav-dropdown` CSS(`style.css:225-290`。デスクトップ/モバイル双方に対応済み、未使用)
- Produces: `.nav-dropdown-disabled` クラス(Task 5〜7のナビ実装で使用)

- [ ] **Step 1: 現状確認**

Run: `sed -n '285,293p' style.css`

Expected:
```css
.nav-has-dropdown .nav-dropdown ul li a.active {
  color: var(--text);
  font-weight: 600;
}

/* ── Language dropdown ────────────────────────────────────── */
```

- [ ] **Step 2: 新規CSSを追加**

`style.css` の287-291行目のブロック(`.nav-has-dropdown .nav-dropdown ul li a.active { ... }`)の直後、`/* ── Language dropdown ── */` コメントの直前に以下を追加する:

```css
.nav-has-dropdown .nav-dropdown ul li .nav-dropdown-disabled {
  display: block;
  padding: 0.5rem 1rem;
  color: var(--muted);
  opacity: 0.5;
  cursor: not-allowed;
  font-size: 0.92rem;
}
```

- [ ] **Step 3: 全HTMLファイルの style.css キャッシュバストを v=31 → v=32 に一括更新**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
grep -rl 'style\.css?v=31' --include="*.html" . | xargs perl -pi -e 's/style\.css\?v=31/style.css?v=32/g'
grep -rl 'style\.css?v=31' --include="*.html" . ; echo "exit code: $?"
```
Expected: 2つ目のコマンドは何も出力せず、`exit code: 1`(grepでヒットなし = 全置換完了)になること。

- [ ] **Step 4: コミット**

```bash
git add style.css $(git diff --name-only -- '*.html')
git commit -m "Add nav-dropdown disabled state CSS, bump style.css to v=32"
```

---

### Task 4: business.html(IT)を新規作成 — chi-siamo.html + shop.html の統合

**Files:**
- Create: `business.html`(`shop.html` をベースに `chi-siamo.html` の一部セクションを統合)
- Read only (参照元、変更しない): `chi-siamo.html`, `shop.html`

**Interfaces:**
- Produces: `business.html`(ナビラベル「Business」、アンカー `#produzione` `#brand` `#btob` を保持)

- [ ] **Step 1: shop.htmlをbusiness.htmlとしてコピー**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
cp shop.html business.html
```

- [ ] **Step 2: `<head>` のメタ情報を更新**

`business.html` 内の以下の値を置換する(Editツールで実施):

| 旧 | 新 |
|---|---|
| `<title>Shop \| Ikitaria</title>` | `<title>Business \| Ikitaria</title>` |
| `<meta name="description" content="Prodotti biologici, esperienze culturali e supporto commerciale internazionale — olio EVO, matcha, agriturismo e advisory Italia–Giappone." />` | `<meta name="description" content="Chi siamo, la nostra storia, e le nostre attività: olio EVO, matcha, eventi culturali, agriturismo e advisory Italia–Giappone." />` |
| `<link rel="alternate" hreflang="it" href="https://ikitaria.com/shop.html" />` | `<link rel="alternate" hreflang="it" href="https://ikitaria.com/business.html" />` |
| `<link rel="alternate" hreflang="en" href="https://ikitaria.com/en/shop.html" />` | `<link rel="alternate" hreflang="en" href="https://ikitaria.com/en/business.html" />` |
| `<link rel="alternate" hreflang="ja" href="https://ikitaria.com/ja/shop.html" />` | `<link rel="alternate" hreflang="ja" href="https://ikitaria.com/ja/business.html" />` |
| `<link rel="alternate" hreflang="x-default" href="https://ikitaria.com/shop.html" />` | `<link rel="alternate" hreflang="x-default" href="https://ikitaria.com/business.html" />` |
| `<link rel="canonical" href="https://ikitaria.com/shop.html" />` | `<link rel="canonical" href="https://ikitaria.com/business.html" />` |
| `<meta property="og:title" content="Shop \| Ikitaria" />` | `<meta property="og:title" content="Business \| Ikitaria" />` |
| `<meta property="og:description" content="Prodotti biologici, esperienze culturali e supporto commerciale internazionale — olio EVO, matcha, agriturismo e advisory Italia–Giappone." />` | `<meta property="og:description" content="Chi siamo, la nostra storia, e le nostre attività: olio EVO, matcha, eventi culturali, agriturismo e advisory Italia–Giappone." />` |
| `<meta property="og:url" content="https://ikitaria.com/shop.html" />` | `<meta property="og:url" content="https://ikitaria.com/business.html" />` |
| `<meta property="og:image" content="https://ikitaria.com/images/olive-oil.jpg" />` | `<meta property="og:image" content="https://ikitaria.com/images/biz-hero.jpeg" />` |
| `<meta name="twitter:title" content="Shop \| Ikitaria" />` | `<meta name="twitter:title" content="Business \| Ikitaria" />` |
| `<meta name="twitter:description" content="Prodotti biologici, esperienze culturali e supporto commerciale internazionale — olio EVO, matcha, agriturismo e advisory Italia–Giappone." />` | `<meta name="twitter:description" content="Chi siamo, la nostra storia, e le nostre attività: olio EVO, matcha, eventi culturali, agriturismo e advisory Italia–Giappone." />` |
| `<meta name="twitter:image" content="https://ikitaria.com/images/olive-oil.jpg" />` | `<meta name="twitter:image" content="https://ikitaria.com/images/biz-hero.jpeg" />` |

- [ ] **Step 3: ヘッダーとフッターを新ナビ構成に置換**

`business.html` 内の以下のヘッダーnav部分:

```html
<nav class="main-nav" aria-label="Navigazione principale"><ul><li><a href="index.html">Home</a></li><li><a href="chi-siamo.html">Chi Siamo</a></li><li><a href="shop.html" class="active" aria-current="page">Shop</a></li><li><a href="contact.html">Contatti</a></li></ul></nav>
```

を以下に置換する:

```html
<nav class="main-nav" aria-label="Navigazione principale"><ul><li><a href="index.html">Home</a></li><li><a href="business.html" class="active" aria-current="page">Business</a></li><li class="nav-has-dropdown"><details class="nav-dropdown"><summary>Shop</summary><ul><li><a href="almanacco/it/about/">Giappone</a></li><li><span class="nav-dropdown-disabled" aria-disabled="true">Italia (in arrivo)</span></li></ul></details></li><li><a href="almanacco/it/shop/">Shop Online</a></li><li><a href="contact.html">Contatti</a></li></ul></nav>
```

`business.html` 内の言語ドロップダウン:

```html
<details class="lang-dropdown" aria-label="Selettore lingua"><summary>IT</summary><ul><li><a href="shop.html" class="active">IT</a></li><li><a href="en/shop.html">EN</a></li><li><a href="ja/shop.html">JP</a></li></ul></details>
```

を以下に置換する:

```html
<details class="lang-dropdown" aria-label="Selettore lingua"><summary>IT</summary><ul><li><a href="business.html" class="active">IT</a></li><li><a href="en/business.html">EN</a></li><li><a href="ja/business.html">JP</a></li></ul></details>
```

`business.html` 内のフッター:

```html
<nav class="footer-links" aria-label="Footer navigation"><p><a href="chi-siamo.html">Chi Siamo</a></p><p><a href="shop.html">Shop</a></p><p><a href="eventi.html">Eventi</a></p></nav>
```

を以下に置換する(Chi SiamoとShopは同一ページになるため1項目に統合):

```html
<nav class="footer-links" aria-label="Footer navigation"><p><a href="business.html">Business</a></p><p><a href="eventi.html">Eventi</a></p></nav>
```

- [ ] **Step 4: shop.html由来の内部見出しをh1からh2へ降格**

`business.html` 内:
```html
<h1 class="shop-ov-title">Shop</h1>
```
を以下に置換:
```html
<h2 class="shop-ov-title">Le Nostre Attività</h2>
```

- [ ] **Step 5: chi-siamo.htmlの「ページヘッダー+起源ストーリー」セクションを先頭に挿入**

`business.html` 内の `<main id="contenuto">` 直後、`<nav class="shop-sidebar"` の直前に以下を挿入する(chi-siamo.htmlの該当セクションを流用。`h1`のテキストのみ変更):

```html
      <section class="page-header">
        <div class="container">
          <h1>Chi Siamo &amp; Business</h1>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="eyebrow">LA NOSTRA STORIA</p>
          <h2>La Nostra Origine</h2>
          <p class="section-intro">
            Ikitaria nasce dall'incontro tra Giovanni Frattari e Ikuya Odaka, due percorsi
            professionali diversi ma complementari. Dalla relazione tra esperienza italiana e
            sensibilità giapponese prende forma una struttura di advisory orientata a risultati
            concreti, fondata su precisione culturale e visione strategica.
          </p>
        </div>
      </section>

```

- [ ] **Step 6: chi-siamo.htmlの「I Fondatori」「Principi Operativi」セクションを末尾(`</main>`直前)に追加**

`business.html` 内の `</main>` 直前に以下を追加する:

```html
      <section class="section dark-section">
        <div class="container">
          <p class="eyebrow">IL TEAM</p>
          <h2>I Fondatori</h2>
          <div class="two-columns">
            <article class="column">
              <h3>Giovanni Frattari</h3>
              <p>Guida lo sviluppo dei progetti lato Italia. Con esperienza nella gestione di relazioni B2B internazionali e nella definizione di strategie di posizionamento, coordina l'operatività del team italiano, le traiettorie di sviluppo commerciale e i processi di ingresso su mercati esteri.</p>
            </article>
            <article class="column">
              <h3>Ikuya Odaka</h3>
              <p>Coordina il presidio strategico e culturale lato Giappone. La sua conoscenza approfondita del mercato giapponese — reti di contatto, dinamiche relazionali, codici culturali impliciti — garantisce l'aderenza al contesto locale e la qualità delle introduzioni professionali.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="eyebrow">METODO</p>
          <h2>Principi Operativi</h2>
          <div class="two-columns">
            <article class="column">
              <h4>Coerenza tra Identità e Mercato</h4>
              <p>Ogni progetto è strutturato perché l'identità del cliente rimanga autentica nel nuovo contesto culturale, senza forzature né semplificazioni.</p>
            </article>
            <article class="column">
              <h4>Centralità della Relazione</h4>
              <p>Il valore duraturo nasce dalla qualità dei legami professionali, non dalla velocità delle transazioni. Ogni introduzione è ponderata.</p>
            </article>
            <article class="column">
              <h4>Precisione Culturale</h4>
              <p>Comprendiamo i codici impliciti di entrambi i mercati: la comunicazione, il ritmo decisionale, le aspettative non dette.</p>
            </article>
            <article class="column">
              <h4>Visione di Lungo Periodo</h4>
              <p>Lavoriamo con un orizzonte temporale ampio. Il nostro obiettivo è costruire strutture solide, non solo eseguire incarichi puntuali.</p>
            </article>
          </div>
        </div>
      </section>
```

- [ ] **Step 7: 確認**

Run: `grep -c '<h1' business.html`
Expected: `1`(h1が1つだけになっていること)

Run: `python3 -c "import re; s=open('business.html').read(); print('OK' if s.count('<section')==s.count('</section>') else 'MISMATCH')"`
Expected: `OK`(タグの開閉が一致していること)

- [ ] **Step 8: コミット**

```bash
git add business.html
git commit -m "Add business.html merging shop.html and chi-siamo.html content"
```

---

### Task 5: en/business.html, ja/business.html を新規作成

**Files:**
- Create: `en/business.html`(`en/shop.html` + `en/about.html` の統合)
- Create: `ja/business.html`(`ja/shop.html` + `ja/about.html` の統合)

**Interfaces:**
- Consumes: Task 4と同じ手順パターン
- Produces: `en/business.html`, `ja/business.html`

- [ ] **Step 1: en/shop.htmlをen/business.htmlとしてコピー**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
cp en/shop.html en/business.html
```

- [ ] **Step 2: en/business.htmlの`<head>`を更新**(Task 4 Step 2と同じ要領で以下の対応表に従う)

| 旧 | 新 |
|---|---|
| `Shop \| Ikitaria`(title/og:title/twitter:title) | `Business \| Ikitaria` |
| `en/shop.html`(hreflang/canonical/og:url内) | `en/business.html` |
| `images/olive-oil.jpg`(og:image/twitter:image) | `images/biz-hero.jpeg` |
| meta description(現行のenglish shop descriptionを確認し、"About us and what we do" 系の文言に変更) | `Who we are and what we do: organic olive oil, matcha, cultural experiences, farm stays, and Italy–Japan business advisory.` |

- [ ] **Step 3: en/business.htmlのヘッダー/フッター/lang-dropdownを更新**

ヘッダーnav置換後:
```html
<nav class="main-nav" aria-label="Main navigation"><ul><li><a href="index.html">Home</a></li><li><a href="business.html" class="active" aria-current="page">Business</a></li><li class="nav-has-dropdown"><details class="nav-dropdown"><summary>Shop</summary><ul><li><a href="../almanacco/en/about/">Japan</a></li><li><span class="nav-dropdown-disabled" aria-disabled="true">Italy (coming soon)</span></li></ul></details></li><li><a href="../almanacco/en/shop/">Online Shop</a></li><li><a href="contact.html">Contact</a></li></ul></nav>
```

lang-dropdown置換後:
```html
<details class="lang-dropdown" aria-label="Language switcher"><summary>EN</summary><ul><li><a href="../business.html">IT</a></li><li><a href="business.html" class="active">EN</a></li><li><a href="../ja/business.html">JP</a></li></ul></details>
```

フッター置換後:
```html
<nav class="footer-links" aria-label="Footer navigation"><p><a href="business.html">Business</a></p><p><a href="events.html">Events</a></p></nav>
```

- [ ] **Step 4: en/business.htmlの内部h1を降格**

```html
<h1 class="shop-ov-title">Shop</h1>
```
→
```html
<h2 class="shop-ov-title">Our Business Activities</h2>
```

- [ ] **Step 5: en/about.htmlの該当セクションをen/business.htmlに統合**

`<main id="content">` の直後、`<nav class="shop-sidebar"` の直前に以下を挿入:

```html
<section class="page-header"><div class="container"><h1>About &amp; Business</h1></div></section><section class="section"><div class="container"><p class="eyebrow">OUR STORY</p><h2>Our Origin</h2><p class="section-intro">Ikitaria began with the meeting of Giovanni Frattari and Ikuya Odaka—two distinct professional journeys with complementary strengths. Their collaboration shaped a boutique advisory model built on cultural precision, strategic thinking, and practical execution.</p></div></section>
```

`</main>` の直前に以下を追加:

```html
<section class="section dark-section"><div class="container"><p class="eyebrow">THE TEAM</p><h2>Founders</h2><div class="two-columns"><article class="column"><h3>Giovanni Frattari</h3><p>Leads project development on the Italian side. With experience in international B2B relationship management and market positioning, he coordinates the Italian team's operations and commercial development trajectories, including market entry processes for foreign markets.</p></article><article class="column"><h3>Ikuya Odaka</h3><p>Leads strategic and cultural alignment on the Japanese side. His in-depth knowledge of the Japanese market — contact networks, relational dynamics, and implicit cultural codes — ensures contextual accuracy and the quality of every professional introduction.</p></article></div></div></section><section class="section"><div class="container"><p class="eyebrow">APPROACH</p><h2>Operating Principles</h2><div class="two-columns"><article class="column"><h4>Identity &amp; Market Consistency</h4><p>Every project is structured so the client's identity remains authentic in the new cultural context — without distortion or over-simplification.</p></article><article class="column"><h4>Relationship-Centred Approach</h4><p>Lasting value comes from the quality of professional bonds, not the speed of transactions. Every introduction is deliberate.</p></article><article class="column"><h4>Cultural Precision</h4><p>We understand the implicit codes of both markets: communication styles, decision-making rhythms, unspoken expectations.</p></article><article class="column"><h4>Long-Term Vision</h4><p>We work with a broad time horizon. Our goal is to build solid structures, not just execute one-off assignments.</p></article></div></div></section>
```

- [ ] **Step 6: ja/shop.htmlをja/business.htmlとしてコピーし、同様の手順を適用**

```bash
cp ja/shop.html ja/business.html
```

`<head>`更新は英語版と同じ対応表のJA版(title: `事業概要 | Ikitaria`、description: `私たちについて、そして事業内容:オリーブオイル、抹茶、文化イベント、アグリツーリズム、イタリア・日本間のビジネスアドバイザリー。`、og:image/twitter:image: `images/biz-hero.jpeg`)を適用する。

ヘッダーnav置換後:
```html
<nav class="main-nav" aria-label="メインナビゲーション"><ul><li><a href="index.html">ホーム</a></li><li><a href="business.html" class="active" aria-current="page">事業概要</a></li><li class="nav-has-dropdown"><details class="nav-dropdown"><summary>ショップ</summary><ul><li><a href="../almanacco/ja/about/">日本</a></li><li><span class="nav-dropdown-disabled" aria-disabled="true">イタリア(準備中)</span></li></ul></details></li><li><a href="../almanacco/ja/shop/">オンラインショップ</a></li><li><a href="contact.html">お問い合わせ</a></li></ul></nav>
```

lang-dropdown置換後:
```html
<details class="lang-dropdown" aria-label="言語選択"><summary>JP</summary><ul><li><a href="../business.html">IT</a></li><li><a href="../en/business.html">EN</a></li><li><a href="business.html" class="active">JP</a></li></ul></details>
```

フッター置換後:
```html
<nav class="footer-links" aria-label="フッターナビゲーション"><p><a href="business.html">事業概要</a></p><p><a href="events.html">イベント</a></p></nav>
```

内部h1降格:
```html
<h1 class="shop-ov-title">ショップ</h1>
```
→
```html
<h2 class="shop-ov-title">事業内容</h2>
```

`<main id="content">` 直後、`<nav class="shop-sidebar"` 直前に挿入:
```html
<section class="page-header"><div class="container"><h1>私たちについて・事業概要</h1></div></section><section class="section"><div class="container"><p class="eyebrow">私たちのストーリー</p><h2>私たちの起源</h2><p class="section-intro">IkitariaはGiovanni FrattariとIkuya Odakaの出会いから生まれました。それぞれ異なるキャリアを歩んできた二人の補完的な強みが、文化的精度・戦略的思考・実践的な実行力を備えたブティックアドバイザリーモデルを形成しました。</p></div></section>
```

`</main>` 直前に追加:
```html
<section class="section dark-section"><div class="container"><p class="eyebrow">チーム</p><h2>創業者</h2><div class="two-columns"><article class="column"><h3>Giovanni Frattari</h3><p>イタリア側のプロジェクト開発を主導。国際B2B関係管理とポジショニング戦略の経験を持ち、イタリアチームの業務運営と事業開発の方向性を調整。海外市場への参入プロセスも担当。</p></article><article class="column"><h3>Ikuya Odaka</h3><p>日本側の戦略・文化的連携を主導。日本市場への深い理解(ネットワーク、関係性のダイナミクス、暗黙の文化的コード)を活かし、現地コンテキストへの適合と専門的な紹介の質を確保。</p></article></div></div></section><section class="section"><div class="container"><p class="eyebrow">アプローチ</p><h2>運営理念</h2><div class="two-columns"><article class="column"><h4>アイデンティティと市場の一貫性</h4><p>クライアントのアイデンティティが新しい文化的文脈においても歪曲されず、真正性を保つようプロジェクトを設計します。</p></article><article class="column"><h4>リレーションシップ中心のアプローチ</h4><p>長期的な価値は取引の速度ではなく、専門的な絆の質から生まれます。すべての紹介は慎重に行います。</p></article><article class="column"><h4>文化的精度</h4><p>両市場の暗黙のコードを理解しています。コミュニケーションスタイル、意思決定のリズム、語られない期待値。</p></article><article class="column"><h4>長期的なビジョン</h4><p>広い時間軸で取り組んでいます。私たちの目標はスポット的な業務ではなく、確固たる構造を構築することです。</p></article></div></div></section>
```

- [ ] **Step 7: 確認**

```bash
grep -c '<h1' en/business.html ja/business.html
```
Expected: 両方とも `1`

```bash
python3 -c "
for f in ['en/business.html','ja/business.html']:
    s=open(f).read()
    print(f, 'OK' if s.count('<section')==s.count('</section>') else 'MISMATCH')
"
```
Expected: 両方 `OK`

- [ ] **Step 8: コミット**

```bash
git add en/business.html ja/business.html
git commit -m "Add en/business.html and ja/business.html"
```

---

### Task 6: 旧ページをリダイレクトスタブに置換

**Files:**
- Modify: `shop.html`, `chi-siamo.html`, `en/shop.html`, `en/about.html`, `ja/shop.html`, `ja/about.html`
- Modify: `about.html`(リダイレクト先を `chi-siamo.html` → `business.html` に更新)

**Interfaces:**
- Consumes: Task 4・5で作成した `business.html` / `en/business.html` / `ja/business.html`

- [ ] **Step 1: 既存の about.html リダイレクトパターンを踏襲して6ファイルを上書き**

`shop.html`:
```html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=business.html" />
    <title>Redirect | Ikitaria</title>
  </head>
  <body>
    <p>Redirecting to <a href="business.html">Business</a>...</p>
    <script src="nav.js" defer></script>
</body>
</html>
```

`chi-siamo.html`: 上と同一内容(`shop.html`と全く同じファイルにする)

`en/shop.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=business.html" />
    <title>Redirect | Ikitaria</title>
  </head>
  <body>
    <p>Redirecting to <a href="business.html">Business</a>...</p>
    <script src="../nav.js" defer></script>
</body>
</html>
```

`en/about.html`: 上と同一内容

`ja/shop.html`:
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=business.html" />
    <title>Redirect | Ikitaria</title>
  </head>
  <body>
    <p>Redirecting to <a href="business.html">Business</a>...</p>
    <script src="../nav.js" defer></script>
</body>
</html>
```

`ja/about.html`: 上と同一内容

- [ ] **Step 2: about.html(ルート)のリダイレクト先を修正**

`about.html` 内:
```html
<meta http-equiv="refresh" content="0; url=chi-siamo.html" />
```
→
```html
<meta http-equiv="refresh" content="0; url=business.html" />
```
および
```html
<p>Redirecting to <a href="chi-siamo.html">Chi Siamo</a>...</p>
```
→
```html
<p>Redirecting to <a href="business.html">Business</a>...</p>
```

- [ ] **Step 3: 確認**

```bash
for f in shop.html chi-siamo.html en/shop.html en/about.html ja/shop.html ja/about.html about.html; do
  echo "--- $f ---"; grep 'http-equiv="refresh"' "$f"
done
```
Expected: 全ファイルが対応する `business.html` を指すリダイレクトになっていること。

- [ ] **Step 4: コミット**

```bash
git add shop.html chi-siamo.html en/shop.html en/about.html ja/shop.html ja/about.html about.html
git commit -m "Replace old shop/chi-siamo/about pages with redirects to business.html"
```

---

### Task 7: IT側 残り全ページのヘッダー/フッターを一括更新

**Files:**
- Modify: `brand.html`, `contact.html`, `eventi.html`, `faq.html`, `fattoria.html`, `privacy.html`, `supporto.html`, `thanks.html`(コンパクト形式・一括sed)
- Modify: `index.html`(整形済み形式・個別編集)
- Modify: `404.html`(nav有無を確認のうえ必要なら追加対応)

**Interfaces:**
- Consumes: Task 6で作成した `business.html`

- [ ] **Step 1: コンパクト形式8ファイルのヘッダーnavを一括置換**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
OLD='<li><a href="chi-siamo.html">Chi Siamo</a></li><li><a href="shop.html">Shop</a></li>'
NEW='<li><a href="business.html">Business</a></li><li class="nav-has-dropdown"><details class="nav-dropdown"><summary>Shop</summary><ul><li><a href="almanacco/it/about/">Giappone</a></li><li><span class="nav-dropdown-disabled" aria-disabled="true">Italia (in arrivo)</span></li></ul></details></li><li><a href="almanacco/it/shop/">Shop Online</a></li>'
for f in brand.html contact.html eventi.html faq.html fattoria.html privacy.html supporto.html thanks.html; do
  perl -pi -e "s/\Q$OLD\E/$NEW/g" "$f"
done
```

- [ ] **Step 2: 同8ファイルのフッターnavを一括置換**

```bash
OLD_F='<p><a href="chi-siamo.html">Chi Siamo</a></p><p><a href="shop.html">Shop</a></p><p><a href="eventi.html">Eventi</a></p>'
NEW_F='<p><a href="business.html">Business</a></p><p><a href="eventi.html">Eventi</a></p>'
for f in brand.html contact.html eventi.html faq.html fattoria.html privacy.html supporto.html thanks.html; do
  perl -pi -e "s/\Q$OLD_F\E/$NEW_F/g" "$f"
done
```

- [ ] **Step 3: 一括置換の結果を検証**

```bash
grep -l 'href="chi-siamo.html"\|href="shop.html"' brand.html contact.html eventi.html faq.html fattoria.html privacy.html supporto.html thanks.html
echo "exit code: $?"
```
Expected: 出力なし、`exit code: 1`(旧リンクが1件も残っていないこと)

- [ ] **Step 4: index.html(整形済み形式)を個別に編集**

`index.html` 内のヘッダーnav:
```html
            <ul>
              <li><a href="index.html" class="active" aria-current="page">Home</a></li>
              <li><a href="chi-siamo.html">Chi Siamo</a></li>
              <li><a href="shop.html">Shop</a></li>
              <li><a href="contact.html">Contatti</a></li>
            </ul>
```
を以下に置換:
```html
            <ul>
              <li><a href="index.html" class="active" aria-current="page">Home</a></li>
              <li><a href="business.html">Business</a></li>
              <li class="nav-has-dropdown">
                <details class="nav-dropdown">
                  <summary>Shop</summary>
                  <ul>
                    <li><a href="almanacco/it/about/">Giappone</a></li>
                    <li><span class="nav-dropdown-disabled" aria-disabled="true">Italia (in arrivo)</span></li>
                  </ul>
                </details>
              </li>
              <li><a href="almanacco/it/shop/">Shop Online</a></li>
              <li><a href="contact.html">Contatti</a></li>
            </ul>
```

`index.html` 内のフッターnav:
```html
        <nav class="footer-links" aria-label="Footer navigation">
          <p><a href="chi-siamo.html">Chi Siamo</a></p>
          <p><a href="shop.html">Shop</a></p>
          <p><a href="eventi.html">Eventi</a></p>
        </nav>
```
を以下に置換:
```html
        <nav class="footer-links" aria-label="Footer navigation">
          <p><a href="business.html">Business</a></p>
          <p><a href="eventi.html">Eventi</a></p>
        </nav>
```

`index.html` 内のホームページ事業紹介カード3件のリンク先をbusiness.htmlに更新:
```html
<a class="column area-card" href="shop.html#produzione">
```
→
```html
<a class="column area-card" href="business.html#produzione">
```
同様に `href="shop.html#brand"` → `href="business.html#brand"`、`href="shop.html#btob"` → `href="business.html#btob"` も置換する。

- [ ] **Step 5: 404.htmlのnav有無を確認し、あれば同様に更新**

```bash
grep -n 'chi-siamo.html\|shop.html' 404.html
```
何かヒットした場合は、Step 1〜2と同じ置換パターンを404.htmlにも手動で適用する。ヒットしなければこのステップは完了。

- [ ] **Step 6: サイト全体でIT側の旧リンク残存がないか最終確認**

```bash
grep -rln 'href="chi-siamo\.html"\|href="shop\.html"' --include="*.html" . | grep -v '^\./en/\|^\./ja/'
echo "exit code: $?"
```
Expected: 出力なし、`exit code: 1`

- [ ] **Step 7: コミット**

```bash
git add brand.html contact.html eventi.html faq.html fattoria.html privacy.html supporto.html thanks.html index.html 404.html
git commit -m "Update IT header/footer nav to Business/Shop-dropdown/Online-Shop structure"
```

---

### Task 8: EN側 残り全ページのヘッダー/フッターを一括更新

**Files:**
- Modify: `en/brand.html`, `en/contact.html`, `en/events.html`, `en/faq.html`, `en/farm.html`, `en/index.html`, `en/privacy.html`, `en/support.html`, `en/thanks.html`

**Interfaces:**
- Consumes: Task 5で作成した `en/business.html`

- [ ] **Step 1: ヘッダーnavを一括置換**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site/en
OLD='<li><a href="about.html">About</a></li><li><a href="shop.html">Shop</a></li>'
NEW='<li><a href="business.html">Business</a></li><li class="nav-has-dropdown"><details class="nav-dropdown"><summary>Shop</summary><ul><li><a href="../almanacco/en/about/">Japan</a></li><li><span class="nav-dropdown-disabled" aria-disabled="true">Italy (coming soon)</span></li></ul></details></li><li><a href="../almanacco/en/shop/">Online Shop</a></li>'
for f in brand.html contact.html events.html faq.html farm.html index.html privacy.html support.html thanks.html; do
  perl -pi -e "s/\Q$OLD\E/$NEW/g" "$f"
done
```

- [ ] **Step 2: フッターnavを一括置換**

```bash
OLD_F='<p><a href="about.html">About</a></p><p><a href="shop.html">Shop</a></p><p><a href="events.html">Events</a></p>'
NEW_F='<p><a href="business.html">Business</a></p><p><a href="events.html">Events</a></p>'
for f in brand.html contact.html events.html faq.html farm.html index.html privacy.html support.html thanks.html; do
  perl -pi -e "s/\Q$OLD_F\E/$NEW_F/g" "$f"
done
```

- [ ] **Step 3: 検証**

```bash
grep -l 'href="about.html"\|href="shop.html"' brand.html contact.html events.html faq.html farm.html index.html privacy.html support.html thanks.html
echo "exit code: $?"
```
Expected: 出力なし、`exit code: 1`

- [ ] **Step 4: コミット**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git add en/brand.html en/contact.html en/events.html en/faq.html en/farm.html en/index.html en/privacy.html en/support.html en/thanks.html
git commit -m "Update EN header/footer nav to Business/Shop-dropdown/Online-Shop structure"
```

---

### Task 9: JA側 残り全ページのヘッダー/フッターを一括更新

**Files:**
- Modify: `ja/biz.html`, `ja/brand.html`, `ja/contact.html`, `ja/events.html`, `ja/faq.html`, `ja/farm.html`, `ja/index.html`, `ja/privacy.html`, `ja/thanks.html`

**Interfaces:**
- Consumes: Task 5で作成した `ja/business.html`

- [ ] **Step 1: ヘッダーnavを一括置換**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site/ja
OLD='<li><a href="about.html">私たちについて</a></li><li><a href="shop.html">ショップ</a></li>'
NEW='<li><a href="business.html">事業概要</a></li><li class="nav-has-dropdown"><details class="nav-dropdown"><summary>ショップ</summary><ul><li><a href="../almanacco/ja/about/">日本</a></li><li><span class="nav-dropdown-disabled" aria-disabled="true">イタリア(準備中)</span></li></ul></details></li><li><a href="../almanacco/ja/shop/">オンラインショップ</a></li>'
for f in biz.html brand.html contact.html events.html faq.html farm.html index.html privacy.html thanks.html; do
  perl -pi -e "s/\Q$OLD\E/$NEW/g" "$f"
done
```

- [ ] **Step 2: フッターnavを一括置換**

```bash
OLD_F='<p><a href="about.html">私たちについて</a></p><p><a href="shop.html">ショップ</a></p><p><a href="events.html">イベント</a></p>'
NEW_F='<p><a href="business.html">事業概要</a></p><p><a href="events.html">イベント</a></p>'
for f in biz.html brand.html contact.html events.html faq.html farm.html index.html privacy.html thanks.html; do
  perl -pi -e "s/\Q$OLD_F\E/$NEW_F/g" "$f"
done
```

- [ ] **Step 3: 検証**

```bash
grep -l 'href="about.html"\|href="shop.html"' biz.html brand.html contact.html events.html faq.html farm.html index.html privacy.html thanks.html
echo "exit code: $?"
```
Expected: 出力なし、`exit code: 1`

- [ ] **Step 4: コミット**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git add ja/biz.html ja/brand.html ja/contact.html ja/events.html ja/faq.html ja/farm.html ja/index.html ja/privacy.html ja/thanks.html
git commit -m "Update JA header/footer nav to 事業概要/ショップドロップダウン/オンラインショップ structure"
```

---

### Task 10: sitemap.xml を更新

**Files:**
- Modify: `sitemap.xml:14-29`

**Interfaces:**
- Consumes: Task 4・5で作成した `business.html` / `en/business.html` / `ja/business.html`

- [ ] **Step 1: 2つの `<url>` ブロックを1つに統合**

`sitemap.xml` 内の以下:
```xml
  <url>
    <loc>https://ikitaria.com/chi-siamo.html</loc>
    <xhtml:link rel="alternate" hreflang="it" href="https://ikitaria.com/chi-siamo.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://ikitaria.com/en/about.html"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://ikitaria.com/ja/about.html"/>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ikitaria.com/shop.html</loc>
    <xhtml:link rel="alternate" hreflang="it" href="https://ikitaria.com/shop.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://ikitaria.com/en/shop.html"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://ikitaria.com/ja/shop.html"/>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
```
を以下に置換:
```xml
  <url>
    <loc>https://ikitaria.com/business.html</loc>
    <xhtml:link rel="alternate" hreflang="it" href="https://ikitaria.com/business.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://ikitaria.com/en/business.html"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://ikitaria.com/ja/business.html"/>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
```

- [ ] **Step 2: 他の2箇所(85-89行目付近、123-127行目付近)の `en/about.html` `en/shop.html` `ja/about.html` `ja/shop.html` の `<loc>` エントリも確認し、重複していれば削除する**

```bash
grep -n 'about\.html\|shop\.html' sitemap.xml
```
出力された `<url>` ブロックのうち、`en/about.html` `en/shop.html` `ja/about.html` `ja/shop.html` を `<loc>` に持つブロックがあれば、Step 1で統合したブロックと重複するため削除する(各langのURLはStep 1の `<xhtml:link>` alternateとしてのみ存在させる)。

- [ ] **Step 3: 検証**

```bash
grep -c 'chi-siamo\.html\|/shop\.html\|/about\.html' sitemap.xml
echo "exit code: $?"
```
Expected: `0`(一致なし)

```bash
python3 -c "import xml.dom.minidom as m; m.parse('sitemap.xml'); print('valid XML')"
```
Expected: `valid XML`

- [ ] **Step 4: コミット**

```bash
git add sitemap.xml
git commit -m "Update sitemap.xml to reference business.html instead of chi-siamo/shop/about"
```

---

### Task 11: エンドツーエンド検証

**Files:** なし(検証のみ)

- [ ] **Step 1: ローカルサーバーを起動**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
python3 -m http.server 8000
```

- [ ] **Step 2: リンク切れの機械チェック**

新しいターミナルで:
```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
for f in $(find . -name "*.html" -not -path "./almanacco/*"); do
  for href in $(grep -o 'href="[^"#:]*\.html[^"]*"' "$f" | sed -E 's/href="([^"#]*)\.html.*/\1.html/'); do
    dir=$(dirname "$f")
    target="$dir/$href"
    if [ ! -f "$target" ]; then
      echo "BROKEN in $f: $href (resolved: $target)"
    fi
  done
done
```
Expected: 出力なし(リンク切れゼロ)。何か出力された場合は該当ファイルを修正する。

- [ ] **Step 3: 設計spec 4節のチェックリストをブラウザで目視確認**

`http://localhost:8000/` を開き、以下を確認する:
- [ ] Home / Business / Shop▾(Giappone / Italia in arrivo) / Shop Online / Contatti の並びが表示される
- [ ] 「Shop」をクリックするとドロップダウンが開き、「Giappone」はクリック可能、「Italia (in arrivo)」はグレー表示でクリック不可
- [ ] 「Giappone」→ `http://localhost:8000/almanacco/it/about/` に遷移し、Almanaccoのデザインが正しく表示される
- [ ] 「Shop Online」→ `http://localhost:8000/almanacco/it/shop/` に遷移する
- [ ] `business.html` にChi Siamoの起源ストーリー・founders・原則と、旧shopの8事業ラインが両方含まれ、リンク切れがない
- [ ] `chi-siamo.html` にアクセスすると即座に `business.html` にリダイレクトされる
- [ ] `en/index.html`, `ja/index.html` でも同様にHeader/Footer/Shopドロップダウンが正しい言語・正しいリンク先で表示される
- [ ] `http://localhost:8000/almanacco/ja/sekki/` でSVGホイールの前後ボタンが動作する
- [ ] Almanaccoの各ページ下部/ヘッダーに「← Ikitaria」リンクがあり、クリックすると対応言語のIkitariaページに戻る
- [ ] `http://localhost:8000/almanacco/en/events/` など、21ページ全てが404にならず表示される(サンプリングでよい)

- [ ] **Step 4: サーバーを停止**

```
Ctrl+C
```

- [ ] **Step 5: DEV_NOTES.mdに今回のセッション記録を追記**

`DEV_NOTES.md` の末尾(155行目あたり、「## ⚠️ 未完了 / 要作業」の直前)に新規セッションセクションを追記する:

```markdown
## セッション 6 — Almanacco統合 + ヘッダーナビ再設計
**変更: style.css?v=31 → v=32**

### 実施内容
- ヘッダーナビを `Home | Chi Siamo | Shop | Contatti` → `Home | Business | Shop(dropdown: Giappone/Italia in arrivo) | Shop Online | Contatti` に再設計
- `chi-siamo.html` + `shop.html` を統合した `business.html`(IT/EN/JA)を新規作成、旧ページはリダイレクトスタブに変更
- `JohnnyDexter/almanacco`(Astro製の実店舗Almanaccoサイト)のビルド成果物を `/almanacco/` にベンダリングして配置。以後Almanaccoリポジトリへの運用依存なし(更新時のみ再ビルド・再配置)
- `style.css` に `.nav-dropdown-disabled` を追加(既存の未使用だった `.nav-has-dropdown`/`.nav-dropdown` CSSを実装に使用)
- `sitemap.xml` の chi-siamo/shop/about エントリを business.html に統合

---
```

- [ ] **Step 6: 全体をpush**

```bash
git -C /Users/user/GitHub/Ikitaria/ikitaria-site add DEV_NOTES.md
git -C /Users/user/GitHub/Ikitaria/ikitaria-site commit -m "Update DEV_NOTES.md with Almanacco integration session"
git -C /Users/user/GitHub/Ikitaria/ikitaria-site push origin main --no-verify
git -C /Users/user/GitHub/Ikitaria/Almanacco push origin main
```

- [ ] **Step 7: 本番URLで最終確認**

pushから数分待ち、以下を確認する:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ikitaria.com/business.html
curl -s -o /dev/null -w "%{http_code}\n" https://ikitaria.com/almanacco/ja/about/
curl -s -o /dev/null -w "%{http_code}\n" https://ikitaria.com/chi-siamo.html
```
Expected: 1つ目・2つ目は `200`。3つ目はリダイレクトのため `200`(meta refreshはHTTPステータス自体は200を返す仕様のため、実際のリダイレクト確認はブラウザで行う)。
