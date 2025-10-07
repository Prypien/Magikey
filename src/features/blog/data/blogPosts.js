const rawBlogModules = import.meta.glob('@/content/blog/*.md', { eager: true, as: 'raw' })

function parseFrontMatter(raw) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(raw)
  if (!match) {
    return { data: {}, content: raw.trim() }
  }

  const [, frontMatter, content = ''] = match
  const data = {}

  for (const line of frontMatter.split('\n')) {
    if (!line.trim()) {
      continue
    }

    const [key, ...rest] = line.split(':')
    if (!key) {
      continue
    }

    data[key.trim()] = rest.join(':').trim()
  }

  return { data, content: content.trim() }
}

function getBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.BASE_URL === 'string') {
    return import.meta.env.BASE_URL || '/'
  }
  return '/'
}

function decodeHtmlEntities(text) {
  return `${text}`
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

function resolveAssetUrl(url) {
  if (!url) {
    return ''
  }

  const trimmed = `${url}`.trim()
  if (!trimmed) {
    return ''
  }

  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed
  }

  const baseUrl = getBaseUrl()
  const normalisedBase = baseUrl ? baseUrl.replace(/\/+$/, '/') : '/'

  if (trimmed.startsWith('/')) {
    return `${normalisedBase}${trimmed.replace(/^\/+/, '')}`
  }

  return `${normalisedBase}${trimmed}`
}

function toDate(value) {
  if (!value) {
    return null
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function transformInline(text) {
  let result = escapeHtml(text)

  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, url) => {
      const resolvedUrl = escapeHtml(resolveAssetUrl(decodeHtmlEntities(url)))
      return `<img src="${resolvedUrl}" alt="${alt}" loading="lazy" />`
    },
  )
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label, url) => {
      const decodedUrl = decodeHtmlEntities(url)
      const safeUrl = escapeHtml(decodedUrl)
      return `<a href="${safeUrl}" target="_blank" rel="noopener">${label}</a>`
    },
  )
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

  return result
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/)
  const html = []
  let inList = false
  let listType = null

  const closeList = () => {
    if (inList) {
      html.push(listType === 'ol' ? '</ol>' : '</ul>')
      inList = false
      listType = null
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      closeList()
      html.push('')
      continue
    }

    if (/^#{1,6}\s+/.test(line)) {
      closeList()
      const level = Math.min(line.match(/^#+/)[0].length, 6)
      const content = transformInline(line.replace(/^#{1,6}\s+/, ''))
      html.push(`<h${level}>${content}</h${level}>`)
      continue
    }

    const listMatch = /^([*\-]|\d+\.)\s+(.+)$/.exec(line)
    if (listMatch) {
      const [, marker, item] = listMatch
      const currentType = marker.endsWith('.') ? 'ol' : 'ul'
      if (!inList) {
        inList = true
        listType = currentType
        html.push(`<${currentType}>`)
      } else if (currentType !== listType) {
        closeList()
        inList = true
        listType = currentType
        html.push(`<${currentType}>`)
      }
      html.push(`<li>${transformInline(item)}</li>`)
      continue
    }

    if (line.startsWith('> ')) {
      closeList()
      const content = transformInline(line.slice(2))
      html.push(`<blockquote>${content}</blockquote>`)
      continue
    }

    closeList()
    html.push(`<p>${transformInline(line)}</p>`)
  }

  closeList()

  return html.join('\n')
}

function calculateReadingTime(content) {
  const words = content.split(/\s+/).filter(Boolean)
  const wordsPerMinute = 200
  return Math.max(1, Math.round(words.length / wordsPerMinute))
}

function normaliseKeywords(rawKeywords) {
  if (!rawKeywords) {
    return []
  }

  if (Array.isArray(rawKeywords)) {
    return rawKeywords
      .map((entry) => `${entry}`.trim())
      .filter(Boolean)
  }

  return `${rawKeywords}`
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
}

function createBlogPost(path, raw) {
  const { data, content } = parseFrontMatter(raw)
  const slug = path.split('/').pop().replace(/\.md$/i, '')
  const date = toDate(data.date)
  const formattedDate = date
    ? new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(date)
    : ''
  const author = data.author || 'Jen Preißer'
  const isoDate = date ? date.toISOString() : ''
  const excerpt = data.excerpt || content.split(/\n\n/)[0].replace(/[#*`>-]/g, '').trim()
  const keywords = normaliseKeywords(data.keywords)
  const html = renderMarkdown(content)
  const readingTime = calculateReadingTime(content)

  return {
    slug,
    title: data.title || slug,
    excerpt,
    date,
    formattedDate,
    isoDate,
    content,
    html,
    keywords,
    readingTime,
    author,
    coverImage: resolveAssetUrl(data.coverImage || ''),
    coverImageAlt: data.coverImageAlt || '',
  }
}

const blogPosts = Object.entries(rawBlogModules)
  .map(([path, raw]) => createBlogPost(path, raw))
  .sort((a, b) => {
    if (!a.date && !b.date) {
      return a.title.localeCompare(b.title)
    }
    if (!a.date) {
      return 1
    }
    if (!b.date) {
      return -1
    }
    return b.date - a.date
  })

export function getBlogPosts() {
  return blogPosts
}

export function findBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug)
}
