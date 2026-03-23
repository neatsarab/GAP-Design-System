<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ทะเบียนใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ข้อมูลใบรับรองสุขอนามัยพืชที่ออกแล้วทั้งหมด</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="hc-user" prepend-icon="fas fa-download">ส่งออก Excel</v-btn>
        <v-btn color="hc-user" prepend-icon="fas fa-file-pen" @click="router.push('/hc/user/applications/new')">ขอใบรับรองใหม่</v-btn>
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in certStats" :key="s.label" cols="6" sm="3">
        <v-card>
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div
              class="stat-icon"
              :style="`background:rgba(var(--v-theme-${s.color}),0.12)`"
            >
              <v-icon :icon="s.icon" :color="s.color" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">
                {{ s.value }}
              </div>
              <div class="text-caption text-medium-emphasis">{{ s.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter & Search -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6">
            <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
            <v-text-field v-model="search" prepend-inner-icon="fas fa-search" variant="outlined" density="compact" rounded="lg" clearable hide-details />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="auto" class="ml-auto">
          <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left" @click="search = ''; filterTab = 'all'">ล้างตัวกรอง</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip tabs -->
    <v-chip-group v-model="filterTab" class="mb-4" mandatory>
      <v-chip value="all" color="hc-user" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge :content="certs.length" inline color="hc-user" class="ml-1" />
      </v-chip>
      <v-chip value="active" color="success" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
        <v-badge :content="certs.filter(c => c.certStatus === 'active').length" inline color="success" class="ml-1" />
      </v-chip>
      <v-chip value="expiring" color="warning" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
        <v-badge :content="certs.filter(c => c.certStatus === 'expiring').length" inline color="warning" class="ml-1" />
      </v-chip>
      <v-chip value="expired" color="error" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
        <v-badge :content="certs.filter(c => c.certStatus === 'expired').length" inline color="error" class="ml-1" />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredCerts"
        :search="search"
        hover
      >
        <template #item.certNo="{ item }">
          <span class="text-body-2 font-weight-bold text-hc-user">{{
            item.certNo
          }}</span>
        </template>

        <template #item.certStatus="{ item }">
          <v-chip
            size="small"
            :color="statusColor(item.certStatus)"
            variant="tonal"
            :prepend-icon="statusIcon(item.certStatus)"
          >
            {{ statusLabel(item.certStatus) }}
          </v-chip>
        </template>

        <template #item.expiry="{ item }">
          <span
            :class="
              item.certStatus === 'expiring'
                ? 'text-warning font-weight-medium'
                : item.certStatus === 'expired'
                  ? 'text-error'
                  : ''
            "
          >
            {{ item.expiry }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn size="small" variant="text" color="hc-user" icon="fas fa-eye" />
            <v-btn size="small" variant="text" color="success" icon="fas fa-download" :disabled="item.certStatus === 'expired'" />
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const filterTab = ref("all");
const search = ref("");

const certStats = [
  {
    label: "ใบรับรองมีผล",
    icon: "fas fa-circle-check",
    color: "success",
    value: 4,
  },
  { label: "ใกล้หมดอายุ", icon: "fas fa-clock", color: "warning", value: 1 },
  {
    label: "หมดอายุแล้ว",
    icon: "fas fa-circle-xmark",
    color: "error",
    value: 2,
  },
  { label: "ทั้งหมด", icon: "fas fa-certificate", color: "primary", value: 7 },
];


const certs = [
  {
    certNo: "THHC-2568-00025",
    requestNo: "HC-2568-00025",
    product: "มังคุด",
    destination: "จีน",
    issuedAt: "10 ม.ค. 68",
    expiry: "10 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2568-00022",
    requestNo: "HC-2568-00022",
    product: "กล้วยหอม",
    destination: "ญี่ปุ่น",
    issuedAt: "8 ม.ค. 68",
    expiry: "8 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2568-00018",
    requestNo: "HC-2568-00018",
    product: "มะม่วง",
    destination: "ญี่ปุ่น",
    issuedAt: "20 ธ.ค. 67",
    expiry: "20 ธ.ค. 68",
    certStatus: "expiring",
  },
  {
    certNo: "THHC-2567-00098",
    requestNo: "HC-2567-00098",
    product: "ลำไย",
    destination: "จีน",
    issuedAt: "5 ม.ค. 67",
    expiry: "5 ม.ค. 68",
    certStatus: "expired",
  },
  {
    certNo: "THHC-2568-00030",
    requestNo: "HC-2568-00030",
    product: "ทุเรียน",
    destination: "เกาหลีใต้",
    issuedAt: "15 ม.ค. 68",
    expiry: "15 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2568-00015",
    requestNo: "HC-2568-00015",
    product: "ส้มโอ",
    destination: "สิงคโปร์",
    issuedAt: "10 ธ.ค. 67",
    expiry: "10 ธ.ค. 68",
    certStatus: "active",
  },
  {
    certNo: "THHC-2567-00080",
    requestNo: "HC-2567-00080",
    product: "กระเทียม",
    destination: "เกาหลีใต้",
    issuedAt: "1 มิ.ย. 67",
    expiry: "1 มิ.ย. 68",
    certStatus: "expired",
  },
];

const filteredCerts = computed(() => {
  if (filterTab.value === "all") return certs;
  return certs.filter((c) => c.certStatus === filterTab.value);
});

const headers = [
  { title: "เลขใบรับรอง", key: "certNo", width: 180 },
  { title: "เลขคำขอ", key: "requestNo", width: 160 },
  { title: "สินค้า", key: "product", width: 120 },
  { title: "ปลายทาง", key: "destination", width: 120 },
  { title: "วันที่ออก", key: "issuedAt", width: 120 },
  { title: "วันหมดอายุ", key: "expiry", width: 120 },
  { title: "สถานะ", key: "certStatus", width: 150 },
  { title: "", key: "actions", width: 150, sortable: false },
];

function statusColor(s) {
  return (
    { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey"
  );
}
function statusIcon(s) {
  return (
    {
      active: "fas fa-circle-check",
      expiring: "fas fa-clock",
      expired: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}
function statusLabel(s) {
  return (
    { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s
  );
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
