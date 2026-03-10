<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <v-chip size="x-small" color="primary" variant="tonal" prepend-icon="fas fa-user">รายเดี่ยว</v-chip>
        </div>
        <h1 class="text-h5 font-weight-bold mb-0">คำขอรับรองแหล่งผลิต GAP พืช (รายเดี่ยว)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">กรอกข้อมูลให้ครบถ้วน แล้วยื่นเพื่อรับการตรวจสอบ</p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card class="mb-5">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div class="step-item d-flex flex-column align-center" style="min-width:80px">
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14" color="white" />
                <span v-else class="text-caption font-weight-bold">{{ step.value }}</span>
              </div>
              <div class="text-caption text-center"
                :class="currentStep >= step.value ? 'text-primary font-weight-bold' : 'text-medium-emphasis'">
                {{ step.title }}
              </div>
            </div>
            <div v-if="i < steps.length - 1" class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > step.value }" />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <v-window v-model="currentStep">

      <!-- ═══ Step 1: ประเภทมาตรฐาน + ข้อมูลเกษตรกร ═══ -->
      <v-window-item :value="1">

        <!-- 1.0 ประเภทคำขอ -->
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="primary">fas fa-list-check</v-icon>
            <span class="text-subtitle-2 font-weight-bold">ประเภทคำขอ</span>
          </div>
          <v-card-text class="pt-4">
            <v-radio-group v-model="form.requestType" inline hide-details>
              <v-radio value="new" color="primary" class="mr-6">
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
                    <div class="field-label">เลขที่ใบรับรองเดิม <span class="req">*</span></div>
                    <v-text-field
                      v-model="form.existingCertNo"
                      placeholder="เช่น GAP-2566-XXXXX"
                      prepend-inner-icon="fas fa-certificate"
                      :rules="[rules.required]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">วันหมดอายุใบรับรองเดิม</div>
                    <v-text-field
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
            <v-icon size="15" color="primary">fas fa-certificate</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 1 · ประเภทมาตรฐานที่ขอรับรอง</span>
          </div>
          <v-card-text class="pt-4">
            <v-radio-group v-model="form.standardType" hide-details>
              <v-radio
                value="9001"
                color="primary"
                class="mb-2"
              >
                <template #label>
                  <div>
                    <span class="font-weight-medium">มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชอาหาร</span>
                    <v-chip size="x-small" color="primary" variant="tonal" class="ml-2">มกษ. 9001</v-chip>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="3502"
                color="primary"
                class="mb-2"
              >
                <template #label>
                  <div>
                    <span class="font-weight-medium">มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชสมุนไพร</span>
                    <v-chip size="x-small" color="secondary" variant="tonal" class="ml-2">มกษ. 3502</v-chip>
                  </div>
                </template>
              </v-radio>
              <v-radio value="other" color="primary">
                <template #label>
                  <span class="font-weight-medium">มาตรฐานอื่น ๆ (ระบุ)</span>
                </template>
              </v-radio>
            </v-radio-group>
            <v-text-field
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
            <v-icon size="15" color="primary">fas fa-user</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 2 · ข้อมูลเกษตรกรเจ้าของฟาร์ม</span>
          </div>
          <v-card-text class="pt-5">

            <!-- ชื่อภาษาไทย -->
            <div class="field-section-label mb-3">ข้อมูลส่วนบุคคล</div>
            <v-row dense>
              <v-col cols="12" sm="2">
                <div class="field-label">คำนำหน้า <span class="req">*</span></div>
                <v-select v-model="form.namePrefix" :items="['นาย','นาง','นางสาว','เด็กชาย','เด็กหญิง']" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">ชื่อ (ภาษาไทย) <span class="req">*</span></div>
                <v-text-field v-model="form.firstName" placeholder="ชื่อจริง" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">นามสกุล (ภาษาไทย) <span class="req">*</span></div>
                <v-text-field v-model="form.lastName" placeholder="นามสกุล" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">Firstname</div>
                <v-text-field v-model="form.firstNameEn" placeholder="Firstname" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">Middlename</div>
                <v-text-field v-model="form.middleNameEn" placeholder="Middlename (ถ้ามี)" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">Lastname</div>
                <v-text-field v-model="form.lastNameEn" placeholder="Lastname" hide-details="auto" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ข้อมูลระบุตัวตน -->
            <div class="field-section-label mb-3">ข้อมูลระบุตัวตน</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">เลขบัตรประจำตัวประชาชน <span class="req">*</span></div>
                <v-text-field v-model="form.idCard" placeholder="X-XXXX-XXXXX-XX-X"
                  prepend-inner-icon="fas fa-id-card" :rules="[rules.required, rules.idCard]"
                  maxlength="13" counter hint="ตัวเลข 13 หลัก ไม่ใส่ขีด" persistent-hint />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">รหัสทะเบียนบ้าน</div>
                <v-text-field v-model="form.houseRegCode" placeholder="รหัสทะเบียนบ้าน"
                  prepend-inner-icon="fas fa-house-circle-check" maxlength="11" hide-details="auto" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ที่อยู่ -->
            <div class="field-section-label mb-3">ที่อยู่</div>
            <v-row dense>
              <v-col cols="12" sm="3">
                <div class="field-label">บ้านเลขที่ <span class="req">*</span></div>
                <v-text-field v-model="form.houseNo" placeholder="บ้านเลขที่" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">หมู่บ้าน</div>
                <v-text-field v-model="form.village" placeholder="ชื่อหมู่บ้าน (Village)" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label">หมู่ที่</div>
                <v-text-field v-model="form.moo" placeholder="หมู่ที่" type="number" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ถนน</div>
                <v-text-field v-model="form.road" placeholder="ถนน (Road)" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ตรอก / ซอย</div>
                <v-text-field v-model="form.lane" placeholder="ตรอก / ซอย (Lane / Alley)" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ตำบล / แขวง <span class="req">*</span></div>
                <v-text-field v-model="form.subDistrict" placeholder="ตำบล / แขวง" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">อำเภอ / เขต <span class="req">*</span></div>
                <v-text-field v-model="form.district" placeholder="อำเภอ / เขต" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">จังหวัด <span class="req">*</span></div>
                <v-select v-model="form.province" :items="provinces"
                  prepend-inner-icon="fas fa-map" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">รหัสไปรษณีย์</div>
                <v-text-field v-model="form.postalCode" placeholder="XXXXX" maxlength="5" hide-details="auto" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ข้อมูลการติดต่อ -->
            <div class="field-section-label mb-3">ข้อมูลการติดต่อ</div>
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="field-label">โทรศัพท์ (Tel.)</div>
                <v-text-field v-model="form.tel" placeholder="02X-XXX-XXXX"
                  prepend-inner-icon="fas fa-phone" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">โทรศัพท์มือถือ <span class="req">*</span></div>
                <v-text-field v-model="form.mobile" placeholder="0XX-XXX-XXXX"
                  prepend-inner-icon="fas fa-mobile-screen" :rules="[rules.required, rules.phone]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">E-mail</div>
                <v-text-field v-model="form.email" placeholder="example@email.com"
                  prepend-inner-icon="fas fa-envelope" hint="ใช้รับการแจ้งเตือน" persistent-hint />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 2: ข้อมูลนิติบุคคล + ที่ตั้งฟาร์ม ═══ -->
      <v-window-item :value="2">

        <!-- 2.1 ข้อมูลนิติบุคคล (ถ้ามี) -->
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="primary">fas fa-building</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 3 · ข้อมูลนิติบุคคลเจ้าของฟาร์ม</span>
            <v-spacer />
            <v-switch v-model="form.hasJuristic" label="เป็นนิติบุคคล" color="primary"
              density="compact" hide-details inset />
          </div>
          <v-card-text v-if="form.hasJuristic" class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="8">
                <div class="field-label">ชื่อนิติบุคคล (Juristic person) <span class="req">*</span></div>
                <v-text-field v-model="form.juristicName" placeholder="ชื่อบริษัท / ห้างหุ้นส่วน / องค์กร"
                  prepend-inner-icon="fas fa-building" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เลขทะเบียนนิติบุคคล <span class="req">*</span></div>
                <v-text-field v-model="form.juristicRegNo" placeholder="เลขทะเบียน / เลขผู้เสียภาษี"
                  :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">ชื่อผู้มีอำนาจลงนาม <span class="req">*</span></div>
                <v-text-field v-model="form.juristicSignatory" placeholder="ชื่อ-นามสกุล"
                  prepend-inner-icon="fas fa-signature" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">ที่อยู่นิติบุคคล</div>
                <v-textarea v-model="form.juristicAddress" placeholder="ที่อยู่สำนักงาน"
                  rows="2" auto-grow hide-details="auto" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="field-section-label mb-3">กรณีมีผู้ดูแลแปลงแทนนิติบุคคล</div>
            <v-row dense>
              <v-col cols="12" sm="5">
                <div class="field-label">ชื่อ-นามสกุลผู้ดูแล</div>
                <v-text-field v-model="form.farmManager" placeholder="ชื่อ-นามสกุล" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เลขบัตรประชาชนผู้ดูแล</div>
                <v-text-field v-model="form.farmManagerIdCard" placeholder="13 หลัก" maxlength="13" hide-details="auto" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else class="py-4">
            <p class="text-body-2 text-medium-emphasis mb-0">
              <v-icon icon="fas fa-circle-info" size="14" class="mr-1" />
              หากฟาร์มเป็นของนิติบุคคล (บริษัท, ห้างหุ้นส่วน, องค์กร) กรุณาเปิดใช้งาน
            </p>
          </v-card-text>
        </v-card>

        <!-- 2.2 ที่ตั้งฟาร์ม -->
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="primary">fas fa-location-dot</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 4 · ข้อมูลที่ตั้งฟาร์ม</span>
          </div>
          <v-card-text class="pt-5">
            <v-alert type="info" variant="tonal" density="compact" class="mb-4" prepend-icon="fas fa-circle-info">
              หมายเหตุ: หากที่ตั้งฟาร์มเหมือนที่อยู่ผู้ยื่น สามารถคัดลอกได้
              <v-btn size="x-small" variant="tonal" color="info" class="ml-2" @click="copyAddressToFarm">
                คัดลอกที่อยู่ผู้ยื่น
              </v-btn>
            </v-alert>
            <v-row dense>
              <v-col cols="12" sm="3">
                <div class="field-label">หมู่บ้าน (Village)</div>
                <v-text-field v-model="form.farmVillage" placeholder="ชื่อหมู่บ้าน" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label">หมู่ที่</div>
                <v-text-field v-model="form.farmMoo" placeholder="หมู่ที่" type="number" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ถนน (Road)</div>
                <v-text-field v-model="form.farmRoad" placeholder="ถนน" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="3">
                <div class="field-label">ตรอก / ซอย</div>
                <v-text-field v-model="form.farmLane" placeholder="ตรอก / ซอย" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ตำบล / แขวง <span class="req">*</span></div>
                <v-text-field v-model="form.farmSubDistrict" placeholder="ตำบล / แขวง" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">อำเภอ / เขต <span class="req">*</span></div>
                <v-text-field v-model="form.farmDistrict" placeholder="อำเภอ / เขต" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">จังหวัด <span class="req">*</span></div>
                <v-select v-model="form.farmProvince" :items="provinces"
                  prepend-inner-icon="fas fa-map" :rules="[rules.required]" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">พื้นที่ขอรับรอง (ไร่) <span class="req">*</span></div>
                <v-text-field v-model.number="form.farmArea" placeholder="ระบุพื้นที่"
                  type="number" suffix="ไร่" prepend-inner-icon="fas fa-ruler-combined"
                  :rules="[rules.required]" hide-details="auto" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 3: ข้อมูลพืชที่ขอรับรอง ═══ -->
      <v-window-item :value="3">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="primary">fas fa-seedling</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 5 · ข้อมูลพืชที่ขอรับรอง</span>
            <v-spacer />
            <v-btn size="small" color="primary" variant="tonal" prepend-icon="fas fa-plus"
              @click="addCropRow">เพิ่มพืช</v-btn>
          </div>
          <v-card-text class="pt-5">
            <div v-for="(crop, i) in form.crops" :key="i" class="crop-row mb-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-body-2 font-weight-semibold text-primary">พืชที่ {{ i + 1 }}</span>
                <v-btn v-if="form.crops.length > 1" icon="fas fa-trash" variant="text"
                  color="error" size="small" @click="removeCropRow(i)" />
              </div>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label">ชนิดพืช / พันธุ์พืช <span class="req">*</span></div>
                  <v-combobox v-model="crop.type" :items="cropTypes"
                    placeholder="เลือกหรือพิมพ์ชื่อพืช" :rules="[rules.required]" hide-details="auto" />
                </v-col>
                <v-col cols="6" sm="2">
                  <div class="field-label">พื้นที่ (ไร่) <span class="req">*</span></div>
                  <v-text-field v-model.number="crop.area" type="number" suffix="ไร่"
                    :rules="[rules.required]" hide-details="auto" />
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="field-label">อายุพืช</div>
                  <v-text-field v-model="crop.age" placeholder="เช่น 2 ปี / 180 วัน" hide-details="auto" />
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="field-label">จำนวนต้น (กรณีไม้ผล)</div>
                  <v-text-field v-model.number="crop.treeCount" type="number" suffix="ต้น" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">ระยะเวลาการผลิต (รอบเดือน)</div>
                  <v-text-field v-model="crop.productionPeriod" placeholder="เช่น ม.ค.–มี.ค." hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">คาดว่าจะเก็บเกี่ยว</div>
                  <v-text-field v-model="crop.harvestPeriod" placeholder="รอบเดือน" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">ผลผลิตรวมที่คาดว่าจะได้รับ</div>
                  <v-text-field v-model="crop.expectedYield" placeholder="กก./ตัน ต่อปี" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label">เลขประจำแปลง</div>
                  <v-text-field v-model="crop.plotNo" placeholder="หมายเลขแปลง" hide-details="auto" />
                </v-col>
              </v-row>
              <v-divider v-if="i < form.crops.length - 1" class="mt-4" />
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 4: เอกสารประกอบคำขอ ═══ -->
      <v-window-item :value="4">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="primary">fas fa-paperclip</v-icon>
            <span class="text-subtitle-2 font-weight-bold">หมวดที่ 7 · เอกสารประกอบคำขอ</span>
            <v-spacer />
            <v-chip size="x-small" variant="tonal" color="warning">ไม่เกินไฟล์ละ 10 MB</v-chip>
          </div>
          <v-card-text class="pt-5">
            <v-row dense>

              <!-- 1. บัตร ปชช + ทะเบียนบ้าน -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-id-card" size="13" color="primary" />
                  เอกสารยืนยันตัวตน <span class="req">*</span>
                </div>
                <v-file-input v-model="form.docIdCard" accept=".pdf,.jpg,.png" multiple show-size chips
                  hint="สำเนาบัตรประจำตัวประชาชน" persistent-hint />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-house" size="13" color="primary" />
                  สำเนาทะเบียนบ้าน <span class="req">*</span>
                </div>
                <v-file-input v-model="form.docHouseReg" accept=".pdf,.jpg,.png" multiple show-size chips
                  hint="ทะเบียนบ้านของเกษตรกร" persistent-hint />
              </v-col>

              <!-- 2. นิติบุคคล -->
              <v-col v-if="form.hasJuristic" cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-building" size="13" color="info" />
                  หลักฐานการจดทะเบียนนิติบุคคล
                </div>
                <v-file-input v-model="form.docJuristic" accept=".pdf,.jpg,.png" multiple show-size chips
                  hint="บริษัท / ห้างหุ้นส่วน / องค์กร" persistent-hint />
              </v-col>

              <!-- 3. หนังสือมอบอำนาจ -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-file-signature" size="13" color="secondary" />
                  หนังสือมอบอำนาจ (ถ้ามี)
                </div>
                <v-file-input v-model="form.docPowerOfAttorney" accept=".pdf,.jpg,.png" show-size chips
                  hint="กรณีที่ไม่ได้ยื่นด้วยตนเอง พร้อมสำเนาบัตร ปชช ผู้มอบอำนาจ" persistent-hint />
              </v-col>

              <!-- 4. ใบอนุญาตพิเศษ -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-shield-halved" size="13" color="warning" />
                  ใบอนุญาต / หนังสือสำคัญตามกฎหมาย (ถ้ามี)
                </div>
                <v-file-input v-model="form.docSpecialLicense" accept=".pdf,.jpg,.png" multiple show-size chips
                  hint="สำหรับพืชที่มีกฎหมายควบคุม เช่น กัญชา กัญชง" persistent-hint />
              </v-col>

              <!-- 5. แผนที่ตั้งแปลง -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-map" size="13" color="success" />
                  แผนที่ตั้งแปลง <span class="req">*</span>
                </div>
                <v-file-input v-model="form.docFarmMap" accept=".pdf,.jpg,.png,.kml" multiple show-size chips
                  hint="แผนที่แสดงตำแหน่งแปลง เส้นทาง จุดสังเกต" persistent-hint />
              </v-col>

              <!-- 6. รูปภาพแปลง -->
              <v-col cols="12">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-camera" size="13" color="primary" />
                  รูปภาพแปลงปลูก
                </div>
                <v-file-input v-model="form.photos" prepend-icon="fas fa-camera"
                  accept="image/*" multiple show-size chips
                  hint="JPG, PNG · ความละเอียดไม่ต่ำกว่า 1 MB" persistent-hint />
                <div v-if="photoPreviewUrls.length" class="d-flex flex-wrap ga-2 mt-3">
                  <v-img v-for="(url, idx) in photoPreviewUrls" :key="idx"
                    :src="url" width="80" height="80" cover rounded="lg" class="border" />
                </div>
              </v-col>

              <!-- 7. เอกสารเพิ่มเติม -->
              <v-col cols="12" sm="6">
                <div class="doc-section-label">
                  <v-icon icon="fas fa-paperclip" size="13" color="grey" />
                  เอกสารเพิ่มเติม (ถ้ามี)
                </div>
                <v-file-input v-model="form.docExtra" accept=".pdf,.doc,.docx,.jpg,.png"
                  multiple show-size chips
                  hint="เอกสารแสดงสิทธิ์ในพื้นที่ แผนการผลิต หรือเอกสารรับรองอื่นๆ" persistent-hint />
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ═══ Step 5: ตรวจสอบ & ยื่น ═══ -->
      <v-window-item :value="5">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="success">fas fa-clipboard-check</v-icon>
            <span class="text-subtitle-2 font-weight-bold">ตรวจสอบข้อมูลก่อนยื่น</span>
          </div>
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ประเภทคำขอ">
                    <v-list-item-title>
                      {{ form.requestType === 'new' ? 'สมัครใหม่' : 'ต่ออายุใบรับรอง' }}
                      <span v-if="form.requestType !== 'new' && form.existingCertNo" class="text-medium-emphasis">
                        · {{ form.existingCertNo }}
                      </span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ประเภทมาตรฐาน">
                    <v-list-item-title>
                      {{ form.standardType === '9001' ? 'มกษ. 9001 (พืชอาหาร)'
                        : form.standardType === '3502' ? 'มกษ. 3502 (พืชสมุนไพร)'
                        : form.standardOther || '-' }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ชื่อ-นามสกุล">
                    <v-list-item-title>{{ form.namePrefix }} {{ form.firstName }} {{ form.lastName }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="เลขบัตรประชาชน">
                    <v-list-item-title>{{ form.idCard || '-' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="โทรศัพท์มือถือ">
                    <v-list-item-title>{{ form.mobile || '-' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ที่ตั้งฟาร์ม">
                    <v-list-item-title>{{ farmLocationSummary }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="พื้นที่ขอรับรอง">
                    <v-list-item-title>{{ form.farmArea || '-' }} ไร่</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="จำนวนพืชที่ขอรับรอง">
                    <v-list-item-title>{{ form.crops.length }} ชนิด</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-for="(crop, i) in form.crops" :key="i" :subtitle="`พืชที่ ${i + 1}`">
                    <v-list-item-title>{{ crop.type || '-' }} {{ crop.area ? `· ${crop.area} ไร่` : '' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="นิติบุคคล">
                    <v-list-item-title>{{ form.hasJuristic ? form.juristicName || '-' : 'ไม่มี' }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item subtitle="ประเภทคำขอ">
                    <v-list-item-title>รายเดี่ยว</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-alert type="info" variant="tonal" class="mt-4" prepend-icon="fas fa-circle-info">
              กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยื่น — หลังจากยื่นแล้วจะไม่สามารถแก้ไขได้จนกว่าเจ้าหน้าที่จะแจ้งให้แก้ไข (แก้ไขได้ไม่เกิน 3 ครั้ง)
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>

    </v-window>

    <!-- Nav buttons -->
    <div class="d-flex align-center ga-3 mt-5">
      <v-btn v-if="currentStep > 1" variant="outlined" color="grey-darken-1"
        prepend-icon="fas fa-arrow-left" @click="currentStep--">ย้อนกลับ</v-btn>
      <v-btn variant="tonal" color="grey-darken-1" prepend-icon="fas fa-floppy-disk">บันทึกร่าง</v-btn>
      <v-spacer />
      <v-btn v-if="currentStep < steps.length" color="primary" append-icon="fas fa-arrow-right"
        @click="currentStep++">ถัดไป</v-btn>
      <v-btn v-else color="success" prepend-icon="fas fa-paper-plane" size="large"
        @click="successDialog = true">ยื่นคำขอ</v-btn>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <v-icon icon="fas fa-circle-check" color="success" size="64" class="mb-4" />
          <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h2>
          <p class="text-body-2 text-medium-emphasis mb-5">
            เลขที่คำขอ: <strong class="text-primary">GAP-2567-011</strong><br>
            ประเภท: <strong>รายเดี่ยว</strong><br>
            เจ้าหน้าที่จะติดต่อกลับภายใน 3–5 วันทำการ
          </p>
          <v-btn color="primary" block @click="router.push('/app/applications')">ดูรายการคำขอ</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep   = ref(1)
const successDialog = ref(false)

const steps = [
  { value: 1, title: 'ผู้ยื่น / มาตรฐาน' },
  { value: 2, title: 'ที่ตั้งฟาร์ม' },
  { value: 3, title: 'ข้อมูลพืช' },
  { value: 4, title: 'เอกสารแนบ' },
  { value: 5, title: 'ตรวจสอบ & ยื่น' },
]

function stepClass(v: number) {
  if (currentStep.value > v)   return 'step-done'
  if (currentStep.value === v) return 'step-active'
  return 'step-pending'
}

interface CropRow {
  type: string
  area: number | null
  age: string
  treeCount: number | null
  productionPeriod: string
  harvestPeriod: string
  expectedYield: string
  plotNo: string
}

function newCropRow(): CropRow {
  return { type: '', area: null, age: '', treeCount: null, productionPeriod: '', harvestPeriod: '', expectedYield: '', plotNo: '' }
}

const form = ref({
  // ประเภทคำขอ
  requestType: 'new' as 'new' | 'renew',
  existingCertNo: '',
  existingCertExpiry: '',
  // หมวด 1 — มาตรฐาน
  standardType: '9001',
  standardOther: '',
  // หมวด 2 — เกษตรกร
  namePrefix: 'นาย', firstName: '', lastName: '',
  firstNameEn: '', middleNameEn: '', lastNameEn: '',
  idCard: '', houseRegCode: '',
  houseNo: '', village: '', moo: '', road: '', lane: '',
  subDistrict: '', district: '', province: null as string | null, postalCode: '',
  tel: '', mobile: '', email: '',
  // หมวด 3 — นิติบุคคล
  hasJuristic: false,
  juristicName: '', juristicRegNo: '', juristicSignatory: '', juristicAddress: '',
  farmManager: '', farmManagerIdCard: '',
  // หมวด 4 — ที่ตั้งฟาร์ม
  farmVillage: '', farmMoo: '', farmRoad: '', farmLane: '',
  farmSubDistrict: '', farmDistrict: '', farmProvince: null as string | null, farmArea: null as number | null,
  // หมวด 5 — พืช
  crops: [newCropRow()] as CropRow[],
  // หมวด 7 — เอกสาร
  docIdCard: [] as File[],
  docHouseReg: [] as File[],
  docJuristic: [] as File[],
  docPowerOfAttorney: [] as File[],
  docSpecialLicense: [] as File[],
  docFarmMap: [] as File[],
  photos: [] as File[],
  docExtra: [] as File[],
})

function addCropRow()           { form.value.crops.push(newCropRow()) }
function removeCropRow(i: number) { form.value.crops.splice(i, 1) }

function copyAddressToFarm() {
  form.value.farmVillage     = form.value.village
  form.value.farmMoo         = form.value.moo
  form.value.farmRoad        = form.value.road
  form.value.farmLane        = form.value.lane
  form.value.farmSubDistrict = form.value.subDistrict
  form.value.farmDistrict    = form.value.district
  form.value.farmProvince    = form.value.province
}

const farmLocationSummary = computed(() => {
  const parts = [form.value.farmSubDistrict, form.value.farmDistrict, form.value.farmProvince].filter(Boolean)
  return parts.join(', ') || '-'
})

const photoPreviewUrls = ref<string[]>([])
watch(() => form.value.photos, (files) => {
  photoPreviewUrls.value.forEach(u => URL.revokeObjectURL(u))
  photoPreviewUrls.value = (files ?? []).map(f => URL.createObjectURL(f))
})
onUnmounted(() => photoPreviewUrls.value.forEach(u => URL.revokeObjectURL(u)))

const rules = {
  required: (v: unknown) => !!v || 'กรุณากรอกข้อมูล',
  idCard:   (v: string)  => /^\d{13}$/.test(v) || 'เลขบัตรประชาชน 13 หลัก',
  phone:    (v: string)  => /^0\d{8,9}$/.test(v) || 'รูปแบบเบอร์โทรไม่ถูกต้อง',
}

const provinces = ['กรุงเทพมหานคร','เชียงใหม่','ขอนแก่น','นครราชสีมา','สุพรรณบุรี','เพชรบูรณ์','กาญจนบุรี','นครปฐม','ราชบุรี','สระบุรี']
const cropTypes  = ['ข้าวหอมมะลิ','ข้าวโพด','มันสำปะหลัง','อ้อย','ผักกาดขาว','มะเขือเทศ','กัญชา','กัญชง','ทุเรียน','มะม่วง','ลำไย','ส้ม']
</script>

<style scoped>
.section-header { display: flex; align-items: center; gap: 8px; padding: 12px 16px; }
.field-label { font-size: 13px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.75); margin-bottom: 6px; }
.req { color: rgb(var(--v-theme-error)); }

.field-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(var(--v-theme-primary));
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
  background: rgba(var(--v-theme-primary), 0.03);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.step-circle {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; transition: all 0.2s ease;
}
.step-done    { background: rgb(var(--v-theme-primary)); color: white; }
.step-active  { background: rgb(var(--v-theme-primary)); color: white; box-shadow: 0 0 0 4px rgba(var(--v-theme-primary),0.2); }
.step-pending { background: rgba(var(--v-theme-on-surface),0.1); color: rgba(var(--v-theme-on-surface),0.5); }
.step-line { height: 2px; margin: 0 4px; margin-bottom: 20px; background: rgba(var(--v-theme-on-surface),0.12); transition: background 0.3s; }
.step-line--done { background: rgb(var(--v-theme-primary)); }
</style>
