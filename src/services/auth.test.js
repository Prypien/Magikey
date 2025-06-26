import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/firebase/firebase', () => ({
  auth: 'auth-instance'
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve('signed-in')),
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve('created')),
  sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
  signOut: vi.fn(() => Promise.resolve()),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(() => Promise.resolve('google')),
}))

import { login, resetPassword, logout, loginWithGoogle, register } from './auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithPopup } from 'firebase/auth'

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login calls firebase signInWithEmailAndPassword', async () => {
    await login('test@example.com', 'pass')
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith('auth-instance', 'test@example.com', 'pass')
  })

  it('resetPassword calls firebase sendPasswordResetEmail', async () => {
    await resetPassword('mail@example.com')
    expect(sendPasswordResetEmail).toHaveBeenCalledWith('auth-instance', 'mail@example.com')
  })

  it('logout calls firebase signOut', async () => {
    await logout()
    expect(signOut).toHaveBeenCalledWith('auth-instance')
  })

  it('loginWithGoogle uses signInWithPopup', async () => {
    await loginWithGoogle()
    expect(signInWithPopup).toHaveBeenCalled()
  })

  it('register uses createUserWithEmailAndPassword', async () => {
    await register('new@mail.com', 'secret')
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith('auth-instance', 'new@mail.com', 'secret')
  })
})
