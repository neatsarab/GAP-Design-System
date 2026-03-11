<template>
  <div v-if="app">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div class="d-flex align-center ga-3">
        <v-btn icon="fas fa-arrow-left" variant="text" @click="router.back()" />
        <div>
          <div class="d-flex align-center ga-2 mb-1">
            <h1 class="text-h6 font-weight-bold">{{ app.requestNo }}</h1>
            <v-chip size="small" :color="getStatusColor(app.status)" variant="tonal">
              {{ getStatusLabel(app.status) }}
            </v-chip>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            <v-icon icon="fas fa-building" size="12" class="mr-1" />{{ app.exporter }} ·
            <v-icon icon="fas fa-box" size="12" class="mx-1" />{{ app.product }} →
            <v-icon icon="fas fa-location-dot" size="12" class="mx-1" />{{ app.destination }}
          </p>
        </div>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="outlined" color="info" prepend-icon="fas fa-print" size="small">พิมพ์</v-btn>
        <v-btn
          v-if="app.status === 'approved'"
          color="success"
          prepend-icon="fas fa-file-shield"
          size="small"
        >
          ออกใบรับรอง
        </v-btn>
      </div>
    </div>

    <!-- Workflow Stepper -->
    <v-card class="mb-5 pa-4">
      <div class="workflow-stepper">
        <div
          v-for="(step, idx) in workflowSteps"
          :key="step.key"
          class="wf-step"
          :class="{
            'wf-step--done':   isStepDone(idx),
            'wf-step--active': isStepActive(idx),
            'wf-step--pending': !isStepDone(idx) && !isStepActive(idx),
          }"
        >
          <div class="wf-dot">
            <v-icon v-if="isStepDone(idx)" icon="fas fa-check" size="12" />
            <span v-else class="wf-num">{{ idx + 1 }}</span>
          </div>
          <div class="wf-label text-caption">{{ step.label }}</div>
          <div v-if="idx < workflowSteps.length - 1" class="wf-line" />
        </div>
      </div>
    </v-card>

    <!-- Step Content -->
    <v-tabs v-model="activeStep" color="info" class="mb-4">
      <v-tab v-for="step in workflowSteps" :key="step.key" :value="step.key">
        <v-icon start :icon="step.icon" size="14" />
        {{ step.label }}
      </v-tab>
    </v-tabs>

    <v-window v-model="activeStep">

      <!-- Step 1: ข้อมูลคำขอ -->
      <v-window-item value="info">
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="mb-4">
              <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
                <v-icon icon="fas fa-building" color="info" size="16" />
                ข้อมูลผู้ส่งออก
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
                <div class="info-grid">
                  <div class="info-item"><span class="label">ชื่อผู้ส่งออก</span><span class="value">{{ app.exporter }}</span></div>
                  <div class="info-item"><span class="label">ที่อยู่</span><span class="value">{{ app.exporterAddress }}</span></div>
                  <div class="info-item"><span class="label">จังหวัด</span><span class="value">{{ app.exporterProvince }}</span></div>
                  <div class="info-item"><span class="label">โทรศัพท์</span><span class="value">{{ app.exporterPhone }}</span></div>
                </div>
              </v-card-text>
            </v-card>

            <v-card class="mb-4">
              <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
                <v-icon icon="fas fa-warehouse" color="info" size="16" />
                โรงคัดบรรจุ (Packing House)
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
                <div class="info-grid">
                  <div class="info-item"><span class="label">รหัสโรงคัดบรรจุ</span><span class="value">{{ app.packingHouseCode }}</span></div>
                  <div class="info-item"><span class="label">ชื่อโรงคัดบรรจุ</span><span class="value">{{ app.packingHouseName }}</span></div>
                  <div class="info-item"><span class="label">จังหวัด</span><span class="value">{{ app.packingHouseProvince }}</span></div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="mb-4">
              <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
                <v-icon icon="fas fa-user-tie" color="info" size="16" />
                ผู้รับสินค้า (Consignee)
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
                <div class="info-grid">
                  <div class="info-item"><span class="label">ชื่อผู้รับสินค้า</span><span class="value">{{ app.consignee }}</span></div>
                  <div class="info-item"><span class="label">ที่อยู่</span><span class="value">{{ app.consigneeAddress }}</span></div>
                  <div class="info-item"><span class="label">ประเทศ</span><span class="value">{{ app.destination }}</span></div>
                </div>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
                <v-icon icon="fas fa-box" color="info" size="16" />
                รายละเอียดสินค้า
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
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
                      <td class="text-body-2 text-info">{{ p.gapCode }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Action: ตรวจสอบคำขอ -->
        <v-card v-if="app.status === 'under_review'" class="mt-4">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">ผลการตรวจสอบคำขอ</v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="text-body-2 font-weight-medium mb-1">หมายเหตุ / เหตุผล</div>
            <v-textarea v-model="reviewNote" rows="3" class="mb-3" />
            <div class="d-flex ga-3 flex-wrap">
              <v-btn color="success" prepend-icon="fas fa-circle-check" @click="updateStatus('testing')">
                ผ่าน — ส่งตรวจ Lab
              </v-btn>
              <v-btn color="warning" variant="tonal" prepend-icon="fas fa-triangle-exclamation" @click="updateStatus('correction_required')">
                ส่งกลับแก้ไข
              </v-btn>
              <v-btn color="error" variant="tonal" prepend-icon="fas fa-circle-xmark" @click="updateStatus('rejected')">
                ไม่ผ่าน
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 2: ตรวจตัวอย่าง Lab -->
      <v-window-item value="lab">
        <v-card>
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
            <v-icon icon="fas fa-flask" color="secondary" size="16" />
            บันทึกผลตรวจตัวอย่าง
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <v-table density="comfortable" class="mb-4">
              <thead>
                <tr>
                  <th>Sample No</th>
                  <th>พืช</th>
                  <th>ห้อง Lab</th>
                  <th>วันที่ส่ง</th>
                  <th>วันที่รับผล</th>
                  <th>ผลการตรวจ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in app.products" :key="p.sampleNo">
                  <td>{{ p.sampleNo }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ app.labName }}</td>
                  <td>{{ app.labSentAt }}</td>
                  <td>{{ app.labResultAt }}</td>
                  <td>
                    <v-select
                      :items="labResultOptions"
                      item-title="label"
                      item-value="value"
                      density="compact"
                      hide-details
                      variant="outlined"
                      style="min-width:130px"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div class="text-body-2 font-weight-medium mb-1">หมายเหตุผลตรวจ</div>
            <v-textarea v-model="labNote" rows="3" class="mb-3" />

            <div class="d-flex ga-3" v-if="app.status === 'testing'">
              <v-btn color="primary" prepend-icon="fas fa-gavel" @click="updateStatus('pending_approval')">
                ส่งพิจารณาผล
              </v-btn>
              <v-btn variant="tonal" color="warning" prepend-icon="fas fa-rotate-left" @click="updateStatus('correction_required')">
                ส่งกลับแก้ไข
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 3: พิจารณาออกใบรับรอง -->
      <v-window-item value="approval">
        <v-row>
          <v-col cols="12" md="7">
            <v-card class="mb-4">
              <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
                <v-icon icon="fas fa-file-shield" color="primary" size="16" />
                แบบร่างใบรับรองสุขอนามัยพืช
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
                <div class="cert-draft">
                  <div class="cert-draft-header text-center mb-4">
                    <div class="text-body-2 font-weight-bold">DEPARTMENT OF AGRICULTURE</div>
                    <div class="text-caption text-medium-emphasis">MINISTRY OF AGRICULTURE AND COOPERATIVES</div>
                    <div class="text-body-1 font-weight-bold mt-2">HEALTH CERTIFICATE</div>
                    <div class="text-caption">สุขอนามัยพืช</div>
                  </div>
                  <v-divider class="mb-3" />
                  <div class="info-grid">
                    <div class="info-item"><span class="label">เลขใบรับรอง</span><span class="value text-info font-weight-bold">HC-{{ app.requestNo }}</span></div>
                    <div class="info-item"><span class="label">ผู้ส่งออก</span><span class="value">{{ app.exporter }}</span></div>
                    <div class="info-item"><span class="label">ผู้รับสินค้า</span><span class="value">{{ app.consignee }}</span></div>
                    <div class="info-item"><span class="label">สินค้า</span><span class="value">{{ app.product }}</span></div>
                    <div class="info-item"><span class="label">ประเทศปลายทาง</span><span class="value">{{ app.destination }}</span></div>
                    <div class="info-item"><span class="label">วันที่ออก</span><span class="value">15 มกราคม 2568</span></div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card>
              <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">พิจารณาผล</v-card-title>
              <v-card-text class="pa-4 pt-0">
                <div class="text-body-2 font-weight-medium mb-1">หมายเหตุ / เหตุผล</div>
                <v-textarea v-model="approvalNote" rows="4" class="mb-4" />
                <div v-if="app.status === 'pending_approval'" class="d-flex flex-column ga-2">
                  <v-btn color="success" prepend-icon="fas fa-circle-check" block @click="updateStatus('approved')">
                    อนุมัติออกใบรับรอง
                  </v-btn>
                  <v-btn variant="tonal" color="warning" prepend-icon="fas fa-rotate-left" block @click="updateStatus('correction_required')">
                    ส่งกลับแก้ไข
                  </v-btn>
                  <v-btn variant="tonal" color="error" prepend-icon="fas fa-circle-xmark" block @click="updateStatus('rejected')">
                    ไม่อนุมัติ
                  </v-btn>
                </div>
                <v-alert v-else-if="app.status === 'approved'" color="success" variant="tonal" prepend-icon="fas fa-circle-check">
                  อนุมัติแล้ว — รอลงนาม
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Step 4: ลงนาม -->
      <v-window-item value="sign">
        <v-card>
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2">
            <v-icon icon="fas fa-signature" color="error" size="16" />
            ลงนามใบรับรองสุขอนามัยพืช
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div v-if="app.status === 'approved'">
              <v-alert color="info" variant="tonal" prepend-icon="fas fa-circle-info" class="mb-4">
                ตรวจสอบข้อมูลในใบรับรองให้ครบถ้วนก่อนลงนาม เมื่อลงนามแล้วจะไม่สามารถแก้ไขได้
              </v-alert>
              <div class="sign-box mb-5">
                <v-icon icon="fas fa-signature" size="40" color="grey-lighten-2" class="mb-3" />
                <p class="text-body-2 text-medium-emphasis">พื้นที่ลงลายมือชื่ออิเล็กทรอนิกส์</p>
              </div>
              <v-row class="mb-4">
                <v-col cols="12" sm="6">
                  <div class="text-body-2 font-weight-medium mb-1">ชื่อผู้ลงนาม</div>
                  <v-text-field value="นายสมพงศ์ วิชาการเกษตร" readonly />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-body-2 font-weight-medium mb-1">ตำแหน่ง</div>
                  <v-text-field value="ผู้อำนวยการกอง" readonly />
                </v-col>
              </v-row>
              <v-btn color="info" prepend-icon="fas fa-signature" size="large" @click="updateStatus('completed')">
                ยืนยันลงนาม — ออกใบรับรอง
              </v-btn>
            </div>
            <div v-else>
              <v-alert color="grey" variant="tonal" prepend-icon="fas fa-clock">
                ยังไม่ถึงขั้นตอนลงนาม — กรุณาดำเนินการตามขั้นตอนก่อนหน้า
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route  = useRoute()

interface Product { sampleNo: string; name: string; weight: string; gapCode: string }
interface HCAppDetail {
  id: string; requestNo: string; status: string; type: string
  exporter: string; exporterAddress: string; exporterProvince: string; exporterPhone: string
  packingHouseCode: string; packingHouseName: string; packingHouseProvince: string
  consignee: string; consigneeAddress: string; destination: string
  product: string; products: Product[]
  labName: string; labSentAt: string; labResultAt: string
}

const mockApps: Record<string, HCAppDetail> = {
  'HC-001': {
    id: 'HC-001', requestNo: 'HC-2568-00041', status: 'under_review', type: 'new',
    exporter: 'บริษัท ไทยฟรุ๊ต จำกัด', exporterAddress: '123 ถ.พระราม 9 แขวงบางกะปิ', exporterProvince: 'กรุงเทพมหานคร', exporterPhone: '02-123-4567',
    packingHouseCode: 'PH-CM-001', packingHouseName: 'โรงคัดบรรจุเชียงใหม่ฟาร์ม', packingHouseProvince: 'เชียงใหม่',
    consignee: 'China Fresh Import Co., Ltd.', consigneeAddress: '88 Guangzhou Road, Guangdong', destination: 'จีน',
    product: 'ทุเรียน', products: [
      { sampleNo: 'S-001', name: 'ทุเรียนหมอนทอง', weight: '5,000 kg', gapCode: 'GAP-CM-2568-001' },
      { sampleNo: 'S-002', name: 'ทุเรียนชะนี',    weight: '2,000 kg', gapCode: 'GAP-CM-2568-002' },
    ],
    labName: 'ห้องปฏิบัติการกลาง (ประเทศไทย) จำกัด', labSentAt: '16 ม.ค. 68', labResultAt: '-',
  },
  'HC-002': {
    id: 'HC-002', requestNo: 'HC-2568-00039', status: 'testing', type: 'new',
    exporter: 'บริษัท สยามเอ็กซ์พอร์ต จำกัด', exporterAddress: '456 ถ.สุขุมวิท แขวงคลองตัน', exporterProvince: 'กรุงเทพมหานคร', exporterPhone: '02-234-5678',
    packingHouseCode: 'PH-CM-003', packingHouseName: 'โรงคัดบรรจุสยามฟาร์ม', packingHouseProvince: 'เชียงราย',
    consignee: 'Japan Import Trading Co.', consigneeAddress: '1-2-3 Shibuya, Tokyo', destination: 'ญี่ปุ่น',
    product: 'มะม่วง', products: [
      { sampleNo: 'S-010', name: 'มะม่วงน้ำดอกไม้', weight: '3,000 kg', gapCode: 'GAP-CR-2568-010' },
    ],
    labName: 'ห้องปฏิบัติการวิทยาศาสตร์การเกษตร', labSentAt: '14 ม.ค. 68', labResultAt: '18 ม.ค. 68',
  },
  'HC-004': {
    id: 'HC-004', requestNo: 'HC-2568-00034', status: 'approved', type: 'new',
    exporter: 'บริษัท ดีเอ็กซ์พอร์ต จำกัด', exporterAddress: '789 ถ.วิภาวดีรังสิต', exporterProvince: 'กรุงเทพมหานคร', exporterPhone: '02-345-6789',
    packingHouseCode: 'PH-NP-002', packingHouseName: 'โรงคัดบรรจุภาคเหนือ', packingHouseProvince: 'น่าน',
    consignee: 'Seoul Fresh Market Co.', consigneeAddress: '100 Gangnam-gu, Seoul', destination: 'เกาหลีใต้',
    product: 'กระเทียม', products: [
      { sampleNo: 'S-020', name: 'กระเทียมไทย', weight: '10,000 kg', gapCode: 'GAP-NP-2568-020' },
    ],
    labName: 'ห้องปฏิบัติการกลาง (ประเทศไทย) จำกัด', labSentAt: '9 ม.ค. 68', labResultAt: '12 ม.ค. 68',
  },
}

const appId = route.params.id as string
const app   = ref<HCAppDetail>(mockApps[appId] ?? mockApps['HC-001'])

const reviewNote   = ref('')
const labNote      = ref('')
const approvalNote = ref('')

const labResultOptions = [
  { label: 'ผ่าน',     value: 'pass' },
  { label: 'ไม่ผ่าน', value: 'fail' },
  { label: 'ปรับปรุง', value: 'revise' },
]

const statusOrder = ['submitted', 'under_review', 'testing', 'pending_approval', 'approved', 'completed']
const currentStepIdx = computed(() => {
  const idx = statusOrder.indexOf(app.value.status)
  return idx === -1 ? 0 : idx
})

const workflowSteps = [
  { key: 'info',     label: 'ข้อมูลคำขอ',          icon: 'fas fa-file-lines' },
  { key: 'lab',      label: 'ตรวจตัวอย่าง',         icon: 'fas fa-flask' },
  { key: 'approval', label: 'พิจารณาออกใบรับรอง',   icon: 'fas fa-gavel' },
  { key: 'sign',     label: 'ลงนาม',                icon: 'fas fa-signature' },
]

const stepKeyToOrderIdx: Record<string, number> = {
  info: 1, lab: 2, approval: 3, sign: 4
}

function isStepDone(stepIdx: number) {
  const needed = stepIdx + 1
  return currentStepIdx.value >= needed
}
function isStepActive(stepIdx: number) {
  return currentStepIdx.value === stepIdx
}

const activeStep = ref(workflowSteps[Math.min(currentStepIdx.value, workflowSteps.length - 1)].key)

function updateStatus(newStatus: string) {
  app.value.status = newStatus
  const nextStepMap: Record<string, string> = {
    testing: 'lab', pending_approval: 'approval', approved: 'sign', completed: 'sign',
  }
  if (nextStepMap[newStatus]) activeStep.value = nextStepMap[newStatus]
}

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    draft: 'grey', submitted: 'info', under_review: 'warning', testing: 'secondary',
    pending_approval: 'primary', approved: 'success', correction_required: 'error',
    completed: 'success', rejected: 'error',
  }
  return m[s] ?? 'grey'
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    draft: 'ฉบับร่าง', submitted: 'ยื่นแล้ว', under_review: 'รอตรวจสอบ', testing: 'ตรวจ Lab',
    pending_approval: 'รอพิจารณา', approved: 'อนุมัติแล้ว', correction_required: 'ต้องแก้ไข',
    completed: 'เสร็จสิ้น', rejected: 'ไม่อนุมัติ',
  }
  return m[s] ?? s
}
</script>

<style scoped>
/* Workflow Stepper */
.workflow-stepper {
  display: flex;
  align-items: flex-start;
  gap: 0;
  overflow-x: auto;
}
.wf-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  min-width: 80px;
}
.wf-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  z-index: 1;
  flex-shrink: 0;
}
.wf-step--done   .wf-dot { background: rgb(var(--v-theme-success)); color: white; }
.wf-step--active .wf-dot { background: rgb(var(--v-theme-info));    color: white; box-shadow: 0 0 0 4px rgba(var(--v-theme-info),0.2); }
.wf-step--pending .wf-dot { background: rgba(var(--v-theme-on-surface),0.1); color: rgba(var(--v-theme-on-surface),0.4); }

.wf-num { font-size: 12px; }
.wf-label {
  margin-top: 8px;
  text-align: center;
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  line-height: 1.3;
}
.wf-step--active .wf-label { color: rgb(var(--v-theme-info)); font-weight: 600; }
.wf-step--done   .wf-label { color: rgb(var(--v-theme-success)); }

.wf-line {
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.12);
  z-index: 0;
}
.wf-step--done .wf-line { background: rgba(var(--v-theme-success), 0.5); }

/* Info Grid */
.info-grid { display: flex; flex-direction: column; gap: 10px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-item .label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.info-item .value { font-size: 13.5px; font-weight: 500; }

/* Cert Draft */
.cert-draft {
  border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  padding: 20px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}
.cert-draft-header { padding-bottom: 12px; }

/* Sign Box */
.sign-box {
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface-variant), 0.2);
}
</style>
