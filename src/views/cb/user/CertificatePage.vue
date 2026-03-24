<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ใบรับรอง CB</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการใบรับรองหน่วยรับรองโรงงานผลิตสินค้าพืชของคุณ
        </p>
      </div>
      <v-btn variant="tonal" color="cb-user" prepend-icon="fas fa-download"
        >ส่งออก Excel</v-btn
      >
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
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
              <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">
                {{ s.value }}
              </div>
              <div class="text-caption text-medium-emphasis">{{ s.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5">
            <div class="field-label">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาชื่อหน่วยรับรอง"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label">
              <div>ประเภทใบรับรอง</div>
              <div class="field-label-en">Certificate Type</div>
            </div>
            <v-autocomplete
              v-model="filterCertType"
              :items="certTypeOptions"
              placeholder="ทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
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

    <!-- Chip tabs -->
    <v-chip-group v-model="activeTab" class="mb-4" mandatory>
      <v-chip value="all" color="cb-user" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge
          :content="allItems.length"
          inline
          color="cb-user"
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
        :items="filteredItems"
        :search="search"
        hover
      >
        <template #item.cbName="{ item }">
          <span class="text-body-2 font-weight-medium text-cb-user">{{
            item.cbName
          }}</span>
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
            <v-btn
              size="small"
              variant="text"
              color="cb-user"
              icon="fas fa-eye"
              @click.stop="viewCert(item)"
            />
            <v-btn
              size="small"
              variant="text"
              color="success"
              icon="fas fa-download"
              :disabled="item.status === 'expired'"
              @click.stop="downloadCert(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="560">
      <v-card rounded="xl">
        <v-card-title
          class="pa-5 pb-3 d-flex align-center justify-space-between text-body-1 font-weight-bold"
        >
          <span
            ><v-icon
              icon="fas fa-certificate"
              color="cb-user"
              class="mr-2"
              size="18"
            />รายละเอียดใบรับรอง</span
          >
          <v-chip
            v-if="selectedCert"
            :color="statusColor(selectedCert.status)"
            size="small"
            variant="tonal"
            >{{ statusLabel(selectedCert.status) }}</v-chip
          >
        </v-card-title>
        <v-divider />
        <v-card-text v-if="selectedCert" class="pa-5">
          <v-row dense>
            <v-col cols="12" sm="6"
              ><div class="info-label">ประเภท</div>
              <div class="info-value">{{ selectedCert.certType }}</div></v-col
            >
            <v-col cols="12"
              ><div class="info-label">ชื่อหน่วยรับรอง</div>
              <div class="info-value">{{ selectedCert.cbName }}</div></v-col
            >
            <v-col cols="12" sm="6"
              ><div class="info-label">วันที่ออก</div>
              <div class="info-value">{{ selectedCert.issueDate }}</div></v-col
            >
            <v-col cols="12" sm="6"
              ><div class="info-label">วันหมดอายุ</div>
              <div class="info-value">{{ selectedCert.expireDate }}</div></v-col
            >
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="closeViewDialog"
            >ปิด</v-btn
          >
          <v-btn
            color="cb-user"
            rounded="lg"
            prepend-icon="fas fa-download"
            @click="downloadCert(selectedCert)"
            >ดาวน์โหลด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const filterCertType = ref(null);
const activeTab = ref("all");

const certTypeOptions = ["CB"];

const allItems = [
  {
    id: "cert-001",
    cbName: "บ.ไทยเซอร์ติฟาย จก.",
    certType: "CB",
    issueDate: "18/02/2566",
    expireDate: "18/02/2569",
    status: "active",
  },
  {
    id: "cert-002",
    cbName: "บ.สยามแล็บ จก.",
    certType: "CB",
    issueDate: "01/06/2564",
    expireDate: "01/06/2569",
    status: "expired",
  },
];

const stats = computed(() => [
  {
    label: "ทั้งหมด",
    icon: "fas fa-certificate",
    color: "primary",
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
  if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);
  if (filterCertType.value)
    items = items.filter((i) => i.certType === filterCertType.value);
  return items;
});

function clearFilters() {
  search.value = "";
  filterCertType.value = null;
  activeTab.value = "all";
}

const headers = [
  { title: "ชื่อหน่วยรับรอง", key: "cbName", sortable: true },
  { title: "ประเภท", key: "certType", sortable: false },
  { title: "วันที่ออก", key: "issueDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const viewDialog = ref(false);
function closeViewDialog() {
  viewDialog.value = false;
}
const selectedCert = ref(null);
function viewCert(item) {
  selectedCert.value = item;
  viewDialog.value = true;
}
function downloadCert(_item) {
  /* mock */
}

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
.info-label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
}
.info-value {
  font-size: 14px;
  font-weight: 500;
}
</style>
