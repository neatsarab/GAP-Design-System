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

    // ── Company Selection (operator side, before portal) ──
    {
      path: "/select-company",
      name: "CompanySelection",
      component: () => import("@/views/CompanySelectionPage.vue"),
      meta: { title: "เลือกบริษัทที่ต้องการดำเนินการ" },
    },

    // ── Power of Attorney Management ──────────────────
    {
      path: "/poa-management",
      name: "PowerOfAttorney",
      component: () => import("@/views/PowerOfAttorneyPage.vue"),
      meta: { title: "จัดการมอบอำนาจ" },
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

    // ── ORG User System ───────────────────────────────
    {
      path: "/org/user",
      component: () => import("@/layouts/org/ORGUserLayout.vue"),
      children: [
        { path: "", redirect: "/org/user/dashboard" },
        { path: "dashboard", name: "ORGUserDashboard", component: () => import("@/views/org/user/DashboardPage.vue"), meta: { title: "แดชบอร์ด ORG เกษตรอินทรีย์" } },
        { path: "applications", name: "ORGUserApplicationList", component: () => import("@/views/org/user/DashboardPage.vue"), meta: { title: "คำขอ ORG ของฉัน" } },
        { path: "applications/new", name: "ORGUserNewApplication", component: () => import("@/views/org/user/DashboardPage.vue"), meta: { title: "ยื่นคำขอ ORG ใหม่" } },
        { path: "applications/:id", name: "ORGUserApplicationDetail", component: () => import("@/views/org/user/DashboardPage.vue"), meta: { title: "ติดตามสถานะคำขอ ORG" } },
      ],
    },

    // ── ORG Staff System ──────────────────────────────
    {
      path: "/org/staff",
      component: () => import("@/layouts/org/ORGStaffLayout.vue"),
      children: [
        { path: "", redirect: "/org/staff/dashboard" },
        { path: "dashboard", name: "ORGStaffDashboard", component: () => import("@/views/org/staff/DashboardPage.vue"), meta: { title: "แดชบอร์ด ORG (เจ้าหน้าที่)" } },
        { path: "applications", name: "ORGStaffApplicationList", component: () => import("@/views/org/staff/DashboardPage.vue"), meta: { title: "รายการคำขอ ORG" } },
        { path: "applications/:id", name: "ORGStaffApplicationDetail", component: () => import("@/views/org/staff/DashboardPage.vue"), meta: { title: "รายละเอียดคำขอ ORG" } },
        { path: "schedule", name: "ORGStaffSchedule", component: () => import("@/views/org/staff/DashboardPage.vue"), meta: { title: "นัดตรวจแปลง ORG" } },
      ],
    },

    // ── DOA User System ───────────────────────────────
    {
      path: "/doa/user",
      component: () => import("@/layouts/doa/DOAUserLayout.vue"),
      children: [
        { path: "", redirect: "/doa/user/dashboard" },
        { path: "dashboard", name: "DOAUserDashboard", component: () => import("@/views/doa/user/DashboardPage.vue"), meta: { title: "แดชบอร์ด DOA โรงงานพืช" } },
        { path: "applications", name: "DOAUserApplicationList", component: () => import("@/views/doa/user/ApplicationListPage.vue"), meta: { title: "รายการคำขอ DOA" } },
        { path: "applications/new", name: "DOAUserApplicationType", component: () => import("@/views/doa/user/ApplicationTypePage.vue"), meta: { title: "เลือกประเภทคำขอ DOA" } },
        { path: "applications/new/:type", name: "DOAUserNewApplication", component: () => import("@/views/doa/user/NewApplicationPage.vue"), meta: { title: "ยื่นคำขอ DOA" } },
        { path: "applications/:id", name: "DOAUserApplicationDetail", component: () => import("@/views/doa/user/DashboardPage.vue"), meta: { title: "ติดตามสถานะคำขอ DOA" } },
        { path: "certificates", name: "DOAUserCertificate", component: () => import("@/views/doa/user/CertificatePage.vue"), meta: { title: "ใบรับรอง DOA" } },
      ],
    },

    // ── DOA Staff System ──────────────────────────────
    {
      path: "/doa/staff",
      component: () => import("@/layouts/doa/DOAStaffLayout.vue"),
      children: [
        { path: "", redirect: "/doa/staff/dashboard" },
        { path: "dashboard", name: "DOAStaffDashboard", component: () => import("@/views/doa/staff/DashboardPage.vue"), meta: { title: "ข้อมูลภาพรวม DOA" } },
        { path: "applications", name: "DOAStaffApplicationList", component: () => import("@/views/doa/staff/ApplicationListPage.vue"), meta: { title: "รายการคำขอ DOA" } },
        { path: "applications/:id", name: "DOAStaffApplicationDetail", component: () => import("@/views/doa/staff/ApplicationDetailPage.vue"), meta: { title: "พิจารณาทะเบียน DOA" } },
        { path: "review", name: "DOAStaffReviewList", component: () => import("@/views/doa/staff/ReviewListPage.vue"), meta: { title: "พิจารณาทะเบียน DOA" } },
        { path: "signing", name: "DOAStaffSigningList", component: () => import("@/views/doa/staff/SigningListPage.vue"), meta: { title: "ลงนาม DOA" } },
        { path: "registration-data", name: "DOAStaffRegistrationData", component: () => import("@/views/doa/staff/RegistrationDataPage.vue"), meta: { title: "ข้อมูลทะเบียน DOA" } },
        { path: "master/standard-scopes", name: "DOAStaffMasterStandardScopes", component: () => import("@/views/doa/staff/master/MasterStandardScopePage.vue"), meta: { title: "ขอบข่ายมาตรฐาน" } },
        { path: "master/products", name: "DOAStaffMasterProducts", component: () => import("@/views/doa/staff/master/MasterProductPage.vue"), meta: { title: "ผลิตภัณฑ์" } },
      ],
    },

    // ── Admin Login ───────────────────────────────────
    {
      path: "/admin/login",
      name: "AdminLogin",
      component: () => import("@/views/admin/AdminLoginPage.vue"),
      meta: { title: "Admin Login" },
    },

    // ── Admin System ──────────────────────────────────
    {
      path: "/admin",
      component: () => import("@/layouts/admin/AdminLayout.vue"),
      children: [
        { path: "", redirect: "/admin/dashboard" },
        { path: "dashboard", name: "AdminDashboard", component: () => import("@/views/admin/DashboardPage.vue"), meta: { title: "Dashboard" } },
        { path: "service-status", name: "AdminServiceStatus", component: () => import("@/views/admin/ServiceStatusPage.vue"), meta: { title: "Service Status" } },
        { path: "api-status", name: "AdminApiStatus", component: () => import("@/views/admin/ApiStatusPage.vue"), meta: { title: "API Status" } },
        { path: "storage-status", name: "AdminStorageStatus", component: () => import("@/views/admin/StorageStatusPage.vue"), meta: { title: "Storage Status" } },
        { path: "system-resources", name: "AdminSystemResources", component: () => import("@/views/admin/SystemResourcesPage.vue"), meta: { title: "System Resources" } },
        { path: "login-logs", name: "AdminLoginLogs", component: () => import("@/views/admin/LoginLogsPage.vue"), meta: { title: "Login Logs" } },
        { path: "certificate-expiration", name: "AdminCertificateExpiration", component: () => import("@/views/admin/CertificateExpirationPage.vue"), meta: { title: "Certificate Expiration" } },
        { path: "data-backup", name: "AdminDataBackup", component: () => import("@/views/admin/DataBackupPage.vue"), meta: { title: "Data Backup" } },
        { path: "open-api", name: "AdminOpenApi", component: () => import("@/views/admin/OpenApiPage.vue"), meta: { title: "Open API Management" } },
        { path: "access-requests", name: "AdminAccessRequests", component: () => import("@/views/admin/AccessRequestsPage.vue"), meta: { title: "คำขอสมัครใช้งาน" } },
      ],
    },

    // ── CB User System ────────────────────────────────
    {
      path: "/cb/user",
      component: () => import("@/layouts/cb/CBUserLayout.vue"),
      children: [
        { path: "", redirect: "/cb/user/dashboard" },
        { path: "dashboard", name: "CBUserDashboard", component: () => import("@/views/cb/user/DashboardPage.vue"), meta: { title: "แดชบอร์ด CB หน่วยรับรอง" } },
        { path: "applications", name: "CBUserApplicationList", component: () => import("@/views/cb/user/ApplicationListPage.vue"), meta: { title: "รายการคำขอ CB" } },
        { path: "applications/new", name: "CBUserApplicationType", component: () => import("@/views/cb/user/ApplicationTypePage.vue"), meta: { title: "เลือกประเภทคำขอ CB" } },
        { path: "applications/new/:type", name: "CBUserNewApplication", component: () => import("@/views/cb/user/NewApplicationPage.vue"), meta: { title: "ยื่นคำขอ CB" } },
        { path: "applications/:id", name: "CBUserApplicationDetail", component: () => import("@/views/cb/user/DashboardPage.vue"), meta: { title: "ติดตามสถานะคำขอ CB" } },
        { path: "certificates", name: "CBUserCertificate", component: () => import("@/views/cb/user/CertificatePage.vue"), meta: { title: "ใบรับรอง CB" } },
      ],
    },

    // ── CB Staff System ───────────────────────────────
    {
      path: "/cb/staff",
      component: () => import("@/layouts/cb/CBStaffLayout.vue"),
      children: [
        { path: "", redirect: "/cb/staff/dashboard" },
        { path: "dashboard", name: "CBStaffDashboard", component: () => import("@/views/cb/staff/DashboardPage.vue"), meta: { title: "แดชบอร์ด CB (เจ้าหน้าที่)" } },
        { path: "applications", name: "CBStaffApplicationList", component: () => import("@/views/cb/staff/ApplicationListPage.vue"), meta: { title: "รายการคำขอ CB" } },
        { path: "applications/:id", name: "CBStaffApplicationDetail", component: () => import("@/views/cb/staff/ApplicationDetailPage.vue"), meta: { title: "พิจารณาทะเบียน CB" } },
        { path: "registration-data", name: "CBStaffRegistrationData", component: () => import("@/views/cb/staff/RegistrationDataPage.vue"), meta: { title: "ข้อมูลทะเบียน CB" } },
      ],
    },

    // ── Export User System ────────────────────────────
    {
      path: "/export/user",
      component: () => import("@/layouts/export/ExportUserLayout.vue"),
      children: [
        { path: "", redirect: "/export/user/dashboard" },
        { path: "dashboard", name: "ExportUserDashboard", component: () => import("@/views/export/user/DashboardPage.vue"), meta: { title: "แดชบอร์ด จดทะเบียนผู้ส่งออก" } },
        { path: "applications", name: "ExportUserApplicationList", component: () => import("@/views/export/user/ApplicationListPage.vue"), meta: { title: "รายการคำขอผู้ส่งออก" } },
        { path: "applications/new", name: "ExportUserApplicationType", component: () => import("@/views/export/user/ApplicationTypePage.vue"), meta: { title: "เลือกประเภทคำขอผู้ส่งออก" } },
        { path: "applications/new/:type", name: "ExportUserNewApplication", component: () => import("@/views/export/user/NewApplicationPage.vue"), meta: { title: "จดทะเบียนผู้ส่งออกใหม่" } },
        { path: "applications/:id", name: "ExportUserApplicationDetail", component: () => import("@/views/export/user/DashboardPage.vue"), meta: { title: "ติดตามสถานะคำขอผู้ส่งออก" } },
        { path: "certificates", name: "ExportUserCertificates", component: () => import("@/views/export/user/CertificatePage.vue"), meta: { title: "ใบรับรองผู้ส่งออก" } },
      ],
    },

    // ── Export Staff System ───────────────────────────
    {
      path: "/export/staff",
      component: () => import("@/layouts/export/ExportStaffLayout.vue"),
      children: [
        { path: "", redirect: "/export/staff/dashboard" },
        { path: "dashboard", name: "ExportStaffDashboard", component: () => import("@/views/export/staff/DashboardPage.vue"), meta: { title: "แดชบอร์ด ผู้ส่งออก (เจ้าหน้าที่)" } },
        { path: "applications", name: "ExportStaffApplicationList", component: () => import("@/views/export/staff/ApplicationListPage.vue"), meta: { title: "รายการคำขอผู้ส่งออก" } },
        { path: "applications/:id", name: "ExportStaffApplicationDetail", component: () => import("@/views/export/staff/ApplicationDetailPage.vue"), meta: { title: "รายละเอียดคำขอผู้ส่งออก" } },
        { path: "registry", name: "ExportStaffRegistry", component: () => import("@/views/export/staff/DashboardPage.vue"), meta: { title: "ทะเบียนผู้ส่งออก" } },
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

    // ── HCEX Staff System ─────────────────────────────
    {
      path: "/hcex/staff",
      component: () => import("@/layouts/hcex/HCEXStaffLayout.vue"),
      children: [
        { path: "", redirect: "/hcex/staff/dashboard" },
        { path: "dashboard", name: "HCEXstaffDashboard", component: () => import("@/views/hcex/staff/DashboardPage.vue"), meta: { title: "แดชบอร์ด HC แปรรูป" } },
        { path: "applications", name: "HCEXstaffApplicationList", component: () => import("@/views/hcex/staff/ApplicationListPage.vue"), meta: { title: "รายการคำขอ HC แปรรูป" } },
        { path: "applications/:id", name: "HCEXstaffApplicationDetail", component: () => import("@/views/hcex/staff/ApplicationDetailPage.vue"), meta: { title: "รายละเอียดคำขอ HC แปรรูป" } },
        { path: "lab-results", name: "HCEXstaffLabResults", component: () => import("@/views/hcex/staff/LabResultsPage.vue"), meta: { title: "ผล Lab HC แปรรูป" } },
        { path: "signing", name: "HCEXstaffSigning", component: () => import("@/views/hcex/staff/SigningPage.vue"), meta: { title: "ลงนามใบรับรอง HC แปรรูป" } },
        { path: "registry", name: "HCEXstaffRegistry", component: () => import("@/views/hcex/staff/RegistryPage.vue"), meta: { title: "ทะเบียน HC แปรรูป" } },
      ],
    },

    // ── HCEX User System ──────────────────────────────
    {
      path: "/hcex/user",
      component: () => import("@/layouts/hcex/HCEXUserLayout.vue"),
      children: [
        { path: "", redirect: "/hcex/user/dashboard" },
        { path: "dashboard", name: "HCEXUserDashboard", component: () => import("@/views/hcex/user/DashboardPage.vue"), meta: { title: "แดชบอร์ด HC แปรรูป" } },
        { path: "applications", name: "HCEXUserApplicationList", component: () => import("@/views/hcex/user/ApplicationListPage.vue"), meta: { title: "คำขอ HC แปรรูปของฉัน" } },
        { path: "applications/new", name: "HCEXUserNewApplication", component: () => import("@/views/hcex/user/NewApplicationPage.vue"), meta: { title: "ยื่นคำขอ HC แปรรูปใหม่" } },
        { path: "applications/:id", name: "HCEXUserApplicationDetail", component: () => import("@/views/hcex/user/ApplicationDetailPage.vue"), meta: { title: "ติดตามสถานะคำขอ HC แปรรูป" } },
        { path: "certificates", name: "HCEXUserCertificates", component: () => import("@/views/hcex/user/CertificatePage.vue"), meta: { title: "ใบรับรอง HC แปรรูปของฉัน" } },
      ],
    },

    // ── EL User System ────────────────────────────────
    {
      path: "/el/user",
      component: () => import("@/layouts/el/ELUserLayout.vue"),
      children: [
        { path: "", redirect: "/el/user/dashboard" },
        { path: "dashboard", name: "ELUserDashboard", component: () => import("@/views/el/user/DashboardPage.vue"), meta: { title: "แดชบอร์ด EL โรงคัดบรรจุ" } },
        { path: "applications", name: "ELUserApplicationList", component: () => import("@/views/el/user/ApplicationListPage.vue"), meta: { title: "รายการคำขอ EL" } },
        { path: "applications/new", name: "ELUserNewApplication", component: () => import("@/views/el/user/NewApplicationPage.vue"), meta: { title: "ยื่นคำขอ EL ใหม่" } },
        { path: "applications/:id", name: "ELUserApplicationDetail", component: () => import("@/views/el/user/ApplicationDetailPage.vue"), meta: { title: "ติดตามสถานะคำขอ EL" } },
        { path: "registry", name: "ELUserRegistry", component: () => import("@/views/el/user/ApplicationListPage.vue"), meta: { title: "ข้อมูลโรงคัดบรรจุ" } },
      ],
    },

    // ── EL Staff System ───────────────────────────────
    {
      path: "/el/staff",
      component: () => import("@/layouts/el/ELStaffLayout.vue"),
      children: [
        { path: "", redirect: "/el/staff/dashboard" },
        { path: "dashboard", name: "ELStaffDashboard", component: () => import("@/views/el/staff/DashboardPage.vue"), meta: { title: "แดชบอร์ด EL สวพ." } },
        { path: "applications", name: "ELStaffApplicationList", component: () => import("@/views/el/staff/ApplicationListPage.vue"), meta: { title: "รายการคำขอ EL" } },
        { path: "applications/:id", name: "ELStaffApplicationDetail", component: () => import("@/views/el/staff/ApplicationDetailPage.vue"), meta: { title: "รายละเอียดคำขอ EL" } },
        { path: "monitoring", name: "ELStaffMonitoring", component: () => import("@/views/el/staff/ApplicationListPage.vue"), meta: { title: "ตรวจติดตาม EL" } },
        { path: "inspection/new", name: "ELStaffInspectionNew", component: () => import("@/views/el/staff/InspectionRecordPage.vue"), meta: { title: "บันทึกผลตรวจ" } },
        { path: "inspection/:id", name: "ELStaffInspectionEdit", component: () => import("@/views/el/staff/InspectionRecordPage.vue"), meta: { title: "แก้ไขผลตรวจ" } },
        { path: "inspection/gmp", name: "ELStaffGmpRecord", component: () => import("@/views/el/staff/GmpRecordPage.vue"), meta: { title: "ผลตรวจ GMP/HACCP" } },
        { path: "registry", name: "ELStaffRegistry", component: () => import("@/views/el/staff/RegistryPage.vue"), meta: { title: "ทะเบียนโรงคัดบรรจุ" } },
        { path: "reports", name: "ELStaffReports", component: () => import("@/views/el/staff/DashboardPage.vue"), meta: { title: "รายงานผล EL" } },
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
