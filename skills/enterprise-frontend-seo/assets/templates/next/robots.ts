import type { MetadataRoute } from 'next';
import { absoluteUrl } from './seo-config';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  return {
    rules: isProduction
      ? [
          { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/account/', '/checkout/'] },
        ]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
