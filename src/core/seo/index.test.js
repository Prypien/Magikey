import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { applySeoMeta, DEFAULT_SEO } from './index'

const buildSelector = (element) => {
  if (!element || typeof element !== 'object') {
    return null
  }

  if (element.tagName === 'meta') {
    if (element.attributes.name) {
      return `meta[name="${element.attributes.name}"]`
    }
    if (element.attributes.property) {
      return `meta[property="${element.attributes.property}"]`
    }
  }

  if (element.tagName === 'link' && element.attributes.rel) {
    return `link[rel="${element.attributes.rel}"]`
  }

  return null
}

describe('applySeoMeta', () => {
  let headElements

  const createStubElement = (tagName) => ({
    tagName,
    attributes: {},
    setAttribute(key, value) {
      this.attributes[key] = value
    },
    remove: vi.fn(() => {
      const selector = buildSelector(this)
      if (selector) {
        headElements.delete(selector)
      }
    }),
  })

  beforeEach(() => {
    headElements = new Map()

    const appendChild = vi.fn((element) => {
      const selector = buildSelector(element)
      if (selector) {
        headElements.set(selector, element)
      }
    })

    const querySelector = vi.fn((selector) => headElements.get(selector) ?? null)

    const createElement = vi.fn((tagName) => createStubElement(tagName.toLowerCase()))

    vi.stubGlobal('document', {
      title: '',
      head: { appendChild, querySelector },
      createElement,
    })

    vi.stubGlobal('window', {
      location: {
        href: 'https://magikey.app/blog/ratgeber?ref=newsletter#cta',
        origin: 'https://magikey.app',
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    headElements.clear()
  })

  const getMetaContent = (attribute, name) => {
    const element = headElements.get(`meta[${attribute}="${name}"]`)
    return element?.attributes?.content
  }

  it('applies default social metadata', () => {
    applySeoMeta()

    expect(document.title).toBe(DEFAULT_SEO.title)
    expect(getMetaContent('property', 'og:site_name')).toBe(DEFAULT_SEO.siteName)
    expect(getMetaContent('property', 'og:locale')).toBe(DEFAULT_SEO.locale)
    expect(getMetaContent('name', 'twitter:site')).toBe(DEFAULT_SEO.twitterSite)
    expect(getMetaContent('name', 'author')).toBe(DEFAULT_SEO.author)
  })

  it('honours explicit overrides and falls back to article author when provided', () => {
    applySeoMeta({
      siteName: () => 'Magikey Branchenportal',
      locale: 'de_AT',
      twitterSite: ' @magikey_at ',
      author: '',
      articleAuthor: 'Magikey Redaktion Österreich',
    })

    expect(getMetaContent('property', 'og:site_name')).toBe('Magikey Branchenportal')
    expect(getMetaContent('property', 'og:locale')).toBe('de_AT')
    expect(getMetaContent('name', 'twitter:site')).toBe('@magikey_at')
    expect(getMetaContent('name', 'author')).toBe('Magikey Redaktion Österreich')
  })
})
