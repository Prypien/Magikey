import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'

import HomeView from '@/pages/HomeView.vue'
import LoginView from '@/pages/Company/LoginView.vue'
import RegisterView from '@/pages/Company/RegisterView.vue'
import DashboardView from '@/pages/Company/DashboardView.vue'
import EditView from '@/pages/Company/EditView.vue'
import CompanyDetailView from '@/pages/user/CompanyDetailView.vue'
import ImpressumView from '@/pages/ImpressumView.vue'
import DatenschutzView from '@/pages/DatenschutzView.vue'
import HelpCenterView from '@/pages/HelpCenterView.vue'
import SuccessView from '@/pages/SuccessView.vue'
import VerifyEmailView from '@/pages/VerifyEmailView.vue'
import ResetPasswordView from '@/pages/ResetPasswordView.vue'
import NotFoundView from '@/pages/NotFoundView.vue'

import { auth } from '@/firebase'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView },
      { path: 'reset-password', name: 'reset-password', component: ResetPasswordView },
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
      {
        path: 'details/:id',
        name: 'details',
        component: CompanyDetailView,
        props: true,
      },
      { path: 'impressum', name: 'impressum', component: ImpressumView },
      { path: 'datenschutz', name: 'datenschutz', component: DatenschutzView },
      { path: 'hilfe', name: 'help', component: HelpCenterView },
      { path: 'success', name: 'success', component: SuccessView },
      { path: 'verify-email', name: 'verify-email', component: VerifyEmailView },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

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
