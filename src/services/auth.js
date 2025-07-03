import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}

export async function logout() {
  return signOut(auth)
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}