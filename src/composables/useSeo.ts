/**
 * Dynamic SEO composable for per-page meta tags, canonical URLs, and JSON-LD.
 * Built on @unhead/vue so tags are baked into the prerendered HTML during
 * vite-ssg's build (via renderDOMHead) as well as kept reactive client-side —
 * unlike direct `document` mutation, which only ever ran after hydration.
 */
import { useHead } from '@unhead/vue'

const BASE_URL = 'https://firehorse.info'
const SITE_NAME = 'FireHorse'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

interface SeoOptions {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: string
  article?: {
    author?: string
    publishedAt?: string
    tags?: string[]
  }
}

export function useSeo(options: SeoOptions) {
  const { title, description, path, type = 'website', image, article } = options
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = `${BASE_URL}${path}`
  const ogImage = image || DEFAULT_IMAGE

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: type },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: SITE_NAME },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script:
      type === 'article' && article
        ? [
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: title,
                description,
                url: canonicalUrl,
                image: ogImage,
                author: {
                  '@type': 'Organization',
                  name: article.author || SITE_NAME,
                },
                publisher: {
                  '@type': 'Organization',
                  name: SITE_NAME,
                  url: BASE_URL,
                  logo: DEFAULT_IMAGE,
                },
                ...(article.publishedAt && { datePublished: article.publishedAt }),
                ...(article.tags && { keywords: article.tags.join(', ') }),
              }),
            },
          ]
        : [],
  })
}

export interface BreadcrumbItem {
  name: string
  path: string
}

/** Emits BreadcrumbList JSON-LD matching a page's visible breadcrumb trail. */
export function useBreadcrumbSchema(items: BreadcrumbItem[]) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${BASE_URL}${item.path}`,
          })),
        }),
      },
    ],
  })
}
