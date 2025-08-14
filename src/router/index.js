// Router-Konfiguration der Anwendung
import { createRouter, createWebHistory } from 'vue-router'

// Layout-Komponente
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Startseite wird häufig genutzt und bleibt im Hauptbundle
import HomeView from '@/pages/HomeView.vue'

// Firebase-Auth-Instanz zum Prüfen von Login-Status
import { auth } from '@/firebase'

// Definierte Routen
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'login', name: 'login', component: () => import('@/pages/company/LoginView.vue') },
      { path: 'register', name: 'register', component: () => import('@/pages/company/RegisterView.vue') },
      { path: 'onboarding', name: 'onboarding', component: () => import('@/pages/company/OnboardingView.vue') },
      { path: 'reset-password', name: 'reset-password', component: () => import('@/pages/ResetPasswordView.vue') },
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
      { path: 'impressum', name: 'impressum', component: () => import('@/pages/ImpressumView.vue') },
      { path: 'datenschutz', name: 'datenschutz', component: () => import('@/pages/DatenschutzView.vue') },
      { path: 'hilfe', name: 'help', component: () => import('@/pages/HelpCenterView.vue') },
      { path: 'success', name: 'success', component: () => import('@/pages/SuccessView.vue') },
      { path: 'verify', name: 'verify-email', component: () => import('@/pages/VerifyEmailView.vue') },
      { path: 'verify-email', redirect: '/verify' },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundView.vue') },
]

// Router erstellen
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard für geschützte Routen
router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  const requiresAuth = to.meta.requiresAuth
  const isLoginRoute = to.name === 'login'

  if (requiresAuth && !user) {
    next({ name: 'login' })
  } else if (user && isLoginRoute) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
