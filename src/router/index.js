import { createRouter, createWebHistory } from '@ionic/vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/tabs/dashboard',
  },

  // Auth routes (guest only)
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordPage.vue'),
    meta: { guest: true },
  },

  // Tabs (protected)
  {
    path: '/tabs',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/tabs/DashboardPage.vue'),
      },
      {
        path: 'children',
        name: 'Children',
        component: () => import('@/views/tabs/ChildrenPage.vue'),
      },
      {
        path: 'vaccination',
        name: 'Vaccination',
        component: () => import('@/views/tabs/VaccinationPage.vue'),
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/views/tabs/NotificationsPage.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/tabs/ProfilePage.vue'),
      },
    ],
  },

  // Settings (protected)
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/pages/SettingsPage.vue'),
    meta: { requiresAuth: true },
  },

  // Language (protected)
  {
    path: '/language',
    name: 'Language',
    component: () => import('@/views/pages/LanguagePage.vue'),
    meta: { requiresAuth: true },
  },

  // Support (protected)
  {
    path: '/support',
    name: 'Support',
    component: () => import('@/views/pages/SupportPage.vue'),
    meta: { requiresAuth: true },
  },

  // About (protected)
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/pages/AboutPage.vue'),
    meta: { requiresAuth: true },
  },

  // Privacy Policy (protected)
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('@/views/pages/PrivacyPolicyPage.vue'),
    meta: { requiresAuth: true },
  },

  // 404 fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/tabs/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (to.meta.guest && isAuthenticated) {
    return next({ path: '/tabs/dashboard' })
  }

  next()
})

export default router
