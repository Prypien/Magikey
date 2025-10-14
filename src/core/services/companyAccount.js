// Diese Datei enthält Konto-spezifische Aktionen für Firmen.
import { functions, isFirebaseConfigured } from '@/core/firebase'
import { httpsCallable } from 'firebase/functions'

let deleteCallable

function ensureCallable() {
  if (!deleteCallable) {
    if (!isFirebaseConfigured || !functions) {
      throw new Error('Firebase ist nicht konfiguriert. Kontoaktionen sind nicht verfügbar.')
    }
    deleteCallable = httpsCallable(functions, 'deleteCompanyAccount')
  }
  return deleteCallable
}

export async function deleteCompanyAccount() {
  if (!isFirebaseConfigured || !functions) {
    console.warn('Firebase nicht konfiguriert. Konto-Löschung wird simuliert.')
    return { simulated: true }
  }

  const callable = ensureCallable()
  const result = await callable()
  return result?.data ?? null
}

export const __test__ = {
  __reset() {
    deleteCallable = null
  },
}
