// Helferfunktionen für Zeit- und Dauerformatierung.

/**
 * Formatiert Minuten in eine lesbare Dauerangabe (z. B. "15 Min." oder "1 Std. 10 Min.").
 * @param {number} minutes
 * @param {{ short?: boolean }} [options]
 * @returns {string}
 */
export function formatDuration(minutes, { short = false } = {}) {
  if (!Number.isFinite(minutes)) return ''

  const total = Math.max(minutes, 0)
  if (total < 1) {
    return short ? '< 1 Min.' : 'unter 1 Minute'
  }

  const roundedTotal = Math.round(total)
  if (roundedTotal < 60) {
    return `${roundedTotal} Min.`
  }

  const hours = Math.floor(roundedTotal / 60)
  const mins = roundedTotal % 60

  if (mins === 0) {
    return `${hours} Std.`
  }

  return `${hours} Std. ${mins} Min.`
}

/**
 * Formatiert ein Datum in eine deutsche Uhrzeit.
 * @param {number} timestampMs
 * @returns {string}
 */
export function formatEta(timestampMs) {
  if (!Number.isFinite(timestampMs)) return ''
  const date = new Date(timestampMs)
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
