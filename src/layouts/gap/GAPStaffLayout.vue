<template>
    <div style="--v-theme-primary: var(--v-theme-gap-staff)">
        <!-- ── Sidebar ── -->
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent color="surface" class="app-sidebar">
            <!-- Brand -->
            <v-list-item nav class="py-4 px-4">
                <template v-slot:prepend>
                    <div class="logo-icon-box rounded-lg mr-3" style="
              background: rgba(var(--v-theme-gap-staff), 0.12);
              border: 1px solid rgba(var(--v-theme-gap-staff), 0.2);
            ">
                        <v-icon icon="fas fa-seedling" color="gap-staff" size="20" />
                    </div>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold"
                    style="word-break: break-word; white-space: normal">ระบบการรับรองมาตรฐาน GAP</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                    style="color: rgb(var(--v-theme-gap-staff)); opacity: 0.85">ฝั่งเจ้าหน้าที่</v-list-item-subtitle>
                <template v-slot:append>
                    <v-btn :icon="rail ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" variant="text"
                        color="on-surface-variant" size="small" @click="toggleRail" />
                </template>
            </v-list-item>

            <!-- User Card -->
            <div v-if="!rail" class="px-4 mb-2">
                <div class="user-card rounded-lg pa-3 d-flex align-center ga-2" style="
            background: rgba(var(--v-theme-gap-staff), 0.06);
            border: 1px solid rgba(var(--v-theme-gap-staff), 0.12);
          ">
                    <v-avatar color="gap-staff" size="32">
                        <v-icon icon="fas fa-user-tie" size="16" color="white" />
                    </v-avatar>
                    <div class="flex-grow-1 overflow-hidden">
                        <div class="text-truncate text-body-2 font-weight-medium text-gap-staff">
                            {{ staffSessionStore.displayName || "เจ้าหน้าที่" }}
                        </div>
                        <div class="text-caption text-medium-emphasis">{{ staffSessionStore.department }}{{
                            staffSessionStore.role ?
                                ' / ' + staffSessionStore.role : '' }}</div>
                    </div>
                </div>
            </div>

            <v-divider class="mx-3" />

            <!-- Nav -->
            <v-list density="compact" nav class="mt-1 px-2">
                <template v-for="group in navGroups" :key="group.label">
                    <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">
                        {{ group.label }}
                    </div>
                    <v-list-item v-for="item in group.items" :key="item.to" :prepend-icon="item.icon"
                        :title="item.title" :to="item.to" :active="isNavActive(item.to)" active-color="gap-staff"
                        rounded="lg" class="mb-1">
                        <template v-if="item.count" #append>
                            <v-chip size="x-small" color="error" variant="flat">{{
                                item.count
                                }}</v-chip>
                        </template>
                    </v-list-item>
                    <v-divider v-if="group.divider" class="mx-2 my-2" />
                </template>
            </v-list>

            <!-- Bottom -->
            <template v-slot:append>
                <v-divider />
                <v-list density="compact" nav class="px-2 py-2">
                    <v-list-item prepend-icon="fas fa-arrow-left" title="กลับหน้า Portal" rounded="lg"
                        @click="goToPortal" />
                    <v-list-item prepend-icon="fas fa-right-from-bracket" title="ออกจากระบบ" base-color="error"
                        rounded="lg" @click="openLogoutDialog" />
                </v-list>
            </template>
        </v-navigation-drawer>

        <!-- ── App Bar ── -->
        <v-app-bar flat height="64" class="app-bar" :style="{ '--v-theme-primary': 'var(--v-theme-gap-staff)' }">
            <v-btn icon="fas fa-bars" variant="text" size="small" class="ml-2" @click="toggleRail" />
            <v-breadcrumbs :items="breadcrumbs" density="compact" class="ml-1 d-none d-sm-flex">
                <template #divider>
                    <v-icon icon="fas fa-chevron-right" size="10" />
                </template>
            </v-breadcrumbs>
            <v-spacer />
            <div class="d-flex align-center ga-1 mr-3">
                <!-- Notifications -->
                <v-btn variant="text" size="small" icon class="mr-1" @click="goToNotifications">
                    <v-badge color="error" content="3" floating>
                        <v-icon icon="fas fa-bell" size="20" color="gap-staff" />
                    </v-badge>
                </v-btn>

                <!-- Theme -->
                <v-tooltip :text="isDark ? 'Light Mode' : 'Dark Mode'" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" :icon="isDark ? 'fas fa-sun' : 'fas fa-moon'" variant="text" size="small"
                            @click="toggleTheme" />
                    </template>
                </v-tooltip>

                <!-- User Menu -->
                <v-menu location="bottom end" :offset="8">
                    <template #activator="{ props }">
                        <v-chip v-bind="props" variant="outlined" color="gap-staff" class="user-chip mr-2 ml-1"
                            prepend-icon="fas fa-user" append-icon="fas fa-chevron-down" style="cursor: pointer">
                            {{ staffSessionStore.displayName }}
                        </v-chip>
                    </template>
                    <v-card min-width="200" elevation="8" rounded="xl" class="mt-1">
                        <v-card-text class="pb-2">
                            <div class="d-flex align-center ga-3 mb-3">
                                <div class="user-avatar-md">
                                    <v-icon icon="fas fa-user" size="20" />
                                </div>
                                <div>
                                    <div class="text-body-2 font-weight-bold">
                                        {{ staffSessionStore.displayName }}
                                    </div>
                                    <div class="text-caption text-medium-emphasis">
                                        {{ staffSessionStore.loginName }}
                                    </div>
                                </div>
                            </div>
                            <v-divider />
                        </v-card-text>
                        <v-list density="compact" nav class="pt-0 pb-2">
                            <v-list-item prepend-icon="fas fa-right-from-bracket" title="ออกจากระบบ" rounded="lg"
                                base-color="error" @click="openLogoutDialog" />
                        </v-list>
                    </v-card>
                </v-menu>
            </div>
        </v-app-bar>

        <!-- ── Logout Dialog ── -->
        <v-dialog v-model="logoutDialog" max-width="360" persistent>
            <v-card rounded="xl">
                <v-btn icon="fas fa-xmark" variant="text" size="small" color="grey"
                    class="position-absolute top-0 right-0 ma-2" @click="closeLogoutDialog" />
                <v-card-text class="pa-6 text-center">
                    <div class="logout-icon-ring mx-auto mb-4">
                        <v-icon icon="fas fa-right-from-bracket" size="28" color="error" />
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2">ออกจากระบบ</h3>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        คุณต้องการออกจากระบบใช่หรือไม่?
                    </p>
                </v-card-text>
                <v-card-actions class="px-5 pb-5">
                    <v-row no-gutters class="ga-2 w-100">
                        <v-col>
                            <v-btn variant="tonal" color="grey" block rounded="lg"
                                @click="closeLogoutDialog">ยกเลิก</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="error" block rounded="lg" @click="doLogout">ออกจากระบบ</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- ── Content ── -->
        <v-main class="bg-background">
            <v-container fluid class="pa-5 pa-md-7"
                style="max-width: 1320px; --v-theme-primary: var(--v-theme-gap-staff)">
                <router-view />
            </v-container>
        </v-main>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";
import { useSessionStore } from "@/stores/session.store";
import { useStaffSessionStore } from "@/stores/staff-session.store";

const themeStore = useThemeStore();
const sessionStore = useSessionStore();
const staffSessionStore = useStaffSessionStore();
const isDark = computed(() => themeStore.isDark);
function toggleTheme() {
    themeStore.toggle();
}

const router = useRouter();
const route = useRoute();
const drawer = ref(true);
const rail = ref(false);
const logoutDialog = ref(false);

function toggleRail() {
    rail.value = !rail.value;
}

function openLogoutDialog() {
    logoutDialog.value = true;
}

function closeLogoutDialog() {
    logoutDialog.value = false;
}

function goToPortal() {
    router.push({ name: "StaffPortal" });
}

function goToNotifications() {
    router.push({ name: "staffNotifications" });
}

function doLogout() {
    logoutDialog.value = false;
    sessionStore.clearSession();
    staffSessionStore.clearSession();
    router.push({ name: "Login" });
}

function isNavActive(to) {
    return route.path === to || route.path.startsWith(to + "/");
}

const navGroups = [
    {
        label: "ภาพรวม",
        divider: true,
        items: [
            { title: "แดชบอร์ด", icon: "fas fa-gauge", to: "/gap/staff/dashboard" },
        ],
    },
    // {
    //     label: "จัดการคำขอ",
    //     divider: true,
    //     items: [
    //         {
    //             title: "ยื่นคำขอ",
    //             icon: "fas fa-file-pen",
    //             to: "/gap/staff/applications/new",
    //         },
    //         {
    //             title: "รายการคำขอ",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/applications",
    //             count: 7,
    //         },
    //         {
    //             title: "นัดตรวจแปลง",
    //             icon: "fas fa-calendar-check",
    //             to: "/gap/staff/schedule",
    //             count: 5,
    //         },
    //         {
    //             title: "ผลการตรวจแปลง",
    //             icon: "fas fa-clipboard-check",
    //             to: "/gap/staff/inspection-results",
    //             count: 4,
    //         },
    //         {
    //             title: "เสนอแปลงต่อ CC",
    //             icon: "fas fa-paper-plane",
    //             to: "/gap/staff/propose-cc",
    //             count: 3,
    //         },
    //         {
    //             title: "บันทึกผลจาก CC",
    //             icon: "fas fa-gavel",
    //             to: "/gap/staff/cc-results",
    //             count: 6,
    //         },
    //     ],
    // },
    {
        label: "ยื่นขอใบรับรองแบบเดี่ยว",
        divider: true,
        items: [
            {
                title: "ยื่นขอการรับรอง GAP ",
                icon: "fas fa-file-pen",
                to: "/gap/staff/applications/new",
            },
            {
                title: "รายการคำขอ",
                icon: "fas fa-file-lines",
                to: "/gap/staff/applications",
            },
            {
                title: "นัดหมายการตรวจ",
                icon: "fas fa-calendar-check",
                to: "/gap/staff/schedule",
            },
            {
                title: "ผลการตรวจแปลง",
                icon: "fas fa-clipboard-check",
                to: "/gap/staff/inspection-results",
            },
            {
                title: "เสนอแปลงต่อ CC",
                icon: "fas fa-paper-plane",
                to: "/gap/staff/propose-cc",
            },
            {
                title: "บันทึกครั้งที่เสนอ CC",
                icon: "fas fa-gavel",
                to: "/gap/staff/cc-results",
            },
            {
                title: "บันทึกผลจาก CC",
                icon: "fas fa-gavel",
                to: "/gap/staff/cc-saveresults",
            },
        ],
    },
    {
        label: "ยื่นขอใบรับรองแบบกลุ่ม",
        divider: true,
        items: [
            {
                title: "ยื่นขอการรับรอง GAP ",
                icon: "fas fa-file-pen",
                to: "/gap/staff/group/applications/new",
            },
            {
                title: "รายการคำขอ",
                icon: "fas fa-file-lines",
                to: "/gap/staff/group/applications",
            },
            {
                title: "นัดตรวจเยี่ยม Previsit",
                icon: "fas fa-file-pen",
                to: "/gap/staff/group/previsit-appointment",
            },
            {
                title: "ผลการตรวจเยี่ยม Previsit",
                icon: "fas fa-file-lines",
                to: "/gap/staff/group/previsit-results",
            },
            {
                title: "นัดหมายการตรวจ",
                icon: "fas fa-calendar-check",
                to: "/gap/staff/group/schedule",
            },
            {
                title: "ผลการตรวจแปลง",
                icon: "fas fa-clipboard-check",
                to: "/gap/staff/group/inspection-results",
            },
            {
                title: "เสนอแปลงต่อ CC",
                icon: "fas fa-paper-plane",
                to: "/gap/staff/group/propose-cc",
            },
            {
                title: "บันทึกครั้งที่เสนอ CC",
                icon: "fas fa-gavel",
                to: "/gap/staff/group/cc-results",
            },
            {
                title: "บันทึกผลจาก CC",
                icon: "fas fa-gavel",
                to: "/gap/staff/group/cc-saveresults",
            },
        ],
    },
    {
        label: " แลกเปลี่ยนข้อมูล",
        divider: true,
        items: [
            {
                title: "ข้อมูลเกษตรกร (กสก.)",
                icon: "fas fa-file-pen",
                to: "/gap/staff/datatransfer/farmer-data-doae",
            },
            {
                title: "ข้อมูลพื้นที่ทำการเกษตร (ส.ป.ก.)",
                icon: "fas fa-file-lines",
                to: "/gap/staff/datatransfer/farm-land-data-kps",
            },
            {
                title: "ข้อมูลตรวจสอบมาตรฐาน (มกอช.)",
                icon: "fas fa-file-pen",
                to: "/gap/staff/datatransfer/standard-inspection-data",
            },
            {
                title: "Bizportal",
                icon: "fas fa-file-pen",
                to: "/gap/staff/datatransfer/bizportal",
            },

        ],
    },
    {
        label: "ใบรับรอง",
        divider: false,
        items: [
            {
                title: "ลงนาม",
                icon: "fas fa-certificate",
                to: "/gap/staff/certificates",
            },
            {
                title: "รายการใบทะเบียน",
                icon: "fas fa-certificate",
                to: "/gap/staff/registry",
            },
        ],
    },
    // {
    //     label: "รายงาน",
    //     divider: true,
    //     items: [
    //         {
    //             title: "รายละเอียดแปลง",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/plot-details",
    //         },
    //         {
    //             title: "รายละเอียดแปลงย่อย",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/sub-plot-details",
    //         },
    //         {
    //             title: "ผลการดำเนินงานการตรวจรับรอง (MOU)",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/mou-results",
    //         },
    //         {
    //             title: "ผลดำเนินงานสะสม(ตาราง1)",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/accumulated-table1",
    //         },
    //         {
    //             title: "ผลดำเนินงานปีงบ(ตาราง2)",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/fiscal-year-table2",
    //         },
    //         {
    //             title: "ผลตรวจติดตาม/ต่ออายุปีงบ(ตาราง3)",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/follow-up-table3",
    //         },
    //         {
    //             title: "ผลตรวจสะสมรายพืช(ตาราง4)",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/accumulated-crops-table4",
    //         },
    //         {
    //             title: "ผลตรวจรายพืชปีงบ(ตาราง5)",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/fiscal-year-crops-table5",
    //         },
    //         {
    //             title: "ผลตรวจสะสมรายพืชอื่น ๆ",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/other-accumulated-crops",
    //         },
    //         {
    //             title: "ผลตรวจรายพืชอื่น ๆ ปีงบ",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/other-fiscal-year-crops",
    //         },
    //         {
    //             title: "ผลการดำเนินงานแยกตามขอบข่ายพืช",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/crop-scope-results",
    //         },
    //         {
    //             title: "ภาพรวมผลการดำเนินงานแยกตามขอบข่าย",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/scope-overview",
    //         },
    //         {
    //             title: "ข้อมูลใบรับรอง",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/certificate-info",
    //         },
    //         {
    //             title: "Report ประวัติการตรวจ",
    //             icon: "fas fa-file-lines",
    //             to: "/gap/staff/reports/inspection-history",
    //         },
    //     ],
    // },
];

const routeTitleMap = {
    "/gap/staff/dashboard": "แดชบอร์ด",
    "/gap/staff/applications/new": "ยื่นคำขอ",
    "/gap/staff/applications": "รายการคำขอ",
    "/gap/staff/schedule": "นัดตรวจแปลง",
    "/gap/staff/inspection-results": "ผลการตรวจแปลง",
    "/gap/staff/propose-cc": "เสนอแปลงต่อ CC",
    "/gap/staff/cc-results": "บันทึกผลจาก CC",

    "/gap/staff/certificates": "ข้อมูลใบรับรอง",
};

const breadcrumbs = computed(() => {
    const base =
        route.path.startsWith("/gap/staff/applications/") && route.params.id
            ? "รายละเอียดคำขอ"
            : route.path === "/gap/staff/applications/new"
                ? "ยื่นคำขอ"
                : (routeTitleMap[route.path] ?? "รายละเอียด");
    return [
        { title: "ระบบการรับรองมาตรฐาน GAP", to: "/gap/staff/dashboard" },
        { title: base },
    ];
});
</script>

<style scoped>
.user-avatar-md {
    background: rgba(var(--v-theme-gap-staff), 0.15);
    color: rgb(var(--v-theme-gap-staff));
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
