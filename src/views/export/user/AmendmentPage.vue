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
        <h1 class="page-title mb-0">คำขอแก้ไขใบทะเบียน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          แก้ไขได้มากกว่า 1 ทะเบียนในคราวเดียวกัน
        </p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="section-card mb-6">
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

    <!-- ─── STEP 1 ─── -->
    <template v-if="currentStep === 0">
      <v-row>
        <!-- Left -->
        <v-col cols="12" md="8">
          <!-- ค้นหาทะเบียน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-magnifying-glass"
                color="export-user"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ค้นหาทะเบียนที่ต้องการแก้ไข</span
              >
            </div>
            <v-card-text class="pa-4">
              <div class="field-label">
                <div>เลขที่ใบทะเบียนผู้ส่งออก</div>
                <div class="field-label-en">Certificate No.</div>
              </div>
              <div class="d-flex ga-2">
                <v-text-field
                  v-model="searchInput"
                  placeholder="เช่น EXP-2569-005"
                  prepend-inner-icon="fas fa-search"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  clearable
                  class="flex-grow-1"
                  @keyup.enter="doSearch"
                />
                <v-btn
                  color="export-user"
                  rounded="lg"
                  :loading="searching"
                  @click="doSearch"
                  >ค้นหา</v-btn
                >
              </div>

              <!-- Search Results -->
              <div v-if="searchDone" class="mt-4">
                <div v-if="searchResults.length === 0" class="text-center py-5">
                  <v-icon
                    icon="fas fa-circle-xmark"
                    color="error"
                    size="28"
                    class="mb-2"
                  />
                  <div class="text-body-2 text-medium-emphasis">
                    ไม่พบทะเบียนที่ตรงกัน
                  </div>
                </div>
                <template v-else>
                  <div class="text-caption text-medium-emphasis mb-2">
                    พบ {{ searchResults.length }} รายการ
                  </div>
                  <div
                    v-for="cert in searchResults"
                    :key="cert.certNo"
                    class="result-row rounded-lg px-4 py-3 mb-2 d-flex align-center justify-space-between"
                    :class="{ 'result-row--selected': isSelected(cert.certNo) }"
                  >
                    <div class="flex-grow-1 mr-3">
                      <div class="d-flex align-center flex-wrap ga-2 mb-1">
                        <span
                          class="text-body-2 font-weight-bold text-export-user"
                          >{{ cert.certNo }}</span
                        >
                        <v-chip
                          :color="certStatusColor(cert.status)"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ certStatusLabel(cert.status) }}
                        </v-chip>
                      </div>
                      <div
                        class="text-caption text-medium-emphasis"
                        style="line-height: 1.4"
                      >
                        {{ cert.typecert }}
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        <v-icon
                          icon="fas fa-calendar"
                          size="10"
                          class="mr-1"
                        />หมดอายุ: {{ cert.expireDate }}
                      </div>
                    </div>
                    <div class="d-flex align-center ga-2 flex-shrink-0">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="grey"
                        @click.stop="viewCert(cert)"
                      >
                        <v-icon icon="fas fa-eye" size="14" />
                      </v-btn>
                      <v-btn
                        v-if="!isSelected(cert.certNo)"
                        size="small"
                        color="export-user"
                        variant="tonal"
                        rounded="lg"
                        prepend-icon="fas fa-plus"
                        :disabled="cert.status === 'expired'"
                        @click="addToSelection(cert)"
                        >เลือก</v-btn
                      >
                      <v-chip
                        v-else
                        color="success"
                        size="small"
                        variant="tonal"
                        prepend-icon="fas fa-circle-check"
                        >เลือกแล้ว</v-chip
                      >
                    </div>
                  </div>
                </template>
              </div>
            </v-card-text>
          </v-card>

          <!-- รายการที่ต้องการแก้ไข -->
          <v-card
            v-if="selected.length > 0"
            rounded="xl"
            elevation="0"
            class="section-card mb-4"
          >
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-pen-to-square"
                color="export-user"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ระบุรายการที่ต้องการแก้ไข</span
              >
            </div>
            <v-card-text class="pa-0">
              <v-alert
                v-if="selected.length === 0"
                type="info"
                variant="tonal"
                density="compact"
                rounded="0"
                class="text-caption ma-4"
              >
                กรุณาเลือกทะเบียนที่ต้องการแก้ไขก่อน
              </v-alert>

              <div class="amend-list">
                <template v-for="item in amendItems" :key="item.value">
                  <div
                    class="amend-item"
                    :class="{
                      'amend-item--active': amendTypes.includes(item.value),
                    }"
                  >
                    <div
                      class="d-flex align-center justify-space-between px-4 py-3"
                    >
                      <v-checkbox
                        v-model="amendTypes"
                        :value="item.value"
                        color="export-user"
                        density="compact"
                        hide-details
                        class="checkbox-spacious"
                        :disabled="selected.length === 0"
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
                        color="export-user"
                        variant="tonal"
                        class="mr-1"
                      >
                        {{ item.source }}
                      </v-chip>
                    </div>

                    <v-expand-transition>
                      <div
                        v-if="amendTypes.includes(item.value)"
                        class="amend-detail-field px-5 pb-5"
                      >
                        <!-- ชื่อสถานประกอบการ -->
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
                                variant="outlined"
                                rounded="lg"
                                :model-value="
                                  firstSelected?.companyNameTh ?? '-'
                                "
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
                                variant="outlined"
                                rounded="lg"
                                :model-value="
                                  firstSelected?.companyNameEn ?? '-'
                                "
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
                                :model-value="dbdData.companyNameTh"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
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
                                :model-value="dbdData.companyNameEn"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                          </v-row>
                        </template>

                        <!-- ที่อยู่สถานประกอบการ -->
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
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.houseNo ?? '-'"
                                readonly
                                class="field-readonly"
                                hide-details
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ตรอก / ซอย</div>
                                <div class="field-label-en">Alley / Soi</div>
                              </div>
                              <v-text-field
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.alley ?? '-'"
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
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.road ?? '-'"
                                readonly
                                class="field-readonly"
                                hide-details
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ตำบล / แขวง</div>
                                <div class="field-label-en">Sub-district</div>
                              </div>
                              <v-text-field
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.tambol ?? '-'"
                                readonly
                                class="field-readonly"
                                hide-details
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>อำเภอ / เขต</div>
                                <div class="field-label-en">District</div>
                              </div>
                              <v-text-field
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.district ?? '-'"
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
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.province ?? '-'"
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
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.zipcode ?? '-'"
                                readonly
                                class="field-readonly"
                                hide-details
                              />
                            </v-col>
                          </v-row>
                          <div class="field-section-label mb-2">
                            ข้อมูลใหม่ (SSO / DBD)
                          </div>
                          <div
                            class="text-caption font-weight-medium text-medium-emphasis mb-2"
                          >
                            ภาษาไทย
                          </div>
                          <v-row dense class="mb-3">
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>บ้านเลขที่</div>
                                <div class="field-label-en">House No.</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.houseNo"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ตรอก / ซอย</div>
                                <div class="field-label-en">Alley / Soi</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.alley"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ถนน</div>
                                <div class="field-label-en">Road</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.road"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ตำบล / แขวง</div>
                                <div class="field-label-en">Sub-district</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.tambol"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>อำเภอ / เขต</div>
                                <div class="field-label-en">District</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.district"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>จังหวัด</div>
                                <div class="field-label-en">Province</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.province"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>รหัสไปรษณีย์</div>
                                <div class="field-label-en">Postcode</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.zipcode"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
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
                                :model-value="ssoData.houseNoEn"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ตรอก / ซอย</div>
                                <div class="field-label-en">Alley / Soi</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.alleyEn"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ถนน</div>
                                <div class="field-label-en">Road</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.roadEn"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>ตำบล / แขวง</div>
                                <div class="field-label-en">Sub-district</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.tambolEn"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>อำเภอ / เขต</div>
                                <div class="field-label-en">District</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.districtEn"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
                                class="field-readonly"
                              />
                            </v-col>
                            <v-col cols="6" sm="3">
                              <div class="field-label">
                                <div>จังหวัด</div>
                                <div class="field-label-en">Province</div>
                              </div>
                              <v-text-field
                                :model-value="ssoData.provinceEn"
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                readonly
                                hide-details
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
                                <div class="field-label-en">Expire Date</div>
                              </div>
                              <v-text-field
                                density="compact"
                                variant="outlined"
                                rounded="lg"
                                :model-value="firstSelected?.expireDate ?? '-'"
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
                                <div class="field-label-en">
                                  New Expiry Date
                                </div>
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
                                    variant="outlined"
                                    rounded="lg"
                                    :model-value="expireDateDisplay"
                                    readonly
                                    clearable
                                    prepend-inner-icon="fas fa-calendar"
                                    placeholder="เลือกวันที่"
                                    hide-details
                                    style="cursor: pointer"
                                    @click:clear.stop="
                                      amendNewValues.expire_date = null
                                    "
                                    class="field-editable"
                                  />
                                </template>
                                <v-date-picker
                                  v-model="amendNewValues.expire_date"
                                  color="export-user"
                                  show-adjacent-months
                                  title="เลือกวันที่"
                                  locale="th"
                                  @update:model-value="expireDateMenu = false"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </template>

                        <!-- ข้อมูลโรงงานผลิตสินค้าพืช -->
                        <template v-else-if="item.inputType === 'factory'">
                          <div class="field-section-label mb-2">
                            ข้อมูลปัจจุบัน (บนใบทะเบียน)
                          </div>
                          <v-data-table
                            :headers="factoryHeaders"
                            :items="firstSelected?.factories ?? []"
                            density="compact"
                            :hide-default-footer="true"
                            no-data-text="ไม่มีข้อมูลโรงงานบนใบทะเบียน"
                            class="mb-4 rounded-lg border-table"
                          >
                            <template #item.no="{ index }">{{
                              index + 1
                            }}</template>
                          </v-data-table>

                          <div
                            class="d-flex align-center justify-space-between mb-2"
                          >
                            <div class="field-section-label mb-0">
                              ข้อมูลโรงงานใหม่ที่ต้องการ
                            </div>
                            <v-btn
                              color="export-user"
                              variant="tonal"
                              prepend-icon="fas fa-plus"
                              size="small"
                              @click="openFactoryDialog()"
                            >
                              เพิ่มโรงงาน
                            </v-btn>
                          </div>
                          <v-data-table
                            :headers="factoryEditHeaders"
                            :items="amendNewValues.factories"
                            density="compact"
                            :hide-default-footer="
                              amendNewValues.factories.length <= 10
                            "
                            no-data-text="ยังไม่มีข้อมูล กรุณากดเพิ่มโรงงาน"
                            class="rounded-lg border-table"
                          >
                            <template #item.no="{ index }">{{
                              index + 1
                            }}</template>
                            <template #item.actions="{ index }">
                              <v-btn
                                icon="fas fa-trash"
                                size="x-small"
                                variant="text"
                                color="error"
                                @click="
                                  amendNewValues.factories.splice(index, 1)
                                "
                              />
                            </template>
                          </v-data-table>
                        </template>

                        <!-- ข้อมูลแหล่งผลิตพืชที่ได้รับการรับรอง GAP -->
                        <template v-else-if="item.inputType === 'gap'">
                          <div class="field-section-label mb-2">
                            ข้อมูลปัจจุบัน (บนใบทะเบียน)
                          </div>
                          <v-data-table
                            :headers="gapHeaders"
                            :items="firstSelected?.gapSites ?? []"
                            density="compact"
                            :hide-default-footer="true"
                            no-data-text="ไม่มีข้อมูลแหล่งผลิต GAP บนใบทะเบียน"
                            class="mb-4 rounded-lg border-table"
                          >
                            <template #item.no="{ index }">{{
                              index + 1
                            }}</template>
                          </v-data-table>

                          <div
                            class="d-flex align-center justify-space-between mb-2"
                          >
                            <div class="field-section-label mb-0">
                              แหล่งผลิต GAP ใหม่ที่ต้องการ
                            </div>
                            <v-btn
                              color="export-user"
                              variant="tonal"
                              prepend-icon="fas fa-plus"
                              size="small"
                              @click="openGapDialog()"
                            >
                              เพิ่มแหล่งผลิต
                            </v-btn>
                          </div>
                          <v-data-table
                            :headers="gapEditHeaders"
                            :items="amendNewValues.gapSites"
                            density="compact"
                            :hide-default-footer="
                              amendNewValues.gapSites.length <= 10
                            "
                            no-data-text="ยังไม่มีข้อมูล กรุณากดเพิ่มแหล่งผลิต"
                            class="rounded-lg border-table"
                          >
                            <template #item.no="{ index }">{{
                              index + 1
                            }}</template>
                            <template #item.actions="{ index }">
                              <v-btn
                                icon="fas fa-trash"
                                size="x-small"
                                variant="text"
                                color="error"
                                @click="
                                  amendNewValues.gapSites.splice(index, 1)
                                "
                              />
                            </template>
                          </v-data-table>
                        </template>
                      </div>
                    </v-expand-transition>
                  </div>
                </template>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right: Selected (sticky) -->
        <v-col cols="12" md="4">
          <div class="sticky-col">
            <v-card rounded="xl" elevation="0" class="section-card">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon
                  icon="fas fa-list-check"
                  color="export-user"
                  size="15"
                />
                <span class="text-subtitle-2 font-weight-bold"
                  >ทะเบียนที่เลือก</span
                >
                <v-spacer />
                <v-chip
                  :color="selected.length > 0 ? 'export-user' : 'grey'"
                  size="small"
                  variant="tonal"
                >
                  {{ selected.length }} รายการ
                </v-chip>
              </div>
              <v-card-text
                class="pa-3"
                style="max-height: 320px; overflow-y: auto"
              >
                <div v-if="selected.length === 0" class="text-center py-8">
                  <v-icon
                    icon="fas fa-file-pen"
                    color="grey"
                    size="32"
                    class="mb-3"
                  />
                  <div class="text-body-2 text-medium-emphasis">
                    ยังไม่ได้เลือกทะเบียน
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ค้นหาและกด "เลือก" เพื่อเพิ่มรายการ
                  </div>
                </div>
                <div
                  v-for="cert in selected"
                  :key="cert.certNo"
                  class="selected-item rounded-lg pa-3 mb-2 d-flex align-start justify-space-between"
                >
                  <div class="flex-grow-1 pr-2">
                    <div class="text-body-2 font-weight-bold text-export-user">
                      {{ cert.certNo }}
                    </div>
                    <div
                      class="text-caption text-medium-emphasis mt-1"
                      style="line-height: 1.4"
                    >
                      {{ cert.typecert }}
                    </div>
                  </div>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="error"
                    class="flex-shrink-0"
                    @click="removeFromSelection(cert.certNo)"
                  >
                    <v-icon icon="fas fa-xmark" size="13" />
                  </v-btn>
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="pa-4 d-flex flex-column ga-2">
                <v-alert
                  v-if="selected.length === 0"
                  type="warning"
                  variant="tonal"
                  density="compact"
                  rounded="lg"
                  class="w-100 text-caption"
                >
                  กรุณาเลือกทะเบียนอย่างน้อย 1 รายการ
                </v-alert>
                <v-btn
                  color="export-user"
                  block
                  variant="flat"
                  rounded="lg"
                  append-icon="fas fa-arrow-right"
                  :disabled="selected.length === 0 || amendTypes.length === 0"
                  @click="currentStep = 1"
                >
                  ถัดไป: แนบเอกสาร
                </v-btn>
                <v-btn
                  variant="tonal"
                  color="export-user"
                  block
                  rounded="lg"
                  prepend-icon="fas fa-floppy-disk"
                  @click="saveDraft"
                >
                  บันทึกแบบร่าง
                </v-btn>
                <v-btn
                  variant="tonal"
                  color="grey"
                  block
                  rounded="lg"
                  prepend-icon="fas fa-xmark"
                  @click="cancelRequest"
                >
                  ยกเลิก
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- ─── STEP 2 ─── -->
    <template v-else-if="currentStep === 1">
      <v-row>
        <!-- Left: File Upload -->
        <v-col cols="12" md="8">
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-paperclip" color="export-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
            </div>
            <v-card-text class="pt-5">
              <div
                v-if="attachedFiles.length === 0"
                class="item-row rounded-lg pa-3 mb-2 d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-file-circle-plus" color="grey" size="18" />
                <span class="text-body-2 text-medium-emphasis flex-grow-1"
                  >ยังไม่มีเอกสารแนบ</span
                >
                <v-chip size="x-small" color="grey" variant="tonal"
                  >ไม่บังคับ</v-chip
                >
              </div>
              <div
                v-for="(file, i) in attachedFiles"
                :key="i"
                class="item-row rounded-lg pa-3 mb-2"
              >
                <v-row align="center" no-gutters>
                  <v-col class="d-flex align-center ga-2 overflow-hidden">
                    <v-icon
                      :icon="fileIcon(file.name)"
                      :color="fileColor(file.name)"
                      size="18"
                      class="flex-shrink-0"
                    />
                    <div class="overflow-hidden">
                      <div class="text-body-2 font-weight-medium text-truncate">
                        {{ file.name }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatSize(file.size) }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="auto" class="pl-3">
                    <v-btn
                      icon="fas fa-xmark"
                      color="error"
                      variant="text"
                      size="small"
                      @click="removeFile(i)"
                    />
                  </v-col>
                </v-row>
              </div>
              <div class="mt-3 d-flex align-center ga-3">
                <v-btn
                  variant="tonal"
                  color="export-user"
                  size="small"
                  rounded="lg"
                  prepend-icon="fas fa-upload"
                  @click="triggerFileInput"
                >
                  เพิ่มเอกสาร
                </v-btn>
                <span class="text-caption text-medium-emphasis"
                  >รองรับ PDF, JPG, PNG ไม่เกิน 10 MB</span
                >
              </div>
            </v-card-text>
          </v-card>

          <!-- Navigation -->
          <div class="d-flex">
            <v-btn
              variant="tonal"
              color="grey"
              rounded="lg"
              prepend-icon="fas fa-arrow-left"
              @click="currentStep = 0"
              >ย้อนกลับ</v-btn
            >
          </div>
        </v-col>

        <!-- Right: Summary (sticky) -->
        <v-col cols="12" md="4">
          <div class="sticky-col">
            <v-card rounded="xl" elevation="0" class="section-card">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon
                  icon="fas fa-clipboard-list"
                  color="export-user"
                  size="15"
                />
                <span class="text-subtitle-2 font-weight-bold">สรุปคำขอ</span>
              </div>
              <v-card-text class="pa-4">
                <div class="text-caption text-medium-emphasis mb-1">
                  ทะเบียนที่ขอแก้ไข
                </div>
                <div
                  v-for="cert in selected"
                  :key="cert.certNo"
                  class="summary-item rounded-lg px-3 py-2 mb-2"
                >
                  <div class="text-body-2 font-weight-bold text-export-user">
                    {{ cert.certNo }}
                  </div>
                  <div
                    class="text-caption text-medium-emphasis"
                    style="line-height: 1.4"
                  >
                    {{ cert.typecert }}
                  </div>
                </div>
                <v-divider class="my-3" />
                <div class="text-caption text-medium-emphasis mb-2">
                  รายการที่แก้ไข
                </div>
                <div class="d-flex flex-wrap ga-1 mb-3">
                  <v-chip
                    v-for="t in amendTypes"
                    :key="t"
                    size="x-small"
                    color="export-user"
                    variant="tonal"
                  >
                    {{ amendItemLabel(t) }}
                  </v-chip>
                </div>
                <v-divider class="my-3" />
                <div class="d-flex align-center justify-space-between">
                  <div class="text-caption text-medium-emphasis">เอกสารแนบ</div>
                  <v-chip
                    :color="attachedFiles.length > 0 ? 'success' : 'grey'"
                    size="x-small"
                    variant="tonal"
                  >
                    {{ attachedFiles.length }} ไฟล์
                  </v-chip>
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="pa-4 d-flex flex-column ga-2">
                <v-btn
                  color="export-user"
                  block
                  variant="flat"
                  rounded="lg"
                  prepend-icon="fas fa-file-pen"
                  @click="openConfirm"
                >
                  ยื่นคำขอแก้ไข
                </v-btn>
                <v-btn
                  variant="tonal"
                  color="export-user"
                  block
                  rounded="lg"
                  prepend-icon="fas fa-floppy-disk"
                  @click="saveDraft"
                >
                  บันทึกแบบร่าง
                </v-btn>
                <v-btn
                  variant="tonal"
                  color="grey"
                  block
                  rounded="lg"
                  prepend-icon="fas fa-xmark"
                  @click="cancelRequest"
                >
                  ยกเลิก
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="460" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6">
          <div class="amend-ring mx-auto mb-4">
            <v-icon icon="fas fa-file-pen" color="export-user" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold text-center mb-1">
            ยืนยันคำขอแก้ไขใบทะเบียน
          </h3>
          <p class="text-body-2 text-medium-emphasis text-center mb-4">
            คุณต้องการยื่นคำขอแก้ไขทะเบียน
            <strong>{{ selected.length }} รายการ</strong> ใช่หรือไม่?
          </p>
          <v-divider class="mb-4" />
          <div
            v-for="cert in selected"
            :key="cert.certNo"
            class="confirm-item rounded-lg px-3 py-2 mb-2 d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-certificate" color="export-user" size="14" />
            <span class="text-body-2 font-weight-medium text-export-user">{{
              cert.certNo
            }}</span>
            <span
              class="text-caption text-medium-emphasis flex-grow-1 text-truncate"
              >— {{ cert.typecert }}</span
            >
          </div>
          <div class="mt-3 d-flex flex-wrap ga-1">
            <v-chip
              v-for="t in amendTypes"
              :key="t"
              size="x-small"
              color="export-user"
              variant="tonal"
            >
              {{ amendItemLabel(t) }}
            </v-chip>
          </div>
          <div
            v-if="attachedFiles.length > 0"
            class="mt-3 d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-paperclip" size="13" color="grey" />
            <span class="text-caption text-medium-emphasis"
              >เอกสารแนบ {{ attachedFiles.length }} ไฟล์</span
            >
          </div>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="confirmDialog = false"
            >ย้อนกลับ</v-btn
          >
          <v-btn
            color="export-user"
            rounded="lg"
            block
            :loading="submitting"
            @click="doSubmit"
            >ยืนยันแก้ไข</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" color="success" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">
            ส่งคำขอแก้ไขทะเบียน {{ submittedCount }} รายการเรียบร้อยแล้ว
          </p>
          <p class="text-caption text-medium-emphasis">
            เจ้าหน้าที่จะดำเนินการตรวจสอบและแจ้งผลให้ทราบ
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-btn
            color="export-user"
            block
            rounded="lg"
            @click="router.push({ name: 'ExportUserApplicationList' })"
          >
            ไปยังรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Cert Dialog -->
    <v-dialog v-model="viewCertDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
          <v-icon icon="fas fa-certificate" color="export-user" size="18" />
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
          <template v-if="viewingCert">
            <v-list density="compact" lines="two">
              <v-list-item subtitle="เลขที่ใบทะเบียน">
                <v-list-item-title class="text-export-user font-weight-bold">{{
                  viewingCert.certNo
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="ประเภทคำขอ">
                <v-list-item-title>{{
                  viewingCert.typecert
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="วันที่ออกใบทะเบียน">
                <v-list-item-title>{{
                  viewingCert.issuedDate
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="วันหมดอายุ">
                <v-list-item-title>{{
                  viewingCert.expireDate
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="สถานะ">
                <v-list-item-title>
                  <v-chip
                    size="x-small"
                    :color="certStatusColor(viewingCert.status)"
                    variant="tonal"
                  >
                    {{ certStatusLabel(viewingCert.status) }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
        </v-card-text>
        <v-card-actions class="px-5 pb-4 d-flex flex-column ga-2">
          <v-btn
            color="export-user"
            variant="tonal"
            prepend-icon="fas fa-download"
            block
            rounded="lg"
          >
            ดาวน์โหลด PDF
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Factory Dialog -->
    <v-dialog v-model="factoryDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
          <v-icon icon="fas fa-industry" color="export-user" size="18" />
          เพิ่มข้อมูลโรงงาน
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            size="small"
            variant="text"
            color="grey"
            @click="factoryDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label">
                <div>ชื่อโรงงาน</div>
                <div class="field-label-en">Factory Name</div>
              </div>
              <v-text-field
                v-model="factoryForm.name"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ที่ตั้ง / จังหวัด</div>
                <div class="field-label-en">Location / Province</div>
              </div>
              <v-text-field
                v-model="factoryForm.location"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ประเภทสินค้าพืช</div>
                <div class="field-label-en">Product Type</div>
              </div>
              <v-text-field
                v-model="factoryForm.product"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="factoryDialog = false"
            >ยกเลิก</v-btn
          >
          <v-spacer />
          <v-btn
            color="export-user"
            variant="flat"
            rounded="lg"
            :disabled="!factoryForm.name"
            @click="saveFactory"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- GAP Dialog -->
    <v-dialog v-model="gapDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
          <v-icon icon="fas fa-seedling" color="success" size="18" />
          เพิ่มแหล่งผลิต GAP
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            size="small"
            variant="text"
            color="grey"
            @click="gapDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>เลขที่ใบรับรอง GAP</div>
                <div class="field-label-en">GAP Certificate No.</div>
              </div>
              <v-text-field
                v-model="gapForm.certNo"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ชนิดพืช</div>
                <div class="field-label-en">Crop Name</div>
              </div>
              <v-text-field
                v-model="gapForm.cropName"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>จังหวัด</div>
                <div class="field-label-en">Province</div>
              </div>
              <v-text-field
                v-model="gapForm.province"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="gapDialog = false"
            >ยกเลิก</v-btn
          >
          <v-spacer />
          <v-btn
            color="success"
            variant="flat"
            rounded="lg"
            :disabled="!gapForm.certNo"
            @click="saveGap"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Draft Dialog -->
    <v-dialog v-model="draftDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="draft-ring mx-auto mb-4">
            <v-icon icon="fas fa-floppy-disk" color="grey" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">บันทึกแบบร่างสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis">
            บันทึกคำขอแก้ไขไว้ในแบบร่างแล้ว สามารถกลับมาแก้ไขและยื่นได้ในภายหลัง
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="draftDialog = false"
            >แก้ไขต่อ</v-btn
          >
          <v-btn
            color="export-user"
            rounded="lg"
            block
            @click="router.push({ name: 'ExportUserApplicationList' })"
          >
            ไปยังรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "แนบเอกสาร" },
];
const currentStep = ref(0);

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

// ── Amendment types ─────────────────────────────────
const amendItems = [
  {
    value: "company_name",
    label: "ชื่อสถานประกอบการ",
    labelEn: "Company Name",
    source: "DBD",
    inputType: "company_name",
  },
  {
    value: "address",
    label: "ที่อยู่สถานประกอบการ",
    labelEn: "Company Address",
    source: "SSO / DBD",
    inputType: "address",
  },
  {
    value: "expire_date",
    label: "วันหมดอายุ",
    labelEn: "Expiry Date",
    inputType: "expire_date",
  },
  {
    value: "factory",
    label: "ข้อมูลโรงงานผลิตสินค้าพืช",
    labelEn: "Plant Production Factory",
    inputType: "factory",
  },
  {
    value: "gap",
    label: "ข้อมูลแหล่งผลิตพืชที่ได้รับการรับรอง GAP",
    labelEn: "GAP Certified Production Site",
    inputType: "gap",
  },
];
const amendTypes = ref([]);

function amendItemLabel(value) {
  return amendItems.find((i) => i.value === value)?.label ?? value;
}

// ── Mock DBD / SSO fetched data (read-only from external source) ────
const dbdData = {
  companyNameTh: "บริษัท สยามเกษตรส่งออก จำกัด",
  companyNameEn: "Siam Agriculture Export Co., Ltd.",
};
const ssoData = {
  houseNo: "123/45",
  alley: "ซอยเกษตร 5",
  road: "ถนนวิภาวดีรังสิต",
  tambol: "ลาดยาว",
  district: "จตุจักร",
  province: "กรุงเทพมหานคร",
  zipcode: "10900",
  houseNoEn: "123/45",
  alleyEn: "Kasert Soi 5",
  roadEn: "Vibhavadi Rangsit Rd.",
  tambolEn: "Lat Yao",
  districtEn: "Chatuchak",
  provinceEn: "Bangkok",
};

// ── New values form ─────────────────────────────────
const amendNewValues = reactive({
  expire_date: null,
  factories: [],
  gapSites: [],
  other: "",
});

const expireDateMenu = ref(false);
const expireDateDisplay = computed(() => {
  if (!amendNewValues.expire_date) return "";
  const d = new Date(amendNewValues.expire_date);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// ── Mock certificate data ───────────────────────────
const allCerts = [
  {
    certNo: "EXP-2569-00123",
    typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
    issuedDate: "14/03/2569",
    expireDate: "14/03/2571",
    status: "active",
    companyNameTh: "บริษัท สยามเกษตรส่งออก จำกัด",
    companyNameEn: "Siam Agriculture Export Co., Ltd.",
    houseNo: "123/45",
    alley: "ซอยเกษตร 5",
    road: "ถนนวิภาวดีรังสิต",
    tambol: "ลาดยาว",
    district: "จตุจักร",
    province: "กรุงเทพมหานคร",
    zipcode: "10900",
    factories: [
      { name: "โรงงานสยามเกษตร สาขา 1", location: "นนทบุรี", product: "ผักสด" },
    ],
    gapSites: [
      { certNo: "GAP-2568-001", cropName: "ข้าว", province: "นครราชสีมา" },
    ],
  },
  {
    certNo: "EXP-2569-00456",
    typecert: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
    issuedDate: "01/03/2567",
    expireDate: "01/03/2569",
    status: "expiring",
    companyNameTh: "บริษัท สยามเกษตรส่งออก จำกัด",
    companyNameEn: "Siam Agriculture Export Co., Ltd.",
    houseNo: "123/45",
    alley: "ซอยเกษตร 5",
    road: "ถนนวิภาวดีรังสิต",
    tambol: "ลาดยาว",
    district: "จตุจักร",
    province: "กรุงเทพมหานคร",
    zipcode: "10900",
    factories: [],
    gapSites: [],
  },
  {
    certNo: "EXP-2569-00789",
    typecert:
      "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งผลทุเรียนสดออกไปนอกราชอาณาจักร",
    issuedDate: "19/02/2564",
    expireDate: "19/02/2566",
    status: "expired",
    companyNameTh: "บริษัท สยามเกษตรส่งออก จำกัด",
    companyNameEn: "Siam Agriculture Export Co., Ltd.",
    houseNo: "123/45",
    alley: "ซอยเกษตร 5",
    road: "ถนนวิภาวดีรังสิต",
    tambol: "ลาดยาว",
    district: "จตุจักร",
    province: "กรุงเทพมหานคร",
    zipcode: "10900",
    factories: [],
    gapSites: [],
  },
  {
    certNo: "EXP-2568-01123",
    typecert:
      "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    issuedDate: "09/08/2568",
    expireDate: "09/08/2570",
    status: "active",
    companyNameTh: "บริษัท สยามเกษตรส่งออก จำกัด",
    companyNameEn: "Siam Agriculture Export Co., Ltd.",
    houseNo: "123/45",
    alley: "ซอยเกษตร 5",
    road: "ถนนวิภาวดีรังสิต",
    tambol: "ลาดยาว",
    district: "จตุจักร",
    province: "กรุงเทพมหานคร",
    zipcode: "10900",
    factories: [
      { name: "โรงงานแปรรูปกล้วย", location: "กำแพงเพชร", product: "กล้วยสด" },
    ],
    gapSites: [
      { certNo: "GAP-2567-012", cropName: "กล้วยหอม", province: "กำแพงเพชร" },
    ],
  },
  {
    certNo: "EXP-2568-01456",
    typecert: "คำขอจดทะเบียนเป็นผู้ส่งออกสินค้าเกษตรไปนอกราชอาณาจักร",
    issuedDate: "04/05/2568",
    expireDate: "04/05/2570",
    status: "active",
    companyNameTh: "บริษัท สยามเกษตรส่งออก จำกัด",
    companyNameEn: "Siam Agriculture Export Co., Ltd.",
    houseNo: "123/45",
    alley: "ซอยเกษตร 5",
    road: "ถนนวิภาวดีรังสิต",
    tambol: "ลาดยาว",
    district: "จตุจักร",
    province: "กรุงเทพมหานคร",
    zipcode: "10900",
    factories: [],
    gapSites: [],
  },
];

// ── View cert dialog ────────────────────────────────
const viewCertDialog = ref(false);
const viewingCert = ref(null);

function viewCert(cert) {
  viewingCert.value = cert;
  viewCertDialog.value = true;
}

// ── Search ──────────────────────────────────────────
const searchInput = ref("");
const searching = ref(false);
const searchDone = ref(false);
const searchResults = ref([]);

function doSearch() {
  const q = searchInput.value?.trim().toLowerCase();
  if (!q) return;
  searching.value = true;
  setTimeout(() => {
    searchResults.value = allCerts.filter((c) =>
      c.certNo.toLowerCase().includes(q),
    );
    searchDone.value = true;
    searching.value = false;
  }, 400);
}

// ── Selection ───────────────────────────────────────
const selected = ref([]);
const firstSelected = computed(() => selected.value[0] ?? null);

function isSelected(certNo) {
  return selected.value.some((c) => c.certNo === certNo);
}
function addToSelection(cert) {
  if (!isSelected(cert.certNo)) selected.value.push(cert);
}
function removeFromSelection(certNo) {
  selected.value = selected.value.filter((c) => c.certNo !== certNo);
}

// ── Table headers ───────────────────────────────────
const factoryHeaders = [
  { title: "#", key: "no", width: "50px" },
  { title: "ชื่อโรงงาน", key: "name" },
  { title: "ที่ตั้ง / จังหวัด", key: "location" },
  { title: "ประเภทสินค้าพืช", key: "product" },
];
const factoryEditHeaders = [
  { title: "#", key: "no", width: "50px" },
  { title: "ชื่อโรงงาน", key: "name" },
  { title: "ที่ตั้ง / จังหวัด", key: "location" },
  { title: "ประเภทสินค้าพืช", key: "product" },
  { title: "", key: "actions", width: "60px", sortable: false },
];
const gapHeaders = [
  { title: "#", key: "no", width: "50px" },
  { title: "เลขที่ใบรับรอง GAP", key: "certNo" },
  { title: "ชนิดพืช", key: "cropName" },
  { title: "จังหวัด", key: "province" },
];
const gapEditHeaders = [
  { title: "#", key: "no", width: "50px" },
  { title: "เลขที่ใบรับรอง GAP", key: "certNo" },
  { title: "ชนิดพืช", key: "cropName" },
  { title: "จังหวัด", key: "province" },
  { title: "", key: "actions", width: "60px", sortable: false },
];

// ── Factory dialog ──────────────────────────────────
const factoryDialog = ref(false);
const factoryForm = reactive({ name: "", location: "", product: "" });

function openFactoryDialog() {
  factoryForm.name = "";
  factoryForm.location = "";
  factoryForm.product = "";
  factoryDialog.value = true;
}
function saveFactory() {
  amendNewValues.factories.push({ ...factoryForm });
  factoryDialog.value = false;
}

// ── GAP dialog ──────────────────────────────────────
const gapDialog = ref(false);
const gapForm = reactive({ certNo: "", cropName: "", province: "" });

function openGapDialog() {
  gapForm.certNo = "";
  gapForm.cropName = "";
  gapForm.province = "";
  gapDialog.value = true;
}
function saveGap() {
  amendNewValues.gapSites.push({ ...gapForm });
  gapDialog.value = false;
}

// ── File Attachment ─────────────────────────────────
const attachedFiles = ref([]);

function triggerFileInput() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,.jpg,.jpeg,.png";
  input.multiple = true;
  input.onchange = (e) => {
    Array.from(e.target.files).forEach((f) => {
      if (!attachedFiles.value.some((a) => a.name === f.name))
        attachedFiles.value.push(f);
    });
  };
  input.click();
}
function removeFile(i) {
  attachedFiles.value.splice(i, 1);
}
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
function fileIcon(name) {
  if (name.endsWith(".pdf")) return "fas fa-file-pdf";
  if (name.match(/\.(jpg|jpeg|png)$/i)) return "fas fa-file-image";
  return "fas fa-file";
}
function fileColor(name) {
  if (name.endsWith(".pdf")) return "error";
  if (name.match(/\.(jpg|jpeg|png)$/i)) return "info";
  return "grey";
}

// ── Submit ──────────────────────────────────────────
const confirmDialog = ref(false);
const successDialog = ref(false);
const submitting = ref(false);
const submittedCount = ref(0);

const draftDialog = ref(false);

function saveDraft() {
  draftDialog.value = true;
}
function cancelRequest() {
  router.push({ name: "ExportUserApplicationType" });
}
function openConfirm() {
  confirmDialog.value = true;
}
function doSubmit() {
  submitting.value = true;
  setTimeout(() => {
    submittedCount.value = selected.value.length;
    submitting.value = false;
    confirmDialog.value = false;
    successDialog.value = true;
  }, 800);
}

// ── Helpers ─────────────────────────────────────────
function certStatusColor(s) {
  return (
    { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey"
  );
}
function certStatusLabel(s) {
  return (
    { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s
  );
}
</script>

<style scoped>
.sticky-col {
  position: sticky;
  top: 80px;
}
.field-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.field-label-en {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.6;
  font-weight: 400;
}
.field-section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-export-user));
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.req {
  color: rgb(var(--v-theme-error));
}

/* Stepper */
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

/* Result rows */
.result-row {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: border-color 0.15s;
}
.result-row--selected {
  border-color: rgba(var(--v-theme-export-user), 0.4);
  background: rgba(var(--v-theme-export-user), 0.04);
}
.selected-item,
.summary-item {
  background: rgba(var(--v-theme-export-user), 0.06);
  border: 1px solid rgba(var(--v-theme-export-user), 0.2);
}
.confirm-item {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Amendment list (CB style) */
.amend-list {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.amend-item {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: background 0.15s;
}
.amend-item--active {
  background: rgba(var(--v-theme-export-user), 0.04);
}
.checkbox-spacious :deep(.v-label) {
  padding-left: 6px;
}
.amend-detail-field {
  border-top: 1px dashed rgba(var(--v-theme-export-user), 0.3);
  padding-top: 16px;
  background: rgba(var(--v-theme-export-user), 0.02);
}
.field-readonly :deep(.v-field__input) {
  color: rgba(var(--v-theme-on-surface), 0.65) !important;
}
.field-readonly :deep(.v-field) {
  background: rgba(var(--v-theme-on-surface), 0.04) !important;
}
.field-editable :deep(.v-field) {
  background: white;
}
.border-table {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

/* File rows */
.item-row {
  background: rgba(var(--v-theme-export-user), 0.04);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.07);
}

/* Dialogs */
.amend-ring,
.amend-ring {
  background: rgba(var(--v-theme-export-user), 0.1);
}
.success-ring {
  background: rgba(var(--v-theme-success), 0.1);
}
.draft-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-on-surface), 0.08);
}
</style>
