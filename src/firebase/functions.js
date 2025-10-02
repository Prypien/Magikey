/* global fetch */

function resolveFunctionUrl() {
  const rawCustomUrl = (import.meta.env?.VITE_FUNCTION_URL ?? '').toString().trim()
  if (rawCustomUrl) return rawCustomUrl

  const projectId = (import.meta.env?.VITE_FIREBASE_PROJECT_ID ?? '').toString().trim()
  if (!projectId) return null

  return `https://us-central1-${projectId}.cloudfunctions.net/postalCodeFromCoords`
}

export async function getPostalFromCoords(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error('Invalid coordinates')
  }

  const url = resolveFunctionUrl()
  if (!url) {
    throw new Error('Cloud Function postalCodeFromCoords ist nicht konfiguriert.')
  }

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    })
  } catch (error) {
    throw new Error(`Cloud Function postalCodeFromCoords konnte nicht erreicht werden: ${error.message}`)
  }

  if (!res.ok) {
    let details = ''
    try {
      details = await res.text()
    } catch (error) {
      console.warn('Antwort der Cloud Function konnte nicht gelesen werden:', error)
    }
    const suffix = details ? ` – ${details}` : ''
    throw new Error(`Cloud Function postalCodeFromCoords antwortete mit Status ${res.status}${suffix}`)
  }

  return res.json()
}

export const __test__ = {
  resolveFunctionUrl,
}
