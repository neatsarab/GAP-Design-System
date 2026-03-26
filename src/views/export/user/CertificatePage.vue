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
    <div class="mb-4">
      <v-row>
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
    </div>

    <!-- Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="6">
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
          <v-col cols="12" sm="6" md="3">
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
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>สถานะ</div>
              <div class="field-label-en">Status</div>
            </div>
            <v-autocomplete
              v-model="filterStatus"
              :items="statusOptions"
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
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>วันหมดอายุ (จาก)</div>
              <div class="field-label-en">Expire Date (From)</div>
            </div>
            <v-menu
              v-model="expireFromMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="expireFromBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่ / เดือน / ปี"
                  hide-details
                  style="cursor: pointer"
                  @click:clear.stop="expireFromObj = null"
                />
              </template>
              <v-date-picker
                v-model="expireFromObj"
                color="export-user"
                show-adjacent-months
                :hide-header="!expireFromObj"
                title="วันหมดอายุ (จาก)"
                locale="th"
                @update:model-value="expireFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>วันหมดอายุ (ถึง)</div>
              <div class="field-label-en">Expire Date (To)</div>
            </div>
            <v-menu
              v-model="expireToMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="expireToBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่ / เดือน / ปี"
                  hide-details
                  style="cursor: pointer"
                  @click:clear.stop="expireToObj = null"
                />
              </template>
              <v-date-picker
                v-model="expireToObj"
                color="export-user"
                show-adjacent-months
                :hide-header="!expireToObj"
                title="วันหมดอายุ (ถึง)"
                locale="th"
                @update:model-value="expireToMenu = false"
              />
            </v-menu>
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
// @ts-nocheck
import { ref, computed, watch } from "vue";
import { useLocale } from "vuetify";

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const search = ref("");
const filterType = ref(null);
const filterStatus = ref(null);

const expireFromMenu = ref(false);
const expireFromObj = ref(null);
const expireToMenu = ref(false);
const expireToObj = ref(null);

function dateToBE(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const expireFromBE = computed(() => dateToBE(expireFromObj.value));
const expireToBE = computed(() => dateToBE(expireToObj.value));

// แปลง DD/MM/YYYY (พ.ศ.) → timestamp
function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

watch(expireFromObj, (v) => {
  filterExpireFrom.value = v ? v.toISOString().slice(0, 10) : "";
});
watch(expireToObj, (v) => {
  filterExpireTo.value = v ? v.toISOString().slice(0, 10) : "";
});

const filterExpireFrom = ref("");
const filterExpireTo = ref("");

const statusOptions = [
  { label: "มีผล", value: "active" },
  { label: "ใกล้หมดอายุ", value: "expiring" },
  { label: "หมดอายุ", value: "expired" },
];

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
    icon: "fas fa-certificate",
    color: "export-user",
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
  if (filterType.value)
    items = items.filter((i) => i.type === filterType.value);
  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);
  if (filterExpireFrom.value) {
    const from = new Date(filterExpireFrom.value).getTime();
    items = items.filter((i) => beDateToTs(i.expireDate) >= from);
  }
  if (filterExpireTo.value) {
    const to = new Date(filterExpireTo.value).getTime();
    items = items.filter((i) => beDateToTs(i.expireDate) <= to);
  }
  return items;
});

function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterStatus.value = null;
  expireFromObj.value = null;
  expireToObj.value = null;
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
