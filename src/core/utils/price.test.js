import { describe, it, expect } from 'vitest'
import { parseEuroAmount } from './price'

describe('parseEuroAmount', () => {
  it('returns null for empty values', () => {
    expect(parseEuroAmount('')).toBeNull()
    expect(parseEuroAmount('   ')).toBeNull()
    expect(parseEuroAmount(null)).toBeNull()
    expect(parseEuroAmount(undefined)).toBeNull()
  })

  it('keeps numeric inputs as-is', () => {
    expect(parseEuroAmount(49)).toBe(49)
    expect(parseEuroAmount(129.9)).toBe(129.9)
  })

  it('parses decimal strings with comma or dot', () => {
    expect(parseEuroAmount('79,90')).toBeCloseTo(79.9)
    expect(parseEuroAmount('89.75')).toBeCloseTo(89.75)
  })

  it('ignores currency symbols and text', () => {
    expect(parseEuroAmount('ab 99 €')).toBe(99)
    expect(parseEuroAmount('119,50 Euro')).toBeCloseTo(119.5)
  })

  it('handles thousand separators correctly', () => {
    expect(parseEuroAmount('1.249,50')).toBeCloseTo(1249.5)
    expect(parseEuroAmount('2,345.10')).toBeCloseTo(2345.1)
  })

  it('returns null for non-numeric content', () => {
    expect(parseEuroAmount('keine Angabe')).toBeNull()
    expect(parseEuroAmount({})).toBeNull()
  })
})
