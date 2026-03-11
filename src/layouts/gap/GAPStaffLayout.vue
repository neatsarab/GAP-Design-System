<template>
  <div>
    <!-- ── Sidebar ── -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="surface"
      class="app-sidebar"
    >
      <!-- Brand -->
      <v-list-item nav class="py-4 px-4">
        <template v-slot:prepend>
          <div class="logo-icon-box rounded-lg mr-3">
            <v-icon icon="fas fa-seedling" color="primary" size="20" />
          </div>
        </template>
        <v-list-item-title class="text-body-2 font-weight-bold"
          >ระบบ GAP</v-list-item-title
        >
        <v-list-item-subtitle
          class="text-caption"
          style="color: rgb(var(--v-theme-primary)); opacity: 0.8"
          >ฝั่งเจ้าหน้าที่</v-list-item-subtitle
        >
        <template v-slot:append>
          <v-btn
            :icon="rail ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"
            variant="text"
            color="on-surface-variant"
            size="small"
            @click="rail = !rail"
          />
        </template>
      </v-list-item>

      <!-- User Card -->
      <div v-if="!rail" class="px-4 mb-2">
        <div class="user-card rounded-lg pa-3 d-flex align-center ga-2">
          <v-avatar color="primary" size="32">
            <v-icon icon="fas fa-user-tie" size="16" color="white" />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div
              class="text-truncate text-body-2 font-weight-medium text-primary"
            >
              นิธิพร เทิบจันทึก
            </div>
            <div class="text-caption text-medium-emphasis">เจ้าหน้าที่ GAP</div>
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
          <v-list-item
            v-for="item in group.items"
            :key="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            active-color="primary"
            rounded="lg"
            class="mb-1"
          />
          <v-divider v-if="group.divider" class="mx-2 my-2" />
        </template>
      </v-list>

      <!-- Bottom -->
      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav class="px-2 py-2">
          <v-list-item
            prepend-icon="fas fa-arrow-left"
            title="กลับหน้า Portal"
            rounded="lg"
            @click="router.push('/portal')"
          />
          <v-list-item
            prepend-icon="fas fa-right-from-bracket"
            title="ออกจากระบบ"
            base-color="error"
            rounded="lg"
            @click="logoutDialog = true"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- ── App Bar ── -->
    <v-app-bar flat height="64" class="app-bar">
      <v-btn
        icon="fas fa-bars"
        variant="text"
        size="small"
        class="ml-2"
        @click="rail = !rail"
      />
      <v-breadcrumbs
        :items="breadcrumbs"
        density="compact"
        class="ml-1 d-none d-sm-flex"
      >
        <template #divider>
          <v-icon icon="fas fa-chevron-right" size="10" />
        </template>
      </v-breadcrumbs>
      <v-spacer />
      <div class="d-flex align-center ga-1 mr-3">
        <!-- Notifications -->
        <v-btn
          variant="text"
          size="small"
          icon
          class="mr-1"
          @click="router.push('/gap/staff/notifications')"
        >
          <v-badge color="error" content="3" floating>
            <v-icon icon="fas fa-bell" size="20" color="primary" />
          </v-badge>
        </v-btn>

        <!-- Theme -->
        <v-tooltip
          :text="isDark ? 'Light Mode' : 'Dark Mode'"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="isDark ? 'fas fa-sun' : 'fas fa-moon'"
              variant="text"
              size="small"
              @click="toggleTheme"
            />
          </template>
        </v-tooltip>

        <v-chip
          variant="outlined"
          color="primary"
          class="user-chip mr-2 ml-1"
          prepend-icon="fas fa-user-tie"
        >
          นิธิพร เทิบจันทึก
        </v-chip>
      </div>
    </v-app-bar>

    <!-- ── Logout Dialog ── -->
    <v-dialog v-model="logoutDialog" max-width="360" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="logout-icon-ring mx-auto mb-4">
            <v-icon icon="fas fa-right-from-bracket" size="28" color="error" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ออกจากระบบ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            คุณต้องการออกจากระบบใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="logoutDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="error" rounded="lg" block @click="doLogout"
            >ออกจากระบบ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Content ── -->
    <v-main class="bg-background">
      <v-container fluid class="pa-5 pa-md-7" style="max-width: 1320px">
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
function toggleTheme() {
  themeStore.toggle();
}

const router = useRouter();
const route = useRoute();
const drawer = ref(true);
const rail = ref(false);
const logoutDialog = ref(false);

function doLogout() {
  logoutDialog.value = false;
  router.push("/login");
}

const navGroups = [
  {
    label: "ภาพรวม",
    divider: true,
    items: [
      { title: "แดชบอร์ด", icon: "fas fa-gauge", to: "/gap/staff/dashboard" },
    ],
  },
  {
    label: "คำขอรับรองแบบเดี่ยว",
    divider: true,
    items: [
      {
        title: "รายการคำขอ",
        icon: "fas fa-file-lines",
        to: "/gap/staff/applications",
      },
      {
        title: "ยื่นคำขอรับรอง",
        icon: "fas fa-file-pen",
        to: "/gap/staff/applications/new",
      },
      {
        title: "นัดตรวจแปลง",
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
        title: "บันทึกผลจาก CC",
        icon: "fas fa-gavel",
        to: "/gap/staff/cc-results",
      },
    ],
  },
  {
    label: "คำขอรับรองแบบกลุ่ม",
    divider: true,
    items: [
      {
        title: "รายการคำขอกลุ่ม",
        icon: "fas fa-users",
        to: "/gap/staff/group-applications",
      },
    ],
  },
  {
    label: "ใบรับรอง & รายงาน",
    divider: false,
    items: [
      {
        title: "ข้อมูลใบรับรอง",
        icon: "fas fa-certificate",
        to: "/gap/staff/certificates",
      },
      {
        title: "ติดตาม-แจ้งเตือน",
        icon: "fas fa-bell",
        to: "/gap/staff/notifications",
      },
      { title: "รายงาน", icon: "fas fa-chart-bar", to: "/gap/staff/reports" },
    ],
  },
];

const routeTitleMap: Record<string, string> = {
  "/gap/staff/dashboard": "แดชบอร์ด",
  "/gap/staff/applications": "รายการคำขอ",
  "/gap/staff/applications/new": "ยื่นคำขอรับรอง",
  "/gap/staff/schedule": "นัดตรวจแปลง",
  "/gap/staff/inspection-results": "ผลการตรวจแปลง",
  "/gap/staff/propose-cc": "เสนอแปลงต่อ CC",
  "/gap/staff/cc-results": "บันทึกผลจาก CC",
  "/gap/staff/group-applications": "รายการคำขอกลุ่ม",
  "/gap/staff/certificates": "ข้อมูลใบรับรอง",
  "/gap/staff/notifications": "ติดตาม-แจ้งเตือน",
  "/gap/staff/reports": "รายงาน",
};

const breadcrumbs = computed(() => {
  const base =
    route.path.startsWith("/gap/staff/applications/") && route.params.id
      ? "รายละเอียดคำขอ"
      : (routeTitleMap[route.path] ?? "รายละเอียด");
  return [
    { title: "ระบบ GAP (เจ้าหน้าที่)", to: "/gap/staff/dashboard" },
    { title: base },
  ];
});
</script>

<style scoped>
.app-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.app-bar {
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  background: rgba(var(--v-theme-surface), 0.92) !important;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.logo-icon-box {
  width: 40px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-primary), 0.12);
}
.user-card {
  background: rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-theme-primary), 0.25);
}
.user-chip {
  background: rgba(var(--v-theme-primary), 0.06);
  font-size: 12px;
}
.logout-icon-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
  border: 1px solid rgba(var(--v-theme-error), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar-group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 12px 4px;
}
</style>
