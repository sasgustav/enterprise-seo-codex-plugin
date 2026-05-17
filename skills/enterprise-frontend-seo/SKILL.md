---
name: enterprise-frontend-seo
description: Use this skill for enterprise-grade technical SEO audits and implementation in Next.js, GatsbyJS, React, Angular, and other JavaScript frontends, including crawlability, indexability, rendering strategy, metadata, canonical/hreflang, structured data, sitemaps, robots.txt, Core Web Vitals, GA4/GTM/Search Console instrumentation, analytics taxonomies, and production verification. Do not use it for generic marketing copy unless technical SEO or analytics implementation is required.
---

# Enterprise Frontend SEO Skill

## Developer

Developed and maintained by [Gustavo Vasconcelos](https://www.linkedin.com/in/gustavo-vasconcelos-software-engineer/).

## Mission

Deliver production-grade SEO and analytics engineering for high-traffic web properties. Treat every change as if the application may serve millions of monthly organic visits and must be safe, measurable, reversible, and reviewable.

The outcome is not a checklist. The outcome is a verified implementation or an audit with prioritized fixes, concrete diffs, and explicit evidence.

## Operating rules

1. Inspect the repository before prescribing changes. Identify the framework, routing model, rendering mode, deployment constraints, package manager, analytics stack, and existing SEO conventions.
2. Prefer the smallest safe implementation that follows the repository's architecture. Do not replace the stack, routing model, or analytics approach unless there is a clear technical reason.
3. Do not invent credentials, property IDs, container IDs, domains, verification tokens, Search Console access, API access, or legal/privacy decisions. Use placeholders only when the repository needs them, and clearly label placeholders.
4. For public, indexable pages, prefer server-rendered, statically generated, prerendered, or hydrated HTML where meaningful content, links, title, meta description, canonical, robots directives, and structured data are present without relying on late client-side mutation.
5. Treat dynamic rendering for bots as a last-resort workaround, not a default architecture.
6. Never add tracking that collects personally identifiable information unless the user explicitly supplies a compliant data contract and consent model.
7. Use framework-native APIs where possible: Next.js Metadata API and metadata file conventions, Gatsby Head API, Angular SSR/prerendering plus Title/Meta services, and React hydration/server-rendering conventions.
8. Every implementation must include verification: lint/typecheck/tests where available, build if feasible, plus a manual QA checklist for browser, crawler, analytics, and structured-data validation.
9. When external validation requires accounts or network access, explain the exact validation step rather than pretending it was completed.
10. Keep output executive-readable: summarize impact, risk, files changed, commands run, failures, and remaining manual steps.

## Initial repository triage

Before changing code, answer these questions from the codebase:

- Framework: Next.js App Router, Next.js Pages Router, Gatsby, React SPA, Angular, hybrid/microfrontend, other.
- Rendering: SSG, SSR, ISR/revalidation, CSR, prerender, hybrid, edge rendering, static export.
- Routes: static routes, dynamic routes, catch-all routes, localized routes, faceted URLs, private/auth routes.
- SEO surfaces: metadata implementation, canonical generation, robots directives, sitemap generation, hreflang, Open Graph/Twitter, structured data, pagination, breadcrumbs.
- Analytics surfaces: Google Tag Manager, Google tag/gtag, GA4, Search Console verification, Ads tags, pixels, consent/CMP, server-side tagging, dataLayer schema, ecommerce events.
- Quality gates: test scripts, build command, lint command, typecheck command, Playwright/Cypress, Lighthouse/PageSpeed, web-vitals reporting.

If no automated scan exists, run `scripts/seo-audit.mjs` from this skill as a first-pass heuristic scanner when feasible.

## Severity model

Use this model for audits and code reviews:

- P0 / Critical: organic traffic can be blocked, hidden, deindexed, miscanonicalized, mislocalized, or mismeasured. Examples: global `noindex`, disallowed public routes, missing SSR/prerender for critical public pages, broken sitemap for millions of URLs, wrong canonical domain, duplicate GA4 purchase events, PII in analytics payloads.
- P1 / High: substantial SEO, analytics, or performance degradation. Examples: missing canonical on dynamic pages, incorrect hreflang reciprocity, non-crawlable internal links, missing product/article/schema for strategic templates, soft 404 patterns, no SPA virtual pageviews, heavy JavaScript hurting LCP/INP.
- P2 / Medium: quality and completeness issues. Examples: weak metadata fallback, duplicate descriptions, missing OG tags, incomplete image alt text patterns, no sitemap partitioning by content type, missing debug documentation.
- P3 / Low: polish and maintainability. Examples: inconsistent naming, duplicated SEO helper logic, lack of comments around analytics events, report formatting issues.

## Audit dimensions

Evaluate all relevant dimensions:

### Crawlability and indexability

- Public pages return meaningful HTTP status codes.
- Public links are crawlable anchors with `href`; do not rely on click handlers or hash fragments for indexable navigation.
- `robots.txt` allows strategic public areas and blocks only intentional private/duplicate surfaces.
- Page-level robots directives are intentional; no accidental `noindex`, `nofollow`, `nosnippet`, or restrictive `X-Robots-Tag`.
- Error pages use true 404/410 where supported; CSR soft-404 patterns are avoided.
- Private/auth routes are not exposed in sitemap.

### Rendering strategy

- Public SEO-critical content appears in initial HTML or in a crawler-safe server/prerendered path.
- Client-only rendering is acceptable for authenticated, utility, dashboard, and non-indexable pages.
- Hydration mismatches are treated as bugs.
- Avoid browser-only APIs in server-rendered code paths unless properly guarded.

### Metadata

- Each indexable template has deterministic title, meta description, canonical, robots directive, Open Graph, Twitter card, and image fallback.
- Canonicals are absolute, normalized, and point to the preferred URL in the same language/locale where applicable.
- Metadata is not personalized for indexable pages unless the page is intentionally non-indexable.
- Metadata fallbacks never produce `undefined`, empty strings, placeholder IDs, development domains, or wrong environments.

### International SEO

- `hreflang` is complete, reciprocal, self-referential, and uses fully qualified URLs.
- Language/locale routes have deterministic canonical and alternate mappings.
- Do not use `hreflang` or HTML `lang` as the only method for language detection; content and URL strategy must be coherent.

### Structured data

- Use JSON-LD where possible.
- JSON-LD reflects visible page content and is not misleading.
- Sanitize JSON-LD payloads where user/content data may include hostile strings.
- Use suitable schema types per template: Organization, WebSite, BreadcrumbList, Article, NewsArticle, Product, Offer, AggregateRating, FAQPage only where eligible, Event, LocalBusiness, Course, VideoObject, Dataset, SoftwareApplication, ProfilePage, etc.
- Validate with Rich Results Test or Schema Markup Validator when network/account access is available.

### Sitemaps and URL inventory

- Generate only canonical, indexable URLs.
- Split large sitemap sets by type, locale, and update cadence when scale requires it.
- Respect search engine limits: individual sitemaps should stay within protocol constraints, and sitemap indexes should be used for scale.
- Include `lastmod` only when reliable. Do not fabricate update dates.
- Include image/video/news/hreflang extensions only when data is accurate and supported.

### Core Web Vitals and frontend performance

- Prioritize LCP, INP, and CLS.
- Inspect render-blocking CSS/JS, font loading, image delivery, lazy loading, hydration cost, third-party tags, long tasks, bundle bloat, excessive client components, and cache headers.
- For high-traffic pages, optimize by template and traffic segment, not by isolated demo pages.
- Measure both lab and field data where available.

### Analytics and measurement

- Prefer a documented event taxonomy before adding events.
- Avoid duplicate pageviews in SSR + SPA navigations.
- SPA route transitions must send accurate virtual pageviews when automatic history tracking is not enough.
- Ecommerce implementations must use GA4 recommended ecommerce events and item arrays where relevant.
- Use GTM/dataLayer for enterprise multi-tag governance when appropriate; use direct `gtag.js` only when simpler and approved.
- Add debug hooks and QA steps for GA4 DebugView, Tag Assistant, browser network calls, and dataLayer inspection.
- Enforce consent mode/CMP integration where applicable. Never bypass consent requirements.

### Search Console and webmaster tooling

- Implement Search Console verification tokens only when provided.
- Add sitemap references in `robots.txt` and framework-native sitemap generation.
- If Search Console API access is available, report search analytics, index status, URL inspection, and sitemap issues. If not available, provide manual validation steps.
- Consider Bing Webmaster Tools, IndexNow, log-file analysis, CDN logs, and rank/visibility tools when the organization uses them.

## Framework playbooks

### Next.js

- App Router: use `metadata`, `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, `opengraph-image`, `twitter-image`, and route-level conventions.
- Pages Router: use `_document`, `_app`, `next/head`, SSR/SSG functions, and public metadata files as appropriate.
- Prefer static generation/ISR for stable public pages, SSR for request-specific public content, and CSR for non-indexable private surfaces.
- JSON-LD should be emitted as native `<script type="application/ld+json">` in a server-rendered layout/page, sanitized for unsafe characters.
- Use `next/script` strategies for executable analytics scripts, not for JSON-LD.
- Use `useReportWebVitals` or supported framework hooks only when measurement integration is requested.

### GatsbyJS

- Prefer Gatsby Head API over legacy React Helmet when the project version supports it.
- Use `siteMetadata.siteUrl` and GraphQL data to build absolute URLs.
- Implement reusable SEO components that expose sane defaults and per-page overrides.
- Use static HTML output as the primary SEO surface.
- Emit JSON-LD data blocks in `Head` where appropriate.
- Ensure generated pages/templates define their own required head tags.

### React without a full SEO framework

- Identify whether the app is a pure SPA, SSR, SSG, Vite/CRA, Remix-like, custom Express, or microfrontend.
- For public SEO pages, recommend or implement SSR/SSG/prerendering where feasible.
- If the app remains CSR, ensure indexable links use real anchors, route changes are tracked, metadata is not relied on for critical organic pages, and non-indexable app surfaces are protected.
- Use hydration correctly when server HTML exists; do not use `createRoot` on server-rendered HTML.

### Angular

- For public SEO pages, use Angular SSR, prerendering, or hybrid rendering. Use CSR for private/non-indexable app surfaces.
- Configure `RenderMode.Server`, `RenderMode.Prerender`, or `RenderMode.Client` intentionally by route.
- Use Angular `Title` and `Meta` services for document metadata.
- Avoid direct `window`, `document`, `navigator`, and browser-only APIs in SSR code paths; use Angular platform abstractions and dependency injection.
- Use server route status/headers for proper 404/301/302/410 handling where supported.

## Implementation workflow

1. Scan repository and summarize current state.
2. Produce an audit table with severity, route/template, finding, evidence, impact, fix, and verification.
3. Ask only for missing business-critical inputs that cannot be inferred, such as production domain, GA4 measurement ID, GTM container ID, Search Console verification token, locale map, or event taxonomy. If the task can proceed with placeholders, proceed and label them clearly.
4. Implement P0 and P1 fixes first.
5. Keep reusable helpers typed and centralized.
6. Add or update tests where the repo has a test harness.
7. Run available checks: package-manager install status, lint, typecheck, unit tests, e2e tests, build, local audit script.
8. Report final status with exact commands run and any failures.

## Required final response format for Codex

When finishing an audit or implementation, return:

- **Resumo executivo:** what changed or what was found.
- **Risco orgânico:** P0/P1/P2/P3 count and top risks.
- **Arquivos alterados:** grouped by SEO, analytics, framework, tests.
- **Validação executada:** commands and results.
- **Validação pendente:** external/account-dependent checks.
- **Próximos passos:** only the next one to three high-leverage actions.

## Bundled references

Load these references when relevant:

- `references/seo-quality-gates.md`
- `references/framework-playbooks.md`
- `references/analytics-and-measurement.md`
- `references/report-template.md`
- `references/enterprise-seo-source-map.md`

Bundled implementation templates are available under `assets/templates/` for Next.js, Gatsby, React SPA route tracking, Angular metadata services, analytics/dataLayer, GTM notes, and audit reporting. Use them as starting points only; adapt them to the repository architecture and environment model.

Optional script:

- `scripts/seo-audit.mjs` — heuristic local scanner for JavaScript frontend repositories.
