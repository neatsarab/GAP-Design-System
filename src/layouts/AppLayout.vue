<template>
  <div>
    <!-- ── Sidebar ── -->
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent color="surface" class="app-sidebar">

      <!-- Brand -->
      <v-list-item nav class="py-4 px-4">
        <template v-slot:prepend>
          <div class="logo-icon-box rounded-lg mr-3">
            <v-icon icon="fas fa-leaf" color="primary" size="20" />
          </div>
        </template>
        <v-list-item-title class="text-body-2 font-weight-bold">GAP พืช</v-list-item-title>
        <v-list-item-subtitle class="text-caption">กรมวิชาการเกษตร</v-list-item-subtitle>
        <template v-slot:append>
          <v-btn :icon="rail ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"
            variant="text" color="on-surface-variant" size="small" @click="rail = !rail" />
        </template>
      </v-list-item>

      <!-- User Card -->
      <div v-if="!rail" class="px-4 mb-2">
        <div class="user-card rounded-lg pa-3 d-flex align-center ga-2">
          <v-avatar color="primary" size="32">
            <v-icon icon="fas fa-user" size="16" color="white" />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div class="text-truncate text-body-2 font-weight-medium text-primary">Admin GAP</div>
            <div class="text-caption text-medium-emphasis">เลขทะเบียน : 19903004</div>
          </div>
        </div>
      </div>

      <v-divider class="mx-3" />

      <!-- Nav -->
      <v-list density="compact" nav class="mt-1 px-2">
        <template v-for="group in navGroups" :key="group.label">
          <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">{{ group.label }}</div>
          <v-list-item
            v-for="item in group.items" :key="item.to"
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

      <!-- Bottom: Design System link -->
      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav class="px-2 py-2">
          <v-list-item
            prepend-icon="fas fa-palette"
            title="Design System"
            to="/design-system"
            active-color="secondary"
            rounded="lg"
          />
          <v-list-item
            prepend-icon="fas fa-right-from-bracket"
            title="ออกจากระบบ"
            to="/"
            active-color="error"
            rounded="lg"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- ── App Bar ── -->
    <v-app-bar flat height="64" class="app-bar">
      <v-btn icon="fas fa-bars" variant="text" size="small" class="ml-2" @click="rail = !rail" />

      <!-- Breadcrumb -->
      <v-breadcrumbs :items="breadcrumbs" density="compact" class="ml-1 d-none d-sm-flex">
        <template #divider>
          <v-icon icon="fas fa-chevron-right" size="10" />
        </template>
      </v-breadcrumbs>

      <v-spacer />

      <div class="d-flex align-center ga-1 mr-3">
        <!-- Theme -->
        <v-tooltip :text="isDark ? 'Light Mode' : 'Dark Mode'" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :icon="isDark ? 'fas fa-sun' : 'fas fa-moon'"
              variant="text" size="small" @click="toggleTheme" />
          </template>
        </v-tooltip>

        <!-- Notifications -->
        <v-btn variant="text" size="small" icon class="mr-1">
          <v-badge color="error" content="3" floating>
            <v-icon icon="fas fa-bell" size="20" color="primary" />
          </v-badge>
        </v-btn>

        <!-- User -->
        <v-chip variant="outlined" color="primary" class="user-chip mr-2" prepend-icon="fas fa-user">
          Admin GAP
          <v-icon icon="fas fa-chevron-down" size="12" class="ml-1" />
        </v-chip>
      </div>
    </v-app-bar>

    <!-- ── Content ── -->
    <v-main class="bg-background">
      <v-container fluid class="pa-5 pa-md-7" style="max-width: 1320px">
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()
const isDark     = computed(() => themeStore.isDark)
function toggleTheme() { themeStore.toggle() }

const drawer = ref(true)
const rail   = ref(false)
const route  = useRoute()

const navGroups = [
  {
    label: 'ภาพรวม',
    divider: true,
    items: [
      { title: 'แดชบอร์ด',    icon: 'fas fa-gauge',         to: '/app/dashboard' },
    ],
  },
  {
    label: 'คำขอ GAP',
    divider: true,
    items: [
      { title: 'รายการคำขอ',  icon: 'fas fa-file-lines',    to: '/app/applications' },
      { title: 'ยื่นคำขอใหม่', icon: 'fas fa-file-pen',      to: '/app/applications/new' },
    ],
  },
  {
    label: 'ระบบ',
    divider: false,
    items: [
      { title: 'รายงาน',       icon: 'fas fa-chart-bar',     to: '/app/reports' },
      { title: 'ตั้งค่า',       icon: 'fas fa-gear',          to: '/app/settings' },
    ],
  },
]

const routeTitleMap: Record<string, string> = {
  '/app/dashboard':          'แดชบอร์ด',
  '/app/applications':       'รายการคำขอ',
  '/app/applications/new':   'ยื่นคำขอใหม่',
  '/app/reports':            'รายงาน',
  '/app/settings':           'ตั้งค่า',
}

const breadcrumbs = computed(() => {
  const title = routeTitleMap[route.path] ?? 'รายละเอียด'
  return [
    { title: 'ระบบ GAP', to: '/app/dashboard' },
    { title },
  ]
})
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
  width: 40px; height: 44px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(var(--v-theme-primary), 0.12);
}
.user-card {
  background: rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-theme-primary), 0.25);
}
.user-chip {
  background: rgba(var(--v-theme-primary), 0.06);
}
.sidebar-group-label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  padding: 8px 12px 4px;
}
</style>
