<template>
  <div>
    <!-- ════════════════════════════════
         SIDEBAR NAV
    ════════════════════════════════ -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="surface"
      class="ds-sidebar"
    >
      <!-- Brand / Logo -->
      <v-list-item nav class="py-4 px-4">
        <template v-slot:prepend>
          <div class="logo-icon-box rounded-lg mr-3">
            <v-icon icon="fas fa-leaf" color="primary" size="20" />
          </div>
        </template>
        <v-list-item-title class="font-weight-medium text-body-2">
          ระบบรับรองแหล่งผลิต GAP พืช
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          กรมวิชาการเกษตร
        </v-list-item-subtitle>
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
            <v-icon icon="fas fa-user" size="16" color="white" />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div
              class="text-truncate text-body-2 font-weight-medium text-primary"
            >
              นิธิพร เทิบจันทึก
            </div>
            <div class="text-caption text-medium-emphasis">
              เลขทะเบียน : 19903004
            </div>
          </div>
          <v-icon icon="fas fa-chevron-down" size="12" color="primary" />
        </div>
      </div>

      <v-divider class="mx-3" />

      <v-list density="compact" nav class="mt-1 px-2">
        <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">
          Design Tokens
        </div>
        <v-list-item
          v-for="s in navSections.slice(0, 2)"
          :key="s.id"
          :prepend-icon="s.icon"
          :title="s.title"
          :value="s.id"
          :active="activeSection === s.id"
          active-color="primary"
          rounded="lg"
          class="mb-1"
          :class="{ 'nav-item--active': activeSection === s.id }"
          @click="scrollTo(s.id)"
        />

        <v-divider class="mx-2 my-2" />
        <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">
          Components
        </div>
        <v-list-item
          v-for="s in navSections.slice(2, 9)"
          :key="s.id"
          :prepend-icon="s.icon"
          :title="s.title"
          :value="s.id"
          :active="activeSection === s.id"
          active-color="primary"
          rounded="lg"
          class="mb-1"
          :class="{ 'nav-item--active': activeSection === s.id }"
          @click="scrollTo(s.id)"
        />

        <v-divider class="mx-2 my-2" />
        <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">
          Patterns
        </div>
        <v-list-item
          v-for="s in navSections.slice(9)"
          :key="s.id"
          :prepend-icon="s.icon"
          :title="s.title"
          :value="s.id"
          :active="activeSection === s.id"
          active-color="primary"
          rounded="lg"
          class="mb-1"
          :class="{ 'nav-item--active': activeSection === s.id }"
          @click="scrollTo(s.id)"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- ════════════════════════════════
         APP BAR
    ════════════════════════════════ -->
    <v-app-bar flat height="70" class="ds-app-bar">
      <v-btn
        icon="fas fa-bars"
        variant="text"
        size="small"
        class="ml-2"
        @click="rail = !rail"
      />

      <div class="d-none d-sm-block ml-3" style="width: 210px">
        <v-text-field
          placeholder="ค้นหา..."
          prepend-inner-icon="fas fa-magnifying-glass"
          variant="solo-filled"
          density="compact"
          hide-details
          flat
          rounded="lg"
          bg-color="surface-variant"
        />
      </div>

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

        <v-btn variant="text" size="small" icon class="mr-1">
          <v-badge color="error" content="4" floating>
            <v-icon icon="fas fa-bell" size="20" color="primary" />
          </v-badge>
        </v-btn>

        <v-chip
          variant="outlined"
          color="primary"
          class="user-chip mr-3"
          prepend-icon="fas fa-user"
        >
          นิธิพร เทิบจันทึก
          <v-icon icon="fas fa-chevron-down" size="12" class="ml-1" />
        </v-chip>
      </div>
    </v-app-bar>

    <!-- ════════════════════════════════
         MAIN CONTENT
    ════════════════════════════════ -->
    <v-main class="bg-background">
      <v-container fluid class="pa-5 pa-md-7" style="max-width: 1280px">
        <!-- Page Header -->
        <div
          class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6 page-header"
        >
          <div>
            <div class="d-flex align-center ga-1 mb-2">
              <span class="text-body-2 text-medium-emphasis">ระบบ GAP</span>
              <v-icon
                icon="fas fa-chevron-right"
                size="10"
                class="text-medium-emphasis mx-1"
              />
              <span class="text-body-2 font-weight-medium text-primary"
                >Design System</span
              >
            </div>
            <h1 class="text-h4 font-weight-medium mb-1">GAP Design System</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              คู่มือ UI components และ design tokens สำหรับระบบรับรองแหล่งผลิต
              GAP พืช
            </p>
          </div>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              size="small"
              color="primary"
              variant="tonal"
              prepend-icon="fab fa-vuejs"
              >Vue 3</v-chip
            >
            <v-chip
              size="small"
              color="info"
              variant="tonal"
              prepend-icon="fas fa-puzzle-piece"
              >Vuetify 3</v-chip
            >
            <v-chip
              size="small"
              color="secondary"
              variant="tonal"
              prepend-icon="fas fa-code"
              >TypeScript</v-chip
            >
            <v-chip
              size="small"
              color="success"
              variant="tonal"
              prepend-icon="fas fa-database"
              >Pinia</v-chip
            >
          </div>
        </div>

        <!-- Quick Stats -->
        <v-row class="mb-2">
          <v-col
            v-for="card in summaryCards"
            :key="card.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card>
              <v-card-text class="pa-5">
                <div class="d-flex align-start">
                  <div class="flex-grow-1">
                    <div
                      class="text-caption text-medium-emphasis mb-1 font-weight-medium"
                    >
                      {{ card.title }}
                    </div>
                    <div class="text-h5 font-weight-bold mb-2">
                      {{ card.value }}
                    </div>
                    <div class="d-flex align-center ga-1">
                      <v-chip
                        :color="card.trend >= 0 ? 'success' : 'error'"
                        size="x-small"
                        variant="tonal"
                        class="px-1"
                      >
                        <v-icon
                          start
                          :icon="
                            card.trend >= 0
                              ? 'fas fa-arrow-up'
                              : 'fas fa-arrow-down'
                          "
                          size="9"
                        />
                        {{ Math.abs(card.trend) }}%
                      </v-chip>
                      <span class="text-caption text-medium-emphasis"
                        >เทียบกับเดือนที่ผ่านมา</span
                      >
                    </div>
                  </div>
                  <div
                    class="stat-icon-box ml-3"
                    :style="`background:rgba(var(--v-theme-${card.color}),0.12)`"
                  >
                    <v-icon :icon="card.icon" :color="card.color" size="22" />
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 1. COLORS -->
        <section :id="navSections[0].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[0].icon"
            :title="navSections[0].title"
          />
          <DsColors :is-dark="isDark" />
        </section>

        <!-- 2. TYPOGRAPHY -->
        <section :id="navSections[1].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[1].icon"
            :title="navSections[1].title"
          />
          <DsTypography />
        </section>

        <!-- 3. BUTTONS -->
        <section :id="navSections[2].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[2].icon"
            :title="navSections[2].title"
          />
          <DsButtons />
        </section>

        <!-- 4. STATUS CHIPS -->
        <section :id="navSections[3].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[3].icon"
            :title="navSections[3].title"
          />
          <DsChips />
        </section>

        <!-- 5. FORM INPUTS -->
        <section :id="navSections[4].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[4].icon"
            :title="navSections[4].title"
          />
          <DsForms />
        </section>

        <!-- 6. CARDS -->
        <section :id="navSections[5].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[5].icon"
            :title="navSections[5].title"
          />
          <DsCards />
        </section>

        <!-- 7. DATA TABLE -->
        <section :id="navSections[6].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[6].icon"
            :title="navSections[6].title"
          />
          <DsTable />
        </section>

        <!-- 8. ALERTS -->
        <section :id="navSections[7].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[7].icon"
            :title="navSections[7].title"
          />
          <DsAlerts />
        </section>

        <!-- 9. DIALOGS -->
        <section :id="navSections[8].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[8].icon"
            :title="navSections[8].title"
          />
          <DsDialogs />
        </section>

        <!-- 10. STEPPER -->
        <section :id="navSections[9].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[9].icon"
            :title="navSections[9].title"
          />
          <DsStepper />
        </section>

        <!-- 11. PANELS & LISTS -->
        <section :id="navSections[10].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[10].icon"
            :title="navSections[10].title"
          />
          <DsPanels />
        </section>

        <!-- 12. PROGRESS & LOADING -->
        <section :id="navSections[11].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[11].icon"
            :title="navSections[11].title"
          />
          <DsProgress />
        </section>

        <!-- 13. TIMELINE -->
        <section :id="navSections[12].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[12].icon"
            :title="navSections[12].title"
          />
          <DsTimeline />
        </section>

        <!-- 14. NAVIGATION -->
        <section :id="navSections[13].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[13].icon"
            :title="navSections[13].title"
          />
          <DsNavigation />
        </section>

        <!-- 15. ICONS -->
        <section :id="navSections[14].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[14].icon"
            :title="navSections[14].title"
          />
          <DsIcons />
        </section>

        <!-- 16. AppStatusChip -->
        <section :id="navSections[15].id" class="mb-10">
          <DsSectionTitle
            :icon="navSections[15].icon"
            :title="navSections[15].title"
          />
          <DsStatusChip />
        </section>
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useThemeStore } from "@/stores/theme.store";

import DsSectionTitle from "@/components/ds/DsSectionTitle.vue";
import DsColors from "@/components/ds/DsColors.vue";
import DsTypography from "@/components/ds/DsTypography.vue";
import DsButtons from "@/components/ds/DsButtons.vue";
import DsChips from "@/components/ds/DsChips.vue";
import DsForms from "@/components/ds/DsForms.vue";
import DsCards from "@/components/ds/DsCards.vue";
import DsTable from "@/components/ds/DsTable.vue";
import DsAlerts from "@/components/ds/DsAlerts.vue";
import DsDialogs from "@/components/ds/DsDialogs.vue";
import DsStepper from "@/components/ds/DsStepper.vue";
import DsPanels from "@/components/ds/DsPanels.vue";
import DsProgress from "@/components/ds/DsProgress.vue";
import DsTimeline from "@/components/ds/DsTimeline.vue";
import DsNavigation from "@/components/ds/DsNavigation.vue";
import DsIcons from "@/components/ds/DsIcons.vue";
import DsStatusChip from "@/components/ds/DsStatusChip.vue";

// ── Theme ────────────────────────────────────────────────
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
function toggleTheme() {
  themeStore.toggle();
}

// ── State ────────────────────────────────────────────────
const drawer = ref(true);
const rail = ref(false);
const activeSection = ref("colors");

function scrollTo(id) {
  activeSection.value = id;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Nav Sections ─────────────────────────────────────────
const navSections = [
  { id: "colors", icon: "fas fa-palette", title: "1. Color Palette" },
  { id: "typography", icon: "fas fa-font", title: "2. Typography" },
  { id: "buttons", icon: "fas fa-hand-pointer", title: "3. Buttons" },
  { id: "chips", icon: "fas fa-tag", title: "4. Status Chips" },
  { id: "forms", icon: "fas fa-keyboard", title: "5. Form Inputs" },
  { id: "cards", icon: "fas fa-address-card", title: "6. Cards" },
  { id: "table", icon: "fas fa-table", title: "7. Data Table" },
  { id: "alerts", icon: "fas fa-circle-exclamation", title: "8. Alerts" },
  { id: "dialogs", icon: "fas fa-message", title: "9. Dialogs" },
  { id: "stepper", icon: "fas fa-list-ol", title: "10. Stepper" },
  { id: "expansion", icon: "fas fa-list", title: "11. Panels & Lists" },
  { id: "progress", icon: "fas fa-spinner", title: "12. Progress" },
  { id: "timeline", icon: "fas fa-timeline", title: "13. Timeline" },
  { id: "navigation", icon: "fas fa-compass", title: "14. Navigation" },
  { id: "icons", icon: "fas fa-shapes", title: "15. Icons" },
  {
    id: "status-chip",
    icon: "fas fa-circle-half-stroke",
    title: "16. AppStatusChip",
  },
];

// ── Summary Cards ─────────────────────────────────────────
const summaryCards = [
  {
    title: "คำขอทั้งหมด",
    value: 128,
    icon: "fas fa-copy",
    color: "primary",
    trend: 12.4,
  },
  {
    title: "รอดำเนินการ",
    value: 34,
    icon: "far fa-clock",
    color: "warning",
    trend: -3.2,
  },
  {
    title: "ผ่านการรับรอง",
    value: 82,
    icon: "far fa-circle-check",
    color: "success",
    trend: 8.1,
  },
  {
    title: "ใบรับรองที่ใช้งานอยู่",
    value: 76,
    icon: "fas fa-certificate",
    color: "info",
    trend: 5.7,
  },
];
</script>

<style scoped>
/* ── Sidebar ─────────────────────────────────────────── */
.ds-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
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
  border: 1px solid rgba(var(--v-theme-primary), 0.28);
}

.sidebar-group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 12px 4px;
}

.nav-item--active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
}

/* ── App Bar ─────────────────────────────────────────── */
.ds-app-bar {
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  background: rgba(var(--v-theme-surface), 0.92) !important;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.user-chip {
  background: rgba(var(--v-theme-primary), 0.08);
}

/* ── Page ────────────────────────────────────────────── */
.page-header {
  animation: fadeInDown 0.4s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
