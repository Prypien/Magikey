// Utility helpers for working with lock type identifiers.

function internalNormaliseLockType(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/__+/g, '_')
}

export function normaliseLockType(value) {
  return internalNormaliseLockType(value)
}

export function normaliseLockTypeList(input) {
  let values = []
  if (Array.isArray(input)) {
    values = input
  } else if (typeof input === 'string') {
    values = input.split(/[,;\n]/)
  } else if (input != null) {
    values = [input]
  } else {
    return []
  }

  return values
    .map(internalNormaliseLockType)
    .filter((type) => typeof type === 'string' && type.length > 0)
}

export function hasLockType(input, expectedType) {
  const normalisedExpected = internalNormaliseLockType(expectedType)
  if (!normalisedExpected) return false
  return normaliseLockTypeList(input).includes(normalisedExpected)
}
