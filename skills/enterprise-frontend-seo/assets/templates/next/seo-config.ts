// Next.js App Router SEO helpers.
// Configure NEXT_PUBLIC_SITE_URL in production, e.g. https://www.example.com.

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!rawSiteUrl && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_SITE_URL is required in production');
}

export const SITE_URL = new URL(rawSiteUrl ?? 'https://www.example.com');
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Example';
export const DEFAULT_OG_IMAGE = '/og/default.jpg';

export function absoluteUrl(pathname: string = '/'): string {
  const url = new URL(pathname, SITE_URL);
  url.hash = '';
  return url.toString();
}

export function canonicalPath(pathname: string): string {
  if (!pathname.startsWith('/')) return `/${pathname}`;
  return pathname;
}

export function safeDescription(input: string | null | undefined, fallback: string): string {
  const value = String(input ?? '').replace(/\s+/g, ' ').trim();
  return value.length >= 50 ? value.slice(0, 300) : fallback;
}
