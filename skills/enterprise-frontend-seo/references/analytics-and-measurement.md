# Analytics and Measurement Playbook

## Stack selection

Use this decision model:

- Use GTM/dataLayer when the site has multiple marketing/vendor tags, several teams, consent rules, release governance, or frequent tracking changes.
- Use direct Google tag / `gtag.js` when the implementation is small, controlled by engineering, and limited mostly to Google destinations.
- Use server-side tagging when privacy, data quality, performance, or first-party infrastructure requirements justify the extra operational cost.
- Use Measurement Protocol for server-to-server or offline events only with a clear reconciliation strategy.

## Required inventory

Before implementation, identify:

- GA4 property and web stream.
- GTM container, if applicable.
- Production domain and staging domains.
- Consent/CMP provider and consent categories.
- Event taxonomy owner.
- Key events/conversions.
- Ecommerce model, if any.
- Existing pixels and third-party tags.
- Data warehouse/export expectations.

## GA4 baseline events

Minimum web baseline:

- `page_view` with accurate `page_location`, `page_title`, and `page_referrer`.
- `login`, `sign_up`, `generate_lead`, `search`, `select_content`, or other recommended events where relevant.
- For ecommerce: `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `refund`, and promotion events where relevant.

## SPA pageview rules

- Do not allow both automatic enhanced measurement and manual route listeners to double-fire pageviews.
- When using manual pageviews, send one pageview after each completed route transition with the final URL and title.
- Track previous page location/referrer correctly.
- Validate in DebugView and browser network calls.

## Recommended dataLayer shape

Use a stable data contract. Example:

```ts
window.dataLayer?.push({
  event: 'generate_lead',
  lead_type: 'contact_form',
  form_id: 'enterprise_contact',
  page_type: 'landing_page',
  content_group: 'b2b',
})
```

For ecommerce:

```ts
window.dataLayer?.push({
  event: 'purchase',
  transaction_id: order.id,
  currency: 'BRL',
  value: order.total,
  items: order.items.map(item => ({
    item_id: item.sku,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity,
  })),
})
```

## Privacy and safety rules

Never send raw:

- Email, phone, full name, CPF/CNPJ, passport, license numbers.
- Street address unless explicitly approved and hashed/normalized according to the platform's documented requirements.
- Auth/session tokens, reset tokens, invitation tokens, JWTs, API keys.
- Full URL paths containing personal or secret identifiers.

Prefer stable internal IDs only when documented and privacy-approved.

## Search Console implementation scope

Codex can implement:

- HTML meta verification tags when provided.
- Static verification files when provided.
- `robots.txt` sitemap references.
- Framework-native sitemap generation.
- Documentation for manual URL Inspection, sitemap submission, and Search Console ownership verification.
- Search Console API integration stubs when credentials and permissions are available.

Codex cannot honestly verify Search Console ownership, submit sitemaps, inspect URLs, or fetch GSC performance data without account/API access.

## Verification checklist

- Tag Assistant shows exactly one intended pageview on initial load and one per SPA route transition if applicable.
- GA4 DebugView shows expected event names and parameters.
- Network tab shows expected `collect` or GTM requests, gated by consent.
- `dataLayer` events match taxonomy.
- No PII in event payloads or URLs.
- Events are disabled or marked debug in local/staging if production data contamination is a risk.
