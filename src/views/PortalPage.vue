<template>
  <div class="portal-root">
    <!-- Theme toggle — top right -->
    <div style="position: absolute; top: 16px; right: 16px; z-index: 10">
      <v-btn
        variant="tonal"
        size="small"
        rounded="lg"
        :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
        @click="themeStore.toggle()"
      >
        {{ themeStore.isDark ? "Light Mode" : "Dark Mode" }}
      </v-btn>
    </div>

    <!-- Background decoration -->
    <div class="portal-bg-pattern" />

    <v-container
      class="portal-container d-flex flex-column align-center justify-center"
      fluid
    >
      <!-- Logo & Title -->
      <div class="text-center mb-10">
        <div class="logo-ring mx-auto mb-5">
          <v-icon icon="fas fa-leaf" size="48" color="primary" />
        </div>
        <h1 class="text-h4 font-weight-bold mb-2">
          ระบบรับรองแหล่งผลิต GAP พืช
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          กรมวิชาการเกษตร · กระทรวงเกษตรและสหกรณ์
        </p>
        <div class="d-flex justify-center ga-2 mt-3">
          <v-chip size="x-small" color="primary" variant="tonal"
            >v1.0.0 MVP</v-chip
          >
          <v-chip
            size="x-small"
            color="success"
            variant="tonal"
            prepend-icon="fas fa-circle"
            >พร้อมใช้งาน</v-chip
          >
        </div>
      </div>

      <!-- Menu Cards -->
      <v-row
        class="portal-cards justify-center"
        style="max-width: 820px; width: 100%"
      >
        <!-- GAP System -->
        <v-col cols="12" sm="6">
          <v-card
            class="portal-card"
            hover
            @click="router.push('/login')"
          >
            <v-card-text
              class="pa-8 text-center d-flex flex-column align-center"
            >
              <div class="portal-icon-box bg-primary mb-5">
                <v-icon icon="fas fa-seedling" size="36" color="white" />
              </div>
              <h2 class="text-h6 font-weight-bold mb-2">เข้าสู่ระบบ GAP</h2>
              <p class="text-body-2 text-medium-emphasis mb-5">
                ยื่นคำขอ ติดตามสถานะ และจัดการใบรับรองแหล่งผลิต GAP พืช
              </p>
              <div class="d-flex flex-wrap justify-center ga-2 mb-6">
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="primary"
                  prepend-icon="fas fa-file-pen"
                  >ยื่นคำขอ</v-chip
                >
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="info"
                  prepend-icon="fas fa-clock"
                  >ติดตามสถานะ</v-chip
                >
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="success"
                  prepend-icon="fas fa-certificate"
                  >ใบรับรอง</v-chip
                >
              </div>
              <div class="w-100">
                <v-btn
                  color="primary"
                  variant="elevated"
                  prepend-icon="fas fa-right-to-bracket"
                  rounded="lg"
                  block
                >
                  เข้าสู่ระบบ
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Design System -->
        <v-col cols="12" sm="6">
          <v-card
            class="portal-card"
            hover
            @click="router.push('/design-system')"
          >
            <v-card-text
              class="pa-8 text-center d-flex flex-column align-center"
            >
              <div class="portal-icon-box bg-secondary mb-5">
                <v-icon icon="fas fa-palette" size="36" color="white" />
              </div>
              <h2 class="text-h6 font-weight-bold mb-2">Design System</h2>
              <p class="text-body-2 text-medium-emphasis mb-5">
                คู่มือ UI components, design tokens และแนวทางการออกแบบสำหรับระบบ
                GAP
              </p>
              <div class="d-flex flex-wrap justify-center ga-2 mb-6">
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="secondary"
                  prepend-icon="fab fa-vuejs"
                  >Vue 3</v-chip
                >
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="info"
                  prepend-icon="fas fa-puzzle-piece"
                  >Vuetify 3</v-chip
                >
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="warning"
                  prepend-icon="fas fa-code"
                  >TypeScript</v-chip
                >
              </div>
              <div class="w-100">
                <v-btn
                  color="secondary"
                  variant="elevated"
                  prepend-icon="fas fa-arrow-right"
                  rounded="lg"
                  block
                >
                  ดู Design System
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Footer -->
      <p class="text-caption text-medium-emphasis mt-10">
        © 2567 กรมวิชาการเกษตร · ระบบรับรองแหล่งผลิต GAP พืช
      </p>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();
const sessionStore = useSessionStore();

onMounted(() => {
  const { entityType, personalName, companyName } = route.query;
  if (entityType) {
    const name = entityType === "juristic" ? companyName : personalName;
    sessionStore.setContext(entityType, name ?? "");
  }
});
</script>

<style scoped>
.portal-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
}

.portal-bg-pattern {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 20% 50%,
      rgba(var(--v-theme-primary), 0.06) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 80% 20%,
      rgba(var(--v-theme-secondary), 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.portal-container {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.logo-ring {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.portal-cards {
  width: 100%;
}

.portal-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 20px !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.portal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(var(--v-theme-primary), 0.12) !important;
}

.portal-icon-box {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
