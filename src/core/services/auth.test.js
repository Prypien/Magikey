// Diese Datei überprüft die Authentifizierungsfunktionen mit Tests.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/core/firebase', () => ({
  auth: 'auth-instance',
  isFirebaseConfigured: true,
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve('signed-in')),
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve('created')),
  sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
  signOut: vi.fn(() => Promise.resolve()),
  sendEmailVerification: vi.fn(() => Promise.resolve()),
}))

import { login, resetPassword, logout, register, sendVerificationEmail } from './auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, sendEmailVerification } from 'firebase/auth'

describe('auth service', () => {
  let originalWindow

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_PUBLIC_URL', 'https://app.magikey.test')
    vi.stubEnv('BASE_URL', '/')

    originalWindow = globalThis.window
    globalThis.window = { location: { origin: '' } }
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    if (originalWindow === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = originalWindow
    }
  })

  it('login calls firebase signInWithEmailAndPassword', async () => {
    await login('test@example.com', 'pass')
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith('auth-instance', 'test@example.com', 'pass')
  })

  it('resetPassword calls firebase sendPasswordResetEmail', async () => {
    await resetPassword('mail@example.com')
    expect(sendPasswordResetEmail).toHaveBeenCalledWith('auth-instance', 'mail@example.com', {
      url: 'https://app.magikey.test/reset-password/confirm',
      handleCodeInApp: true,
    })
  })

  it('prefers runtime origin when available for action links', async () => {
    window.location.origin = 'https://runtime.magikey.test'

    await resetPassword('mail@example.com')

    expect(sendPasswordResetEmail).toHaveBeenCalledWith('auth-instance', 'mail@example.com', {
      url: 'https://runtime.magikey.test/reset-password/confirm',
      handleCodeInApp: true,
    })
  })

  it('normalises configured urls by trimming trailing slashes and paths', async () => {
    vi.stubEnv('VITE_PUBLIC_URL', 'https://app.magikey.test/base/')
    window.location.origin = ''

    await resetPassword('mail@example.com')

    expect(sendPasswordResetEmail).toHaveBeenCalledWith('auth-instance', 'mail@example.com', {
      url: 'https://app.magikey.test/base/reset-password/confirm',
      handleCodeInApp: true,
    })
  })

  it('throws a helpful error when no app url can be resolved', async () => {
    vi.stubEnv('VITE_PUBLIC_URL', '')
    delete globalThis.window

    await expect(resetPassword('mail@example.com')).rejects.toThrow(
      'App-URL konnte nicht ermittelt werden. Setze VITE_PUBLIC_URL oder rufe die Funktion im Browser-Kontext auf.'
    )
    expect(sendPasswordResetEmail).not.toHaveBeenCalled()
  })

  it('logout calls firebase signOut', async () => {
    await logout()
    expect(signOut).toHaveBeenCalledWith('auth-instance')
  })

  it('register uses createUserWithEmailAndPassword', async () => {
    await register('new@mail.com', 'secret')
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith('auth-instance', 'new@mail.com', 'secret')
  })

  it('sendVerificationEmail calls firebase sendEmailVerification', async () => {
    const user = { uid: '1' }
    await sendVerificationEmail(user)
    expect(sendEmailVerification).toHaveBeenCalledWith(user, {
      url: 'https://app.magikey.test/verify',
      handleCodeInApp: true,
    })
  })

  it('sendVerificationEmail prefers runtime origin when available', async () => {
    const user = { uid: '2' }
    window.location.origin = 'https://runtime.magikey.test'

    await sendVerificationEmail(user)

    expect(sendEmailVerification).toHaveBeenCalledWith(user, {
      url: 'https://runtime.magikey.test/verify',
      handleCodeInApp: true,
    })
  })

  it('sendVerificationEmail berücksichtigt Vite-Basis-Pfad aus BASE_URL', async () => {
    const user = { uid: '3' }
    window.location.origin = 'https://runtime.magikey.test'
    vi.stubEnv('BASE_URL', '/portal/')

    await sendVerificationEmail(user)

    expect(sendEmailVerification).toHaveBeenCalledWith(user, {
      url: 'https://runtime.magikey.test/portal/verify',
      handleCodeInApp: true,
    })
  })
})

