<template>
  <div style="--v-theme-primary: var(--v-theme-admin)">
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="surface"
      class="app-sidebar"
    >
      <v-list-item nav class="py-4 px-4">
        <template v-slot:prepend>
          <div class="logo-icon-box rounded-lg mr-3" style="background: rgba(var(--v-theme-admin), 0.12); border: 1px solid rgba(var(--v-theme-admin), 0.2);">
            <v-icon icon="fas fa-user-shield" color="admin" size="20" />
          </div>
        </template>
        <v-list-item-title class="text-body-2 font-weight-bold"
          >ระบบบริหารจัดการ</v-list-item-title
        >
        <v-list-item-subtitle
          class="text-caption"
          style="color: rgb(var(--v-theme-admin)); opacity: 0.85"
          >Administrator</v-list-item-subtitle
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

      <div v-if="!rail" class="px-4 mb-2">
        <div class="user-card rounded-lg pa-3 d-flex align-center ga-2" style="background: rgba(var(--v-theme-admin), 0.06); border: 1px solid rgba(var(--v-theme-admin), 0.12);">
          <v-avatar color="admin" size="32" variant="tonal">
            <v-icon
              :icon="
                adminStore.role === 'adminsso'
                  ? 'fas fa-id-badge'
                  : 'fas fa-user-shield'
              "
              size="16"
              color="admin"
            />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div
              class="text-truncate text-body-2 font-weight-medium text-admin"
            >
              {{
                adminStore.role === "adminsso"
                  ? "Admin SSO"
                  : "System Administrator"
              }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{
                adminStore.role === "adminsso"
                  ? "adminsso@doa.go.th"
                  : "admin@doa.go.th"
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
            active-color="admin"
            rounded="lg"
            class="mb-1"
          />
          <v-divider v-if="group.divider" class="mx-2 my-2" />
        </template>
      </v-list>

      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav class="px-2 py-2">
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

    <v-app-bar flat height="64" class="app-bar" :style="{ '--v-theme-primary': 'var(--v-theme-admin)' }">
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
        <template #divider
          ><v-icon icon="fas fa-chevron-right" size="10"
        /></template>
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
          :prepend-icon="
            adminStore.role === 'adminsso'
              ? 'fas fa-id-badge'
              : 'fas fa-user-shield'
          "
        >
          {{
            adminStore.role === "adminsso"
              ? "Admin SSO"
              : "System Administrator"
          }}
        </v-chip>
      </div>
    </v-app-bar>

    <v-dialog v-model="logoutDialog" max-width="360" persistent>
      <v-card rounded="xl">
        <v-btn icon="fas fa-xmark" variant="text" size="small" color="grey" class="position-absolute top-0 right-0 ma-2" @click="logoutDialog = false" />
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

    <v-main class="bg-background">
      <v-container fluid class="pa-5 pa-md-7" style="max-width: 1320px; --v-theme-primary: var(--v-theme-admin)">
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";
import { useAdminStore } from "@/stores/admin.store";

const themeStore = useThemeStore();
const adminStore = useAdminStore();
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
  { title: "Admin", to: "/admin/dashboard" },
  { title: route.meta.title },
]);

const navGroups = computed(() => {
  const sysadminGroups = [
    {
      label: "ภาพรวม",
      divider: true,
      items: [
        { title: "Dashboard", icon: "fas fa-gauge", to: "/admin/dashboard" },
      ],
    },
    {
      label: "ตรวจสอบระบบ",
      divider: true,
      items: [
        {
          title: "Service Status",
          icon: "fas fa-server",
          to: "/admin/service-status",
        },
        { title: "API Status", icon: "fas fa-plug", to: "/admin/api-status" },
        {
          title: "Storage Status",
          icon: "fas fa-hard-drive",
          to: "/admin/storage-status",
        },
        {
          title: "System Resources",
          icon: "fas fa-microchip",
          to: "/admin/system-resources",
        },
      ],
    },
    {
      label: "ความปลอดภัย",
      divider: true,
      items: [
        {
          title: "Login Logs",
          icon: "fas fa-clipboard-list",
          to: "/admin/login-logs",
        },
        {
          title: "Certificate Expiration",
          icon: "fas fa-shield-halved",
          to: "/admin/certificate-expiration",
        },
      ],
    },
    {
      label: "จัดการ",
      divider: false,
      items: [
        {
          title: "Data Backup",
          icon: "fas fa-database",
          to: "/admin/data-backup",
        },
        {
          title: "Open API Management",
          icon: "fas fa-code",
          to: "/admin/open-api",
        },
      ],
    },
  ];

  const ssoGroups = [
    {
      label: "จัดการคำขอ",
      divider: false,
      items: [
        {
          title: "คำขอสมัครใช้งาน",
          icon: "fas fa-file-circle-check",
          to: "/admin/access-requests",
        },
      ],
    },
  ];

  return adminStore.role === "adminsso" ? ssoGroups : sysadminGroups;
});
</script>

