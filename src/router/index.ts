import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Portal (entry point) ──────────────────────────
    {
      path: '/',
      name: 'Portal',
      component: () => import('@/views/PortalPage.vue'),
      meta: { title: 'ระบบรับรองแหล่งผลิต GAP พืช' },
    },

    // ── Login ─────────────────────────────────────────
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { title: 'เข้าสู่ระบบ' },
    },

    // ── Government Portal ─────────────────────────────
    {
      path: '/portal',
      name: 'GovPortal',
      component: () => import('@/views/GovPortalPage.vue'),
      meta: { title: 'ระบบบริการออนไลน์ กรมวิชาการเกษตร' },
    },

    // ── Design System ─────────────────────────────────
    {
      path: '/design-system',
      name: 'DesignSystem',
      component: () => import('@/views/DesignSystemPage.vue'),
      meta: { title: 'Design System' },
    },

    // ── GAP System (with AppLayout) ───────────────────
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/app/dashboard',
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/app/DashboardPage.vue'),
          meta: { title: 'แดชบอร์ด' },
        },
        {
          path: 'applications',
          name: 'ApplicationList',
          component: () => import('@/views/app/ApplicationListPage.vue'),
          meta: { title: 'รายการคำขอ GAP' },
        },
        {
          path: 'applications/new',
          name: 'ApplicationType',
          component: () => import('@/views/app/ApplicationTypePage.vue'),
          meta: { title: 'เลือกประเภทคำขอ' },
        },
        {
          path: 'applications/new/individual',
          name: 'NewApplicationIndividual',
          component: () => import('@/views/app/forms/IndividualFormPage.vue'),
          meta: { title: 'คำขอรายเดี่ยว' },
        },
        {
          path: 'applications/new/group',
          name: 'NewApplicationGroup',
          component: () => import('@/views/app/forms/GroupFormPage.vue'),
          meta: { title: 'คำขอรายกลุ่ม' },
        },
        {
          path: 'applications/new/amendment',
          name: 'NewApplicationAmendment',
          component: () => import('@/views/app/forms/AmendmentFormPage.vue'),
          meta: { title: 'ขอแก้ไข / ยกเลิกใบรับรอง' },
        },
        {
          path: 'applications/:id',
          name: 'ApplicationDetail',
          component: () => import('@/views/app/ApplicationDetailPage.vue'),
          meta: { title: 'รายละเอียดคำขอ' },
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/app/SettingsPage.vue'),
          meta: { title: 'ตั้งค่าระบบ' },
        },
      ],
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    return { top: 0 }
  },
})

// Update page title from route meta
router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  document.title = title ? `${title} · GAP พืช` : 'ระบบรับรองแหล่งผลิต GAP พืช'
})

export default router
