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
        <h1 class="page-title mb-1">คำขอรับรอง ORG (รายกลุ่ม)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          สำหรับกลุ่มเกษตรกร / วิสาหกิจชุมชน
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

    <!-- Step 1: ข้อมูลกลุ่ม -->
    <template v-if="currentStep === 0">
      <v-row>
        <v-col cols="12">
          <v-card rounded="xl" elevation="0" class="mb-4">
            <div class="section-header">
              <v-icon icon="fas fa-people-group" color="org-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลกลุ่มเกษตรกร</span
              >
            </div>
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12">
                  <div class="field-label mb-1">
                    ชื่อกลุ่ม <span class="req">*</span>
                    <span class="field-label-en">Group Name</span>
                  </div>
                  <v-text-field
                    v-model="form.groupName"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="เช่น กลุ่มเกษตรอินทรีย์บ้านโนน"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    ประเภทกลุ่ม <span class="req">*</span>
                  </div>
                  <v-select
                    v-model="form.groupType"
                    :items="groupTypes"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    เลขทะเบียนกลุ่ม <span class="field-label-en">Reg. No.</span>
                  </div>
                  <v-text-field
                    v-model="form.groupRegNo"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    ชื่อประธานกลุ่ม <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.presidentName"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    เบอร์โทรศัพท์ <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.phone"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    prepend-inner-icon="fas fa-phone"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    ชนิดพืช <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.cropType"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1 mt-3">
                    มาตรฐานที่ขอ <span class="req">*</span>
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
                    พื้นที่รวม (ไร่) <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.totalArea"
                    type="number"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    suffix="ไร่"
                  />
                </v-col>
                <v-col cols="12" sm="6">
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
        </v-col>
      </v-row>
    </template>

    <!-- Step 2: รายชื่อสมาชิก -->
    <template v-if="currentStep === 1">
      <v-card rounded="xl" elevation="0" class="mb-4">
        <div class="section-header d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-2">
            <v-icon icon="fas fa-list-ul" color="org-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >รายชื่อสมาชิกกลุ่ม</span
            >
          </div>
          <v-btn
            color="org-user"
            variant="tonal"
            size="small"
            prepend-icon="fas fa-plus"
            @click="addMember"
            >เพิ่มสมาชิก</v-btn
          >
        </div>
        <v-card-text class="pa-5">
          <div
            v-if="members.length === 0"
            class="text-center pa-8 text-medium-emphasis"
          >
            <v-icon icon="fas fa-people-group" size="40" style="opacity: 0.2" />
            <p class="text-body-2 mt-2 mb-0">
              ยังไม่มีรายชื่อสมาชิก กดปุ่ม "เพิ่มสมาชิก"
            </p>
          </div>
          <div v-for="(m, i) in members" :key="i" class="member-row mb-3">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon icon="fas fa-user" color="org-user" size="14" />
              <span class="text-body-2 font-weight-medium"
                >สมาชิกที่ {{ i + 1 }}</span
              >
              <v-spacer />
              <v-btn
                icon="fas fa-trash"
                size="x-small"
                variant="text"
                color="error"
                @click="removeMember(i)"
              />
            </div>
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  ชื่อ-นามสกุล <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="m.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label mb-1">
                  เลขบัตรประชาชน <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="m.idCard"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label mb-1">
                  พื้นที่ (ไร่) <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="m.area"
                  type="number"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  suffix="ไร่"
                />
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label mb-1">จำนวนแปลง</div>
                <v-text-field
                  v-model="m.plots"
                  type="number"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
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
          <v-icon icon="fas fa-paperclip" color="org-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
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
          @click="successDialog = true"
          >ยื่นคำขอ</v-btn
        >
      </div>
    </div>

    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">
            เลขที่คำขอ: <strong>ORG-GRP-2568-00002</strong>
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
  { key: "info", label: "ข้อมูลกลุ่ม" },
  { key: "members", label: "รายชื่อสมาชิก" },
  { key: "docs", label: "แนบเอกสาร" },
];

function stepClass(i: number) {
  if (currentStep.value > i) return "step-done";
  if (currentStep.value === i) return "step-active";
  return "step-pending";
}

const form = reactive({
  groupName: "",
  groupType: "",
  groupRegNo: "",
  presidentName: "",
  phone: "",
  cropType: "",
  standard: "",
  totalArea: "",
  province: "",
});

interface Member {
  name: string;
  idCard: string;
  area: string;
  plots: string;
}
const members = ref<Member[]>([]);

function addMember() {
  members.value.push({ name: "", idCard: "", area: "", plots: "" });
}
function removeMember(i: number) {
  members.value.splice(i, 1);
}

const uploadedFiles = reactive<Record<string, File | null>>({
  groupDoc: null,
  presidentId: null,
  memberList: null,
  landDoc: null,
});

const requiredDocs = [
  {
    key: "groupDoc",
    label: "หนังสือรับรองกลุ่ม",
    desc: "ทะเบียนวิสาหกิจ / หนังสือจัดตั้งกลุ่ม",
    required: true,
  },
  {
    key: "presidentId",
    label: "บัตรประชาชนประธาน",
    desc: "สำเนาบัตรประชาชนประธานกลุ่ม",
    required: true,
  },
  {
    key: "memberList",
    label: "รายชื่อสมาชิก",
    desc: "เอกสารรายชื่อสมาชิกทั้งหมด",
    required: true,
  },
  {
    key: "landDoc",
    label: "เอกสารสิทธิ์ที่ดิน",
    desc: "โฉนด / น.ส.3 ของสมาชิกแต่ละราย",
    required: false,
  },
];

const groupTypes = [
  "กลุ่มเกษตรกร",
  "วิสาหกิจชุมชน",
  "สหกรณ์การเกษตร",
  "นิติบุคคล",
];
const standardOptions = ["มกษ.9000", "มกษ.9001", "มกษ.9002"];
const provinces = [
  "เชียงใหม่",
  "เชียงราย",
  "ลำพูน",
  "เพชรบูรณ์",
  "นครราชสีมา",
  "ขอนแก่น",
  "อุบลราชธานี",
  "ยโสธร",
  "สุรินทร์",
];

function saveDraft() {
  draftSnackbar.value = true;
}
</script>

<style scoped>
.member-row {
  padding: 14px;
  background: rgba(var(--v-border-color), 0.04);
  border-radius: 10px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
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
