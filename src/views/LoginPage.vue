<template>
  <div class="login-root">
    <!-- Background -->
    <div class="login-bg" />

    <v-container class="login-container d-flex align-center justify-center" fluid>
      <div class="login-wrapper">

        <!-- Logo / Header -->
        <div class="text-center mb-8">
          <div class="doa-logo-ring mx-auto mb-4">
            <v-icon icon="fas fa-leaf" size="44" color="white" />
          </div>
          <h1 class="text-h5 font-weight-bold text-white mb-1">กรมวิชาการเกษตร</h1>
          <p class="text-body-2 mb-0" style="color:rgba(255,255,255,0.75)">
            Department of Agriculture · ระบบบริการออนไลน์
          </p>
        </div>

        <!-- Card -->
        <v-card rounded="xl" class="login-card pa-2">
          <v-card-text class="pa-7">
            <h2 class="text-h6 font-weight-bold mb-1">เข้าสู่ระบบ</h2>
            <p class="text-body-2 text-medium-emphasis mb-6">กรุณากรอกชื่อผู้ใช้และรหัสผ่านของท่าน</p>

            <v-form ref="formRef" @submit.prevent="doLogin">
              <!-- Username -->
              <div class="field-label">ชื่อผู้ใช้งาน <span class="req">*</span></div>
              <v-text-field
                v-model="username"
                placeholder="เช่น officer@doa.go.th หรือ เลขบัตรประชาชน"
                prepend-inner-icon="fas fa-user"
                :rules="[rules.required]"
                hide-details="auto"
                class="mb-4"
                autofocus
              />

              <!-- Password -->
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

              <!-- Error -->
              <v-alert v-if="error" type="error" variant="tonal" class="mb-4" density="compact"
                prepend-icon="fas fa-circle-xmark">
                {{ error }}
              </v-alert>

              <!-- Login Button -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                rounded="lg"
                :loading="loading"
                prepend-icon="fas fa-right-to-bracket"
              >
                เข้าสู่ระบบ
              </v-btn>
            </v-form>

            <v-divider class="my-5" />

            <!-- SSO -->
            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              block
              rounded="lg"
              prepend-icon="fas fa-id-badge"
              class="mb-3"
              @click="doSsoLogin"
            >
              เข้าสู่ระบบด้วย SSO (กรมวิชาการเกษตร)
            </v-btn>
            <v-btn
              variant="outlined"
              color="grey-darken-1"
              block
              rounded="lg"
              prepend-icon="fas fa-globe"
              @click="doLogin"
            >
              เข้าสู่ระบบด้วย Biz Portal (ภาครัฐ)
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Footer -->
        <div class="text-center mt-6">
          <v-btn variant="text" size="small" color="white" style="opacity:0.7"
            prepend-icon="fas fa-arrow-left" @click="router.push('/')">
            กลับหน้าหลัก
          </v-btn>
        </div>

      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username     = ref('')
const password     = ref('')
const showPassword = ref(false)
const loading      = ref(false)
const error        = ref('')
const formRef      = ref()

const rules = {
  required: (v: string) => !!v || 'กรุณากรอกข้อมูล',
}

async function doLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  error.value   = ''

  // Mock auth — in production: call API
  await new Promise(r => setTimeout(r, 1000))

  if (username.value && password.value) {
    router.push('/portal')
  } else {
    error.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  }

  loading.value = false
}

function doSsoLogin() {
  loading.value = true
  setTimeout(() => {
    router.push('/portal')
  }, 800)
}
</script>

<style scoped>
.login-root {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
}

.login-bg {
  position: fixed;
  inset: 0;
  background:
    linear-gradient(135deg,
      rgb(var(--v-theme-primary)) 0%,
      color-mix(in srgb, rgb(var(--v-theme-primary)) 60%, rgb(var(--v-theme-secondary))) 100%
    );
  z-index: 0;
}

.login-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.login-wrapper {
  width: 100%;
  max-width: 460px;
}

.doa-logo-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.login-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.15) !important;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 6px;
}

.req { color: rgb(var(--v-theme-error)); }
</style>
