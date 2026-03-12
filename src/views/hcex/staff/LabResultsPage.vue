<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">ผลการทดสอบ Lab</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          จัดการผลการทดสอบห้องปฏิบัติการและคำขอจากผู้ประกอบการ
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="mainTab" color="hcex-staff" class="mb-4">
      <v-tab value="reviewed">
        <v-icon start icon="fas fa-flask-vial" size="14" />
        ผล Lab ที่พิจารณาแล้ว
      </v-tab>
      <v-tab value="requests">
        <v-icon start icon="fas fa-vial" size="14" />
        คำขอผล Lab จากผู้ประกอบการ
        <v-badge
          v-if="pendingRequestCount > 0"
          :content="pendingRequestCount"
          color="error"
          inline
          class="ml-2"
        />
      </v-tab>
    </v-tabs>

    <v-window v-model="mainTab">
      <!-- Tab 1: ผล Lab ที่พิจารณาแล้ว -->
      <v-window-item value="reviewed">
        <!-- Filters -->
        <v-card class="mb-4">
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="search"
                  label="ค้นหาเลขที่ผล Lab / ชนิดสินค้า"
                  prepend-inner-icon="fas fa-search"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-select
                  v-model="filterStatus"
                  label="สถานะ"
                  :items="statusOptions"
                  item-title="label"
                  item-value="value"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field
                  v-model="filterDateFrom"
                  label="วันที่ทดสอบ (จาก)"
                  type="date"
                  hide-details
                />
              </v-col>
              <v-col cols="auto" class="d-flex align-self-center">
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
            <template #item.labNo="{ item }">
              <span class="text-body-2 font-weight-medium text-warning">{{ item.labNo }}</span>
            </template>
            <template #item.result="{ item }">
              <v-chip
                size="x-small"
                :color="item.result === 'ผ่าน' ? 'success' : item.result === 'ไม่ผ่าน' ? 'error' : 'warning'"
                variant="tonal"
              >
                {{ item.result }}
              </v-chip>
            </template>
            <template #item.status="{ item }">
              <v-chip
                size="small"
                :color="getStatusColor(item.status)"
                variant="tonal"
                :prepend-icon="getStatusIcon(item.status)"
              >
                {{ getStatusLabel(item.status) }}
              </v-chip>
            </template>
            <template #item.actions="{ item }">
              <v-btn
                v-if="item.status === 'pending'"
                size="small"
                variant="tonal"
                color="hcex-staff"
                prepend-icon="fas fa-gavel"
                @click="openReviewDialog(item)"
              >
                พิจารณา
              </v-btn>
              <v-btn
                v-else
                size="small"
                variant="text"
                color="grey"
                prepend-icon="fas fa-eye"
                @click="openReviewDialog(item)"
              >
                ดูรายละเอียด
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- Tab 2: คำขอผล Lab จากผู้ประกอบการ -->
      <v-window-item value="requests">
        <!-- Filter -->
        <v-card class="mb-4">
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="requestSearch"
                  label="ค้นหาเลขคำขอ / ผู้ประกอบการ / ชนิดสินค้า"
                  prepend-inner-icon="fas fa-search"
                  clearable
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Table -->
        <v-card>
          <v-data-table
            :headers="requestHeaders"
            :items="filteredRequests"
            hover
          >
            <template #item.requestNo="{ item }">
              <span class="text-body-2 font-weight-medium text-warning">{{ item.requestNo }}</span>
            </template>
            <template #item.status="{ item }">
              <v-chip
                size="small"
                :color="getRequestStatusColor(item.status)"
                variant="tonal"
                :prepend-icon="getRequestStatusIcon(item.status)"
              >
                {{ item.status }}
              </v-chip>
            </template>
            <template #item.actions="{ item }">
              <v-btn
                v-if="item.status === 'รอดำเนินการ'"
                size="small"
                variant="tonal"
                color="hcex-staff"
                prepend-icon="fas fa-circle-check"
                @click="openAcceptDialog(item)"
              >
                รับคำขอ
              </v-btn>
              <v-btn
                v-else
                size="small"
                variant="text"
                color="grey"
                prepend-icon="fas fa-eye"
              >
                ดูรายละเอียด
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Review Dialog -->
    <v-dialog v-model="reviewDialog" max-width="560" persistent>
      <v-card rounded="xl" v-if="selectedLab">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-flask-vial" color="hcex-staff" size="18" />
          <span class="text-body-1 font-weight-bold">พิจารณาผล Lab</span>
          <v-spacer />
          <v-btn icon="fas fa-xmark" variant="text" size="small" @click="reviewDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <!-- Lab Info -->
          <div class="lab-info-box mb-5">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">เลขที่ผล Lab</span>
                <span class="info-value text-warning font-weight-bold">{{ selectedLab.labNo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ชนิดสินค้า</span>
                <span class="info-value">{{ selectedLab.productType }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">วันที่ทดสอบ</span>
                <span class="info-value">{{ selectedLab.testDate }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ผลการทดสอบ</span>
                <v-chip
                  size="x-small"
                  :color="selectedLab.result === 'ผ่าน' ? 'success' : selectedLab.result === 'ไม่ผ่าน' ? 'error' : 'warning'"
                  variant="tonal"
                >
                  {{ selectedLab.result }}
                </v-chip>
              </div>
              <div class="info-item">
                <span class="info-label">ห้องปฏิบัติการ</span>
                <span class="info-value">{{ selectedLab.labName }}</span>
              </div>
            </div>
          </div>

          <!-- Decision -->
          <div class="field-label mb-2">ผลการพิจารณา <span class="req">*</span></div>
          <v-radio-group v-model="decision" class="mb-4">
            <v-radio value="pass" color="success">
              <template #label>
                <div>
                  <div class="text-body-2 font-weight-medium">ผ่าน</div>
                  <div class="text-caption text-medium-emphasis">ผล Lab เป็นไปตามเกณฑ์ที่กำหนด</div>
                </div>
              </template>
            </v-radio>
            <v-radio value="fail" color="error">
              <template #label>
                <div>
                  <div class="text-body-2 font-weight-medium">ไม่ผ่าน</div>
                  <div class="text-caption text-medium-emphasis">ผล Lab ไม่เป็นไปตามเกณฑ์ที่กำหนด</div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <div class="field-label mb-2">หมายเหตุ</div>
          <v-textarea
            v-model="reviewNote"
            placeholder="ระบุหมายเหตุหรือเหตุผลประกอบการพิจารณา"
            rows="3"
            hide-details
          />
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" @click="reviewDialog = false">
            ยกเลิก
          </v-btn>
          <v-spacer />
          <v-btn color="hcex-staff" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="confirmReview">
            ยืนยันการพิจารณา
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Accept Lab Request Dialog -->
    <v-dialog v-model="acceptDialog" max-width="420" persistent>
      <v-card rounded="xl" v-if="selectedRequest">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-vial" color="hcex-staff" size="18" />
          <span class="text-body-1 font-weight-bold">รับคำขอผล Lab</span>
          <v-spacer />
          <v-btn icon="fas fa-xmark" variant="text" size="small" @click="acceptDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="lab-info-box mb-4">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">เลขคำขอ Lab</span>
                <span class="info-value text-warning font-weight-bold">{{ selectedRequest.requestNo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ผู้ประกอบการ</span>
                <span class="info-value">{{ selectedRequest.operator }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ชนิดสินค้า</span>
                <span class="info-value">{{ selectedRequest.productType }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">วันที่ขอ</span>
                <span class="info-value">{{ selectedRequest.requestDate }}</span>
              </div>
            </div>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ยืนยันการรับคำขอทดสอบ Lab สำหรับรายการนี้ใช่หรือไม่? ระบบจะเปลี่ยนสถานะเป็น "กำลังดำเนินการ"
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" @click="acceptDialog = false">
            ยกเลิก
          </v-btn>
          <v-spacer />
          <v-btn color="hcex-staff" rounded="lg" prepend-icon="fas fa-circle-check" @click="confirmAccept">
            ยืนยันรับคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const mainTab = ref("reviewed");
const search = ref("");
const filterStatus = ref<string | null>(null);
const filterDateFrom = ref("");
const activeTab = ref<string>("all");
const reviewDialog = ref(false);
const decision = ref("pass");
const reviewNote = ref("");
const requestSearch = ref("");
const acceptDialog = ref(false);

interface LabResult {
  id: string;
  labNo: string;
  productType: string;
  testDate: string;
  result: string;
  status: string;
  labName: string;
}

interface LabRequest {
  id: string;
  requestNo: string;
  operator: string;
  productType: string;
  requestDate: string;
  status: string;
}

const selectedLab = ref<LabResult | null>(null);
const selectedRequest = ref<LabRequest | null>(null);

function openReviewDialog(item: LabResult) {
  selectedLab.value = item;
  decision.value = "pass";
  reviewNote.value = "";
  reviewDialog.value = true;
}

function confirmReview() {
  if (selectedLab.value) {
    selectedLab.value.status = decision.value === "pass" ? "passed" : "failed";
  }
  reviewDialog.value = false;
}

function openAcceptDialog(item: LabRequest) {
  selectedRequest.value = item;
  acceptDialog.value = true;
}

function confirmAccept() {
  if (selectedRequest.value) {
    selectedRequest.value.status = "กำลังดำเนินการ";
  }
  acceptDialog.value = false;
}

function clearFilters() {
  search.value = "";
  filterStatus.value = null;
  filterDateFrom.value = "";
  activeTab.value = "all";
}

const statusOptions = [
  { label: "รอพิจารณา", value: "pending" },
  { label: "ผ่าน", value: "passed" },
  { label: "ไม่ผ่าน", value: "failed" },
];

const labResults: LabResult[] = [
  {
    id: "lab-001",
    labNo: "LAB-2568-00089",
    productType: "มันฝรั่งทอดกรอบ",
    testDate: "8 ม.ค. 2568",
    result: "ผ่าน",
    status: "pending",
    labName: "ห้องปฏิบัติการกลาง กรมวิทยาศาสตร์การแพทย์",
  },
  {
    id: "lab-002",
    labNo: "LAB-2568-00085",
    productType: "ข้าวกล้องบรรจุสุญญากาศ",
    testDate: "7 ม.ค. 2568",
    result: "ผ่าน",
    status: "pending",
    labName: "ห้องปฏิบัติการกลาง กรมวิทยาศาสตร์การแพทย์",
  },
  {
    id: "lab-003",
    labNo: "LAB-2568-00080",
    productType: "ผักแปรรูปอบแห้ง",
    testDate: "5 ม.ค. 2568",
    result: "ผ่าน",
    status: "passed",
    labName: "ศูนย์วิทยาศาสตร์การแพทย์ที่ 1",
  },
  {
    id: "lab-004",
    labNo: "LAB-2568-00075",
    productType: "ผลไม้กระป๋อง",
    testDate: "3 ม.ค. 2568",
    result: "ไม่ผ่าน",
    status: "failed",
    labName: "ศูนย์วิทยาศาสตร์การแพทย์ที่ 3",
  },
  {
    id: "lab-005",
    labNo: "LAB-2568-00070",
    productType: "น้ำผลไม้แปรรูป",
    testDate: "28 ธ.ค. 2567",
    result: "ผ่าน",
    status: "passed",
    labName: "ห้องปฏิบัติการกลาง กรมวิทยาศาสตร์การแพทย์",
  },
  {
    id: "lab-006",
    labNo: "LAB-2568-00065",
    productType: "พืชสมุนไพรแห้ง",
    testDate: "25 ธ.ค. 2567",
    result: "ผ่าน",
    status: "pending",
    labName: "ศูนย์วิทยาศาสตร์การแพทย์ที่ 2",
  },
];

const labRequests = ref<LabRequest[]>([
  {
    id: "req-001",
    requestNo: "LAB-REQ-2568-001",
    operator: "บ.ไทยฟู้ดโปรเซส จก.",
    productType: "มันฝรั่งทอดกรอบ",
    requestDate: "8 ม.ค. 68",
    status: "รอดำเนินการ",
  },
  {
    id: "req-002",
    requestNo: "LAB-REQ-2568-002",
    operator: "บ.สยามแปรรูป จก.",
    productType: "แป้งมันสำปะหลัง",
    requestDate: "9 ม.ค. 68",
    status: "รอดำเนินการ",
  },
  {
    id: "req-003",
    requestNo: "LAB-REQ-2568-003",
    operator: "บ.กรีนโปรดักส์ จก.",
    productType: "พริกแห้งบด",
    requestDate: "10 ม.ค. 68",
    status: "กำลังดำเนินการ",
  },
]);

const pendingRequestCount = computed(
  () => labRequests.value.filter((r) => r.status === "รอดำเนินการ").length,
);

const statusTabs = computed(() => [
  { label: "ทั้งหมด", value: "all", color: "default", icon: "fas fa-list", count: 0 },
  {
    label: "รอพิจารณา",
    value: "pending",
    color: "hcex-staff",
    icon: "fas fa-hourglass-half",
    count: labResults.filter((l) => l.status === "pending").length,
  },
  { label: "ผ่าน", value: "passed", color: "success", icon: "fas fa-circle-check", count: 0 },
  { label: "ไม่ผ่าน", value: "failed", color: "error", icon: "fas fa-circle-xmark", count: 0 },
]);

const filteredItems = computed(() => {
  let items = labResults;
  if (filterStatus.value) items = items.filter((i) => i.status === filterStatus.value);
  if (activeTab.value !== "all") items = items.filter((i) => i.status === activeTab.value);
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.labNo.toLowerCase().includes(q) || i.productType.toLowerCase().includes(q),
    );
  }
  return items;
});

const filteredRequests = computed(() => {
  let items = labRequests.value;
  if (requestSearch.value) {
    const q = requestSearch.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.requestNo.toLowerCase().includes(q) ||
        i.operator.toLowerCase().includes(q) ||
        i.productType.toLowerCase().includes(q),
    );
  }
  return items;
});

const headers = [
  { title: "เลขที่ผล Lab", key: "labNo", width: 170 },
  { title: "ชนิดสินค้า", key: "productType", width: 200 },
  { title: "วันที่ทดสอบ", key: "testDate", width: 130 },
  { title: "ผลการทดสอบ", key: "result", width: 120 },
  { title: "สถานะ", key: "status", width: 140 },
  { title: "", key: "actions", width: 150, sortable: false },
];

const requestHeaders = [
  { title: "เลขคำขอ Lab", key: "requestNo", width: 180 },
  { title: "ผู้ประกอบการ", key: "operator", width: 200 },
  { title: "ชนิดสินค้า", key: "productType", width: 180 },
  { title: "วันที่ขอ", key: "requestDate", width: 120 },
  { title: "สถานะ", key: "status", width: 160 },
  { title: "", key: "actions", width: 150, sortable: false },
];

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    pending: "warning",
    passed: "success",
    failed: "error",
  };
  return m[s] ?? "grey";
}
function getStatusIcon(s: string) {
  const m: Record<string, string> = {
    pending: "fas fa-hourglass-half",
    passed: "fas fa-circle-check",
    failed: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    pending: "รอพิจารณา",
    passed: "ผ่าน",
    failed: "ไม่ผ่าน",
  };
  return m[s] ?? s;
}

function getRequestStatusColor(s: string) {
  const m: Record<string, string> = {
    "รอดำเนินการ": "warning",
    "กำลังดำเนินการ": "info",
    "เสร็จสิ้น": "success",
  };
  return m[s] ?? "grey";
}
function getRequestStatusIcon(s: string) {
  const m: Record<string, string> = {
    "รอดำเนินการ": "fas fa-hourglass-half",
    "กำลังดำเนินการ": "fas fa-spinner",
    "เสร็จสิ้น": "fas fa-circle-check",
  };
  return m[s] ?? "fas fa-circle";
}
</script>

<style scoped>
.lab-info-box {
  border: 1px solid rgba(var(--v-theme-hcex-staff), 0.3);
  border-radius: 12px;
  padding: 16px;
  background: rgba(var(--v-theme-hcex-staff), 0.04);
}
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
}
.req {
  color: rgb(var(--v-theme-error));
}
</style>
