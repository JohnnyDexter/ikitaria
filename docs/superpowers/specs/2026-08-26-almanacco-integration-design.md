# Design Spec: Ikitariaサイトへの Almanacco 統合 + ヘッダーナビ再設計

**Date:** 2026-08-26
**Status:** Approved
**Scope:** `index.html`, `en/index.html`, `ja/index.html`（および全既存ページのヘッダー/フッター）, `shop.html`→事業概要ページへリネーム, `chi-siamo.html`（廃止・統合）, 新規 `almanacco/` フォルダ, 別リポジトリ `JohnnyDexter/almanacco` の `astro.config.mjs` と共通レイアウト

---

## 背景・目的

Ikitaria（イタリア×日本のアドバイザリー会社）のウェブサイトに、実店舗ブランド「Almanacco」（横須賀の実店舗。マルケ州のオリーブオイル・ワインを扱う）の情報をリッチに統合する。Almanaccoは現時点で独自ドメインを取得する予定がないため、Ikitariaのサイト内（`ikitaria.com/almanacco/`）にすべてのページ（about / shop / events / journal / sekki / contact）を配置し、既存の `JohnnyDexter/almanacco` リポジトリ（Astro + Tailwind CSS製、ja/it/en 3言語）のコンテンツをそのまま活用する。

## 1. Almanaccoコンテンツの統合方式

### 採用方式: Astroビルド成果物のサブフォルダ配置

- `almanacco` リポジトリで `npm run build` を実行し、生成される `dist/`（`it/` `en/` `ja/` 各6ページ = 計21ページ + 共通アセット）を `ikitaria-site/almanacco/` にそのままコピーして `ikitaria-site` リポジトリにコミット・pushする。
- `almanacco/astro.config.mjs` はすでに `base: "/almanacco"` および `redirects: { "/": "/almanacco/ja/" }` が設定済みであり、ビルド後のHTML内のアセット参照（CSS/JS/画像）はすべて `/almanacco/...` の絶対パスになっている（`npm run build` で実機検証済み）。そのため `ikitaria.com/almanacco/` に配置するだけでそのまま正しく動作する。
- `ikitaria-site` は元々ビルドレスで静的ファイルをGitHub Pages（カスタムドメイン `ikitaria.com`、mainブランチのルートを配信）にpushするだけの運用であり、`almanacco/` フォルダを追加してpushする作業は既存の運用フローと一致する。
- この方式により、Almanaccoの既存デザイン（Tailwind CSS）・データ駆動のコンテンツ構造（`src/i18n/content.ts`, `src/data/calendar.ts`, `src/data/sekkiProducts.ts`）・インタラクティブなコンポーネント（例: 24節気を表示するSVGカレンダーホイール `SekkiWidget.astro` の前後ボタン操作）は、コンパイル済みの静的HTML/CSS/JSとしてそのまま完全に保持される。Astroはビルド時にのみ必要で、コピー後の配信時にAstro自体は一切不要。
- コピー完了後は `ikitaria-site` リポジトリ単体で完結し、日常のサイト運用上 `almanacco` リポジトリへの依存はなくなる。今後Almanaccoのコンテンツ（商品・イベント情報等）を更新したい場合のみ、`almanacco` リポジトリ側でAstroソースを編集し再ビルド・再コピーする。

### almanacco リポジトリ側の最小変更（2点のみ）

1. `astro.config.mjs` の `site: "https://johnnydexter.github.io"` を `site: "https://ikitaria.com"` に修正する（canonical URL・OGPタグを正しくするため）。
2. 共通レイアウト（`src/components/Header.astro` および/または `Footer.astro`）に、Ikitariaへ戻る小さなリンクを1箇所追加する。Almanacco側の言語（ja/it/en）とIkitaria側の言語（it/en/ja）は独立しているため、機械的に対応させる：
   - Almanacco `ja` ページ → `https://ikitaria.com/ja/`
   - Almanacco `it` ページ → `https://ikitaria.com/`（ITがIkitariaのルート言語）
   - Almanacco `en` ページ → `https://ikitaria.com/en/`
   - それ以外のデザイン・コンポーネント・データ構造は一切変更しない。

### 更新運用

手動運用とする（YAGNI）。GitHub Actions等による自動ビルド・自動同期は導入しない。更新頻度が低いため、必要になった時点で改めて自動化を検討する。

## 2. Ikitariaサイトのヘッダーナビゲーション再設計

### 新ヘッダー構成（it / en / ja 全ページ共通）

```
Home / 事業概要 / ショップ ▾ / オンラインショップ / 問い合わせ
                    ├─ 日本（Almanacco） → /almanacco/{lang}/about/
                    └─ イタリア（準備中） → クリック不可・グレー表示のみ（リンクなし）
```

- 「ショップ」は既存の言語切替（`<details class="lang-dropdown">`）と同じ `<details>` ドロップダウン実装パターンを踏襲し、大きめに表示する。
- 「日本」項目はAlmanaccoの `about` ページ（実店舗情報：所在地・営業時間・ストーリー）にリンクする。そこからAlmanacco自身の内部ナビ（shop / events / journal / sekki / contact）で回遊できる。
- 「イタリア」項目は準備中のためクリック不可・グレー表示のみとし、専用ページは作らない（実装コスト最小）。
- 「オンラインショップ」はAlmanaccoの `shop` ページ（商品一覧・購入導線）に直接リンクする。
- 「問い合わせ」は既存 `contact.html` のリネームのみ（機能変更なし）。
- サイト自体がビルドレスの静的HTML（it/en/ja個別ファイル）のため、各言語ページのリンク先には対応する `{lang}`（`it`/`en`/`ja`）を個別に埋め込む（例: `en/index.html` の「オンラインショップ」は `/almanacco/en/shop/` を指す）。

## 3. 事業概要ページ（旧 `shop.html` のリネーム + `chi-siamo.html` 統合）

- 既存の `shop.html`（Olio Extravergine d'Oliva / Matcha / Prodotti Brand / Eventi Culturali / Agriturismo & Farm Stay / Consulenza Strategica / Marketing & Posizionamento / Rappresentanza Commerciale の8事業ライン紹介）を、`business.html`（it）/ `en/business.html` / `ja/business.html` として新規作成する（既存の `contact.html` が英語スラッグを採用している慣例に合わせる）。中身は `shop.html` の内容をベースにする。
- 既存 `chi-siamo.html` の会社の理念・ストーリー文を、この新ページの冒頭に統合する。
- 旧 `shop.html`（it/en/ja）と `chi-siamo.html`（it/en/ja）は削除せず、`<meta http-equiv="refresh" content="0; url=business.html">` による新ページへのリダイレクトページに置き換える（旧URLへの流入・既存の外部リンク切れを防ぐため）。
- サイト内の他ページ・フッターにある `chi-siamo.html` / `shop.html` への参照リンクは、すべて新しい `business.html` とナビラベル「事業概要」に更新する。

## 4. テスト方針

- ローカルで `ikitaria-site` を静的サーバー（例: `python3 -m http.server`）で起動し、以下を目視確認する：
  - 新ヘッダー（Home / 事業概要 / ショップ▾ / オンラインショップ / 問い合わせ）が it/en/ja 全ページで正しく表示・遷移すること
  - 事業概要ページに旧shop内容とchi-siamo内容が両方含まれ、リンク切れがないこと
  - `chi-siamo.html` への旧リンクが新ページへ正しく誘導されること
  - `/almanacco/` 配下の全21ページ（it/en/ja × about/shop/events/journal/sekki/contact + トップ）がリンク切れなく遷移できること
  - 各言語ページの「ショップ→日本」「オンラインショップ」のリンク先が、そのページと同じ言語のAlmanaccoページになっていること
  - Almanacco側に追加した「Ikitariaへ戻る」リンクが、対応する言語のIkitariaページに正しく戻ること
  - 「イタリア（準備中）」がクリックできずグレー表示になっていること

## 5. 影響範囲まとめ

| リポジトリ | 変更内容 |
|---|---|
| `ikitaria-site`（`JohnnyDexter/ikitaria`） | ヘッダーnav変更（it/en/ja 全ページ）、`shop.html` → 事業概要ページへリネーム＆`chi-siamo.html`統合、`chi-siamo.html`はリダイレクト用に置き換え、`almanacco/`フォルダ新規追加（vendored dist） |
| `almanacco`（`JohnnyDexter/almanacco`） | `astro.config.mjs` の `site` フィールド修正、共通レイアウトに「Ikitariaへ戻る」リンク追加 |

## 6. スコープ外（今回やらないこと）

- Almanaccoコンテンツの自動同期（GitHub Actions等）
- 「イタリア」店舗の専用ページ作成
- Almanaccoのデザイン・コンポーネント・データ構造そのものの変更（戻りリンク追加を除く）
- Ikitaria既存デザインとAlmanaccoデザインの統一（意図的に別デザインのまま共存させる）
