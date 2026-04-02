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
        v-if="route.params.type !== 'amendment'"
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
            >ระบุใบทะเบียนผู้ส่งออกที่ต้องการแก้ไข</span
          >
        </div>
        <v-card-text class="pt-5">
          <div class="field-label mb-2">
            เลขที่ใบทะเบียนผู้ส่งออก <span class="req">*</span>
            <div class="field-label-en">
              Exporter Registration Certificate No.
            </div>
          </div>
          <v-row dense align="center">
            <v-col cols="12" sm="6">
              <v-text-field
                density="compact"
                variant="outlined"
                rounded="lg"
                v-model="certSearchNo"
                placeholder="เช่น EXP-2568-00123"
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
            ไม่พบใบทะเบียนเลขที่ "{{ certSearchNo }}" กรุณาตรวจสอบอีกครั้ง
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
                    เลขที่ใบทะเบียน
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
                    ดูใบทะเบียน
                  </v-btn>
                  <v-btn
                    size="small"
                    color="hcex-user"
                    variant="flat"
                    prepend-icon="fas fa-check"
                    :disabled="certSearchResult.isExpired"
                    @click="selectCert"
                  >
                    เลือกใบทะเบียนนี้
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Selected cert chip -->
          <div v-if="certSelected" class="mt-4 d-flex align-center ga-2">
            <v-icon icon="fas fa-circle-check" color="success" size="16" />
            <span class="text-body-2 font-weight-medium text-success">
              เลือกใบทะเบียน:
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
                        ข้อมูลปัจจุบัน (บนใบทะเบียน)
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
                        ข้อมูลปัจจุบัน (บนใบทะเบียน)
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
                        ข้อมูลปัจจุบัน (บนใบทะเบียน)
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
            ใบทะเบียนผู้ส่งออก
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
                <v-list-item subtitle="เลขที่ใบทะเบียน">
                  <v-list-item-title class="text-hcex-user font-weight-bold">
                    {{ certSearchResult.certNo }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="ชื่อสถานประกอบการ">
                  <v-list-item-title>{{
                    certSearchResult.companyNameTh
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="วันที่ออกใบทะเบียน">
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
              เลือกใบทะเบียนนี้
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
        v-if="route.params.type !== 'amendment'"
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
        v-if="route.params.type !== 'amendment'"
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
        v-if="route.params.type !== 'amendment'"
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
        v-if="route.params.type !== 'amendment'"
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
        v-if="route.params.type !== 'amendment'"
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
    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 1">
      <!-- เอกสารบุคคลธรรมดา -->
      <v-card
        v-if="entityType === 'personal'"
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
                      :color="
                        uploadedFiles[doc.key] ? 'warning' : 'hcex-user'
                      "
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
        v-if="entityType === 'juristic'"
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
                      :color="
                        uploadedFiles[doc.key] ? 'warning' : 'hcex-user'
                      "
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
import { ref, reactive, computed, watch } from "vue";
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
  newrequest: "คำขอขึ้น / ต่ออายุทะเบียน",
  renew: "คำขอต่ออายุทะเบียน",
  amendment: "คำขอแก้ไขใบทะเบียน",
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
  "EXP-2568-00123": {
    certNo: "EXP-2568-00123",
    issuedDate: "01/01/2568",
    expiryDate: "31/12/2569",
    isExpired: false,
    // ข้อมูลบนใบทะเบียน (ณ วันที่ออก)
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
  "EXP-2567-00456": {
    certNo: "EXP-2567-00456",
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
  "EXP-2565-00789": {
    certNo: "EXP-2565-00789",
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

const amendItems = [
  {
    value: "company_name",
    label: "ชื่อสถานประกอบการ",
    labelEn: "Company Name",
    source: "Auto-fill จาก DBD",
    inputType: "company_name",
  },
  {
    value: "address",
    label: "ที่อยู่สถานประกอบการ",
    labelEn: "Company Address",
    source: "Auto-fill จาก DBD",
    inputType: "address",
  },
  {
    value: "expire_date",
    label: "วันหมดอายุ",
    labelEn: "Expire date",
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
</script>

<style scoped>
/* Document / upload row */
.item-row {
  background: rgba(var(--v-theme-hcex-user), 0.03);
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
