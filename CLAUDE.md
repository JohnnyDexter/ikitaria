# Ikitaria サイト — Claude 向け作業メモ

## プロジェクト概要
イタリア×日本のアドバイザリー会社 Ikitaria の静的 HTML サイト。
3言語: IT（ルート）/ EN（`en/`）/ JA（`ja/`）

## 作業前に必ず読むこと
`DEV_NOTES.md` に全開発履歴が記録されている。セッション開始時は必ず読む。

## 技術的な注意事項
- ビルドシステムなし。HTML/CSS/JS を直接編集してコミット
- CSS バージョン: 現在 `style.css?v=4`（変更時は番号を上げる）
- 画像パス: `images/` ディレクトリ（WebP + fallback JPEG 形式）
- フォーム: Formspree（`contact.html` × 3言語）— **現在 `YOUR_FORM_ID` のままで未設定**

## 未完了タスク
1. **Formspree ID 設定**（最重要）— フォームが現在動いていない
   - `contact.html` / `en/contact.html` / `ja/contact.html` の `YOUR_FORM_ID` を置き換える
2. Google Search Console に `sitemap.xml` を登録する

## Git リモート
`https://github.com/JohnnyDexter/ikitaria.git`（main ブランチ）
