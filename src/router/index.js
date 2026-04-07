import { createRouter, createWebHistory } from "vue-router";

const routes = [
    // ── Portal & Public ───────────────────────────────
    {
        path: "/",
        name: "Portal",
        component: () => import("@/views/PortalPage.vue"),
        meta: { title: "ระบบการให้บริการทางอิเล็กทรอนิกส์ของกรมวิชาการเกษตร" },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/LoginPage.vue"),
        meta: { title: "เข้าสู่ระบบ" },
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("@/views/RegisterPage.vue"),
        meta: { title: "สมัครสมาชิก" },
    },
    {
        path: "/select-company",
        name: "CompanySelection",
        component: () => import("@/views/CompanySelectionPage.vue"),
        meta: { title: "เลือกบริษัทที่ต้องการดำเนินการ" },
    },
    {
        path: "/group-management",
        name: "GroupManagement",
        component: () => import("@/views/GroupManagementPage.vue"),
        meta: { title: "จัดการกลุ่ม" },
    },
    {
        path: "/poa-management",
        name: "PowerOfAttorney",
        component: () => import("@/views/PowerOfAttorneyPage.vue"),
        meta: { title: "จัดการมอบอำนาจ" },
    },
    {
        path: "/portal/user",
        name: "UserPortal",
        component: () => import("@/views/UserPortalPage.vue"),
        meta: { title: "ระบบบริการออนไลน์ กรมวิชาการเกษตร" },
    },
    {
        path: "/portal/staff",
        name: "StaffPortal",
        component: () => import("@/views/StaffPortalPage.vue"),
        meta: { title: "ระบบบริการออนไลน์ กรมวิชาการเกษตร (เจ้าหน้าที่)" },
    },
    {
        path: "/design-system",
        name: "DesignSystem",
        component: () => import("@/views/DesignSystemPage.vue"),
        meta: { title: "Design System" },
    },

    // ── GAP System ────────────────────────────────────
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
                path: "applications/new",
                name: "staffNewApplicationForm",
                component: () => import("@/views/gap/staff/StaffNewApplicationPage.vue"),
                meta: { title: "ยื่นคำขอใหม่" },
            },
            {
                path: "applications",
                name: "staffApplicationList",
                component: () => import("@/views/gap/staff/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/:id",
                name: "staffApplicationDetail",
                component: () => import("@/views/gap/staff/ApplicationDetailPage.vue"),
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
                component: () => import("@/views/gap/staff/InspectionResultsListPage.vue"),
                meta: { title: "บันทึกผลตรวจแปลง", statusFilter: "inspected" },
            },
            {
                path: "inspection-results/:id",
                name: "staffInspectionResultDetail",
                component: () => import("@/views/gap/staff/InspectionResultsDetailPage.vue"),
                meta: { title: "รายละเอียดผลตรวจแปลง" },
            },
            {
                path: "propose-cc",
                name: "staffProposeCC",
                component: () => import("@/views/gap/staff/ProposeListPage.vue"),
                meta: { title: "เสนอแปลงต่อ CC", statusFilter: "pending_cc" },
            },
            {
                path: "cc-results",
                name: "staffCCResults",
                component: () => import("@/views/gap/staff/ResultsCCPage.vue"),
                meta: { title: "บันทึกครั้งที่เสนอ CC", statusFilter: "cc_reviewing" },
            },
            {
                path: "cc-saveresults",
                name: "staffSaveCCResults",
                component: () => import("@/views/gap/staff/ResultsSaveCCPage.vue"),
                meta: { title: "บันทึกผลจาก CC", statusFilter: "cc_savereviewing" },
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
                meta: { title: "การแจ้งเตือน" },
            },
            {
                path: "previsit-appointment",
                name: "staffPrevisitAppointment",
                component: () => import("@/views/gap/staff/PrevisitAppointmentPage.vue"),
                meta: { title: "นัดหมายการตรวจเยี่ยม Previsit" },
            },
            {
                path: "previsit-results",
                name: "staffPrevisitResults",
                component: () => import("@/views/gap/staff/ResultsPrevisitAppointmentPage.vue"),
                meta: { title: "ผลการตรวจเยี่ยม Previsit", statusFilter: "previsit_completed" },
            },
        ],
    },
    {
        path: "/gap/user",
        component: () => import("@/layouts/gap/GAPUserLayout.vue"),
        children: [
            { path: "", redirect: "/gap/user/dashboard" },
            {
                path: "dashboard",
                name: "Dashboard",
                component: () => import("@/views/gap/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "ApplicationList",
                component: () => import("@/views/gap/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "ApplicationType",
                component: () => import("@/views/gap/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอ GAP" },
            },
            {
                path: "applications/new/group",
                name: "ApplicationTypeGroup",
                component: () => import("@/views/gap/user/ApplicationTypeGroupPage.vue"),
                meta: { title: "เลือกประเภทใบรับรอง" },
            },
            {
                path: "applications/new/individual",
                name: "NewApplicationIndividual",
                component: () => import("@/views/gap/user/forms/IndividualFormPage.vue"),
                meta: { title: "ยื่นคำขอใหม่ รายเดี่ยว" },
            },
            {
                path: "applications/new/single/:subtype",
                name: "NewApplicationSingle",
                component: () => import("@/views/gap/user/forms/GroupFormForSinglePage.vue"),
                meta: { title: "ยื่นคำขอใหม่ รายเดี่ยว" },
            },
            {
                path: "applications/new/group/:subtype",
                name: "NewApplicationGroup",
                component: () => import("@/views/gap/user/forms/GroupFormForGroupPage.vue"),
                meta: { title: "ยื่นคำขอใหม่ รายกลุ่ม" },
            },
            {
                path: "applications/new/groupedit/:subtype",
                name: "NewApplicationEdit",
                component: () => import("@/views/gap/user/forms/EditGroupFormPage.vue"),
                meta: { title: "แบบขอแก้ไขเปลี่ยนแปลงข้อมูลใบรับรอง F-5" },
            },
            {
                path: "applications/new/groupcancel/:subtype",
                name: "NewApplicationCancel",
                component: () => import("@/views/gap/user/forms/CancelGroupFormPage.vue"),
                meta: { title: "แบบคำขอยกเลิกการรับรอง" },
            },
            {
                path: "applications/new/amendment",
                name: "NewApplicationAmendment",
                component: () => import("@/views/gap/user/forms/AmendmentFormPage.vue"),
                meta: { title: "แก้ไข / ยกเลิกใบรับรอง GAP" },
            },
            {
                path: "applications/:id",
                name: "ApplicationDetail",
                component: () => import("@/views/gap/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอ GAP" },
            },
            {
                path: "certificates",
                name: "GAPUserCertificates",
                component: () => import("@/views/gap/user/CertificatePage.vue"),
                meta: { title: "ใบรับรอง GAP ของฉัน" },
            },
            {
                path: "applications/edit/:id",
                name: "GAPUserEditApplication",
                component: () => import("@/views/gap/user/ApplicationEditPage.vue"),
                meta: { title: "แก้ไขคำขอ GAP" },
            },
            {
                path: "applications/cancel/:id",
                name: "GAPUserCancelApplication",
                component: () => import("@/views/gap/user/ApplicationCancelPage.vue"),
                meta: { title: "ยกเลิกคำขอ GAP" },
            },
        ],
    },

    // ── ORG System ────────────────────────────────────
    {
        path: "/org/user",
        component: () => import("@/layouts/org/ORGUserLayout.vue"),
        children: [
            { path: "", redirect: "/org/user/dashboard" },
            {
                path: "dashboard",
                name: "ORGUserDashboard",
                component: () => import("@/views/org/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "ORGUserApplicationList",
                component: () => import("@/views/org/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "ORGUserApplicationType",
                component: () => import("@/views/org/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอ" },
            },
            {
                path: "applications/new/individual",
                name: "ORGUserNewIndividual",
                component: () =>
                    import("@/views/org/user/forms/IndividualFormPage.vue"),
                meta: { title: "ยื่นคำขอใหม่ รายบุคคล" },
            },
            {
                path: "applications/new/group",
                name: "ORGUserNewGroup",
                component: () => import("@/views/org/user/forms/GroupFormPage.vue"),
                meta: { title: "ยื่นคำขอใหม่ รายกลุ่ม" },
            },
            {
                path: "applications/new/amendment",
                name: "ORGUserAmendment",
                component: () =>
                    import("@/views/org/user/forms/IndividualFormPage.vue"),
                meta: { title: "แก้ไข / ยกเลิกใบรับรอง" },
            },
            {
                path: "applications/:id",
                name: "ORGUserApplicationDetail",
                component: () => import("@/views/org/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอ" },
            },
            {
                path: "certificates",
                name: "ORGUserCertificates",
                component: () => import("@/views/org/user/CertificatePage.vue"),
                meta: { title: "รายการใบรับรอง" },
            },
        ],
    },
    {
        path: "/org/staff",
        component: () => import("@/layouts/org/ORGStaffLayout.vue"),
        children: [
            { path: "", redirect: "/org/staff/dashboard" },
            {
                path: "dashboard",
                name: "ORGStaffDashboard",
                component: () => import("@/views/org/staff/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "ORGStaffApplicationList",
                component: () => import("@/views/org/staff/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/:id",
                name: "ORGStaffApplicationDetail",
                component: () => import("@/views/org/staff/ApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอ" },
            },
            {
                path: "schedule",
                name: "ORGStaffSchedule",
                component: () => import("@/views/org/staff/ApplicationListPage.vue"),
                meta: { title: "นัดตรวจแปลง", statusFilter: "inspection" },
            },
            {
                path: "registry",
                name: "ORGStaffRegistry",
                component: () => import("@/views/org/staff/RegistryPage.vue"),
                meta: { title: "ทะเบียนเกษตรอินทรีย์" },
            },
        ],
    },

    // ── DOA System ────────────────────────────────────
    {
        path: "/doa/user",
        component: () => import("@/layouts/doa/DOAUserLayout.vue"),
        children: [
            { path: "", redirect: "/doa/user/dashboard" },
            {
                path: "dashboard",
                name: "DOAUserDashboard",
                component: () => import("@/views/doa/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "DOAUserApplicationList",
                component: () => import("@/views/doa/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "DOAUserApplicationType",
                component: () => import("@/views/doa/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอ" },
            },
            {
                path: "applications/new/:type",
                name: "DOAUserNewApplication",
                component: () => import("@/views/doa/user/NewApplicationPage.vue"),
                meta: { title: "คำขอขึ้นทะเบียน / ต่ออายุทะเบียน" },
            },
            {
                path: "applications/:id",
                name: "DOAUserApplicationDetail",
                component: () => import("@/views/doa/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอ" },
            },
            {
                path: "applications/edit/:id",
                name: "DOAUserApplicationEdit",
                component: () => import("@/views/doa/user/ApplicationEditPage.vue"),
                meta: { title: "แก้ไขคำขอ" },
            },
            {
                path: "certificates",
                name: "DOAUserCertificate",
                component: () => import("@/views/doa/user/CertificatePage.vue"),
                meta: { title: "รายการใบรับรอง" },
            },
            {
                path: "certificates/:id",
                name: "DOAUserCertificateDetail",
                component: () => import("@/views/doa/user/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบรับรอง" },
            },
        ],
    },
    {
        path: "/doa/staff",
        component: () => import("@/layouts/doa/DOAStaffLayout.vue"),
        children: [
            { path: "", redirect: "/doa/staff/dashboard" },
            {
                path: "dashboard",
                name: "DOAStaffDashboard",
                component: () => import("@/views/doa/staff/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "DOAStaffApplicationList",
                component: () => import("@/views/doa/staff/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/:id",
                name: "DOAStaffApplicationDetail",
                component: () => import("@/views/doa/staff/ApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอ" },
            },
            {
                path: "review",
                name: "DOAStaffReviewList",
                component: () => import("@/views/doa/staff/ReviewListPage.vue"),
                meta: { title: "พิจารณาทะเบียน" },
            },
            {
                path: "reviews/:id",
                name: "DOAStaffReviewDetail",
                component: () => import("@/views/doa/staff/ReviewDetailPage.vue"),
                meta: { title: "พิจารณาคำขอ" },
            },
            {
                path: "signing",
                name: "DOAStaffSigningList",
                component: () => import("@/views/doa/staff/SigningListPage.vue"),
                meta: { title: "ลงนาม" },
            },
            {
                path: "signing/:id",
                name: "DOAStaffSigningDetail",
                component: () => import("@/views/doa/staff/SigningDetailPage.vue"),
                meta: { title: "ลงนามใบรับรอง" },
            },
            {
                path: "registration-data",
                name: "DOAStaffRegistrationData",
                component: () => import("@/views/doa/staff/RegistrationDataPage.vue"),
                meta: { title: "ข้อมูลทะเบียน" },
            },
            {
                path: "registration-data/:id",
                name: "DOAStaffRegistrationDetail",
                component: () => import("@/views/doa/staff/RegistrationDetailPage.vue"),
                meta: { title: "รายละเอียดใบทะเบียน" },
            },
            {
                path: "registration-data/:id/manage",
                name: "DOAStaffRegistrationManage",
                component: () => import("@/views/doa/staff/RegistrationManagePage.vue"),
                meta: { title: "จัดการใบรับรอง" },
            },
            {
                path: "master/standard-scopes",
                name: "DOAStaffMasterStandardScopes",
                component: () =>
                    import("@/views/doa/staff/master/MasterStandardScopePage.vue"),
                meta: { title: "ขอบข่ายมาตรฐาน" },
            },
            {
                path: "master/products",
                name: "DOAStaffMasterProducts",
                component: () =>
                    import("@/views/doa/staff/master/MasterProductPage.vue"),
                meta: { title: "ผลิตภัณฑ์" },
            },
        ],
    },

    // ── Admin System ──────────────────────────────────
    {
        path: "/admin/login",
        name: "AdminLogin",
        component: () => import("@/views/admin/AdminLoginPage.vue"),
        meta: { title: "Admin Login" },
    },
    {
        path: "/admin",
        component: () => import("@/layouts/admin/AdminLayout.vue"),
        children: [
            { path: "", redirect: "/admin/dashboard" },
            {
                path: "dashboard",
                name: "AdminDashboard",
                component: () => import("@/views/admin/DashboardPage.vue"),
                meta: { title: "Dashboard" },
            },
            {
                path: "service-status",
                name: "AdminServiceStatus",
                component: () => import("@/views/admin/ServiceStatusPage.vue"),
                meta: { title: "Service Status" },
            },
            {
                path: "api-status",
                name: "AdminApiStatus",
                component: () => import("@/views/admin/ApiStatusPage.vue"),
                meta: { title: "API Status" },
            },
            {
                path: "storage-status",
                name: "AdminStorageStatus",
                component: () => import("@/views/admin/StorageStatusPage.vue"),
                meta: { title: "Storage Status" },
            },
            {
                path: "system-resources",
                name: "AdminSystemResources",
                component: () => import("@/views/admin/SystemResourcesPage.vue"),
                meta: { title: "System Resources" },
            },
            {
                path: "login-logs",
                name: "AdminLoginLogs",
                component: () => import("@/views/admin/LoginLogsPage.vue"),
                meta: { title: "Login Logs" },
            },
            {
                path: "certificate-expiration",
                name: "AdminCertificateExpiration",
                component: () => import("@/views/admin/CertificateExpirationPage.vue"),
                meta: { title: "Certificate Expiration" },
            },
            {
                path: "data-backup",
                name: "AdminDataBackup",
                component: () => import("@/views/admin/DataBackupPage.vue"),
                meta: { title: "Data Backup" },
            },
            {
                path: "open-api",
                name: "AdminOpenApi",
                component: () => import("@/views/admin/OpenApiPage.vue"),
                meta: { title: "Open API Management" },
            },
            {
                path: "access-requests",
                name: "AdminAccessRequests",
                component: () => import("@/views/admin/AccessRequestsPage.vue"),
                meta: { title: "คำขอสมัครใช้งาน" },
            },
        ],
    },

    // ── CB System ─────────────────────────────────────
    {
        path: "/cb/user",
        component: () => import("@/layouts/cb/CBUserLayout.vue"),
        children: [
            { path: "", redirect: "/cb/user/dashboard" },
            {
                path: "dashboard",
                name: "CBUserDashboard",
                component: () => import("@/views/cb/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "CBUserApplicationList",
                component: () => import("@/views/cb/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "CBUserApplicationType",
                component: () => import("@/views/cb/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอ" },
            },
            {
                path: "applications/new/:type",
                name: "CBUserNewApplication",
                component: () => import("@/views/cb/user/NewApplicationPage.vue"),
                meta: { title: "ยื่นคำขอใหม่" },
            },
            {
                path: "applications/:id",
                name: "CBUserApplicationDetail",
                component: () => import("@/views/cb/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอ" },
            },
            {
                path: "certificates",
                name: "CBUserCertificate",
                component: () => import("@/views/cb/user/CertificatePage.vue"),
                meta: { title: "รายการใบทะเบียน" },
            },
            {
                path: "certificates/:id",
                name: "CBUserCertificateDetail",
                component: () => import("@/views/cb/user/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบทะเบียน" },
            },
        ],
    },
    {
        path: "/cb/staff",
        component: () => import("@/layouts/cb/CBStaffLayout.vue"),
        children: [
            { path: "", redirect: "/cb/staff/dashboard" },
            {
                path: "dashboard",
                name: "CBStaffDashboard",
                component: () => import("@/views/cb/staff/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "CBStaffApplicationList",
                component: () => import("@/views/cb/staff/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/:id",
                name: "CBStaffApplicationDetail",
                component: () => import("@/views/cb/staff/ApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอ" },
            },
            {
                path: "review",
                name: "CBStaffReviewList",
                component: () => import("@/views/cb/staff/ReviewListPage.vue"),
                meta: { title: "รายการรอพิจารณา" },
            },
            {
                path: "review/:id",
                name: "CBStaffReviewDetail",
                component: () => import("@/views/cb/staff/ReviewDetailPage.vue"),
                meta: { title: "พิจารณาคำขอ" },
            },
            {
                path: "signing",
                name: "CBStaffSigningList",
                component: () => import("@/views/cb/staff/SigningListPage.vue"),
                meta: { title: "รายการรอลงนาม" },
            },
            {
                path: "signing/:id",
                name: "CBStaffSigningDetail",
                component: () => import("@/views/cb/staff/SigningDetailPage.vue"),
                meta: { title: "ลงนามคำขอ" },
            },
            {
                path: "registration-data",
                name: "CBStaffRegistrationData",
                component: () => import("@/views/cb/staff/RegistrationDataPage.vue"),
                meta: { title: "ข้อมูลทะเบียน" },
            },
            {
                path: "registration-data/:id",
                name: "CBStaffCertificateDetail",
                component: () => import("@/views/cb/staff/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบทะเบียน" },
            },
            {
                path: "registration-data/:id/manage",
                name: "CBStaffCertificateManage",
                component: () => import("@/views/cb/staff/CertificateManagePage.vue"),
                meta: { title: "จัดการใบทะเบียน" },
            },
        ],
    },

    // ── Export System ─────────────────────────────────
    {
        path: "/export/user",
        component: () => import("@/layouts/export/ExportUserLayout.vue"),
        children: [
            { path: "", redirect: "/export/user/dashboard" },
            {
                path: "dashboard",
                name: "ExportUserDashboard",
                component: () => import("@/views/export/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "ExportUserApplicationList",
                component: () => import("@/views/export/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "ExportUserApplicationType",
                component: () => import("@/views/export/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอผู้ส่งออก" },
            },
            {
                path: "applications/new/:type",
                name: "ExportUserNewApplication",
                component: () => import("@/views/export/user/NewApplicationPage.vue"),
                meta: { title: "จดทะเบียนผู้ส่งออกใหม่" },
            },
            {
                path: "applications/:id",
                name: "ExportUserApplicationDetail",
                component: () =>
                    import("@/views/export/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอผู้ส่งออก" },
            },
            {
                path: "certificates",
                name: "ExportUserCertificates",
                component: () => import("@/views/export/user/CertificatePage.vue"),
                meta: { title: "รายการใบรับรอง" },
            },
            {
                path: "certificates/:id",
                name: "ExportUserCertificateDetail",
                component: () =>
                    import("@/views/export/user/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบทะเบียน" },
            },
        ],
    },
    {
        path: "/export/staff",
        component: () => import("@/layouts/export/ExportStaffLayout.vue"),
        children: [
            { path: "", redirect: "/export/staff/dashboard" },
            {
                path: "dashboard",
                name: "ExportStaffDashboard",
                component: () => import("@/views/export/staff/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "ExportStaffApplicationList",
                component: () => import("@/views/export/staff/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/:id",
                name: "ExportStaffApplicationDetail",
                component: () =>
                    import("@/views/export/staff/ApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอผู้ส่งออก" },
            },
            {
                path: "reviews",
                name: "ExportStaffReviewList",
                component: () => import("@/views/export/staff/ReviewListPage.vue"),
                meta: { title: "รายการรอพิจารณา" },
            },
            {
                path: "registry",
                name: "ExportStaffRegistry",
                component: () => import("@/views/export/staff/RegistryPage.vue"),
                meta: { title: "ทะเบียนผู้ส่งออก" },
            },
            {
                path: "registry/:id",
                name: "ExportStaffCertificateDetail",
                component: () =>
                    import("@/views/export/staff/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบทะเบียน" },
            },
            {
                path: "registry/:id/manage",
                name: "ExportStaffCertificateManage",
                component: () =>
                    import("@/views/export/staff/CertificateManagePage.vue"),
                meta: { title: "จัดการใบรับรอง" },
            },
            {
                path: "reviews/:id",
                name: "ExportStaffReviewDetail",
                component: () => import("@/views/export/staff/ReviewDetailPage.vue"),
                meta: { title: "พิจารณาคำขอ" },
            },
            {
                path: "signing",
                name: "ExportStaffSigningList",
                component: () => import("@/views/export/staff/SigningListPage.vue"),
                meta: { title: "รายการรอลงนาม" },
            },
            {
                path: "signing/:id",
                name: "ExportStaffSigningDetail",
                component: () => import("@/views/export/staff/SigningDetailPage.vue"),
                meta: { title: "ลงนามใบรับรอง" },
            },
        ],
    },

    // ── HC System ─────────────────────────────────────
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
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "HCstaffNewApplication",
                component: () => import("@/views/hc/staff/NewApplicationPage.vue"),
                meta: { title: "ยื่นคำขอ" },
            },
            {
                path: "applications/:id",
                name: "HCstaffApplicationDetail",
                component: () => import("@/views/hc/staff/ApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอ" },
            },
            {
                path: "reviews",
                name: "HCstaffReviewList",
                component: () => import("@/views/hc/staff/ReviewListPage.vue"),
                meta: { title: "รายการรอพิจารณา" },
            },
            {
                path: "reviews/:id",
                name: "HCstaffReviewDetail",
                component: () => import("@/views/hc/staff/ReviewDetailPage.vue"),
                meta: { title: "พิจารณาคำขอ" },
            },
            {
                path: "signing",
                name: "HCstaffSigningList",
                component: () => import("@/views/hc/staff/SigningListPage.vue"),
                meta: { title: "รายการรอลงนาม" },
            },
            {
                path: "signing/:id",
                name: "HCstaffSigningDetail",
                component: () => import("@/views/hc/staff/SigningDetailPage.vue"),
                meta: { title: "ลงนามใบรับรอง" },
            },
            {
                path: "lab",
                name: "HCstaffLabList",
                component: () => import("@/views/hc/staff/LabListPage.vue"),
                meta: { title: "รายการรอตรวจ Lab" },
            },
            {
                path: "lab/:id",
                name: "HCstaffLabDetail",
                component: () => import("@/views/hc/staff/LabDetailPage.vue"),
                meta: { title: "บันทึกผล Lab" },
            },
            {
                path: "lab-review",
                name: "HCstaffLabReviewList",
                component: () => import("@/views/hc/staff/LabReviewListPage.vue"),
                meta: { title: "รายการรอพิจารณาผล Lab" },
            },
            {
                path: "lab-review/:id",
                name: "HCstaffLabReviewDetail",
                component: () => import("@/views/hc/staff/LabReviewDetailPage.vue"),
                meta: { title: "พิจารณาผล Lab" },
            },
            {
                path: "registry",
                name: "HCstaffRegistry",
                component: () => import("@/views/hc/staff/RegistryPage.vue"),
                meta: { title: "ทะเบียนผู้ประกอบการ" },
            },
            {
                path: "registry/:id",
                name: "HCStaffCertificateDetail",
                component: () =>
                    import("@/views/hc/staff/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบรับรอง" },
            },
        ],
    },
    {
        path: "/hc/user",
        component: () => import("@/layouts/hc/HCUserLayout.vue"),
        children: [
            { path: "", redirect: "/hc/user/dashboard" },
            {
                path: "dashboard",
                name: "HCUserDashboard",
                component: () => import("@/views/hc/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "HCUserApplicationList",
                component: () => import("@/views/hc/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "HCUserApplicationType",
                component: () => import("@/views/hc/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอ" },
            },
            {
                path: "applications/new/correction",
                name: "HCUserCorrectionApplication",
                component: () =>
                    import("@/views/hc/user/CorrectionApplicationPage.vue"),
                meta: { title: "คำขอแก้ไขใบรับรอง" },
            },
            {
                path: "applications/new/:type",
                name: "HCUserNewApplication",
                component: () => import("@/views/hc/user/NewApplicationPage.vue"),
                meta: { title: "ยื่นคำขอใหม่" },
            },
            {
                path: "applications/:id",
                name: "HCUserApplicationDetail",
                component: () => import("@/views/hc/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอ" },
            },
            {
                path: "certificates",
                name: "HCUserCertificates",
                component: () => import("@/views/hc/user/CertificatePage.vue"),
                meta: { title: "รายการใบรับรอง" },
            },
            {
                path: "certificates/:id",
                name: "HCUserCertificateDetail",
                component: () => import("@/views/hc/user/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบรับรอง" },
            },
        ],
    },

    // ── HCEX System ───────────────────────────────────
    {
        path: "/hcex/user",
        component: () => import("@/layouts/hcex/HCEXUserLayout.vue"),
        children: [
            { path: "", redirect: "/hcex/user/dashboard" },
            {
                path: "dashboard",
                name: "HCEXUserDashboard",
                component: () => import("@/views/hcex/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "HCEXUserApplicationList",
                component: () => import("@/views/hcex/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/new",
                name: "HCEXUserApplicationType",
                component: () => import("@/views/hcex/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอผู้ส่งออก" },
            },
            {
                path: "applications/new/:type",
                name: "HCEXUserNewApplication",
                component: () => import("@/views/hcex/user/NewApplicationPage.vue"),
                meta: { title: "จดทะเบียนผู้ส่งออกใหม่" },
            },
            {
                path: "applications/:id",
                name: "HCEXUserApplicationDetail",
                component: () =>
                    import("@/views/hcex/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอผู้ส่งออก" },
            },
            {
                path: "certificates",
                name: "HCEXUserCertificates",
                component: () => import("@/views/hcex/user/CertificatePage.vue"),
                meta: { title: "รายการใบรับรอง" },
            },
            {
                path: "certificates/:id",
                name: "HCEXUserCertificateDetail",
                component: () =>
                    import("@/views/hcex/user/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบทะเบียน" },
            },
        ],
    },
    {
        path: "/hcex/staff",
        component: () => import("@/layouts/hcex/HCEXStaffLayout.vue"),
        children: [
            { path: "", redirect: "/hcex/staff/dashboard" },
            {
                path: "dashboard",
                name: "HCEXstaffDashboard",
                component: () => import("@/views/hcex/staff/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "HCEXstaffApplicationList",
                component: () => import("@/views/hcex/staff/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/:id",
                name: "HCEXstaffApplicationDetail",
                component: () =>
                    import("@/views/hcex/staff/ApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอผู้ส่งออก" },
            },
            {
                path: "reviews",
                name: "HCEXstaffReviewList",
                component: () => import("@/views/hcex/staff/ReviewListPage.vue"),
                meta: { title: "รายการรอพิจารณา" },
            },
            {
                path: "registry",
                name: "HCEXstaffRegistry",
                component: () => import("@/views/hcex/staff/RegistryPage.vue"),
                meta: { title: "ทะเบียนผู้ส่งออก" },
            },
            {
                path: "registry/:id",
                name: "HCEXstaffCertificateDetail",
                component: () =>
                    import("@/views/hcex/staff/CertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบทะเบียน" },
            },
            {
                path: "registry/:id/manage",
                name: "HCEXstaffCertificateManage",
                component: () =>
                    import("@/views/hcex/staff/CertificateManagePage.vue"),
                meta: { title: "จัดการใบรับรอง" },
            },
            {
                path: "certificates/:id",
                name: "HCEXstaffIssuedCertificateDetail",
                component: () =>
                    import("@/views/hcex/staff/IssuedCertificateDetailPage.vue"),
                meta: { title: "รายละเอียดใบรับรอง" },
            },
            {
                path: "reviews/:id",
                name: "HCEXstaffReviewDetail",
                component: () => import("@/views/hcex/staff/ReviewDetailPage.vue"),
                meta: { title: "พิจารณาคำขอ" },
            },
            {
                path: "signing",
                name: "HCEXstaffSigningList",
                component: () => import("@/views/hcex/staff/SigningListPage.vue"),
                meta: { title: "รายการรอลงนาม" },
            },
            {
                path: "signing/:id",
                name: "HCEXstaffSigningDetail",
                component: () => import("@/views/hcex/staff/SigningDetailPage.vue"),
                meta: { title: "ลงนามใบรับรอง" },
            },
            {
                path: "history-applications",
                name: "HCEXstaffHistoryApplicationList",
                component: () =>
                    import("@/views/hcex/staff/HistoryApplicationListPage.vue"),
                meta: { title: "คำขอทะเบียนประวัติ" },
            },
            {
                path: "history-applications/:id",
                name: "HCEXstaffHistoryApplicationDetail",
                component: () =>
                    import("@/views/hcex/staff/HistoryApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอทะเบียนประวัติ" },
            },
            {
                path: "lab-applications",
                name: "HCEXstaffLabApplicationList",
                component: () =>
                    import("@/views/hcex/staff/LabApplicationListPage.vue"),
                meta: { title: "คำขอพิจารณาผล Lab" },
            },
            {
                path: "lab-applications/:id",
                name: "HCEXstaffLabApplicationDetail",
                component: () =>
                    import("@/views/hcex/staff/LabApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอพิจารณาผล Lab" },
            },
        ],
    },

    // ── EL User System ────────────────────────────────
    {
        path: "/el/user",
        component: () => import("@/layouts/el/ELUserLayout.vue"),
        children: [
            { path: "", redirect: "/el/user/dashboard" },
            {
                path: "dashboard",
                name: "ELUserDashboard",
                component: () => import("@/views/el/user/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "ELUserApplicationList",
                component: () => import("@/views/el/user/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "registrationinfo",
                name: "ELUserRegistrationInfo",
                component: () => import("@/views/el/user/RegistrationInfoListPage.vue"),
                meta: { title: "ข้อมูลทะเบียน" },
            },
            {
                path: "farmerplotinfo",
                name: "ELUserFarmerPlotInfo",
                component: () => import("@/views/el/user/FarmerPlotInfoListPage.vue"),
                meta: { title: "ข้อมูลแปลงเกษตรกร" },
            },
            {
                path: "applications/new",
                name: "ELUserApplicationType",
                component: () => import("@/views/el/user/ApplicationTypePage.vue"),
                meta: { title: "เลือกประเภทคำขอ EL" },
            },
            {
                path: "applications/new/:type",
                name: "ELUserNewApplication",
                component: () => import("@/views/el/user/NewApplicationPage.vue"),
                meta: { title: "ยื่นคำขอใหม่" },
            },
            {
                path: "applications/:id",
                name: "ELUserApplicationDetail",
                component: () => import("@/views/el/user/ApplicationDetailPage.vue"),
                meta: { title: "ติดตามสถานะคำขอ EL" },
            },
            {
                path: "registry",
                name: "ELUserRegistry",
                component: () => import("@/views/el/user/RegistryPage.vue"),
                meta: { title: "ข้อมูลโรงคัดบรรจุ" },
            },
        ],
    },

    // ── EL Staff System ───────────────────────────────
    {
        path: "/el/staff",
        component: () => import("@/layouts/el/ELStaffLayout.vue"),
        children: [
            { path: "", redirect: "/el/staff/dashboard" },
            {
                path: "dashboard",
                name: "ELStaffDashboard",
                component: () => import("@/views/el/staff/DashboardPage.vue"),
                meta: { title: "แดชบอร์ด" },
            },
            {
                path: "applications",
                name: "ELStaffApplicationList",
                component: () => import("@/views/el/staff/ApplicationListPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "applications/:id",
                name: "ELStaffApplicationDetail",
                component: () => import("@/views/el/staff/ApplicationDetailPage.vue"),
                meta: { title: "รายละเอียดคำขอ EL" },
            },
            {
                path: "monitoring",
                name: "ELStaffMonitoring",
                component: () => import("@/views/el/staff/ApplicationListPage.vue"),
                meta: { title: "ตรวจติดตาม EL" },
            },
            {
                path: "inspection/new",
                name: "ELStaffInspectionNew",
                component: () => import("@/views/el/staff/InspectionRecordPage.vue"),
                meta: { title: "บันทึกผลตรวจ" },
            },
            {
                path: "inspection/:id",
                name: "ELStaffInspectionEdit",
                component: () => import("@/views/el/staff/InspectionRecordPage.vue"),
                meta: { title: "แก้ไขผลตรวจ" },
            },
            {
                path: "inspection/gmp",
                name: "ELStaffGmpRecord",
                component: () => import("@/views/el/staff/GmpRecordPage.vue"),
                meta: { title: "ผลตรวจ GMP/HACCP" },
            },
            {
                path: "registry",
                name: "ELStaffRegistry",
                component: () => import("@/views/el/staff/RegistryPage.vue"),
                meta: { title: "ทะเบียนโรงคัดบรรจุ" },
            },
            {
                path: "reports",
                name: "ELStaffReports",
                component: () => import("@/views/el/staff/DashboardPage.vue"),
                meta: { title: "รายงานผล EL" },
            },
            // ส่วนของ Routes
            {
                path: "checkdoc",
                name: "ELStaffCheckDoc",
                component: () => import("@/views/el/staff/CheckListDocPage.vue"),
                meta: { title: "รายการตรวจเอกสาร" },
            },
            {
                path: "checkdoc/detail/:id",
                name: "ELStaffCheckDocDetail",
                component: () => import("@/views/el/staff/CheckListDocDetailPage.vue"),
                meta: { title: "รายการตรวจเอกสาร" },
            },
            {
                path: "area-review",
                name: "ELStaffAreaReview",
                component: () => import("@/views/el/staff/AreaReviewPage.vue"),
                meta: { title: "พิจารณาผลการตรวจ" },
            },
            {
                path: "area-review/detail/:id",
                name: "ELStaffAreaReviewDetail",
                component: () => import("@/views/el/staff/AreaReviewDetailPage.vue"),
                meta: { title: "งานการตรวจ GAP" },
            },
            {
                path: "inspection-cl02",
                name: "ELStaffInspection_CL02",
                component: () => import("@/views/el/staff/Inspection_CL02Page.vue"),
                meta: { title: "รายการตรวจ EL(CL-02)" },
            },
            {
                path: "ktm-work",
                name: "ELStaffKtmWork",
                component: () => import("@/views/el/staff/KtmWorkPage.vue"),
                meta: { title: "งานตรวจโรงคัดบรรจุ" },
            },
            {
                path: "ktm-work/detail/:id",
                name: "ELStaffKtmWorkDetail",
                component: () => import("@/views/el/staff/KtmWorkDetailPage.vue"),
                meta: { title: "ตรวจเอกสารโรงคัดบรรจุ" },
            },
            {
                path: "ktm-results",
                name: "ELStaffKtmResult",
                component: () => import("@/views/el/staff/KtmResultPage.vue"),
                meta: { title: "ผลการตรวจประเมิน" },
            },
            {
                path: "ktm-results/detail/:id",
                name: "ELStaffKtmResultDetail",
                component: () => import("@/views/el/staff/KtmResultDetailPage.vue"),
                meta: { title: "งานการตรวจ GAP" },
            },
            {
                path: "ktm-review",
                name: "ELStaffKtmReview",
                component: () => import("@/views/el/staff/KtmReviewPage.vue"),
                meta: { title: "พิจารณาผล" },
            },
            {
                path: "ktm-review/detail/:id",
                name: "ELStaffKtmReviewDetail",
                component: () => import("@/views/el/staff/KtmReviewDetailPage.vue"),
                meta: { title: "งานการตรวจ GAP" },
            },
            {
                path: "board-applications",
                name: "ELStaffBoardApplication",
                component: () => import("@/views/el/staff/BoardApplicationPage.vue"),
                meta: { title: "รายการคำขอ" },
            },
            {
                path: "board-applications/detail/:id",
                name: "ELStaffBoardApplicationDetail",
                component: () => import("@/views/el/staff/BoardApplicationDetailPage.vue"),
                meta: { title: "รายการคำขอขึ้นทะเบียน" },
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to) {
        if (to.hash) {
            return { el: to.hash, behavior: "smooth", top: 80 };
        }
        return { top: 0 };
    },
});

// Update page title from route meta
router.afterEach((to) => {
    const title = to.meta?.title;
    const siteName = "ระบบการให้บริการทางอิเล็กทรอนิกส์ของกรมวิชาการเกษตร";
    document.title = title ? `${title} · ${siteName}` : siteName;
});

export default router;
