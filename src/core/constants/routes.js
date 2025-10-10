const freeze = Object.freeze

export const ROUTE_NAMES = freeze({
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  RESET_PASSWORD: 'reset-password',
  RESET_PASSWORD_CONFIRM: 'reset-password-confirm',
  VERIFY_EMAIL: 'verify-email',
  VERIFICATION_HOLD: 'verification-hold',
  DASHBOARD: 'dashboard',
  EDIT_PROFILE: 'edit',
  ADMIN_DASHBOARD: 'admin-dashboard',
  COMPANY_DETAILS: 'details',
  SUCCESS: 'success',
  HELP: 'help',
  SUPPORT: 'support',
  IMPRESSUM: 'impressum',
  DATENSCHUTZ: 'datenschutz',
  BLOG: 'blog',
  BLOG_POST: 'blog-post',
  LOCKSMITH_REUTLINGEN: 'locksmith-reutlingen',
  NOT_FOUND: 'not-found',
})

export const ROUTE_PATHS = freeze({
  [ROUTE_NAMES.HOME]: '/',
  [ROUTE_NAMES.LOGIN]: '/login',
  [ROUTE_NAMES.REGISTER]: '/register',
  [ROUTE_NAMES.RESET_PASSWORD]: '/reset-password',
  [ROUTE_NAMES.RESET_PASSWORD_CONFIRM]: '/reset-password/confirm',
  [ROUTE_NAMES.VERIFY_EMAIL]: '/verify',
  [ROUTE_NAMES.VERIFICATION_HOLD]: '/on-hold',
  [ROUTE_NAMES.DASHBOARD]: '/dashboard',
  [ROUTE_NAMES.EDIT_PROFILE]: '/edit',
  [ROUTE_NAMES.ADMIN_DASHBOARD]: '/admin',
  [ROUTE_NAMES.COMPANY_DETAILS]: '/details/:id',
  [ROUTE_NAMES.SUCCESS]: '/success',
  [ROUTE_NAMES.HELP]: '/hilfe',
  [ROUTE_NAMES.SUPPORT]: '/support',
  [ROUTE_NAMES.IMPRESSUM]: '/impressum',
  [ROUTE_NAMES.DATENSCHUTZ]: '/datenschutz',
  [ROUTE_NAMES.BLOG]: '/blog',
  [ROUTE_NAMES.BLOG_POST]: '/blog/:slug',
  [ROUTE_NAMES.LOCKSMITH_REUTLINGEN]: '/schluesseldienst/reutlingen',
  [ROUTE_NAMES.NOT_FOUND]: '/:pathMatch(.*)*',
})

const createLocation = (name, params) =>
  freeze({ name, ...(params ? { params: freeze({ ...params }) } : {}) })

export const ROUTE_LOCATIONS = freeze({
  HOME: createLocation(ROUTE_NAMES.HOME),
  LOGIN: createLocation(ROUTE_NAMES.LOGIN),
  REGISTER: createLocation(ROUTE_NAMES.REGISTER),
  RESET_PASSWORD: createLocation(ROUTE_NAMES.RESET_PASSWORD),
  RESET_PASSWORD_CONFIRM: createLocation(ROUTE_NAMES.RESET_PASSWORD_CONFIRM),
  VERIFY_EMAIL: createLocation(ROUTE_NAMES.VERIFY_EMAIL),
  VERIFICATION_HOLD: createLocation(ROUTE_NAMES.VERIFICATION_HOLD),
  DASHBOARD: createLocation(ROUTE_NAMES.DASHBOARD),
  EDIT_PROFILE: createLocation(ROUTE_NAMES.EDIT_PROFILE),
  ADMIN_DASHBOARD: createLocation(ROUTE_NAMES.ADMIN_DASHBOARD),
  SUCCESS: createLocation(ROUTE_NAMES.SUCCESS),
  HELP: createLocation(ROUTE_NAMES.HELP),
  SUPPORT: createLocation(ROUTE_NAMES.SUPPORT),
  IMPRESSUM: createLocation(ROUTE_NAMES.IMPRESSUM),
  DATENSCHUTZ: createLocation(ROUTE_NAMES.DATENSCHUTZ),
  BLOG: createLocation(ROUTE_NAMES.BLOG),
  LOCKSMITH_REUTLINGEN: createLocation(ROUTE_NAMES.LOCKSMITH_REUTLINGEN),
  NOT_FOUND: createLocation(ROUTE_NAMES.NOT_FOUND),
})

export const SITEMAP_STATIC_ROUTES = freeze([
  { path: ROUTE_PATHS[ROUTE_NAMES.HOME], changefreq: 'daily', priority: 1.0 },
  { path: ROUTE_PATHS[ROUTE_NAMES.REGISTER], changefreq: 'monthly', priority: 0.7 },
  { path: ROUTE_PATHS[ROUTE_NAMES.BLOG], changefreq: 'weekly', priority: 0.6 },
  { path: ROUTE_PATHS[ROUTE_NAMES.IMPRESSUM], changefreq: 'yearly', priority: 0.3 },
  { path: ROUTE_PATHS[ROUTE_NAMES.DATENSCHUTZ], changefreq: 'yearly', priority: 0.3 },
  { path: ROUTE_PATHS[ROUTE_NAMES.HELP], changefreq: 'monthly', priority: 0.4 },
  { path: ROUTE_PATHS[ROUTE_NAMES.SUPPORT], changefreq: 'monthly', priority: 0.4 },
  {
    path: ROUTE_PATHS[ROUTE_NAMES.LOCKSMITH_REUTLINGEN],
    changefreq: 'monthly',
    priority: 0.5,
  },
])

export const DEFAULT_SITEMAP_BASE_URL = 'https://www.magikey.de'
