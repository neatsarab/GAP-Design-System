import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Portal (entry point) ──────────────────────────
    {
      path: "/",
      name: "Portal",
      component: () => import("@/views/PortalPage.vue"),
      meta: { title: "ระบบรับรองแหล่งผลิต GAP พืช" },
    },

    // ── Login ─────────────────────────────────────────
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginPage.vue"),
      meta: { title: "เข้าสู่ระบบ" },
    },

    // ── Register ──────────────────────────────────────
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/RegisterPage.vue"),
      meta: { title: "สมัครสมาชิก" },
    },

    // ── Government Portal ─────────────────────────────
    {
      path: "/portal",
      name: "GovPortal",
      component: () => import("@/views/GovPortalPage.vue"),
      meta: { title: "ระบบบริการออนไลน์ กรมวิชาการเกษตร" },
    },

    // ── Design System ─────────────────────────────────
    {
      path: "/design-system",
      name: "DesignSystem",
      component: () => import("@/views/DesignSystemPage.vue"),
      meta: { title: "Design System" },
    },

    // ── GAP Staff System ─────────────────────────────
    {
      path: "/gap/staff",
      component: () => import("@/layouts/gap/GAPStaffLayout.vue"),
      children: [
        { path: "", redirect: "/gap/staff/dashboard" },
        {
          path: "dashboard",
          name: "staffDashboard",
          component: () => import("@/views/gap/staff/DashboardPage.vue"),
          meta: { title: "แดชบอร์ด" },
        },
        {
          path: "applications",
          name: "staffApplicationList",
          component: () => import("@/views/gap/staff/ApplicationListPage.vue"),
          meta: { title: "รายการคำขอ GAP" },
        },
        {
          path: "applications/new",
          name: "staffNewApplication",
          component: () => import("@/views/gap/staff/NewApplicationPage.vue"),
          meta: { title: "ยื่นคำขอรับรอง GAP" },
        },
        {
          path: "applications/:id",
          name: "staffApplicationDetail",
          component: () =>
            import("@/views/gap/staff/ApplicationDetailPage.vue"),
          meta: { title: "รายละเอียดคำขอ GAP" },
        },
        {
          path: "schedule",
          name: "staffSchedule",
          component: () => import("@/views/gap/staff/ApplicationListPage.vue"),
          meta: { title: "นัดหมายตรวจแปลง", statusFilter: "scheduling" },
        },
        {
          path: "inspection-results",
          name: "staffInspectionResults",
          component: () => import("@/views/gap/staff/ApplicationListPage.vue"),
          meta: { title: "บันทึกผลตรวจแปลง", statusFilter: "inspected" },
        },
        {
          path: "propose-cc",
          name: "staffProposeCC",
          component: () => import("@/views/gap/staff/ApplicationListPage.vue"),
          meta: { title: "เสนอแปลงต่อ CC", statusFilter: "pending_cc" },
        },
        {
          path: "cc-results",
          name: "staffCCResults",
          component: () => import("@/views/gap/staff/ApplicationListPage.vue"),
          meta: { title: "บันทึกผลจาก CC", statusFilter: "cc_reviewing" },
        },
        {
          path: "group-applications",
          name: "staffGroupApplicationList",
          component: () =>
            import("@/views/gap/staff/GroupApplicationListPage.vue"),
          meta: { title: "คำขอกลุ่ม GAP" },
        },
        {
          path: "certificates",
          name: "staffCertificates",
          component: () => import("@/views/gap/staff/CertificatePage.vue"),
          meta: { title: "ข้อมูลใบรับรอง GAP" },
        },
        {
          path: "notifications",
          name: "staffNotifications",
          component: () => import("@/views/gap/staff/NotificationPage.vue"),
          meta: { title: "การแจ้งเตือน GAP" },
        },
        {
          path: "reports",
          name: "staffReports",
          component: () => import("@/views/gap/staff/ReportPage.vue"),
          meta: { title: "รายงานสรุป GAP" },
        },
      ],
    },

    // ── GAP User System ───────────────────────────────
    {
      path: "/gap/user",
      component: () => import("@/layouts/gap/GAPUserLayout.vue"),
      children: [
        { path: "", redirect: "/gap/user/dashboard" },
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("@/views/gap/user/DashboardPage.vue"),
          meta: { title: "แดชบอร์ด GAP" },
        },
        {
          path: "applications",
          name: "ApplicationList",
          component: () => import("@/views/gap/user/ApplicationListPage.vue"),
          meta: { title: "คำขอ GAP ของฉัน" },
        },
        {
          path: "applications/new",
          name: "ApplicationType",
          component: () => import("@/views/gap/user/ApplicationTypePage.vue"),
          meta: { title: "เลือกประเภทคำขอ GAP" },
        },
        {
          path: "applications/new/individual",
          name: "NewApplicationIndividual",
          component: () =>
            import("@/views/gap/user/forms/IndividualFormPage.vue"),
          meta: { title: "ยื่นคำขอ GAP รายบุคคล" },
        },
        {
          path: "applications/new/group",
          name: "NewApplicationGroup",
          component: () => import("@/views/gap/user/forms/GroupFormPage.vue"),
          meta: { title: "ยื่นคำขอ GAP รายกลุ่ม" },
        },
        {
          path: "applications/new/amendment",
          name: "NewApplicationAmendment",
          component: () =>
            import("@/views/gap/user/forms/AmendmentFormPage.vue"),
          meta: { title: "แก้ไข / ยกเลิกใบรับรอง GAP" },
        },
        {
          path: "applications/:id",
          name: "ApplicationDetail",
          component: () => import("@/views/gap/user/ApplicationDetailPage.vue"),
          meta: { title: "ติดตามสถานะคำขอ GAP" },
        },
        {
          path: "settings",
          name: "Settings",
          component: () => import("@/views/gap/user/SettingsPage.vue"),
          meta: { title: "ตั้งค่าระบบ" },
        },
      ],
    },

    // ── HC Staff System ───────────────────────────────
    {
      path: "/hc/staff",
      component: () => import("@/layouts/hc/HCStaffLayout.vue"),
      children: [
        { path: "", redirect: "/hc/staff/dashboard" },
        {
          path: "dashboard",
          name: "HCstaffDashboard",
          component: () => import("@/views/hc/staff/DashboardPage.vue"),
          meta: { title: "แดชบอร์ด" },
        },
        {
          path: "applications",
          name: "HCstaffApplicationList",
          component: () => import("@/views/hc/staff/ApplicationListPage.vue"),
          meta: { title: "รายการคำขอ HC" },
        },
        {
          path: "my-work",
          name: "HCstaffMyWork",
          component: () => import("@/views/hc/staff/MyWorkPage.vue"),
          meta: { title: "งานที่ได้รับมอบหมาย" },
        },
        {
          path: "applications/new",
          name: "HCstaffNewApplication",
          component: () => import("@/views/hc/staff/NewApplicationPage.vue"),
          meta: { title: "สร้างคำขอ HC" },
        },
        {
          path: "applications/:id",
          name: "HCstaffApplicationDetail",
          component: () => import("@/views/hc/staff/ApplicationDetailPage.vue"),
          meta: { title: "รายละเอียดคำขอ HC" },
        },
        {
          path: "registry",
          name: "HCstaffRegistry",
          component: () => import("@/views/hc/staff/RegistryPage.vue"),
          meta: { title: "ทะเบียนผู้ประกอบการ" },
        },
      ],
    },

    // ── HC User System ────────────────────────────────
    {
      path: "/hc/user",
      component: () => import("@/layouts/hc/HCUserLayout.vue"),
      children: [
        { path: "", redirect: "/hc/user/dashboard" },
        {
          path: "dashboard",
          name: "HCUserDashboard",
          component: () => import("@/views/hc/user/DashboardPage.vue"),
          meta: { title: "แดชบอร์ด HC" },
        },
        {
          path: "applications",
          name: "HCUserApplicationList",
          component: () => import("@/views/hc/user/ApplicationListPage.vue"),
          meta: { title: "คำขอ HC ของฉัน" },
        },
        {
          path: "applications/new",
          name: "HCUserNewApplication",
          component: () => import("@/views/hc/user/NewApplicationPage.vue"),
          meta: { title: "ยื่นคำขอ HC ใหม่" },
        },
        {
          path: "applications/:id",
          name: "HCUserApplicationDetail",
          component: () => import("@/views/hc/user/ApplicationDetailPage.vue"),
          meta: { title: "ติดตามสถานะคำขอ HC" },
        },
        {
          path: "certificates",
          name: "HCUserCertificates",
          component: () => import("@/views/hc/user/CertificatePage.vue"),
          meta: { title: "ใบรับรอง HC ของฉัน" },
        },
      ],
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth", top: 80 };
    }
    return { top: 0 };
  },
});

// Update page title from route meta
router.afterEach((to) => {
  const title = to.meta?.title as string | undefined;
  document.title = title ? `${title} · GAP พืช` : "ระบบรับรองแหล่งผลิต GAP พืช";
});

export default router;
