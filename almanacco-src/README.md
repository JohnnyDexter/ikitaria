# Almanacco

Sito del negozio **Almanacco** (Yokosuka, Giappone), che porta olio extravergine
d'oliva e vino delle Marche in Giappone. Costruito con [Astro](https://astro.build)
e [Tailwind CSS v4](https://tailwindcss.com), in tre lingue: giapponese (`/ja/`,
lingua di default), italiano (`/it/`) e inglese (`/en/`).

## Struttura

```
src/
  components/     componenti UI e sezioni di pagina (Hero, Storia, Prodotti, ...)
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

Questo progetto vive come sottocartella (`almanacco-src/`) dentro il
monorepo `ikitaria-site`. Non viene deployato direttamente su Cloudflare
Pages/Vercel: l'output di `npm run build` (cartella `dist/`) va copiato
manualmente nella cartella sorella `../almanacco/`, che è quella
effettivamente servita da GitHub Pages su `ikitaria.com/almanacco/`.

```bash
cd almanacco-src
npm install   # solo la prima volta
npm run build
rm -rf ../almanacco
cp -r dist ../almanacco
cd ..
git add almanacco-src/ almanacco/
git commit -m "..."
```

Dettagli sulla struttura del monorepo:
`../docs/superpowers/specs/2026-09-03-almanacco-monorepo-design.md`.

## Contenuti

I testi delle tre lingue vivono in `src/i18n/content.ts`: non sono traduzioni
letterali parola per parola, ma versioni equivalenti nel significato,
adattate a ciascuna lingua.
