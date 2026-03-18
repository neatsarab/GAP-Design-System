<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/hcex/user/applications')"
      />
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">
          {{ app.requestNo }}
        </h1>
        <div class="d-flex align-center ga-2">
          <v-chip size="small" color="hcex-user" variant="tonal">{{
            app.certType
          }}</v-chip>
          <v-chip
            size="small"
            :color="getStatusColor(app.status)"
            variant="tonal"
            :prepend-icon="getStatusIcon(app.status)"
          >
            {{ getStatusLabel(app.status) }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Step Tracker -->
    <v-card class="mb-5 pa-4">
      <div class="step-bar">
        <div
          v-for="(step, idx) in workflowSteps"
          :key="step.key"
          class="step-item"
          :class="{
            'step-item--done': currentStepIndex > idx,
            'step-item--active': currentStepIndex === idx,
            'step-item--pending': currentStepIndex < idx,
          }"
        >
          <div class="step-dot">
            <v-icon
              v-if="currentStepIndex > idx"
              icon="fas fa-check"
              size="11"
            />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span class="step-label text-caption">{{ step.label }}</span>
          <div v-if="idx < workflowSteps.length - 1" class="step-line" />
        </div>
      </div>
    </v-card>

    <!-- Application Info -->
    <v-row class="mb-2">
      <v-col cols="12" md="6">
        <!-- ผู้ส่งออก -->
        <v-card class="mb-4">
          <v-card-title
            class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-building" color="hcex-user" size="16" />
            ผู้ส่งออก (Exporter)
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อบริษัท</span>
                <span class="info-value">{{ app.exporterName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่</span>
                <span class="info-value">{{ app.exporterAddress }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ประเทศ</span>
                <span class="info-value">ไทย</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ผู้รับสินค้า -->
        <v-card class="mb-4">
          <v-card-title
            class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-user-tie" color="hcex-user" size="16" />
            ผู้รับสินค้า (Consignee)
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อ</span>
                <span class="info-value">{{ app.consigneeName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่</span>
                <span class="info-value">{{ app.consigneeAddress }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ประเทศปลายทาง</span>
                <span class="info-value text-hcex-user font-weight-medium">{{
                  app.destination
                }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <!-- ข้อมูลการขนส่ง -->
        <v-card class="mb-4">
          <v-card-title
            class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-ship" color="hcex-user" size="16" />
            ข้อมูลการขนส่ง
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">วันที่ส่งสินค้า</span>
                <span class="info-value">{{ app.shipDate }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">วิธีการขนส่ง</span>
                <span class="info-value">{{ app.shipMethod }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ท่าเรือต้นทาง</span>
                <span class="info-value">{{ app.portOfLoading }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ผล Lab ที่เลือก -->
        <v-card class="mb-4">
          <v-card-title
            class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-flask-vial" color="hcex-user" size="16" />
            ผล Lab ที่เลือก
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <v-chip
              v-for="lab in app.selectedLabs"
              :key="lab"
              size="small"
              color="success"
              variant="tonal"
              class="mr-2 mb-2"
              prepend-icon="fas fa-circle-check"
            >
              {{ lab }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- รายละเอียดสินค้า -->
    <v-card class="mb-5">
      <v-card-title
        class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-box" color="hcex-user" size="16" />
        รายละเอียดสินค้า
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <v-table density="comfortable">
          <thead>
            <tr>
              <th>Shipping Mark</th>
              <th>Description of Goods</th>
              <th>Quantity</th>
              <th>Net Weight (kg)</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in app.products" :key="p.description">
              <td>{{ p.shippingMark }}</td>
              <td>{{ p.description }}</td>
              <td>{{ p.quantity }}</td>
              <td>{{ p.netWeight }}</td>
              <td>{{ p.totalAmount }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Preview Review Section -->
    <v-card
      v-if="currentStatus === 'preview_review'"
      class="mb-5"
      style="border: 2px solid rgba(var(--v-theme-hcex-user), 0.4)"
    >
      <v-card-title
        class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-file-lines" color="hcex-user" size="16" />
        ยืนยัน Preview ใบรับรอง
        <v-chip size="x-small" color="hcex-user" variant="tonal" class="ml-2"
          >รอการยืนยัน</v-chip
        >
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <!-- Draft Preview Box -->
        <div class="preview-cert-box mb-4">
          <div class="d-flex align-center ga-2 mb-3">
            <v-icon icon="fas fa-industry" color="hcex-user" size="16" />
            <span class="text-body-2 font-weight-bold">แบบร่างใบรับรอง</span>
            <v-chip size="x-small" color="hcex-user" variant="tonal"
              >ร่าง</v-chip
            >
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">เลขที่ใบรับรอง (ร่าง)</span>
              <span class="info-value text-hcex-user font-weight-bold"
                >DRAFT-THHCEX-2568-00012</span
              >
            </div>
            <div class="info-item">
              <span class="info-label">ผู้ส่งออก</span>
              <span class="info-value">{{ app.exporterName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ผู้รับสินค้า</span>
              <span class="info-value">{{ app.consigneeName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ประเทศปลายทาง</span>
              <span class="info-value">{{ app.destination }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">วันที่ส่งสินค้า</span>
              <span class="info-value">{{ app.shipDate }}</span>
            </div>
          </div>
        </div>

        <v-alert
          color="hcex-user"
          variant="tonal"
          density="compact"
          prepend-icon="fas fa-triangle-exclamation"
          class="mb-4"
        >
          กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน
        </v-alert>

        <div class="d-flex ga-3 flex-wrap">
          <v-btn
            variant="tonal"
            color="error"
            prepend-icon="fas fa-rotate-left"
          >
            ขอแก้ไขข้อมูล
          </v-btn>
          <v-spacer />
          <v-btn
            color="hcex-user"
            prepend-icon="fas fa-circle-check"
            @click="confirmPreviewDialog = true"
          >
            ยืนยันข้อมูลถูกต้อง
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Pending Payment Section -->
    <v-card
      v-if="currentStatus === 'pending_payment'"
      class="mb-5"
      style="border: 2px solid rgba(var(--v-theme-hcex-user), 0.4)"
    >
      <v-card-title
        class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-money-bill-wave" color="hcex-user" size="16" />
        ชำระค่าธรรมเนียม
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <div class="info-grid mb-4">
          <div class="info-item">
            <span class="info-label">ค่าธรรมเนียมใบรับรอง</span>
            <span class="info-value text-hcex-user font-weight-bold"
              >500 บาท</span
            >
          </div>
          <div class="info-item">
            <span class="info-label">ช่องทางชำระ</span>
            <span class="info-value">โอนเงินผ่านระบบ KTB</span>
          </div>
        </div>
        <v-btn color="hcex-user" prepend-icon="fas fa-credit-card">
          ชำระค่าธรรมเนียม
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Timeline -->
    <v-card class="mb-5">
      <v-card-title
        class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-clock-rotate-left" color="hcex-user" size="16" />
        ประวัติสถานะ
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <v-timeline density="compact" side="end">
          <v-timeline-item
            v-for="entry in app.history"
            :key="entry.date"
            :dot-color="entry.color"
            size="small"
          >
            <template #icon>
              <v-icon :icon="entry.icon" size="12" />
            </template>
            <div class="d-flex align-center ga-2 flex-wrap">
              <span class="text-body-2 font-weight-medium">{{
                entry.label
              }}</span>
              <v-chip size="x-small" :color="entry.color" variant="tonal">{{
                entry.status
              }}</v-chip>
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ entry.date }}
            </div>
            <div
              v-if="entry.note"
              class="text-caption text-medium-emphasis mt-1"
            >
              {{ entry.note }}
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>

    <!-- Action Buttons -->
    <div class="d-flex ga-3 justify-end">
      <v-btn
        v-if="isApprovedOrCompleted"
        color="hcex-user"
        prepend-icon="fas fa-download"
        rounded="lg"
      >
        ดาวน์โหลดใบรับรอง
      </v-btn>
      <v-btn
        v-if="app.status === 'rejected'"
        color="error"
        variant="tonal"
        prepend-icon="fas fa-file-pen"
        rounded="lg"
        @click="router.push('/hcex/user/applications/new')"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Confirm Preview Dialog -->
    <v-dialog v-model="confirmPreviewDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="hcex-user-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" size="28" color="hcex-user" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยัน Preview ใบรับรอง</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ยืนยันว่าข้อมูลใน Preview ใบรับรอง
            <strong class="text-hcex-user">DRAFT-THHCEX-2568-00012</strong>
            ถูกต้องแล้วใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="confirmPreviewDialog = false"
          >
            ยกเลิก
          </v-btn>
          <v-btn color="hcex-user" rounded="lg" block @click="doConfirmPreview">
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Preview Dialog -->
    <v-dialog v-model="successPreviewDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" size="40" color="success" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยัน Preview สำเร็จ!</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ระบบจะส่งให้ผู้มีอำนาจลงนามต่อไป
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="hcex-user"
            rounded="lg"
            block
            @click="successPreviewDialog = false"
          >
            ตกลง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const confirmPreviewDialog = ref(false);
const successPreviewDialog = ref(false);

function doConfirmPreview() {
  confirmPreviewDialog.value = false;
  successPreviewDialog.value = true;
}

interface Product {
  shippingMark: string;
  description: string;
  quantity: string;
  netWeight: string;
  totalAmount: string;
}

interface HistoryEntry {
  label: string;
  status: string;
  date: string;
  note?: string;
  color: string;
  icon: string;
}

interface AppDetail {
  id: string;
  requestNo: string;
  certType: string;
  status: string;
  exporterName: string;
  exporterAddress: string;
  consigneeName: string;
  consigneeAddress: string;
  destination: string;
  shipDate: string;
  shipMethod: string;
  portOfLoading: string;
  selectedLabs: string[];
  products: Product[];
  history: HistoryEntry[];
}

const app: AppDetail = {
  id: "HCEX-001",
  requestNo: "HCEX-2568-00012",
  certType: "กมพ.1",
  status: "preview_review",
  exporterName: "บริษัท ไทยฟู้ดโปรเซส จำกัด",
  exporterAddress: "123 ถ.สุขุมวิท แขวงพระโขนง กทม. 10260",
  consigneeName: "Nippon Foods Trading Co., Ltd.",
  consigneeAddress:
    "5-10, Shinjuku 1-chome, Shinjuku-ku, Tokyo 160-0001, Japan",
  destination: "ญี่ปุ่น",
  shipDate: "20 ม.ค. 2568",
  shipMethod: "ทางเรือ",
  portOfLoading: "ท่าเรือแหลมฉบัง",
  selectedLabs: ["LAB-2568-00089", "LAB-2568-00085"],
  products: [
    {
      shippingMark: "TFP-JP-001",
      description: "มันฝรั่งทอดกรอบปรุงรส",
      quantity: "500 CTN",
      netWeight: "2,500",
      totalAmount: "USD 12,500",
    },
    {
      shippingMark: "TFP-JP-002",
      description: "ข้าวกล้องบรรจุสุญญากาศ",
      quantity: "200 BAG",
      netWeight: "1,000",
      totalAmount: "USD 4,000",
    },
  ],
  history: [
    {
      label: "ยื่นคำขอ",
      status: "ยื่นแล้ว",
      date: "10 ม.ค. 2568 09:30",
      note: "ยื่นคำขอผ่านระบบออนไลน์",
      color: "hcex-user",
      icon: "fas fa-paper-plane",
    },
    {
      label: "ตรวจสอบเอกสาร",
      status: "อยู่ระหว่างตรวจสอบ",
      date: "11 ม.ค. 2568 10:15",
      note: "เจ้าหน้าที่รับเรื่องและตรวจสอบเอกสาร",
      color: "info",
      icon: "fas fa-magnifying-glass",
    },
    {
      label: "ตรวจสอบเอกสาร",
      status: "ผ่านการตรวจสอบ",
      date: "12 ม.ค. 2568 14:00",
      note: "เอกสารและผล Lab ผ่านการตรวจสอบแล้ว",
      color: "success",
      icon: "fas fa-circle-check",
    },
    {
      label: "ยืนยัน Preview",
      status: "รอยืนยัน",
      date: "13 ม.ค. 2568 10:30",
      note: "เจ้าหน้าที่สร้าง Preview ใบรับรองแล้ว รอผู้ประกอบการยืนยัน",
      color: "hcex-user",
      icon: "fas fa-file-lines",
    },
  ],
};

const currentStatus = app.status;

const workflowSteps = [
  { key: "submit", label: "ยื่นคำขอ" },
  { key: "review", label: "ตรวจสอบเอกสาร" },
  { key: "preview", label: "ยืนยัน Preview" },
  { key: "signing", label: "รอลงนาม" },
  { key: "payment", label: "ชำระค่าธรรมเนียม" },
  { key: "cert", label: "รับใบรับรอง" },
];

const statusStepMap: Record<string, number> = {
  draft: 0,
  submitted: 0,
  under_review: 1,
  preview_review: 2,
  pending_signing: 3,
  pending_payment: 4,
  completed: 5,
  rejected: -1,
};

const currentStepIndex = computed(() => statusStepMap[app.status] ?? 0);

const isApprovedOrCompleted = computed(
  () => app.status === "approved" || app.status === "completed",
);

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    draft: "grey",
    submitted: "hcex-user",
    under_review: "info",
    preview_review: "hcex-user",
    pending_signing: "secondary",
    pending_payment: "hcex-user",
    approved: "success",
    rejected: "error",
    completed: "success",
  };
  return m[s] ?? "grey";
}
function getStatusIcon(s: string) {
  const m: Record<string, string> = {
    draft: "fas fa-pen",
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    preview_review: "fas fa-file-lines",
    pending_signing: "fas fa-signature",
    pending_payment: "fas fa-money-bill-wave",
    approved: "fas fa-circle-check",
    completed: "fas fa-industry",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    draft: "ฉบับร่าง",
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    preview_review: "รอยืนยัน Preview",
    pending_signing: "รอลงนาม",
    pending_payment: "รอชำระค่าธรรมเนียม",
    approved: "อนุมัติแล้ว",
    completed: "รับใบรับรองแล้ว",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>

<style scoped>
.step-bar {
  display: flex;
  align-items: flex-start;
  overflow-x: auto;
}
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  min-width: 70px;
}
.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  z-index: 1;
  flex-shrink: 0;
}
.step-item--done .step-dot {
  background: rgb(var(--v-theme-success));
  color: white;
}
.step-item--active .step-dot {
  background: rgb(var(--v-theme-hcex-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hcex-user), 0.2);
}
.step-item--pending .step-dot {
  background: rgba(var(--v-theme-on-surface), 0.1);
  color: rgba(var(--v-theme-on-surface), 0.4);
}
.step-label {
  margin-top: 6px;
  font-size: 10px;
  text-align: center;
  color: rgba(var(--v-theme-on-surface), 0.6);
  line-height: 1.3;
}
.step-item--active .step-label {
  color: rgb(var(--v-theme-hcex-user));
  font-weight: 600;
}
.step-item--done .step-label {
  color: rgb(var(--v-theme-success));
}
.step-line {
  position: absolute;
  top: 14px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  z-index: 0;
}
.step-item--done .step-line {
  background: rgba(var(--v-theme-success), 0.4);
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

.preview-cert-box {
  border: 1px dashed rgba(var(--v-theme-hcex-user), 0.5);
  border-radius: 12px;
  padding: 16px;
  background: rgba(var(--v-theme-hcex-user), 0.04);
}

.hcex-user-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-hcex-user), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
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
