import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

export function Seo({ title, description, pathname = '/', image, noindex = false, children }) {
  const { site } = useStaticQuery(graphql`
    query SeoSiteMetadata {
      site {
        siteMetadata {
          title
          description
          siteUrl
          image
        }
      }
    }
  `);

  const meta = site.siteMetadata;
  const seoTitle = title ? `${title} | ${meta.title}` : meta.title;
  const seoDescription = description || meta.description;
  const canonical = new URL(pathname, meta.siteUrl).toString();
  const ogImage = new URL(image || meta.image || '/og/default.jpg', meta.siteUrl).toString();

  return (
    <>
      <html lang="pt-BR" />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={canonical} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      {children}
    </>
  );
}
