<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการทะเบียนประวัติ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ค้นหาและดูรายการทะเบียนประวัติสินค้าแปรรูปด้านพืชที่ขึ้นทะเบียนแล้ว
        </p>
      </div>
      <v-btn variant="tonal" color="hcex-staff" prepend-icon="fas fa-download">
        ส่งออก Excel
      </v-btn>
    </div>

    <!-- Stats -->
    <v-row class="mb-4">
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
              <div
                class="text-h5 font-weight-bold"
                :class="`text-${s.color}`"
              >
                {{ s.value }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ s.label }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
              placeholder="เลขทะเบียน / เลขคำขอ / ชื่อบริษัทผู้ผลิต / ชื่อผลิตภัณฑ์"
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
              <div>ประเภทการยื่น</div>
              <div class="field-label-en">Submission Type</div>
            </div>
            <v-autocomplete
              v-model="filters.submissionType"
              :items="submissionTypeOptions"
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
              <div>วันที่ขึ้นทะเบียน (จาก)</div>
              <div class="field-label-en">Register Date (From)</div>
            </div>
            <v-menu
              v-model="regFromMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="regFromBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่"
                  hide-details
                  variant="outlined"
                  rounded="lg"
                  style="cursor: pointer"
                  @click:clear.stop="regFromObj = null"
                />
              </template>
              <v-date-picker
                v-model="regFromObj"
                color="hcex-staff"
                show-adjacent-months
                :hide-header="!regFromObj"
                title="วันที่ขึ้นทะเบียน (จาก)"
                locale="th"
                @update:model-value="regFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>วันที่ขึ้นทะเบียน (ถึง)</div>
              <div class="field-label-en">Register Date (To)</div>
            </div>
            <v-menu
              v-model="regToMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="regToBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่"
                  hide-details
                  variant="outlined"
                  rounded="lg"
                  style="cursor: pointer"
                  @click:clear.stop="regToObj = null"
                />
              </template>
              <v-date-picker
                v-model="regToObj"
                color="hcex-staff"
                show-adjacent-months
                :hide-header="!regToObj"
                title="วันที่ขึ้นทะเบียน (ถึง)"
                locale="th"
                @update:model-value="regToMenu = false"
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
        <template #header.regNo="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">เลขทะเบียน</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Registry No.</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.requestNo="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">เลขคำขอ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Request No.</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.companyName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">บริษัทผู้ผลิต</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Manufacturer</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.productName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ชื่อผลิตภัณฑ์</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Product Name</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.submissionType="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ประเภทการยื่น</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Submission Type</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.registeredDate="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">วันที่ขึ้นทะเบียน</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Register Date</div>
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

        <template #item.regNo="{ item }">
          <span class="text-body-2 font-weight-medium text-hcex-staff">
            {{ item.regNo }}
          </span>
        </template>

        <template #item.submissionType="{ item }">
          <v-chip
            size="x-small"
            :color="item.submissionType === 'whole' ? 'primary' : 'info'"
            variant="tonal"
          >
            {{ item.submissionType === "whole" ? "ทั้งระบบการผลิต" : "แต่ละรุ่นการผลิต" }}
          </v-chip>
        </template>

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

        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1 justify-end">
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="hcex-staff"
                  @click.stop="openDetail(item)"
                >
                  <v-icon icon="fas fa-eye" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="ดาวน์โหลด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="success"
                  @click.stop
                >
                  <v-icon icon="fas fa-download" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useLocale } from "vuetify";
import { useRouter } from "vue-router";

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const router = useRouter();
const search = ref("");

const regFromMenu = ref(false);
const regFromObj = ref(null);
const regToMenu = ref(false);
const regToObj = ref(null);

function toThaiDate(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const regFromBE = computed(() => toThaiDate(regFromObj.value));
const regToBE = computed(() => toThaiDate(regToObj.value));

watch(regFromObj, (v) => {
  filters.dateFrom = v ? v.toISOString().slice(0, 10) : "";
});
watch(regToObj, (v) => {
  filters.dateTo = v ? v.toISOString().slice(0, 10) : "";
});

function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  registeredDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const filters = reactive({
  submissionType: null,
  status: null,
  dateFrom: "",
  dateTo: "",
});

const submissionTypeOptions = [
  { label: "ทั้งระบบการผลิต", value: "whole" },
  { label: "แต่ละรุ่นการผลิต", value: "lot" },
];

const statusOptions = [
  { label: "มีผล", value: "active" },
  { label: "หมดอายุ", value: "expired" },
  { label: "ถูกยกเลิก", value: "cancelled" },
];

const headers = [
  { title: "เลขทะเบียน", key: "regNo", sortable: true },
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "บริษัทผู้ผลิต", key: "companyName", sortable: true },
  { title: "ชื่อผลิตภัณฑ์", key: "productName", sortable: true },
  { title: "ประเภทการยื่น", key: "submissionType", sortable: true },
  { title: "วันที่ขึ้นทะเบียน", key: "registeredDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end", fixed: true },
];

const allItems = [
  {
    regNo: "HREG-2569-001",
    requestNo: "HIS-0003",
    companyName: "บริษัท เอเชีย แปรรูปพืช จำกัด",
    productName: "ผักกาดขาวอบแห้ง",
    submissionType: "whole",
    registeredDate: "28/02/2569",
    status: "active",
    remark: "",
  },
  {
    regNo: "HREG-2568-045",
    requestNo: "HIS-0045",
    companyName: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
    productName: "ข้าวโพดหวานกระป๋อง",
    submissionType: "lot",
    registeredDate: "10/11/2568",
    status: "active",
    remark: "",
  },
  {
    regNo: "HREG-2568-032",
    requestNo: "HIS-0032",
    companyName: "บริษัท กรีนโปร เอ็กซ์พอร์ต จำกัด",
    productName: "มะม่วงแช่แข็ง",
    submissionType: "whole",
    registeredDate: "15/09/2568",
    status: "active",
    remark: "",
  },
  {
    regNo: "HREG-2567-018",
    requestNo: "HIS-0018",
    companyName: "ห้างหุ้นส่วนจำกัด ไทยออร์แกนิค",
    productName: "สมุนไพรอบแห้ง (ขิง)",
    submissionType: "lot",
    registeredDate: "03/05/2567",
    status: "expired",
    remark: "หมดอายุตามระยะเวลา",
  },
  {
    regNo: "HREG-2567-009",
    requestNo: "HIS-0009",
    companyName: "บริษัท เฟรช เพลนท์ จำกัด",
    productName: "พริกป่นบรรจุถุง",
    submissionType: "whole",
    registeredDate: "20/02/2567",
    status: "cancelled",
    remark: "ผู้ประกอบการขอยกเลิก",
  },
  {
    regNo: "HREG-2568-027",
    requestNo: "HIS-0027",
    companyName: "บริษัท ซันไรส์ แอโกร จำกัด",
    productName: "น้ำมะนาวเข้มข้น",
    submissionType: "lot",
    registeredDate: "01/08/2568",
    status: "active",
    remark: "",
  },
];

const stats = computed(() => [
  {
    label: "ทั้งหมด",
    icon: "fas fa-clock-rotate-left",
    color: "hcex-staff",
    value: allItems.length,
  },
  {
    label: "มีผล",
    icon: "fas fa-circle-check",
    color: "success",
    value: allItems.filter((i) => i.status === "active").length,
  },
  {
    label: "หมดอายุ",
    icon: "fas fa-clock",
    color: "warning",
    value: allItems.filter((i) => i.status === "expired").length,
  },
  {
    label: "ถูกยกเลิก",
    icon: "fas fa-circle-xmark",
    color: "error",
    value: allItems.filter((i) => i.status === "cancelled").length,
  },
]);

const filteredItems = computed(() => {
  let items = allItems;
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.regNo.toLowerCase().includes(q) ||
        i.requestNo.toLowerCase().includes(q) ||
        i.companyName.toLowerCase().includes(q) ||
        i.productName.toLowerCase().includes(q),
    );
  }
  if (filters.submissionType)
    items = items.filter((i) => i.submissionType === filters.submissionType);
  if (filters.status)
    items = items.filter((i) => i.status === filters.status);
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    items = items.filter((i) => beDateToTs(i.registeredDate) >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    items = items.filter((i) => beDateToTs(i.registeredDate) <= to);
  }
  return items;
});

function clearFilters() {
  search.value = "";
  filters.submissionType = null;
  filters.status = null;
  filters.dateFrom = "";
  filters.dateTo = "";
  regFromObj.value = null;
  regToObj.value = null;
}

function openDetail(item) {
  router.push({ name: "HCEXstaffHistoryRegistryDetail", params: { id: item.regNo } });
}

function statusColor(s) {
  return (
    { active: "success", expired: "warning", cancelled: "error" }[s] ?? "grey"
  );
}
function statusIcon(s) {
  return (
    {
      active: "fas fa-circle-check",
      expired: "fas fa-clock",
      cancelled: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}
function statusLabel(s) {
  return (
    { active: "มีผล", expired: "หมดอายุ", cancelled: "ถูกยกเลิก" }[s] ?? s
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
.filter-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.data-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.detail-row:last-child {
  border-bottom: none;
}
.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
  min-width: 140px;
  flex-shrink: 0;
}
</style>
