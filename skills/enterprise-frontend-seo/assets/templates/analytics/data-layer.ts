declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

export function pushDataLayer(event: DataLayerEvent): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(sanitizeAnalyticsPayload(event));
}

function sanitizeAnalyticsPayload<T extends DataLayerEvent>(event: T): T {
  const blockedKeys = /email|phone|cpf|cnpj|password|token|secret/i;
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(event)) {
    if (blockedKeys.test(key)) continue;
    output[key] = value;
  }

  return output as T;
}

export function trackVirtualPageView(page: { location: string; path: string; title: string }): void {
  pushDataLayer({
    event: 'virtual_page_view',
    page_location: page.location,
    page_path: page.path,
    page_title: page.title,
  });
}

export function trackPurchase(input: {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    price?: number;
    quantity?: number;
    item_brand?: string;
    item_category?: string;
  }>;
}): void {
  pushDataLayer({ event: 'purchase', ecommerce: input });
}
