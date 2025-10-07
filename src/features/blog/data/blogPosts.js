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
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>')
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

  return result
}

function renderStatGrid(content) {
  const entries = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!entries.length) {
    return ''
  }

  const cards = entries
    .map((line) => line.replace(/^[-*]\s*/, ''))
    .map((line) => line.split('|').map((part) => part.trim()))
    .map(([label = '', value = '', description = '']) => {
      const safeLabel = transformInline(label)
      const safeValue = transformInline(value)
      const safeDescription = transformInline(description)
      return `
        <article class="md-stat">
          <p class="md-stat-label">${safeLabel}</p>
          <p class="md-stat-value">${safeValue}</p>
          <p class="md-stat-description">${safeDescription}</p>
        </article>
      `
    })
    .join('')

  return `<div class="md-stat-grid">${cards}</div>`
}

function renderTimeline(content) {
  const entries = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!entries.length) {
    return ''
  }

  const items = entries
    .map((line) => line.replace(/^[-*]\s*/, ''))
    .map((line) => {
      const [milestone, ...rest] = line.split(':')
      const headline = transformInline(milestone || '')
      const body = transformInline(rest.join(':').trim())
      return `
        <li class="md-timeline-item">
          <div class="md-timeline-dot"></div>
          <div class="md-timeline-content">
            <p class="md-timeline-headline">${headline}</p>
            <p class="md-timeline-body">${body}</p>
          </div>
        </li>
      `
    })
    .join('')

  return `<ol class="md-timeline">${items}</ol>`
}

function renderChecklist(content) {
  const entries = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!entries.length) {
    return ''
  }

  const items = entries
    .map((line) => line.replace(/^[-*]\s*/, ''))
    .map((line) => {
      const match = /^\[([ xX])\]\s*(.*)$/.exec(line)
      const checked = match ? match[1].toLowerCase() === 'x' : false
      const contentText = match ? match[2] : line
      const safeContent = transformInline(contentText)
      return `
        <li class="md-checklist-item${checked ? ' md-checklist-item--checked' : ''}">
          <span class="md-checklist-box" aria-hidden="true">${checked ? '✓' : ''}</span>
          <span class="md-checklist-text">${safeContent}</span>
        </li>
      `
    })
    .join('')

  return `<ul class="md-checklist">${items}</ul>`
}

function renderCallout(type, title, content) {
  const innerHtml = content ? renderMarkdown(content) : ''
  const safeTitle = title ? transformInline(title) : ''
  const modifier = type.toLowerCase()
  return `
    <section class="md-callout md-callout-${modifier}">
      ${safeTitle ? `<header class="md-callout-title">${safeTitle}</header>` : ''}
      <div class="md-callout-content">${innerHtml}</div>
    </section>
  `
}

function renderSpecialBlock(type, title, content) {
  const normalisedType = type.toLowerCase()

  switch (normalisedType) {
    case 'stat-grid':
    case 'stats':
      return renderStatGrid(content)
    case 'timeline':
      return renderTimeline(content)
    case 'checklist':
      return renderChecklist(content)
    case 'summary':
    case 'info':
    case 'tip':
    case 'warning':
    case 'success':
    case 'note':
    case 'danger':
    default:
      return renderCallout(normalisedType, title, content)
  }
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/)
  const html = []
  let inList = false
  let listType = null
  let inCodeBlock = false
  let codeLanguage = ''
  let codeBuffer = []
  let specialBlock = null

  const closeList = () => {
    if (inList) {
      html.push(listType === 'ol' ? '</ol>' : '</ul>')
      inList = false
      listType = null
    }
  }

  const flushCodeBlock = () => {
    if (!inCodeBlock) {
      return
    }
    const code = codeBuffer.join('\n')
    const escaped = escapeHtml(code)
    const languageClass = codeLanguage ? ` class="language-${codeLanguage}"` : ''
    html.push(`<pre><code${languageClass}>${escaped}</code></pre>`)
    inCodeBlock = false
    codeLanguage = ''
    codeBuffer = []
  }

  const closeSpecialBlock = () => {
    if (!specialBlock) {
      return
    }
    const rendered = renderSpecialBlock(
      specialBlock.type,
      specialBlock.title,
      specialBlock.lines.join('\n'),
    )
    if (rendered) {
      html.push(rendered)
    }
    specialBlock = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (specialBlock) {
      if (trimmed === ':::') {
        closeSpecialBlock()
        continue
      }
      specialBlock.lines.push(rawLine)
      continue
    }

    if (inCodeBlock) {
      if (trimmed === '```') {
        flushCodeBlock()
        continue
      }
      codeBuffer.push(rawLine)
      continue
    }

    if (!trimmed) {
      closeList()
      html.push('')
      continue
    }

    const codeMatch = /^```(\w+)?/.exec(trimmed)
    if (codeMatch) {
      closeList()
      inCodeBlock = true
      codeLanguage = codeMatch[1] || ''
      codeBuffer = []
      continue
    }

    if (/^---+$/.test(trimmed)) {
      closeList()
      html.push('<hr />')
      continue
    }

    const specialMatch = /^:::\s*([a-z0-9-]+)(?:\s+(.+))?$/i.exec(trimmed)
    if (specialMatch) {
      closeList()
      specialBlock = {
        type: specialMatch[1],
        title: specialMatch[2] ? specialMatch[2].replace(/^['"]|['"]$/g, '') : '',
        lines: [],
      }
      continue
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      closeList()
      const level = Math.min(trimmed.match(/^#+/)[0].length, 6)
      const content = transformInline(trimmed.replace(/^#{1,6}\s+/, ''))
      html.push(`<h${level}>${content}</h${level}>`)
      continue
    }

    const listMatch = /^([*\-]|\d+\.)\s+(.+)$/.exec(trimmed)
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

      const taskMatch = /^\[([ xX])\]\s*(.*)$/.exec(item)
      if (taskMatch) {
        const checked = taskMatch[1].toLowerCase() === 'x'
        const content = transformInline(taskMatch[2])
        html.push(
          `<li class="md-task${checked ? ' md-task--checked' : ''}"><span class="md-task-box" aria-hidden="true">${checked ? '✓' : ''}</span><span class="md-task-label">${content}</span></li>`,
        )
      } else {
        html.push(`<li>${transformInline(item)}</li>`)
      }
      continue
    }

    if (trimmed.startsWith('> ')) {
      closeList()
      const content = transformInline(trimmed.slice(2))
      html.push(`<blockquote>${content}</blockquote>`)
      continue
    }

    closeList()
    html.push(`<p>${transformInline(trimmed)}</p>`)
  }

  closeList()
  flushCodeBlock()
  closeSpecialBlock()

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
