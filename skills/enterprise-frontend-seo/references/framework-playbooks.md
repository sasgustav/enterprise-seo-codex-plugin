# Framework Playbooks

## Next.js App Router

Primary files to inspect:

- `app/layout.tsx`, `app/page.tsx`, dynamic route `page.tsx` files.
- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.*`, `app/twitter-image.*`.
- `next.config.*` for `trailingSlash`, `basePath`, redirects, rewrites, headers, image configuration, and experimental rendering settings.
- `middleware.ts` or proxy files for redirects, locale handling, bot handling, auth gates.

Implementation standards:

- Use `metadata` for static route metadata and `generateMetadata` for dynamic data.
- Avoid late client-side canonical/title mutations for public routes.
- Sanitize JSON-LD strings: at minimum replace `<` with `\u003c` before `dangerouslySetInnerHTML`.
- Generate `robots.ts` and `sitemap.ts` with `MetadataRoute` types.
- Keep production domain and locale map centralized.
- Treat `htmlLimitedBots` and streaming metadata changes as advanced; do not change defaults without evidence.

## Next.js Pages Router

Primary files to inspect:

- `pages/_app.*`, `pages/_document.*`, `pages/**`.
- `next/head` usage.
- `getStaticProps`, `getServerSideProps`, `getStaticPaths`.
- `public/robots.txt`, `public/sitemap.xml`, custom API routes that generate sitemap.

Implementation standards:

- Use `next/head` carefully per page/template.
- Build a typed SEO component or helper.
- Emit canonical and structured data server-side where possible.
- Avoid duplicate `head` tags by using stable keys.

## GatsbyJS

Primary files to inspect:

- `gatsby-config.*` for `siteMetadata.siteUrl`.
- `gatsby-node.*` for generated page context.
- Page templates and `Head` exports.
- Plugins for sitemap, robots, image, manifest, analytics.

Implementation standards:

- Prefer Gatsby Head API for page metadata.
- `Head` must be defined in pages/templates, not arbitrary components.
- Use `siteMetadata` as the fallback source for absolute URLs and brand defaults.
- Data block scripts such as JSON-LD can be emitted in `Head`.

## React SPA / Vite / CRA / custom React

Primary files to inspect:

- `index.html`, `src/main.*`, `src/index.*`, router configuration.
- `createRoot` vs `hydrateRoot`.
- Route metadata libraries or custom head management.
- Build/deploy static hosting config.

Implementation standards:

- Do not claim a CSR-only app is enterprise SEO-ready for public organic pages unless content is intentionally non-indexable or pre-rendered elsewhere.
- For public pages, implement or recommend SSR/SSG/prerendering.
- Ensure crawlable anchor links for public routes.
- Ensure analytics virtual pageviews for route changes.
- If SSR HTML exists, use `hydrateRoot`, not `createRoot`.

## Angular

Primary files to inspect:

- `angular.json`, `server.ts`, `app.routes.server.ts`, `app.config.server.ts`, `main.server.ts`.
- Route configuration and lazy-loaded modules.
- Usage of `Title`, `Meta`, `DOCUMENT`, and platform checks.

Implementation standards:

- Use Angular SSR, SSG/prerender, or hybrid rendering for public SEO pages.
- Configure route render modes intentionally.
- Use Angular `Title` and `Meta` services for page metadata.
- Avoid direct browser globals in SSR paths.
- Use server route status/headers for meaningful crawler responses.

## Cross-framework red flags

- Metadata generated only after client API calls.
- Canonical derived from `window.location` on public pages.
- Public links rendered as buttons/divs with click handlers.
- Hash routes for indexable pages.
- Global robots directives copied from staging.
- `robots.txt` blocks `/_next/static`, `/assets`, `/static`, or core CSS/JS needed for rendering.
- Sitemaps include `localhost`, staging domains, duplicate query parameters, auth pages, or 404 routes.
- JSON-LD describes content not visible to users.
- GA4 event names differ between web, app, server, and data warehouse without mapping.
