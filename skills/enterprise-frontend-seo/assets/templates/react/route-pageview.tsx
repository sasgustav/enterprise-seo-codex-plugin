import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function useRoutePageView() {
  const location = useLocation();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    const url = `${location.pathname}${location.search}`;
    if (lastUrl.current === url) return;
    lastUrl.current = url;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_page_view',
      page_location: window.location.href,
      page_path: url,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);
}
