export const SITE_NAME = "Cross The Line";
const FALLBACK_URL = "https://www.crosstheline.press";

function cleanUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const SITE_URL = cleanUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL);

export function absoluteUrl(path = "/"): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return `${SITE_URL}${path}`;
}
