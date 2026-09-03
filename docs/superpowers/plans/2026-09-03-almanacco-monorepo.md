# Almanacco Monorepo Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `almanacco-site`'s Astro source into `ikitaria-site/almanacco-src/` (no git history), keep the existing `ikitaria-site/almanacco/` build-output vendor path unchanged, and verify the two repos can be collapsed into one without changing what's actually deployed.

**Architecture:** Pure file migration + config update, no code changes. `git ls-files` in the source repo gives the exact list of tracked files to copy (this naturally excludes `node_modules/`, `dist/`, `.astro/` — they're already gitignored there). One file — `.github/workflows/deploy.yml` — is explicitly excluded because it would auto-deploy from `ikitaria-site`'s root, which isn't what anyone wants.

**Tech Stack:** Astro 5, Tailwind v4 (unchanged — this plan doesn't touch the app code, only its location)

**Spec:** `docs/superpowers/specs/2026-09-03-almanacco-monorepo-design.md`

## Global Constraints

- No git history carried over — copy current file contents only, as new commits in `ikitaria-site`
- `astro.config.mjs`'s `base: "/almanacco"` must not change — public URLs stay identical
- `.github/workflows/deploy.yml` must NOT be copied — it would auto-deploy from the wrong directory in `ikitaria-site`'s CI
- No GitHub Actions automation is being added — build stays manual
- `JohnnyDexter/almanacco` (the old repo) and the local `almanacco-site/` directory are left untouched — do not delete, modify, or push to them
- Source path for the copy: `/Users/user/GitHub/Ikitaria/almanacco-site` (absolute path, this exact machine)
- Destination repo root: `/Users/user/GitHub/Ikitaria/ikitaria-site` (absolute path, this exact machine)

---

### Task 1: Copy Almanacco source into `ikitaria-site/almanacco-src/`

**Files:**
- Create: `ikitaria-site/almanacco-src/` (entire new directory tree, contents listed in Step 1)

**Interfaces:**
- Consumes: nothing from other tasks
- Produces: the `almanacco-src/` directory tree that Task 2 will run `npm install`/`npm run build` inside

The full list of files to copy (from `git -C /Users/user/GitHub/Ikitaria/almanacco-site ls-files`, with `.github/workflows/deploy.yml` excluded per Global Constraints):

```
.gitignore
astro.config.mjs
docs/superpowers/plans/2026-09-01-home-hero-wine-focus.md
docs/superpowers/specs/2026-09-01-home-hero-wine-focus-design.md
package-lock.json
package.json
public/images/01-negozio.jpg
public/images/02-girasoli-hero.jpg
public/images/03-colline-storia.jpg
public/images/04-olive-valeri.jpg
public/images/05-botti-murola.jpg
public/images/about/cantiere-gazebo.jpg
public/images/about/cantiere-macchina-caffe.jpg
public/images/about/cantiere-notte.jpg
public/images/about/cantiere-scaffale.jpg
public/images/about/fondatori-giovanni-ikuya.jpg
public/images/contatti/mappa-tsukimidai.jpg
public/images/contatti/scale-tsukimidai.jpg
public/images/events/cottura-ragu-carote.jpg
public/images/events/cottura-ragu-pasta.jpg
public/images/events/degustazione.jpg
public/images/events/gruppo-evento.jpg
public/images/events/interno-locale-cassetta.jpg
public/images/events/interno-locale.jpg
public/images/events/mattonella-dettaglio.jpg
public/images/events/mattonella-vino.jpg
public/images/events/olio-valeri-evento.jpg
public/images/events/tagliatelle-ragu.jpg
public/images/fuji-kawaguchiko.jpg
public/images/hero-map-motif.jpg
public/images/marche/bottiglie-tappi.jpg
public/images/marche/mietitrebbia-mancini.jpg
public/images/marche/paesaggio-collina.jpg
public/images/marche/persona-colline.jpg
public/images/marche/tramonto-collina.jpg
public/images/marche/tramonto-nuvole.jpg
public/images/marche/uva-grappoli.jpg
public/images/marche/vigna-filari.jpg
public/logo-mark.jpg
public/logo-swallow-light.png
public/logo-swallow.png
public/logo.png
public/robots.txt
README.md
src/components/AboutPage.astro
src/components/BackgroundMotif.astro
src/components/CategoryGrid.astro
src/components/ContactPage.astro
src/components/Footer.astro
src/components/Header.astro
src/components/HomeHero.astro
src/components/HomePage.astro
src/components/ItalyJapan.astro
src/components/LanguageSwitcher.astro
src/components/Newsletter.astro
src/components/ShopPage.astro
src/i18n/content.ts
src/layouts/BaseLayout.astro
src/pages/en/about/index.astro
src/pages/en/contact/index.astro
src/pages/en/index.astro
src/pages/en/shop/index.astro
src/pages/it/about/index.astro
src/pages/it/contact/index.astro
src/pages/it/index.astro
src/pages/it/shop/index.astro
src/pages/ja/about/index.astro
src/pages/ja/contact/index.astro
src/pages/ja/index.astro
src/pages/ja/shop/index.astro
src/styles/global.css
src/utils/paths.ts
tsconfig.json
```

Note: this list was captured at spec-writing time. If files were added/removed in `almanacco-site` since, re-run `git -C /Users/user/GitHub/Ikitaria/almanacco-site ls-files` and use its current output instead of the list above — that command's output is the source of truth, not this static list.

- [ ] **Step 1: Copy the tracked files, excluding `.github/`**

Run (from any directory):

```bash
mkdir -p /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco-src
cd /Users/user/GitHub/Ikitaria/almanacco-site
git ls-files | grep -v '^\.github/' | tar -cf - -T - | (cd /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco-src && tar -xf -)
```

This uses `git ls-files` (so it only copies tracked files — no `node_modules/`, `dist/`, `.astro/`, or other gitignored cruft) piped through `tar` (so directory structure, including empty-looking nested dirs like `public/images/marche/`, is preserved exactly).

- [ ] **Step 2: Verify the copy is complete and `.github/` was excluded**

Run:

```bash
diff <(cd /Users/user/GitHub/Ikitaria/almanacco-site && git ls-files | grep -v '^\.github/' | sort) <(cd /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco-src && find . -type f | sed 's|^\./||' | sort)
```

Expected: no output (empty diff — the two file lists match exactly).

Also run:

```bash
ls /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco-src/.github 2>&1
```

Expected: `No such file or directory` (confirms `.github/workflows/deploy.yml` was NOT copied).

- [ ] **Step 3: Commit**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git add almanacco-src/
git status --short | grep -v '^A  almanacco-src/' | head -5
```

Expected for the second command: no output (confirms nothing outside `almanacco-src/` got staged). If there IS output, stop and report it — do not commit until the staged set is scoped to `almanacco-src/` only.

```bash
git commit -m "$(cat <<'EOF'
Add Almanacco Astro source under almanacco-src/

Copies almanacco-site's tracked files (git history not carried
over) into this repo so Almanacco's source and its vendored build
output (almanacco/) live in one place. .github/workflows/deploy.yml
was intentionally excluded — it would auto-deploy from the wrong
directory if it ran in this repo's CI. Build stays manual per the
design spec.
EOF
)"
```

---

### Task 2: Update `.gitignore` and verify the build

**Files:**
- Modify: `ikitaria-site/.gitignore`

**Interfaces:**
- Consumes: `almanacco-src/` directory tree from Task 1
- Produces: `almanacco-src/dist/` (gitignored build output) that Task 3 will compare against `almanacco/`

Current `ikitaria-site/.gitignore` content (2 lines):

```
.DS_Store
**/.DS_Store
```

- [ ] **Step 1: Add the almanacco-src ignore patterns**

Replace the full content of `/Users/user/GitHub/Ikitaria/ikitaria-site/.gitignore` with:

```
.DS_Store
**/.DS_Store

# Almanacco Astro build artifacts (source lives in almanacco-src/,
# build output is vendored separately into almanacco/)
almanacco-src/node_modules/
almanacco-src/dist/
almanacco-src/.astro/
```

- [ ] **Step 2: Verify the ignore patterns work before installing anything**

Run:

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git check-ignore -v almanacco-src/node_modules almanacco-src/dist almanacco-src/.astro
```

Expected: 3 lines of output, each showing `.gitignore:<N>:almanacco-src/...` — confirms all three patterns match before you generate the directories they're meant to hide.

- [ ] **Step 3: Install dependencies and build**

Run:

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site/almanacco-src
npm install
npm run build
```

Expected: `npm install` completes without error. `npm run build` (which runs `astro check && astro build` per this project's `package.json`) completes with `0 errors, 0 warnings` and ends with `[build] Complete!`. If `astro check` reports type errors, stop and report them — do not proceed to Task 3 with a broken build.

- [ ] **Step 4: Confirm the build output landed in the gitignored location**

Run:

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git status --short almanacco-src/
```

Expected: no output (empty) — `node_modules/`, `dist/`, and `.astro/` are all ignored, so a clean build produces zero new tracked-file changes here.

- [ ] **Step 5: Commit the .gitignore change**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git add .gitignore
git commit -m "$(cat <<'EOF'
Ignore almanacco-src build artifacts in .gitignore

node_modules/, dist/, and .astro/ under almanacco-src/ are build
outputs, not source — same convention almanacco-site's own
.gitignore used before this repo absorbed it.
EOF
)"
```

---

### Task 3: Verify build output matches the existing vendored `almanacco/` and push

**Files:**
- Read-only comparison: `ikitaria-site/almanacco-src/dist/` vs `ikitaria-site/almanacco/`
- Possibly modify: `ikitaria-site/almanacco/` (only if the diff reveals it was stale — see Step 2)

**Interfaces:**
- Consumes: `almanacco-src/dist/` produced in Task 2
- Produces: nothing consumed by later tasks (final task in this plan)

**Context:** `ikitaria-site/almanacco/` was last vendored from `almanacco-site` commit `68ab12b` (the sekki/journal/events removal, already pushed to `ikitaria-site` as commit `fe4adad`). `almanacco-src/` was just copied from the same `almanacco-site` working tree with no changes in between, so `almanacco-src/dist/` after a fresh build should be byte-identical to `almanacco/` except for content-hashed asset filenames in `_astro/` (Astro hashes build artifacts, and hashes can differ run-to-run even for identical source — this is expected and not a problem).

- [ ] **Step 1: Diff the two trees, ignoring expected hash-filename churn**

Run:

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
diff -rq almanacco-src/dist almanacco --exclude=_astro
```

Expected: no output (empty) for everything outside `_astro/` — same HTML pages, same images, same everything except the hashed CSS/JS bundle filenames.

Then check `_astro/` separately:

```bash
diff <(ls almanacco-src/dist/_astro | sed -E 's/\.[A-Za-z0-9_-]{8}\./\.HASH\./') <(ls almanacco/_astro | sed -E 's/\.[A-Za-z0-9_-]{8}\./\.HASH\./')
```

Expected: no output — same set of files once the random hash segment is stripped from each filename (e.g. `index.C4jq0riO.css` and `index.DT2h8GLM.css` both normalize to `index.HASH.css`).

- [ ] **Step 2: If Step 1 found unexpected differences, resolve before continuing**

If the first `diff -rq` command (outside `_astro/`) printed anything, or the second command found a filename with no HASH-normalized match on the other side, stop and investigate — this means `almanacco/` was vendored from different source than what's now in `almanacco-src/`, or the build isn't reproducing the same page content. Do not proceed to Step 3 with an unexplained diff.

If the diff is limited to expected hash-filename churn (Step 1 passed), `almanacco/` is already current — no changes needed to it in this task.

- [ ] **Step 3: Confirm nothing else changed and push**

```bash
cd /Users/user/GitHub/Ikitaria/ikitaria-site
git status
```

Expected: `nothing to commit, working tree clean` (Tasks 1 and 2 already committed everything relevant; `almanacco-src/dist/` is gitignored so the fresh build doesn't show up here).

```bash
git log --oneline -5
git push origin main
```

Expected: push succeeds, and `git log` shows the Task 1 and Task 2 commits on top of `fe4adad` (the last commit before this plan started).

- [ ] **Step 4: Final sanity check — confirm the live site is unaffected**

This plan doesn't change what's deployed (only where the source lives), but confirm nothing broke:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://ikitaria.com/almanacco/ja/?_cb=$(date +%s)"
```

Expected: `200`. (GitHub Pages serves whatever's already in `almanacco/` — since Task 3 Step 1-2 confirmed that directory is unchanged in content, this should already be passing before and after the push. This step is a final confirmation, not a new deploy.)
