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
  head: {
    querySelector: vi.fn(() => null),
    appendChild: vi.fn(),
  },
  createElement: () => ({
    setAttribute: vi.fn(),
    remove: vi.fn(),
  }),
  querySelector: () => null,
}

const originalWindow = globalThis.window
const originalDocument = globalThis.document
const originalLocation = globalThis.location

globalThis.window = mockWindow
globalThis.document = mockDocument
globalThis.location = mockWindow.location

const applySeoMetaMock = vi.hoisted(() => vi.fn())

vi.mock('@/core/seo', () => ({
  applySeoMeta: applySeoMetaMock,
}))

const firebaseMock = vi.hoisted(() => ({ auth: { currentUser: null }, isFirebaseConfigured: true }))

vi.mock('@/core/firebase', () => firebaseMock)

const onAuthStateChangedMock = vi.hoisted(() =>
  vi.fn((auth, onAuth) => {
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

vi.mock('@/core/constants/admin', () => ({
  USER_ROLES: { ADMIN: 'admin', USER: 'user', COMPANY: 'company' },
  getUserRole: getUserRoleMock,
}))

const resolveCompanyPortalRouteMock = vi.hoisted(() => vi.fn(async () => 'dashboard'))

vi.mock('@/core/services/company', () => ({
  resolveCompanyPortalRoute: resolveCompanyPortalRouteMock,
}))

import { auth } from '@/core/firebase'
import { USER_ROLES } from '@/core/constants/admin'

let router
let navigationGuard
let applySeoForRoute

function findRoute(name) {
  return router.getRoutes().find((route) => route.name === name)
}

describe('router configuration', () => {
  beforeAll(async () => {
    const routerModule = await import('./index')
    router = routerModule.default
    navigationGuard = routerModule.navigationGuard
    applySeoForRoute = routerModule.applySeoForRoute
  })

  beforeEach(() => {
    getUserRoleMock.mockClear()
    resolveCompanyPortalRouteMock.mockClear()
    applySeoMetaMock.mockClear()
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
    const customerRoutes = [
      'home',
      'details',
      'support',
      'help',
      'blog',
      'locksmith-reutlingen',
    ]
    const missing = customerRoutes.filter((name) => !findRoute(name))
    expect(missing).toEqual([])
  })

  it('provides all company portal routes', () => {
    const companyRoutes = ['register', 'login', 'dashboard', 'edit', 'verification-hold', 'success']
    const missing = companyRoutes.filter((name) => !findRoute(name))
    expect(missing).toEqual([])
  })

  it('protects company portal routes with auth metadata', () => {
    const protectedRoutes = ['dashboard', 'edit', 'verification-hold', 'admin-dashboard', 'admin-company-detail']
    for (const name of protectedRoutes) {
      const route = findRoute(name)
      expect(route, `${name} should exist`).toBeTruthy()
      expect(route.meta?.requiresAuth).toBe(true)
    }
  })

  it('requires admin flag for admin routes only', () => {
    const adminRoutes = ['admin-dashboard', 'admin-company-detail']
    for (const name of adminRoutes) {
      const route = findRoute(name)
      expect(route?.meta?.requiresAdmin).toBe(true)
    }

    const otherRoutes = router
      .getRoutes()
      .filter((route) => route.meta?.requiresAdmin && !adminRoutes.includes(route.name))
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

  it('redirects unverified companies away from edit route', async () => {
    auth.currentUser = { uid: 'company-5' }
    getUserRoleMock.mockResolvedValueOnce(USER_ROLES.COMPANY)
    resolveCompanyPortalRouteMock.mockResolvedValueOnce('verification-hold')

    const next = vi.fn()
    await navigationGuard(
      { name: 'edit', meta: { requiresAuth: true } },
      { name: 'dashboard' },
      next
    )

    expect(next).toHaveBeenCalledWith({ name: 'verification-hold' })
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

  it('falls back to customer role when role lookup fails', async () => {
    auth.currentUser = { uid: 'user-3' }
    getUserRoleMock.mockRejectedValueOnce(new Error('network down'))
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const next = vi.fn()
    await expect(
      navigationGuard({ name: 'dashboard', meta: { requiresAuth: true } }, { name: 'home' }, next)
    ).resolves.toBeUndefined()

    expect(resolveCompanyPortalRouteMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith({ name: 'home' })
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Fehler beim Bestimmen der Nutzerrolle',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
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

  it('applies SEO defaults when no definition is provided', () => {
    applySeoForRoute({ meta: {}, fullPath: '/demo' })

    expect(applySeoMetaMock).toHaveBeenCalledTimes(1)
    expect(applySeoMetaMock).toHaveBeenCalledWith({
      url: 'http://localhost/demo',
      canonical: 'http://localhost/demo',
    })
  })

  it('normalises inferred URLs by dropping query and hash fragments', () => {
    applySeoForRoute({ meta: {}, fullPath: '/companies/acme-locks?ref=ads#kontakt' })

    expect(applySeoMetaMock).toHaveBeenCalledWith({
      url: 'http://localhost/companies/acme-locks',
      canonical: 'http://localhost/companies/acme-locks',
    })
  })

  it('prefers explicit url and canonical definitions over inferred values', () => {
    applySeoForRoute({
      meta: {
        seo: {
          title: 'Individuelle Seite',
          url: 'https://magikey.app/locksmiths/best-practices',
          canonical: 'https://magikey.app/locksmiths/best-practices',
        },
      },
      fullPath: '/locksmiths/best-practices?ref=campaign',
    })

    expect(applySeoMetaMock).toHaveBeenCalledTimes(1)
    expect(applySeoMetaMock).toHaveBeenCalledWith({
      title: 'Individuelle Seite',
      url: 'https://magikey.app/locksmiths/best-practices',
      canonical: 'https://magikey.app/locksmiths/best-practices',
    })
  })

  it('keeps explicit canonical query parameters but removes hashes', () => {
    applySeoForRoute({
      meta: {
        seo: {
          canonical: 'https://magikey.app/landing?city=berlin#preise',
        },
      },
      fullPath: '/landing',
    })

    expect(applySeoMetaMock).toHaveBeenCalledWith({
      canonical: 'https://magikey.app/landing?city=berlin',
      url: 'https://magikey.app/landing?city=berlin',
    })
  })

  it('falls back to inferred links when explicit values are blank', () => {
    applySeoForRoute({
      meta: {
        seo: {
          title: 'Leer definierte Seite',
          url: '   ',
          canonical: '\n',
        },
      },
      fullPath: '/ratgeber/sicherheitstipps',
    })

    expect(applySeoMetaMock).toHaveBeenCalledTimes(1)
    expect(applySeoMetaMock).toHaveBeenCalledWith({
      title: 'Leer definierte Seite',
      url: 'http://localhost/ratgeber/sicherheitstipps',
      canonical: 'http://localhost/ratgeber/sicherheitstipps',
    })
  })

  it('rekonstruiert den Ursprung, wenn window.location.origin fehlt', () => {
    const originalOrigin = mockWindow.location.origin
    delete mockWindow.location.origin

    applySeoForRoute({ meta: {}, fullPath: '/fehlender-ursprung' })

    expect(applySeoMetaMock).toHaveBeenCalledTimes(1)
    expect(applySeoMetaMock).toHaveBeenCalledWith({
      url: 'http://localhost/fehlender-ursprung',
      canonical: 'http://localhost/fehlender-ursprung',
    })

    mockWindow.location.origin = originalOrigin
  })
})
