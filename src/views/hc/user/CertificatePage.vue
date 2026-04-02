<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          การออกหนังสือรับรองสุขอนามัยพืชสำหรับพืชควบคุมเฉพาะ
        </p>
      </div>
      <v-btn variant="tonal" color="hc-user" prepend-icon="fas fa-download"
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
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>เลขใบรับรอง</div>
              <div class="field-label-en">Certificate No.</div>
            </div>
            <v-text-field
              v-model="searchCert"
              placeholder="ค้นหาเลขใบรับรอง"
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
              <div>เลขคำขอ</div>
              <div class="field-label-en">Request No.</div>
            </div>
            <v-text-field
              v-model="searchRequest"
              placeholder="ค้นหาเลขคำขอ"
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
              <div>ประเภทใบรับรอง</div>
              <div class="field-label-en">Certificate Type</div>
            </div>
            <v-autocomplete
              v-model="filterCertType"
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
                color="hc-user"
                show-adjacent-months
                :hide-header="!expireFromObj"
                title="วันหมดอายุ (ตั้งแต่)"
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
                color="hc-user"
                show-adjacent-months
                :hide-header="!expireToObj"
                title="วันหมดอายุ (จนถึง)"
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
      <v-data-table :headers="headers" :items="filteredItems" hover>
        <template #header.certNo="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                เลขใบรับรอง
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
        <template #header.issueDate="{ column, isSorted, getSortIcon }">
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
        <template #header.expireDate="{ column, isSorted, getSortIcon }">
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
        <template #header.status="{ column, isSorted, getSortIcon }">
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
          <span class="text-body-2 font-weight-medium text-hc-user">{{
            item.certNo
          }}</span>
        </template>
        <template #item.certType="{ item }">
          <v-chip size="x-small" color="hc-user" variant="tonal">
            {{
              item.certType === "All"
                ? "คลุมทั้งการส่งออก"
                : "แต่ละรายการส่งออก"
            }}
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
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="hc-user"
                  @click.stop="router.push({ name: 'HCUserCertificateDetail', params: { id: item.certNo } })"
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
                  :disabled="item.status === 'expired'"
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
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";

const router = useRouter();

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const searchCert = ref("");
const searchRequest = ref("");
const filterCertType = ref(null);
const filterStatus = ref(null);

const expireFromMenu = ref(false);
const expireFromObj = ref(null);
const expireToMenu = ref(false);
const expireToObj = ref(null);

const filterExpireFrom = ref("");
const filterExpireTo = ref("");

function dateToBE(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const expireFromBE = computed(() => dateToBE(expireFromObj.value));
const expireToBE = computed(() => dateToBE(expireToObj.value));

function beDateToTs(str) {
  if (!str) return 0;
  const parts = str.split(" ");
  // รูปแบบ "10 ม.ค. 68" → แปลงเป็น timestamp
  const monthMap = {
    "ม.ค.": 0,
    "ก.พ.": 1,
    "มี.ค.": 2,
    "เม.ย.": 3,
    "พ.ค.": 4,
    "มิ.ย.": 5,
    "ก.ค.": 6,
    "ส.ค.": 7,
    "ก.ย.": 8,
    "ต.ค.": 9,
    "พ.ย.": 10,
    "ธ.ค.": 11,
  };
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = monthMap[parts[1]] ?? 0;
    const year = parseInt(parts[2]) + 2500 - 543; // พ.ศ. 2-digit → ค.ศ.
    return new Date(year, month, day).getTime();
  }
  return 0;
}

watch(expireFromObj, (v) => {
  filterExpireFrom.value = v ? v.toISOString().slice(0, 10) : "";
});
watch(expireToObj, (v) => {
  filterExpireTo.value = v ? v.toISOString().slice(0, 10) : "";
});

const certTypeOptions = [
  { label: "คลุมทั้งการส่งออก", value: "All" },
  { label: "แต่ละรายการส่งออก", value: "Some" },
];

const statusOptions = [
  { label: "มีผล", value: "active" },
  { label: "ใกล้หมดอายุ", value: "expiring" },
  { label: "หมดอายุ", value: "expired" },
];

const allItems = [
  {
    certNo: "HC-2569-00025",
    requestNo: "HC-00025",
    certType: "Some",
    product: "มังคุด",
    destination: "จีน",
    issueDate: "10 ม.ค. 68",
    expireDate: "10 ม.ค. 69",
    status: "active",
  },
  {
    certNo: "HC-2569-00022",
    requestNo: "HC-00022",
    certType: "Some",
    product: "กล้วยหอม",
    destination: "ญี่ปุ่น",
    issueDate: "8 ม.ค. 68",
    expireDate: "8 ม.ค. 69",
    status: "active",
  },
  {
    certNo: "HC-2569-00018",
    requestNo: "HC-00018",
    certType: "Some",
    product: "มะม่วง",
    destination: "ญี่ปุ่น",
    issueDate: "20 ธ.ค. 67",
    expireDate: "20 ธ.ค. 68",
    status: "expiring",
  },
  {
    certNo: "HC-2569-00098",
    requestNo: "HC-00098",
    certType: "All",
    product: "ลำไย",
    destination: "จีน",
    issueDate: "5 ม.ค. 67",
    expireDate: "5 ม.ค. 68",
    status: "expired",
  },
  {
    certNo: "HC-2569-00030",
    requestNo: "HC-00030",
    certType: "All",
    product: "ทุเรียน",
    destination: "เกาหลีใต้",
    issueDate: "15 ม.ค. 68",
    expireDate: "15 ม.ค. 69",
    status: "active",
  },
  {
    certNo: "HC-2569-00015",
    requestNo: "HC-00015",
    certType: "All",
    product: "ส้มโอ",
    destination: "สิงคโปร์",
    issueDate: "10 ธ.ค. 67",
    expireDate: "10 ธ.ค. 68",
    status: "active",
  },
  {
    certNo: "HC-2569-00080",
    requestNo: "HC-00080",
    certType: "All",
    product: "กระเทียม",
    destination: "เกาหลีใต้",
    issueDate: "1 มิ.ย. 67",
    expireDate: "1 มิ.ย. 68",
    status: "expired",
  },
];

const productOptions = [...new Set(allItems.map((i) => i.product))];

const stats = computed(() => [
  {
    label: "ทั้งหมด",
    icon: "fas fa-certificate",
    color: "hc-user",
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
  if (searchCert.value) {
    const q = searchCert.value.toLowerCase();
    items = items.filter((i) => i.certNo.toLowerCase().includes(q));
  }
  if (searchRequest.value) {
    const q = searchRequest.value.toLowerCase();
    items = items.filter((i) => i.requestNo.toLowerCase().includes(q));
  }
  if (filterCertType.value)
    items = items.filter((i) => i.certType === filterCertType.value);
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
  searchCert.value = "";
  searchRequest.value = "";
  filterCertType.value = null;
  filterStatus.value = null;
  expireFromObj.value = null;
  expireToObj.value = null;
}

const headers = [
  { title: "เลขใบรับรอง", key: "certNo", sortable: true },
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ประเภทใบรับรอง", key: "certType", sortable: true },
  { title: "วันที่ออก", key: "issueDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
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
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
