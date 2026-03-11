<template>
  <div v-if="app">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div class="d-flex align-center ga-3">
        <v-btn icon="fas fa-arrow-left" variant="text" @click="router.back()" />
        <div>
          <div class="d-flex align-center ga-2 mb-1">
            <h1 class="text-h6 font-weight-bold">{{ app.requestNo }}</h1>
            <v-chip size="small" :color="getStatusColor(app.status)" variant="tonal" :prepend-icon="getStatusIcon(app.status)">
              {{ getStatusLabel(app.status) }}
            </v-chip>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ app.product }} → {{ app.destination }} · ยื่นเมื่อ {{ app.submittedAt }}
          </p>
        </div>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          v-if="app.status === 'completed'"
          color="success" variant="tonal" prepend-icon="fas fa-file-shield" size="small"
          @click="router.push('/hc/user/certificates')"
        >
          ดูใบรับรอง
        </v-btn>
        <v-btn
          v-if="app.status === 'correction_required'"
          color="warning" prepend-icon="fas fa-pen" size="small"
        >
          แก้ไขคำขอ
        </v-btn>
      </div>
    </div>

    <!-- Progress Timeline -->
    <v-card class="mb-5">
      <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
        <v-icon icon="fas fa-route" color="info" size="16" />
        ความคืบหน้าคำขอ
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <div class="timeline">
          <div
            v-for="(step, idx) in timeline"
            :key="step.key"
            class="timeline-item"
            :class="{
              'timeline-item--done':    isTimelineDone(idx),
              'timeline-item--active':  isTimelineActive(idx),
              'timeline-item--pending': isTimelinePending(idx),
            }"
          >
            <div class="timeline-dot">
              <v-icon v-if="isTimelineDone(idx)" icon="fas fa-check" size="12" />
              <v-icon v-else-if="isTimelineActive(idx)" icon="fas fa-spinner" size="12" class="fa-spin" />
              <v-icon v-else icon="fas fa-circle" size="8" />
            </div>
            <div class="timeline-content">
              <div class="text-body-2 font-weight-medium">{{ step.label }}</div>
              <div class="text-caption text-medium-emphasis">{{ step.desc }}</div>
              <div v-if="step.date" class="text-caption text-info mt-1">{{ step.date }}</div>
            </div>
            <div v-if="idx < timeline.length - 1" class="timeline-line" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Details -->
    <v-row>
      <v-col cols="12" md="7">
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">รายละเอียดคำขอ</v-card-title>
          <v-card-text class="pa-4 pt-0">
            <v-tabs v-model="detailTab" color="info" class="mb-3">
              <v-tab value="exporter">ผู้ส่งออก</v-tab>
              <v-tab value="consignee">ผู้รับสินค้า</v-tab>
              <v-tab value="products">สินค้า</v-tab>
            </v-tabs>
            <v-window v-model="detailTab">
              <v-window-item value="exporter">
                <div class="info-grid">
                  <div class="info-item"><span class="label">ชื่อผู้ส่งออก</span><span class="value">{{ app.exporter }}</span></div>
                  <div class="info-item"><span class="label">ที่อยู่</span><span class="value">{{ app.exporterAddress }}</span></div>
                  <div class="info-item"><span class="label">จังหวัด</span><span class="value">{{ app.exporterProvince }}</span></div>
                  <div class="info-item"><span class="label">โรงคัดบรรจุ</span><span class="value">{{ app.packingHouseName }}</span></div>
                </div>
              </v-window-item>
              <v-window-item value="consignee">
                <div class="info-grid">
                  <div class="info-item"><span class="label">ชื่อผู้รับสินค้า</span><span class="value">{{ app.consignee }}</span></div>
                  <div class="info-item"><span class="label">ที่อยู่</span><span class="value">{{ app.consigneeAddress }}</span></div>
                  <div class="info-item"><span class="label">ประเทศ</span><span class="value">{{ app.destination }}</span></div>
                </div>
              </v-window-item>
              <v-window-item value="products">
                <v-table density="compact">
                  <thead><tr><th>Sample No</th><th>พืช</th><th>น้ำหนัก</th><th>GAP Code</th></tr></thead>
                  <tbody>
                    <tr v-for="p in app.products" :key="p.sampleNo">
                      <td class="text-body-2">{{ p.sampleNo }}</td>
                      <td class="text-body-2">{{ p.name }}</td>
                      <td class="text-body-2">{{ p.weight }}</td>
                      <td class="text-body-2 text-primary">{{ p.gapCode }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <!-- Payment -->
        <v-card v-if="app.status === 'approved'" class="mb-4 payment-card">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
            <v-icon icon="fas fa-coins" color="warning" size="16" />
            ชำระค่าธรรมเนียม
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-body-2 text-medium-emphasis">ค่าธรรมเนียมใบรับรอง</span>
              <span class="text-body-1 font-weight-bold">500 บาท</span>
            </div>
            <v-alert color="warning" variant="tonal" density="compact" class="mb-3" prepend-icon="fas fa-clock">
              กรุณาชำระภายใน 7 วัน (ก่อน 22 ม.ค. 68)
            </v-alert>
            <v-btn color="warning" block prepend-icon="fas fa-qrcode">ชำระผ่าน QR Code</v-btn>
          </v-card-text>
        </v-card>

        <!-- Certificate download -->
        <v-card v-if="app.status === 'completed'" class="mb-4">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
            <v-icon icon="fas fa-file-shield" color="success" size="16" />
            ใบรับรองสุขอนามัยพืช
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="info-grid mb-3">
              <div class="info-item"><span class="label">เลขใบรับรอง</span><span class="value text-success font-weight-bold">THHC-2568-00025</span></div>
              <div class="info-item"><span class="label">วันที่ออก</span><span class="value">10 มกราคม 2568</span></div>
              <div class="info-item"><span class="label">วันหมดอายุ</span><span class="value">10 มกราคม 2569</span></div>
            </div>
            <v-btn color="success" block prepend-icon="fas fa-download">ดาวน์โหลดใบรับรอง (PDF)</v-btn>
          </v-card-text>
        </v-card>

        <!-- Correction note -->
        <v-card v-if="app.status === 'correction_required'" class="mb-4">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
            <v-icon icon="fas fa-triangle-exclamation" color="error" size="16" />
            ต้องแก้ไขข้อมูล
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <v-alert color="error" variant="tonal" density="compact" class="mb-3">
              เจ้าหน้าที่แจ้งให้แก้ไขข้อมูลในคำขอ
            </v-alert>
            <p class="text-body-2 text-medium-emphasis">{{ app.correctionNote }}</p>
            <v-btn color="error" block prepend-icon="fas fa-pen" class="mt-2">แก้ไขคำขอ</v-btn>
          </v-card-text>
        </v-card>

        <!-- Status Card (default) -->
        <v-card v-if="!['approved','completed','correction_required'].includes(app.status)">
          <v-card-text class="pa-4 text-center">
            <div class="status-icon-box mx-auto mb-3" :style="{ background: `rgba(var(--v-theme-${getStatusColor(app.status)}),0.1)` }">
              <v-icon :icon="getStatusIcon(app.status)" :color="getStatusColor(app.status)" size="28" />
            </div>
            <div class="text-body-1 font-weight-bold mb-1">{{ getStatusLabel(app.status) }}</div>
            <div class="text-body-2 text-medium-emphasis">เจ้าหน้าที่กำลังดำเนินการ<br>จะแจ้งผลทางอีเมล</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route  = useRoute()

const detailTab = ref('exporter')

interface Product { sampleNo: string; name: string; weight: string; gapCode: string }
interface AppDetail {
  id: string; requestNo: string; status: string; submittedAt: string
  product: string; destination: string
  exporter: string; exporterAddress: string; exporterProvince: string
  packingHouseName: string
  consignee: string; consigneeAddress: string
  products: Product[]
  correctionNote?: string
}

const mockApps: Record<string, AppDetail> = {
  'HC-001': {
    id: 'HC-001', requestNo: 'HC-2568-00041', status: 'under_review', submittedAt: '15 ม.ค. 68',
    product: 'ทุเรียน', destination: 'จีน',
    exporter: 'บริษัท ไทยฟรุ๊ต จำกัด', exporterAddress: '123 ถ.พระราม 9', exporterProvince: 'กรุงเทพมหานคร',
    packingHouseName: 'โรงคัดบรรจุเชียงใหม่ฟาร์ม',
    consignee: 'China Fresh Import Co., Ltd.', consigneeAddress: '88 Guangzhou Road',
    products: [
      { sampleNo: 'S-001', name: 'ทุเรียนหมอนทอง', weight: '5,000 kg', gapCode: 'GAP-CM-2568-001' },
    ],
  },
  'HC-008': {
    id: 'HC-008', requestNo: 'HC-2568-00025', status: 'completed', submittedAt: '2 ม.ค. 68',
    product: 'มังคุด', destination: 'จีน',
    exporter: 'บริษัท ไทยฟรุ๊ต จำกัด', exporterAddress: '123 ถ.พระราม 9', exporterProvince: 'กรุงเทพมหานคร',
    packingHouseName: 'โรงคัดบรรจุเชียงใหม่ฟาร์ม',
    consignee: 'Beijing Import Ltd.', consigneeAddress: '10 Beijing Road',
    products: [{ sampleNo: 'S-010', name: 'มังคุด', weight: '3,000 kg', gapCode: 'GAP-CM-2568-010' }],
  },
}

const appId = route.params.id as string
const app   = ref<AppDetail>(mockApps[appId] ?? mockApps['HC-001'])

const statusOrder = ['submitted', 'under_review', 'testing', 'pending_approval', 'approved', 'completed']
const currentStatusIdx = computed(() => statusOrder.indexOf(app.value.status))

const timeline = computed(() => [
  { key: 'submitted',        label: 'ยื่นคำขอ',              desc: 'รับคำขอเรียบร้อย',             date: app.value.submittedAt },
  { key: 'under_review',     label: 'เจ้าหน้าที่ตรวจสอบ',    desc: 'ตรวจสอบเอกสารและข้อมูล',       date: currentStatusIdx.value >= 1 ? '+1 วัน' : '' },
  { key: 'testing',          label: 'ตรวจตัวอย่าง Lab',       desc: 'ส่งตัวอย่างตรวจสอบ',           date: currentStatusIdx.value >= 2 ? '+3 วัน' : '' },
  { key: 'pending_approval', label: 'พิจารณาออกใบรับรอง',     desc: 'ผู้มีอำนาจพิจารณาอนุมัติ',    date: currentStatusIdx.value >= 3 ? '+5 วัน' : '' },
  { key: 'approved',         label: 'อนุมัติ — รอชำระเงิน',   desc: 'กรุณาชำระค่าธรรมเนียม',       date: currentStatusIdx.value >= 4 ? '+6 วัน' : '' },
  { key: 'completed',        label: 'ออกใบรับรองแล้ว',         desc: 'สามารถดาวน์โหลดใบรับรองได้',  date: currentStatusIdx.value >= 5 ? '+7 วัน' : '' },
])

function isTimelineDone(idx: number)    { return currentStatusIdx.value > idx }
function isTimelineActive(idx: number)  { return currentStatusIdx.value === idx }
function isTimelinePending(idx: number) { return currentStatusIdx.value < idx }

function getStatusColor(s: string) {
  const m: Record<string, string> = { submitted: 'info', under_review: 'warning', testing: 'secondary', pending_approval: 'primary', approved: 'success', completed: 'success', correction_required: 'error', rejected: 'error' }
  return m[s] ?? 'grey'
}
function getStatusIcon(s: string) {
  const m: Record<string, string> = { submitted: 'fas fa-paper-plane', under_review: 'fas fa-magnifying-glass', testing: 'fas fa-flask', pending_approval: 'fas fa-gavel', approved: 'fas fa-circle-check', completed: 'fas fa-file-shield', correction_required: 'fas fa-triangle-exclamation', rejected: 'fas fa-circle-xmark' }
  return m[s] ?? 'fas fa-circle'
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = { submitted: 'ยื่นแล้ว', under_review: 'อยู่ระหว่างตรวจสอบ', testing: 'ตรวจ Lab', pending_approval: 'รอพิจารณา', approved: 'อนุมัติ — รอชำระเงิน', completed: 'รับใบรับรองแล้ว', correction_required: 'ต้องแก้ไข', rejected: 'ไม่อนุมัติ' }
  return m[s] ?? s
}
</script>

<style scoped>
/* Timeline */
.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; align-items: flex-start; gap: 14px; position: relative; padding-bottom: 20px; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 1; }
.timeline-item--done    .timeline-dot { background: rgb(var(--v-theme-success)); color: white; }
.timeline-item--active  .timeline-dot { background: rgb(var(--v-theme-info));    color: white; box-shadow: 0 0 0 4px rgba(var(--v-theme-info),0.2); }
.timeline-item--pending .timeline-dot { background: rgba(var(--v-theme-on-surface),0.08); color: rgba(var(--v-theme-on-surface),0.3); }
.timeline-content { flex: 1; padding-top: 4px; }
.timeline-line { position: absolute; left: 13px; top: 28px; width: 2px; height: calc(100% - 28px); background: rgba(var(--v-theme-on-surface),0.1); }
.timeline-item--done .timeline-line { background: rgba(var(--v-theme-success),0.4); }

/* Info Grid */
.info-grid { display: flex; flex-direction: column; gap: 10px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-item .label { font-size: 11px; color: rgba(var(--v-theme-on-surface),0.45); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.info-item .value { font-size: 13.5px; font-weight: 500; }

/* Status Icon */
.status-icon-box { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
</style>
