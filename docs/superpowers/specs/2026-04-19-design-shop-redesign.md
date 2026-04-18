# Design Spec: トップページ デザイン改善 + ショップ カテゴリー再設計

**Date:** 2026-04-19
**Status:** Approved
**Scope:** `style.css`, `en/index.html`, `index.html`, `ja/index.html`, `en/shop.html`, `shop.html`, `ja/shop.html`

---

## 1. トップページ デザイン改善

### 方向性
ラグジュアリー・エディトリアル。余白は現状維持（広げない）。タイポグラフィとゴールドラインだけで格上げする。

### 変更内容

#### 1-1. セクション見出し（h2）の強化
- フォントサイズを上げる: `clamp(2rem, 4.8vw, 3.2rem)` → `clamp(2.4rem, 5.5vw, 4rem)`
- `font-weight: 500` → `font-weight: 400`（Cormorant Garamondは軽い方が優雅）
- `letter-spacing: -0.03em` → `-0.02em`（少し開く）
- ゴールド左バーの幅を広げる: `2.4rem` → `3rem`、高さを `1.5px` → `2px`

#### 1-2. eyebrow ラベルの強化
- フォントサイズ: `0.68rem` → `0.72rem`
- `letter-spacing: 0.24em` → `0.32em`（より引き締まった印象）
- ゴールドの不透明度を上げる（現在 `var(--gold)` のまま、CSS変数は変えずeyebrowだけ `opacity: 1` 明示）

#### 1-3. hero-news セクションの強化
- `hero-news-title`（"Upcoming Events"）のフォントサイズを上げる: `1.1rem` → `1.4rem`
- `eyebrow`（"NEWS"）のレタースペーシングをさらに広げる: `0.22em` → `0.36em`
- `border-bottom` のゴールドヘアラインの opacity を上げる: `rgba(200,168,100,0.18)` → `rgba(200,168,100,0.35)`

#### 1-4. Why Ikitaria セクションの番号
- `.why-number` のフォントサイズ: `clamp(2rem, 4vw, 2.8rem)` → `clamp(2.6rem, 5vw, 3.6rem)`
- `opacity: 0.75` → `opacity: 0.90`（より存在感を出す）

#### 1-5. セクション区切りのゴールドヘアライン追加
- `.section::before` で上端にゴールドヘアラインを追加:
  ```
  background: linear-gradient(90deg, rgba(200,168,100,0.35) 0%, transparent 60%)
  height: 1px
  ```
- `.hero-news + .section`（ABOUTセクション）にはすでに境界があるため追加しない
- `.dark-section + .section:not(.dark-section)` にはすでに `border-top: 1px solid var(--line)` があるため、そのセクションはヘアラインを非表示にする（重複回避）

#### 1-6. フッターのブランドタイトル
- フォントサイズ: `clamp(3rem, 6vw, 5.5rem)` → `clamp(3.5rem, 7vw, 6.5rem)`（より大きく、存在感あり）

### 制約
- 情報量・コンテンツは一切削除しない
- 余白（padding/margin）は現状から広げない
- 既存のレイアウト構造（グリッド・フレックス）は変えない

---

## 2. ショップ カテゴリー再設計

### 方針
コア3軸（食 / 文化 / ビジネス）で再設計。コンテンツ・情報量は完全維持。

### カテゴリー変更

| # | 現在 | 変更後 | 含まれるコンテンツ |
|---|------|--------|-----------------|
| 01 | Ikitaria Products | **Taste** | オリーブオイル・抹茶・ブランド商品 |
| 02 | Culture & Territory | **Experience** | 文化イベント・アグリツーリズム&ファームステイ |
| 03 | Commercial Support | **Advisory** | 戦略コンサル・マーケ&ポジショニング・セールス代行 |

### 変更箇所（HTML）
各カテゴリーヘッダー（`.cat-header` 内の `.cat-header-name`）のテキストを変更:

| # | EN（`en/shop.html`） | IT（`shop.html`） | JA（`ja/shop.html`） |
|---|-------------------|--------------------|----------------------|
| 01 | "Ikitaria Products" → **Taste** | "Prodotti Ikitaria" → **Gusto** | "自社ブランド商品" → **テイスト** |
| 02 | "Culture & Territory" → **Experience** | "Cultura & Territorio" → **Esperienza** | "文化事業" → **体験** |
| 03 | "Commercial Support" → **Advisory** | "Supporto Commerciale" → **Advisory** | "国際貿易サポート事業" → **アドバイザリー** |

### cat-header サブテキスト追加（情報量維持のため必須）
カテゴリー名が短くなるため、各 `.cat-header` に短いサブ説明を追加する。
`.cat-header-inner` 内に `<span class="cat-header-sub">` を追加:

| カテゴリー | EN サブ | IT サブ | JA サブ |
|-----------|---------|---------|---------|
| Taste / Gusto / テイスト | Organic products from our farms | Prodotti biologici dalle nostre fattorie | 農場直送の有機製品 |
| Experience / Esperienza / 体験 | Cultural events &amp; farm stays | Esperienze culturali e soggiorni in fattoria | 文化イベント・農場滞在 |
| Advisory / Advisory / アドバイザリー | Italy–Japan business support | Supporto commerciale Italia–Giappone | 日伊間ビジネス支援 |

---

## 3. 対象ファイルと変更範囲

| ファイル | 変更内容 |
|---------|---------|
| `style.css` | h2サイズ・eyebrow・why-number・hero-news・フッター・セクションヘアライン |
| `en/shop.html` | cat-header-name 3箇所変更 + cat-header-sub 追加（EN） |
| `shop.html` | 同上（IT） |
| `ja/shop.html` | 同上（JA） |
| 全33 HTMLファイル | `style.css?v=16` → `v=17` |

CSSバージョン: `v=16` → `v=17`（全HTMLファイル）

---

## 4. 実装しないこと（スコープ外）

- 余白の拡大
- 情報の削除・統合
- レイアウト構造の変更（グリッド・フレックス等）
- 新規ページ・セクションの追加
- Shopページの横スクロールメカニズム変更
