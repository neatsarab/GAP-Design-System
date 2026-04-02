<template>
  <div style="--v-theme-primary: var(--v-theme-gap-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <v-chip
            size="x-small"
            color="gap-user"
            variant="tonal"
            prepend-icon="fas fa-user"
            >รายเดี่ยว</v-chip
          >
        </div>
        <h1 class="page-title mb-0">คำขอรับรองแหล่งผลิต GAP พืช (รายเดี่ยว)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          กรอกข้อมูลให้ครบถ้วน แล้วยื่นเพื่อรับการตรวจสอบ
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
                    ? 'text-gap-user font-weight-bold'
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

    <v-window v-model="currentStep">
      <!-- ═══ Step 1: ประเภทมาตรฐาน + ข้อมูลเกษตรกร ═══ -->
      <v-window-item :value="0">
        <!-- 1.0 ประเภทคำขอ -->
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-list-check</v-icon>
            <span class="text-subtitle-2">ประเภทคำขอ</span>
          </div>
          <v-card-text class="pt-4">
            <v-radio-group v-model="form.requestType" inline hide-details>
              <v-radio value="new" color="gap-user" class="mr-6">
                <template #label>
                  <div class="d-flex align-center ga-2">
                    <span class="font-weight-medium">สมัครใหม่</span>
                  </div>
                </template>
              </v-radio>
              <v-radio value="renew" color="success">
                <template #label>
                  <div class="d-flex align-center ga-2">
                    <span class="font-weight-medium">ต่ออายุใบรับรอง</span>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>

            <!-- แสดงเลขใบรับรองเดิมเมื่อต่ออายุหรือเปลี่ยนแปลง -->
            <v-expand-transition>
              <div v-if="form.requestType !== 'new'" class="mt-4">
                <v-row dense>
                  <v-col cols="12" sm="5">
                    <div class="field-label">
                      เลขที่ใบรับรองเดิม <span class="req">*</span>
                      <span class="field-label-en"
                        >Previous Certificate No.</span
                      >
                    </div>
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      v-model="form.existingCertNo"
                      placeholder="เช่น GAP-2566-XXXXX"
                      prepend-inner-icon="fas fa-certificate"
                      :rules="[rules.required]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">
                      วันหมดอายุใบรับรองเดิม
                      <div></div>
                      <div class="field-label-en">Expiry Date</div>
                    </div>
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      v-model="form.existingCertExpiry"
                      placeholder="วว/ดด/ปปปป"
                      prepend-inner-icon="fas fa-calendar-xmark"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>

        <!-- 1.1 ประเภทมาตรฐาน -->
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-certificate</v-icon>
            <span class="text-subtitle-2">ประเภทมาตรฐานที่ขอรับรอง</span>
          </div>
          <v-card-text class="pt-4">
            <v-radio-group v-model="form.standardType" hide-details>
              <v-radio value="9001" color="gap-user" class="mb-2">
                <template #label>
                  <div>
                    <span class="font-weight-medium"
                      >มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชอาหาร</span
                    >
                    <v-chip
                      size="x-small"
                      color="gap-user"
                      variant="tonal"
                      class="ml-2"
                      >มกษ. 9001</v-chip
                    >
                  </div>
                </template>
              </v-radio>
              <v-radio value="3502" color="gap-user" class="mb-2">
                <template #label>
                  <div>
                    <span class="font-weight-medium"
                      >มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชสมุนไพร</span
                    >
                    <v-chip
                      size="x-small"
                      color="gap-user"
                      variant="tonal"
                      class="ml-2"
                      >มกษ. 3502</v-chip
                    >
                  </div>
                </template>
              </v-radio>
              <v-radio value="other" color="gap-user">
                <template #label>
                  <span class="font-weight-medium">มาตรฐานอื่น ๆ (ระบุ)</span>
                </template>
              </v-radio>
            </v-radio-group>
            <v-text-field
              variant="outlined"
              density="compact"
              rounded="lg"
              v-if="form.standardType === 'other'"
              v-model="form.standardOther"
              placeholder="ระบุมาตรฐาน"
              class="mt-3"
              hide-details="auto"
            />
          </v-card-text>
        </v-card>

        <!-- 1.2 ข้อมูลเกษตรกรเจ้าของฟาร์ม -->
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-user</v-icon>
            <span class="text-subtitle-2">ข้อมูลเกษตรกรเจ้าของฟาร์ม</span>
          </div>
          <v-card-text class="pt-5">
            <!-- ชื่อภาษาไทย -->
            <div class="field-section-label mb-3">ข้อมูลส่วนบุคคล</div>
            <v-row dense>
              <v-col cols="12" sm="2">
                <div class="field-label">
                  <div>คำนำหน้า <span class="req">*</span></div>
                  <div class="field-label-en">Title</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.namePrefix"
                  :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  ชื่อ (ภาษาไทย) <span class="req">*</span>
                  <div class="field-label-en">First Name (Thai)</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.firstName"
                  placeholder="ชื่อจริง"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  นามสกุล (ภาษาไทย) <span class="req">*</span>
                  <div class="field-label-en">Last Name (Thai)</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.lastName"
                  placeholder="นามสกุล"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">Firstname</div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.firstNameEn"
                  placeholder="Firstname"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">Middlename</div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.middleNameEn"
                  placeholder="Middlename (ถ้ามี)"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">Lastname</div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.lastNameEn"
                  placeholder="Lastname"
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ข้อมูลระบุตัวตน -->
            <div class="field-section-label mb-3">ข้อมูลระบุตัวตน</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  เลขบัตรประจำตัวประชาชน <span class="req">*</span>
                  <div class="field-label-en">National ID No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.idCard"
                  placeholder="X-XXXX-XXXXX-XX-X"
                  prepend-inner-icon="fas fa-id-card"
                  :rules="[rules.required, rules.idCard]"
                  maxlength="13"
                  counter
                  hint="ตัวเลข 13 หลัก ไม่ใส่ขีด"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  รหัสทะเบียนบ้าน
                  <div></div>
                  <div class="field-label-en">House Registration Code</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.houseRegCode"
                  placeholder="รหัสทะเบียนบ้าน"
                  prepend-inner-icon="fas fa-house-circle-check"
                  maxlength="11"
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ที่อยู่ -->
            <div class="field-section-label mb-3">ที่อยู่</div>
            <v-row dense>
              <v-col cols="12" sm="3">
                <div class="field-label">
                  <div>บ้านเลขที่ <span class="req">*</span></div>
                  <div class="field-label-en">House No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.houseNo"
                  placeholder="บ้านเลขที่"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">
                  <div>หมู่บ้าน</div>
                  <div class="field-label-en">Village</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.village"
                  placeholder="ชื่อหมู่บ้าน (Village)"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label">
                  <div>หมู่ที่</div>
                  <div class="field-label-en">Moo</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.moo"
                  placeholder="หมู่ที่"
                  type="number"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ถนน</div>
                  <div class="field-label-en">Road</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.road"
                  placeholder="ถนน (Road)"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ตรอก / ซอย</div>
                  <div class="field-label-en">Lane / Alley</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.lane"
                  placeholder="ตรอก / ซอย (Lane / Alley)"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ตำบล / แขวง <span class="req">*</span></div>
                  <div class="field-label-en">Sub-district</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.subDistrict"
                  placeholder="ตำบล / แขวง"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>อำเภอ / เขต <span class="req">*</span></div>
                  <div class="field-label-en">District</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.district"
                  placeholder="อำเภอ / เขต"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  <div>จังหวัด <span class="req">*</span></div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.province"
                  :items="provinces"
                  prepend-inner-icon="fas fa-map"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">
                  <div>รหัสไปรษณีย์</div>
                  <div class="field-label-en">Postal Code</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.postalCode"
                  placeholder="XXXXX"
                  maxlength="5"
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ข้อมูลการติดต่อ -->
            <div class="field-section-label mb-3">ข้อมูลการติดต่อ</div>
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  โทรศัพท์ (Tel.)
                  <div></div>
                  <div class="field-label-en">Phone Number</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.tel"
                  placeholder="02X-XXX-XXXX"
                  prepend-inner-icon="fas fa-phone"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>โทรศัพท์มือถือ <span class="req">*</span></div>
                  <div class="field-label-en">Mobile No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.mobile"
                  placeholder="0XX-XXX-XXXX"
                  prepend-inner-icon="fas fa-mobile-screen"
                  :rules="[rules.required, rules.phone]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>E-mail</div>
                  <div class="field-label-en">Email</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.email"
                  placeholder="example@email.com"
                  prepend-inner-icon="fas fa-envelope"
                  hint="ใช้รับการแจ้งเตือน"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 2: ข้อมูลนิติบุคคล + ที่ตั้งฟาร์ม ═══ -->
      <v-window-item :value="1">
        <!-- 2.1 ข้อมูลนิติบุคคล (ถ้ามี) -->
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-building</v-icon>
            <span class="text-subtitle-2">ข้อมูลนิติบุคคลเจ้าของฟาร์ม</span>
            <v-spacer />
            <v-switch
              v-model="form.hasJuristic"
              label="เป็นนิติบุคคล"
              color="gap-user"
              density="compact"
              hide-details
              inset
            />
          </div>
          <v-card-text v-if="form.hasJuristic" class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อนิติบุคคล (Juristic person) <span class="req">*</span>
                  <div class="field-label-en">Juristic Person Name</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.juristicName"
                  placeholder="ชื่อบริษัท / ห้างหุ้นส่วน / องค์กร"
                  prepend-inner-icon="fas fa-building"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  เลขทะเบียนนิติบุคคล <span class="req">*</span>
                  <div class="field-label-en">Registration No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.juristicRegNo"
                  placeholder="เลขทะเบียนนิติบุคคล"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  ชื่อผู้มีอำนาจลงนาม <span class="req">*</span>
                  <div class="field-label-en">Authorized Signatory</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.juristicSignatory"
                  placeholder="ชื่อ-นามสกุล"
                  prepend-inner-icon="fas fa-signature"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  ที่อยู่นิติบุคคล
                  <div></div>
                  <div class="field-label-en">Juristic Address</div>
                </div>
                <v-textarea
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.juristicAddress"
                  placeholder="ที่อยู่สำนักงาน"
                  rows="2"
                  auto-grow
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="field-section-label mb-3">
              กรณีมีผู้ดูแลแปลงแทนนิติบุคคล
            </div>
            <v-row dense>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  ชื่อ-นามสกุลผู้ดูแล
                  <div></div>
                  <div class="field-label-en">Farm Manager Name</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmManager"
                  placeholder="ชื่อ-นามสกุล"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  เลขบัตรประชาชนผู้ดูแล
                  <div></div>
                  <div class="field-label-en">Manager ID No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmManagerIdCard"
                  placeholder="13 หลัก"
                  maxlength="13"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else class="py-4">
            <p class="text-body-2 text-medium-emphasis mb-0">
              <v-icon icon="fas fa-circle-info" size="14" class="mr-1" />
              หากฟาร์มเป็นของนิติบุคคล (บริษัท, ห้างหุ้นส่วน, องค์กร)
              กรุณาเปิดใช้งาน
            </p>
          </v-card-text>
        </v-card>

        <!-- 2.2 ที่ตั้งฟาร์ม -->
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-location-dot</v-icon>
            <span class="text-subtitle-2">ข้อมูลที่ตั้งฟาร์ม</span>
          </div>
          <v-card-text class="pt-5">
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              class="mb-4"
              prepend-icon="fas fa-circle-info"
            >
              หมายเหตุ: หากที่ตั้งฟาร์มเหมือนที่อยู่ผู้ยื่น สามารถคัดลอกได้
              <v-btn
                size="x-small"
                variant="tonal"
                color="info"
                class="ml-2"
                @click="copyAddressToFarm"
              >
                คัดลอกที่อยู่ผู้ยื่น
              </v-btn>
            </v-alert>
            <v-row dense>
              <v-col cols="12" sm="3">
                <div class="field-label">
                  <div>หมู่บ้าน (Village)</div>
                  <div class="field-label-en">Village</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmVillage"
                  placeholder="ชื่อหมู่บ้าน"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label">
                  <div>หมู่ที่</div>
                  <div class="field-label-en">Moo</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmMoo"
                  placeholder="หมู่ที่"
                  type="number"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ถนน (Road)</div>
                  <div class="field-label-en">Road</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmRoad"
                  placeholder="ถนน"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">
                  <div>ตรอก / ซอย</div>
                  <div class="field-label-en">Lane / Alley</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmLane"
                  placeholder="ตรอก / ซอย"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ตำบล / แขวง <span class="req">*</span></div>
                  <div class="field-label-en">Sub-district</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmSubDistrict"
                  placeholder="ตำบล / แขวง"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>อำเภอ / เขต <span class="req">*</span></div>
                  <div class="field-label-en">District</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmDistrict"
                  placeholder="อำเภอ / เขต"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>จังหวัด <span class="req">*</span></div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.farmProvince"
                  :items="provinces"
                  prepend-inner-icon="fas fa-map"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  พื้นที่ขอรับรอง (ไร่) <span class="req">*</span>
                  <div class="field-label-en">Certified Area (Rai)</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model.number="form.farmArea"
                  placeholder="ระบุพื้นที่"
                  type="number"
                  suffix="ไร่"
                  prepend-inner-icon="fas fa-ruler-combined"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 3: ข้อมูลพืชที่ขอรับรอง ═══ -->
      <v-window-item :value="2">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-seedling</v-icon>
            <span class="text-subtitle-2">ข้อมูลพืชที่ขอรับรอง</span>
            <v-spacer />
            <v-btn
              size="small"
              color="gap-user"
              variant="tonal"
              prepend-icon="fas fa-plus"
              @click="addCropRow"
              >เพิ่มพืช</v-btn
            >
          </div>
          <v-card-text class="pt-5">
            <div v-for="(crop, i) in form.crops" :key="i" class="crop-row mb-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-body-2 font-weight-semibold text-gap-user"
                  >พืชที่ {{ i + 1 }}</span
                >
                <v-btn
                  v-if="form.crops.length > 1"
                  icon="fas fa-trash"
                  variant="text"
                  color="error"
                  size="small"
                  @click="removeCropRow(i)"
                />
              </div>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    ชนิดพืช / พันธุ์พืช <span class="req">*</span>
                    <div class="field-label-en">Crop Type / Variety</div>
                  </div>
                  <v-combobox
                    v-model="crop.type"
                    :items="cropTypes"
                    placeholder="เลือกหรือพิมพ์ชื่อพืช"
                    :rules="[rules.required]"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="6" sm="2">
                  <div class="field-label">
                    <div>พื้นที่ (ไร่) <span class="req">*</span></div>
                    <div class="field-label-en">Area (Rai)</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model.number="crop.area"
                    type="number"
                    suffix="ไร่"
                    :rules="[rules.required]"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="field-label">
                    <div>อายุพืช</div>
                    <div class="field-label-en">Plant Age</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model="crop.age"
                    placeholder="เช่น 2 ปี / 180 วัน"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="field-label">
                    จำนวนต้น (กรณีไม้ผล)
                    <span class="field-label-en"
                      >No. of Trees (Fruit Trees)</span
                    >
                  </div>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model.number="crop.treeCount"
                    type="number"
                    suffix="ต้น"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">
                    ระยะเวลาการผลิต (รอบเดือน)
                    <span class="field-label-en"
                      >Production Period (Months)</span
                    >
                  </div>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model="crop.productionPeriod"
                    placeholder="เช่น ม.ค.–มี.ค."
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">
                    คาดว่าจะเก็บเกี่ยว
                    <div></div>
                    <div class="field-label-en">Expected Harvest Period</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model="crop.harvestPeriod"
                    placeholder="รอบเดือน"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">
                    ผลผลิตรวมที่คาดว่าจะได้รับ
                    <div></div>
                    <div class="field-label-en">Expected Total Yield</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model="crop.expectedYield"
                    placeholder="กก./ตัน ต่อปี"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">
                    <div>เลขประจำแปลง</div>
                    <div class="field-label-en">Plot No.</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model="crop.plotNo"
                    placeholder="หมายเลขแปลง"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-divider v-if="i < form.crops.length - 1" class="mt-4" />
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 4: เอกสารประกอบคำขอ ═══ -->
      <v-window-item :value="3">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-paperclip</v-icon>
            <span class="text-subtitle-2">เอกสารประกอบคำขอ</span>
            <v-spacer />
            <v-chip size="x-small" variant="tonal" color="gap-user"
              >ไม่เกินไฟล์ละ 10 MB</v-chip
            >
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <!-- 1. บัตร ปชช + ทะเบียนบ้าน -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-id-card" size="13" color="gap-user" />
                  เอกสารยืนยันตัวตน <span class="req">*</span>
                </div>
                <v-file-input
                  v-model="form.docIdCard"
                  accept=".pdf,.jpg,.png"
                  multiple
                  show-size
                  chips
                  hint="สำเนาบัตรประจำตัวประชาชน"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-house" size="13" color="gap-user" />
                  สำเนาทะเบียนบ้าน <span class="req">*</span>
                </div>
                <v-file-input
                  v-model="form.docHouseReg"
                  accept=".pdf,.jpg,.png"
                  multiple
                  show-size
                  chips
                  hint="ทะเบียนบ้านของเกษตรกร"
                  persistent-hint
                />
              </v-col>

              <!-- 2. นิติบุคคล -->
              <v-col v-if="form.hasJuristic" cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-building" size="13" color="info" />
                  หลักฐานการจดทะเบียนนิติบุคคล
                </div>
                <v-file-input
                  v-model="form.docJuristic"
                  accept=".pdf,.jpg,.png"
                  multiple
                  show-size
                  chips
                  hint="บริษัท / ห้างหุ้นส่วน / องค์กร"
                  persistent-hint
                />
              </v-col>

              <!-- 3. หนังสือมอบอำนาจ -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon
                    icon="fas fa-file-signature"
                    size="13"
                    color="gap-user"
                  />
                  หนังสือมอบอำนาจ (ถ้ามี)
                </div>
                <v-file-input
                  v-model="form.docPowerOfAttorney"
                  accept=".pdf,.jpg,.png"
                  show-size
                  chips
                  hint="กรณีที่ไม่ได้ยื่นด้วยตนเอง พร้อมสำเนาบัตร ปชช ผู้มอบอำนาจ"
                  persistent-hint
                />
              </v-col>

              <!-- 4. ใบอนุญาตพิเศษ -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon
                    icon="fas fa-shield-halved"
                    size="13"
                    color="gap-user"
                  />
                  ใบอนุญาต / หนังสือสำคัญตามกฎหมาย (ถ้ามี)
                </div>
                <v-file-input
                  v-model="form.docSpecialLicense"
                  accept=".pdf,.jpg,.png"
                  multiple
                  show-size
                  chips
                  hint="สำหรับพืชที่มีกฎหมายควบคุม เช่น กัญชา กัญชง"
                  persistent-hint
                />
              </v-col>

              <!-- 5. แผนที่ตั้งแปลง -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-map" size="13" color="success" />
                  แผนที่ตั้งแปลง <span class="req">*</span>
                </div>
                <v-file-input
                  v-model="form.docFarmMap"
                  accept=".pdf,.jpg,.png,.kml"
                  multiple
                  show-size
                  chips
                  hint="แผนที่แสดงตำแหน่งแปลง เส้นทาง จุดสังเกต"
                  persistent-hint
                />
              </v-col>

              <!-- 6. รูปภาพแปลง -->
              <v-col cols="12">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-camera" size="13" color="gap-user" />
                  รูปภาพแปลงปลูก
                </div>
                <v-file-input
                  v-model="form.photos"
                  prepend-icon="fas fa-camera"
                  accept="image/*"
                  multiple
                  show-size
                  chips
                  hint="JPG, PNG · ความละเอียดไม่ต่ำกว่า 1 MB"
                  persistent-hint
                />
                <div
                  v-if="photoPreviewUrls.length"
                  class="d-flex flex-wrap ga-2 mt-3"
                >
                  <v-img
                    v-for="(url, idx) in photoPreviewUrls"
                    :key="idx"
                    :src="url"
                    width="80"
                    height="80"
                    cover
                    rounded="lg"
                    class="border"
                  />
                </div>
              </v-col>

              <!-- 7. เอกสารอื่นๆ -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-paperclip" size="13" color="grey" />
                  เอกสารอื่นๆ
                </div>
                <v-file-input
                  v-model="form.docExtra"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  multiple
                  show-size
                  chips
                  hint="เอกสารแสดงสิทธิ์ในพื้นที่ แผนการผลิต หรือเอกสารรับรองอื่นๆ"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 5: ตรวจสอบ & ยื่น ═══ -->
      <v-window-item :value="4">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="success">fas fa-clipboard-check</v-icon>
            <span class="text-subtitle-2">ตรวจสอบข้อมูลก่อนยื่น</span>
          </div>
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ประเภทคำขอ">
                    <v-list-item-title>
                      {{
                        form.requestType === "new"
                          ? "สมัครใหม่"
                          : "ต่ออายุใบรับรอง"
                      }}
                      <span
                        v-if="form.requestType !== 'new' && form.existingCertNo"
                        class="text-medium-emphasis"
                      >
                        · {{ form.existingCertNo }}
                      </span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ประเภทมาตรฐาน">
                    <v-list-item-title>
                      {{
                        form.standardType === "9001"
                          ? "มกษ. 9001 (พืชอาหาร)"
                          : form.standardType === "3502"
                            ? "มกษ. 3502 (พืชสมุนไพร)"
                            : form.standardOther || "-"
                      }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ชื่อ-นามสกุล">
                    <v-list-item-title
                      >{{ form.namePrefix }} {{ form.firstName }}
                      {{ form.lastName }}</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item subtitle="เลขบัตรประชาชน">
                    <v-list-item-title>{{
                      form.idCard || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="โทรศัพท์มือถือ">
                    <v-list-item-title>{{
                      form.mobile || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ที่ตั้งฟาร์ม">
                    <v-list-item-title>{{
                      farmLocationSummary
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="พื้นที่ขอรับรอง">
                    <v-list-item-title
                      >{{ form.farmArea || "-" }} ไร่</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="จำนวนพืชที่ขอรับรอง">
                    <v-list-item-title
                      >{{ form.crops.length }} ชนิด</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    v-for="(crop, i) in form.crops"
                    :key="i"
                    :subtitle="`พืชที่ ${i + 1}`"
                  >
                    <v-list-item-title
                      >{{ crop.type || "-" }}
                      {{
                        crop.area ? `· ${crop.area} ไร่` : ""
                      }}</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item subtitle="นิติบุคคล">
                    <v-list-item-title>{{
                      form.hasJuristic ? form.juristicName || "-" : "ไม่มี"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ประเภทคำขอ">
                    <v-list-item-title>รายเดี่ยว</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-alert
              type="info"
              variant="tonal"
              class="mt-4"
              prepend-icon="fas fa-circle-info"
            >
              กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยื่น —
              หลังจากยื่นแล้วจะไม่สามารถแก้ไขได้จนกว่าเจ้าหน้าที่จะแจ้งให้แก้ไข
              (แก้ไขได้ไม่เกิน 3 ครั้ง)
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="grey" @click="goToApplicationList"
          >ยกเลิก</v-btn
        >
        <v-btn
          v-if="currentStep > 0"
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-arrow-left"
          @click="prevStep"
          >ย้อนกลับ</v-btn
        >
      </div>
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="gap-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="gap-user"
          append-icon="fas fa-arrow-right"
          @click="nextStep"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="gap-user"
          prepend-icon="fas fa-paper-plane"
          @click="openSuccessDialog"
          >ยื่นคำขอ</v-btn
        >
      </div>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <v-icon
            icon="fas fa-circle-check"
            color="success"
            size="64"
            class="mb-4"
          />
          <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h2>
          <p class="text-body-2 text-medium-emphasis mb-5">
            เลขที่คำขอ: <strong class="text-gap-user">GAP-2569-011</strong
            ><br />
            ประเภท: <strong>รายเดี่ยว</strong><br />
            เจ้าหน้าที่จะติดต่อกลับภายใน 3–5 วันทำการ
          </p>
          <v-btn color="gap-user" block @click="goToApplicationList"
            >ดูรายการคำขอ</v-btn
          >
        </v-card-text>
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
import { ref, computed, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);

function goToApplicationList() {
  router.push({ name: "ApplicationList" });
}

function prevStep() {
  currentStep.value--;
}

function nextStep() {
  currentStep.value++;
}
const successDialog = ref(false);
function openSuccessDialog() {
  successDialog.value = true;
}
const draftSnackbar = ref(false);

const steps = [
  { value: 0, title: "ผู้ยื่น / มาตรฐาน" },
  { value: 1, title: "ที่ตั้งฟาร์ม" },
  { value: 2, title: "ข้อมูลพืช" },
  { value: 3, title: "เอกสารแนบ" },
  { value: 4, title: "ตรวจสอบ & ยื่น" },
];

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function saveDraft() {
  draftSnackbar.value = true;
}

function newCropRow() {
  return {
    type: "",
    area: null,
    age: "",
    treeCount: null,
    productionPeriod: "",
    harvestPeriod: "",
    expectedYield: "",
    plotNo: "",
  };
}

const form = ref({
  // ประเภทคำขอ
  requestType: "new",
  existingCertNo: "",
  existingCertExpiry: "",
  // หมวด 1 — มาตรฐาน
  standardType: "9001",
  standardOther: "",
  // หมวด 2 — เกษตรกร
  namePrefix: "นาย",
  firstName: "",
  lastName: "",
  firstNameEn: "",
  middleNameEn: "",
  lastNameEn: "",
  idCard: "",
  houseRegCode: "",
  houseNo: "",
  village: "",
  moo: "",
  road: "",
  lane: "",
  subDistrict: "",
  district: "",
  province: null,
  postalCode: "",
  tel: "",
  mobile: "",
  email: "",
  // หมวด 3 — นิติบุคคล
  hasJuristic: false,
  juristicName: "",
  juristicRegNo: "",
  juristicSignatory: "",
  juristicAddress: "",
  farmManager: "",
  farmManagerIdCard: "",
  // หมวด 4 — ที่ตั้งฟาร์ม
  farmVillage: "",
  farmMoo: "",
  farmRoad: "",
  farmLane: "",
  farmSubDistrict: "",
  farmDistrict: "",
  farmProvince: null,
  farmArea: null,
  // หมวด 5 — พืช
  crops: [newCropRow()],
  // หมวด 7 — เอกสาร
  docIdCard: [],
  docHouseReg: [],
  docJuristic: [],
  docPowerOfAttorney: [],
  docSpecialLicense: [],
  docFarmMap: [],
  photos: [],
  docExtra: [],
});

function addCropRow() {
  form.value.crops.push(newCropRow());
}
function removeCropRow(i) {
  form.value.crops.splice(i, 1);
}

function copyAddressToFarm() {
  form.value.farmVillage = form.value.village;
  form.value.farmMoo = form.value.moo;
  form.value.farmRoad = form.value.road;
  form.value.farmLane = form.value.lane;
  form.value.farmSubDistrict = form.value.subDistrict;
  form.value.farmDistrict = form.value.district;
  form.value.farmProvince = form.value.province;
}

const farmLocationSummary = computed(() => {
  const parts = [
    form.value.farmSubDistrict,
    form.value.farmDistrict,
    form.value.farmProvince,
  ].filter(Boolean);
  return parts.join(", ") || "-";
});

const photoPreviewUrls = ref([]);
watch(
  () => form.value.photos,
  (files) => {
    photoPreviewUrls.value.forEach((u) => URL.revokeObjectURL(u));
    photoPreviewUrls.value = (files ?? []).map((f) => URL.createObjectURL(f));
  },
);
onUnmounted(() =>
  photoPreviewUrls.value.forEach((u) => URL.revokeObjectURL(u)),
);

const rules = {
  required: (v) => !!v || "กรุณากรอกข้อมูล",
  idCard: (v) => /^\d{13}$/.test(v) || "เลขบัตรประชาชน 13 หลัก",
  phone: (v) => /^0\d{8,9}$/.test(v) || "รูปแบบเบอร์โทรไม่ถูกต้อง",
};

const provinces = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "ขอนแก่น",
  "นครราชสีมา",
  "สุพรรณบุรี",
  "เพชรบูรณ์",
  "กาญจนบุรี",
  "นครปฐม",
  "ราชบุรี",
  "สระบุรี",
];
const cropTypes = [
  "ข้าวหอมมะลิ",
  "ข้าวโพด",
  "มันสำปะหลัง",
  "อ้อย",
  "ผักกาดขาว",
  "มะเขือเทศ",
  "กัญชา",
  "กัญชง",
  "ทุเรียน",
  "มะม่วง",
  "ลำไย",
  "ส้ม",
];
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-gap-user));
  --step-color-tint: rgba(var(--v-theme-gap-user), 0.2);
}

.field-section-label {
  letter-spacing: 0.08em;
  opacity: 0.8;
}

.doc-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 6px;
}

.crop-row {
  padding: 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-gap-user), 0.03);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-gap-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-gap-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-gap-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-gap-user)) !important;
}
</style>
