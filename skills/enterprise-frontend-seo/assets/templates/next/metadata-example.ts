import type { Metadata } from 'next';
import { absoluteUrl, canonicalPath, DEFAULT_OG_IMAGE, SITE_NAME } from './seo-config';

type BuildMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  indexable?: boolean;
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(canonicalPath(input.pathname));
  const image = absoluteUrl(input.image ?? DEFAULT_OG_IMAGE);

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: input.indexable === false ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url: canonical,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
