<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        :to="{ name: 'HCstaffReportList' }"
      />
      <div>
        <h1 class="page-title mb-0">{{ reportMeta.title }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          {{ reportMeta.description }}
        </p>
      </div>
    </div>

    <!-- Filter Card -->
    <v-card rounded="xl" elevation="0" border class="mb-5">
      <!-- <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon icon="fas fa-filter" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold">เงื่อนไขการค้นหา</span>
      </div> -->
      <v-card-text class="pa-4">
        <!-- Preset quick buttons -->
        <div class="filter-label mb-2">ช่วงเวลาด่วน</div>
        <div class="d-flex flex-wrap ga-2 mb-4">
          <v-btn
            v-for="p in datePresets"
            :key="p.days"
            size="small"
            rounded="lg"
            :variant="filters.activePreset === p.days ? 'flat' : 'tonal'"
            :color="filters.activePreset === p.days ? 'hcex-staff' : undefined"
            @click="setPreset(p.days)"
          >
            {{ p.label }}
          </v-btn>
        </div>

        <v-row dense align="end">
          <!-- Date from -->
          <v-col cols="12" sm="6" md="3">
            <div class="filter-label mb-1">จากวันที่</div>
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
                  @click:clear.stop="clearDateFrom"
                />
              </template>
              <v-date-picker
                v-model="dateFromObj"
                color="hcex-staff"
                show-adjacent-months
                :hide-header="!dateFromObj"
                title="จากวันที่"
                locale="th"
                @update:model-value="dateFromMenu = false"
              />
            </v-menu>
          </v-col>

          <!-- Date to -->
          <v-col cols="12" sm="6" md="3">
            <div class="filter-label mb-1">ถึงวันที่</div>
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
                  @click:clear.stop="clearDateTo"
                />
              </template>
              <v-date-picker
                v-model="dateToObj"
                color="hcex-staff"
                show-adjacent-months
                :hide-header="!dateToObj"
                title="ถึงวันที่"
                locale="th"
                @update:model-value="dateToMenu = false"
              />
            </v-menu>
          </v-col>

          <!-- Lab selector (only for lab report) -->
          <v-col v-if="reportMeta.hasLabFilter" cols="12" sm="6" md="3">
            <div class="filter-label mb-1">หน่วยงาน / ห้องปฏิบัติการ</div>
            <v-autocomplete
              v-model="filters.lab"
              :items="labOptions"
              placeholder="ทั้งหมด"
              density="compact"
              variant="outlined"
              rounded="lg"
              hide-details
              clearable
              color="hcex-staff"
            />
          </v-col>

          <!-- Search button -->
          <v-col cols="12" sm="auto">
            <v-btn
              color="hcex-staff"
              variant="flat"
              rounded="lg"
              density="compact"
              height="40"
              prepend-icon="fas fa-magnifying-glass"
              :loading="loading"
              @click="loadReport"
            >
              ดูรายงาน
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Report Table -->
    <v-card rounded="xl" elevation="0" border>
      <div class="d-flex align-center ga-2 px-4 py-3 border-b flex-wrap">
        <v-icon icon="fas fa-table" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold">ผลรายงาน</span>
        <v-chip
          v-if="searched"
          size="x-small"
          color="hcex-staff"
          variant="tonal"
          class="ml-1"
        >
          {{ items.length }} รายการ
        </v-chip>
        <v-spacer />
        <v-btn
          v-if="searched && items.length > 0"
          color="success"
          variant="tonal"
          size="small"
          rounded="lg"
          prepend-icon="fas fa-file-excel"
          @click="exportExcel"
        >
          Export Excel
        </v-btn>
      </div>

      <!-- Not searched yet -->
      <div v-if="!searched" class="text-center py-12">
        <v-icon
          icon="fas fa-chart-bar"
          color="grey-lighten-1"
          size="48"
          class="mb-3"
        />
        <div class="text-body-2 text-medium-emphasis">
          กำหนดเงื่อนไขและกด "ดูรายงาน"
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="hcex-staff"
          size="36"
          class="mb-3"
        />
        <div class="text-body-2 text-medium-emphasis">กำลังโหลดข้อมูล...</div>
      </div>

      <!-- Table -->
      <v-data-table
        v-else
        :headers="reportMeta.headers"
        :items="items"
        density="comfortable"
        :items-per-page="15"
        no-data-text="ไม่พบข้อมูลในช่วงเวลาที่เลือก"
      >
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'ผ่าน' ? 'success' : 'error'"
            size="x-small"
            variant="tonal"
            >{{ item.status }}</v-chip
          >
        </template>
        <template #item.no="{ index }">{{ index + 1 }}</template>
      </v-data-table>
    </v-card>

    <!-- Export success snackbar -->
    <v-snackbar
      v-model="exportSnack"
      color="success"
      location="bottom right"
      timeout="2500"
    >
      <v-icon icon="fas fa-circle-check" class="mr-2" size="16" />
      ส่งออกไฟล์ Excel สำเร็จ
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useLocale } from "vuetify";

const route = useRoute();
const reportType = computed(() => route.params.type);

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

// ── Report meta config ───────────────────────────────
const reportConfigs = {
  hcex: {
    title: "รายงานเกี่ยวกับใบรับรองสุขอนามัย (Health Certificate)",
    description:
      "รายงานสินค้าเกษตรแปรรูปด้านพืช — สรุปและรายละเอียดการออกใบรับรองสุขอนามัย",
    periodTypes: [
      { label: "รายเดือน", value: "month-detail" },
      { label: "รายไตรมาส", value: "quarter" },
      { label: "รายปี", value: "year" },
    ],
    hasLabFilter: false,
    headers: [
      { title: "#", key: "no", width: "60px" },
      { title: "เลขที่ใบรับรอง", key: "certNo" },
      { title: "ผู้ประกอบการ", key: "company" },
      { title: "ประเภทพืช", key: "plantType" },
      { title: "ปลายทาง", key: "destination" },
      { title: "วันที่ออก", key: "issuedDate" },
      { title: "ผู้อนุมัติ", key: "approver" },
    ],
    mockData: [
      {
        certNo: "HC-2568-00124",
        company: "บริษัท ไทยฟรุ้ต เอ็กซ์พอร์ต จำกัด",
        plantType: "ผลไม้สด",
        destination: "ญี่ปุ่น",
        issuedDate: "15/01/2568",
        approver: "นายสมชาย วงษ์สุวรรณ",
      },
      {
        certNo: "HC-2568-00123",
        company: "ห้างหุ้นส่วน ซีเนียร์ เกษตร",
        plantType: "ธัญพืช",
        destination: "จีน",
        issuedDate: "14/01/2568",
        approver: "นายสมชาย วงษ์สุวรรณ",
      },
      {
        certNo: "HC-2568-00122",
        company: "บริษัท กรีนเฟรช จำกัด",
        plantType: "ผักสด",
        destination: "เกาหลีใต้",
        issuedDate: "13/01/2568",
        approver: "นายสมชาย วงษ์สุวรรณ",
      },
      {
        certNo: "HC-2568-00121",
        company: "บริษัท สยามเฟรช จำกัด",
        plantType: "ไม้ตัดดอก",
        destination: "เนเธอร์แลนด์",
        issuedDate: "12/01/2568",
        approver: "นายสมชาย วงษ์สุวรรณ",
      },
      {
        certNo: "HC-2568-00120",
        company: "บริษัท ไทยฟรุ้ต เอ็กซ์พอร์ต จำกัด",
        plantType: "ผักสด",
        destination: "สิงคโปร์",
        issuedDate: "11/01/2568",
        approver: "นางสาวปิยะนุช สมใจ",
      },
    ],
  },
};

const reportMeta = computed(
  () => reportConfigs[reportType.value] ?? reportConfigs["hc"],
);

// ── Date picker helpers ───────────────────────────────
const dateFromMenu = ref(false);
const dateToMenu = ref(false);

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n + 1);
  return d;
}

const dateFromObj = ref(daysAgo(30));
const dateToObj = ref(new Date());

function dateToBEStr(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const dateFromBE = computed(() => dateToBEStr(dateFromObj.value));
const dateToBE = computed(() => dateToBEStr(dateToObj.value));

function clearDateFrom() {
  dateFromObj.value = null;
  filters.activePreset = null;
}
function clearDateTo() {
  dateToObj.value = null;
  filters.activePreset = null;
}

watch(dateFromObj, (v) => {
  filters.dateFrom = v ? v.toISOString().slice(0, 10) : "";
  filters.activePreset = null;
});
watch(dateToObj, (v) => {
  filters.dateTo = v ? v.toISOString().slice(0, 10) : "";
  filters.activePreset = null;
});

// ── Presets ───────────────────────────────────────────
const datePresets = [
  { label: "7 วัน", days: 7 },
  { label: "14 วัน", days: 14 },
  { label: "30 วัน", days: 30 },
  { label: "90 วัน", days: 90 },
  { label: "1 ปี", days: 365 },
];

function setPreset(days) {
  dateToObj.value = new Date();
  dateFromObj.value = daysAgo(days);
  // set after watches run (which clear activePreset)
  nextTick(() => {
    filters.activePreset = days;
  });
}

// ── Filters ──────────────────────────────────────────
const filters = reactive({
  dateFrom: dateFromObj.value.toISOString().slice(0, 10),
  dateTo: dateToObj.value.toISOString().slice(0, 10),
  activePreset: 30,
  lab: null,
});

function initAndLoad() {
  loadReport();
}

// initial load on mount
onMounted(initAndLoad);

// reload when navigating between report types (same component instance)
watch(reportType, initAndLoad);

const labOptions = [
  "ห้องปฏิบัติการกลาง (กวก.)",
  "มหาวิทยาลัยเกษตรศาสตร์",
  "มหาวิทยาลัยมหิดล",
  "ห้องปฏิบัติการเอกชน A",
];

// ── Report data ──────────────────────────────────────
const loading = ref(false);
const searched = ref(false);
const items = ref([]);
const exportSnack = ref(false);

function loadReport() {
  loading.value = true;
  searched.value = true;
  setTimeout(() => {
    items.value = reportMeta.value.mockData ?? [];
    loading.value = false;
  }, 600);
}

function exportExcel() {
  exportSnack.value = true;
}
</script>

<style scoped>
.filter-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.8);
}
</style>
