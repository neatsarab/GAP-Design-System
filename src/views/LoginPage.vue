<template>
  <div class="login-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- ═══ Left Panel ═══ -->
    <div class="login-left d-none d-md-flex">
      <div class="login-left-inner">
        <div class="brand-icon-ring mb-8">
          <v-icon icon="fas fa-leaf" size="36" color="white" />
        </div>
        <h1 class="text-h4 font-weight-bold text-white mb-3 lh-tight">
          กรมวิชาการเกษตร
        </h1>
        <p class="text-body-1 mb-1" style="color: rgba(255, 255, 255, 0.75)">
          Department of Agriculture
        </p>
        <p class="text-body-2 mb-10" style="color: rgba(255, 255, 255, 0.55)">
          กระทรวงเกษตรและสหกรณ์
        </p>
        <div class="feature-list">
          <div v-for="f in features" :key="f.text" class="feature-item">
            <div class="feature-icon">
              <v-icon :icon="f.icon" size="15" color="white" />
            </div>
            <span
              class="text-body-2"
              style="color: rgba(255, 255, 255, 0.85)"
              >{{ f.text }}</span
            >
          </div>
        </div>
        <div class="login-left-footer">
          <v-chip
            size="small"
            color="white"
            variant="outlined"
            style="color: rgba(255, 255, 255, 0.7)"
          >
            <v-icon start icon="fas fa-shield-halved" size="12" />
            ระบบมาตรฐาน SSL/TLS ปลอดภัย
          </v-chip>
        </div>
      </div>
    </div>

    <!-- ═══ Right Panel ═══ -->
    <div class="login-right d-flex align-center justify-center">
      <div class="login-form-wrapper">
        <!-- Mobile brand -->
        <div class="d-flex d-md-none align-center ga-3 mb-7">
          <div class="brand-icon-ring-sm">
            <v-icon icon="fas fa-leaf" size="20" color="white" />
          </div>
          <div>
            <div class="text-body-1 font-weight-bold text-primary lh-tight">
              กรมวิชาการเกษตร
            </div>
            <div class="text-caption text-medium-emphasis">
              ระบบบริการออนไลน์
            </div>
          </div>
        </div>

        <!-- Theme toggle -->
        <div class="d-flex justify-end mb-5">
          <v-btn
            variant="tonal"
            size="small"
            :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
            @click="themeStore.toggle()"
          >
            {{ themeStore.isDark ? "โหมดสว่าง" : "โหมดมืด" }}
          </v-btn>
        </div>

        <!-- ════ Step 0: เลือกบทบาท ════ -->
        <template v-if="step === 0">
          <div class="mb-7">
            <h2 class="page-title mb-1">เข้าสู่ระบบ</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              กรุณาเลือกประเภทผู้ใช้งานเพื่อดำเนินการต่อ
            </p>
          </div>

          <div class="role-grid mb-6">
            <!-- ผู้ประกอบการ -->
            <div
              class="role-card role-card--operator"
              @click="selectRole('operator')"
            >
              <div class="role-icon-ring role-icon-ring--operator">
                <v-icon icon="fas fa-briefcase" size="28" color="primary" />
              </div>
              <div class="text-body-1 font-weight-bold mt-3 mb-1">
                ผู้ประกอบการ
              </div>
              <div
                class="text-caption text-medium-emphasis text-center"
                style="line-height: 1.5"
              >
                เกษตรกร บริษัท หรือผู้ยื่นคำขอทั่วไป
              </div>
              <div class="role-arrow">
                <v-icon icon="fas fa-arrow-right" size="14" color="primary" />
              </div>
            </div>

            <!-- เจ้าหน้าที่ -->
            <div
              class="role-card role-card--staff"
              @click="selectRole('staff')"
            >
              <div class="role-icon-ring role-icon-ring--staff">
                <v-icon icon="fas fa-user-shield" size="28" color="info" />
              </div>
              <div class="text-body-1 font-weight-bold mt-3 mb-1">
                เจ้าหน้าที่
              </div>
              <div
                class="text-caption text-medium-emphasis text-center"
                style="line-height: 1.5"
              >
                เจ้าหน้าที่กรมวิชาการเกษตร และผู้ดูแลระบบ
              </div>
              <div class="role-arrow">
                <v-icon icon="fas fa-arrow-right" size="14" color="info" />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="d-flex align-center justify-space-between mt-4">
            <v-btn
              variant="text"
              size="small"
              color="medium-emphasis"
              prepend-icon="fas fa-arrow-left"
              @click="router.push('/')"
            >
              กลับหน้าหลัก
            </v-btn>
            <span class="text-caption text-medium-emphasis"
              >© 2568 กรมวิชาการเกษตร</span
            >
          </div>
        </template>

        <!-- ════ Step 1: Login Form ════ -->
        <template v-else>
          <!-- Back + Heading -->
          <div class="d-flex align-center ga-3 mb-6">
            <v-btn
              icon="fas fa-arrow-left"
              variant="tonal"
              size="small"
              rounded="lg"
              @click="step = 0"
            />
            <div>
              <h2 class="page-title mb-0">
                {{
                  selectedRole === "operator" ? "ผู้ประกอบการ" : "เจ้าหน้าที่"
                }}
              </h2>
              <p class="text-caption text-medium-emphasis mb-0">
                {{
                  selectedRole === "operator"
                    ? "เข้าสู่ระบบบริการออนไลน์"
                    : "เข้าสู่ระบบสำหรับเจ้าหน้าที่"
                }}
              </p>
            </div>
            <v-spacer />
            <v-chip
              size="small"
              :color="selectedRole === 'operator' ? 'primary' : 'info'"
              variant="tonal"
            >
              <v-icon
                start
                :icon="
                  selectedRole === 'operator'
                    ? 'fas fa-briefcase'
                    : 'fas fa-user-shield'
                "
                size="11"
              />
              {{ selectedRole === "operator" ? "ผู้ประกอบการ" : "เจ้าหน้าที่" }}
            </v-chip>
          </div>

          <!-- ── ผู้ประกอบการ ── -->
          <template v-if="selectedRole === 'operator'">
            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              block
              rounded="lg"
              class="mb-5"
              prepend-icon="fas fa-mobile-screen"
              :loading="thaidLoading"
              @click="doThaiDLogin"
            >
              เข้าสู่ระบบด้วย ThaiD
            </v-btn>

            <div class="divider-or mb-5">
              <span class="divider-or-text">หรือเข้าสู่ระบบด้วยรหัสผ่าน</span>
            </div>

            <v-form ref="formRef" @submit.prevent="doLogin">
              <div class="field-label">
                ชื่อผู้ใช้งาน<span class="req">*</span>
                <div class="field-label-en">Username</div>
              </div>
              <v-text-field
                v-model="username"
                placeholder="อีเมล หรือ เลขบัตรประชาชน"
                prepend-inner-icon="fas fa-user"
                variant="outlined"
                density="compact"
                rounded="lg"
                :rules="[rules.required]"
                hide-details="auto"
                class="mb-4"
              />
              <div class="field-label">
                รหัสผ่าน<span class="req">*</span>
                <div class="field-label-en">Password</div>
              </div>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="รหัสผ่าน"
                prepend-inner-icon="fas fa-lock"
                variant="outlined"
                density="compact"
                rounded="lg"
                :append-inner-icon="
                  showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                "
                :rules="[rules.required]"
                hide-details="auto"
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
              />
              <div class="d-flex justify-end mb-5">
                <v-btn variant="text" size="small" color="primary" class="pa-0"
                  >ลืมรหัสผ่าน?</v-btn
                >
              </div>
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
                density="compact"
                prepend-icon="fas fa-circle-xmark"
              >
                {{ error }}
              </v-alert>
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

            <div class="register-row mt-6">
              <span class="text-body-2 text-medium-emphasis"
                >ยังไม่มีบัญชี?</span
              >
              <v-btn
                variant="text"
                size="small"
                color="primary"
                class="ml-1 pa-0"
                @click="router.push('/register')"
              >
                ลงทะเบียนผู้ใช้งานใหม่
              </v-btn>
            </div>
          </template>

          <!-- ── เจ้าหน้าที่ ── -->
          <template v-else>
            <v-btn
              variant="outlined"
              color="info"
              size="large"
              block
              rounded="lg"
              class="mb-5"
              prepend-icon="fas fa-mobile-screen"
              :loading="ssoLoading"
              @click="doSsoLogin"
            >
              เข้าสู่ระบบด้วย ThaiD
            </v-btn>

            <div class="divider-or mb-5">
              <span class="divider-or-text">หรือเข้าสู่ระบบด้วยรหัสผ่าน</span>
            </div>

            <v-form ref="staffFormRef" @submit.prevent="doStaffLogin">
              <div class="field-label">
                ชื่อผู้ใช้งาน<span class="req">*</span>
                <div class="field-label-en">Username</div>
              </div>
              <v-text-field
                v-model="staffUsername"
                placeholder="ชื่อผู้ใช้งานระบบราชการ"
                prepend-inner-icon="fas fa-user-shield"
                variant="outlined"
                density="compact"
                rounded="lg"
                :rules="[rules.required]"
                hide-details="auto"
                class="mb-4"
              />
              <div class="field-label">
                รหัสผ่าน <span class="req">*</span>
                <div class="field-label-en">Password</div>
              </div>
              <v-text-field
                v-model="staffPassword"
                :type="showStaffPassword ? 'text' : 'password'"
                placeholder="รหัสผ่าน"
                prepend-inner-icon="fas fa-lock"
                variant="outlined"
                density="compact"
                rounded="lg"
                :append-inner-icon="
                  showStaffPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                "
                :rules="[rules.required]"
                hide-details="auto"
                class="mb-2"
                @click:append-inner="showStaffPassword = !showStaffPassword"
              />
              <div class="d-flex justify-end mb-5">
                <v-btn variant="text" size="small" color="info" class="pa-0"
                  >ลืมรหัสผ่าน?</v-btn
                >
              </div>
              <v-alert
                v-if="staffError"
                type="error"
                variant="tonal"
                class="mb-4"
                density="compact"
                prepend-icon="fas fa-circle-xmark"
              >
                {{ staffError }}
              </v-alert>
              <v-btn
                type="submit"
                color="info"
                size="large"
                block
                rounded="lg"
                :loading="staffLoading"
                prepend-icon="fas fa-right-to-bracket"
              >
                เข้าสู่ระบบ
              </v-btn>
            </v-form>

            <div class="register-row mt-6">
              <span class="text-body-2 text-medium-emphasis"
                >ยังไม่มีบัญชี?</span
              >
              <v-btn
                variant="text"
                size="small"
                color="info"
                class="ml-1 pa-0"
                @click="router.push('/register')"
              >
                ลงทะเบียนผู้ใช้งานใหม่
              </v-btn>
            </div>

            <div class="admin-entry mt-3">
              <v-divider class="mb-3" />
              <div class="d-flex align-center justify-center ga-2">
                <v-btn
                  variant="text"
                  size="small"
                  color="medium-emphasis"
                  class="pa-0 admin-link"
                  prepend-icon="fas fa-user-gear"
                  @click="router.push('/admin/login')"
                >
                  สำหรับผู้ดูแลระบบ (Admin)
                </v-btn>
              </div>
            </div>
          </template>

          <!-- Footer -->
          <div class="d-flex align-center justify-space-between mt-6">
            <v-btn
              variant="text"
              size="small"
              color="medium-emphasis"
              prepend-icon="fas fa-arrow-left"
              @click="step = 0"
            >
              กลับเลือกประเภท
            </v-btn>
            <span class="text-caption text-medium-emphasis"
              >© 2568 กรมวิชาการเกษตร</span
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const router = useRouter();
const themeStore = useThemeStore();

// ── Role selection ──
const step = ref<0 | 1>(0);
const selectedRole = ref<"operator" | "staff">("operator");

function selectRole(role: "operator" | "staff") {
  selectedRole.value = role;
  step.value = 1;
  error.value = "";
  staffError.value = "";
}

// ── Operator form ──
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const thaidLoading = ref(false);
const error = ref("");
const formRef = ref();

// ── Staff form ──
const staffUsername = ref("");
const staffPassword = ref("");
const showStaffPassword = ref(false);
const staffLoading = ref(false);
const ssoLoading = ref(false);
const staffError = ref("");
const staffFormRef = ref();

const features = [
  {
    icon: "fas fa-seedling",
    text: "ระบบการรับรองมาตรฐาน GAP",
  },
  {
    icon: "fas fa-leaf",
    text: "ระบบการรับรองมาตรฐาน ORG",
  },
  {
    icon: "fas fa-industry",
    text: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช",
  },
  {
    icon: "fas fa-certificate",
    text: "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช",
  },
  { icon: "fas fa-ship", text: "ระบบจดทะเบียนผู้ส่งออก" },
  {
    icon: "fas fa-virus",
    text: "ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ",
  },
  {
    icon: "fas fa-file-medical",
    text: "ระบบ Health Certificate สินค้าแปรรูปด้านพืช",
  },
  {
    icon: "fas fa-warehouse",
    text: "ระบบการควบคุมพิเศษระบบบัญชีรายชื่อโรงคัดบรรจุ",
  },
];

const rules = {
  required: (v: string) => !!v || "กรุณากรอกข้อมูล",
};

async function doLogin() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  loading.value = true;
  error.value = "";
  await new Promise((r) => setTimeout(r, 1000));
  loading.value = false;
  if (username.value && password.value) {
    router.push("/select-company");
  } else {
    error.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  }
}

function doThaiDLogin() {
  thaidLoading.value = true;
  setTimeout(() => router.push("/select-company"), 800);
}

async function doStaffLogin() {
  const { valid } = await staffFormRef.value.validate();
  if (!valid) return;
  staffLoading.value = true;
  staffError.value = "";
  await new Promise((r) => setTimeout(r, 1000));
  staffLoading.value = false;
  if (staffUsername.value && staffPassword.value) {
    router.push({ path: "/portal", query: { mode: "staff" } });
  } else {
    staffError.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  }
}

function doSsoLogin() {
  ssoLoading.value = true;
  setTimeout(
    () => router.push({ path: "/portal", query: { mode: "staff" } }),
    800,
  );
}
</script>

<style scoped>
.login-root {
  min-height: 100vh;
  display: flex;
}

/* ─── Left Panel ─── */
.login-left {
  width: 520px;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.65) 100%
  );
  flex-direction: column;
  overflow: hidden;
}
.login-left::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at 80% 20%,
      rgba(255, 255, 255, 0.07) 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 10% 80%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
}
.is-dark .login-left {
  background:
    linear-gradient(rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.7)),
    linear-gradient(
      135deg,
      rgb(var(--v-theme-primary)) 0%,
      rgba(var(--v-theme-primary), 0.55) 100%
    );
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
.brand-icon-ring-sm .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}
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
  overflow-y: auto;
}
.login-form-wrapper {
  width: 100%;
  max-width: 440px;
}

/* ─── Role Cards ─── */
.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.role-card {
  position: relative;
  border: 1.5px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 16px;
  padding: 24px 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    transform 0.12s;
  user-select: none;
}
.role-card:hover {
  transform: translateY(-2px);
}
.role-card--operator:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  background: rgba(var(--v-theme-primary), 0.03);
}
.role-card--staff:hover {
  border-color: rgba(var(--v-theme-info), 0.5);
  background: rgba(var(--v-theme-info), 0.03);
}

.role-icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.role-icon-ring--operator {
  background: rgba(var(--v-theme-primary), 0.1);
}
.role-icon-ring--staff {
  background: rgba(var(--v-theme-info), 0.1);
}

.role-arrow {
  position: absolute;
  bottom: 12px;
  right: 14px;
  opacity: 0;
  transition: opacity 0.15s;
}
.role-card:hover .role-arrow {
  opacity: 1;
}

/* ─── Divider OR ─── */
.divider-or {
  position: relative;
  text-align: center;
}
.divider-or::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(var(--v-border-color), var(--v-border-opacity));
}
.divider-or-text {
  position: relative;
  background: rgb(var(--v-theme-background));
  padding: 0 12px;
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.4);
}

/* ─── Fields ─── */
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 6px;
}
.field-label-en {
  font-size: 11px;
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.4);
  margin-left: 4px;
}
.req {
  color: rgb(var(--v-theme-error));
}

.register-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.admin-link {
  font-size: 12px !important;
  color: rgba(var(--v-theme-on-surface), 0.4) !important;
  text-decoration: none !important;
}
.admin-link:hover {
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
}
</style>
