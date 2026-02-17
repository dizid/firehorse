/**
 * Dynamic SEO composable for per-page meta tags, canonical URLs, and JSON-LD
 * Updates document head on each route to ensure search engines see unique content per page
 */

const BASE_URL = 'https://firehorse.info'
const SITE_NAME = 'FireHorse'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.svg`

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

function setMeta(attribute: string, value: string, content: string) {
  let el = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attribute, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  // Remove existing script with same id
  const existing = document.getElementById(id)
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function useSeo(options: SeoOptions) {
  const { title, description, path, type = 'website', image, article } = options
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = `${BASE_URL}${path}`
  const ogImage = image || DEFAULT_IMAGE

  // Document title
  document.title = fullTitle

  // Basic meta
  setMeta('name', 'description', description)

  // Open Graph
  setMeta('property', 'og:title', fullTitle)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', canonicalUrl)
  setMeta('property', 'og:type', type)
  setMeta('property', 'og:image', ogImage)
  setMeta('property', 'og:site_name', SITE_NAME)

  // Twitter Card
  setMeta('name', 'twitter:title', fullTitle)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', ogImage)

  // Canonical URL
  setCanonical(canonicalUrl)

  // JSON-LD structured data
  if (type === 'article' && article) {
    setJsonLd('seo-article-jsonld', {
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
    })
  }
}
