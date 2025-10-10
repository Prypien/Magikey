import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const homeViewSource = readFileSync(resolve(__dirname, '../pages/HomeView.vue'), 'utf8')

describe('HomeView hero and entry points', () => {
  it('exposes CTA hooks for the streamlined hero', () => {
    expect(homeViewSource).toMatch(/data-testid="cta-customer-search"/)
    expect(homeViewSource).toMatch(/data-testid="cta-company-register-hero"/)
  })

  it('keeps company actions available in the sidebar card', () => {
    expect(homeViewSource).toMatch(/data-testid="cta-company-register"/)
    expect(homeViewSource).toMatch(/data-testid="cta-company-login"/)
  })

  it('removes the legacy flow copy to keep the hero concise', () => {
    expect(homeViewSource).not.toMatch(/Flow für Kund:innen/)
    expect(homeViewSource).not.toMatch(/Flow für Unternehmen/)
  })

  it('navigates company CTA handlers to the correct routes', () => {
    expect(homeViewSource).toMatch(
      /function\s+goToRegister\s*\([^)]*\)\s*{[\s\S]*?router\.push\(\s*ROUTE_LOCATIONS\.REGISTER\s*\)/
    )
    expect(homeViewSource).toMatch(
      /function\s+goToLogin\s*\([^)]*\)\s*{[\s\S]*?router\.push\(\s*ROUTE_LOCATIONS\.LOGIN\s*\)/
    )
  })

  it('fetches companies during the mounted lifecycle to keep results up to date', () => {
    expect(homeViewSource).toMatch(/onMounted\(async \(\) => \{[\s\S]*?fetchCompanies\(\)/)
  })
})
