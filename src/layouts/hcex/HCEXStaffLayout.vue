<template>
  <div style="--v-theme-primary: var(--v-theme-hcex-staff)">
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="surface"
      class="app-sidebar"
      :style="{ '--v-theme-primary': 'var(--v-theme-hcex-staff)' }"
    >
      <v-list-item nav class="py-4 px-4">
        <template v-slot:prepend>
          <div
            class="logo-icon-box rounded-lg mr-3"
            style="
              background: rgba(var(--v-theme-hcex-staff), 0.12);
              border: 1px solid rgba(var(--v-theme-hcex-staff), 0.2);
            "
          >
            <v-icon icon="fas fa-industry" color="hcex-staff" size="20" />
          </div>
        </template>
        <v-list-item-title
          class="text-body-2 font-weight-bold"
          style="word-break: break-word; white-space: normal"
          >ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช</v-list-item-title
        >
        <v-list-item-subtitle
          class="text-caption"
          style="color: rgb(var(--v-theme-hcex-staff)); opacity: 0.85"
          >สำหรับเจ้าหน้าที่</v-list-item-subtitle
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

      <div v-if="!rail" class="px-4 mb-2">
        <div
          class="user-card rounded-lg pa-3 d-flex align-center ga-2"
          style="
            background: rgba(var(--v-theme-hcex-staff), 0.06);
            border: 1px solid rgba(var(--v-theme-hcex-staff), 0.12);
          "
        >
          <v-avatar color="hcex-staff" size="32" variant="tonal">
            <v-icon icon="fas fa-user-tie" size="16" color="hcex-staff" />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div
              class="text-truncate text-body-2 font-weight-medium text-hcex-staff"
            >
              {{ staffSessionStore.displayName || "เจ้าหน้าที่" }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ staffSessionStore.department
              }}{{
                staffSessionStore.role ? " / " + staffSessionStore.role : ""
              }}
            </div>
          </div>
        </div>
      </div>

      <v-divider class="mx-3" />

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
            :active="route.path.startsWith(item.to)"
            active-color="hcex-staff"
            rounded="lg"
            class="mb-1"
          >
            <template v-if="item.count" #append>
              <v-chip size="x-small" color="error" variant="flat">{{
                item.count
              }}</v-chip>
            </template>
          </v-list-item>
          <v-divider v-if="group.divider" class="mx-2 my-2" />
        </template>
      </v-list>

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

    <v-app-bar
      flat
      height="64"
      class="app-bar"
      :style="{ '--v-theme-primary': 'var(--v-theme-hcex-staff)' }"
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
        <template #divider
          ><v-icon icon="fas fa-chevron-right" size="10"
        /></template>
      </v-breadcrumbs>
      <v-spacer />
      <div class="d-flex align-center ga-1 mr-3">
        <v-btn variant="text" size="small" icon class="mr-1">
          <v-badge color="error" content="6" floating>
            <v-icon icon="fas fa-bell" size="20" color="hcex-staff" />
          </v-badge>
        </v-btn>
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
        <!-- User Menu -->
        <v-menu location="bottom end" :offset="8">
          <template #activator="{ props }">
            <v-chip
              v-bind="props"
              variant="outlined"
              color="hcex-staff"
              class="user-chip mr-2 ml-1"
              prepend-icon="fas fa-user"
              append-icon="fas fa-chevron-down"
              style="cursor: pointer"
            >
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
              <v-list-item
                prepend-icon="fas fa-right-from-bracket"
                title="ออกจากระบบ"
                rounded="lg"
                base-color="error"
                @click="openLogoutDialog"
              />
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <v-dialog v-model="logoutDialog" max-width="360" persistent>
      <v-card rounded="xl">
        <v-btn
          icon="fas fa-xmark"
          variant="text"
          size="small"
          color="grey"
          class="position-absolute top-0 right-0 ma-2"
          @click="closeLogoutDialog"
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
                @click="closeLogoutDialog"
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

    <v-main class="bg-background">
      <v-container
        fluid
        class="pa-5 pa-md-7"
        style="max-width: 1320px; --v-theme-primary: var(--v-theme-hcex-staff)"
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

function closeLogoutDialog() {
  logoutDialog.value = false;
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
  {
    title: "ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช",
    to: "/hcex/staff",
  },
  { title: route.meta.title },
]);

const navGroups = [
  {
    label: "ภาพรวม",
    divider: true,
    items: [
      {
        title: "แดชบอร์ด",
        icon: "fas fa-gauge",
        to: "/hcex/staff/dashboard",
      },
    ],
  },
  {
    label: "คำขอ",
    divider: true,
    items: [
      {
        title: "คำขอทะเบียนประวัติ",
        icon: "fas fa-clock-rotate-left",
        to: "/hcex/staff/history-applications",
        count: 5,
      },
      {
        title: "คำขอพิจารณาผล Lab",
        icon: "fas fa-flask",
        to: "/hcex/staff/lab-applications",
        count: 6,
      },
      {
        title: "รายการรอตรวจ LAB",
        icon: "fas fa-microscope",
        to: "/hcex/staff/lab-waiting",
        count: 3,
      },
      {
        title: "รายการคำขอ",
        icon: "fas fa-file-lines",
        to: "/hcex/staff/applications",
        count: 11,
      },
      {
        title: "รายการรอพิจารณา",
        icon: "fas fa-clipboard-check",
        to: "/hcex/staff/reviews",
        count: 2,
      },
      {
        title: "รายการรอลงนาม",
        icon: "fas fa-pen-nib",
        to: "/hcex/staff/signing",
        count: 1,
      },
    ],
  },
  {
    label: "ใบทะเบียน",
    divider: true,
    items: [
      {
        title: "รายการทะเบียนประวัติ",
        icon: "fas fa-clock-rotate-left",
        to: "/hcex/staff/history-registry",
      },
      {
        title: "รายการใบทะเบียน",
        icon: "fas fa-certificate",
        to: "/hcex/staff/registry",
      },
    ],
  },
  {
    label: "รายงาน",
    divider: false,
    items: [
      {
        title: "รายงาน",
        icon: "fas fa-chart-bar",
        to: "/hcex/staff/reports",
      },
    ],
  },
];
</script>

<style scoped>
.user-avatar-md {
  background: rgba(var(--v-theme-hcex-staff), 0.15);
  color: rgb(var(--v-theme-hcex-staff));
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
