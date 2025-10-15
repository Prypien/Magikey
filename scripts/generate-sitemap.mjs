import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { DEFAULT_SITEMAP_BASE_URL, SITEMAP_STATIC_ROUTES } from '../src/core/constants/routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const BASE_URL = (process.env.SITEMAP_BASE_URL || DEFAULT_SITEMAP_BASE_URL || '').trim().replace(/\/+$/, '')
const normalizedBaseUrl = BASE_URL || DEFAULT_SITEMAP_BASE_URL

const ensureLeadingSlash = (input = '/') => {
  if (!input) return '/'
  return input.startsWith('/') ? input : `/${input}`
}

const entries = []
const seen = new Set()

const registerEntry = (relativePath, { changefreq, priority, lastmod } = {}) => {
  const pathWithSlash = ensureLeadingSlash(relativePath)
  if (seen.has(pathWithSlash)) {
    return
  }
  seen.add(pathWithSlash)

  const loc = `${normalizedBaseUrl}${pathWithSlash}`
  entries.push({ loc, changefreq, priority, lastmod })
}

const loadJson = async (targetPath) => {
  try {
    const content = await fs.readFile(targetPath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    return {}
  }
}

const collectStaticRoutes = () => {
  for (const route of SITEMAP_STATIC_ROUTES) {
    registerEntry(route.path, {
      changefreq: route.changefreq,
      priority: route.priority,
      lastmod: route.lastmod,
    })
  }
}

const collectBlogPosts = async () => {
  const metadataPath = path.join(projectRoot, 'content', 'blog', 'metadata.json')
  const metadata = await loadJson(metadataPath)
  const blogDir = path.join(projectRoot, 'content', 'blog', 'posts')

  try {
    const files = await fs.readdir(blogDir)
    for (const file of files) {
      if (!file.endsWith('.html')) continue
      const slug = file.replace(/\.(md|html)$/i, '')
      const info = metadata?.[slug] || {}
      const lastmod = info.updated || info.published
      registerEntry(`/blog/${slug}`, {
        changefreq: 'monthly',
        priority: 0.55,
        lastmod,
      })
    }
  } catch (error) {
    // ignore missing blog directory
  }
}

const collectStaticHtml = async () => {
  const directory = path.join(projectRoot, 'public', 'schluesseldienst')
  try {
    const entriesInDir = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entriesInDir) {
      if (!entry.isDirectory()) continue
      const slug = entry.name
      const indexPath = path.join(directory, slug, 'index.html')
      try {
        const stats = await fs.stat(indexPath)
        registerEntry(`/schluesseldienst/${slug}`, {
          changefreq: 'monthly',
          priority: 0.5,
          lastmod: stats.mtime.toISOString(),
        })
      } catch (error) {
        registerEntry(`/schluesseldienst/${slug}`, {
          changefreq: 'monthly',
          priority: 0.5,
        })
      }
    }
  } catch (error) {
    // directory might not exist; ignore
  }
}

const formatEntry = ({ loc, changefreq, priority, lastmod }) => {
  const parts = [`    <url>`, `      <loc>${loc}</loc>`]
  if (lastmod) {
    const date = new Date(lastmod)
    if (!Number.isNaN(date.getTime())) {
      parts.push(`      <lastmod>${date.toISOString().split('T')[0]}</lastmod>`)
    }
  }
  if (changefreq) {
    parts.push(`      <changefreq>${changefreq}</changefreq>`)
  }
  if (typeof priority === 'number') {
    parts.push(`      <priority>${priority.toFixed(2)}</priority>`)
  }
  parts.push('    </url>')
  return parts.join('\n')
}

const run = async () => {
  collectStaticRoutes()
  await collectBlogPosts()
  await collectStaticHtml()

  entries.sort((a, b) => a.loc.localeCompare(b.loc))

  const xmlEntries = entries.map(formatEntry).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>\n`

  const outputPath = path.join(projectRoot, 'public', 'sitemap.xml')
  await fs.writeFile(outputPath, xml, 'utf8')
}

run().catch((error) => {
  console.error('Failed to generate sitemap:', error)
  process.exitCode = 1
})
