// src/router/index.js
// Router-Konfiguration der Anwendung
// Jede Route wird weiter unten definiert
import { createRouter, createWebHistory } from 'vue-router'

// Layout
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Seiten
import HomeView from '@/pages/HomeView.vue'
import LoginView from '@/pages/Company/LoginView.vue'
import RegisterView from '@/pages/Company/RegisterView.vue'
import DashboardView from '@/pages/Company/DashboardView.vue'
import EditView from '@/pages/Company/EditView.vue'
import CompanyDetailView from '@/pages/user/CompanyDetailView.vue'
import ImpressumView from '@/pages/ImpressumView.vue'
import DatenschutzView from '@/pages/DatenschutzView.vue'
import ResetPasswordView from '@/pages/ResetPasswordView.vue'
import NotFoundView from '@/pages/NotFoundView.vue'

// Firebase Auth
import { auth } from '@/firebase/firebase'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      // Startseite
      { path: '', name: 'home', component: HomeView },
      // Authentifizierung
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView },
      { path: 'reset-password', name: 'reset-password', component: ResetPasswordView },
      // Geschützter Bereich für registrierte Unternehmen
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true },
      },
      {
        path: 'edit',
        name: 'edit',
        component: EditView,
        meta: { requiresAuth: true },
      },
      // Detailseite für Nutzer
      {
        path: 'details/:id',
        name: 'details',
        component: CompanyDetailView,
        props: true,
      },
      { path: 'impressum', name: 'impressum', component: ImpressumView },
      { path: 'datenschutz', name: 'datenschutz', component: DatenschutzView },
    ],
  },
  // Fallback-Route für 404-Seiten
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

// Router-Instanz erzeugen
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔐 Auth-Guard: Schützt geschützte Routen
router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  const requiresAuth = to.meta.requiresAuth
  const isLoginRoute = to.name === 'login'

  if (requiresAuth && !user) {
    // Ungeloggt und Route verlangt Auth -> Login
    next({ name: 'login' })
  } else if (user && isLoginRoute) {
    // Bereits eingeloggt, aber Loginseite -> weiter zum Dashboard
    next({ name: 'dashboard' })
  } else {
    // Alles ok -> weiter zur angeforderten Seite
    next()
  }
})

// Router für die App exportieren
export default router
