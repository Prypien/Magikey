// Hilfsfunktionen zur Verarbeitung von Preisangaben in Euro.

/**
 * Wandelt verschiedene Preisformate (z. B. "79,90 €" oder 89.5) in eine Zahl um.
 * Unterstützt Dezimaltrennzeichen mit Komma oder Punkt und ignoriert übrige Zeichen.
 *
 * @param {unknown} value
 * @returns {number|null}
 */
export function parseEuroAmount(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) return null

  // Entfernt alle Zeichen außer Ziffern, Komma, Punkt und Minus
  let normalised = trimmed.replace(/[^0-9,.-]/g, '')
  if (!normalised || normalised === '-' || normalised === ',') return null

  const lastComma = normalised.lastIndexOf(',')
  const lastDot = normalised.lastIndexOf('.')
  let decimalSeparator = null

  if (lastComma >= 0 && lastDot >= 0) {
    decimalSeparator = lastComma > lastDot ? ',' : '.'
  } else if (lastComma >= 0) {
    decimalSeparator = ','
  } else if (lastDot >= 0) {
    decimalSeparator = '.'
  }

  let cleaned = normalised

  if (decimalSeparator) {
    const thousandSeparator = decimalSeparator === ',' ? '.' : ','
    const thousandRegex = new RegExp(`\\${thousandSeparator}`, 'g')
    cleaned = cleaned.replace(thousandRegex, '')
    if (decimalSeparator === ',') {
      cleaned = cleaned.replace(',', '.')
    }
  } else {
    cleaned = cleaned.replace(/[.,]/g, '')
  }

  const numeric = Number(cleaned)
  return Number.isFinite(numeric) ? numeric : null
}
