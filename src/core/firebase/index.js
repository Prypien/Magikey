// Dieses Modul verbindet unsere Anwendung mit Firebase.
// Firebase ist ein Service von Google, der Login, Datenbank und
// Dateispeicher zur Verfügung stellt.

import { initializeApp } from 'firebase/app'
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

let app = null
let auth = null
let db = null
let storage = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} else {
  console.warn('Firebase-Konfiguration fehlt oder ist unvollständig. Firebase-Funktionen werden deaktiviert.')
}

export { app, auth, db, storage, isFirebaseConfigured }
