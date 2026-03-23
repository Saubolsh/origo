const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeOrigin(origin: string | undefined) {
  const raw = (origin ?? DEFAULT_SITE_URL).trim();
  // Remove trailing slash to avoid `https://x.com//path`
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function normalizeBasePathPrefix(basePath: string | undefined) {
  const raw = (basePath ?? "").trim();
  if (!raw || raw === "/") return "";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
}

function stripLeadingSlashes(path: string) {
  return path.replace(/^\/+/, "");
}

function ensureTrailingSlash(path: string) {
  return path.endsWith("/") ? path : `${path}/`;
}

export function siteOrigin() {
  return normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
}

export function basePathPrefix() {
  return normalizeBasePathPrefix(process.env.NEXT_PUBLIC_BASE_PATH);
}

export function fullUrl(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteOrigin()}${basePathPrefix()}${path}`;
}

/**
 * Creates an absolute canonical URL for a locale route.
 *
 * `pathnameWithoutLocale` must be a path starting with `/`, like:
 * `/`, `/products/`, `/categories/some-category/`.
 */
export function canonicalUrl(
  locale: string,
  pathnameWithoutLocale: string,
): string {
  const normalizedPath = pathnameWithoutLocale.startsWith("/")
    ? pathnameWithoutLocale
    : `/${pathnameWithoutLocale}`;

  const withTrailing = ensureTrailingSlash(normalizedPath);
  const canonicalPath =
    withTrailing === "/" ? `/${locale}/` : `/${locale}/${stripLeadingSlashes(withTrailing)}`;

  return fullUrl(canonicalPath);
}

export function sitemapUrl() {
  return fullUrl("/sitemap.xml");
}

