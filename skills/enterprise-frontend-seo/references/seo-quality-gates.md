# Enterprise SEO Quality Gates

Use this as the acceptance standard for technical SEO and analytics work on high-traffic JavaScript applications.

## P0 gates

- No accidental global `noindex`, `nofollow`, restrictive `X-Robots-Tag`, or production `robots.txt` block for strategic public pages.
- Public SEO-critical routes return correct HTTP status codes: `200` for valid pages, `301/308` for permanent canonical moves, `404/410` for removed or invalid resources.
- Strategic public templates expose meaningful initial HTML or a crawler-safe SSR/SSG/prerendered representation.
- Canonical domain, protocol, locale path, trailing slash policy, and query parameter policy are consistent.
- Sitemap contains only canonical, indexable URLs and excludes auth/private/search/filter URLs unless intentionally indexable.
- GA4/GTM does not double-fire pageviews, purchases, leads, or key events.
- Analytics payloads do not include raw email, phone, full name, document ID, access token, password reset token, or other PII/secrets.
- Consent behavior is not bypassed.

## P1 gates

- Every strategic route/template has deterministic title, description, canonical, robots directive, Open Graph, Twitter card, and primary image fallback.
- Internal navigation uses crawlable anchors with `href` for indexable routes.
- SPA route changes are measured correctly when the application is a SPA or hybrid app.
- Structured data is present for eligible strategic templates and matches visible page content.
- `hreflang` is reciprocal, self-referential, absolute, and synchronized with canonical strategy.
- Core Web Vitals issues are triaged by page template and traffic weight.
- Search Console verification and sitemap references are implemented where tokens/domain are provided.

## P2 gates

- Metadata helpers are centralized, typed where possible, and protected against `undefined` output.
- JSON-LD payloads are sanitized for unsafe strings.
- Sitemaps are partitioned for large sites by content type, locale, or freshness.
- Structured data validation steps are documented.
- Analytics event taxonomy is documented: event name, trigger, parameters, owner, validation method.
- Debug/test mode is available for non-production analytics verification.

## P3 gates

- SEO implementation has naming consistency and low duplication.
- Report output is readable by engineering, product, and growth teams.
- Comments exist only where they clarify business-critical tracking or non-obvious SEO constraints.

## Core Web Vitals target thresholds

Use the standard user-experience thresholds unless the project defines stricter business targets:

- LCP: good at <= 2.5s.
- INP: good at <= 200ms.
- CLS: good at <= 0.1.

Evaluate at the 75th percentile by template and segment where field data is available.

## High-scale sitemap rules

- Keep each sitemap within search-engine protocol limits.
- Use sitemap indexes for large inventories.
- Do not fabricate `lastmod` dates. Use reliable update timestamps or omit.
- Include only canonical URLs.
- Split by route family, locale, or update cadence when it improves observability.

## Analytics governance

- Prefer GTM/dataLayer for enterprise multi-tag governance unless the project has a reason to use direct `gtag.js`.
- Use direct `gtag.js` for simple, tightly controlled implementations with minimal tags.
- Avoid duplicate automatic and manual pageview firing.
- For SPAs, verify route changes in GA4 DebugView and browser network calls.
- For ecommerce, send GA4 recommended ecommerce events and complete `items` arrays when relevant.
- Use server-side tagging only when infrastructure, privacy, and data ownership requirements justify it.
