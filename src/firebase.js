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

// Mit diesen Daten starten wir die Verbindung zu Firebase.
const app = initializeApp(firebaseConfig)

// Aus der gestarteten App holen wir uns die einzelnen Dienste:
// - auth: Benutzer anmelden und verwalten
// - db:   Datenbank für strukturierte Daten
// - storage: Dateien (z.B. Bilder) ablegen
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Andere Module können diese Dienste importieren und nutzen.
export { app, auth, db, storage }
