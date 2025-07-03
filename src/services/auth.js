import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
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

export async function sendVerificationEmail(user = auth.currentUser) {
  if (!user) throw new Error('No user')
  const actionCodeSettings = {
    url: (typeof window !== 'undefined' ? window.location.origin : '') + '/verify-email',
    handleCodeInApp: true,
  }
  return sendEmailVerification(user, actionCodeSettings)
}
