<template>
  <div v-if="app">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div class="d-flex align-center ga-3">
        <v-btn icon="fas fa-arrow-left" variant="text" @click="goBack" />
        <div>
          <div class="d-flex align-center ga-2 mb-1 flex-wrap">
            <h1 class="text-h6 font-weight-bold">{{ app.requestNo }}</h1>
            <v-chip
              size="small"
              :color="statusColor(app.status)"
              variant="tonal"
              :prepend-icon="statusIcon(app.status)"
            >
              {{ statusLabel(app.status) }}
            </v-chip>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ app.product }} → {{ app.destination }} · ยื่นเมื่อ
            {{ app.submittedAt }}
          </p>
        </div>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          v-if="app.status === 'completed'"
          color="success"
          variant="tonal"
          prepend-icon="fas fa-file-shield"
          size="small"
          @click="goToCertificates"
        >
          ดูใบรับรอง
        </v-btn>
        <v-btn
          v-if="app.status === 'correction_required'"
          color="warning"
          variant="tonal"
          prepend-icon="fas fa-pen-to-square"
          size="small"
        >
          แก้ไขคำขอ
        </v-btn>
      </div>
    </div>

    <!-- Progress Timeline -->
    <v-card class="mb-5" rounded="xl" elevation="0">
      <v-card-title
        class="pa-4 pb-2 text-subtitle-2 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-route" color="hc-user" size="16" />
        ความคืบหน้าคำขอ
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <div class="timeline">
          <div
            v-for="(step, idx) in timeline"
            :key="step.key"
            class="timeline-item"
            :class="{
              'timeline-item--done': isTimelineDone(idx),
              'timeline-item--active': isTimelineActive(idx),
              'timeline-item--pending': isTimelinePending(idx),
            }"
          >
            <div class="timeline-dot">
              <v-icon
                v-if="isTimelineDone(idx)"
                icon="fas fa-check"
                size="12"
              />
              <v-icon
                v-else-if="isTimelineActive(idx)"
                icon="fas fa-spinner"
                size="12"
                class="fa-spin"
              />
              <v-icon v-else icon="fas fa-circle" size="8" />
            </div>
            <div class="timeline-content">
              <div class="text-body-2 font-weight-medium">{{ step.label }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ step.desc }}
              </div>
              <div v-if="step.date" class="text-caption text-hc-user mt-1">
                {{ step.date }}
              </div>
              <div v-if="step.note" class="text-caption text-warning mt-1">
                {{ step.note }}
              </div>
            </div>
            <div v-if="idx < timeline.length - 1" class="timeline-line" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Details -->
    <v-row>
      <!-- Main Info -->
      <v-col cols="12" md="8">
        <!-- Exporter Info -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-truck" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ส่งออก</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อผู้ส่งออก</span>
                <span class="info-value">{{ app.exporter }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่</span>
                <span class="info-value">{{ app.exporterAddress }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">จังหวัด</span>
                <span class="info-value">{{ app.exporterProvince }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">โรงคัดบรรจุ</span>
                <span class="info-value">{{ app.packingHouseName }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Consignee Info -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-store" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้รับสินค้า</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อผู้รับสินค้า</span>
                <span class="info-value">{{ app.consignee }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่</span>
                <span class="info-value">{{ app.consigneeAddress }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ประเทศ</span>
                <span class="info-value">{{ app.destination }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Products -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-boxes-stacked" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >สินค้าที่ส่งออก</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense class="mb-4">
              <v-col cols="6" sm="4">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-hc-user">
                    {{ app.products.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    รายการสินค้า
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="4">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-info">
                    {{ app.destination }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ประเทศปลายทาง
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Sample No</th>
                  <th>พืช</th>
                  <th>น้ำหนัก</th>
                  <th>GAP Code</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in app.products" :key="p.sampleNo">
                  <td class="text-body-2">{{ p.sampleNo }}</td>
                  <td class="text-body-2">{{ p.name }}</td>
                  <td class="text-body-2">{{ p.weight }}</td>
                  <td class="text-body-2 text-hc-user">{{ p.gapCode }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Payment -->
        <v-card
          v-if="app.status === 'approved'"
          rounded="xl"
          elevation="0"
          class="mb-4"
        >
          <div class="section-header">
            <v-icon icon="fas fa-coins" color="warning" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ชำระค่าธรรมเนียม</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-body-2 text-medium-emphasis"
                >ค่าธรรมเนียมใบรับรอง</span
              >
              <span class="text-body-1 font-weight-bold">500 บาท</span>
            </div>
            <v-alert
              color="warning"
              variant="tonal"
              density="compact"
              class="mb-3"
              prepend-icon="fas fa-clock"
            >
              กรุณาชำระภายใน 7 วัน (ก่อน 22 ม.ค. 68)
            </v-alert>
            <v-btn
              color="warning"
              block
              rounded="lg"
              prepend-icon="fas fa-qrcode"
            >
              ชำระผ่าน QR Code
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Certificate download -->
        <v-card
          v-if="app.status === 'completed'"
          rounded="xl"
          elevation="0"
          class="mb-4"
        >
          <div class="section-header">
            <v-icon icon="fas fa-file-shield" color="success" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ใบรับรองสุขอนามัยพืช</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid mb-3">
              <div class="info-item">
                <span class="info-label">เลขใบรับรอง</span>
                <span class="info-value text-success font-weight-bold"
                  >THHC-2569-00025</span
                >
              </div>
              <div class="info-item">
                <span class="info-label">วันที่ออก</span>
                <span class="info-value">10 มกราคม 2569</span>
              </div>
              <div class="info-item">
                <span class="info-label">วันหมดอายุ</span>
                <span class="info-value">10 มกราคม 2569</span>
              </div>
            </div>
            <v-btn
              color="success"
              block
              rounded="lg"
              prepend-icon="fas fa-download"
            >
              ดาวน์โหลดใบรับรอง (PDF)
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Correction note -->
        <v-card
          v-if="app.status === 'correction_required'"
          rounded="xl"
          elevation="0"
        >
          <div class="section-header">
            <v-icon icon="fas fa-bolt" color="warning" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ดำเนินการ</span>
          </div>
          <v-card-text class="pa-4">
            <v-alert
              color="error"
              variant="tonal"
              density="compact"
              class="mb-3"
              prepend-icon="fas fa-triangle-exclamation"
            >
              เจ้าหน้าที่แจ้งให้แก้ไขข้อมูลในคำขอ
            </v-alert>
            <p class="text-body-2 text-medium-emphasis mb-3">
              {{ app.correctionNote }}
            </p>
            <v-btn
              color="warning"
              variant="tonal"
              block
              rounded="lg"
              prepend-icon="fas fa-pen-to-square"
            >
              แก้ไขและส่งใหม่
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Status Card (default) -->
        <v-card
          v-if="
            !['approved', 'completed', 'correction_required'].includes(
              app.status,
            )
          "
          rounded="xl"
          elevation="0"
        >
          <v-card-text class="pa-4 text-center">
            <div
              class="status-icon-box mx-auto mb-3"
              :style="{
                background: `rgba(var(--v-theme-${statusColor(app.status)}),0.1)`,
              }"
            >
              <v-icon
                :icon="statusIcon(app.status)"
                :color="statusColor(app.status)"
                size="28"
              />
            </div>
            <div class="text-body-1 font-weight-bold mb-1">
              {{ statusLabel(app.status) }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              เจ้าหน้าที่กำลังดำเนินการ<br />จะแจ้งผลทางอีเมล
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

function goBack() {
  router.back();
}

function goToCertificates() {
  router.push({ name: "HCUserCertificates" });
}

const mockApps = {
  "HC-001": {
    id: "HC-001",
    requestNo: "HC-2569-00041",
    status: "under_review",
    submittedAt: "15 ม.ค. 68",
    product: "ทุเรียน",
    destination: "จีน",
    exporter: "บริษัท ไทยฟรุ๊ต จำกัด",
    exporterAddress: "123 ถ.พระราม 9",
    exporterProvince: "กรุงเทพมหานคร",
    packingHouseName: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
    consignee: "China Fresh Import Co., Ltd.",
    consigneeAddress: "88 Guangzhou Road",
    correctionNote: null,
    products: [
      {
        sampleNo: "S-001",
        name: "ทุเรียนหมอนทอง",
        weight: "5,000 kg",
        gapCode: "GAP-CM-2569-001",
      },
    ],
  },
  "HC-008": {
    id: "HC-008",
    requestNo: "HC-2569-00025",
    status: "completed",
    submittedAt: "2 ม.ค. 68",
    product: "มังคุด",
    destination: "จีน",
    exporter: "บริษัท ไทยฟรุ๊ต จำกัด",
    exporterAddress: "123 ถ.พระราม 9",
    exporterProvince: "กรุงเทพมหานคร",
    packingHouseName: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
    consignee: "Beijing Import Ltd.",
    consigneeAddress: "10 Beijing Road",
    correctionNote: null,
    products: [
      {
        sampleNo: "S-010",
        name: "มังคุด",
        weight: "3,000 kg",
        gapCode: "GAP-CM-2569-010",
      },
    ],
  },
  "HC-015": {
    id: "HC-015",
    requestNo: "HC-2569-00015",
    status: "correction_required",
    submittedAt: "10 ม.ค. 68",
    product: "ลำไย",
    destination: "ฮ่องกง",
    exporter: "บริษัท สวนผลไม้ไทย จำกัด",
    exporterAddress: "456 ถ.สุขุมวิท",
    exporterProvince: "ชลบุรี",
    packingHouseName: "โรงคัดบรรจุชลบุรีฟาร์ม",
    consignee: "HK Fresh Ltd.",
    consigneeAddress: "5 Harbour Road, Hong Kong",
    correctionNote:
      "กรุณาแนบเอกสาร GAP Code ที่ยังไม่หมดอายุ และระบุน้ำหนักสุทธิให้ถูกต้อง",
    products: [
      {
        sampleNo: "S-015",
        name: "ลำไยอบแห้ง",
        weight: "2,500 kg",
        gapCode: "GAP-CB-2569-015",
      },
    ],
  },
};

const appId = route.params.id;
const app = ref(mockApps[appId] ?? mockApps["HC-001"]);

const statusOrder = [
  "submitted",
  "under_review",
  "testing",
  "pending_approval",
  "approved",
  "completed",
];

const currentStatusIdx = computed(() => {
  if (app.value.status === "correction_required") {
    return statusOrder.indexOf("under_review");
  }
  return statusOrder.indexOf(app.value.status);
});

const timeline = computed(() => [
  {
    key: "submitted",
    label: "ยื่นคำขอ",
    desc: "รับคำขอเรียบร้อย",
    date: app.value.submittedAt,
  },
  {
    key: "under_review",
    label: "เจ้าหน้าที่ตรวจสอบ",
    desc:
      app.value.status === "correction_required"
        ? "เอกสารไม่ครบถ้วน — รอการแก้ไข"
        : "ตรวจสอบเอกสารและข้อมูล",
    date: currentStatusIdx.value >= 1 ? "+1 วัน" : "",
    note:
      app.value.status === "correction_required" ? "รอผู้ยื่นคำขอแก้ไข" : "",
  },
  {
    key: "testing",
    label: "ตรวจตัวอย่าง Lab",
    desc: "ส่งตัวอย่างตรวจสอบ",
    date: currentStatusIdx.value >= 2 ? "+3 วัน" : "",
  },
  {
    key: "pending_approval",
    label: "พิจารณาออกใบรับรอง",
    desc: "ผู้มีอำนาจพิจารณาอนุมัติ",
    date: currentStatusIdx.value >= 3 ? "+5 วัน" : "",
  },
  {
    key: "approved",
    label: "อนุมัติ — รอชำระเงิน",
    desc: "กรุณาชำระค่าธรรมเนียม",
    date: currentStatusIdx.value >= 4 ? "+6 วัน" : "",
  },
  {
    key: "completed",
    label: "ออกใบรับรองแล้ว",
    desc: "สามารถดาวน์โหลดใบรับรองได้",
    date: currentStatusIdx.value >= 5 ? "+7 วัน" : "",
  },
]);

function isTimelineDone(idx) {
  return currentStatusIdx.value > idx;
}
function isTimelineActive(idx) {
  return currentStatusIdx.value === idx;
}
function isTimelinePending(idx) {
  return currentStatusIdx.value < idx;
}

function statusColor(s) {
  const m = {
    submitted: "primary",
    under_review: "warning",
    testing: "secondary",
    pending_approval: "primary",
    approved: "success",
    completed: "success",
    correction_required: "error",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function statusIcon(s) {
  const m = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    testing: "fas fa-flask",
    pending_approval: "fas fa-gavel",
    approved: "fas fa-circle-check",
    completed: "fas fa-file-shield",
    correction_required: "fas fa-triangle-exclamation",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  const m = {
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติ — รอชำระเงิน",
    completed: "รับใบรับรองแล้ว",
    correction_required: "ต้องแก้ไข",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>

<style scoped>
/* Timeline colors — hc-user */
.timeline-item--done .timeline-dot {
  background: rgb(var(--v-theme-hc-user));
  color: white;
}
.timeline-item--active .timeline-dot {
  background: rgb(var(--v-theme-hc-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hc-user), 0.2);
}
.timeline-item--pending .timeline-dot {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.3);
}
.timeline-item--done .timeline-line {
  background: rgba(var(--v-theme-hc-user), 0.35);
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.55);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.info-value {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.87);
}
.info-stat {
  padding: 12px;
  background: rgba(var(--v-border-color), 0.04);
  border-radius: 10px;
  text-align: center;
}

/* Status Icon */
.status-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
