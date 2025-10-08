// Hilfsfunktionen zum Ableiten von Bewertungs- und Rezensionsdaten.

const DEFAULT_RATING_PATHS = Object.freeze([
  'verification.google_rating',
  'reviews.magikey_avg',
  'reviews.magikeyRating',
  'magikey_rating',
  'magikeyRating',
  'google_rating',
  'rating',
  'average_rating',
  'avg_rating',
])

const DEFAULT_REVIEW_COUNT_PATHS = Object.freeze([
  'verification.google_review_count',
  'reviews.magikey_review_count',
  'reviews.magikeyReviewCount',
  'google_review_count',
  'review_count',
  'rating_count',
  'reviews_count',
])

function getValueByPath(source, path) {
  if (!source || typeof path !== 'string') {
    return undefined
  }

  return path
    .split('.')
    .reduce((current, key) => (current == null ? undefined : current[key]), source)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function parseRatingInput(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    return clamp(value, 0, 5)
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(',', '.').replace(/[^0-9+\-.]/g, '')
    if (!cleaned) return null
    const parsed = Number.parseFloat(cleaned)
    if (!Number.isFinite(parsed)) return null
    return clamp(parsed, 0, 5)
  }

  return null
}

function parseReviewCountInput(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) return null
    return Math.trunc(value)
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9-]/g, '')
    if (!cleaned) return null
    const parsed = Number.parseInt(cleaned, 10)
    if (!Number.isFinite(parsed) || parsed < 0) return null
    return parsed
  }

  return null
}

export function extractRating(source, paths = DEFAULT_RATING_PATHS) {
  for (const path of paths) {
    const candidate = getValueByPath(source, path)
    const rating = parseRatingInput(candidate)
    if (rating !== null) {
      return rating
    }
  }
  return null
}

export function extractReviewCount(source, paths = DEFAULT_REVIEW_COUNT_PATHS) {
  for (const path of paths) {
    const candidate = getValueByPath(source, path)
    const count = parseReviewCountInput(candidate)
    if (count !== null) {
      return count
    }
  }
  return null
}

export { DEFAULT_RATING_PATHS, DEFAULT_REVIEW_COUNT_PATHS }
