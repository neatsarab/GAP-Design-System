<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">รายการคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ระบบการออกหนังสือรับรองสุขอนามัยพืชสำหรับพืชควบคุมเฉพาะ
        </p>
      </div>
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
              placeholder="เลขคำขอ / เลขทะเบียนผู้ส่งออก / ชนิดสินค้า"
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
              v-model="filters.type"
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
              <div>สถานะคำขอ</div>
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
                  :model-value="dateFromBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่ / เดือน / ปี"
                  hide-details
                  style="cursor: pointer"
                  variant="outlined"
                  rounded="lg"
                  @click:clear.stop="dateFromObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateFromObj"
                color="hc-staff"
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
                  :model-value="dateToBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่ / เดือน / ปี"
                  hide-details
                  style="cursor: pointer"
                  variant="outlined"
                  rounded="lg"
                  @click:clear.stop="dateToObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateToObj"
                color="hc-staff"
                show-adjacent-months
                :hide-header="!dateToObj"
                title="วันที่ยื่น (ถึง)"
                locale="th"
                @update:model-value="dateToMenu = false"
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
        <template #header.exporterNo="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">เลขทะเบียนผู้ส่งออก</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Exporter No.</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.product="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ชนิดสินค้า</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Product</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.destination="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ประเทศปลายทาง</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Destination</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.type="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ประเภทคำขอ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Request Type</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.submittedAt="{ column, isSorted, getSortIcon }">
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
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">สถานะคำขอ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Status</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>

        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'correction' ? 'secondary' : 'hc-staff'"
            variant="tonal"
          >
            {{ typeLabel(item.type) }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-tooltip text="ดูคำขอ" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="hc-staff"
                  @click.stop="goToApplicationDetail(item.id)"
                >
                  <v-icon icon="fas fa-eye" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-btn
              v-if="item.status === 'submitted'"
              size="small"
              variant="tonal"
              color="warning"
              rounded="lg"
              prepend-icon="fas fa-magnifying-glass"
              @click.stop="goToApplicationDetail(item.id)"
            >
              ตรวจคำขอ
            </v-btn>
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

function dateToBEStr(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const dateFromBE = computed(() => dateToBEStr(dateFromObj.value));
const dateToBE = computed(() => dateToBEStr(dateToObj.value));

watch(dateFromObj, (v) => {
  filters.dateFrom = v ? v.toISOString().slice(0, 10) : "";
});
watch(dateToObj, (v) => {
  filters.dateTo = v ? v.toISOString().slice(0, 10) : "";
});

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null,
  status: null,
});

function goToApplicationDetail(id) {
  router.push({ name: "HCstaffApplicationDetail", params: { id } });
}

function clearFilters() {
  search.value = "";
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.type = null;
  filters.status = null;
  dateFromObj.value = null;
  dateToObj.value = null;
}

const typeOptions = [
  { label: "ขอใบรับรอง", value: "new" },
  { label: "แก้ไขใบรับรอง", value: "correction" },
];

const statusOptions = [
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "อยู่ระหว่างตรวจสอบ", value: "under_review" },
  { label: "ตรวจ Lab", value: "testing" },
  { label: "รอพิจารณา", value: "pending_approval" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ต้องแก้ไข", value: "correction_required" },
  { label: "รับใบรับรองแล้ว", value: "completed" },
  { label: "ไม่อนุมัติ", value: "rejected" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "เลขทะเบียนผู้ส่งออก", key: "exporterNo", sortable: true },
  { title: "ชนิดสินค้า", key: "product", sortable: true },
  { title: "ประเทศปลายทาง", key: "destination", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "วันที่ยื่น", key: "submittedAt", sortable: false },
  { title: "สถานะคำขอ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  {
    id: "HC-001",
    requestNo: "HC-00041",
    exporterNo: "EXP-6701-00123",
    product: "ทุเรียน",
    destination: "จีน",
    certType: "All",
    type: "new",
    submittedAt: "15 ม.ค. 68",
    submittedDate: "2025-01-15",
    status: "under_review",
  },
  {
    id: "HC-003",
    requestNo: "HC-00036",
    exporterNo: "EXP-6701-00123",
    product: "ลำไย",
    destination: "เวียดนาม",
    certType: "All",
    type: "correction",
    submittedAt: "10 ม.ค. 68",
    submittedDate: "2025-01-10",
    status: "approved",
  },
  {
    id: "HC-004",
    requestNo: "HC-00034",
    exporterNo: "EXP-6701-00456",
    product: "กระเทียม",
    destination: "เกาหลีใต้",
    certType: "All",
    type: "new",
    submittedAt: "8 ม.ค. 68",
    submittedDate: "2025-01-08",
    status: "testing",
  },
  {
    id: "HC-008",
    requestNo: "HC-00025",
    exporterNo: "EXP-6701-00456",
    product: "มังคุด",
    destination: "จีน",
    certType: "Some",
    type: "new",
    submittedAt: "2 ม.ค. 68",
    submittedDate: "2025-01-02",
    status: "completed",
  },
  {
    id: "HC-010",
    requestNo: "HC-00042",
    exporterNo: "EXP-6701-00789",
    product: "ลิ้นจี่",
    destination: "เกาหลีใต้",
    certType: "All",
    type: "new",
    submittedAt: "16 ม.ค. 68",
    submittedDate: "2025-01-16",
    status: "submitted",
  },
  {
    id: "HC-009",
    requestNo: "HC-00022",
    exporterNo: "EXP-6701-00789",
    product: "กล้วยหอม",
    destination: "ญี่ปุ่น",
    certType: "Some",
    type: "new",
    submittedAt: "1 ม.ค. 68",
    submittedDate: "2025-01-01",
    status: "completed",
  },
  {
    id: "HC-011",
    requestNo: "HC-00020",
    exporterNo: "EXP-6701-00321",
    product: "ส้มโอ",
    destination: "สิงคโปร์",
    certType: "All",
    type: "new",
    submittedAt: "28 ธ.ค. 67",
    submittedDate: "2024-12-28",
    status: "rejected",
  },
  {
    id: "HC-012",
    requestNo: "HC-00018",
    exporterNo: "EXP-6701-00321",
    product: "มะม่วง",
    destination: "ญี่ปุ่น",
    certType: "Some",
    type: "new",
    submittedAt: "20 ธ.ค. 67",
    submittedDate: "2024-12-20",
    status: "completed",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.requestNo.toLowerCase().includes(q) ||
        i.exporterNo.toLowerCase().includes(q) ||
        i.product.toLowerCase().includes(q),
    );
  }
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.status) items = items.filter((i) => i.status === filters.status);
  if (filters.dateFrom)
    items = items.filter((i) => i.submittedDate >= filters.dateFrom);
  if (filters.dateTo)
    items = items.filter((i) => i.submittedDate <= filters.dateTo);
  return items;
});

function typeLabel(t) {
  return (
    {
      new: "ขอใบรับรอง",
      correction: "แก้ไขใบรับรอง",
    }[t] ?? t
  );
}

function statusColor(s) {
  return (
    {
      submitted: "warning",
      under_review: "info",
      testing: "secondary",
      pending_approval: "info",
      approved: "success",
      correction_required: "error",
      completed: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}

function statusLabel(s) {
  return (
    {
      submitted: "ยื่นแล้ว",
      under_review: "อยู่ระหว่างตรวจสอบ",
      testing: "ตรวจ Lab",
      pending_approval: "รอพิจารณา",
      approved: "อนุมัติแล้ว",
      correction_required: "ต้องแก้ไข",
      completed: "รับใบรับรองแล้ว",
      rejected: "ไม่อนุมัติ",
    }[s] ?? s
  );
}
</script>
