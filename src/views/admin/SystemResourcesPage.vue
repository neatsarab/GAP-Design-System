<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">System Resources</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">การใช้งานทรัพยากรของ Server</p>
      </div>
      <v-chip color="success" variant="tonal" prepend-icon="fas fa-circle">
        Real-time Monitoring
      </v-chip>
    </div>

    <!-- Resource Cards -->
    <v-row class="mb-6">
      <v-col v-for="res in resources" :key="res.label" cols="12" sm="6" md="3">
        <v-card rounded="xl" elevation="0" class="resource-card pa-5">
          <div class="d-flex align-center ga-3 mb-4">
            <div class="res-icon" :style="`background: rgba(var(--v-theme-${res.color}), 0.1)`">
              <v-icon :icon="res.icon" :color="res.color" size="20" />
            </div>
            <div class="text-body-2 font-weight-bold">{{ res.label }}</div>
          </div>

          <div class="text-h4 font-weight-bold mb-1" :class="`text-${res.color}`">{{ res.value }}</div>

          <v-progress-linear :model-value="res.percent" :color="res.color" rounded height="8" bg-color="surface-variant" class="mb-2" />

          <div class="d-flex justify-space-between">
            <span class="text-caption text-medium-emphasis">{{ res.detail }}</span>
            <span class="text-caption font-weight-bold" :class="`text-${res.color}`">{{ res.percent }}%</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resource Table -->
    <v-card rounded="xl" elevation="0" class="section-card">
      <v-card-title class="pa-5 pb-3 section-title">
        <v-icon icon="fas fa-table" color="admin" class="mr-2" size="16" />รายละเอียดทรัพยากร
      </v-card-title>
      <v-divider />
      <v-data-table :headers="headers" :items="resources" rounded="xl">
        <template #item.percent="{ item }">
          <div class="d-flex align-center ga-2" style="min-width:160px">
            <v-progress-linear :model-value="item.percent" :color="item.color" rounded height="6" bg-color="surface-variant" class="flex-grow-1" />
            <span class="text-body-2 font-weight-bold" :class="`text-${item.color}`">{{ item.percent }}%</span>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const resources = [
  { label: "CPU Usage", value: "45%", percent: 45, icon: "fas fa-microchip", color: "success", detail: "8 Cores / 16 Threads" },
  { label: "Memory Usage", value: "60%", percent: 60, icon: "fas fa-memory", color: "warning", detail: "19.2 GB / 32 GB" },
  { label: "Disk Usage", value: "40%", percent: 40, icon: "fas fa-hard-drive", color: "success", detail: "400 GB / 1 TB" },
  { label: "Network", value: "120 Mbps", percent: 24, icon: "fas fa-network-wired", color: "info", detail: "120 Mbps / 500 Mbps" },
];

const headers = [
  { title: "Resource", key: "label", sortable: true },
  { title: "Value", key: "value" },
  { title: "Detail", key: "detail" },
  { title: "Usage", key: "percent", sortable: true },
];
</script>

<style scoped>
.resource-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.res-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
</style>
