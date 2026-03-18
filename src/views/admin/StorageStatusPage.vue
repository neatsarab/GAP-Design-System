<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">Storage Status</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">พื้นที่จัดเก็บข้อมูลของระบบ</p>
    </div>

    <v-row class="mb-5">
      <v-col v-for="storage in storages" :key="storage.type" cols="12" md="6">
        <v-card rounded="xl" elevation="0" class="section-card pa-5">
          <div class="d-flex align-center ga-3 mb-4">
            <div class="storage-icon" :style="`background: rgba(var(--v-theme-${usageColor(storage.percent)}), 0.1)`">
              <v-icon icon="fas fa-hard-drive" :color="usageColor(storage.percent)" size="22" />
            </div>
            <div>
              <div class="text-body-1 font-weight-bold">{{ storage.type }}</div>
              <div class="text-caption text-medium-emphasis">{{ storage.used }} ใช้งาน จาก {{ storage.total }}</div>
            </div>
            <v-spacer />
            <v-chip v-if="storage.percent >= 80" size="small" color="error" variant="tonal" prepend-icon="fas fa-triangle-exclamation">เกือบเต็ม</v-chip>
          </div>

          <v-progress-linear :model-value="storage.percent" :color="usageColor(storage.percent)" rounded height="10" bg-color="surface-variant" class="mb-3" />

          <v-row dense class="mt-2">
            <v-col cols="4" class="text-center">
              <div class="text-h6 font-weight-bold" :class="`text-${usageColor(storage.percent)}`">{{ storage.percent }}%</div>
              <div class="text-caption text-medium-emphasis">ใช้งาน</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="text-h6 font-weight-bold">{{ storage.used }}</div>
              <div class="text-caption text-medium-emphasis">Used</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="text-h6 font-weight-bold text-success">{{ storage.available }}</div>
              <div class="text-caption text-medium-emphasis">Available</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-card rounded="xl" elevation="0" class="section-card">
      <v-card-title class="pa-5 pb-3 section-title">
        <v-icon icon="fas fa-table" color="admin" class="mr-2" size="16" />รายละเอียด
      </v-card-title>
      <v-divider />
      <v-data-table :headers="headers" :items="storages" rounded="xl">
        <template #item.percent="{ item }">
          <div class="d-flex align-center ga-2" style="min-width:160px">
            <v-progress-linear :model-value="item.percent" :color="usageColor(item.percent)" rounded height="6" bg-color="surface-variant" class="flex-grow-1" />
            <span class="text-body-2 text-no-wrap" :class="`text-${usageColor(item.percent)}`">{{ item.percent }}%</span>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const storages = [
  { type: "Database Storage", used: "120 GB", available: "380 GB", total: "500 GB", percent: 24 },
  { type: "File Storage", used: "80 GB", available: "220 GB", total: "300 GB", percent: 27 },
];

const headers = [
  { title: "Storage Type", key: "type", sortable: true },
  { title: "Used Space", key: "used" },
  { title: "Available Space", key: "available" },
  { title: "Total Space", key: "total" },
  { title: "Usage", key: "percent", sortable: true },
];

function usageColor(p: number) {
  return p >= 80 ? "error" : p >= 60 ? "warning" : "admin";
}
</script>

<style scoped>
.section-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.section-title { font-size: 14px !important; font-weight: 600; }
.storage-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
</style>
