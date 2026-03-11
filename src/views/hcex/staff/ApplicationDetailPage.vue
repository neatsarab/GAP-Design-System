<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/hcex/staff/applications')"
      />
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">
          รายละเอียดคำขอ {{ appDetail.requestNo }}
        </h1>
        <div class="d-flex align-center ga-2">
          <v-chip size="small" color="warning" variant="tonal">{{ appDetail.certType }}</v-chip>
          <v-chip
            size="small"
            :color="getStatusColor(currentStatus)"
            variant="tonal"
            :prepend-icon="getStatusIcon(currentStatus)"
          >
            {{ getStatusLabel(currentStatus) }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Step Indicator -->
    <v-card class="mb-5 pa-4">
      <div class="step-bar">
        <div
          v-for="(step, idx) in workflowSteps"
          :key="step.key"
          class="step-item"
          :class="{
            'step-item--done': currentWorkflowStep > idx,
            'step-item--active': currentWorkflowStep === idx,
            'step-item--pending': currentWorkflowStep < idx,
          }"
        >
          <div class="step-dot">
            <v-icon v-if="currentWorkflowStep > idx" icon="fas fa-check" size="11" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span class="step-label text-caption">{{ step.label }}</span>
          <div v-if="idx < workflowSteps.length - 1" class="step-line" />
        </div>
      </div>
    </v-card>

    <!-- Step 1: ข้อมูลคำขอ -->
    <div v-if="currentWorkflowStep === 0">
      <v-row>
        <v-col cols="12" md="6">
          <!-- ผู้ส่งออก -->
          <v-card class="mb-4">
            <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
              <v-icon icon="fas fa-building" color="warning" size="16" />
              ผู้ส่งออก (Exporter)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">ชื่อบริษัท</span>
                  <span class="info-value">{{ appDetail.exporterName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ที่อยู่</span>
                  <span class="info-value">{{ appDetail.exporterAddress }}</span>
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
            <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
              <v-icon icon="fas fa-user-tie" color="warning" size="16" />
              ผู้รับสินค้า (Consignee)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">ชื่อ</span>
                  <span class="info-value">{{ appDetail.consigneeName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ที่อยู่</span>
                  <span class="info-value">{{ appDetail.consigneeAddress }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ประเทศปลายทาง</span>
                  <span class="info-value text-warning font-weight-medium">{{ appDetail.destination }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <!-- ข้อมูลการขนส่ง -->
          <v-card class="mb-4">
            <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
              <v-icon icon="fas fa-ship" color="warning" size="16" />
              ข้อมูลการขนส่ง
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">วันที่ส่งสินค้า</span>
                  <span class="info-value">{{ appDetail.shipDate }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">วิธีการขนส่ง</span>
                  <span class="info-value">{{ appDetail.shipMethod }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ท่าเรือต้นทาง</span>
                  <span class="info-value">{{ appDetail.portOfLoading }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- ผล Lab ที่เลือก -->
          <v-card class="mb-4">
            <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
              <v-icon icon="fas fa-flask-vial" color="warning" size="16" />
              ผล Lab ที่เลือก
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-chip
                v-for="lab in appDetail.selectedLabs"
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
        <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
          <v-icon icon="fas fa-box" color="warning" size="16" />
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
              <tr v-for="p in appDetail.products" :key="p.description">
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

      <div class="d-flex ga-3">
        <v-btn variant="tonal" color="error" prepend-icon="fas fa-rotate-left">
          ส่งกลับแก้ไข
        </v-btn>
        <v-spacer />
        <v-btn color="warning" append-icon="fas fa-chevron-right" @click="currentWorkflowStep++">
          ดำเนินการต่อ
        </v-btn>
      </div>
    </div>

    <!-- Step 2: พิจารณาออกใบรับรอง -->
    <div v-if="currentWorkflowStep === 1">
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
          <v-icon icon="fas fa-gavel" color="warning" size="16" />
          พิจารณาออกใบรับรอง
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <div class="field-label mb-2">ผลการพิจารณา <span class="req">*</span></div>
          <v-radio-group v-model="reviewDecision" class="mb-4">
            <v-radio value="issue" color="warning">
              <template #label>
                <div>
                  <div class="text-body-2 font-weight-medium">จัดทำใบรับรอง</div>
                  <div class="text-caption text-medium-emphasis">ดำเนินการออกใบรับรองให้ผู้ประกอบการ</div>
                </div>
              </template>
            </v-radio>
            <v-radio value="draft_review" color="warning">
              <template #label>
                <div>
                  <div class="text-body-2 font-weight-medium">ส่งพิจารณาแบบร่าง</div>
                  <div class="text-caption text-medium-emphasis">จัดทำแบบร่างเพื่อส่งให้ผู้มีอำนาจพิจารณา</div>
                </div>
              </template>
            </v-radio>
            <v-radio value="reject" color="error">
              <template #label>
                <div>
                  <div class="text-body-2 font-weight-medium">ไม่ผ่าน</div>
                  <div class="text-caption text-medium-emphasis">ปฏิเสธคำขอ</div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <div class="field-label mb-2">หมายเหตุ / เหตุผล</div>
          <v-textarea
            v-model="reviewNote"
            placeholder="ระบุหมายเหตุหรือเหตุผลประกอบการพิจารณา"
            rows="3"
            hide-details
          />
        </v-card-text>
      </v-card>
      <div class="d-flex ga-3">
        <v-btn variant="tonal" color="grey" prepend-icon="fas fa-chevron-left" @click="currentWorkflowStep--">
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <v-btn color="warning" prepend-icon="fas fa-floppy-disk" @click="currentWorkflowStep++">
          บันทึก
        </v-btn>
      </div>
    </div>

    <!-- Step 3: พิจารณาแบบร่าง -->
    <div v-if="currentWorkflowStep === 2">
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
          <v-icon icon="fas fa-file-lines" color="warning" size="16" />
          พิจารณาแบบร่างใบรับรอง
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <!-- Draft Certificate Info -->
          <div class="draft-cert-box mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon icon="fas fa-industry" color="warning" size="18" />
              <span class="text-body-2 font-weight-bold">แบบร่างใบรับรอง</span>
              <v-chip size="x-small" color="warning" variant="tonal">ร่าง</v-chip>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">เลขที่ใบรับรอง (ร่าง)</span>
                <span class="info-value text-warning font-weight-medium">DRAFT-HCEX-2568-00012</span>
              </div>
              <div class="info-item">
                <span class="info-label">ผู้ส่งออก</span>
                <span class="info-value">{{ appDetail.exporterName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ปลายทาง</span>
                <span class="info-value">{{ appDetail.destination }}</span>
              </div>
            </div>
          </div>

          <div class="field-label mb-2">ผลการพิจารณาแบบร่าง <span class="req">*</span></div>
          <v-radio-group v-model="draftDecision" class="mb-4">
            <v-radio value="approve" color="success">
              <template #label>
                <span class="text-body-2 font-weight-medium">ผ่าน — ส่งลงนาม</span>
              </template>
            </v-radio>
            <v-radio value="more_review" color="warning">
              <template #label>
                <span class="text-body-2 font-weight-medium">ส่งตรวจเพิ่มเติม</span>
              </template>
            </v-radio>
            <v-radio value="reject" color="error">
              <template #label>
                <span class="text-body-2 font-weight-medium">ไม่ผ่าน</span>
              </template>
            </v-radio>
          </v-radio-group>

          <div class="field-label mb-2">เลือกผู้ลงนาม <span class="req">*</span></div>
          <v-select
            v-model="selectedSigner"
            :items="signers"
            item-title="name"
            item-value="id"
            placeholder="เลือกผู้ลงนาม"
            hide-details
          />
        </v-card-text>
      </v-card>
      <div class="d-flex ga-3">
        <v-btn variant="tonal" color="grey" prepend-icon="fas fa-chevron-left" @click="currentWorkflowStep--">
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <v-btn color="warning" prepend-icon="fas fa-floppy-disk" @click="currentWorkflowStep++">
          บันทึก
        </v-btn>
      </div>
    </div>

    <!-- Step 4: ลงนาม -->
    <div v-if="currentWorkflowStep === 3">
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
          <v-icon icon="fas fa-signature" color="warning" size="16" />
          ลงนามออกใบรับรอง
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <div class="cert-preview mb-5">
            <div class="cert-preview-header">
              <v-icon icon="fas fa-industry" color="warning" size="24" class="mb-2" />
              <div class="text-body-1 font-weight-bold">ใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืช</div>
              <div class="text-caption text-medium-emphasis">Health Certificate for Processed Plant Products</div>
            </div>
            <div class="cert-preview-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">เลขที่ใบรับรอง</span>
                  <span class="info-value text-warning font-weight-bold">THHCEX-2568-00012</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ผู้ส่งออก</span>
                  <span class="info-value">{{ appDetail.exporterName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ผู้รับสินค้า</span>
                  <span class="info-value">{{ appDetail.consigneeName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ประเทศปลายทาง</span>
                  <span class="info-value">{{ appDetail.destination }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">วันที่ออก</span>
                  <span class="info-value">{{ today }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ผู้ลงนาม</span>
                  <span class="info-value">นางสาวสุมาลี วงศ์ไพร</span>
                </div>
              </div>
            </div>
          </div>

          <v-alert color="warning" variant="tonal" density="compact" prepend-icon="fas fa-triangle-exclamation" class="mb-4">
            <span class="text-body-2">กรุณาตรวจสอบข้อมูลในใบรับรองให้ถูกต้องก่อนลงนาม การลงนามถือเป็นการยืนยันข้อมูลทั้งหมด</span>
          </v-alert>
        </v-card-text>
      </v-card>
      <div class="d-flex ga-3">
        <v-btn variant="tonal" color="grey" prepend-icon="fas fa-chevron-left" @click="currentWorkflowStep--">
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <v-btn variant="tonal" color="warning" prepend-icon="fas fa-download">
          ดาวน์โหลด PDF
        </v-btn>
        <v-btn color="warning" prepend-icon="fas fa-signature" @click="signDialog = true">
          ลงนาม
        </v-btn>
      </div>
    </div>

    <!-- Sign Confirm Dialog -->
    <v-dialog v-model="signDialog" max-width="380" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="sign-ring mx-auto mb-4">
            <v-icon icon="fas fa-signature" size="28" color="warning" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการลงนาม</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ยืนยันการลงนามออกใบรับรอง <strong class="text-warning">THHCEX-2568-00012</strong> ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="signDialog = false">
            ยกเลิก
          </v-btn>
          <v-btn color="warning" rounded="lg" block @click="completeSigning">
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
          <h3 class="text-h6 font-weight-bold mb-2">ออกใบรับรองสำเร็จ!</h3>
          <p class="text-body-2 font-weight-bold text-warning mb-1">THHCEX-2568-00012</p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ใบรับรองได้รับการลงนามและออกให้แก่ผู้ประกอบการแล้ว
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 d-flex ga-2">
          <v-btn variant="tonal" color="warning" rounded="lg" block prepend-icon="fas fa-download">
            ดาวน์โหลด PDF
          </v-btn>
          <v-btn color="warning" rounded="lg" block @click="router.push('/hcex/staff/applications')">
            กลับรายการ
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
const currentWorkflowStep = ref(0);
const reviewDecision = ref("issue");
const reviewNote = ref("");
const draftDecision = ref("approve");
const selectedSigner = ref<string | null>(null);
const signDialog = ref(false);
const successDialog = ref(false);

const workflowSteps = [
  { key: "info", label: "ข้อมูลคำขอ" },
  { key: "review", label: "พิจารณาออกใบรับรอง" },
  { key: "draft", label: "พิจารณาแบบร่าง" },
  { key: "sign", label: "ลงนาม" },
];

const today = computed(() =>
  new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const currentStatus = computed(() => {
  const statusMap = ["under_review", "lab_verification", "pending_signing", "completed"];
  return statusMap[currentWorkflowStep.value] ?? "under_review";
});

const appDetail = {
  requestNo: "HCEX-2568-00012",
  certType: "กมพ.1",
  exporterName: "บริษัท ไทยฟู้ดโปรเซส จำกัด",
  exporterAddress: "123 ถ.สุขุมวิท แขวงพระโขนง กทม.",
  consigneeName: "Nippon Foods Trading Co., Ltd.",
  consigneeAddress: "5-10, Shinjuku 1-chome, Shinjuku-ku, Tokyo",
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
};

const signers = [
  { id: "s1", name: "นางสาวสุมาลี วงศ์ไพร — ผู้อำนวยการกอง" },
  { id: "s2", name: "นายวิชัย ดาวเรือง — ผู้เชี่ยวชาญด้านการส่งออก" },
];

function completeSigning() {
  signDialog.value = false;
  successDialog.value = true;
}

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    submitted: "warning",
    under_review: "warning",
    lab_verification: "info",
    pending_signing: "secondary",
    completed: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function getStatusIcon(s: string) {
  const m: Record<string, string> = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    lab_verification: "fas fa-flask-vial",
    pending_signing: "fas fa-signature",
    completed: "fas fa-industry",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    submitted: "ยื่นแล้ว",
    under_review: "รอตรวจสอบ",
    lab_verification: "รอพิจารณา Lab",
    pending_signing: "รอลงนาม",
    completed: "เสร็จสิ้น",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>

<style scoped>
/* Step Bar */
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
  min-width: 80px;
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
  background: rgb(var(--v-theme-warning));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-warning), 0.2);
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
  color: rgb(var(--v-theme-warning));
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

/* Info Grid */
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

/* Fields */
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
}
.req {
  color: rgb(var(--v-theme-error));
}

/* Draft cert box */
.draft-cert-box {
  border: 1px dashed rgba(var(--v-theme-warning), 0.4);
  border-radius: 12px;
  padding: 16px;
  background: rgba(var(--v-theme-warning), 0.04);
}

/* Cert Preview */
.cert-preview {
  border: 2px solid rgba(var(--v-theme-warning), 0.3);
  border-radius: 12px;
  overflow: hidden;
}
.cert-preview-header {
  background: rgba(var(--v-theme-warning), 0.1);
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(var(--v-theme-warning), 0.2);
}
.cert-preview-body {
  padding: 20px;
}

/* Dialogs */
.sign-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-warning), 0.1);
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
