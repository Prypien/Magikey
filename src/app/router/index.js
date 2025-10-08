// Router-Konfiguration der Anwendung
import { createRouter, createWebHistory } from 'vue-router'

// Layout-Komponente
import DefaultLayout from '@/app/layouts/DefaultLayout.vue'

// Startseite wird häufig genutzt und bleibt im Hauptbundle
import HomeView from '@/features/home/pages/HomeView.vue'

// Firebase-Auth-Instanz zum Prüfen von Login-Status
import { auth, isFirebaseConfigured } from '@/core/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { USER_ROLES, getUserRole } from '@/core/constants/admin'
import { resolveCompanyPortalRoute } from '@/core/services/company'
import { applySeoMeta } from '@/core/seo'

// Definierte Routen
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: {
          seo: {
            title: 'Magikey – Transparente Schlüsseldienst-Suche',
            description:
              'Vergleiche verifizierte Schlüsseldienste in deiner Nähe, finde transparente Preise und erhalte Soforthilfe bei Notfällen.',
            keywords:
              'Schlüsseldienst Vergleich, Schlüsselnotdienst, Türöffnung, Magikey, seriöse Schlüsseldienste',
          },
        },
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/features/company/pages/LoginView.vue'),
        meta: {
          seo: {
            title: 'Magikey Firmen-Login',
            description:
              'Melde dich bei Magikey an, um deinen Schlüsseldienst zu verwalten, Bewertungen zu pflegen und deine Sichtbarkeit zu erhöhen.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/features/company/pages/RegisterView.vue'),
        meta: {
          seo: {
            title: 'Magikey – Unternehmen registrieren',
            description:
              'Registriere deinen Schlüsseldienst bei Magikey, lade Nachweise hoch und erreiche Kundinnen und Kunden in deiner Region.',
          },
        },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/features/auth/pages/ResetPasswordView.vue'),
        meta: {
          seo: {
            title: 'Passwort zurücksetzen | Magikey',
            description:
              'Fordere einen sicheren Link zum Zurücksetzen deines Magikey Passworts an und erhalte wieder Zugriff auf dein Konto.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'reset-password/confirm',
        name: 'reset-password-confirm',
        component: () => import('@/features/auth/pages/ResetPasswordConfirmView.vue'),
        meta: {
          seo: {
            title: 'Passwort erfolgreich geändert | Magikey',
            description: 'Bestätige dein neues Passwort und melde dich direkt bei Magikey an.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/features/company/pages/DashboardView.vue'),
        meta: {
          requiresAuth: true,
          seo: {
            title: 'Firmen-Dashboard | Magikey',
            description:
              'Verwalte deine Unternehmensdaten, beantworte Bewertungen und behalte deine Sichtbarkeit auf Magikey im Blick.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/features/company/pages/EditView.vue'),
        meta: {
          requiresAuth: true,
          seo: {
            title: 'Unternehmensprofil bearbeiten | Magikey',
            description:
              'Aktualisiere Unternehmensdaten, Öffnungszeiten und Notdienstleistungen, damit Kundinnen und Kunden dich schnell finden.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'details/:id',
        name: 'details',
        component: () => import('@/features/user/pages/CompanyDetailView.vue'),
        props: true,
        meta: {
          seo: {
            title: 'Schlüsseldienst-Details | Magikey',
            description:
              'Alle Informationen zu geprüften Schlüsseldiensten: Leistungen, Bewertungen und Kontaktmöglichkeiten auf einen Blick.',
          },
        },
      },
      {
        path: 'impressum',
        name: 'impressum',
        component: () => import('@/features/static/pages/ImpressumView.vue'),
        meta: {
          seo: {
            title: 'Impressum | Magikey',
            description: 'Rechtliche Angaben und Kontaktinformationen rund um die Magikey Plattform.',
            robots: 'index,follow',
          },
        },
      },
      {
        path: 'datenschutz',
        name: 'datenschutz',
        component: () => import('@/features/static/pages/DatenschutzView.vue'),
        meta: {
          seo: {
            title: 'Datenschutzerklärung | Magikey',
            description:
              'Erfahre, wie Magikey deine Daten schützt, welche Informationen verarbeitet werden und welche Rechte du hast.',
            robots: 'index,follow',
          },
        },
      },
      {
        path: 'hilfe',
        name: 'help',
        component: () => import('@/features/static/pages/HelpCenterView.vue'),
        meta: {
          seo: {
            title: 'Hilfe-Center | Magikey',
            description:
              'Antworten auf häufige Fragen zur Schlüsseldienst-Suche, zum Notfall-Service und zur Registrierung bei Magikey.',
          },
        },
      },
      {
        path: 'support',
        name: 'support',
        component: () => import('@/features/static/pages/SupportView.vue'),
        meta: {
          seo: {
            title: 'Support kontaktieren | Magikey',
            description: 'Kontaktiere das Magikey Support-Team bei Fragen rund um deinen Account oder unseren Service.',
          },
        },
      },
      {
        path: 'success',
        name: 'success',
        component: () => import('@/features/static/pages/SuccessView.vue'),
        meta: {
          seo: {
            title: 'Vielen Dank! | Magikey',
            description: 'Deine Aktion war erfolgreich. Wir bestätigen dir alle Details per E-Mail.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'verify',
        name: 'verify-email',
        component: () => import('@/features/auth/pages/VerifyEmailView.vue'),
        meta: {
          seo: {
            title: 'E-Mail-Adresse bestätigen | Magikey',
            description: 'Bestätige deine E-Mail-Adresse, um alle Funktionen deines Magikey Kontos zu aktivieren.',
            robots: 'noindex,nofollow',
          },
        },
      },
      { path: 'verify-email', redirect: '/verify' },
      {
        path: 'on-hold',
        name: 'verification-hold',
        component: () => import('@/features/company/pages/VerificationHoldView.vue'),
        meta: {
          requiresAuth: true,
          seo: {
            title: 'Verifizierung in Prüfung | Magikey',
            description:
              'Wir überprüfen deine Unterlagen. Du erhältst eine Benachrichtigung, sobald dein Schlüsseldienst freigeschaltet ist.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'admin',
        name: 'admin-dashboard',
        component: () => import('@/features/admin/pages/AdminDashboardView.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
          seo: {
            title: 'Admin-Bereich | Magikey',
            description: 'Behalte Nutzeraktivitäten im Blick und verwalte Inhalte der Magikey Plattform.',
            robots: 'noindex,nofollow',
          },
        },
      },
      {
        path: 'blog',
        name: 'blog',
        component: () => import('@/features/blog/pages/BlogListView.vue'),
        meta: {
          seo: {
            title: 'Magikey Blog – Tipps rund um Schlüsseldienste',
            description:
              'Ratgeber für den Ernstfall, Sicherheitstipps für dein Zuhause und Updates aus der Magikey Plattform.',
            keywords: 'Magikey Blog, Schlüsseldienst Ratgeber, Sicherheitstipps, Schlüsselnotdienst Wissen',
          },
        },
      },
      {
        path: 'blog/:slug',
        name: 'blog-post',
        component: () => import('@/features/blog/pages/BlogPostView.vue'),
        props: true,
        meta: {
          seo: {
            title: 'Magikey Blogartikel',
            description: 'Ausführliche Ratgeber und Geschichten aus der Welt der Schlüsseldienste.',
            keywords: 'Magikey Blog, Schlüsseldienst Wissen, Türöffnung Tipps',
          },
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/features/static/pages/NotFoundView.vue'),
    meta: {
      seo: {
        title: 'Seite nicht gefunden | Magikey',
        description:
          'Die angeforderte Seite existiert nicht mehr. Kehre zur Startseite zurück und finde geprüfte Schlüsseldienste.',
        robots: 'noindex,nofollow',
      },
    },
  },
]

// Router erstellen
const router = createRouter({
  history: createWebHistory(),
  routes,
})

function buildFullUrl(to) {
  if (typeof window === 'undefined' || !window.location) {
    return undefined
  }

  const baseOrigin = window.location.origin || ''
  const targetPath = to?.fullPath ?? '/'

  try {
    return new URL(targetPath || '/', baseOrigin).toString()
  } catch (error) {
    console.error('Fehler beim Ermitteln der kanonischen URL', error)

    const normalizedPath = targetPath?.startsWith('/') ? targetPath : `/${targetPath || ''}`
    return `${baseOrigin}${normalizedPath}`
  }
}

export function applySeoForRoute(to) {
  const seoSource = typeof to?.meta?.seo === 'function' ? to.meta.seo(to) : to?.meta?.seo
  const seoDefinition = (seoSource && typeof seoSource === 'object') ? { ...seoSource } : {}
  const fullUrl = buildFullUrl(to)
  const canonical = seoDefinition.canonical ?? fullUrl ?? seoDefinition.url

  applySeoMeta({
    ...seoDefinition,
    url: fullUrl ?? seoDefinition.url,
    canonical,
  })
}

router.afterEach((to) => {
  try {
    applySeoForRoute(to)
  } catch (error) {
    console.error('Fehler beim Anwenden der SEO-Metadaten', error)
  }
})

let authReady = false

function waitForAuthInit() {
  if (!isFirebaseConfigured || authReady) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let unsubscribe = () => {}

    const finalize = () => {
      authReady = true

      Promise.resolve()
        .then(() => {
          unsubscribe()
        })
        .catch(() => {
          unsubscribe()
        })

      resolve()
    }

    const handleError = (error) => {
      console.error('Fehler beim Beobachten des Auth-Status', error)
      finalize()
    }

    unsubscribe = onAuthStateChanged(auth, finalize, handleError)
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

    const target = await getCompanyPortalTarget()
    if (target !== 'dashboard' && target !== to.name) {
      next({ name: target })
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
