<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ลงนามใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการใบรับรองสุขอนามัยสินค้าแปรรูปรอการลงนาม
        </p>
      </div>
    </div>

    <!-- Stats Row -->
    <v-row class="mb-5" dense>
      <v-col cols="12" sm="4">
        <v-card rounded="lg">
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div class="stat-icon stat-icon--warning">
              <v-icon icon="fas fa-signature" color="hcex-staff" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold text-warning">{{ pendingCount }}</div>
              <div class="text-caption text-medium-emphasis">รอลงนาม</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="lg">
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div class="stat-icon stat-icon--success">
              <v-icon icon="fas fa-circle-check" color="success" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold text-success">{{ signedTodayCount }}</div>
              <div class="text-caption text-medium-emphasis">ลงนามแล้ววันนี้</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="lg">
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div class="stat-icon stat-icon--default">
              <v-icon icon="fas fa-list" color="grey" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold">{{ allItems.length }}</div>
              <div class="text-caption text-medium-emphasis">รวมทั้งหมด</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="5">
            <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
            <v-text-field
              v-model="search"
              prepend-inner-icon="fas fa-search"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="auto" class="ml-auto d-flex align-self-center">
            <v-btn
              variant="tonal"
              color="grey"
              size="small"
              prepend-icon="fas fa-rotate-left"
              @click="search = ''"
            >
              ล้างตัวกรอง
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Status Chip Tabs -->
    <v-chip-group v-model="activeTab" class="mb-4" mandatory>
      <v-chip
        v-for="tab in statusTabs"
        :key="tab.value"
        :value="tab.value"
        :color="tab.color"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start :icon="tab.icon" size="12" />
        {{ tab.label }}
        <v-badge
          v-if="tab.count > 0"
          :content="tab.count"
          inline
          color="error"
          class="ml-1"
        />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        hover
      >
        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-medium text-warning">{{ item.requestNo }}</span>
        </template>
        <template #item.certType="{ item }">
          <v-chip size="x-small" color="hcex-staff" variant="tonal">{{ item.certType }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip
            size="small"
            :color="item.status === 'pending' ? 'warning' : 'success'"
            variant="tonal"
            :prepend-icon="item.status === 'pending' ? 'fas fa-hourglass-half' : 'fas fa-circle-check'"
          >
            {{ item.status === "pending" ? "รอลงนาม" : "ลงนามแล้ว" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            v-if="item.status === 'pending'"
            size="small"
            variant="tonal"
            color="hcex-staff"
            prepend-icon="fas fa-signature"
            @click="openSignDialog(item)"
          >
            ลงนาม
          </v-btn>
          <v-chip v-else size="x-small" color="success" variant="tonal" prepend-icon="fas fa-check">
            ลงนามแล้ว
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Sign Confirm Dialog -->
    <v-dialog v-model="signDialog" max-width="500" persistent>
      <v-card rounded="xl" v-if="selectedItem">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-signature" color="hcex-staff" size="18" />
          <span class="text-body-1 font-weight-bold">ยืนยันการลงนามใบรับรอง</span>
          <v-spacer />
          <v-btn icon="fas fa-xmark" variant="text" size="small" @click="signDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <!-- Cert Preview -->
          <div class="cert-preview mb-4">
            <div class="cert-preview-header">
              <v-icon icon="fas fa-industry" color="hcex-staff" size="20" class="mb-2" />
              <div class="text-body-2 font-weight-bold">ใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืช</div>
              <div class="text-caption text-medium-emphasis">Health Certificate for Processed Plant Products</div>
            </div>
            <div class="cert-preview-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">เลขที่ใบรับรอง</span>
                  <span class="info-value text-warning font-weight-bold">{{ selectedItem.certNo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ผู้ส่งออก</span>
                  <span class="info-value">{{ selectedItem.exporter }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ผู้รับสินค้า</span>
                  <span class="info-value">{{ selectedItem.consignee }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ประเทศปลายทาง</span>
                  <span class="info-value">{{ selectedItem.destination }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">วันที่ออก</span>
                  <span class="info-value">{{ today }}</span>
                </div>
              </div>
            </div>
          </div>

          <v-alert
            color="hcex-staff"
            variant="tonal"
            density="compact"
            prepend-icon="fas fa-triangle-exclamation"
          >
            <span class="text-body-2">กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนลงนาม การลงนามถือเป็นการยืนยันข้อมูลทั้งหมด</span>
          </v-alert>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" @click="signDialog = false">
            ยกเลิก
          </v-btn>
          <v-spacer />
          <v-btn color="hcex-staff" rounded="lg" prepend-icon="fas fa-signature" @click="confirmSign">
            ยืนยันลงนาม
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" size="40" color="success" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลงนามสำเร็จ!</h3>
          <p class="text-body-2 font-weight-bold text-warning mb-1">{{ lastSignedCertNo }}</p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ใบรับรองได้รับการลงนามและออกให้แก่ผู้ประกอบการเรียบร้อยแล้ว
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 ga-2">
          <v-btn variant="tonal" color="hcex-staff" rounded="lg" block prepend-icon="fas fa-download">
            ดาวน์โหลด PDF
          </v-btn>
          <v-btn color="hcex-staff" rounded="lg" block @click="successDialog = false">
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const search = ref("");
const activeTab = ref<string>("all");
const signDialog = ref(false);
const successDialog = ref(false);
const lastSignedCertNo = ref("");

interface SignItem {
  id: string;
  requestNo: string;
  certNo: string;
  certType: string;
  exporter: string;
  consignee: string;
  destination: string;
  date: string;
  status: string;
}

const selectedItem = ref<SignItem | null>(null);

function openSignDialog(item: SignItem) {
  selectedItem.value = item;
  signDialog.value = true;
}

function confirmSign() {
  if (selectedItem.value) {
    selectedItem.value.status = "signed";
    lastSignedCertNo.value = selectedItem.value.certNo;
  }
  signDialog.value = false;
  successDialog.value = true;
}

const today = computed(() =>
  new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const allItems: SignItem[] = [
  {
    id: "sign-001",
    requestNo: "HCEX-2568-00012",
    certNo: "THHCEX-2568-00012",
    certType: "กมพ.1",
    exporter: "บริษัท ไทยฟู้ดโปรเซส จำกัด",
    consignee: "Nippon Foods Trading Co., Ltd.",
    destination: "ญี่ปุ่น",
    date: "15 ม.ค. 2568",
    status: "pending",
  },
  {
    id: "sign-002",
    requestNo: "HCEX-2568-00011",
    certNo: "THHCEX-2568-00011",
    certType: "กมพ.1-1",
    exporter: "บริษัท เกษตรแปรรูปไทย จำกัด",
    consignee: "Beijing Import Trading Co.",
    destination: "จีน",
    date: "14 ม.ค. 2568",
    status: "pending",
  },
  {
    id: "sign-003",
    requestNo: "HCEX-2568-00010",
    certNo: "THHCEX-2568-00010",
    certType: "กมพ.1",
    exporter: "ห้างหุ้นส่วน สินทวีผลผลิต",
    consignee: "Seoul Food Distribution Ltd.",
    destination: "เกาหลีใต้",
    date: "13 ม.ค. 2568",
    status: "pending",
  },
  {
    id: "sign-004",
    requestNo: "HCEX-2568-00009",
    certNo: "THHCEX-2568-00009",
    certType: "กมพ.1-2",
    exporter: "บริษัท อาหารส่งออกไทย จำกัด",
    consignee: "SG Fresh Market Pte. Ltd.",
    destination: "สิงคโปร์",
    date: "12 ม.ค. 2568",
    status: "signed",
  },
  {
    id: "sign-005",
    requestNo: "HCEX-2568-00008",
    certNo: "THHCEX-2568-00008",
    certType: "กมพ.1-3",
    exporter: "บริษัท ผลิตภัณฑ์พืชไทย จำกัด",
    consignee: "HK Agri Import Ltd.",
    destination: "ฮ่องกง",
    date: "11 ม.ค. 2568",
    status: "signed",
  },
];

const pendingCount = computed(() => allItems.filter((i) => i.status === "pending").length);
const signedTodayCount = computed(() => allItems.filter((i) => i.status === "signed").length);

const statusTabs = computed(() => [
  { label: "ทั้งหมด", value: "all", color: "default", icon: "fas fa-list", count: 0 },
  {
    label: "รอลงนาม",
    value: "pending",
    color: "hcex-staff",
    icon: "fas fa-hourglass-half",
    count: pendingCount.value,
  },
  { label: "ลงนามแล้ว", value: "signed", color: "success", icon: "fas fa-circle-check", count: 0 },
]);

const filteredItems = computed(() => {
  let items = allItems;
  if (activeTab.value !== "all") items = items.filter((i) => i.status === activeTab.value);
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.requestNo.toLowerCase().includes(q) ||
        i.exporter.toLowerCase().includes(q),
    );
  }
  return items;
});

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 170 },
  { title: "ประเภท", key: "certType", width: 110 },
  { title: "ผู้ประกอบการ", key: "exporter", width: 220 },
  { title: "ปลายทาง", key: "destination", width: 120 },
  { title: "วันที่", key: "date", width: 130 },
  { title: "สถานะ", key: "status", width: 140 },
  { title: "", key: "actions", width: 140, sortable: false },
];
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
.stat-icon--warning {
  background: rgba(var(--v-theme-hcex-staff), 0.12);
}
.stat-icon--success {
  background: rgba(var(--v-theme-success), 0.12);
}
.stat-icon--default {
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.cert-preview {
  border: 2px solid rgba(var(--v-theme-hcex-staff), 0.3);
  border-radius: 12px;
  overflow: hidden;
}
.cert-preview-header {
  background: rgba(var(--v-theme-hcex-staff), 0.08);
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid rgba(var(--v-theme-hcex-staff), 0.2);
}
.cert-preview-body {
  padding: 16px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.45);
}
.info-value {
  font-size: 13px;
  font-weight: 500;
}

.success-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(var(--v-theme-success), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
