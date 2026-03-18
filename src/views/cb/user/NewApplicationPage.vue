<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
      <div>
        <h1 class="text-h5 font-weight-bold mb-0">{{ pageTitle }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">กรอกข้อมูลให้ครบถ้วนแล้วยืนยันคำขอ</p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div class="d-flex flex-column align-center" style="min-width: 90px">
              <div class="step-circle mb-1" :class="{
                'step-done': currentStep > step.value,
                'step-active': currentStep === step.value,
              }">
                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="13" color="white" />
                <span v-else class="text-caption font-weight-bold">{{ step.value }}</span>
              </div>
              <div class="text-caption text-center" :class="currentStep >= step.value ? 'text-cb-user font-weight-bold' : 'text-medium-emphasis'">
                {{ step.title }}
              </div>
            </div>
            <div v-if="i < steps.length - 1" class="step-line flex-grow-1" :class="{ 'step-line--done': currentStep > step.value }" />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- ─── STEP 1: ข้อมูลรายละเอียด ─── -->
    <template v-if="currentStep === 1">

      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-user" color="cb-user" class="mr-2" size="18" />ข้อมูลผู้ยื่นคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">ชื่อ – นามสกุล <span class="field-label-en">Full Name</span> <span class="req">*</span></div>
              <v-text-field v-model="form.fullName" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">สัญชาติ <span class="field-label-en">Nationality</span></div>
              <v-autocomplete v-model="form.nationality" :items="nationalityOptions" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">เลขบัตรประชาชน <span class="field-label-en">ID Card No.</span> <span class="req">*</span></div>
              <v-text-field v-model="form.idCard" variant="outlined" density="compact" rounded="lg" maxlength="13" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">วันที่ออกบัตร <span class="field-label-en">Issue Date</span></div>
              <v-text-field v-model="form.idIssueDate" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">วันหมดอายุ <span class="field-label-en">Expiry Date</span></div>
              <v-text-field v-model="form.idExpireDate" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12"><div class="field-section-label mt-3 mb-1">ที่อยู่ผู้ยื่นคำขอ</div></v-col>
            <v-col cols="12" md="2">
              <div class="field-label">บ้านเลขที่ <span class="field-label-en">House No.</span> <span class="req">*</span></div>
              <v-text-field v-model="form.addr.houseNo" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="2">
              <div class="field-label">หมู่ <span class="field-label-en">Village No.</span></div>
              <v-text-field v-model="form.addr.moo" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">ตรอก / ซอย <span class="field-label-en">Lane / Alley</span></div>
              <v-text-field v-model="form.addr.alley" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">ถนน <span class="field-label-en">Road</span></div>
              <v-text-field v-model="form.addr.road" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">ตำบล / แขวง <span class="field-label-en">Sub-district</span> <span class="req">*</span></div>
              <v-text-field v-model="form.addr.subdistrict" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">อำเภอ / เขต <span class="field-label-en">District</span> <span class="req">*</span></div>
              <v-text-field v-model="form.addr.district" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">จังหวัด <span class="field-label-en">Province</span> <span class="req">*</span></div>
              <v-text-field v-model="form.addr.province" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">รหัสไปรษณีย์ <span class="field-label-en">Postal Code</span></div>
              <v-text-field v-model="form.addr.postcode" variant="outlined" density="compact" rounded="lg" maxlength="5" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">โทรศัพท์ <span class="field-label-en">Phone Number</span></div>
              <v-text-field v-model="form.phone" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">โทรสาร <span class="field-label-en">Fax</span></div>
              <v-text-field v-model="form.fax" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">E-mail <span class="field-label-en">Email</span></div>
              <v-text-field v-model="form.email" type="email" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- วัตถุประสงค์ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-bullseye" color="cb-user" class="mr-2" size="18" />วัตถุประสงค์ของการยื่นคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="form.purpose" color="cb-user">
            <v-radio value="register" label="ขอขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช" class="mb-2" />
            <v-radio value="expand" label="ขอขยายขอบข่ายการรับรอง" class="mb-2" />
            <v-radio value="renew" label="ขอต่ออายุการขึ้นทะเบียน" class="mb-2" />
            <v-radio value="change" label="ขอเปลี่ยนแปลงข้อมูล" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- ที่ตั้งสำนักงาน -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-location-dot" color="cb-user" class="mr-2" size="18" />ที่ตั้งสำนักงาน
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="2">
              <div class="field-label">บ้านเลขที่ <span class="field-label-en">House No.</span> <span class="req">*</span></div>
              <v-text-field v-model="form.office.houseNo" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="2">
              <div class="field-label">หมู่ <span class="field-label-en">Village No.</span></div>
              <v-text-field v-model="form.office.moo" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">ตรอก / ซอย <span class="field-label-en">Lane / Alley</span></div>
              <v-text-field v-model="form.office.alley" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">ถนน <span class="field-label-en">Road</span></div>
              <v-text-field v-model="form.office.road" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">ตำบล / แขวง <span class="field-label-en">Sub-district</span> <span class="req">*</span></div>
              <v-text-field v-model="form.office.subdistrict" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">อำเภอ / เขต <span class="field-label-en">District</span> <span class="req">*</span></div>
              <v-text-field v-model="form.office.district" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">จังหวัด <span class="field-label-en">Province</span> <span class="req">*</span></div>
              <v-text-field v-model="form.office.province" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">รหัสไปรษณีย์ <span class="field-label-en">Postal Code</span></div>
              <v-text-field v-model="form.office.postcode" variant="outlined" density="compact" rounded="lg" maxlength="5" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">โทรศัพท์ <span class="field-label-en">Phone Number</span></div>
              <v-text-field v-model="form.office.phone" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">โทรสาร <span class="field-label-en">Fax</span></div>
              <v-text-field v-model="form.office.fax" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- มาตรฐาน -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-certificate" color="cb-user" class="mr-2" size="18" />มาตรฐานและหลักปฏิบัติที่ใช้ในการตรวจประเมิน
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col v-for="std in standardOptions" :key="std.value" cols="12">
              <v-checkbox
                v-model="form.standards"
                :value="std.value"
                :label="std.label"
                color="cb-user"
                density="compact"
                hide-details
                class="mb-1"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Buttons -->
      <div class="d-flex justify-space-between align-center">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="router.back()">ย้อนกลับ</v-btn>
        <div class="d-flex ga-2">
          <v-btn variant="tonal" color="cb-user" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="saveDraft">แบบร่าง</v-btn>
          <v-btn color="cb-user" rounded="lg" append-icon="fas fa-arrow-right" @click="currentStep = 2">ถัดไป</v-btn>
        </div>
      </div>
    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 2">

      <!-- เอกสารหลัก -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-file-lines" color="cb-user" class="mr-2" size="18" />เอกสารหลัก
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div v-for="doc in docMain" :key="doc.key" class="upload-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
            <div class="text-body-2 font-weight-medium">{{ doc.label }}</div>
            <div class="d-flex align-center ga-2">
              <v-chip v-if="files[doc.key]" color="success" size="x-small" variant="tonal" prepend-icon="fas fa-check">{{ files[doc.key] }}</v-chip>
              <v-btn :color="files[doc.key] ? 'success' : 'cb-user'" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-upload" @click="mockUpload(doc.key)">
                {{ files[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- กรณีมอบอำนาจ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-file-signature" color="cb-user" class="mr-2" size="18" />กรณีมอบอำนาจ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div v-for="doc in docPOA" :key="doc.key" class="upload-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
            <div>
              <div class="text-body-2 font-weight-medium">{{ doc.label }}</div>
              <div v-if="doc.note" class="text-caption text-medium-emphasis mt-1">{{ doc.note }}</div>
            </div>
            <div class="d-flex align-center ga-2">
              <v-chip v-if="files[doc.key]" color="success" size="x-small" variant="tonal" prepend-icon="fas fa-check">{{ files[doc.key] }}</v-chip>
              <v-btn :color="files[doc.key] ? 'success' : 'cb-user'" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-upload" @click="mockUpload(doc.key)">
                {{ files[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- เอกสารเพิ่มเติม -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-paperclip" color="cb-user" class="mr-2" size="18" />เอกสารเพิ่มเติม
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-alert variant="tonal" color="warning" rounded="lg" density="compact" class="mb-4" prepend-icon="fas fa-triangle-exclamation">
            สำเนาเอกสารต้องรับรองสำเนาถูกต้องโดยผู้มีอำนาจลงนาม
          </v-alert>
          <div v-for="doc in docExtra" :key="doc.key" class="upload-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
            <div class="text-body-2 font-weight-medium">{{ doc.label }}</div>
            <div class="d-flex align-center ga-2">
              <v-chip v-if="files[doc.key]" color="success" size="x-small" variant="tonal" prepend-icon="fas fa-check">{{ files[doc.key] }}</v-chip>
              <v-btn :color="files[doc.key] ? 'success' : 'cb-user'" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-upload" @click="mockUpload(doc.key)">
                {{ files[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Buttons -->
      <div class="d-flex justify-space-between align-center">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="currentStep = 1">ย้อนกลับ</v-btn>
        <div class="d-flex ga-2">
          <v-btn variant="tonal" color="cb-user" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="saveDraft">แบบร่าง</v-btn>
          <v-btn color="cb-user" rounded="lg" prepend-icon="fas fa-paper-plane" @click="confirmDialog = true">ยืนยันคำขอ</v-btn>
        </div>
      </div>
    </template>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="cb-user" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการยื่นคำขอ</h3>
          <p class="text-body-2 text-medium-emphasis">ตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="confirmDialog = false">ยกเลิก</v-btn>
          <v-btn color="cb-user" rounded="lg" block @click="submitApplication">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">ระบบได้รับคำขอของท่านแล้ว เจ้าหน้าที่จะตรวจสอบและติดต่อกลับ</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="cb-user" rounded="lg" block @click="router.push('/cb/user/applications')">ดูรายการคำขอ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Draft Snackbar -->
    <v-snackbar v-model="draftSnackbar" color="success" rounded="lg" timeout="2500" location="bottom right">
      <v-icon icon="fas fa-floppy-disk" class="mr-2" />บันทึกแบบร่างแล้ว
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const typeTitles: Record<string, string> = {
  register: "คำขอขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (CB)",
  renew: "คำขอต่ออายุทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (CB)",
  scope: "คำขอเพิ่ม / ลดขอบข่าย",
  other: "คำขออื่น ๆ",
};
const pageTitle = computed(() => typeTitles[route.params.type as string] ?? "ยื่นคำขอ CB");

const currentStep = ref(1);
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
  { value: 1, title: "ข้อมูลรายละเอียด" },
  { value: 2, title: "ไฟล์แนบ" },
];

const addrTemplate = () => ({ houseNo: "", moo: "", alley: "", road: "", subdistrict: "", district: "", province: "", postcode: "" });

const form = reactive({
  fullName: "",
  nationality: "ไทย",
  idCard: "",
  idIssueDate: "",
  idExpireDate: "",
  addr: addrTemplate(),
  phone: "",
  fax: "",
  email: "",
  purpose: "register",
  office: { ...addrTemplate(), phone: "", fax: "" },
  standards: [] as string[],
});

const nationalityOptions = ["ไทย", "ต่างชาติ"];

const standardOptions = [
  { value: "gmp_general", label: "หลักการทั่วไปเกี่ยวกับสุขลักษณะอาหาร (GMP ทั่วไป)" },
  { value: "haccp", label: "ระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม (HACCP)" },
  { value: "gmp_factory", label: "การปฏิบัติที่ดีสำหรับโรงงานบรรจุและผลิต" },
  { value: "gmp_packing", label: "การปฏิบัติที่ดีสำหรับการคัดบรรจุ" },
  { value: "other_std", label: "มาตรฐานอื่น ๆ ที่กรมวิชาการเกษตรกำหนด" },
];

const files = reactive<Record<string, string>>({});
function mockUpload(key: string) { files[key] = "เอกสาร.pdf"; }

const docMain = [
  { key: "juristic_cert", label: "1. สำเนาหนังสือรับรองการจดทะเบียนนิติบุคคล" },
  { key: "company_cert", label: "2. สำเนาหนังสือรับรองบริษัท / ห้างหุ้นส่วน" },
  { key: "trade_reg", label: "3. สำเนาทะเบียนการค้า" },
];

const docPOA = [
  { key: "poa_letter", label: "หนังสือมอบอำนาจ", note: "ติดอากรแสตมป์ 30 บาท" },
  { key: "poa_grantor_id", label: "สำเนาบัตรประชาชนผู้มอบอำนาจ", note: "" },
  { key: "poa_grantee_id", label: "สำเนาบัตรประชาชนผู้รับมอบอำนาจ", note: "" },
];

const docExtra = [
  { key: "office_map", label: "4. แผนผังสำนักงานและสาขาในประเทศไทย" },
  { key: "accred_cert", label: "5. ใบรับรองระบบงาน (Accreditation Certificate) จากหน่วยงานที่เกี่ยวข้อง" },
  { key: "license", label: "6. หลักฐานการได้รับอนุญาตเป็นผู้ประกอบการตรวจสอบมาตรฐาน" },
  { key: "auditor_list", label: "7. รายชื่อผู้ตรวจประเมิน" },
  { key: "branch_addr", label: "8. ที่อยู่สำนักงานใหญ่และสาขาในประเทศไทย" },
];

function saveDraft() { draftSnackbar.value = true; }
function submitApplication() { confirmDialog.value = false; successDialog.value = true; }
</script>

<style scoped>
.section-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.section-title { font-size: 14px !important; font-weight: 600; }
.field-section-label { font-size: 12px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.55); text-transform: uppercase; letter-spacing: 0.5px; }
.field-label { font-size: 13px; font-weight: 500; color: rgba(var(--v-theme-on-surface), 0.75); margin-bottom: 4px; }
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
.req { color: rgb(var(--v-theme-error)); }
.step-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity)); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: rgba(var(--v-theme-on-surface), 0.45); flex-shrink: 0; }
.step-active { border-color: rgb(var(--v-theme-cb-user)); color: rgb(var(--v-theme-cb-user)); background: rgba(var(--v-theme-cb-user), 0.08); }
.step-done { border-color: rgb(var(--v-theme-cb-user)); background: rgb(var(--v-theme-cb-user)); color: white; }
.step-line { height: 2px; background: rgba(var(--v-border-color), var(--v-border-opacity)); margin: 0 8px; margin-bottom: 22px; min-width: 20px; }
.step-line--done { background: rgb(var(--v-theme-cb-user)); }
.upload-row { background: rgba(var(--v-theme-cb-user), 0.03); border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.confirm-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(var(--v-theme-cb-user), 0.1); display: flex; align-items: center; justify-content: center; }
.success-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(var(--v-theme-success), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
