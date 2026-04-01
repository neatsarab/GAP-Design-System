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
              placeholder="เลขคำขอ / ชื่อผู้ส่งออก / ชื่อผู้ยื่นคำขอ"
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
        <template #header.exporter="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ชื่อผู้ส่งออก</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Exporter Name</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.applicantName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ชื่อผู้ยื่นคำขอ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Applicant Name</div>
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
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">สถานะคำขอ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Status</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>

        <template #item.requestNo="{ item }">
          <span class="text-body-2">{{ item.requestNo }}</span>
        </template>
        <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
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
              v-if="item.status === 'pending'"
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

function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  submittedDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

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
  { label: "รอตรวจ", value: "pending" },
  { label: "อยู่ระหว่างตรวจ", value: "reviewing" },
  { label: "รอลงนาม", value: "signing" },
  { label: "รอแก้ไข", value: "need_edit" },
  { label: "อนุมัติ", value: "approved" },
  { label: "ไม่อนุมัติ", value: "rejected" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ชื่อผู้ส่งออก", key: "exporter", sortable: true },
  { title: "ชื่อผู้ยื่นคำขอ", key: "applicantName", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะคำขอ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  {
    id: "HC-001",
    requestNo: "HC-2569-00041",
    exporter: "บ.ไทยฟรุ๊ต จำกัด",
    applicantName: "สมชาย ใจดี",
    type: "new",
    submittedDate: "15/01/2569",
    status: "pending",
  },
  {
    id: "HC-002",
    requestNo: "HC-2569-00039",
    exporter: "บ.สยามเอ็กซ์พอร์ต จำกัด",
    applicantName: "มาลี รักดี",
    type: "new",
    submittedDate: "13/01/2569",
    status: "pending",
  },
  {
    id: "HC-003",
    requestNo: "HC-2569-00036",
    exporter: "บ.กรีนเฟรช จำกัด",
    applicantName: "ประสิทธิ์ พานิช",
    type: "correction",
    submittedDate: "10/01/2569",
    status: "signing",
  },
  {
    id: "HC-004",
    requestNo: "HC-2569-00034",
    exporter: "บ.ดีเอ็กซ์พอร์ต จำกัด",
    applicantName: "วิไล สุขสม",
    type: "new",
    submittedDate: "08/01/2569",
    status: "need_edit",
  },
  {
    id: "HC-005",
    requestNo: "HC-2569-00030",
    exporter: "บ.ไทยอะกริ จำกัด",
    applicantName: "ชัยวัฒน์ เกษตรกร",
    type: "new",
    submittedDate: "03/01/2569",
    status: "approved",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.requestNo.toLowerCase().includes(q) ||
        i.exporter.toLowerCase().includes(q) ||
        i.applicantName.toLowerCase().includes(q),
    );
  }
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.status) items = items.filter((i) => i.status === filters.status);
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    items = items.filter((i) => beDateToTs(i.submittedDate) >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    items = items.filter((i) => beDateToTs(i.submittedDate) <= to);
  }
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
      pending: "warning",
      reviewing: "info",
      signing: "info",
      need_edit: "info",
      approved: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}
function statusLabel(s) {
  return (
    {
      pending: "รอตรวจ",
      reviewing: "อยู่ระหว่างตรวจ",
      signing: "รอลงนาม",
      need_edit: "รอแก้ไข",
      approved: "อนุมัติ",
      rejected: "ไม่อนุมัติ",
    }[s] ?? s
  );
}
</script>

