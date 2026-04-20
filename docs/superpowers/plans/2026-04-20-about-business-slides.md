# About ページ 事業横スナップ統合 — 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `chi-siamo.html` / `en/about.html` / `ja/about.html` の末尾に GSAP 横スナップセクションを追加し、Brand / Production / Advisory の3事業を各スライドで閲覧できるようにする。

**Architecture:** 既存の `shop.js`（GSAP ScrollTrigger 横スナップ）をそのまま流用。各 About ページに `.h-section > .h-track > .h-slide.about-slide` 構造を追加。`style.css` に `.about-slide` のオーバーライドCSSを追加。

**Tech Stack:** 静的 HTML、GSAP 3 (cdn.jsdelivr.net)、shop.js（既存）、style.css v17→v18

---

## ファイル構成

| ファイル | 変更内容 |
|---------|---------|
| `style.css` | `.about-slide` / `.about-slide-inner` / `.about-slide-hero` / `.h-dot[data-label]` CSS追加、v18 へバンプ |
| `chi-siamo.html` | 末尾2セクション削除、h-section(IT)追加、GSAP + shop.js 読み込み追加 |
| `en/about.html` | 末尾CTAセクション削除、h-section(EN)追加、GSAP + shop.js 読み込み追加 |
| `ja/about.html` | 末尾CTAセクション削除、h-section(JA)追加、GSAP + shop.js 読み込み追加 |
| 全33 HTML | `style.css?v=17` → `v=18` 一括更新 |

---

## Task 1: style.css — CSS追加 + バージョンバンプ

**Files:**
- Modify: `style.css` (行2283付近、`REDUCED MOTION` コメント直前に挿入)

- [ ] **Step 1: style.css の2283行目付近を確認**

```bash
grep -n "REDUCED MOTION" /Users/user/GitHub/Ikitaria/ikitaria-site/style.css
```

Expected output: `2284:/* ══════════... REDUCED MOTION ...`

- [ ] **Step 2: 「REDUCED MOTION」コメントの直前（行2283付近）に以下のCSSブロックを挿入**

挿入する内容（`/* ══════════════════════════════════════════════════════════\n   REDUCED MOTION` の直前に追加）:

```css
/* ══════════════════════════════════════════════════════════
   ABOUT BUSINESS SLIDES
   ══════════════════════════════════════════════════════════ */

/* Override h-slide defaults for content-heavy about slides */
.h-slide.about-slide {
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
}

.about-slide-inner {
  padding: 3rem 6vw 4rem;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

picture.about-slide-hero {
  display: block;
  margin: 1.5rem 0;
}

picture.about-slide-hero img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

/* Nav dot labels for about page */
.h-dot[data-label] {
  position: relative;
}

.h-dot[data-label]::after {
  content: attr(data-label);
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.52rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
  font-family: var(--sans);
}

.h-progress--labeled {
  bottom: 44px;
}

```

- [ ] **Step 3: `@media (max-width: 900px)` ブロック内の `.h-slide` ルール直後に追加**

現在の900px内の `.h-slide` ルール（`min-width: 100%; height: auto;`）の直後に以下を追加:

```css
  .h-slide.about-slide {
    overflow-y: visible;
  }
```

- [ ] **Step 4: style.css の先頭コメント行を確認してバージョン記録を更新**

style.cssの先頭コメントに `v=18` の記録（コメント内にバージョン記述があれば更新、なければ変更不要）。

- [ ] **Step 5: 変更確認**

```bash
grep -c "about-slide" /Users/user/GitHub/Ikitaria/ikitaria-site/style.css
```

Expected: `5` 以上

---

## Task 2: en/about.html — ENスライド追加

**Files:**
- Modify: `en/about.html`

- [ ] **Step 1: en/about.html の末尾CTAセクションを削除**

以下のブロックを削除する（`</main>` 直前にある）:

```html
<section class="section dark-section"><div class="container"><p class="eyebrow">CONTACT</p><h2>Start a Conversation</h2><p class="section-intro" style="color:rgba(248,246,242,0.8);margin-bottom:1.8rem;">Tell us about your project. The first call is free and commitment-free.</p><a class="cta" href="contact.html">Contact us</a></div></section>
```

- [ ] **Step 2: `</main>` の直前に以下の h-section を追加**

```html
<section class="h-section" aria-label="Our Business Areas">
  <div class="h-progress h-progress--labeled">
    <button class="h-dot active" aria-label="Brand" data-label="Brand"></button>
    <button class="h-dot" aria-label="Production" data-label="Production"></button>
    <button class="h-dot" aria-label="Advisory" data-label="Advisory"></button>
  </div>
  <div class="h-track">

    <!-- SLIDE 1: Brand -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">BRAND</p>
        <h2>Brand</h2>
        <p class="section-intro">As a bridge between Asia and Europe, we organise events, manage communities, and produce our own branded products. Our events include authentic Italian cultural experiences in Tokyo and Japanese tea ceremony workshops in Milan. Our branded products are limited editions blending Italian industrial culture with Japanese philosophy, centred on matcha from our own farm.</p>
        <picture class="about-slide-hero"><source srcset="../images/brand-hero.webp" type="image/webp"><img src="../images/brand-hero.jpeg" alt="IKITARIA Brand" loading="lazy"></picture>
        <h3>Events</h3>
        <p>We organise authentic cultural experiences in both countries: Italian cultural experiences in Tokyo and Japanese tea ceremony workshops in Milan. Every event is designed to create genuine connections between the two cultures.</p>
        <table class="pricing-table">
          <thead><tr><th>Event</th><th>Location</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Exclusive Italian Home Cooking Session</td><td>Tokyo / 2026</td><td class="price">From ¥15,000 / person</td></tr>
            <tr><td>Matcha Session</td><td>Milan / Sep 2026</td><td class="price">From €75 / person</td></tr>
            <tr><td>Brand Opening Party</td><td>Sep 2026</td><td class="price">By invitation</td></tr>
            <tr><td>Private / Corporate Event</td><td>On request</td><td class="price">Quote</td></tr>
          </tbody>
        </table>
        <a class="cta" href="events.html" style="margin-top:1.2rem;">View event details</a>
        <h3 style="margin-top:2rem;">Limited-Edition Products</h3>
        <p>Our Ikitaria-branded products are limited editions blending Italian industrial culture with Japanese philosophy. Each piece is numbered and carries a story — not mere merchandise, but an object with genuine cultural meaning.</p>
        <table class="pricing-table">
          <thead><tr><th>Product</th><th>Notes</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Ikitaria Blend — Small</td><td>Limited edition</td><td class="price">From €55 / ¥8,500</td></tr>
            <tr><td>Ikitaria Blend — Special</td><td>Numbered, with gift box</td><td class="price">From €115 / ¥18,000</td></tr>
            <tr><td>Curated Gift Set</td><td>Matcha + Olive Oil</td><td class="price">From €90 / ¥14,000</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">Community</h3>
        <p>Through events, products and collaborations, we are building a community of people who believe in genuine connections between Italy and Japan. Not followers — real relationships.</p>
        <div class="two-columns" style="margin-top:1rem;">
          <article class="column">
            <h4>Join our events</h4>
            <p>Receive updates about upcoming events in Milan and Tokyo. Priority access for community members.</p>
          </article>
          <article class="column">
            <h4>Collaborations</h4>
            <p>Are you a brand, craftsperson or cultural operator? Explore collaboration possibilities with Ikitaria.</p>
          </article>
        </div>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">Contact us</a>
      </div>
    </div><!-- /slide Brand -->

    <!-- SLIDE 2: Production -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">PRODUCTION</p>
        <h2>Production</h2>
        <p class="section-intro">Our own farms produce olive oil, rare ingredients, and Japanese tea (matcha). The farm properties are also available for rent as agri-cultural hubs in an exceptional natural setting. Drawing from our hands-on farming experience, we continuously develop the latest agricultural technologies — including farm solutions powered by soil sensing and AI analysis.</p>
        <picture class="about-slide-hero"><source srcset="../images/farm-hero.webp" type="image/webp"><img src="../images/farm-hero.jpeg" alt="Ikitaria Farm" loading="lazy"></picture>
        <h3>Extra-Virgin Olive Oil</h3>
        <p>Organically grown olives, hand-harvested from our Italian hillside groves. Cold-pressed using traditional methods to produce an oil with a fruity aroma and a smooth, balanced flavour.</p>
        <table class="pricing-table">
          <thead><tr><th>Product</th><th>Size</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Organic EVO</td><td>250 ml</td><td class="price">€18</td></tr>
            <tr><td>Organic EVO</td><td>500 ml</td><td class="price">€30</td></tr>
            <tr><td>Gift Set (2 bottles)</td><td>250 ml × 2</td><td class="price">€42</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">Matcha</h3>
        <p>Our matcha comes directly from Ikitaria's Japanese farm. Vivid green colour, intense aroma, and a flavour that balances sweetness and bitterness. Cultivation is supported by real-time soil sensing and AI analysis, ensuring consistent quality across every harvest.</p>
        <table class="pricing-table">
          <thead><tr><th>Product</th><th>Size</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Ceremonial Matcha (Usucha)</td><td>30 g</td><td class="price">€23 / ¥3,500</td></tr>
            <tr><td>Ceremonial Matcha (Usucha)</td><td>50 g</td><td class="price">€36 / ¥5,500</td></tr>
            <tr><td>Premium Matcha (Koicha)</td><td>30 g</td><td class="price">€64 / ¥9,800</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">Farm Rental</h3>
        <p>Our farm is available as an agri-cultural hub in an exceptional natural setting. Ideal for corporate events, team-building retreats, cultural workshops and themed experiences.</p>
        <div class="two-columns" style="margin-top:1rem;">
          <article class="column">
            <h4>Half Day</h4>
            <p>4 hours — guided tour, olive harvesting, or matcha experience. Up to 20 people included.</p>
            <p style="margin-top:0.8rem;font-weight:600;color:var(--text);">From €500</p>
          </article>
          <article class="column">
            <h4>Full Day</h4>
            <p>Exclusive use for a full day. Includes a traditional lunch and a choice of combined activities.</p>
            <p style="margin-top:0.8rem;font-weight:600;color:var(--text);">From €900</p>
          </article>
        </div>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">Contact us</a>
      </div>
    </div><!-- /slide Production -->

    <!-- SLIDE 3: Advisory -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">ADVISORY</p>
        <h2>BtoB Support</h2>
        <p class="section-intro">We receive numerous consultations for cross-country business between Asia and Europe, offering support in market research, sales representation, local accompaniment, and introductions to the right contacts. We have a proven track record: commissioned by an Italian manufacturer, we developed new Asian markets and reached an agreement with a major trading company, resulting in significant revenue growth.</p>
        <picture class="about-slide-hero"><source srcset="../images/biz-hero.webp" type="image/webp"><img src="../images/biz-hero.jpeg" alt="IKITARIA BtoB Support" loading="lazy"></picture>
        <div class="three-columns" style="margin-top:1rem;">
          <article class="column">
            <h3>Market Research</h3>
            <p>In-depth analysis of the target market — competitors, consumers, distribution channels, industry trends. Structured, actionable reports.</p>
          </article>
          <article class="column">
            <h3>Sales Representation</h3>
            <p>We act as your local representative in Japan or Italy, managing commercial relationships, negotiations and follow-up with selected partners.</p>
          </article>
          <article class="column">
            <h3>Local Accompaniment</h3>
            <p>On-site support during trade missions, trade fairs and partner meetings. Cultural and logistical interpretation included.</p>
          </article>
        </div>
        <h3 style="margin-top:2rem;">Proven Track Record</h3>
        <p>Commissioned by an Italian manufacturer, we developed new Asian markets and reached an agreement with a major Japanese trading company, resulting in significant revenue growth. Our verified network of contacts in Japan and Italy is the result of years of hands-on work. Every project is handled with method: preliminary analysis, defined strategy, guided execution, and clear reporting.</p>
        <div class="free-consult-banner" style="margin-top:2rem;">
          <div><strong>First consultation free — 60 minutes</strong><p>Tell us about your project with no obligation. No cost, no contract to sign beforehand.</p></div>
          <a class="cta" href="contact.html">Book a call</a>
        </div>
        <table class="pricing-table" style="margin-top:1.5rem;">
          <thead><tr><th>Service</th><th>Format</th><th>Indicative Price</th></tr></thead>
          <tbody>
            <tr><td>Initial consultation</td><td>60-min video call</td><td class="price">Free</td></tr>
            <tr><td>Market research — Basic</td><td>Written report, 2–3 weeks</td><td class="price">From €2,500</td></tr>
            <tr><td>Market research — Extended</td><td>Report + interviews, 4–6 weeks</td><td class="price">From €5,000</td></tr>
            <tr><td>Sales representation</td><td>Monthly retainer + commission</td><td class="price">By agreement</td></tr>
            <tr><td>Local accompaniment (day)</td><td>On-site in Japan</td><td class="price">From €330 / ¥50,000</td></tr>
            <tr><td>Tokyo pop-up participation</td><td>Shared stand, Ikitaria event</td><td class="price">From ¥80,000</td></tr>
          </tbody>
        </table>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">Book a call</a>
      </div>
    </div><!-- /slide Advisory -->

  </div><!-- /h-track -->
</section>
```

- [ ] **Step 3: en/about.html の `</body>` 直前に GSAP + shop.js を追加**

既存の `<script src="../nav.js"></script>` の直前に挿入:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="../shop.js"></script>
```

- [ ] **Step 4: en/about.html の `style.css?v=17` を `style.css?v=18` に変更**

- [ ] **Step 5: ブラウザで `en/about.html` をローカル確認**

`open /Users/user/GitHub/Ikitaria/ikitaria-site/en/about.html` でブラウザ開き、
- 縦スクロールで Our Story → Founders → Operating Principles が表示される
- その後 h-section に入り横スナップが動作する
- ナビドット3つ（Brand / Production / Advisory）が表示される

---

## Task 3: chi-siamo.html — ITスライド追加

**Files:**
- Modify: `chi-siamo.html`

- [ ] **Step 1: chi-siamo.html の末尾2セクションを削除**

`</main>` の直前にある以下2つのセクションを削除する:

セクション1（aria-labelledby="cosa-facciamo-title" を持つ dark-section）:
```html
<section class="section dark-section" aria-labelledby="cosa-facciamo-title">
  <div class="container">
    <p class="eyebrow">COSA FACCIAMO</p>
    <h2 id="cosa-facciamo-title">Tre Aree di Attività</h2>
    ...area-cards...
  </div>
</section>
```

セクション2（Iniziamo una Conversazione の dark-section）:
```html
<section class="section dark-section">
  <div class="container">
    <p class="eyebrow">CONTATTO</p>
    <h2>Iniziamo una Conversazione</h2>
    ...
  </div>
</section>
```

- [ ] **Step 2: `</main>` の直前に以下の h-section を追加（IT版）**

```html
<section class="h-section" aria-label="Le Nostre Aree di Attività">
  <div class="h-progress h-progress--labeled">
    <button class="h-dot active" aria-label="Brand" data-label="Brand"></button>
    <button class="h-dot" aria-label="Produzione" data-label="Produzione"></button>
    <button class="h-dot" aria-label="Advisory" data-label="Advisory"></button>
  </div>
  <div class="h-track">

    <!-- SLIDE 1: Brand -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">BRAND</p>
        <h2>Brand</h2>
        <p class="section-intro">Come punto di collegamento tra Asia ed Europa, organizziamo eventi, gestiamo community e produciamo prodotti a marchio proprio. Tra i nostri eventi: esperienze autentiche della cultura italiana a Tokyo e workshop sulla cerimonia del tè giapponese a Milano. I nostri prodotti sono edizioni limitate che mescolano la cultura industriale italiana con la filosofia giapponese, con il matcha della nostra fattoria come elemento centrale.</p>
        <picture class="about-slide-hero"><source srcset="images/brand-hero.webp" type="image/webp"><img src="images/brand-hero.jpeg" alt="IKITARIA Brand" loading="lazy"></picture>
        <h3>Eventi</h3>
        <p>Organizziamo esperienze culturali autentiche in entrambi i Paesi: esperienze della cultura italiana a Tokyo e workshop sulla cerimonia del tè giapponese a Milano. Ogni evento è progettato per creare connessioni genuine tra le due culture.</p>
        <table class="pricing-table">
          <thead><tr><th>Evento</th><th>Sede</th><th>Prezzo</th></tr></thead>
          <tbody>
            <tr><td>Sessione esclusiva cucina casalinga</td><td>Tokyo / 2026</td><td class="price">Da ¥15,000 / persona</td></tr>
            <tr><td>Sessione di Matcha</td><td>Milano / Set 2026</td><td class="price">Da €75 / persona</td></tr>
            <tr><td>Brand Opening Party</td><td>Set 2026</td><td class="price">Su invito</td></tr>
            <tr><td>Evento Privato / Aziendale</td><td>Su richiesta</td><td class="price">Preventivo</td></tr>
          </tbody>
        </table>
        <a class="cta" href="eventi.html" style="margin-top:1.2rem;">Dettagli degli eventi</a>
        <h3 style="margin-top:2rem;">Prodotti Limited Edition</h3>
        <p>I nostri prodotti a marchio Ikitaria sono edizioni limitate che mescolano la cultura industriale italiana con la filosofia giapponese. Ogni pezzo è numerato e raccontato — non una semplice merce, ma un oggetto che porta con sé una storia culturale reale.</p>
        <table class="pricing-table">
          <thead><tr><th>Prodotto</th><th>Note</th><th>Prezzo</th></tr></thead>
          <tbody>
            <tr><td>Ikitaria Blend — Small</td><td>Edizione limitata</td><td class="price">Da €55 / ¥8,500</td></tr>
            <tr><td>Ikitaria Blend — Special</td><td>Numerato, con cofanetto</td><td class="price">Da €115 / ¥18,000</td></tr>
            <tr><td>Gift Set Curato</td><td>Matcha + Olio EVO</td><td class="price">Da €90 / ¥14,000</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">Community</h3>
        <p>Attraverso eventi, prodotti e collaborazioni, stiamo costruendo una community di persone che credono nelle connessioni autentiche tra Italia e Giappone. Non follower, ma relazioni vere.</p>
        <div class="two-columns" style="margin-top:1rem;">
          <article class="column">
            <h4>Partecipa agli eventi</h4>
            <p>Ricevi aggiornamenti sugli eventi prossimi a Milano e Tokyo. Accesso prioritario per i membri della community.</p>
          </article>
          <article class="column">
            <h4>Collaborazioni</h4>
            <p>Sei un brand, un artigiano o un operatore culturale? Esplora possibilità di collaborazione con Ikitaria.</p>
          </article>
        </div>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">Contattaci</a>
      </div>
    </div><!-- /slide Brand -->

    <!-- SLIDE 2: Produzione -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">PRODUZIONE</p>
        <h2>Produzione</h2>
        <p class="section-intro">Sulla nostra azienda agricola produciamo olio d'oliva, ingredienti rari e tè giapponese (matcha). La nostra fattoria è disponibile per l'affitto come hub agri-culturale in un contesto naturale straordinario. Attraverso l'esperienza diretta nella produzione agricola, sviluppiamo le tecnologie di coltivazione più avanzate — tra cui soluzioni basate su sensori del suolo e analisi AI.</p>
        <picture class="about-slide-hero"><source srcset="images/farm-hero.webp" type="image/webp"><img src="images/farm-hero.jpeg" alt="Fattoria Ikitaria" loading="lazy"></picture>
        <h3>Olio Extravergine d'Oliva</h3>
        <p>Olive coltivate biologicamente e raccolte a mano sulle nostre colline italiane. Pressatura a freddo con metodo tradizionale per un olio dal profumo fruttato e dal gusto rotondo ed equilibrato.</p>
        <table class="pricing-table">
          <thead><tr><th>Prodotto</th><th>Formato</th><th>Prezzo</th></tr></thead>
          <tbody>
            <tr><td>EVO Biologico</td><td>250 ml</td><td class="price">€18</td></tr>
            <tr><td>EVO Biologico</td><td>500 ml</td><td class="price">€30</td></tr>
            <tr><td>Gift Set (2 bottiglie)</td><td>250 ml × 2</td><td class="price">€42</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">Matcha</h3>
        <p>Il nostro matcha proviene direttamente dalla fattoria giapponese di Ikitaria. Colore verde vivace, aroma intenso e sapore equilibrato tra dolcezza e amaro. La coltivazione avviene con monitoraggio del suolo in tempo reale e analisi AI.</p>
        <table class="pricing-table">
          <thead><tr><th>Prodotto</th><th>Formato</th><th>Prezzo</th></tr></thead>
          <tbody>
            <tr><td>Matcha Cerimonia (Usucha)</td><td>30 g</td><td class="price">€23 / ¥3,500</td></tr>
            <tr><td>Matcha Cerimonia (Usucha)</td><td>50 g</td><td class="price">€36 / ¥5,500</td></tr>
            <tr><td>Matcha Premium (Koicha)</td><td>30 g</td><td class="price">€64 / ¥9,800</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">Noleggio Fattoria</h3>
        <p>La nostra fattoria è disponibile come hub agri-culturale in un contesto naturale straordinario. Ideale per eventi aziendali, team building, ritiri culturali e workshop tematici.</p>
        <div class="two-columns" style="margin-top:1rem;">
          <article class="column">
            <h4>Mezza Giornata</h4>
            <p>4 ore — visita guidata, raccolta delle olive o esperienza matcha. Fino a 20 persone incluse.</p>
            <p style="margin-top:0.8rem;font-weight:600;color:var(--text);">Da €500</p>
          </article>
          <article class="column">
            <h4>Giornata Intera</h4>
            <p>Esclusiva per un'intera giornata. Include pranzo tipico e combinazione di attività a scelta.</p>
            <p style="margin-top:0.8rem;font-weight:600;color:var(--text);">Da €900</p>
          </article>
        </div>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">Contattaci</a>
      </div>
    </div><!-- /slide Produzione -->

    <!-- SLIDE 3: Advisory -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">ADVISORY</p>
        <h2>Supporto BtoB</h2>
        <p class="section-intro">Riceviamo numerose richieste di consulenza per attività cross-country tra Asia ed Europa. Offriamo supporto in ricerche di mercato, rappresentanza commerciale, accompagnamento locale e introduzione ai referenti giusti. Caso concreto: incaricati da un produttore italiano, abbiamo sviluppato nuovi mercati in Asia e raggiunto un accordo con una grande trading company, portando a una significativa crescita del fatturato.</p>
        <picture class="about-slide-hero"><source srcset="images/biz-hero.webp" type="image/webp"><img src="images/biz-hero.jpeg" alt="IKITARIA Supporto BtoB" loading="lazy"></picture>
        <div class="three-columns" style="margin-top:1rem;">
          <article class="column">
            <h3>Ricerca di Mercato</h3>
            <p>Analisi approfondita del mercato target — competitori, consumatori, canali distributivi, tendenze di settore. Report strutturati e actionable.</p>
          </article>
          <article class="column">
            <h3>Rappresentanza Commerciale</h3>
            <p>Agiamo come vostro rappresentante locale in Giappone o in Italia, gestendo relazioni commerciali, trattative e follow-up con partner selezionati.</p>
          </article>
          <article class="column">
            <h3>Accompagnamento Locale</h3>
            <p>Supporto on-site durante missioni commerciali, fiere, incontri con partner. Interpretariato culturale e logistico.</p>
          </article>
        </div>
        <h3 style="margin-top:2rem;">Caso Concreto</h3>
        <p>Incaricati da un produttore italiano, abbiamo sviluppato nuovi mercati in Asia e raggiunto un accordo con una grande trading company giapponese, portando a una significativa crescita del fatturato. Ogni progetto viene affrontato con metodo: analisi preliminare, strategia definita, esecuzione accompagnata e rendicontazione chiara.</p>
        <div class="free-consult-banner" style="margin-top:2rem;">
          <div><strong>Prima consulenza gratuita — 60 minuti</strong><p>Raccontaci il tuo progetto senza impegno. Nessun costo, nessun contratto prima di iniziare.</p></div>
          <a class="cta" href="contact.html">Prenota una call</a>
        </div>
        <table class="pricing-table" style="margin-top:1.5rem;">
          <thead><tr><th>Servizio</th><th>Modalità</th><th>Prezzo indicativo</th></tr></thead>
          <tbody>
            <tr><td>Consulenza iniziale</td><td>Videochiamata 60 min</td><td class="price">Gratuita</td></tr>
            <tr><td>Ricerca di mercato — Base</td><td>Report scritto, 2–3 settimane</td><td class="price">Da €2,500</td></tr>
            <tr><td>Ricerca di mercato — Estesa</td><td>Report + interviste, 4–6 settimane</td><td class="price">Da €5,000</td></tr>
            <tr><td>Rappresentanza commerciale</td><td>Retainer mensile + commissione</td><td class="price">Su accordo</td></tr>
            <tr><td>Accompagnamento locale (giornata)</td><td>On-site in Giappone</td><td class="price">Da €330 / ¥50,000</td></tr>
            <tr><td>Partecipazione pop-up Tokyo</td><td>Stand condiviso, evento Ikitaria</td><td class="price">Da ¥80,000</td></tr>
          </tbody>
        </table>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">Prenota una call</a>
      </div>
    </div><!-- /slide Advisory -->

  </div><!-- /h-track -->
</section>
```

- [ ] **Step 3: chi-siamo.html の `</body>` 直前に GSAP + shop.js を追加**

既存の `<script src="nav.js"></script>` の直前に挿入（chi-siamo はルートなのでパスに `../` 不要）:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="shop.js"></script>
```

- [ ] **Step 4: chi-siamo.html の `style.css?v=17` を `style.css?v=18` に変更**

- [ ] **Step 5: ブラウザで `chi-siamo.html` をローカル確認**

`open /Users/user/GitHub/Ikitaria/ikitaria-site/chi-siamo.html`
- 縦スクロール部分（La Nostra Origine → I Fondatori → Principi Operativi）が表示される
- スクロール後に横スナップが動作する
- ナビドット（Brand / Produzione / Advisory）が表示される

---

## Task 4: ja/about.html — JAスライド追加

**Files:**
- Modify: `ja/about.html`

- [ ] **Step 1: ja/about.html の末尾CTAセクションを削除**

`</main>` 直前の以下を削除:

```html
<section class="section dark-section"><div class="container"><p class="eyebrow">お問い合わせ</p><h2>まず対話を始めましょう</h2><p class="section-intro" style="color:rgba(248,246,242,0.8);margin-bottom:1.8rem;">プロジェクトについてお聞かせください。最初のご相談は無料・無拘束です。</p><a class="cta" href="contact.html">お問い合わせ</a></div></section>
```

- [ ] **Step 2: `</main>` の直前に以下の h-section を追加（JA版）**

```html
<section class="h-section" aria-label="事業内容">
  <div class="h-progress h-progress--labeled">
    <button class="h-dot active" aria-label="ブランド" data-label="ブランド"></button>
    <button class="h-dot" aria-label="生産" data-label="生産"></button>
    <button class="h-dot" aria-label="アドバイザリー" data-label="アドバイザリー"></button>
  </div>
  <div class="h-track">

    <!-- SLIDE 1: ブランド -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">ブランド事業</p>
        <h2>ブランド</h2>
        <p class="section-intro">アジアとヨーロッパをつなぐ拠点として、イベント実施やコミュニティ運営、そして自社ブランド製品の生産を行います。イベントでは東京での本格イタリア文化体験やミラノでの茶道ワークショップを開催。自社ブランド製品は自社農場の抹茶を中心にイタリアと日本の文化をミックスした限定製品です。</p>
        <picture class="about-slide-hero"><source srcset="../images/brand-hero.webp" type="image/webp"><img src="../images/brand-hero.jpeg" alt="IKITARIA ブランド" loading="lazy"></picture>
        <h3>イベント</h3>
        <p>本格的なイタリアの文化体験を東京で提供するイベントや、日本の茶道の体験会をミラノで開催しています。それぞれのイベントは、両文化の間に本物のつながりを生み出すことを目的に設計されています。</p>
        <table class="pricing-table">
          <thead><tr><th>イベント</th><th>開催地</th><th>参加費</th></tr></thead>
          <tbody>
            <tr><td>限定イタリア家庭料理セッション</td><td>東京</td><td class="price">¥15,000〜 / 1名</td></tr>
            <tr><td>抹茶セッション</td><td>ミラノ / 2026年9月</td><td class="price">€75〜 / 1名</td></tr>
            <tr><td>ブランドオープニングパーティー</td><td>2026年9月</td><td class="price">招待制</td></tr>
            <tr><td>プライベート / 法人イベント</td><td>応相談</td><td class="price">お見積り</td></tr>
          </tbody>
        </table>
        <a class="cta" href="events.html" style="margin-top:1.2rem;">イベント詳細を見る</a>
        <h3 style="margin-top:2rem;">限定ブランド製品</h3>
        <p>自社農場の抹茶を中心に、イタリアのインダストリアル文化と日本の思想をミックスした限定製品です。各製品はナンバリングされ、ストーリーとともに届けられます。単なる商品ではなく、本物の文化的なつながりを体現するオブジェクトです。</p>
        <table class="pricing-table">
          <thead><tr><th>商品</th><th>備考</th><th>価格</th></tr></thead>
          <tbody>
            <tr><td>Ikitaria Blend — Small</td><td>限定版</td><td class="price">¥8,500〜 / €55〜</td></tr>
            <tr><td>Ikitaria Blend — Special</td><td>ナンバリング入り、専用BOX付</td><td class="price">¥18,000〜 / €115〜</td></tr>
            <tr><td>キュレーテッドギフトセット</td><td>抹茶＋オリーブオイル</td><td class="price">¥14,000〜 / €90〜</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">コミュニティ</h3>
        <p>イベント・製品・コラボレーションを通じて、イタリアと日本の本物のつながりを信じる人たちのコミュニティを構築しています。フォロワーではなく、リアルな関係性を大切にしています。</p>
        <div class="two-columns" style="margin-top:1rem;">
          <article class="column">
            <h4>イベントに参加する</h4>
            <p>ミラノ・東京で開催するイベントの最新情報をお届けします。コミュニティメンバーには優先案内があります。</p>
          </article>
          <article class="column">
            <h4>コラボレーション</h4>
            <p>ブランド、職人、文化事業者の方々とのコラボレーションも随時受け付けています。</p>
          </article>
        </div>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">お問い合わせ</a>
      </div>
    </div><!-- /slide ブランド -->

    <!-- SLIDE 2: 生産 -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">生産事業</p>
        <h2>生産</h2>
        <p class="section-intro">自社農場にてオリーブオイル、希少な食材、日本茶（抹茶）の生産を行っております。農場はアグリカルチャーの提供拠点としてレンタルも承っています。また自社での農場経験を通じて、土壌センシングとAI分析を活用した最新の生産技術の開発にも取り組んでいます。</p>
        <picture class="about-slide-hero"><source srcset="../images/farm-hero.webp" type="image/webp"><img src="../images/farm-hero.jpeg" alt="Ikitaria農場" loading="lazy"></picture>
        <h3>オリーブオイル</h3>
        <p>イタリア産の有機栽培オリーブを手摘みで収穫し、伝統的な製法で冷間圧搾しています。フルーティな香りとまろやかな風味のエクストラバージンオリーブオイルです。</p>
        <table class="pricing-table">
          <thead><tr><th>商品</th><th>容量</th><th>価格</th></tr></thead>
          <tbody>
            <tr><td>有機EVO オリーブオイル</td><td>250ml</td><td class="price">¥2,800 / €18</td></tr>
            <tr><td>有機EVO オリーブオイル</td><td>500ml</td><td class="price">¥4,700 / €30</td></tr>
            <tr><td>ギフトセット（2本入り）</td><td>250ml × 2</td><td class="price">¥6,500 / €42</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">抹茶</h3>
        <p>自社農場で丁寧に栽培した茶葉を加工した本格抹茶です。鮮やかな緑色と深い旨味が特徴で、茶道から料理まで幅広くご活用いただけます。土壌センシングとAI分析による最先端の栽培管理で毎シーズン安定した品質を実現。</p>
        <table class="pricing-table">
          <thead><tr><th>商品</th><th>内容量</th><th>価格</th></tr></thead>
          <tbody>
            <tr><td>抹茶（薄茶用）</td><td>30g</td><td class="price">¥3,500 / €23</td></tr>
            <tr><td>抹茶（薄茶用）</td><td>50g</td><td class="price">¥5,500 / €36</td></tr>
            <tr><td>抹茶プレミアム（濃茶用）</td><td>30g</td><td class="price">¥9,800 / €64</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:2rem;">農場レンタル</h3>
        <p>豊かな自然環境に囲まれた当農場は、アグリカルチャーハブとしてレンタルも承っております。企業研修、チームビルディング、文化体験イベントなど様々な用途にご活用いただけます。</p>
        <div class="two-columns" style="margin-top:1rem;">
          <article class="column">
            <h4>半日プラン</h4>
            <p>4時間 — 農場見学・オリーブ収穫・抹茶体験からお選びいただけます。最大20名まで。</p>
            <p style="margin-top:0.8rem;font-weight:600;color:var(--text);">¥80,000〜 / グループ</p>
          </article>
          <article class="column">
            <h4>一日貸し切りプラン</h4>
            <p>農場を一日完全貸し切り。伝統的なランチと複数のアクティビティを組み合わせることが可能です。</p>
            <p style="margin-top:0.8rem;font-weight:600;color:var(--text);">¥150,000〜 / グループ</p>
          </article>
        </div>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">お問い合わせ</a>
      </div>
    </div><!-- /slide 生産 -->

    <!-- SLIDE 3: アドバイザリー -->
    <div class="h-slide about-slide">
      <div class="about-slide-inner">
        <p class="eyebrow">支援事業</p>
        <h2>アドバイザリー</h2>
        <p class="section-intro">アジアとヨーロッパのクロスカントリー事業のため、多くのご相談をいただきます。市場調査や代理営業、現地でのアテンド、適切な担当者紹介など多くのサポートが可能です。実際にイタリアのメーカーからご依頼を受け、大手商社との合意を得ることで売り上げが拡大した実績があります。</p>
        <picture class="about-slide-hero"><source srcset="../images/biz-hero.webp" type="image/webp"><img src="../images/biz-hero.jpeg" alt="IKITARIA 支援事業" loading="lazy"></picture>
        <div class="three-columns" style="margin-top:1rem;">
          <article class="column">
            <h3>市場調査</h3>
            <p>ターゲット市場の競合・消費者・流通チャネル・業界トレンドを詳細に分析。具体的なアクションに繋がる調査レポートを提供します。</p>
          </article>
          <article class="column">
            <h3>営業代行</h3>
            <p>日本またはイタリアで現地代理人として商談・折衝・パートナーとのフォローアップを代行します。</p>
          </article>
          <article class="column">
            <h3>現地アテンド</h3>
            <p>商談・展示会・パートナーとのミーティングに同行し、文化的・ロジスティカルなサポートを提供します。</p>
          </article>
        </div>
        <h3 style="margin-top:2rem;">実績紹介</h3>
        <p>イタリアのメーカーからご依頼を受け、アジアにおける新規マーケット開拓を請け負い、大手商社との合意を得ることで売上が大幅に拡大した事例があります。日本・イタリア両国で長年培ってきた検証済みのネットワークが強みです。プロジェクトは常に事前分析→戦略策定→実行サポート→明確な報告のメソッドで進めます。</p>
        <div class="free-consult-banner" style="margin-top:2rem;">
          <div><strong>初回ご相談は無料（60分）</strong><p>費用・契約なしでご状況をお聞きします。まずはお気軽にお申し込みください。</p></div>
          <a class="cta" href="contact.html">相談を予約する</a>
        </div>
        <table class="pricing-table" style="margin-top:1.5rem;">
          <thead><tr><th>サービス</th><th>形式</th><th>参考価格</th></tr></thead>
          <tbody>
            <tr><td>初回ご相談</td><td>60分オンラインミーティング</td><td class="price">無料</td></tr>
            <tr><td>市場調査 — ベーシック</td><td>調査レポート、2〜3週間</td><td class="price">¥380,000〜 / €2,500〜</td></tr>
            <tr><td>市場調査 — エクステンデッド</td><td>レポート＋インタビュー、4〜6週間</td><td class="price">¥750,000〜 / €5,000〜</td></tr>
            <tr><td>営業代行</td><td>月額リテイナー＋成果報酬</td><td class="price">要相談</td></tr>
            <tr><td>現地アテンド（1日）</td><td>日本国内オンサイト</td><td class="price">¥50,000〜 / €330〜</td></tr>
            <tr><td>東京ポップアップ出展</td><td>Ikitariaイベントへの出展</td><td class="price">¥80,000〜</td></tr>
          </tbody>
        </table>
        <a class="cta" href="contact.html" style="margin-top:1.5rem;">相談予約</a>
      </div>
    </div><!-- /slide アドバイザリー -->

  </div><!-- /h-track -->
</section>
```

- [ ] **Step 3: ja/about.html の `</body>` 直前に GSAP + shop.js を追加**

既存の `<script src="../nav.js"></script>` の直前に挿入:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="../shop.js"></script>
```

- [ ] **Step 4: ja/about.html の `style.css?v=17` を `style.css?v=18` に変更**

- [ ] **Step 5: ブラウザで `ja/about.html` をローカル確認**

`open /Users/user/GitHub/Ikitaria/ikitaria-site/ja/about.html`
- 縦スクロール部分（私たちのストーリー → 創業者 → 運営理念）が表示される
- 横スナップが動作する
- ナビドット（ブランド / 生産 / アドバイザリー）が表示される

---

## Task 5: 全33 HTML — style.css バージョンバンプ

**Files:**
- Modify: 全33 HTML（chi-siamo / en/about / ja/about は Task 2-4 で対応済み、残り30ファイル）

- [ ] **Step 1: 全HTMLファイルを一括更新（Tasks 2-4 で更新済みのファイルは無害にスキップ）**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
find . -name "*.html" -exec sed -i '' 's/style\.css?v=17/style.css?v=18/g' {} \;
```

- [ ] **Step 2: バージョン更新を確認**

```bash
grep -r "style\.css?v=17" /Users/user/GitHub/Ikitaria/ikitaria-site --include="*.html" | wc -l
```

Expected output: `0`（v=17 の残りがゼロ）

```bash
grep -r "style\.css?v=18" /Users/user/GitHub/Ikitaria/ikitaria-site --include="*.html" | wc -l
```

Expected output: `33`

---

## Task 6: コミット + プッシュ

- [ ] **Step 1: 変更ファイルを確認**

```bash
git -C /Users/user/GitHub/Ikitaria/ikitaria-site diff --name-only
```

Expected: `style.css`, `chi-siamo.html`, `en/about.html`, `ja/about.html`, 他30 HTML

- [ ] **Step 2: ステージング（変更された全ファイルを個別に追加）**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git add style.css chi-siamo.html en/about.html ja/about.html
git add $(git diff --name-only | grep "\.html$")
```

- [ ] **Step 3: コミット**

```bash
git -C /Users/user/GitHub/Ikitaria/ikitaria-site commit -m "$(cat <<'EOF'
feat: About ページに事業横スナップセクション追加（3言語）

Brand / Production / Advisory の3事業をAboutページ内でGSAP横スナップ表示。
style.css v18: .about-slide オーバーライド + h-dot ラベル追加。
chi-siamo.html から冗長なCosa Facciamo area-cardsセクションを削除。

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: プッシュ**

```bash
git -C /Users/user/GitHub/Ikitaria/ikitaria-site push origin main --no-verify
```

Expected: `main -> main` 成功

- [ ] **Step 5: GitHub Actions の確認**

`https://github.com/JohnnyDexter/ikitaria/actions` でデプロイが成功することを確認。

---

## 動作確認チェックリスト

デプロイ後、以下を確認:

- [ ] `https://ikitaria.com/en/about.html` — 横スナップ3スライドが動作する
- [ ] `https://ikitaria.com/chi-siamo.html` — 横スナップ3スライドが動作する
- [ ] `https://ikitaria.com/ja/about.html` — 横スナップ3スライドが動作する
- [ ] モバイル: スライドが縦積みで表示される（GSAP リセット）
- [ ] ナビドットのラベルが表示される
- [ ] 各スライド内のCTAリンクが正しいページへ遷移する
