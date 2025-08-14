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
  const actionCodeSettings = {
    url: 'https://magikey.de/reset-password/confirm',
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
  const actionCodeSettings = {
    url: 'https://magikey.de/verify',
    handleCodeInApp: true,
  }
  return sendEmailVerification(user, actionCodeSettings)
}
