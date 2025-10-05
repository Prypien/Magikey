// Hilfsfunktionen zur Bewertung der Passwortstärke.
export function evaluatePasswordStrength(password) {
  const value = password || ''
  let score = 0

  if (value.length >= 6) score++
  if (/[A-Z]/.test(value)) score++
  if (/[a-z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++

  const percent = (score / 5) * 100

  if (score <= 2) {
    return {
      score,
      percent,
      label: 'Schwach',
      textClass: 'text-red-500',
      barClass: 'bg-red-500',
    }
  }

  if (score <= 4) {
    return {
      score,
      percent,
      label: 'Mittel',
      textClass: 'text-yellow-500',
      barClass: 'bg-yellow-500',
    }
  }

  return {
    score,
    percent,
    label: 'Stark',
    textClass: 'text-green-500',
    barClass: 'bg-green-500',
  }
}

export default evaluatePasswordStrength
