<template>
  <div style="--v-theme-primary: var(--v-theme-hcex-staff)">
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
            <v-icon icon="fas fa-industry" color="hcex-staff" size="20" />
          </div>
        </template>
        <v-list-item-title class="text-body-2 font-weight-bold"
          >ระบบ HC แปรรูป</v-list-item-title
        >
        <v-list-item-subtitle
          class="text-caption"
          style="color: rgb(var(--v-theme-hcex-staff)); opacity: 0.85"
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
          <v-avatar color="hcex-staff" size="32">
            <v-icon icon="fas fa-user-tie" size="16" color="white" />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div
              class="text-truncate text-body-2 font-weight-medium text-hcex-staff"
            >
              นิธิพร เทิบจันทึก
            </div>
            <div class="text-caption text-medium-emphasis">
              เจ้าหน้าที่ HC แปรรูป
            </div>
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
            active-color="hcex-staff"
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
            @click="router.push('/portal?mode=staff')"
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
        <v-btn variant="text" size="small" icon class="mr-1">
          <v-badge color="error" content="3" floating>
            <v-icon icon="fas fa-bell" size="20" color="hcex-staff" />
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
          color="hcex-staff"
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

const breadcrumbs = computed(() => [
  { title: "ระบบ HC แปรรูป (เจ้าหน้าที่)", to: "/hcex/staff" },
  { title: route.meta.title as string },
]);

const navGroups = [
  {
    label: "ภาพรวม",
    divider: true,
    items: [
      { title: "แดชบอร์ด", icon: "fas fa-gauge", to: "/hcex/staff/dashboard" },
    ],
  },
  {
    label: "คำขอออกใบรับรอง",
    divider: true,
    items: [
      {
        title: "รายการคำขอทั้งหมด",
        icon: "fas fa-file-lines",
        to: "/hcex/staff/applications",
      },
      {
        title: "ผล Lab",
        icon: "fas fa-flask-vial",
        to: "/hcex/staff/lab-results",
      },
    ],
  },
  {
    label: "ดำเนินการ",
    divider: true,
    items: [
      {
        title: "ลงนาม",
        icon: "fas fa-signature",
        to: "/hcex/staff/signing",
      },
    ],
  },
  {
    label: "ข้อมูลทะเบียน",
    divider: false,
    items: [
      {
        title: "ทะเบียนผู้ประกอบการ",
        icon: "fas fa-building",
        to: "/hcex/staff/registry",
      },
    ],
  },
];
</script>

<style scoped>
.app-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.logo-icon-box {
  width: 36px;
  height: 36px;
  background: rgba(var(--v-theme-hcex-staff), 0.12);
  border: 1px solid rgba(var(--v-theme-hcex-staff), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-card {
  background: rgba(var(--v-theme-hcex-staff), 0.06);
  border: 1px solid rgba(var(--v-theme-hcex-staff), 0.12);
}
.sidebar-group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 8px 12px 4px;
}
.app-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.user-chip {
  font-size: 12px;
  background: rgba(var(--v-theme-hcex-staff), 0.06);
}
.logout-icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
