// Router-Konfiguration der Anwendung
import { createRouter, createWebHistory } from 'vue-router'

// Layout-Komponente
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Startseite wird häufig genutzt und bleibt im Hauptbundle
import HomeView from '@/pages/HomeView.vue'

// Firebase-Auth-Instanz zum Prüfen von Login-Status
import { auth, db, isFirebaseConfigured } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

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
        path: 'admin/verification',
        name: 'admin-verification',
        component: () => import('@/pages/admin/VerificationQueueView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'review/:requestId',
        name: 'review-request',
        component: () => import('@/pages/review/ReviewSubmissionView.vue'),
        props: true,
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
const adminStatusCache = new Map()

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

async function userIsAdmin(uid) {
  if (!uid) return false

  if (!isFirebaseConfigured || !db) {
    return true
  }

  if (adminStatusCache.has(uid)) {
    const cached = adminStatusCache.get(uid)
    if (typeof cached === 'boolean') {
      return cached
    }
    return cached
  }

  const fetchPromise = (async () => {
    try {
      const snap = await getDoc(doc(db, 'companies', uid))
      const isAdmin = Boolean(snap.exists() && snap.data()?.is_admin)
      adminStatusCache.set(uid, isAdmin)
      return isAdmin
    } catch (error) {
      console.error('Fehler beim Laden der Admin-Berechtigung:', error)
      adminStatusCache.delete(uid)
      throw error
    }
  })()

  adminStatusCache.set(uid, fetchPromise)
  return fetchPromise
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

  if (requiresAuth && !user) {
    next({ name: 'login' })
    return
  } else if (user && isLoginRoute) {
    next({ name: 'dashboard' })
    return
  }

  if (requiresAdmin) {
    try {
      const isAdmin = await userIsAdmin(user?.uid)
      if (!isAdmin) {
        next({ name: 'dashboard', query: { notice: 'admin_required' } })
        return
      }
    } catch (error) {
      console.error('Admin-Prüfung fehlgeschlagen:', error)
      next({ name: 'dashboard', query: { notice: 'admin_error' } })
      return
    }
  }

  next()
})

export default router
