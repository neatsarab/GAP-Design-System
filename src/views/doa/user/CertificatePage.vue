<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ใบรับรอง DOA</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">รายการใบรับรองขึ้นทะเบียนโรงงานผลิตสินค้าพืชที่ได้รับการอนุมัติ</p>
      </div>
      <v-btn variant="tonal" color="doa-user" prepend-icon="fas fa-download">ส่งออก Excel</v-btn>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in stats" :key="s.label" cols="6" sm="3">
        <v-card rounded="xl" elevation="0">
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div class="stat-icon" :style="`background:rgba(var(--v-theme-${s.color}),0.12)`">
              <v-icon :icon="s.icon" :color="s.color" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">{{ s.value }}</div>
              <div class="text-caption text-medium-emphasis">{{ s.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5">
            <div class="field-label"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
            <v-text-field v-model="search" placeholder="ค้นหาชื่อโรงงาน" prepend-inner-icon="fas fa-search" variant="outlined" density="compact" rounded="lg" hide-details clearable />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label"><div>ประเภทคำขอ</div><div class="field-label-en">Request Type</div></div>
            <v-autocomplete v-model="filterType" :items="typeOptions" item-title="label" item-value="value" placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg" hide-details clearable />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label"><div>มาตรฐาน</div><div class="field-label-en">Standard</div></div>
            <v-autocomplete v-model="filterStandard" :items="standardOptions" placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg" hide-details clearable />
          </v-col>
          <v-col cols="auto" class="ml-auto d-flex align-self-end">
            <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left" @click="clearFilters">ล้างตัวกรอง</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip tabs -->
    <v-chip-group v-model="activeTab" class="mb-4" mandatory>
      <v-chip value="all" color="doa-user" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge :content="allItems.length" inline color="doa-user" class="ml-1" />
      </v-chip>
      <v-chip value="active" color="success" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
        <v-badge :content="countByStatus('active')" inline color="success" class="ml-1" />
      </v-chip>
      <v-chip value="expiring" color="warning" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
        <v-badge :content="countByStatus('expiring')" inline color="warning" class="ml-1" />
      </v-chip>
      <v-chip value="expired" color="error" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
        <v-badge :content="countByStatus('expired')" inline color="error" class="ml-1" />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="filteredItems" :search="search" hover>
        <template #item.factoryName="{ item }">
          <span class="text-body-2 font-weight-medium text-doa-user">{{ item.factoryName }}</span>
        </template>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal" :prepend-icon="statusIcon(item.status)">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.expireDate="{ item }">
          <span :class="item.status === 'expiring' ? 'text-warning font-weight-medium' : item.status === 'expired' ? 'text-error' : ''">{{ item.expireDate }}</span>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn size="small" variant="text" color="doa-user" icon="fas fa-eye" @click.stop="openDetail(item)" />
            <v-btn size="small" variant="text" color="success" icon="fas fa-download" :disabled="item.status === 'expired'" />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="560">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between text-body-1 font-weight-bold">
          <span><v-icon icon="fas fa-certificate" color="doa-user" class="mr-2" size="18" />รายละเอียดใบรับรอง</span>
          <v-chip v-if="selected" :color="statusColor(selected.status)" size="small" variant="tonal">{{ statusLabel(selected.status) }}</v-chip>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="selected" class="pa-5">
          <v-row dense>
            <v-col cols="6"><div class="info-label">ประเภทคำขอ</div><div class="info-value">{{ typeLabel(selected.type) }}</div></v-col>
            <v-col cols="12"><div class="info-label">ชื่อโรงงาน</div><div class="info-value">{{ selected.factoryName }}</div></v-col>
            <v-col cols="6"><div class="info-label">มาตรฐาน</div><div class="info-value">{{ selected.standard }}</div></v-col>
            <v-col cols="6"><div class="info-label">ประเภทใบรับรอง</div><div class="info-value">{{ selected.certType }}</div></v-col>
            <v-col cols="6"><div class="info-label">วันที่ออกใบรับรอง</div><div class="info-value">{{ selected.issueDate }}</div></v-col>
            <v-col cols="6"><div class="info-label">วันหมดอายุ</div><div class="info-value">{{ selected.expireDate }}</div></v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="detailDialog = false">ปิด</v-btn>
          <v-btn color="doa-user" variant="tonal" rounded="lg" prepend-icon="fas fa-download">ดาวน์โหลด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const search = ref("");
const filterType = ref<string | null>(null);
const filterStandard = ref<string | null>(null);
const activeTab = ref("all");
const detailDialog = ref(false);

interface CertItem {
  id: string;
  factoryName: string;
  type: string;
  standard: string;
  certType: string;
  issueDate: string;
  expireDate: string;
  status: "active" | "expiring" | "expired";
}

const typeOptions = [
  { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
  { label: "เปลี่ยนแปลงทะเบียน",     value: "amendment" },
  { label: "เพิ่ม / ลดขอบข่าย",      value: "scope" },
];
const standardOptions = ["มกษ. 9023-2550", "มกษ. 9024-2550", "ISO 22000", "GMP", "HACCP"];

const allItems: CertItem[] = [
  { id: "c1", factoryName: "โรงงานไทยเกษตรอินเตอร์",    type: "register",  standard: "มกษ. 9023-2550", certType: "DOA", issueDate: "01/01/2566", expireDate: "01/01/2569", status: "active"   },
  { id: "c2", factoryName: "โรงงานสยามฟาร์มโปรดักส์",   type: "register",  standard: "มกษ. 9024-2550", certType: "DOA", issueDate: "15/03/2565", expireDate: "15/03/2568", status: "expiring" },
  { id: "c3", factoryName: "โรงงานกรีนโปรเซส",          type: "scope",     standard: "ISO 22000",       certType: "GMP", issueDate: "10/01/2563", expireDate: "10/01/2566", status: "expired"  },
];

const stats = computed(() => [
  { label: "ทั้งหมด",      icon: "fas fa-industry",     color: "doa-user", value: allItems.length },
  { label: "มีผล",          icon: "fas fa-circle-check", color: "success",  value: countByStatus("active") },
  { label: "ใกล้หมดอายุ",  icon: "fas fa-clock",        color: "warning",  value: countByStatus("expiring") },
  { label: "หมดอายุ",       icon: "fas fa-circle-xmark", color: "error",    value: countByStatus("expired") },
]);

function countByStatus(s: string) {
  return allItems.filter((i) => i.status === s).length;
}

const filteredItems = computed(() => {
  let items = allItems;
  if (activeTab.value !== "all") items = items.filter((i) => i.status === activeTab.value);
  if (filterType.value) items = items.filter((i) => i.type === filterType.value);
  if (filterStandard.value) items = items.filter((i) => i.standard === filterStandard.value);
  return items;
});

function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterStandard.value = null;
  activeTab.value = "all";
}

const headers = [
  { title: "ชื่อโรงงาน",          key: "factoryName", sortable: true },
  { title: "มาตรฐาน",             key: "standard",    sortable: false },
  { title: "วันที่ออกใบรับรอง",    key: "issueDate",   sortable: true },
  { title: "วันหมดอายุ",           key: "expireDate",  sortable: true },
  { title: "สถานะ",                key: "status",      sortable: false },
  { title: "",                     key: "actions",     sortable: false, align: "end" as const },
];

const selected = ref<CertItem | null>(null);
function openDetail(item: CertItem) { selected.value = item; detailDialog.value = true; }

function typeLabel(t: string) {
  return { register: "ขึ้นทะเบียน / ต่ออายุ", amendment: "เปลี่ยนแปลงทะเบียน", scope: "เพิ่ม / ลดขอบข่าย" }[t] ?? t;
}
function statusColor(s: string) {
  return { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey";
}
function statusIcon(s: string) {
  return { active: "fas fa-circle-check", expiring: "fas fa-clock", expired: "fas fa-circle-xmark" }[s] ?? "fas fa-circle";
}
function statusLabel(s: string) {
  return { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s;
}
</script>

<style scoped>
.stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.info-label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
.info-value { font-size: 14px; font-weight: 500; }
</style>
