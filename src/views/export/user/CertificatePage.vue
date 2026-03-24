<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการใบรับรองการจดทะเบียนผู้ส่งออกที่ได้รับการอนุมัติ
        </p>
      </div>
      <v-btn variant="tonal" color="export-user" prepend-icon="fas fa-download"
        >ส่งออก Excel</v-btn
      >
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in stats" :key="s.label" cols="6" sm="3">
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
          <v-col cols="12" sm="5">
            <div class="field-label">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขคำขอ / ผู้ยื่นคำขอ"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label">
              <div>ประเภทคำขอ</div>
              <div class="field-label-en">Request Type</div>
            </div>
            <v-autocomplete
              v-model="filterType"
              :items="typeOptions"
              item-title="label"
              item-value="value"
              placeholder="ทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="auto" class="ml-auto">
            <v-btn
              variant="tonal"
              color="grey"
              size="small"
              prepend-icon="fas fa-rotate-left"
              @click="clearFilters"
              >ล้างตัวกรอง</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip tabs -->
    <v-chip-group v-model="activeTab" class="mb-4" mandatory>
      <v-chip
        value="all"
        color="export-user"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge
          :content="allItems.length"
          inline
          color="export-user"
          class="ml-1"
        />
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
        :items="filteredItems"
        :search="search"
        hover
      >
        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-medium text-export-user">{{
            item.requestNo
          }}</span>
        </template>
        <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            size="small"
            variant="tonal"
            :prepend-icon="statusIcon(item.status)"
          >
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.expireDate="{ item }">
          <span
            :class="
              item.status === 'expiring'
                ? 'text-warning font-weight-medium'
                : item.status === 'expired'
                  ? 'text-error'
                  : ''
            "
            >{{ item.expireDate }}</span
          >
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn
              size="small"
              variant="text"
              color="export-user"
              icon="fas fa-eye"
            />
            <v-btn
              size="small"
              variant="text"
              color="success"
              icon="fas fa-download"
              :disabled="item.status === 'expired'"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const filterType = ref(null);
const activeTab = ref("all");

const typeOptions = [
  { label: "ก.ก.1", value: "kk1" },
  { label: "สมพ.5", value: "smpv5" },
  { label: "สมพ.5 (กรณีอื่น)", value: "smpv5_other" },
  { label: "ขอแก้ไขใบรับรอง", value: "amendment" },
];

const allItems = [
  {
    id: "EXP-2569-005",
    requestNo: "EXP-0005",
    type: "amendment",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    issueDate: "15/03/2569",
    expireDate: "14/03/2571",
    status: "active",
  },
  {
    id: "EXP-2569-010",
    requestNo: "EXP-0010",
    type: "smpv5",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    issueDate: "01/06/2569",
    expireDate: "01/03/2569",
    status: "expiring",
  },
  {
    id: "EXP-2569-003",
    requestNo: "EXP-0003",
    type: "kk1",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    issueDate: "20/02/2566",
    expireDate: "19/02/2566",
    status: "expired",
  },
];

const stats = computed(() => [
  {
    label: "ทั้งหมด",
    icon: "fas fa-file-certificate",
    color: "primary",
    value: allItems.length,
  },
  {
    label: "มีผล",
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
    label: "หมดอายุ",
    icon: "fas fa-circle-xmark",
    color: "error",
    value: countByStatus("expired"),
  },
]);

function countByStatus(s) {
  return allItems.filter((i) => i.status === s).length;
}

const filteredItems = computed(() => {
  let items = allItems;
  if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);
  if (filterType.value)
    items = items.filter((i) => i.type === filterType.value);
  return items;
});

function clearFilters() {
  search.value = "";
  filterType.value = null;
  activeTab.value = "all";
}

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "ผู้ยื่นคำขอ", key: "applicant", sortable: true },
  { title: "วันที่ออก", key: "issueDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" },
];

function typeLabel(t) {
  return (
    {
      kk1: "ก.ก.1",
      smpv5: "สมพ.5",
      smpv5_other: "สมพ.5 (กรณีอื่น)",
      amendment: "ขอแก้ไขใบรับรอง",
    }[t] ?? t
  );
}
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
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
