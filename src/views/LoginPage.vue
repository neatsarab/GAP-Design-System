<template>
  <div class="login-root" :class="{ 'is-dark': themeStore.isDark }">

    <!-- Left panel — branding -->
    <div class="login-left d-none d-md-flex">
      <div class="login-left-inner">

        <!-- Logo -->
        <div class="brand-logo mb-8">
          <div class="brand-icon-ring">
            <v-icon icon="fas fa-leaf" size="36" color="white" />
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-h4 font-weight-bold text-white mb-3" style="line-height:1.2">
          กรมวิชาการเกษตร
        </h1>
        <p class="text-body-1 mb-1" style="color:rgba(255,255,255,0.75)">Department of Agriculture</p>
        <p class="text-body-2 mb-10" style="color:rgba(255,255,255,0.55)">กระทรวงเกษตรและสหกรณ์</p>

        <!-- Feature list -->
        <div class="feature-list">
          <div v-for="f in features" :key="f.text" class="feature-item">
            <div class="feature-icon">
              <v-icon :icon="f.icon" size="15" color="white" />
            </div>
            <span class="text-body-2" style="color:rgba(255,255,255,0.85)">{{ f.text }}</span>
          </div>
        </div>

        <!-- Bottom badge -->
        <div class="login-left-footer">
          <v-chip size="small" color="white" variant="outlined" style="color:rgba(255,255,255,0.7)">
            <v-icon start icon="fas fa-shield-halved" size="12" />
            ระบบมาตรฐาน SSL/TLS ปลอดภัย
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Right panel — form -->
    <div class="login-right d-flex align-center justify-center">
      <div class="login-form-wrapper">

        <!-- Mobile brand (hidden on md+) -->
        <div class="d-flex d-md-none align-center ga-3 mb-8">
          <div class="brand-icon-ring-sm">
            <v-icon icon="fas fa-leaf" size="20" color="white" />
          </div>
          <div>
            <div class="text-body-1 font-weight-bold text-primary" style="line-height:1.2">กรมวิชาการเกษตร</div>
            <div class="text-caption text-medium-emphasis">ระบบบริการออนไลน์</div>
          </div>
        </div>

        <!-- Theme toggle -->
        <div class="d-flex justify-end mb-4">
          <v-btn
            variant="tonal"
            size="small"
            :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
            @click="themeStore.toggle()"
          >
            {{ themeStore.isDark ? 'โหมดสว่าง' : 'โหมดมืด' }}
          </v-btn>
        </div>

        <!-- Heading -->
        <div class="mb-7">
          <h2 class="text-h5 font-weight-bold mb-1">เข้าสู่ระบบ</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบบริการออนไลน์
          </p>
        </div>

        <!-- SSO Primary (from all.md — SSO is main auth) -->
        <!-- <v-btn
          color="primary"
          size="large"
          block
          rounded="lg"
          class="mb-3"
          prepend-icon="fas fa-id-badge"
          :loading="ssoLoading"
          @click="doSsoLogin"
        >
          เข้าสู่ระบบด้วย SSO กรมวิชาการเกษตร
        </v-btn> -->
        <!-- <v-btn
          variant="outlined"
          color="primary"
          size="large"
          block
          rounded="lg"
          class="mb-6"
          prepend-icon="fas fa-globe"
          @click="doSsoLogin"
        >
          เข้าสู่ระบบด้วย Biz Portal (ภาครัฐ)
        </v-btn> -->

        <!-- Divider -->
        <!-- <div class="d-flex align-center ga-3 mb-6">
          <v-divider />
          <span class="text-caption text-medium-emphasis text-no-wrap">หรือเข้าสู่ระบบด้วยรหัสผ่าน</span>
          <v-divider />
        </div> -->

        <!-- Username / Password form -->
        <v-form ref="formRef" @submit.prevent="doLogin">
          <div class="field-label">ชื่อผู้ใช้งาน <span class="req">*</span></div>
          <v-text-field
            v-model="username"
            placeholder="อีเมล หรือ เลขบัตรประชาชน"
            prepend-inner-icon="fas fa-user"
            :rules="[rules.required]"
            hide-details="auto"
            class="mb-4"
            autofocus
          />

          <div class="field-label">รหัสผ่าน <span class="req">*</span></div>
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="รหัสผ่าน"
            prepend-inner-icon="fas fa-lock"
            :append-inner-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :rules="[rules.required]"
            hide-details="auto"
            class="mb-2"
            @click:append-inner="showPassword = !showPassword"
          />

          <div class="d-flex justify-end mb-5">
            <v-btn variant="text" size="small" color="primary" class="pa-0">ลืมรหัสผ่าน?</v-btn>
          </div>

          <v-alert v-if="error" type="error" variant="tonal" class="mb-4" density="compact"
            prepend-icon="fas fa-circle-xmark">
            {{ error }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            variant="tonal"
            size="large"
            block
            rounded="lg"
            :loading="loading"
            prepend-icon="fas fa-right-to-bracket"
          @click="doSsoLogin"
          >
            เข้าสู่ระบบ
          </v-btn>
        </v-form>

        <!-- Register -->
        <div class="register-row mt-6">
          <span class="text-body-2 text-medium-emphasis">ยังไม่มีบัญชี?</span>
          <v-btn variant="text" size="small" color="primary" class="ml-1 pa-0" @click="router.push('/register')">
            สมัครสมาชิก
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

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'

const router     = useRouter()
const themeStore = useThemeStore()

const username     = ref('')
const password     = ref('')
const showPassword = ref(false)
const loading      = ref(false)
const ssoLoading   = ref(false)
const error        = ref('')
const formRef      = ref()

const features = [
  { icon: 'fas fa-seedling',       text: 'ระบบรับรองมาตรฐาน GAP พืช' },
  { icon: 'fas fa-leaf',           text: 'ระบบรับรองมาตรฐานเกษตรอินทรีย์' },
  { icon: 'fas fa-file-shield',    text: 'ระบบออกใบรับรองสุขอนามัยพืช' },
  { icon: 'fas fa-ship',           text: 'ระบบจดทะเบียนผู้ส่งออก' },
  { icon: 'fas fa-flask-vial',     text: 'ระบบ DOA & CB' },
]

const rules = {
  required: (v: string) => !!v || 'กรุณากรอกข้อมูล',
}

async function doLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  error.value   = ''

  await new Promise(r => setTimeout(r, 1000))

  if (username.value && password.value) {
    router.push('/portal')
  } else {
    error.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  }

  loading.value = false
}

function doSsoLogin() {
  ssoLoading.value = true
  setTimeout(() => router.push('/portal'), 800)
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
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
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

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.login-left-footer {
  margin-top: auto;
  padding-top: 32px;
}

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

/* ─── Fields ─── */
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 6px;
}

.req { color: rgb(var(--v-theme-error)); }

.register-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
