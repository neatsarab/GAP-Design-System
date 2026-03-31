<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ทะเบียนใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ข้อมูลใบรับรองสุขอนามัยพืชที่ออกแล้วทั้งหมด
        </p>
      </div>
      <v-btn color="hc-staff" prepend-icon="fas fa-file-excel" variant="tonal">
        ส่งออก Excel
      </v-btn>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in stats" :key="s.label" cols="6" sm="3">
        <v-card rounded="xl" elevation="0">
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div
              class="stat-icon"
              :style="{ background: `rgba(var(--v-theme-${s.color}),0.12)` }"
            >
              <v-icon :icon="s.icon" :color="s.color" size="18" />
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

    <!-- Search -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="5">
            <div class="field-label mb-1">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="searchRegNo"
              prepend-inner-icon="fas fa-barcode"
              placeholder="เลขทะเบียน / เลขคำขอ / ผู้ส่งออก"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label mb-1">
              <div>วันหมดอายุ (จาก)</div>
              <div class="field-label-en">Expire Date (From)</div>
            </div>
            <v-menu v-model="expireFromMenu" :close-on-content-click="false" location="bottom start">
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="expireFromBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่"
                  hide-details
                  variant="outlined"
                  rounded="lg"
                  style="cursor: pointer"
                  @click:clear.stop="expireFromObj = null"
                />
              </template>
              <v-date-picker
                v-model="expireFromObj"
                color="hc-staff"
                show-adjacent-months
                :hide-header="!expireFromObj"
                title="วันหมดอายุ (จาก)"
                locale="th"
                @update:model-value="expireFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label mb-1">
              <div>วันหมดอายุ (ถึง)</div>
              <div class="field-label-en">Expire Date (To)</div>
            </div>
            <v-menu v-model="expireToMenu" :close-on-content-click="false" location="bottom start">
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="expireToBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่"
                  hide-details
                  variant="outlined"
                  rounded="lg"
                  style="cursor: pointer"
                  @click:clear.stop="expireToObj = null"
                />
              </template>
              <v-date-picker
                v-model="expireToObj"
                color="hc-staff"
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
            >
              ล้างตัวกรอง
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Status Filter -->
    <v-chip-group v-model="filterStatus" class="mb-4" mandatory>
      <v-chip value="all" color="hc-staff" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge
          :content="allCerts.length"
          inline
          color="hc-staff"
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
        :items="filteredCerts"
        hover
      >
        <template #no-data>
          <div class="text-center py-10">
            <v-icon
              icon="fas fa-file-shield"
              size="40"
              color="grey-lighten-2"
              class="mb-3"
            />
            <p class="text-body-2 text-medium-emphasis mb-0">
              ไม่พบข้อมูลใบรับรอง
            </p>
          </div>
        </template>

        <template #item.certNo="{ item }">
          <span class="text-body-2 font-weight-bold text-info">{{
            item.certNo
          }}</span>
        </template>

        <template #item.requestNo="{ item }">
          <span class="text-body-2 text-medium-emphasis">{{
            item.requestNo
          }}</span>
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
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  variant="text"
                  color="hc-staff"
                  icon
                  @click.stop="goToCertDetail(item.certNo)"
                >
                  <v-icon icon="fas fa-eye" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="ดาวน์โหลด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  variant="text"
                  color="success"
                  icon
                  :disabled="item.certStatus === 'expired'"
                >
                  <v-icon icon="fas fa-download" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="จัดการ" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  variant="text"
                  color="warning"
                  icon
                  @click.stop="goToCertManage(item.certNo)"
                >
                  <v-icon icon="fas fa-file-pen" size="14" />
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
const searchRegNo = ref("");
const filterStatus = ref("all");

const expireFromMenu = ref(false);
const expireFromObj = ref(null);
const expireToMenu = ref(false);
const expireToObj = ref(null);
const expireFromDate = ref("");
const expireToDate = ref("");

function dateToBEStr(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const expireFromBE = computed(() => dateToBEStr(expireFromObj.value));
const expireToBE = computed(() => dateToBEStr(expireToObj.value));

watch(expireFromObj, (v) => { expireFromDate.value = v ? v.toISOString().slice(0, 10) : ""; });
watch(expireToObj, (v) => { expireToDate.value = v ? v.toISOString().slice(0, 10) : ""; });

function goToCertDetail(certNo) {
  router.push({ name: "HCStaffCertificateDetail", params: { id: certNo } });
}

function goToCertManage(certNo) {
  router.push({ name: "HCStaffCertificateManage", params: { id: certNo } });
}

function clearFilters() {
  searchRegNo.value = "";
  filterStatus.value = "all";
  expireFromObj.value = null;
  expireToObj.value = null;
  expireFromDate.value = "";
  expireToDate.value = "";
}

const stats = [
  {
    label: "ใบรับรองทั้งหมด",
    value: "148",
    icon: "fas fa-file-shield",
    color: "primary",
  },
  {
    label: "มีผล",
    value: "112",
    icon: "fas fa-circle-check",
    color: "success",
  },
  { label: "ใกล้หมดอายุ", value: "18", icon: "fas fa-clock", color: "warning" },
  {
    label: "หมดอายุแล้ว",
    value: "18",
    icon: "fas fa-circle-xmark",
    color: "error",
  },
];

const allCerts = [
  {
    certNo: "THHC-2569-00041",
    requestNo: "HC-2569-00041",
    exporter: "บ.ไทยฟรุ๊ต จำกัด",
    product: "ทุเรียน",
    destination: "จีน",
    issuedAt: "20 ม.ค. 68",
    expiry: "20 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2569-00039",
    requestNo: "HC-2569-00039",
    exporter: "บ.สยามเอ็กซ์พอร์ต จำกัด",
    product: "มะม่วง",
    destination: "ญี่ปุ่น",
    issuedAt: "18 ม.ค. 68",
    expiry: "18 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2569-00036",
    requestNo: "HC-2569-00036",
    exporter: "บ.กรีนเฟรช จำกัด",
    product: "ลำไย",
    destination: "เวียดนาม",
    issuedAt: "15 ม.ค. 68",
    expiry: "15 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2569-00034",
    requestNo: "HC-2569-00034",
    exporter: "บ.ดีเอ็กซ์พอร์ต จำกัด",
    product: "กระเทียม",
    destination: "เกาหลีใต้",
    issuedAt: "12 ม.ค. 68",
    expiry: "12 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2569-00033",
    requestNo: "HC-2569-00033",
    exporter: "บ.ไทยอะกริ จำกัด",
    product: "ส้มโอ",
    destination: "สิงคโปร์",
    issuedAt: "10 ม.ค. 68",
    expiry: "10 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2569-00027",
    requestNo: "HC-2569-00027",
    exporter: "บ.ไทยฟรุ๊ต จำกัด",
    product: "มังคุด",
    destination: "จีน",
    issuedAt: "5 ม.ค. 68",
    expiry: "5 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHC-2569-00020",
    requestNo: "HC-2569-00020",
    exporter: "บ.ภาคเหนือเกษตร จำกัด",
    product: "กระเทียม",
    destination: "ไต้หวัน",
    issuedAt: "28 ธ.ค. 67",
    expiry: "28 ธ.ค. 68",
    certStatus: "expiring",
  },
  {
    certNo: "THHC-2569-00018",
    requestNo: "HC-2569-00018",
    exporter: "บ.อีสานฟาร์ม จำกัด",
    product: "มันสำปะหลัง",
    destination: "จีน",
    issuedAt: "20 ธ.ค. 67",
    expiry: "20 ธ.ค. 68",
    certStatus: "expiring",
  },
  {
    certNo: "THHC-2569-00015",
    requestNo: "HC-2569-00015",
    exporter: "บ.นอร์ทเทิร์นเฟรช จำกัด",
    product: "ลิ้นจี่",
    destination: "เกาหลีใต้",
    issuedAt: "15 ธ.ค. 67",
    expiry: "15 ธ.ค. 68",
    certStatus: "expiring",
  },
  {
    certNo: "THHC-2569-00098",
    requestNo: "HC-2569-00098",
    exporter: "บ.สยามเอ็กซ์พอร์ต จำกัด",
    product: "กล้วยหอม",
    destination: "ญี่ปุ่น",
    issuedAt: "10 ม.ค. 67",
    expiry: "10 ม.ค. 68",
    certStatus: "expired",
  },
  {
    certNo: "THHC-2569-00090",
    requestNo: "HC-2569-00090",
    exporter: "บ.กรีนเฟรช จำกัด",
    product: "ทุเรียน",
    destination: "จีน",
    issuedAt: "5 ม.ค. 67",
    expiry: "5 ม.ค. 68",
    certStatus: "expired",
  },
  {
    certNo: "THHC-2569-00080",
    requestNo: "HC-2569-00080",
    exporter: "บ.เอเชียแอกริ จำกัด",
    product: "ข้าว",
    destination: "ฮ่องกง",
    issuedAt: "1 ม.ค. 67",
    expiry: "1 ม.ค. 68",
    certStatus: "expired",
  },
];

const destinations = [...new Set(allCerts.map((c) => c.destination))].sort();
const productOptions = [...new Set(allCerts.map((c) => c.product))].sort();

function countByStatus(s) {
  return allCerts.filter((c) => c.certStatus === s).length;
}

const filteredCerts = computed(() => {
  let items =
    filterStatus.value === "all"
      ? allCerts
      : allCerts.filter((c) => c.certStatus === filterStatus.value);
  if (searchRegNo.value) {
    const q = searchRegNo.value.toLowerCase();
    items = items.filter(
      (c) =>
        c.certNo.toLowerCase().includes(q) ||
        c.requestNo.toLowerCase().includes(q) ||
        c.exporter.toLowerCase().includes(q),
    );
  }
  return items;
});

const headers = [
  { title: "เลขทะเบียน", key: "certNo", width: 170 },
  { title: "เลขคำขอ", key: "requestNo", width: 160 },
  { title: "ผู้ส่งออก", key: "exporter", width: 210 },
  { title: "วันที่ออก", key: "issuedAt", width: 120 },
  { title: "วันหมดอายุ", key: "expiry", width: 120 },
  { title: "สถานะ", key: "certStatus", width: 140 },
  { title: "", key: "actions", width: 90, sortable: false },
];

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
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
