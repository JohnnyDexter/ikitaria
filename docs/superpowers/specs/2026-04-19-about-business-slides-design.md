# About ページ 事業スライド統合 — 設計書

**日付:** 2026-04-19
**対象ブランチ:** main

---

## 目的

brand.html / farm.html / support.html（3言語各）の事業内容を、about.html の横スナップセクションとして閲覧できるようにする。

サイト構造:
- TOP (index.html) = 会社概要
- About (about.html) = **事業内容（本変更で追加）**
- Shop (shop.html) = 購入

---

## 構成

### 縦スクロール部分（既存・変更なし）
- page-header (h1 "About")
- Our Story セクション
- Founders セクション（dark-section）
- Operating Principles セクション

### 横スナップ部分（新規追加）
`about.html` の `</main>` 直前に `.h-section` を追加。

```
.h-section
  .h-progress（ナビドット × 3、data-labelでラベル付き）
  .h-track
    .h-slide.about-slide  → Brand
    .h-slide.about-slide  → Production
    .h-slide.about-slide  → Advisory
```

---

## スライドコンテンツ

### Slide 1: Brand
- eyebrow: BRAND / BRAND / ブランド
- h2: Brand / Brand / ブランド
- intro paragraph（brand.html の page-header intro）
- hero画像: brand-hero.jpeg
- Events セクション（h3 + 説明 + 料金表）
- Limited-Edition Products セクション（h3 + 説明 + 料金表）
- Community セクション（h3 + 2カラム）
- CTA → brand.html / en/brand.html / ja/brand.html

### Slide 2: Production
- eyebrow: PRODUZIONE / PRODUCTION / 生産
- h2: Produzione / Production / 生産事業
- intro paragraph（farm.html の page-header intro）
- hero画像: farm-hero.jpeg
- Extra-Virgin Olive Oil セクション（h3 + 説明 + 料金表）
- Matcha セクション（h3 + 説明 + 料金表）
- Farm Rental セクション（h3 + 2カラム）
- CTA → fattoria.html / en/farm.html / ja/farm.html

### Slide 3: Advisory (BtoB Support)
- eyebrow: ADVISORY / ADVISORY / アドバイザリー
- h2: Advisory / BtoB Support / BtoB支援
- intro paragraph（support.html の page-header intro）
- hero画像: biz-hero.jpeg
- Services セクション（h3 × 3 の three-columns）
- Case Study セクション（画像 + テキスト）
- Pricing セクション（料金表）
- CTA → supporto.html / en/support.html / ja/biz.html

**FAQ: 全スライドで除外**

---

## CSS 追加（style.css v17 → v18）

```css
/* About business slide overrides */
.about-slide {
  align-items: flex-start;
  overflow-y: auto;
}

.about-slide-inner {
  padding: 3rem 6vw 4rem;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.about-slide-hero {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  margin: 1.5rem 0;
}

/* ナビドットラベル */
.h-dot[data-label]::after {
  content: attr(data-label);
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.52rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}

.h-dot[data-label] {
  position: relative;
}
```

---

## JS 変更

**なし。** shop.js は `document.querySelectorAll(".h-section")` で動作するため、about.html に `.h-section` を追加するだけで自動対応。

about.html に GSAP CDN + `shop.js` の `<script>` タグを追加する。

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `style.css` | `.about-slide` / `.about-slide-inner` / `.about-slide-hero` / `.h-dot[data-label]::after` 追加、v18 へバンプ |
| `chi-siamo.html` | 横スナップセクション追加、GSAP + shop.js 読み込み |
| `en/about.html` | 同上（英語版） |
| `ja/about.html` | 同上（日本語版） |
| 全33 HTML | `style.css?v=17` → `v=18` 一括更新 |

---

## スコープ外

- brand.html / farm.html / support.html の本体ページは変更しない（SEO用に残す）
- ナビゲーション構成の変更なし
- 新規JSファイルの作成なし
