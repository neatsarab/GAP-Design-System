<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">API Status</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          สถานะการเชื่อมต่อ API กับหน่วยงานภายนอก
        </p>
      </div>
      <v-btn
        color="admin"
        rounded="lg"
        prepend-icon="fas fa-rotate"
        @click="pingAll"
        >Ping All</v-btn
      >
    </div>

    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="apis" rounded="xl" hover>
        <template #item.status="{ item }">
          <v-chip
            :color="apiStatusColor(item.status)"
            size="small"
            variant="tonal"
            :prepend-icon="apiStatusIcon(item.status)"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.responseTime="{ item }">
          <span
            class="text-body-2"
            :class="item.responseTime > 200 ? 'text-warning' : 'text-success'"
          >
            {{ item.status === "Connected" ? item.responseTime + " ms" : "—" }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="x-small"
            color="admin"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-satellite-dish"
            @click="pingApi(item)"
            >Ping</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const apis = ref([
  {
    name: "DOA API",
    endpoint: "/api/doa",
    status: "Connected",
    responseTime: 120,
  },
  {
    name: "GAP API",
    endpoint: "/api/gap",
    status: "Connected",
    responseTime: 140,
  },
  {
    name: "External Auth API",
    endpoint: "/api/auth",
    status: "Connected",
    responseTime: 90,
  },
]);

const headers = [
  { title: "API Name", key: "name", sortable: true },
  { title: "Endpoint", key: "endpoint", sortable: false },
  { title: "Status", key: "status", sortable: true },
  { title: "Response Time", key: "responseTime", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

function apiStatusColor(s) {
  return s === "Connected"
    ? "success"
    : s === "Timeout"
      ? "warning"
      : s === "Error"
        ? "error"
        : "default";
}
function apiStatusIcon(s) {
  return s === "Connected"
    ? "fas fa-circle-check"
    : s === "Timeout"
      ? "fas fa-clock"
      : s === "Error"
        ? "fas fa-circle-xmark"
        : "fas fa-circle-minus";
}
function pingApi(api) {
  api.responseTime = Math.floor(Math.random() * 200 + 80);
  api.status = "Connected";
}
function pingAll() {
  apis.value.forEach(pingApi);
}
</script>
