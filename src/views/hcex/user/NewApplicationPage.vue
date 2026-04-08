<template>
  <div style="--v-theme-primary: var(--v-theme-hcex-user)">
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
                    ? 'text-hcex-user font-weight-bold'
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

    <!-- ─── STEP 1: ประเภทคำขอ ─── -->
    <template v-if="currentStep === 0">
      <!-- ประเภทคำขอ -->
      <v-card
        v-if="
          !['amendment', 'history', 'lab', 'newrequest'].includes(
            route.params.type,
          )
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-list-check" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ประเภทคำขอ</span>
        </div>
        <v-card-text class="pt-5">
          <v-radio-group
            density="compact"
            v-model="form.requestType"
            color="hcex-user"
            inline
          >
            <v-radio value="register" label="คำขอขึ้นทะเบียน" class="mr-8" />
            <v-radio value="renewal" label="คำขอต่ออายุ" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- ค้นหาใบทะเบียน (amendment only) -->
      <v-card
        v-if="route.params.type === 'amendment'"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-certificate" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ระบุใบรับรองสุขอนามัยพืชที่ต้องการแก้ไข</span
          >
        </div>
        <v-card-text class="pt-5">
          <div class="field-label mb-2">
            เลขที่ใบรับรองสุขอนามัยพืช <span class="req">*</span>
            <div class="field-label-en">Health Certificate No.</div>
          </div>
          <v-row dense align="center">
            <v-col cols="12" sm="6">
              <v-text-field
                density="compact"
                variant="outlined"
                rounded="lg"
                v-model="certSearchNo"
                placeholder="เช่น HC-2568-00123"
                prepend-inner-icon="fas fa-certificate"
                hide-details
                @keyup.enter="searchCert"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="hcex-user"
                variant="tonal"
                prepend-icon="fas fa-magnifying-glass"
                :loading="certSearchLoading"
                @click="searchCert"
              >
                ค้นหา
              </v-btn>
            </v-col>
          </v-row>

          <!-- Not found -->
          <v-alert
            v-if="certSearchNotFound"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-3"
            prepend-icon="fas fa-circle-xmark"
          >
            ไม่พบใบรับรองเลขที่ "{{ certSearchNo }}" กรุณาตรวจสอบอีกครั้ง
          </v-alert>

          <!-- Result card -->
          <v-card
            v-if="certSearchResult && !certSelected"
            elevation="0"
            rounded="lg"
            class="mt-4"
            :style="
              certSearchResult.isExpired
                ? 'background: rgba(var(--v-theme-error), 0.1); border: 1px solid rgba(var(--v-theme-error), 0.25)'
                : 'background: rgba(var(--v-theme-success), 0.08); border: 1px solid rgba(var(--v-theme-success), 0.2)'
            "
          >
            <v-card-text class="pa-4">
              <v-row align="center" no-gutters>
                <v-col>
                  <div class="text-caption text-medium-emphasis mb-1">
                    เลขที่ใบรับรองสุขอนามัยพืช
                  </div>
                  <div class="text-body-1 font-weight-bold text-hcex-user">
                    {{ certSearchResult.certNo }}
                  </div>
                  <div class="text-body-2 mt-1">
                    {{ certSearchResult.companyNameTh }}
                  </div>
                  <div class="d-flex align-center ga-2 mt-2">
                    <v-chip
                      size="x-small"
                      :color="certSearchResult.isExpired ? 'error' : 'success'"
                      variant="tonal"
                    >
                      {{ certSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis">
                      หมดอายุ: {{ certSearchResult.expiryDate }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column ga-2 pl-4">
                  <v-btn
                    size="small"
                    variant="flat"
                    color="hcex-user"
                    prepend-icon="fas fa-eye"
                    @click="viewCertDialog = true"
                  >
                    ดูใบรับรอง
                  </v-btn>
                  <v-btn
                    size="small"
                    color="hcex-user"
                    variant="flat"
                    prepend-icon="fas fa-check"
                    :disabled="certSearchResult.isExpired"
                    @click="selectCert"
                  >
                    เลือกใบรับรองนี้
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Selected cert chip -->
          <div v-if="certSelected" class="mt-4 d-flex align-center ga-2">
            <v-icon icon="fas fa-circle-check" color="success" size="16" />
            <span class="text-body-2 font-weight-medium text-success">
              เลือกใบรับรอง:
            </span>
            <v-chip color="hcex-user" variant="tonal" size="small">
              {{ certSelected.certNo }} — {{ certSelected.companyNameTh }}
            </v-chip>
            <v-btn
              icon="fas fa-xmark"
              size="x-small"
              variant="text"
              color="grey"
              @click="certSelected = null"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- รายการที่ต้องการแก้ไข (amendment only, after cert selected) -->
      <v-card
        v-if="route.params.type === 'amendment' && certSelected"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-pencil" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >เลือกรายการที่ต้องการแก้ไข</span
          >
        </div>
        <v-card-text class="pt-4">
          <div class="amend-list">
            <template v-for="item in amendItems" :key="item.value">
              <div
                v-if="!item.onlyPersonal || entityType === 'personal'"
                class="amend-item"
                :class="{
                  'amend-item--active': amendFields.includes(item.value),
                }"
              >
                <!-- Checkbox header -->
                <div class="d-flex align-center justify-space-between">
                  <v-checkbox
                    v-model="amendFields"
                    :value="item.value"
                    color="hcex-user"
                    density="compact"
                    hide-details
                    class="checkbox-spacious"
                  >
                    <template #label>
                      <div>
                        <div class="text-body-2 font-weight-medium">
                          {{ item.label }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ item.labelEn }}
                        </div>
                      </div>
                    </template>
                  </v-checkbox>
                  <v-chip
                    v-if="item.source"
                    size="x-small"
                    color="hcex-user"
                    variant="tonal"
                    class="mr-2"
                  >
                    {{ item.source }}
                  </v-chip>
                </div>

                <!-- Expanded detail -->
                <v-expand-transition>
                  <div
                    v-if="amendFields.includes(item.value)"
                    class="amend-detail-field"
                  >
                    <!-- ชื่อสถานประกอบการ (บนใบทะเบียน → DBD) -->
                    <template v-if="item.inputType === 'company_name'">
                      <div class="field-section-label mb-2">
                        ข้อมูลปัจจุบัน (บนใบรับรอง)
                      </div>
                      <v-row dense class="mb-3">
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อสถานประกอบการ (ภาษาไทย)</div>
                            <div class="field-label-en">
                              Company Name (Thai)
                            </div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.companyNameTh"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อสถานประกอบการ (ภาษาอังกฤษ)</div>
                            <div class="field-label-en">
                              Company Name (English)
                            </div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.companyNameEn"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                      <div class="field-section-label mb-2">
                        ข้อมูลใหม่ (DBD)
                      </div>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อสถานประกอบการ (ภาษาไทย)</div>
                            <div class="field-label-en">
                              Company Name (Thai)
                            </div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.company_name.nameTh"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อสถานประกอบการ (ภาษาอังกฤษ)</div>
                            <div class="field-label-en">
                              Company Name (English)
                            </div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.company_name.nameEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                      </v-row>
                    </template>

                    <!-- ที่อยู่สถานประกอบการ (บนใบทะเบียน → DBD) -->
                    <template v-else-if="item.inputType === 'address'">
                      <div class="field-section-label mb-2">
                        ข้อมูลปัจจุบัน (บนใบรับรอง)
                      </div>
                      <v-row dense class="mb-3">
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>บ้านเลขที่</div>
                            <div class="field-label-en">House No.</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.houseNo"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตรอก/ซอย</div>
                            <div class="field-label-en">Alley / Soi</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.alley"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ถนน</div>
                            <div class="field-label-en">Road</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.road"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตำบล/แขวง</div>
                            <div class="field-label-en">Sub-district</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.tambol"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>อำเภอ/เขต</div>
                            <div class="field-label-en">District</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.district"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>จังหวัด</div>
                            <div class="field-label-en">Province</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.province"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>รหัสไปรษณีย์</div>
                            <div class="field-label-en">Postcode</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.zipcode"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                      <v-divider class="my-3" />
                      <div
                        class="text-caption font-weight-medium text-medium-emphasis mb-2"
                      >
                        English
                      </div>
                      <v-row dense class="mb-3">
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>บ้านเลขที่</div>
                            <div class="field-label-en">House No.</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.houseNoEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตรอก / ซอย</div>
                            <div class="field-label-en">Alley / Soi</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.alleyEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ถนน</div>
                            <div class="field-label-en">Road</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.roadEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตำบล / แขวง</div>
                            <div class="field-label-en">Sub-district</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.tambolEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>อำเภอ / เขต</div>
                            <div class="field-label-en">District</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.districtEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>จังหวัด</div>
                            <div class="field-label-en">Province</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.provinceEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                      </v-row>

                      <div class="field-section-label mb-2">
                        ข้อมูลใหม่ (DBD)
                      </div>

                      <div
                        class="text-caption font-weight-medium text-medium-emphasis mb-2"
                      >
                        ภาษาไทย
                      </div>
                      <v-row dense class="mb-2">
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>บ้านเลขที่</div>
                            <div class="field-label-en">House No.</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.houseNo"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>หมู่</div>
                            <div class="field-label-en">Moo</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.moo"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตรอก/ซอย</div>
                            <div class="field-label-en">Alley / Soi</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.alley"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ถนน</div>
                            <div class="field-label-en">Road</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.road"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตำบล/แขวง</div>
                            <div class="field-label-en">Sub-district</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.tambol"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>อำเภอ/เขต</div>
                            <div class="field-label-en">District</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.district"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>จังหวัด</div>
                            <div class="field-label-en">Province</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.province"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>รหัสไปรษณีย์</div>
                            <div class="field-label-en">Postcode</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.zipcode"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                      </v-row>

                      <v-divider class="my-3" />
                      <div
                        class="text-caption font-weight-medium text-medium-emphasis mb-2"
                      >
                        English
                      </div>
                      <v-row dense>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>บ้านเลขที่</div>
                            <div class="field-label-en">House No.</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.houseNoEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตรอก / ซอย</div>
                            <div class="field-label-en">Alley / Soi</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.alleyEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ถนน</div>
                            <div class="field-label-en">Road</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.roadEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>ตำบล / แขวง</div>
                            <div class="field-label-en">Sub-district</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.tambolEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>อำเภอ / เขต</div>
                            <div class="field-label-en">District</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.districtEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label">
                            <div>จังหวัด</div>
                            <div class="field-label-en">Province</div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.address.provinceEn"
                            hide-details="auto"
                            class="field-readonly"
                          />
                        </v-col>
                      </v-row>
                    </template>

                    <!-- วันหมดอายุ -->
                    <template v-else-if="item.inputType === 'expire_date'">
                      <div class="field-section-label mb-2">
                        ข้อมูลปัจจุบัน (บนใบรับรอง)
                      </div>
                      <v-row dense class="mb-3">
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>วันหมดอายุ</div>
                            <div class="field-label-en">Expire date</div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.expiryDate"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                      <div class="field-section-label mb-2">
                        ข้อมูลใหม่ <span class="req">*</span>
                      </div>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>วันหมดอายุใหม่</div>
                            <div class="field-label-en">New Expiry Date</div>
                          </div>
                          <v-menu
                            v-model="expireDateMenu"
                            :close-on-content-click="false"
                            location="bottom start"
                          >
                            <template #activator="{ props }">
                              <v-text-field
                                v-bind="props"
                                density="compact"
                                :model-value="expireDateBE"
                                readonly
                                clearable
                                prepend-inner-icon="fas fa-calendar"
                                placeholder="เลือกวันที่ / เดือน / ปี"
                                :hint="
                                  certSelected
                                    ? `ห้ามเลือกเกินวันหมดอายุเดิม (${certSelected.expiryDate})`
                                    : ''
                                "
                                persistent-hint
                                style="cursor: pointer"
                                @click:clear.stop="expireDateObj = null"
                                class="field-editable"
                              />
                            </template>
                            <v-date-picker
                              v-model="expireDateObj"
                              :max="certExpiryMaxDate"
                              color="hcex-user"
                              show-adjacent-months
                              :hide-header="!expireDateObj"
                              title="เลือกวันที่"
                              locale="th"
                              @update:model-value="expireDateMenu = false"
                            />
                          </v-menu>
                        </v-col>
                      </v-row>
                    </template>
                  </div>
                </v-expand-transition>
              </div>
            </template>
          </div>
        </v-card-text>
      </v-card>

      <!-- View Cert Dialog -->
      <v-dialog v-model="viewCertDialog" max-width="480">
        <v-card rounded="xl">
          <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
            <v-icon icon="fas fa-certificate" color="hcex-user" size="18" />
            ใบรับรองสุขอนามัยพืช
            <v-spacer />
            <v-btn
              icon="fas fa-xmark"
              size="small"
              variant="text"
              color="grey"
              @click="viewCertDialog = false"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <template v-if="certSearchResult">
              <v-list density="compact" lines="two">
                <v-list-item subtitle="เลขที่ใบรับรองสุขอนามัยพืช">
                  <v-list-item-title class="text-hcex-user font-weight-bold">
                    {{ certSearchResult.certNo }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="ชื่อสถานประกอบการ">
                  <v-list-item-title>{{
                    certSearchResult.companyNameTh
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="วันที่ออกใบรับรอง">
                  <v-list-item-title>{{
                    certSearchResult.issuedDate
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="วันหมดอายุ">
                  <v-list-item-title>
                    {{ certSearchResult.expiryDate }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="สถานะ">
                  <v-list-item-title>
                    <v-chip
                      size="x-small"
                      :color="certSearchResult.isExpired ? 'error' : 'success'"
                      variant="tonal"
                    >
                      {{ certSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </template>
          </v-card-text>
          <v-card-actions class="px-5 pb-4 d-flex flex-column ga-2">
            <v-btn
              color="hcex-user"
              variant="tonal"
              prepend-icon="fas fa-download"
              block
              rounded="lg"
            >
              ดาวน์โหลด PDF
            </v-btn>
            <v-btn
              color="hcex-user"
              variant="flat"
              prepend-icon="fas fa-check"
              block
              rounded="lg"
              :disabled="certSearchResult?.isExpired"
              @click="selectCert()"
            >
              เลือกใบรับรองนี้
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- View DOA Dialog -->
      <v-dialog v-model="viewDoaDialog" max-width="480">
        <v-card rounded="xl">
          <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
            <v-icon icon="fas fa-industry" color="hcex-user" size="18" />
            ใบทะเบียนโรงงาน DOA
            <v-spacer />
            <v-btn
              icon="fas fa-xmark"
              size="small"
              variant="text"
              color="grey"
              @click="viewDoaDialog = false"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <template v-if="doaSearchResult">
              <v-list density="compact" lines="two">
                <v-list-item subtitle="เลขทะเบียน DOA">
                  <v-list-item-title class="text-doa-user font-weight-bold">
                    {{ doaSearchResult.doaNo }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="ชื่อโรงงาน">
                  <v-list-item-title>{{
                    doaSearchResult.factoryName
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="วันหมดอายุ">
                  <v-list-item-title>
                    <span
                      :class="
                        doaSearchResult.isExpired
                          ? 'text-error'
                          : 'text-success'
                      "
                    >
                      {{ doaSearchResult.expiryDate }}
                    </span>
                    <v-chip
                      v-if="doaSearchResult.isExpired"
                      size="x-small"
                      color="error"
                      variant="tonal"
                      class="ml-2"
                      >หมดอายุ</v-chip
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </template>
          </v-card-text>
          <v-card-actions class="px-5 pb-4 d-flex flex-column ga-2">
            <v-btn
              color="hcex-user"
              variant="tonal"
              prepend-icon="fas fa-download"
              block
              rounded="lg"
            >
              ดาวน์โหลด PDF
            </v-btn>
            <v-btn
              color="hcex-user"
              variant="flat"
              prepend-icon="fas fa-check"
              block
              rounded="lg"
              :disabled="
                !doaSearchResult ||
                doaSearchResult.isExpired ||
                doaAlreadyAdded(doaSearchResult?.doaNo)
              "
              @click="addFactoryFromSearch()"
            >
              เลือกโรงงานนี้
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- View GAP Dialog -->
      <v-dialog v-model="viewGapDialog" max-width="480">
        <v-card rounded="xl">
          <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
            <v-icon icon="fas fa-seedling" color="hcex-user" size="18" />
            ใบรับรอง GAP
            <v-spacer />
            <v-btn
              icon="fas fa-xmark"
              size="small"
              variant="text"
              color="grey"
              @click="viewGapDialog = false"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <template v-if="gapSearchResult">
              <v-list density="compact" lines="two">
                <v-list-item subtitle="เลขใบรับรอง GAP">
                  <v-list-item-title class="text-gap-user font-weight-bold">
                    {{ gapSearchResult.gapNo }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="ชื่อแหล่งผลิต">
                  <v-list-item-title>{{
                    gapSearchResult.siteName
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="หน่วยงานรับรอง">
                  <v-list-item-title>{{
                    gapSearchResult.certBody
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="รหัสรับรอง">
                  <v-list-item-title>{{
                    gapSearchResult.certCode
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="วันหมดอายุ">
                  <v-list-item-title>
                    <span
                      :class="
                        gapSearchResult.isExpired
                          ? 'text-error'
                          : 'text-success'
                      "
                    >
                      {{ gapSearchResult.expiryDate }}
                    </span>
                    <v-chip
                      v-if="gapSearchResult.isExpired"
                      size="x-small"
                      color="error"
                      variant="tonal"
                      class="ml-2"
                      >หมดอายุ</v-chip
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </template>
          </v-card-text>
          <v-card-actions class="px-5 pb-4 d-flex flex-column ga-2">
            <v-btn
              color="hcex-user"
              variant="tonal"
              prepend-icon="fas fa-download"
              block
              rounded="lg"
            >
              ดาวน์โหลด PDF
            </v-btn>
            <v-btn
              color="hcex-user"
              variant="flat"
              prepend-icon="fas fa-check"
              block
              rounded="lg"
              :disabled="
                !gapSearchResult ||
                gapSearchResult.isExpired ||
                gapAlreadyAdded(gapSearchResult?.gapNo)
              "
              @click="addGapFromSearch()"
            >
              เลือกแหล่งผลิตนี้
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card
        v-if="
          !['amendment', 'history', 'lab', 'newrequest'].includes(
            route.params.type,
          )
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-user" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลผู้ยื่นคำขอ</span
          >
          <v-chip size="x-small" color="hcex-user" variant="tonal" class="ml-1">
            Auto-fill จาก SSO
          </v-chip>
          <v-spacer />
          <v-btn
            size="x-small"
            variant="tonal"
            color="hcex-user"
            prepend-icon="fas fa-rotate"
            @click="refreshApplicantData"
            >ดึงข้อมูลใหม่</v-btn
          >
        </div>
        <v-card-text class="pt-5">
          <!-- ข้อมูลส่วนตัว -->
          <div class="field-section-label mb-2">ข้อมูลส่วนตัว</div>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อ-นามสกุล (ภาษาไทย)</div>
                <div class="field-label-en">Full Name (Thai)</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantNameTh"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>

          <!-- ที่อยู่ -->
          <div class="field-section-label mt-4 mb-2">ที่อยู่</div>
          <v-row dense>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>บ้านเลขที่</div>
                <div class="field-label-en">House No.</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantHouseNo"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>หมู่</div>
                <div class="field-label-en">Moo</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantMoo"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>ตรอก/ซอย</div>
                <div class="field-label-en">Alley / Soi</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantAlley"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>ถนน</div>
                <div class="field-label-en">Road</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantRoad"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>ตำบล/แขวง</div>
                <div class="field-label-en">Sub-district</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantTambol"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>อำเภอ/เขต</div>
                <div class="field-label-en">District</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantDistrict"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>จังหวัด</div>
                <div class="field-label-en">Province</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantProvince"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>รหัสไปรษณีย์</div>
                <div class="field-label-en">Zipcode</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantZipcode"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>

          <!-- ข้อมูลติดต่อ -->
          <div class="field-section-label mt-4 mb-2">ข้อมูลติดต่อ</div>
          <v-row dense>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantPhone"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรสาร</div>
                <div class="field-label-en">Fax</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantFax"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>อีเมล</div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantEmail"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลสถานประกอบการ -->
      <v-card
        v-if="
          !['amendment', 'history', 'lab', 'newrequest'].includes(
            route.params.type,
          )
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลสถานประกอบการ</span
          >
          <v-chip size="x-small" color="hcex-user" variant="tonal" class="ml-1">
            Auto-fill บางส่วนจาก DBD
          </v-chip>
          <v-spacer />
          <v-btn
            size="x-small"
            variant="tonal"
            color="hcex-user"
            prepend-icon="fas fa-rotate"
            @click="refreshCompanyData"
            >ดึงข้อมูลใหม่</v-btn
          >
        </div>
        <v-card-text class="pt-5">
          <!-- ชื่อสถานประกอบการ -->
          <div class="field-section-label mb-2">ชื่อสถานประกอบการ</div>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อสถานประกอบการ (ภาษาไทย)</div>
                <div class="field-label-en">Company Name (Thai)</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.companyNameTh"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ชื่อสถานประกอบการ (ภาษาอังกฤษ)</div>
                <div class="field-label-en">Company Name (English)</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.companyNameEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>

          <!-- ที่ตั้ง (ภาษาไทย) -->
          <div class="field-section-label mt-4 mb-2">ที่ตั้ง (ภาษาไทย)</div>
          <v-row dense>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>บ้านเลขที่</div>
                <div class="field-label-en">House No.</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.houseNo"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>ซอย / ตรอก</div>
                <div class="field-label-en">Alley / Soi</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.alley"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>ถนน</div>
                <div class="field-label-en">Road</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.road"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>ตำบล / แขวง</div>
                <div class="field-label-en">Sub-district (Tambol)</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.tambol"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>อำเภอ / เขต</div>
                <div class="field-label-en">District</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.district"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>จังหวัด</div>
                <div class="field-label-en">Province</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.province"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>รหัสไปรษณีย์</div>
                <div class="field-label-en">Zipcode</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.zipcode"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>

          <!-- ที่ตั้ง (ภาษาอังกฤษ) -->
          <div class="field-section-label mt-4 mb-2">ที่ตั้ง (ภาษาอังกฤษ)</div>
          <v-row dense>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>บ้านเลขที่</div>
                <div class="field-label-en">House No.</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.houseNoEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>ซอย / ตรอก</div>
                <div class="field-label-en">Alley / Soi</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.alleyEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>ถนน</div>
                <div class="field-label-en">Road</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.roadEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>ตำยล / แขวง</div>
                <div class="field-label-en">Sub-district</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.tambolEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>อำเภอ / เขต</div>
                <div class="field-label-en">District</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.districtEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>จังหวัด</div>
                <div class="field-label-en">Province</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.provinceEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>รหัสไปรษณีย์</div>
                <div class="field-label-en">Zipcode</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.zipcodeEn"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>

          <!-- ข้อมูลการติดต่อ -->
          <div class="field-section-label mt-4 mb-2">ข้อมูลการติดต่อ</div>
          <v-row dense>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.companyPhone"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>โทรสาร</div>
                <div class="field-label-en">Fax</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.companyFax"
                hide-details
                placeholder="ระบุโทรสาร"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>อีเมล</div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.companyEmail"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ขอบข่ายประเทศ -->
      <v-card
        v-if="
          !['amendment', 'history', 'lab', 'newrequest'].includes(
            route.params.type,
          )
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-earth-asia" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ขอบข่ายประเทศ</span>
        </div>
        <v-card-text class="pt-5">
          <div class="field-label mb-2">
            <div>
              เลือกขอบข่ายประเทศ (เลือกได้หลายประเทศ)
              <span class="req">*</span>
            </div>
            <div class="field-label-en">Scope of countries (Multiple)</div>
          </div>
          <v-autocomplete
            density="compact"
            v-model="form.countries"
            :items="countryOptions"
            multiple
            chips
            closable-chips
            hide-details
            placeholder="เลือกประเทศปลายทาง"
          />
          <div v-if="form.countries.includes('อื่นๆ (ระบุ)')" class="mt-3">
            <div class="field-label mb-1">
              <div>ระบุประเทศอื่นๆ <span class="req">*</span></div>
              <div class="field-label-en">Other countries (please specify)</div>
            </div>
            <v-autocomplete
              density="compact"
              v-model="form.countriesOther"
              :items="countryOtherOptions"
              multiple
              chips
              closable-chips
              hide-details
              placeholder="เลือกประเทศอื่นๆ"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลโรงงานผลิตสินค้าพืช -->
      <v-card
        v-if="
          !['amendment', 'history', 'lab', 'newrequest'].includes(
            route.params.type,
          )
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-industry" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลโรงงานผลิตสินค้าพืช</span
          >
        </div>
        <v-card-text class="pt-4">
          <!-- Search bar -->
          <div class="field-label mb-1">
            <div>ค้นหาด้วยเลขทะเบียน DOA <span class="req">*</span></div>
            <div class="field-label-en">Search by DOA Registration No.</div>
          </div>
          <div class="d-flex ga-2 mb-4">
            <v-text-field
              density="compact"
              v-model="doaSearchNo"
              hide-details
              placeholder="เช่น DOA-2568-12345"
              clearable
              class="flex-grow-1"
            />
            <v-btn
              color="hcex-user"
              variant="tonal"
              prepend-icon="fas fa-magnifying-glass"
              :loading="doaSearchLoading"
              @click="searchDoa"
              >ค้นหา</v-btn
            >
          </div>

          <!-- Search result -->
          <v-card
            v-if="doaSearchResult"
            elevation="0"
            rounded="lg"
            class="mb-4"
            :style="
              doaSearchResult.isExpired
                ? 'background: rgba(var(--v-theme-error), 0.1); border: 1px solid rgba(var(--v-theme-error), 0.25)'
                : 'background: rgba(var(--v-theme-success), 0.08); border: 1px solid rgba(var(--v-theme-success), 0.2)'
            "
          >
            <v-card-text class="pa-4">
              <v-row align="center" no-gutters>
                <v-col>
                  <div class="text-caption text-medium-emphasis mb-1">
                    เลขทะเบียน DOA
                  </div>
                  <div class="text-body-1 font-weight-bold text-doa-user">
                    {{ doaSearchResult.doaNo }}
                  </div>
                  <div class="text-body-2 mt-1">
                    {{ doaSearchResult.factoryName }}
                  </div>
                  <div class="d-flex align-center ga-2 mt-2">
                    <v-chip
                      size="x-small"
                      :color="doaSearchResult.isExpired ? 'error' : 'success'"
                      variant="tonal"
                    >
                      {{ doaSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis">
                      หมดอายุ: {{ doaSearchResult.expiryDate }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column ga-2 pl-4">
                  <v-btn
                    size="small"
                    variant="flat"
                    color="hcex-user"
                    prepend-icon="fas fa-eye"
                    @click="viewDoaDialog = true"
                  >
                    ดูใบทะเบียน
                  </v-btn>
                  <v-btn
                    size="small"
                    color="hcex-user"
                    variant="flat"
                    prepend-icon="fas fa-check"
                    :disabled="
                      doaSearchResult.isExpired ||
                      doaAlreadyAdded(doaSearchResult.doaNo)
                    "
                    @click="addFactoryFromSearch"
                  >
                    {{
                      doaAlreadyAdded(doaSearchResult.doaNo)
                        ? "เลือกแล้ว"
                        : "เลือกโรงงานนี้"
                    }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Not found -->
          <v-alert
            v-if="doaSearchNotFound"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
            prepend-icon="fas fa-circle-xmark"
            >ไม่พบเลขทะเบียน DOA "{{ doaSearchNo }}"
            กรุณาตรวจสอบและค้นหาใหม่</v-alert
          >

          <!-- Added list -->
          <div v-if="form.factories.length > 0">
            <div class="field-section-label mb-2">โรงงานที่เลือกแล้ว</div>
            <v-table density="compact" class="rounded-lg border">
              <thead>
                <tr>
                  <th>เลขทะเบียน DOA</th>
                  <th>ชื่อโรงงาน</th>
                  <th>วันหมดอายุ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(factory, idx) in form.factories" :key="idx">
                  <td class="text-body-2 font-weight-bold text-doa-user">
                    {{ factory.doaNo }}
                  </td>
                  <td class="text-body-2">{{ factory.factoryName }}</td>
                  <td class="text-body-2">{{ factory.expiryDate }}</td>
                  <td>
                    <v-btn
                      icon="fas fa-trash"
                      variant="text"
                      size="x-small"
                      color="error"
                      @click="removeFactory(idx)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <div
            v-else-if="!doaSearchResult && !doaSearchNotFound"
            class="text-center text-medium-emphasis text-body-2 py-2"
          >
            ยังไม่มีข้อมูลโรงงาน — ค้นหาเลขทะเบียน DOA
            เพื่อเพิ่มโรงงานผลิตสินค้าพืช
          </div>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลแหล่งผลิตพืชที่ได้การรับรอง GAP -->
      <v-card
        v-if="
          !['amendment', 'history', 'lab', 'newrequest'].includes(
            route.params.type,
          )
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-seedling" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลแหล่งผลิตพืชที่ได้การรับรอง GAP</span
          >
        </div>
        <v-card-text class="pt-4">
          <!-- Search bar -->
          <div class="field-label mb-1">
            <div>ค้นหาด้วยเลขใบรับรอง GAP <span class="req">*</span></div>
            <div class="field-label-en">Search by GAP Certificate No.</div>
          </div>
          <div class="d-flex ga-2 mb-4">
            <v-text-field
              density="compact"
              v-model="gapSearchNo"
              hide-details
              placeholder="เช่น GAP-2568-12345"
              clearable
              class="flex-grow-1"
            />
            <v-btn
              color="hcex-user"
              variant="tonal"
              prepend-icon="fas fa-magnifying-glass"
              :loading="gapSearchLoading"
              @click="searchGap"
              >ค้นหา</v-btn
            >
          </div>

          <!-- Search result -->
          <v-card
            v-if="gapSearchResult"
            elevation="0"
            rounded="lg"
            class="mb-4"
            :style="
              gapSearchResult.isExpired
                ? 'background: rgba(var(--v-theme-error), 0.1); border: 1px solid rgba(var(--v-theme-error), 0.25)'
                : 'background: rgba(var(--v-theme-success), 0.08); border: 1px solid rgba(var(--v-theme-success), 0.2)'
            "
          >
            <v-card-text class="pa-4">
              <v-row align="center" no-gutters>
                <v-col>
                  <div class="text-caption text-medium-emphasis mb-1">
                    เลขใบรับรอง GAP
                  </div>
                  <div class="text-body-1 font-weight-bold text-gap-user">
                    {{ gapSearchResult.gapNo }}
                  </div>
                  <div class="text-body-2 mt-1">
                    {{ gapSearchResult.siteName }}
                  </div>
                  <div class="d-flex align-center ga-2 mt-2 flex-wrap">
                    <v-chip
                      size="x-small"
                      :color="gapSearchResult.isExpired ? 'error' : 'success'"
                      variant="tonal"
                    >
                      {{ gapSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis">
                      หมดอายุ: {{ gapSearchResult.expiryDate }}
                    </span>
                    <span class="text-caption text-medium-emphasis">
                      หน่วยงาน: {{ gapSearchResult.certBody }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column ga-2 pl-4">
                  <v-btn
                    size="small"
                    variant="flat"
                    color="hcex-user"
                    prepend-icon="fas fa-eye"
                    @click="viewGapDialog = true"
                  >
                    ดูใบทะเบียน
                  </v-btn>
                  <v-btn
                    size="small"
                    color="hcex-user"
                    variant="flat"
                    prepend-icon="fas fa-check"
                    :disabled="
                      gapSearchResult.isExpired ||
                      gapAlreadyAdded(gapSearchResult.gapNo)
                    "
                    @click="addGapFromSearch"
                  >
                    {{
                      gapAlreadyAdded(gapSearchResult.gapNo)
                        ? "เลือกแล้ว"
                        : "เลือกแหล่งผลิตนี้"
                    }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Not found -->
          <v-alert
            v-if="gapSearchNotFound"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
            prepend-icon="fas fa-circle-xmark"
            >ไม่พบเลขใบรับรอง GAP "{{ gapSearchNo }}"
            กรุณาตรวจสอบและค้นหาใหม่</v-alert
          >

          <!-- Added list -->
          <div v-if="form.gaps.length > 0">
            <div class="field-section-label mb-2">แหล่งผลิตที่เลือกแล้ว</div>
            <v-table density="compact" class="rounded-lg border">
              <thead>
                <tr>
                  <th>เลขใบรับรอง GAP</th>
                  <th>ชื่อแหล่งผลิต</th>
                  <th>หน่วยงานรับรอง</th>
                  <th>วันหมดอายุ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(gap, idx) in form.gaps" :key="idx">
                  <td class="text-body-2 font-weight-bold text-gap-user">
                    {{ gap.gapNo }}
                  </td>
                  <td class="text-body-2">{{ gap.siteName }}</td>
                  <td class="text-body-2">{{ gap.certBody }}</td>
                  <td class="text-body-2">{{ gap.expiryDate }}</td>
                  <td>
                    <v-btn
                      icon="fas fa-trash"
                      variant="text"
                      size="x-small"
                      color="error"
                      @click="removeGap(idx)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <div
            v-else-if="!gapSearchResult && !gapSearchNotFound"
            class="text-center text-medium-emphasis text-body-2 py-2"
          >
            ยังไม่มีข้อมูลแหล่งผลิต — ค้นหาเลขใบรับรอง GAP
            เพื่อเพิ่มแหล่งผลิตพืชที่ได้การรับรอง GAP
          </div>
        </v-card-text>
      </v-card>

      <!-- ─── NEWREQUEST TYPE ─── -->
      <template v-if="route.params.type === 'newrequest'">
        <!-- เลือก Test Report (prerequisite) -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-file-waveform" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >เลือก Test Report ที่ผ่านการพิจารณาแล้ว</span
            >
            <span class="req ml-1">*</span>
          </div>
          <v-card-text class="pt-4">
            <v-alert
              density="compact"
              variant="tonal"
              color="info"
              rounded="lg"
              class="mb-4"
              prepend-icon="fas fa-circle-info"
            >
              ต้องเลือก Test Report ที่ได้รับการพิจารณาอนุมัติแล้วก่อนกรอกคำขอ —
              ข้อมูลบางส่วนจะถูกดึงมาโดยอัตโนมัติ
            </v-alert>
            <v-row dense align="center">
              <v-col cols="12" sm="7">
                <div class="field-label mb-1">
                  เลขที่ Test Report <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="regForm.testReportSearchNo"
                  hide-details
                  placeholder="เช่น LAB-2568-00123"
                  prepend-inner-icon="fas fa-magnifying-glass"
                  @keyup.enter="searchTestReport"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="hcex-user"
                  variant="tonal"
                  prepend-icon="fas fa-magnifying-glass"
                  :loading="testReportSearchLoading"
                  @click="searchTestReport"
                  class="mt-5"
                  >ค้นหา</v-btn
                >
              </v-col>
            </v-row>
            <v-alert
              v-if="testReportNotFound"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-3"
              prepend-icon="fas fa-circle-xmark"
            >
              ไม่พบ Test Report เลขที่ "{{ regForm.testReportSearchNo }}"
              กรุณาตรวจสอบอีกครั้ง
            </v-alert>
            <v-card
              v-if="selectedTestReport && !regForm.testReportSelected"
              elevation="0"
              rounded="lg"
              class="mt-4"
              style="
                background: rgba(var(--v-theme-success), 0.08);
                border: 1px solid rgba(var(--v-theme-success), 0.2);
              "
            >
              <v-card-text class="pa-4">
                <v-row align="center" no-gutters>
                  <v-col>
                    <div class="text-caption text-medium-emphasis mb-1">
                      เลขที่ Test Report
                    </div>
                    <div class="text-body-1 font-weight-bold text-hcex-user">
                      {{ selectedTestReport.no }}
                    </div>
                    <div class="text-body-2 mt-1">
                      {{ selectedTestReport.productName }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      ผู้ผลิต: {{ selectedTestReport.manufacturer }} |
                      วันที่รับผล: {{ selectedTestReport.date }}
                    </div>
                  </v-col>
                  <v-col cols="auto" class="pl-4">
                    <v-btn
                      size="small"
                      color="hcex-user"
                      variant="flat"
                      prepend-icon="fas fa-check"
                      @click="regForm.testReportSelected = selectedTestReport"
                      >เลือก Test Report นี้</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <div
              v-if="regForm.testReportSelected"
              class="mt-4 d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-circle-check" color="success" size="16" />
              <span class="text-body-2 font-weight-medium text-success"
                >เลือก Test Report แล้ว:</span
              >
              <v-chip color="hcex-user" variant="tonal" size="small"
                >{{ regForm.testReportSelected.no }} —
                {{ regForm.testReportSelected.productName }}</v-chip
              >
              <v-btn
                icon="fas fa-xmark"
                size="x-small"
                variant="text"
                color="grey"
                @click="regForm.testReportSelected = null"
              />
            </div>
          </v-card-text>
        </v-card>

        <!-- เลือกประเภทแบบฟอร์ม -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-list-check" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ประเภทแบบฟอร์มใบรับรองสุขอนามัย</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-radio-group
              v-model="regForm.formType"
              color="hcex-user"
              density="compact"
            >
              <v-radio value="kmpor1" class="mb-2">
                <template #label
                  ><div>
                    <div class="font-weight-bold">
                      ใบรับรองสุขอนามัยพืช สินค้าแปรรูปด้านพืช (กมพ.1)
                    </div>
                  </div></template
                >
              </v-radio>
              <v-radio value="kmpor1_1" class="mb-2">
                <template #label
                  ><div>
                    <div class="font-weight-bold">
                      ใบรับรองสุขอนามัยสําหรับประเทศในกลุ่มอ่าว (กมพ. 1-1)
                    </div>
                  </div></template
                >
              </v-radio>
              <v-radio value="kmpor1_2" class="mb-2">
                <template #label
                  ><div>
                    <div class="font-weight-bold">
                      ใบรับรองสุขอนามัยแบบฟอร์ม สําหรับพืชงอก
                      (Sprout)ส่งออกไปสหภาพยุโรป (กมพ. 1–2)
                    </div>
                  </div></template
                >
              </v-radio>
              <v-radio value="kmpor1_3">
                <template #label
                  ><div>
                    <div class="font-weight-bold">
                      ใบรับรองสุขอนามัย สําหรับส่งออกไปราชอาณาจักรโมร็อกโก (กมพ.
                      1–3)
                    </div>
                  </div></template
                >
              </v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลทั่วไป (shared) -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-circle-info" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลทั่วไป</span>
          </div>
          <v-card-text class="pt-4">
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">เลขที่คำขอ</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  model-value="Auto Generate"
                  readonly
                  class="field-readonly"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">วันที่ยื่นคำขอ</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  :model-value="todayStr"
                  readonly
                  class="field-readonly"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">ผู้ยื่นคำขอ</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  :model-value="form.applicantNameTh"
                  readonly
                  class="field-readonly"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  จำนวนใบรับรองที่ต้องการ <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="regForm.certQty"
                  type="number"
                  min="1"
                  hide-details
                  placeholder="ระบุจำนวน"
                />
                <div class="text-caption text-medium-emphasis mt-1">
                  ต้องมากกว่า 0
                </div>
              </v-col>
            </v-row>
            <v-alert
              density="compact"
              variant="tonal"
              color="warning"
              rounded="lg"
              class="mt-3"
              prepend-icon="fas fa-triangle-exclamation"
            >
              ข้อมูลทั้งหมดในใบรับรองต้องกรอกเป็น<strong
                >ภาษาอังกฤษตัวพิมพ์ใหญ่ (UPPERCASE)</strong
              >
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- ════════════ กมพ.1 ════════════ -->
        <template v-if="regForm.formType === 'kmpor1'">
          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-user-tie" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลผู้ส่งออก / ผู้นำเข้า</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Exporter Name and Address <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.exporterAddress"
                    rows="3"
                    hide-details
                    placeholder="EXPORTER NAME AND ADDRESS..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Consignee Name and Address Including Country
                    <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.consigneeAddress"
                    rows="3"
                    hide-details
                    placeholder="CONSIGNEE NAME AND ADDRESS..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-ship" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลการขนส่ง</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Date of Shipment <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1ShipmentDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1.shipmentDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1ShipmentDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1ShipmentDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1ShipmentDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="regKmpor1ShipmentDateMenu = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Country of Destination <span class="req">*</span>
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.countryDestination"
                    :items="countryOptions"
                    hide-details
                    placeholder="Select country"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Place of Departure <span class="req">*</span>
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.placeOfDeparture"
                    :items="departureOptions"
                    hide-details
                    placeholder="Select place"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Vessel / Vehicle <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.vessel"
                    hide-details
                    placeholder="VESSEL / VEHICLE NAME"
                  />
                </v-col>
                <v-col cols="12" sm="8">
                  <div class="field-label mb-1">
                    Mode of Transport <span class="req">*</span>
                  </div>
                  <div class="d-flex ga-4 mt-1">
                    <v-checkbox
                      v-model="regKmpor1.transport"
                      value="SEA"
                      label="SEA"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1.transport"
                      value="ROAD"
                      label="ROAD"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1.transport"
                      value="AIR"
                      label="AIR"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-boxes-stacked" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold">ข้อมูลสินค้า</span>
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">Manufacturer</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="
                      regForm.testReportSelected?.manufacturer ?? ''
                    "
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill จากทะเบียนประวัติ"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Analysis Report No.</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="regForm.testReportSelected?.no ?? ''"
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill จาก Test Report"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Date</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="regForm.testReportSelected?.date ?? ''"
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Shipping Mark <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.shippingMark"
                    hide-details
                    placeholder="SHIPPING MARK"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1">
                    Description of Goods <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.descriptionOfGoods"
                    rows="3"
                    hide-details
                    placeholder="DESCRIPTION OF GOODS..."
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Quantity (CTNS.) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.quantity"
                    type="number"
                    min="1"
                    hide-details
                    placeholder="0"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Weight N.W. (KGS.) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.weightNW"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Weight G.W. (KGS.) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.weightGW"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Amount (USD) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1.totalAmount"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-comment-dots" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >Special Remark</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-checkbox
                v-model="regKmpor1.remarkFFC"
                label="FIT FOR HUMAN CONSUMPTION"
                color="hcex-user"
                density="compact"
                hide-details
                class="mb-3"
              />
              <div class="field-label mb-1">
                ข้อความพิเศษเพิ่มเติม (ENGLISH UPPERCASE)
              </div>
              <v-textarea
                density="compact"
                variant="outlined"
                rounded="lg"
                v-model="regKmpor1.remark"
                rows="2"
                hide-details
                placeholder="ADDITIONAL SPECIAL REMARK..."
              />
            </v-card-text>
          </v-card>
        </template>

        <!-- ════════════ กมพ.1-1 ════════════ -->
        <template v-if="regForm.formType === 'kmpor1_1'">
          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-user-tie" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลผู้ส่งออก / ผู้นำเข้า</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Exporter Name and Address <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.exporterAddress"
                    rows="3"
                    hide-details
                    placeholder="EXPORTER NAME AND ADDRESS..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Consignee Name and Address Including Country
                    <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.consigneeAddress"
                    rows="3"
                    hide-details
                    placeholder="CONSIGNEE NAME AND ADDRESS..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Producer Name and Address <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.producerAddress"
                    rows="3"
                    hide-details
                    placeholder="PRODUCER NAME AND ADDRESS..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Packing Establishment Name and Address
                    <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.packingAddress"
                    rows="3"
                    hide-details
                    placeholder="PACKING ESTABLISHMENT NAME AND ADDRESS..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-ship" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลการขนส่ง</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Date of Shipment <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1_1ShipmentDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1_1.shipmentDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1_1ShipmentDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1_1ShipmentDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1_1ShipmentDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="regKmpor1_1ShipmentDateMenu = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Vessel / Vehicle Identification <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.vessel"
                    hide-details
                    placeholder="VESSEL / VEHICLE NAME"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Border of Loading / Country of Dispatch
                    <span class="req">*</span>
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.borderLoading"
                    :items="departureOptions"
                    hide-details
                    placeholder="Select"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">Country of Origin</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="THAILAND"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="2">
                  <div class="field-label mb-1">ISO Code</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="764"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Border of Entry / Country of Destination
                    <span class="req">*</span>
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.borderEntry"
                    :items="countryOptions"
                    hide-details
                    placeholder="Select country"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1">
                    Mode of Transport <span class="req">*</span>
                  </div>
                  <div class="d-flex ga-4 mt-1">
                    <v-checkbox
                      v-model="regKmpor1_1.transport"
                      value="SEA"
                      label="SEA"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_1.transport"
                      value="ROAD"
                      label="ROAD"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_1.transport"
                      value="AIR"
                      label="AIR"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon
                icon="fas fa-thermometer-half"
                color="hcex-user"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลอุณหภูมิสินค้า <span class="req">*</span></span
              >
            </div>
            <v-card-text class="pt-4">
              <v-radio-group
                v-model="regKmpor1_1.temperature"
                color="hcex-user"
                density="compact"
                inline
              >
                <v-radio value="Ambient" label="Ambient" class="mr-6" />
                <v-radio value="Chilled" label="Chilled" class="mr-6" />
                <v-radio value="Frozen" label="Frozen" />
              </v-radio-group>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-boxes-stacked" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลเอกสารและสินค้า</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">Halal Certificate No.</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.halalCertNo"
                    hide-details
                    placeholder="HALAL CERT NO."
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">Analysis Report No.</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="regForm.testReportSelected?.no ?? ''"
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">Date</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="regForm.testReportSelected?.date ?? ''"
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1">
                    Name & Description of Food <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.descriptionOfFood"
                    rows="3"
                    hide-details
                    placeholder="NAME & DESCRIPTION OF FOOD..."
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    HS Code <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.hsCode"
                    hide-details
                    placeholder="0000.00.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Treatment Type</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.treatmentType"
                    hide-details
                    placeholder="TREATMENT TYPE"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Brand Name</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.brandName"
                    hide-details
                    placeholder="BRAND NAME"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Batch / Lot No. <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.batchNo"
                    hide-details
                    placeholder="BATCH / LOT NO."
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Production Date <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1_1ProductionDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1_1.productionDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1_1ProductionDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1_1ProductionDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1_1ProductionDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="
                        regKmpor1_1ProductionDateMenu = false
                      "
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Expiry Date <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1_1ExpiryDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1_1.expiryDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1_1ExpiryDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1_1ExpiryDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1_1ExpiryDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="regKmpor1_1ExpiryDateMenu = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    No. Packages (CTN/BAG/BOX) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.noPackages"
                    type="number"
                    min="1"
                    hide-details
                    placeholder="0"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Weight (KGS.) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.totalWeight"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Amount (USD) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_1.totalAmount"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-certificate" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >Commodities Certified For <span class="req">*</span></span
              >
            </div>
            <v-card-text class="pt-4">
              <v-checkbox
                v-model="regKmpor1_1.certifiedFor"
                value="OTHER"
                label="OTHER"
                color="hcex-user"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="regKmpor1_1.certifiedFor"
                value="AFTER FURTHER PROCESS"
                label="AFTER FURTHER PROCESS"
                color="hcex-user"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="regKmpor1_1.certifiedFor"
                value="HUMAN CONSUMPTION DIRECTLY"
                label="HUMAN CONSUMPTION DIRECTLY"
                color="hcex-user"
                density="compact"
                hide-details
              />
            </v-card-text>
          </v-card>
        </template>

        <!-- ════════════ กมพ.1-2 ════════════ -->
        <template v-if="regForm.formType === 'kmpor1_2'">
          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-file-contract" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลอ้างอิงใบรับรอง</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">Certificate Reference</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="Auto Generate"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">IMSOC Reference / QR Code</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="Auto Generate"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Central Competent Authority
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="DEPARTMENT OF AGRICULTURE"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">Local Competent Authority</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="PLANT QUARANTINE STATION"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-user-tie" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลผู้ส่งออก / ผู้นำเข้า</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Consignor / Exporter <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.consignor"
                    rows="3"
                    hide-details
                    placeholder="CONSIGNOR / EXPORTER..."
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Consignee / Importer <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.consignee"
                    rows="3"
                    hide-details
                    placeholder="CONSIGNEE / IMPORTER..."
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Operator Responsible for the Consignment
                    <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.operator"
                    rows="3"
                    hide-details
                    placeholder="OPERATOR RESPONSIBLE..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-earth-europe" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลประเทศและสถานที่</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Country of Origin</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="THAILAND"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Region of Origin <span class="req">*</span>
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.regionOrigin"
                    :items="regionOptions"
                    hide-details
                    placeholder="Select region"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Country of Destination <span class="req">*</span>
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.countryDestination"
                    :items="euCountryOptions"
                    hide-details
                    placeholder="Select country"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Region of Destination</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.regionDestination"
                    hide-details
                    placeholder="REGION OF DESTINATION"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Place of Dispatch <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.placeDispatch"
                    rows="2"
                    hide-details
                    placeholder="PLACE OF DISPATCH..."
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Place of Destination <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.placeDestination"
                    rows="2"
                    hide-details
                    placeholder="PLACE OF DESTINATION..."
                  />
                </v-col>
                <v-col cols="12" sm="2">
                  <div class="field-label mb-1">
                    Place of Loading <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.placeLoading"
                    hide-details
                    placeholder="PLACE OF LOADING"
                  />
                </v-col>
                <v-col cols="12" sm="2">
                  <div class="field-label mb-1">Entry Border Control Post</div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.entryBorderPost"
                    :items="borderPostOptions"
                    hide-details
                    placeholder="Select"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-ship" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลการขนส่ง</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Mode of Transport <span class="req">*</span>
                  </div>
                  <div class="d-flex flex-wrap ga-4 mt-1">
                    <v-checkbox
                      v-model="regKmpor1_2.transport"
                      value="Aircraft"
                      label="Aircraft"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_2.transport"
                      value="Vessel"
                      label="Vessel"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_2.transport"
                      value="Railway"
                      label="Railway"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_2.transport"
                      value="Road Vehicle"
                      label="Road Vehicle"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Transport Conditions <span class="req">*</span>
                  </div>
                  <div class="d-flex ga-4 mt-1">
                    <v-checkbox
                      v-model="regKmpor1_2.transportCondition"
                      value="Ambient"
                      label="Ambient"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_2.transportCondition"
                      value="Chilled"
                      label="Chilled"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_2.transportCondition"
                      value="Frozen"
                      label="Frozen"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                  </div>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Container Number</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.containerNo"
                    hide-details
                    placeholder="CONTAINER NUMBER"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Seal Number</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.sealNo"
                    hide-details
                    placeholder="SEAL NUMBER"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Date and Time of Departure <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.departureDateTime"
                    hide-details
                    placeholder="วว/ดด/ปปปป HH:MM"
                    prepend-inner-icon="fas fa-calendar"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Accompanying Documents</div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.accompanyingDocs"
                    rows="1"
                    hide-details
                    placeholder="ACCOMPANYING DOCUMENTS..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-certificate" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >Certified As Or For <span class="req">*</span></span
              >
            </div>
            <v-card-text class="pt-4">
              <v-checkbox
                v-model="regKmpor1_2.certifiedFor"
                value="Products for Human Consumption"
                label="Products for Human Consumption"
                color="hcex-user"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="regKmpor1_2.certifiedFor"
                value="Further Processing"
                label="Further Processing"
                color="hcex-user"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="regKmpor1_2.certifiedFor"
                value="Other"
                label="Other"
                color="hcex-user"
                density="compact"
                hide-details
              />
              <div class="field-section-label mt-3 mb-2">ตัวเลือกเพิ่มเติม</div>
              <v-checkbox
                v-model="regKmpor1_2.certifiedForExtra"
                value="For Transit"
                label="For Transit"
                color="hcex-user"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="regKmpor1_2.certifiedForExtra"
                value="For Internal Market"
                label="For Internal Market"
                color="hcex-user"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="regKmpor1_2.certifiedForExtra"
                value="For Re-entry"
                label="For Re-entry"
                color="hcex-user"
                density="compact"
                hide-details
              />
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-boxes-stacked" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold">ข้อมูลสินค้า</span>
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Number of Packages <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.totalPackages"
                    type="number"
                    min="1"
                    hide-details
                    placeholder="0"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Quantity <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.totalQuantity"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Net Weight (Kg) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.totalNetWeight"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Gross Weight (Kg) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.grossWeight"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Amount USD <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.totalAmount"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">CN Code</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.cnCode"
                    hide-details
                    placeholder="CN CODE"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Category</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.category"
                    hide-details
                    placeholder="CATEGORY"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Identification Mark</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.identificationMark"
                    hide-details
                    placeholder="IDENTIFICATION MARK"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Type of Packaging</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.typeOfPackaging"
                    hide-details
                    placeholder="TYPE OF PACKAGING"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Net Weight (Kg)</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.netWeight"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Nature of Commodity</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.natureOfCommodity"
                    hide-details
                    placeholder="NATURE OF COMMODITY"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Number of Packages</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.numberOfPackages"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Batch No. <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.batchNo"
                    hide-details
                    placeholder="BATCH NO."
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Date of Collection / Production <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1_2CollectionDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1_2.collectionDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1_2CollectionDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1_2CollectionDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1_2CollectionDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="
                        regKmpor1_2CollectionDateMenu = false
                      "
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Manufacturing Plant</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="
                      regForm.testReportSelected?.manufacturer ?? ''
                    "
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Approval / Registration Number
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="Auto fill"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1">
                    Description of Consignment <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_2.descriptionConsignment"
                    rows="3"
                    hide-details
                    placeholder="DESCRIPTION OF CONSIGNMENT..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>

        <!-- ════════════ กมพ.1-3 ════════════ -->
        <template v-if="regForm.formType === 'kmpor1_3'">
          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-user-tie" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลผู้ประกอบการ</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Exporter Name, Full Address, Country
                    <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.exporterAddress"
                    rows="3"
                    hide-details
                    placeholder="EXPORTER NAME, FULL ADDRESS, COUNTRY..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Registration / Declaration / Accreditation of Exporter
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.exporterAccreditation"
                    rows="3"
                    hide-details
                    placeholder="REGISTRATION / DECLARATION..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Producer Name, Full Address, Country
                    <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.producerAddress"
                    rows="3"
                    hide-details
                    placeholder="PRODUCER NAME, FULL ADDRESS, COUNTRY..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Registration / Declaration / Accreditation of Producer
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.producerAccreditation"
                    rows="3"
                    hide-details
                    placeholder="REGISTRATION / DECLARATION..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Consignee / Importer <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.consignee"
                    rows="3"
                    hide-details
                    placeholder="CONSIGNEE / IMPORTER..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-ship" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลการขนส่ง</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Date of Shipment <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1_3ShipmentDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1_3.shipmentDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1_3ShipmentDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1_3ShipmentDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1_3ShipmentDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="regKmpor1_3ShipmentDateMenu = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Sample Submitted By</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="form.applicantNameTh"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Analysis Report Number</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="regForm.testReportSelected?.no ?? ''"
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Received Date</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    :model-value="regForm.testReportSelected?.date ?? ''"
                    readonly
                    class="field-readonly"
                    hide-details
                    placeholder="Auto fill"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Country of Origin</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="THAILAND"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Country of Destination</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    model-value="KOREA"
                    readonly
                    class="field-readonly"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Loading Place <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.loadingPlace"
                    hide-details
                    placeholder="LOADING PLACE"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Declared Entry Point</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.entryPoint"
                    hide-details
                    placeholder="DECLARED ENTRY POINT"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">Bill Number</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.billNo"
                    hide-details
                    placeholder="BILL NUMBER"
                  />
                </v-col>
                <v-col cols="12" sm="5">
                  <div class="field-label mb-1">
                    Mode of Transport <span class="req">*</span>
                  </div>
                  <div class="d-flex ga-4 mt-1">
                    <v-checkbox
                      v-model="regKmpor1_3.transport"
                      value="SEA"
                      label="SEA"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_3.transport"
                      value="ROAD"
                      label="ROAD"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_3.transport"
                      value="AIR"
                      label="AIR"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label mb-1">
                    Temperature of Food Product <span class="req">*</span>
                  </div>
                  <div class="d-flex ga-4 mt-1">
                    <v-checkbox
                      v-model="regKmpor1_3.temperature"
                      value="Ambient"
                      label="Ambient"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_3.temperature"
                      value="Chilled"
                      label="Chilled"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_3.temperature"
                      value="Frozen"
                      label="Frozen"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon icon="fas fa-boxes-stacked" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold">ข้อมูลสินค้า</span>
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12">
                  <div class="field-label mb-1">
                    Description of Products <span class="req">*</span>
                  </div>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.descriptionProducts"
                    rows="3"
                    hide-details
                    placeholder="DESCRIPTION OF PRODUCTS..."
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    Name of Product <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.productName"
                    hide-details
                    placeholder="PRODUCT NAME (แก้ไขได้)"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Date of Production <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1_3ProductionDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1_3.productionDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1_3ProductionDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1_3ProductionDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1_3ProductionDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="
                        regKmpor1_3ProductionDateMenu = false
                      "
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Expiry Date <span class="req">*</span>
                  </div>
                  <v-menu
                    v-model="regKmpor1_3ExpiryDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="regKmpor1_3.expiryDate"
                        readonly
                        clearable
                        prepend-inner-icon="fas fa-calendar"
                        placeholder="เลือกวันที่"
                        hide-details
                        style="cursor: pointer"
                        @click:clear.stop="regKmpor1_3ExpiryDateObj = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="regKmpor1_3ExpiryDateObj"
                      color="hcex-user"
                      show-adjacent-months
                      :hide-header="!regKmpor1_3ExpiryDateObj"
                      title="เลือกวันที่"
                      locale="th"
                      @update:model-value="regKmpor1_3ExpiryDateMenu = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1">
                    State or Type of Processing <span class="req">*</span>
                  </div>
                  <div class="d-flex flex-wrap ga-4 mt-1">
                    <v-checkbox
                      v-model="regKmpor1_3.processingType"
                      value="AFTER FURTHER PROCESS"
                      label="AFTER FURTHER PROCESS"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_3.processingType"
                      value="HUMAN CONSUMPTION DIRECTLY"
                      label="HUMAN CONSUMPTION DIRECTLY"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                    <v-checkbox
                      v-model="regKmpor1_3.processingType"
                      value="OTHER"
                      label="OTHER"
                      color="hcex-user"
                      density="compact"
                      hide-details
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border rounded="xl" class="mb-5">
            <div class="d-flex align-center ga-2 px-4 py-3 border-b">
              <v-icon
                icon="fas fa-weight-hanging"
                color="hcex-user"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ปริมาณและบรรจุภัณฑ์</span
              >
            </div>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Gross Mass or Volume (Kgs.) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.grossMass"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Net Mass or Volume (Kgs.) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.netMass"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Number and Nature of Packages <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.numberOfPackages"
                    hide-details
                    placeholder="NUMBER AND NATURE"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Batch Number or Document Reference
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.batchNo"
                    hide-details
                    placeholder="BATCH NUMBER"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="field-label mb-1">
                    Total Amount (USD) <span class="req">*</span>
                  </div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    v-model="regKmpor1_3.totalAmount"
                    type="number"
                    min="0"
                    hide-details
                    placeholder="0.00"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </template>

      <!-- ─── HISTORY TYPE ─── -->
      <template v-if="route.params.type === 'history'">
        <!-- ประเภทคำขอ: ขึ้นทะเบียนใหม่ / แก้ไข -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-list-check" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ประเภทคำขอ</span>
          </div>
          <v-card-text class="pt-5">
            <v-radio-group
              v-model="historyRequestType"
              color="hcex-user"
              density="compact"
              inline
            >
              <v-radio
                value="new"
                label="ขึ้นทะเบียนประวัติใหม่"
                class="mr-8"
              />
              <v-radio
                value="amendment"
                label="แก้ไขทะเบียนประวัติ (เพิ่ม/ลดสินค้า)"
              />
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- ประเภทการยื่น (แสดงเฉพาะกรณีขึ้นทะเบียนใหม่) -->
        <v-card
          v-if="historyRequestType === 'new'"
          elevation="0"
          border
          rounded="xl"
          class="mb-5"
        >
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-industry" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">รูปแบบการยื่น</span>
          </div>
          <v-card-text class="pt-5">
            <v-radio-group
              v-model="historySubmissionType"
              color="hcex-user"
              density="compact"
              inline
            >
              <v-radio value="all" label="ทั้งระบบการผลิต" class="mr-8" />
              <v-radio value="batch" label="แต่ละรุ่นการผลิต" />
            </v-radio-group>
            <v-alert
              v-if="historySubmissionType === 'batch'"
              density="compact"
              variant="tonal"
              color="info"
              rounded="lg"
              class="mt-3"
              prepend-icon="fas fa-circle-info"
            >
              กรณีนี้ไม่บังคับให้มีทะเบียนโรงงานจาก DOA
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- ─── กรณีแก้ไขทะเบียนประวัติ ─── -->
        <v-card
          v-if="historyRequestType === 'amendment'"
          elevation="0"
          border
          rounded="xl"
          class="mb-5"
        >
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-pen-to-square" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลที่ต้องการแก้ไข</span
            >
          </div>
          <v-card-text class="pa-6 text-center text-medium-emphasis">
            <v-icon
              icon="fas fa-tools"
              size="40"
              color="hcex-user"
              style="opacity: 0.3"
              class="mb-3"
            />
            <div class="text-body-2">
              ส่วนนี้จะแสดงฟอร์มแก้ไขทะเบียนประวัติ (เพิ่ม/ลดสินค้า)
            </div>
          </v-card-text>
        </v-card>

        <!-- ─── กรณีขึ้นทะเบียนใหม่ ─── -->
        <!-- ข้อมูลผู้ยื่นคำขอ (SSO card) -->
        <v-card
          v-if="historyRequestType === 'new'"
          elevation="0"
          border
          rounded="xl"
          class="mb-5"
        >
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-user" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
            <v-chip
              size="x-small"
              color="hcex-user"
              variant="tonal"
              class="ml-1"
            >
              Auto-fill จาก SSO
            </v-chip>
            <v-spacer />
            <v-btn
              size="x-small"
              variant="tonal"
              color="hcex-user"
              prepend-icon="fas fa-rotate"
              @click="refreshHistoryFactory"
              >ดึงข้อมูลใหม่</v-btn
            >
          </div>
          <v-card-text class="pt-5">
            <!-- ข้อมูลส่วนตัว -->
            <div class="field-section-label mb-2">ข้อมูลส่วนตัว</div>
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>ชื่อ-นามสกุล (ภาษาไทย)</div>
                  <div class="field-label-en">Full Name (Thai)</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyFactory.contactName"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>ตำแหน่ง</div>
                  <div class="field-label-en">Position</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyFactory.contactPosition"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>เลขบัตรประชาชน</div>
                  <div class="field-label-en">ID Card No.</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyFactory.contactId"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>

            <!-- ข้อมูลติดต่อ -->
            <div class="field-section-label mt-4 mb-2">ข้อมูลติดต่อ</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>โทรศัพท์</div>
                  <div class="field-label-en">Phone Number</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyFactory.contactPhone"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>โทรสาร</div>
                  <div class="field-label-en">Fax</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyFactory.contactFax"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>อีเมล</div>
                  <div class="field-label-en">Email</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyFactory.contactEmail"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลสถานประกอบการ (DBD card) -->
        <v-card
          v-if="historyRequestType === 'new'"
          elevation="0"
          border
          rounded="xl"
          class="mb-5"
        >
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-building" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลสถานประกอบการ</span
            >
            <v-chip
              size="x-small"
              color="hcex-user"
              variant="tonal"
              class="ml-1"
            >
              Auto-fill บางส่วนจาก DBD
            </v-chip>
            <v-spacer />
            <v-btn
              size="x-small"
              variant="tonal"
              color="hcex-user"
              prepend-icon="fas fa-rotate"
              @click="refreshHistoryCompany"
              >ดึงข้อมูลใหม่</v-btn
            >
          </div>
          <v-card-text class="pt-5">
            <!-- ชื่อสถานประกอบการ -->
            <div class="field-section-label mb-2">ชื่อสถานประกอบการ</div>
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>ชื่อสถานประกอบการ (ภาษาไทย)</div>
                  <div class="field-label-en">Company Name (Thai)</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.companyNameTh"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="field-label">
                  <div>ชื่อสถานประกอบการ (ภาษาอังกฤษ)</div>
                  <div class="field-label-en">Company Name (English)</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.companyNameEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>

            <!-- ที่ตั้ง (ภาษาไทย) -->
            <div class="field-section-label mt-4 mb-2">ที่ตั้ง (ภาษาไทย)</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>บ้านเลขที่</div>
                  <div class="field-label-en">House No.</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.houseNo"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>ซอย / ตรอก</div>
                  <div class="field-label-en">Alley / Soi</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.alley"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>ถนน</div>
                  <div class="field-label-en">Road</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.road"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>ตำบล / แขวง</div>
                  <div class="field-label-en">Sub-district (Tambol)</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.tambol"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>อำเภอ / เขต</div>
                  <div class="field-label-en">District</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.district"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>จังหวัด</div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.province"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>รหัสไปรษณีย์</div>
                  <div class="field-label-en">Zipcode</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.zipcode"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>

            <!-- ที่ตั้ง (ภาษาอังกฤษ) -->
            <div class="field-section-label mt-4 mb-2">
              ที่ตั้ง (ภาษาอังกฤษ)
            </div>
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>บ้านเลขที่</div>
                  <div class="field-label-en">House No.</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.houseNoEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>ซอย / ตรอก</div>
                  <div class="field-label-en">Alley / Soi</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.alleyEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>ถนน</div>
                  <div class="field-label-en">Road</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.roadEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>ตำบล / แขวง</div>
                  <div class="field-label-en">Sub-district</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.tambolEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>อำเภอ / เขต</div>
                  <div class="field-label-en">District</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.districtEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>จังหวัด</div>
                  <div class="field-label-en">Province</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.provinceEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>รหัสไปรษณีย์</div>
                  <div class="field-label-en">Zipcode</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.zipcodeEn"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>

            <!-- ข้อมูลการติดต่อ -->
            <div class="field-section-label mt-4 mb-2">ข้อมูลการติดต่อ</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>โทรศัพท์</div>
                  <div class="field-label-en">Phone Number</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.phone"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>โทรสาร</div>
                  <div class="field-label-en">Fax</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.fax"
                  hide-details
                  placeholder="ระบุโทรสาร"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-label">
                  <div>อีเมล</div>
                  <div class="field-label-en">Email</div>
                </div>
                <v-text-field
                  density="compact"
                  v-model="historyCompany.email"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- หนังสือสำคัญ DOA (standalone card) -->
        <v-card
          v-if="historyRequestType === 'new'"
          elevation="0"
          border
          rounded="xl"
          class="mb-5"
        >
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon
              icon="fas fa-building-columns"
              color="hcex-user"
              size="15"
            />
            <span class="text-subtitle-2 font-weight-bold">
              หนังสือสำคัญแสดงการขึ้นทะเบียนโรงงานผลิตสินค้าเพื่อการส่งออกกับกรมวิชาการเกษตร
            </span>
            <v-chip size="x-small" color="grey" variant="tonal"
              >ไม่บังคับ</v-chip
            >
          </div>
          <v-card-text class="pt-4">
            <p
              v-if="historySubmissionType === 'batch'"
              class="text-caption text-medium-emphasis mb-4"
            >
              สามารถเว้นว่างได้ หากยังไม่มีทะเบียนจาก DOA
            </p>

            <!-- Search bar (export pattern) -->
            <div class="field-label mb-1">
              <div>ค้นหาด้วยเลขทะเบียน DOA</div>
            </div>
            <div class="d-flex ga-2 mb-4">
              <v-text-field
                density="compact"
                variant="outlined"
                rounded="lg"
                v-model="histDoaSearchNo"
                hide-details
                placeholder="เช่น DOA-2568-12345"
                clearable
                class="flex-grow-1"
                @keyup.enter="searchHistDoa"
              />
              <v-btn
                color="hcex-user"
                variant="tonal"
                prepend-icon="fas fa-magnifying-glass"
                :loading="histDoaSearchLoading"
                @click="searchHistDoa"
                >ค้นหา</v-btn
              >
            </div>

            <!-- Result card -->
            <v-card
              v-if="histDoaSearchResult && !histDoaSelected"
              elevation="0"
              rounded="lg"
              class="mb-4"
              :style="
                histDoaSearchResult.isExpired
                  ? 'background: rgba(var(--v-theme-error), 0.1); border: 1px solid rgba(var(--v-theme-error), 0.25)'
                  : 'background: rgba(var(--v-theme-success), 0.08); border: 1px solid rgba(var(--v-theme-success), 0.2)'
              "
            >
              <v-card-text class="pa-4">
                <v-row align="center" no-gutters>
                  <v-col>
                    <div class="text-caption text-medium-emphasis mb-1">
                      เลขทะเบียน DOA
                    </div>
                    <div class="text-body-1 font-weight-bold text-hcex-user">
                      {{ histDoaSearchResult.regNo }}
                    </div>
                    <div class="text-body-2 mt-1">
                      {{ histDoaSearchResult.factoryName }}
                    </div>
                    <div class="d-flex align-center ga-2 mt-2">
                      <v-chip
                        size="x-small"
                        :color="
                          histDoaSearchResult.isExpired ? 'error' : 'success'
                        "
                        variant="tonal"
                      >
                        {{
                          histDoaSearchResult.isExpired
                            ? "หมดอายุ"
                            : "ใช้งานได้"
                        }}
                      </v-chip>
                      <span class="text-caption text-medium-emphasis">
                        หมดอายุ: {{ histDoaSearchResult.expiryDate }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="auto" class="d-flex flex-column ga-2 pl-4">
                    <v-btn
                      size="small"
                      color="hcex-user"
                      variant="tonal"
                      prepend-icon="fas fa-eye"
                      @click="openHistDoaViewDialog(histDoaSearchResult)"
                    >
                      ดูใบทะเบียน
                    </v-btn>
                    <v-btn
                      size="small"
                      color="hcex-user"
                      variant="flat"
                      prepend-icon="fas fa-check"
                      :disabled="histDoaSearchResult.isExpired"
                      @click="selectHistDoa"
                    >
                      เลือกทะเบียนนี้
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Not found -->
            <v-alert
              v-if="histDoaSearchNotFound"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
              prepend-icon="fas fa-circle-xmark"
              >ไม่พบเลขทะเบียน DOA "{{ histDoaSearchNo }}"
              กรุณาตรวจสอบและค้นหาใหม่</v-alert
            >

            <!-- Selected — compact inline display -->
            <div
              v-if="histDoaSelected"
              class="mt-4 d-flex align-center ga-2 flex-wrap"
            >
              <v-icon icon="fas fa-circle-check" color="success" size="16" />
              <span class="text-body-2 font-weight-medium text-success"
                >เลือกทะเบียน DOA:</span
              >
              <v-chip color="hcex-user" variant="tonal" size="small">
                {{ histDoaSelected.regNo }} —
                {{ histDoaSelected.factoryNameTh }}
              </v-chip>
              <!-- <v-btn
                size="x-small"
                variant="tonal"
                color="hcex-user"
                prepend-icon="fas fa-eye"
                @click="openHistDoaViewDialog(histDoaSelected)"
              >
                ดูใบทะเบียน
              </v-btn> -->
              <v-btn
                icon="fas fa-xmark"
                size="x-small"
                variant="text"
                color="grey"
                @click="clearHistDoa"
              />
            </div>
          </v-card-text>
        </v-card>

        <!-- DOA View Dialog -->
        <v-dialog v-model="histDoaViewDialog" max-width="680" scrollable>
          <v-card rounded="xl">
            <div
              class="d-flex align-center justify-space-between px-5 py-4 border-b"
            >
              <div class="d-flex align-center ga-2">
                <v-icon icon="fas fa-file-lines" color="hcex-user" size="16" />
                <span class="text-subtitle-1 font-weight-bold"
                  >ใบทะเบียนสำคัญ DOA</span
                >
              </div>
              <v-btn
                icon="fas fa-xmark"
                variant="text"
                size="small"
                @click="histDoaViewDialog = false"
              />
            </div>

            <v-card-text class="pa-5" v-if="histDoaViewTarget">
              <!-- Status + Reg No -->
              <div
                class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2"
              >
                <div>
                  <div class="text-caption text-medium-emphasis mb-1">
                    เลขที่ทะเบียน
                  </div>
                  <div class="text-h6 font-weight-bold text-hcex-user">
                    {{ histDoaViewTarget.regNo }}
                  </div>
                </div>
                <div class="text-right">
                  <v-chip
                    :color="histDoaViewTarget.isExpired ? 'error' : 'success'"
                    variant="flat"
                    size="small"
                    class="mb-1"
                  >
                    {{ histDoaViewTarget.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                  </v-chip>
                  <div class="text-caption text-medium-emphasis">
                    วันหมดอายุ: {{ histDoaViewTarget.expiryDate }}
                  </div>
                </div>
              </div>

              <v-divider class="mb-4" />

              <!-- ชื่อบริษัท -->
              <div class="text-subtitle-2 font-weight-bold mb-2">
                ข้อมูลบริษัทผู้ผลิต
              </div>
              <v-row dense class="mb-3">
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    ชื่อบริษัท (ภาษาไทย)
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ histDoaViewTarget.factoryNameTh }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    ชื่อบริษัท (ภาษาอังกฤษ)
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ histDoaViewTarget.factoryNameEn }}
                  </div>
                </v-col>
              </v-row>

              <!-- ที่อยู่ -->
              <div class="text-subtitle-2 font-weight-bold mb-2">ที่อยู่</div>
              <v-row dense class="mb-3">
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">
                    บ้านเลขที่
                  </div>
                  <div class="text-body-2">{{ histDoaViewTarget.houseNo }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">
                    ซอย / ตรอก
                  </div>
                  <div class="text-body-2">
                    {{ histDoaViewTarget.alley || "-" }}
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">ถนน</div>
                  <div class="text-body-2">{{ histDoaViewTarget.road }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">
                    ตำบล / แขวง
                  </div>
                  <div class="text-body-2">{{ histDoaViewTarget.tambol }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">
                    อำเภอ / เขต
                  </div>
                  <div class="text-body-2">
                    {{ histDoaViewTarget.district }}
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">จังหวัด</div>
                  <div class="text-body-2">
                    {{ histDoaViewTarget.province }}
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">
                    รหัสไปรษณีย์
                  </div>
                  <div class="text-body-2">{{ histDoaViewTarget.zipcode }}</div>
                </v-col>
              </v-row>
              <v-row dense class="mb-3">
                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis">
                    ที่อยู่ (ภาษาอังกฤษ)
                  </div>
                  <div class="text-body-2">
                    {{
                      [
                        histDoaViewTarget.houseNoEn,
                        histDoaViewTarget.alleyEn,
                        histDoaViewTarget.roadEn,
                        histDoaViewTarget.tambolEn,
                        histDoaViewTarget.districtEn,
                        histDoaViewTarget.provinceEn,
                        histDoaViewTarget.zipcodeEn,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    }}
                  </div>
                </v-col>
              </v-row>

              <!-- ข้อมูลติดต่อ -->
              <v-row dense class="mb-4">
                <v-col cols="12" sm="4">
                  <div class="text-caption text-medium-emphasis">โทรศัพท์</div>
                  <div class="text-body-2">{{ histDoaViewTarget.phone }}</div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="text-caption text-medium-emphasis">โทรสาร</div>
                  <div class="text-body-2">
                    {{ histDoaViewTarget.fax || "-" }}
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="text-caption text-medium-emphasis">อีเมล</div>
                  <div class="text-body-2">{{ histDoaViewTarget.email }}</div>
                </v-col>
              </v-row>

              <v-divider class="mb-4" />

              <!-- มาตรฐาน -->
              <div class="text-subtitle-2 font-weight-bold mb-2">
                มาตรฐานการผลิต
              </div>
              <v-table density="compact" class="rounded-lg border">
                <thead>
                  <tr>
                    <th>มาตรฐาน</th>
                    <th>หน่วยงานที่รับรอง</th>
                    <th>เลขที่ใบรับรอง</th>
                    <th>วันหมดอายุ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="std in histDoaViewTarget.standards"
                    :key="std.name"
                  >
                    <td class="font-weight-medium">{{ std.name }}</td>
                    <td>{{ std.certBody }}</td>
                    <td>{{ std.certNo }}</td>
                    <td>{{ std.expiry }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>

            <v-card-actions class="px-5 pb-4 d-flex flex-column ga-2">
              <v-btn
                color="hcex-user"
                variant="tonal"
                prepend-icon="fas fa-download"
                block
                rounded="lg"
                @click="downloadHistDoaPdf"
              >
                ดาวน์โหลด PDF
              </v-btn>
              <v-btn
                color="hcex-user"
                variant="flat"
                prepend-icon="fas fa-check"
                block
                rounded="lg"
                :disabled="histDoaViewTarget?.isExpired"
                @click="selectHistDoaFromDialog"
              >
                เลือกทะเบียนนี้
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- ข้อมูลบริษัทผู้ผลิต (from DOA) -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div
            class="d-flex align-center justify-space-between px-4 py-3 border-b flex-wrap ga-2"
          >
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-industry" color="hcex-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ข้อมูลบริษัทผู้ผลิต</span
              >
              <v-chip size="x-small" color="hcex-user" variant="tonal"
                >Auto-fill จาก DOA</v-chip
              >
            </div>
          </div>
          <v-card-text class="pt-4">
            <v-alert
              v-if="!histDoaSelected"
              type="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-circle-info"
              class="mb-0"
            >
              ค้นหาและเลือกหนังสือสำคัญ DOA เพื่อดึงข้อมูลบริษัทผู้ผลิตอัตโนมัติ
            </v-alert>
            <template v-if="histDoaSelected">
              <!-- ชื่อบริษัท -->
              <div class="field-section-label mb-2">ชื่อบริษัทผู้ผลิต</div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <div class="field-label">
                    <div>ชื่อบริษัทผู้ผลิต (ภาษาไทย)</div>
                    <div class="field-label-en">Company Name (Thai)</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.nameTh"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <div class="field-label">
                    <div>ชื่อบริษัทผู้ผลิต (ภาษาอังกฤษ)</div>
                    <div class="field-label-en">Company Name (English)</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.nameEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
              </v-row>

              <!-- ที่ตั้ง (ภาษาไทย) -->
              <div class="field-section-label mt-4 mb-2">ที่ตั้ง (ภาษาไทย)</div>
              <v-row dense>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>บ้านเลขที่</div>
                    <div class="field-label-en">House No.</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.houseNo"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>ซอย / ตรอก</div>
                    <div class="field-label-en">Alley / Soi</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.alley"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>ถนน</div>
                    <div class="field-label-en">Road</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.road"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>ตำบล / แขวง</div>
                    <div class="field-label-en">Sub-district (Tambol)</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.tambol"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>อำเภอ / เขต</div>
                    <div class="field-label-en">District</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.district"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>จังหวัด</div>
                    <div class="field-label-en">Province</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.province"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>รหัสไปรษณีย์</div>
                    <div class="field-label-en">Zipcode</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.zipcode"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
              </v-row>

              <!-- ที่ตั้ง (ภาษาอังกฤษ) -->
              <div class="field-section-label mt-4 mb-2">
                ที่ตั้ง (ภาษาอังกฤษ)
              </div>
              <v-row dense>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>บ้านเลขที่</div>
                    <div class="field-label-en">House No.</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.houseNoEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>ซอย / ตรอก</div>
                    <div class="field-label-en">Alley / Soi</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.alleyEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>ถนน</div>
                    <div class="field-label-en">Road</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.roadEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>ตำบล / แขวง</div>
                    <div class="field-label-en">Sub-district</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.tambolEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>อำเภอ / เขต</div>
                    <div class="field-label-en">District</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.districtEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>จังหวัด</div>
                    <div class="field-label-en">Province</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.provinceEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>รหัสไปรษณีย์</div>
                    <div class="field-label-en">Zipcode</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.zipcodeEn"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
              </v-row>

              <!-- ข้อมูลการติดต่อ -->
              <div class="field-section-label mt-4 mb-2">ข้อมูลการติดต่อ</div>
              <v-row dense>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>โทรศัพท์</div>
                    <div class="field-label-en">Phone Number</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.phone"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>โทรสาร</div>
                    <div class="field-label-en">Fax</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.fax"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="field-label">
                    <div>อีเมล</div>
                    <div class="field-label-en">Email</div>
                  </div>
                  <v-text-field
                    density="compact"
                    :model-value="historyFactory.email"
                    hide-details
                    readonly
                    class="field-readonly"
                  />
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลตัวแทนผู้ประสานงานผลิต (user fills) -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-user-tie" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลตัวแทนผู้ประสานงานผลิต</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  ชื่อ-นามสกุล <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyProducerContact.name"
                  hide-details
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">ตำแหน่ง</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyProducerContact.position"
                  hide-details
                  placeholder="กรอกตำแหน่ง"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  โทรศัพท์ <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyProducerContact.phone"
                  hide-details
                  placeholder="เช่น 02-xxx-xxxx"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">โทรสาร</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyProducerContact.fax"
                  hide-details
                  placeholder="เช่น 02-xxx-xxxx"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">E-mail</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyProducerContact.email"
                  hide-details
                  placeholder="example@email.com"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 4. มาตรฐานการผลิตของโรงงาน -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-award" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >4. มาตรฐานการผลิตของโรงงาน</span
            >
          </div>
          <v-card-text class="pt-4">
            <!-- 4.1 มาตรฐาน GMP -->
            <div class="d-flex align-center ga-2 mb-3">
              <div class="field-section-label mb-0">4.1 มาตรฐาน GMP</div>
              <v-chip size="x-small" color="hcex-user" variant="tonal"
                >ดึงจาก DOA</v-chip
              >
            </div>
            <v-alert
              v-if="!histDoaSelected"
              type="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-circle-info"
              class="mb-3"
            >
              ค้นหาและเลือกหนังสือสำคัญ DOA เพื่อดึงข้อมูล GMP อัตโนมัติ
            </v-alert>
            <v-row v-if="histDoaSelected" dense>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">หน่วยงานที่รับรอง</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyFactory.gmpCertBody"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  หมายเลขการรับรอง <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyFactory.gmpCertNo"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  วันที่หมดอายุ <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyFactory.gmpExpiry"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>

            <!-- 4.2 มาตรฐาน HACCP -->
            <div class="d-flex align-center ga-2 mt-5 mb-3">
              <div class="field-section-label mb-0">4.2 มาตรฐาน HACCP</div>
              <v-chip size="x-small" color="hcex-user" variant="tonal"
                >ดึงจาก DOA</v-chip
              >
            </div>
            <v-alert
              v-if="!histDoaSelected"
              type="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-circle-info"
              class="mb-3"
            >
              ค้นหาและเลือกหนังสือสำคัญ DOA เพื่อดึงข้อมูล HACCP อัตโนมัติ
            </v-alert>
            <v-row v-if="histDoaSelected" dense>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">หน่วยงานที่รับรอง</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyFactory.haccpCertBody"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  หมายเลขการรับรอง <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyFactory.haccpCertNo"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  วันที่หมดอายุ <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="historyFactory.haccpExpiry"
                  hide-details
                  readonly
                  class="field-readonly"
                />
              </v-col>
            </v-row>

            <!-- 4.3 มาตรฐานเพิ่มเติม (dialog) -->
            <div class="d-flex align-center justify-space-between mt-5 mb-3">
              <div class="field-section-label mb-0">4.3 มาตรฐานเพิ่มเติม</div>
              <v-btn
                size="small"
                variant="tonal"
                color="hcex-user"
                prepend-icon="fas fa-plus"
                @click="openExtraStdDialog()"
                >เพิ่มมาตรฐาน</v-btn
              >
            </div>

            <!-- table (display only) -->
            <v-table density="compact" class="rounded-lg border">
              <thead>
                <tr>
                  <th style="width: 40px">#</th>
                  <th>ชื่อมาตรฐาน</th>
                  <th>หน่วยงานที่รับรอง</th>
                  <th>หมายเลขการรับรอง</th>
                  <th>วันที่หมดอายุ</th>
                  <th style="width: 48px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="historyExtraStandards.length === 0">
                  <td
                    colspan="6"
                    class="text-center text-medium-emphasis text-body-2 py-4"
                  >
                    ยังไม่มีมาตรฐานเพิ่มเติม — กดปุ่ม "เพิ่มมาตรฐาน" เพื่อเพิ่ม
                  </td>
                </tr>
                <tr
                  v-for="(std, idx) in historyExtraStandards"
                  :key="'exstd-' + idx"
                >
                  <td class="text-body-2 text-medium-emphasis">
                    {{ idx + 1 }}
                  </td>
                  <td class="text-body-2">{{ std.name }}</td>
                  <td class="text-body-2">{{ std.certBody }}</td>
                  <td class="text-body-2">{{ std.certNo }}</td>
                  <td class="text-body-2">{{ std.expiry }}</td>
                  <td>
                    <v-btn
                      icon="fas fa-trash"
                      variant="text"
                      size="x-small"
                      color="error"
                      @click="removeHistoryExtraStandard(idx)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>

            <!-- Dialog เพิ่มมาตรฐาน -->
            <v-dialog v-model="extraStdDialog" max-width="480" persistent>
              <v-card rounded="xl">
                <div class="d-flex align-center ga-2 px-5 py-4 border-b">
                  <v-icon icon="fas fa-award" color="hcex-user" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >เพิ่มมาตรฐานเพิ่มเติม</span
                  >
                </div>
                <v-card-text class="pt-4">
                  <v-row dense>
                    <v-col cols="12">
                      <div class="field-label mb-1">
                        ชื่อมาตรฐาน <span class="req">*</span>
                      </div>
                      <v-text-field
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        v-model="extraStdForm.name"
                        placeholder="เช่น ISO 22000, BRC, FSSC 22000"
                        hide-details="auto"
                        :error="extraStdErrors.name"
                      />
                    </v-col>
                    <v-col cols="12" class="mt-2">
                      <div class="field-label mb-1">
                        หน่วยงานที่รับรอง <span class="req">*</span>
                      </div>
                      <v-text-field
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        v-model="extraStdForm.certBody"
                        placeholder="กรอกหน่วยงาน"
                        hide-details="auto"
                        :error="extraStdErrors.certBody"
                      />
                    </v-col>
                    <v-col cols="12" sm="7" class="mt-2">
                      <div class="field-label mb-1">
                        หมายเลขการรับรอง <span class="req">*</span>
                      </div>
                      <v-text-field
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        v-model="extraStdForm.certNo"
                        placeholder="กรอกหมายเลข"
                        hide-details="auto"
                        :error="extraStdErrors.certNo"
                      />
                    </v-col>
                    <v-col cols="12" sm="5" class="mt-2">
                      <div class="field-label mb-1">
                        วันที่หมดอายุ <span class="req">*</span>
                      </div>
                      <v-menu
                        v-model="extraStdExpiryMenu"
                        :close-on-content-click="false"
                        location="bottom start"
                      >
                        <template #activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            :model-value="extraStdForm.expiry"
                            readonly
                            clearable
                            prepend-inner-icon="fas fa-calendar"
                            placeholder="เลือกวันที่"
                            hide-details="auto"
                            :error="extraStdErrors.expiry"
                            style="cursor: pointer"
                            @click:clear.stop="extraStdExpiryObj = null"
                          />
                        </template>
                        <v-date-picker
                          v-model="extraStdExpiryObj"
                          color="hcex-user"
                          show-adjacent-months
                          :hide-header="!extraStdExpiryObj"
                          title="เลือกวันที่"
                          locale="th"
                          @update:model-value="extraStdExpiryMenu = false"
                        />
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0 d-flex ga-2">
                  <v-btn
                    variant="text"
                    color="grey"
                    @click="extraStdDialog = false"
                    >ยกเลิก</v-btn
                  >
                  <v-spacer />
                  <v-btn
                    color="hcex-user"
                    variant="flat"
                    rounded="lg"
                    prepend-icon="fas fa-plus"
                    @click="confirmExtraStd"
                    >เพิ่มมาตรฐาน</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>

        <!-- 7. รายละเอียดสินค้า -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-boxes-stacked" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >รายละเอียดสินค้า</span
            >
            <v-chip size="x-small" color="grey" variant="tonal" class="ml-1"
              >1 ผู้ผลิต / 1 ใบคำขอ</v-chip
            >
            <v-spacer />
            <v-btn
              color="hcex-user"
              variant="tonal"
              size="small"
              prepend-icon="fas fa-plus"
              @click="openAddProductDialog"
              >เพิ่มสินค้า</v-btn
            >
          </div>

          <!-- ตารางสินค้า -->
          <v-data-table
            :headers="productTableHeaders"
            :items="historyProducts"
            hide-default-footer
            density="compact"
          >
            <template #item.productName="{ item }">
              <span class="text-body-2 font-weight-medium">{{
                item.productName || "-"
              }}</span>
            </template>
            <template #item.countries="{ item }">
              <div class="d-flex flex-wrap ga-1 py-1">
                <v-chip
                  v-for="c in item.countries"
                  :key="c"
                  size="x-small"
                  color="hcex-user"
                  variant="tonal"
                  >{{ c }}</v-chip
                >
                <span
                  v-if="!item.countries.length"
                  class="text-medium-emphasis text-caption"
                  >-</span
                >
              </div>
            </template>
            <template #item.standardType="{ item }">
              <div class="d-flex flex-wrap ga-1 py-1">
                <v-chip
                  v-if="item.standardTypes.includes('doa')"
                  size="x-small"
                  color="success"
                  variant="tonal"
                >
                  DOA<template v-if="item.doaOrderNo">
                    (ลำดับที่ {{ item.doaOrderNo }})</template
                  >
                </v-chip>
                <template v-if="item.standardTypes.includes('other')">
                  <v-chip
                    v-if="!item.otherStandards?.length"
                    size="x-small"
                    color="info"
                    variant="tonal"
                    >อื่นๆ</v-chip
                  >
                  <v-chip
                    v-for="s in item.otherStandards"
                    :key="s.name"
                    size="x-small"
                    color="info"
                    variant="tonal"
                    >{{ s.name }}</v-chip
                  >
                </template>
                <span
                  v-if="!item.standardTypes.length"
                  class="text-caption text-medium-emphasis"
                  >-</span
                >
              </div>
            </template>
            <template #item.tests="{ item }">
              <div class="d-flex flex-wrap ga-1 py-1">
                <template
                  v-for="t in [
                    ...(item.doaTests ?? []).map((x) => x.name),
                    ...(item.otherStandards ?? []).flatMap((s) =>
                      s.tests.map((x) => (typeof x === 'string' ? x : x.name)),
                    ),
                  ].slice(0, 3)"
                  :key="t"
                >
                  <v-chip size="x-small" variant="outlined" color="grey">{{
                    t
                  }}</v-chip>
                </template>
                <v-chip
                  v-if="
                    [
                      ...(item.doaTests ?? []),
                      ...(item.otherStandards ?? []).flatMap((s) => s.tests),
                    ].length > 3
                  "
                  size="x-small"
                  color="grey"
                  variant="tonal"
                  >+{{
                    [
                      ...(item.doaTests ?? []),
                      ...(item.otherStandards ?? []).flatMap((s) => s.tests),
                    ].length - 3
                  }}</v-chip
                >
                <span
                  v-if="
                    ![
                      ...(item.doaTests ?? []),
                      ...(item.otherStandards ?? []).flatMap((s) => s.tests),
                    ].length
                  "
                  class="text-medium-emphasis text-caption"
                  >-</span
                >
              </div>
            </template>
            <template #item.actions="{ index }">
              <div class="d-flex ga-1 justify-end">
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  color="hcex-user"
                  @click="openEditProductDialog(index)"
                >
                  <v-icon icon="fas fa-pen" size="13" />
                </v-btn>
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  color="error"
                  @click="removeHistoryProduct(index)"
                >
                  <v-icon icon="fas fa-trash" size="13" />
                </v-btn>
              </div>
            </template>
            <template #no-data>
              <div class="text-center py-6 text-medium-emphasis text-body-2">
                ยังไม่มีสินค้า — กด "เพิ่มสินค้า" เพื่อเริ่มต้น
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- Dialog เพิ่ม/แก้ไขสินค้า -->
        <v-dialog v-model="productDialog" max-width="560" scrollable>
          <v-card rounded="xl">
            <div
              class="d-flex align-center justify-space-between px-5 py-4 border-b"
            >
              <div class="d-flex align-center ga-2">
                <v-icon
                  icon="fas fa-boxes-stacked"
                  color="hcex-user"
                  size="16"
                />
                <span class="text-subtitle-1 font-weight-bold">
                  {{
                    productDialogMode === "add" ? "เพิ่มสินค้า" : "แก้ไขสินค้า"
                  }}
                </span>
              </div>
              <v-btn
                icon="fas fa-xmark"
                variant="text"
                size="small"
                @click="productDialog = false"
              />
            </div>
            <v-card-text class="pa-5">
              <!-- ชื่อสินค้า -->
              <div class="field-label mb-1">
                รายการสินค้าเพื่อส่งออกด้านพืช <span class="req">*</span>
              </div>
              <v-text-field
                density="compact"
                variant="outlined"
                rounded="lg"
                v-model="productForm.productName"
                hide-details
                placeholder="กรอกชื่อสินค้า"
                class="mb-4"
              />

              <!-- ประเทศปลายทาง -->
              <div class="field-label mb-1">
                ประเทศปลายทาง <span class="req">*</span>
                <span class="text-caption text-medium-emphasis ml-1"
                  >(เลือกได้มากกว่า 1)</span
                >
              </div>
              <v-autocomplete
                density="compact"
                variant="outlined"
                rounded="lg"
                v-model="productForm.countries"
                :items="countryOptions"
                multiple
                chips
                closable-chips
                hide-details
                placeholder="เลือกประเทศปลายทาง"
                class="mb-4"
              />

              <!-- มาตรฐานสินค้า -->
              <div class="field-label mb-2">
                มาตรฐานสินค้า <span class="req">*</span>
              </div>
              <div class="d-flex ga-3 mb-4">
                <div
                  v-for="opt in [
                    {
                      value: 'doa',
                      icon: 'fas fa-leaf',
                      label: 'มาตรฐานกรมวิชาการเกษตร',
                      // sub: 'กำหนดรายการทดสอบอัตโนมัติ',
                      color: 'hcex-user',
                    },
                    {
                      value: 'other',
                      icon: 'fas fa-certificate',
                      label: 'มาตรฐานอื่นๆ',
                      // sub: 'ระบุมาตรฐานและรายการทดสอบเอง',
                      color: 'hcex-user',
                    },
                  ]"
                  :key="opt.value"
                  class="flex-1-1 rounded-lg pa-3 cursor-pointer"
                  style="border: 2px solid; transition: all 0.15s"
                  :style="
                    productForm.standardTypes.includes(opt.value)
                      ? {
                          borderColor: `rgb(var(--v-theme-${opt.color}))`,
                          background: `rgba(var(--v-theme-${opt.color}), 0.08)`,
                        }
                      : {
                          borderColor:
                            'rgba(var(--v-border-color), var(--v-border-opacity))',
                          background: 'transparent',
                        }
                  "
                  @click="
                    productForm.standardTypes.includes(opt.value)
                      ? productForm.standardTypes.splice(
                          productForm.standardTypes.indexOf(opt.value),
                          1,
                        )
                      : productForm.standardTypes.push(opt.value)
                  "
                >
                  <div class="d-flex align-center ga-2 mb-1">
                    <v-icon
                      :icon="opt.icon"
                      size="14"
                      :color="
                        productForm.standardTypes.includes(opt.value)
                          ? opt.color
                          : 'medium-emphasis'
                      "
                    />
                    <span
                      class="text-body-2 font-weight-medium"
                      :style="
                        productForm.standardTypes.includes(opt.value)
                          ? `color: rgb(var(--v-theme-${opt.color}))`
                          : ''
                      "
                      >{{ opt.label }}</span
                    >
                    <v-icon
                      v-if="productForm.standardTypes.includes(opt.value)"
                      icon="fas fa-circle-check"
                      size="13"
                      :color="opt.color"
                      class="ml-auto"
                    />
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ opt.sub }}
                  </div>
                </div>
              </div>

              <!-- DOA: ลำดับที่ -->
              <template v-if="productForm.standardTypes.includes('doa')">
                <div class="field-label mb-1">
                  ลำดับที่ <span class="req">*</span>
                </div>
                <v-select
                  v-model="productForm.doaOrderNo"
                  :items="doaOrderNoItems"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกลำดับที่"
                  class="mb-4"
                />
              </template>

              <!-- DOA: ตารางรายการทดสอบ -->
              <template v-if="productForm.standardTypes.includes('doa')">
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="field-label">รายการทดสอบ (DOA)</div>
                  <v-chip
                    v-if="productForm.doaOrderNo"
                    size="x-small"
                    color="hcex-user"
                    variant="tonal"
                  >
                    ลำดับที่ {{ productForm.doaOrderNo }} — โหลดอัตโนมัติ
                  </v-chip>
                  <span v-else class="text-caption text-medium-emphasis"
                    >เลือกลำดับที่เพื่อโหลดอัตโนมัติ</span
                  >
                </div>
                <div
                  class="rounded-lg overflow-hidden mb-4"
                  style="
                    border: 1px solid
                      rgba(var(--v-border-color), var(--v-border-opacity));
                  "
                >
                  <table class="test-table w-100">
                    <thead>
                      <tr>
                        <th
                          class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2"
                        >
                          รายการทดสอบ
                        </th>
                        <th
                          class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2"
                        >
                          เกณฑ์การทดสอบ
                        </th>
                        <th style="width: 36px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(t, ti) in productForm.doaTests" :key="ti">
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="t.name"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="ชื่อรายการทดสอบ"
                            class="text-body-2"
                          />
                        </td>
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="t.criteria"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="ระบุเกณฑ์..."
                            class="text-body-2"
                          />
                        </td>
                        <td class="px-1 text-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="error"
                            @click="removeDoaTest(ti)"
                          >
                            <v-icon icon="fas fa-xmark" size="11" />
                          </v-btn>
                        </td>
                      </tr>
                      <!-- add row -->
                      <tr class="add-row">
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="doaTestEntry.name"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="+ รายการทดสอบใหม่"
                            class="text-body-2"
                            @keyup.enter="addDoaTest"
                          />
                        </td>
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="doaTestEntry.criteria"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="เกณฑ์..."
                            class="text-body-2"
                            @keyup.enter="addDoaTest"
                          />
                        </td>
                        <td class="px-1 text-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="tonal"
                            color="hcex-user"
                            :disabled="!doaTestEntry.name.trim()"
                            @click="addDoaTest"
                          >
                            <v-icon icon="fas fa-plus" size="11" />
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>

              <!-- Other: per-standard entries -->
              <template v-if="productForm.standardTypes.includes('other')">
                <div class="field-label mb-2">มาตรฐานอื่นๆ</div>

                <!-- saved standard cards (editable) -->
                <div
                  v-for="(std, si) in productForm.otherStandards"
                  :key="si"
                  class="rounded-lg overflow-hidden mb-2"
                  style="border: 1px solid rgba(var(--v-theme-hcex-user), 0.3)"
                >
                  <div
                    class="d-flex align-center ga-2 px-3 py-2"
                    style="
                      background: rgba(var(--v-theme-hcex-user), 0.06);
                      border-bottom: 1px solid
                        rgba(var(--v-theme-hcex-user), 0.15);
                    "
                  >
                    <v-icon
                      icon="fas fa-certificate"
                      size="12"
                      color="hcex-user"
                      class="flex-shrink-0"
                    />
                    <v-text-field
                      v-model="std.name"
                      density="compact"
                      variant="plain"
                      hide-details
                      placeholder="ชื่อมาตรฐาน"
                      class="text-body-2 font-weight-medium flex-grow-1"
                      style="color: rgb(var(--v-theme-hcex-user))"
                    />
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="error"
                      class="flex-shrink-0"
                      @click="removeOtherStandard(si)"
                    >
                      <v-icon icon="fas fa-xmark" size="11" />
                    </v-btn>
                  </div>
                  <table class="test-table w-100">
                    <thead>
                      <tr>
                        <th
                          class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2"
                        >
                          รายการทดสอบ
                        </th>
                        <th
                          class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2"
                        >
                          เกณฑ์การทดสอบ
                        </th>
                        <th style="width: 36px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(t, ti) in std.tests" :key="ti">
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="t.name"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="ชื่อรายการทดสอบ"
                            class="text-body-2"
                          />
                        </td>
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="t.criteria"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="ระบุเกณฑ์..."
                            class="text-body-2"
                          />
                        </td>
                        <td class="px-1 text-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="error"
                            @click="removeOtherStandardTest(si, ti)"
                          >
                            <v-icon icon="fas fa-xmark" size="11" />
                          </v-btn>
                        </td>
                      </tr>
                      <!-- add row per standard -->
                      <tr class="add-row">
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="std._newTestName"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="+ รายการทดสอบใหม่"
                            class="text-body-2"
                            @keyup.enter="addTestToSavedStandard(si, std)"
                          />
                        </td>
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="std._newTestCriteria"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="เกณฑ์..."
                            class="text-body-2"
                            @keyup.enter="addTestToSavedStandard(si, std)"
                          />
                        </td>
                        <td class="px-1 text-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="tonal"
                            color="info"
                            :disabled="!std._newTestName?.trim()"
                            @click="addTestToSavedStandard(si, std)"
                          >
                            <v-icon icon="fas fa-plus" size="11" />
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- draft: new standard -->
                <div
                  class="rounded-lg overflow-hidden mb-3"
                  style="
                    border: 1px dashed rgba(var(--v-theme-hcex-user), 0.4);
                    background: rgba(var(--v-theme-hcex-user), 0.025);
                  "
                >
                  <div
                    class="d-flex align-center ga-2 px-3 py-2"
                    style="
                      border-bottom: 1px dashed
                        rgba(var(--v-theme-hcex-user), 0.3);
                    "
                  >
                    <v-icon
                      icon="fas fa-certificate"
                      size="12"
                      color="hcex-user"
                    />
                    <v-text-field
                      v-model="otherStdDraft.name"
                      density="compact"
                      variant="plain"
                      hide-details
                      placeholder="ชื่อมาตรฐาน เช่น GlobalG.A.P, BRC, ISO 22000"
                      class="text-body-2 font-weight-medium flex-grow-1"
                      style="color: rgb(var(--v-theme-hcex-user))"
                    />
                  </div>
                  <table class="test-table w-100">
                    <thead>
                      <tr>
                        <th
                          class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2"
                        >
                          รายการทดสอบ
                        </th>
                        <th
                          class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2"
                        >
                          เกณฑ์การทดสอบ
                        </th>
                        <th style="width: 36px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(t, ti) in otherStdDraft.tests" :key="ti">
                        <td class="px-3 py-2 text-body-2">{{ t.name }}</td>
                        <td class="px-3 py-2 text-caption text-medium-emphasis">
                          {{ t.criteria || "—" }}
                        </td>
                        <td class="px-1 text-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="error"
                            @click="removeFromOtherStdDraft(ti)"
                          >
                            <v-icon icon="fas fa-xmark" size="11" />
                          </v-btn>
                        </td>
                      </tr>
                      <!-- add row -->
                      <tr class="add-row">
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="otherTestDraft.name"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="+ รายการทดสอบใหม่"
                            class="text-body-2"
                            @keyup.enter="addToOtherStdDraft"
                          />
                        </td>
                        <td class="px-2 py-1">
                          <v-text-field
                            v-model="otherTestDraft.criteria"
                            density="compact"
                            variant="plain"
                            hide-details
                            placeholder="เกณฑ์..."
                            class="text-body-2"
                            @keyup.enter="addToOtherStdDraft"
                          />
                        </td>
                        <td class="px-1 text-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="tonal"
                            color="info"
                            :disabled="!otherTestDraft.name.trim()"
                            @click="addToOtherStdDraft"
                          >
                            <v-icon icon="fas fa-plus" size="11" />
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="px-3 pb-3 pt-2">
                    <v-btn
                      size="small"
                      color="hcex-user"
                      variant="flat"
                      rounded="lg"
                      :disabled="!otherStdDraft.name.trim()"
                      prepend-icon="fas fa-floppy-disk"
                      @click="commitOtherStd"
                    >
                      บันทึกมาตรฐานนี้
                    </v-btn>
                  </div>
                </div>
              </template>

              <v-alert
                v-if="productForm.standardTypes.length === 0"
                density="compact"
                variant="tonal"
                color="warning"
                rounded="lg"
                prepend-icon="fas fa-triangle-exclamation"
                class="mt-1"
                >กรุณาเลือกอย่างน้อย 1 มาตรฐาน</v-alert
              >
            </v-card-text>
            <v-card-actions class="pa-4 pt-0 d-flex ga-2">
              <v-btn variant="text" color="grey" @click="productDialog = false"
                >ยกเลิก</v-btn
              >
              <v-spacer />
              <v-btn
                color="hcex-user"
                variant="flat"
                rounded="lg"
                @click="confirmProductDialog"
                >{{
                  productDialogMode === "add" ? "เพิ่มสินค้า" : "บันทึก"
                }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- ─── LAB TYPE ─── -->
      <template v-if="route.params.type === 'lab'">
        <!-- ข้อมูลตัวอย่างและสินค้า -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-flask" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลตัวอย่างและสินค้า</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  วันที่สุ่มเก็บตัวอย่าง (Date Collected)
                  <span class="req">*</span>
                </div>
                <v-menu
                  v-model="labDateCollectedMenu"
                  :close-on-content-click="false"
                  location="bottom start"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      :model-value="labForm.dateCollected"
                      readonly
                      clearable
                      prepend-inner-icon="fas fa-calendar"
                      placeholder="เลือกวันที่"
                      hide-details
                      style="cursor: pointer"
                      @click:clear.stop="labDateCollectedObj = null"
                    />
                  </template>
                  <v-date-picker
                    v-model="labDateCollectedObj"
                    color="hcex-user"
                    show-adjacent-months
                    :hide-header="!labDateCollectedObj"
                    title="เลือกวันที่"
                    locale="th"
                    @update:model-value="labDateCollectedMenu = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  รหัสผลิตภัณฑ์ (Product Code) <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.productCode"
                  hide-details
                  placeholder="กรอกรหัสผลิตภัณฑ์"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  วันที่ผลิต (MFG Date) <span class="req">*</span>
                </div>
                <v-menu
                  v-model="labMfgDateMenu"
                  :close-on-content-click="false"
                  location="bottom start"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      :model-value="labForm.mfgDate"
                      readonly
                      clearable
                      prepend-inner-icon="fas fa-calendar"
                      placeholder="เลือกวันที่"
                      hide-details
                      style="cursor: pointer"
                      @click:clear.stop="labMfgDateObj = null"
                    />
                  </template>
                  <v-date-picker
                    v-model="labMfgDateObj"
                    color="hcex-user"
                    show-adjacent-months
                    :hide-header="!labMfgDateObj"
                    title="เลือกวันที่"
                    locale="th"
                    @update:model-value="labMfgDateMenu = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  วันหมดอายุ (EXP Date) <span class="req">*</span>
                </div>
                <v-menu
                  v-model="labExpDateMenu"
                  :close-on-content-click="false"
                  location="bottom start"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      :model-value="labForm.expDate"
                      readonly
                      clearable
                      prepend-inner-icon="fas fa-calendar"
                      placeholder="เลือกวันที่"
                      hide-details
                      style="cursor: pointer"
                      @click:clear.stop="labExpDateObj = null"
                    />
                  </template>
                  <v-date-picker
                    v-model="labExpDateObj"
                    color="hcex-user"
                    show-adjacent-months
                    :hide-header="!labExpDateObj"
                    title="เลือกวันที่"
                    locale="th"
                    @update:model-value="labExpDateMenu = false"
                  />
                </v-menu>
                <div class="text-caption text-medium-emphasis mt-1">
                  ต้องมากกว่าวันที่ผลิต
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 5. ข้อมูลผลิตภัณฑ์ + 6. สถานที่ผู้ผลิต -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-box-open" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผลิตภัณฑ์และสถานที่ผู้ผลิต</span
            >
          </div>
          <v-card-text class="pt-4">
            <!-- 6. เลือกผู้ผลิตจากทะเบียน -->
            <div class="field-section-label mb-3">
              6. สถานที่ผู้ผลิต (Name and Address of Manufacturer)
            </div>
            <v-alert
              density="compact"
              variant="tonal"
              color="info"
              rounded="lg"
              class="mb-4"
              prepend-icon="fas fa-circle-info"
            >
              เลือกผู้ผลิตจากทะเบียนประวัติที่เคยบันทึกไว้ —
              ระบบจะดึงข้อมูลมาแสดงอัตโนมัติ
            </v-alert>
            <v-row dense>
              <v-col cols="12" sm="8">
                <div class="field-label mb-1">
                  ผู้ผลิต <span class="req">*</span>
                </div>
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.manufacturer"
                  :items="manufacturerOptions"
                  item-title="name"
                  item-value="id"
                  hide-details
                  placeholder="เลือกผู้ผลิตจากทะเบียนประวัติ"
                  prepend-inner-icon="fas fa-industry"
                  @update:model-value="onManufacturerChange"
                />
              </v-col>
            </v-row>
            <v-row dense class="mt-2" v-if="labForm.manufacturer">
              <v-col cols="12">
                <div class="field-label mb-1">ที่อยู่โรงงาน</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  :model-value="selectedManufacturerAddress"
                  readonly
                  class="field-readonly"
                  hide-details
                />
              </v-col>
            </v-row>

            <!-- 5. ชื่อผลิตภัณฑ์ (auto fill) -->
            <div class="field-section-label mt-5 mb-3">5. ข้อมูลผลิตภัณฑ์</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">ชื่อผลิตภัณฑ์ (ภาษาไทย)</div>
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.product"
                  :items="productOptions"
                  item-title="nameTh"
                  item-value="id"
                  hide-details
                  placeholder="เลือกผลิตภัณฑ์"
                  :disabled="!labForm.manufacturer"
                  @update:model-value="onProductChange"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">ชื่อผลิตภัณฑ์ (ภาษาอังกฤษ)</div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  :model-value="selectedProductNameEn"
                  readonly
                  class="field-readonly"
                  hide-details
                  placeholder="Auto fill จากทะเบียนประวัติ"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 7. สถานที่สุ่มเก็บตัวอย่าง + 8. ห้องปฏิบัติการ + 9. วันนำส่ง -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-microscope" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >สถานที่เก็บตัวอย่างและห้องปฏิบัติการ</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-row dense>
              <v-col cols="12">
                <div class="field-label mb-1">
                  7. สถานที่สุ่มเก็บตัวอย่าง (Collecting Location)
                  <span class="req">*</span>
                </div>
                <v-textarea
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.collectingLocation"
                  hide-details
                  placeholder="ระบุสถานที่สุ่มเก็บตัวอย่าง"
                  rows="2"
                  auto-grow
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label mb-1 mt-2">
                  8. ห้องปฏิบัติการที่ส่งทดสอบ (Testing Laboratory)
                  <span class="req">*</span>
                </div>
                <v-select
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.laboratory"
                  :items="laboratoryOptions"
                  item-title="name"
                  item-value="id"
                  hide-details
                  placeholder="เลือกห้องปฏิบัติการ"
                  prepend-inner-icon="fas fa-flask"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1 mt-2">
                  9. วันที่นำส่งตัวอย่าง (Date Delivered)
                  <span class="req">*</span>
                </div>
                <v-menu
                  v-model="labDateDeliveredMenu"
                  :close-on-content-click="false"
                  location="bottom start"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      :model-value="labForm.dateDelivered"
                      readonly
                      clearable
                      prepend-inner-icon="fas fa-calendar"
                      placeholder="เลือกวันที่"
                      hide-details
                      style="cursor: pointer"
                      @click:clear.stop="labDateDeliveredObj = null"
                    />
                  </template>
                  <v-date-picker
                    v-model="labDateDeliveredObj"
                    color="hcex-user"
                    show-adjacent-months
                    :hide-header="!labDateDeliveredObj"
                    title="เลือกวันที่"
                    locale="th"
                    @update:model-value="labDateDeliveredMenu = false"
                  />
                </v-menu>
                <div class="text-caption text-medium-emphasis mt-1">
                  ต้องไม่น้อยกว่าวันที่สุ่มเก็บตัวอย่าง
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 13. ประเทศปลายทาง -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-earth-asia" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >13. ประเทศปลายทางที่ส่งออก (Country of Destination)</span
            >
          </div>
          <v-card-text class="pt-4">
            <div class="field-label mb-1">
              เลือกประเทศปลายทาง <span class="req">*</span>
              <span class="text-caption text-medium-emphasis"
                >(เลือกได้มากกว่า 1 ประเทศ)</span
              >
            </div>
            <v-autocomplete
              density="compact"
              variant="outlined"
              rounded="lg"
              v-model="labForm.countries"
              :items="labCountryOptions"
              multiple
              chips
              closable-chips
              hide-details
              placeholder="เลือกประเทศปลายทาง"
            />
            <v-alert
              v-if="labForm.countries.some((c) => ['USA / CANADA'].includes(c))"
              density="compact"
              variant="tonal"
              color="warning"
              rounded="lg"
              class="mt-3"
              prepend-icon="fas fa-triangle-exclamation"
            >
              การเลือก USA / CANADA จะ filter
              รายการทดสอบตามข้อกำหนดเฉพาะของประเทศ
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- 10. วัตถุประสงค์ -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-bullseye" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >10. วัตถุประสงค์การสุ่มเก็บตัวอย่าง (Objective of
              Collection)</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-radio-group
              v-model="labForm.objective"
              color="hcex-user"
              density="compact"
            >
              <v-radio
                value="hc"
                label="ขอใบรับรองเพื่อขอใบรับรองสุขอนามัย (Issuance of HC)"
              />
              <v-radio
                value="lotbylot"
                label="แนบทะเบียนประวัติ (Lot by Lot)"
              />
              <v-radio
                value="whole"
                label="แบบทั้งระบบการผลิต (Whole Product System)"
              />
            </v-radio-group>

            <!-- กรณีเลือก Whole Product System -->
            <v-expand-transition>
              <div v-if="labForm.objective === 'whole'" class="mt-2">
                <div class="field-section-label mb-3">
                  ข้อมูลจากทะเบียนประวัติ (Auto fill)
                </div>
                <v-row dense class="mb-4">
                  <v-col cols="12" sm="4">
                    <div class="field-label mb-1">หมายเลขทะเบียนโรงงาน</div>
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      model-value="DOA-2568-12345"
                      readonly
                      class="field-readonly"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label mb-1">มาตรฐาน GMP / HACCP</div>
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      model-value="GMP, HACCP"
                      readonly
                      class="field-readonly"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label mb-1">วันหมดอายุ</div>
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      model-value="31/12/2569"
                      readonly
                      class="field-readonly"
                      hide-details
                    />
                  </v-col>
                </v-row>
                <div class="field-section-label mb-2">ตัวเลือกเพิ่มเติม</div>
                <v-checkbox
                  v-model="labForm.wholeOptions"
                  value="new_apply"
                  color="hcex-user"
                  density="compact"
                  hide-details
                  label="ทดสอบเพื่อยื่นขึ้นทะเบียนใหม่ (New Apply)"
                />
                <v-checkbox
                  v-model="labForm.wholeOptions"
                  value="maintain"
                  color="hcex-user"
                  density="compact"
                  hide-details
                  label="ทดสอบเพื่อขยายขอบเขต (Maintain System)"
                />
                <v-checkbox
                  v-model="labForm.wholeOptions"
                  value="extend"
                  color="hcex-user"
                  density="compact"
                  hide-details
                  label="ทดสอบเพื่อขยายขอบข่าย (Extend Scope)"
                />
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>

        <!-- 11. ปริมาณการส่งออก -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-weight-hanging" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >11. ปริมาณการส่งออก (Export Volume)</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-row dense align="center">
              <v-col cols="12" sm="3">
                <div class="field-label mb-1">
                  จำนวน <span class="req">*</span>
                </div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.exportVolume"
                  hide-details
                  placeholder="0"
                  type="number"
                  min="1"
                />
              </v-col>
              <v-col cols="12" sm="9">
                <div class="field-label mb-1">
                  หน่วย <span class="req">*</span>
                </div>
                <v-radio-group
                  v-model="labForm.exportUnit"
                  color="hcex-user"
                  density="compact"
                  inline
                  hide-details
                >
                  <v-radio value="cartons" label="Cartons" class="mr-4" />
                  <v-radio value="boxes" label="Boxes" class="mr-4" />
                  <v-radio value="tons" label="Tons" class="mr-4" />
                  <v-radio value="others" label="Others" />
                </v-radio-group>
                <v-text-field
                  v-if="labForm.exportUnit === 'others'"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.exportUnitOther"
                  hide-details
                  placeholder="ระบุหน่วย"
                  class="mt-2"
                  style="max-width: 200px"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 14. รายการทดสอบ (auto display + user result input) -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-list-check" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >14. รายการทดสอบตามมาตรฐานที่ใช้ส่งออก</span
            >
            <v-chip size="x-small" color="grey" variant="tonal" class="ml-1"
              >Auto</v-chip
            >
          </div>
          <v-card-text class="pt-4">
            <v-alert
              density="compact"
              variant="tonal"
              color="info"
              rounded="lg"
              class="mb-4"
              prepend-icon="fas fa-circle-info"
            >
              รายการทดสอบและเกณฑ์ถูกกำหนดอัตโนมัติตามประเทศปลายทางและมาตรฐานสินค้า
              — กรุณาระบุผลการทดสอบในช่องด้านขวา
            </v-alert>
            <v-table density="compact" class="rounded-lg border">
              <thead>
                <tr>
                  <th class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2" style="width: 35%">
                    รายการทดสอบ
                  </th>
                  <th class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2" style="width: 30%">
                    เกณฑ์
                  </th>
                  <th class="text-left text-caption font-weight-medium text-medium-emphasis px-3 py-2" style="width: 35%">
                    ผลการทดสอบ <span class="text-error">*</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in autoTestItems" :key="item.name">
                  <td class="px-3 py-2">
                    <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
                  </td>
                  <td class="px-3 py-2">
                    <span class="text-body-2 text-medium-emphasis">{{ item.criteria }}</span>
                  </td>
                  <td class="px-3 py-2">
                    <v-text-field
                      v-model="item.result"
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      hide-details
                      placeholder="ระบุผลการทดสอบ"
                      class="text-body-2"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- 15. Special Remark -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-comment-dots" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >15. การระบุข้อความพิเศษ (Special Remark)</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-radio-group
              v-model="labForm.specialRemark"
              color="hcex-user"
              density="compact"
            >
              <v-radio value="none" label="ไม่ระบุ (None)" />
              <v-radio value="custom" label="ระบุข้อความพิเศษตามความประสงค์" />
              <v-radio value="ffc" label='ระบุ "Fit for Human Consumption"' />
            </v-radio-group>
            <v-expand-transition>
              <div v-if="labForm.specialRemark === 'custom'" class="mt-2">
                <div class="field-label mb-1">
                  ข้อความพิเศษ <span class="req">*</span>
                </div>
                <v-textarea
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  v-model="labForm.specialRemarkText"
                  hide-details
                  placeholder="ระบุข้อความพิเศษ"
                  rows="3"
                />
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>

        <!-- 16. มาตรฐานกรมวิชาการเกษตร (auto display) -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-book-open" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >16. ระบุมาตรฐานกรมวิชาการเกษตร ตามคู่มือ</span
            >
            <v-chip size="x-small" color="grey" variant="tonal" class="ml-1"
              >Auto</v-chip
            >
          </div>
          <v-card-text class="pt-4">
            <v-alert
              density="compact"
              variant="tonal"
              color="grey"
              rounded="lg"
              prepend-icon="fas fa-lock"
              class="mb-3"
              >ระบบแสดงมาตรฐานอ้างอิงอัตโนมัติ — ไม่สามารถแก้ไขได้</v-alert
            >
            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item
                prepend-icon="fas fa-circle-dot"
                base-color="hcex-user"
                class="px-0"
              >
                <template #title
                  ><span class="text-body-2"
                    >ภาคผนวก 3 ลำดับที่ 1 —
                    มาตรฐานทั่วไปสำหรับสินค้าแปรรูปด้านพืช</span
                  ></template
                >
              </v-list-item>
              <v-list-item
                prepend-icon="fas fa-circle-dot"
                base-color="hcex-user"
                class="px-0"
              >
                <template #title
                  ><span class="text-body-2"
                    >มาตรฐานเฉพาะประเทศปลายทาง (ตามที่เลือก)</span
                  ></template
                >
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- 19. ข้อมูลอื่นๆ -->
        <v-card elevation="0" border rounded="xl" class="mb-5">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-pen-to-square" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >19. ข้อมูลอื่น ๆ (Other Data)</span
            >
          </div>
          <v-card-text class="pt-4">
            <v-textarea
              density="compact"
              variant="outlined"
              rounded="lg"
              v-model="labForm.otherData"
              hide-details
              placeholder="ระบุข้อมูลเพิ่มเติม (ถ้ามี)"
              rows="3"
            />
          </v-card-text>
        </v-card>
      </template>
    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 1">
      <!-- เอกสารสำหรับ newrequest type -->
      <v-card
        v-if="route.params.type === 'newrequest'"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pt-5">
          <div
            v-for="doc in regDocs"
            :key="doc.key"
            class="item-row rounded-lg pa-3 mb-2"
          >
            <v-row align="center" no-gutters>
              <v-col>
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
                  <span v-else class="req ml-1">*</span>
                </div>
                <!-- <div class="text-caption text-medium-emphasis">
                  PDF, JPG, JPEG, PNG ขนาดไม่เกิน 10 MB
                </div> -->
              </v-col>
              <v-col cols="auto" class="d-flex align-center ga-2 pl-3">
                <v-chip
                  v-if="uploadedFiles[doc.key]"
                  color="success"
                  size="x-small"
                  variant="tonal"
                  prepend-icon="fas fa-check"
                  >{{ uploadedFiles[doc.key] }}</v-chip
                >
                <v-btn
                  v-if="uploadedFiles[doc.key]"
                  icon="fas fa-xmark"
                  color="error"
                  variant="text"
                  size="small"
                  @click="removeFile(doc.key)"
                />
                <v-btn
                  :color="uploadedFiles[doc.key] ? 'warning' : 'hcex-user'"
                  variant="tonal"
                  size="small"
                  prepend-icon="fas fa-upload"
                  @click="triggerFileInput(doc.key)"
                >
                  {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- เอกสารสำหรับ lab type -->
      <v-card
        v-if="route.params.type === 'lab'"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pt-5">
          <div
            v-for="doc in labDocs"
            :key="doc.key"
            class="item-row rounded-lg pa-3 mb-2"
          >
            <v-row align="center" no-gutters>
              <v-col>
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
                  <span v-else class="req ml-1">*</span>
                </div>
                <!-- <div class="text-caption text-medium-emphasis">
                  PDF, JPG, JPEG, PNG ขนาดไม่เกิน 10 MB
                </div> -->
              </v-col>
              <v-col cols="auto" class="d-flex align-center ga-2 pl-3">
                <v-chip
                  v-if="uploadedFiles[doc.key]"
                  color="success"
                  size="x-small"
                  variant="tonal"
                  prepend-icon="fas fa-check"
                  >{{ uploadedFiles[doc.key] }}</v-chip
                >
                <v-btn
                  v-if="uploadedFiles[doc.key]"
                  icon="fas fa-xmark"
                  color="error"
                  variant="text"
                  size="small"
                  @click="removeFile(doc.key)"
                />
                <v-btn
                  :color="uploadedFiles[doc.key] ? 'warning' : 'hcex-user'"
                  variant="tonal"
                  size="small"
                  prepend-icon="fas fa-upload"
                  @click="triggerFileInput(doc.key)"
                >
                  {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- เอกสารสำหรับ history type -->
      <v-card
        v-if="route.params.type === 'history' && historyRequestType === 'new'"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pt-5">
          <div class="item-row rounded-lg pa-3 mb-3">
            <v-row align="center" no-gutters>
              <v-col>
                <div class="text-body-2 font-weight-medium">
                  ใบรับรองมาตรฐานอื่นๆ
                </div>
                <!-- <div class="text-caption text-medium-emphasis">
                  PDF, JPG, JPEG, PNG ขนาดไม่เกิน 10 MB
                </div> -->
              </v-col>
              <v-col cols="auto" class="d-flex align-center ga-2 pl-3">
                <v-chip
                  v-if="uploadedFiles['history_std_cert']"
                  color="success"
                  size="x-small"
                  variant="tonal"
                  prepend-icon="fas fa-check"
                  >{{ uploadedFiles["history_std_cert"] }}</v-chip
                >
                <v-btn
                  v-if="uploadedFiles['history_std_cert']"
                  icon="fas fa-xmark"
                  color="error"
                  variant="text"
                  size="small"
                  @click="removeFile('history_std_cert')"
                />
                <v-btn
                  :color="
                    uploadedFiles['history_std_cert'] ? 'warning' : 'hcex-user'
                  "
                  variant="tonal"
                  size="small"
                  prepend-icon="fas fa-upload"
                  @click="triggerFileInput('history_std_cert')"
                >
                  {{
                    uploadedFiles["history_std_cert"]
                      ? "เปลี่ยนไฟล์"
                      : "แนบไฟล์"
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <div class="item-row rounded-lg pa-3 mb-2">
            <v-row align="center" no-gutters>
              <v-col>
                <div class="text-body-2 font-weight-medium">
                  เอกสารหลักฐานอื่น ๆ
                </div>
                <!-- <div class="text-caption text-medium-emphasis">
                  PDF, JPG, JPEG, PNG ขนาดไม่เกิน 10 MB ต่อไฟล์
                </div> -->
              </v-col>
              <v-col cols="auto" class="d-flex align-center ga-2 pl-3">
                <v-chip
                  v-if="uploadedFiles['history_other']"
                  color="success"
                  size="x-small"
                  variant="tonal"
                  prepend-icon="fas fa-check"
                  >{{ uploadedFiles["history_other"] }}</v-chip
                >
                <v-btn
                  v-if="uploadedFiles['history_other']"
                  icon="fas fa-xmark"
                  color="error"
                  variant="text"
                  size="small"
                  @click="removeFile('history_other')"
                />
                <v-btn
                  :color="
                    uploadedFiles['history_other'] ? 'warning' : 'hcex-user'
                  "
                  variant="tonal"
                  size="small"
                  prepend-icon="fas fa-upload"
                  @click="triggerFileInput('history_other')"
                >
                  {{
                    uploadedFiles["history_other"] ? "เปลี่ยนไฟล์" : "แนบไฟล์"
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- เอกสารบุคคลธรรมดา -->
      <v-card
        v-if="
          entityType === 'personal' &&
          !['history', 'lab', 'newrequest'].includes(route.params.type)
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col v-for="doc in docNatural" :key="doc.key" cols="12">
              <div class="item-row rounded-lg pa-3 mb-2">
                <v-row align="center" no-gutters>
                  <v-col>
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
                  </v-col>
                  <v-col cols="auto" class="d-flex align-center ga-2 pl-3">
                    <v-chip
                      v-if="uploadedFiles[doc.key]"
                      color="success"
                      size="x-small"
                      variant="tonal"
                      prepend-icon="fas fa-check"
                      >{{ uploadedFiles[doc.key] }}</v-chip
                    >
                    <v-btn
                      v-if="uploadedFiles[doc.key]"
                      icon="fas fa-xmark"
                      color="error"
                      variant="text"
                      size="small"
                      @click="removeFile(doc.key)"
                    />
                    <v-btn
                      :color="uploadedFiles[doc.key] ? 'warning' : 'hcex-user'"
                      variant="tonal"
                      size="small"
                      prepend-icon="fas fa-upload"
                      @click="triggerFileInput(doc.key)"
                    >
                      {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- เอกสารนิติบุคคล -->
      <v-card
        v-if="
          entityType === 'juristic' &&
          !['history', 'lab', 'newrequest'].includes(route.params.type)
        "
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hcex-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col v-for="doc in docJuristic" :key="doc.key" cols="12">
              <div class="item-row rounded-lg pa-3 mb-2">
                <v-row align="center" no-gutters>
                  <v-col>
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
                      <span v-else class="req ml-1">*</span>
                    </div>
                  </v-col>
                  <v-col cols="auto" class="d-flex align-center ga-2 pl-3">
                    <v-chip
                      v-if="uploadedFiles[doc.key]"
                      color="success"
                      size="x-small"
                      variant="tonal"
                      prepend-icon="fas fa-check"
                      >{{ uploadedFiles[doc.key] }}</v-chip
                    >
                    <v-btn
                      v-if="uploadedFiles[doc.key]"
                      icon="fas fa-xmark"
                      color="error"
                      variant="text"
                      size="small"
                      @click="removeFile(doc.key)"
                    />
                    <v-btn
                      :color="uploadedFiles[doc.key] ? 'warning' : 'hcex-user'"
                      variant="tonal"
                      size="small"
                      prepend-icon="fas fa-upload"
                      @click="triggerFileInput(doc.key)"
                    >
                      {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

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
          color="hcex-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="hcex-user"
          append-icon="fas fa-arrow-right"
          @click="nextStep"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="hcex-user"
          prepend-icon="fas fa-paper-plane"
          @click="openConfirmDialog"
          >ยื่นคำขอ</v-btn
        >
      </div>
    </div>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="360">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="hcex-user" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-1">ยืนยันการยื่นคำขอ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                block
                rounded="lg"
                @click="closeConfirmDialog"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="hcex-user"
                block
                rounded="lg"
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
          <v-btn color="hcex-user" block @click="goToApplicationList"
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

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocale } from "vuetify";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const route = useRoute();

function refreshApplicantData() {
  form.applicantNameTh = sessionStore.personalName || "นายสมชาย ใจดี";
  form.applicantEmail = sessionStore.email || "somchai.j@example.co.th";
}
function refreshCompanyData() {
  form.companyNameTh = sessionStore.companyName || "บริษัท ไทยเซอร์ติฟาย จำกัด";
}
function refreshHistoryFactory() {
  historyFactory.contactName = sessionStore.personalName || "นายสมชาย ใจดี";
  historyFactory.contactEmail = sessionStore.email || "somchai.j@example.co.th";
}
function refreshHistoryCompany() {
  historyCompany.companyNameTh =
    sessionStore.companyName || "บริษัท ไทยเฟรช เอ็กซ์พอร์ต จำกัด";
}

function goToApplicationList() {
  router.push({ name: "HCEXUserApplicationList" });
}
function prevStep() {
  currentStep.value--;
}
function nextStep() {
  currentStep.value++;
}

const typeTitles = {
  newrequest: "คำขอขึ้นทะเบียน",
  renew: "คำขอต่ออายุทะเบียน",
  amendment: "คำขอแก้ไขใบรับรองสุขอนามัยพืช",
  history: "คำขอขึ้นทะเบียนประวัติ",
  lab: "คำขอพิจารณาผล Lab",
};
const pageTitle = computed(
  () => typeTitles[route.params.type] ?? "คำขอจดทะเบียนผู้ส่งออก",
);

const sessionStore = useSessionStore();
const entityType = computed(() => sessionStore.entityType);

const currentStep = ref(0);
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "ไฟล์แนบ" },
];

// Auto today date
const today = new Date();
const todayStr = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear() + 543}`;

const form = reactive({
  requestType: "register",
  // ผู้ยื่น (Auto-fill จาก SSO)
  applicantNameTh: "นายสมชาย ใจดี",
  applicantNameEn: "MR. SOMCHAI JAIDEE",
  applicantId: "1-2345-67890-12-3",
  applicantPhone: "02-123-4567",
  applicantFax: "02-123-4568",
  applicantEmail: "somchai.j@example.co.th",
  submitterStatus: "เจ้าของ",
  // ที่อยู่ผู้ยื่น (Auto-fill จาก SSO)
  applicantHouseNo: "123",
  applicantMoo: "4",
  applicantAlley: "ซอยพหลโยธิน 5",
  applicantRoad: "ถนนพหลโยธิน",
  applicantTambol: "ลาดยาว",
  applicantDistrict: "จตุจักร",
  applicantProvince: "กรุงเทพมหานคร",
  applicantZipcode: "10900",
  // ข้อมูลทั่วไป
  submitDate: todayStr,
  addressee: "อธิบดีกรมวิชาการเกษตร",
  // ประเทศ
  countries: [],
  countriesOther: [],
  // สถานประกอบการ (Auto-fill จาก DBD)
  companyNameTh: "บริษัท ไทยเฟรช เอ็กซ์พอร์ต จำกัด",
  companyNameEn: "THAI FRESH EXPORT CO., LTD.",
  houseNo: "88",
  alley: "ซอยลาดพร้าว 101",
  road: "ถนนลาดพร้าว",
  tambol: "คลองจั่น",
  district: "บางกะปิ",
  province: "กรุงเทพมหานคร",
  zipcode: "10240",
  // สถานประกอบการ EN (Auto-fill จาก DBD)
  houseNoEn: "88",
  alleyEn: "SOI LADPRAO 101",
  roadEn: "LADPRAO ROAD",
  tambolEn: "KHLONG CHAN",
  districtEn: "BANG KAPI",
  provinceEn: "BANGKOK",
  zipcodeEn: "10240",
  // ติดต่อ (Auto-fill จาก DBD ยกเว้นโทรสาร)
  companyPhone: "02-987-6543",
  companyFax: "",
  companyEmail: "info@thaifreshexport.co.th",
  // Dynamic lists
  factories: [],
  gaps: [],
});

const countryOptions = [
  "สหภาพยุโรป",
  "นอร์เวย์",
  "ไอร์แลนด์",
  "สมาพันธรัฐสวิส",
  "ญี่ปุ่น",
  "สิงคโปร์",
  "สาธารณะรัฐประชาชนจีน",
  "ไต้หวัน",
  "เวียดนาม",
  "อื่นๆ (ระบุ)",
];

const countryOtherOptions = [
  "มาเลเซีย",
  "อินโดนีเซีย",
  "ฟิลิปปินส์",
  "เมียนมา",
  "กัมพูชา",
  "ลาว",
  "บรูไน",
  "อินเดีย",
  "บังกลาเทศ",
  "ปากีสถาน",
  "ศรีลังกา",
  "ออสเตรเลีย",
  "นิวซีแลนด์",
  "สหรัฐอเมริกา",
  "แคนาดา",
  "สหราชอาณาจักร",
  "รัสเซีย",
  "ซาอุดีอาระเบีย",
  "สหรัฐอาหรับเอมิเรตส์",
  "อิสราเอล",
  "แอฟริกาใต้",
];

function stepClass(value) {
  if (currentStep.value > value) return "step-done";
  if (currentStep.value === value) return "step-active";
  return "step-pending";
}

// ── DOA Search ──────────────────────────────────────
const doaSearchNo = ref("");
const doaSearchResult = ref(null);
const doaSearchNotFound = ref(false);
const doaSearchLoading = ref(false);

const doaMockDB = {
  "DOA-2568-12345": {
    doaNo: "DOA-2568-12345",
    factoryName: "โรงงานแปรรูปผลไม้สด จำกัด",
    expiryDate: "31/12/2568",
    isExpired: false,
  },
  "DOA-67890": {
    doaNo: "DOA-67890",
    factoryName: "บริษัท เฟรชฟู้ด เอ็กซ์พอร์ต จำกัด",
    expiryDate: "15/06/2569",
    isExpired: false,
  },
  "DOA-99999": {
    doaNo: "DOA-99999",
    factoryName: "โรงบรรจุผักโบราณ หจก.",
    expiryDate: "01/01/2566",
    isExpired: true,
  },
};

function searchDoa() {
  if (!doaSearchNo.value.trim()) return;
  doaSearchLoading.value = true;
  doaSearchResult.value = null;
  doaSearchNotFound.value = false;
  setTimeout(() => {
    const found = doaMockDB[doaSearchNo.value.trim().toUpperCase()];
    if (found) {
      doaSearchResult.value = found;
    } else {
      doaSearchNotFound.value = true;
    }
    doaSearchLoading.value = false;
  }, 600);
}

function doaAlreadyAdded(doaNo) {
  return form.factories.some((f) => f.doaNo === doaNo);
}

function addFactoryFromSearch() {
  if (!doaSearchResult.value || doaAlreadyAdded(doaSearchResult.value.doaNo))
    return;
  viewDoaDialog.value = false;
  form.factories.push({ ...doaSearchResult.value });
  doaSearchResult.value = null;
  doaSearchNo.value = "";
}

function removeFactory(idx) {
  form.factories.splice(idx, 1);
}
// ── GAP Search ──────────────────────────────────────
const gapSearchNo = ref("");
const gapSearchResult = ref(null);
const gapSearchNotFound = ref(false);
const gapSearchLoading = ref(false);

const gapMockDB = {
  "GAP-2568-12345": {
    gapNo: "GAP-2568-12345",
    siteName: "สวนผลไม้สมชาย",
    certBody: "กรมวิชาการเกษตร (DOA)",
    certCode: "0123456789",
    expiryDate: "30/09/2568",
    isExpired: false,
  },
  "GAP-67890": {
    gapNo: "GAP-67890",
    siteName: "ไร่ผักอินทรีย์สุขใจ",
    certBody: "สำนักงานเกษตรจังหวัด",
    certCode: "0123456789",
    expiryDate: "15/03/2569",
    isExpired: false,
  },
  "GAP-55555": {
    gapNo: "GAP-55555",
    siteName: "สวนส้มโอทองดี",
    certBody: "กรมวิชาการเกษตร (DOA)",
    certCode: "0123456789",
    expiryDate: "01/06/2566",
    isExpired: true,
  },
};

function searchGap() {
  if (!gapSearchNo.value.trim()) return;
  gapSearchLoading.value = true;
  gapSearchResult.value = null;
  gapSearchNotFound.value = false;
  setTimeout(() => {
    const found = gapMockDB[gapSearchNo.value.trim().toUpperCase()];
    if (found) {
      gapSearchResult.value = found;
    } else {
      gapSearchNotFound.value = true;
    }
    gapSearchLoading.value = false;
  }, 600);
}

function gapAlreadyAdded(gapNo) {
  return form.gaps.some((g) => g.gapNo === gapNo);
}

function addGapFromSearch() {
  if (!gapSearchResult.value || gapAlreadyAdded(gapSearchResult.value.gapNo))
    return;
  viewGapDialog.value = false;
  form.gaps.push({ ...gapSearchResult.value });
  gapSearchResult.value = null;
  gapSearchNo.value = "";
}

function removeGap(idx) {
  form.gaps.splice(idx, 1);
}

// ─── Amendment: Certificate Search ───
const certSearchNo = ref("");
const certSearchLoading = ref(false);
const certSearchResult = ref(null);
const certSearchNotFound = ref(false);
const certSelected = ref(null);
const viewCertDialog = ref(false);
const viewDoaDialog = ref(false);
const viewGapDialog = ref(false);
const amendFields = ref([]);

const certMockDB = {
  "HC-2568-00123": {
    certNo: "HC-2568-00123",
    issuedDate: "01/01/2568",
    expiryDate: "31/12/2569",
    isExpired: false,
    // ข้อมูลบนใบรับรองสุขอนามัยพืช (ณ วันที่ออก)
    applicantNameTh: "นายสมชาย ใจดี",
    applicantNameEn: "MR. SOMCHAI JAIDEE",
    companyNameTh: "บริษัท สยามเฟรชฟู้ด จำกัด",
    companyNameEn: "SIAM FRESH FOOD CO., LTD.",
    houseNo: "88",
    alley: "ซอยลาดพร้าว 101",
    road: "ถนนลาดพร้าว",
    tambol: "คลองจั่น",
    district: "บางกะปิ",
    province: "กรุงเทพมหานคร",
    zipcode: "10240",
  },
  "HC-2567-00456": {
    certNo: "HC-2567-00456",
    issuedDate: "16/03/2567",
    expiryDate: "15/03/2568",
    isExpired: false,
    applicantNameTh: "นางสาวสมหญิง รักดี",
    applicantNameEn: "MS. SOMYING RAKDEE",
    companyNameTh: "ห้างหุ้นส่วนจำกัด ไทยเอ็กซ์พอร์ต",
    companyNameEn: "THAI EXPORT LIMITED PARTNERSHIP",
    houseNo: "12/3",
    alley: "",
    road: "ถนนสุขุมวิท",
    tambol: "คลองเตย",
    district: "คลองเตย",
    province: "กรุงเทพมหานคร",
    zipcode: "10110",
  },
  "HC-2565-00789": {
    certNo: "HC-2565-00789",
    issuedDate: "01/07/2565",
    expiryDate: "30/06/2567",
    isExpired: true,
    applicantNameTh: "นายวิชัย ผลดี",
    applicantNameEn: "MR. VICHAI PHOLDEE",
    companyNameTh: "บริษัท กรีนพืชผล จำกัด",
    companyNameEn: "GREEN CROP CO., LTD.",
    houseNo: "5",
    alley: "ซอยเพชรบุรี 7",
    road: "ถนนเพชรบุรี",
    tambol: "ถนนเพชรบุรี",
    district: "ราชเทวี",
    province: "กรุงเทพมหานคร",
    zipcode: "10400",
  },
};

function searchCert() {
  if (!certSearchNo.value.trim()) return;
  certSearchLoading.value = true;
  certSearchResult.value = null;
  certSearchNotFound.value = false;
  certSelected.value = null;
  setTimeout(() => {
    const found = certMockDB[certSearchNo.value.trim().toUpperCase()];
    if (found) {
      certSearchResult.value = found;
    } else {
      certSearchNotFound.value = true;
    }
    certSearchLoading.value = false;
  }, 600);
}

// Expire date picker (v-date-picker ใช้ Date object, แสดงผลเป็น พ.ศ.)
const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const expireDateMenu = ref(false);
const expireDateObj = ref(null);

watch(expireDateObj, (date) => {
  if (date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear() + 543;
    amendNewValues.expire_date.value = `${d}/${m}/${y}`;
  } else {
    amendNewValues.expire_date.value = "";
  }
});

const expireDateBE = computed(() => amendNewValues.expire_date.value);

const certExpiryMaxDate = computed(() => {
  if (!certSelected.value) return undefined;
  const [d, m, y] = certSelected.value.expiryDate.split("/");
  return new Date(parseInt(y) - 543, parseInt(m) - 1, parseInt(d));
});

function selectCert() {
  if (!certSearchResult.value) return;
  viewCertDialog.value = false;
  certSelected.value = { ...certSearchResult.value };
  certSearchResult.value = null;
  amendFields.value = [];
  amendNewValues.expire_date.value = "";
  expireDateObj.value = null;
  // Pre-fill ค่าใหม่จาก DBD ปัจจุบัน
  amendNewValues.company_name.nameTh = form.companyNameTh;
  amendNewValues.company_name.nameEn = form.companyNameEn;
  amendNewValues.address.houseNo = form.houseNo;
  amendNewValues.address.moo = form.moo ?? "";
  amendNewValues.address.alley = form.alley;
  amendNewValues.address.road = form.road;
  amendNewValues.address.tambol = form.tambol;
  amendNewValues.address.district = form.district;
  amendNewValues.address.province = form.province;
  amendNewValues.address.zipcode = form.zipcode;
  amendNewValues.address.houseNoEn = form.houseNoEn ?? form.houseNo;
  amendNewValues.address.alleyEn = form.alleyEn ?? "";
  amendNewValues.address.roadEn = form.roadEn ?? "";
  amendNewValues.address.tambolEn = form.tambolEn ?? "";
  amendNewValues.address.districtEn = form.districtEn ?? "";
  amendNewValues.address.provinceEn = form.provinceEn ?? "";
}

// ─── Registration (newrequest) form data ───
const regForm = reactive({
  testReportSearchNo: "",
  testReportSelected: null,
  formType: "kmpor1",
  certQty: "",
});

const testReportSearchLoading = ref(false);
const testReportNotFound = ref(false);
const selectedTestReport = ref(null);

function searchTestReport() {
  testReportSearchLoading.value = true;
  testReportNotFound.value = false;
  selectedTestReport.value = null;
  setTimeout(() => {
    testReportSearchLoading.value = false;
    if (regForm.testReportSearchNo === "LAB-2568-00123") {
      selectedTestReport.value = {
        no: "LAB-2568-00123",
        productName: "มะม่วงอบแห้ง (Dried Mango)",
        manufacturer: "THAI FRESH EXPORT CO., LTD.",
        date: "15/03/2568",
      };
    } else {
      testReportNotFound.value = true;
    }
  }, 600);
}

const regKmpor1 = reactive({
  exporterAddress: "",
  consigneeAddress: "",
  shipmentDate: "",
  countryDestination: null,
  placeOfDeparture: null,
  vessel: "",
  transport: [],
  shippingMark: "",
  descriptionOfGoods: "",
  quantity: "",
  weightNW: "",
  weightGW: "",
  totalAmount: "",
  remark: "",
  remarkFFC: false,
});

const regKmpor1_1 = reactive({
  exporterAddress: "",
  consigneeAddress: "",
  producerAddress: "",
  packingAddress: "",
  shipmentDate: "",
  vessel: "",
  borderLoading: null,
  borderEntry: null,
  transport: [],
  temperature: null,
  halalCertNo: "",
  descriptionOfFood: "",
  hsCode: "",
  treatmentType: "",
  brandName: "",
  batchNo: "",
  productionDate: "",
  expiryDate: "",
  noPackages: "",
  totalWeight: "",
  totalAmount: "",
  certifiedFor: [],
});

const regKmpor1_2 = reactive({
  consignor: "",
  consignee: "",
  operator: "",
  regionOrigin: null,
  countryDestination: null,
  regionDestination: "",
  placeDispatch: "",
  placeDestination: "",
  placeLoading: "",
  entryBorderPost: null,
  transport: [],
  transportCondition: [],
  containerNo: "",
  sealNo: "",
  departureDateTime: "",
  accompanyingDocs: "",
  certifiedFor: [],
  certifiedForExtra: [],
  totalPackages: "",
  totalQuantity: "",
  totalNetWeight: "",
  grossWeight: "",
  totalAmount: "",
  cnCode: "",
  category: "",
  identificationMark: "",
  typeOfPackaging: "",
  netWeight: "",
  natureOfCommodity: "",
  numberOfPackages: "",
  batchNo: "",
  collectionDate: "",
  descriptionConsignment: "",
});

const regKmpor1_3 = reactive({
  exporterAddress: "",
  exporterAccreditation: "",
  producerAddress: "",
  producerAccreditation: "",
  consignee: "",
  shipmentDate: "",
  loadingPlace: "",
  entryPoint: "",
  billNo: "",
  transport: [],
  temperature: [],
  descriptionProducts: "",
  productName: "",
  productionDate: "",
  expiryDate: "",
  processingType: [],
  grossMass: "",
  netMass: "",
  numberOfPackages: "",
  batchNo: "",
  totalAmount: "",
});

// Certificate request form datepickers
const regKmpor1ShipmentDateMenu = ref(false);
const regKmpor1ShipmentDateObj = ref(null);
watch(regKmpor1ShipmentDateObj, (date) => {
  regKmpor1.shipmentDate = dateObjToBE(date);
});

const regKmpor1_1ShipmentDateMenu = ref(false);
const regKmpor1_1ShipmentDateObj = ref(null);
watch(regKmpor1_1ShipmentDateObj, (date) => {
  regKmpor1_1.shipmentDate = dateObjToBE(date);
});

const regKmpor1_1ProductionDateMenu = ref(false);
const regKmpor1_1ProductionDateObj = ref(null);
watch(regKmpor1_1ProductionDateObj, (date) => {
  regKmpor1_1.productionDate = dateObjToBE(date);
});

const regKmpor1_1ExpiryDateMenu = ref(false);
const regKmpor1_1ExpiryDateObj = ref(null);
watch(regKmpor1_1ExpiryDateObj, (date) => {
  regKmpor1_1.expiryDate = dateObjToBE(date);
});

const regKmpor1_2CollectionDateMenu = ref(false);
const regKmpor1_2CollectionDateObj = ref(null);
watch(regKmpor1_2CollectionDateObj, (date) => {
  regKmpor1_2.collectionDate = dateObjToBE(date);
});

const regKmpor1_3ShipmentDateMenu = ref(false);
const regKmpor1_3ShipmentDateObj = ref(null);
watch(regKmpor1_3ShipmentDateObj, (date) => {
  regKmpor1_3.shipmentDate = dateObjToBE(date);
});

const regKmpor1_3ProductionDateMenu = ref(false);
const regKmpor1_3ProductionDateObj = ref(null);
watch(regKmpor1_3ProductionDateObj, (date) => {
  regKmpor1_3.productionDate = dateObjToBE(date);
});

const regKmpor1_3ExpiryDateMenu = ref(false);
const regKmpor1_3ExpiryDateObj = ref(null);
watch(regKmpor1_3ExpiryDateObj, (date) => {
  regKmpor1_3.expiryDate = dateObjToBE(date);
});

const departureOptions = [
  "ท่าเรือแหลมฉบัง",
  "ท่าเรือกรุงเทพ",
  "ท่าอากาศยานสุวรรณภูมิ",
  "ท่าอากาศยานดอนเมือง",
  "ด่านพรมแดนอรัญประเทศ",
  "ด่านพรมแดนหนองคาย",
];

const euCountryOptions = [
  "AUSTRIA",
  "BELGIUM",
  "BULGARIA",
  "CROATIA",
  "CYPRUS",
  "CZECH REPUBLIC",
  "DENMARK",
  "ESTONIA",
  "FINLAND",
  "FRANCE",
  "GERMANY",
  "GREECE",
  "HUNGARY",
  "IRELAND",
  "ITALY",
  "LATVIA",
  "LITHUANIA",
  "LUXEMBOURG",
  "MALTA",
  "NETHERLANDS",
  "POLAND",
  "PORTUGAL",
  "ROMANIA",
  "SLOVAKIA",
  "SLOVENIA",
  "SPAIN",
  "SWEDEN",
];

const regionOptions = [
  "CENTRAL",
  "NORTHERN",
  "NORTHEASTERN",
  "EASTERN",
  "WESTERN",
  "SOUTHERN",
];

const borderPostOptions = [
  "Rotterdam",
  "Hamburg",
  "Antwerp",
  "Felixstowe",
  "Le Havre",
  "Other",
];

const regDocs = [
  {
    key: "reg_test_report",
    label: "สำเนา Test Report ที่ได้รับการพิจารณาแล้ว",
    optional: false,
  },
  { key: "reg_other", label: "เอกสารประกอบอื่น ๆ", optional: true },
];

// ─── Lab form data ───
const labForm = reactive({
  dateCollected: "",
  productCode: "",
  mfgDate: "",
  expDate: "",
  manufacturer: null,
  product: null,
  collectingLocation: "",
  laboratory: null,
  dateDelivered: "",
  countries: [],
  objective: "hc",
  wholeOptions: [],
  exportVolume: "",
  exportUnit: "",
  exportUnitOther: "",
  specialRemark: "none",
  specialRemarkText: "",
  otherData: "",
});

// Lab form datepickers
const labDateCollectedMenu = ref(false);
const labDateCollectedObj = ref(null);
watch(labDateCollectedObj, (date) => {
  labForm.dateCollected = dateObjToBE(date);
});

const labMfgDateMenu = ref(false);
const labMfgDateObj = ref(null);
watch(labMfgDateObj, (date) => {
  labForm.mfgDate = dateObjToBE(date);
});

const labExpDateMenu = ref(false);
const labExpDateObj = ref(null);
watch(labExpDateObj, (date) => {
  labForm.expDate = dateObjToBE(date);
});

const labDateDeliveredMenu = ref(false);
const labDateDeliveredObj = ref(null);
watch(labDateDeliveredObj, (date) => {
  labForm.dateDelivered = dateObjToBE(date);
});

const manufacturerOptions = [
  {
    id: 1,
    name: "บริษัท ไทยฟู้ดส์ โปรเซสซิ่ง จำกัด",
    address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
  },
  {
    id: 2,
    name: "บริษัท กรีนเฮิร์บ แปรรูป จำกัด",
    address: "88/5 หมู่ 3 ตำบลคลองหลวง อำเภอคลองหลวง จังหวัดปทุมธานี 12120",
  },
  {
    id: 3,
    name: "บริษัท อีสเทิร์น ฟรุ้ต โปรดักส์ จำกัด",
    address:
      "45 นิคมอุตสาหกรรมอมตะ ตำบลมาบยางพร อำเภอปลวกแดง จังหวัดระยอง 21140",
  },
];

const productsByManufacturer = {
  1: [
    { id: 101, nameTh: "มะม่วงอบแห้ง", nameEn: "Dried Mango" },
    { id: 102, nameTh: "สับปะรดกระป๋อง", nameEn: "Canned Pineapple" },
  ],
  2: [
    { id: 201, nameTh: "ขิงแปรรูป", nameEn: "Processed Ginger" },
    { id: 202, nameTh: "ใบเตยอบแห้ง", nameEn: "Dried Pandan Leaf" },
  ],
  3: [
    { id: 301, nameTh: "ลำไยอบแห้ง", nameEn: "Dried Longan" },
    { id: 302, nameTh: "ทุเรียนแช่แข็ง", nameEn: "Frozen Durian" },
  ],
};

const productOptions = computed(() =>
  labForm.manufacturer
    ? (productsByManufacturer[labForm.manufacturer] ?? [])
    : [],
);

const selectedManufacturerAddress = computed(() => {
  const m = manufacturerOptions.find((m) => m.id === labForm.manufacturer);
  return m ? m.address : "";
});

const selectedProductNameEn = computed(() => {
  const list = productsByManufacturer[labForm.manufacturer] ?? [];
  const p = list.find((p) => p.id === labForm.product);
  return p ? p.nameEn : "";
});

function onManufacturerChange() {
  labForm.product = null;
}
function onProductChange() {}

const laboratoryOptions = [
  { id: 1, name: "กรมวิทยาศาสตร์การแพทย์ (DMSc)" },
  { id: 2, name: "ศูนย์วิทยาศาสตร์การแพทย์ที่ 1 กรุงเทพฯ" },
  { id: 3, name: "มหาวิทยาลัยเกษตรศาสตร์ (KU Lab)" },
  { id: 4, name: "สถาบันอาหาร (National Food Institute)" },
];

const labCountryOptions = [
  "USA / CANADA",
  "สหภาพยุโรป",
  "นอร์เวย์",
  "ไอร์แลนด์",
  "สมาพันธรัฐสวิส",
  "ญี่ปุ่น",
  "สิงคโปร์",
  "สาธารณะรัฐประชาชนจีน",
  "ไต้หวัน",
  "เวียดนาม",
  "อื่นๆ (ระบุ)",
];

const autoTestItems = ref([
  { name: "Sulfites", criteria: "≤ 30 mg/kg", result: "" },
  { name: "Total Plate Count", criteria: "≤ 1.0 × 10⁶ CFU/g", result: "" },
  { name: "Total Mold Count", criteria: "≤ 1.0 × 10² CFU/g", result: "" },
  { name: "Escherichia coli", criteria: "≤ 3.0 MPN/g", result: "" },
  { name: "Staphylococcus aureus", criteria: "ND in 0.1 g", result: "" },
  { name: "Salmonella spp.", criteria: "ND in 25 g", result: "" },
  { name: "Clostridium perfringens", criteria: "≤ 1.0 × 10³ CFU/g", result: "" },
  { name: "Bacillus cereus", criteria: "≤ 1.0 × 10³ CFU/g", result: "" },
]);

const labDocs = [
  { key: "lab_test_report", label: "ผล Test Report", optional: false },
  { key: "lab_kmpor29", label: "กรมวิชาการเกษตร 29 (กมพ.29)", optional: true },
  { key: "lab_other", label: "เอกสารอ้างอิงอื่น ๆ", optional: true },
];

// ─── History form data ───
const historyRequestType = ref("new"); // "new" | "amendment"
const historySubmissionType = ref("all");

const historyFactory = reactive({
  nameTh: "",
  nameEn: "",
  houseNo: "",
  alley: "",
  road: "",
  tambol: "",
  district: "",
  province: "",
  zipcode: "",
  houseNoEn: "",
  alleyEn: "",
  roadEn: "",
  tambolEn: "",
  districtEn: "",
  provinceEn: "",
  zipcodeEn: "",
  phone: "",
  fax: "",
  email: "",
  // ผู้ประสานงาน (Auto-fill จาก SSO)
  contactName: "นายสมชาย ใจดี",
  contactPosition: "ผู้จัดการโรงงาน",
  contactId: "1-2345-67890-12-3",
  contactPhone: "02-123-4567",
  contactFax: "02-123-4568",
  contactEmail: "somchai.j@example.co.th",
  // DOA registration
  doaRegNo: "",
  doaExpiry: "",
  // มาตรฐาน GMP (จาก DOA)
  gmpCertBody: "",
  gmpCertNo: "",
  gmpExpiry: "",
  // มาตรฐาน HACCP (จาก DOA)
  haccpCertBody: "",
  haccpCertNo: "",
  haccpExpiry: "",
});

// DOA search (history form)
const histDoaSearchNo = ref("");
const histDoaSearchLoading = ref(false);
const histDoaSearchResult = ref(null);
const histDoaSearchNotFound = ref(false);
const histDoaSelected = ref(null);

const histDoaMockDB = {
  "DOA-2568-12345": {
    regNo: "DOA-2568-12345",
    expiryDate: "31/12/2570",
    isExpired: false,
    factoryNameTh: "บริษัท สยามเฟรชฟู้ด จำกัด",
    factoryNameEn: "SIAM FRESH FOOD CO., LTD.",
    houseNo: "88",
    alley: "ซอยลาดพร้าว 101",
    road: "ถนนลาดพร้าว",
    tambol: "คลองจั่น",
    district: "บางกะปิ",
    province: "กรุงเทพมหานคร",
    zipcode: "10240",
    houseNoEn: "88",
    alleyEn: "SOI LADPRAO 101",
    roadEn: "LADPRAO ROAD",
    tambolEn: "KHLONG CHAN",
    districtEn: "BANG KAPI",
    provinceEn: "BANGKOK",
    zipcodeEn: "10240",
    phone: "02-000-0001",
    fax: "02-000-0002",
    email: "factory@siamfresh.com",
    standards: [
      {
        name: "GMP",
        certBody: "กรมวิชาการเกษตร",
        certNo: "GMP-2568-001",
        expiry: "31/12/2570",
      },
      {
        name: "HACCP",
        certBody: "กรมวิชาการเกษตร",
        certNo: "HACCP-2568-001",
        expiry: "31/12/2570",
      },
    ],
  },
  "DOA-2568-99999": {
    regNo: "DOA-2568-99999",
    expiryDate: "01/01/2567",
    isExpired: true,
    factoryNameTh: "บริษัท เกษตรไทย เอ็กซ์พอร์ต จำกัด",
    factoryNameEn: "KASET THAI EXPORT CO., LTD.",
    houseNo: "123",
    alley: "",
    road: "ถนนพหลโยธิน",
    tambol: "ลาดยาว",
    district: "จตุจักร",
    province: "กรุงเทพมหานคร",
    zipcode: "10900",
    houseNoEn: "123",
    alleyEn: "",
    roadEn: "PHAHON YOTHIN ROAD",
    tambolEn: "LAT YAO",
    districtEn: "CHATUCHAK",
    provinceEn: "BANGKOK",
    zipcodeEn: "10900",
    phone: "02-111-2222",
    fax: "02-111-2223",
    email: "export@kasethai.co.th",
    standards: [
      {
        name: "GMP",
        certBody: "กรมวิชาการเกษตร",
        certNo: "GMP-2566-099",
        expiry: "01/01/2567",
      },
    ],
  },
};

function searchHistDoa() {
  if (!histDoaSearchNo.value.trim()) return;
  histDoaSearchLoading.value = true;
  histDoaSearchResult.value = null;
  histDoaSearchNotFound.value = false;
  histDoaSelected.value = null;
  setTimeout(() => {
    const found = histDoaMockDB[histDoaSearchNo.value.trim().toUpperCase()];
    if (found) {
      histDoaSearchResult.value = found;
    } else {
      histDoaSearchNotFound.value = true;
    }
    histDoaSearchLoading.value = false;
  }, 600);
}

// DOA view dialog
const histDoaViewDialog = ref(false);
const histDoaViewTarget = ref(null);

function openHistDoaViewDialog(data) {
  histDoaViewTarget.value = data;
  histDoaViewDialog.value = true;
}

function selectHistDoaFromDialog() {
  if (!histDoaViewTarget.value) return;
  histDoaSearchResult.value = histDoaViewTarget.value;
  histDoaViewDialog.value = false;
  selectHistDoa();
}

function downloadHistDoaPdf() {
  // Mock — จะเชื่อม API จริงในภายหลัง
  const link = document.createElement("a");
  link.href = "#";
  link.download = `DOA_${histDoaViewTarget.value?.regNo ?? "certificate"}.pdf`;
  link.click();
}

function clearHistDoa() {
  histDoaSelected.value = null;
  histDoaSearchNo.value = "";
  histDoaSearchNotFound.value = false;
  const f = historyFactory;
  f.nameTh = "";
  f.nameEn = "";
  f.houseNo = "";
  f.alley = "";
  f.road = "";
  f.tambol = "";
  f.district = "";
  f.province = "";
  f.zipcode = "";
  f.houseNoEn = "";
  f.alleyEn = "";
  f.roadEn = "";
  f.tambolEn = "";
  f.districtEn = "";
  f.provinceEn = "";
  f.zipcodeEn = "";
  f.phone = "";
  f.fax = "";
  f.email = "";
  f.doaRegNo = "";
  f.doaExpiry = "";
  f.gmpCertBody = "";
  f.gmpCertNo = "";
  f.gmpExpiry = "";
  f.haccpCertBody = "";
  f.haccpCertNo = "";
  f.haccpExpiry = "";
}

function selectHistDoa() {
  if (!histDoaSearchResult.value) return;
  histDoaSelected.value = { ...histDoaSearchResult.value };
  histDoaSearchResult.value = null;
  const d = histDoaSelected.value;
  historyFactory.nameTh = d.factoryNameTh;
  historyFactory.nameEn = d.factoryNameEn;
  historyFactory.houseNo = d.houseNo;
  historyFactory.alley = d.alley;
  historyFactory.road = d.road;
  historyFactory.tambol = d.tambol;
  historyFactory.district = d.district;
  historyFactory.province = d.province;
  historyFactory.zipcode = d.zipcode;
  historyFactory.houseNoEn = d.houseNoEn;
  historyFactory.alleyEn = d.alleyEn;
  historyFactory.roadEn = d.roadEn;
  historyFactory.tambolEn = d.tambolEn;
  historyFactory.districtEn = d.districtEn;
  historyFactory.provinceEn = d.provinceEn;
  historyFactory.zipcodeEn = d.zipcodeEn;
  historyFactory.phone = d.phone;
  historyFactory.fax = d.fax;
  historyFactory.email = d.email;
  historyFactory.doaRegNo = d.regNo;
  historyFactory.doaExpiry = d.expiryDate;
  const gmp = d.standards?.find((s) => s.name === "GMP");
  if (gmp) {
    historyFactory.gmpCertBody = gmp.certBody;
    historyFactory.gmpCertNo = gmp.certNo;
    historyFactory.gmpExpiry = gmp.expiry;
  }
  const haccp = d.standards?.find((s) => s.name === "HACCP");
  if (haccp) {
    historyFactory.haccpCertBody = haccp.certBody;
    historyFactory.haccpCertNo = haccp.certNo;
    historyFactory.haccpExpiry = haccp.expiry;
  }
}

const historyExtraStandards = ref([]);

const historyCompany = reactive({
  companyNameTh: "บริษัท ไทยเฟรช เอ็กซ์พอร์ต จำกัด",
  companyNameEn: "THAI FRESH EXPORT CO., LTD.",
  houseNo: "88",
  alley: "ซอยลาดพร้าว 101",
  road: "ถนนลาดพร้าว",
  tambol: "คลองจั่น",
  district: "บางกะปิ",
  province: "กรุงเทพมหานคร",
  zipcode: "10240",
  houseNoEn: "88",
  alleyEn: "SOI LADPRAO 101",
  roadEn: "LADPRAO ROAD",
  tambolEn: "KHLONG CHAN",
  districtEn: "BANG KAPI",
  provinceEn: "BANGKOK",
  zipcodeEn: "10240",
  phone: "02-987-6543",
  fax: "",
  email: "info@thaifreshexport.co.th",
});

const historyProducerContact = reactive({
  name: "",
  position: "",
  phone: "",
  fax: "",
  email: "",
});

// ชุดรายการทดสอบ + เกณฑ์ ตามลำดับที่มาตรฐานกรมวิชาการเกษตร (mock)
// แต่ละรายการ: { name, criteria }
const _doaSets = {
  micro_basic: [
    { name: "Sulfites", criteria: "ไม่เกิน 10 mg/kg" },
    { name: "Total Plate Count", criteria: "ไม่เกิน 1×10⁵ CFU/g" },
    { name: "Total Mold Count", criteria: "ไม่เกิน 1×10³ CFU/g" },
    { name: "Escherichia coli", criteria: "ไม่เกิน 10 CFU/g" },
  ],
  micro_pathogen: [
    { name: "Total Plate Count", criteria: "ไม่เกิน 1×10⁵ CFU/g" },
    { name: "Salmonella spp.", criteria: "ต้องไม่พบใน 25 g" },
    { name: "Staphylococcus aureus", criteria: "ไม่เกิน 100 CFU/g" },
    { name: "Listeria monocytogenes", criteria: "ต้องไม่พบใน 25 g" },
  ],
  heavy_metals: [
    { name: "Lead (Pb)", criteria: "ไม่เกิน 0.1 mg/kg" },
    { name: "Cadmium (Cd)", criteria: "ไม่เกิน 0.05 mg/kg" },
    { name: "Mercury (Hg)", criteria: "ไม่เกิน 0.02 mg/kg" },
    { name: "Arsenic (As)", criteria: "ไม่เกิน 0.1 mg/kg" },
    { name: "Total Plate Count", criteria: "ไม่เกิน 1×10⁵ CFU/g" },
  ],
  pesticides: [
    {
      name: "Pesticide Residues (organochlorine)",
      criteria: "ไม่เกิน 0.01 mg/kg",
    },
    {
      name: "Pesticide Residues (organophosphate)",
      criteria: "ไม่เกิน 0.01 mg/kg",
    },
    { name: "Sulfites", criteria: "ไม่เกิน 10 mg/kg" },
    { name: "Salmonella spp.", criteria: "ต้องไม่พบใน 25 g" },
  ],
  full_panel: [
    { name: "Total Plate Count", criteria: "ไม่เกิน 1×10⁵ CFU/g" },
    { name: "Total Mold Count", criteria: "ไม่เกิน 1×10³ CFU/g" },
    { name: "Escherichia coli", criteria: "ไม่เกิน 10 CFU/g" },
    { name: "Salmonella spp.", criteria: "ต้องไม่พบใน 25 g" },
    { name: "Staphylococcus aureus", criteria: "ไม่เกิน 100 CFU/g" },
    { name: "Lead (Pb)", criteria: "ไม่เกิน 0.1 mg/kg" },
    { name: "Cadmium (Cd)", criteria: "ไม่เกิน 0.05 mg/kg" },
    { name: "Sulfites", criteria: "ไม่เกิน 10 mg/kg" },
  ],
};
const _setKeys = [
  "micro_basic",
  "micro_pathogen",
  "heavy_metals",
  "pesticides",
  "full_panel",
];
const doaTestsByOrderNo = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => [
    i + 1,
    _doaSets[_setKeys[i % 5]].map((t) => ({ ...t })),
  ]),
);

const historyProducts = ref([]);

function removeHistoryExtraStandard(idx) {
  historyExtraStandards.value.splice(idx, 1);
}

const extraStdDialog = ref(false);
const extraStdForm = reactive({
  name: "",
  certBody: "",
  certNo: "",
  expiry: "",
});
const extraStdErrors = reactive({
  name: false,
  certBody: false,
  certNo: false,
  expiry: false,
});

function openExtraStdDialog() {
  extraStdForm.name = "";
  extraStdForm.certBody = "";
  extraStdForm.certNo = "";
  extraStdForm.expiry = "";
  extraStdErrors.name = false;
  extraStdErrors.certBody = false;
  extraStdErrors.certNo = false;
  extraStdErrors.expiry = false;
  extraStdExpiryObj.value = null;
  extraStdDialog.value = true;
}

function confirmExtraStd() {
  extraStdErrors.name = !extraStdForm.name.trim();
  extraStdErrors.certBody = !extraStdForm.certBody.trim();
  extraStdErrors.certNo = !extraStdForm.certNo.trim();
  extraStdErrors.expiry = !extraStdForm.expiry.trim();
  if (
    extraStdErrors.name ||
    extraStdErrors.certBody ||
    extraStdErrors.certNo ||
    extraStdErrors.expiry
  )
    return;
  historyExtraStandards.value.push({ ...extraStdForm });
  extraStdDialog.value = false;
}

// --- Datepicker helpers ---
function dateObjToBE(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear() + 543;
  return `${d}/${m}/${y}`;
}

// Extra standard expiry datepicker
const extraStdExpiryMenu = ref(false);
const extraStdExpiryObj = ref(null);
watch(extraStdExpiryObj, (date) => {
  extraStdForm.expiry = dateObjToBE(date);
});
const productTableHeaders = [
  { title: "ชื่อสินค้า", key: "productName", sortable: false },
  { title: "ประเทศปลายทาง", key: "countries", sortable: false },
  { title: "มาตรฐาน", key: "standardType", sortable: false },
  { title: "รายการทดสอบ", key: "tests", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const productDialog = ref(false);
const productDialogMode = ref("add"); // "add" | "edit"
const productDialogIdx = ref(-1);
const productForm = reactive({
  productName: "",
  countries: [],
  standardTypes: [],
  doaOrderNo: null,
  doaTests: [], // [{ name, criteria }] — auto-fill จากลำดับที่ แต่แก้ไขได้
  otherStandards: [], // [{ name: string, tests: [{ name, criteria }] }]
});

const doaOrderNoItems = Array.from({ length: 30 }, (_, i) => i + 1);

// เมื่อเปลี่ยนลำดับที่ → auto-populate doaTests
watch(
  () => productForm.doaOrderNo,
  (val) => {
    productForm.doaTests = val
      ? doaTestsByOrderNo[val].map((t) => ({ ...t }))
      : [];
  },
);

// inline add — DOA test เพิ่มเติม
const doaTestEntry = reactive({ name: "", criteria: "" });

function addDoaTest() {
  if (!doaTestEntry.name.trim()) return;
  productForm.doaTests.push({
    name: doaTestEntry.name.trim(),
    criteria: doaTestEntry.criteria.trim(),
  });
  doaTestEntry.name = "";
  doaTestEntry.criteria = "";
}

function removeDoaTest(idx) {
  productForm.doaTests.splice(idx, 1);
}

// draft form สำหรับสร้างชุดมาตรฐานอื่นๆ ใหม่
const otherStdDraft = reactive({ name: "", tests: [] }); // tests: [{ name, criteria }]
const otherTestDraft = reactive({ name: "", criteria: "" });

function addToOtherStdDraft() {
  if (!otherTestDraft.name.trim()) return;
  otherStdDraft.tests.push({
    name: otherTestDraft.name.trim(),
    criteria: otherTestDraft.criteria.trim(),
  });
  otherTestDraft.name = "";
  otherTestDraft.criteria = "";
}

function removeFromOtherStdDraft(idx) {
  otherStdDraft.tests.splice(idx, 1);
}

function commitOtherStd() {
  if (!otherStdDraft.name.trim()) return;
  productForm.otherStandards.push({
    name: otherStdDraft.name.trim(),
    tests: [...otherStdDraft.tests],
  });
  otherStdDraft.name = "";
  otherStdDraft.tests = [];
  otherTestDraft.name = "";
  otherTestDraft.criteria = "";
}

function removeOtherStandard(idx) {
  productForm.otherStandards.splice(idx, 1);
}

function removeOtherStandardTest(si, ti) {
  productForm.otherStandards[si].tests.splice(ti, 1);
}

function addTestToSavedStandard(_si, std) {
  if (!std._newTestName?.trim()) return;
  std.tests.push({
    name: std._newTestName.trim(),
    criteria: std._newTestCriteria?.trim() ?? "",
  });
  std._newTestName = "";
  std._newTestCriteria = "";
}

function openAddProductDialog() {
  productForm.productName = "";
  productForm.countries = [];
  productForm.standardTypes = [];
  productForm.doaOrderNo = null;
  productForm.doaTests = [];
  productForm.otherStandards = [];
  doaTestEntry.name = "";
  doaTestEntry.criteria = "";
  otherStdDraft.name = "";
  otherStdDraft.tests = [];
  otherTestDraft.name = "";
  otherTestDraft.criteria = "";
  productDialogMode.value = "add";
  productDialogIdx.value = -1;
  productDialog.value = true;
}

function openEditProductDialog(idx) {
  const p = historyProducts.value[idx];
  productForm.productName = p.productName;
  productForm.countries = [...p.countries];
  productForm.standardTypes = [...p.standardTypes];
  productForm.doaOrderNo = p.doaOrderNo ?? null;
  productForm.doaTests = p.doaTests ? p.doaTests.map((t) => ({ ...t })) : [];
  productForm.otherStandards = p.otherStandards
    ? p.otherStandards.map((s) => ({ ...s, tests: [...s.tests] }))
    : [];
  doaTestEntry.name = "";
  doaTestEntry.criteria = "";
  otherStdDraft.name = "";
  otherStdDraft.tests = [];
  otherTestDraft.name = "";
  otherTestDraft.criteria = "";
  productDialogMode.value = "edit";
  productDialogIdx.value = idx;
  productDialog.value = true;
}

function confirmProductDialog() {
  if (productForm.standardTypes.length === 0) return;
  const hasDoa = productForm.standardTypes.includes("doa");
  const entry = {
    productName: productForm.productName,
    countries: [...productForm.countries],
    standardTypes: [...productForm.standardTypes],
    doaOrderNo: hasDoa ? productForm.doaOrderNo : null,
    doaTests: hasDoa ? productForm.doaTests.map((t) => ({ ...t })) : [],
    otherStandards: productForm.standardTypes.includes("other")
      ? productForm.otherStandards.map((s) => ({ ...s, tests: [...s.tests] }))
      : [],
  };
  if (productDialogMode.value === "add") {
    historyProducts.value.push(entry);
  } else {
    historyProducts.value[productDialogIdx.value] = entry;
  }
  productDialog.value = false;
}

function removeHistoryProduct(idx) {
  historyProducts.value.splice(idx, 1);
}

const amendItems = [
  {
    value: "company_name",
    label: "ชื่อผู้รับใบรับรอง",
    labelEn: "Certificate Holder Name",
    source: "Auto-fill จาก DBD",
    inputType: "company_name",
  },
  {
    value: "address",
    label: "ที่อยู่ผู้รับใบรับรอง",
    labelEn: "Certificate Holder Address",
    source: "Auto-fill จาก DBD",
    inputType: "address",
  },
  {
    value: "expire_date",
    label: "วันหมดอายุใบรับรอง",
    labelEn: "Certificate Expiry Date",
    source: null,
    inputType: "expire_date",
  },
];

const amendNewValues = reactive({
  company_name: { nameTh: "", nameEn: "" },
  expire_date: { value: "" },
  address: {
    houseNo: "",
    moo: "",
    alley: "",
    road: "",
    tambol: "",
    district: "",
    province: "",
    zipcode: "",
    houseNoEn: "",
    alleyEn: "",
    roadEn: "",
    tambolEn: "",
    districtEn: "",
    provinceEn: "",
  },
});

const uploadedFiles = reactive({});

function triggerFileInput(key) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,.jpg,.jpeg,.png";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) uploadedFiles[key] = file.name;
  };
  input.click();
}

function removeFile(key) {
  delete uploadedFiles[key];
}

const docNatural = [
  {
    key: "plantproduce_cert",
    label:
      "หนังสือรับรองของโรงงานผลิตสินค้าพืชที่เราระบุว่าเป็นผู้คัดบรรจุสินค้าผักและผลไม้ให้กับผู้ส่งออก กรณีที่ผู้ส่งออกแจ้งใช้โรงงานผลิตสินค้าพืชของผู้อื่น",
    optional: false,
  },
];

const docJuristic = [
  {
    key: "plantproducejuristic_cert",
    label:
      "หนังสือรับรองของโรงงานผลิตสินค้าพืชที่เราระบุว่าเป็นผู้คัดบรรจุสินค้าผักและผลไม้ให้กับผู้ส่งออก กรณีที่ผู้ส่งออกแจ้งใช้โรงงานผลิตสินค้าพืชของผู้อื่น",
    optional: false,
  },
  { key: "trading_cer", label: "หนังสือรับรองการซื้อ-ขายกับเกษตรกร" },
];

function openConfirmDialog() {
  confirmDialog.value = true;
}
function closeConfirmDialog() {
  confirmDialog.value = false;
}
function saveDraft() {
  draftSnackbar.value = true;
}
function submitApplication() {
  confirmDialog.value = false;
  successDialog.value = true;
}

onMounted(() => {
  if (route.params.type === "history") {
    refreshHistoryFactory();
  }
});
</script>

<style scoped>
/* Document / upload row */
.item-row {
  background: rgba(var(--v-theme-hcex-user), 0.03);
}

/* Test table */
.test-table {
  border-collapse: collapse;
  table-layout: fixed;
}
.test-table th,
.test-table td {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.test-table thead tr th {
  border-top: none;
  background: rgba(var(--v-theme-surface-variant), 0.5);
}
.test-table tr.add-row td {
  border-top: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface-variant), 0.25);
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-hcex-user)) !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hcex-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hcex-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-hcex-user)) !important;
}

.amend-item--active {
  background: rgba(var(--v-theme-hcex-user), 0.04);
  border-radius: 8px;
}

.confirm-ring {
  background: rgba(var(--v-theme-hcex-user), 0.1);
}
</style>
