<template>
  <div style="--v-theme-primary: var(--v-theme-doa-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">
          {{ pageTitle }}
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          กรอกข้อมูลให้ครบถ้วนแล้วยืนยันคำขอ
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
                  step.value + 1
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  currentStep >= step.value
                    ? 'text-doa-user font-weight-bold'
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
      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-user" color="doa-user" class="mr-2" size="18" />
          ข้อมูลผู้ยื่นคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12">
              <div class="field-section-label mb-2">ข้อมูลผู้ยื่นคำขอ</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อ-สกุล (ภาษาไทย) <span class="req">*</span></div>
                <div class="field-label-en">Full Name (Thai)</div>
              </div>
              <v-text-field
                v-model="form.applicantNameTh"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>Name (English) <span class="req">*</span></div>
                <div class="field-label-en">Full Name (English)</div>
              </div>
              <v-text-field
                v-model="form.applicantNameEn"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>เลขบัตรประชาชน <span class="req">*</span></div>
                <div class="field-label-en">ID Card No.</div>
              </div>
              <v-text-field
                v-model="form.idCard"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                maxlength="13"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label">
                <div>ที่อยู่ <span class="req">*</span></div>
                <div class="field-label-en">Address</div>
              </div>
              <v-textarea
                v-model="form.applicantAddress"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                rows="2"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-3 mb-2">ข้อมูลการติดต่อ</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                v-model="form.applicantPhone"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรสาร</div>
                <div class="field-label-en">Fax</div>
              </div>
              <v-text-field
                v-model="form.applicantFax"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Email</div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="form.applicantEmail"
                type="email"
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
          <v-icon
            icon="fas fa-bullseye"
            color="doa-user"
            class="mr-2"
            size="18"
          />
          วัตถุประสงค์ของการยื่นคำขอ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <!-- Register type: radio -->
          <template v-if="isRegister">
            <v-radio-group v-model="form.purpose" color="doa-user">
              <v-radio
                value="register"
                label="ขึ้นทะเบียนโรงงานผลิตสินค้าพืช"
                class="mb-2"
              />
              <v-radio
                value="renew"
                label="ต่ออายุการขึ้นทะเบียนโรงงานผลิตสินค้าพืช"
              />
            </v-radio-group>
          </template>
          <!-- Amendment / Scope type: checkboxes -->
          <template v-else>
            <v-row dense>
              <v-col v-for="obj in objectives" :key="obj.value" cols="12">
                <v-checkbox
                  v-model="form.objectives"
                  :value="obj.value"
                  :label="obj.label"
                  color="doa-user"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
                <div
                  v-if="
                    obj.value === 'other' && form.objectives.includes('other')
                  "
                  class="ml-8 mt-1 mb-2"
                >
                  <v-text-field
                    v-model="form.objectiveOther"
                    placeholder="ระบุรายละเอียด"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </div>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลสถานประกอบการ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-industry"
            color="doa-user"
            class="mr-2"
            size="18"
          />
          ข้อมูลสถานประกอบการ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12">
              <div class="field-section-label mb-2">สถานที่โรงงาน</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อโรงงาน (ภาษาไทย) <span class="req">*</span></div>
                <div class="field-label-en">Factory Name (Thai)</div>
              </div>
              <v-text-field
                v-model="form.factoryNameTh"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>Factory Name (English)</div>
                <div class="field-label-en">Factory Name (English)</div>
              </div>
              <v-text-field
                v-model="form.factoryNameEn"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label">
                <div>ที่อยู่สถานประกอบการ <span class="req">*</span></div>
                <div class="field-label-en">Establishment Address</div>
              </div>
              <v-textarea
                v-model="form.factoryAddress"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                rows="2"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-3 mb-2">ข้อมูลการติดต่อ</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                v-model="form.factoryPhone"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรสาร</div>
                <div class="field-label-en">Fax</div>
              </div>
              <v-text-field
                v-model="form.factoryFax"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Email</div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="form.factoryEmail"
                type="email"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>

            <!-- ประเภทสถานประกอบการ -->
            <v-col cols="12" class="mt-1">
              <div class="field-section-label mb-2">ประเภทสถานประกอบการ</div>
              <v-radio-group v-model="form.factoryType" color="doa-user" inline>
                <v-radio value="packing" label="โรงคัดบรรจุ" class="mr-6" />
                <v-radio value="processing" label="โรงงานแปรรูป" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- มาตรฐานที่ขอขึ้นทะเบียน -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title
          class="pa-5 pb-3 d-flex align-center justify-space-between section-title"
        >
          <span>
            <v-icon
              icon="fas fa-certificate"
              color="doa-user"
              class="mr-2"
              size="18"
            />
            มาตรฐานที่ขอขึ้นทะเบียน
          </span>
          <v-btn
            color="doa-user"
            variant="tonal"
            size="small"
            rounded="lg"
            prepend-icon="fas fa-plus"
            @click="openStandardDialog()"
          >
            เพิ่ม
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-table density="comfortable" class="pa-2">
          <thead>
            <tr>
              <th>ขอบข่ายมาตรฐาน</th>
              <th>หน่วยรับรองที่ให้การรับรอง</th>
              <th>เลขที่ใบรับรอง</th>
              <th>วันที่ได้รับการรับรอง</th>
              <th>วันหมดอายุ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="form.standards.length === 0">
              <td
                colspan="6"
                class="text-center text-medium-emphasis py-5 text-body-2"
              >
                ยังไม่มีมาตรฐาน — กดปุ่ม "เพิ่ม" เพื่อระบุมาตรฐาน
              </td>
            </tr>
            <tr v-for="(std, idx) in form.standards" :key="idx">
              <td>{{ std.standard }}</td>
              <td>{{ std.certBody }}</td>
              <td>{{ std.certNo }}</td>
              <td>{{ std.issueDate }}</td>
              <td>{{ std.expireDate }}</td>
              <td class="text-right">
                <v-btn
                  icon="fas fa-pen"
                  variant="text"
                  size="x-small"
                  color="doa-user"
                  @click="openStandardDialog(idx)"
                />
                <v-btn
                  icon="fas fa-trash"
                  variant="text"
                  size="x-small"
                  color="error"
                  @click="removeStandard(idx)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 1">
      <!-- เอกสารบุคคลธรรมดา -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-user" color="doa-user" class="mr-2" size="18" />
          เอกสารกรณีบุคคลธรรมดา
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col v-for="doc in docNatural" :key="doc.key" cols="12">
              <div
                class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3"
              >
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ doc.label }}
                  </div>
                  <div
                    v-if="doc.note"
                    class="text-caption text-medium-emphasis mt-1"
                  >
                    {{ doc.note }}
                  </div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip
                    v-if="uploadedFiles[doc.key]"
                    color="success"
                    size="x-small"
                    variant="tonal"
                    prepend-icon="fas fa-check"
                  >
                    {{ uploadedFiles[doc.key] }}
                  </v-chip>
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'doa-user'"
                    variant="tonal"
                    size="small"
                    rounded="lg"
                    prepend-icon="fas fa-upload"
                    @click="mockUpload(doc.key)"
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
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-building"
            color="doa-user"
            class="mr-2"
            size="18"
          />
          เอกสารกรณีนิติบุคคล
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col v-for="doc in docJuristic" :key="doc.key" cols="12">
              <div
                class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3"
              >
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ doc.label }}
                  </div>
                  <div
                    v-if="doc.note"
                    class="text-caption text-medium-emphasis mt-1"
                  >
                    {{ doc.note }}
                  </div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip
                    v-if="uploadedFiles[doc.key]"
                    color="success"
                    size="x-small"
                    variant="tonal"
                    prepend-icon="fas fa-check"
                  >
                    {{ uploadedFiles[doc.key] }}
                  </v-chip>
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'doa-user'"
                    variant="tonal"
                    size="small"
                    rounded="lg"
                    prepend-icon="fas fa-upload"
                    @click="mockUpload(doc.key)"
                  >
                    {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- เอกสารประกอบเพิ่มเติม -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon
            icon="fas fa-paperclip"
            color="doa-user"
            class="mr-2"
            size="18"
          />
          เอกสารประกอบเพิ่มเติม
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-alert
            variant="tonal"
            color="warning"
            rounded="lg"
            density="compact"
            class="mb-4"
            prepend-icon="fas fa-triangle-exclamation"
          >
            เอกสารลำดับที่ 1–5 ต้องรับรองสำเนาถูกต้องทุกฉบับ
          </v-alert>
          <v-row dense>
            <v-col v-for="doc in docExtra" :key="doc.key" cols="12">
              <div
                class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3"
              >
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ doc.label }}
                  </div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip
                    v-if="uploadedFiles[doc.key]"
                    color="success"
                    size="x-small"
                    variant="tonal"
                    prepend-icon="fas fa-check"
                  >
                    {{ uploadedFiles[doc.key] }}
                  </v-chip>
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'doa-user'"
                    variant="tonal"
                    size="small"
                    rounded="lg"
                    prepend-icon="fas fa-upload"
                    @click="mockUpload(doc.key)"
                  >
                    {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    </template>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="grey"
          @click="router.push('/doa/user/applications')"
        >
          ยกเลิก
        </v-btn>
        <v-btn
          v-if="currentStep > 0"
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-arrow-left"
          @click="currentStep--"
        >
          ย้อนกลับ
        </v-btn>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="doa-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
        >
          บันทึกแบบร่าง
        </v-btn>
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="doa-user"
          append-icon="fas fa-arrow-right"
          @click="currentStep++"
        >
          ถัดไป
        </v-btn>
        <v-btn
          v-else
          color="doa-user"
          prepend-icon="fas fa-paper-plane"
          @click="confirmDialog = true"
        >
          ยื่นคำขอ
        </v-btn>
      </div>
    </div>

    <!-- Standard Dialog -->
    <v-dialog v-model="standardDialog" max-width="560">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
          <v-icon
            icon="fas fa-certificate"
            color="doa-user"
            class="mr-2"
            size="18"
          />
          {{ standardDialogIndex === -1 ? "เพิ่มมาตรฐาน" : "แก้ไขมาตรฐาน" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label">
                <div>ขอบข่ายมาตรฐาน <span class="req">*</span></div>
                <div class="field-label-en">Standard Scope</div>
              </div>
              <v-autocomplete
                v-model="standardForm.standard"
                :items="standardOptions"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label">
                <div>
                  หน่วยรับรองที่ให้การรับรองมาตรฐาน <span class="req">*</span>
                </div>
                <div class="field-label-en">Certifying Body</div>
              </div>
              <v-text-field
                v-model="standardForm.certBody"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label">
                <div>เลขที่ใบรับรอง <span class="req">*</span></div>
                <div class="field-label-en">Certificate No.</div>
              </div>
              <v-text-field
                v-model="standardForm.certNo"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>วันที่ได้รับการรับรอง</div>
                <div class="field-label-en">Issue Date</div>
              </div>
              <v-text-field
                v-model="standardForm.issueDate"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>วันหมดอายุ</div>
                <div class="field-label-en">Expiry Date</div>
              </div>
              <v-text-field
                v-model="standardForm.expireDate"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="standardDialog = false"
            >ยกเลิก</v-btn
          >
          <v-spacer />
          <v-btn color="doa-user" rounded="lg" @click="saveStandard"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="doa-user" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการยื่นคำขอ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="confirmDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="doa-user" rounded="lg" block @click="submitApplication"
            >ยืนยัน</v-btn
          >
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
          <v-btn
            color="doa-user"
            rounded="lg"
            block
            @click="router.push('/doa/user/applications')"
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
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const typeTitles = {
  register: "คำขอขึ้น / ต่ออายุทะเบียนโรงงานผลิตสินค้าพืช DOA",
  amendment: "คำขอเปลี่ยนแปลงทะเบียนโรงงานผลิตสินค้าพืช DOA",
  scope: "คำขอเพิ่ม / ลดขอบข่ายมาตรฐาน",
};
const pageTitle = computed(
  () => typeTitles[route.params.type] ?? "คำขอ DOA",
);
const isRegister = computed(() => route.params.type === "register");
const currentStep = ref(0);
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "ไฟล์แนบ" },
];

const form = reactive({
  applicantNameTh: "",
  applicantNameEn: "",
  idCard: "",
  applicantAddress: "",
  applicantPhone: "",
  applicantFax: "",
  applicantEmail: "",
  purpose: "register",
  factoryNameTh: "",
  factoryNameEn: "",
  factoryAddress: "",
  factoryPhone: "",
  factoryFax: "",
  factoryEmail: "",
  factoryType: "packing",
  standards: [],
  objectives: [],
  objectiveOther: "",
});

// Standards CRUD
const standardDialog = ref(false);
const standardDialogIndex = ref(-1);
const standardForm = reactive({
  standard: "",
  certBody: "",
  certNo: "",
  issueDate: "",
  expireDate: "",
});

const objectives = [
  {
    value: "change_cb",
    label: "1. เปลี่ยนแปลงหน่วยรับรองโรงงานผลิตสินค้าพืช (CB)",
  },
  {
    value: "change_name",
    label:
      "2. เปลี่ยนแปลงชื่อโรงงานผลิตสินค้าพืช (เปลี่ยนจากบุคคลธรรมดา→นิติบุคคล / นิติบุคคล→บุคคลธรรมดา / ควบรวมกิจการ)",
  },
  { value: "add_standard", label: "3. เพิ่มมาตรฐานสินค้าเกษตร (มกษ.)" },
  { value: "remove_standard", label: "4. ลดมาตรฐานสินค้าเกษตร (มกษ.)" },
  {
    value: "notify",
    label: "5. แจ้งให้ทราบ (แนบหลักฐานเพื่อแสดงการเปลี่ยนแปลงในระบบ)",
  },
  { value: "change_scope", label: "6. เพิ่ม / ลด ขอบข่ายผลิตภัณฑ์" },
  { value: "other", label: "7. อื่น ๆ" },
];

const standardOptions = [
  "มกษ. 9023-2550 หลักการทั่วไปเกี่ยวกับสุขลักษณะอาหาร (GMP)",
  "มกษ. 9024-2550 ระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม (HACCP)",
  "ISO 22000",
  "BRC Global Standard for Food Safety",
  "IFS Food",
];

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function openStandardDialog(idx = -1) {
  standardDialogIndex.value = idx;
  if (idx === -1) {
    Object.assign(standardForm, {
      standard: "",
      certBody: "",
      certNo: "",
      issueDate: "",
      expireDate: "",
    });
  } else {
    Object.assign(standardForm, { ...form.standards[idx] });
  }
  standardDialog.value = true;
}

function saveStandard() {
  if (standardDialogIndex.value === -1) {
    form.standards.push({ ...standardForm });
  } else {
    Object.assign(form.standards[standardDialogIndex.value], standardForm);
  }
  standardDialog.value = false;
}

function removeStandard(idx) {
  form.standards.splice(idx, 1);
}

// File upload (mock)
const uploadedFiles = reactive({});

function mockUpload(key) {
  uploadedFiles[key] = "เอกสาร.pdf";
}

// Documents
const docNatural = [
  {
    key: "poa_natural",
    label: "หนังสือมอบอำนาจ",
    note: "ติดอากรแสตมป์ 30 บาท",
  },
  { key: "id_card_natural", label: "สำเนาบัตรประชาชนของผู้มอบอำนาจ", note: "" },
];

const docJuristic = [
  {
    key: "juristic_cert",
    label: "สำเนาหนังสือรับรองการจดทะเบียนนิติบุคคล",
    note: "",
  },
  {
    key: "company_cert",
    label: "สำเนาหนังสือรับรองบริษัท / ห้างหุ้นส่วน / ทะเบียนการค้า",
    note: "",
  },
  {
    key: "poa_juristic",
    label: "หนังสือมอบอำนาจ (กรณีมอบอำนาจ)",
    note: "ติดอากรแสตมป์ 30 บาท",
  },
  {
    key: "id_card_juristic",
    label: "สำเนาบัตรประชาชนผู้มอบอำนาจ (กรณีมอบอำนาจ)",
    note: "",
  },
];

const docExtra = [
  { key: "cert_copy", label: "1. สำเนาใบรับรองมาตรฐานจากหน่วยรับรอง" },
  { key: "scope_copy", label: "2. สำเนารายละเอียดขอบข่ายผลิตภัณฑ์" },
  { key: "map_copy", label: "3. สำเนาแผนที่ตั้งสำนักงานหรือโรงงาน" },
  { key: "process_chart", label: "4. แผนภูมิกระบวนการผลิต" },
  { key: "haccp_plan", label: "5. แผน HACCP PLAN (กรณีขึ้นทะเบียน มกษ.)" },
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
.step-done,
.step-active {
  background: rgb(var(--v-theme-doa-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-doa-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-doa-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-doa-user)) !important;
}
</style>
