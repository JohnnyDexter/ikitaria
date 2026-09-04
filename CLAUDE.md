# Ikitaria サイト — Claude 向け作業メモ

## プロジェクト概要
イタリア×日本のアドバイザリー会社 Ikitaria の静的 HTML サイト。
3言語: IT（ルート）/ EN（`en/`）/ JA（`ja/`）

## 作業前に必ず読むこと
`DEV_NOTES.md` に全開発履歴が記録されている。セッション開始時は必ず読む。

## 技術的な注意事項
- Ikitaria本体（ルートの `*.html` / `en/` / `ja/`）はビルドシステムなし。HTML/CSS/JS を直接編集してコミット
- CSS バージョン: 現在 `style.css?v=4`（変更時は番号を上げる）
- 画像パス: `images/` ディレクトリ（WebP + fallback JPEG 形式）
- フォーム: Formspree（`contact.html` × 3言語）— **現在 `YOUR_FORM_ID` のままで未設定**

## Almanacco（横須賀の実店舗ショップサイト）— `almanacco-src/` と `almanacco/` の関係

Almanacco は Astro 5 + Tailwind v4 のサブプロジェクトで、このリポジトリにモノレポとして統合されている（旧 `JohnnyDexter/almanacco` リポジトリは情報共有用の位置づけで、開発の主体はこちらに移した）。

- **`almanacco-src/`** = Astroソース一式（`src/`, `package.json`, `astro.config.mjs` 等）。**編集はここで行う**
- **`almanacco/`** = `almanacco-src/` をビルドした静的HTML/CSS/JS成果物。GitHub Pages が実際に配信する場所。**直接編集しない**（次のビルドで上書きされ、変更がサイレントに失われる）
- `astro.config.mjs` の `base: "/almanacco"` は変更しないこと（公開URL `ikitaria.com/almanacco/...` が変わる）

**Almanaccoの変更を反映する手順（手動、自動化なし）:**
```bash
cd almanacco-src
npm install   # 初回のみ
npm run build
rm -rf ../almanacco
cp -r dist ../almanacco
cd ..
git add almanacco-src/ almanacco/
git commit -m "..."
```

詳細な設計経緯は `docs/superpowers/specs/2026-09-03-almanacco-monorepo-design.md` を参照。

## 未完了タスク
1. **Formspree ID 設定**（最重要）— フォームが現在動いていない
   - `contact.html` / `en/contact.html` / `ja/contact.html` の `YOUR_FORM_ID` を置き換える
2. Google Search Console に `sitemap.xml` を登録する

## Git リモート
`https://github.com/JohnnyDexter/ikitaria.git`（main ブランチ）
