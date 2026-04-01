<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 mb-1 flex-wrap">
          <h1 class="page-title">ข้อมูลคำขอ</h1>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">
          คำขอเลขที่ {{ app.requestNo }}
        </p>
      </div>
    </div>

    <div style="--v-theme-primary: var(--v-theme-doa-user)">
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
        <!-- หมายเหตุจากเจ้าหน้าที่ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-5">
          <v-card-title class="pa-5 pb-3 section-title">
            <v-icon
              icon="fas fa-triangle-exclamation"
              color="doa-user"
              class="mr-2"
              size="25"
            />
            หมายเหตุจากเจ้าหน้าที่
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <div class="field-label">
              <div>หมายเหตุ รายละเอียดการปรับปรุงแก้ไข</div>
            </div>
            <v-textarea
              v-model="form.remark"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              rows="3"
              placeholder="ระบุเหตุผล..."
            />
          </v-card-text>
        </v-card>
        <!-- ความประสงค์ / เลขทะเบียน -->
        <v-card rounded="xl" elevation="0" class="section-card mb-5">
          <v-card-title class="pa-5 pb-3 section-title">
            <v-icon
              icon="fas fa-file-pen"
              color="doa-user"
              class="mr-2"
              size="25"
            />
            ความประสงค์
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <v-radio-group v-model="form.purpose" color="doa-user">
              <v-radio
                value="register"
                label="ขึ้นทะเบียนโรงงานผลิตสินค้าพืช"
                class="mb-2"
              />
              <v-radio value="renew" label="ต่ออายุทะเบียน" />
            </v-radio-group>

            <v-expand-transition>
              <div v-if="form.purpose === 'renew'" class="ml-10 mt-n5">
                <v-row dense align="center">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="form.registrationNumber"
                      placeholder="กรอกเลขทะเบียนเดิม"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-btn
                      color="doa-user"
                      block
                      height="48"
                      rounded="lg"
                      elevation="0"
                      @click="verifyRegistration"
                    >
                      ตรวจสอบ
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
        <!-- ข้อมูลผู้ยื่นคำขอ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-5">
          <v-card-title class="pa-5 pb-3 section-title">
            <v-icon
              icon="fas fa-user"
              color="doa-user"
              class="mr-2"
              size="18"
            />
            ข้อมูลผู้ยื่นคำขอ
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <!-- ข้อมูลส่วนตัว -->
            <div class="field-section-label mb-2">ข้อมูลส่วนตัว</div>
            <v-row dense>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>ชื่อ-นามสกุล <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantNameTh"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>เลขบัตรประชาชน <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantIdCard"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  maxlength="13"
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>อายุ <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantAge"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>สัญชาติ<span class="req">*</span></div>
                </div>
                <v-select
                  v-model="form.applicantNationality"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  maxlength="13"
                />
              </v-col>
            </v-row>
            <!-- ที่อยู่ -->
            <div class="field-section-label mt-4 mb-2">ที่อยู่</div>
            <v-row dense>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>บ้านเลขที่ <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantAddressNo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>หมู่ <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantMoo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  maxlength="13"
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>ตรอก/ซอย <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantSoi"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>ถนน <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantRoad"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>ตำบล/แขวง<span class="req">*</span></div>
                </div>
                <v-select
                  v-model="form.applicantSubDistrict"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  maxlength="13"
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>อำเภอ/เขต<span class="req">*</span></div>
                </div>
                <v-select
                  v-model="form.applicantDistrict"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  maxlength="13"
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>จังหวัด<span class="req">*</span></div>
                </div>
                <v-select
                  v-model="form.applicantProvince"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  maxlength="13"
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>รหัสไปรษณีย์ <span class="req">*</span></div>
                </div>
                <v-text-field
                  v-model="form.applicantZipCode"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
            </v-row>

            <!-- ข้อมูลติดต่อ -->
            <div class="field-section-label mt-4 mb-2">ข้อมูลติดต่อ</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>โทรศัพท์</div>
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
                  <div>E-maill address</div>
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
        <!-- ข้อมูลโรงงานผลิตสินค้าพืช -->
        <v-card rounded="xl" elevation="0" class="section-card mb-5">
          <v-card-title class="pa-5 pb-3 section-title">
            <v-icon
              icon="fas fa-industry"
              color="doa-user"
              class="mr-2"
              size="18"
            />
            ข้อมูลโรงงานผลิตสินค้าพืช
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <!-- ประเภทสถานประกอบการ -->
            <v-row dense>
              <v-col cols="12" class="mt-4 d-flex">
                <div class="field-label">
                  <div class="mr-4">ประเภทสถานประกอบการ</div>
                </div>
                <v-radio-group
                  v-model="form.factoryType"
                  color="doa-user"
                  inline
                  class="mt-n3"
                >
                  <v-radio value="packing" label="โรงคัดบรรจุ" class="mr-6" />
                  <v-radio value="processing" label="โรงงานแปรรูป" />
                </v-radio-group>
              </v-col>
            </v-row>

            <!-- ชื่อสถานประกอบการ -->
            <div class="field-section-label mb-2">ชื่อสถานประกอบการ</div>
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>ชื่อโรงงาน (ภาษาไทย) <span class="req">*</span></div>
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
                </div>
                <v-text-field
                  v-model="form.factoryNameEn"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
            </v-row>

            <!-- ที่ตั้ง -->
            <div class="field-section-label mt-4 mb-2">ที่ตั้ง</div>
            <v-row dense>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>บ้านเลขที่</div>
                </div>
                <v-text-field
                  v-model="form.factoryAddressNo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>หมู่</div>
                </div>
                <v-text-field
                  v-model="form.factoryMoo"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>อาคาร</div>
                </div>
                <v-text-field
                  v-model="form.factoryBuilding"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>โซน / บล็อก</div>
                </div>
                <v-text-field
                  v-model="form.factoryzone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>ตรอก/ซอย</div>
                </div>
                <v-text-field
                  v-model="form.factorySoi"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>ถนน</div>
                </div>
                <v-text-field
                  v-model="form.factoryRoad"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>ตำบล/แขวง</div>
                </div>
                <v-text-field
                  v-model="form.factorySubDistrict"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>อำเภอ/เขต</div>
                </div>
                <v-text-field
                  v-model="form.factoryDistrict"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>จังหวัด</div>
                </div>
                <v-text-field
                  v-model="form.factoryProvince"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="field-label">
                  <div>รหัสไปรษณีย์</div>
                </div>
                <v-text-field
                  v-model="form.factoryZipCode"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
            </v-row>

            <!-- ข้อมูลติดต่อ -->
            <div class="field-section-label mt-4 mb-2">ข้อมูลติดต่อ</div>
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>โทรศัพท์</div>
                </div>
                <v-text-field
                  v-model="form.factoryPhone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>โทรสาร</div>
                </div>
                <v-text-field
                  v-model="form.factoryFax"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
            </v-row>

            <!-- ข้อมูลติดต่อ -->
            <div class="field-section-label mt-4 mb-2">
              ตำแหน่งที่ตั้งโรงงาน
            </div>
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>ลองจิจูด (Longitude)</div>
                </div>
                <v-text-field
                  v-model="form.factoryLat"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>ลองจิจูด (Longitude)</div>
                </div>
                <v-text-field
                  v-model="form.factoryLng"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <div
                  id="edit-leaflet-map"
                  style="
                    height: 400px;
                    width: 100%;
                    border-radius: 16px;
                    border: 1px solid #ddd;
                    z-index: 1;
                  "
                ></div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!-- ขอบข่ายมาตรฐานที่ขอขึ้นทะเบียน -->
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
              ขอบข่ายมาตรฐานที่ขอขึ้นทะเบียน
            </span>
            <v-btn
              color="doa-user"
              variant="tonal"
              size="small"
              rounded="lg"
              prepend-icon="fas fa-plus"
              @click="openStandardDialog()"
            >
              เพิ่มขอบข่าย
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-table density="comfortable" class="pa-2">
            <thead>
              <tr>
                <th>ขอบข่ายมาตรฐาน</th>
                <th>หน่วยรับรองที่ให้การรับรองมาตรฐาน</th>
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
                    color="warning"
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
        <!-- <v-card rounded="xl" elevation="0" class="section-card mb-5">
                <v-card-title class="pa-5 pb-3 section-title">
                    <v-icon icon="fas fa-user" color="doa-user" class="mr-2" size="18" />
                    เอกสารกรณีบุคคลธรรมดา
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                    <v-row dense>
                        <v-col v-for="doc in docNatural" :key="doc.key" cols="12">
                            <div
                                class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
                                <div>
                                    <div class="text-body-2 font-weight-medium">
                                        {{ doc.label }}
                                    </div>
                                    <div v-if="doc.note" class="text-caption text-medium-emphasis mt-1">
                                        {{ doc.note }}
                                    </div>
                                </div>
                                <div class="d-flex align-center ga-2">
                                    <v-chip v-if="uploadedFiles[doc.key]" color="success" size="x-small" variant="tonal"
                                        prepend-icon="fas fa-check">
                                        {{ uploadedFiles[doc.key] }}
                                    </v-chip>
                                    <v-btn :color="uploadedFiles[doc.key] ? 'success' : 'doa-user'" variant="tonal"
                                        size="small" rounded="lg" prepend-icon="fas fa-upload"
                                        @click="mockUpload(doc.key)">
                                        {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card> -->

        <!-- เอกสารนิติบุคคล -->
        <!-- <v-card rounded="xl" elevation="0" class="section-card mb-5">
                <v-card-title class="pa-5 pb-3 section-title">
                    <v-icon icon="fas fa-building" color="doa-user" class="mr-2" size="18" />
                    เอกสารกรณีนิติบุคคล
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                    <v-row dense>
                        <v-col v-for="doc in docJuristic" :key="doc.key" cols="12">
                            <div
                                class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
                                <div>
                                    <div class="text-body-2 font-weight-medium">
                                        {{ doc.label }}
                                    </div>
                                    <div v-if="doc.note" class="text-caption text-medium-emphasis mt-1">
                                        {{ doc.note }}
                                    </div>
                                </div>
                                <div class="d-flex align-center ga-2">
                                    <v-chip v-if="uploadedFiles[doc.key]" color="success" size="x-small" variant="tonal"
                                        prepend-icon="fas fa-check">
                                        {{ uploadedFiles[doc.key] }}
                                    </v-chip>
                                    <v-btn :color="uploadedFiles[doc.key] ? 'success' : 'doa-user'" variant="tonal"
                                        size="small" rounded="lg" prepend-icon="fas fa-upload"
                                        @click="mockUpload(doc.key)">
                                        {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card> -->

        <!-- เอกสารประกอบเพิ่มเติม -->
        <!-- <v-card rounded="xl" elevation="0" class="section-card mb-5">
                <v-card-title class="pa-5 pb-3 section-title">
                    <v-icon icon="fas fa-paperclip" color="doa-user" class="mr-2" size="18" />
                    เอกสารประกอบเพิ่มเติม
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                    <v-alert variant="tonal" color="warning" rounded="lg" density="compact" class="mb-4"
                        prepend-icon="fas fa-triangle-exclamation">
                        เอกสารลำดับที่ 1–5 ต้องรับรองสำเนาถูกต้องทุกฉบับ
                    </v-alert>
                    <v-row dense>
                        <v-col v-for="doc in docExtra" :key="doc.key" cols="12">
                            <div
                                class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3">
                                <div>
                                    <div class="text-body-2 font-weight-medium">
                                        {{ doc.label }}
                                    </div>
                                </div>
                                <div class="d-flex align-center ga-2">
                                    <v-chip v-if="uploadedFiles[doc.key]" color="success" size="x-small" variant="tonal"
                                        prepend-icon="fas fa-check">
                                        {{ uploadedFiles[doc.key] }}
                                    </v-chip>
                                    <v-btn :color="uploadedFiles[doc.key] ? 'success' : 'doa-user'" variant="tonal"
                                        size="small" rounded="lg" prepend-icon="fas fa-upload"
                                        @click="mockUpload(doc.key)">
                                        {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card> -->

        <!-- เอกสารประกอบเพิ่มเติม -->
        <v-card rounded="xl" elevation="0" class="section-card mb-5">
          <v-card-title class="pa-5 pb-3 section-title">
            <v-icon
              icon="fas fa-paperclip"
              color="doa-user"
              class="mr-2"
              size="18"
            />
            เอกสารไฟล์แนบ
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col v-for="doc in docFileDoa" :key="doc.key" cols="12">
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
          <v-btn variant="tonal" color="grey" @click="goToApplicationList">
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
            @click="nextStep"
          >
            ถัดไป
          </v-btn>
          <v-btn
            v-else
            color="doa-user"
            prepend-icon="fas fa-paper-plane"
            @click="openConfirmDialog"
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
              @click="closeStandardDialog"
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
              ตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน
              เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
            </p>
          </v-card-text>
          <v-card-actions class="px-6 pb-5">
            <v-row no-gutters class="ga-2 w-100">
              <v-col>
                <v-btn
                  variant="tonal"
                  color="grey"
                  rounded="lg"
                  block
                  @click="closeConfirmDialog"
                  >ยกเลิก</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  color="doa-user"
                  rounded="lg"
                  block
                  @click="submitApplication"
                  >ยืนยัน</v-btn
                >
              </v-col>
            </v-row>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "DOAUserApplicationList" });
}

const app = {
  requestNo: "DOA-2569-001",
  status: "reviewing",
  type: "register",
  submittedDate: "01/01/2569",
  updatedDate: "08/01/2569",
  certType: "DOA",
  scope: "แปรรูปพืช",
  productType: "ผักและผลไม้สด",
  province: "นครปฐม",
  applicantNameTh: "นายสมชาย ใจดี",
  applicantNameEn: "Mr. Somchai Jaidee",
  idCard: "1-1000-00000-00-0",
  position: "กรรมการผู้จัดการ",
  phone: "081-234-5678",
  email: "somchai@example.com",
  factoryNameTh: "บริษัท ไทยฟูดโปรดักส์ จำกัด",
  factoryNameEn: "Thai Food Products Co., Ltd.",
  jurRegNo: "0105566012345",
  factoryPhone: "034-123-456",
  factoryAddress: "99 หมู่ 3 ต.ไร่ขิง อ.สามพราน จ.นครปฐม 73210",
  officerNote:
    "กรุณาแนบเพิ่มเติม: หนังสือรับรองบริษัทฉบับล่าสุด (ไม่เกิน 3 เดือน)",
  documents: [
    {
      name: "สำเนาบัตรประชาชนผู้มีอำนาจ.pdf",
      uploadedAt: "01/01/2569",
      verified: true,
    },
    {
      name: "หนังสือรับรองบริษัท.pdf",
      uploadedAt: "01/01/2569",
      verified: false,
    },
    { name: "แผนผังโรงงาน.pdf", uploadedAt: "01/01/2569", verified: true },
    {
      name: "ใบอนุญาตประกอบกิจการ.pdf",
      uploadedAt: "01/01/2569",
      verified: true,
    },
  ],
};

const currentStatusIdx = computed(() => {
  const m = {
    pending: 1,
    reviewing: 2,
    inspection: 3,
    approved: 5,
    rejected: 5,
  };
  return m[app.status] ?? 1;
});

const timeline = computed(() => [
  {
    key: "submitted",
    label: "ยื่นคำขอ",
    desc: app.applicantNameTh,
    date: "01/01/2569",
  },
  {
    key: "received",
    label: "รับคำขอเข้าสู่ระบบ",
    desc: "ระบบอัตโนมัติ",
    date: "02/01/2569",
  },
  {
    key: "reviewing",
    label: "ตรวจสอบเอกสาร",
    desc: "เจ้าหน้าที่ DOA",
    date: "08/01/2569",
    note: currentStatusIdx.value === 2 ? "รอเอกสารเพิ่มเติม" : "",
  },
  {
    key: "inspection",
    label: "ลงพื้นที่ตรวจโรงงาน",
    desc: "ทีมตรวจสอบภาคสนาม",
    date: "",
  },
  {
    key: "committee",
    label: "คณะกรรมการพิจารณา",
    desc: "",
    date: "",
  },
  {
    key: "approved",
    label: "ลงนาม / ออกทะเบียน",
    desc: "",
    date: "",
  },
]);

function isTimelineDone(idx) {
  return idx < currentStatusIdx.value;
}
function isTimelineActive(idx) {
  return idx === currentStatusIdx.value;
}
function isTimelinePending(idx) {
  return idx > currentStatusIdx.value;
}

function statusColor(s) {
  const m = {
    pending: "warning",
    reviewing: "info",
    inspection: "secondary",
    approved: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function statusIcon(s) {
  const m = {
    pending: "fas fa-clock",
    reviewing: "fas fa-magnifying-glass",
    inspection: "fas fa-person-walking",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  const m = {
    pending: "รอพิจารณา",
    reviewing: "อยู่ระหว่างพิจารณา",
    inspection: "ลงพื้นที่ตรวจ",
    approved: "ผ่าน",
    rejected: "ไม่ผ่าน",
  };
  return m[s] ?? s;
}
function typeLabel(t) {
  const m = {
    register: "ขึ้นทะเบียน / ต่ออายุ",
    amendment: "เปลี่ยนแปลงทะเบียน",
    scope: "เพิ่ม / ลดขอบข่าย",
  };
  return m[t] ?? t;
}

onMounted(async () => {
  if (!isRegister.value) {
    form.standards = [
      {
        standard: "มกษ. 9023-2550 (GMP)",
        certBody: "หน่วยรับรอง ABC",
        certNo: "CERT-12345",
        issueDate: "2023-01-01",
        expireDate: "2026-01-01",
      },
    ];
  }
  await nextTick();
  initLeafletMap();
});

function prevStep() {
  currentStep.value--;
}

function nextStep() {
  currentStep.value++;
}
const route = useRoute();

const typeTitles = {
  register: "ยื่นคำขอขึ้นทะเบียน / ต่ออายุทะเบียน",
  amendment: "คำขอเปลี่ยนแปลงทะเบียนโรงงานผลิตสินค้าพืช DOA",
  scope: "คำขอเพิ่ม / ลดขอบข่ายมาตรฐาน",
};
const pageTitle = computed(() => typeTitles[route.params.type] ?? "คำขอ DOA");
const requestType = computed(() => route.params.type);
const isRegister = computed(() => requestType.value === "register");
const isAmendment = computed(() => requestType.value === "amendment");
const isScope = computed(() => requestType.value === "scope");
const currentStep = ref(0);
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "ไฟล์แนบ" },
];

const form = reactive({
  remark: "",
  applicantNameTh: "",
  applicantIdCard: "",
  applicantAge: null,
  applicantNationality: "",
  applicantAddressNo: "",
  applicantMoo: "",
  applicantSoi: "",
  applicantRoad: "",
  applicantSubDistrict: null,
  applicantDistrict: null,
  applicantProvince: null,
  applicantZipCode: "",
  applicantPhone: "",
  applicantFax: "",
  applicantEmail: "",
  purpose: "register",
  factoryNameTh: "",
  factoryNameEn: "",
  factoryAddressNo: "",
  factoryMoo: "",
  factoryBuilding: "",
  factoryzone: "",
  factorySoi: "",
  factoryRoad: "",
  factorySubDistrict: null,
  factoryDistrict: null,
  factoryProvince: null,
  factoryZipCode: "",
  factoryPhone: "",
  factoryFax: "",
  factoryEmail: "",
  factoryType: "packing",
  factoryLat: "",
  factoryLng: "",
  standards: [],
  objectives: [],
  objectiveOther: "",
  objectiveDetails: {},
  scopeOptions: [], // เก็บค่า 'standard' หรือ 'product' สำหรับหน้า Scope[cite: 4]
  standards: [], // ข้อมูลตารางมาตรฐาน
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
    value: "factory_info",
    label: "1. เปลี่ยนแปลงข้อมูลโรงงานผลิตสินค้าพืช",
    children: [
      {
        value: "change_cb",
        label: "เปลี่ยนแปลงหน่วยรับรองโรงงานผลิตสินค้าพืช (CB)",
        hasInput: true,
      },
      { value: "factory_other", label: "อื่น ๆ", hasInput: true },
    ],
  },
  {
    value: "owner_info",
    label: "2. เปลี่ยนแปลงชื่อโรงงานผลิตสินค้าพืช",
    children: [
      {
        value: "juristic_name",
        label:
          "เปลี่ยนแปลงจากชื่อนิติบุคคลเป็นนิติบุคคล (ทะเบียนนิติบุคคลเลขที่เดิม)",
      },
      {
        value: "person_name_gov",
        label:
          "เปลี่ยนแปลงจากชื่อบุคคลธรรมดาเป็นชื่อบุคคลธรรมดา (มีการเปลี่ยนแปลงจากกรมการปกครอง)",
      },
      {
        value: "person_name_com",
        label:
          "เปลี่ยนแปลงจากชื่อบุคคลธรรมดาเป็นชื่อบุคคลธรรมดา (มีการเปลี่ยนแปลงการจดทะเบียนพาณิชย์)",
      },
    ],
  },
  {
    value: "cert_expire",
    label: "3. ใบรับรองมาตรฐานสินค้าเกษตรหมดอายุการรับรอง",
    children: [
      {
        value: "notify_renew",
        label: "แจ้งรายละเอียดการต่ออายุใบรับรองมาตรฐานสินค้าเกษตร",
      },
    ],
  },
  {
    value: "other",
    label: "4. อื่น ๆ โปรดระบุ",
    hasInput: true,
    children: [],
  },
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

const docFileDoa = [
  {
    key: "cert_copy",
    label:
      "1. สำเนาใบรับรองมาตรฐานจากกรมวิชาการเกษตรหรือหน่วยรับรองโรงงานผลิตสินค้าพืช",
  },
  {
    key: "scope_copy",
    label:
      "2. สำเนารายละเอียดขอบข่ายผลิตภัณฑ์ที่ได้รับการรับรองมาตรฐานจากหน่วยรับรอง (กรณีไม่ได้มีการระบุขอบข่ายผลิตภัณฑ์ไว้ในเอกสารข้อ ...)",
  },
  { key: "map_copy", label: "3. แผนภูมิกระบวนการผลิต" },
  {
    key: "haccp_plan",
    label: "4. แผน HACCP PLAN (กรณีขอขึ้นทะเบียน มกษ. 9024-2550 ) ",
  },
];

function openConfirmDialog() {
  confirmDialog.value = true;
}
function closeConfirmDialog() {
  confirmDialog.value = false;
}
function closeStandardDialog() {
  standardDialog.value = false;
}
function saveDraft() {
  draftSnackbar.value = true;
}

function submitApplication() {
  confirmDialog.value = false;
  successDialog.value = true;
}

// ฟังก์ชัน 1: จัดการเมื่อคลิก "หัวข้อหลัก"
const toggleMainGroup = (mainGroup) => {
  const isMainChecked = form.objectives.includes(mainGroup.value);

  // ถ้า "เอาติ๊กออก" ที่หัวข้อหลัก
  if (!isMainChecked) {
    // 1. ล้างค่า Text field ของตัวหัวข้อหลักเอง (ถ้ามี เช่น ข้อ 4)
    if (mainGroup.hasInput) {
      form.objectiveDetails[mainGroup.value] = "";
    }

    // 2. ล้างติ๊กถูกและล้างค่า Text field ของ "ข้อย่อย" ทั้งหมดในกลุ่ม
    if (mainGroup.children) {
      mainGroup.children.forEach((sub) => {
        // เอา ID ออกจาก Array objectives
        const idx = form.objectives.indexOf(sub.value);
        if (idx > -1) form.objectives.splice(idx, 1);

        // ล้างค่าในช่องกรอกของข้อย่อยนั้นๆ
        if (sub.hasInput) {
          form.objectiveDetails[sub.value] = "";
        }
      });
    }
  }
};

// ฟังก์ชัน 2: จัดการเมื่อคลิก "หัวข้อย่อย"
const syncParentStatus = (mainGroup, subItem) => {
  const isSubChecked = form.objectives.includes(subItem.value);

  // --- ส่วนที่ 1: ล้างค่า Text Field เมื่อเอาติ๊กข้อย่อยออก ---
  if (!isSubChecked && subItem.hasInput) {
    form.objectiveDetails[subItem.value] = "";
  }

  // --- ส่วนที่ 2: จัดการความสัมพันธ์กับหัวข้อหลัก ---
  const hasAnyChildChecked = mainGroup.children.some((sub) =>
    form.objectives.includes(sub.value),
  );
  const mainIdx = form.objectives.indexOf(mainGroup.value);

  if (hasAnyChildChecked) {
    // ถ้ามีลูกตัวอื่นยังถูกติ๊กอยู่ -> หัวข้อหลักต้องยังคงถูกติ๊ก
    if (mainIdx === -1) form.objectives.push(mainGroup.value);
  } else {
    // ถ้าไม่มีลูกตัวไหนถูกติ๊กเลย และหัวข้อหลักไม่มี input ของตัวเอง -> เอาติ๊กหลักออก
    if (!mainGroup.hasInput && mainIdx > -1) {
      form.objectives.splice(mainIdx, 1);
    }
  }
};

// 1. ย้ายพิกัดเริ่มต้นมาไว้ด้านบนสุด
const initialPos = [13.782674, 100.54628];
let map = null;
let marker = null;

// คุณสามารถดูสีอื่นๆ ได้ที่: https://github.com/pointhi/leaflet-color-markers
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const initLeafletMap = () => {
  map = L.map("edit-leaflet-map").setView(initialPos, 17); // เริ่มต้นซูมไกลๆ เห็นทั้งประเทศ

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    setMarker(lat, lng);
    map.flyTo([lat, lng], 17);
  });
};

const setMarker = (lat, lng) => {
  form.factoryLat = lat.toFixed(6);
  form.factoryLng = lng.toFixed(6);

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], { draggable: true, icon: redIcon }).addTo(
      map,
    );
    marker.on("dragend", (e) => {
      const newPos = e.target.getLatLng();
      form.factoryLat = newPos.lat.toFixed(6);
      form.factoryLng = newPos.lng.toFixed(6);
    });
  }
};

const updateMapFromInputs = () => {
  // ตรวจสอบค่าว่างก่อน ถ้าว่างให้ถอยกลับและลบหมุด (ไม่ต้องไปยุ่งกับค่าใน form แล้ว)
  if (!form.factoryLat || !form.factoryLng) {
    if (map) {
      map.flyTo(initialPos, 17);
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
    }
    return; // จบการทำงานตรงนี้เลย ไม่ต้องไป parse float ด้านล่าง
  }

  const lat = parseFloat(form.factoryLat);
  const lng = parseFloat(form.factoryLng);

  if (!isNaN(lat) && !isNaN(lng)) {
    const newPos = [lat, lng];
    if (map) {
      map.flyTo(newPos, 18);
      if (marker) {
        marker.setLatLng(newPos);
      } else {
        marker = L.marker(newPos, { draggable: true }).addTo(map);
        marker.on("dragend", (e) => {
          const pos = e.target.getLatLng();
          form.factoryLat = pos.lat.toFixed(6);
          form.factoryLng = pos.lng.toFixed(6);
        });
      }
    }
  }
};

// watch ปรับให้กระชับขึ้น
watch([() => form.factoryLat, () => form.factoryLng], ([lat, lng]) => {
  if (!lat || !lng) {
    updateMapFromInputs(); // ทำงานทันทีถ้าลบจนว่าง
  } else {
    clearTimeout(window.mapTimeout);
    window.mapTimeout = setTimeout(() => {
      updateMapFromInputs();
    }, 800); // เพิ่มเวลาเป็น 800ms เพื่อให้ user มีเวลาพิมพ์เลขให้เสร็จก่อนแผนที่วิ่ง
  }
});
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.info-value {
  font-size: 14px;
  font-weight: 500;
}

.info-stat {
  padding: 10px;
  background: rgba(var(--v-border-color), 0.04);
  border-radius: 10px;
  text-align: center;
}

.timeline-item--done .timeline-dot {
  background: rgb(var(--v-theme-doa-user));
  color: white;
}

.timeline-item--active .timeline-dot {
  background: rgb(var(--v-theme-doa-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-doa-user), 0.2);
}

.timeline-item--pending .timeline-dot {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.3);
}

.timeline-item--done .timeline-line {
  background: rgba(var(--v-theme-doa-user), 0.35);
}

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
