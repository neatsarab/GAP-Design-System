<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.push('/export/staff/applications')" />
      <div>
        <h1 class="page-title mb-0">{{ pageTitle }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">เลขคำขอ: {{ route.params.id }}</p>
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

    <!-- ── STEP 1: ข้อมูลคำขอ ── -->
    <template v-if="currentStep === 1">

      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-user" color="export-staff" class="mr-2" size="18" />ข้อมูลผู้ยื่นคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6"><div class="info-label">ชื่อ-นามสกุล</div><div class="info-value">นายสมชาย ใจดี</div></v-col>
            <v-col cols="12" md="6"><div class="info-label">สถานะผู้ยื่น</div><div class="info-value"><v-chip size="x-small" color="export-staff" variant="tonal">เจ้าของ</v-chip></div></v-col>
            <v-col cols="12"><div class="info-label">ที่อยู่</div><div class="info-value">123 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900</div></v-col>
            <v-col cols="12" md="4"><div class="info-label">เบอร์โทรศัพท์</div><div class="info-value">02-123-4567</div></v-col>
            <v-col cols="12" md="4"><div class="info-label">Email</div><div class="info-value">somchai@example.com</div></v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- วัตถุประสงค์และประเทศปลายทาง -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-bullseye" color="export-staff" class="mr-2" size="18" />วัตถุประสงค์และประเทศปลายทาง
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="info-label">วัตถุประสงค์</div>
              <v-chip color="export-staff" variant="tonal" class="mt-1">ขึ้นทะเบียน</v-chip>
            </v-col>
            <v-col cols="12">
              <div class="info-label">ประเทศปลายทาง</div>
              <div class="d-flex flex-wrap ga-2 mt-1">
                <v-chip v-for="c in ['สหภาพยุโรป', 'ญี่ปุ่น', 'สิงคโปร์']" :key="c" size="small" variant="tonal" color="export-staff">{{ c }}</v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลสถานประกอบการ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-building" color="export-staff" class="mr-2" size="18" />ข้อมูลสถานประกอบการ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6"><div class="info-label">ชื่อบริษัท (ไทย)</div><div class="info-value">บริษัท ไทย เอ็กซ์พอร์ต จำกัด</div></v-col>
            <v-col cols="12" md="6"><div class="info-label">Company Name (English)</div><div class="info-value">Thai Export Co., Ltd.</div></v-col>
            <v-col cols="12"><div class="info-label">ที่อยู่</div><div class="info-value">88/1 ม.3 ต.บางปะกง อ.บางปะกง จ.ฉะเชิงเทรา 24130</div></v-col>
            <v-col cols="12" md="4"><div class="info-label">เบอร์โทรศัพท์</div><div class="info-value">038-123-456</div></v-col>
            <v-col cols="12" md="4"><div class="info-label">โทรสาร</div><div class="info-value">038-123-457</div></v-col>
            <v-col cols="12" md="4"><div class="info-label">Email</div><div class="info-value">info@thaiexport.co.th</div></v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลโรงงาน DOA -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-industry" color="export-staff" class="mr-2" size="18" />ข้อมูลโรงงาน DOA
        </v-card-title>
        <v-divider />
        <v-table density="comfortable" class="pa-2">
          <thead>
            <tr>
              <th>ชื่อโรงงาน</th>
              <th>เอกสาร</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in mockFactories" :key="f.name">
              <td>{{ f.name }}</td>
              <td>
                <v-btn size="x-small" variant="tonal" color="export-staff" rounded="lg" prepend-icon="fas fa-download">ดาวน์โหลด</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- ข้อมูล GAP -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-seedling" color="export-staff" class="mr-2" size="18" />ข้อมูล GAP
        </v-card-title>
        <v-divider />
        <v-table density="comfortable" class="pa-2">
          <thead>
            <tr>
              <th>ชื่อแหล่งผลิต</th>
              <th>หน่วยงานรับรอง</th>
              <th>เอกสาร</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in mockGaps" :key="g.name">
              <td>{{ g.name }}</td>
              <td>{{ g.certBody }}</td>
              <td>
                <v-btn size="x-small" variant="tonal" color="export-staff" rounded="lg" prepend-icon="fas fa-download">ดาวน์โหลด</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- ไฟล์แนบ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-paperclip" color="export-staff" class="mr-2" size="18" />รายการไฟล์แนบ
        </v-card-title>
        <v-divider />
        <v-list density="compact" class="pa-3">
          <v-list-item v-for="f in attachments" :key="f.label" rounded="lg" class="mb-1">
            <template #prepend>
              <v-icon icon="fas fa-file-pdf" color="error" size="18" class="mr-2" />
            </template>
            <v-list-item-title class="text-body-2">{{ f.label }}</v-list-item-title>
            <template #append>
              <v-btn size="x-small" variant="tonal" color="export-staff" rounded="lg" prepend-icon="fas fa-download">ดาวน์โหลด</v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- ผลการตรวจสอบเบื้องต้น -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-clipboard-check" color="export-staff" class="mr-2" size="18" />ผลการตรวจสอบเบื้องต้น
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="step1Review.result" color="export-staff" inline class="mb-4">
            <v-radio value="pass" class="mr-6">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-check" color="success" size="18" />
                  <span class="font-weight-medium">ผ่าน</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="improve" class="mr-6">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-exclamation" color="warning" size="18" />
                  <span class="font-weight-medium">ปรับปรุง</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="fail">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-xmark" color="error" size="18" />
                  <span class="font-weight-medium">ไม่ผ่าน</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <div class="field-label"><div>หมายเหตุ</div><div class="field-label-en">Remarks</div></div>
          <v-textarea v-model="step1Review.remark" variant="outlined" density="compact" rounded="lg" hide-details rows="3" placeholder="ระบุเหตุผล..." />
        </v-card-text>
      </v-card>

      <div class="d-flex justify-end mt-2">
        <v-btn color="export-staff" rounded="lg" append-icon="fas fa-arrow-right" @click="forwardDialog = true">
          ส่งต่อพิจารณา
        </v-btn>
      </div>
    </template>

    <!-- ── STEP 2: พิจารณา ── -->
    <template v-if="currentStep === 2">

      <!-- สรุปข้อมูลคำขอ (read-only) -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-file-lines" color="export-staff" class="mr-2" size="18" />สรุปข้อมูลคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6"><div class="info-label">ผู้ยื่นคำขอ</div><div class="info-value">นายสมชาย ใจดี</div></v-col>
            <v-col cols="12" md="6"><div class="info-label">วัตถุประสงค์</div><div class="info-value">ขึ้นทะเบียน</div></v-col>
            <v-col cols="12" md="6"><div class="info-label">ชื่อบริษัท</div><div class="info-value">บริษัท ไทย เอ็กซ์พอร์ต จำกัด</div></v-col>
            <v-col cols="12">
              <div class="info-label">ประเทศปลายทาง</div>
              <div class="d-flex flex-wrap ga-2 mt-1">
                <v-chip v-for="c in ['สหภาพยุโรป', 'ญี่ปุ่น', 'สิงคโปร์']" :key="c" size="small" variant="tonal" color="export-staff">{{ c }}</v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- เลขทะเบียน (temp) -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-hashtag" color="export-staff" class="mr-2" size="18" />เลขทะเบียน (ชั่วคราว)
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label"><div>เลขทะเบียน <span class="req">*</span></div><div class="field-label-en">Registration No.</div></div>
              <v-text-field v-model="review.regNo" variant="outlined" density="compact" rounded="lg" hide-details placeholder="เช่น EXP-REG-2568-0001" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ผลการพิจารณา -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-scale-balanced" color="export-staff" class="mr-2" size="18" />ผลการพิจารณา
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="review.result" color="export-staff" class="mb-4">
            <v-radio value="approved" class="mb-3">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-check" color="success" size="18" />
                  <span class="font-weight-medium">ผ่าน</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="improve" class="mb-3">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-exclamation" color="warning" size="18" />
                  <span class="font-weight-medium">ปรับปรุง</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="rejected">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-xmark" color="error" size="18" />
                  <span class="font-weight-medium">ไม่ผ่าน</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <div class="field-label"><div>หมายเหตุเพิ่มเติม</div><div class="field-label-en">Additional Remarks</div></div>
          <v-textarea v-model="review.remark" variant="outlined" density="compact" rounded="lg" hide-details rows="3" placeholder="ระบุเหตุผล..." class="mb-4" />
          <div class="field-label"><div>แนบไฟล์</div><div class="field-label-en">Attachment</div></div>
          <v-btn
            :color="reviewFile ? 'success' : 'export-staff'"
            variant="tonal"
            size="small"
            rounded="lg"
            prepend-icon="fas fa-upload"
            @click="reviewFile = 'เอกสารพิจารณา.pdf'"
          >
            {{ reviewFile ? reviewFile : "แนบไฟล์" }}
          </v-btn>

          <div class="mt-4">
            <div class="field-label mb-2"><div>Preview เอกสาร</div><div class="field-label-en">Document Preview</div></div>
            <div class="preview-box rounded-xl d-flex align-center justify-center flex-column ga-2">
              <v-icon icon="fas fa-file-pdf" size="40" color="export-staff" style="opacity:0.4" />
              <span class="text-caption text-medium-emphasis">Preview ร่างใบรับรอง</span>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-space-between mt-2">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-rotate-left" @click="sendBackDialog = true">ส่งกลับแก้ไข</v-btn>
        <v-btn color="export-staff" rounded="lg" append-icon="fas fa-arrow-right" @click="confirmDialog = true">ส่งต่อ</v-btn>
      </div>
    </template>

    <!-- ── STEP 3: ลงนาม ── -->
    <template v-if="currentStep === 3">

      <!-- สรุปข้อมูลคำขอ (read-only) -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-file-lines" color="export-staff" class="mr-2" size="18" />สรุปข้อมูลคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="4"><div class="info-label">เลขทะเบียน</div><div class="info-value">EXP-REG-2568-0001</div></v-col>
            <v-col cols="12" md="4"><div class="info-label">ผู้ยื่นคำขอ</div><div class="info-value">นายสมชาย ใจดี</div></v-col>
            <v-col cols="12" md="4"><div class="info-label">วัตถุประสงค์</div><div class="info-value">ขึ้นทะเบียน</div></v-col>
            <v-col cols="12" md="6"><div class="info-label">ชื่อบริษัท</div><div class="info-value">บริษัท ไทย เอ็กซ์พอร์ต จำกัด</div></v-col>
            <v-col cols="12">
              <div class="info-label">ประเทศปลายทาง</div>
              <div class="d-flex flex-wrap ga-2 mt-1">
                <v-chip v-for="c in ['สหภาพยุโรป', 'ญี่ปุ่น', 'สิงคโปร์']" :key="c" size="small" variant="tonal" color="export-staff">{{ c }}</v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Preview และลงนาม -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-pen-nib" color="export-staff" class="mr-2" size="18" />การลงนามอนุมัติ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="preview-box rounded-xl d-flex align-center justify-center flex-column ga-2 mb-5">
            <v-icon icon="fas fa-file-pdf" size="40" color="export-staff" style="opacity:0.4" />
            <span class="text-caption text-medium-emphasis">Preview ใบรับรองผู้ส่งออก</span>
            <v-btn size="small" color="export-staff" variant="tonal" rounded="lg" prepend-icon="fas fa-eye">Preview</v-btn>
          </div>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label"><div>ชื่อผู้ลงนาม <span class="req">*</span></div><div class="field-label-en">Signer Name</div></div>
              <v-text-field v-model="sign.signerName" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label"><div>วันที่ลงนาม <span class="req">*</span></div><div class="field-label-en">Signing Date</div></div>
              <v-text-field v-model="sign.signDate" type="date" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3"><div>หมายเหตุ (ถ้ามี)</div><div class="field-label-en">Remarks (if any)</div></div>
              <v-textarea v-model="sign.remark" variant="outlined" density="compact" rounded="lg" hide-details rows="2" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-space-between mt-2">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="currentStep = 2">ย้อนกลับ</v-btn>
        <v-btn color="export-staff" rounded="lg" prepend-icon="fas fa-pen-nib" @click="confirmDialog = true">ลงนามอนุมัติ</v-btn>
      </div>
    </template>

    <!-- Forward Dialog (Step 1) -->
    <v-dialog v-model="forwardDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="action-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="export-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งต่อพิจารณา</h3>
          <p class="text-body-2 text-medium-emphasis">ยืนยันการส่งคำขอนี้ไปยังเจ้าหน้าที่พิจารณา</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="forwardDialog = false">ยกเลิก</v-btn>
          <v-btn color="export-staff" rounded="lg" block @click="submitForward">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Send Back Dialog (Step 2) -->
    <v-dialog v-model="sendBackDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="action-ring mx-auto mb-4" style="background: rgba(var(--v-theme-warning), 0.1)">
            <v-icon icon="fas fa-rotate-left" color="warning" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งกลับแก้ไข</h3>
          <p class="text-body-2 text-medium-emphasis">ยืนยันการส่งคำขอกลับให้ผู้ยื่นแก้ไข</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="sendBackDialog = false">ยกเลิก</v-btn>
          <v-btn color="warning" rounded="lg" block @click="submitSendBack">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog (Step 2 / Step 3) -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="action-ring mx-auto mb-4">
            <v-icon :icon="currentStep === 3 ? 'fas fa-pen-nib' : 'fas fa-paper-plane'" color="export-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">{{ currentStep === 3 ? 'ยืนยันการลงนาม' : 'ยืนยันส่งต่อ' }}</h3>
          <p class="text-body-2 text-medium-emphasis">เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="confirmDialog = false">ยกเลิก</v-btn>
          <v-btn color="export-staff" rounded="lg" block @click="submitAction">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ดำเนินการสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">{{ successMessage }}</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="export-staff" rounded="lg" block @click="router.push('/export/staff/applications')">
            กลับรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const currentStep = ref(Number(route.query.step) || 1);
const forwardDialog = ref(false);
const sendBackDialog = ref(false);
const confirmDialog = ref(false);
const successDialog = ref(false);
const reviewFile = ref("");

const steps = [
  { value: 1, title: "ข้อมูลคำขอ" },
  { value: 2, title: "พิจารณา" },
  { value: 3, title: "ลงนาม" },
];

const pageTitles: Record<number, string> = {
  1: "ตรวจสอบคำขอ",
  2: "พิจารณาคำขอ",
  3: "ลงนามอนุมัติ",
};
const pageTitle = computed(() => pageTitles[currentStep.value] ?? "รายละเอียดคำขอ");

const successMessages: Record<number, string> = {
  1: "ส่งต่อคำขอเพื่อพิจารณาเรียบร้อยแล้ว",
  2: "บันทึกผลการพิจารณาและส่งต่อให้เจ้าหน้าที่ลงนามเรียบร้อยแล้ว",
  3: "ลงนามอนุมัติคำขอเรียบร้อยแล้ว",
};
const successMessage = computed(() => successMessages[currentStep.value] ?? "ดำเนินการสำเร็จ");

const step1Review = reactive({ result: "pass" as "pass" | "improve" | "fail", remark: "" });
const review = reactive({ result: "approved" as "approved" | "improve" | "rejected", remark: "", regNo: "" });
const sign = reactive({ signerName: "", signDate: "", remark: "" });

const mockFactories = [
  { name: "โรงบรรจุสินค้าไทยเอ็กซ์พอร์ต 1" },
  { name: "โรงรมทรีทเม้นต์ไทยเอ็กซ์พอร์ต" },
];

const mockGaps = [
  { name: "สวนมะม่วงไทยเอ็กซ์พอร์ต", certBody: "กรมวิชาการเกษตร (DOA)" },
  { name: "สวนมะละกอไทยเอ็กซ์พอร์ต", certBody: "สำนักงานเกษตรจังหวัด" },
];

const attachments = [
  { label: "หนังสือรับรองบริษัท" },
  { label: "สำเนาบัตรประชาชนกรรมการ" },
  { label: "หนังสือสำคัญขึ้นทะเบียนโรงงาน (DOA)" },
  { label: "หนังสือรับรอง GAP" },
];

function stepClass(value: number) {
  if (currentStep.value > value) return 'step-node--done'
  if (currentStep.value === value) return 'step-node--active'
  return ''
}

function submitForward() {
  forwardDialog.value = false;
  successDialog.value = true;
}

function submitSendBack() {
  sendBackDialog.value = false;
  successDialog.value = true;
}

function submitAction() {
  confirmDialog.value = false;
  successDialog.value = true;
}
</script>

<style scoped>
div { --step-color: rgb(var(--v-theme-export-staff)); --step-color-tint: rgba(var(--v-theme-export-staff), 0.2); }
.info-value { margin-bottom: 12px; }
.step-bar { display: flex; align-items: flex-start; }
.step-node { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; transition: all 0.2s; border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity)); background: rgb(var(--v-theme-surface)); color: rgba(var(--v-theme-on-surface), 0.4); }
.step-node--active { border-color: rgb(var(--v-theme-export-staff)); color: rgb(var(--v-theme-export-staff)); }
.step-node--done { background: rgb(var(--v-theme-export-staff)); border-color: rgb(var(--v-theme-export-staff)); color: white; }
.step-label-col { display: flex; flex-direction: column; align-items: center; }
.step-label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); margin-top: 4px; text-align: center; max-width: 80px; }
.step-label--active { color: rgb(var(--v-theme-export-staff)); font-weight: 600; }
.step-num { font-size: 12px; }
.preview-box { background: rgba(var(--v-theme-export-staff), 0.04); border: 1px dashed rgba(var(--v-theme-export-staff), 0.3); height: 160px; }
.action-ring { width: 64px; height: 64px; border-radius: 50%; background: rgba(var(--v-theme-export-staff), 0.1); display: flex; align-items: center; justify-content: center; }
.success-ring { width: 64px; height: 64px; border-radius: 50%; background: rgba(var(--v-theme-success), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
