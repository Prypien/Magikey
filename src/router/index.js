// Router-Konfiguration der Anwendung
import { createRouter, createWebHistory } from 'vue-router'

// Layout-Komponente
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Startseite wird häufig genutzt und bleibt im Hauptbundle
import HomeView from '@/pages/HomeView.vue'

// Firebase-Auth-Instanz zum Prüfen von Login-Status
import { auth, isFirebaseConfigured } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { USER_ROLES, getUserRole } from '@/constants/admin'
import { resolveCompanyPortalRoute } from '@/services/company'

// Definierte Routen
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'login', name: 'login', component: () => import('@/pages/company/LoginView.vue') },
      { path: 'register', name: 'register', component: () => import('@/pages/company/RegisterView.vue') },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/pages/auth/ResetPasswordView.vue'),
      },
      {
        path: 'reset-password/confirm',
        name: 'reset-password-confirm',
        component: () => import('@/pages/auth/ResetPasswordConfirmView.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/company/DashboardView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/pages/company/EditView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'details/:id',
        name: 'details',
        component: () => import('@/pages/user/CompanyDetailView.vue'),
        props: true,
      },
      {
        path: 'impressum',
        name: 'impressum',
        component: () => import('@/pages/static/ImpressumView.vue'),
      },
      {
        path: 'datenschutz',
        name: 'datenschutz',
        component: () => import('@/pages/static/DatenschutzView.vue'),
      },
      { path: 'hilfe', name: 'help', component: () => import('@/pages/static/HelpCenterView.vue') },
      {
        path: 'support',
        name: 'support',
        component: () => import('@/pages/static/SupportView.vue'),
      },
      { path: 'success', name: 'success', component: () => import('@/pages/static/SuccessView.vue') },
      { path: 'verify', name: 'verify-email', component: () => import('@/pages/auth/VerifyEmailView.vue') },
      { path: 'verify-email', redirect: '/verify' },
      {
        path: 'on-hold',
        name: 'verification-hold',
        component: () => import('@/pages/company/VerificationHoldView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'admin',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/AdminDashboardView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/static/NotFoundView.vue'),
  },
]

// Router erstellen
const router = createRouter({
  history: createWebHistory(),
  routes,
})

let authReady = false

function waitForAuthInit() {
  if (!isFirebaseConfigured || authReady) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      () => {
        authReady = true
        unsubscribe()
        resolve()
      },
      () => {
        authReady = true
        unsubscribe()
        resolve()
      }
    )
  })
}

function isCompanyPortalRoute(routeName) {
  return routeName === 'dashboard' || routeName === 'verification-hold'
}

function isCompanyRestrictedRoute(routeName) {
  return (
    routeName === 'dashboard' ||
    routeName === 'verification-hold' ||
    routeName === 'edit'
  )
}

async function determineCompanyPortalTarget(user) {
  if (!user?.uid) {
    return 'dashboard'
  }

  try {
    const target = await resolveCompanyPortalRoute(user.uid)
    return target || 'dashboard'
  } catch (error) {
    console.error('Fehler beim Bestimmen des Firmenportals:', error)
    return 'dashboard'
  }
}

// Navigation Guard für geschützte Routen
export async function navigationGuard(to, from, next) {
  try {
    await waitForAuthInit()
  } catch (error) {
    console.error('Fehler beim Initialisieren der Authentifizierung', error)
  }

  const user = isFirebaseConfigured ? auth.currentUser : null
  const requiresAuth = isFirebaseConfigured && to.meta.requiresAuth
  const requiresAdmin = isFirebaseConfigured && to.meta.requiresAdmin
  const isLoginRoute = to.name === 'login'
  const userRole = user
    ? await getUserRole(user, { forceRefresh: requiresAdmin })
    : USER_ROLES.USER
  const userIsAdmin = userRole === USER_ROLES.ADMIN
  const userIsCompany = userRole === USER_ROLES.COMPANY

  let companyPortalTarget = null
  const getCompanyPortalTarget = async () => {
    if (!userIsCompany) {
      return 'dashboard'
    }
    if (!companyPortalTarget) {
      companyPortalTarget = await determineCompanyPortalTarget(user)
    }
    return companyPortalTarget
  }

  if (requiresAuth && !user) {
    next({ name: 'login' })
    return
  }

  if (requiresAdmin && !userIsAdmin) {
    if (userIsCompany && user) {
      const target = await getCompanyPortalTarget()
      next({ name: target })
    } else {
      next({ name: 'home' })
    }
    return
  }

  if (requiresAuth && isCompanyRestrictedRoute(to.name)) {
    if (userIsAdmin) {
      next({ name: 'admin-dashboard' })
      return
    }

    if (!userIsCompany) {
      next({ name: 'home' })
      return
    }
  }

  if (user && isLoginRoute) {
    if (userIsAdmin) {
      next({ name: 'admin-dashboard' })
      return
    }

    if (userIsCompany) {
      const target = await getCompanyPortalTarget()
      next({ name: target })
      return
    }

    next({ name: 'home' })
    return
  }

  if (user && userIsCompany && isCompanyPortalRoute(to.name)) {
    const target = await getCompanyPortalTarget()
    if (target !== to.name) {
      next({ name: target })
      return
    }
  }

  next()
}

router.beforeEach(navigationGuard)

export default router
