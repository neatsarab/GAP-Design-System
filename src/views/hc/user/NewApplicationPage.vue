<template>
  <div style="--v-theme-primary: var(--v-theme-hc-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goBack"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          กรอกข้อมูลให้ครบถ้วนแล้วยืนยันคำขอ
        </p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="mb-6" border>
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
                    ? 'text-hc-user font-weight-bold'
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

    <!-- ══════════════════════════════════════
         STEP 0: ข้อมูลผู้ส่งออก
    ══════════════════════════════════════ -->
    <template v-if="currentStep === 0">
      <!-- ข้อมูลผู้ยื่นคำขอ -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-user" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลผู้ยื่นคำขอ</span
          >
          <v-chip size="x-small" color="hc-user" variant="tonal" class="ml-1"
            >Auto-fill จาก SSO</v-chip
          >
          <v-spacer />
          <v-btn
            size="x-small"
            variant="tonal"
            color="hc-user"
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
                <div>จังหวัด</div>
                <div class="field-label-en">Province</div>
              </div>
              <v-autocomplete
                density="compact"
                v-model="form.applicantProvince"
                :items="thaiProvinces"
                hide-details
                readonly
                class="field-readonly"
                no-data-text="ไม่พบข้อมูล"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>อำเภอ/เขต</div>
                <div class="field-label-en">District</div>
              </div>
              <v-autocomplete
                density="compact"
                v-model="form.applicantDistrict"
                :items="getDistricts(form.applicantProvince)"
                hide-details
                readonly
                class="field-readonly"
                no-data-text="เลือกจังหวัดก่อน"
              />
            </v-col>
            <v-col cols="12" md="3">
              <div class="field-label">
                <div>ตำบล/แขวง</div>
                <div class="field-label-en">Sub-district</div>
              </div>
              <v-autocomplete
                density="compact"
                v-model="form.applicantTambol"
                :items="
                  getTambols(form.applicantProvince, form.applicantDistrict)
                "
                hide-details
                readonly
                class="field-readonly"
                no-data-text="เลือกอำเภอก่อน"
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
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลสถานประกอบการ</span
          >
          <v-chip size="x-small" color="hc-user" variant="tonal" class="ml-1"
            >Auto-fill บางส่วนจาก DBD</v-chip
          >
          <v-spacer />
          <v-btn
            size="x-small"
            variant="tonal"
            color="hc-user"
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
                <div>ตำบล / แขวง</div>
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

      <!-- ข้อมูลทั่วไป -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building-columns" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ข้อมูลทั่วไป</span>
        </div>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col cols="12" sm="8">
              <div class="field-label">
                <div>สถานที่รับใบรับรอง <span class="req">*</span></div>
                <div class="field-label-en">
                  Certificate collection location
                </div>
              </div>
              <v-autocomplete
                v-model="form.agency"
                :items="agencies"
                variant="outlined"
                density="compact"
                rounded="lg"
                placeholder="เลือกหน่วยงาน"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2">
                <div>
                  ประเภททะเบียนที่ใช้ในการส่งออก <span class="req">*</span>
                </div>
                <div class="field-label-en">Registry Type</div>
              </div>
              <v-radio-group v-model="form.registryType" inline hide-details>
                <v-radio
                  label="มี DOA และ GAP"
                  value="has_doa_gap"
                  color="hc-user"
                  class="pr-5"
                />
                <v-radio
                  label="ไม่มี DOA และ/หรือ GAP"
                  value="no_doa_gap"
                  color="hc-user"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label mt-2">
                <div>ระยะเวลาสำหรับส่งออก <span class="req">*</span></div>
                <div class="field-label-en">Export Duration</div>
              </div>
              <v-select
                v-model="form.exportDuration"
                :items="durationOptions"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                rounded="lg"
                placeholder="เลือกระยะเวลา"
                hide-details
                @update:model-value="onDurationChange"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label mt-2">
                <div>วันที่เริ่มต้น <span class="req">*</span></div>
                <div class="field-label-en">Start Date</div>
              </div>
              <v-menu
                v-model="dateStartMenu"
                :close-on-content-click="false"
                location="bottom start"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="form.dateStart"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    placeholder="วว/ดด/ปปปป"
                    append-inner-icon="fas fa-calendar-days"
                  />
                </template>
                <v-date-picker
                  v-model="dateStartObj"
                  color="hc-user"
                  hide-header
                  show-adjacent-months
                  locale="th"
                  @update:model-value="dateStartMenu = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label mt-2">
                <div>วันที่สิ้นสุด <span class="req">*</span></div>
                <div class="field-label-en">End Date</div>
              </div>
              <v-menu
                v-model="dateEndMenu"
                :close-on-content-click="false"
                location="bottom start"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="form.dateEnd"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    placeholder="วว/ดด/ปปปป"
                    append-inner-icon="fas fa-calendar-days"
                  />
                </template>
                <v-date-picker
                  v-model="dateEndObj"
                  color="hc-user"
                  hide-header
                  show-adjacent-months
                  locale="th"
                  @update:model-value="dateEndMenu = false"
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ตารางข้อมูลผู้ส่งออก -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-table-list" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ส่งออก</span>
          <v-spacer />
          <v-btn
            color="hc-user"
            size="small"
            variant="tonal"
            prepend-icon="fas fa-plus"
            @click="openExporterDialog()"
            >เพิ่มข้อมูล</v-btn
          >
        </div>
        <v-card-text class="pt-3 px-0">
          <v-table v-if="form.exporters.length > 0" density="comfortable">
            <thead>
              <tr>
                <th class="px-4">เลขทะเบียนผู้ส่งออก</th>
                <th>เลขทะเบียน DOA</th>
                <th>เลขใบรับรอง GAP</th>
                <th>ประเทศขอบข่าย</th>
                <th>วันที่ขึ้นทะเบียน</th>
                <th>วันหมดอายุ</th>
                <th style="width: 90px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(exp, idx) in form.exporters" :key="idx">
                <td class="text-body-2 px-4">
                  <div class="font-weight-bold text-export-user">
                    {{ exp.regNo }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ exp.companyName }}
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column align-start ga-1 py-1">
                    <v-chip
                      v-for="f in exp.factories"
                      :key="f.doaNo"
                      size="x-small"
                      variant="tonal"
                      color="doa-user"
                      label
                      >{{ f.doaNo }}</v-chip
                    >
                    <span v-if="!exp.factories?.length" class="text-body-2"
                      >—</span
                    >
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column align-start ga-1 py-1">
                    <v-chip
                      v-for="g in exp.gaps"
                      :key="g.gapCode"
                      size="x-small"
                      variant="tonal"
                      color="gap-user"
                      label
                      >{{ g.gapCode }}</v-chip
                    >
                    <span v-if="!exp.gaps?.length" class="text-body-2">—</span>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-wrap ga-1 py-1">
                    <template v-if="exp.scopeCountry">
                      <v-chip
                        v-for="country in exp.scopeCountry.split(',')"
                        :key="country"
                        size="x-small"
                        variant="tonal"
                        color="blue-grey"
                        label
                        >{{ country.trim() }}</v-chip
                      >
                    </template>
                    <span v-else class="text-body-2">—</span>
                  </div>
                </td>
                <td class="text-body-2">{{ exp.regDate }}</td>
                <td class="text-body-2">{{ exp.expDate }}</td>
                <td>
                  <div class="d-flex align-center">
                    <v-btn
                      icon="fas fa-pen"
                      size="x-small"
                      variant="text"
                      color="warning"
                      @click="openExporterDialog(idx)"
                    />
                    <v-btn
                      icon="fas fa-trash"
                      size="x-small"
                      variant="text"
                      color="error"
                      @click="removeExporter(idx)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-center text-medium-emphasis pa-8 text-body-2">
            ยังไม่มีข้อมูลผู้ส่งออก กดปุ่ม "เพิ่มข้อมูล" เพื่อเพิ่มรายการ
          </div>
          <p v-if="exporterError" class="text-error text-caption mt-1 px-4">
            กรุณาเพิ่มข้อมูลผู้ส่งออกอย่างน้อย 1 รายการ
          </p>
        </v-card-text>
      </v-card>

      <!-- การส่งตรวจ Lab -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-flask" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">การส่งตรวจ Lab</span>
        </div>
        <v-card-text class="pt-4">
          <v-radio-group v-model="form.labTest" inline hide-details>
            <v-radio label="ไม่ส่ง Lab" value="no" color="hc-user" />
            <v-radio label="ส่ง Lab" value="yes" color="hc-user" />
          </v-radio-group>
          <v-expand-transition>
            <v-row v-if="form.labTest === 'yes'" dense class="mt-4">
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ห้องปฏิบัติการ <span class="req">*</span></div>
                  <div class="field-label-en">Laboratory</div>
                </div>
                <v-autocomplete
                  v-model="form.labName"
                  :items="laboratories"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  placeholder="เลือกห้องปฏิบัติการ"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>เลือกสินค้า <span class="req">*</span></div>
                  <div class="field-label-en">Product</div>
                </div>
                <v-autocomplete
                  v-model="form.labProduct"
                  :items="cropOptions"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  placeholder="เลือกสินค้า"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </template>

    <!-- ══════════════════════════════════════
         (ต่อ) ข้อมูลรายละเอียด
    ══════════════════════════════════════ -->
    <template v-if="currentStep === 0">
      <!-- ข้อมูลผู้ประกอบการโรงคัดบรรจุ (Read Only จากทะเบียน DOA) -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-warehouse" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลผู้ประกอบการโรงคัดบรรจุ</span
          >
          <v-chip size="x-small" color="grey" variant="tonal" class="ml-2"
            >อ่านอย่างเดียว</v-chip
          >
          <v-chip size="x-small" color="hc-user" variant="tonal" class="ml-1">
            {{ doaFactories.length }} รายการ
          </v-chip>
        </div>
        <v-card-text class="pa-0">
          <!-- ไม่มีข้อมูล -->
          <div
            v-if="doaFactories.length === 0"
            class="text-center text-medium-emphasis pa-8 text-body-2"
          >
            ยังไม่มีข้อมูล — กรุณาเพิ่มข้อมูลผู้ส่งออกก่อน
          </div>

          <!-- รายการโรงงาน -->
          <template v-else>
            <div
              v-for="(factory, idx) in doaFactories"
              :key="factory.doaNo"
              class="px-4 py-3"
              :class="{ 'border-b': idx < doaFactories.length - 1 }"
            >
              <div class="d-flex align-start justify-space-between ga-3">
                <!-- ข้อมูลสรุป -->
                <div class="d-flex align-start ga-3 flex-grow-1">
                  <v-chip
                    size="x-small"
                    color="hc-user"
                    variant="tonal"
                    label
                    class="mt-1"
                  >
                    {{ factory.doaNo }}
                  </v-chip>
                  <div>
                    <div class="text-body-2 font-weight-medium">
                      {{ factory.factoryName }}
                    </div>
                    <div class="d-flex align-center ga-2 mt-1">
                      <v-chip
                        size="x-small"
                        color="success"
                        variant="tonal"
                        label
                      >
                        {{ factory.plantType }}
                      </v-chip>
                      <span class="text-caption text-medium-emphasis">
                        {{ factory.operatorProvince || "—" }}
                      </span>
                      <span class="text-caption text-medium-emphasis">
                        · หมดอายุ {{ factory.expDate }}
                      </span>
                    </div>
                  </div>
                </div>
                <!-- ปุ่มดูรายละเอียด -->
                <v-btn
                  size="small"
                  variant="tonal"
                  color="hc-user"
                  prepend-icon="fas fa-eye"
                  @click="openFactoryDetail(factory)"
                  >ดูรายละเอียด</v-btn
                >
              </div>
            </div>
          </template>
        </v-card-text>
      </v-card>

      <!-- รายการสิ่งที่ต้องระบุในใบรับรอง -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-bacterium" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >รายการสิ่งที่ต้องการให้ระบุในใบรับรอง</span
          >
        </div>
        <v-card-text class="pt-4">
          <div class="field-label mb-2">
            <div>ชื่อเชื้อจุลินทรีย์หรือสิ่งอื่นใดที่เป็นอันตรายต่อมนุษย์</div>
            <div class="field-label-en">Pathogen / Hazard</div>
          </div>
          <v-autocomplete
            v-model="form.pathogens"
            :items="pathogenOptions"
            variant="outlined"
            density="compact"
            rounded="lg"
            multiple
            chips
            closable-chips
            placeholder="เลือกรายการ (เลือกได้หลายรายการ)"
            hide-details
          />
        </v-card-text>
      </v-card>

      <!-- รายละเอียดการส่งออกสินค้า -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-file-export" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >รายละเอียดการส่งออกสินค้า</span
          >
          <v-spacer />
          <v-btn
            color="hc-user"
            size="small"
            variant="tonal"
            prepend-icon="fas fa-plus"
            @click="openDetailDialog()"
            >เพิ่มข้อมูล</v-btn
          >
        </div>
        <v-card-text class="pt-3 px-0">
          <v-table v-if="form.exportDetails.length > 0" density="comfortable">
            <thead>
              <tr>
                <th class="px-4" style="width: 50px">ลำดับ</th>
                <th>ประเภทใบรับรอง</th>
                <th>เลขทะเบียนผู้ส่งออก</th>
                <th>ชื่อผู้ส่งออก</th>
                <th>น้ำหนัก (กก.)</th>
                <th style="width: 90px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, idx) in form.exportDetails" :key="idx">
                <td class="text-body-2 px-4">{{ idx + 1 }}</td>
                <td class="text-body-2">
                  {{
                    certTypes.find((c) => c.value === d.certType)?.label ||
                    d.certType
                  }}
                </td>
                <td class="text-body-2 font-weight-bold text-export-user">
                  {{ d.exporterRegNo }}
                </td>
                <td class="text-body-2">{{ d.exporterName }}</td>
                <td class="text-body-2">
                  {{
                    d.shipments
                      .reduce((sum, s) => sum + (Number(s.weight) || 0), 0)
                      .toLocaleString()
                  }}
                </td>
                <td>
                  <div class="d-flex align-center">
                    <v-btn
                      icon="fas fa-pen"
                      size="x-small"
                      variant="text"
                      color="warning"
                      @click="openDetailDialog(idx)"
                    />
                    <v-btn
                      icon="fas fa-trash"
                      size="x-small"
                      variant="text"
                      color="error"
                      @click="removeDetail(idx)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-center text-medium-emphasis pa-8 text-body-2">
            ยังไม่มีรายละเอียดการส่งออก กดปุ่ม "เพิ่มข้อมูล" เพื่อเพิ่มรายการ
          </div>
          <p v-if="detailError" class="text-error text-caption mt-1 px-4">
            กรุณาเพิ่มรายละเอียดการส่งออกอย่างน้อย 1 รายการ
          </p>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลรวมสินค้า -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-boxes-stacked" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">ข้อมูลรวมสินค้า</span>
        </div>
        <v-card-text class="pt-4">
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>น้ำหนักรวม (กก.)</div>
                <div class="field-label-en">Total Net Weight (kg.)</div>
              </div>
              <v-text-field
                :model-value="totalWeightAll.toLocaleString()"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                readonly
                class="field-readonly"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>มูลค่ารวม (บาท)</div>
                <div class="field-label-en">Total Value (THB)</div>
              </div>
              <v-text-field
                v-model="form.totalValue"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="0.00"
                type="number"
                min="0"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- ══════════════════════════════════════
         STEP 1: ไฟล์แนบ
    ══════════════════════════════════════ -->
    <template v-if="currentStep === 1">
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบคำขอ</span>
        </div>
        <v-card-text class="pt-5">
          <!-- <p class="text-body-2 text-medium-emphasis mb-4">
            รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 10 MB ต่อไฟล์
          </p> -->
          <v-row dense>
            <v-col v-for="doc in docDefs" :key="doc.key" cols="12">
              <div class="item-row rounded-lg pa-3 mb-2">
                <v-row align="center" no-gutters>
                  <v-col>
                    <div class="text-body-2 font-weight-medium">
                      {{ doc.label }}
                    </div>
                    <v-alert
                      v-if="doc.key === 'juristic'"
                      type="warning"
                      density="compact"
                      variant="tonal"
                      class="mt-2 text-caption"
                      icon="fas fa-triangle-exclamation"
                    >
                      เอกสารต้องออกไม่เกิน 6 เดือน
                    </v-alert>
                    <div
                      v-if="doc.key === 'other' && uploadedFiles[doc.key]"
                      class="mt-2"
                    >
                      <v-text-field
                        v-model="otherDocDescription"
                        variant="outlined"
                        density="compact"
                        rounded="lg"
                        placeholder="ระบุรายละเอียดเอกสาร"
                        hide-details
                        style="max-width: 360px"
                      />
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
                      :color="uploadedFiles[doc.key] ? 'warning' : 'hc-user'"
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
        <v-btn variant="tonal" color="grey" @click="goBack">ยกเลิก</v-btn>
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
          color="hc-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="hc-user"
          append-icon="fas fa-arrow-right"
          @click="nextStep"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="hc-user"
          prepend-icon="fas fa-paper-plane"
          @click="openConfirmDialog"
          >ยืนยันคำขอ</v-btn
        >
      </div>
    </div>

    <!-- ─── Dialog: เพิ่ม/แก้ไขผู้ส่งออก ─── -->
    <v-dialog v-model="exporterDialog" max-width="640" scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-subtitle-1 font-weight-bold">
          {{
            editExporterIdx === null
              ? "เพิ่มข้อมูลผู้ส่งออก"
              : "แก้ไขข้อมูลผู้ส่งออก"
          }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <!-- ค้นหาทะเบียนผู้ส่งออก -->
          <div class="field-label mb-1">
            เลขทะเบียนผู้ส่งออก <span class="req">*</span>
            <div class="field-label-en">Exporter Registration No.</div>
          </div>
          <v-row dense align="center">
            <v-col cols="12" sm="7">
              <v-text-field
                v-model="expSearchNo"
                density="compact"
                variant="outlined"
                rounded="lg"
                placeholder="เช่น EXP-2568-00123"
                prepend-inner-icon="fas fa-certificate"
                hide-details
                @keyup.enter="searchExportReg"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="hc-user"
                variant="tonal"
                prepend-icon="fas fa-magnifying-glass"
                :loading="expSearchLoading"
                @click="searchExportReg"
                >ค้นหา</v-btn
              >
            </v-col>
          </v-row>

          <!-- ไม่พบ -->
          <v-alert
            v-if="expSearchNotFound"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-3"
            prepend-icon="fas fa-circle-xmark"
          >
            ไม่พบทะเบียนเลขที่ "{{ expSearchNo }}" กรุณาตรวจสอบอีกครั้ง
          </v-alert>

          <!-- ผลการค้นหา -->
          <v-card
            v-if="expSearchResult && !expSelected"
            elevation="0"
            rounded="lg"
            class="mt-4"
            :style="
              expSearchResult.isExpired
                ? 'background:rgba(var(--v-theme-error),0.08);border:1px solid rgba(var(--v-theme-error),0.25)'
                : 'background:rgba(var(--v-theme-success),0.06);border:1px solid rgba(var(--v-theme-success),0.2)'
            "
          >
            <v-card-text class="pa-4">
              <v-row align="center" no-gutters>
                <v-col>
                  <div class="text-caption text-medium-emphasis mb-1">
                    เลขทะเบียน
                  </div>
                  <div class="text-body-1 font-weight-bold text-export-user">
                    {{ expSearchResult.regNo }}
                  </div>
                  <div class="text-body-2 mt-1">
                    {{ expSearchResult.companyName }}
                  </div>
                  <div class="d-flex align-center ga-2 mt-2">
                    <v-chip
                      size="x-small"
                      :color="expSearchResult.isExpired ? 'error' : 'success'"
                      variant="tonal"
                    >
                      {{ expSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis"
                      >หมดอายุ: {{ expSearchResult.expDate }}</span
                    >
                  </div>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column ga-2 pl-4">
                  <v-btn
                    size="small"
                    color="hc-user"
                    variant="tonal"
                    prepend-icon="fas fa-eye"
                    @click="viewExpRegDialog = true"
                    >ดูรายละเอียด</v-btn
                  >
                  <v-btn
                    size="small"
                    color="hc-user"
                    variant="flat"
                    prepend-icon="fas fa-check"
                    :disabled="expSearchResult.isExpired"
                    @click="selectExportReg"
                    >เลือกทะเบียนนี้</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- เลือกแล้ว -->
          <div
            v-if="expSelected"
            class="mt-4 d-flex align-center ga-2 flex-wrap"
          >
            <v-icon icon="fas fa-circle-check" color="success" size="16" />
            <span class="text-body-2 font-weight-medium text-success"
              >เลือกทะเบียน:</span
            >
            <v-chip color="hc-user" variant="tonal" size="small">
              {{ expSelected.regNo }} — {{ expSelected.companyName }}
            </v-chip>
            <v-btn
              icon="fas fa-xmark"
              size="x-small"
              variant="text"
              color="grey"
              @click="clearExpSelected"
            />
          </div>

          <!-- เลือกโรงงาน + GAP (แสดงเมื่อเลือกทะเบียนแล้ว) -->
          <template v-if="expSelected">
            <v-divider class="my-4" />

            <!-- โรงงานผลิตสินค้าพืช -->
            <div class="field-label mb-1 mt-1">
              โรงงานผลิตสินค้าพืช <span class="req">*</span>
              <div class="field-label-en">Plant Production Factory (DOA)</div>
            </div>
            <v-autocomplete
              v-model="selectedFactory"
              :items="expSelected.factories"
              item-title="factoryLabel"
              item-value="doaNo"
              variant="outlined"
              density="compact"
              rounded="lg"
              placeholder="เลือกโรงงาน"
              hide-details
              return-object
              no-data-text="ไม่มีข้อมูลโรงงานในทะเบียนนี้"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend="{ isSelected }">
                    <v-radio-btn :model-value="isSelected" color="hc-user" />
                  </template>
                  <template #subtitle>
                    <span class="text-caption"
                      >{{ item.raw.doaNo }} · {{ item.raw.plantType }} · หมดอายุ
                      {{ item.raw.expDate }}</span
                    >
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>

            <!-- แหล่งผลิต GAP -->
            <div class="field-label mb-1 mt-4">
              แหล่งผลิตพืชที่ได้การรับรอง GAP <span class="req">*</span>
              <div class="field-label-en">GAP Certified Production Site</div>
            </div>
            <v-autocomplete
              v-model="selectedGap"
              :items="expSelected.gaps"
              item-title="gapLabel"
              item-value="gapCode"
              variant="outlined"
              density="compact"
              rounded="lg"
              placeholder="เลือกแหล่งผลิต GAP (เลือกได้มากกว่า 1)"
              hide-details
              return-object
              multiple
              chips
              closable-chips
              no-data-text="ไม่มีข้อมูล GAP ในทะเบียนนี้"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend="{ isSelected }">
                    <v-checkbox-btn :model-value="isSelected" color="hc-user" />
                  </template>
                  <template #subtitle>
                    <span class="text-caption"
                      >{{ item.raw.gapCode }} · {{ item.raw.plantType }} ·
                      หมดอายุ {{ item.raw.expDate }}</span
                    >
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>

            <!-- สรุปข้อมูลที่จะบันทึก -->
            <v-card
              elevation="0"
              color="surface-variant"
              rounded="lg"
              class="mt-4 pa-3"
              v-if="selectedFactory"
            >
              <div
                class="text-caption text-medium-emphasis font-weight-bold mb-3"
              >
                สรุปข้อมูลที่จะเพิ่ม
              </div>

              <!-- ข้อมูลทะเบียน EXP -->
              <v-row dense class="mb-1">
                <v-col cols="12" sm="5">
                  <div class="text-caption text-medium-emphasis mb-1">
                    เลขทะเบียนผู้ส่งออก
                  </div>
                  <v-chip
                    color="export-user"
                    variant="tonal"
                    size="small"
                    label
                  >
                    {{ expSelected.regNo }}
                  </v-chip>
                </v-col>
                <v-col cols="12" sm="7">
                  <div class="text-caption text-medium-emphasis mb-1">
                    ชื่อผู้ส่งออก
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ expSelected.companyName }}
                  </div>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <div class="text-caption text-medium-emphasis mb-1">
                    ประเทศขอบข่าย
                  </div>
                  <div class="d-flex flex-wrap ga-1">
                    <template v-if="expSelected.scopeCountry">
                      <v-chip
                        v-for="country in expSelected.scopeCountry.split(',')"
                        :key="country"
                        size="x-small"
                        variant="tonal"
                        color="blue-grey"
                        label
                        >{{ country.trim() }}</v-chip
                      >
                    </template>
                    <span v-else class="text-body-2">—</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" class="mt-2">
                  <div class="text-caption text-medium-emphasis mb-1">
                    วันที่ได้รับทะเบียน
                  </div>
                  <div class="d-flex align-center ga-1">
                    <v-icon
                      icon="fas fa-calendar-check"
                      size="12"
                      color="success"
                    />
                    <span class="text-body-2">{{
                      expSelected.regDate || "—"
                    }}</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" class="mt-2">
                  <div class="text-caption text-medium-emphasis mb-1">
                    วันหมดอายุทะเบียน
                  </div>
                  <div class="d-flex align-center ga-1">
                    <v-icon
                      icon="fas fa-calendar-xmark"
                      size="12"
                      color="error"
                    />
                    <span class="text-body-2">{{
                      expSelected.expDate || "—"
                    }}</span>
                  </div>
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <!-- โรงงานที่เลือก -->
              <div class="text-caption text-medium-emphasis mb-1">
                โรงงานผลิตสินค้าพืช
              </div>
              <div class="d-flex flex-wrap ga-1 mb-3">
                <v-chip
                  v-if="selectedFactory"
                  size="small"
                  variant="tonal"
                  color="doa-user"
                  label
                >
                  <span class="font-weight-medium">{{
                    selectedFactory.doaNo
                  }}</span>
                  <span class="text-medium-emphasis ml-1"
                    >· {{ selectedFactory.factoryName }}</span
                  >
                </v-chip>
              </div>

              <!-- GAP ที่เลือก -->
              <template v-if="selectedGap.length">
                <div class="text-caption text-medium-emphasis mb-1">
                  แหล่งผลิตพืชที่ได้การรับรอง GAP
                </div>
                <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    v-for="g in selectedGap"
                    :key="g.gapCode"
                    size="small"
                    variant="tonal"
                    color="gap-user"
                    label
                  >
                    <span class="font-weight-medium">{{ g.gapCode }}</span>
                    <span class="text-medium-emphasis ml-1"
                      >· {{ g.siteName }}</span
                    >
                  </v-chip>
                </div>
              </template>
            </v-card>
          </template>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 ga-2 justify-end">
          <v-btn variant="tonal" color="grey" @click="exporterDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="hc-user"
            :disabled="!expSelected || !selectedFactory"
            @click="saveExporter"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Dialog: รายละเอียดโรงงาน DOA ─── -->
    <v-dialog v-model="factoryDetailDialog" max-width="560" scrollable>
      <v-card rounded="xl" v-if="selectedFactoryDetail">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-warehouse" color="hc-user" size="16" />
          <span class="text-subtitle-1 font-weight-bold"
            >รายละเอียดโรงคัดบรรจุ</span
          >
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            @click="factoryDetailDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <!-- DOA + ชื่อโรงงาน -->
          <div class="d-flex align-center ga-2 mb-4">
            <v-chip color="hc-user" variant="tonal" label size="small">
              {{ selectedFactoryDetail.doaNo }}
            </v-chip>
            <span class="text-subtitle-2 font-weight-bold">{{
              selectedFactoryDetail.factoryName
            }}</span>
            <v-chip color="success" variant="tonal" label size="x-small">
              {{ selectedFactoryDetail.plantType }}
            </v-chip>
          </div>

          <!-- ผู้ประกอบการ -->
          <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
            ข้อมูลผู้ประกอบการ
          </div>
          <v-row dense class="mb-3">
            <v-col cols="12" sm="8">
              <div class="text-caption text-medium-emphasis">
                ชื่อผู้ประกอบการ
              </div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.operatorName || "—" }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis">ที่อยู่</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.operatorAddress || "—" }}
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-caption text-medium-emphasis">จังหวัด</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.operatorProvince || "—" }}
              </div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">รหัสไปรษณีย์</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.operatorZip || "—" }}
              </div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">โทรศัพท์</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.operatorPhone || "—" }}
              </div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">โทรสาร</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.operatorFax || "—" }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-3" />

          <!-- โรงคัดบรรจุ -->
          <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
            ข้อมูลโรงคัดบรรจุ
          </div>
          <v-row dense>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">
                รหัสโรงคัดบรรจุ
              </div>
              <div class="text-body-2 font-weight-medium">
                {{ selectedFactoryDetail.packingCode || "—" }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis">
                ที่อยู่โรงคัดบรรจุ
              </div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.packingAddress || "—" }}
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-caption text-medium-emphasis">จังหวัด</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.packingProvince || "—" }}
              </div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">รหัสไปรษณีย์</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.packingZip || "—" }}
              </div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">โทรศัพท์</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.packingPhone || "—" }}
              </div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">โทรสาร</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.packingFax || "—" }}
              </div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-medium-emphasis">วันหมดอายุ</div>
              <div class="text-body-2">
                {{ selectedFactoryDetail.expDate || "—" }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn
            variant="tonal"
            color="grey"
            @click="factoryDetailDialog = false"
            >ปิด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Dialog: ดูรายละเอียดทะเบียน EXP ─── -->
    <v-dialog v-model="viewExpRegDialog" max-width="580" scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-certificate" color="hc-user" size="16" />
          <span class="text-subtitle-1 font-weight-bold"
            >รายละเอียดทะเบียนผู้ส่งออก</span
          >
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5" v-if="expSearchResult">
          <!-- ข้อมูลทะเบียน -->
          <div class="d-flex align-center ga-2 mb-4">
            <div>
              <div class="text-caption text-medium-emphasis">เลขทะเบียน</div>
              <div class="text-body-1 font-weight-bold text-export-user">
                {{ expSearchResult.regNo }}
              </div>
            </div>
            <v-spacer />
            <v-chip
              size="small"
              :color="expSearchResult.isExpired ? 'error' : 'success'"
              variant="tonal"
              >{{ expSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}</v-chip
            >
          </div>

          <v-row dense>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis">
                ชื่อบริษัท / ผู้ส่งออก
              </div>
              <div class="text-body-2 font-weight-medium">
                {{ expSearchResult.companyName }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis mt-2">
                วันที่ขึ้นทะเบียน
              </div>
              <div class="text-body-2">{{ expSearchResult.regDate }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis mt-2">
                วันหมดอายุ
              </div>
              <div
                class="text-body-2"
                :class="
                  expSearchResult.isExpired ? 'text-error font-weight-bold' : ''
                "
              >
                {{ expSearchResult.expDate }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- โรงงานผลิตสินค้าพืช -->
          <div
            class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-industry" color="hc-user" size="14" />
            โรงงานผลิตสินค้าพืช (DOA)
          </div>
          <v-table
            density="compact"
            class="rounded-lg border mb-4"
            v-if="expSearchResult.factories?.length"
          >
            <thead>
              <tr>
                <th>เลขทะเบียน DOA</th>
                <th>ชื่อโรงงาน</th>
                <th>ชนิดพืช</th>
                <th>หมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in expSearchResult.factories" :key="f.doaNo">
                <td class="text-body-2 font-weight-bold text-doa-user">
                  {{ f.doaNo }}
                </td>
                <td class="text-body-2">{{ f.factoryName }}</td>
                <td class="text-body-2">{{ f.plantType }}</td>
                <td class="text-body-2">{{ f.expDate }}</td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-body-2 text-medium-emphasis mb-4">
            ไม่มีข้อมูลโรงงาน
          </div>

          <!-- แหล่งผลิต GAP -->
          <div
            class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-seedling" color="hc-user" size="14" />
            แหล่งผลิตพืชที่ได้การรับรอง GAP
          </div>
          <v-table
            density="compact"
            class="rounded-lg border"
            v-if="expSearchResult.gaps?.length"
          >
            <thead>
              <tr>
                <th>รหัส GAP</th>
                <th>ชื่อแหล่งผลิต</th>
                <th>ชนิดพืช</th>
                <th>หมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in expSearchResult.gaps" :key="g.gapCode">
                <td class="text-body-2 font-weight-bold text-gap-user">
                  {{ g.gapCode }}
                </td>
                <td class="text-body-2">{{ g.siteName }}</td>
                <td class="text-body-2">{{ g.plantType }}</td>
                <td class="text-body-2">{{ g.expDate }}</td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-body-2 text-medium-emphasis">
            ไม่มีข้อมูล GAP
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 justify-end ga-2">
          <v-btn variant="tonal" color="grey" @click="viewExpRegDialog = false"
            >ปิด</v-btn
          >
          <v-btn
            color="hc-user"
            prepend-icon="fas fa-check"
            :disabled="expSearchResult?.isExpired"
            @click="
              selectExportReg();
              viewExpRegDialog = false;
            "
            >เลือกทะเบียนนี้</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Dialog: เพิ่ม/แก้ไขรายละเอียดการส่งออก ─── -->
    <v-dialog v-model="detailDialog" max-width="780" scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-subtitle-1 font-weight-bold">
          {{
            editDetailIdx === null
              ? "เพิ่มรายละเอียดการส่งออก"
              : "แก้ไขรายละเอียดการส่งออก"
          }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <!-- ประเภท -->
            <v-col cols="12">
              <div class="field-label mb-1">
                <div>ประเภทใบรับรอง <span class="req">*</span></div>
                <div class="field-label-en">Certificate Type</div>
              </div>
              <v-radio-group
                v-model="detailForm.certType"
                inline
                hide-details
                density="compact"
              >
                <v-radio
                  v-for="ct in certTypes"
                  :key="ct.value"
                  :label="ct.label"
                  :value="ct.value"
                  color="hc-user"
                  class="pr-5"
                />
              </v-radio-group>
            </v-col>

            <!-- ทะเบียนผู้ส่งออก -->
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ทะเบียนผู้ส่งออก <span class="req">*</span></div>
                <div class="field-label-en">Exporter Registration No.</div>
              </div>
              <v-select
                v-model="detailForm.exporterRegNo"
                :items="exporterRegOptions"
                item-title="label"
                item-value="regNo"
                variant="outlined"
                density="compact"
                rounded="lg"
                placeholder="เลือกทะเบียนผู้ส่งออก"
                hide-details
                :no-data-text="
                  form.exporters.length === 0
                    ? 'กรุณาเพิ่มผู้ส่งออกก่อน'
                    : 'ไม่พบข้อมูล'
                "
                @update:model-value="onDetailExporterChange"
              />
            </v-col>

            <!-- พาหนะที่ใช้ในการส่งออก -->
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>พาหนะที่ใช้ในการส่งออก <span class="req">*</span></div>
                <div class="field-label-en">Mode of Transport</div>
              </div>
              <v-select
                v-model="detailForm.vehicleType"
                :items="vehicleTypes"
                variant="outlined"
                density="compact"
                rounded="lg"
                placeholder="เลือกประเภทพาหนะ"
                hide-details
              />
            </v-col>

            <!-- ชื่อพาหนะ -->
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ชื่อพาหนะ</div>
                <div class="field-label-en">Conveyance Name</div>
              </div>
              <v-text-field
                v-model="detailForm.vehicleName"
                variant="outlined"
                density="compact"
                rounded="lg"
                placeholder="เช่น Pacific Grace, TG668"
                hide-details
              />
            </v-col>

            <!-- ตารางข้อมูลการส่งออก -->
            <v-col cols="12" class="mt-3">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="field-label mb-0">
                  <div>ตารางข้อมูลการส่งออก</div>
                  <div class="field-label-en">Shipment Details</div>
                </div>
                <v-btn
                  size="small"
                  color="hc-user"
                  variant="tonal"
                  prepend-icon="fas fa-plus"
                  @click="openShipmentDialog()"
                  >เพิ่มรายการ</v-btn
                >
              </div>

              <!-- ตาราง -->
              <div
                v-if="detailForm.shipments.length > 0"
                class="rounded-lg overflow-hidden border"
              >
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 48px">ลำดับ</th>
                      <th>ผู้รับสินค้า</th>
                      <th>ประเทศ</th>
                      <th>ด่าน</th>
                      <th>หมายเลข Lot</th>
                      <th class="text-right">น้ำหนัก (กก.)</th>
                      <th>วันที่ส่งออก</th>
                      <th style="width: 80px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(s, i) in detailForm.shipments" :key="i">
                      <td class="text-center">{{ i + 1 }}</td>
                      <td>{{ s.consignee }}</td>
                      <td>{{ s.country }}</td>
                      <td>{{ s.checkpoint }}</td>
                      <td>{{ s.lotNo }}</td>
                      <td class="text-right">
                        {{ Number(s.weight).toLocaleString() }}
                      </td>
                      <td>{{ s.exportDate }}</td>
                      <td>
                        <div class="d-flex align-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="warning"
                            @click="openShipmentDialog(i)"
                          >
                            <v-icon icon="fas fa-pen" size="12" />
                          </v-btn>
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="error"
                            @click="detailForm.shipments.splice(i, 1)"
                          >
                            <v-icon icon="fas fa-trash" size="12" />
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
              <div
                v-else
                class="text-center text-body-2 text-medium-emphasis py-6 rounded-lg border border-dashed"
              >
                ยังไม่มีรายการ กดปุ่ม "เพิ่มรายการ" เพื่อเพิ่ม
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 ga-2 justify-end">
          <v-btn variant="tonal" color="grey" @click="detailDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="hc-user" @click="saveDetail">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Confirm Dialog ─── -->
    <v-dialog v-model="confirmDialog" max-width="360">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="hc-user" size="28" />
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
                @click="confirmDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="hc-user"
                block
                rounded="lg"
                :loading="submitting"
                @click="submitApplication"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Sub-dialog: เพิ่มรายการในตารางส่งออก ─── -->
    <v-dialog v-model="shipmentDialog" max-width="560" scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-subtitle-1 font-weight-bold">
          {{
            editShipmentIdx === null ? "เพิ่มรายการส่งออก" : "แก้ไขรายการส่งออก"
          }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label">
                <div>ผู้รับสินค้า <span class="req">*</span></div>
                <div class="field-label-en">Consignee</div>
              </div>
              <v-text-field
                v-model="shipmentForm.consignee"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อผู้รับสินค้า"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ประเทศ <span class="req">*</span></div>
                <div class="field-label-en">Country of Destination</div>
              </div>
              <v-autocomplete
                v-model="shipmentForm.country"
                :items="countries"
                variant="outlined"
                density="compact"
                rounded="lg"
                placeholder="เลือกประเทศ"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ด่าน <span class="req">*</span></div>
                <div class="field-label-en">Port of Entry / Checkpoint</div>
              </div>
              <v-text-field
                v-model="shipmentForm.checkpoint"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อด่าน"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>หมายเลข Lot</div>
                <div class="field-label-en">Lot Number</div>
              </div>
              <v-text-field
                v-model="shipmentForm.lotNo"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="LOT-XXXX"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>น้ำหนัก (กก.) <span class="req">*</span></div>
                <div class="field-label-en">Net Weight (kg.)</div>
              </div>
              <v-text-field
                v-model="shipmentForm.weight"
                type="number"
                min="0"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="0"
              />
            </v-col>

            <!-- ── ที่อยู่ผู้รับสินค้า ── -->
            <v-col cols="12">
              <div class="field-label">
                <div>ที่อยู่ผู้รับสินค้า</div>
                <div class="field-label-en">Consignee Address</div>
              </div>
              <v-text-field
                v-model="shipmentForm.address"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ระบุที่อยู่ผู้รับสินค้า"
              />
            </v-col>

            <!-- ── วันที่ส่งออก ── -->
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>วันที่ส่งออก</div>
                <div class="field-label-en">Export Date</div>
              </div>
              <v-menu
                v-model="shipmentExportDateMenu"
                :close-on-content-click="false"
                location="bottom start"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="shipmentForm.exportDate"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    placeholder="วว/ดด/ปปปป"
                    append-inner-icon="fas fa-calendar-days"
                  />
                </template>
                <v-date-picker
                  v-model="shipmentExportDateObj"
                  color="hc-user"
                  hide-header
                  show-adjacent-months
                  locale="th"
                  @update:model-value="shipmentExportDateMenu = false"
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 ga-2 justify-end">
          <v-btn variant="tonal" color="grey" @click="shipmentDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="hc-user" @click="saveShipment">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Success Dialog ─── -->
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
        <v-card-actions class="px-6 pb-6">
          <v-btn color="hc-user" block rounded="lg" @click="goToApplicationList"
            >ดูรายการคำขอ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Draft Snackbar ─── -->
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
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";
import { useSessionStore } from "@/stores/session.store";
import { useThaiAddress } from "@/composables/useThaiAddress.js";
import thaiAddressDb from "@/data/thaiAddress.js";

const router = useRouter();
const sessionStore = useSessionStore();

// ─── Thai date locale ───
const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

// ─── Thai date helpers ───
function dateObjToThai(d) {
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
}
function thaiToDateObj(str) {
  if (!str) return null;
  const [d, m, y] = str.split("/");
  if (!d || !m || !y) return null;
  return new Date(parseInt(y) - 543, parseInt(m) - 1, parseInt(d));
}

// ─── Date picker menus ───
const dateStartMenu = ref(false);
const dateEndMenu = ref(false);
const exportDateMenu = ref(false);
const detailFromMenu = ref(false);
const detailToMenu = ref(false);

// ─── Date picker objects ───
const dateStartObj = ref(null);
const dateEndObj = ref(null);
const exportDateObj = ref(null);
const detailFromObj = ref(null);
const detailToObj = ref(null);

function refreshApplicantData() {
  form.applicantNameTh = sessionStore.personalName || form.applicantNameTh;
  form.applicantEmail = sessionStore.email || form.applicantEmail;
}
function refreshCompanyData() {
  form.companyNameTh = sessionStore.companyName || form.companyNameTh;
}

function goBack() {
  router.push({ name: "HCUserApplicationType" });
}
function goToApplicationList() {
  router.push({ name: "HCUserApplicationList" });
}

// ─── Stepper ───
const currentStep = ref(0);
const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "ไฟล์แนบ" },
];

function stepClass(value) {
  if (currentStep.value > value) return "step-done";
  if (currentStep.value === value) return "step-active";
  return "step-pending";
}

function prevStep() {
  currentStep.value--;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextStep() {
  if (currentStep.value === 0) {
    exporterError.value = form.exporters.length === 0;
    detailError.value = form.exportDetails.length === 0;
    if (exporterError.value || detailError.value) return;
  }
  currentStep.value++;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── Dialogs / State ───
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);
const submitting = ref(false);
const newRequestNo = ref("");
const exporterError = ref(false);
const detailError = ref(false);

function openConfirmDialog() {
  confirmDialog.value = true;
}

async function submitApplication() {
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  submitting.value = false;
  confirmDialog.value = false;
  newRequestNo.value = `HC-2569-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`;
  successDialog.value = true;
}

function saveDraft() {
  draftSnackbar.value = true;
}

// ─── Form state ───
const form = reactive({
  // ผู้ยื่นคำขอ (Auto-fill จาก SSO)
  applicantNameTh: sessionStore.personalName || "นายสมชาย ใจดี",
  applicantEmail: sessionStore.email || "somchai.j@example.co.th",
  applicantPhone: "02-123-4567",
  applicantFax: "02-123-4568",
  applicantHouseNo: "123",
  applicantMoo: "4",
  applicantAlley: "ซอยพหลโยธิน 5",
  applicantRoad: "ถนนพหลโยธิน",
  applicantTambol: "ลาดยาว",
  applicantDistrict: "จตุจักร",
  applicantProvince: "กรุงเทพมหานคร",
  applicantZipcode: "10900",
  // สถานประกอบการ (Auto-fill จาก DBD)
  companyNameTh:
    sessionStore.companyName || "บริษัท ไทยฟรุ้ต เอ็กซ์พอร์ต จำกัด",
  companyNameEn: "THAI FRUIT EXPORT CO., LTD.",
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
  companyPhone: "02-987-6543",
  companyFax: "",
  companyEmail: "info@thaifresh.co.th",
  // ข้อมูลคำขอ
  agency: "",
  registryType: "",
  exportDuration: null,
  dateStart: "",
  dateEnd: "",
  exporters: [],
  labTest: "no",
  labName: "",
  labProduct: "",
  exporterName: "",
  exporterHouseNo: "",
  exporterMoo: "",
  exporterAlley: "",
  exporterRoad: "",
  exporterTambol: "",
  exporterDistrict: "",
  exporterProvince: "",
  exporterZip: "",
  exporterPhone: "",
  exporterFax: "",
  consigneeName: "",
  consigneeHouseNo: "",
  consigneeMoo: "",
  consigneeAlley: "",
  consigneeRoad: "",
  consigneeTambol: "",
  consigneeDistrict: "",
  consigneeProvince: "",
  consigneeZip: "",
  attachDetails: false,
  vehicle: "",
  exportDate: "",
  pathogens: [],
  exportDetails: [],
  sampleValues: [],
  totalValue: "",
});

// ─── Total weight from all export detail shipments ───
const totalWeightAll = computed(() =>
  form.exportDetails.reduce(
    (sum, d) =>
      sum + d.shipments.reduce((s2, s) => s2 + (Number(s.weight) || 0), 0),
    0,
  ),
);

// ─── Thai Address: cascading selects ───
const thaiProvinces = computed(() =>
  [...new Set(thaiAddressDb.map((r) => r[2]))].sort((a, b) =>
    a.localeCompare(b, "th"),
  ),
);
function getDistricts(province) {
  if (!province) return [];
  return [
    ...new Set(thaiAddressDb.filter((r) => r[2] === province).map((r) => r[1])),
  ].sort((a, b) => a.localeCompare(b, "th"));
}
function getTambols(province, district) {
  if (!province || !district) return [];
  return thaiAddressDb
    .filter((r) => r[2] === province && r[1] === district)
    .map((r) => r[0]);
}

const {
  provinces: exporterProvinces,
  districts: exporterDistricts,
  tambols: exporterTambols,
} = useThaiAddress(form, "exporter");

const {
  provinces: consigneeProvinces,
  districts: consigneeDistricts,
  tambols: consigneeTambols,
} = useThaiAddress(form, "consignee");

// ─── Master Data ───
const agencies = [
  "กรมวิชาการเกษตร สำนักงานภาคเหนือ",
  "กรมวิชาการเกษตร สำนักงานภาคกลาง",
  "กรมวิชาการเกษตร สำนักงานภาคตะวันออกเฉียงเหนือ",
  "กรมวิชาการเกษตร สำนักงานภาคใต้",
  "ด่านตรวจพืชท่าอากาศยานสุวรรณภูมิ",
  "ด่านตรวจพืชท่าเรือกรุงเทพ",
];
const durationOptions = [
  { label: "7 วัน", value: 7 },
  { label: "14 วัน", value: 14 },
  { label: "30 วัน", value: 30 },
];
const laboratories = [
  "ศูนย์วิจัยและพัฒนาการเกษตรเชียงใหม่",
  "ห้องปฏิบัติการกรมวิทยาศาสตร์การแพทย์",
  "ศูนย์ตรวจสอบสินค้าเกษตร กรมวิชาการเกษตร",
  "บริษัท ยูโรฟินส์ (ประเทศไทย) จำกัด",
];
const cropOptions = [
  "ทุเรียน",
  "ลำไย",
  "ลิ้นจี่",
  "มังคุด",
  "มะม่วง",
  "ส้มโอ",
  "กล้วยหอม",
  "กระเทียม",
  "หอมแดง",
  "ข้าว",
];
const pathogenOptions = [
  "Salmonella",
  "E.coli",
  "Heavy Metal",
  "Pesticide Residue",
  "Aflatoxin",
  "Listeria monocytogenes",
];
const countries = [
  "จีน",
  "ญี่ปุ่น",
  "เกาหลีใต้",
  "สิงคโปร์",
  "ฮ่องกง",
  "เวียดนาม",
  "มาเลเซีย",
  "ไต้หวัน",
  "สหรัฐอเมริกา",
  "สหภาพยุโรป",
  "ออสเตรเลีย",
  "ตะวันออกกลาง",
];
const certTypes = [
  { label: "คลุมทั้งการส่งออก", value: "all" },
  { label: "แต่ละรายการส่งออก", value: "some" },
];

const vehicleTypes = ["เรือ", "เครื่องบิน", "รถบรรทุก", "รถไฟ", "อื่นๆ"];
const docDefs = [
  // { key: "idCard", label: "สำเนาบัตรประจำตัวประชาชนหรือหนังสือเดินทาง" },
  // { key: "juristic", label: "สำเนาหนังสือรับรองการจดทะเบียนนิติบุคคล" },
  // { key: "signerIdCard", label: "สำเนาบัตรประชาชนของผู้มีอำนาจลงนาม" },
  // { key: "poa", label: "หนังสือมอบอำนาจ" },
  { key: "other", label: "เอกสารอื่นๆ" },
];

// ─── Read-only operator data (mock from DOA) ───
// ข้อมูลโรงคัดบรรจุ computed จาก form.exporters
const doaFactories = computed(() =>
  form.exporters.flatMap((e) => e.factories || []),
);

const factoryDetailDialog = ref(false);
const selectedFactoryDetail = ref(null);

function openFactoryDetail(factory) {
  selectedFactoryDetail.value = factory;
  factoryDetailDialog.value = true;
}

// ─── Date watchers: Date object → Thai string ───
watch(dateStartObj, (d) => {
  form.dateStart = dateObjToThai(d);
  form.exportDate = dateObjToThai(d);
  exportDateObj.value = d ? new Date(d) : null;
  if (d && form.exportDuration) {
    const end = new Date(d);
    end.setDate(end.getDate() + form.exportDuration);
    dateEndObj.value = end;
  }
});
watch(dateEndObj, (d) => {
  form.dateEnd = dateObjToThai(d);
});
watch(exportDateObj, (d) => {
  form.exportDate = dateObjToThai(d);
});
watch(detailFromObj, (d) => {
  detailForm.dateFrom = dateObjToThai(d);
});
watch(detailToObj, (d) => {
  detailForm.dateTo = dateObjToThai(d);
});

// ─── Duration helper ───
function onDurationChange(val) {
  if (dateStartObj.value && val) {
    const end = new Date(dateStartObj.value);
    end.setDate(end.getDate() + val);
    dateEndObj.value = end;
  }
}

// ─── Exporter dialog ───
const exporterDialog = ref(false);
const editExporterIdx = ref(null);

// Mock DB: ทะเบียนผู้ส่งออกจากระบบ Export
const exportRegMockDB = {
  "EXP-2568-00123": {
    regNo: "EXP-2568-00123",
    companyName: "บริษัท ไทยฟรุ้ต เอ็กซ์พอร์ต จำกัด",
    regDate: "01/01/2568",
    expDate: "31/12/2569",
    isExpired: false,
    scopeCountry: "ญี่ปุ่น, เกาหลีใต้, จีน",
    factories: [
      {
        doaNo: "DOA-2568-12345",
        factoryName: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
        plantType: "ทุเรียน",
        expDate: "31/12/2569",
        factoryLabel: "โรงคัดบรรจุเชียงใหม่ฟาร์ม (ทุเรียน)",
        operatorName: "บริษัท ไทยฟรุ้ต เอ็กซ์พอร์ต จำกัด",
        operatorAddress: "88/1 หมู่ 3 ตำบลดอนแก้ว อำเภอแม่ริม",
        operatorProvince: "เชียงใหม่",
        operatorZip: "50180",
        operatorPhone: "053-441-234",
        operatorFax: "053-441-235",
        packingCode: "PH-CM-001",
        packingAddress: "99 หมู่ 5 ตำบลสันป่าตอง อำเภอสันป่าตอง",
        packingProvince: "เชียงใหม่",
        packingZip: "50120",
        packingPhone: "053-312-456",
        packingFax: "053-312-457",
      },
      {
        doaNo: "DOA-2568-67890",
        factoryName: "โรงผลไม้สดนอร์ทเทิร์น",
        plantType: "ลำไย",
        expDate: "30/06/2569",
        factoryLabel: "โรงผลไม้สดนอร์ทเทิร์น (ลำไย)",
        operatorName: "บริษัท ไทยฟรุ้ต เอ็กซ์พอร์ต จำกัด",
        operatorAddress: "55/2 ถนนเชียงใหม่-ลำปาง ตำบลช้างเผือก",
        operatorProvince: "เชียงใหม่",
        operatorZip: "50300",
        operatorPhone: "053-225-111",
        operatorFax: "053-225-112",
        packingCode: "PH-CM-002",
        packingAddress: "120 หมู่ 2 ตำบลหนองจ๊อม อำเภอสันทราย",
        packingProvince: "เชียงใหม่",
        packingZip: "50210",
        packingPhone: "053-498-321",
        packingFax: "053-498-322",
      },
    ],
    gaps: [
      {
        gapCode: "GAP-2568-00001",
        siteName: "สวนเกษตรกรรมสมชาย",
        plantType: "ทุเรียน",
        expDate: "30/09/2569",
        gapLabel: "สวนเกษตรกรรมสมชาย (ทุเรียน)",
      },
      {
        gapCode: "GAP-2568-00002",
        siteName: "ไร่ผลไม้อินทรีย์ภาคเหนือ",
        plantType: "ลำไย",
        expDate: "15/03/2569",
        gapLabel: "ไร่ผลไม้อินทรีย์ภาคเหนือ (ลำไย)",
      },
    ],
  },
  "EXP-2567-00456": {
    regNo: "EXP-2567-00456",
    companyName: "บริษัท สยามเฟรชฟู้ด จำกัด",
    regDate: "16/03/2567",
    expDate: "15/03/2569",
    isExpired: false,
    scopeCountry: "สหรัฐอเมริกา, สหภาพยุโรป",
    factories: [
      {
        doaNo: "DOA-10-22222",
        factoryName: "โรงงานคัดบรรจุกรุงเทพ",
        plantType: "มังคุด",
        expDate: "15/03/2569",
        factoryLabel: "โรงงานคัดบรรจุกรุงเทพ (มังคุด)",
        operatorName: "บริษัท สยามเฟรชฟู้ด จำกัด",
        operatorAddress: "42 ถนนพระราม 2 แขวงบางมด เขตจอมทอง",
        operatorProvince: "กรุงเทพมหานคร",
        operatorZip: "10150",
        operatorPhone: "02-415-8888",
        operatorFax: "02-415-8889",
        packingCode: "PH-BKK-010",
        packingAddress: "42 ถนนพระราม 2 แขวงบางมด เขตจอมทอง",
        packingProvince: "กรุงเทพมหานคร",
        packingZip: "10150",
        packingPhone: "02-415-9000",
        packingFax: "02-415-9001",
      },
    ],
    gaps: [
      {
        gapCode: "GAP-10-2567-00033",
        siteName: "สวนมังคุดทองดี",
        plantType: "มังคุด",
        expDate: "15/03/2569",
        gapLabel: "สวนมังคุดทองดี (มังคุด)",
      },
    ],
  },
};

const expSearchNo = ref("");
const expSearchLoading = ref(false);
const expSearchResult = ref(null);
const expSearchNotFound = ref(false);
const expSelected = ref(null);
const viewExpRegDialog = ref(false);
const selectedFactory = ref(null);
const selectedGap = ref([]);

function searchExportReg() {
  if (!expSearchNo.value.trim()) return;
  expSearchLoading.value = true;
  expSearchResult.value = null;
  expSearchNotFound.value = false;
  setTimeout(() => {
    const found = exportRegMockDB[expSearchNo.value.trim().toUpperCase()];
    if (found) {
      expSearchResult.value = found;
    } else {
      expSearchNotFound.value = true;
    }
    expSearchLoading.value = false;
  }, 600);
}

function selectExportReg() {
  if (!expSearchResult.value) return;
  expSelected.value = { ...expSearchResult.value };
  expSearchResult.value = null;
  selectedFactory.value = null;
  selectedGap.value = [];
}

function clearExpSelected() {
  expSelected.value = null;
  expSearchNo.value = "";
  expSearchResult.value = null;
  expSearchNotFound.value = false;
  selectedFactory.value = null;
  selectedGap.value = [];
}

function openExporterDialog(idx = null) {
  editExporterIdx.value = idx;
  expSearchNo.value = "";
  expSearchResult.value = null;
  expSearchNotFound.value = false;
  if (idx !== null) {
    // แก้ไข: pre-fill ข้อมูลเดิม (read-only summary)
    const existing = form.exporters[idx];
    expSelected.value = {
      regNo: existing.regNo,
      companyName: existing.companyName,
      scopeCountry: existing.scopeCountry || "",
      regDate: existing.regDate || "",
      expDate: existing.expDate,
      factories: existing.factories || [],
      gaps: existing.gaps || [],
    };
    selectedFactory.value = existing.factories?.[0] ?? null;
    selectedGap.value = existing.gaps ? [...existing.gaps] : [];
  } else {
    expSelected.value = null;
    selectedFactory.value = [];
    selectedGap.value = [];
  }
  exporterDialog.value = true;
}

function saveExporter() {
  if (!expSelected.value || !selectedFactory.value) return;
  const data = {
    regNo: expSelected.value.regNo,
    companyName: expSelected.value.companyName,
    scopeCountry: expSelected.value.scopeCountry || "",
    factories: [selectedFactory.value],
    gaps: [...selectedGap.value],
    regDate: expSelected.value.regDate,
    expDate: expSelected.value.expDate,
  };
  if (editExporterIdx.value !== null) {
    form.exporters[editExporterIdx.value] = data;
  } else {
    form.exporters.push(data);
    form.sampleValues.push("");
  }
  exporterError.value = false;
  exporterDialog.value = false;
}

function removeExporter(idx) {
  form.exporters.splice(idx, 1);
  form.sampleValues.splice(idx, 1);
}

// ─── Export detail dialog ───
const detailDialog = ref(false);
const editDetailIdx = ref(null);
const detailForm = reactive({
  certType: "",
  exporterRegNo: "",
  vehicleType: "",
  vehicleName: "",
  shipments: [],
});

// ─── Shipment sub-dialog ───
const shipmentDialog = ref(false);
const editShipmentIdx = ref(null);
const shipmentForm = reactive({
  consignee: "",
  country: "",
  checkpoint: "",
  lotNo: "",
  weight: "",
  address: "",
  exportDate: "",
});
const shipmentExportDateMenu = ref(false);
const shipmentExportDateObj = ref(null);

watch(shipmentExportDateObj, (d) => {
  if (!d) {
    shipmentForm.exportDate = "";
    return;
  }
  shipmentForm.exportDate = dateObjToThai(d);
  shipmentExportDateMenu.value = false;
});

function openShipmentDialog(idx = null) {
  editShipmentIdx.value = idx;
  if (idx !== null) {
    Object.assign(shipmentForm, detailForm.shipments[idx]);
    shipmentExportDateObj.value = shipmentForm.exportDate
      ? thaiToDateObj(shipmentForm.exportDate)
      : null;
  } else {
    Object.assign(shipmentForm, {
      consignee: "",
      country: "",
      checkpoint: "",
      lotNo: "",
      weight: "",
      address: "",
      exportDate: "",
    });
    shipmentExportDateObj.value = null;
  }
  shipmentDialog.value = true;
}

function saveShipment() {
  if (
    !shipmentForm.consignee ||
    !shipmentForm.country ||
    !shipmentForm.checkpoint ||
    !shipmentForm.weight
  )
    return;
  const data = { ...shipmentForm };
  if (editShipmentIdx.value !== null) {
    detailForm.shipments[editShipmentIdx.value] = data;
  } else {
    detailForm.shipments.push(data);
  }
  shipmentDialog.value = false;
}

const exporterRegOptions = computed(() =>
  form.exporters.map((e) => ({
    regNo: e.regNo,
    label: `${e.regNo} — ${e.companyName || ""}`,
  })),
);

function openDetailDialog(idx = null) {
  editDetailIdx.value = idx;
  if (idx !== null) {
    const existing = form.exportDetails[idx];
    Object.assign(detailForm, {
      certType: existing.certType || "",
      exporterRegNo: existing.exporterRegNo || "",
      vehicleType: existing.vehicleType || "",
      vehicleName: existing.vehicleName || "",
      shipments: existing.shipments ? [...existing.shipments] : [],
    });
  } else {
    Object.assign(detailForm, {
      certType: "",
      exporterRegNo: "",
      vehicleType: "",
      vehicleName: "",
      shipments: [],
    });
  }
  detailDialog.value = true;
}
function onDetailExporterChange(regNo) {
  const exp = form.exporters.find((e) => e.regNo === regNo);
  detailForm.exporterName = exp?.companyName || "";
}
function saveDetail() {
  if (
    !detailForm.certType ||
    !detailForm.exporterRegNo ||
    !detailForm.vehicleType
  )
    return;
  const data = { ...detailForm, shipments: [...detailForm.shipments] };
  if (editDetailIdx.value !== null) {
    form.exportDetails[editDetailIdx.value] = data;
  } else {
    form.exportDetails.push(data);
  }
  detailError.value = false;
  detailDialog.value = false;
}
function removeDetail(idx) {
  form.exportDetails.splice(idx, 1);
}

// ─── Sample summary (computed) ───
const sampleSummary = computed(() =>
  form.exporters.map((exp, idx) => ({
    no: idx + 1,
    plantType: exp.factories?.length
      ? exp.factories.map((f) => f.plantType).join(", ")
      : "—",
    totalWeight: form.exportDetails
      .filter((d) => d.exporterRegNo === exp.regNo)
      .reduce((sum, d) => sum + (parseFloat(d.weight) || 0), 0),
    gapCodes: exp.gaps?.length
      ? exp.gaps.map((g) => g.gapCode).join(", ")
      : "—",
  })),
);

// ─── File upload ───
const uploadedFiles = reactive({});
const otherDocDescription = ref("");

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
</script>

<style scoped>
/* Stepper */
.step-done,
.step-active {
  background: rgb(var(--v-theme-hc-user)) !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hc-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hc-user)) !important;
}

/* Upload row */
.item-row {
  background: rgba(var(--v-theme-hc-user), 0.03);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* Section sub-label */
.field-section-label {
  color: rgb(var(--v-theme-hc-user)) !important;
}

/* Confirm / success ring */
.confirm-ring {
  background: rgba(var(--v-theme-hc-user), 0.1);
}
</style>
