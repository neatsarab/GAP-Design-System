<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.push('/doa/user/applications')" />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 mb-1 flex-wrap">
          <h1 class="page-title">{{ app.requestNo }}</h1>
          <v-chip size="small" :color="statusColor(app.status)" variant="tonal" :prepend-icon="statusIcon(app.status)">
            {{ statusLabel(app.status) }}
          </v-chip>
          <v-chip size="x-small" color="doa-user" variant="tonal">{{ typeLabel(app.type) }}</v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">ยื่นเมื่อ {{ app.submittedDate }} · อัปเดตล่าสุด {{ app.updatedDate }}</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="info" prepend-icon="fas fa-download" size="small">ดาวน์โหลด PDF</v-btn>
      </div>
    </div>

    <v-row>
      <!-- Main -->
      <v-col cols="12" md="8">

        <!-- ข้อมูลผู้ยื่นคำขอ -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-user" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ยื่นคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid">
              <div class="info-item"><span class="info-label">ชื่อ-นามสกุล (ไทย)</span><span class="info-value">{{ app.applicantNameTh }}</span></div>
              <div class="info-item"><span class="info-label">ชื่อ-นามสกุล (อังกฤษ)</span><span class="info-value">{{ app.applicantNameEn }}</span></div>
              <div class="info-item"><span class="info-label">เลขบัตรประชาชน</span><span class="info-value">{{ app.idCard }}</span></div>
              <div class="info-item"><span class="info-label">ตำแหน่ง</span><span class="info-value">{{ app.position }}</span></div>
              <div class="info-item"><span class="info-label">โทรศัพท์</span><span class="info-value">{{ app.phone }}</span></div>
              <div class="info-item"><span class="info-label">อีเมล</span><span class="info-value">{{ app.email }}</span></div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลโรงงาน -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-industry" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลโรงงาน / สถานประกอบการ</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense class="mb-4">
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-doa-user">{{ app.certType }}</div>
                  <div class="text-caption text-medium-emphasis">ประเภทใบรับรอง</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-info">{{ app.scope }}</div>
                  <div class="text-caption text-medium-emphasis">ขอบข่าย</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-secondary">{{ app.productType }}</div>
                  <div class="text-caption text-medium-emphasis">ประเภทผลิตภัณฑ์</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-success">{{ app.province }}</div>
                  <div class="text-caption text-medium-emphasis">จังหวัด</div>
                </div>
              </v-col>
            </v-row>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">ชื่อโรงงาน (ไทย)</span><span class="info-value">{{ app.factoryNameTh }}</span></div>
              <div class="info-item"><span class="info-label">ชื่อโรงงาน (อังกฤษ)</span><span class="info-value">{{ app.factoryNameEn }}</span></div>
              <div class="info-item"><span class="info-label">เลขทะเบียนนิติบุคคล</span><span class="info-value">{{ app.jurRegNo }}</span></div>
              <div class="info-item"><span class="info-label">โทรศัพท์โรงงาน</span><span class="info-value">{{ app.factoryPhone }}</span></div>
              <div class="info-item"><span class="info-label">ที่อยู่โรงงาน</span><span class="info-value">{{ app.factoryAddress }}</span></div>
            </div>
          </v-card-text>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-paperclip" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-list density="compact" class="pa-2">
            <v-list-item v-for="doc in app.documents" :key="doc.name" rounded="lg" class="mb-1">
              <template #prepend>
                <v-icon icon="fas fa-file-pdf" color="error" size="16" class="mr-2" />
              </template>
              <v-list-item-title class="text-body-2">{{ doc.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ doc.uploadedAt }}</v-list-item-subtitle>
              <template #append>
                <v-chip size="x-small" :color="doc.verified ? 'success' : 'warning'" variant="tonal" class="mr-2">
                  {{ doc.verified ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ' }}
                </v-chip>
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
            <v-icon icon="fas fa-timeline" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ความคืบหน้าคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <div v-for="(step, i) in timeline" :key="i" class="d-flex ga-3 mb-2">
              <div class="d-flex flex-column align-center" style="width:20px;flex-shrink:0">
                <div class="tl-dot" :class="step.done ? 'tl-dot--done' : step.active ? 'tl-dot--active' : 'tl-dot--pending'">
                  <v-icon :icon="step.done ? 'fas fa-check' : step.active ? 'fas fa-circle-dot' : 'fas fa-circle'" size="9"
                    :color="step.done ? 'white' : step.active ? 'doa-user' : 'grey'" />
                </div>
                <div v-if="i < timeline.length - 1" class="tl-line" :class="step.done ? 'tl-line--done' : ''" />
              </div>
              <div class="pb-3 flex-grow-1">
                <div class="text-body-2 font-weight-medium" :class="step.active ? 'text-doa-user' : step.done ? '' : 'text-medium-emphasis'">
                  {{ step.label }}
                </div>
                <div v-if="step.date" class="text-caption text-medium-emphasis">{{ step.date }}</div>
                <div v-if="step.by" class="text-caption text-medium-emphasis">{{ step.by }}</div>
                <div v-if="step.note" class="text-caption text-warning mt-0.5">
                  <v-icon icon="fas fa-triangle-exclamation" size="10" color="warning" class="mr-1" />{{ step.note }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Officer Note -->
        <v-alert v-if="app.officerNote" color="warning" variant="tonal" rounded="xl" class="mb-4" prepend-icon="fas fa-triangle-exclamation">
          <div class="text-body-2 font-weight-medium mb-1">หมายเหตุจากเจ้าหน้าที่</div>
          <div class="text-body-2">{{ app.officerNote }}</div>
        </v-alert>

        <!-- Quick actions -->
        <v-card rounded="xl" elevation="0">
          <div class="section-header">
            <v-icon icon="fas fa-bolt" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ดำเนินการ</span>
          </div>
          <v-card-text class="pa-3">
            <v-btn block variant="tonal" color="doa-user" class="mb-2" prepend-icon="fas fa-file-lines" rounded="lg"
              @click="router.push('/doa/user/applications')">
              รายการคำขอทั้งหมด
            </v-btn>
            <v-btn block variant="tonal" color="info" prepend-icon="fas fa-download" rounded="lg">
              ดาวน์โหลดใบรับคำขอ
            </v-btn>
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
  requestNo: 'DOA-2568-001',
  status: 'reviewing',
  type: 'register',
  submittedDate: '01/01/2568',
  updatedDate: '08/01/2568',
  certType: 'DOA',
  scope: 'แปรรูปพืช',
  productType: 'ผักและผลไม้สด',
  province: 'นครปฐม',
  applicantNameTh: 'นายสมชาย ใจดี',
  applicantNameEn: 'Mr. Somchai Jaidee',
  idCard: '1-1000-00000-00-0',
  position: 'กรรมการผู้จัดการ',
  phone: '081-234-5678',
  email: 'somchai@example.com',
  factoryNameTh: 'บริษัท ไทยฟูดโปรดักส์ จำกัด',
  factoryNameEn: 'Thai Food Products Co., Ltd.',
  jurRegNo: '0105566012345',
  factoryPhone: '034-123-456',
  factoryAddress: '99 หมู่ 3 ต.ไร่ขิง อ.สามพราน จ.นครปฐม 73210',
  officerNote: 'กรุณาแนบเพิ่มเติม: หนังสือรับรองบริษัทฉบับล่าสุด (ไม่เกิน 3 เดือน)',
  documents: [
    { name: 'สำเนาบัตรประชาชนผู้มีอำนาจ.pdf', uploadedAt: '01/01/2568', verified: true },
    { name: 'หนังสือรับรองบริษัท.pdf',          uploadedAt: '01/01/2568', verified: false },
    { name: 'แผนผังโรงงาน.pdf',                uploadedAt: '01/01/2568', verified: true },
    { name: 'ใบอนุญาตประกอบกิจการ.pdf',        uploadedAt: '01/01/2568', verified: true },
  ],
}

const timeline = [
  { label: 'ยื่นคำขอ',                date: '01/01/2568', by: 'นายสมชาย ใจดี',       done: true,  active: false },
  { label: 'รับคำขอเข้าสู่ระบบ',      date: '02/01/2568', by: 'ระบบอัตโนมัติ',        done: true,  active: false },
  { label: 'ตรวจสอบเอกสาร',           date: '08/01/2568', by: 'เจ้าหน้าที่ DOA',      done: false, active: true,  note: 'รอเอกสารเพิ่มเติม' },
  { label: 'ลงพื้นที่ตรวจโรงงาน',    date: '',           by: '',                      done: false, active: false },
  { label: 'คณะกรรมการพิจารณา',       date: '',           by: '',                      done: false, active: false },
  { label: 'ลงนาม / ออกทะเบียน',      date: '',           by: '',                      done: false, active: false },
]

function statusColor(s: string) {
  const m: Record<string, string> = { pending: 'warning', reviewing: 'info', inspection: 'secondary', approved: 'success', rejected: 'error' }
  return m[s] ?? 'grey'
}
function statusIcon(s: string) {
  const m: Record<string, string> = { pending: 'fas fa-clock', reviewing: 'fas fa-magnifying-glass', inspection: 'fas fa-person-walking', approved: 'fas fa-circle-check', rejected: 'fas fa-circle-xmark' }
  return m[s] ?? 'fas fa-circle'
}
function statusLabel(s: string) {
  const m: Record<string, string> = { pending: 'รอพิจารณา', reviewing: 'อยู่ระหว่างพิจารณา', inspection: 'ลงพื้นที่ตรวจ', approved: 'ผ่าน', rejected: 'ไม่ผ่าน' }
  return m[s] ?? s
}
function typeLabel(t: string) {
  const m: Record<string, string> = { register: 'ขึ้นทะเบียน / ต่ออายุ', amendment: 'เปลี่ยนแปลงทะเบียน', scope: 'เพิ่ม / ลดขอบข่าย' }
  return m[t] ?? t
}
</script>

<style scoped>
.section-header {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 12px; color: rgba(var(--v-theme-on-surface), 0.55); }
.info-value { font-size: 14px; font-weight: 500; }
.info-stat { padding: 10px; background: rgba(var(--v-border-color), 0.04); border-radius: 10px; text-align: center; }
.tl-dot { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tl-dot--done { background: rgb(var(--v-theme-success)); }
.tl-dot--active { background: rgba(var(--v-theme-doa-user), 0.12); border: 2px solid rgb(var(--v-theme-doa-user)); }
.tl-dot--pending { background: rgba(var(--v-border-color), 0.1); border: 1.5px solid rgba(var(--v-border-color), 0.3); }
.tl-line { width: 2px; flex-grow: 1; min-height: 14px; background: rgba(var(--v-border-color), 0.2); margin: 2px 0; }
.tl-line--done { background: rgb(var(--v-theme-success)); }
</style>
