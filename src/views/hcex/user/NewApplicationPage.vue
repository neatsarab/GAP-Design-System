<template>
  <div>
    <div class="d-flex align-center ga-3 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">
          ยื่นคำขอใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืช
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          กรอกข้อมูลตามขั้นตอนให้ครบถ้วน
        </p>
      </div>
    </div>

    <!-- Step 0: เลือกประเภทคำขอ -->
    <div v-if="!selectedType" class="mb-6">
      <div class="text-body-1 font-weight-bold mb-4">เลือกประเภทคำขอ</div>
      <v-row>
        <v-col
          v-for="t in certTypes"
          :key="t.value"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="type-card h-100"
            @click="selectedType = t.value"
          >
            <div class="type-accent bg-warning" />
            <v-card-text class="pa-5 text-center">
              <div
                class="type-icon mx-auto mb-3"
                style="background: rgba(var(--v-theme-warning), 0.1)"
              >
                <v-icon :icon="t.icon" color="warning" size="28" />
              </div>
              <h3 class="text-body-1 font-weight-bold mb-2">{{ t.label }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-3">
                {{ t.desc }}
              </p>
              <v-btn color="warning" block size="small">เลือก</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Form Steps -->
    <template v-else>
      <!-- Step Indicator -->
      <v-card class="mb-5 pa-4">
        <div class="step-bar">
          <div
            v-for="(step, idx) in formSteps"
            :key="step.key"
            class="step-item"
            :class="{
              'step-item--done': currentStep > idx,
              'step-item--active': currentStep === idx,
              'step-item--pending': currentStep < idx,
            }"
          >
            <div class="step-dot">
              <v-icon v-if="currentStep > idx" icon="fas fa-check" size="11" />
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span class="step-label text-caption">{{ step.label }}</span>
            <div v-if="idx < formSteps.length - 1" class="step-line" />
          </div>
        </div>
      </v-card>

      <v-form ref="formRef" @submit.prevent="handleNext">
        <!-- Step 1: ข้อมูลรายละเอียด -->
        <div v-if="currentStep === 0">
          <!-- ผู้ส่งออก -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-building" color="warning" size="16" />
              ผู้ส่งออก (Exporter)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    ชื่อบริษัท <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.exporterName"
                    placeholder="ชื่อบริษัทผู้ส่งออก"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    ที่อยู่ <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.exporterAddress"
                    placeholder="ที่อยู่บริษัท"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    ประเทศ <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.exporterCountry"
                    placeholder="ประเทศ"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ผู้รับสินค้า -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-user-tie" color="warning" size="16" />
              ผู้รับสินค้า (Consignee)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    ชื่อผู้รับสินค้า <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.consigneeName"
                    placeholder="Consignee name"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    ที่อยู่ <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.consigneeAddress"
                    placeholder="Consignee address"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    ประเทศปลายทาง <span class="req">*</span>
                  </div>
                  <v-autocomplete
                    v-model="form.destination"
                    :items="countries"
                    placeholder="เลือกประเทศ"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ข้อมูลการขนส่ง -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-ship" color="warning" size="16" />
              ข้อมูลการขนส่ง
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    วันที่ส่งสินค้า <span class="req">*</span>
                  </div>
                  <v-text-field
                    v-model="form.shipDate"
                    type="date"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    วิธีการขนส่ง <span class="req">*</span>
                  </div>
                  <v-select
                    v-model="form.shipMethod"
                    :items="shipMethods"
                    placeholder="เลือกวิธีการขนส่ง"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">ท่าเรือ/สนามบินต้นทาง</div>
                  <v-text-field
                    v-model="form.portOfLoading"
                    placeholder="เช่น ท่าเรือแหลมฉบัง"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- รายละเอียดสินค้า -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center ga-2">
                <v-icon icon="fas fa-box" color="warning" size="16" />
                รายละเอียดสินค้า
              </div>
              <v-btn
                color="warning"
                size="small"
                variant="tonal"
                prepend-icon="fas fa-plus"
                @click="addProduct"
              >
                เพิ่มรายการ
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-table density="comfortable">
                <thead>
                  <tr>
                    <th>Shipping Mark</th>
                    <th>Description of Goods <span class="req">*</span></th>
                    <th style="width: 120px">Quantity <span class="req">*</span></th>
                    <th style="width: 130px">Net Weight (kg)</th>
                    <th style="width: 130px">Total Amount</th>
                    <th style="width: 50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, idx) in form.products" :key="idx">
                    <td class="py-2">
                      <v-text-field
                        v-model="p.shippingMark"
                        density="compact"
                        hide-details
                        placeholder="Mark"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.description"
                        density="compact"
                        hide-details
                        placeholder="ชื่อสินค้า"
                        :rules="[rules.required]"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.quantity"
                        density="compact"
                        hide-details
                        placeholder="100 CTN"
                        :rules="[rules.required]"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.netWeight"
                        density="compact"
                        hide-details
                        placeholder="1,000"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.totalAmount"
                        density="compact"
                        hide-details
                        placeholder="USD 5,000"
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
        </div>

        <!-- Step 2: เลือกผล Lab -->
        <div v-if="currentStep === 1">
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-flask-vial" color="warning" size="16" />
              เลือกผล Lab ที่ผ่านการพิจารณาแล้ว
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <p class="text-body-2 text-medium-emphasis mb-4">
                เลือกผลการทดสอบ Lab ที่เกี่ยวข้องกับคำขอนี้ (สามารถเลือกได้หลายรายการ)
              </p>
              <v-table hover>
                <thead>
                  <tr>
                    <th style="width: 50px"></th>
                    <th>เลขที่ผล Lab</th>
                    <th>ชนิดสินค้า</th>
                    <th>วันที่ทดสอบ</th>
                    <th>ผลการทดสอบ</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="lab in labResults"
                    :key="lab.id"
                    :class="{ 'selected-row': selectedLabs.includes(lab.id) }"
                    style="cursor: pointer"
                    @click="toggleLab(lab.id)"
                  >
                    <td>
                      <v-checkbox
                        :model-value="selectedLabs.includes(lab.id)"
                        color="warning"
                        hide-details
                        density="compact"
                        @click.stop="toggleLab(lab.id)"
                      />
                    </td>
                    <td class="text-body-2 font-weight-medium text-warning">{{ lab.labNo }}</td>
                    <td>{{ lab.productType }}</td>
                    <td>{{ lab.testDate }}</td>
                    <td>
                      <v-chip size="x-small" color="success" variant="tonal">
                        <v-icon start icon="fas fa-circle-check" size="10" />
                        {{ lab.result }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip size="x-small" color="warning" variant="tonal">ผ่านการพิจารณา</v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <div v-if="selectedLabs.length === 0" class="mt-3">
                <v-alert color="warning" variant="tonal" density="compact" prepend-icon="fas fa-triangle-exclamation">
                  กรุณาเลือกผล Lab อย่างน้อย 1 รายการ
                </v-alert>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Nav Buttons -->
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
            v-if="currentStep === 0"
            variant="tonal"
            color="grey"
            size="large"
            @click="selectedType = null"
          >
            เปลี่ยนประเภท
          </v-btn>
          <v-spacer />
          <v-btn
            variant="tonal"
            color="secondary"
            size="large"
            prepend-icon="fas fa-floppy-disk"
          >
            บันทึกแบบร่าง
          </v-btn>
          <v-btn
            v-if="currentStep < formSteps.length - 1"
            color="warning"
            size="large"
            append-icon="fas fa-chevron-right"
            type="submit"
          >
            ถัดไป
          </v-btn>
          <v-btn
            v-else
            color="warning"
            size="large"
            prepend-icon="fas fa-paper-plane"
            :loading="submitting"
            :disabled="selectedLabs.length === 0"
            @click="handleSubmit"
          >
            ยืนยันคำขอ
          </v-btn>
        </div>
      </v-form>
    </template>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" size="40" color="success" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h3>
          <p class="text-body-2 font-weight-bold text-warning mb-1">
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
            rounded="lg"
            block
            @click="router.push('/hcex/user/applications')"
            >ดูรายการคำขอ</v-btn
          >
          <v-btn
            color="warning"
            rounded="lg"
            block
            @click="router.push('/hcex/user/applications')"
            >ติดตามสถานะ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const selectedType = ref<string | null>(null);
const currentStep = ref(0);
const submitting = ref(false);
const successDialog = ref(false);
const newRequestNo = ref("");
const formRef = ref();
const selectedLabs = ref<string[]>([]);

const certTypes = [
  {
    value: "kmp1",
    label: "กมพ.1",
    desc: "ใบรับรองสุขอนามัยสำหรับสินค้าแปรรูปด้านพืชทั่วไป",
    icon: "fas fa-file-certificate",
  },
  {
    value: "kmp1-1",
    label: "กมพ.1-1",
    desc: "ใบรับรองสุขอนามัยสำหรับผลิตภัณฑ์แป้งและธัญพืชแปรรูป",
    icon: "fas fa-wheat-awn",
  },
  {
    value: "kmp1-2",
    label: "กมพ.1-2",
    desc: "ใบรับรองสำหรับผลิตภัณฑ์ผักและผลไม้แปรรูป",
    icon: "fas fa-jar",
  },
  {
    value: "kmp1-3",
    label: "กมพ.1-3",
    desc: "ใบรับรองสำหรับเครื่องเทศและสมุนไพรแปรรูป",
    icon: "fas fa-mortar-pestle",
  },
  {
    value: "correction",
    label: "แก้ไขใบรับรอง",
    desc: "ยื่นคำขอแก้ไขข้อมูลในใบรับรองที่ออกแล้ว",
    icon: "fas fa-file-pen",
  },
];

const formSteps = [
  { key: "details", label: "ข้อมูลรายละเอียด" },
  { key: "lab", label: "เลือกผล Lab" },
];

const form = reactive({
  exporterName: "",
  exporterAddress: "",
  exporterCountry: "ไทย",
  consigneeName: "",
  consigneeAddress: "",
  destination: "",
  shipDate: "",
  shipMethod: "",
  portOfLoading: "",
  products: [
    { shippingMark: "", description: "", quantity: "", netWeight: "", totalAmount: "" },
  ],
});

const shipMethods = ["ทางเรือ", "ทางอากาศ", "ทางบก"];

const countries = [
  "จีน", "ญี่ปุ่น", "เกาหลีใต้", "สิงคโปร์", "ฮ่องกง",
  "เวียดนาม", "มาเลเซีย", "สหรัฐอเมริกา", "สหภาพยุโรป", "ออสเตรเลีย",
];

const labResults = [
  {
    id: "LAB-001",
    labNo: "LAB-2568-00089",
    productType: "มันฝรั่งทอดกรอบ",
    testDate: "5 ม.ค. 68",
    result: "ผ่าน",
  },
  {
    id: "LAB-002",
    labNo: "LAB-2568-00085",
    productType: "ข้าวกล้องบรรจุถุง",
    testDate: "3 ม.ค. 68",
    result: "ผ่าน",
  },
  {
    id: "LAB-003",
    labNo: "LAB-2568-00080",
    productType: "แป้งมันสำปะหลัง",
    testDate: "28 ธ.ค. 67",
    result: "ผ่าน",
  },
  {
    id: "LAB-004",
    labNo: "LAB-2568-00076",
    productType: "พริกแห้งบด",
    testDate: "20 ธ.ค. 67",
    result: "ผ่าน",
  },
];

function addProduct() {
  form.products.push({
    shippingMark: "",
    description: "",
    quantity: "",
    netWeight: "",
    totalAmount: "",
  });
}
function removeProduct(idx: number) {
  form.products.splice(idx, 1);
}
function toggleLab(id: string) {
  const idx = selectedLabs.value.indexOf(id);
  if (idx === -1) {
    selectedLabs.value.push(id);
  } else {
    selectedLabs.value.splice(idx, 1);
  }
}

const rules = {
  required: (v: unknown) =>
    !!v || (Array.isArray(v) && v.length > 0) || "กรุณากรอกข้อมูล",
};

async function handleNext() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  if (currentStep.value < formSteps.length - 1) {
    currentStep.value++;
  }
}

async function handleSubmit() {
  if (selectedLabs.value.length === 0) return;
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  submitting.value = false;
  newRequestNo.value = `HCEX-2568-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`;
  successDialog.value = true;
}
</script>

<style scoped>
/* Step Bar */
.step-bar {
  display: flex;
  align-items: flex-start;
  overflow-x: auto;
}
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  min-width: 70px;
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
  z-index: 1;
  flex-shrink: 0;
}
.step-item--done .step-dot {
  background: rgb(var(--v-theme-success));
  color: white;
}
.step-item--active .step-dot {
  background: rgb(var(--v-theme-warning));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-warning), 0.2);
}
.step-item--pending .step-dot {
  background: rgba(var(--v-theme-on-surface), 0.1);
  color: rgba(var(--v-theme-on-surface), 0.4);
}
.step-label {
  margin-top: 6px;
  font-size: 10px;
  text-align: center;
  color: rgba(var(--v-theme-on-surface), 0.6);
  line-height: 1.3;
}
.step-item--active .step-label {
  color: rgb(var(--v-theme-warning));
  font-weight: 600;
}
.step-item--done .step-label {
  color: rgb(var(--v-theme-success));
}
.step-line {
  position: absolute;
  top: 14px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  z-index: 0;
}
.step-item--done .step-line {
  background: rgba(var(--v-theme-success), 0.4);
}

/* Type Card */
.type-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.1) !important;
}
.type-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}
.type-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fields */
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 6px;
}
.req {
  color: rgb(var(--v-theme-error));
}

/* Selected row */
.selected-row {
  background: rgba(var(--v-theme-warning), 0.06);
}

/* Success */
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
