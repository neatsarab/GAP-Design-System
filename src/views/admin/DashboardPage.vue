<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">Admin Dashboard</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">ภาพรวมสถานะระบบทั้งหมด</p>
    </div>

    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col v-for="card in summaryCards" :key="card.label" cols="12" sm="6" md="3">
        <v-card rounded="xl" elevation="0" class="summary-card">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="action-icon-box" :style="`background: rgba(var(--v-theme-${card.color}), 0.1)`">
                <v-icon :icon="card.icon" :color="card.color" size="20" />
              </div>
              <v-chip size="x-small" :color="card.chipColor" variant="tonal">{{ card.chipLabel }}</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ card.value }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ card.label }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Service Status Quick View -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" class="section-card h-100">
          <v-card-title class="pa-5 pb-3 section-title d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-server" color="admin" size="16" />
              Service Status
            </div>
            <v-btn size="x-small" variant="text" color="admin" append-icon="fas fa-arrow-right" @click="goToServiceStatus">ดูทั้งหมด</v-btn>
          </v-card-title>
          <v-divider />
          <v-list density="compact" class="pa-2">
            <v-list-item v-for="svc in services" :key="svc.name" rounded="lg" class="mb-1">
              <template #prepend>
                <v-icon :icon="statusIcon(svc.status)" :color="statusColor(svc.status)" size="14" class="mr-2" />
              </template>
              <v-list-item-title class="text-body-2">{{ svc.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ svc.desc }}</v-list-item-subtitle>
              <template #append>
                <v-chip size="x-small" :color="statusColor(svc.status)" variant="tonal">{{ svc.status }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Certificate Expiration Quick View -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" class="section-card h-100">
          <v-card-title class="pa-5 pb-3 section-title d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-shield-halved" color="admin" size="16" />
              Certificate Expiration
            </div>
            <v-btn size="x-small" variant="text" color="admin" append-icon="fas fa-arrow-right" @click="goToCertificateExpiration">ดูทั้งหมด</v-btn>
          </v-card-title>
          <v-divider />
          <v-list density="compact" class="pa-2">
            <v-list-item v-for="cert in certificates" :key="cert.name" rounded="lg" class="mb-1">
              <template #prepend>
                <v-icon icon="fas fa-certificate" :color="cert.status === 'Valid' ? 'success' : 'warning'" size="14" class="mr-2" />
              </template>
              <v-list-item-title class="text-body-2">{{ cert.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">หมดอายุ: {{ cert.expiry }}</v-list-item-subtitle>
              <template #append>
                <v-chip size="x-small" :color="cert.status === 'Valid' ? 'success' : 'warning'" variant="tonal">{{ cert.status }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- System Resources Quick View -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" class="section-card">
          <v-card-title class="pa-5 pb-3 section-title d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-microchip" color="admin" size="16" />
              System Resources
            </div>
            <v-btn size="x-small" variant="text" color="admin" append-icon="fas fa-arrow-right" @click="goToSystemResources">ดูทั้งหมด</v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <div v-for="res in resources" :key="res.label" class="mb-4">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-body-2">{{ res.label }}</span>
                <span class="text-body-2 font-weight-bold" :class="`text-${res.color}`">{{ res.value }}</span>
              </div>
              <v-progress-linear :model-value="res.percent" :color="res.color" rounded height="6" bg-color="surface-variant" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Storage Status Quick View -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" class="section-card">
          <v-card-title class="pa-5 pb-3 section-title d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-hard-drive" color="admin" size="16" />
              Storage Status
            </div>
            <v-btn size="x-small" variant="text" color="admin" append-icon="fas fa-arrow-right" @click="goToStorageStatus">ดูทั้งหมด</v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <div v-for="storage in storages" :key="storage.type" class="mb-4">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-body-2">{{ storage.type }}</span>
                <span class="text-body-2 text-medium-emphasis">{{ storage.used }} / {{ storage.total }}</span>
              </div>
              <v-progress-linear :model-value="storage.percent" :color="storage.percent >= 80 ? 'error' : storage.percent >= 60 ? 'warning' : 'admin'" rounded height="6" bg-color="surface-variant" />
              <div class="text-caption text-medium-emphasis mt-1">เหลือ {{ storage.available }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const summaryCards = [
  { label: "Services Running", value: "4/4", icon: "fas fa-server", color: "success", chipColor: "success", chipLabel: "ปกติ" },
  { label: "APIs Connected", value: "3/3", icon: "fas fa-plug", color: "info", chipColor: "info", chipLabel: "ปกติ" },
  { label: "Certificates (หมดเร็ว ๆ นี้)", value: "1", icon: "fas fa-shield-halved", color: "warning", chipColor: "warning", chipLabel: "แจ้งเตือน" },
  { label: "Login วันนี้", value: "24", icon: "fas fa-clipboard-list", color: "primary", chipColor: "primary", chipLabel: "ปกติ" },
];

const services = [
  { name: "Auth Service", desc: "ระบบยืนยันตัวตน", status: "Running" },
  { name: "Database Service", desc: "ระบบฐานข้อมูล", status: "Running" },
  { name: "File Service", desc: "ระบบจัดเก็บไฟล์", status: "Running" },
  { name: "Notification Service", desc: "ระบบแจ้งเตือน", status: "Running" },
];

const certificates = [
  { name: "SSL Certificate", expiry: "30/12/2026", status: "Valid" },
  { name: "API Certificate", expiry: "15/11/2026", status: "Expiring Soon" },
];

const resources = [
  { label: "CPU Usage", value: "45%", percent: 45, color: "success" },
  { label: "Memory Usage", value: "60%", percent: 60, color: "warning" },
  { label: "Disk Usage", value: "40%", percent: 40, color: "success" },
  { label: "Network", value: "120 Mbps", percent: 30, color: "info" },
];

const storages = [
  { type: "Database Storage", used: "120 GB", available: "380 GB", total: "500 GB", percent: 24 },
  { type: "File Storage", used: "80 GB", available: "220 GB", total: "300 GB", percent: 27 },
];

function goToServiceStatus() {
  router.push({ name: "AdminServiceStatus" });
}

function goToCertificateExpiration() {
  router.push({ name: "AdminCertificateExpiration" });
}

function goToSystemResources() {
  router.push({ name: "AdminSystemResources" });
}

function goToStorageStatus() {
  router.push({ name: "AdminStorageStatus" });
}

function statusColor(s) {
  return s === "Running" ? "success" : s === "Error" ? "error" : s === "Maintenance" ? "warning" : "default";
}
function statusIcon(s) {
  return s === "Running" ? "fas fa-circle-check" : s === "Error" ? "fas fa-circle-xmark" : s === "Maintenance" ? "fas fa-triangle-exclamation" : "fas fa-circle-minus";
}
</script>

