<template>
    <div style="--v-theme-primary: var(--v-theme-el-staff)">
        <!-- ── Sidebar ── -->
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent color="surface" class="app-sidebar">
            <!-- Brand -->
            <v-list-item nav class="py-4 px-4">
                <template v-slot:prepend>
                    <div class="logo-icon-box rounded-lg mr-3"
                        style="background: rgba(var(--v-theme-el-staff), 0.12); border: 1px solid rgba(var(--v-theme-el-staff), 0.2);">
                        <v-icon icon="fas fa-warehouse" color="el-staff" size="20" />
                    </div>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">ระบบ Establishment List</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                    style="color: rgb(var(--v-theme-el-staff)); opacity: 0.85">{{ currentUser.role }}</v-list-item-subtitle>
                <template v-slot:append>
                    <v-btn :icon="rail ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" variant="text"
                        color="on-surface-variant" size="small" @click="toggleRail" />
                </template>
            </v-list-item>

            <!-- User Card -->
            <div v-if="!rail" class="px-4 mb-2">
                <div class="user-card rounded-lg pa-3 d-flex align-center ga-2"
                    style="background: rgba(var(--v-theme-el-staff), 0.06); border: 1px solid rgba(var(--v-theme-el-staff), 0.12);">
                    <v-avatar color="el-staff" size="32">
                        <v-icon icon="fas fa-user-tie" size="16" color="white" />
                    </v-avatar>
                    <div class="flex-grow-1 overflow-hidden">
                        <div class="text-truncate text-body-2 font-weight-medium text-el-staff">
                            {{ currentUser.name }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            {{ currentUser.position }}
                        </div>
                    </div>
                </div>
            </div>

            <v-divider class="mx-3" />

            <!-- Nav (Filtered by Role) -->
            <v-list density="compact" nav class="mt-1 px-2">
                <template v-for="group in filteredNav" :key="group.label">
                    <div v-if="!rail" class="sidebar-group-label text-medium-emphasis px-3 pt-2 pb-1" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        {{ group.label }}
                    </div>
                    
                    <v-list-item v-for="item in group.items" :key="item.to" :prepend-icon="item.icon"
                        :title="item.title" :to="item.to" :active="isNavActive(item.to)" active-color="el-staff"
                        rounded="lg" class="mb-1">
                        <template v-if="item.count" #append>
                            <v-chip size="x-small" color="error" variant="flat">{{ item.count }}</v-chip>
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
        <v-app-bar flat height="64" class="app-bar" :style="{ '--v-theme-primary': 'var(--v-theme-el-staff)' }">
            <v-btn icon="fas fa-bars" variant="text" size="small" class="ml-2" @click="toggleRail" />
            <v-breadcrumbs :items="breadcrumbs" density="compact" class="ml-1 d-none d-sm-flex">
                <template #divider>
                    <v-icon icon="fas fa-chevron-right" size="10" />
                </template>
            </v-breadcrumbs>
            <v-spacer />
            
            <!-- Role Selector (For Demo Only) -->
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn variant="tonal" size="small" color="secondary" v-bind="props" class="mr-2">
                        สลับ Role (Demo)
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="r in Object.values(ROLES)" :key="r" @click="currentUser.role = r">
                        {{ r }}
                    </v-list-item>
                </v-list>
            </v-menu>

            <div class="d-flex align-center ga-1 mr-3">
                <v-btn variant="text" size="small" icon class="mr-1">
                    <v-badge color="error" content="3" floating>
                        <v-icon icon="fas fa-bell" size="20" color="el-staff" />
                    </v-badge>
                </v-btn>

                <v-chip variant="outlined" color="el-staff" class="user-chip mr-2 ml-1" prepend-icon="fas fa-user-tie">
                    {{ currentUser.name }}
                </v-chip>
            </div>
        </v-app-bar>

        <!-- ── Logout Dialog ── -->
        <v-dialog v-model="logoutDialog" max-width="360" persistent>
            <v-card rounded="xl">
                <v-card-text class="pa-6 text-center">
                    <v-icon icon="fas fa-right-from-bracket" size="28" color="error" class="mb-4" />
                    <h3 class="text-h6 font-weight-bold mb-2">ออกจากระบบ</h3>
                    <p class="text-body-2 text-medium-emphasis">คุณต้องการออกจากระบบใช่หรือไม่?</p>
                </v-card-text>
                <v-card-actions class="px-5 pb-5">
                    <v-spacer />
                    <v-btn variant="tonal" color="grey" @click="closeLogoutDialog">ยกเลิก</v-btn>
                    <v-btn color="error" @click="doLogout">ออกจากระบบ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- ── Content ── -->
        <v-main class="bg-background">
            <v-container fluid class="pa-5 pa-md-7" style="max-width: 1320px;">
                <router-view />
            </v-container>
        </v-main>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

// 1. Define Roles
const ROLES = {
    SWP_AREA: 'สวพเขต',
    SWP_PROVINCE: 'ศวพจังหวัด',
    KTM: 'กตม',
    KTM_STAFF: 'เจ้าหน้าที่กตม',
    SUPER_BOARD: 'Super คณะกรรมการ EL'
};

// 2. Mock Current User (In real app, get this from Pinia/Auth store)
const currentUser = ref({
    name: "นิธิพร เทิบจันทึก",
    position: "เจ้าหน้าที่ สวพ.",
    role: ROLES.SWP_AREA // เปลี่ยนเพื่อทดสอบ: ROLES.KTM, ROLES.SUPER_BOARD, ฯลฯ
});

const router = useRouter();
const route = useRoute();
const drawer = ref(true);
const rail = ref(false);
const logoutDialog = ref(false);

const toggleRail = () => rail.value = !rail.value;
const openLogoutDialog = () => logoutDialog.value = true;
const closeLogoutDialog = () => logoutDialog.value = false;
const goToPortal = () => router.push({ name: "StaffPortal" });
const doLogout = () => { logoutDialog.value = false; router.push({ name: "Login" }); };
const isNavActive = (to) => route.path === to || route.path.startsWith(to + '/');

const breadcrumbs = computed(() => [
    { title: "ระบบ Establishment List", to: "/el/staff" },
    { title: route.meta.title || 'หน้าหลัก' },
]);

// 3. Centralized Navigation Configuration with Roles
const navConfig = [
    {
        label: "ภาพรวม",
        divider: true,
        items: [
            { title: "แดชบอร์ด", icon: "fas fa-gauge", to: "/el/staff/dashboard", roles: Object.values(ROLES) },
        ],
    },
    {
        label: "สวพ. เขต",
        divider: true,
        items: [
            { title: "รายการตรวจเอกสาร EL", icon: "fas fa-file-circle-check", to: "/el/staff/checkdoc", roles: [ROLES.SWP_AREA] },
            { title: "พิจารณาผลการตรวจ", icon: "fas fa-file-signature", to: "/el/staff/area-review", roles: [ROLES.SWP_AREA] },
        ],
    },
    {
        label: "ศวพ. จังหวัด",
        divider: true,
        items: [
            { title: "รายการตรวจ EL (CL-02)", icon: "fas fa-clipboard-check", to: "/el/staff/inspection-cl02", roles: [ROLES.SWP_PROVINCE] },
        ],
    },
    {
        label: "กตม.",
        divider: true,
        items: [
            { title: "งานตรวจโรงคัดบรรจุ", icon: "fas fa-warehouse", to: "/el/staff/ktm-work", roles: [ROLES.KTM] },
            { title: "ผลตรวจประเมิน", icon: "fas fa-square-poll-vertical", to: "/el/staff/ktm-results", roles: [ROLES.KTM_STAFF] },
            { title: "พิจารณาผล", icon: "fas fa-user-check", to: "/el/staff/ktm-review", roles: [ROLES.KTM_STAFF] },
        ],
    },
    {
        label: "คณะกรรมการ",
        divider: true,
        items: [
            { 
                title: "รายการคำขอ", 
                icon: "fas fa-list-check", 
                to: "/el/staff/board-applications", 
                roles: [ROLES.SUPER_BOARD],
            },
              { 
                title: "ข้อมูลระบบ", 
                icon: "fas fa-database", 
                to: "/el/staff/select-data", 
                roles: [ROLES.SUPER_BOARD],
            },
              { 
                title: "รายงาน", 
                icon: "fas fa-file-text", 
                to: "/el/staff/select-report", 
                roles: [ROLES.SUPER_BOARD],
            },
            // { title: "พิจารณาผลการตรวจ", icon: "fas fa-gavel", to: "/el/staff/board/final", roles: [ROLES.SUPER_BOARD] },
        ],
    },
    {
        label: "ทะเบียน",
        divider: false,
        items: [
            { title: "ทะเบียนโรงคัดบรรจุ", icon: "fas fa-address-book", to: "/el/staff/registry", roles: Object.values(ROLES) },
        ],
    },
];

// 4. Computed Property for Filtering Sidebar
const filteredNav = computed(() => {
    return navConfig.map(group => {
        const visibleItems = group.items.filter(item => item.roles.includes(currentUser.value.role));
        return { ...group, items: visibleItems };
    }).filter(group => group.items.length > 0);
});
</script>

<style scoped>
.user-avatar-md {
  background: rgba(var(--v-theme-el-staff), 0.15);
  color: rgb(var(--v-theme-el-staff));
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar-group-label {
    font-weight: 700;
    color: var(--v-theme-el-staff);
    opacity: 0.6;
}
</style>
