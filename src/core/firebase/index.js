// Dieses Modul verbindet unsere Anwendung mit Firebase.
// Firebase ist ein Service von Google, der Login, Datenbank und
// Dateispeicher zur Verfügung stellt.

import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Die Zugangsdaten werden aus der Konfigurationsdatei (.env) gelesen.
// So bleiben sie geheim und können je nach Umgebung unterschiedlich sein.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)

const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY
const appCheckDebugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN

let app = null
let auth = null
let db = null
let storage = null
let appCheck = null

if (appCheckDebugToken) {
  const normalizedDebugToken =
    appCheckDebugToken.trim().toLowerCase() === 'true' ? true : appCheckDebugToken
  globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = normalizedDebugToken
}

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)

  if (appCheckSiteKey) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
  } else {
    console.warn('Firebase App Check Site Key fehlt. App Check wird nicht initialisiert.')
  }

  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} else {
  console.warn('Firebase-Konfiguration fehlt oder ist unvollständig. Firebase-Funktionen werden deaktiviert.')
}

export { app, appCheck, auth, db, storage, isFirebaseConfigured }
