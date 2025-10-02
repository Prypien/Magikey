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

// Navigation Guard für geschützte Routen
router.beforeEach(async (to, from, next) => {
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

  if (requiresAuth && !user) {
    next({ name: 'login' })
  } else if (requiresAdmin && !userIsAdmin) {
    next({ name: 'dashboard' })
  } else if (user && isLoginRoute) {
    next({ name: userIsAdmin ? 'admin-dashboard' : 'dashboard' })
  } else {
    next()
  }
})

export default router
