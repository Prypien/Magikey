import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest'

const mockWindow = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  innerWidth: 1024,
  scrollY: 0,
  location: {
    pathname: '/',
    search: '',
    hash: '',
    host: 'localhost',
    protocol: 'http:',
    origin: 'http://localhost',
  },
  history: {
    state: null,
    pushState: vi.fn(),
    replaceState: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
  },
  navigator: { userAgent: 'node' },
  ResizeObserver: class {
    observe() {}
    disconnect() {}
  },
  sessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}

const mockDocument = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  body: {
    style: { overflow: '' },
  },
  createElement: () => ({ style: {} }),
  querySelector: () => null,
}

const originalWindow = globalThis.window
const originalDocument = globalThis.document
const originalLocation = globalThis.location

globalThis.window = mockWindow
globalThis.document = mockDocument
globalThis.location = mockWindow.location

const firebaseMock = vi.hoisted(() => ({ auth: { currentUser: null }, isFirebaseConfigured: true }))

vi.mock('@/firebase', () => firebaseMock)

const onAuthStateChangedMock = vi.hoisted(() =>
  vi.fn((auth, onAuth, onError) => {
    if (typeof onAuth === 'function') {
      onAuth()
    }
    return vi.fn()
  })
)

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: onAuthStateChangedMock,
}))

const getUserRoleMock = vi.hoisted(() => vi.fn(async () => 'user'))

vi.mock('@/constants/admin', () => ({
  USER_ROLES: { ADMIN: 'admin', USER: 'user', COMPANY: 'company' },
  getUserRole: getUserRoleMock,
}))

const resolveCompanyPortalRouteMock = vi.hoisted(() => vi.fn(async () => 'dashboard'))

vi.mock('@/services/company', () => ({
  resolveCompanyPortalRoute: resolveCompanyPortalRouteMock,
}))

import { auth } from '@/firebase'
import { USER_ROLES } from '@/constants/admin'

let router
let navigationGuard

function findRoute(name) {
  return router.getRoutes().find((route) => route.name === name)
}

describe('router configuration', () => {
  beforeAll(async () => {
    const routerModule = await import('./index')
    router = routerModule.default
    navigationGuard = routerModule.navigationGuard
  })

  beforeEach(() => {
    getUserRoleMock.mockClear()
    resolveCompanyPortalRouteMock.mockClear()
    auth.currentUser = null
    getUserRoleMock.mockResolvedValue(USER_ROLES.USER)
    resolveCompanyPortalRouteMock.mockResolvedValue('dashboard')
  })

  afterAll(() => {
    globalThis.window = originalWindow
    globalThis.document = originalDocument
    globalThis.location = originalLocation
  })

  it('provides all customer facing routes', () => {
    const customerRoutes = ['home', 'details', 'support', 'help']
    const missing = customerRoutes.filter((name) => !findRoute(name))
    expect(missing).toEqual([])
  })

  it('provides all company portal routes', () => {
    const companyRoutes = ['register', 'login', 'dashboard', 'edit', 'verification-hold', 'success']
    const missing = companyRoutes.filter((name) => !findRoute(name))
    expect(missing).toEqual([])
  })

  it('protects company portal routes with auth metadata', () => {
    const protectedRoutes = ['dashboard', 'edit', 'verification-hold', 'admin-dashboard']
    for (const name of protectedRoutes) {
      const route = findRoute(name)
      expect(route, `${name} should exist`).toBeTruthy()
      expect(route.meta?.requiresAuth).toBe(true)
    }
  })

  it('requires admin flag for admin dashboard only', () => {
    const adminRoute = findRoute('admin-dashboard')
    expect(adminRoute?.meta?.requiresAdmin).toBe(true)

    const otherRoutes = router
      .getRoutes()
      .filter((route) => route.meta?.requiresAdmin && route.name !== 'admin-dashboard')
    expect(otherRoutes).toHaveLength(0)
  })

  it('keeps login route publicly accessible', () => {
    const loginRoute = findRoute('login')
    expect(loginRoute?.meta?.requiresAuth).toBeUndefined()
  })

  it('redirects unverified companies from dashboard to verification hold', async () => {
    auth.currentUser = { uid: 'company-1' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.COMPANY)
    resolveCompanyPortalRouteMock.mockResolvedValueOnce('verification-hold')

    const next = vi.fn()
    await navigationGuard(
      { name: 'dashboard', meta: { requiresAuth: true } },
      { name: 'home' },
      next
    )

    expect(next).toHaveBeenCalledWith({ name: 'verification-hold' })
  })

  it('redirects verified companies away from verification hold', async () => {
    auth.currentUser = { uid: 'company-2' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.COMPANY)
    resolveCompanyPortalRouteMock.mockResolvedValueOnce('dashboard')

    const next = vi.fn()
    await navigationGuard(
      { name: 'verification-hold', meta: { requiresAuth: true } },
      { name: 'dashboard' },
      next
    )

    expect(next).toHaveBeenCalledWith({ name: 'dashboard' })
  })

  it('blocks regular users from accessing company portal routes', async () => {
    auth.currentUser = { uid: 'user-1' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.USER)

    const next = vi.fn()
    await navigationGuard(
      { name: 'dashboard', meta: { requiresAuth: true } },
      { name: 'home' },
      next
    )

    expect(resolveCompanyPortalRouteMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith({ name: 'home' })
  })

  it('prevents regular users from opening the edit route', async () => {
    auth.currentUser = { uid: 'user-2' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.USER)

    const next = vi.fn()
    await navigationGuard(
      { name: 'edit', meta: { requiresAuth: true } },
      { name: 'home' },
      next
    )

    expect(resolveCompanyPortalRouteMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith({ name: 'home' })
  })

  it('routes admins trying to access company pages to the admin dashboard', async () => {
    auth.currentUser = { uid: 'admin-1' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.ADMIN)

    const next = vi.fn()
    await navigationGuard(
      { name: 'dashboard', meta: { requiresAuth: true } },
      { name: 'home' },
      next
    )

    expect(resolveCompanyPortalRouteMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith({ name: 'admin-dashboard' })
  })

  it('routes logged in companies away from login to their portal target', async () => {
    auth.currentUser = { uid: 'company-3' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.COMPANY)
    resolveCompanyPortalRouteMock.mockResolvedValueOnce('verification-hold')

    const next = vi.fn()
    await navigationGuard({ name: 'login', meta: {} }, { name: 'home' }, next)

    expect(next).toHaveBeenCalledWith({ name: 'verification-hold' })
  })

  it('keeps verified companies on dashboard', async () => {
    auth.currentUser = { uid: 'company-4' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.COMPANY)
    resolveCompanyPortalRouteMock.mockResolvedValueOnce('dashboard')

    const next = vi.fn()
    await navigationGuard(
      { name: 'dashboard', meta: { requiresAuth: true } },
      { name: 'home' },
      next
    )

    expect(next).toHaveBeenCalledWith()
  })
})
