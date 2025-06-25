import { describe, it, expect } from 'vitest'

// Einfacher Beispiel-Test für Vitest

// grouping mehrerer Tests
describe('basic test', () => {
  // einfacher Erwartungstest
  it('adds numbers', () => {
    expect(1 + 1).toBe(2)
  })
})
