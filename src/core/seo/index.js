const DEFAULT_SEO = {
  title: 'Magikey – Transparente Schlüsseldienst-Suche',
  titleTemplate: '%s',
  description:
    'Magikey vergleicht geprüfte Schlüsseldienste in deiner Nähe und zeigt dir transparente Preise, Bewertungen und Notdienst-Services.',
  keywords:
    'Schlüsseldienst, Schlüsselnotdienst, Türöffnung, Preise vergleichen, seriöser Schlüsseldienst, Magikey',
  robots: 'index,follow',
  ogImage: '/logo.png',
}

function resolveValue(value) {
  if (typeof value === 'function') {
    try {
      return value()
    } catch (error) {
      console.error('Fehler beim Ermitteln eines SEO-Wertes', error)
      return undefined
    }
  }

  return value
}

function ensureMetaTag(attribute, name, content) {
  if (typeof document === 'undefined' || !document?.head) {
    return
  }

  const selector = `${attribute}="${name}"`
  let tag = document.head.querySelector(`meta[${selector}]`)

  if (!content) {
    if (tag) {
      if (typeof tag.remove === 'function') {
        tag.remove()
      }
    }
    return
  }

  if (!tag) {
    tag = document.createElement('meta')
    if (typeof tag?.setAttribute === 'function') {
      tag.setAttribute(attribute, name)
    }
    document.head.appendChild(tag)
  }

  if (typeof tag?.setAttribute === 'function') {
    tag.setAttribute('content', content)
  }
}

function ensureLinkTag(rel, href) {
  if (typeof document === 'undefined' || !document?.head) {
    return
  }

  let tag = document.head.querySelector(`link[rel="${rel}"]`)

  if (!href) {
    if (tag) {
      if (typeof tag.remove === 'function') {
        tag.remove()
      }
    }
    return
  }

  if (!tag) {
    tag = document.createElement('link')
    if (typeof tag?.setAttribute === 'function') {
      tag.setAttribute('rel', rel)
    }
    document.head.appendChild(tag)
  }

  if (typeof tag?.setAttribute === 'function') {
    tag.setAttribute('href', href)
  }
}

function toPlainText(value) {
  if (value == null) {
    return ''
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => toPlainText(entry))
      .filter((entry) => entry.length > 0)
      .join(', ')
  }

  if (value instanceof Date) {
    const timestamp = value.getTime()
    return Number.isFinite(timestamp) ? value.toISOString() : ''
  }

  if (typeof value === 'object') {
    return ''
  }

  return String(value)
}

function sanitizeText(value) {
  const text = toPlainText(value)
  if (!text) {
    return text
  }

  return text.replace(/\s+/g, ' ').trim()
}

export function applySeoMeta(input = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const meta = { ...DEFAULT_SEO, ...input }
  const title = sanitizeText(resolveValue(meta.title)) || DEFAULT_SEO.title
  const titleTemplate = meta.titleTemplate ?? DEFAULT_SEO.titleTemplate
  const finalTitle = titleTemplate?.includes('%s') ? titleTemplate.replace('%s', title) : title
  const description = sanitizeText(resolveValue(meta.description)) || DEFAULT_SEO.description
  const keywords = sanitizeText(resolveValue(meta.keywords)) || DEFAULT_SEO.keywords
  const robots = sanitizeText(resolveValue(meta.robots)) || DEFAULT_SEO.robots
  const ogTitle = sanitizeText(resolveValue(meta.ogTitle)) || finalTitle
  const ogDescription = sanitizeText(resolveValue(meta.ogDescription)) || description
  const ogImage = sanitizeText(resolveValue(meta.ogImage)) || DEFAULT_SEO.ogImage
  const twitterCard = meta.twitterCard || 'summary_large_image'
  const ogType = sanitizeText(resolveValue(meta.ogType)) || 'website'
  const articlePublishedTime = sanitizeText(resolveValue(meta.articlePublishedTime)) || undefined
  const articleModifiedTime = sanitizeText(resolveValue(meta.articleModifiedTime)) || undefined
  const articleAuthor = sanitizeText(resolveValue(meta.articleAuthor)) || undefined
  const twitterCreator = sanitizeText(resolveValue(meta.twitterCreator)) || undefined

  if (document.title !== finalTitle) {
    document.title = finalTitle
  }

  ensureMetaTag('name', 'description', description)
  ensureMetaTag('name', 'keywords', keywords)
  ensureMetaTag('name', 'robots', robots)
  ensureMetaTag('property', 'og:title', ogTitle)
  ensureMetaTag('property', 'og:description', ogDescription)
  ensureMetaTag('property', 'og:image', ogImage)
  ensureMetaTag('property', 'og:type', ogType)
  ensureMetaTag('property', 'article:published_time', articlePublishedTime)
  ensureMetaTag('property', 'article:modified_time', articleModifiedTime)
  ensureMetaTag('property', 'article:author', articleAuthor)

  const currentUrl = sanitizeText(
    meta.url || (typeof window !== 'undefined' ? window.location.href : undefined)
  )

  ensureMetaTag('property', 'og:url', currentUrl)
  ensureMetaTag('name', 'twitter:card', twitterCard)
  ensureMetaTag('name', 'twitter:title', ogTitle)
  ensureMetaTag('name', 'twitter:description', ogDescription)
  ensureMetaTag('name', 'twitter:image', ogImage)
  ensureMetaTag('name', 'twitter:creator', twitterCreator)

  const canonicalUrl = sanitizeText(
    meta.canonical || (typeof window !== 'undefined' ? window.location.href : undefined)
  )
  ensureLinkTag('canonical', canonicalUrl)
}

export { DEFAULT_SEO }
