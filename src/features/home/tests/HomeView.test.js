import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const homeViewSource = readFileSync(resolve(__dirname, '../pages/HomeView.vue'), 'utf8')

describe('HomeView customer and company flows', () => {
  it('contains dedicated sections for both customer and company journeys', () => {
    expect(homeViewSource).toMatch(/Für Kund:innen/)
    expect(homeViewSource).toMatch(/Für Unternehmen/)
  })

  it('exposes CTA hooks for the major entry points', () => {
    expect(homeViewSource).toMatch(/data-testid="cta-customer-search"/)
    expect(homeViewSource).toMatch(/data-testid="cta-customer-support"/)
    expect(homeViewSource).toMatch(/data-testid="cta-company-register"/)
    expect(homeViewSource).toMatch(/data-testid="cta-company-login"/)
  })

  it('links the support CTA directly to the support route', () => {
    const marker = 'data-testid="cta-customer-support"'
    const markerIndex = homeViewSource.indexOf(marker)
    expect(markerIndex, 'support CTA marker should exist').toBeGreaterThan(-1)

    const snippet = homeViewSource.slice(Math.max(0, markerIndex - 150), markerIndex + marker.length + 150)
    expect(snippet).toMatch(/to="\/support"/)
  })

  it('navigates company CTA handlers to the correct routes', () => {
    expect(homeViewSource).toMatch(/function\s+goToRegister\s*\([^)]*\)\s*{[\s\S]*?router\.push\(\{\s*name:\s*'register'\s*\}\)/)
    expect(homeViewSource).toMatch(/function\s+goToLogin\s*\([^)]*\)\s*{[\s\S]*?router\.push\(\{\s*name:\s*'login'\s*\}\)/)
  })

  it('fetches companies during the mounted lifecycle to keep results up to date', () => {
    expect(homeViewSource).toMatch(/onMounted\(async \(\) => \{[\s\S]*?fetchCompanies\(\)/)
  })
})
