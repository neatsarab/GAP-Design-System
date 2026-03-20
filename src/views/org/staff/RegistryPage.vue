<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ทะเบียนเกษตรอินทรีย์</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">รายการผู้ผ่านการรับรองมาตรฐานเกษตรอินทรีย์ทั้งหมด</p>
      </div>
      <v-btn variant="tonal" color="org-staff" prepend-icon="fas fa-download">ส่งออก Excel</v-btn>
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
            <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
            <v-text-field v-model="search" placeholder="ค้นหาเลขทะเบียน / ชื่อ / จังหวัด" prepend-inner-icon="fas fa-search" variant="outlined" density="compact" rounded="lg" clearable hide-details />
          </v-col>
          <v-col cols="12" sm="3">
            <div class="field-label mb-1"><div>ประเภท</div><div class="field-label-en">Type</div></div>
            <v-select v-model="filterType" :items="typeOptions" variant="outlined" density="compact" rounded="lg" clearable hide-details />
          </v-col>
          <v-col cols="auto" class="ml-auto d-flex align-self-end">
            <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left" @click="search = ''; filterType = null; filterTab = 'all'">ล้างตัวกรอง</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip tabs -->
    <v-chip-group v-model="filterTab" class="mb-4" mandatory>
      <v-chip value="all" color="org-staff" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge :content="items.length" inline color="org-staff" class="ml-1" />
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
        <template #item.regNo="{ item }">
          <span class="text-body-2 font-weight-bold text-org-staff">{{ item.regNo }}</span>
        </template>

        <template #item.type="{ item }">
          <v-chip size="x-small" color="org-staff" variant="tonal">{{ item.type }}</v-chip>
        </template>

        <template #item.certStatus="{ item }">
          <v-chip size="small" :color="statusColor(item.certStatus)" variant="tonal" :prepend-icon="statusIcon(item.certStatus)">
            {{ statusLabel(item.certStatus) }}
          </v-chip>
        </template>

        <template #item.expireDate="{ item }">
          <span :class="item.certStatus === 'expiring' ? 'text-warning font-weight-medium' : item.certStatus === 'expired' ? 'text-error' : ''">
            {{ item.expireDate }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const search = ref("");
const filterTab = ref("all");
const filterType = ref<string | null>(null);

const typeOptions = ["รายบุคคล", "กลุ่มเกษตรกร", "นิติบุคคล"];

interface Item {
  regNo: string;
  name: string;
  type: string;
  cropType: string;
  province: string;
  registeredDate: string;
  expireDate: string;
  certStatus: "active" | "expiring" | "expired";
}

const items: Item[] = [
  { regNo: "ORG-2568-00012", name: "นายสมศักดิ์ เกษตรดี", type: "รายบุคคล", cropType: "ข้าว", province: "สุรินทร์", registeredDate: "10 ม.ค. 68", expireDate: "10 ม.ค. 71", certStatus: "active" },
  { regNo: "ORG-2568-00008", name: "กลุ่มเกษตรอินทรีย์บ้านโนน", type: "กลุ่มเกษตรกร", cropType: "ผัก", province: "อุบลราชธานี", registeredDate: "5 ม.ค. 68", expireDate: "5 ม.ค. 71", certStatus: "active" },
  { regNo: "ORG-2568-00005", name: "บริษัท ออร์แกนิคไทย จำกัด", type: "นิติบุคคล", cropType: "ผลไม้", province: "เชียงราย", registeredDate: "20 ธ.ค. 67", expireDate: "20 ธ.ค. 68", certStatus: "expiring" },
  { regNo: "ORG-2567-00031", name: "นางสาวพิมพ์ใจ ธรรมชาติ", type: "รายบุคคล", cropType: "สมุนไพร", province: "เลย", registeredDate: "1 ม.ค. 67", expireDate: "1 ม.ค. 68", certStatus: "expired" },
  { regNo: "ORG-2568-00003", name: "วิสาหกิจชุมชนเกษตรอินทรีย์", type: "กลุ่มเกษตรกร", cropType: "ข้าว", province: "ยโสธร", registeredDate: "15 ม.ค. 68", expireDate: "15 ม.ค. 71", certStatus: "active" },
  { regNo: "ORG-2568-00001", name: "นายประสิทธิ์ พืชผล", type: "รายบุคคล", cropType: "ชา", province: "เชียงใหม่", registeredDate: "8 ม.ค. 68", expireDate: "8 ม.ค. 71", certStatus: "active" },
];

function countByStatus(status: string) {
  return items.filter((i) => i.certStatus === status).length;
}

const stats = [
  { label: "ทั้งหมด", icon: "fas fa-seedling", color: "org-staff", value: items.length },
  { label: "มีผล", icon: "fas fa-circle-check", color: "success", value: countByStatus("active") },
  { label: "ใกล้หมดอายุ", icon: "fas fa-clock", color: "warning", value: countByStatus("expiring") },
  { label: "หมดอายุแล้ว", icon: "fas fa-circle-xmark", color: "error", value: countByStatus("expired") },
];

const filteredItems = computed(() => {
  let result = items;
  if (filterTab.value !== "all") result = result.filter((i) => i.certStatus === filterTab.value);
  if (filterType.value) result = result.filter((i) => i.type === filterType.value);
  return result;
});

const headers = [
  { title: "เลขทะเบียน", key: "regNo", width: 160 },
  { title: "ชื่อ / นิติบุคคล", key: "name", width: 220 },
  { title: "ประเภท", key: "type", width: 130 },
  { title: "พืชที่รับรอง", key: "cropType", width: 120 },
  { title: "จังหวัด", key: "province", width: 120 },
  { title: "วันที่จดทะเบียน", key: "registeredDate", width: 140 },
  { title: "วันหมดอายุ", key: "expireDate", width: 120 },
  { title: "สถานะ", key: "certStatus", width: 150 },
];

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
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
