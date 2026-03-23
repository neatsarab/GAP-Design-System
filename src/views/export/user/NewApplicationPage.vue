<template>
  <div style="--v-theme-primary: var(--v-theme-export-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">{{ pageTitle }}</h1>
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
                    ? 'text-export-user font-weight-bold'
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
      <!-- ประเภทคำขอ -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-list-check" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ประเภทคำขอ</span>
        </div>
        <v-card-text class="pt-5">
          <v-radio-group v-model="form.requestType" color="export-user" inline>
            <v-radio value="register" label="ขอขึ้นทะเบียน" class="mr-8" />
            <v-radio value="renew" label="ขอต่ออายุ" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-user" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลผู้ยื่นคำขอ</span
          >
        </div>
        <v-card-text class="pt-5">
          <div class="field-section-label mb-2">ข้อมูลส่วนตัว</div>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อ-นามสกุล (ภาษาไทย) <span class="req">*</span></div>
                <div class="field-label-en">Full Name (Thai)</div>
              </div>
              <v-text-field v-model="form.applicantNameTh" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>Name-Surname (English) <span class="req">*</span></div>
                <div class="field-label-en">Full Name (English)</div>
              </div>
              <v-text-field v-model="form.applicantNameEn" hide-details />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-3 mb-2">
                ที่อยู่และการติดต่อ
              </div>
            </v-col>
            <v-col cols="12">
              <div class="field-label">
                <div>ที่อยู่ <span class="req">*</span></div>
                <div class="field-label-en">Address</div>
              </div>
              <v-textarea
                v-model="form.applicantAddress"
                hide-details
                rows="2"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>เบอร์โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field v-model="form.applicantPhone" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Email</div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="form.applicantEmail"
                type="email"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>สถานะผู้ยื่น</div>
                <div class="field-label-en">Applicant Type</div>
              </div>
              <v-autocomplete
                v-model="form.submitterStatus"
                :items="['เจ้าของ', 'ตัวแทน']"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- วัตถุประสงค์ -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-bullseye" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">วัตถุประสงค์</span>
        </div>
        <v-card-text class="pt-5">
          <v-radio-group v-model="form.objective" color="export-user">
            <v-radio value="register" label="ขึ้นทะเบียน" class="mb-2" />
            <v-radio value="renew" label="ต่ออายุทะเบียน" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- ประเทศปลายทาง -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-earth-asia" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ประเทศปลายทาง</span>
        </div>
        <v-card-text class="pt-5">
          <div class="field-label mb-2">
            <div>
              เลือกประเทศปลายทาง (เลือกได้หลายประเทศ)
              <span class="req">*</span>
            </div>
            <div class="field-label-en">Destination Country (Multiple)</div>
          </div>
          <v-autocomplete
            v-model="form.countries"
            :items="countryOptions"
            multiple
            chips
            closable-chips
            hide-details
            placeholder="เลือกประเทศปลายทาง"
          />
        </v-card-text>
      </v-card>

      <!-- ข้อมูลสถานประกอบการ -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลสถานประกอบการ</span
          >
        </div>
        <v-card-text class="pt-5">
          <div class="field-section-label mb-2">ชื่อบริษัท</div>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อบริษัท (ภาษาไทย) <span class="req">*</span></div>
                <div class="field-label-en">Company Name (Thai)</div>
              </div>
              <v-text-field v-model="form.companyNameTh" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>Company Name (English) <span class="req">*</span></div>
                <div class="field-label-en">Company Name (English)</div>
              </div>
              <v-text-field v-model="form.companyNameEn" hide-details />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-3 mb-2">ที่ตั้ง</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ซอย / ตรอก (Alley)</div>
                <div class="field-label-en">Alley</div>
              </div>
              <v-text-field v-model="form.alley" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ตำบล / แขวง (Tambol)</div>
                <div class="field-label-en">Sub-district</div>
              </div>
              <v-text-field v-model="form.tambol" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>อำเภอ / เขต (District)</div>
                <div class="field-label-en">District</div>
              </div>
              <v-text-field v-model="form.district" hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>จังหวัด <span class="req">*</span></div>
                <div class="field-label-en">Province</div>
              </div>
              <v-autocomplete
                v-model="form.province"
                :items="provinceOptions"
                hide-details
                placeholder="เลือกจังหวัด"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-section-label mt-3 mb-2">ข้อมูลการติดต่อ</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>เบอร์โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field v-model="form.companyPhone" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรสาร</div>
                <div class="field-label-en">Fax</div>
              </div>
              <v-text-field v-model="form.companyFax" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Email</div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="form.companyEmail"
                type="email"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลโรงงาน DOA -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-industry" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ข้อมูลโรงงาน DOA</span>
          <v-spacer />
          <v-btn
            color="export-user"
            variant="tonal"
            size="small"
            prepend-icon="fas fa-plus"
            @click="addFactory"
            >เพิ่ม</v-btn
          >
        </div>
        <v-card-text class="pt-5">
          <div
            v-if="form.factories.length === 0"
            class="text-center text-medium-emphasis text-body-2 py-4"
          >
            ยังไม่มีข้อมูลโรงงาน — กดปุ่ม "เพิ่ม" เพื่อระบุโรงงาน DOA
          </div>
          <div
            v-for="(factory, idx) in form.factories"
            :key="idx"
            class="item-row rounded-lg pa-4 mb-3"
          >
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-body-2 font-weight-semibold">
                โรงงาน {{ idx + 1 }}
              </div>
              <v-btn
                icon="fas fa-trash"
                variant="text"
                size="x-small"
                color="error"
                @click="removeFactory(idx)"
              />
            </div>
            <v-row dense>
              <v-col cols="12" md="8">
                <div class="field-label">
                  <div>ชื่อโรงงาน <span class="req">*</span></div>
                  <div class="field-label-en">Factory Name</div>
                </div>
                <v-text-field v-model="factory.name" hide-details />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>แนบเอกสาร</div>
                  <div class="field-label-en">Attachment</div>
                </div>
                <v-btn
                  :color="factory.file ? 'success' : 'export-user'"
                  variant="tonal"
                  size="small"
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
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-seedling" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ข้อมูล GAP</span>
          <v-spacer />
          <v-btn
            color="export-user"
            variant="tonal"
            size="small"
            prepend-icon="fas fa-plus"
            @click="addGap"
            >เพิ่ม</v-btn
          >
        </div>
        <v-card-text class="pt-5">
          <div
            v-if="form.gaps.length === 0"
            class="text-center text-medium-emphasis text-body-2 py-4"
          >
            ยังไม่มีข้อมูล GAP — กดปุ่ม "เพิ่ม" เพื่อระบุแหล่งผลิต GAP
          </div>
          <div
            v-for="(gap, idx) in form.gaps"
            :key="idx"
            class="item-row rounded-lg pa-4 mb-3"
          >
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-body-2 font-weight-semibold">
                แหล่งผลิต GAP {{ idx + 1 }}
              </div>
              <v-btn
                icon="fas fa-trash"
                variant="text"
                size="x-small"
                color="error"
                @click="removeGap(idx)"
              />
            </div>
            <v-row dense>
              <v-col cols="12" md="5">
                <div class="field-label">
                  <div>ชื่อแหล่งผลิต <span class="req">*</span></div>
                  <div class="field-label-en">Production Site Name</div>
                </div>
                <v-text-field v-model="gap.name" hide-details />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>หน่วยงานรับรอง <span class="req">*</span></div>
                  <div class="field-label-en">Certifying Body</div>
                </div>
                <v-autocomplete
                  v-model="gap.certBody"
                  :items="certBodyOptions"
                  hide-details
                  placeholder="เลือกหน่วยงาน"
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>แนบเอกสาร</div>
                  <div class="field-label-en">Attachment</div>
                </div>
                <v-btn
                  :color="gap.file ? 'success' : 'export-user'"
                  variant="tonal"
                  size="small"
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
    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 1">
      <!-- ประเภทผู้ยื่น -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-users" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ประเภทผู้ประกอบการ</span
          >
        </div>
        <v-card-text class="pt-5">
          <v-radio-group v-model="entityType" color="export-user" inline>
            <v-radio value="natural" label="บุคคลธรรมดา" class="mr-8" />
            <v-radio value="juristic" label="นิติบุคคล" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- เอกสารบุคคลธรรมดา -->
      <v-card
        v-if="entityType === 'natural'"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-user" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >เอกสารกรณีบุคคลธรรมดา</span
          >
        </div>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col v-for="doc in docNatural" :key="doc.key" cols="12">
              <div
                class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3"
              >
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ doc.label }}
                    <v-chip
                      v-if="doc.optional"
                      size="x-small"
                      color="grey"
                      variant="tonal"
                      class="ml-2"
                      >ไม่บังคับ</v-chip
                    >
                  </div>
                </div>
                <div class="d-flex align-center ga-2">
                  <v-chip
                    v-if="uploadedFiles[doc.key]"
                    color="success"
                    size="x-small"
                    variant="tonal"
                    prepend-icon="fas fa-check"
                    >{{ uploadedFiles[doc.key] }}</v-chip
                  >
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'export-user'"
                    variant="tonal"
                    size="small"
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
      <v-card
        v-if="entityType === 'juristic'"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >เอกสารกรณีนิติบุคคล</span
          >
        </div>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col v-for="doc in docJuristic" :key="doc.key" cols="12">
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
                    >{{ uploadedFiles[doc.key] }}</v-chip
                  >
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'export-user'"
                    variant="tonal"
                    size="small"
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
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารเพิ่มเติม</span>
        </div>
        <v-card-text class="pt-5">
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
                    >{{ uploadedFiles[doc.key] }}</v-chip
                  >
                  <v-btn
                    :color="uploadedFiles[doc.key] ? 'success' : 'export-user'"
                    variant="tonal"
                    size="small"
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
    </template>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="grey"
          @click="router.push('/export/user/applications')"
          >ยกเลิก</v-btn
        >
        <v-btn
          v-if="currentStep > 0"
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-arrow-left"
          @click="currentStep--"
          >ย้อนกลับ</v-btn
        >
      </div>
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="export-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="export-user"
          append-icon="fas fa-arrow-right"
          @click="currentStep++"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="export-user"
          prepend-icon="fas fa-paper-plane"
          @click="confirmDialog = true"
          >ยื่นคำขอ</v-btn
        >
      </div>
    </div>

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
          <v-btn
            variant="tonal"
            color="grey"
            block
            @click="confirmDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="export-user" block @click="submitApplication"
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
            color="export-user"
            block
            @click="router.push('/export/user/applications')"
            >ดูรายการคำขอ</v-btn
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
const pageTitle = computed(
  () => typeTitles[route.params.type as string] ?? "คำขอจดทะเบียนผู้ส่งออก",
);

const currentStep = ref(0);
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);
const entityType = ref<"natural" | "juristic">("juristic");

const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "ไฟล์แนบ" },
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
  "สหภาพยุโรป",
  "จีน",
  "เวียดนาม",
  "ญี่ปุ่น",
  "นอร์เวย์",
  "ไอซ์แลนด์",
  "สวิตเซอร์แลนด์",
  "สิงคโปร์",
  "ไต้หวัน",
  "เกาหลีใต้",
  "อื่นๆ",
];

const provinceOptions = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "นครราชสีมา",
  "ขอนแก่น",
  "เชียงราย",
  "ชลบุรี",
  "ระยอง",
  "สุราษฎร์ธานี",
  "สงขลา",
  "ภูเก็ต",
];

const certBodyOptions = [
  "กรมวิชาการเกษตร (DOA)",
  "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)",
  "สำนักงานเกษตรจังหวัด",
  "หน่วยรับรองเอกชน",
];

function stepClass(value: number) {
  if (currentStep.value > value) return "step-done";
  if (currentStep.value === value) return "step-active";
  return "step-pending";
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
  { key: "gap_cert", label: "หนังสือรับรับรอง GAP" },
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
.step-done,
.step-active {
  background: rgb(var(--v-theme-export-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-export-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-export-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-export-user)) !important;
}
</style>
