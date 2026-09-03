# Almanacco ソースの ikitaria-site へのモノレポ統合 設計書

## 背景・目的

Almanacco(横須賀の実店舗)のAstroソースコードは、これまで独立したGitHubリポジトリ `JohnnyDexter/almanacco`(ローカル: `almanacco-site/`)で管理し、`npm run build` した静的出力だけを `ikitaria-site/almanacco/` に手動でコピー(vendor)する2リポジトリ構成だった。

Ikitariaがこのサイトの運用母体であり、Almanaccoはあくまで実店舗のショップサイトという位置づけであるため、ソース管理も含めて `ikitaria-site` 1リポジトリに一本化する。`JohnnyDexter/almanacco` は今後「情報共有用」程度の位置づけとし、開発の主体は `ikitaria-site` に移す。

## 対象範囲

- `almanacco-site` の現在のソースファイル一式を `ikitaria-site/almanacco-src/` にコピーする
- `ikitaria-site/.gitignore` に `almanacco-src/` 配下のビルド生成物(`node_modules/`, `dist/`, `.astro/`)を追加する
- 既存の `ikitaria-site/almanacco/`(ビルド成果物)はそのまま維持する

### 対象外(今回は行わない)

- git履歴の移植(git subtree等) — 現在のファイル内容だけを新規コミットとして追加する
- GitHub Actions等によるビルド・デプロイの自動化 — 手動ビルドフローを継続する
- `JohnnyDexter/almanacco` リポジトリの削除・アーカイブ・権限変更 — そのまま放置する
- ローカルの `/Users/user/GitHub/Ikitaria/almanacco-site` ディレクトリの削除 — 今回のタスクでは扱わない
- Almanaccoのコンテンツ・機能面の変更(直近のセッションで完了した sekki/journal/events 削除とは無関係な、純粋な置き場所の統合作業)

## 変更内容

### 1. ディレクトリ構成

```
ikitaria-site/
├── almanacco-src/       ← 新規。Astroソース一式
│   ├── package.json
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   ├── src/
│   └── public/
├── almanacco/            ← 既存のまま。ビルド成果物(GitHub Pagesが実際に配信する場所)
├── index.html / chi-siamo.html / ... (既存のIkitaria本体ページ、変更なし)
```

`astro.config.mjs` の `base: "/almanacco"` は変更しない。公開URL(`https://ikitaria.com/almanacco/...`)はこれまでと変わらない。

### 2. `.gitignore` への追加

`ikitaria-site/.gitignore` に以下を追加する(現在の `.gitignore` は `dist/`, `.astro/`, `node_modules/` 等をトップレベルの相対パスで無視しているため、これらは `almanacco-src/` 配下には及ばない — サブディレクトリ用に明示的なパターンを追加する必要がある):

```
almanacco-src/node_modules/
almanacco-src/dist/
almanacco-src/.astro/
```

### 3. ビルドフロー(手動、変更なし)

これまで別リポジトリで行っていた手順を、同じ `ikitaria-site` リポジトリ内のサブディレクトリに対して行うだけで、手順自体は変わらない。

```bash
cd ikitaria-site/almanacco-src
npm install      # 初回、または package.json 変更時のみ
npm run build
rm -rf ../almanacco
cp -r dist ../almanacco
cd ..
git add almanacco-src/ almanacco/
git commit -m "..."
git push
```

### 4. 移行手順

1. `almanacco-site` の git 管理下ファイル(`git ls-files` で列挙されるもの)を `ikitaria-site/almanacco-src/` にコピーする。`node_modules/`, `dist/`, `.astro/` はコピーしない(既に `almanacco-site/.gitignore` で無視されているため `git ls-files` には含まれない)
2. `ikitaria-site/.gitignore` を更新
3. `ikitaria-site/almanacco-src/` で `npm install` → `npm run build` を実行し、正常にビルドできることを確認する
4. ビルド成果物が既存の `ikitaria-site/almanacco/` の内容と一致する(直近のsekki/journal/events削除後の最新状態と同じ)ことを確認する
5. `almanacco-src/` を1コミットとして追加(`almanacco/` は既にコミット済みで変更なしのはずだが、念のため差分がないか確認する)
6. push

## 検証方法

- `ikitaria-site/almanacco-src` で `npm run build` が成功すること(型チェック含む)
- ビルドされた `dist/` の内容と、既存の `ikitaria-site/almanacco/` の内容を diff し、意図しない差分がないことを確認する(あるとすればビルド環境差によるファイルハッシュの変動程度)
- `git status` で `almanacco-src/node_modules/` 等が誤ってステージされていないことを確認する
- 統合後、`ikitaria-site` 単体のリポジトリだけで「Almanaccoソース編集 → ビルド → 反映」のサイクルが完結することを確認する(以後 `almanacco-site` ディレクトリを開かずに作業できるか)
