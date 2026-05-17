# GTM implementation notes

Use a single GTM container per environment unless the governance model requires otherwise.

Required placeholders:

- `GTM_CONTAINER_ID`: production container, e.g. `GTM-XXXXXXX`.
- `GA4_MEASUREMENT_ID`: GA4 web stream, e.g. `G-XXXXXXXXXX`.
- `CONSENT_MODEL`: CMP/Consent Mode strategy approved by privacy/compliance.

Rules:

1. Load GTM once.
2. Do not fire duplicate initial page_view events if GA4 enhanced measurement already handles the first page load.
3. For SPAs, send route-change pageviews through `virtual_page_view` or configure GTM History Change triggers with deduplication.
4. Never send PII or secrets in URLs, dataLayer keys, event parameters, user properties, or item metadata.
5. QA with Preview Mode, Tag Assistant, GA4 DebugView, browser network calls, and Realtime reports.
