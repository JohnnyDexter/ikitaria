# Ikitaria サイト — Claude 向け作業メモ

## プロジェクト概要
イタリア×日本のアドバイザリー会社 Ikitaria の静的 HTML サイト。
3言語: IT（ルート）/ EN（`en/`）/ JA（`ja/`）

## 作業前に必ず読むこと
`DEV_NOTES.md` に全開発履歴が記録されている。セッション開始時は必ず読む。

## 技術的な注意事項
- Ikitaria本体（ルートの `*.html` / `en/` / `ja/`）はビルドシステムなし。HTML/CSS/JS を直接編集してコミット
- CSS バージョン: 変更時は全ページの `style.css?v=N` の番号を上げる（キャッシュバスティング）
- 画像パス: `images/` ディレクトリ（WebP + fallback JPEG 形式）
- フォーム: Formspree（`contact.html` × 3言語、`xqeekgde`のフォームIDで設定済み）
- `vendor/`: ビルドシステムがない本体サイトのために手動コピーした第三者JS（現在Three.js、`hero-distortion.js`が使用）。`almanacco-src`の`three`バージョンを上げた場合は`vendor/README.md`の手順で再コピーが必要

## NOSA（横須賀の実店舗ショップサイト、旧名 Almanacco）— `almanacco-src/` と `nosa/` の関係

店名は2026年10月に「Almanacco」から「NOSA」に変更された。ソースディレクトリ名 `almanacco-src/` は歴史的な名残で、店名とは無関係（リネームによる影響範囲が大きいため維持）。

NOSA は Astro 5 + Tailwind v4 のサブプロジェクトで、このリポジトリにモノレポとして統合されている（旧 `JohnnyDexter/almanacco` リポジトリは情報共有用の位置づけで、開発の主体はこちらに移した）。

- **`almanacco-src/`** = Astroソース一式（`src/`, `package.json`, `astro.config.mjs` 等）。**編集はここで行う**
- **`nosa/`** = `almanacco-src/` をビルドした静的HTML/CSS/JS成果物。GitHub Pages が実際に配信する場所（`ikitaria.com/nosa/...`）。**直接編集しない**（次のビルドで上書きされ、変更がサイレントに失われる）
- **`almanacco/`** = 旧URL（`ikitaria.com/almanacco/...`）からのリダイレクト専用スタブ（meta refresh）。ビルド成果物ではなく手動生成した16ファイルのみ。中身を直接編集しない
  - ⚠️ **自動で同期されない**: `nosa/` にページを追加・削除・リネームしても、このスタブは追従しない。将来ページ構成を変える場合は、ここに対応するリダイレクトの要否を都度手動で確認すること
- `astro.config.mjs` の `base: "/nosa"` は変更しないこと（公開URL `ikitaria.com/nosa/...` が変わる）

**NOSAの変更を反映する手順（手動、自動化なし）:**
```bash
cd almanacco-src
npm install   # 初回のみ
npm run build
rm -rf ../nosa
cp -r dist ../nosa
cd ..
git add almanacco-src/ nosa/
git commit -m "..."
```

詳細な設計経緯は `docs/superpowers/specs/2026-09-03-almanacco-monorepo-design.md` を参照。

## 未完了タスク
1. **Formspree ID 設定**（最重要）— フォームが現在動いていない
   - `contact.html` / `en/contact.html` / `ja/contact.html` の `YOUR_FORM_ID` を置き換える
2. Google Search Console に `sitemap.xml` を登録する

## Git リモート
`https://github.com/JohnnyDexter/ikitaria.git`（main ブランチ）
