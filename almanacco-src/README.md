# Almanacco

Sito del negozio **Almanacco** (Yokosuka, Giappone), che porta olio extravergine
d'oliva e vino delle Marche in Giappone. Costruito con [Astro](https://astro.build)
e [Tailwind CSS v4](https://tailwindcss.com), in tre lingue: giapponese (`/ja/`,
lingua di default), italiano (`/it/`) e inglese (`/en/`).

## Struttura

```
src/
  components/     componenti UI e sezioni di pagina (Hero, Storia, Prodotti, ...)
  data/           dati statici (calendario/sekki)
  i18n/           dizionario dei contenuti tradotti (ja / it / en)
  layouts/        layout HTML condiviso
  pages/
    ja/index.astro   homepage giapponese (lingua di default)
    it/index.astro   homepage italiana
    en/index.astro   homepage inglese
  styles/         CSS globale e tema Tailwind
public/           asset statici (favicon, robots.txt)
```

La root `/` reindirizza automaticamente a `/ja/`.

## Sviluppo

Requisiti: Node.js 18.20+ o 20.3+ (consigliato Node 22).

```bash
npm install
npm run dev
```

Il sito sarà disponibile su `http://localhost:4321`.

## Build

```bash
npm run build
```

L'output statico viene generato nella cartella `dist/`. Per una anteprima
locale della build di produzione:

```bash
npm run preview
```

## Deploy

Il sito è statico (HTML/CSS/JS), quindi si presta bene a piattaforme di
hosting statico come **Cloudflare Pages** o **Vercel**.

### Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 o superiore

### Vercel

- Framework preset: Astro (rilevato automaticamente)
- Build command: `npm run build`
- Output directory: `dist`

## Contenuti

I testi delle tre lingue vivono in `src/i18n/content.ts`: non sono traduzioni
letterali parola per parola, ma versioni equivalenti nel significato,
adattate a ciascuna lingua. I dati del calendario agricolo italiano e dei 24
sekki giapponesi, usati nella "ruota dell'almanacco" della sezione hero, sono
in `src/data/calendar.ts`.
