<template>
  <div style="--v-theme-primary: var(--v-theme-hc-user)">
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationType"
      />
      <div>
        <h1 class="page-title mb-1">ยื่นคำขอใบรับรองสุขอนามัยพืช</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          กรอกข้อมูลตามขั้นตอนให้ครบถ้วน
        </p>
      </div>
    </div>

    <!-- Form Steps -->
    <!-- Step Indicator -->
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
                    ? 'text-hc-user font-weight-bold'
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

    <v-form ref="formRef" @submit.prevent="handleNext">
      <!-- Step 1: ข้อมูลผู้ส่งออก -->
      <v-card
        v-if="currentStep === 0"
        elevation="0"
        border
        rounded="xl"
        class="mb-4"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลผู้ส่งออก (Exporter)</span
          >
        </div>
        <v-card-text class="pt-5">
          <div class="field-section-label mb-3">ข้อมูลบริษัท</div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ชื่อผู้ส่งออก <span class="req">*</span></div>
                <div class="field-label-en">Exporter Name</div>
              </div>
              <v-text-field
                variant="outlined"
                density="compact"
                rounded="lg"
                v-model="form.exporterName"
                placeholder="ชื่อบริษัท / ชื่อผู้ส่งออก"
                hide-details
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-2 mb-2">
                ที่ตั้งและการติดต่อ
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ที่อยู่ <span class="req">*</span></div>
                <div class="field-label-en">Address</div>
              </div>
              <v-text-field
                variant="outlined"
                density="compact"
                rounded="lg"
                v-model="form.exporterAddress"
                placeholder="ที่อยู่"
                hide-details
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label">
                <div>จังหวัด <span class="req">*</span></div>
                <div class="field-label-en">Province</div>
              </div>
              <v-autocomplete
                variant="outlined"
                density="compact"
                rounded="lg"
                v-model="form.exporterProvince"
                :items="provinces"
                placeholder="เลือกจังหวัด"
                hide-details
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label">
                <div>รหัสไปรษณีย์</div>
                <div class="field-label-en">Postal Code</div>
              </div>
              <v-text-field
                variant="outlined"
                density="compact"
                rounded="lg"
                v-model="form.exporterZip"
                placeholder="XXXXX"
                hide-details
                maxlength="5"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label">
                <div>โทรศัพท์ <span class="req">*</span></div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                variant="outlined"
                density="compact"
                rounded="lg"
                v-model="form.exporterPhone"
                placeholder="0X-XXXX-XXXX"
                hide-details
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Step 2: โรงคัดบรรจุ + ผู้รับสินค้า -->
      <div v-if="currentStep === 1">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-warehouse" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >โรงคัดบรรจุ (Packing House)</span
            >
          </div>
          <v-card-text class="pt-5">
            <div class="field-section-label mb-3">ข้อมูลโรงคัดบรรจุ</div>
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>รหัสโรงคัดบรรจุ <span class="req">*</span></div>
                  <div class="field-label-en">Packing House Code</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.packingHouseCode"
                  :items="packingHouseOptions"
                  item-title="label"
                  item-value="code"
                  placeholder="เลือกโรงคัดบรรจุ"
                  hide-details
                  :rules="[rules.required]"
                  @update:model-value="fillPackingHouse"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ชื่อโรงคัดบรรจุ</div>
                  <div class="field-label-en">Packing House Name</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.packingHouseName"
                  readonly
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>จังหวัด</div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.packingHouseProvince"
                  readonly
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="0" border rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-user-tie" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ผู้รับสินค้า (Consignee)</span
            >
          </div>
          <v-card-text class="pt-5">
            <div class="field-section-label mb-3">ข้อมูลผู้รับสินค้า</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ชื่อผู้รับสินค้า <span class="req">*</span></div>
                  <div class="field-label-en">Consignee Name</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.consigneeName"
                  placeholder="Consignee name"
                  hide-details
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ที่อยู่ <span class="req">*</span></div>
                  <div class="field-label-en">Address</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.consigneeAddress"
                  placeholder="Address"
                  hide-details
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ประเทศปลายทาง <span class="req">*</span></div>
                  <div class="field-label-en">Destination Country</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.destination"
                  :items="countries"
                  placeholder="เลือกประเทศ"
                  hide-details
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <!-- Step 3: รายละเอียดสินค้า -->
      <v-card
        v-if="currentStep === 2"
        elevation="0"
        border
        rounded="xl"
        class="mb-4"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-box" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">รายละเอียดสินค้า</span>
          <v-spacer />
          <v-btn
            color="hc-user"
            size="small"
            variant="tonal"
            prepend-icon="fas fa-plus"
            @click="addProduct"
            >เพิ่มสินค้า</v-btn
          >
        </div>
        <v-card-text class="pt-5">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th style="width: 130px">
                  Sample No <span class="req">*</span>
                </th>
                <th>ชื่อพืช <span class="req">*</span></th>
                <th style="width: 130px">
                  น้ำหนัก (kg) <span class="req">*</span>
                </th>
                <th style="width: 180px">GAP Code</th>
                <th style="width: 50px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, idx) in form.products" :key="idx">
                <td class="py-2">
                  <v-text-field
                    variant="outlined"
                    rounded="lg"
                    v-model="p.sampleNo"
                    density="compact"
                    hide-details
                    placeholder="S-001"
                    :rules="[rules.required]"
                  />
                </td>
                <td class="py-2">
                  <v-autocomplete
                    variant="outlined"
                    rounded="lg"
                    v-model="p.name"
                    :items="cropOptions"
                    density="compact"
                    hide-details
                    :rules="[rules.required]"
                  />
                </td>
                <td class="py-2">
                  <v-text-field
                    variant="outlined"
                    rounded="lg"
                    v-model="p.weight"
                    density="compact"
                    hide-details
                    placeholder="1,000"
                    :rules="[rules.required]"
                  />
                </td>
                <td class="py-2">
                  <v-text-field
                    variant="outlined"
                    rounded="lg"
                    v-model="p.gapCode"
                    density="compact"
                    hide-details
                    placeholder="GAP-XX-2569-XXX"
                  />
                </td>
                <td class="py-2">
                  <v-btn
                    icon="fas fa-trash"
                    size="small"
                    variant="text"
                    color="error"
                    :disabled="form.products.length === 1"
                    @click="removeProduct(idx)"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <!-- Step 4: เอกสารแนบ -->
      <v-card
        v-if="currentStep === 3"
        elevation="0"
        border
        rounded="xl"
        class="mb-4"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pt-5">
          <v-row>
            <v-col v-for="doc in requiredDocs" :key="doc.key" cols="12" sm="6">
              <div class="doc-upload-box">
                <div class="d-flex align-start ga-3">
                  <v-icon
                    icon="fas fa-file-arrow-up"
                    color="hc-user"
                    size="20"
                    class="mt-1 flex-shrink-0"
                  />
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium mb-1">
                      {{ doc.label }}
                      <v-chip
                        v-if="doc.required"
                        size="x-small"
                        color="error"
                        variant="tonal"
                        class="ml-1"
                        >จำเป็น</v-chip
                      >
                    </div>
                    <v-file-input
                      v-model="form.documents[doc.key]"
                      :placeholder="`เลือกไฟล์ ${doc.label}`"
                      variant="outlined"
                      density="compact"
                      hide-details
                      accept=".pdf,.jpg,.png"
                      :rules="doc.required ? [rules.required] : []"
                      prepend-icon=""
                      prepend-inner-icon="fas fa-file"
                    />
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Step 5: ตรวจสอบ & ยืนยัน -->
      <div v-if="currentStep === 4">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-clipboard-check" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สรุปข้อมูลคำขอ</span>
          </div>
          <v-card-text class="pt-5">
            <v-row>
              <v-col cols="12" md="6">
                <div class="confirm-section mb-4">
                  <div class="confirm-section-title">ผู้ส่งออก</div>
                  <div class="confirm-grid">
                    <div class="confirm-item">
                      <span class="label">ชื่อ</span
                      ><span class="value">{{ form.exporterName || "—" }}</span>
                    </div>
                    <div class="confirm-item">
                      <span class="label">จังหวัด</span
                      ><span class="value">{{
                        form.exporterProvince || "—"
                      }}</span>
                    </div>
                    <div class="confirm-item">
                      <span class="label">โทรศัพท์</span
                      ><span class="value">{{
                        form.exporterPhone || "—"
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="confirm-section">
                  <div class="confirm-section-title">ผู้รับสินค้า</div>
                  <div class="confirm-grid">
                    <div class="confirm-item">
                      <span class="label">ชื่อ</span
                      ><span class="value">{{
                        form.consigneeName || "—"
                      }}</span>
                    </div>
                    <div class="confirm-item">
                      <span class="label">ประเทศ</span
                      ><span class="value">{{ form.destination || "—" }}</span>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="confirm-section">
                  <div class="confirm-section-title">
                    สินค้า ({{ form.products.length }} รายการ)
                  </div>
                  <v-table density="compact" class="mt-2">
                    <tbody>
                      <tr v-for="p in form.products" :key="p.sampleNo">
                        <td class="text-body-2">{{ p.sampleNo }}</td>
                        <td class="text-body-2">{{ p.name }}</td>
                        <td class="text-body-2 text-right">
                          {{ p.weight }} kg
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-checkbox
          v-model="form.confirmed"
          :rules="[(v) => !!v || 'กรุณายืนยันข้อมูล']"
          hide-details
          class="mb-3"
        >
          <template #label>
            <span class="text-body-2"
              >ข้าพเจ้าขอรับรองว่าข้อมูลในคำขอนี้ถูกต้องครบถ้วนและเป็นความจริงทุกประการ</span
            >
          </template>
        </v-checkbox>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-space-between align-center mt-6">
        <div class="d-flex ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            @click="goToApplicationList"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            v-if="currentStep > 0"
            variant="tonal"
            color="grey"
            prepend-icon="fas fa-arrow-left"
            @click="prevStep"
          >
            ย้อนกลับ
          </v-btn>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            variant="tonal"
            color="hc-user"
            prepend-icon="fas fa-floppy-disk"
            @click="saveDraft"
          >
            บันทึกแบบร่าง
          </v-btn>
          <v-btn
            v-if="currentStep < steps.length - 1"
            color="hc-user"
            append-icon="fas fa-arrow-right"
            type="submit"
          >
            ถัดไป
          </v-btn>
          <v-btn
            v-else
            color="hc-user"
            prepend-icon="fas fa-paper-plane"
            :loading="submitting"
            type="submit"
          >
            ยื่นคำขอ
          </v-btn>
        </div>
      </div>
    </v-form>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" size="40" color="success" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h3>
          <p class="text-body-2 font-weight-bold text-hc-user mb-1">
            {{ newRequestNo }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            เจ้าหน้าที่จะตรวจสอบคำขอของท่านและแจ้งผลทางอีเมล
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 d-flex ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            block
            @click="goToApplicationList"
            >ดูรายการคำขอ</v-btn
          >
          <v-btn
            color="hc-user"
            block
            @click="goToApplicationDetail"
            >ติดตามสถานะ</v-btn
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

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationType() {
  router.push({ name: "HCUserApplicationType" });
}

function goToApplicationList() {
  router.push({ name: "HCUserApplicationList" });
}

function goToApplicationDetail() {
  router.push({ name: "HCUserApplicationList" });
}

function prevStep() {
  currentStep.value--;
}

const currentStep = ref(0);
const submitting = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);
const newRequestNo = ref("");
const formRef = ref();

const steps = [
  { value: 0, title: "ข้อมูลผู้ส่งออก" },
  { value: 1, title: "โรงคัดบรรจุ & ปลายทาง" },
  { value: 2, title: "รายละเอียดสินค้า" },
  { value: 3, title: "เอกสารแนบ" },
  { value: 4, title: "ตรวจสอบ & ยืนยัน" },
];

const form = reactive({
  exporterName: "",
  exporterAddress: "",
  exporterProvince: "",
  exporterZip: "",
  exporterPhone: "",
  packingHouseCode: "",
  packingHouseName: "",
  packingHouseProvince: "",
  consigneeName: "",
  consigneeAddress: "",
  destination: "",
  products: [{ sampleNo: "", name: "", weight: "", gapCode: "" }],
  documents: {},
  confirmed: false,
});

const packingHouseOptions = [
  {
    code: "PH-CM-001",
    label: "PH-CM-001 — เชียงใหม่ฟาร์ม",
    name: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
    province: "เชียงใหม่",
  },
  {
    code: "PH-CM-002",
    label: "PH-CM-002 — ลำพูนเฟรช",
    name: "โรงคัดบรรจุลำพูนเฟรช",
    province: "ลำพูน",
  },
  {
    code: "PH-NP-001",
    label: "PH-NP-001 — ภาคเหนือ",
    name: "โรงคัดบรรจุภาคเหนือ",
    province: "น่าน",
  },
];
function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function fillPackingHouse(code) {
  const ph = packingHouseOptions.find((p) => p.code === code);
  if (ph) {
    form.packingHouseName = ph.name;
    form.packingHouseProvince = ph.province;
  }
}

const requiredDocs = [
  { key: "invoice", label: "ใบกำกับสินค้า (Invoice)", required: true },
  { key: "packing", label: "ใบบรรจุหีบห่อ (Packing List)", required: true },
  { key: "gap_cert", label: "ใบรับรองแหล่งผลิต (GAP)", required: true },
  { key: "ph_cert", label: "ใบรับรองโรงคัดบรรจุ", required: false },
  { key: "export_doc", label: "เอกสารการส่งออกอื่นๆ", required: false },
];

const provinces = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "เชียงราย",
  "ลำพูน",
  "น่าน",
  "ขอนแก่น",
  "นครราชสีมา",
  "สุราษฎร์ธานี",
  "สงขลา",
];
const countries = [
  "จีน",
  "ญี่ปุ่น",
  "เกาหลีใต้",
  "สิงคโปร์",
  "ฮ่องกง",
  "เวียดนาม",
  "มาเลเซีย",
  "สหรัฐอเมริกา",
  "สหภาพยุโรป",
];
const cropOptions = [
  "ทุเรียน",
  "ลำไย",
  "ลิ้นจี่",
  "มังคุด",
  "มะม่วง",
  "ส้มโอ",
  "กล้วยหอม",
  "กระเทียม",
  "ข้าว",
  "มันสำปะหลัง",
];

function addProduct() {
  form.products.push({ sampleNo: "", name: "", weight: "", gapCode: "" });
}
function removeProduct(idx) {
  form.products.splice(idx, 1);
}

const rules = {
  required: (v) =>
    !!v || (Array.isArray(v) && v.length > 0) || "กรุณากรอกข้อมูล",
};

function saveDraft() {
  draftSnackbar.value = true;
}

async function handleNext() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    return;
  }

  submitting.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  submitting.value = false;
  newRequestNo.value = `HC-2569-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`;
  successDialog.value = true;
}
</script>

<style scoped>
/* Doc Upload */
.doc-upload-box {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 8px;
}

/* Confirm */
.confirm-section {
  margin-bottom: 16px;
}
.confirm-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: rgba(var(--v-theme-on-surface), 0.45);
  margin-bottom: 8px;
}
.confirm-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.confirm-item {
  display: flex;
  flex-direction: column;
}
.confirm-item .label {
  font-size: 10px;
  color: rgba(var(--v-theme-on-surface), 0.45);
  font-weight: 600;
  text-transform: uppercase;
}
.confirm-item .value {
  font-size: 13px;
  font-weight: 500;
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-hc-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hc-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hc-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-hc-user)) !important;
}
</style>
