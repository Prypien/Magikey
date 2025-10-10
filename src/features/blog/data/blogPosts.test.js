import { describe, expect, it } from 'vitest'

import { __test__ } from './blogPosts'

const { escapeHtml, renderMarkdown } = __test__

describe('blog posts markdown helpers', () => {
  it('keeps HTML block lines intact when rendering markdown', () => {
    const markdown = [
      '<div class="intro">',
      '  <p>Hallo Welt</p>',
      '</div>',
      '',
      'Nach dem Block folgt Text.',
    ].join('\n')

    const html = renderMarkdown(markdown)

    expect(html).toContain('<div class="intro">')
    expect(html).toContain('<p>Hallo Welt</p>')
    expect(html).not.toContain('&lt;div class="intro"&gt;')
    expect(html).toContain('<p>Nach dem Block folgt Text.</p>')
  })

  it('escapes non-string values without throwing', () => {
    expect(escapeHtml(undefined)).toBe('')
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(123)).toBe('123')
    expect(escapeHtml('Schlüssel & Sicherheit')).toBe('Schlüssel &amp; Sicherheit')
  })
})
