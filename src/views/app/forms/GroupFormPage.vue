<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <v-chip size="x-small" color="info" variant="tonal" prepend-icon="fas fa-users">รายกลุ่ม</v-chip>
        </div>
        <h1 class="text-h5 font-weight-bold mb-0">คำขอรับรองแหล่งผลิต GAP พืช (รายกลุ่ม)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">สำหรับกลุ่มเกษตรกร / วิสาหกิจชุมชน / สหกรณ์</p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card class="mb-5">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div class="step-item d-flex flex-column align-center" style="min-width:72px">
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14" color="white" />
                <span v-else class="text-caption font-weight-bold">{{ step.value }}</span>
              </div>
              <div class="text-caption text-center" style="font-size:10px"
                :class="currentStep >= step.value ? 'text-info font-weight-bold' : 'text-medium-emphasis'">
                {{ step.title }}
              </div>
            </div>
            <div v-if="i < steps.length - 1" class="step-line flex-grow-1"
              :class="{ 'step-line--done-info': currentStep > step.value }" />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <v-window v-model="currentStep">

      <!-- Step 1: ข้อมูลกลุ่ม -->
      <v-window-item :value="1">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="info">fas fa-users</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 1 · ข้อมูลกลุ่มเกษตรกร</span>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="8">
                <div class="field-label">ชื่อกลุ่ม <span class="req">*</span></div>
                <v-text-field v-model="form.groupName" placeholder="เช่น กลุ่มเกษตรกรทำนาบ้านทุ่งสวรรค์"
                  prepend-inner-icon="fas fa-users" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เลขทะเบียนกลุ่ม</div>
                <v-text-field v-model="form.groupRegNo" placeholder="เลขทะเบียน (ถ้ามี)"
                  prepend-inner-icon="fas fa-hashtag" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">ประเภทกลุ่ม <span class="req">*</span></div>
                <v-select v-model="form.groupType"
                  :items="['กลุ่มเกษตรกร','วิสาหกิจชุมชน','สหกรณ์การเกษตร','กลุ่มแม่บ้านเกษตรกร','อื่นๆ']"
                  prepend-inner-icon="fas fa-sitemap" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">จำนวนสมาชิก (คน)</div>
                <v-text-field v-model.number="form.memberCount" type="number" :min="2"
                  prepend-inner-icon="fas fa-user-group" hide-details="auto" />
              </v-col>
              <v-col cols="12"><v-divider class="my-1" /></v-col>
              <v-col cols="12">
                <div class="field-label text-subtitle-2 font-weight-bold mb-2">ผู้แทนกลุ่ม / ผู้ประสานงาน <span class="req">*</span></div>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label">คำนำหน้า</div>
                <v-select v-model="form.repPrefix" :items="['นาย','นาง','นางสาว']" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">ชื่อ <span class="req">*</span></div>
                <v-text-field v-model="form.repFirstName" placeholder="ชื่อจริง" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">นามสกุล <span class="req">*</span></div>
                <v-text-field v-model="form.repLastName" placeholder="นามสกุล" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เลขบัตรประชาชน <span class="req">*</span></div>
                <v-text-field v-model="form.repIdCard" placeholder="X-XXXX-XXXXX-XX-X"
                  prepend-inner-icon="fas fa-id-card" :rules="[rules.required, rules.idCard]"
                  maxlength="13" counter hint="ตัวเลข 13 หลัก" persistent-hint />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เบอร์โทรศัพท์ <span class="req">*</span></div>
                <v-text-field v-model="form.repPhone" placeholder="0XX-XXX-XXXX"
                  prepend-inner-icon="fas fa-phone" :rules="[rules.required, rules.phone]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">อีเมล</div>
                <v-text-field v-model="form.repEmail" placeholder="example@email.com"
                  prepend-inner-icon="fas fa-envelope" hint="ถ้ามี" persistent-hint />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 2: รายชื่อสมาชิก -->
      <v-window-item :value="2">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="info">fas fa-list-ul</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 2 · รายชื่อสมาชิกกลุ่ม</span>
            <v-spacer />
            <v-btn size="small" color="info" variant="tonal" prepend-icon="fas fa-plus" @click="addMember">
              เพิ่มสมาชิก
            </v-btn>
          </div>
          <v-card-text class="pa-4">
            <v-alert v-if="members.length === 0" type="info" variant="tonal" class="mb-4">
              กดปุ่ม "เพิ่มสมาชิก" เพื่อเพิ่มรายชื่อสมาชิกในกลุ่ม
            </v-alert>

            <div v-for="(m, i) in members" :key="i" class="member-row mb-3 pa-4 rounded-xl">
              <div class="d-flex align-center mb-3">
                <v-chip size="small" color="info" variant="tonal" class="mr-2">สมาชิกที่ {{ i + 1 }}</v-chip>
                <v-spacer />
                <v-btn icon size="x-small" variant="text" color="error" @click="members.splice(i, 1)">
                  <v-icon icon="fas fa-trash" size="14" />
                </v-btn>
              </div>
              <v-row dense>
                <v-col cols="12" sm="2">
                  <div class="field-label">คำนำหน้า</div>
                  <v-select v-model="m.prefix" :items="['นาย','นาง','นางสาว']" density="compact" hide-details />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">ชื่อ <span class="req">*</span></div>
                  <v-text-field v-model="m.firstName" placeholder="ชื่อจริง" density="compact" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label">นามสกุล</div>
                  <v-text-field v-model="m.lastName" placeholder="นามสกุล" density="compact" hide-details />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">เลขบัตรประชาชน</div>
                  <v-text-field v-model="m.idCard" placeholder="13 หลัก" maxlength="13" density="compact" hide-details />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">ชนิดพืช</div>
                  <v-select v-model="m.crops" :items="cropTypes" multiple chips density="compact" hide-details />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">พื้นที่ (ไร่)</div>
                  <v-text-field v-model.number="m.area" type="number" suffix="ไร่" density="compact" hide-details :min="0" />
                </v-col>
              </v-row>
            </div>

            <v-btn v-if="members.length > 0" block variant="tonal" color="info"
              prepend-icon="fas fa-plus" class="mt-2" @click="addMember">
              เพิ่มสมาชิก
            </v-btn>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 3: ที่อยู่ + แปลง (รวม) -->
      <v-window-item :value="3">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="info">fas fa-location-dot</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 3 · ที่อยู่สำนักงานกลุ่ม / แหล่งผลิตหลัก</span>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="9">
                <div class="field-label">ที่อยู่ <span class="req">*</span></div>
                <v-textarea v-model="form.address" placeholder="บ้านเลขที่ / หมู่ที่ / ซอย / ถนน"
                  prepend-inner-icon="fas fa-house" rows="2" auto-grow :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">รหัสไปรษณีย์</div>
                <v-text-field v-model="form.postalCode" maxlength="5" prepend-inner-icon="fas fa-map-pin" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">จังหวัด <span class="req">*</span></div>
                <v-select v-model="form.province" :items="provinces"
                  prepend-inner-icon="fas fa-map" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">อำเภอ / เขต</div>
                <v-select v-model="form.district" :items="['อำเภอเมือง','อำเภอปากช่อง']"
                  prepend-inner-icon="fas fa-city" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ตำบล / แขวง</div>
                <v-select v-model="form.subDistrict" :items="['ตำบลในเมือง','ตำบลโพธิ์กลาง']"
                  prepend-inner-icon="fas fa-map-pin" hide-details="auto" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="info">fas fa-seedling</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 4 · ข้อมูลการผลิตรวมกลุ่ม</span>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">ชนิดพืชหลัก (รวมกลุ่ม) <span class="req">*</span></div>
                <v-select v-model="form.cropTypes" :items="cropTypes"
                  prepend-inner-icon="fas fa-seedling" multiple chips closable-chips
                  :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">ผู้ตรวจประเมิน</div>
                <v-autocomplete v-model="form.inspector" :items="inspectors"
                  prepend-inner-icon="fas fa-user-check" clearable hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">พื้นที่รวมทั้งกลุ่ม (ไร่)</div>
                <v-text-field v-model.number="form.totalArea" type="number" suffix="ไร่"
                  prepend-inner-icon="fas fa-ruler-combined" hide-details="auto" :min="0" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">ข้อกำหนด GAP</div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-checkbox v-model="form.water"    label="มีแหล่งน้ำในพื้นที่"  color="info" density="compact" hide-details class="mb-1" />
                  <v-checkbox v-model="form.record"   label="มีการบันทึกการผลิต"  color="info" density="compact" hide-details class="mb-1" />
                  <v-checkbox v-model="form.chemical" label="บันทึกการใช้สารเคมี" color="warning" density="compact" hide-details />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 4: เอกสาร -->
      <v-window-item :value="4">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="info">fas fa-paperclip</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 5 · เอกสารและหลักฐาน</span>
            <v-spacer />
            <v-chip size="x-small" variant="tonal" color="warning">ไม่เกินไฟล์ละ 10 MB</v-chip>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">เอกสารกลุ่ม (ทะเบียนกลุ่ม, รายชื่อสมาชิก)</div>
                <v-file-input v-model="form.groupDocs" accept=".pdf,.doc,.docx" multiple show-size chips
                  hint="รองรับ PDF, DOC" persistent-hint />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">เอกสารแปลง (สำเนาโฉนด, ผลวิเคราะห์น้ำ)</div>
                <v-file-input v-model="form.docs" accept=".pdf,.doc,.docx" multiple show-size chips
                  hint="รองรับ PDF, DOC" persistent-hint />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">รูปภาพแปลงปลูก</div>
                <v-file-input v-model="form.photos" prepend-icon="fas fa-camera"
                  accept="image/*" multiple show-size chips hint="JPG, PNG" persistent-hint />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 5: ตรวจสอบ -->
      <v-window-item :value="5">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="success">fas fa-clipboard-check</v-icon>
            <span class="text-subtitle-2 font-weight-bold">ตรวจสอบข้อมูลก่อนยื่น</span>
          </div>
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ชื่อกลุ่ม"><v-list-item-title>{{ form.groupName || '-' }}</v-list-item-title></v-list-item>
                  <v-list-item subtitle="ประเภทกลุ่ม"><v-list-item-title>{{ form.groupType || '-' }}</v-list-item-title></v-list-item>
                  <v-list-item subtitle="ผู้แทนกลุ่ม"><v-list-item-title>{{ form.repPrefix }} {{ form.repFirstName }} {{ form.repLastName }}</v-list-item-title></v-list-item>
                  <v-list-item subtitle="จำนวนสมาชิก"><v-list-item-title>{{ members.length }} คน (กรอกแล้ว) / {{ form.memberCount }} คน (ระบุ)</v-list-item-title></v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ชนิดพืชหลัก"><v-list-item-title>{{ form.cropTypes.join(', ') || '-' }}</v-list-item-title></v-list-item>
                  <v-list-item subtitle="พื้นที่รวม"><v-list-item-title>{{ form.totalArea }} ไร่</v-list-item-title></v-list-item>
                  <v-list-item subtitle="จังหวัด"><v-list-item-title>{{ form.province || '-' }}</v-list-item-title></v-list-item>
                  <v-list-item subtitle="ประเภทคำขอ"><v-list-item-title>รายกลุ่ม</v-list-item-title></v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-alert type="info" variant="tonal" class="mt-4" prepend-icon="fas fa-circle-info">
              กรุณาตรวจสอบข้อมูลให้ถูกต้อง โดยเฉพาะรายชื่อสมาชิกและพื้นที่แปลงก่อนยื่น
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Nav buttons -->
    <div class="d-flex align-center ga-3 mt-5">
      <v-btn v-if="currentStep > 1" variant="outlined" color="grey-darken-1"
        prepend-icon="fas fa-arrow-left" @click="currentStep--">ย้อนกลับ</v-btn>
      <v-btn variant="tonal" color="grey-darken-1" prepend-icon="fas fa-floppy-disk">บันทึกร่าง</v-btn>
      <v-spacer />
      <v-btn v-if="currentStep < steps.length" color="info" append-icon="fas fa-arrow-right"
        @click="currentStep++">ถัดไป</v-btn>
      <v-btn v-else color="success" prepend-icon="fas fa-paper-plane" size="large"
        @click="successDialog = true">ยื่นคำขอ</v-btn>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <v-icon icon="fas fa-circle-check" color="success" size="64" class="mb-4" />
          <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h2>
          <p class="text-body-2 text-medium-emphasis mb-5">
            เลขที่คำขอ: <strong class="text-primary">GAP-2567-012</strong><br>
            ประเภท: <strong>รายกลุ่ม</strong> · สมาชิก {{ members.length }} คน<br>
            เจ้าหน้าที่จะติดต่อกลับภายใน 3–5 วันทำการ
          </p>
          <v-btn color="primary" block @click="router.push('/app/applications')">ดูรายการคำขอ</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep   = ref(1)
const successDialog = ref(false)

const steps = [
  { value: 1, title: 'ข้อมูลกลุ่ม' },
  { value: 2, title: 'รายชื่อสมาชิก' },
  { value: 3, title: 'แปลงผลิต' },
  { value: 4, title: 'เอกสารแนบ' },
  { value: 5, title: 'ตรวจสอบ & ยื่น' },
]

function stepClass(v: number) {
  if (currentStep.value > v)   return 'step-done-info'
  if (currentStep.value === v) return 'step-active-info'
  return 'step-pending'
}

interface Member {
  prefix: string; firstName: string; lastName: string
  idCard: string; crops: string[]; area: number
}

const members = ref<Member[]>([])
function addMember() {
  members.value.push({ prefix: 'นาย', firstName: '', lastName: '', idCard: '', crops: [], area: 0 })
}

const form = ref({
  groupName: '', groupRegNo: '', groupType: null as string | null, memberCount: 2,
  repPrefix: 'นาย', repFirstName: '', repLastName: '', repIdCard: '', repPhone: '', repEmail: '',
  address: '', postalCode: '', province: null as string | null,
  district: null as string | null, subDistrict: null as string | null,
  cropTypes: [] as string[], inspector: null as string | null, totalArea: 0,
  water: true, record: false, chemical: false,
  docs: [] as File[], groupDocs: [] as File[], photos: [] as File[],
})

const rules = {
  required: (v: string) => !!v || 'กรุณากรอกข้อมูล',
  idCard:   (v: string) => /^\d{13}$/.test(v) || 'เลขบัตรประชาชน 13 หลัก',
  phone:    (v: string) => /^0\d{8,9}$/.test(v) || 'รูปแบบเบอร์โทรไม่ถูกต้อง',
}

const provinces  = ['กรุงเทพมหานคร','เชียงใหม่','ขอนแก่น','นครราชสีมา','สุพรรณบุรี','เพชรบูรณ์']
const cropTypes  = ['ข้าวหอมมะลิ','ข้าวโพด','มันสำปะหลัง','อ้อย','ผักกาดขาว','มะเขือเทศ']
const inspectors = ['นาย วิจัย ตรวจดี','นาง สุดา ประเมิน','นาย ชัยวัฒน์ ผลตรวจ']
</script>

<style scoped>
.section-header { display: flex; align-items: center; gap: 8px; padding: 12px 16px; }
.field-label { font-size: 13px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.75); margin-bottom: 6px; }
.req { color: rgb(var(--v-theme-error)); }
.member-row { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); background: rgba(var(--v-theme-surface-variant), 0.5); }
.step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.2s; }
.step-done-info    { background: rgb(var(--v-theme-info)); color: white; }
.step-active-info  { background: rgb(var(--v-theme-info)); color: white; box-shadow: 0 0 0 4px rgba(var(--v-theme-info),0.2); }
.step-pending { background: rgba(var(--v-theme-on-surface),0.1); color: rgba(var(--v-theme-on-surface),0.5); }
.step-line { height: 2px; margin: 0 4px; margin-bottom: 20px; background: rgba(var(--v-theme-on-surface),0.12); transition: background 0.3s; }
.step-line--done-info { background: rgb(var(--v-theme-info)); }
</style>
