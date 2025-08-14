import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
} from 'firebase/auth'

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function resetPassword(email) {
  const baseUrl =
    import.meta.env.VITE_PUBLIC_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://magikey.de')
  const actionCodeSettings = {
    url: baseUrl + '/reset-password/confirm',
    handleCodeInApp: true,
  }
  return sendPasswordResetEmail(auth, email, actionCodeSettings)
}

export async function logout() {
  return signOut(auth)
}

export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function sendVerificationEmail(user = auth.currentUser) {
  if (!user) throw new Error('No user')
  const baseUrl =
    import.meta.env.VITE_PUBLIC_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://magikey.de')
  const actionCodeSettings = {
    url: baseUrl + '/verify',
    handleCodeInApp: true,
  }
  return sendEmailVerification(user, actionCodeSettings)
}
