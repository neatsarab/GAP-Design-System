<template>
  <div style="--v-theme-primary: var(--v-theme-admin)">
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
          <div
            class="logo-icon-box rounded-lg mr-3"
            style="
              background: rgba(var(--v-theme-admin), 0.12);
              border: 1px solid rgba(var(--v-theme-admin), 0.2);
            "
          >
            <v-icon icon="fas fa-file-circle-check" color="admin" size="20" />
          </div>
        </template>
        <v-list-item-title class="text-body-2 font-weight-bold">
          คำขอลงทะเบียนใช้งาน
        </v-list-item-title>
        <v-list-item-subtitle
          class="text-caption"
          style="color: rgb(var(--v-theme-admin)); opacity: 0.85"
          >Access Requests</v-list-item-subtitle
        >
        <template v-slot:append>
          <v-btn
            :icon="rail ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"
            variant="text"
            color="on-surface-variant"
            size="small"
            @click="toggleRail"
          />
        </template>
      </v-list-item>

      <!-- User Card -->
      <div v-if="!rail" class="px-4 mb-2">
        <div
          class="user-card rounded-lg pa-3 d-flex align-center ga-2"
          style="
            background: rgba(var(--v-theme-admin), 0.06);
            border: 1px solid rgba(var(--v-theme-admin), 0.12);
          "
        >
          <v-avatar color="admin" size="32">
            <v-icon icon="fas fa-user-shield" size="16" color="white" />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div
              class="text-truncate text-body-2 font-weight-medium text-admin"
            >
              {{ staffSessionStore.displayName || "ผู้ดูแลระบบ" }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ staffSessionStore.department || "Administrator" }}
            </div>
          </div>
        </div>
      </div>

      <v-divider class="mx-3" />

      <!-- Nav -->
      <v-list density="compact" nav class="mt-1 px-2">
        <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">
          จัดการคำขอ
        </div>
        <v-list-item
          prepend-icon="fas fa-file-circle-check"
          title="คำขอลงทะเบียนใช้งาน"
          to="/portal/access-requests"
          active-color="admin"
          rounded="lg"
          class="mb-1"
        />
      </v-list>

      <!-- Bottom -->
      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav class="px-2 py-2">
          <v-list-item
            prepend-icon="fas fa-arrow-left"
            title="กลับหน้า Portal"
            rounded="lg"
            @click="goToPortal"
          />
          <v-list-item
            prepend-icon="fas fa-right-from-bracket"
            title="ออกจากระบบ"
            base-color="error"
            rounded="lg"
            @click="openLogoutDialog"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- ── App Bar ── -->
    <v-app-bar
      flat
      height="64"
      class="app-bar"
      :style="{ '--v-theme-primary': 'var(--v-theme-admin)' }"
    >
      <v-btn
        icon="fas fa-bars"
        variant="text"
        size="small"
        class="ml-2"
        @click="toggleRail"
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
          class="user-chip mr-2 ml-1"
          prepend-icon="fas fa-user-shield"
        >
          {{ staffSessionStore.displayName || "ผู้ดูแลระบบ" }}
        </v-chip>
      </div>
    </v-app-bar>

    <!-- ── Logout Dialog ── -->
    <v-dialog v-model="logoutDialog" max-width="360" persistent>
      <v-card rounded="xl">
        <v-btn
          icon="fas fa-xmark"
          variant="text"
          size="small"
          color="grey"
          class="position-absolute top-0 right-0 ma-2"
          @click="logoutDialog = false"
        />
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
              <v-btn
                variant="tonal"
                color="grey"
                block
                rounded="lg"
                @click="logoutDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="error" block rounded="lg" @click="doLogout"
                >ออกจากระบบ</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Content ── -->
    <v-main class="bg-background">
      <v-container
        fluid
        class="pa-5 pa-md-7"
        style="max-width: 1320px; --v-theme-primary: var(--v-theme-admin)"
      >
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

function goToPortal() {
  router.push({ name: "StaffPortal" });
}

function doLogout() {
  logoutDialog.value = false;
  sessionStore.clearSession();
  staffSessionStore.clearSession();
  router.push({ name: "Login" });
}

const breadcrumbs = computed(() => [
  { title: "คำขอลงทะเบียนใช้งาน", to: "/portal/access-requests" },
  { title: route.meta.title },
]);
</script>

<style scoped>
.app-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.app-bar {
  border-bottom: 1px solid
    rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  background: rgb(var(--v-theme-surface)) !important;
}
.logo-icon-box {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-card {
  transition: background 0.2s;
}
.sidebar-group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 12px 4px;
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
.user-chip {
  font-size: 12px;
  height: 30px;
  cursor: default;
}
</style>
