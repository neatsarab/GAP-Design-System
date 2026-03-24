<template>
  <div style="--v-theme-primary: var(--v-theme-el-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอ EL ใหม่</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          คำขอขึ้นทะเบียนโรงคัดบรรจุ (Establishment List)
        </p>
      </div>
    </div>

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
                    ? 'text-el-user font-weight-bold'
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
          ข้อมูลโรงคัดบรรจุ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="field-section-label mb-3">ที่ตั้งสถานประกอบการ</div>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">
                <div>ชื่อโรงคัดบรรจุ <span class="req">*</span></div>
                <div class="field-label-en">Establishment Name</div>
              </div>
              <v-text-field
                v-model="form.establishmentName"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">
                <div>ที่อยู่ <span class="req">*</span></div>
                <div class="field-label-en">Address</div>
              </div>
              <v-text-field
                v-model="form.address"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="field-label mb-1">
                <div>จังหวัด <span class="req">*</span></div>
                <div class="field-label-en">Province</div>
              </div>
              <v-text-field
                v-model="form.province"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="field-label mb-1">
                <div>อำเภอ</div>
                <div class="field-label-en">District</div>
              </div>
              <v-text-field
                v-model="form.district"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="field-label mb-1">
                <div>ตำบล</div>
                <div class="field-label-en">Sub-district</div>
              </div>
              <v-text-field
                v-model="form.subdistrict"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="field-label mb-1">
                <div>รหัสไปรษณีย์</div>
                <div class="field-label-en">Postal Code</div>
              </div>
              <v-text-field
                v-model="form.postalCode"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-3 mb-2">ข้อมูลการติดต่อ</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="field-label mb-1">
                <div>โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                v-model="form.phone"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <div class="field-label mb-1">
                <div>อีเมล</div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-3 mb-2">การดำเนินงาน</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">
                <div>ชนิดพืชที่ดำเนินการ <span class="req">*</span></div>
                <div class="field-label-en">Crop Type</div>
              </div>
              <v-text-field
                v-model="form.cropType"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label mb-1">
                <div>ระบบการจัดการคุณภาพ</div>
                <div class="field-label-en">Quality System</div>
              </div>
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
            ข้อมูลเกษตรกร
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
            class="item-row rounded-lg pa-4 mb-3"
          >
            <v-row dense align="center">
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">
                  <div>ประเภทเกษตรกร</div>
                  <div class="field-label-en">Farmer Type</div>
                </div>
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
                <div class="field-label mb-1">
                  <div>เลขบัตร/นิติบุคคล</div>
                  <div class="field-label-en">ID/Juristic No.</div>
                </div>
                <v-text-field
                  v-model="farmer.idNo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="field-label mb-1">
                  <div>ชื่อ</div>
                  <div class="field-label-en">Full Name</div>
                </div>
                <v-text-field
                  v-model="farmer.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">
                  <div>จังหวัด</div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-text-field
                  v-model="farmer.province"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">
                  <div>โทรศัพท์</div>
                  <div class="field-label-en">Phone Number</div>
                </div>
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
            ข้อมูลแปลงเกษตร
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
            class="item-row rounded-lg pa-4 mb-3"
          >
            <v-row dense align="center">
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">
                  <div>ชื่อเกษตรกร</div>
                  <div class="field-label-en">Full Name</div>
                </div>
                <v-text-field
                  v-model="farm.farmerName"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">
                  <div>ชนิดพืช</div>
                  <div class="field-label-en">Crop Type</div>
                </div>
                <v-text-field
                  v-model="farm.cropType"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <div class="field-label mb-1">
                  <div>รหัสใบรับรอง GAP</div>
                  <div class="field-label-en">GAP Cert No.</div>
                </div>
                <v-text-field
                  v-model="farm.gapCertNo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="4" md="1">
                <div class="field-label mb-1">
                  <div>พื้นที่ (ไร่)</div>
                  <div class="field-label-en">Area</div>
                </div>
                <v-text-field
                  v-model="farm.area"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  type="number"
                />
              </v-col>
              <v-col cols="12" sm="4" md="1">
                <div class="field-label mb-1">
                  <div>ผลผลิต (กก./ปี)</div>
                  <div class="field-label-en">Yield</div>
                </div>
                <v-text-field
                  v-model="farm.yield"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  type="number"
                />
              </v-col>
              <v-col cols="12" sm="4" md="1">
                <div class="field-label mb-1">
                  <div>จังหวัด</div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-text-field
                  v-model="farm.province"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6" md="1">
                <div class="field-label mb-1">
                  <div>พิกัด X</div>
                  <div class="field-label-en">Coord X</div>
                </div>
                <v-text-field
                  v-model="farm.coordX"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="5" md="1">
                <div class="field-label mb-1">
                  <div>พิกัด Y</div>
                  <div class="field-label-en">Coord Y</div>
                </div>
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
          เอกสารมาตรฐาน (GMP/HACCP)
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
                    <div class="field-label mb-1">
                      <div>หมายเลขใบรับรอง</div>
                      <div class="field-label-en">Cert No.</div>
                    </div>
                    <v-text-field
                      v-model="form.gmpCertNo"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">
                      <div>วันที่ออก</div>
                      <div class="field-label-en">Issue Date</div>
                    </div>
                    <v-text-field
                      v-model="form.gmpIssuedDate"
                      type="date"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">
                      <div>วันหมดอายุ</div>
                      <div class="field-label-en">Expiry Date</div>
                    </div>
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
                    <div class="field-label mb-1">
                      <div>หมายเลขใบรับรอง</div>
                      <div class="field-label-en">Cert No.</div>
                    </div>
                    <v-text-field
                      v-model="form.haccpCertNo"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">
                      <div>วันที่ออก</div>
                      <div class="field-label-en">Issue Date</div>
                    </div>
                    <v-text-field
                      v-model="form.haccpIssuedDate"
                      type="date"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="6">
                    <div class="field-label mb-1">
                      <div>วันหมดอายุ</div>
                      <div class="field-label-en">Expiry Date</div>
                    </div>
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
          @click="prevStep"
        >
          ย้อนกลับ
        </v-btn>
        <v-btn
          v-else
          variant="text"
          color="grey"
          rounded="lg"
          @click="goToApplicationList"
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
            @click="nextStep"
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
            EL-2569-00003
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
const currentStep = ref(0);
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "ไฟล์แนบ" },
];

const qualitySystemOptions = ["GMP", "HACCP", "GMP+HACCP"];
const farmerTypeOptions = [
  { label: "บุคคลธรรมดา", value: "individual" },
  { label: "นิติบุคคล", value: "juristic" },
  { label: "กลุ่มเกษตรกร", value: "group" },
];

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

const farmers = ref([
  { type: "individual", idNo: "", name: "", province: "", phone: "" },
]);

const farms = ref([
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

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function addFarmer() {
  farmers.value.push({
    type: "individual",
    idNo: "",
    name: "",
    province: "",
    phone: "",
  });
}
function removeFarmer(idx) {
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
function removeFarm(idx) {
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
  draftSnackbar.value = true;
}

function submitApplication() {
  successDialog.value = true;
}

function goToApplicationList() {
  successDialog.value = false;
  router.push({ name: "ELUserApplicationList" });
}

function prevStep() {
  currentStep.value--;
}

function nextStep() {
  currentStep.value++;
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed rgba(var(--v-theme-primary), 0.35);
  background: rgba(var(--v-theme-primary), 0.03);
  cursor: pointer;
  transition: background 0.15s;
  min-height: 100px;
}
.upload-area:hover {
  background: rgba(var(--v-theme-primary), 0.07);
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-el-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-el-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-el-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-el-user)) !important;
}
</style>
