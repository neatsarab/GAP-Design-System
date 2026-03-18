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
        <div class="step-bar">
          <div v-for="(step, i) in steps" :key="step.value" class="d-flex align-center" :class="{ 'flex-grow-1': i < steps.length - 1 }">
            <div class="step-node" :class="stepClass(step.value)">
              <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="12" />
              <span v-else class="step-num">{{ step.value }}</span>
            </div>
            <div class="step-label-col">
              <div class="step-label" :class="{ 'step-label--active': currentStep === step.value }">{{ step.title }}</div>
            </div>
            <div v-if="i < steps.length - 1" class="step-line" :class="{ 'step-line--done': currentStep > step.value }" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- ─── STEP 1: ข้อมูลรายละเอียด ─── -->
    <template v-if="currentStep === 1">

      <!-- ประเภทคำขอ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-list-check" color="export-user" class="mr-2" size="18" />
          ประเภทคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="form.requestType" color="export-user" inline>
            <v-radio value="register" label="ขอขึ้นทะเบียน" class="mr-8" />
            <v-radio value="renew" label="ขอต่ออายุ" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-user" color="export-user" class="mr-2" size="18" />
          ข้อมูลผู้ยื่นคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">ชื่อ-นามสกุล (ภาษาไทย) <span class="field-label-en">Full Name (Thai)</span> <span class="req">*</span></div>
              <v-text-field v-model="form.applicantNameTh" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">Name-Surname (English) <span class="field-label-en">Full Name (English)</span> <span class="req">*</span></div>
              <v-text-field v-model="form.applicantNameEn" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12">
              <div class="field-label">ที่อยู่ <span class="field-label-en">Address</span> <span class="req">*</span></div>
              <v-textarea v-model="form.applicantAddress" variant="outlined" density="compact" rounded="lg" hide-details rows="2" />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">เบอร์โทรศัพท์ <span class="field-label-en">Phone Number</span></div>
              <v-text-field v-model="form.applicantPhone" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">Email <span class="field-label-en">Email</span></div>
              <v-text-field v-model="form.applicantEmail" type="email" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">สถานะผู้ยื่น <span class="field-label-en">Applicant Type</span></div>
              <v-autocomplete
                v-model="form.submitterStatus"
                :items="['เจ้าของ', 'ตัวแทน']"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- วัตถุประสงค์ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-bullseye" color="export-user" class="mr-2" size="18" />
          วัตถุประสงค์
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="form.objective" color="export-user">
            <v-radio value="register" label="ขึ้นทะเบียน" class="mb-2" />
            <v-radio value="renew" label="ต่ออายุทะเบียน" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- ประเทศปลายทาง -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-earth-asia" color="export-user" class="mr-2" size="18" />
          ประเทศปลายทาง
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="field-label mb-2">เลือกประเทศปลายทาง (เลือกได้หลายประเทศ) <span class="field-label-en">Destination Country (Multiple)</span> <span class="req">*</span></div>
          <v-autocomplete
            v-model="form.countries"
            :items="countryOptions"
            multiple
            chips
            closable-chips
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            placeholder="เลือกประเทศปลายทาง"
          />
        </v-card-text>
      </v-card>

      <!-- ข้อมูลสถานประกอบการ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-building" color="export-user" class="mr-2" size="18" />
          ข้อมูลสถานประกอบการ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">ชื่อบริษัท (ภาษาไทย) <span class="field-label-en">Company Name (Thai)</span> <span class="req">*</span></div>
              <v-text-field v-model="form.companyNameTh" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">Company Name (English) <span class="field-label-en">Company Name (English)</span> <span class="req">*</span></div>
              <v-text-field v-model="form.companyNameEn" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">ซอย / ตรอก (Alley) <span class="field-label-en">Alley</span></div>
              <v-text-field v-model="form.alley" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">ตำบล / แขวง (Tambol) <span class="field-label-en">Sub-district</span></div>
              <v-text-field v-model="form.tambol" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">อำเภอ / เขต (District) <span class="field-label-en">District</span></div>
              <v-text-field v-model="form.district" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">จังหวัด <span class="field-label-en">Province</span> <span class="req">*</span></div>
              <v-autocomplete
                v-model="form.province"
                :items="provinceOptions"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เลือกจังหวัด"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">เบอร์โทรศัพท์ <span class="field-label-en">Phone Number</span></div>
              <v-text-field v-model="form.companyPhone" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">โทรสาร <span class="field-label-en">Fax</span></div>
              <v-text-field v-model="form.companyFax" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">Email <span class="field-label-en">Email</span></div>
              <v-text-field v-model="form.companyEmail" type="email" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลโรงงาน DOA -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between section-title">
          <span>
            <v-icon icon="fas fa-industry" color="export-user" class="mr-2" size="18" />
            ข้อมูลโรงงาน DOA
          </span>
          <v-btn color="export-user" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-plus" @click="addFactory">
            เพิ่ม
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div v-if="form.factories.length === 0" class="text-center text-medium-emphasis text-body-2 py-4">
            ยังไม่มีข้อมูลโรงงาน — กดปุ่ม "เพิ่ม" เพื่อระบุโรงงาน DOA
          </div>
          <div v-for="(factory, idx) in form.factories" :key="idx" class="factory-row rounded-lg pa-4 mb-3">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-body-2 font-weight-semibold">โรงงาน {{ idx + 1 }}</div>
              <v-btn icon="fas fa-trash" variant="text" size="x-small" color="error" @click="removeFactory(idx)" />
            </div>
            <v-row dense>
              <v-col cols="12" md="8">
                <div class="field-label">ชื่อโรงงาน <span class="field-label-en">Factory Name</span> <span class="req">*</span></div>
                <v-text-field v-model="factory.name" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">แนบเอกสาร <span class="field-label-en">Attachment</span></div>
                <v-btn
                  :color="factory.file ? 'success' : 'export-user'"
                  variant="tonal"
                  size="small"
                  rounded="lg"
                  prepend-icon="fas fa-upload"
                  block
                  @click="mockUpload('factory_' + idx, factory)"
                >
                  {{ factory.file ? factory.file : "แนบไฟล์" }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- ข้อมูล GAP -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between section-title">
          <span>
            <v-icon icon="fas fa-seedling" color="export-user" class="mr-2" size="18" />
            ข้อมูล GAP
          </span>
          <v-btn color="export-user" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-plus" @click="addGap">
            เพิ่ม
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div v-if="form.gaps.length === 0" class="text-center text-medium-emphasis text-body-2 py-4">
            ยังไม่มีข้อมูล GAP — กดปุ่ม "เพิ่ม" เพื่อระบุแหล่งผลิต GAP
          </div>
          <div v-for="(gap, idx) in form.gaps" :key="idx" class="factory-row rounded-lg pa-4 mb-3">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-body-2 font-weight-semibold">แหล่งผลิต GAP {{ idx + 1 }}</div>
              <v-btn icon="fas fa-trash" variant="text" size="x-small" color="error" @click="removeGap(idx)" />
            </div>
            <v-row dense>
              <v-col cols="12" md="5">
                <div class="field-label">ชื่อแหล่งผลิต <span class="field-label-en">Production Site Name</span> <span class="req">*</span></div>
                <v-text-field v-model="gap.name" variant="outlined" density="compact" rounded="lg" hide-details />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">หน่วยงานรับรอง <span class="field-label-en">Certifying Body</span> <span class="req">*</span></div>
                <v-autocomplete
                  v-model="gap.certBody"
                  :items="certBodyOptions"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกหน่วยงาน"
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">แนบเอกสาร <span class="field-label-en">Attachment</span></div>
                <v-btn
                  :color="gap.file ? 'success' : 'export-user'"
                  variant="tonal"
                  size="small"
                  rounded="lg"
                  prepend-icon="fas fa-upload"
                  block
                  @click="mockUpload('gap_' + idx, gap)"
                >
                  {{ gap.file ? gap.file : "แนบไฟล์" }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- Buttons Step 1 -->
      <div class="d-flex justify-space-between align-center mt-2">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="router.back()">
          ย้อนกลับ
        </v-btn>
        <div class="d-flex ga-2">
          <v-btn variant="tonal" color="export-user" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="saveDraft">
            บันทึกแบบร่าง
          </v-btn>
          <v-btn color="export-user" rounded="lg" append-icon="fas fa-arrow-right" @click="currentStep = 2">
            ถัดไป
          </v-btn>
        </div>
      </div>
    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 2">

      <!-- ประเภทผู้ยื่น toggle -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-users" color="export-user" class="mr-2" size="18" />
          ประเภทผู้ประกอบการ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="entityType" color="export-user" inline>
            <v-radio value="natural" label="บุคคลธรรมดา" class="mr-8" />
            <v-radio value="juristic" label="นิติบุคคล" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- เอกสารบุคคลธรรมดา -->
      <v-card v-if="entityType === 'natural'" rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-user" color="export-user" class="mr-2" size="18" />
          เอกสารกรณีบุคคลธรรมดา
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col v-for="doc in docNatural" :key="doc.key" cols="12">
              <div class="upload-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ doc.label }}
                    <v-chip v-if="doc.optional" size="x-small" color="grey" variant="tonal" class="ml-2">ไม่บังคับ</v-chip>
                  </div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip v-if="uploadedFiles[doc.key]" color="success" size="x-small" variant="tonal" prepend-icon="fas fa-check">
                    {{ uploadedFiles[doc.key] }}
                  </v-chip>
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'export-user'"
                    variant="tonal"
                    size="small"
                    rounded="lg"
                    prepend-icon="fas fa-upload"
                    @click="mockUploadFile(doc.key)"
                  >
                    {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- เอกสารนิติบุคคล -->
      <v-card v-if="entityType === 'juristic'" rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-building" color="export-user" class="mr-2" size="18" />
          เอกสารกรณีนิติบุคคล
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col v-for="doc in docJuristic" :key="doc.key" cols="12">
              <div class="upload-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
                <div>
                  <div class="text-body-2 font-weight-medium">{{ doc.label }}</div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip v-if="uploadedFiles[doc.key]" color="success" size="x-small" variant="tonal" prepend-icon="fas fa-check">
                    {{ uploadedFiles[doc.key] }}
                  </v-chip>
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'export-user'"
                    variant="tonal"
                    size="small"
                    rounded="lg"
                    prepend-icon="fas fa-upload"
                    @click="mockUploadFile(doc.key)"
                  >
                    {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- เอกสารเพิ่มเติม -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-paperclip" color="export-user" class="mr-2" size="18" />
          เอกสารเพิ่มเติม
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col v-for="doc in docExtra" :key="doc.key" cols="12">
              <div class="upload-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
                <div>
                  <div class="text-body-2 font-weight-medium">{{ doc.label }}</div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip v-if="uploadedFiles[doc.key]" color="success" size="x-small" variant="tonal" prepend-icon="fas fa-check">
                    {{ uploadedFiles[doc.key] }}
                  </v-chip>
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'export-user'"
                    variant="tonal"
                    size="small"
                    rounded="lg"
                    prepend-icon="fas fa-upload"
                    @click="mockUploadFile(doc.key)"
                  >
                    {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Buttons Step 2 -->
      <div class="d-flex justify-space-between align-center mt-2">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="currentStep = 1">
          ย้อนกลับ
        </v-btn>
        <div class="d-flex ga-2">
          <v-btn variant="tonal" color="export-user" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="saveDraft">
            บันทึกแบบร่าง
          </v-btn>
          <v-btn color="export-user" rounded="lg" prepend-icon="fas fa-paper-plane" @click="confirmDialog = true">
            ยื่นคำขอ
          </v-btn>
        </div>
      </div>
    </template>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="export-user" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการยื่นคำขอ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="confirmDialog = false">ยกเลิก</v-btn>
          <v-btn color="export-user" rounded="lg" block @click="submitApplication">ยืนยัน</v-btn>
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
          <p class="text-body-2 text-medium-emphasis mb-0">
            ระบบได้รับคำขอของท่านแล้ว เจ้าหน้าที่จะตรวจสอบและติดต่อกลับ
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="export-user" rounded="lg" block @click="router.push('/export/user/applications')">
            ดูรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Draft Snackbar -->
    <v-snackbar v-model="draftSnackbar" color="success" rounded="lg" timeout="2500" location="bottom right">
      <v-icon icon="fas fa-floppy-disk" class="mr-2" />
      บันทึกแบบร่างแล้ว
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const typeTitles: Record<string, string> = {
  kk1: "คำร้องขอขึ้นทะเบียน ก.ก.1 (โรงบรรจุ/โรงรมทรีทเม้นต์/สวนส่งออก เกาหลี)",
  smpv5: "คำร้องขอ สมพ.5 (จดทะเบียนผู้ส่งออกผักและผลไม้)",
  smpv5_other: "คำร้องขอ สมพ.5 (กรณีอื่น)",
  amendment: "คำขอแก้ไขใบรับรองผู้ส่งออก",
};
const pageTitle = computed(() => typeTitles[route.params.type as string] ?? "คำขอจดทะเบียนผู้ส่งออก");

const currentStep = ref(1);
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);
const entityType = ref<"natural" | "juristic">("juristic");

const steps = [
  { value: 1, title: "ข้อมูลรายละเอียด" },
  { value: 2, title: "ไฟล์แนบ" },
];

const form = reactive({
  requestType: "register" as "register" | "renew",
  applicantNameTh: "นายสมชาย ใจดี",
  applicantNameEn: "Mr. Somchai Jaidee",
  applicantAddress: "123 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900",
  applicantPhone: "02-123-4567",
  applicantEmail: "somchai@example.com",
  submitterStatus: "เจ้าของ",
  objective: "register" as "register" | "renew",
  countries: [] as string[],
  companyNameTh: "",
  companyNameEn: "",
  alley: "",
  tambol: "",
  district: "",
  province: null as string | null,
  companyPhone: "",
  companyFax: "",
  companyEmail: "",
  factories: [] as { name: string; file: string }[],
  gaps: [] as { name: string; certBody: string; file: string }[],
});

const countryOptions = [
  "สหภาพยุโรป", "จีน", "เวียดนาม", "ญี่ปุ่น", "นอร์เวย์",
  "ไอซ์แลนด์", "สวิตเซอร์แลนด์", "สิงคโปร์", "ไต้หวัน", "เกาหลีใต้", "อื่นๆ",
];

const provinceOptions = [
  "กรุงเทพมหานคร", "เชียงใหม่", "นครราชสีมา", "ขอนแก่น", "เชียงราย",
  "ชลบุรี", "ระยอง", "สุราษฎร์ธานี", "สงขลา", "ภูเก็ต",
];

const certBodyOptions = [
  "กรมวิชาการเกษตร (DOA)", "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)",
  "สำนักงานเกษตรจังหวัด", "หน่วยรับรองเอกชน",
];

function stepClass(value: number) {
  if (currentStep.value > value) return 'step-node--done'
  if (currentStep.value === value) return 'step-node--active'
  return ''
}

function addFactory() {
  form.factories.push({ name: "", file: "" });
}
function removeFactory(idx: number) {
  form.factories.splice(idx, 1);
}
function addGap() {
  form.gaps.push({ name: "", certBody: "", file: "" });
}
function removeGap(idx: number) {
  form.gaps.splice(idx, 1);
}
function mockUpload(key: string, obj: { file: string }) {
  obj.file = "เอกสาร.pdf";
}

// File upload (mock)
const uploadedFiles = reactive<Record<string, string>>({});
function mockUploadFile(key: string) {
  uploadedFiles[key] = "เอกสาร.pdf";
}

const docNatural = [
  { key: "trade_reg", label: "ใบทะเบียนพาณิชย์", optional: false },
  { key: "id_card", label: "สำเนาบัตรประชาชน", optional: false },
  { key: "passport", label: "หนังสือเดินทาง", optional: true },
  { key: "work_permit", label: "ใบอนุญาตทำงาน", optional: true },
  { key: "poa_natural", label: "หนังสือมอบอำนาจ", optional: true },
];

const docJuristic = [
  { key: "company_cert", label: "หนังสือรับรองบริษัท" },
  { key: "director_id", label: "สำเนาบัตรประชาชนกรรมการ" },
  { key: "poa_juristic", label: "หนังสือมอบอำนาจ" },
];

const docExtra = [
  { key: "doa_factory_cert", label: "หนังสือสำคัญขึ้นทะเบียนโรงงาน (DOA)" },
  { key: "gap_cert", label: "หนังสือรับรอง GAP" },
  { key: "factory_cert", label: "เอกสารรับรองโรงงาน" },
];

function saveDraft() {
  draftSnackbar.value = true;
}

function submitApplication() {
  confirmDialog.value = false;
  successDialog.value = true;
}
</script>

<style scoped>
.section-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.section-title { font-size: 14px !important; font-weight: 600; }
.field-label { font-size: 13px; font-weight: 500; color: rgba(var(--v-theme-on-surface), 0.75); margin-bottom: 4px; }
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
.req { color: rgb(var(--v-theme-error)); }
.step-bar { display: flex; align-items: flex-start; }
.step-node { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; transition: all 0.2s; border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity)); background: rgb(var(--v-theme-surface)); color: rgba(var(--v-theme-on-surface), 0.4); }
.step-node--active { border-color: rgb(var(--v-theme-export-user)); color: rgb(var(--v-theme-export-user)); }
.step-node--done { background: rgb(var(--v-theme-export-user)); border-color: rgb(var(--v-theme-export-user)); color: white; }
.step-line { flex: 1; height: 2px; background: rgba(var(--v-border-color), var(--v-border-opacity)); margin: 0 8px; margin-top: 14px; align-self: flex-start; }
.step-line--done { background: rgb(var(--v-theme-export-user)); }
.step-label-col { display: flex; flex-direction: column; align-items: center; }
.step-label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); margin-top: 4px; text-align: center; max-width: 80px; }
.step-label--active { color: rgb(var(--v-theme-export-user)); font-weight: 600; }
.step-num { font-size: 12px; }
.factory-row { background: rgba(var(--v-theme-export-user), 0.03); border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.upload-row { background: rgba(var(--v-theme-export-user), 0.03); border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.confirm-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(var(--v-theme-export-user), 0.1); display: flex; align-items: center; justify-content: center; }
.success-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(var(--v-theme-success), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
