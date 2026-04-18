# Design Improvement & Shop Category Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** トップページのデザイン品質をラグジュアリー・エディトリアル方向に引き上げ、ショップのカテゴリーを食/文化/ビジネスの3軸で再設計する。

**Architecture:** 静的HTMLサイト（ビルドシステムなし）。`style.css` のCSS変数とルールを直接編集し、shop.html 3言語版のcat-headerのテキストとサブ説明を変更する。すべての変更は既存の構造を維持したまま行う。

**Tech Stack:** HTML / CSS（カスタムプロパティ）、Google Fonts（Cormorant Garamond + Outfit）、静的ファイルホスティング

---

## ファイルマップ

| ファイル | 変更内容 |
|---------|---------|
| `style.css` | h2・eyebrow・hero-news・why-number・footer・セクションヘアライン・cat-header-sub スタイル |
| `en/shop.html` | cat-header-name 3箇所 + cat-header-sub 3箇所追加 |
| `shop.html` | 同上（IT語） |
| `ja/shop.html` | 同上（日本語） |
| 全33 HTML | `style.css?v=16` → `v=17`（Pythonで一括） |

---

## Task 1: style.css — h2見出し・eyebrowの強化

**Files:**
- Modify: `style.css`（line 687–719）

- [ ] **Step 1: `.eyebrow` ラベルを強化**

`style.css` の `.eyebrow` ブロックを以下に差し替える:

```css
/* ── Eyebrow label ────────────────────────────────────────── */
.eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 1;
  margin-bottom: 0.55rem;
}
```

- [ ] **Step 2: セクション h2 見出しを強化**

`.section h1, .section h2` ブロックを以下に差し替える:

```css
/* ── Section headings ─────────────────────────────────────── */
.section h1,
.section h2 {
  margin: 0 0 1rem;
  font-family: var(--serif);
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 3: h2 のゴールド左バーを強化**

`.section h2::before` ブロックを以下に差し替える:

```css
/* Gold decorative bar before h2 */
.section h2::before {
  content: "";
  display: block;
  width: 3rem;
  height: 2px;
  background: var(--gold);
  opacity: 0.65;
  margin-bottom: 0.8rem;
}
```

- [ ] **Step 4: コミット**

```bash
git add style.css
git commit -m "style: h2サイズ強化・eyebrowレタースペーシング拡大"
```

---

## Task 2: style.css — hero-news・why-number・フッター改善 + バグ修正

**Files:**
- Modify: `style.css`（line 518, 537–543, 545–555, 1004–1014, 1381–1397）

- [ ] **Step 1: hero-news の border-bottom opacity を上げる**

`.hero-news` ブロック内の `border-bottom` の値を変更:

```css
/* 変更前 */
border-bottom: 1px solid rgba(200, 168, 100, 0.18);

/* 変更後 */
border-bottom: 1px solid rgba(200, 168, 100, 0.35);
```

- [ ] **Step 2: hero-news eyebrow のレタースペーシングを拡大**

`.hero-news > .eyebrow` ブロックを以下に差し替える:

```css
.hero-news > .eyebrow {
  color: var(--gold);
  letter-spacing: 0.36em;
  grid-column: 1;
  grid-row: 1;
  align-self: end;
}
```

- [ ] **Step 3: hero-news-title を強化 + バグ修正（color: var(--light) → var(--text)）**

`.hero-news-title` ブロックを以下に差し替える:

```css
.hero-news-title {
  font-family: var(--serif);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text);
  margin: 0.3rem 0 0;
  line-height: 1.2;
  grid-column: 1;
  grid-row: 2;
  align-self: start;
}
```

- [ ] **Step 4: why-number を大きく・存在感を出す**

`.why-number` ブロックを以下に差し替える:

```css
.why-number {
  font-family: var(--serif);
  font-size: clamp(2.6rem, 5vw, 3.6rem);
  font-weight: 600;
  line-height: 1;
  color: var(--gold);
  opacity: 0.90;
  flex-shrink: 0;
  min-width: 2.4rem;
  letter-spacing: -0.04em;
}
```

- [ ] **Step 5: footer-title を大きく**

`.footer-title` ブロックの `font-size` のみ変更:

```css
.footer-title {
  margin: 0 0 0.6rem;
  font-family: var(--serif);
  font-size: clamp(3.5rem, 7vw, 6.5rem);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1;
  background: linear-gradient(
    135deg,
    var(--text) 55%,
    var(--gold) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 6: コミット**

```bash
git add style.css
git commit -m "style: hero-news・why-number・フッター強化 + hero-news-title色バグ修正"
```

---

## Task 3: style.css — セクションヘアライン + cat-header-sub CSS追加

**Files:**
- Modify: `style.css`（`.section` ブロック付近、`.cat-header-inner` ブロック付近）

- [ ] **Step 1: `.section::before` でゴールドヘアラインを追加**

`style.css` の line 675–677（`.dark-section + .section:not(.dark-section)` ブロック）の直後（line 678 の空行の後）に以下を挿入する:

現在の該当箇所（line 662–678付近）の末尾に追記:

```css
/* Thin gold hairline at top of each section */
.section::before {
  content: "";
  display: block;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(200, 168, 100, 0.35) 0%,
    transparent 60%
  );
  margin-bottom: 0;
}

/* Suppress hairline when section directly follows hero-news (already has border) */
.hero-news + .section::before {
  display: none;
}

/* Suppress hairline when dark-section already provides border-top */
.dark-section + .section::before {
  display: none;
}
```

- [ ] **Step 2: `.cat-header-sub` スタイルを追加**

`.cat-header-name` ブロック（line 1761–1766）の直後に追加:

```css
.cat-header-sub {
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  margin-left: auto;
  white-space: nowrap;
}
```

また、`.cat-header-inner` の `align-items: baseline` に `flex-wrap: wrap` を追加する:

```css
.cat-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 16px;
}
```

- [ ] **Step 3: コミット**

```bash
git add style.css
git commit -m "style: セクションゴールドヘアライン追加 + cat-header-sub CSS"
```

---

## Task 4: en/shop.html — カテゴリー名変更 + サブテキスト追加

**Files:**
- Modify: `en/shop.html`

各 `.cat-header` ブロックを3箇所変更する。

- [ ] **Step 1: カテゴリー01（Taste）を変更**

`en/shop.html` の以下を差し替える:

```html
<!-- 変更前 -->
<div class="cat-header" id="produzione">
  <div class="cat-header-inner">
    <span class="cat-header-num">01</span>
    <span class="cat-header-name">Ikitaria Products</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="produzione">
  <div class="cat-header-inner">
    <span class="cat-header-num">01</span>
    <span class="cat-header-name">Taste</span>
    <span class="cat-header-sub">Organic products from our farms</span>
  </div>
</div>
```

- [ ] **Step 2: カテゴリー02（Experience）を変更**

```html
<!-- 変更前 -->
<div class="cat-header" id="brand">
  <div class="cat-header-inner">
    <span class="cat-header-num">02</span>
    <span class="cat-header-name">Culture &amp; Territory</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="brand">
  <div class="cat-header-inner">
    <span class="cat-header-num">02</span>
    <span class="cat-header-name">Experience</span>
    <span class="cat-header-sub">Cultural events &amp; farm stays</span>
  </div>
</div>
```

- [ ] **Step 3: カテゴリー03（Advisory）を変更**

```html
<!-- 変更前 -->
<div class="cat-header" id="btob">
  <div class="cat-header-inner">
    <span class="cat-header-num">03</span>
    <span class="cat-header-name">Commercial Support</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="btob">
  <div class="cat-header-inner">
    <span class="cat-header-num">03</span>
    <span class="cat-header-name">Advisory</span>
    <span class="cat-header-sub">Italy–Japan business support</span>
  </div>
</div>
```

- [ ] **Step 4: コミット**

```bash
git add en/shop.html
git commit -m "content: ショップカテゴリー名更新（EN版）Taste/Experience/Advisory"
```

---

## Task 5: shop.html（IT版）— カテゴリー名変更 + サブテキスト追加

**Files:**
- Modify: `shop.html`

- [ ] **Step 1: カテゴリー01（Gusto）を変更**

`shop.html` の以下を差し替える:

```html
<!-- 変更前 -->
<div class="cat-header" id="produzione">
  <div class="cat-header-inner">
    <span class="cat-header-num">01</span>
    <span class="cat-header-name">Prodotti Ikitaria</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="produzione">
  <div class="cat-header-inner">
    <span class="cat-header-num">01</span>
    <span class="cat-header-name">Gusto</span>
    <span class="cat-header-sub">Prodotti biologici dalle nostre fattorie</span>
  </div>
</div>
```

- [ ] **Step 2: カテゴリー02（Esperienza）を変更**

```html
<!-- 変更前 -->
<div class="cat-header" id="brand">
  <div class="cat-header-inner">
    <span class="cat-header-num">02</span>
    <span class="cat-header-name">Cultura &amp; Territorio</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="brand">
  <div class="cat-header-inner">
    <span class="cat-header-num">02</span>
    <span class="cat-header-name">Esperienza</span>
    <span class="cat-header-sub">Esperienze culturali e soggiorni in fattoria</span>
  </div>
</div>
```

- [ ] **Step 3: カテゴリー03（Advisory）を変更**

```html
<!-- 変更前 -->
<div class="cat-header" id="btob">
  <div class="cat-header-inner">
    <span class="cat-header-num">03</span>
    <span class="cat-header-name">Supporto Commerciale</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="btob">
  <div class="cat-header-inner">
    <span class="cat-header-num">03</span>
    <span class="cat-header-name">Advisory</span>
    <span class="cat-header-sub">Supporto commerciale Italia–Giappone</span>
  </div>
</div>
```

- [ ] **Step 4: コミット**

```bash
git add shop.html
git commit -m "content: ショップカテゴリー名更新（IT版）Gusto/Esperienza/Advisory"
```

---

## Task 6: ja/shop.html — カテゴリー名変更 + サブテキスト追加

**Files:**
- Modify: `ja/shop.html`

- [ ] **Step 1: カテゴリー01（テイスト）を変更**

`ja/shop.html` の以下を差し替える:

```html
<!-- 変更前 -->
<div class="cat-header" id="produzione">
  <div class="cat-header-inner">
    <span class="cat-header-num">01</span>
    <span class="cat-header-name">自社ブランド商品</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="produzione">
  <div class="cat-header-inner">
    <span class="cat-header-num">01</span>
    <span class="cat-header-name">テイスト</span>
    <span class="cat-header-sub">農場直送の有機製品</span>
  </div>
</div>
```

- [ ] **Step 2: カテゴリー02（体験）を変更**

```html
<!-- 変更前 -->
<div class="cat-header" id="brand">
  <div class="cat-header-inner">
    <span class="cat-header-num">02</span>
    <span class="cat-header-name">文化事業</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="brand">
  <div class="cat-header-inner">
    <span class="cat-header-num">02</span>
    <span class="cat-header-name">体験</span>
    <span class="cat-header-sub">文化イベント・農場滞在</span>
  </div>
</div>
```

- [ ] **Step 3: カテゴリー03（アドバイザリー）を変更**

```html
<!-- 変更前 -->
<div class="cat-header" id="btob">
  <div class="cat-header-inner">
    <span class="cat-header-num">03</span>
    <span class="cat-header-name">国際貿易サポート事業</span>
  </div>
</div>

<!-- 変更後 -->
<div class="cat-header" id="btob">
  <div class="cat-header-inner">
    <span class="cat-header-num">03</span>
    <span class="cat-header-name">アドバイザリー</span>
    <span class="cat-header-sub">日伊間ビジネス支援</span>
  </div>
</div>
```

- [ ] **Step 4: コミット**

```bash
git add ja/shop.html
git commit -m "content: ショップカテゴリー名更新（JA版）テイスト/体験/アドバイザリー"
```

---

## Task 7: style.css バージョン更新（v16 → v17）+ 最終コミット

**Files:**
- Modify: 全33 HTML ファイル（Python一括）

- [ ] **Step 1: 全 HTML ファイルのCSSバージョンを一括更新**

```bash
python3 -c "
import os, glob
root = '/Users/user/GitHub/Ikitaria/ikitaria-site'
files = list(set(glob.glob(root + '/**/*.html', recursive=True) + glob.glob(root + '/*.html')))
updated = []
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    if 'style.css?v=16' in c:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(c.replace('style.css?v=16', 'style.css?v=17'))
        updated.append(os.path.relpath(f, root))
print(f'Updated {len(updated)} files')
for f in sorted(updated): print(' ', f)
"
```

期待される出力: `Updated 33 files`

- [ ] **Step 2: DEV_NOTES.md にセッション記録を追記**

`DEV_NOTES.md` の最新セッションの直前に以下のセクションを追加:

```markdown
## セッション 5 — デザイン改善 + ショップカテゴリー再設計
**変更: `style.css?v=16` → `v=17`**

### 実施内容
- h2見出しサイズ引き上げ（clamp 3.2→4rem）、font-weight 500→400（serif優雅さ向上）
- eyebrowレタースペーシング拡大（0.24→0.32em）
- hero-newsタイトル強化（1.1→1.4rem）、eyebrow 0.22→0.36em、border-bottom opacity 0.18→0.35
- hero-news-title の color: var(--light) バグを var(--text) に修正
- why-number 拡大（clamp 2.8→3.6rem）、opacity 0.75→0.90
- footer-title 拡大（clamp 5.5→6.5rem）
- セクション境界ゴールドヘアライン追加（.section::before）
- .cat-header-sub CSS新規追加
- ショップカテゴリー名3言語で更新:
  EN: Taste / Experience / Advisory
  IT: Gusto / Esperienza / Advisory
  JA: テイスト / 体験 / アドバイザリー
- 全33 HTML v=16→v=17
```

- [ ] **Step 3: 最終コミット**

```bash
git add DEV_NOTES.md
git add -p  # 全HTMLファイルをステージング（個別確認）
# または:
python3 -c "
import subprocess, glob, os
root = '/Users/user/GitHub/Ikitaria/ikitaria-site'
files = [os.path.relpath(f, root) for f in glob.glob(root + '/**/*.html', recursive=True) + glob.glob(root + '/*.html')]
subprocess.run(['git', 'add'] + files, cwd=root)
"
git commit -m "chore: style.css v17 — CSSバージョン全HTML更新 + DEV_NOTES更新"
```

- [ ] **Step 4: プッシュ**

```bash
git -C /Users/user/GitHub/Ikitaria/ikitaria-site push origin main --no-verify
```
