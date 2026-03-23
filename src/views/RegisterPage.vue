<template>
  <div class="reg-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- ═══ Left Panel ═══ -->
    <div class="reg-left d-none d-md-flex">
      <div class="reg-left-inner">
        <div class="brand-ring mb-8">
          <v-icon icon="fas fa-leaf" size="36" color="white" />
        </div>
        <h1 class="text-h4 font-weight-bold text-white mb-2 lh-tight">
          กรมวิชาการเกษตร
        </h1>
        <p class="text-body-1 mb-1" style="color: rgba(255, 255, 255, 0.75)">
          Department of Agriculture
        </p>
        <p class="text-body-2 mb-10" style="color: rgba(255, 255, 255, 0.5)">
          กระทรวงเกษตรและสหกรณ์
        </p>
        <div class="feature-list">
          <div v-for="f in features" :key="f.text" class="feature-item">
            <div class="feature-icon-box">
              <v-icon :icon="f.icon" size="15" color="white" />
            </div>
            <span
              class="text-body-2"
              style="color: rgba(255, 255, 255, 0.85)"
              >{{ f.text }}</span
            >
          </div>
        </div>
        <div class="reg-left-footer">
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
    <div class="reg-right">
      <div class="reg-form-wrapper">
        <!-- Top bar -->
        <div class="d-flex align-center justify-space-between mb-6">
          <div class="d-flex d-md-none align-center ga-2">
            <div class="brand-ring-sm">
              <v-icon icon="fas fa-leaf" size="18" color="white" />
            </div>
            <div>
              <div class="text-body-2 font-weight-bold text-primary lh-tight">
                กรมวิชาการเกษตร
              </div>
              <div class="text-caption text-medium-emphasis">
                ระบบบริการออนไลน์
              </div>
            </div>
          </div>
          <div class="d-none d-md-block" />
          <v-btn
            variant="tonal"
            size="small"
            :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
            @click="themeStore.toggle()"
          >
            {{ themeStore.isDark ? "โหมดสว่าง" : "โหมดมืด" }}
          </v-btn>
        </div>

        <!-- Heading -->
        <div class="mb-6">
          <h2 class="page-title mb-1">ลงทะเบียนผู้ใช้งานใหม่</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            สร้างบัญชีเพื่อเข้าใช้งานระบบบริการออนไลน์ กรมวิชาการเกษตร
          </p>
        </div>

        <!-- ─── Step Indicator ─── -->
        <div class="step-indicator mb-8">
          <div class="step-track">
            <template v-for="(step, idx) in steps" :key="step.key">
              <div
                class="step-node"
                :class="{
                  'step-node--done': currentStep > idx,
                  'step-node--active': currentStep === idx,
                  'step-node--pending': currentStep < idx,
                }"
              >
                <v-icon
                  v-if="currentStep > idx"
                  icon="fas fa-check"
                  size="11"
                />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div
                v-if="idx < steps.length - 1"
                class="step-connector"
                :class="currentStep > idx ? 'step-connector--done' : ''"
              />
            </template>
          </div>
          <div class="step-labels">
            <span
              v-for="(step, idx) in steps"
              :key="step.key + '_l'"
              class="step-label"
              :class="
                currentStep === idx
                  ? 'text-primary font-weight-bold'
                  : 'text-medium-emphasis'
              "
            >
              {{ step.label }}
            </span>
          </div>
        </div>

        <!-- ═══ Step 0: ยืนยันตัวตน ═══ -->
        <div v-if="currentStep === 0">
          <div class="thaid-hero mb-6">
            <div class="thaid-icon-wrap mb-4">
              <v-icon icon="fas fa-id-card" size="40" color="primary" />
            </div>
            <div class="text-body-1 font-weight-bold mb-1">
              ยืนยันตัวตนผ่าน ThaiD
            </div>
            <div
              class="text-body-2 text-medium-emphasis mb-6"
              style="max-width: 320px; margin: 0 auto"
            >
              ใช้แอปพลิเคชัน ThaiD เพื่อยืนยันตัวตนอย่างปลอดภัย
              ระบบจะดึงข้อมูลของท่านโดยอัตโนมัติ
            </div>
            <v-btn
              color="primary"
              size="large"
              rounded="lg"
              prepend-icon="fas fa-mobile-screen"
              :loading="thaidLoading"
              style="min-width: 260px"
              @click="doThaiDVerify"
            >
              ยืนยันตัวตนด้วย ThaiD
            </v-btn>
          </div>

          <div class="divider-or mb-4">
            <span class="divider-or-text">หรือ</span>
          </div>

          <div class="text-center">
            <p class="text-caption text-medium-emphasis mb-3">
              ไม่มี ThaiD? กรอกข้อมูลด้วยตนเอง
            </p>
            <v-btn variant="tonal" color="grey" rounded="lg" @click="skipThaiD">
              กรอกข้อมูลเอง
            </v-btn>
          </div>
        </div>

        <!-- ═══ Step 1: กรอกข้อมูล ═══ -->
        <div v-else-if="currentStep === 1">
          <v-alert
            v-if="thaidVerified"
            color="success"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-circle-check"
            class="mb-5"
          >
            ดึงข้อมูลจาก ThaiD API สำเร็จ — ช่องสีเทาถูกเติมอัตโนมัติ
          </v-alert>

          <v-form ref="formRef">
            <div class="form-section-title mb-3">
              <v-icon icon="fas fa-user" size="13" class="mr-1" />
              ข้อมูลส่วนตัว
            </div>
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  คำนำหน้า <span class="req">*</span>
                  <div class="field-label-en">Title</div>
                </div>
                <v-autocomplete
                  v-model="form.prefix"
                  :items="['นาย', 'นาง', 'นางสาว']"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  :readonly="thaidVerified"
                  :class="{ 'autofill-field': thaidVerified }"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  เลขบัตรประชาชน <span class="req">*</span>
                  <div class="field-label-en">National ID No.</div>
                </div>
                <v-text-field
                  v-model="form.idCard"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  :readonly="thaidVerified"
                  :class="{ 'autofill-field': thaidVerified }"
                  placeholder="X-XXXX-XXXXX-XX-X"
                />
              </v-col>
              <v-col cols="6">
                <div class="field-label mt-3">
                  ชื่อ <span class="req">*</span>
                  <div class="field-label-en">First Name</div>
                </div>
                <v-text-field
                  v-model="form.firstName"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  :readonly="thaidVerified"
                  :class="{ 'autofill-field': thaidVerified }"
                />
              </v-col>
              <v-col cols="6">
                <div class="field-label mt-3">
                  นามสกุล <span class="req">*</span>
                  <div class="field-label-en">Last Name</div>
                </div>
                <v-text-field
                  v-model="form.lastName"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  :readonly="thaidVerified"
                  :class="{ 'autofill-field': thaidVerified }"
                />
              </v-col>
            </v-row>

            <v-divider class="my-5" />
            <div class="form-section-title mb-3">
              <v-icon icon="fas fa-address-book" size="13" class="mr-1" />
              ข้อมูลติดต่อ
            </div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  อีเมล <span class="req">*</span>
                  <div class="field-label-en">Email</div>
                </div>
                <v-text-field
                  v-model="form.email"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="fas fa-envelope"
                  placeholder="example@email.com"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  เบอร์โทรศัพท์ <span class="req">*</span>
                  <div class="field-label-en">Phone Number</div>
                </div>
                <v-text-field
                  v-model="form.phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  prepend-inner-icon="fas fa-phone"
                  placeholder="0XX-XXX-XXXX"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-3">
                  ที่อยู่ <span class="req">*</span>
                  <div class="field-label-en">Address</div>
                </div>
                <v-text-field
                  v-model="form.address"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-3">
                  จังหวัด <span class="req">*</span>
                  <div class="field-label-en">Province</div>
                </div>
                <v-autocomplete
                  v-model="form.province"
                  :items="provinces"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-3">
                  รหัสไปรษณีย์ <span class="req">*</span>
                  <div class="field-label-en">Postal Code</div>
                </div>
                <v-text-field
                  v-model="form.zipCode"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  maxlength="5"
                />
              </v-col>
            </v-row>

            <v-divider class="my-5" />
            <div class="form-section-title mb-3">
              <v-icon icon="fas fa-paperclip" size="13" class="mr-1" />
              เอกสารประกอบ
            </div>
            <v-row dense>
              <v-col cols="12">
                <div class="field-label">
                  สำเนาบัตรประชาชน <span class="req">*</span>
                  <div class="field-label-en">ID Card Copy</div>
                </div>
                <v-file-input
                  v-model="form.idDoc"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.requiredFile]"
                  prepend-icon=""
                  prepend-inner-icon="fas fa-paperclip"
                  accept=".pdf,.jpg,.jpeg,.png"
                  placeholder="เลือกไฟล์ .pdf .jpg .png"
                />
              </v-col>
            </v-row>
          </v-form>

          <div class="step-actions mt-6">
            <v-btn
              variant="tonal"
              color="grey"
              size="large"
              rounded="lg"
              prepend-icon="fas fa-chevron-left"
              @click="currentStep--"
            >
              ย้อนกลับ
            </v-btn>
            <v-btn
              color="primary"
              size="large"
              rounded="lg"
              style="flex: 1"
              append-icon="fas fa-chevron-right"
              @click="nextFromInfo"
            >
              ถัดไป
            </v-btn>
          </div>
        </div>

        <!-- ═══ Step 2: ตรวจสอบ & ยืนยัน ═══ -->
        <div v-else-if="currentStep === 2">
          <v-card variant="outlined" rounded="xl" class="mb-5">
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-2 mb-4">
                <div class="summary-icon-box">
                  <v-icon
                    icon="fas fa-clipboard-list"
                    size="16"
                    color="primary"
                  />
                </div>
                <span class="text-body-2 font-weight-bold"
                  >สรุปข้อมูลการลงทะเบียน</span
                >
              </div>

              <div class="confirm-row">
                <span class="confirm-label">ชื่อ-นามสกุล</span>
                <span class="confirm-value"
                  >{{ form.prefix }}{{ form.firstName }}
                  {{ form.lastName }}</span
                >
              </div>
              <div class="confirm-row">
                <span class="confirm-label">เลขบัตรประชาชน</span>
                <span class="confirm-value">{{ maskIdCard(form.idCard) }}</span>
              </div>
              <v-divider class="my-3" />
              <div class="confirm-row">
                <span class="confirm-label">อีเมล</span>
                <span class="confirm-value">{{ form.email }}</span>
              </div>
              <div class="confirm-row">
                <span class="confirm-label">เบอร์โทรศัพท์</span>
                <span class="confirm-value">{{ form.phone }}</span>
              </div>
              <div class="confirm-row">
                <span class="confirm-label">จังหวัด</span>
                <span class="confirm-value">{{ form.province }}</span>
              </div>
            </v-card-text>
          </v-card>

          <v-alert
            color="info"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-circle-info"
            class="mb-5"
          >
            <span class="text-body-2">
              หลังส่งคำขอ เจ้าหน้าที่จะตรวจสอบข้อมูลและอนุมัติสิทธิ์ภายใน
              <strong>3-5 วันทำการ</strong>
            </span>
          </v-alert>

          <v-checkbox
            v-model="form.acceptTerms"
            hide-details="auto"
            :rules="[(v) => !!v || 'กรุณายอมรับเงื่อนไข']"
            class="mb-5"
          >
            <template #label>
              <span class="text-body-2">
                ฉันยอมรับ
                <a href="#" class="text-primary text-decoration-none"
                  >นโยบายความเป็นส่วนตัว</a
                >
                และ
                <a href="#" class="text-primary text-decoration-none"
                  >เงื่อนไขการใช้งาน</a
                >
              </span>
            </template>
          </v-checkbox>

          <div class="step-actions">
            <v-btn
              variant="tonal"
              color="grey"
              size="large"
              rounded="lg"
              prepend-icon="fas fa-chevron-left"
              @click="currentStep--"
            >
              ย้อนกลับ
            </v-btn>
            <v-btn
              color="primary"
              size="large"
              rounded="lg"
              style="flex: 1"
              prepend-icon="fas fa-paper-plane"
              :loading="loading"
              @click="doSubmit"
            >
              ส่งคำขอลงทะเบียน
            </v-btn>
          </div>
        </div>

        <!-- Login link -->
        <div class="login-row mt-6">
          <span class="text-body-2 text-medium-emphasis">มีบัญชีแล้ว?</span>
          <v-btn
            variant="text"
            size="small"
            color="primary"
            class="ml-1 pa-0"
            @click="router.push('/login')"
          >
            เข้าสู่ระบบ
          </v-btn>
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
      </div>
    </div>

    <!-- ═══ Success Dialog ═══ -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-paper-plane" size="36" color="primary" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งคำขอลงทะเบียนสำเร็จ!</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            ระบบได้รับคำขอของคุณแล้ว เจ้าหน้าที่จะตรวจสอบข้อมูลและอนุมัติสิทธิ์
          </p>
          <v-alert
            color="info"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-envelope"
            class="text-left mb-3"
          >
            <span class="text-body-2"
              >ระบบส่งอีเมลยืนยันไปที่ <strong>{{ form.email }}</strong></span
            >
          </v-alert>
          <v-alert
            color="warning"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-clock"
            class="text-left"
          >
            <span class="text-body-2"
              >รอผลการอนุมัติภายใน <strong>3-5 วันทำการ</strong></span
            >
          </v-alert>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="primary"
            block
            rounded="lg"
            @click="router.push('/login')"
          >
            กลับหน้าเข้าสู่ระบบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const router = useRouter();
const themeStore = useThemeStore();

const currentStep = ref(0);
const loading = ref(false);
const thaidLoading = ref(false);
const successDialog = ref(false);
const thaidVerified = ref(false);
const formRef = ref();

const steps = [
  { key: "verify", label: "ยืนยันตัวตน" },
  { key: "info", label: "กรอกข้อมูล" },
  { key: "confirm", label: "ยืนยัน" },
];

const form = ref({
  prefix: "",
  firstName: "",
  lastName: "",
  idCard: "",
  email: "",
  phone: "",
  address: "",
  province: "",
  zipCode: "",
  idDoc: null as File | File[] | null,
  acceptTerms: false,
});

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

const provinces = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "เชียงราย",
  "ขอนแก่น",
  "นครราชสีมา",
  "สงขลา",
  "ภูเก็ต",
  "อุบลราชธานี",
  "นครปฐม",
  "ระยอง",
];

const rules = {
  required: (v: string) => !!v || "กรุณากรอกข้อมูล",
  email: (v: string) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
  requiredFile: (v: File | File[] | null) => {
    if (!v) return "กรุณาแนบเอกสาร";
    if (Array.isArray(v)) return v.length > 0 || "กรุณาแนบเอกสาร";
    return true;
  },
};

function doThaiDVerify() {
  thaidLoading.value = true;
  setTimeout(() => {
    thaidVerified.value = true;
    thaidLoading.value = false;
    form.value.prefix = "นาย";
    form.value.firstName = "สมชาย";
    form.value.lastName = "ใจดี";
    form.value.idCard = "1100200123456";
    currentStep.value = 1;
  }, 1200);
}

function skipThaiD() {
  thaidVerified.value = false;
  currentStep.value = 1;
}

async function nextFromInfo() {
  if (!formRef.value) {
    currentStep.value = 2;
    return;
  }
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  currentStep.value = 2;
}

async function doSubmit() {
  if (!form.value.acceptTerms) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  loading.value = false;
  successDialog.value = true;
}

function maskIdCard(v: string) {
  if (v.length < 5) return v;
  return v.slice(0, 1) + "-XXXX-XXXXX-" + v.slice(-2);
}
</script>

<style scoped>
/* ═══ Root ═══ */
.reg-root {
  min-height: 100vh;
  display: flex;
}

/* ═══ Left Panel ═══ */
.reg-left {
  width: 520px;
  flex-shrink: 0;
  background: linear-gradient(
    145deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.6) 100%
  );
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.reg-left::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at 80% 15%,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 10% 85%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
}
.is-dark .reg-left {
  background:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.68)),
    linear-gradient(
      145deg,
      rgb(var(--v-theme-primary)) 0%,
      rgba(var(--v-theme-primary), 0.5) 100%
    );
}
.reg-left-inner {
  position: relative;
  z-index: 1;
  padding: 52px 44px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.brand-ring {
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
.brand-ring-sm {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
.feature-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.reg-left-footer {
  margin-top: auto;
  padding-top: 32px;
}

/* ═══ Right Panel ═══ */
.reg-right {
  flex: 1;
  background: rgb(var(--v-theme-background));
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 24px;
  overflow-y: auto;
}
.reg-form-wrapper {
  width: 100%;
  max-width: 520px;
}

/* ═══ Step Indicator ═══ */
.step-track {
  display: flex;
  align-items: center;
}
.step-node {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  transition:
    background 0.2s,
    color 0.2s;
}
.step-node--done {
  background: rgb(var(--v-theme-success));
  color: white;
}
.step-node--active {
  background: rgb(var(--v-theme-primary));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-primary), 0.15);
}
.step-node--pending {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.35);
}
.step-connector {
  flex: 1;
  height: 2px;
  margin: 0 6px;
  background: rgba(var(--v-border-color), var(--v-border-opacity));
  transition: background 0.2s;
}
.step-connector--done {
  background: rgb(var(--v-theme-success));
}
.step-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
.step-label {
  flex: 1;
  text-align: center;
  font-size: 11px;
}
.step-label:first-child {
  text-align: left;
}
.step-label:last-child {
  text-align: right;
}

/* ═══ Step 0: ThaiD Hero ═══ */
.thaid-hero {
  border: 1.5px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 20px;
  padding: 44px 24px;
  text-align: center;
  background: rgba(var(--v-theme-primary), 0.02);
}
.thaid-icon-wrap {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
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

/* ═══ Form ═══ */
.form-section-title {
  font-size: 12px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: flex;
  align-items: center;
}
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
}
.req {
  color: rgb(var(--v-theme-error));
}
.autofill-field :deep(.v-field__input) {
  color: rgba(var(--v-theme-on-surface), 0.45) !important;
}
.autofill-field :deep(.v-field) {
  background: rgba(var(--v-border-color), 0.04) !important;
}

/* ═══ Step Actions (buttons row) ═══ */
.step-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.step-actions .v-btn:first-child {
  flex-shrink: 0;
  width: 130px;
}

/* ═══ Step 2: Summary ═══ */
.summary-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.confirm-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.5);
}
.confirm-row:last-child {
  border-bottom: none;
}
.confirm-label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-weight: 600;
}
.confirm-value {
  font-size: 13px;
  font-weight: 500;
  text-align: right;
}

/* ═══ Bottom ═══ */
.login-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* ═══ Success Dialog ═══ */
.success-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
