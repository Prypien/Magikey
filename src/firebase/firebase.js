// src/firebase/firebase.js

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// 🔐 Firebase-Konfiguration über Umgebungsvariablen
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
console.log("🔥 API Key aus .env:", import.meta.env.VITE_FIREBASE_API_KEY)
console.log("📦 Ganze Firebase Config:", firebaseConfig)

// 🔧 Initialisiere Firebase App
const app = initializeApp(firebaseConfig)

// 🔌 Exportiere Services wie in Flutter
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
