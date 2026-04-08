<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">ผล LAB</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการคำขอพิจารณาผลตรวจทางห้องปฏิบัติการของสถานประกอบการ
        </p>
      </div>
      <v-btn
        color="hcex-user"
        prepend-icon="fas fa-plus"
        @click="goToNewLab"
      >
        ยื่นคำขอผล Lab ใหม่
      </v-btn>
    </div>

    <!-- Filters -->
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
              placeholder="เลขคำขอ / รหัสผลิตภัณฑ์ / บริษัทผู้ผลิต"
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
              <div>วัตถุประสงค์</div>
              <div class="field-label-en">Objective</div>
            </div>
            <v-autocomplete
              v-model="filters.objective"
              :items="objectiveOptions"
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
              v-model="filters.status"
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
              <div>วันที่ยื่น (จาก)</div>
              <div class="field-label-en">Submit Date (From)</div>
            </div>
            <v-menu
              v-model="dateFromMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  :model-value="dateFromBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่"
                  hide-details
                  style="cursor: pointer"
                  @click:clear.stop="dateFromObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateFromObj"
                color="hcex-user"
                show-adjacent-months
                :hide-header="!dateFromObj"
                title="วันที่ยื่น (จาก)"
                locale="th"
                @update:model-value="dateFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>วันที่ยื่น (ถึง)</div>
              <div class="field-label-en">Submit Date (To)</div>
            </div>
            <v-menu
              v-model="dateToMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  :model-value="dateToBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่"
                  hide-details
                  style="cursor: pointer"
                  @click:clear.stop="dateToObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateToObj"
                color="hcex-user"
                show-adjacent-months
                :hide-header="!dateToObj"
                title="วันที่ยื่น (ถึง)"
                locale="th"
                @update:model-value="dateToMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="auto" class="ml-auto d-flex align-end" style="padding-bottom: 4px">
            <v-btn
              variant="tonal"
              color="grey"
              size="small"
              prepend-icon="fas fa-rotate-left"
              @click="clearFilters"
            >
              ล้างตัวกรอง
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :custom-key-sort="customKeySort"
        rounded="xl"
        hover
      >
        <template #header.requestNo="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">เลขคำขอ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Request No.</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.productName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ผลิตภัณฑ์</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Product</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.objective="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">วัตถุประสงค์</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Objective</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.dateCollected="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">วันที่เก็บตัวอย่าง</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Collection Date</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.submittedDate="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">วันที่ยื่น</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Submit Date</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.status="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">สถานะ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Status</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>

        <template #item.objective="{ item }">
          <v-chip size="x-small" :color="objectiveColor(item.objective)" variant="tonal">
            {{ objectiveLabel(item.objective) }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">
            <v-icon :icon="statusIcon(item.status)" size="11" class="mr-1" />
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              v-if="item.status === 'need_edit'"
              size="small"
              color="warning"
              variant="tonal"
              rounded="lg"
              prepend-icon="fas fa-pen"
              @click.stop="goToDetail(item.requestNo)"
            >
              แก้ไข
            </v-btn>
            <v-btn
              v-else
              icon
              size="small"
              color="hcex-user"
              variant="text"
              @click.stop="goToDetail(item.requestNo)"
            >
              <v-icon icon="fas fa-eye" size="15" />
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center pa-8 text-medium-emphasis">
            <v-icon icon="fas fa-flask" size="40" class="mb-3" style="opacity: 0.25" />
            <div class="text-body-2">ไม่มีรายการคำขอผล Lab</div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const router = useRouter();
const search = ref("");

const dateFromMenu = ref(false);
const dateFromObj = ref(null);
const dateToMenu = ref(false);
const dateToObj = ref(null);

function toThaiDate(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const dateFromBE = computed(() => toThaiDate(dateFromObj.value));
const dateToBE = computed(() => toThaiDate(dateToObj.value));

watch(dateFromObj, (v) => { filters.dateFrom = v ? v.toISOString().slice(0, 10) : ""; });
watch(dateToObj, (v) => { filters.dateTo = v ? v.toISOString().slice(0, 10) : ""; });

function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  submittedDate: (a, b) => beDateToTs(a) - beDateToTs(b),
  dateCollected: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  objective: null,
  status: null,
});

function clearFilters() {
  search.value = "";
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.objective = null;
  filters.status = null;
  dateFromObj.value = null;
  dateToObj.value = null;
}

const objectiveOptions = [
  { label: "ขอใบรับรองสุขอนามัย (Issuance of HC)", value: "hc" },
  { label: "แนบทะเบียนประวัติ (Lot by Lot)", value: "lot" },
  { label: "ทั้งระบบการผลิต (Whole Product System)", value: "whole" },
];

const statusOptions = [
  { label: "รอตรวจสอบ", value: "pending" },
  { label: "อยู่ระหว่างตรวจสอบ", value: "reviewing" },
  { label: "รอแก้ไข", value: "need_edit" },
  { label: "ผ่านการพิจารณา", value: "approved" },
  { label: "ไม่ผ่านการพิจารณา", value: "rejected" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ผลิตภัณฑ์", key: "productName", sortable: true },
  { title: "วัตถุประสงค์", key: "objective", sortable: true },
  { title: "วันที่เก็บตัวอย่าง", key: "dateCollected", sortable: true },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  {
    requestNo: "LAB-2568-0001",
    productName: "มะม่วงอบแห้ง (Dried Mango)",
    objective: "hc",
    dateCollected: "01/03/2568",
    submittedDate: "03/03/2568",
    status: "approved",
  },
  {
    requestNo: "LAB-2568-0002",
    productName: "สับปะรดกระป๋อง (Canned Pineapple)",
    objective: "whole",
    dateCollected: "10/03/2568",
    submittedDate: "12/03/2568",
    status: "reviewing",
  },
  {
    requestNo: "LAB-2568-0003",
    productName: "มะม่วงแช่แข็ง (Frozen Mango)",
    objective: "hc",
    dateCollected: "20/03/2568",
    submittedDate: "22/03/2568",
    status: "need_edit",
  },
  {
    requestNo: "LAB-2568-0004",
    productName: "กล้วยตากแห้ง (Dried Banana)",
    objective: "lot",
    dateCollected: "01/04/2568",
    submittedDate: "03/04/2568",
    status: "pending",
  },
];

const filteredItems = computed(() => {
  return allItems.filter((item) => {
    if (
      search.value &&
      !item.requestNo.toLowerCase().includes(search.value.toLowerCase()) &&
      !item.productName.toLowerCase().includes(search.value.toLowerCase())
    )
      return false;
    if (filters.objective && item.objective !== filters.objective) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.dateFrom) {
      const ts = beDateToTs(item.submittedDate);
      if (ts < new Date(filters.dateFrom).getTime()) return false;
    }
    if (filters.dateTo) {
      const ts = beDateToTs(item.submittedDate);
      if (ts > new Date(filters.dateTo).getTime() + 86400000) return false;
    }
    return true;
  });
});

function objectiveLabel(v) {
  return { hc: "Issuance of HC", lot: "Lot by Lot", whole: "Whole System" }[v] ?? v;
}
function objectiveColor(v) {
  return { hc: "primary", lot: "info", whole: "success" }[v] ?? "grey";
}
function statusLabel(v) {
  return {
    pending: "รอตรวจสอบ",
    reviewing: "กำลังตรวจสอบ",
    need_edit: "รอแก้ไข",
    approved: "ผ่านการพิจารณา",
    rejected: "ไม่ผ่านการพิจารณา",
  }[v] ?? v;
}
function statusColor(v) {
  return { pending: "info", reviewing: "info", need_edit: "warning", approved: "success", rejected: "error" }[v] ?? "grey";
}
function statusIcon(v) {
  return {
    pending: "fas fa-clock",
    reviewing: "fas fa-magnifying-glass",
    need_edit: "fas fa-triangle-exclamation",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
  }[v] ?? "fas fa-circle";
}

function goToNewLab() {
  router.push({ name: "HCEXUserNewApplication", params: { type: "lab" } });
}

function goToDetail(id) {
  router.push({ name: "HCEXUserApplicationDetail", params: { id } });
}
</script>

<style scoped>
.filter-card {
  border: 1px solid rgba(var(--v-theme-hcex-user), 0.12);
}
.data-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
.field-label-en {
  font-size: 11px;
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.45);
}
</style>
