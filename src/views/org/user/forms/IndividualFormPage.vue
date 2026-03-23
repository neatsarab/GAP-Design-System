<template>
  <div style="--v-theme-primary: var(--v-theme-org-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/org/user/applications/new')"
      />
      <div>
        <h1 class="page-title mb-1">คำขอรับรอง ORG (รายเดี่ยว)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          กรอกข้อมูลคำขอรับรองมาตรฐานเกษตรอินทรีย์รายบุคคล
        </p>
      </div>
    </div>

    <!-- Step indicator -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.key">
            <div
              class="step-item d-flex flex-column align-center"
              style="min-width: 80px"
            >
              <div class="step-circle mb-1" :class="stepClass(i)">
                <v-icon
                  v-if="currentStep > i"
                  icon="fas fa-check"
                  size="14"
                  color="white"
                />
                <span v-else class="text-caption font-weight-bold">{{
                  i + 1
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  currentStep >= i
                    ? 'text-org-user font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.label }}
              </div>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > i }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- Step 1: ข้อมูลรายละเอียด -->
    <template v-if="currentStep === 0">
      <v-row>
        <v-col cols="12">
          <!-- ข้อมูลผู้ยื่นคำขอ -->
          <v-card rounded="xl" elevation="0" class="mb-4">
            <div class="section-header">
              <v-icon icon="fas fa-user" color="org-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลผู้ยื่นคำขอ</span
              >
            </div>
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    ชื่อ-นามสกุล <span class="req">*</span>
                    <span class="field-label-en">Full Name</span>
                  </div>
                  <v-text-field
                    v-model="form.name"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="ชื่อเต็ม"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    เลขบัตรประชาชน <span class="req">*</span>
                    <span class="field-label-en">National ID</span>
                  </div>
                  <v-text-field
                    v-model="form.idCard"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="1 xxxx xxxxx xx x"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    เบอร์โทรศัพท์ <span class="req">*</span>
                    <span class="field-label-en">Phone</span>
                  </div>
                  <v-text-field
                    v-model="form.phone"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="08x-xxx-xxxx"
                    prepend-inner-icon="fas fa-phone"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    อีเมล <span class="field-label-en">Email</span>
                  </div>
                  <v-text-field
                    v-model="form.email"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="example@email.com"
                    prepend-inner-icon="fas fa-envelope"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1 mt-3">
                    ที่อยู่ <span class="req">*</span>
                    <span class="field-label-en">Address</span>
                  </div>
                  <v-text-field
                    v-model="form.address"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="บ้านเลขที่ หมู่ ถนน"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1 mt-3">
                    ตำบล <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.subdistrict"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1 mt-3">
                    อำเภอ <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.district"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1 mt-3">
                    จังหวัด <span class="req">*</span>
                  </div>
                  <v-autocomplete
                    v-model="form.province"
                    :items="provinces"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ข้อมูลแปลงปลูก -->
          <v-card rounded="xl" elevation="0" class="mb-4">
            <div class="section-header">
              <v-icon icon="fas fa-seedling" color="org-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลพื้นที่เพาะปลูก</span
              >
            </div>
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    ชนิดพืช <span class="req">*</span>
                    <span class="field-label-en">Crop Type</span>
                  </div>
                  <v-text-field
                    v-model="form.cropType"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="เช่น ข้าว ผัก ผลไม้"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    มาตรฐานที่ขอ <span class="req">*</span>
                    <span class="field-label-en">Standard</span>
                  </div>
                  <v-select
                    v-model="form.standard"
                    :items="standardOptions"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    จำนวนแปลง <span class="req">*</span>
                    <span class="field-label-en">No. of Plots</span>
                  </div>
                  <v-text-field
                    v-model="form.plotCount"
                    type="number"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    min="1"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    พื้นที่รวม (ไร่) <span class="req">*</span>
                    <span class="field-label-en">Total Area</span>
                  </div>
                  <v-text-field
                    v-model="form.area"
                    type="number"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    suffix="ไร่"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1 mt-3">
                    ที่ตั้งแปลง <span class="req">*</span>
                    <span class="field-label-en">Plot Location</span>
                  </div>
                  <v-text-field
                    v-model="form.plotAddress"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="หมู่บ้าน ตำบล อำเภอ จังหวัด"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    ละติจูด <span class="field-label-en">Latitude</span>
                  </div>
                  <v-text-field
                    v-model="form.lat"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="18.xxxx"
                    prepend-inner-icon="fas fa-location-dot"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    ลองจิจูด <span class="field-label-en">Longitude</span>
                  </div>
                  <v-text-field
                    v-model="form.lng"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="98.xxxx"
                    prepend-inner-icon="fas fa-location-dot"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Step 2: แนบเอกสาร -->
    <template v-if="currentStep === 1">
      <v-row>
        <v-col cols="12">
          <v-card rounded="xl" elevation="0">
            <div class="section-header">
              <v-icon icon="fas fa-paperclip" color="org-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >เอกสารที่ต้องแนบ</span
              >
            </div>
            <v-card-text class="pa-5">
              <div
                v-for="doc in requiredDocs"
                :key="doc.key"
                class="doc-upload-row mb-4"
              >
                <div class="d-flex align-center justify-space-between mb-2">
                  <div>
                    <div class="text-body-2 font-weight-medium">
                      {{ doc.label
                      }}<span v-if="doc.required" class="req ml-1">*</span>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ doc.desc }}
                    </div>
                  </div>
                  <v-chip
                    v-if="uploadedFiles[doc.key]"
                    size="x-small"
                    color="success"
                    variant="tonal"
                    prepend-icon="fas fa-check"
                    >อัปโหลดแล้ว</v-chip
                  >
                  <v-chip
                    v-else-if="doc.required"
                    size="x-small"
                    color="error"
                    variant="tonal"
                    >จำเป็น</v-chip
                  >
                  <v-chip v-else size="x-small" color="grey" variant="tonal"
                    >ถ้ามี</v-chip
                  >
                </div>
                <v-file-input
                  :model-value="uploadedFiles[doc.key]"
                  @update:model-value="
                    (v) =>
                      (uploadedFiles[doc.key] = Array.isArray(v)
                        ? (v[0] ?? null)
                        : v)
                  "
                  accept=".pdf,.jpg,.png"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  prepend-icon=""
                  prepend-inner-icon="fas fa-upload"
                  :placeholder="`เลือกไฟล์ ${doc.label}`"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Actions -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="grey"
          @click="router.push('/org/user/applications')"
          >ยกเลิก</v-btn
        >
        <v-btn
          v-if="currentStep > 0"
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-arrow-left"
          @click="currentStep--"
          >ย้อนกลับ</v-btn
        >
      </div>
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="org-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="org-user"
          append-icon="fas fa-arrow-right"
          @click="currentStep++"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="org-user"
          prepend-icon="fas fa-paper-plane"
          @click="submitForm"
          >ยื่นคำขอ</v-btn
        >
      </div>
    </div>

    <!-- Success dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">
            เลขที่คำขอ: <strong>ORG-2568-00004</strong>
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ระบบจะแจ้งเตือนเมื่อมีการอัปเดตสถานะ
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="org-user"
            rounded="lg"
            block
            @click="router.push('/org/user/applications')"
            >ดูรายการคำขอ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Draft Snackbar -->
    <v-snackbar
      v-model="draftSnackbar"
      color="success"
      rounded="lg"
      timeout="2500"
      location="top right"
    >
      <v-icon icon="fas fa-floppy-disk" class="mr-2" />
      บันทึกแบบร่างแล้ว
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
  { key: "detail", label: "ข้อมูลรายละเอียด" },
  { key: "docs", label: "แนบเอกสาร" },
];

function stepClass(i: number) {
  if (currentStep.value > i) return "step-done";
  if (currentStep.value === i) return "step-active";
  return "step-pending";
}

const form = reactive({
  name: "",
  idCard: "",
  phone: "",
  email: "",
  address: "",
  subdistrict: "",
  district: "",
  province: "",
  cropType: "",
  standard: "",
  plotCount: "",
  area: "",
  plotAddress: "",
  lat: "",
  lng: "",
});

const uploadedFiles = reactive<Record<string, File | null>>({
  idCard: null,
  householdReg: null,
  landDoc: null,
  poa: null,
  prevCert: null,
});

const requiredDocs = [
  {
    key: "idCard",
    label: "สำเนาบัตรประชาชน",
    desc: "ไฟล์ PDF หรือรูปภาพ",
    required: true,
  },
  {
    key: "householdReg",
    label: "ทะเบียนบ้าน",
    desc: "สำเนาทะเบียนบ้านผู้ยื่นคำขอ",
    required: true,
  },
  {
    key: "landDoc",
    label: "เอกสารสิทธิ์ที่ดิน",
    desc: "โฉนด / น.ส.3 / ส.ป.ก.",
    required: true,
  },
  {
    key: "poa",
    label: "หนังสือมอบอำนาจ",
    desc: "กรณียื่นแทนเจ้าของแปลง",
    required: false,
  },
  {
    key: "prevCert",
    label: "สำเนาใบรับรองเดิม",
    desc: "กรณีต่ออายุใบรับรอง",
    required: false,
  },
];

const provinces = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "เชียงราย",
  "เพชรบูรณ์",
  "นครปฐม",
  "นครราชสีมา",
  "ขอนแก่น",
  "อุบลราชธานี",
  "สุราษฎร์ธานี",
];
const standardOptions = ["มกษ.9000", "มกษ.9001", "มกษ.9002"];

function saveDraft() {
  draftSnackbar.value = true;
}

function submitForm() {
  successDialog.value = true;
}
</script>

<style scoped>
.doc-upload-row {
  padding: 12px;
  background: rgba(var(--v-border-color), 0.04);
  border-radius: 10px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-org-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-org-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-org-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-org-user)) !important;
}
</style>
