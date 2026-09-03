# Home Hero Motion + Wine-First Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained scroll/load animation to the Home hero, reorder the category grid so wine leads oil, and update the hero copy (it/en/ja) to reflect the shop's actual sourcing (owned vineyards + partner producers, Spain and Italy).

**Architecture:** Everything lives in the existing Astro static site. The hero gets a self-contained `<style>`/`<script>` block using `data-*` attribute hooks (no new components, no new dependencies). Content changes are plain data edits in `src/i18n/content.ts`.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens in `src/styles/global.css`), vanilla TypeScript in Astro `<script>` blocks (see `src/components/Header.astro:184-202` for the existing scroll-listener pattern this follows).

**Spec:** `docs/superpowers/specs/2026-09-01-home-hero-wine-focus-design.md`

## Global Constraints

- No new npm dependencies (`astro` + `tailwindcss` only, per spec "技術方針")
- Respect `prefers-reduced-motion: reduce` — all animation must have a static fallback
- Only `src/components/HomeHero.astro`, `src/components/CategoryGrid.astro` (verify, no edit expected), and `src/i18n/content.ts` are in scope — do not touch `ShopPage.astro`, About pages, or `hero.subtitle`/`italyJapan` copy
- `npm run build` runs `astro check && astro build` — both must pass after every task (this is the project's only automated verification; there is no test runner, so manual browser verification is the functional test for this plan)

---

### Task 1: Hero load animation (stagger fade-in) + reduced-motion fallback

**Files:**
- Modify: `src/components/HomeHero.astro` (full file, 75 lines — see current content below)

**Interfaces:**
- Consumes: nothing from other tasks
- Produces: `data-hero`, `data-hero-reveal` attribute hooks and `.is-revealed` class that Task 2 and Task 3 will add sibling behavior alongside (same `<script>` block, same `<section data-hero>`)

Current file content for reference:

```astro
---
import { content, type Lang } from "../i18n/content";
import { withBase, langHref } from "../utils/paths";
import BackgroundMotif from "./BackgroundMotif.astro";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = content[lang];
---

<section class="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
  <BackgroundMotif />

  <div class="relative z-10 flex flex-col items-center px-6 py-24 text-center">
    <div class="relative flex items-center justify-center">
      <div
        class="absolute h-24 w-24 rounded-full border border-brass/40 bg-brass/10 sm:h-28 sm:w-28"
        aria-hidden="true"
      ></div>
      <img
        src={withBase("/logo-swallow.png")}
        alt=""
        class="relative h-16 w-auto sm:h-20"
        width="594"
        height="563"
      />
    </div>
    <h1 class="mt-6 font-display text-5xl uppercase tracking-[0.08em] text-charcoal sm:text-6xl">
      {t.hero.title}
    </h1>
    <p class="mt-5 max-w-lg font-subtitle text-xl italic tracking-wide text-forest sm:text-2xl">
      {t.hero.subtitle}
    </p>
    <p class="mt-4 max-w-md font-body text-base leading-relaxed text-stone-text sm:text-lg">
      {t.hero.text}
    </p>
    <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
      <a
        href={withBase(langHref(lang, "shop"))}
        class="inline-block bg-forest px-9 py-3.5 font-body text-sm uppercase tracking-[0.15em] text-ivory transition-colors hover:bg-forest/85"
      >
        {t.hero.ctaPrimary} →
      </a>
      <a
        href={withBase(langHref(lang, "journal"))}
        class="inline-block border border-charcoal/50 px-9 py-3.5 font-body text-sm uppercase tracking-[0.15em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal/5"
      >
        {t.hero.ctaSecondary} →
      </a>
    </div>
  </div>

  <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4" aria-hidden="true">
    <svg viewBox="0 0 1200 70" class="h-auto w-full max-w-3xl px-10" preserveAspectRatio="none">
      <path
        d="M0,44 C150,20 300,55 450,38 C600,22 750,50 900,34 C1000,24 1100,30 1200,18"
        fill="none"
        stroke="var(--color-brass)"
        stroke-width="1.25"
        opacity="0.85"
      />
      <image
        href={withBase("/logo-swallow.png")}
        x="900"
        y="0"
        width="90"
        height="85"
        opacity="0.85"
      />
    </svg>
  </div>
</section>
```

- [ ] **Step 1: Confirm baseline build passes**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run build`
Expected: build succeeds with no errors (this is the "before" checkpoint — if it fails now, stop and report, don't proceed).

- [ ] **Step 2: Rewrite `src/components/HomeHero.astro` with reveal hooks + animation styles**

Replace the entire file with:

```astro
---
import { content, type Lang } from "../i18n/content";
import { withBase, langHref } from "../utils/paths";
import BackgroundMotif from "./BackgroundMotif.astro";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = content[lang];
---

<section class="relative flex min-h-[90vh] items-center justify-center overflow-hidden" data-hero>
  <BackgroundMotif class="hero-parallax-bg" />

  <div class="relative z-10 flex flex-col items-center px-6 py-24 text-center">
    <div class="relative flex items-center justify-center" data-hero-reveal style="transition-delay: 0s;">
      <div
        class="absolute h-24 w-24 rounded-full border border-brass/40 bg-brass/10 sm:h-28 sm:w-28"
        aria-hidden="true"
      ></div>
      <img
        src={withBase("/logo-swallow.png")}
        alt=""
        class="relative h-16 w-auto sm:h-20"
        width="594"
        height="563"
      />
    </div>
    <h1 class="mt-6 font-display text-5xl uppercase tracking-[0.08em] text-charcoal sm:text-6xl" data-hero-reveal style="transition-delay: 0.12s;">
      {t.hero.title}
    </h1>
    <p class="mt-5 max-w-lg font-subtitle text-xl italic tracking-wide text-forest sm:text-2xl" data-hero-reveal style="transition-delay: 0.24s;">
      {t.hero.subtitle}
    </p>
    <p class="mt-4 max-w-md font-body text-base leading-relaxed text-stone-text sm:text-lg" data-hero-reveal style="transition-delay: 0.36s;">
      {t.hero.text}
    </p>
    <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row" data-hero-reveal style="transition-delay: 0.48s;">
      <a
        href={withBase(langHref(lang, "shop"))}
        class="inline-block bg-forest px-9 py-3.5 font-body text-sm uppercase tracking-[0.15em] text-ivory transition-colors hover:bg-forest/85"
      >
        {t.hero.ctaPrimary} →
      </a>
      <a
        href={withBase(langHref(lang, "journal"))}
        class="inline-block border border-charcoal/50 px-9 py-3.5 font-body text-sm uppercase tracking-[0.15em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal/5"
      >
        {t.hero.ctaSecondary} →
      </a>
    </div>
  </div>

  <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4" aria-hidden="true">
    <svg viewBox="0 0 1200 70" class="h-auto w-full max-w-3xl px-10" preserveAspectRatio="none">
      <path
        data-hero-flight-path
        d="M0,44 C150,20 300,55 450,38 C600,22 750,50 900,34 C1000,24 1100,30 1200,18"
        fill="none"
        stroke="var(--color-brass)"
        stroke-width="1.25"
        opacity="0.85"
      />
      <image
        href={withBase("/logo-swallow.png")}
        x="900"
        y="0"
        width="90"
        height="85"
        opacity="0.85"
      />
    </svg>
  </div>
</section>

<style>
  [data-hero-reveal] {
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity 0.6s ease,
      transform 0.6s ease;
  }

  [data-hero-reveal].is-revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-parallax-bg img {
    will-change: transform;
  }

  [data-hero-flight-path] {
    transition: stroke-dashoffset 1.4s ease 0.3s;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-hero-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
    }

    [data-hero-flight-path] {
      transition: none;
    }
  }
</style>
```

Note: `BackgroundMotif` already accepts a `class` prop (see `src/components/BackgroundMotif.astro:8-12`), so `class="hero-parallax-bg"` requires no changes to that component.

- [ ] **Step 3: Add the reveal script (no parallax/SVG logic yet — those are Task 2 and Task 3)**

Append before the closing `</section>` is wrong — Astro `<script>` tags go outside the template markup, after the last top-level element. Add this as a new block directly after the `<style>` block from Step 2 (still inside the same file, at the end):

```astro
<script>
  const hero = document.querySelector<HTMLElement>("[data-hero]");

  if (hero) {
    requestAnimationFrame(() => {
      const revealEls = Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-reveal]"));
      revealEls.forEach((el) => el.classList.add("is-revealed"));
    });
  }
</script>
```

- [ ] **Step 4: Run build to verify no syntax/type errors**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Manual browser verification**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run dev`
Open `http://localhost:4321/ja/` (or whatever port/base path `npm run dev` prints) in a browser.
Expected: on page load, the logo circle, title, subtitle, description, and CTA buttons fade in one after another (not all at once). Reload a few times to confirm it's consistent.

Then open DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → set to "reduce", reload the page.
Expected: all hero text/CTAs are visible immediately with no fade/slide animation.

- [ ] **Step 6: Commit**

```bash
cd /Users/user/GitHub/Ikitaria/almanacco-site
git add src/components/HomeHero.astro
git commit -m "$(cat <<'EOF'
Add stagger fade-in to Home hero on load

Logo, title, subtitle, description, and CTAs now fade in with a
short stagger instead of appearing all at once. Respects
prefers-reduced-motion by disabling the transition entirely.
EOF
)"
```

---

### Task 2: Scroll-linked background parallax

**Files:**
- Modify: `src/components/HomeHero.astro:` the `<script>` block added in Task 1

**Interfaces:**
- Consumes: `data-hero` section element and `.hero-parallax-bg` class from Task 1 (already in the file)
- Produces: nothing consumed by later tasks — this is the last script addition to this file

- [ ] **Step 1: Extend the `<script>` block to add the parallax listener**

Replace the `<script>` block from Task 1 (the whole block) with:

```astro
<script>
  const hero = document.querySelector<HTMLElement>("[data-hero]");

  if (hero) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    requestAnimationFrame(() => {
      const revealEls = Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-reveal]"));
      revealEls.forEach((el) => el.classList.add("is-revealed"));
    });

    if (!prefersReducedMotion) {
      const bgImg = hero.querySelector<HTMLImageElement>(".hero-parallax-bg img");

      if (bgImg) {
        let ticking = false;

        const updateParallax = () => {
          const offset = hero.getBoundingClientRect().top * -0.25;
          bgImg.style.transform = `translateY(${offset}px)`;
          ticking = false;
        };

        window.addEventListener(
          "scroll",
          () => {
            if (!ticking) {
              requestAnimationFrame(updateParallax);
              ticking = true;
            }
          },
          { passive: true },
        );

        updateParallax();
      }
    }
  }
</script>
```

This moves the background image at 25% of scroll offset in the opposite direction of scroll, which makes it visually lag at roughly 75% of the foreground's scroll speed — within the spec's 70-80% target.

- [ ] **Step 2: Run build to verify no syntax/type errors**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Manual browser verification**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run dev`
Open the Home page, scroll down slowly through the hero section.
Expected: the background hero photo moves slightly slower than the rest of the page (visible lag), without visible tearing or jumpiness.

Then re-enable "prefers-reduced-motion: reduce" in DevTools, reload, and scroll.
Expected: the background photo does NOT move independently of the page (no parallax offset applied — `bgImg.style.transform` is never set).

- [ ] **Step 4: Commit**

```bash
cd /Users/user/GitHub/Ikitaria/almanacco-site
git add src/components/HomeHero.astro
git commit -m "$(cat <<'EOF'
Add scroll-linked parallax to Home hero background

The hero background photo now lags behind scroll at roughly 75% of
scroll speed, using an rAF-throttled scroll listener matching the
pattern in Header.astro's transparent-header logic. Skipped entirely
when prefers-reduced-motion is set.
EOF
)"
```

---

### Task 3: Swallow flight-path draw-in animation

**Files:**
- Modify: `src/components/HomeHero.astro:` the `<script>` block from Task 2

**Interfaces:**
- Consumes: `[data-hero-flight-path]` SVG path element and `[data-hero-flight-path]` CSS transition from Task 1 (already in the file)
- Produces: nothing consumed by later tasks (last task in this plan)

- [ ] **Step 1: Extend the `<script>` block to add the SVG draw-in**

Replace the `<script>` block from Task 2 (the whole block) with:

```astro
<script>
  const hero = document.querySelector<HTMLElement>("[data-hero]");

  if (hero) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    requestAnimationFrame(() => {
      const revealEls = Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-reveal]"));
      revealEls.forEach((el) => el.classList.add("is-revealed"));
    });

    if (!prefersReducedMotion) {
      const bgImg = hero.querySelector<HTMLImageElement>(".hero-parallax-bg img");

      if (bgImg) {
        let ticking = false;

        const updateParallax = () => {
          const offset = hero.getBoundingClientRect().top * -0.25;
          bgImg.style.transform = `translateY(${offset}px)`;
          ticking = false;
        };

        window.addEventListener(
          "scroll",
          () => {
            if (!ticking) {
              requestAnimationFrame(updateParallax);
              ticking = true;
            }
          },
          { passive: true },
        );

        updateParallax();
      }

      const flightPath = hero.querySelector<SVGPathElement>("[data-hero-flight-path]");

      if (flightPath) {
        const length = flightPath.getTotalLength();
        flightPath.style.strokeDasharray = `${length}`;
        flightPath.style.strokeDashoffset = `${length}`;
        requestAnimationFrame(() => {
          flightPath.style.strokeDashoffset = "0";
        });
      }
    }
  }
</script>
```

- [ ] **Step 2: Run build to verify no syntax/type errors**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Manual browser verification**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run dev`
Open the Home page, watch the bottom of the hero section on load.
Expected: the curved brass-colored flight-path line draws itself from left to right over about 1.4s (starting slightly after page load), instead of appearing instantly.

Then re-enable "prefers-reduced-motion: reduce" in DevTools, reload.
Expected: the flight-path line is fully visible immediately (no draw-in, `strokeDasharray`/`strokeDashoffset` are never set since the reduced-motion branch is skipped).

- [ ] **Step 4: Commit**

```bash
cd /Users/user/GitHub/Ikitaria/almanacco-site
git add src/components/HomeHero.astro
git commit -m "$(cat <<'EOF'
Add draw-in animation to Home hero flight-path SVG

The brass flight-path line at the bottom of the hero now draws
itself in on load via stroke-dashoffset, using the path's actual
length from getTotalLength() rather than a guessed value. Skipped
when prefers-reduced-motion is set.
EOF
)"
```

---

### Task 4: Reorder categories (wine first) and update hero copy in all 3 languages

**Files:**
- Modify: `src/i18n/content.ts:257-262` (ja categories.items)
- Modify: `src/i18n/content.ts:502-507` (it categories.items)
- Modify: `src/i18n/content.ts:746-751` (en categories.items)
- Modify: `src/i18n/content.ts:240` (ja hero.text)
- Modify: `src/i18n/content.ts:485` (it hero.text)
- Modify: `src/i18n/content.ts:729` (en hero.text)

**Interfaces:**
- Consumes: nothing from Tasks 1-3 (independent data change)
- Produces: nothing consumed by later tasks (last task in this plan)

**Note on line numbers:** these were correct as of this plan's writing but will drift if Tasks 1-3 (which don't touch `content.ts`) or other work lands first. Use the `old_string` content below to locate the exact blocks rather than trusting line numbers blindly.

- [ ] **Step 1: Reorder ja categories.items (wine before oil)**

In `src/i18n/content.ts`, find:

```typescript
      items: [
        { title: "オイル＆調味料", image: "/images/04-olive-valeri.jpg", imageAlt: "搾油前の摘みたてオリーブ", ctaLabel: "オイルを見る" },
        { title: "ワイン＆飲料", image: "/images/05-botti-murola.jpg", imageAlt: "カンティーナの木樽と、田園へ続く入り口", ctaLabel: "カンティーナをのぞく" },
        { title: "陶器と手仕事", ctaLabel: "作り手を知る" },
        { title: "アルマナッコの日記帳", ctaLabel: "日記を読む" },
      ],
```

Replace with:

```typescript
      items: [
        { title: "ワイン＆飲料", image: "/images/05-botti-murola.jpg", imageAlt: "カンティーナの木樽と、田園へ続く入り口", ctaLabel: "カンティーナをのぞく" },
        { title: "オイル＆調味料", image: "/images/04-olive-valeri.jpg", imageAlt: "搾油前の摘みたてオリーブ", ctaLabel: "オイルを見る" },
        { title: "陶器と手仕事", ctaLabel: "作り手を知る" },
        { title: "アルマナッコの日記帳", ctaLabel: "日記を読む" },
      ],
```

- [ ] **Step 2: Reorder it categories.items (wine before oil)**

Find:

```typescript
      items: [
        { title: "Olio & Condimenti", image: "/images/04-olive-valeri.jpg", imageAlt: "Olive appena raccolte pronte per la spremitura", ctaLabel: "Scopri gli oli" },
        { title: "Vini & Bevande", image: "/images/05-botti-murola.jpg", imageAlt: "Botti di legno nella cantina, con la porta che si apre sulla campagna", ctaLabel: "Entra in cantina" },
        { title: "Ceramica & Artigianato", ctaLabel: "Conosci gli artigiani" },
        { title: "Il Diario Almanacco", ctaLabel: "Leggi il diario" },
      ],
```

Replace with:

```typescript
      items: [
        { title: "Vini & Bevande", image: "/images/05-botti-murola.jpg", imageAlt: "Botti di legno nella cantina, con la porta che si apre sulla campagna", ctaLabel: "Entra in cantina" },
        { title: "Olio & Condimenti", image: "/images/04-olive-valeri.jpg", imageAlt: "Olive appena raccolte pronte per la spremitura", ctaLabel: "Scopri gli oli" },
        { title: "Ceramica & Artigianato", ctaLabel: "Conosci gli artigiani" },
        { title: "Il Diario Almanacco", ctaLabel: "Leggi il diario" },
      ],
```

- [ ] **Step 3: Reorder en categories.items (wine before oil)**

Find:

```typescript
      items: [
        { title: "Oil & Condiments", image: "/images/04-olive-valeri.jpg", imageAlt: "Freshly harvested olives ready for pressing", ctaLabel: "Discover the oils" },
        { title: "Wine & Beverages", image: "/images/05-botti-murola.jpg", imageAlt: "Wooden barrels in the cellar, with the door opening onto the countryside", ctaLabel: "Step into the cellar" },
        { title: "Ceramics & Crafts", ctaLabel: "Meet the artisans" },
        { title: "The Almanacco Diary", ctaLabel: "Read the diary" },
      ],
```

Replace with:

```typescript
      items: [
        { title: "Wine & Beverages", image: "/images/05-botti-murola.jpg", imageAlt: "Wooden barrels in the cellar, with the door opening onto the countryside", ctaLabel: "Step into the cellar" },
        { title: "Oil & Condiments", image: "/images/04-olive-valeri.jpg", imageAlt: "Freshly harvested olives ready for pressing", ctaLabel: "Discover the oils" },
        { title: "Ceramics & Crafts", ctaLabel: "Meet the artisans" },
        { title: "The Almanacco Diary", ctaLabel: "Read the diary" },
      ],
```

- [ ] **Step 4: Update hero.text copy in all 3 languages**

In `src/i18n/content.ts`, find the ja hero block's `text` line:

```typescript
      text: "横須賀にあるイタリアの小さな店。マルケ州から届く、オイルとワイン、工芸品、そして物語。",
```

Replace with:

```typescript
      text: "横須賀にあるイタリアの小さな店。自社の畑や提携生産者が手がける、スペインとイタリアのワインとオリーブオイル。",
```

Find the it hero block's `text` line:

```typescript
      text: "Una bottega italiana a Yokosuka. Olio, vino, artigianato e storie dalle Marche.",
```

Replace with:

```typescript
      text: "Una bottega italiana a Yokosuka: vini e olio dai nostri vigneti e da produttori partner, tra Spagna e Italia.",
```

Find the en hero block's `text` line:

```typescript
      text: "An Italian shop in Yokosuka. Oil, wine, craft, and stories from the Marche.",
```

Replace with:

```typescript
      text: "An Italian shop in Yokosuka: wines and olive oil from our own vineyards and partner producers, across Spain and Italy.",
```

- [ ] **Step 5: Run build to verify no syntax/type errors**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Manual browser verification across all 3 languages**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run dev`
Open `/ja/`, `/it/` (root), and `/en/` Home pages.
Expected on each: the hero description text matches the new copy above, and in the 4-item category grid, "Wine & Beverages" (in that language) appears before "Oil & Condiments" — the ceramics and diary placeholders stay in their original 3rd/4th positions with their existing icon artwork (unaffected by this change).

Also check the Shop page (`/shop/` in each language) still shows oil listed before wine — this is Task 4's `content.ts` change only affecting the Home grid, `ShopPage.astro`'s own hardcoded `groups` array order is intentionally untouched per the spec's "対象外" section.

- [ ] **Step 7: Production-build verification (all 4 tasks combined)**

Run: `cd /Users/user/GitHub/Ikitaria/almanacco-site && npm run build && npm run preview`
Open the printed local preview URL for `/ja/`, `/it/`, and `/en/` Home pages.
Expected: same as Step 6 (copy, category order) plus the Task 1-3 animations (stagger fade-in, background parallax on scroll, flight-path draw-in) all work against the production build output, not just the dev server. Also confirm no layout regression — header height, mobile viewport (resize browser to ~375px width) still render correctly.

- [ ] **Step 8: Commit**

```bash
cd /Users/user/GitHub/Ikitaria/almanacco-site
git add src/i18n/content.ts
git commit -m "$(cat <<'EOF'
Lead with wine in Home categories and hero copy (it/en/ja)

Reorders the Home category grid to show Wine & Beverages before Oil
& Condiments, and rewrites hero.text to name the actual sourcing
(owned vineyards + partner producers, Spain and Italy) instead of
the old Marche-only phrasing. Shop page's own category order is
intentionally left as-is per spec scope.
EOF
)"
```
