<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">Service Status</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">สถานะการทำงานของ Service ต่าง ๆ ในระบบ</p>
      </div>
      <v-btn color="admin" rounded="lg" prepend-icon="fas fa-rotate" @click="lastCheck = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })">
        Refresh
      </v-btn>
    </div>

    <!-- Status Summary -->
    <v-row class="mb-5">
      <v-col v-for="s in statusSummary" :key="s.label" cols="6" sm="3">
        <v-card rounded="xl" elevation="0" class="stat-card text-center pa-4">
          <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">{{ s.count }}</div>
          <v-chip size="x-small" :color="s.color" variant="tonal" class="mt-1">{{ s.label }}</v-chip>
        </v-card>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="services" rounded="xl" hover>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal" :prepend-icon="statusIcon(item.status)">
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.lastCheck="{ item }">
          <span class="text-body-2 text-medium-emphasis">{{ lastCheck }}</span>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn v-if="item.status !== 'Running'" size="x-small" color="success" variant="tonal" rounded="lg" prepend-icon="fas fa-play" @click="setStatus(item, 'Running')">Start</v-btn>
            <v-btn v-if="item.status === 'Running'" size="x-small" color="error" variant="tonal" rounded="lg" prepend-icon="fas fa-stop" @click="setStatus(item, 'Stopped')">Stop</v-btn>
            <v-btn size="x-small" color="warning" variant="tonal" rounded="lg" prepend-icon="fas fa-triangle-exclamation" @click="setStatus(item, 'Maintenance')">Maintenance</v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const lastCheck = ref(new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }));

interface Service { name: string; status: string; desc: string; }
const services = ref<Service[]>([
  { name: "Auth Service", status: "Running", desc: "ระบบยืนยันตัวตน" },
  { name: "Database Service", status: "Running", desc: "ระบบฐานข้อมูล" },
  { name: "File Service", status: "Running", desc: "ระบบจัดเก็บไฟล์" },
  { name: "Notification Service", status: "Running", desc: "ระบบแจ้งเตือน" },
]);

const headers = [
  { title: "Service Name", key: "name", sortable: true },
  { title: "Description", key: "desc", sortable: false },
  { title: "Status", key: "status", sortable: true },
  { title: "Last Check", key: "lastCheck", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const statusSummary = computed(() => [
  { label: "Running", color: "success", count: services.value.filter(s => s.status === "Running").length },
  { label: "Stopped", color: "default", count: services.value.filter(s => s.status === "Stopped").length },
  { label: "Error", color: "error", count: services.value.filter(s => s.status === "Error").length },
  { label: "Maintenance", color: "warning", count: services.value.filter(s => s.status === "Maintenance").length },
]);

function statusColor(s: string) {
  return s === "Running" ? "success" : s === "Error" ? "error" : s === "Maintenance" ? "warning" : "default";
}
function statusIcon(s: string) {
  return s === "Running" ? "fas fa-circle-check" : s === "Error" ? "fas fa-circle-xmark" : s === "Maintenance" ? "fas fa-triangle-exclamation" : "fas fa-circle-minus";
}
function setStatus(item: Service, status: string) { item.status = status; }
</script>

