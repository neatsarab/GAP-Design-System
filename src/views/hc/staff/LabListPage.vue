<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">รายการรอตรวจ Lab</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          การออกหนังสือรับรองสุขอนามัยพืช สำหรับพืชควบคุมเฉพาะ
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
              placeholder="เลขคำขอ / ชื่อสถานประกอบการ / ชื่อผู้ยื่นคำขอ / เลขทะเบียนผู้ส่งออก"
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
              <div>ประเภทใบรับรอง</div>
              <div class="field-label-en">Certificate Type</div>
            </div>
            <v-autocomplete
              v-model="filters.certType"
              :items="certTypeOptions"
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
              <div>สถานะผล Lab</div>
              <div class="field-label-en">Lab Status</div>
            </div>
            <v-autocomplete
              v-model="filters.labStatus"
              :items="labStatusOptions"
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
              <div>วันที่ส่งตรวจ (จาก)</div>
              <div class="field-label-en">Sent Date (From)</div>
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
                title="วันที่ส่งตรวจ (จาก)"
                locale="th"
                @update:model-value="dateFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>วันที่ส่งตรวจ (ถึง)</div>
              <div class="field-label-en">Sent Date (To)</div>
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
                title="วันที่ส่งตรวจ (ถึง)"
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
    <v-card elevation="0" class="data-card">
      <div class="table-scroll-wrapper">
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
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  เลขคำขอ
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Request No.
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>
          <template #header.exporterNo="{ column, isSorted, getSortIcon }">
            <span class="d-inline-flex align-center ga-1">
              <span>
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  เลขทะเบียนผู้ส่งออก
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Exporter No.
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>
          <template
            #header.establishmentName="{ column, isSorted, getSortIcon }"
          >
            <span class="d-inline-flex align-center ga-1">
              <span>
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  ชื่อสถานประกอบการ
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Company Name
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>
          <template #header.applicantName="{ column, isSorted, getSortIcon }">
            <span class="d-inline-flex align-center ga-1">
              <span>
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  ชื่อผู้ยื่นคำขอ
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Applicant Name
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>
          <template #header.certType="{ column, isSorted, getSortIcon }">
            <span class="d-inline-flex align-center ga-1">
              <span>
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  ประเภทใบรับรอง
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Certificate Type
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>
          <template #header.type="{ column, isSorted, getSortIcon }">
            <span class="d-inline-flex align-center ga-1">
              <span>
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  ประเภทคำขอ
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Request Type
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>
          <template #header.sentDate="{ column, isSorted, getSortIcon }">
            <span class="d-inline-flex align-center ga-1">
              <span>
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  วันที่ส่งตรวจ
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Sent Date
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>
          <template #header.labStatus="{ column, isSorted, getSortIcon }">
            <span class="d-inline-flex align-center ga-1">
              <span>
                <div
                  class="text-body-2 font-weight-medium"
                  style="line-height: 1.3"
                >
                  สถานะผล Lab
                </div>
                <div
                  class="text-caption text-medium-emphasis"
                  style="line-height: 1.2"
                >
                  Lab Status
                </div>
              </span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                size="14"
              />
            </span>
          </template>

          <template #item.certType="{ item }">{{
            certTypeLabel(item.certType)
          }}</template>
          <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
          <template #item.labStatus="{ item }">
            <v-chip
              :color="labStatusColor(item.labStatus)"
              size="small"
              variant="tonal"
            >
              {{ labStatusLabel(item.labStatus) }}
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
                    @click.stop="goToDetail(item.id)"
                  >
                    <v-icon icon="fas fa-eye" size="14" />
                  </v-btn>
                </template>
              </v-tooltip>
              <v-btn
                v-if="item.labStatus === 'pending'"
                size="small"
                variant="tonal"
                color="warning"
                rounded="lg"
                prepend-icon="fas fa-flask"
                @click.stop="goToDetail(item.id)"
              >
                บันทึกผล Lab
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
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

function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  sentDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null,
  certType: null,
  labStatus: null,
});

function goToDetail(id) {
  router.push({ name: "HCstaffLabDetail", params: { id } });
}

function clearFilters() {
  search.value = "";
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.type = null;
  filters.certType = null;
  filters.labStatus = null;
  dateFromObj.value = null;
  dateToObj.value = null;
}

const certTypeOptions = [
  { label: "คลุมทั้งการส่งออก", value: "All" },
  { label: "แต่ละรายการส่งออก", value: "Some" },
];

const typeOptions = [
  { label: "ขอใบรับรอง", value: "new" },
  { label: "แก้ไขใบรับรอง", value: "correction" },
];

const labStatusOptions = [
  { label: "รอผล Lab", value: "pending" },
  { label: "ผ่าน", value: "pass" },
  { label: "ไม่ผ่าน", value: "fail" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "เลขทะเบียนผู้ส่งออก", key: "exporterNo", sortable: true },
  { title: "ชื่อสถานประกอบการ", key: "establishmentName", sortable: true },
  { title: "ชื่อผู้ยื่นคำขอ", key: "applicantName", sortable: true },
  { title: "ประเภทใบรับรอง", key: "certType", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "วันที่ส่งตรวจ", key: "sentDate", sortable: true },
  { title: "สถานะผล Lab", key: "labStatus", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  {
    id: "HC-00013",
    requestNo: "HC-00013",
    exporterNo: "EXP-2568-00123",
    establishmentName: "บ.ไทยฟรุ๊ต จก.",
    applicantName: "สมชาย ใจดี",
    certType: "All",
    type: "new",
    sentDate: "25/03/2569",
    sentDateISO: "2026-03-25",
    labStatus: "pending",
  },
  {
    id: "HC-00014",
    requestNo: "HC-00014",
    exporterNo: "EXP-2568-00456",
    establishmentName: "บ.สยามเอ็กซ์พอร์ต จก.",
    applicantName: "มาลี รักดี",
    certType: "Some",
    type: "correction",
    sentDate: "26/03/2569",
    sentDateISO: "2026-03-26",
    labStatus: "pending",
  },
  {
    id: "HC-00015",
    requestNo: "HC-00015",
    exporterNo: "EXP-2568-00789",
    establishmentName: "บ.กรีนเฟรช จก.",
    applicantName: "ประสิทธิ์ พานิช",
    certType: "All",
    type: "new",
    sentDate: "20/03/2569",
    sentDateISO: "2026-03-20",
    labStatus: "pass",
  },
  {
    id: "HC-00016",
    requestNo: "HC-00016",
    exporterNo: "EXP-2568-00321",
    establishmentName: "บ.อีสานฟาร์ม จก.",
    applicantName: "วิไล สุขสม",
    certType: "Some",
    type: "new",
    sentDate: "18/03/2569",
    sentDateISO: "2026-03-18",
    labStatus: "fail",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.requestNo.toLowerCase().includes(q) ||
        i.establishmentName.toLowerCase().includes(q) ||
        i.applicantName.toLowerCase().includes(q) ||
        i.exporterNo.toLowerCase().includes(q),
    );
  }
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.certType)
    items = items.filter((i) => i.certType === filters.certType);
  if (filters.labStatus)
    items = items.filter((i) => i.labStatus === filters.labStatus);
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    items = items.filter((i) => beDateToTs(i.sentDate) >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    items = items.filter((i) => beDateToTs(i.sentDate) <= to);
  }
  return items;
});

function certTypeLabel(t) {
  return { All: "คลุมทั้งการส่งออก", Some: "แต่ละรายการส่งออก" }[t] ?? t;
}

function certTypeColor(t) {
  return t === "All" ? "hc-staff" : "secondary";
}

function typeLabel(t) {
  return { new: "ขอใบรับรอง", correction: "แก้ไขใบรับรอง" }[t] ?? t;
}

function labStatusColor(s) {
  return { pending: "warning", pass: "success", fail: "error" }[s] ?? "grey";
}

function labStatusLabel(s) {
  return { pending: "รอผล Lab", pass: "ผ่าน", fail: "ไม่ผ่าน" }[s] ?? s;
}
</script>

<style scoped>
.data-card {
  border-radius: 24px;
  overflow: hidden;
}
.table-scroll-wrapper {
  overflow-x: auto;
}
:deep(.v-table__wrapper) {
  overflow: visible !important;
}
:deep(.v-data-table td:last-child),
:deep(.v-data-table th:last-child) {
  position: sticky !important;
  right: 0;
  background: rgb(var(--v-theme-surface));
}
:deep(.v-data-table td:last-child) {
  z-index: 1;
}
:deep(.v-data-table th:last-child) {
  z-index: 3;
}
</style>
