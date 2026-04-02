<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          การออกหนังสือรับรองสุขอนามัยพืชสำหรับพืชควบคุมเฉพาะ
        </p>
      </div>
      <v-btn
        color="hc-user"
        prepend-icon="fas fa-plus"
        @click="goToNewApplication"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="3">
            <div class="field-label">
              <div>เลขคำขอ</div>
              <div class="field-label-en">Request No.</div>
            </div>
            <v-text-field
              v-model="filterRequestNo"
              placeholder="ค้นหาเลขคำขอ"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
            />
          </v-col>
          <!-- <v-col cols="12" sm="3">
            <div class="field-label">
              <div>เลขทะเบียนผู้ส่งออก</div>
              <div class="field-label-en">Exporter Registration No.</div>
            </div>
            <v-text-field
              v-model="filterExporterNo"
              placeholder="ค้นหาเลขทะเบียนผู้ส่งออก"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
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
          </v-col> -->
          <v-col cols="12" sm="3">
            <div class="field-label">
              <div>สถานะ</div>
              <div class="field-label-en">Status</div>
            </div>
            <v-autocomplete
              v-model="filterStatus"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              placeholder="สถานะทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <!-- </v-row>
        <v-row dense align="center" class="mt-1"> -->
          <v-col cols="6" sm="3">
            <div class="field-label">
              <div>วันที่ยื่น (จาก)</div>
              <div class="field-label-en">Submitted Date (From)</div>
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
                color="hc-user"
                show-adjacent-months
                :hide-header="!dateFromObj"
                title="วันที่ยื่น (ตั้งแต่)"
                locale="th"
                @update:model-value="dateFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label">
              <div>วันที่ยื่น (ถึง)</div>
              <div class="field-label-en">Submitted Date (To)</div>
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
                color="hc-user"
                show-adjacent-months
                :hide-header="!dateToObj"
                title="วันที่ยื่น (จนถึง)"
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
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        hover
        @click:row="onRowClick"
      >
        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-medium">{{
            item.requestNo
          }}</span>
        </template>
        <template #item.exporterNo="{ item }">
          <span class="text-body-2 font-weight-medium text-export-user">{{
            item.exporterNo
          }}</span>
        </template>
        <template #item.certType="{ item }">
          <span class="text-body-2">{{ getCertTypeLabel(item.certType) }}</span>
        </template>
        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'correction' ? 'secondary' : 'success'"
            variant="tonal"
          >
            {{ item.type === "correction" ? "แก้ไขใบรับรอง" : "ขอใบรับรอง" }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip
            size="small"
            :color="getStatusColor(item.status)"
            variant="tonal"
          >
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="hc-user"
                  @click.stop="goToApplicationDetail(item.id)"
                >
                  <v-icon icon="fas fa-eye" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip
              v-if="
                [
                  'submitted',
                  'under_review',
                  'testing',
                  'pending_approval',
                  'correction_required',
                ].includes(item.status)
              "
              text="ยกเลิกคำขอ"
              location="top"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="error"
                  @click.stop
                >
                  <v-icon icon="fas fa-xmark" size="14" />
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
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const router = useRouter();
const filterRequestNo = ref("");
const filterExporterNo = ref("");
const filterType = ref(null);
const filterStatus = ref(null);
const activeTab = ref("all");

const dateFromMenu = ref(false);
const dateFromObj = ref(null);
const dateToMenu = ref(false);
const dateToObj = ref(null);
const filterDateFrom = ref("");
const filterDateTo = ref("");

function dateToBuddhistEra(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const dateFromBE = computed(() => dateToBuddhistEra(dateFromObj.value));
const dateToBE = computed(() => dateToBuddhistEra(dateToObj.value));

watch(dateFromObj, (v) => {
  filterDateFrom.value = v ? v.toISOString().slice(0, 10) : "";
});
watch(dateToObj, (v) => {
  filterDateTo.value = v ? v.toISOString().slice(0, 10) : "";
});

function onRowClick(_e, row) {
  goToApplicationDetail(row.item.id);
}

function goToNewApplication() {
  router.push({ name: "HCUserApplicationType" });
}

function goToApplicationDetail(id) {
  router.push({ name: "HCUserApplicationDetail", params: { id } });
}

function clearFilters() {
  filterRequestNo.value = "";
  filterExporterNo.value = "";
  filterType.value = null;
  filterStatus.value = null;
  dateFromObj.value = null;
  dateToObj.value = null;
  activeTab.value = "all";
}

const certTypeOptions = [
  { label: "คลุมทั้งการส่งออก", value: "All" },
  { label: "แต่ละรายการส่งออก", value: "Some" },
];

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

const allApplications = [
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
  let items = allApplications;

  if (filterRequestNo.value?.trim())
    items = items.filter((i) =>
      i.requestNo
        .toLowerCase()
        .includes(filterRequestNo.value.trim().toLowerCase()),
    );
  if (filterExporterNo.value?.trim())
    items = items.filter((i) =>
      i.exporterNo
        .toLowerCase()
        .includes(filterExporterNo.value.trim().toLowerCase()),
    );

  if (filterType.value)
    items = items.filter((i) => i.type === filterType.value);

  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);

  if (filterDateFrom.value)
    items = items.filter((i) => i.submittedDate >= filterDateFrom.value);

  if (filterDateTo.value)
    items = items.filter((i) => i.submittedDate <= filterDateTo.value);

  if (activeTab.value === "in_progress")
    items = items.filter((i) =>
      ["submitted", "under_review", "testing", "pending_approval"].includes(
        i.status,
      ),
    );
  else if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);

  return items;
});

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 160 },
  // { title: "เลขทะเบียนผู้ส่งออก", key: "exporterNo", width: 200 },
  // { title: "ประเภทใบรับรอง", key: "certType", width: 180 },
  { title: "ประเภทคำขอ", key: "type", width: 130 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 200 },
  { title: "", key: "actions", width: 140, sortable: false },
];

function getCertTypeLabel(v) {
  const m = {
    All: "คลุมทั้งการส่งออก",
    Some: "แต่ละรายการส่งออก",
  };
  return m[v] ?? v;
}

function getStatusColor(s) {
  const m = {
    submitted: "primary",
    under_review: "info",
    testing: "secondary",
    pending_approval: "success",
    approved: "success",
    correction_required: "error",
    completed: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}

function getStatusLabel(s) {
  const m = {
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติแล้ว",
    completed: "รับใบรับรองแล้ว",
    correction_required: "ต้องแก้ไข",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>
