import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

type SeoMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  imageUrl?: string;
  indexable?: boolean;
};

@Injectable({ providedIn: 'root' })
export class SeoMetaService {
  private siteUrl = 'https://www.example.com';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  update(input: SeoMeta): void {
    const canonical = new URL(input.canonicalPath, this.siteUrl).toString();
    const image = new URL(input.imageUrl || '/og/default.jpg', this.siteUrl).toString();

    this.title.setTitle(input.title);
    this.meta.updateTag({ name: 'description', content: input.description });
    this.meta.updateTag({ name: 'robots', content: input.indexable === false ? 'noindex,nofollow' : 'index,follow' });
    this.meta.updateTag({ property: 'og:title', content: input.title });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.setCanonical(canonical);
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
