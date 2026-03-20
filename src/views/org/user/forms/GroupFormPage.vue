<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.push('/org/user/applications/new')" />
      <div>
        <h1 class="page-title mb-1">คำขอรับรอง ORG (รายกลุ่ม)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">สำหรับกลุ่มเกษตรกร / วิสาหกิจชุมชน</p>
      </div>
    </div>

    <!-- Step indicator -->
    <v-card rounded="xl" elevation="0" class="mb-6">
      <v-card-text class="pa-4">
        <div class="d-flex align-center ga-2">
          <div v-for="(step, i) in steps" :key="i" class="d-flex align-center ga-2 flex-grow-1">
            <div class="step-circle" :class="currentStep > i ? 'step-circle--done' : currentStep === i ? 'step-circle--active' : 'step-circle--pending'">
              <v-icon v-if="currentStep > i" icon="fas fa-check" size="14" color="white" />
              <span v-else class="text-caption font-weight-bold">{{ i + 1 }}</span>
            </div>
            <div v-if="!$vuetify.display.xs" class="text-body-2" :class="currentStep === i ? 'font-weight-bold text-secondary' : 'text-medium-emphasis'">{{ step }}</div>
            <v-divider v-if="i < steps.length - 1" class="flex-grow-1" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Step 1: ข้อมูลกลุ่ม -->
    <template v-if="currentStep === 0">
      <v-row>
        <v-col cols="12" md="8">
          <v-card rounded="xl" elevation="0" class="mb-4">
            <div class="section-header">
              <v-icon icon="fas fa-people-group" color="secondary" size="15" />
              <span class="text-subtitle-2 font-weight-bold">ข้อมูลกลุ่มเกษตรกร</span>
            </div>
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12">
                  <div class="field-label mb-1">ชื่อกลุ่ม<span class="req">*</span> <span class="field-label-en">Group Name</span></div>
                  <v-text-field v-model="form.groupName" variant="outlined" density="compact" rounded="lg" hide-details placeholder="เช่น กลุ่มเกษตรอินทรีย์บ้านโนน" />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">ประเภทกลุ่ม<span class="req">*</span></div>
                  <v-select v-model="form.groupType" :items="groupTypes" variant="outlined" density="compact" rounded="lg" hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">เลขทะเบียนกลุ่ม <span class="field-label-en">Reg. No.</span></div>
                  <v-text-field v-model="form.groupRegNo" variant="outlined" density="compact" rounded="lg" hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">ชื่อประธานกลุ่ม<span class="req">*</span></div>
                  <v-text-field v-model="form.presidentName" variant="outlined" density="compact" rounded="lg" hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">เบอร์โทรศัพท์<span class="req">*</span></div>
                  <v-text-field v-model="form.phone" variant="outlined" density="compact" rounded="lg" hide-details prepend-inner-icon="fas fa-phone" />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">ชนิดพืช<span class="req">*</span></div>
                  <v-text-field v-model="form.cropType" variant="outlined" density="compact" rounded="lg" hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">มาตรฐานที่ขอ<span class="req">*</span></div>
                  <v-select v-model="form.standard" :items="standardOptions" variant="outlined" density="compact" rounded="lg" hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">พื้นที่รวม (ไร่)<span class="req">*</span></div>
                  <v-text-field v-model="form.totalArea" type="number" variant="outlined" density="compact" rounded="lg" hide-details suffix="ไร่" />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">จังหวัด<span class="req">*</span></div>
                  <v-autocomplete v-model="form.province" :items="provinces" variant="outlined" density="compact" rounded="lg" hide-details />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-alert color="secondary" variant="tonal" rounded="xl" prepend-icon="fas fa-people-group">
            <div class="text-body-2 font-weight-medium mb-1">การยื่นคำขอแบบกลุ่ม</div>
            <div class="text-body-2">จะต้องระบุรายชื่อสมาชิกและพื้นที่ของแต่ละสมาชิกในขั้นตอนถัดไป</div>
          </v-alert>
        </v-col>
      </v-row>
    </template>

    <!-- Step 2: รายชื่อสมาชิก -->
    <template v-if="currentStep === 1">
      <v-card rounded="xl" elevation="0" class="mb-4">
        <div class="section-header d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-2">
            <v-icon icon="fas fa-list-ul" color="secondary" size="15" />
            <span class="text-subtitle-2 font-weight-bold">รายชื่อสมาชิกกลุ่ม</span>
          </div>
          <v-btn color="secondary" variant="tonal" size="small" prepend-icon="fas fa-plus" @click="addMember">เพิ่มสมาชิก</v-btn>
        </div>
        <v-card-text class="pa-5">
          <div v-if="members.length === 0" class="text-center pa-8 text-medium-emphasis">
            <v-icon icon="fas fa-people-group" size="40" style="opacity:0.2" />
            <p class="text-body-2 mt-2 mb-0">ยังไม่มีรายชื่อสมาชิก กดปุ่ม "เพิ่มสมาชิก"</p>
          </div>
          <div v-for="(m, i) in members" :key="i" class="member-row mb-3">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon icon="fas fa-user" color="secondary" size="14" />
              <span class="text-body-2 font-weight-medium">สมาชิกที่ {{ i + 1 }}</span>
              <v-spacer />
              <v-btn icon="fas fa-trash" size="x-small" variant="text" color="error" @click="removeMember(i)" />
            </div>
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">ชื่อ-นามสกุล<span class="req">*</span></div>
                <v-text-field v-model="m.name" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label mb-1">เลขบัตรประชาชน<span class="req">*</span></div>
                <v-text-field v-model="m.idCard" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label mb-1">พื้นที่ (ไร่)<span class="req">*</span></div>
                <v-text-field v-model="m.area" type="number" variant="outlined" density="compact" rounded="lg" hide-details suffix="ไร่" />
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label mb-1">จำนวนแปลง</div>
                <v-text-field v-model="m.plots" type="number" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Step 3: แนบเอกสาร -->
    <template v-if="currentStep === 2">
      <v-card rounded="xl" elevation="0">
        <div class="section-header">
          <v-icon icon="fas fa-paperclip" color="secondary" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pa-5">
          <div v-for="doc in requiredDocs" :key="doc.key" class="doc-upload-row mb-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <div>
                <div class="text-body-2 font-weight-medium">{{ doc.label }}<span v-if="doc.required" class="req ml-1">*</span></div>
                <div class="text-caption text-medium-emphasis">{{ doc.desc }}</div>
              </div>
              <v-chip v-if="uploadedFiles[doc.key]" size="x-small" color="success" variant="tonal" prepend-icon="fas fa-check">อัปโหลดแล้ว</v-chip>
              <v-chip v-else-if="doc.required" size="x-small" color="error" variant="tonal">จำเป็น</v-chip>
              <v-chip v-else size="x-small" color="grey" variant="tonal">ถ้ามี</v-chip>
            </div>
            <v-file-input
              :model-value="uploadedFiles[doc.key]"
              @update:model-value="(v) => uploadedFiles[doc.key] = v"
              accept=".pdf,.jpg,.png"
              variant="outlined" density="compact" rounded="lg" hide-details
              prepend-icon="" prepend-inner-icon="fas fa-upload"
              :placeholder="`เลือกไฟล์ ${doc.label}`"
            />
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Actions -->
    <div class="d-flex justify-space-between mt-6">
      <v-btn v-if="currentStep > 0" variant="tonal" color="grey" prepend-icon="fas fa-arrow-left" @click="currentStep--">ย้อนกลับ</v-btn>
      <v-spacer v-else />
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="grey" @click="router.push('/org/user/applications')">ยกเลิก</v-btn>
        <v-btn v-if="currentStep < steps.length - 1" color="secondary" append-icon="fas fa-arrow-right" @click="currentStep++">ถัดไป</v-btn>
        <v-btn v-else color="secondary" prepend-icon="fas fa-paper-plane" @click="successDialog = true">ยืนยันคำขอ</v-btn>
      </div>
    </div>

    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">เลขที่คำขอ: <strong>ORG-GRP-2568-00002</strong></p>
          <p class="text-body-2 text-medium-emphasis mb-0">ระบบจะแจ้งเตือนเมื่อมีการอัปเดตสถานะ</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="secondary" rounded="lg" block @click="router.push('/org/user/applications')">ดูรายการคำขอ</v-btn>
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
const successDialog = ref(false)

const steps = ['ข้อมูลกลุ่ม', 'รายชื่อสมาชิก', 'แนบเอกสาร']

const form = reactive({ groupName: '', groupType: '', groupRegNo: '', presidentName: '', phone: '', cropType: '', standard: '', totalArea: '', province: '' })

interface Member { name: string; idCard: string; area: string; plots: string }
const members = ref<Member[]>([])

function addMember() { members.value.push({ name: '', idCard: '', area: '', plots: '' }) }
function removeMember(i: number) { members.value.splice(i, 1) }

const uploadedFiles = reactive<Record<string, File | null>>({ groupDoc: null, presidentId: null, memberList: null, landDoc: null })

const requiredDocs = [
  { key: 'groupDoc',    label: 'หนังสือรับรองกลุ่ม',      desc: 'ทะเบียนวิสาหกิจ / หนังสือจัดตั้งกลุ่ม', required: true },
  { key: 'presidentId', label: 'บัตรประชาชนประธาน',       desc: 'สำเนาบัตรประชาชนประธานกลุ่ม',           required: true },
  { key: 'memberList',  label: 'รายชื่อสมาชิก',            desc: 'เอกสารรายชื่อสมาชิกทั้งหมด',              required: true },
  { key: 'landDoc',     label: 'เอกสารสิทธิ์ที่ดิน',       desc: 'โฉนด / น.ส.3 ของสมาชิกแต่ละราย',         required: false },
]

const groupTypes = ['กลุ่มเกษตรกร', 'วิสาหกิจชุมชน', 'สหกรณ์การเกษตร', 'นิติบุคคล']
const standardOptions = ['มกษ.9000', 'มกษ.9001', 'มกษ.9002']
const provinces = ['เชียงใหม่', 'เชียงราย', 'ลำพูน', 'เพชรบูรณ์', 'นครราชสีมา', 'ขอนแก่น', 'อุบลราชธานี', 'ยโสธร', 'สุรินทร์']
</script>

<style scoped>
.section-header {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.step-circle {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.step-circle--done { background: rgb(var(--v-theme-success)); color: white; }
.step-circle--active { background: rgba(var(--v-theme-secondary), 0.15); border: 2px solid rgb(var(--v-theme-secondary)); color: rgb(var(--v-theme-secondary)); }
.step-circle--pending { background: rgba(var(--v-border-color), 0.08); border: 1.5px solid rgba(var(--v-border-color), 0.3); color: rgba(var(--v-theme-on-surface), 0.4); }
.member-row { padding: 14px; background: rgba(var(--v-border-color), 0.04); border-radius: 10px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.doc-upload-row { padding: 12px; background: rgba(var(--v-border-color), 0.04); border-radius: 10px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.field-label { font-size: 13px; font-weight: 500; color: rgba(var(--v-theme-on-surface), 0.75); }
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
.req { color: rgb(var(--v-theme-error)); }
.success-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(var(--v-theme-success), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
