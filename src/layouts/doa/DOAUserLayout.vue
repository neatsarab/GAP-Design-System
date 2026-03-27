<template>
  <div style="--v-theme-primary: var(--v-theme-doa-user)">
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="surface"
      class="app-sidebar"
    >
      <!-- Brand: rail mode -->
      <v-list v-if="rail" density="compact" nav class="px-2 py-2">
        <v-list-item rounded="lg" class="mb-1">
          <template v-slot>
            <v-icon icon="fas fa-industry" color="doa-user" size="20" />
          </template>
        </v-list-item>
      </v-list>

      <!-- Brand: expanded mode -->
      <v-list-item v-else nav class="py-4 px-4">
        <template v-slot:prepend>
          <div
            class="logo-icon-box rounded-lg mr-3"
            style="
              background: rgba(var(--v-theme-doa-user), 0.12);
              border: 1px solid rgba(var(--v-theme-doa-user), 0.2);
            "
          >
            <v-icon icon="fas fa-industry" color="doa-user" size="20" />
          </div>
        </template>
        <v-list-item-title
          class="text-body-2 font-weight-bold"
          style="word-break: break-word; white-space: normal"
          >ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช DOA</v-list-item-title
        >
        <v-list-item-subtitle
          class="text-caption"
          style="color: rgb(var(--v-theme-doa-user)); opacity: 0.85"
          >สำหรับผู้ประกอบการ</v-list-item-subtitle
        >
        <template v-slot:append>
          <v-btn
            icon="fas fa-chevron-left"
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
            background: rgba(var(--v-theme-doa-user), 0.06);
            border: 1px solid rgba(var(--v-theme-doa-user), 0.12);
          "
        >
          <v-avatar color="doa-user" size="32" variant="tonal">
            <v-icon
              :icon="sessionStore.entityIcon"
              size="16"
              color="doa-user"
            />
          </v-avatar>
          <div class="flex-grow-1">
            <div
              class="text-body-2 font-weight-medium text-doa-user"
              style="word-break: break-word; white-space: normal"
            >
              {{ sessionStore.displayName }}
            </div>
            <div
              v-if="
                sessionStore.entityType === 'juristic' && sessionStore.taxId
              "
              class="text-caption text-doa-user"
              style="opacity: 0.75; word-break: break-word; white-space: normal"
            >
              เลขทะเบียนนิติบุคคล: {{ sessionStore.taxId }}
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
            active-color="doa-user"
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
      :style="{ '--v-theme-primary': 'var(--v-theme-doa-user)' }"
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
          <v-badge color="error" content="1" floating>
            <v-icon icon="fas fa-bell" size="20" color="doa-user" />
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
        <v-chip
          variant="outlined"
          color="doa-user"
          class="user-chip mr-2 ml-1"
          prepend-icon="fas fa-user"
        >
          {{ sessionStore.loginName }}
        </v-chip>
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
        style="max-width: 1320px; --v-theme-primary: var(--v-theme-doa-user)"
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

const themeStore = useThemeStore();
const sessionStore = useSessionStore();
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
  router.push({ name: "UserPortal" });
}

function doLogout() {
  logoutDialog.value = false;
  sessionStore.clearSession();
  router.push({ name: "Login" });
}

// const breadcrumbs = computed(() => [
//   { title: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช DOA", to: "/doa/user" },
//   { title: route.meta.title },
// ]);

const breadcrumbs = computed(() => {
  // 1. กำหนด Dictionary ของชื่อตาม Type เหมือนที่ใช้ในหน้า NewApplicationPage
  const typeTitles = {
    register: "ยื่นคำขอขึ้นทะเบียน / ต่ออายุทะเบียน",
    amendment: "คำขอแก้ไขข้อมูลทะเบียน",
    scope: "คำขอเพิ่ม / ลดขอบข่ายมาตรฐาน",
  };

  // 2. ดึงค่า type จาก URL params
  const type = route.params.type;

  // 3. เลือก Title:
  // ถ้ามีค่าใน Dictionary ให้ใช้ค่านั้น
  // ถ้าไม่มี (เช่นหน้าอื่นๆ) ให้ใช้ค่าจาก meta.title ตามเดิม
  const currentTitle = typeTitles[type] || route.meta.title || "หน้าหลัก";

  return [
    { title: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช DOA", to: "/doa/user" },
    { title: currentTitle },
  ];
});

const navGroups = [
  {
    label: "ภาพรวม",
    divider: true,
    items: [
      { title: "แดชบอร์ด", icon: "fas fa-gauge", to: "/doa/user/dashboard" },
    ],
  },
  {
    label: "สร้างคำขอใหม่",
    divider: true,
    items: [
      {
        title: "สร้างคำขอใหม่",
        icon: "fas fa-file-pen",
        to: "/doa/user/applications/new",
      },
      {
        title: "รายการคำขอ",
        icon: "fas fa-file-lines",
        to: "/doa/user/applications",
      },
    ],
  },
  {
    label: "ใบรับรอง",
    divider: false,
    items: [
      {
        title: "รายการใบรับรอง",
        icon: "fas fa-certificate",
        to: "/doa/user/certificates",
      },
    ],
  },
];
</script>
