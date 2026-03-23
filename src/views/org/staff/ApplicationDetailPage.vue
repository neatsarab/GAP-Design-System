<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.push('/org/staff/applications')" />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 mb-1 flex-wrap">
          <h1 class="page-title">{{ app.requestNo }}</h1>
          <v-chip size="small" :color="statusColor(app.status)" variant="tonal" :prepend-icon="statusIcon(app.status)">
            {{ statusLabel(app.status) }}
          </v-chip>
          <v-chip size="x-small" color="secondary" variant="tonal">
            <v-icon start icon="fas fa-list-check" size="10" />
            ขั้นตอน {{ currentStep + 1 }}/{{ steps.length }}
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">ยื่นเมื่อ {{ app.submittedDate }} · ผู้ยื่น {{ app.applicantName }}</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="info" prepend-icon="fas fa-download" size="small">ส่งออก PDF</v-btn>
      </div>
    </div>

    <!-- Workflow Steps -->
    <v-card rounded="xl" elevation="0" class="mb-5">
      <v-card-text class="pa-4">
        <div class="d-flex align-center ga-1 overflow-x-auto">
          <template v-for="(step, i) in steps" :key="i">
            <div class="step-item" :class="{ 'step-item--active': currentStep === i, 'step-item--done': currentStep > i }">
              <div class="step-num">
                <v-icon v-if="currentStep > i" icon="fas fa-check" size="11" color="white" />
                <span v-else class="text-caption font-weight-bold">{{ i + 1 }}</span>
              </div>
              <div class="text-caption d-none d-sm-block" style="white-space:nowrap">{{ step }}</div>
            </div>
            <div v-if="i < steps.length - 1" class="step-connector" :class="{ 'step-connector--done': currentStep > i }" />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Main -->
      <v-col cols="12" md="8">
        <!-- ข้อมูลผู้ยื่น -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-user" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ยื่นคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid">
              <div class="info-item"><span class="info-label">ชื่อ-นามสกุล</span><span class="info-value">{{ app.applicantName }}</span></div>
              <div class="info-item"><span class="info-label">เลขบัตรประชาชน</span><span class="info-value">{{ app.idCard }}</span></div>
              <div class="info-item"><span class="info-label">เบอร์โทรศัพท์</span><span class="info-value">{{ app.phone }}</span></div>
              <div class="info-item"><span class="info-label">อีเมล</span><span class="info-value">{{ app.email }}</span></div>
              <div class="info-item"><span class="info-label">จังหวัด</span><span class="info-value">{{ app.province }}</span></div>
              <div class="info-item"><span class="info-label">ประเภท</span><span class="info-value">{{ app.type === 'individual' ? 'รายเดี่ยว' : 'รายกลุ่ม' }}</span></div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลแปลง -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-seedling" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลแปลงเพาะปลูก</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense class="mb-4">
              <v-col cols="6" sm="3"><div class="info-stat"><div class="text-h6 font-weight-bold text-org-staff">{{ app.area }}</div><div class="text-caption text-medium-emphasis">พื้นที่ (ไร่)</div></div></v-col>
              <v-col cols="6" sm="3"><div class="info-stat"><div class="text-h6 font-weight-bold text-info">{{ app.cropType }}</div><div class="text-caption text-medium-emphasis">ชนิดพืช</div></div></v-col>
              <v-col cols="6" sm="3"><div class="info-stat"><div class="text-h6 font-weight-bold text-secondary">{{ app.plotCount }}</div><div class="text-caption text-medium-emphasis">จำนวนแปลง</div></div></v-col>
              <v-col cols="6" sm="3"><div class="info-stat"><div class="text-h6 font-weight-bold text-success">{{ app.standard }}</div><div class="text-caption text-medium-emphasis">มาตรฐาน</div></div></v-col>
            </v-row>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">ที่ตั้งแปลง</span><span class="info-value">{{ app.plotAddress }}</span></div>
              <div class="info-item"><span class="info-label">พิกัด GPS</span><span class="info-value">{{ app.coordinates }}</span></div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Step-specific content -->
        <!-- Step 1: ตรวจสอบข้อมูลคำขอ -->
        <v-card v-if="currentStep === 0" rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-clipboard-check" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Step 1 — ตรวจสอบข้อมูลคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <div class="field-label mb-1">ผลการตรวจสอบ<span class="req">*</span></div>
            <v-radio-group v-model="step1.result" inline class="mt-0">
              <v-radio label="ผ่าน" value="pass" color="success" />
              <v-radio label="รอแก้ไข" value="revision" color="warning" />
              <v-radio label="ไม่ผ่าน" value="fail" color="error" />
            </v-radio-group>
            <div class="field-label mb-1 mt-2">หมายเหตุ / เหตุผล</div>
            <v-textarea v-model="step1.note" variant="outlined" density="compact" rounded="lg" rows="2" hide-details placeholder="ระบุหมายเหตุหรือเหตุผล (ถ้ามี)" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 ga-2">
            <v-spacer />
            <v-btn v-if="step1.result === 'revision'" color="warning" variant="tonal" rounded="lg" prepend-icon="fas fa-reply" @click="actionRevision">ส่งกลับแก้ไข</v-btn>
            <v-btn v-if="step1.result === 'fail'" color="error" rounded="lg" prepend-icon="fas fa-circle-xmark" @click="actionReject">ไม่ผ่าน</v-btn>
            <v-btn v-if="step1.result === 'pass'" color="org-staff" rounded="lg" prepend-icon="fas fa-arrow-right" @click="advanceStep">ส่งต่อตรวจแปลง</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Step 2: ตรวจแปลง -->
        <v-card v-if="currentStep === 1" rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-calendar-check" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Step 2 — นัดหมายตรวจแปลง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">วันที่นัดตรวจ<span class="req">*</span></div>
                <v-text-field v-model="step2.inspectionDate" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">เวลา</div>
                <v-text-field v-model="step2.inspectionTime" type="time" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12">
                <div class="field-label mb-1 mt-3">ผู้ตรวจประเมิน</div>
                <v-text-field v-model="step2.inspector" variant="outlined" density="compact" rounded="lg" hide-details placeholder="ชื่อผู้ตรวจ" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 ga-2">
            <v-spacer />
            <v-btn color="org-staff" rounded="lg" prepend-icon="fas fa-calendar-plus" @click="advanceStep">บันทึกนัดหมาย</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Step 3: บันทึกผลตรวจแปลง -->
        <v-card v-if="currentStep === 2" rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-clipboard-list" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Step 3 — บันทึกผลตรวจแปลง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">ชนิดพืชที่พบ<span class="req">*</span></div>
                <v-text-field v-model="step3.cropFound" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">พื้นที่จริง (ไร่)<span class="req">*</span></div>
                <v-text-field v-model="step3.actualArea" type="number" variant="outlined" density="compact" rounded="lg" hide-details suffix="ไร่" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1 mt-3">จำนวนต้น</div>
                <v-text-field v-model="step3.plantCount" type="number" variant="outlined" density="compact" rounded="lg" hide-details suffix="ต้น" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1 mt-3">ปริมาณผลผลิตที่คาดการณ์ (กก.)</div>
                <v-text-field v-model="step3.expectedYield" type="number" variant="outlined" density="compact" rounded="lg" hide-details suffix="กก." />
              </v-col>
              <v-col cols="12">
                <div class="field-label mb-1 mt-3">ผลการตรวจแปลง<span class="req">*</span></div>
                <v-radio-group v-model="step3.result" inline class="mt-0">
                  <v-radio label="ผ่าน" value="pass" color="success" />
                  <v-radio label="พบข้อบกพร่อง (ต้องแก้ไข)" value="defect" color="warning" />
                  <v-radio label="ไม่ผ่าน" value="fail" color="error" />
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <div class="field-label mb-1">หมายเหตุ / รายงานตรวจแปลง</div>
                <v-textarea v-model="step3.note" variant="outlined" density="compact" rounded="lg" rows="3" hide-details />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 ga-2">
            <v-spacer />
            <v-btn color="org-staff" rounded="lg" prepend-icon="fas fa-paper-plane" @click="advanceStep">เสนอแปลงต่อ CC</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Step 4: เสนอ CC -->
        <v-card v-if="currentStep === 3" rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-gavel" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Step 4 — เสนอต่อคณะกรรมการ (CC)</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">วันที่เสนอ CC<span class="req">*</span></div>
                <v-text-field v-model="step4.ccDate" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12">
                <div class="field-label mb-1 mt-3">สรุปผลตรวจแปลงที่เสนอ</div>
                <v-textarea v-model="step4.summary" variant="outlined" density="compact" rounded="lg" rows="3" hide-details placeholder="สรุปข้อมูลที่จะเสนอต่อคณะกรรมการ" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 ga-2">
            <v-spacer />
            <v-btn color="org-staff" rounded="lg" prepend-icon="fas fa-paper-plane" @click="advanceStep">ส่งเสนอ CC</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Step 5: บันทึกผล CC -->
        <v-card v-if="currentStep === 4" rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-clipboard-check" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Step 5 — บันทึกผลจาก CC</span>
          </div>
          <v-card-text class="pa-4">
            <div class="field-label mb-1">ผลการพิจารณาจาก CC<span class="req">*</span></div>
            <v-select v-model="step5.ccResult" :items="ccResultOptions" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details class="mb-3" />
            <div class="field-label mb-1">ข้อเสนอแนะจาก CC</div>
            <v-textarea v-model="step5.ccNote" variant="outlined" density="compact" rounded="lg" rows="2" hide-details />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 ga-2">
            <v-spacer />
            <v-btn v-if="step5.ccResult === 'approved'" color="success" rounded="lg" prepend-icon="fas fa-signature" @click="advanceStep">ส่งลงนาม</v-btn>
            <v-btn v-else-if="step5.ccResult === 'rejected'" color="error" rounded="lg" prepend-icon="fas fa-circle-xmark" @click="actionReject">ไม่อนุมัติ</v-btn>
            <v-btn v-else-if="step5.ccResult" color="warning" rounded="lg" prepend-icon="fas fa-rotate" @click="currentStep = 1">ตรวจแปลงใหม่</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Step 6: ลงนาม / ออกใบรับรอง -->
        <v-card v-if="currentStep === 5" rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-signature" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Step 6 — ลงนามและออกใบรับรอง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">ผู้มีอำนาจลงนาม<span class="req">*</span></div>
                <v-text-field v-model="step6.signer" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">วันที่ลงนาม<span class="req">*</span></div>
                <v-text-field v-model="step6.signedDate" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1 mt-3">วันเริ่มต้นใบรับรอง</div>
                <v-text-field v-model="step6.certStart" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1 mt-3">วันสิ้นสุดใบรับรอง</div>
                <v-text-field v-model="step6.certEnd" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 ga-2">
            <v-spacer />
            <v-btn color="success" rounded="lg" prepend-icon="fas fa-certificate" @click="issueCert">ออกใบรับรอง</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Timeline -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-timeline" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ประวัติการดำเนินการ</span>
          </div>
          <v-card-text class="pa-4">
            <div v-for="(ev, i) in historyEvents" :key="i" class="d-flex ga-3 mb-3">
              <div class="d-flex flex-column align-center" style="width:20px;flex-shrink:0">
                <div class="event-dot" :style="`background:rgb(var(--v-theme-${ev.color}))`" />
                <div v-if="i < historyEvents.length - 1" class="event-line" />
              </div>
              <div class="pb-3">
                <div class="text-body-2 font-weight-medium">{{ ev.label }}</div>
                <div class="text-caption text-medium-emphasis">{{ ev.date }} · {{ ev.by }}</div>
                <div v-if="ev.note" class="text-caption text-medium-emphasis mt-0.5">{{ ev.note }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Documents -->
        <v-card rounded="xl" elevation="0">
          <div class="section-header">
            <v-icon icon="fas fa-paperclip" color="org-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-list density="compact" class="pa-2">
            <v-list-item v-for="doc in app.documents" :key="doc.name" rounded="lg" class="mb-1">
              <template #prepend><v-icon icon="fas fa-file-pdf" color="error" size="16" class="mr-2" /></template>
              <v-list-item-title class="text-body-2">{{ doc.name }}</v-list-item-title>
              <template #append><v-btn size="x-small" variant="text" color="info" icon="fas fa-download" /></template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success dialog -->
    <v-dialog v-model="certDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-certificate" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ออกใบรับรองสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">เลขใบรับรอง: <strong>THORG-2568-00015</strong></p>
          <p class="text-body-2 text-medium-emphasis mb-0">ส่งการแจ้งเตือนไปยังผู้ประกอบการแล้ว</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="org-staff" rounded="lg" block @click="router.push('/org/staff/applications')">กลับรายการคำขอ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(0)
const certDialog = ref(false)

const steps = ['ตรวจสอบคำขอ', 'ตรวจแปลง', 'บันทึกผล', 'เสนอ CC', 'ผล CC', 'ลงนาม']

const app = {
  requestNo: 'ORG-2568-00009',
  status: 'doc_review',
  submittedDate: '6 มี.ค. 2568',
  applicantName: 'นางมาลี พืชผล',
  idCard: '1-2000-00000-00-0',
  phone: '082-345-6789',
  email: 'malee@example.com',
  province: 'อุบลราชธานี',
  type: 'individual' as const,
  area: '8', cropType: 'ผัก', plotCount: '2', standard: 'มกษ.9000',
  plotAddress: 'ต.บุ่งมะแลง อ.สว่างวีระวงศ์ จ.อุบลราชธานี',
  coordinates: '15.1234° N, 105.5678° E',
  documents: [
    { name: 'สำเนาบัตรประชาชน.pdf' },
    { name: 'เอกสารสิทธิ์ที่ดิน.pdf' },
    { name: 'ทะเบียนบ้าน.pdf' },
  ],
}

const historyEvents = [
  { label: 'ยื่นคำขอ', date: '6 มี.ค. 2568', by: 'นางมาลี พืชผล', color: 'org-staff', note: '' },
  { label: 'รับคำขอเข้าสู่ระบบ', date: '7 มี.ค. 2568', by: 'ระบบอัตโนมัติ', color: 'info', note: '' },
]

const step1 = reactive({ result: '', note: '' })
const step2 = reactive({ inspectionDate: '', inspectionTime: '', inspector: '' })
const step3 = reactive({ cropFound: '', actualArea: '', plantCount: '', expectedYield: '', result: '', note: '' })
const step4 = reactive({ ccDate: '', summary: '' })
const step5 = reactive({ ccResult: '', ccNote: '' })
const step6 = reactive({ signer: '', signedDate: '', certStart: '', certEnd: '' })

const ccResultOptions = [
  { label: 'อนุมัติ', value: 'approved' },
  { label: 'ไม่อนุมัติ', value: 'rejected' },
  { label: 'ให้ตรวจแปลงใหม่', value: 're_inspect' },
  { label: 'ให้แก้ไขเพิ่มเติม', value: 'revision' },
]

function advanceStep() { if (currentStep.value < steps.length - 1) currentStep.value++ }
function actionRevision() { /* ส่งกลับแก้ไข */ }
function actionReject() { /* ไม่อนุมัติ */ }
function issueCert() { certDialog.value = true }

function statusColor(s: string) {
  const m: Record<string, string> = { submitted: 'org-staff', doc_review: 'info', revision_required: 'warning', inspection_scheduled: 'secondary', inspected: 'secondary', pending_cc: 'warning', cc_reviewing: 'error', approved: 'success', rejected: 'error' }
  return m[s] ?? 'grey'
}
function statusIcon(s: string) {
  const m: Record<string, string> = { submitted: 'fas fa-paper-plane', doc_review: 'fas fa-magnifying-glass', revision_required: 'fas fa-pen-to-square', inspection_scheduled: 'fas fa-calendar-check', inspected: 'fas fa-clipboard-check', pending_cc: 'fas fa-paper-plane', cc_reviewing: 'fas fa-gavel', approved: 'fas fa-circle-check', rejected: 'fas fa-circle-xmark' }
  return m[s] ?? 'fas fa-circle'
}
function statusLabel(s: string) {
  const m: Record<string, string> = { submitted: 'ยื่นแล้ว', doc_review: 'อยู่ระหว่างตรวจสอบ', revision_required: 'รอแก้ไข', inspection_scheduled: 'นัดตรวจแล้ว', inspected: 'ตรวจแปลงแล้ว', pending_cc: 'รอเสนอ CC', cc_reviewing: 'อยู่ระหว่าง CC', approved: 'อนุมัติแล้ว', rejected: 'ไม่อนุมัติ' }
  return m[s] ?? s
}
</script>

<style scoped>
.section-header {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 12px; color: rgba(var(--v-theme-on-surface), 0.55); }
.info-value { font-size: 14px; font-weight: 500; }
.info-stat { padding: 12px; background: rgba(var(--v-border-color), 0.04); border-radius: 10px; text-align: center; }
.step-item { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
.step-num { width: 24px; height: 24px; border-radius: 50%; background: rgba(var(--v-border-color), 0.1); border: 1.5px solid rgba(var(--v-border-color), 0.3); display: flex; align-items: center; justify-content: center; color: rgba(var(--v-theme-on-surface), 0.4); font-size: 11px; }
.step-item--active .step-num { background: rgba(var(--v-theme-org-staff), 0.12); border-color: rgb(var(--v-theme-org-staff)); color: rgb(var(--v-theme-org-staff)); }
.step-item--done .step-num { background: rgb(var(--v-theme-success)); border-color: rgb(var(--v-theme-success)); color: white; }
.step-connector { flex: 1; height: 2px; background: rgba(var(--v-border-color), 0.2); min-width: 20px; }
.step-connector--done { background: rgb(var(--v-theme-success)); }
.event-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.event-line { width: 2px; flex-grow: 1; min-height: 14px; background: rgba(var(--v-border-color), 0.2); margin: 2px 0; }
.field-label { font-size: 13px; font-weight: 500; color: rgba(var(--v-theme-on-surface), 0.75); }
.req { color: rgb(var(--v-theme-error)); }
.success-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(var(--v-theme-success), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
