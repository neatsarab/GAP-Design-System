<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">Login Logs</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ประวัติการเข้าใช้งานระบบ</p>
      </div>
      <v-btn color="admin" rounded="lg" prepend-icon="fas fa-file-export">Export Log</v-btn>
    </div>

    <!-- Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5" md="4">
            <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
            <v-text-field v-model="search" variant="outlined" density="compact" rounded="lg" hide-details placeholder="ค้นหา username / IP..." prepend-inner-icon="fas fa-magnifying-glass" clearable />
          </v-col>
          <v-col cols="12" sm="3" md="2">
            <div class="field-label mb-1"><div>วันที่</div><div class="field-label-en">Date</div></div>
            <v-text-field v-model="filterDate" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
          </v-col>
          <v-col cols="12" sm="4" md="2">
            <div class="field-label mb-1"><div>สถานะ</div><div class="field-label-en">Status</div></div>
            <v-autocomplete v-model="filterStatus" :items="['ทั้งหมด', 'Success', 'Failed']" variant="outlined" density="compact" rounded="lg" hide-details />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="filteredLogs" :search="search" rounded="xl" hover>
        <template #item.role="{ item }">
          <v-chip size="x-small" :color="item.role === 'Administrator' ? 'admin' : 'default'" variant="tonal">{{ item.role }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip size="x-small" :color="item.status === 'Success' ? 'success' : 'error'" variant="tonal" :prepend-icon="item.status === 'Success' ? 'fas fa-circle-check' : 'fas fa-circle-xmark'">
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const filterDate = ref("");
const filterStatus = ref("ทั้งหมด");

const logs = [
  { username: "admin", role: "Administrator", ip: "192.168.1.10", loginTime: "10:30", date: "16/03/2568", status: "Success" },
  { username: "user01", role: "Staff", ip: "192.168.1.20", loginTime: "09:45", date: "16/03/2568", status: "Success" },
  { username: "user02", role: "Staff", ip: "192.168.1.25", loginTime: "09:30", date: "16/03/2568", status: "Failed" },
  { username: "user03", role: "Staff", ip: "192.168.1.30", loginTime: "08:15", date: "16/03/2568", status: "Success" },
  { username: "user04", role: "Staff", ip: "10.0.0.15", loginTime: "08:00", date: "15/03/2568", status: "Failed" },
  { username: "admin", role: "Administrator", ip: "192.168.1.10", loginTime: "07:55", date: "15/03/2568", status: "Success" },
];

const headers = [
  { title: "Username", key: "username", sortable: true },
  { title: "Role", key: "role", sortable: true },
  { title: "IP Address", key: "ip", sortable: false },
  { title: "วันที่", key: "date", sortable: true },
  { title: "Login Time", key: "loginTime", sortable: true },
  { title: "Status", key: "status", sortable: true },
];

const filteredLogs = computed(() => {
  return logs.filter(l => {
    if (filterStatus.value !== "ทั้งหมด" && l.status !== filterStatus.value) return false;
    return true;
  });
});
</script>

