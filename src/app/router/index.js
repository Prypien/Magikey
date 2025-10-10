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
import { ROUTE_NAMES, ROUTE_PATHS } from '@/core/constants/routes'

const childPath = (name) => (ROUTE_PATHS[name] || '').replace(/^\/+/, '')

// Definierte Routen
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: ROUTE_NAMES.HOME,
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
        path: childPath(ROUTE_NAMES.LOGIN),
        name: ROUTE_NAMES.LOGIN,
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
        path: childPath(ROUTE_NAMES.REGISTER),
        name: ROUTE_NAMES.REGISTER,
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
        path: childPath(ROUTE_NAMES.RESET_PASSWORD),
        name: ROUTE_NAMES.RESET_PASSWORD,
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
        path: childPath(ROUTE_NAMES.RESET_PASSWORD_CONFIRM),
        name: ROUTE_NAMES.RESET_PASSWORD_CONFIRM,
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
        path: childPath(ROUTE_NAMES.DASHBOARD),
        name: ROUTE_NAMES.DASHBOARD,
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
        path: childPath(ROUTE_NAMES.EDIT_PROFILE),
        name: ROUTE_NAMES.EDIT_PROFILE,
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
        path: childPath(ROUTE_NAMES.COMPANY_DETAILS),
        name: ROUTE_NAMES.COMPANY_DETAILS,
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
        path: childPath(ROUTE_NAMES.IMPRESSUM),
        name: ROUTE_NAMES.IMPRESSUM,
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
        path: childPath(ROUTE_NAMES.DATENSCHUTZ),
        name: ROUTE_NAMES.DATENSCHUTZ,
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
        path: childPath(ROUTE_NAMES.HELP),
        name: ROUTE_NAMES.HELP,
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
        path: childPath(ROUTE_NAMES.SUPPORT),
        name: ROUTE_NAMES.SUPPORT,
        component: () => import('@/features/static/pages/SupportView.vue'),
        meta: {
          seo: {
            title: 'Support kontaktieren | Magikey',
            description: 'Kontaktiere das Magikey Support-Team bei Fragen rund um deinen Account oder unseren Service.',
          },
        },
      },
      {
        path: childPath(ROUTE_NAMES.SUCCESS),
        name: ROUTE_NAMES.SUCCESS,
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
        path: childPath(ROUTE_NAMES.VERIFY_EMAIL),
        name: ROUTE_NAMES.VERIFY_EMAIL,
        component: () => import('@/features/auth/pages/VerifyEmailView.vue'),
        meta: {
          seo: {
            title: 'E-Mail-Adresse bestätigen | Magikey',
            description: 'Bestätige deine E-Mail-Adresse, um alle Funktionen deines Magikey Kontos zu aktivieren.',
            robots: 'noindex,nofollow',
          },
        },
      },
      { path: 'verify-email', redirect: ROUTE_PATHS[ROUTE_NAMES.VERIFY_EMAIL] },
      {
        path: childPath(ROUTE_NAMES.VERIFICATION_HOLD),
        name: ROUTE_NAMES.VERIFICATION_HOLD,
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
        path: childPath(ROUTE_NAMES.ADMIN_DASHBOARD),
        name: ROUTE_NAMES.ADMIN_DASHBOARD,
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
        path: childPath(ROUTE_NAMES.BLOG),
        name: ROUTE_NAMES.BLOG,
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
        path: childPath(ROUTE_NAMES.BLOG_POST),
        name: ROUTE_NAMES.BLOG_POST,
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
    name: ROUTE_NAMES.NOT_FOUND,
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

  const toCleanString = (value) => {
    if (value == null) return undefined
    const text = `${value}`.trim()
    return text ? text : undefined
  }

  const explicitUrl = toCleanString(seoDefinition.url)
  const resolvedUrl = explicitUrl ?? fullUrl
  const explicitCanonical = toCleanString(seoDefinition.canonical)
  const canonical = explicitCanonical ?? resolvedUrl ?? fullUrl

  applySeoMeta({
    ...seoDefinition,
    url: resolvedUrl,
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

    const cleanup = () => {
      authReady = true
      try {
        unsubscribe()
      } catch (error) {
        console.error('Fehler beim Entfernen des Auth-Listeners', error)
      }
      resolve()
    }

    const handleError = (error) => {
      console.error('Fehler beim Beobachten des Auth-Status', error)
      cleanup()
    }

    unsubscribe = onAuthStateChanged(auth, cleanup, handleError)
  })
}

const COMPANY_PORTAL_ROUTES = new Set([ROUTE_NAMES.DASHBOARD, ROUTE_NAMES.VERIFICATION_HOLD])
const COMPANY_RESTRICTED_ROUTES = new Set([...COMPANY_PORTAL_ROUTES, ROUTE_NAMES.EDIT_PROFILE])

function isCompanyPortalRoute(routeName) {
  return COMPANY_PORTAL_ROUTES.has(routeName)
}

function isCompanyRestrictedRoute(routeName) {
  return COMPANY_RESTRICTED_ROUTES.has(routeName)
}

async function determineCompanyPortalTarget(user) {
  if (!user?.uid) {
    return ROUTE_NAMES.DASHBOARD
  }

  try {
    const target = await resolveCompanyPortalRoute(user.uid)
    return target || ROUTE_NAMES.DASHBOARD
  } catch (error) {
    console.error('Fehler beim Bestimmen des Firmenportals:', error)
    return ROUTE_NAMES.DASHBOARD
  }
}

// Navigation Guard für geschützte Routen
export async function navigationGuard(to, from, next) {
  try {
    await waitForAuthInit()
  } catch (error) {
    console.error('Fehler beim Initialisieren der Authentifizierung', error)
  }

  const routeName = to.name
  const routeMeta = to.meta ?? {}
  const requiresAuth = Boolean(routeMeta.requiresAuth)
  const requiresAdmin = Boolean(routeMeta.requiresAdmin)
  const isLoginRoute = routeName === ROUTE_NAMES.LOGIN
  const restrictedCompanyRoute = isCompanyRestrictedRoute(routeName)
  const portalRoute = isCompanyPortalRoute(routeName)
  const user = isFirebaseConfigured ? auth.currentUser : null

  const redirectTo = (name) => {
    next({ name })
  }

  if ((requiresAuth || requiresAdmin) && !user) {
    redirectTo(ROUTE_NAMES.LOGIN)
    return
  }

  const needsRoleLookup =
    Boolean(user) && (requiresAuth || requiresAdmin || isLoginRoute || restrictedCompanyRoute || portalRoute)

  let userRole = USER_ROLES.USER

  if (needsRoleLookup) {
    try {
      userRole = await getUserRole(user, { forceRefresh: requiresAdmin })
    } catch (error) {
      console.error('Fehler beim Bestimmen der Nutzerrolle', error)
      userRole = USER_ROLES.USER
    }
  }

  const userIsAdmin = userRole === USER_ROLES.ADMIN
  const userIsCompany = userRole === USER_ROLES.COMPANY

  let companyPortalTarget = null
  const resolveCompanyPortalTargetOnce = async () => {
    if (!userIsCompany || !user) {
      return ROUTE_NAMES.DASHBOARD
    }

    if (!companyPortalTarget) {
      companyPortalTarget = await determineCompanyPortalTarget(user)
    }

    return companyPortalTarget
  }

  if (requiresAdmin && !userIsAdmin) {
    if (userIsCompany) {
      redirectTo(await resolveCompanyPortalTargetOnce())
    } else {
      redirectTo(ROUTE_NAMES.HOME)
    }
    return
  }

  if (restrictedCompanyRoute) {
    if (userIsAdmin) {
      redirectTo(ROUTE_NAMES.ADMIN_DASHBOARD)
      return
    }

    if (!userIsCompany) {
      redirectTo(ROUTE_NAMES.HOME)
      return
    }

    const target = await resolveCompanyPortalTargetOnce()
    if (target !== ROUTE_NAMES.DASHBOARD && target !== routeName) {
      redirectTo(target)
      return
    }
  }

  if (user && isLoginRoute) {
    if (userIsAdmin) {
      redirectTo(ROUTE_NAMES.ADMIN_DASHBOARD)
      return
    }

    if (userIsCompany) {
      redirectTo(await resolveCompanyPortalTargetOnce())
      return
    }

    redirectTo(ROUTE_NAMES.HOME)
    return
  }

  if (userIsCompany && portalRoute) {
    const target = await resolveCompanyPortalTargetOnce()
    if (target !== routeName) {
      redirectTo(target)
      return
    }
  }

  next()
}

router.beforeEach(navigationGuard)

export default router
