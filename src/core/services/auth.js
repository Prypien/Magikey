// Diese Datei bündelt Hilfsfunktionen für die Benutzer-Authentifizierung.
// Die Funktionen sind bewusst kurz gehalten und verwenden direkt die
// bereitgestellten Firebase-Befehle, damit der Ablauf leicht
// nachvollzogen werden kann.

import { auth, isFirebaseConfigured } from '@/core/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
} from 'firebase/auth'

function getAppUrl() {
  const fallbackOrigin =
    typeof window !== 'undefined' && window?.location?.origin
      ? window.location.origin
      : ''
  return (import.meta.env.VITE_PUBLIC_URL ?? fallbackOrigin).replace(/\/$/, '')
}

// Meldet einen Benutzer mit E-Mail und Passwort an.
function ensureAuthAvailable() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Authentifizierung ist derzeit nicht verfügbar.')
  }
}

export async function login(email, password) {
  ensureAuthAvailable()
  // Firebase übernimmt den eigentlichen Login-Prozess.
  return signInWithEmailAndPassword(auth, email, password)
}

// Versendet eine E-Mail, um das Passwort zurückzusetzen.
export async function resetPassword(email) {
  ensureAuthAvailable()
  const actionCodeSettings = {
    // Link, den der Nutzer nach dem Klick in der E-Mail öffnet.
    url: `${getAppUrl()}/reset-password/confirm`,
    // Der Link soll direkt in dieser Web-App geöffnet werden.
    handleCodeInApp: true,
  }
  // Firebase verschickt die Reset-E-Mail mit den obigen Einstellungen.
  return sendPasswordResetEmail(auth, email, actionCodeSettings)
}

// Meldet den aktuell angemeldeten Benutzer ab.
export async function logout() {
  ensureAuthAvailable()
  return signOut(auth)
}

// Legt einen neuen Benutzer mit E-Mail und Passwort an.
export async function register(email, password) {
  ensureAuthAvailable()
  return createUserWithEmailAndPassword(auth, email, password)
}

// Sendet eine Verifizierungs-E-Mail an den Nutzer.
// Wird kein Benutzer übergeben, verwenden wir den aktuell angemeldeten.
export async function sendVerificationEmail(user = auth.currentUser) {
  ensureAuthAvailable()
  if (!user) throw new Error('No user')
  const actionCodeSettings = {
    url: `${getAppUrl()}/verify`,
    handleCodeInApp: true,
  }
  return sendEmailVerification(user, actionCodeSettings)
}
