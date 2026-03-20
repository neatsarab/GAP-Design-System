<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ใบรับรองเกษตรอินทรีย์ของฉัน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการใบรับรองมาตรฐานเกษตรอินทรีย์ทั้งหมด
        </p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="org-user" prepend-icon="fas fa-download"
          >ส่งออก Excel</v-btn
        >
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in certStats" :key="s.label" cols="6" sm="3">
        <v-card rounded="xl" elevation="0">
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

    <!-- Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6">
            <div class="field-label mb-1">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขใบรับรอง / มาตรฐาน / พืช"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="auto" class="ml-auto d-flex align-self-end">
            <v-btn
              variant="tonal"
              color="grey"
              size="small"
              prepend-icon="fas fa-rotate-left"
              @click="
                search = '';
                filterTab = 'all';
              "
              >ล้างตัวกรอง</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip tabs -->
    <v-chip-group v-model="filterTab" class="mb-4" mandatory>
      <v-chip value="all" color="org-user" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge :content="certs.length" inline color="org-user" class="ml-1" />
      </v-chip>
      <v-chip
        value="active"
        color="success"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
        <v-badge
          :content="countByStatus('active')"
          inline
          color="success"
          class="ml-1"
        />
      </v-chip>
      <v-chip
        value="expiring"
        color="warning"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
        <v-badge
          :content="countByStatus('expiring')"
          inline
          color="warning"
          class="ml-1"
        />
      </v-chip>
      <v-chip value="expired" color="error" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
        <v-badge
          :content="countByStatus('expired')"
          inline
          color="error"
          class="ml-1"
        />
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
          <span class="text-body-2 font-weight-bold text-org-user">{{
            item.certNo
          }}</span>
        </template>

        <template #item.standard="{ item }">
          <v-chip size="x-small" color="org-user" variant="tonal">{{
            item.standard
          }}</v-chip>
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
            <v-btn
              size="small"
              variant="text"
              color="org-user"
              icon="fas fa-eye"
            />
            <v-btn
              size="small"
              variant="text"
              color="success"
              icon="fas fa-download"
              :disabled="item.certStatus === 'expired'"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const filterTab = ref("all");
const search = ref("");

interface Cert {
  certNo: string;
  requestNo: string;
  standard: string;
  cropType: string;
  area: string;
  issuedAt: string;
  expiry: string;
  certStatus: "active" | "expiring" | "expired";
}

const certs: Cert[] = [
  {
    certNo: "THORG-2568-00018",
    requestNo: "ORG-2568-00018",
    standard: "มกษ.9000",
    cropType: "ข้าว",
    area: "15 ไร่",
    issuedAt: "10 ม.ค. 68",
    expiry: "10 ม.ค. 71",
    certStatus: "active",
  },
  {
    certNo: "THORG-2568-00011",
    requestNo: "ORG-2568-00011",
    standard: "มกษ.9000",
    cropType: "ผัก",
    area: "8 ไร่",
    issuedAt: "5 ม.ค. 68",
    expiry: "5 ม.ค. 71",
    certStatus: "active",
  },
  {
    certNo: "THORG-2568-00006",
    requestNo: "ORG-2568-00006",
    standard: "มกษ.9001",
    cropType: "สมุนไพร",
    area: "5 ไร่",
    issuedAt: "20 ธ.ค. 67",
    expiry: "20 ธ.ค. 68",
    certStatus: "expiring",
  },
  {
    certNo: "THORG-2567-00044",
    requestNo: "ORG-2567-00044",
    standard: "มกษ.9000",
    cropType: "ผลไม้",
    area: "20 ไร่",
    issuedAt: "1 ม.ค. 67",
    expiry: "1 ม.ค. 68",
    certStatus: "expired",
  },
];

function countByStatus(status: string) {
  return certs.filter((c) => c.certStatus === status).length;
}

const certStats = [
  {
    label: "ทั้งหมด",
    icon: "fas fa-seedling",
    color: "org-user",
    value: certs.length,
  },
  {
    label: "ใบรับรองมีผล",
    icon: "fas fa-circle-check",
    color: "success",
    value: countByStatus("active"),
  },
  {
    label: "ใกล้หมดอายุ",
    icon: "fas fa-clock",
    color: "warning",
    value: countByStatus("expiring"),
  },
  {
    label: "หมดอายุแล้ว",
    icon: "fas fa-circle-xmark",
    color: "error",
    value: countByStatus("expired"),
  },
];

const filteredCerts = computed(() => {
  if (filterTab.value === "all") return certs;
  return certs.filter((c) => c.certStatus === filterTab.value);
});

const headers = [
  { title: "เลขใบรับรอง", key: "certNo", width: 180 },
  { title: "มาตรฐาน", key: "standard", width: 120 },
  { title: "ชนิดพืช", key: "cropType", width: 120 },
  { title: "พื้นที่", key: "area", width: 100 },
  { title: "วันที่ออก", key: "issuedAt", width: 120 },
  { title: "วันหมดอายุ", key: "expiry", width: 120 },
  { title: "สถานะ", key: "certStatus", width: 150 },
  { title: "", key: "actions", width: 150, sortable: false },
];

function statusColor(s: string) {
  return (
    { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey"
  );
}
function statusIcon(s: string) {
  return (
    {
      active: "fas fa-circle-check",
      expiring: "fas fa-clock",
      expired: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}
function statusLabel(s: string) {
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
