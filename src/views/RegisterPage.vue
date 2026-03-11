<template>
  <div class="login-root" :class="{ 'is-dark': themeStore.isDark }">

    <!-- Left panel — branding (same as login) -->
    <div class="login-left d-none d-md-flex">
      <div class="login-left-inner">
        <div class="brand-logo mb-8">
          <div class="brand-icon-ring">
            <v-icon icon="fas fa-leaf" size="36" color="white" />
          </div>
        </div>
        <h1 class="text-h4 font-weight-bold text-white mb-3" style="line-height:1.2">
          กรมวิชาการเกษตร
        </h1>
        <p class="text-body-1 mb-1" style="color:rgba(255,255,255,0.75)">Department of Agriculture</p>
        <p class="text-body-2 mb-10" style="color:rgba(255,255,255,0.55)">กระทรวงเกษตรและสหกรณ์</p>

        <div class="feature-list">
          <div v-for="f in features" :key="f.text" class="feature-item">
            <div class="feature-icon">
              <v-icon :icon="f.icon" size="15" color="white" />
            </div>
            <span class="text-body-2" style="color:rgba(255,255,255,0.85)">{{ f.text }}</span>
          </div>
        </div>

        <div class="login-left-footer">
          <v-chip size="small" color="white" variant="outlined" style="color:rgba(255,255,255,0.7)">
            <v-icon start icon="fas fa-shield-halved" size="12" />
            ระบบมาตรฐาน SSL/TLS ปลอดภัย
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Right panel — register form -->
    <div class="login-right d-flex align-center justify-center">
      <div class="login-form-wrapper">

        <!-- Mobile brand -->
        <div class="d-flex d-md-none align-center ga-3 mb-8">
          <div class="brand-icon-ring-sm">
            <v-icon icon="fas fa-leaf" size="20" color="white" />
          </div>
          <div>
            <div class="text-body-1 font-weight-bold text-primary" style="line-height:1.2">กรมวิชาการเกษตร</div>
            <div class="text-caption text-medium-emphasis">ระบบบริการออนไลน์</div>
          </div>
        </div>

        <!-- Heading -->
        <div class="mb-6">
          <h2 class="text-h5 font-weight-bold mb-1">สมัครสมาชิก</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            สร้างบัญชีเพื่อเข้าใช้งานระบบบริการออนไลน์ กรมวิชาการเกษตร
          </p>
        </div>

        <!-- Step indicator -->
        <div class="step-indicator mb-6">
          <div
            v-for="(step, idx) in steps"
            :key="step"
            class="step-dot"
            :class="{
              'step-dot--active':    currentStep === idx,
              'step-dot--done':      currentStep > idx,
              'step-dot--pending':   currentStep < idx,
            }"
          >
            <v-icon v-if="currentStep > idx" icon="fas fa-check" size="11" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="step-label text-caption text-medium-emphasis">
            ขั้นตอนที่ {{ currentStep + 1 }}/{{ steps.length }}: {{ steps[currentStep] }}
          </div>
        </div>

        <!-- Form -->
        <v-form ref="formRef" @submit.prevent="nextStep">

          <!-- Step 1: ข้อมูลส่วนตัว -->
          <div v-if="currentStep === 0">
            <div class="field-label">คำนำหน้า <span class="req">*</span></div>
            <v-select
              v-model="form.prefix"
              :items="['นาย', 'นาง', 'นางสาว']"
              placeholder="เลือกคำนำหน้า"
              hide-details="auto"
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-row dense class="mb-4">
              <v-col cols="6">
                <div class="field-label">ชื่อ <span class="req">*</span></div>
                <v-text-field
                  v-model="form.firstName"
                  placeholder="ชื่อจริง"
                  hide-details="auto"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="6">
                <div class="field-label">นามสกุล <span class="req">*</span></div>
                <v-text-field
                  v-model="form.lastName"
                  placeholder="นามสกุล"
                  hide-details="auto"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>

            <div class="field-label">เลขบัตรประชาชน <span class="req">*</span></div>
            <v-text-field
              v-model="form.idCard"
              placeholder="X-XXXX-XXXXX-XX-X"
              prepend-inner-icon="fas fa-id-card"
              hide-details="auto"
              :rules="[rules.required, rules.idCard]"
              class="mb-4"
              maxlength="13"
            />

            <div class="field-label">เบอร์โทรศัพท์ <span class="req">*</span></div>
            <v-text-field
              v-model="form.phone"
              placeholder="0XX-XXX-XXXX"
              prepend-inner-icon="fas fa-phone"
              hide-details="auto"
              :rules="[rules.required, rules.phone]"
              class="mb-4"
              maxlength="10"
            />
          </div>

          <!-- Step 2: ข้อมูลบัญชี -->
          <div v-if="currentStep === 1">
            <div class="field-label">อีเมล <span class="req">*</span></div>
            <v-text-field
              v-model="form.email"
              placeholder="example@email.com"
              prepend-inner-icon="fas fa-envelope"
              hide-details="auto"
              :rules="[rules.required, rules.email]"
              class="mb-4"
            />

            <div class="field-label">รหัสผ่าน <span class="req">*</span></div>
            <v-text-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              prepend-inner-icon="fas fa-lock"
              :append-inner-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
              hide-details="auto"
              :rules="[rules.required, rules.minLength]"
              class="mb-4"
              @click:append-inner="showPassword = !showPassword"
            />

            <div class="field-label">ยืนยันรหัสผ่าน <span class="req">*</span></div>
            <v-text-field
              v-model="form.confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              prepend-inner-icon="fas fa-lock-open"
              :append-inner-icon="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"
              hide-details="auto"
              :rules="[rules.required, rules.matchPassword]"
              class="mb-4"
              @click:append-inner="showConfirm = !showConfirm"
            />

            <!-- Password strength -->
            <div class="mb-2">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption text-medium-emphasis">ความปลอดภัยรหัสผ่าน</span>
                <span class="text-caption font-weight-bold" :style="{ color: `rgb(var(--v-theme-${passwordStrength.color}))` }">
                  {{ passwordStrength.label }}
                </span>
              </div>
              <v-progress-linear
                :model-value="passwordStrength.value"
                :color="passwordStrength.color"
                rounded
                height="4"
              />
            </div>
          </div>

          <!-- Step 3: ตรวจสอบ & ยืนยัน -->
          <div v-if="currentStep === 2">
            <v-card variant="tonal" color="surface-variant" class="mb-4">
              <v-card-text class="pa-4">
                <div class="text-body-2 font-weight-bold mb-3">ข้อมูลที่จะสมัคร</div>
                <div class="confirm-grid">
                  <div class="confirm-item">
                    <span class="label">ชื่อ-นามสกุล</span>
                    <span class="value">{{ form.prefix }}{{ form.firstName }} {{ form.lastName }}</span>
                  </div>
                  <div class="confirm-item">
                    <span class="label">เลขบัตรประชาชน</span>
                    <span class="value">{{ maskIdCard(form.idCard) }}</span>
                  </div>
                  <div class="confirm-item">
                    <span class="label">เบอร์โทรศัพท์</span>
                    <span class="value">{{ form.phone }}</span>
                  </div>
                  <div class="confirm-item">
                    <span class="label">อีเมล</span>
                    <span class="value">{{ form.email }}</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <v-checkbox
              v-model="form.acceptTerms"
              :rules="[v => !!v || 'กรุณายอมรับเงื่อนไข']"
              hide-details="auto"
              class="mb-2"
            >
              <template #label>
                <span class="text-body-2">
                  ฉันยอมรับ
                  <a href="#" class="text-primary text-decoration-none">นโยบายความเป็นส่วนตัว</a>
                  และ
                  <a href="#" class="text-primary text-decoration-none">เงื่อนไขการใช้งาน</a>
                </span>
              </template>
            </v-checkbox>

            <v-alert v-if="error" type="error" variant="tonal" density="compact"
              prepend-icon="fas fa-circle-xmark" class="mb-3">
              {{ error }}
            </v-alert>
          </div>

          <!-- Buttons -->
          <div class="d-flex ga-3 mt-6">
            <v-btn
              v-if="currentStep > 0"
              variant="tonal"
              color="grey"
              size="large"
              prepend-icon="fas fa-chevron-left"
              @click="currentStep--"
            >
              ย้อนกลับ
            </v-btn>
            <v-btn
              v-if="currentStep < steps.length - 1"
              color="primary"
              size="large"
              block
              append-icon="fas fa-chevron-right"
              type="submit"
            >
              ถัดไป
            </v-btn>
            <v-btn
              v-else
              color="primary"
              size="large"
              block
              prepend-icon="fas fa-user-plus"
              :loading="loading"
              type="submit"
            >
              สมัครสมาชิก
            </v-btn>
          </div>
        </v-form>

        <!-- Login link -->
        <div class="register-row mt-6">
          <span class="text-body-2 text-medium-emphasis">มีบัญชีแล้ว?</span>
          <v-btn variant="text" size="small" color="primary" class="ml-1 pa-0" @click="router.push('/login')">
            เข้าสู่ระบบ
          </v-btn>
        </div>

        <!-- Footer -->
        <div class="d-flex align-center justify-space-between mt-5">
          <v-btn variant="text" size="small" color="medium-emphasis"
            prepend-icon="fas fa-arrow-left" @click="router.push('/')">
            กลับหน้าหลัก
          </v-btn>
          <span class="text-caption text-medium-emphasis">© 2568 กรมวิชาการเกษตร</span>
        </div>

      </div>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" size="40" color="success" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">สมัครสมาชิกสำเร็จ!</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">
            ระบบส่งอีเมลยืนยันไปที่
          </p>
          <p class="text-body-2 font-weight-bold text-primary mb-4">{{ form.email }}</p>
          <p class="text-caption text-medium-emphasis">กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn color="primary" block rounded="lg" @click="router.push('/login')">
            ไปหน้าเข้าสู่ระบบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'

const router = useRouter()
const themeStore = useThemeStore()

const currentStep   = ref(0)
const loading       = ref(false)
const error         = ref('')
const successDialog = ref(false)
const showPassword  = ref(false)
const showConfirm   = ref(false)
const formRef       = ref()

const steps = ['ข้อมูลส่วนตัว', 'ข้อมูลบัญชี', 'ตรวจสอบ & ยืนยัน']

const form = ref({
  prefix: '',
  firstName: '',
  lastName: '',
  idCard: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const features = [
  { icon: 'fas fa-seedling',    text: 'ระบบรับรองมาตรฐาน GAP พืช' },
  { icon: 'fas fa-leaf',        text: 'ระบบรับรองมาตรฐานเกษตรอินทรีย์' },
  { icon: 'fas fa-file-shield', text: 'ระบบออกใบรับรองสุขอนามัยพืช' },
  { icon: 'fas fa-ship',        text: 'ระบบจดทะเบียนผู้ส่งออก' },
  { icon: 'fas fa-flask-vial',  text: 'ระบบ DOA & CB' },
]

const rules = {
  required:      (v: string)  => !!v        || 'กรุณากรอกข้อมูล',
  email:         (v: string)  => /.+@.+\..+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง',
  phone:         (v: string)  => /^0\d{8,9}$/.test(v) || 'รูปแบบเบอร์โทรไม่ถูกต้อง',
  idCard:        (v: string)  => v.length === 13 || 'เลขบัตรประชาชนต้องมี 13 หลัก',
  minLength:     (v: string)  => v.length >= 8   || 'อย่างน้อย 8 ตัวอักษร',
  matchPassword: (v: string)  => v === form.value.password || 'รหัสผ่านไม่ตรงกัน',
}

const passwordStrength = computed(() => {
  const p = form.value.password
  if (!p) return { value: 0, label: '', color: 'grey' }
  let score = 0
  if (p.length >= 8)         score++
  if (/[A-Z]/.test(p))      score++
  if (/[0-9]/.test(p))      score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const map = [
    { value: 25, label: 'อ่อน',    color: 'error' },
    { value: 50, label: 'พอใช้',   color: 'warning' },
    { value: 75, label: 'ดี',       color: 'info' },
    { value: 100, label: 'แข็งแกร่ง', color: 'success' },
  ]
  return map[Math.max(score - 1, 0)]
})

function maskIdCard(v: string) {
  if (v.length < 5) return v
  return v.slice(0, 1) + '-XXXX-XXXXX-' + v.slice(-2)
}

async function nextStep() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    return
  }

  // Final submit
  loading.value = true
  error.value   = ''
  await new Promise(r => setTimeout(r, 1200))
  loading.value       = false
  successDialog.value = true
}
</script>

<style scoped>
.login-root {
  min-height: 100vh;
  display: flex;
}

/* ─── Left Panel ─── */
.login-left {
  width: 420px;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.65) 100%
  );
  flex-direction: column;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 55%),
    radial-gradient(ellipse at 10% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
  pointer-events: none;
}

.is-dark .login-left {
  background:
    linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.70)),
    linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.55) 100%);
}


.login-left-inner {
  position: relative;
  z-index: 1;
  padding: 52px 44px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.brand-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}
.brand-icon-ring-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1.5px solid rgba(var(--v-theme-primary), 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-icon-ring-sm .v-icon { color: rgb(var(--v-theme-primary)) !important; }
.feature-list { display: flex; flex-direction: column; gap: 14px; }
.feature-item { display: flex; align-items: center; gap: 12px; }
.feature-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.login-left-footer { margin-top: auto; padding-top: 32px; }

/* ─── Right Panel ─── */
.login-right {
  flex: 1;
  background: rgb(var(--v-theme-background));
  padding: 40px 24px;
}
.login-form-wrapper {
  width: 100%;
  max-width: 420px;
}

/* ─── Step Indicator ─── */
.step-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
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
  flex-shrink: 0;
  transition: background 0.2s;
}
.step-dot--done    { background: rgb(var(--v-theme-success)); color: white; }
.step-dot--active  { background: rgb(var(--v-theme-primary)); color: white; }
.step-dot--pending { background: rgba(var(--v-theme-on-surface), 0.1); color: rgba(var(--v-theme-on-surface), 0.4); }
.step-label { margin-left: 4px; }

/* ─── Fields ─── */
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 6px;
}
.req { color: rgb(var(--v-theme-error)); }

/* ─── Confirm ─── */
.confirm-grid { display: flex; flex-direction: column; gap: 8px; }
.confirm-item { display: flex; flex-direction: column; gap: 2px; }
.confirm-item .label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.confirm-item .value { font-size: 13.5px; font-weight: 500; }

/* ─── Register row ─── */
.register-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* ─── Success ─── */
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
