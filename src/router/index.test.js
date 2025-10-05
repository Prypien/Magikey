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

vi.mock('@/firebase', () => ({
  auth: { currentUser: null },
  isFirebaseConfigured: false,
}))

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
}))

const getUserRoleMock = vi.hoisted(() => vi.fn(async () => 'user'))

vi.mock('@/constants/admin', () => ({
  USER_ROLES: { ADMIN: 'admin', USER: 'user', COMPANY: 'company' },
  getUserRole: getUserRoleMock,
}))

let router

function findRoute(name) {
  return router.getRoutes().find((route) => route.name === name)
}

describe('router configuration', () => {
  beforeAll(async () => {
    router = (await import('./index')).default
  })

  beforeEach(() => {
    getUserRoleMock.mockClear()
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
})
