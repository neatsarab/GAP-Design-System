<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/el/user/applications')"
      />
      <div>
        <h1 class="text-h5 font-weight-bold mb-0">ยื่นคำขอ EL ใหม่</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          คำขอขึ้นทะเบียนโรงคัดบรรจุ (Establishment List)
        </p>
      </div>
    </div>

    <!-- Step Indicator -->
    <v-card rounded="xl" elevation="0" class="mb-6 step-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-0">
          <div
            v-for="(step, idx) in steps"
            :key="step"
            class="d-flex align-center flex-grow-1"
          >
            <div class="d-flex flex-column align-center">
              <div
                class="step-circle"
                :class="{
                  'step-circle--active': currentStep === idx,
                  'step-circle--done': currentStep > idx,
                }"
              >
                <v-icon
                  v-if="currentStep > idx"
                  icon="fas fa-check"
                  size="14"
                />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <span
                class="text-caption mt-1"
                :class="
                  currentStep >= idx
                    ? 'text-el-user font-weight-medium'
                    : 'text-medium-emphasis'
                "
              >
                {{ step }}
              </span>
            </div>
            <div
              v-if="idx < steps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > idx }"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- ─── STEP 1: ข้อมูลรายละเอียด ─── -->
    <template v-if="currentStep === 0">
      <!-- Section A: ข้อมูลโรงคัดบรรจุ -->
      <v-card rounded="xl" elevation="0" class="mb-5 section-card">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-warehouse"
            color="el-user"
            class="mr-2"
            size="18"
          />
          ก. ข้อมูลโรงคัดบรรจุ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">ชื่อโรงคัดบรรจุ <span class="field-label-en">Establishment Name</span> <span class="req">*</span></div>
              <v-text-field
                v-model="form.establishmentName"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">ที่อยู่ <span class="field-label-en">Address</span> <span class="req">*</span></div>
              <v-text-field
                v-model="form.address"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="field-label mb-1">จังหวัด <span class="field-label-en">Province</span> <span class="req">*</span></div>
              <v-text-field
                v-model="form.province"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="field-label mb-1">อำเภอ <span class="field-label-en">District</span></div>
              <v-text-field
                v-model="form.district"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="field-label mb-1">ตำบล <span class="field-label-en">Sub-district</span></div>
              <v-text-field
                v-model="form.subdistrict"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="field-label mb-1">รหัสไปรษณีย์ <span class="field-label-en">Postal Code</span></div>
              <v-text-field
                v-model="form.postalCode"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="field-label mb-1">โทรศัพท์ <span class="field-label-en">Phone Number</span></div>
              <v-text-field
                v-model="form.phone"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <div class="field-label mb-1">อีเมล <span class="field-label-en">Email</span></div>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">ชนิดพืชที่ดำเนินการ <span class="field-label-en">Crop Type</span> <span class="req">*</span></div>
              <v-text-field
                v-model="form.cropType"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">ระบบการจัดการคุณภาพ <span class="field-label-en">Quality System</span></div>
              <v-autocomplete
                v-model="form.qualitySystem"
                :items="qualitySystemOptions"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Section B: ข้อมูลเกษตรกร -->
      <v-card rounded="xl" elevation="0" class="mb-5 section-card">
        <v-card-title
          class="pa-5 pb-3 section-title d-flex align-center justify-space-between"
        >
          <div>
            <v-icon
              icon="fas fa-users"
              color="el-user"
              class="mr-2"
              size="18"
            />
            ข. ข้อมูลเกษตรกร
          </div>
          <v-btn
            color="el-user"
            variant="tonal"
            size="small"
            prepend-icon="fas fa-plus"
            rounded="lg"
            @click="addFarmer"
          >
            เพิ่มเกษตรกร
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div
            v-for="(farmer, idx) in farmers"
            :key="idx"
            class="farmer-row rounded-lg pa-4 mb-3"
          >
            <v-row dense align="center">
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">ประเภทเกษตรกร <span class="field-label-en">Farmer Type</span></div>
                <v-autocomplete
                  v-model="farmer.type"
                  :items="farmerTypeOptions"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">เลขบัตร/นิติบุคคล <span class="field-label-en">ID/Juristic No.</span></div>
                <v-text-field
                  v-model="farmer.idNo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="field-label mb-1">ชื่อ <span class="field-label-en">Full Name</span></div>
                <v-text-field
                  v-model="farmer.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">จังหวัด <span class="field-label-en">Province</span></div>
                <v-text-field
                  v-model="farmer.province"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">โทรศัพท์ <span class="field-label-en">Phone Number</span></div>
                <v-text-field
                  v-model="farmer.phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="1" class="d-flex justify-center">
                <v-btn
                  icon="fas fa-trash"
                  variant="text"
                  color="error"
                  size="small"
                  :disabled="farmers.length <= 1"
                  @click="removeFarmer(idx)"
                />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- Section C: ข้อมูลแปลงเกษตร -->
      <v-card rounded="xl" elevation="0" class="mb-5 section-card">
        <v-card-title
          class="pa-5 pb-3 section-title d-flex align-center justify-space-between"
        >
          <div>
            <v-icon
              icon="fas fa-seedling"
              color="el-user"
              class="mr-2"
              size="18"
            />
            ค. ข้อมูลแปลงเกษตร
          </div>
          <v-btn
            color="el-user"
            variant="tonal"
            size="small"
            prepend-icon="fas fa-plus"
            rounded="lg"
            @click="addFarm"
          >
            เพิ่มแปลง
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div
            v-for="(farm, idx) in farms"
            :key="idx"
            class="farmer-row rounded-lg pa-4 mb-3"
          >
            <v-row dense align="center">
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">ชื่อเกษตรกร <span class="field-label-en">Full Name</span></div>
                <v-text-field
                  v-model="farm.farmerName"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">ชนิดพืช <span class="field-label-en">Crop Type</span></div>
                <v-text-field
                  v-model="farm.cropType"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">รหัสใบรับรอง GAP <span class="field-label-en">GAP Cert No.</span></div>
                <v-text-field
                  v-model="farm.gapCertNo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="4" md="1">
                <div class="field-label mb-1">พื้นที่ (ไร่) <span class="field-label-en">Area</span></div>
                <v-text-field
                  v-model="farm.area"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  type="number"
                />
              </v-col>
              <v-col cols="12" sm="4" md="1">
                <div class="field-label mb-1">ผลผลิต (กก./ปี) <span class="field-label-en">Yield</span></div>
                <v-text-field
                  v-model="farm.yield"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  type="number"
                />
              </v-col>
              <v-col cols="12" sm="4" md="1">
                <div class="field-label mb-1">จังหวัด <span class="field-label-en">Province</span></div>
                <v-text-field
                  v-model="farm.province"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6" md="1">
                <div class="field-label mb-1">พิกัด X <span class="field-label-en">Coord X</span></div>
                <v-text-field
                  v-model="farm.coordX"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="5" md="1">
                <div class="field-label mb-1">พิกัด Y <span class="field-label-en">Coord Y</span></div>
                <v-text-field
                  v-model="farm.coordY"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="1" class="d-flex justify-center">
                <v-btn
                  icon="fas fa-trash"
                  variant="text"
                  color="error"
                  size="small"
                  :disabled="farms.length <= 1"
                  @click="removeFarm(idx)"
                />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- Section D: เอกสารมาตรฐาน -->
      <v-card rounded="xl" elevation="0" class="mb-5 section-card">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-certificate"
            color="el-user"
            class="mr-2"
            size="18"
          />
          ง. เอกสารมาตรฐาน (GMP/HACCP)
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row>
            <v-col cols="12" md="6">
              <v-card rounded="lg" variant="outlined" class="pa-4">
                <div class="text-body-2 font-weight-bold mb-3 text-el-user">
                  ใบรับรอง GMP
                </div>
                <v-row dense>
                  <v-col cols="12">
                    <div class="field-label mb-1">หมายเลขใบรับรอง <span class="field-label-en">Cert No.</span></div>
                    <v-text-field
                      v-model="form.gmpCertNo"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">วันที่ออก <span class="field-label-en">Issue Date</span></div>
                    <v-text-field
                      v-model="form.gmpIssuedDate"
                      type="date"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">วันหมดอายุ <span class="field-label-en">Expiry Date</span></div>
                    <v-text-field
                      v-model="form.gmpExpireDate"
                      type="date"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card rounded="lg" variant="outlined" class="pa-4">
                <div class="text-body-2 font-weight-bold mb-3 text-el-user">
                  ใบรับรอง HACCP
                </div>
                <v-row dense>
                  <v-col cols="12">
                    <div class="field-label mb-1">หมายเลขใบรับรอง <span class="field-label-en">Cert No.</span></div>
                    <v-text-field
                      v-model="form.haccpCertNo"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">วันที่ออก <span class="field-label-en">Issue Date</span></div>
                    <v-text-field
                      v-model="form.haccpIssuedDate"
                      type="date"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">วันหมดอายุ <span class="field-label-en">Expiry Date</span></div>
                    <v-text-field
                      v-model="form.haccpExpireDate"
                      type="date"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 1">
      <v-row>
        <v-col
          v-for="section in uploadSections"
          :key="section.title"
          cols="12"
          md="6"
        >
          <v-card rounded="xl" elevation="0" class="section-card h-100">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-folder-open"
                color="el-user"
                class="mr-2"
                size="18"
              />
              {{ section.title }}
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{ section.desc }}
              </p>
              <div
                v-for="file in section.files"
                :key="file"
                class="upload-area rounded-xl mb-3 d-flex flex-column align-center justify-center pa-4"
              >
                <v-icon
                  icon="fas fa-cloud-arrow-up"
                  color="el-user"
                  size="28"
                  class="mb-2"
                />
                <div class="text-body-2 font-weight-medium mb-1">
                  {{ file }}
                </div>
                <div class="text-caption text-medium-emphasis text-center">
                  คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  รองรับ PDF / JPG / PNG
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Navigation Buttons -->
    <v-card rounded="xl" elevation="0" class="mt-6 section-card">
      <v-card-text class="pa-4 d-flex justify-space-between align-center">
        <v-btn
          v-if="currentStep > 0"
          variant="tonal"
          color="grey"
          rounded="lg"
          prepend-icon="fas fa-arrow-left"
          @click="currentStep--"
        >
          ย้อนกลับ
        </v-btn>
        <v-btn
          v-else
          variant="text"
          color="grey"
          rounded="lg"
          @click="router.push('/el/user/applications')"
        >
          ยกเลิก
        </v-btn>

        <div class="d-flex ga-3">
          <v-btn
            variant="tonal"
            color="el-user"
            rounded="lg"
            prepend-icon="fas fa-floppy-disk"
            @click="saveDraft"
          >
            บันทึกแบบร่าง
          </v-btn>
          <v-btn
            v-if="currentStep < steps.length - 1"
            color="el-user"
            rounded="lg"
            append-icon="fas fa-arrow-right"
            @click="currentStep++"
          >
            ถัดไป
          </v-btn>
          <v-btn
            v-else
            color="el-user"
            rounded="lg"
            prepend-icon="fas fa-paper-plane"
            @click="submitApplication"
          >
            ยืนยันคำขอ
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h3>
          <p class="text-body-2 text-medium-emphasis mb-2">หมายเลขคำขอของคุณ</p>
          <v-chip color="el-user" size="large" variant="tonal" class="mb-4">
            EL-2568-00003
          </v-chip>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ส่งให้ด่านเกษตรตรวจสอบแล้ว<br />เจ้าหน้าที่จะดำเนินการและติดต่อกลับภายใน
            5 วันทำการ
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="el-user"
            rounded="lg"
            block
            @click="goToApplicationList"
          >
            ดูรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);
const successDialog = ref(false);

const steps = ["ข้อมูลรายละเอียด", "ไฟล์แนบ"];

const qualitySystemOptions = ["GMP", "HACCP", "GMP+HACCP"];
const farmerTypeOptions = [
  { label: "บุคคลธรรมดา", value: "individual" },
  { label: "นิติบุคคล", value: "juristic" },
  { label: "กลุ่มเกษตรกร", value: "group" },
];

interface Farmer {
  type: string;
  idNo: string;
  name: string;
  province: string;
  phone: string;
}

interface Farm {
  farmerName: string;
  cropType: string;
  gapCertNo: string;
  area: string;
  yield: string;
  province: string;
  coordX: string;
  coordY: string;
}

const form = reactive({
  establishmentName: "",
  address: "",
  province: "",
  district: "",
  subdistrict: "",
  postalCode: "",
  phone: "",
  email: "",
  cropType: "",
  qualitySystem: "",
  gmpCertNo: "",
  gmpIssuedDate: "",
  gmpExpireDate: "",
  haccpCertNo: "",
  haccpIssuedDate: "",
  haccpExpireDate: "",
});

const farmers = ref<Farmer[]>([
  { type: "individual", idNo: "", name: "", province: "", phone: "" },
]);

const farms = ref<Farm[]>([
  {
    farmerName: "",
    cropType: "",
    gapCertNo: "",
    area: "",
    yield: "",
    province: "",
    coordX: "",
    coordY: "",
  },
]);

function addFarmer() {
  farmers.value.push({
    type: "individual",
    idNo: "",
    name: "",
    province: "",
    phone: "",
  });
}
function removeFarmer(idx: number) {
  if (farmers.value.length > 1) farmers.value.splice(idx, 1);
}
function addFarm() {
  farms.value.push({
    farmerName: "",
    cropType: "",
    gapCertNo: "",
    area: "",
    yield: "",
    province: "",
    coordX: "",
    coordY: "",
  });
}
function removeFarm(idx: number) {
  if (farms.value.length > 1) farms.value.splice(idx, 1);
}

const uploadSections = [
  {
    title: "เอกสารแปลงเกษตร",
    desc: "เอกสารเกี่ยวกับแปลงเกษตรและสัญญาเกษตรกร",
    files: ["แผนที่แปลง", "สำเนาใบรับรอง GAP", "Farm Contract"],
  },
  {
    title: "แผนการควบคุมแปลง",
    desc: "แผนการตรวจติดตามและจัดการแปลงเกษตร",
    files: ["แผนตรวจติดตาม", "แผนจัดการสารเคมี", "แผนเก็บเกี่ยว"],
  },
  {
    title: "เอกสารความปลอดภัยอาหาร",
    desc: "เอกสารด้านความปลอดภัยและการตรวจสอบย้อนกลับ",
    files: ["ควบคุมสารตกค้าง", "ตรวจสอบย้อนกลับ"],
  },
  {
    title: "เอกสาร HACCP",
    desc: "เอกสารระบบวิเคราะห์อันตรายและจุดควบคุมวิกฤต",
    files: ["HACCP Team", "Flow Chart", "HACCP Plan", "CCP Validation"],
  },
  {
    title: "เอกสารอื่น ๆ",
    desc: "เอกสารเพิ่มเติมที่เกี่ยวข้อง",
    files: ["Vendor List (AVL)", "Mock Recall"],
  },
];

function saveDraft() {
  // mock save draft
}

function submitApplication() {
  successDialog.value = true;
}

function goToApplicationList() {
  successDialog.value = false;
  router.push("/el/user/applications");
}
</script>

<style scoped>
.field-label { font-size: 12px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.75); }
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
.req { color: rgb(var(--v-theme-error)); margin-left: 2px; }
.step-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.section-title {
  font-size: 14px !important;
  font-weight: 600;
}
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.45);
  background: transparent;
  flex-shrink: 0;
}
.step-circle--active {
  border-color: rgb(var(--v-theme-el-user));
  color: rgb(var(--v-theme-el-user));
  background: rgba(var(--v-theme-el-user), 0.08);
}
.step-circle--done {
  border-color: rgb(var(--v-theme-el-user));
  background: rgb(var(--v-theme-el-user));
  color: white;
}
.step-line {
  height: 2px;
  background: rgba(var(--v-border-color), var(--v-border-opacity));
  margin: 0 8px;
  margin-bottom: 20px;
  min-width: 24px;
}
.step-line--done {
  background: rgb(var(--v-theme-el-user));
}
.farmer-row {
  background: rgba(var(--v-theme-el-user), 0.03);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.upload-area {
  border: 2px dashed rgba(var(--v-theme-el-user), 0.35);
  background: rgba(var(--v-theme-el-user), 0.03);
  cursor: pointer;
  transition: background 0.15s;
  min-height: 100px;
}
.upload-area:hover {
  background: rgba(var(--v-theme-el-user), 0.07);
}
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
