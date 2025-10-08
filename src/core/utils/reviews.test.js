import { describe, it, expect } from 'vitest'
import { extractRating, extractReviewCount } from './reviews'

describe('reviews utils', () => {
  it('parses ratings from strings with comma separators', () => {
    const source = { rating: '4,7' }
    expect(extractRating(source)).toBeCloseTo(4.7)
  })

  it('reads ratings from nested verification data and clamps the value', () => {
    const source = { verification: { google_rating: '5.8' } }
    expect(extractRating(source)).toBe(5)
  })

  it('returns null when no rating information is available', () => {
    expect(extractRating({})).toBeNull()
  })

  it('parses review counts from verbose strings', () => {
    const source = { verification: { google_review_count: '1.234 Bewertungen' } }
    expect(extractReviewCount(source)).toBe(1234)
  })

  it('ignores invalid review counts', () => {
    const source = { review_count: '-5' }
    expect(extractReviewCount(source)).toBeNull()
  })
})
