<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.push('/org/user/applications')" />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 mb-1 flex-wrap">
          <h1 class="page-title">{{ app.requestNo }}</h1>
          <v-chip size="small" :color="statusColor(app.status)" variant="tonal" :prepend-icon="statusIcon(app.status)">
            {{ statusLabel(app.status) }}
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">ยื่นเมื่อ {{ app.submittedDate }} · อัปเดตล่าสุด {{ app.updatedDate }}</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="info" prepend-icon="fas fa-download" size="small">ดาวน์โหลด PDF</v-btn>
      </div>
    </div>

    <v-row>
      <!-- Main Info -->
      <v-col cols="12" md="8">
        <!-- Applicant Info -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-user" color="org-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ยื่นคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid">
              <div class="info-item"><span class="info-label">ชื่อ-นามสกุล</span><span class="info-value">{{ app.applicantName }}</span></div>
              <div class="info-item"><span class="info-label">เลขบัตรประชาชน</span><span class="info-value">{{ app.idCard }}</span></div>
              <div class="info-item"><span class="info-label">เบอร์โทรศัพท์</span><span class="info-value">{{ app.phone }}</span></div>
              <div class="info-item"><span class="info-label">อีเมล</span><span class="info-value">{{ app.email }}</span></div>
              <div class="info-item"><span class="info-label">ที่อยู่</span><span class="info-value">{{ app.address }}</span></div>
              <div class="info-item"><span class="info-label">จังหวัด</span><span class="info-value">{{ app.province }}</span></div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Plot Info -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-seedling" color="org-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลแปลงเพาะปลูก</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense class="mb-4">
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-org-user">{{ app.area }}</div>
                  <div class="text-caption text-medium-emphasis">พื้นที่ (ไร่)</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-info">{{ app.cropType }}</div>
                  <div class="text-caption text-medium-emphasis">ชนิดพืช</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-secondary">{{ app.plotCount }}</div>
                  <div class="text-caption text-medium-emphasis">จำนวนแปลง</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-success">{{ app.standard }}</div>
                  <div class="text-caption text-medium-emphasis">มาตรฐาน</div>
                </div>
              </v-col>
            </v-row>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">ที่ตั้งแปลง</span><span class="info-value">{{ app.plotAddress }}</span></div>
              <div class="info-item"><span class="info-label">พิกัด GPS</span><span class="info-value">{{ app.coordinates }}</span></div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Documents -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-paperclip" color="org-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-list density="compact" class="pa-2">
            <v-list-item v-for="doc in app.documents" :key="doc.name" rounded="lg" class="mb-1">
              <template #prepend>
                <v-icon icon="fas fa-file-pdf" color="error" size="18" class="mr-2" />
              </template>
              <v-list-item-title class="text-body-2">{{ doc.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ doc.uploadedAt }}</v-list-item-subtitle>
              <template #append>
                <v-btn size="x-small" variant="text" color="info" icon="fas fa-download" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Status Timeline -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-timeline" color="org-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ความคืบหน้า</span>
          </div>
          <v-card-text class="pa-4">
            <div v-for="(step, i) in timeline" :key="i" class="d-flex ga-3 mb-3">
              <div class="timeline-dot-wrap d-flex flex-column align-center">
                <div class="timeline-dot" :class="step.done ? 'timeline-dot--done' : step.active ? 'timeline-dot--active' : 'timeline-dot--pending'">
                  <v-icon :icon="step.done ? 'fas fa-check' : step.active ? 'fas fa-circle-dot' : 'fas fa-circle'" size="10" :color="step.done ? 'white' : step.active ? 'org-user' : 'medium-emphasis'" />
                </div>
                <div v-if="i < timeline.length - 1" class="timeline-line" :class="step.done ? 'timeline-line--done' : ''" />
              </div>
              <div class="pb-3">
                <div class="text-body-2 font-weight-medium" :class="step.active ? 'text-org-user' : step.done ? '' : 'text-medium-emphasis'">{{ step.label }}</div>
                <div v-if="step.date" class="text-caption text-medium-emphasis">{{ step.date }}</div>
                <div v-if="step.note" class="text-caption text-warning mt-1">{{ step.note }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Officer Note -->
        <v-alert v-if="app.officerNote" color="warning" variant="tonal" rounded="xl" class="mb-4" prepend-icon="fas fa-triangle-exclamation">
          <div class="text-body-2 font-weight-medium mb-1">หมายเหตุจากเจ้าหน้าที่</div>
          <div class="text-body-2">{{ app.officerNote }}</div>
        </v-alert>

        <!-- Actions -->
        <v-card v-if="app.status === 'revision_required'" rounded="xl" elevation="0">
          <div class="section-header">
            <v-icon icon="fas fa-bolt" color="warning" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ดำเนินการ</span>
          </div>
          <v-card-text class="pa-4">
            <v-btn color="warning" variant="tonal" block rounded="lg" prepend-icon="fas fa-pen-to-square" class="mb-2">แก้ไขและส่งใหม่</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const app = {
  requestNo: 'ORG-2568-00003',
  status: 'revision_required',
  submittedDate: '5 มี.ค. 2568',
  updatedDate: '10 มี.ค. 2568',
  applicantName: 'นายสมชาย ใจดี',
  idCard: '1-1000-00000-00-0',
  phone: '081-234-5678',
  email: 'somchai@example.com',
  address: '123 หมู่ 5 ต.บ้านดง',
  province: 'เชียงใหม่',
  area: '15',
  cropType: 'ข้าว',
  plotCount: '3',
  standard: 'มกษ.9000',
  plotAddress: 'ต.บ้านดง อ.แม่แจ่ม จ.เชียงใหม่',
  coordinates: '18.7061° N, 98.9817° E',
  officerNote: 'เอกสารสิทธิ์ที่ดินไม่ครบถ้วน กรุณาแนบโฉนดที่ดินให้ครบทุกแปลง',
  documents: [
    { name: 'สำเนาบัตรประชาชน.pdf', uploadedAt: '5 มี.ค. 2568' },
    { name: 'ทะเบียนบ้าน.pdf', uploadedAt: '5 มี.ค. 2568' },
    { name: 'เอกสารสิทธิ์ที่ดิน.pdf', uploadedAt: '5 มี.ค. 2568' },
  ],
}

const timeline = [
  { label: 'ยื่นคำขอ', date: '5 มี.ค. 2568', done: true, active: false },
  { label: 'ตรวจสอบเอกสาร', date: '8 มี.ค. 2568', done: true, active: false },
  { label: 'แก้ไขเอกสาร', done: false, active: true, note: 'รอผู้ประกอบการแก้ไข' },
  { label: 'ตรวจแปลง', done: false, active: false },
  { label: 'เสนอคณะกรรมการ (CC)', done: false, active: false },
  { label: 'อนุมัติ / ออกใบรับรอง', done: false, active: false },
]

function statusColor(s: string) {
  const m: Record<string, string> = { submitted: 'primary', under_review: 'info', inspection_scheduled: 'secondary', revision_required: 'warning', approved: 'success', rejected: 'error' }
  return m[s] ?? 'grey'
}
function statusIcon(s: string) {
  const m: Record<string, string> = { submitted: 'fas fa-paper-plane', under_review: 'fas fa-magnifying-glass', inspection_scheduled: 'fas fa-calendar-check', revision_required: 'fas fa-pen-to-square', approved: 'fas fa-circle-check', rejected: 'fas fa-circle-xmark' }
  return m[s] ?? 'fas fa-circle'
}
function statusLabel(s: string) {
  const m: Record<string, string> = { submitted: 'ยื่นแล้ว', under_review: 'อยู่ระหว่างตรวจสอบ', inspection_scheduled: 'นัดตรวจแล้ว', revision_required: 'รอแก้ไข', approved: 'อนุมัติแล้ว', rejected: 'ไม่ผ่าน' }
  return m[s] ?? s
}
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 12px; color: rgba(var(--v-theme-on-surface), 0.55); }
.info-value { font-size: 14px; font-weight: 500; }
.info-stat { padding: 12px; background: rgba(var(--v-border-color), 0.04); border-radius: 10px; text-align: center; }
.timeline-dot-wrap { width: 20px; flex-shrink: 0; }
.timeline-dot {
  width: 20px; height: 20px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.timeline-dot--done { background: rgb(var(--v-theme-success)); }
.timeline-dot--active { background: rgba(var(--v-theme-org-user), 0.12); border: 2px solid rgb(var(--v-theme-org-user)); }
.timeline-dot--pending { background: rgba(var(--v-border-color), 0.1); border: 1.5px solid rgba(var(--v-border-color), 0.3); }
.timeline-line {
  width: 2px; flex-grow: 1; min-height: 16px;
  background: rgba(var(--v-border-color), 0.2); margin: 2px 0;
}
.timeline-line--done { background: rgb(var(--v-theme-success)); }
</style>
