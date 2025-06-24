// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Layout
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

// Seiten
import HomeView from '@/pages/HomeView.vue'
import LoginView from '@/pages/Company/LoginView.vue'
import RegisterView from '@/pages/Company/RegisterView.vue'
import DashboardView from '@/pages/Company/DashboardView.vue'
import EditView from '@/pages/Company/EditView.vue'
import CompanyDetailView from '@/pages/user/CompanyDetailView.vue'

// Firebase Auth
import { auth } from '@/firebase/firebase'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView },
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔐 Auth-Guard
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
