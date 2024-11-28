import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue')
    },
    {
      path: '/p/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      props: true
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/StoreHomeView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const loggedIn = localStorage.getItem('token') !== null && localStorage.getItem('token')?.length !== 0
  if (to.name !== 'login' && !loggedIn) {
    return { name: 'login' }
  }
})

export default router
