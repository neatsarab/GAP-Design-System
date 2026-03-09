import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/design-system',
    },
    {
      path: '/design-system',
      name: 'DesignSystem',
      component: () => import('@/views/DesignSystemPage.vue'),
      meta: { title: 'Design System' },
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    return { top: 0 }
  },
})

export default router
