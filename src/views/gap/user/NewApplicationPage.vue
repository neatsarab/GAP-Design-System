<template>
  <div style="--v-theme-primary: var(--v-theme-gap-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอรับรองแหล่งผลิต GAP</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          กรอกข้อมูลให้ครบถ้วน แล้วยื่นเพื่อรับการตรวจสอบ
        </p>
      </div>
    </div>

    <!-- Stepper Header -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div
              class="step-item d-flex flex-column align-center"
              style="min-width: 80px"
            >
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon
                  v-if="currentStep > step.value"
                  icon="fas fa-check"
                  size="14"
                  color="white"
                />
                <span v-else class="text-caption font-weight-bold">{{
                  step.value + 1
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  currentStep >= step.value
                    ? 'text-gap-user font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > step.value }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- Step Content -->
    <v-window v-model="currentStep">
      <!-- Step 1: ข้อมูลผู้ยื่นคำขอ -->
      <v-window-item :value="0">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="gap-user">fas fa-user</v-icon>
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="2">
                <div class="field-label">
                  <div>คำนำหน้า <span class="req">*</span></div>
                  <div class="field-label-en">Title</div>
                </div>
                <v-autocomplete
                  v-model="form.namePrefix"
                  :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  <div>ชื่อ <span class="req">*</span></div>
                  <div class="field-label-en">First Name</div>
                </div>
                <v-text-field
                  v-model="form.firstName"
                  placeholder="ชื่อจริง"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  <div>นามสกุล <span class="req">*</span></div>
                  <div class="field-label-en">Last Name</div>
                </div>
                <v-text-field
                  v-model="form.lastName"
                  placeholder="นามสกุล"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>เลขบัตรประชาชน <span class="req">*</span></div>
                  <div class="field-label-en">National ID No.</div>
                </div>
                <v-text-field
                  v-model="form.idCard"
                  placeholder="X-XXXX-XXXXX-XX-X"
                  prepend-inner-icon="fas fa-id-card"
                  :rules="[rules.required, rules.idCard]"
                  maxlength="13"
                  counter
                  hint="ตัวเลข 13 หลัก ไม่ใส่ขีด"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>เบอร์โทรศัพท์ <span class="req">*</span></div>
                  <div class="field-label-en">Phone Number</div>
                </div>
                <v-text-field
                  v-model="form.phone"
                  placeholder="0XX-XXX-XXXX"
                  prepend-inner-icon="fas fa-phone"
                  :rules="[rules.required, rules.phone]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>อีเมล</div>
                  <div class="field-label-en">Email</div>
                </div>
                <v-text-field
                  v-model="form.email"
                  placeholder="example@email.com"
                  prepend-inner-icon="fas fa-envelope"
                  hint="ถ้ามี — ใช้รับการแจ้งเตือน"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 2: ที่อยู่ + ข้อมูลแปลง -->
      <v-window-item :value="1">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="gap-user">fas fa-location-dot</v-icon>
            <span class="text-subtitle-2 font-weight-bold"
              >ที่อยู่ที่ติดต่อ</span
            >
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="9">
                <div class="field-label">
                  <div>ที่อยู่ <span class="req">*</span></div>
                  <div class="field-label-en">Address</div>
                </div>
                <v-textarea
                  v-model="form.address"
                  placeholder="บ้านเลขที่ / หมู่ที่ / ซอย / ถนน"
                  prepend-inner-icon="fas fa-house"
                  rows="2"
                  auto-grow
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">
                  <div>รหัสไปรษณีย์</div>
                  <div class="field-label-en">Postal Code</div>
                </div>
                <v-text-field
                  v-model="form.postalCode"
                  placeholder="XXXXX"
                  prepend-inner-icon="fas fa-map-pin"
                  maxlength="5"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>จังหวัด <span class="req">*</span></div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-autocomplete
                  v-model="form.province"
                  :items="provinces"
                  prepend-inner-icon="fas fa-map"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>อำเภอ / เขต</div>
                  <div class="field-label-en">District</div>
                </div>
                <v-autocomplete
                  v-model="form.district"
                  :items="['อำเภอเมือง', 'อำเภอปากช่อง', 'อำเภอโชคชัย']"
                  prepend-inner-icon="fas fa-city"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ตำบล / แขวง</div>
                  <div class="field-label-en">Sub-district</div>
                </div>
                <v-autocomplete
                  v-model="form.subDistrict"
                  :items="['ตำบลในเมือง', 'ตำบลโพธิ์กลาง', 'ตำบลหนองไข่น้ำ']"
                  prepend-inner-icon="fas fa-map-pin"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="0" border rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="gap-user">fas fa-seedling</v-icon>
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลแปลงและการผลิต</span
            >
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ชนิดพืช <span class="req">*</span></div>
                  <div class="field-label-en">Crop Type</div>
                </div>
                <v-autocomplete
                  v-model="form.cropTypes"
                  :items="cropTypes"
                  prepend-inner-icon="fas fa-seedling"
                  multiple
                  chips
                  closable-chips
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ผู้ตรวจประเมิน</div>
                  <div class="field-label-en">Inspector</div>
                </div>
                <v-autocomplete
                  v-model="form.inspector"
                  :items="inspectors"
                  prepend-inner-icon="fas fa-user-check"
                  clearable
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6" class="mt-2">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-caption text-medium-emphasis"
                    >พื้นที่แปลงปลูก (ไร่)</span
                  >
                  <v-text-field
                    v-model.number="form.area"
                    density="compact"
                    variant="outlined"
                    style="max-width: 90px"
                    type="number"
                    suffix="ไร่"
                    hide-details
                    :min="0"
                    :max="100"
                  />
                </div>
                <v-slider
                  v-model="form.area"
                  color="gap-user"
                  :min="0"
                  :max="100"
                  :step="0.5"
                  thumb-label
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="6" class="mt-2">
                <div class="text-caption text-medium-emphasis mb-1">
                  ระดับความสูง (เมตร) &nbsp;
                  <strong>{{ form.elevRange[0] }}</strong> –
                  <strong>{{ form.elevRange[1] }}</strong> ม.
                </div>
                <v-range-slider
                  v-model="form.elevRange"
                  color="info"
                  :min="0"
                  :max="2000"
                  :step="50"
                  thumb-label
                  hide-details
                  class="mt-2"
                />
              </v-col>
              <v-col cols="12"><v-divider class="my-2" /></v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ประเภทคำขอ</div>
                  <div class="field-label-en">Request Type</div>
                </div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-radio-group
                    v-model="form.appType"
                    color="gap-user"
                    density="compact"
                    hide-details
                  >
                    <v-radio label="รายเดี่ยว" value="single" />
                    <v-radio label="รายกลุ่ม" value="group" />
                    <v-radio label="ต่ออายุ" value="renew" />
                  </v-radio-group>
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>สถานะการผลิต</div>
                  <div class="field-label-en">Production Status</div>
                </div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-switch
                    v-model="form.organic"
                    label="เกษตรอินทรีย์"
                    color="gap-user"
                    base-color="grey-darken-1"
                    inset
                    density="compact"
                    hide-details
                    class="mb-2"
                  />
                  <v-switch
                    v-model="form.groupApp"
                    label="ยื่นคำขอรายกลุ่ม"
                    color="info"
                    base-color="grey-darken-1"
                    inset
                    density="compact"
                    hide-details
                  />
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ข้อกำหนด GAP</div>
                  <div class="field-label-en">GAP Requirements</div>
                </div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-checkbox
                    v-model="form.water"
                    label="มีแหล่งน้ำในพื้นที่"
                    color="gap-user"
                    density="compact"
                    hide-details
                    class="mb-1"
                  />
                  <v-checkbox
                    v-model="form.record"
                    label="มีการบันทึกการผลิต"
                    color="gap-user"
                    density="compact"
                    hide-details
                    class="mb-1"
                  />
                  <v-checkbox
                    v-model="form.chemical"
                    label="บันทึกการใช้สารเคมี"
                    color="warning"
                    density="compact"
                    hide-details
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 3: เอกสาร -->
      <v-window-item :value="2">
        <v-card elevation="0" border rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="gap-user">fas fa-paperclip</v-icon>
            <span class="text-subtitle-2 font-weight-bold"
              >เอกสารและหลักฐาน</span
            >
            <v-spacer />
            <v-chip size="x-small" variant="tonal" color="warning"
              >ไม่เกินไฟล์ละ 10 MB</v-chip
            >
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>เอกสารประกอบ</div>
                  <div class="field-label-en">Supporting Documents</div>
                </div>
                <v-file-input
                  v-model="form.docs"
                  accept=".pdf,.doc,.docx"
                  multiple
                  show-size
                  chips
                  hint="สำเนาโฉนด, ผลวิเคราะห์น้ำ · รองรับ PDF, DOC"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>รูปภาพแปลงปลูก</div>
                  <div class="field-label-en">Plot Photos</div>
                </div>
                <v-file-input
                  v-model="form.photos"
                  prepend-icon="fas fa-camera"
                  accept="image/*"
                  multiple
                  show-size
                  chips
                  hint="JPG, PNG · ความละเอียดไม่ต่ำกว่า 1 MB"
                  persistent-hint
                />
                <div
                  v-if="photoPreviewUrls.length"
                  class="d-flex flex-wrap ga-2 mt-3"
                >
                  <v-img
                    v-for="(url, i) in photoPreviewUrls"
                    :key="i"
                    :src="url"
                    width="80"
                    height="80"
                    cover
                    rounded="lg"
                    class="border"
                  />
                </div>
              </v-col>
              <v-col cols="12">
                <div class="field-label">
                  <div>แท็กเพิ่มเติม</div>
                  <div class="field-label-en">Additional Tags</div>
                </div>
                <v-combobox
                  v-model="form.tags"
                  :items="suggestedTags"
                  prepend-inner-icon="fas fa-tags"
                  multiple
                  chips
                  closable-chips
                  hint="พิมพ์แล้ว Enter เพื่อเพิ่มแท็กใหม่"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 4: ตรวจสอบ & ยื่น -->
      <v-window-item :value="3">
        <v-card elevation="0" border rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon size="15" color="gap-user">fas fa-clipboard-check</v-icon>
            <span class="text-subtitle-2 font-weight-bold"
              >ตรวจสอบข้อมูลก่อนยื่น</span
            >
          </div>
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ชื่อ-นามสกุล">
                    <v-list-item-title
                      >{{ form.namePrefix }} {{ form.firstName }}
                      {{ form.lastName }}</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item subtitle="เลขบัตรประชาชน">
                    <v-list-item-title>{{
                      form.idCard || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="เบอร์โทรศัพท์">
                    <v-list-item-title>{{
                      form.phone || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="จังหวัด">
                    <v-list-item-title>{{
                      form.province || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ชนิดพืช">
                    <v-list-item-title>{{
                      form.cropTypes.join(", ") || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="พื้นที่แปลงปลูก">
                    <v-list-item-title>{{ form.area }} ไร่</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ประเภทคำขอ">
                    <v-list-item-title>{{
                      form.appType === "single"
                        ? "รายเดี่ยว"
                        : form.appType === "group"
                          ? "รายกลุ่ม"
                          : "ต่ออายุ"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="เกษตรอินทรีย์">
                    <v-list-item-title>{{
                      form.organic ? "ใช่" : "ไม่ใช่"
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-alert
              type="info"
              variant="tonal"
              class="mt-4"
              prepend-icon="fas fa-circle-info"
            >
              กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยื่น —
              หลังจากยื่นแล้วจะไม่สามารถแก้ไขได้จนกว่าเจ้าหน้าที่จะแจ้งให้แก้ไข
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Actions -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="grey" @click="goToApplicationList"
          >ยกเลิก</v-btn
        >
        <v-btn
          v-if="currentStep > 0"
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-arrow-left"
          @click="prevStep"
          >ย้อนกลับ</v-btn
        >
      </div>
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="gap-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="gap-user"
          append-icon="fas fa-arrow-right"
          @click="nextStep"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="gap-user"
          prepend-icon="fas fa-paper-plane"
          @click="submitForm"
          >ยื่นคำขอ</v-btn
        >
      </div>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="mb-4">
            <v-icon icon="fas fa-circle-check" color="success" size="64" />
          </div>
          <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            เลขที่คำขอ: <strong class="text-gap-user">GAP-2569-011</strong
            ><br />
            เจ้าหน้าที่จะติดต่อกลับภายใน 3-5 วันทำการ
          </p>
          <v-btn color="gap-user" block @click="goToApplicationList">
            ดูรายการคำขอ
          </v-btn>
        </v-card-text>
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

<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);

function goToApplicationList() {
  router.push({ name: "ApplicationList" });
}

function prevStep() {
  currentStep.value--;
}

function nextStep() {
  currentStep.value++;
}
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
  { value: 0, title: "ข้อมูลผู้ขอ" },
  { value: 1, title: "ข้อมูลแปลง" },
  { value: 2, title: "เอกสารแนบ" },
  { value: 3, title: "ตรวจสอบ & ยื่น" },
];

const form = ref({
  namePrefix: "นาย",
  firstName: "",
  lastName: "",
  idCard: "",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  province: null,
  district: null,
  subDistrict: null,
  cropTypes: [],
  inspector: null,
  tags: [],
  water: true,
  record: false,
  chemical: false,
  organic: false,
  groupApp: false,
  appType: "single",
  area: 12,
  elevRange: [100, 500],
  docs: [],
  photos: [],
});

const photoPreviewUrls = ref([]);
watch(
  () => form.value.photos,
  (files) => {
    photoPreviewUrls.value.forEach((url) => URL.revokeObjectURL(url));
    photoPreviewUrls.value = (files ?? []).map((f) => URL.createObjectURL(f));
  },
);
onUnmounted(() =>
  photoPreviewUrls.value.forEach((url) => URL.revokeObjectURL(url)),
);

const rules = {
  required: (v) => !!v || "กรุณากรอกข้อมูล",
  idCard: (v) => /^\d{13}$/.test(v) || "เลขบัตรประชาชน 13 หลัก",
  phone: (v) => /^0\d{8,9}$/.test(v) || "รูปแบบเบอร์โทรไม่ถูกต้อง",
};

const provinces = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "ขอนแก่น",
  "นครราชสีมา",
  "สุพรรณบุรี",
  "เพชรบูรณ์",
];
const cropTypes = [
  "ข้าวหอมมะลิ",
  "ข้าวโพด",
  "มันสำปะหลัง",
  "อ้อย",
  "ผักกาดขาว",
  "มะเขือเทศ",
];
const inspectors = [
  "นาย วิจัย ตรวจดี",
  "นาง สุดา ประเมิน",
  "นาย ชัยวัฒน์ ผลตรวจ",
];
const suggestedTags = ["เกษตรอินทรีย์", "ปลอดสาร", "GAP", "พืชส่งออก"];

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function saveDraft() {
  draftSnackbar.value = true;
}

function submitForm() {
  successDialog.value = true;
}
</script>

<style scoped>
.step-done,
.step-active {
  background: rgb(var(--v-theme-gap-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-gap-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-gap-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-gap-user)) !important;
}
</style>
