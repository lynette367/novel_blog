import siteConfig from "../site.config";

export const SITE_NAME = siteConfig.name;

function cleanUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const SITE_URL = cleanUrl(siteConfig.url);

export function absoluteUrl(path = "/"): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return `${SITE_URL}${path}`;
}
