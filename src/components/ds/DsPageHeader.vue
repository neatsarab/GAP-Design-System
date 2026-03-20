<template>
  <div>
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
          คู่มือ UI components และ design tokens สำหรับระบบรับรองแหล่งผลิต GAP
          พืช
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
  </div>
</template>

<script setup lang="ts">
export interface SummaryCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend: number;
}

defineProps<{ summaryCards: SummaryCard[] }>();
</script>

<style scoped>
.stat-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

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
