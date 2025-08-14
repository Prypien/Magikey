// Diese Datei bündelt Hilfsfunktionen für die Benutzer-Authentifizierung.
// Die Funktionen sind bewusst kurz gehalten und verwenden direkt die
// bereitgestellten Firebase-Befehle, damit der Ablauf leicht
// nachvollzogen werden kann.

import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
} from 'firebase/auth'

// Meldet einen Benutzer mit E-Mail und Passwort an.
export async function login(email, password) {
  // Firebase übernimmt den eigentlichen Login-Prozess.
  return signInWithEmailAndPassword(auth, email, password)
}

// Versendet eine E-Mail, um das Passwort zurückzusetzen.
export async function resetPassword(email) {
  const actionCodeSettings = {
    // Link, den der Nutzer nach dem Klick in der E-Mail öffnet.
    url: 'https://magikey.de/reset-password/confirm',
    // Der Link soll direkt in dieser Web-App geöffnet werden.
    handleCodeInApp: true,
  }
  // Firebase verschickt die Reset-E-Mail mit den obigen Einstellungen.
  return sendPasswordResetEmail(auth, email, actionCodeSettings)
}

// Meldet den aktuell angemeldeten Benutzer ab.
export async function logout() {
  return signOut(auth)
}

// Legt einen neuen Benutzer mit E-Mail und Passwort an.
export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

// Sendet eine Verifizierungs-E-Mail an den Nutzer.
// Wird kein Benutzer übergeben, verwenden wir den aktuell angemeldeten.
export async function sendVerificationEmail(user = auth.currentUser) {
  if (!user) throw new Error('No user')
  const actionCodeSettings = {
    url: 'https://magikey.de/verify',
    handleCodeInApp: true,
  }
  return sendEmailVerification(user, actionCodeSettings)
}
