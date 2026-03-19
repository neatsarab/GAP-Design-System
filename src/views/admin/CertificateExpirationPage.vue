<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">Certificate Expiration</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">ติดตาม Certificate ที่กำลังจะหมดอายุ</p>
    </div>

    <!-- Alert: expiring soon -->
    <v-alert v-if="expiringSoon.length" color="warning" variant="tonal" rounded="xl" class="mb-5" prepend-icon="fas fa-triangle-exclamation">
      มี <strong>{{ expiringSoon.length }}</strong> Certificate ที่จะหมดอายุใน 30 วัน
    </v-alert>

    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="certificates" rounded="xl" hover>
        <template #item.status="{ item }">
          <v-chip :color="certStatusColor(item.status)" size="small" variant="tonal" :prepend-icon="certStatusIcon(item.status)">
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.daysLeft="{ item }">
          <span class="text-body-2 font-weight-medium" :class="item.daysLeft <= 30 ? 'text-warning' : item.daysLeft < 0 ? 'text-error' : 'text-success'">
            {{ item.daysLeft < 0 ? 'หมดอายุแล้ว' : item.daysLeft + ' วัน' }}
          </span>
        </template>
        <template #item.actions>
          <v-btn size="x-small" color="admin" variant="tonal" rounded="lg" prepend-icon="fas fa-rotate">Renew</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const certificates = [
  { name: "SSL Certificate", domain: "doa.go.th", expiry: "30/12/2026", status: "Valid", daysLeft: 289 },
  { name: "API Certificate", domain: "api.doa.go.th", expiry: "15/11/2026", status: "Expiring Soon", daysLeft: 244 },
  { name: "Auth Certificate", domain: "auth.doa.go.th", expiry: "01/04/2026", status: "Expiring Soon", daysLeft: 16 },
];

const headers = [
  { title: "Certificate Name", key: "name", sortable: true },
  { title: "Domain", key: "domain", sortable: false },
  { title: "Expiration Date", key: "expiry", sortable: true },
  { title: "เหลือ", key: "daysLeft", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const expiringSoon = computed(() => certificates.filter(c => c.daysLeft <= 30 && c.daysLeft >= 0));

function certStatusColor(s: string) {
  return s === "Valid" ? "success" : s === "Expiring Soon" ? "warning" : "error";
}
function certStatusIcon(s: string) {
  return s === "Valid" ? "fas fa-circle-check" : s === "Expiring Soon" ? "fas fa-clock" : "fas fa-circle-xmark";
}
</script>

