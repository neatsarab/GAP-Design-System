<template>
  <div style="--v-theme-primary: var(--v-theme-cb-user)">
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

    <!-- Edit mode alert -->
    <v-alert
      v-if="isEditMode"
      color="warning"
      variant="tonal"
      rounded="xl"
      class="mb-5"
      prepend-icon="fas fa-triangle-exclamation"
    >
      <div class="text-body-2 font-weight-bold mb-1">หมายเหตุจากเจ้าหน้าที่</div>
      <div class="text-body-2">
        {{ editApplicationsMap[route.params.id]?.editNote ?? "กรุณาตรวจสอบและแก้ไขข้อมูลให้ถูกต้องครบถ้วน" }}
      </div>
    </v-alert>

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
                    ? 'text-cb-user font-weight-bold'
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

      <!-- ประเภทคำขอ (register only, ไม่แสดงใน edit mode) -->
      <v-card
        v-if="appType === 'register' && !isEditMode"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-list-check" color="cb-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ประเภทคำขอ</span>
        </div>
        <v-card-text class="pt-5">
          <v-radio-group
            v-model="form.requestType"
            color="cb-user"
            density="compact"
            inline
          >
            <v-radio value="register" label="คำขอขึ้นทะเบียน" class="mr-8" />
            <v-radio value="renewal" label="คำขอต่ออายุ" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- ระบุใบทะเบียน (amend/scope) — ซ่อนใน edit mode เพราะมาจากคำขอเดิมแล้ว -->
      <v-card
        v-if="['amend', 'scope', 'cancel'].includes(appType) && !isEditMode"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-certificate" color="cb-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">{{
            appType === 'scope'
              ? 'ระบุใบทะเบียนหน่วยรับรองที่ต้องการเพิ่ม-ลดขอบข่าย'
              : appType === 'cancel'
              ? 'ระบุใบทะเบียนหน่วยรับรองที่ต้องการยกเลิก'
              : 'ระบุใบทะเบียนหน่วยรับรองที่ต้องการแก้ไข'
          }}</span>
        </div>
        <v-card-text class="pt-5">
          <div class="field-label mb-2">
            เลขที่ใบทะเบียนหน่วยรับรอง <span class="req">*</span>
            <div class="field-label-en">Certification Body Registration Certificate No.</div>
          </div>
          <v-row dense align="center">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="certSearchNo"
                density="compact"
                variant="outlined"
                rounded="lg"
                placeholder="เช่น CB-2568-00123"
                prepend-inner-icon="fas fa-certificate"
                hide-details
                @keyup.enter="searchCert"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="cb-user"
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
                  <div class="text-body-1 font-weight-bold">
                    {{ certSearchResult.certNo }}
                  </div>
                  <div class="text-body-2 mt-1">{{ certSearchResult.cbName }}</div>
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
                    color="cb-user"
                    prepend-icon="fas fa-eye"
                    @click="viewCertDialog = true"
                  >
                    ดูใบทะเบียน
                  </v-btn>
                  <v-btn
                    size="small"
                    color="cb-user"
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

          <!-- Selected cert -->
          <div v-if="certSelected" class="mt-4 d-flex align-center ga-2">
            <v-icon icon="fas fa-circle-check" color="success" size="16" />
            <span class="text-body-2 font-weight-medium text-success"
              >เลือกใบทะเบียน:</span
            >
            <v-chip color="cb-user" variant="tonal" size="small">
              {{ certSelected.certNo }} — {{ certSelected.cbName }}
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

      <!-- รายการที่ต้องการแก้ไข / ขอบข่าย (ซ่อนใน edit mode) -->
      <v-card
        v-if="['amend', 'scope', 'cancel'].includes(appType) && certSelected && !isEditMode"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-pencil" color="cb-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">{{
            appType === 'scope'
              ? 'เลือกขอบข่ายมาตรฐานที่ต้องการเพิ่ม / ลด'
              : appType === 'cancel'
              ? 'เหตุผลในการขอยกเลิกใบทะเบียน'
              : 'เลือกรายการที่ต้องการแก้ไข'
          }}</span>
        </div>
        <v-card-text class="pt-4">
          <!-- scope: table layout -->
          <template v-if="appType === 'scope'">
            <div class="field-section-label mb-2">ขอบข่ายปัจจุบัน (บนใบทะเบียน)</div>
            <v-data-table
              :headers="stdHeaders"
              :items="certSelected?.standards ?? []"
              density="compact"
              :hide-default-footer="true"
              no-data-text="ไม่มีข้อมูลขอบข่ายบนใบทะเบียน"
              class="mb-5"
            >
              <template #item.index="{ index }">{{ index + 1 }}</template>
            </v-data-table>

            <div class="d-flex align-center justify-space-between mb-3">
              <div class="field-section-label mb-0">ขอบข่ายใหม่ที่ต้องการ</div>
              <v-btn color="cb-user" variant="tonal" prepend-icon="fas fa-plus" size="small" @click="openStdDialog()">
                เพิ่มขอบข่าย
              </v-btn>
            </div>
            <v-data-table
              :headers="stdHeaders"
              :items="form.standards"
              density="compact"
              :hide-default-footer="form.standards.length <= 10"
              no-data-text="ยังไม่มีข้อมูล กรุณากดเพิ่มขอบข่าย"
            >
              <template #item.index="{ index }">{{ index + 1 }}</template>
              <template #item.actions="{ index }">
                <div class="d-flex align-center">
                  <v-tooltip text="แก้ไข" location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon="fas fa-pen" size="x-small" variant="text" color="cb-user" @click="openStdDialog(index)" />
                    </template>
                  </v-tooltip>
                  <v-tooltip text="ลบ" location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon="fas fa-trash" size="x-small" variant="text" color="error" @click="removeStandard(index)" />
                    </template>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </template>

          <!-- cancel: reason field -->
          <template v-else-if="appType === 'cancel'">
            <div class="field-label mb-1">
              <div>เหตุผลในการขอยกเลิก <span class="req">*</span></div>
              <div class="field-label-en">Reason for Cancellation</div>
            </div>
            <v-textarea
              v-model="form.cancelReason"
              density="compact"
              variant="outlined"
              rounded="lg"
              rows="4"
              placeholder="ระบุเหตุผลในการขอยกเลิกใบทะเบียน"
              hide-details="auto"
              counter="500"
              maxlength="500"
            />
          </template>

          <!-- amend: checkbox list -->
          <div v-else class="amend-list">
            <template v-for="item in amendItems" :key="item.value">
              <div
                class="amend-item"
                :class="{ 'amend-item--active': amendFields.includes(item.value) }"
              >
                <div class="d-flex align-center justify-space-between">
                  <v-checkbox
                    v-model="amendFields"
                    :value="item.value"
                    color="cb-user"
                    density="compact"
                    hide-details
                    class="checkbox-spacious"
                  >
                    <template #label>
                      <div>
                        <div class="text-body-2 font-weight-medium">{{ item.label }}</div>
                        <div class="text-caption text-medium-emphasis">{{ item.labelEn }}</div>
                      </div>
                    </template>
                  </v-checkbox>
                  <v-chip v-if="item.source" size="x-small" color="cb-user" variant="tonal" class="mr-2">
                    {{ item.source }}
                  </v-chip>
                </div>

                <v-expand-transition>
                  <div v-if="amendFields.includes(item.value)" class="amend-detail-field">

                    <!-- ชื่อสถานประกอบการ -->
                    <template v-if="item.inputType === 'company_name'">
                      <div class="field-section-label mb-2">ข้อมูลปัจจุบัน (บนใบทะเบียน)</div>
                      <v-row dense class="mb-3">
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อหน่วยรับรอง (ภาษาไทย)</div>
                            <div class="field-label-en">CB Name (Thai)</div>
                          </div>
                          <v-text-field density="compact" :model-value="certSelected?.cbName" readonly class="field-readonly" hide-details />
                        </v-col>
                      </v-row>
                      <div class="field-section-label mb-2">ข้อมูลใหม่ (DBD)</div>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อสถานประกอบการ (ภาษาไทย)</div>
                            <div class="field-label-en">Company Name (Thai)</div>
                          </div>
                          <v-text-field density="compact" v-model="amendNewValues.company_name.nameTh" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อสถานประกอบการ (ภาษาอังกฤษ)</div>
                            <div class="field-label-en">Company Name (English)</div>
                          </div>
                          <v-text-field density="compact" v-model="amendNewValues.company_name.nameEn" hide-details="auto" class="field-readonly" />
                        </v-col>
                      </v-row>
                    </template>

                    <!-- ที่อยู่สถานประกอบการ -->
                    <template v-else-if="item.inputType === 'address'">
                      <div class="field-section-label mb-2">ข้อมูลปัจจุบัน (บนใบทะเบียน)</div>
                      <v-row dense class="mb-3">
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>บ้านเลขที่</div><div class="field-label-en">House No.</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.houseNo" readonly class="field-readonly" hide-details />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ตรอก/ซอย</div><div class="field-label-en">Alley / Soi</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.alley" readonly class="field-readonly" hide-details />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ถนน</div><div class="field-label-en">Road</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.road" readonly class="field-readonly" hide-details />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ตำบล/แขวง</div><div class="field-label-en">Sub-district</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.tambol" readonly class="field-readonly" hide-details />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>อำเภอ/เขต</div><div class="field-label-en">District</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.district" readonly class="field-readonly" hide-details />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>จังหวัด</div><div class="field-label-en">Province</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.province" readonly class="field-readonly" hide-details />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>รหัสไปรษณีย์</div><div class="field-label-en">Postcode</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.zipcode" readonly class="field-readonly" hide-details />
                        </v-col>
                      </v-row>

                      <div class="field-section-label mb-2">ข้อมูลใหม่ (DBD)</div>
                      <div class="text-caption font-weight-medium text-medium-emphasis mb-2">ภาษาไทย</div>
                      <v-row dense class="mb-2">
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>บ้านเลขที่</div><div class="field-label-en">House No.</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.houseNo" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ตรอก/ซอย</div><div class="field-label-en">Alley / Soi</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.alley" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ถนน</div><div class="field-label-en">Road</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.road" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ตำบล/แขวง</div><div class="field-label-en">Sub-district</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.tambol" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>อำเภอ/เขต</div><div class="field-label-en">District</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.district" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>จังหวัด</div><div class="field-label-en">Province</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.province" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>รหัสไปรษณีย์</div><div class="field-label-en">Postcode</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.zipcode" hide-details="auto" class="field-readonly" />
                        </v-col>
                      </v-row>
                      <v-divider class="my-3" />
                      <div class="text-caption font-weight-medium text-medium-emphasis mb-2">English</div>
                      <v-row dense>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>บ้านเลขที่</div><div class="field-label-en">House No.</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.houseNoEn" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ตรอก / ซอย</div><div class="field-label-en">Alley / Soi</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.alleyEn" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ถนน</div><div class="field-label-en">Road</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.roadEn" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>ตำบล / แขวง</div><div class="field-label-en">Sub-district</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.tambolEn" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>อำเภอ / เขต</div><div class="field-label-en">District</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.districtEn" hide-details="auto" class="field-readonly" />
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="field-label"><div>จังหวัด</div><div class="field-label-en">Province</div></div>
                          <v-text-field density="compact" v-model="amendNewValues.address.provinceEn" hide-details="auto" class="field-readonly" />
                        </v-col>
                      </v-row>
                    </template>

                    <!-- วันหมดอายุ -->
                    <template v-else-if="item.inputType === 'expire_date'">
                      <div class="field-section-label mb-2">ข้อมูลปัจจุบัน (บนใบทะเบียน)</div>
                      <v-row dense class="mb-3">
                        <v-col cols="12" sm="6">
                          <div class="field-label"><div>วันหมดอายุ</div><div class="field-label-en">Expire Date</div></div>
                          <v-text-field density="compact" :model-value="certSelected?.expiryDate" readonly class="field-readonly" hide-details />
                        </v-col>
                      </v-row>
                      <div class="field-section-label mb-2">ข้อมูลใหม่ <span class="req">*</span></div>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <div class="field-label"><div>วันหมดอายุใหม่</div><div class="field-label-en">New Expiry Date</div></div>
                          <v-menu v-model="expireDateMenu" :close-on-content-click="false" location="bottom start">
                            <template #activator="{ props }">
                              <v-text-field
                                v-bind="props"
                                density="compact"
                                :model-value="expireDateBE"
                                readonly
                                clearable
                                prepend-inner-icon="fas fa-calendar"
                                placeholder="เลือกวันที่ / เดือน / ปี"
                                :hint="certSelected ? `ห้ามเลือกเกินวันหมดอายุเดิม (${certSelected.expiryDate})` : ''"
                                persistent-hint
                                style="cursor: pointer"
                                @click:clear.stop="expireDateObj = null"
                                class="field-editable"
                              />
                            </template>
                            <v-date-picker
                              v-model="expireDateObj"
                              :max="certExpiryMaxDate"
                              color="cb-user"
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
            <v-icon icon="fas fa-certificate" color="cb-user" size="18" />
            ใบทะเบียนหน่วยรับรอง
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
                  <v-list-item-title class="text-cb-user font-weight-bold">
                    {{ certSearchResult.certNo }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="ชื่อสถานประกอบการ">
                  <v-list-item-title>{{
                    certSearchResult.cbName
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
              </v-list>
            </template>
          </v-card-text>
          <v-card-actions class="px-5 pb-4">
            <v-btn
              color="cb-user"
              variant="tonal"
              prepend-icon="fas fa-download"
              block
              rounded="lg"
              :disabled="certSearchResult.isExpired"
              @click="selectCert"
            >
              ดาวน์โหลด PDF
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card
        v-if="!['amend', 'scope', 'cancel'].includes(appType) || isEditMode"
        elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-user" color="cb-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ยื่นคำขอ</span>
          <v-chip size="x-small" color="cb-user" variant="tonal" class="ml-1">
            Auto-fill จาก SSO
          </v-chip>
          <v-spacer />
          <v-btn
            size="x-small"
            variant="tonal"
            color="cb-user"
            prepend-icon="fas fa-rotate"
            @click="refreshApplicantData"
          >ดึงข้อมูลใหม่</v-btn>
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
                v-model="form.applicantNameTh"
                density="compact"
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
                v-model="form.applicantHouseNo"
                density="compact"
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
                v-model="form.applicantMoo"
                density="compact"
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
                v-model="form.applicantAlley"
                density="compact"
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
                v-model="form.applicantRoad"
                density="compact"
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
                v-model="form.applicantTambol"
                density="compact"
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
                v-model="form.applicantDistrict"
                density="compact"
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
                v-model="form.applicantProvince"
                density="compact"
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
                v-model="form.applicantZipcode"
                density="compact"
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
                v-model="form.applicantPhone"
                density="compact"
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
                v-model="form.applicantFax"
                density="compact"
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
                v-model="form.applicantEmail"
                density="compact"
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
            v-if="!['amend', 'scope', 'cancel'].includes(appType) || isEditMode"
      elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building" color="cb-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ข้อมูลสถานประกอบการ</span>
          <v-chip size="x-small" color="cb-user" variant="tonal" class="ml-1">
            Auto-fill บางส่วนจาก DBD
          </v-chip>
          <v-spacer />
          <v-btn
            size="x-small"
            variant="tonal"
            color="cb-user"
            prepend-icon="fas fa-rotate"
            @click="refreshCompanyData"
          >ดึงข้อมูลใหม่</v-btn>
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
                v-model="form.companyNameTh"
                density="compact"
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
                v-model="form.companyNameEn"
                density="compact"
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
                v-model="form.houseNo"
                density="compact"
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
                v-model="form.alley"
                density="compact"
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
                v-model="form.road"
                density="compact"
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
                v-model="form.tambol"
                density="compact"
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
                v-model="form.district"
                density="compact"
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
                v-model="form.province"
                density="compact"
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
                v-model="form.zipcode"
                density="compact"
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
                v-model="form.houseNoEn"
                density="compact"
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
                v-model="form.alleyEn"
                density="compact"
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
                v-model="form.roadEn"
                density="compact"
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
                v-model="form.tambolEn"
                density="compact"
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
                v-model="form.districtEn"
                density="compact"
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
                v-model="form.provinceEn"
                density="compact"
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
                v-model="form.zipcodeEn"
                density="compact"
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
                v-model="form.companyPhone"
                density="compact"
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
                v-model="form.companyFax"
                density="compact"
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
                v-model="form.companyEmail"
                density="compact"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
          </v-row>

          <!-- ตำแหน่งที่ตั้ง -->
          <div class="field-section-label mt-4 mb-2">ตำแหน่งที่ตั้ง</div>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ละติจูด (Latitude)</div>
              </div>
              <v-text-field
                v-model="form.factoryLat"
                density="compact"
                variant="outlined"
                rounded="lg"
                placeholder="เช่น 13.782674"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>ลองจิจูด (Longitude)</div>
              </div>
              <v-text-field
                v-model="form.factoryLng"
                density="compact"
                variant="outlined"
                rounded="lg"
                placeholder="เช่น 100.546280"
                hide-details
              />
            </v-col>
            <v-col cols="12" class="mt-2">
              <div
                id="leaflet-map"
                style="height: 400px; width: 100%; border-radius: 16px; border: 1px solid #ddd; z-index: 1"
              ></div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ขอบข่ายมาตรฐาน -->
      <v-card 
            v-if="!['amend', 'scope', 'cancel'].includes(appType) || isEditMode"
      rounded="xl" elevation="0" class="section-card mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-certificate" color="cb-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ขอบข่ายมาตรฐานที่ขอขึ้นทะเบียน</span>
          <v-spacer />
          <v-btn
            color="cb-user"
            variant="tonal"
            prepend-icon="fas fa-plus"
            size="small"
            @click="openStdDialog()"
          >
            เพิ่มขอบข่าย
          </v-btn>
        </div>
        <v-card-text class="pt-5">

          <v-data-table
            :headers="stdHeaders"
            :items="form.standards"
            density="compact"
            :hide-default-footer="form.standards.length <= 10"
            no-data-text="ยังไม่มีข้อมูลขอบข่ายมาตรฐาน กรุณากดเพิ่มขอบข่าย"
          >
            <template #item.index="{ index }">
              {{ index + 1 }}
            </template>
            <template #item.actions="{ index }">
              <div class="d-flex align-center">
                <v-tooltip text="แก้ไข" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="fas fa-pen"
                      size="x-small"
                      variant="text"
                      color="cb-user"
                      @click="openStdDialog(index)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip text="ลบ" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="fas fa-trash"
                      size="x-small"
                      variant="text"
                      color="error"
                      @click="removeStandard(index)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Dialog เพิ่มขอบข่ายมาตรฐาน -->
      <v-dialog v-model="stdDialog" max-width="560">
        <v-card rounded="xl">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-certificate" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">{{ stdEditIndex === -1 ? 'เพิ่มขอบข่ายมาตรฐาน' : 'แก้ไขขอบข่ายมาตรฐาน' }}</span>
          </div>
          <v-card-text class="pt-5">
            <div class="field-label mb-1">
              <div>ขอบข่ายมาตรฐาน <span class="req">*</span></div>
              <div class="field-label-en">Standard Scope</div>
            </div>
            <v-select
              v-model="stdForm.standard"
              :items="stdOptions"
              item-title="label"
              item-value="value"
              density="compact"
              variant="outlined"
              rounded="lg"
              placeholder="เลือกขอบข่ายมาตรฐาน"
              hide-details
              class="mb-4"
            />
            <div class="field-label mb-1">
              <div>เลขที่ใบรับรองมาตรฐาน <span class="req">*</span></div>
              <div class="field-label-en">Standard Certificate No.</div>
            </div>
            <v-text-field
              v-model="stdForm.certNo"
              density="compact"
              variant="outlined"
              rounded="lg"
              placeholder="เช่น 2568-001"
              hide-details
            />
          </v-card-text>
          <v-card-actions class="px-5 pb-5">
            <v-row no-gutters class="ga-2 w-100">
              <v-col>
                <v-btn
                  variant="tonal"
                  color="grey"
                  rounded="lg"
                  block
                  @click="stdDialog = false"
                >ยกเลิก</v-btn>
              </v-col>
              <v-col>
                <v-btn
                  color="cb-user"
                  rounded="lg"
                  block
                  :disabled="!stdForm.standard || !stdForm.certNo.trim()"
                  @click="addStandard"
                >{{ stdEditIndex === -1 ? 'เพิ่ม' : 'บันทึก' }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </template>

    <!-- ─── STEP 2: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 1 && appType !== 'cancel'">
      <!-- เอกสารเพิ่มเติม -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="cb-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารเพิ่มเติม</span>
        </div>
        <v-card-text class="pt-5">
          <v-alert
            variant="tonal"
            color="warning"
            rounded="lg"
            density="compact"
            class="mb-4"
            prepend-icon="fas fa-triangle-exclamation"
          >
            สำเนาเอกสารต้องรับรองสำเนาถูกต้องโดยผู้มีอำนาจลงนาม
          </v-alert>
          <div
            v-for="doc in docExtra"
            :key="doc.key"
            class="item-row rounded-lg pa-4 mb-2 d-flex align-center justify-space-between flex-wrap ga-3"
          >
            <div class="text-body-2 font-weight-medium">{{ doc.label }}</div>
            <div class="d-flex align-center ga-2">
              <v-chip
                v-if="files[doc.key]"
                color="success"
                size="x-small"
                variant="tonal"
                prepend-icon="fas fa-check"
                >{{ files[doc.key] }}</v-chip
              >
              <v-btn
                :color="files[doc.key] ? 'success' : 'cb-user'"
                variant="tonal"
                size="small"
                rounded="lg"
                prepend-icon="fas fa-upload"
                @click="mockUpload(doc.key)"
              >
                {{ files[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

    </template>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="grey"
          @click="goToApplicationList""
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
          color="cb-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="cb-user"
          append-icon="fas fa-arrow-right"
          @click="nextStep"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="cb-user"
          prepend-icon="fas fa-paper-plane"
          @click="openConfirmDialog"
          >{{ isEditMode ? "ยื่นคำขอใหม่" : "ยื่นคำขอ" }}</v-btn
        >
      </div>
    </div>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="cb-user" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">{{ isEditMode ? "ยืนยันการยื่นคำขอใหม่" : "ยืนยันการยื่นคำขอ" }}</h3>
          <p class="text-body-2 text-medium-emphasis">
            ตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
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
              <v-btn color="cb-user" rounded="lg" block @click="submitApplication"
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
          <h3 class="text-h6 font-weight-bold mb-2">{{ isEditMode ? "ยื่นคำขอใหม่สำเร็จ" : "ยื่นคำขอสำเร็จ" }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ isEditMode ? "ระบบได้รับคำขอแก้ไขของท่านแล้ว เจ้าหน้าที่จะตรวจสอบและดำเนินการต่อไป" : "ระบบได้รับคำขอของท่านแล้ว เจ้าหน้าที่จะตรวจสอบและติดต่อกลับ" }}
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="cb-user"
            rounded="lg"
            block
            @click="goToApplicationList""
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
      <v-icon icon="fas fa-floppy-disk" class="mr-2" />บันทึกแบบร่างแล้ว
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocale } from "vuetify";
import { useSessionStore } from "@/stores/session.store";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const router = useRouter();

function refreshApplicantData() {
  form.applicantNameTh = sessionStore.displayName || "นายสมชาย ใจดี";
  form.applicantEmail = sessionStore.loginName || "somchai.j@example.co.th";
}

function refreshCompanyData() {
  form.companyNameTh = sessionStore.companyName || "บริษัท ไทยเซอร์ติฟาย จำกัด";
}

function goToApplicationList() {
  router.push({ name: "CBUserApplicationList" });
}

function prevStep() {
  currentStep.value--;
}

function nextStep() {
  currentStep.value++;
}
const route = useRoute();

const isEditMode = computed(() => route.name === "CBUserEditApplication");

// mock: map requestNo → application data for edit mode
const editApplicationsMap = {
  "CB-0001": {
    type: "register",
    editNote: "กรุณาแก้ไขข้อมูลสถานประกอบการให้ถูกต้องและครบถ้วน",
    formData: {
      requestType: "register",
      applicantNameTh: "นายสมชาย ใจดี",
      applicantHouseNo: "123", applicantMoo: "4",
      applicantAlley: "ซอยพหลโยธิน 5", applicantRoad: "ถนนพหลโยธิน",
      applicantTambol: "ลาดยาว", applicantDistrict: "จตุจักร",
      applicantProvince: "กรุงเทพมหานคร", applicantZipcode: "10900",
      applicantPhone: "02-123-4567", applicantFax: "02-123-4568",
      applicantEmail: "somchai.j@thaicertify.co.th",
      companyNameTh: "บริษัท ไทยเซอร์ติฟาย จำกัด",
      companyNameEn: "THAI CERTIFY CO., LTD.",
      houseNo: "88", alley: "ซอยลาดพร้าว 101", road: "ถนนลาดพร้าว",
      tambol: "คลองจั่น", district: "บางกะปิ", province: "กรุงเทพมหานคร", zipcode: "10240",
      houseNoEn: "88", alleyEn: "Soi Lat Phrao 101", roadEn: "Lat Phrao Road",
      tambolEn: "Khlong Chan", districtEn: "Bang Kapi", provinceEn: "Bangkok", zipcodeEn: "10240",
      companyPhone: "02-555-1234", companyFax: "", companyEmail: "info@thaicertify.co.th",
      standards: [
        { label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี", certNo: "STD-2568-001" },
      ],
      factoryLat: "13.7563", factoryLng: "100.5018",
    },
  },
  "CB-0002": {
    type: "renew",
    editNote: "เอกสารแนบไม่ครบ กรุณาแนบเอกสารให้ครบถ้วน",
    formData: {
      requestType: "renewal",
      applicantNameTh: "นางสาวพิมพ์ใจ รักดี",
      applicantHouseNo: "45/2", applicantMoo: "",
      applicantAlley: "", applicantRoad: "ถนนรัชดาภิเษก",
      applicantTambol: "ดินแดง", applicantDistrict: "ดินแดง",
      applicantProvince: "กรุงเทพมหานคร", applicantZipcode: "10400",
      applicantPhone: "02-245-6789", applicantFax: "",
      applicantEmail: "pimjai.r@agriqual.co.th",
      companyNameTh: "บริษัท อะกริควอล จำกัด",
      companyNameEn: "AGRIQUAL CO., LTD.",
      houseNo: "45/2", alley: "", road: "ถนนรัชดาภิเษก",
      tambol: "ดินแดง", district: "ดินแดง", province: "กรุงเทพมหานคร", zipcode: "10400",
      houseNoEn: "45/2", alleyEn: "", roadEn: "Ratchadaphisek Road",
      tambolEn: "Din Daeng", districtEn: "Din Daeng", provinceEn: "Bangkok", zipcodeEn: "10400",
      companyPhone: "02-245-6789", companyFax: "02-245-6790", companyEmail: "info@agriqual.co.th",
      standards: [
        { label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี", certNo: "STD-2567-003" },
        { label: "มกษ. 9035-2563 การปฏิบัติที่ดีสำหรับโรงคัดบรรจุผักและผลไม้สด", certNo: "STD-2567-004" },
      ],
      factoryLat: "13.7800", factoryLng: "100.5700",
    },
  },
  "CB-0003": {
    type: "scope",
    editNote: "กรุณาระบุขอบข่ายมาตรฐานที่ต้องการเพิ่ม-ลดให้ชัดเจน",
    formData: {
      applicantNameTh: "นายวิชัย มานะดี",
      applicantHouseNo: "99", applicantMoo: "2",
      applicantAlley: "ซอยเพชรบุรี 15", applicantRoad: "ถนนเพชรบุรี",
      applicantTambol: "ถนนเพชรบุรี", applicantDistrict: "ราชเทวี",
      applicantProvince: "กรุงเทพมหานคร", applicantZipcode: "10400",
      applicantPhone: "02-356-7890", applicantFax: "02-356-7891",
      applicantEmail: "wichai.m@thaistandard.co.th",
      companyNameTh: "บริษัท ไทยสแตนดาร์ด จำกัด",
      companyNameEn: "THAI STANDARD CO., LTD.",
      houseNo: "99", alley: "ซอยเพชรบุรี 15", road: "ถนนเพชรบุรี",
      tambol: "ถนนเพชรบุรี", district: "ราชเทวี", province: "กรุงเทพมหานคร", zipcode: "10400",
      houseNoEn: "99", alleyEn: "Soi Phetchaburi 15", roadEn: "Phetchaburi Road",
      tambolEn: "Thanon Phetchaburi", districtEn: "Ratchathewi", provinceEn: "Bangkok", zipcodeEn: "10400",
      companyPhone: "02-356-7890", companyFax: "02-356-7891", companyEmail: "info@thaistandard.co.th",
      standards: [
        { label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี", certNo: "STD-2568-005" },
      ],
      factoryLat: "13.7500", factoryLng: "100.5300",
    },
  },
  "CB-0004": {
    type: "register",
    editNote: "ข้อมูลผู้ยื่นคำขอไม่ถูกต้อง กรุณาตรวจสอบและแก้ไข",
    formData: {
      requestType: "register",
      applicantNameTh: "นายประสิทธิ์ ชัยชนะ",
      applicantHouseNo: "12/3", applicantMoo: "",
      applicantAlley: "", applicantRoad: "ถนนสุขุมวิท",
      applicantTambol: "คลองเตย", applicantDistrict: "คลองเตย",
      applicantProvince: "กรุงเทพมหานคร", applicantZipcode: "10110",
      applicantPhone: "02-412-3456", applicantFax: "",
      applicantEmail: "prasit.c@greencert.co.th",
      companyNameTh: "บริษัท กรีนเซิร์ต จำกัด",
      companyNameEn: "GREENCERT CO., LTD.",
      houseNo: "12/3", alley: "", road: "ถนนสุขุมวิท",
      tambol: "คลองเตย", district: "คลองเตย", province: "กรุงเทพมหานคร", zipcode: "10110",
      houseNoEn: "12/3", alleyEn: "", roadEn: "Sukhumvit Road",
      tambolEn: "Khlong Toei", districtEn: "Khlong Toei", provinceEn: "Bangkok", zipcodeEn: "10110",
      companyPhone: "02-412-3456", companyFax: "02-412-3457", companyEmail: "info@greencert.co.th",
      standards: [
        { label: "มกษ. 9035-2563 การปฏิบัติที่ดีสำหรับโรงคัดบรรจุผักและผลไม้สด", certNo: "STD-2568-006" },
        { label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี", certNo: "STD-2568-007" },
      ],
      factoryLat: "13.7200", factoryLng: "100.5600",
    },
  },
  "CB-0005": {
    type: "amend",
    editNote: "กรุณาแนบหลักฐานประกอบการแก้ไขให้ครบถ้วน และตรวจสอบข้อมูลผู้ยื่นคำขอให้ถูกต้อง",
    formData: {
      applicantNameTh: "นายสมชาย ใจดี",
      applicantHouseNo: "123", applicantMoo: "4",
      applicantAlley: "ซอยพหลโยธิน 5", applicantRoad: "ถนนพหลโยธิน",
      applicantTambol: "ลาดยาว", applicantDistrict: "จตุจักร",
      applicantProvince: "กรุงเทพมหานคร", applicantZipcode: "10900",
      applicantPhone: "02-123-4567", applicantFax: "02-123-4568",
      applicantEmail: "somchai.j@thaicertify.co.th",
      companyNameTh: "บริษัท ไทยเซอร์ติฟาย จำกัด",
      companyNameEn: "THAI CERTIFY CO., LTD.",
      houseNo: "88", alley: "ซอยลาดพร้าว 101", road: "ถนนลาดพร้าว",
      tambol: "คลองจั่น", district: "บางกะปิ", province: "กรุงเทพมหานคร", zipcode: "10240",
      houseNoEn: "88", alleyEn: "Soi Lat Phrao 101", roadEn: "Lat Phrao Road",
      tambolEn: "Khlong Chan", districtEn: "Bang Kapi", provinceEn: "Bangkok", zipcodeEn: "10240",
      companyPhone: "02-555-1234", companyFax: "", companyEmail: "info@thaicertify.co.th",
      standards: [
        { label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี", certNo: "STD-2568-001" },
      ],
      factoryLat: "13.7563", factoryLng: "100.5018",
    },
  },
  "CB-0006": {
    type: "renew",
    editNote: "กรุณาตรวจสอบและแก้ไขข้อมูลให้ถูกต้อง",
    formData: {
      requestType: "renewal",
      applicantNameTh: "นางสาวพิมพ์ใจ รักดี",
      applicantHouseNo: "45/2", applicantMoo: "",
      applicantAlley: "", applicantRoad: "ถนนรัชดาภิเษก",
      applicantTambol: "ดินแดง", applicantDistrict: "ดินแดง",
      applicantProvince: "กรุงเทพมหานคร", applicantZipcode: "10400",
      applicantPhone: "02-245-6789", applicantFax: "",
      applicantEmail: "pimjai.r@agriqual.co.th",
      companyNameTh: "บริษัท อะกริควอล จำกัด",
      companyNameEn: "AGRIQUAL CO., LTD.",
      houseNo: "45/2", alley: "", road: "ถนนรัชดาภิเษก",
      tambol: "ดินแดง", district: "ดินแดง", province: "กรุงเทพมหานคร", zipcode: "10400",
      houseNoEn: "45/2", alleyEn: "", roadEn: "Ratchadaphisek Road",
      tambolEn: "Din Daeng", districtEn: "Din Daeng", provinceEn: "Bangkok", zipcodeEn: "10400",
      companyPhone: "02-245-6789", companyFax: "02-245-6790", companyEmail: "info@agriqual.co.th",
      standards: [
        { label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี", certNo: "STD-2567-003" },
        { label: "มกษ. 9035-2563 การปฏิบัติที่ดีสำหรับโรงคัดบรรจุผักและผลไม้สด", certNo: "STD-2567-004" },
      ],
      factoryLat: "13.7800", factoryLng: "100.5700",
    },
  },
};

// use bracket notation so replace_all won't affect this line
const appType = computed(() => {
  if (isEditMode.value) return editApplicationsMap[route.params.id]?.type ?? "register";
  return route.params["type"];
});

const typeTitles = {
  register: "คำขอขึ้นทะเบียน",
  scope: "คำขอเพิ่ม-ลด ขอบข่าย",
  amend: "คำขอแก้ไขทะเบียน",
  cancel: "คำขอยกเลิกทะเบียน",
};
const pageTitle = computed(() => {
  if (isEditMode.value) return `แก้ไขคำขอ ${route.params.id}`;
  return typeTitles[appType.value] ?? "ยื่นคำขอ CB";
});

const currentStep = ref(0);
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = computed(() =>
  appType.value === "cancel"
    ? [{ value: 0, title: "ข้อมูลรายละเอียด" }]
    : [{ value: 0, title: "ข้อมูลรายละเอียด" }, { value: 1, title: "ไฟล์แนบ" }]
);

const sessionStore = useSessionStore();


const form = reactive({
  requestType: "register",
  // ผู้ยื่น (Auto-fill จาก SSO)
  applicantNameTh: sessionStore.displayName || "นายสมชาย ใจดี",
  applicantHouseNo: "123",
  applicantMoo: "4",
  applicantAlley: "ซอยพหลโยธิน 5",
  applicantRoad: "ถนนพหลโยธิน",
  applicantTambol: "ลาดยาว",
  applicantDistrict: "จตุจักร",
  applicantProvince: "กรุงเทพมหานคร",
  applicantZipcode: "10900",
  applicantPhone: "02-123-4567",
  applicantFax: "02-123-4568",
  applicantEmail: sessionStore.loginName || "somchai.j@example.co.th",
  purpose: "register",
  // สถานประกอบการ (Auto-fill บางส่วนจาก DBD)
  companyNameTh: sessionStore.companyName || "บริษัท ไทยเซอร์ติฟาย จำกัด",
  companyNameEn: "THAI CERTIFY CO., LTD.",
  houseNo: "88",
  alley: "ซอยลาดพร้าว 101",
  road: "ถนนลาดพร้าว",
  tambol: "คลองจั่น",
  district: "บางกะปิ",
  province: "กรุงเทพมหานคร",
  zipcode: "10240",
  houseNoEn: "88",
  alleyEn: "Soi Lat Phrao 101",
  roadEn: "Lat Phrao Road",
  tambolEn: "Khlong Chan",
  districtEn: "Bang Kapi",
  provinceEn: "Bangkok",
  zipcodeEn: "10240",
  companyPhone: "02-555-1234",
  companyFax: "",
  companyEmail: "info@thaicertify.co.th",
  standards: [],
  factoryLat: "",
  factoryLng: "",
  cancelReason: "",
});


// ─── Certificate Search (scope/amend/cancel) ───
const certSearchNo = ref("");
const certSearchLoading = ref(false);
const certSearchResult = ref(null);
const certSearchNotFound = ref(false);
const certSelected = ref(null);
const viewCertDialog = ref(false);


const certMockDB = {
  "CB-2568-00123": {
    certNo: "CB-2568-00123",
    issuedDate: "01/01/2568",
    expiryDate: "31/12/2570",
    isExpired: false,
    cbName: "บริษัท ไทยเซอร์ติฟาย จำกัด",
    houseNo: "88", alley: "ซอยลาดพร้าว 101", road: "ถนนลาดพร้าว",
    tambol: "คลองจั่น", district: "บางกะปิ", province: "กรุงเทพมหานคร", zipcode: "10240",
    standards: [
      { label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี", certNo: "STD-2568-001" },
      { label: "มกษ. 9035-2563 การปฏิบัติที่ดีสำหรับโรงคัดบรรจุผักและผลไม้สด", certNo: "STD-2568-002" },
    ],
  },
  "CB-2567-00234": {
    certNo: "CB-2567-00234",
    issuedDate: "15/06/2567",
    expiryDate: "14/06/2567",
    isExpired: true,
    cbName: "บริษัท สยามแล็บ จำกัด",
    houseNo: "12/3", alley: "", road: "ถนนสุขุมวิท",
    tambol: "คลองเตย", district: "คลองเตย", province: "กรุงเทพมหานคร", zipcode: "10110",
    standards: [],
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

function selectCert() {
  if (!certSearchResult.value) return;
  certSelected.value = { ...certSearchResult.value };
  certSearchResult.value = null;
  // Reset scope state — pre-fill with current cert standards
  form.standards = (certSelected.value?.standards ?? []).map((s) => ({ ...s }));
  // Reset amend state
  amendFields.value = [];
  amendNewValues.expire_date.value = "";
  expireDateObj.value = null;
  // Pre-fill ค่าใหม่จาก DBD ปัจจุบัน
  amendNewValues.company_name.nameTh = form.companyNameTh;
  amendNewValues.company_name.nameEn = form.companyNameEn;
  amendNewValues.address.houseNo = form.houseNo;
  amendNewValues.address.alley = form.alley;
  amendNewValues.address.road = form.road;
  amendNewValues.address.tambol = form.tambol;
  amendNewValues.address.district = form.district;
  amendNewValues.address.province = form.province;
  amendNewValues.address.zipcode = form.zipcode;
  amendNewValues.address.houseNoEn = form.houseNoEn;
  amendNewValues.address.alleyEn = form.alleyEn;
  amendNewValues.address.roadEn = form.roadEn;
  amendNewValues.address.tambolEn = form.tambolEn;
  amendNewValues.address.districtEn = form.districtEn;
  amendNewValues.address.provinceEn = form.provinceEn;
}

// ─── Amendment ───
const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const amendFields = ref([]);
const expireDateMenu = ref(false);
const expireDateObj = ref(null);

const amendNewValues = reactive({
  company_name: { nameTh: "", nameEn: "" },
  expire_date: { value: "" },
  address: {
    houseNo: "", alley: "", road: "", tambol: "", district: "", province: "", zipcode: "",
    houseNoEn: "", alleyEn: "", roadEn: "", tambolEn: "", districtEn: "", provinceEn: "",
  },
});

const amendItems = [
  { value: "company_name", label: "ชื่อสถานประกอบการ", labelEn: "Company Name", source: "Auto-fill จาก DBD", inputType: "company_name" },
  { value: "address", label: "ที่อยู่สถานประกอบการ", labelEn: "Company Address", source: "Auto-fill จาก DBD", inputType: "address" },
  { value: "expire_date", label: "วันหมดอายุ", labelEn: "Expire Date", source: null, inputType: "expire_date" },
];

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

const stdOptions = [
  { value: "9070-2566", label: "มกษ. 9070-2566 หลักปฏิบัติในการตรวจและรับผลทุเรียนสำหรับโรงรวบรวมและโรงคัดบรรจุ" },
  { value: "9023-2564", label: "มกษ. 9023-2564 หลักการทั่วไปด้านสุขลักษณะอาหาร : การปฏิบัติทางสุขลักษณะที่ดี" },
  { value: "9024-2564", label: "มกษ. 9024-2564 ระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุมและแนวทางในการนำไปใช้" },
  { value: "9035-2563", label: "มกษ. 9035-2563 การปฏิบัติที่ดีสำหรับโรงคัดบรรจุผักและผลไม้สด" },
  { value: "9047-2560", label: "มกษ. 9047-2560 การปฏิบัติที่ดีสำหรับโรงรวบรวมผักและผลไม้สด" },
  { value: "9046-2560", label: "มกษ. 9046-2560 การปฏิบัติที่ดีสำหรับการผลิตทุเรียนแช่เยือกแข็ง" },
  { value: "9041-2557", label: "มกษ. 9041-2557 หลักปฏิบัติสำหรับการผลิตสินค้าเกษตรแช่เยือกแข็ง" },
  { value: "1004-2557", label: "มกษ. 1004-2557 หลักปฏิบัติสำหรับกระบวนการรมผลไม้สดด้วยก๊าซซัลเฟอร์ไดออกไซด์" },
  { value: "9039-2556", label: "มกษ. 9039-2556 การปฏิบัติที่ดีสำหรับการผลิตผักและผลไม้สดตัดแต่งพร้อมบริโภค" },
];

const stdHeaders = [
  { title: "ลำดับ", key: "index", width: "60px", sortable: false },
  { title: "ขอบข่ายมาตรฐาน", key: "label", sortable: false },
  { title: "เลขที่ใบรับรองมาตรฐาน", key: "certNo", width: "200px", sortable: false },
  { title: "จัดการ", key: "actions", width: "80px", sortable: false, align: "center" },
];

const stdDialog = ref(false);
const stdEditIndex = ref(-1);
const stdForm = reactive({ standard: "", certNo: "" });

function openStdDialog(index = -1) {
  stdEditIndex.value = index;
  if (index === -1) {
    stdForm.standard = "";
    stdForm.certNo = "";
  } else {
    const item = form.standards[index];
    // match value from stdOptions by label
    const opt = stdOptions.find((o) => o.label === item.label);
    stdForm.standard = opt?.value ?? "";
    stdForm.certNo = item.certNo;
  }
  stdDialog.value = true;
}

function addStandard() {
  if (!stdForm.standard) return;
  const opt = stdOptions.find((o) => o.value === stdForm.standard);
  const entry = { label: opt?.label ?? stdForm.standard, certNo: stdForm.certNo };
  if (stdEditIndex.value === -1) {
    form.standards.push(entry);
  } else {
    form.standards.splice(stdEditIndex.value, 1, entry);
  }
  stdDialog.value = false;
}

function removeStandard(index) {
  form.standards.splice(index, 1);
}

const files = reactive({});
function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function mockUpload(key) {
  files[key] = "เอกสาร.pdf";
}

const docExtra = [
  { key: "office_map", label: "แผนที่ตั้งสำนักงานใหญ่และสำนักงานสาขาในประเทศไทยที่ขอการรับรองโดยละเอียด" },
  {
    key: "accred_cert",
    label:
      "ใบรับรองระบบงาน (Accreditation Certificate) จากสำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)",
  },
  {
    key: "license",
    label: "สำเนาหลักฐานการอนุญาตเป็นผู้ประกอบการตรวจสอบมาตรฐาน",
    note: "กรณีขอข่ายที่ขอขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืชเป็นมาตรฐานกระทรวงเกษตรและสหกรณ์ ผู้ยื่นคำขอต้องได้รับอนุญาตเป็นผู้ประกอบการตรวจสอบมาตรฐาน ตามความในพระราชบัญญัติมาตรฐานสินค้าเกษตร พ.ศ. 2551"
  },
  { key: "auditor_list", label: "ทะเบียนรายชื่อผู้ตรวจประเมินของหน่วยรับรองโรงงานผลิตสินค้าพืช พร้อมประวัติการตรวจประเมินโรงงานผลิตสินค้าพืช" },
  { key: "branch_addr", label: "ที่อยู่และรายชื่อสาขาที่อยู่ในประเทศไทย" },
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

// ─── Leaflet Map ───
const initialPos = [13.782674, 100.54628];
let map = null;
let marker = null;

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
  map = L.map("leaflet-map").setView(initialPos, 17);
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
    marker = L.marker([lat, lng], { draggable: true, icon: redIcon }).addTo(map);
    marker.on("dragend", (e) => {
      const newPos = e.target.getLatLng();
      form.factoryLat = newPos.lat.toFixed(6);
      form.factoryLng = newPos.lng.toFixed(6);
    });
  }
};

const updateMapFromInputs = () => {
  if (!form.factoryLat || !form.factoryLng) {
    if (map) {
      map.flyTo(initialPos, 17);
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
    }
    return;
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
        marker = L.marker(newPos, { draggable: true, icon: redIcon }).addTo(map);
        marker.on("dragend", (e) => {
          const pos = e.target.getLatLng();
          form.factoryLat = pos.lat.toFixed(6);
          form.factoryLng = pos.lng.toFixed(6);
        });
      }
    }
  }
};

watch(
  [() => form.factoryLat, () => form.factoryLng],
  ([lat, lng]) => {
    if (!lat || !lng) {
      updateMapFromInputs();
    } else {
      clearTimeout(window.mapTimeout);
      window.mapTimeout = setTimeout(() => {
        updateMapFromInputs();
      }, 800);
    }
  },
);

onMounted(() => {
  if (isEditMode.value) {
    const mockData = editApplicationsMap[route.params.id]?.formData;
    if (mockData) Object.assign(form, mockData);
  }
  nextTick(() => {
    if (currentStep.value === 0) initLeafletMap();
  });
});
</script>


<style scoped>
/* Document / upload row */
.item-row {
  background: rgba(var(--v-theme-cb-user), 0.03);
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-cb-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-cb-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-cb-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-cb-user)) !important;
}
.amend-item {
  padding: 4px 12px 8px 12px;
  transition: background 0.15s;
}
.amend-item--active {
  background: rgba(var(--v-theme-cb-user), 0.04);
  border-radius: 8px;
}
.amend-detail-field {
  padding: 8px 4px 4px 32px;
}
.confirm-ring {
  background: rgba(var(--v-theme-cb-user), 0.1);
}
</style>
