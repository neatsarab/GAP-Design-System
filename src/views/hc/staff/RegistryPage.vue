<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          การออกหนังสือรับรองสุขอนามัยพืช สำหรับพืชควบคุมเฉพาะ
        </p>
      </div>
      <v-btn color="hc-staff" prepend-icon="fas fa-file-excel" variant="tonal">
        ส่งออก Excel
      </v-btn>
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
              v-model="searchRegNo"
              placeholder="เลขทะเบียน / เลขคำขอ / ชื่อสถานประกอบการ / ชื่อผู้ยื่นคำขอ"
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
              >ล้างตัวกรอง</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="filteredCerts" hover>
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

        <template #header.certNo="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                เลขทะเบียน
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Certificate No.
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
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
        <template #header.companyName="{ column, isSorted, getSortIcon }">
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
        <template #header.issuedAt="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                วันที่ออก
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Issue Date
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.expiry="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                วันหมดอายุ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Expire Date
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.certStatus="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                สถานะ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Status
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>

        <template #item.certNo="{ item }">
          <span class="text-body-2 font-weight-medium text-hc-staff">{{
            item.certNo
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
            >{{ item.expiry }}</span
          >
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="hc-staff"
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
                  icon
                  size="x-small"
                  variant="text"
                  color="success"
                  :disabled="item.certStatus === 'expired'"
                  @click.stop
                >
                  <v-icon icon="fas fa-download" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <!-- <v-btn
              size="small"
              variant="tonal"
              color="hc-staff"
              rounded="lg"
              prepend-icon="fas fa-file-pen"
              :disabled="item.certStatus === 'expired'"
              @click.stop="goToCertManage(item.certNo)"
            >
              จัดการใบรับรอง
            </v-btn> -->
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
const filterStatus = ref(null);

const expireFromMenu = ref(false);
const expireFromObj = ref(null);
const expireToMenu = ref(false);
const expireToObj = ref(null);
const filterExpireFrom = ref("");
const filterExpireTo = ref("");

function dateToBEStr(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const expireFromBE = computed(() => dateToBEStr(expireFromObj.value));
const expireToBE = computed(() => dateToBEStr(expireToObj.value));

watch(expireFromObj, (v) => {
  filterExpireFrom.value = v ? v.toISOString().slice(0, 10) : "";
});
watch(expireToObj, (v) => {
  filterExpireTo.value = v ? v.toISOString().slice(0, 10) : "";
});

function goToCertDetail(certNo) {
  router.push({ name: "HCStaffCertificateDetail", params: { id: certNo } });
}

function goToCertManage(certNo) {
  router.push({ name: "HCStaffCertificateManage", params: { id: certNo } });
}

function clearFilters() {
  searchRegNo.value = "";
  filterStatus.value = null;
  expireFromObj.value = null;
  expireToObj.value = null;
  filterExpireFrom.value = "";
  filterExpireTo.value = "";
}

const statusOptions = [
  { label: "มีผล", value: "active" },
  { label: "ใกล้หมดอายุ", value: "expiring" },
  { label: "หมดอายุ", value: "expired" },
];

const allCerts = [
  {
    certNo: "HC-2569-00041",
    requestNo: "HC-00041",
    companyName: "บริษัท ไทยฟรุ๊ต จำกัด",
    applicantName: "นายสมชาย ใจดี",
    issuedAt: "20/01/2568",
    expiry: "20/01/2569",
    certStatus: "active",
  },
  {
    certNo: "HC-2569-00039",
    requestNo: "HC-00039",
    companyName: "บริษัท สยามเอ็กซ์พอร์ต จำกัด",
    applicantName: "นางสาวมาลี รักดี",
    issuedAt: "18/01/2568",
    expiry: "18/01/2569",
    certStatus: "active",
  },
  {
    certNo: "HC-2569-00036",
    requestNo: "HC-00036",
    companyName: "บริษัท กรีนเฟรช จำกัด",
    applicantName: "นายประสิทธิ์ พานิช",
    issuedAt: "15/01/2568",
    expiry: "15/01/2569",
    certStatus: "active",
  },
  {
    certNo: "HC-2569-00034",
    requestNo: "HC-00034",
    companyName: "บริษัท ดีเอ็กซ์พอร์ต จำกัด",
    applicantName: "นายวิชัย สมบูรณ์",
    issuedAt: "12/01/2568",
    expiry: "12/01/2569",
    certStatus: "active",
  },
  {
    certNo: "HC-2569-00033",
    requestNo: "HC-00033",
    companyName: "บริษัท ไทยอะกริ จำกัด",
    applicantName: "นางสาวสุดา เจริญสุข",
    issuedAt: "10/01/2568",
    expiry: "10/01/2569",
    certStatus: "active",
  },
  {
    certNo: "HC-2569-00027",
    requestNo: "HC-00027",
    companyName: "บริษัท ไทยฟรุ๊ต จำกัด",
    applicantName: "นายสมชาย ใจดี",
    issuedAt: "05/01/2568",
    expiry: "05/01/2569",
    certStatus: "active",
  },
  {
    certNo: "HC-2569-00020",
    requestNo: "HC-00020",
    companyName: "บริษัท ภาคเหนือเกษตร จำกัด",
    applicantName: "นายอนันต์ มั่นคง",
    issuedAt: "28/12/2567",
    expiry: "28/12/2568",
    certStatus: "expiring",
  },
  {
    certNo: "HC-2569-00018",
    requestNo: "HC-00018",
    companyName: "บริษัท อีสานฟาร์ม จำกัด",
    applicantName: "นายบุญมี ศรีสุข",
    issuedAt: "20/12/2567",
    expiry: "20/12/2568",
    certStatus: "expiring",
  },
  {
    certNo: "HC-2569-00015",
    requestNo: "HC-00015",
    companyName: "บริษัท นอร์ทเทิร์นเฟรช จำกัด",
    applicantName: "นางสาวกมลา เพชรรัตน์",
    issuedAt: "15/12/2567",
    expiry: "15/12/2568",
    certStatus: "expiring",
  },
  {
    certNo: "HC-2569-00098",
    requestNo: "HC-00098",
    companyName: "บริษัท สยามเอ็กซ์พอร์ต จำกัด",
    applicantName: "นางสาวมาลี รักดี",
    issuedAt: "10/01/2567",
    expiry: "10/01/2568",
    certStatus: "expired",
  },
  {
    certNo: "HC-2569-00090",
    requestNo: "HC-00090",
    companyName: "บริษัท กรีนเฟรช จำกัด",
    applicantName: "นายประสิทธิ์ พานิช",
    issuedAt: "05/01/2567",
    expiry: "05/01/2568",
    certStatus: "expired",
  },
  {
    certNo: "HC-2569-00080",
    requestNo: "HC-00080",
    companyName: "บริษัท เอเชียแอกริ จำกัด",
    applicantName: "นายธนา วงศ์ศรี",
    issuedAt: "01/01/2567",
    expiry: "01/01/2568",
    certStatus: "expired",
  },
];

function countByStatus(s) {
  return allCerts.filter((c) => c.certStatus === s).length;
}

const stats = computed(() => [
  {
    label: "ใบรับรองทั้งหมด",
    value: allCerts.length,
    icon: "fas fa-file-shield",
    color: "hc-staff",
  },
  {
    label: "มีผล",
    value: countByStatus("active"),
    icon: "fas fa-circle-check",
    color: "success",
  },
  {
    label: "ใกล้หมดอายุ",
    value: countByStatus("expiring"),
    icon: "fas fa-clock",
    color: "warning",
  },
  {
    label: "หมดอายุแล้ว",
    value: countByStatus("expired"),
    icon: "fas fa-circle-xmark",
    color: "error",
  },
]);

const filteredCerts = computed(() => {
  let items = allCerts;
  if (searchRegNo.value) {
    const q = searchRegNo.value.toLowerCase();
    items = items.filter(
      (c) =>
        c.certNo.toLowerCase().includes(q) ||
        c.requestNo.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.applicantName.toLowerCase().includes(q),
    );
  }
  if (filterStatus.value)
    items = items.filter((c) => c.certStatus === filterStatus.value);
  return items;
});

const headers = [
  { title: "เลขทะเบียน", key: "certNo", sortable: true },
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ชื่อสถานประกอบการ", key: "companyName", sortable: true },
  { title: "ชื่อผู้ยื่นคำขอ", key: "applicantName", sortable: true },
  { title: "วันที่ออก", key: "issuedAt", sortable: true },
  { title: "วันหมดอายุ", key: "expiry", sortable: true },
  { title: "สถานะ", key: "certStatus", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end", fixed: true },
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
