// src/firebase/firebase.js

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// 🔐 Deine Firebase-Konfiguration (aus Flutter übernommen)
const firebaseConfig = {
  apiKey: 'AIzaSyDUm-6snOaDyzOEcBLwuUnDnyf2aeP0_PE',
  authDomain: 'magikey-5f3ef.firebaseapp.com',
  projectId: 'magikey-5f3ef',
  storageBucket: 'magikey-5f3ef.appspot.com',
  messagingSenderId: '653075940654',
  appId: '1:653075940654:web:470bb470ffd8ef6940e6bf',
}

// 🔧 Initialisiere Firebase App
const app = initializeApp(firebaseConfig)

// 🔌 Exportiere Services wie in Flutter
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
