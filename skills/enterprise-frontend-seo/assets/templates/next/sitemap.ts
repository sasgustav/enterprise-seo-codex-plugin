import type { MetadataRoute } from 'next';
import { absoluteUrl } from './seo-config';

type PublicRoute = {
  path: string;
  lastModified?: string | Date;
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority?: number;
};

async function getPublicRoutes(): Promise<PublicRoute[]> {
  // Replace with CMS/database inventory. Include only canonical, indexable URLs.
  return [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/sobre', changeFrequency: 'monthly', priority: 0.5 },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getPublicRoutes();

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
