<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
      <div>
        <h1 class="text-h5 font-weight-bold mb-0">ยื่นคำขอรับรองแหล่งผลิต GAP</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">กรอกข้อมูลให้ครบถ้วน แล้วยื่นเพื่อรับการตรวจสอบ</p>
      </div>
    </div>

    <!-- Stepper Header -->
    <v-card class="mb-5">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <!-- Step -->
            <div class="step-item d-flex flex-column align-center" style="min-width:80px">
              <div class="step-circle mb-1"
                :class="{
                  'step-done':    currentStep > step.value,
                  'step-active':  currentStep === step.value,
                  'step-pending': currentStep < step.value,
                }">
                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14" color="white" />
                <span v-else class="text-caption font-weight-bold">{{ step.value }}</span>
              </div>
              <div class="text-caption text-center"
                :class="currentStep >= step.value ? 'text-primary font-weight-bold' : 'text-medium-emphasis'">
                {{ step.title }}
              </div>
            </div>
            <!-- Connector -->
            <div v-if="i < steps.length - 1" class="step-line flex-grow-1"
              :class="currentStep > step.value ? 'step-line--done' : ''" />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- Step Content -->
    <v-window v-model="currentStep">

      <!-- Step 1: ข้อมูลผู้ยื่นคำขอ -->
      <v-window-item :value="1">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="primary">fas fa-user</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 1 · ข้อมูลผู้ยื่นคำขอ</span>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="2">
                <div class="field-label">คำนำหน้า <span class="req">*</span></div>
                <v-select v-model="form.namePrefix" :items="['นาย','นาง','นางสาว','เด็กชาย','เด็กหญิง']" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">ชื่อ <span class="req">*</span></div>
                <v-text-field v-model="form.firstName" placeholder="ชื่อจริง" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">นามสกุล <span class="req">*</span></div>
                <v-text-field v-model="form.lastName" placeholder="นามสกุล" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เลขบัตรประชาชน <span class="req">*</span></div>
                <v-text-field v-model="form.idCard" placeholder="X-XXXX-XXXXX-XX-X"
                  prepend-inner-icon="fas fa-id-card" :rules="[rules.required, rules.idCard]"
                  maxlength="13" counter hint="ตัวเลข 13 หลัก ไม่ใส่ขีด" persistent-hint />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เบอร์โทรศัพท์ <span class="req">*</span></div>
                <v-text-field v-model="form.phone" placeholder="0XX-XXX-XXXX"
                  prepend-inner-icon="fas fa-phone" :rules="[rules.required, rules.phone]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">อีเมล</div>
                <v-text-field v-model="form.email" placeholder="example@email.com"
                  prepend-inner-icon="fas fa-envelope" hint="ถ้ามี — ใช้รับการแจ้งเตือน" persistent-hint />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 2: ที่อยู่ + ข้อมูลแปลง -->
      <v-window-item :value="2">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="primary">fas fa-location-dot</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 2 · ที่อยู่ที่ติดต่อ</span>
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
                <v-text-field v-model="form.postalCode" placeholder="XXXXX"
                  prepend-inner-icon="fas fa-map-pin" maxlength="5" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">จังหวัด <span class="req">*</span></div>
                <v-select v-model="form.province" :items="provinces"
                  prepend-inner-icon="fas fa-map" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">อำเภอ / เขต</div>
                <v-select v-model="form.district"
                  :items="['อำเภอเมือง','อำเภอปากช่อง','อำเภอโชคชัย']"
                  prepend-inner-icon="fas fa-city" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ตำบล / แขวง</div>
                <v-select v-model="form.subDistrict"
                  :items="['ตำบลในเมือง','ตำบลโพธิ์กลาง','ตำบลหนองไข่น้ำ']"
                  prepend-inner-icon="fas fa-map-pin" hide-details="auto" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="0" border rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="primary">fas fa-seedling</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 3 · ข้อมูลแปลงและการผลิต</span>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">ชนิดพืช <span class="req">*</span></div>
                <v-select v-model="form.cropTypes" :items="cropTypes"
                  prepend-inner-icon="fas fa-seedling" multiple chips closable-chips
                  :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">ผู้ตรวจประเมิน</div>
                <v-autocomplete v-model="form.inspector" :items="inspectors"
                  prepend-inner-icon="fas fa-user-check" clearable hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6" class="mt-2">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-caption text-medium-emphasis">พื้นที่แปลงปลูก (ไร่)</span>
                  <v-text-field v-model.number="form.area" density="compact" variant="outlined"
                    style="max-width:90px" type="number" suffix="ไร่" hide-details :min="0" :max="100" />
                </div>
                <v-slider v-model="form.area" color="primary" :min="0" :max="100" :step="0.5" thumb-label hide-details />
              </v-col>
              <v-col cols="12" sm="6" class="mt-2">
                <div class="text-caption text-medium-emphasis mb-1">
                  ระดับความสูง (เมตร) &nbsp;
                  <strong>{{ form.elevRange[0] }}</strong> – <strong>{{ form.elevRange[1] }}</strong> ม.
                </div>
                <v-range-slider v-model="form.elevRange" color="info"
                  :min="0" :max="2000" :step="50" thumb-label hide-details class="mt-2" />
              </v-col>
              <v-col cols="12"><v-divider class="my-2" /></v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ประเภทคำขอ</div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-radio-group v-model="form.appType" color="primary" density="compact" hide-details>
                    <v-radio label="รายเดี่ยว" value="single" />
                    <v-radio label="รายกลุ่ม" value="group" />
                    <v-radio label="ต่ออายุ"  value="renew" />
                  </v-radio-group>
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">สถานะการผลิต</div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-switch v-model="form.organic" label="เกษตรอินทรีย์" color="primary"
                    base-color="grey-darken-1" inset density="compact" hide-details class="mb-2" />
                  <v-switch v-model="form.groupApp" label="ยื่นคำขอรายกลุ่ม" color="info"
                    base-color="grey-darken-1" inset density="compact" hide-details />
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ข้อกำหนด GAP</div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-checkbox v-model="form.water"    label="มีแหล่งน้ำในพื้นที่"  color="primary" density="compact" hide-details class="mb-1" />
                  <v-checkbox v-model="form.record"   label="มีการบันทึกการผลิต"  color="primary" density="compact" hide-details class="mb-1" />
                  <v-checkbox v-model="form.chemical" label="บันทึกการใช้สารเคมี" color="warning" density="compact" hide-details />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 3: เอกสาร -->
      <v-window-item :value="3">
        <v-card elevation="0" border rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="primary">fas fa-paperclip</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 4 · เอกสารและหลักฐาน</span>
            <v-spacer />
            <v-chip size="x-small" variant="tonal" color="warning">ไม่เกินไฟล์ละ 10 MB</v-chip>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">เอกสารประกอบ</div>
                <v-file-input v-model="form.docs" accept=".pdf,.doc,.docx"
                  multiple show-size chips
                  hint="สำเนาโฉนด, ผลวิเคราะห์น้ำ · รองรับ PDF, DOC" persistent-hint />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">รูปภาพแปลงปลูก</div>
                <v-file-input v-model="form.photos" prepend-icon="fas fa-camera"
                  accept="image/*" multiple show-size chips
                  hint="JPG, PNG · ความละเอียดไม่ต่ำกว่า 1 MB" persistent-hint />
                <div v-if="photoPreviewUrls.length" class="d-flex flex-wrap ga-2 mt-3">
                  <v-img v-for="(url, i) in photoPreviewUrls" :key="i"
                    :src="url" width="80" height="80" cover rounded="lg" class="border" />
                </div>
              </v-col>
              <v-col cols="12">
                <div class="field-label">แท็กเพิ่มเติม</div>
                <v-combobox v-model="form.tags" :items="suggestedTags"
                  prepend-inner-icon="fas fa-tags" multiple chips closable-chips
                  hint="พิมพ์แล้ว Enter เพื่อเพิ่มแท็กใหม่" persistent-hint />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 4: ตรวจสอบ & ยื่น -->
      <v-window-item :value="4">
        <v-card elevation="0" border rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="primary">fas fa-clipboard-check</v-icon>
            <span class="text-subtitle-2 font-weight-bold">ตรวจสอบข้อมูลก่อนยื่น</span>
          </div>
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ชื่อ-นามสกุล">
                    <v-list-item-title>{{ form.namePrefix }} {{ form.firstName }} {{ form.lastName }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="เลขบัตรประชาชน">
                    <v-list-item-title>{{ form.idCard || '-' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="เบอร์โทรศัพท์">
                    <v-list-item-title>{{ form.phone || '-' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="จังหวัด">
                    <v-list-item-title>{{ form.province || '-' }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ชนิดพืช">
                    <v-list-item-title>{{ form.cropTypes.join(', ') || '-' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="พื้นที่แปลงปลูก">
                    <v-list-item-title>{{ form.area }} ไร่</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ประเภทคำขอ">
                    <v-list-item-title>{{ form.appType === 'single' ? 'รายเดี่ยว' : form.appType === 'group' ? 'รายกลุ่ม' : 'ต่ออายุ' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="เกษตรอินทรีย์">
                    <v-list-item-title>{{ form.organic ? 'ใช่' : 'ไม่ใช่' }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-alert type="info" variant="tonal" class="mt-4" prepend-icon="fas fa-circle-info">
              กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยื่น — หลังจากยื่นแล้วจะไม่สามารถแก้ไขได้จนกว่าเจ้าหน้าที่จะแจ้งให้แก้ไข
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Navigation Buttons -->
    <div class="d-flex align-center ga-3 mt-5">
      <v-btn v-if="currentStep > 1" variant="outlined" color="grey-darken-1"
        prepend-icon="fas fa-arrow-left" @click="currentStep--">ย้อนกลับ</v-btn>
      <v-btn variant="tonal" color="grey-darken-1" prepend-icon="fas fa-floppy-disk">บันทึกร่าง</v-btn>
      <v-spacer />
      <v-btn v-if="currentStep < steps.length" color="primary" append-icon="fas fa-arrow-right"
        @click="currentStep++">ถัดไป</v-btn>
      <v-btn v-else color="success" prepend-icon="fas fa-paper-plane" size="large"
        @click="submitForm">ยื่นคำขอ</v-btn>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="mb-4">
            <v-icon icon="fas fa-circle-check" color="success" size="64" />
          </div>
          <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            เลขที่คำขอ: <strong class="text-primary">GAP-2567-011</strong><br>
            เจ้าหน้าที่จะติดต่อกลับภายใน 3-5 วันทำการ
          </p>
          <v-btn color="primary" block @click="router.push('/gap/user/applications')">
            ดูรายการคำขอ
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep   = ref(1)
const successDialog = ref(false)

const steps = [
  { value: 1, title: 'ข้อมูลผู้ขอ' },
  { value: 2, title: 'ข้อมูลแปลง' },
  { value: 3, title: 'เอกสารแนบ' },
  { value: 4, title: 'ตรวจสอบ & ยื่น' },
]

const form = ref({
  namePrefix: 'นาย', firstName: '', lastName: '',
  idCard: '', phone: '', email: '',
  address: '', postalCode: '', province: null, district: null, subDistrict: null,
  cropTypes: [] as string[], inspector: null, tags: [] as string[],
  water: true, record: false, chemical: false,
  organic: false, groupApp: false, appType: 'single',
  area: 12, elevRange: [100, 500],
  docs: [] as File[], photos: [] as File[],
})

const photoPreviewUrls = ref<string[]>([])
watch(() => form.value.photos, (files) => {
  photoPreviewUrls.value.forEach(url => URL.revokeObjectURL(url))
  photoPreviewUrls.value = (files ?? []).map(f => URL.createObjectURL(f))
})
onUnmounted(() => photoPreviewUrls.value.forEach(url => URL.revokeObjectURL(url)))

const rules = {
  required: (v: string) => !!v || 'กรุณากรอกข้อมูล',
  idCard:   (v: string) => /^\d{13}$/.test(v) || 'เลขบัตรประชาชน 13 หลัก',
  phone:    (v: string) => /^0\d{8,9}$/.test(v) || 'รูปแบบเบอร์โทรไม่ถูกต้อง',
}

const provinces    = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ขอนแก่น', 'นครราชสีมา', 'สุพรรณบุรี', 'เพชรบูรณ์']
const cropTypes    = ['ข้าวหอมมะลิ', 'ข้าวโพด', 'มันสำปะหลัง', 'อ้อย', 'ผักกาดขาว', 'มะเขือเทศ']
const inspectors   = ['นาย วิจัย ตรวจดี', 'นาง สุดา ประเมิน', 'นาย ชัยวัฒน์ ผลตรวจ']
const suggestedTags = ['เกษตรอินทรีย์', 'ปลอดสาร', 'GAP', 'พืชส่งออก']

function submitForm() {
  successDialog.value = true
}
</script>

<style scoped>
.field-label { font-size: 13px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.75); margin-bottom: 6px; }
.req { color: rgb(var(--v-theme-error)); }

.step-circle {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; transition: all 0.2s ease;
}
.step-done    { background: rgb(var(--v-theme-primary)); color: white; }
.step-active  { background: rgb(var(--v-theme-primary)); color: white; box-shadow: 0 0 0 4px rgba(var(--v-theme-primary), 0.2); }
.step-pending { background: rgba(var(--v-theme-on-surface), 0.1); color: rgba(var(--v-theme-on-surface), 0.5); }

.step-line {
  height: 2px; margin: 0 4px; margin-bottom: 20px;
  background: rgba(var(--v-theme-on-surface), 0.12);
  transition: background 0.3s ease;
}
.step-line--done { background: rgb(var(--v-theme-primary)); }
</style>
