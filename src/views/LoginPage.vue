<template>
  <div class="page-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- ═══ Left Panel ═══ -->
    <div class="left-panel d-none d-md-flex">
      <div class="left-panel-inner">
        <div class="brand-ring mb-8">
          <v-icon icon="fas fa-leaf" size="36" color="white" />
        </div>
        <h1 class="text-h5 font-weight-bold text-white mb-3 lh-tight">
          ระบบการให้บริการทางอิเล็กทรอนิกส์
        </h1>
        <p class="text-body-1 mb-10" style="color: rgba(255, 255, 255, 0.75)">
          กรมวิชาการเกษตร กระทรวงเกษตรและสหกรณ์
        </p>
        <!-- <p class="text-body-2 mb-10" style="color: rgba(255, 255, 255, 0.55)">
          กรมวิชาการเกษตร กระทรวงเกษตรและสหกรณ์
        </p> -->
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
        <!-- <div class="left-panel-footer">
          <v-chip
            size="default"
            color="white"
            variant="outlined"
            style="color: rgba(255, 255, 255, 0.7)"
          >
            กรมวิชาการเกษตร กระทรวงเกษตรและสหกรณ์
          </v-chip>
        </div> -->
      </div>
    </div>

    <!-- ═══ Right Panel ═══ -->
    <div class="right-panel d-flex align-center justify-center">
      <div class="page-form-wrapper">
        <!-- Mobile brand -->
        <div class="d-flex d-md-none align-center ga-3 mb-7">
          <div class="brand-ring-sm">
            <v-icon icon="fas fa-leaf" size="20" color="white" />
          </div>
          <div>
            <div class="text-body-1 font-weight-bold text-primary lh-tight">
              กรมวิชาการเกษตร
            </div>
            <div class="text-caption text-medium-emphasis">
              ระบบการให้บริการทางอิเล็กทรอนิกส์
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
            <!-- <v-btn
              variant="text"
              size="small"
              color="medium-emphasis"
              prepend-icon="fas fa-arrow-left"
              @click="goToPortal"
            >
              กลับหน้าหลัก
            </v-btn> -->
            <span class="text-caption text-medium-emphasis"
              >© 2569 กรมวิชาการเกษตร</span
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
              @click="goToRoleSelect"
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
                ชื่อผู้ใช้งาน <span class="req">*</span>
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
                รหัสผ่าน <span class="req">*</span>
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
                @click="goToRegister"
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
                ชื่อผู้ใช้งาน <span class="req">*</span>
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
                @click="goToRegister"
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
                  @click="goToAdminLogin"
                >
                  สำหรับผู้ดูแลระบบ (Admin)
                </v-btn>
              </div>
            </div>
          </template>

          <!-- Footer -->
          <div class="d-flex align-center justify-space-between mt-6">
            <span class="text-caption text-medium-emphasis"
              >© 2569 กรมวิชาการเกษตร</span
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const router = useRouter();
const themeStore = useThemeStore();

function goToPortal() {
  router.push({ name: "Portal" });
}

function goToRegister() {
  router.push({ name: "Register" });
}

function goToAdminLogin() {
  router.push({ name: "AdminLogin" });
}

// ── Role selection ──
const step = ref(0);
const selectedRole = ref("operator");

function goToRoleSelect() {
  step.value = 0;
}

function selectRole(role) {
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
    text: "ระบบการรับรองมาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืช",
  },
  { icon: "fas fa-leaf", text: "ระบบการรับรองมาตรฐานเกษตรอินทรีย์" },
  {
    icon: "fas fa-industry",
    text: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช กรมวิชาการเกษตร",
  },
  {
    icon: "fas fa-certificate",
    text: "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช",
  },
  { icon: "fas fa-ship", text: "ระบบการจดทะเบียนผู้ส่งออกสินค้าพืช" },
  {
    icon: "fas fa-virus",
    text: "ระบบการออกหนังสือรับรองสุขอนามัยพืชสำหรับพืชควบคุมเฉพาะ",
  },
  {
    icon: "fas fa-file-medical",
    text: "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช",
  },
  { icon: "fas fa-warehouse", text: "ระบบบัญชีรายชื่อโรงคัดบรรจุสินค้าพืช" },
];

const rules = {
  required: (v) => !!v || "กรุณากรอกข้อมูล",
};

async function doLogin() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  loading.value = true;
  error.value = "";
  await new Promise((r) => setTimeout(r, 1000));
  loading.value = false;
  if (username.value && password.value) {
    router.push({ name: "CompanySelection" });
  } else {
    error.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  }
}

// function doThaiDLogin() {
//   thaidLoading.value = true;
//   setTimeout(() => router.push("/select-company"), 800);
// }
async function doThaiDLogin() {
  if (thaidLoading.value) return; // ป้องกันการกดซ้ำขณะกำลังโหลด
  thaidLoading.value = true;
  setTimeout(() => router.push({ name: "CompanySelection" }), 800);
}

async function doStaffLogin() {
  const { valid } = await staffFormRef.value.validate();
  if (!valid) return;
  staffLoading.value = true;
  staffError.value = "";
  await new Promise((r) => setTimeout(r, 1000));
  staffLoading.value = false;
  if (staffUsername.value && staffPassword.value) {
    router.push({ name: "StaffPortal" });
  } else {
    staffError.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  }
}

function doSsoLogin() {
  ssoLoading.value = true;
  setTimeout(
    () => router.push({ name: "StaffPortal" }),
    800,
  );
}
</script>

<style scoped>
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

.register-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* ─── Typography ─── */
.page-title {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
}
.lh-tight {
  line-height: 1.25;
}

/* ─── Admin Entry ─── */
.admin-entry {
  text-align: center;
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
