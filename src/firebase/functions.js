/* global fetch */
export async function getPostalFromCoords(lat, lng) {
  const url =
    import.meta.env.VITE_FUNCTION_URL ||
    `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/postalCodeFromCoords`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  })

  if (!res.ok) {
    throw new Error('Request failed')
  }

  return res.json()
}
