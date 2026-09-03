import type { Lang } from "../i18n/content";

// Antepone il base path configurato in astro.config.mjs (import.meta.env.BASE_URL)
// a un percorso interno assoluto, es. "/favicon.svg" -> "/almanacco/favicon.svg".
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

// Percorso root-relative (senza base) per una lingua + slug di pagina, es.
// langHref("it", "shop") -> "/it/shop/", langHref("ja", "") -> "/ja/".
export function langHref(lang: Lang, slug: string): string {
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}
