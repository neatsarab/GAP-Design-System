<template>
  <div style="--v-theme-primary: var(--v-theme-doa-staff)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goBack"
      />
      <div>
        <h1 class="page-title mb-0">{{ pageTitle }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ: {{ route.params.id }}
        </p>
      </div>
    </div>

    <!-- Stepper -->
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
                  step.value
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  currentStep >= step.value
                    ? 'text-doa-staff font-weight-bold'
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

    <!-- ── STEP 1: ข้อมูลคำขอ (เจ้าหน้าที่ตรวจคำขอ) ── -->
    <template v-if="currentStep === 1">
      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-user"
            color="doa-staff"
            class="mr-2"
            size="18"
          />ข้อมูลผู้ยื่นคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6"
              ><div class="info-label">ชื่อผู้ยื่นคำขอ</div>
              <div class="info-value">นายสมชาย ใจดี</div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">สัญชาติ</div>
              <div class="info-value">ไทย</div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">เลขบัตรประชาชน</div>
              <div class="info-value">1 2345 67890 12 3</div></v-col
            >
            <v-col cols="12"
              ><div class="info-label">ที่อยู่</div>
              <div class="info-value">
                123 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900
              </div></v-col
            >
            <v-col cols="12" md="4"
              ><div class="info-label">โทรศัพท์</div>
              <div class="info-value">02-123-4567</div></v-col
            >
            <v-col cols="12" md="4"
              ><div class="info-label">โทรสาร</div>
              <div class="info-value">02-123-4568</div></v-col
            >
            <v-col cols="12" md="4"
              ><div class="info-label">E-mail</div>
              <div class="info-value">somchai@example.com</div></v-col
            >
          </v-row>
        </v-card-text>
      </v-card>

      <!-- วัตถุประสงค์ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-bullseye"
            color="doa-staff"
            class="mr-2"
            size="18"
          />วัตถุประสงค์ของคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-chip color="doa-staff" variant="tonal"
            >ขอขึ้นทะเบียนโรงงานผลิตสินค้าพืช</v-chip
          >
        </v-card-text>
      </v-card>

      <!-- ข้อมูลโรงงาน -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-industry"
            color="doa-staff"
            class="mr-2"
            size="18"
          />ข้อมูลโรงงานผลิตสินค้า
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6"
              ><div class="info-label">ชื่อโรงงาน (ภาษาไทย)</div>
              <div class="info-value">บริษัท สยามฟู้ด จำกัด</div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">Factory Name (English)</div>
              <div class="info-value">Siam Food Co., Ltd.</div></v-col
            >
            <v-col cols="12"
              ><div class="info-label">ที่อยู่โรงงาน</div>
              <div class="info-value">
                88/1 ม.3 ต.บางปะกง อ.บางปะกง จ.ฉะเชิงเทรา 24130
              </div></v-col
            >
            <v-col cols="12" md="6">
              <div class="info-label">ประเภทสถานประกอบการ</div>
              <v-chip color="doa-staff" variant="tonal" class="mt-1"
                >โรงงานแปรรูป</v-chip
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ตำแหน่งที่ตั้ง -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-location-dot"
            color="doa-staff"
            class="mr-2"
            size="18"
          />ตำแหน่งที่ตั้งสถานประกอบการ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense class="mb-3">
            <v-col cols="12" md="6"
              ><div class="info-label">Latitude</div>
              <div class="info-value">13.7563</div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">Longitude</div>
              <div class="info-value">100.5018</div></v-col
            >
          </v-row>
          <div
            class="map-placeholder rounded-xl d-flex align-center justify-center flex-column ga-2"
          >
            <v-icon
              icon="fas fa-map-location-dot"
              size="40"
              color="doa-staff"
              style="opacity: 0.5"
            />
            <span class="text-caption text-medium-emphasis"
              >Google Map Preview</span
            >
          </div>
        </v-card-text>
      </v-card>

      <!-- ขอบข่ายมาตรฐาน -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-certificate"
            color="doa-staff"
            class="mr-2"
            size="18"
          />ขอบข่ายมาตรฐานที่ขอขึ้นทะเบียน
        </v-card-title>
        <v-divider />
        <v-table density="comfortable" class="pa-2">
          <thead>
            <tr>
              <th>ขอบข่ายมาตรฐาน</th>
              <th>หน่วยรับรอง</th>
              <th>เลขที่ใบรับรอง</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in standards" :key="s.standard">
              <td>{{ s.standard }}</td>
              <td>{{ s.certBody }}</td>
              <td>{{ s.certNo }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- ไฟล์แนบ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-paperclip"
            color="doa-staff"
            class="mr-2"
            size="18"
          />รายการไฟล์แนบ
        </v-card-title>
        <v-divider />
        <v-list density="compact" class="pa-3">
          <v-list-item
            v-for="f in attachments"
            :key="f.label"
            rounded="lg"
            class="mb-1"
          >
            <template #prepend>
              <v-icon
                icon="fas fa-file-pdf"
                color="error"
                size="18"
                class="mr-2"
              />
            </template>
            <v-list-item-title class="text-body-2">{{
              f.label
            }}</v-list-item-title>
            <template #append>
              <v-btn
                size="x-small"
                variant="tonal"
                color="doa-staff"
                rounded="lg"
                prepend-icon="fas fa-download"
                >ดาวน์โหลด</v-btn
              >
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <div class="d-flex justify-end mt-2">
        <v-btn
          color="doa-staff"
          rounded="lg"
          append-icon="fas fa-paper-plane"
          @click="openForwardDialog"
          >ส่งให้พิจารณาทะเบียน</v-btn
        >
      </div>
    </template>

    <!-- ── STEP 2: พิจารณาทะเบียน (เจ้าหน้าที่พิจารณาทะเบียน) ── -->
    <template v-if="currentStep === 2">
      <!-- สรุปข้อมูลคำขอ (read-only) -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-file-lines"
            color="doa-staff"
            class="mr-2"
            size="18"
          />สรุปข้อมูลคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6"
              ><div class="info-label">ผู้ยื่นคำขอ</div>
              <div class="info-value">นายสมชาย ใจดี</div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">วัตถุประสงค์</div>
              <div class="info-value">
                ขอขึ้นทะเบียนโรงงานผลิตสินค้าพืช
              </div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">ชื่อโรงงาน</div>
              <div class="info-value">
                บริษัท สยามฟู้ด จำกัด (Siam Food Co., Ltd.)
              </div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">ที่อยู่โรงงาน</div>
              <div class="info-value">
                88/1 ม.3 ต.บางปะกง อ.บางปะกง จ.ฉะเชิงเทรา 24130
              </div></v-col
            >
            <v-col cols="12">
              <div class="info-label">ขอบข่ายมาตรฐาน</div>
              <div class="d-flex flex-wrap ga-2 mt-1">
                <v-chip
                  v-for="s in standards"
                  :key="s.standard"
                  size="small"
                  variant="tonal"
                  color="doa-staff"
                  >{{ s.standard }}</v-chip
                >
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ฟอร์มพิจารณา -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-scale-balanced"
            color="doa-staff"
            class="mr-2"
            size="18"
          />ผลการพิจารณา
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="review.result" color="doa-staff" class="mb-4">
            <v-radio value="approved" class="mb-3">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon
                    icon="fas fa-circle-check"
                    color="success"
                    size="18"
                  />
                  <span class="font-weight-medium">ผ่าน</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="improve" class="mb-3">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon
                    icon="fas fa-circle-exclamation"
                    color="warning"
                    size="18"
                  />
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

          <v-expand-transition>
            <div v-if="review.result === 'improve'" class="mb-4">
              <v-alert
                variant="tonal"
                color="warning"
                rounded="lg"
                density="compact"
                class="mb-4"
                prepend-icon="fas fa-triangle-exclamation"
              >
                หากผู้ประกอบการไม่ดำเนินการภายในเวลาที่กำหนด ระบบจะ reject
                และให้ยื่นคำขอใหม่
              </v-alert>
              <div class="field-label">
                <div>กำหนดระยะเวลาแก้ไข <span class="req">*</span></div>
                <div class="field-label-en">Revision Deadline</div>
              </div>
              <v-text-field
                v-model="review.deadline"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                style="max-width: 280px"
              />
            </div>
          </v-expand-transition>

          <div class="field-label">
            <div>หมายเหตุ / เหตุผลประกอบการพิจารณา</div>
            <div class="field-label-en">Remarks / Review Reason</div>
          </div>
          <v-textarea
            v-model="review.remark"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            rows="3"
            placeholder="ระบุเหตุผล..."
          />
        </v-card-text>
      </v-card>

      <div class="d-flex justify-space-between mt-2">
        <v-btn
          variant="tonal"
          color="grey"
          rounded="lg"
          prepend-icon="fas fa-arrow-left"
          @click="goBack"
          >ย้อนกลับ</v-btn
        >
        <v-btn
          color="doa-staff"
          rounded="lg"
          prepend-icon="fas fa-floppy-disk"
          @click="openConfirmDialog"
          >บันทึกผลพิจารณา</v-btn
        >
      </div>
    </template>

    <!-- ── STEP 3: ลงนาม (เจ้าหน้าที่ผู้มีอำนาจลงนาม) ── -->
    <template v-if="currentStep === 3">
      <!-- ผลพิจารณาจาก Step 2 -->
      <v-alert
        :color="
          mockReviewResult.result === 'approved'
            ? 'success'
            : mockReviewResult.result === 'improve'
              ? 'warning'
              : 'error'
        "
        variant="tonal"
        rounded="xl"
        class="mb-5"
        :prepend-icon="
          mockReviewResult.result === 'approved'
            ? 'fas fa-circle-check'
            : mockReviewResult.result === 'improve'
              ? 'fas fa-circle-exclamation'
              : 'fas fa-circle-xmark'
        "
      >
        <div class="font-weight-bold mb-1">
          ผลการพิจารณาทะเบียน:
          {{
            { approved: "ผ่าน", improve: "ปรับปรุง", rejected: "ไม่ผ่าน" }[
              mockReviewResult.result
            ]
          }}
        </div>
        <div v-if="mockReviewResult.remark" class="text-body-2">
          {{ mockReviewResult.remark }}
        </div>
      </v-alert>

      <!-- สรุปข้อมูลคำขอ (read-only) -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-file-lines"
            color="doa-staff"
            class="mr-2"
            size="18"
          />สรุปข้อมูลคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" md="6"
              ><div class="info-label">ผู้ยื่นคำขอ</div>
              <div class="info-value">นายสมชาย ใจดี</div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">วัตถุประสงค์</div>
              <div class="info-value">
                ขอขึ้นทะเบียนโรงงานผลิตสินค้าพืช
              </div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">ชื่อโรงงาน</div>
              <div class="info-value">
                บริษัท สยามฟู้ด จำกัด (Siam Food Co., Ltd.)
              </div></v-col
            >
            <v-col cols="12" md="6"
              ><div class="info-label">ที่อยู่โรงงาน</div>
              <div class="info-value">
                88/1 ม.3 ต.บางปะกง อ.บางปะกง จ.ฉะเชิงเทรา 24130
              </div></v-col
            >
            <v-col cols="12">
              <div class="info-label">ขอบข่ายมาตรฐาน</div>
              <div class="d-flex flex-wrap ga-2 mt-1">
                <v-chip
                  v-for="s in standards"
                  :key="s.standard"
                  size="small"
                  variant="tonal"
                  color="doa-staff"
                  >{{ s.standard }}</v-chip
                >
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ฟอร์มลงนาม -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-pen-nib"
            color="doa-staff"
            class="mr-2"
            size="18"
          />การลงนามอนุมัติ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group
            v-model="sign.decision"
            color="doa-staff"
            inline
            class="mb-5"
          >
            <v-radio value="approved" class="mr-8">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon
                    icon="fas fa-circle-check"
                    color="success"
                    size="18"
                  />
                  <span class="font-weight-medium">อนุมัติ</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="rejected">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-xmark" color="error" size="18" />
                  <span class="font-weight-medium">ไม่อนุมัติ</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อผู้ลงนาม <span class="req">*</span></div>
                <div class="field-label-en">Signer Name</div>
              </div>
              <v-text-field
                v-model="sign.signerName"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>วันที่ลงนาม <span class="req">*</span></div>
                <div class="field-label-en">Signing Date</div>
              </div>
              <v-text-field
                v-model="sign.signDate"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                <div>หมายเหตุ (ถ้ามี)</div>
                <div class="field-label-en">Remarks (if any)</div>
              </div>
              <v-textarea
                v-model="sign.remark"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                rows="2"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-space-between mt-2">
        <v-btn
          variant="tonal"
          color="grey"
          rounded="lg"
          prepend-icon="fas fa-arrow-left"
          @click="goBack"
          >ย้อนกลับ</v-btn
        >
        <v-btn
          color="doa-staff"
          rounded="lg"
          prepend-icon="fas fa-pen-nib"
          @click="openConfirmDialog"
          >ยืนยันลงนาม</v-btn
        >
      </div>
    </template>

    <!-- Forward Dialog (Step 1) -->
    <v-dialog v-model="forwardDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="forward-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="doa-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งให้พิจารณาทะเบียน</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอนี้ไปยังเจ้าหน้าที่พิจารณาทะเบียน
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="closeForwardDialog"
            >ยกเลิก</v-btn
          >
          <v-btn color="doa-staff" rounded="lg" block @click="submitForward"
            >ยืนยัน</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog (Step 2 / Step 3) -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon
              :icon="
                currentStep === 3 ? 'fas fa-pen-nib' : 'fas fa-floppy-disk'
              "
              color="doa-staff"
              size="28"
            />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">
            {{ currentStep === 3 ? "ยืนยันการลงนาม" : "ยืนยันบันทึกผลพิจารณา" }}
          </h3>
          <p class="text-body-2 text-medium-emphasis">
            เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="closeConfirmDialog"
            >ยกเลิก</v-btn
          >
          <v-btn color="doa-staff" rounded="lg" block @click="submitAction"
            >ยืนยัน</v-btn
          >
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
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ successMessage }}
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="doa-staff"
            rounded="lg"
            block
            @click="goBackFromSuccess"
            >{{ successBackLabel }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const currentStep = ref(Number(route.query.step) || 1);
const forwardDialog = ref(false);
const confirmDialog = ref(false);
const successDialog = ref(false);

function openForwardDialog() {
  forwardDialog.value = true;
}

function closeForwardDialog() {
  forwardDialog.value = false;
}

function openConfirmDialog() {
  confirmDialog.value = true;
}

function closeConfirmDialog() {
  confirmDialog.value = false;
}

const steps = [
  { value: 1, title: "ข้อมูลคำขอ" },
  { value: 2, title: "พิจารณาทะเบียน" },
  { value: 3, title: "ลงนาม" },
];

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

const pageTitles = {
  1: "ตรวจสอบคำขอ DOA",
  2: "พิจารณาทะเบียน DOA",
  3: "ลงนาม DOA",
};
const pageTitle = computed(() => pageTitles[currentStep.value] ?? "คำขอ DOA");

const backRoutes = {
  1: "/doa/staff/applications",
  2: "/doa/staff/review",
  3: "/doa/staff/signing",
};
function goBack() {
  router.push(backRoutes[currentStep.value] ?? { name: "DOAStaffApplicationList" });
}

const successMessages = {
  2: "บันทึกผลการพิจารณาและส่งต่อให้เจ้าหน้าที่ลงนามเรียบร้อยแล้ว",
  3: "ลงนามอนุมัติคำขอเรียบร้อยแล้ว",
};
const successBackLabels = {
  2: "กลับรายการพิจารณา",
  3: "กลับรายการลงนาม",
};
const successMessage = computed(
  () => successMessages[currentStep.value] ?? "ดำเนินการสำเร็จ",
);
const successBackLabel = computed(
  () => successBackLabels[currentStep.value] ?? "กลับ",
);

function goBackFromSuccess() {
  successDialog.value = false;
  router.push(backRoutes[currentStep.value] ?? { name: "DOAStaffApplicationList" });
}

const review = reactive({ result: "approved", remark: "", deadline: "" });
const sign = reactive({
  decision: "approved",
  signerName: "",
  signDate: "",
  remark: "",
});

// Mock review result shown in step 3 (would come from API in production)
const mockReviewResult = {
  result: "approved",
  remark: "เอกสารครบถ้วน ขอบข่ายมาตรฐานถูกต้อง",
};

const standards = [
  {
    standard: "มกษ. 9023-2550 (GMP)",
    certBody: "บ.ไทยเซอร์ติฟาย จก.",
    certNo: "CB-0023-2566",
  },
];

const attachments = [
  { label: "หนังสือมอบอำนาจ" },
  { label: "สำเนาหนังสือรับรองนิติบุคคล" },
  { label: "สำเนาใบรับรองมาตรฐาน" },
  { label: "แผนผังกระบวนการผลิต" },
];

function submitForward() {
  forwardDialog.value = false;
  router.push({ name: "DOAStaffApplicationList" });
}

function submitAction() {
  confirmDialog.value = false;
  successDialog.value = true;
}
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-doa-staff));
  --step-color-tint: rgba(var(--v-theme-doa-staff), 0.2);
}
.info-value {
  margin-bottom: 12px;
}
/* step-circle: global handles base size/shape; add border + weight unique to staff */

.map-placeholder {
  background: rgba(var(--v-theme-doa-staff), 0.04);
  border: 1px dashed rgba(var(--v-theme-doa-staff), 0.3);
  height: 200px;
}
.forward-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-doa-staff), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-doa-staff), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-success), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-doa-staff)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-doa-staff), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-doa-staff)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-doa-staff)) !important;
}
</style>
