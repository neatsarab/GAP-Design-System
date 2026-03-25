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
          <v-radio-group
            density="compact"
            v-model="form.requestType"
            color="export-user"
            inline
          >
            <v-radio value="register" label="คำขอขึ้นทะเบียน" class="mr-8" />
            <v-radio value="renewal" label="คำขอต่ออายุ" />
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
          <v-chip
            size="x-small"
            color="export-user"
            variant="tonal"
            class="ml-1"
          >
            Auto-fill จาก SSO
          </v-chip>
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
                bg-color="surface-variant"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label">
                <div>เลขบัตรประชาชน / เลขนิติบุคคล</div>
                <div class="field-label-en">ID Card / Tax ID</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.applicantId"
                hide-details
                readonly
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ขอบข่ายประเทศ -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-earth-asia" color="export-user" size="15" />
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

      <!-- ข้อมูลสถานประกอบการ -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-building" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ข้อมูลสถานประกอบการ
            <v-chip
              size="x-small"
              color="export-user"
              variant="tonal"
              class="ml-1"
            >
              Auto-fill บางส่วนจาก DBD
            </v-chip></span
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
              />
            </v-col>
          </v-row>

          <!-- ที่ตั้ง (ภาษาอังกฤษ) -->
          <div class="field-section-label mt-4 mb-2">ที่ตั้ง (ภาษาอังกฤษ)</div>
          <v-row dense>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>House No.</div>
                <div class="field-label-en">House No.</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.houseNoEn"
                hide-details
                readonly
                bg-color="surface-variant"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Alley / Soi</div>
                <div class="field-label-en">Alley / Soi</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.alleyEn"
                hide-details
                readonly
                bg-color="surface-variant"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Road</div>
                <div class="field-label-en">Road</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.roadEn"
                hide-details
                readonly
                bg-color="surface-variant"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Sub-district</div>
                <div class="field-label-en">Sub-district</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.tambolEn"
                hide-details
                readonly
                bg-color="surface-variant"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>District</div>
                <div class="field-label-en">District</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.districtEn"
                hide-details
                readonly
                bg-color="surface-variant"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Province</div>
                <div class="field-label-en">Province</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.provinceEn"
                hide-details
                readonly
                bg-color="surface-variant"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">
                <div>Zipcode</div>
                <div class="field-label-en">Zipcode</div>
              </div>
              <v-text-field
                density="compact"
                v-model="form.zipcodeEn"
                hide-details
                readonly
                bg-color="surface-variant"
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
                bg-color="surface-variant"
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
                bg-color="surface-variant"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ข้อมูลโรงงานผลิตสินค้าพืช -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-industry" color="export-user" size="15" />
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
              placeholder="เช่น DOA-12345"
              clearable
              class="flex-grow-1"
            />
            <v-btn
              color="export-user"
              variant="tonal"
              prepend-icon="fas fa-magnifying-glass"
              :loading="doaSearchLoading"
              @click="searchDoa"
              >ค้นหา</v-btn
            >
          </div>

          <!-- Search result -->
          <div v-if="doaSearchResult" class="mb-4">
            <div
              class="item-row rounded-lg pa-4 d-flex align-center justify-space-between flex-wrap ga-3"
            >
              <div class="d-flex align-center ga-4 flex-wrap">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    เลขทะเบียน DOA
                  </div>
                  <div class="text-body-2 font-weight-bold text-export-user">
                    {{ doaSearchResult.doaNo }}
                  </div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    ชื่อโรงงาน
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ doaSearchResult.factoryName }}
                  </div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    วันหมดอายุ
                  </div>
                  <div
                    class="text-body-2 font-weight-medium"
                    :class="
                      doaSearchResult.isExpired ? 'text-error' : 'text-success'
                    "
                  >
                    {{ doaSearchResult.expiryDate }}
                    <v-chip
                      v-if="doaSearchResult.isExpired"
                      size="x-small"
                      color="error"
                      variant="tonal"
                      class="ml-1"
                      >หมดอายุ</v-chip
                    >
                  </div>
                </div>
              </div>
              <v-btn
                color="export-user"
                size="small"
                prepend-icon="fas fa-plus"
                :disabled="
                  doaSearchResult.isExpired ||
                  doaAlreadyAdded(doaSearchResult.doaNo)
                "
                @click="addFactoryFromSearch"
              >
                {{
                  doaAlreadyAdded(doaSearchResult.doaNo) ? "เพิ่มแล้ว" : "เพิ่ม"
                }}
              </v-btn>
            </div>
          </div>

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
                  <td class="text-body-2 font-weight-bold text-export-user">
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
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-seedling" color="export-user" size="15" />
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
              placeholder="เช่น GAP-12345"
              clearable
              class="flex-grow-1"
            />
            <v-btn
              color="export-user"
              variant="tonal"
              prepend-icon="fas fa-magnifying-glass"
              :loading="gapSearchLoading"
              @click="searchGap"
              >ค้นหา</v-btn
            >
          </div>

          <!-- Search result -->
          <div v-if="gapSearchResult" class="mb-4">
            <div
              class="item-row rounded-lg pa-4 d-flex align-center justify-space-between flex-wrap ga-3"
            >
              <div class="d-flex align-center ga-4 flex-wrap">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    เลขใบรับรอง GAP
                  </div>
                  <div class="text-body-2 font-weight-bold text-export-user">
                    {{ gapSearchResult.gapNo }}
                  </div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    ชื่อแหล่งผลิต
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ gapSearchResult.siteName }}
                  </div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    หน่วยงานรับรอง
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ gapSearchResult.certBody }}
                  </div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    รหัสรับรอง
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ gapSearchResult.certCode }}
                  </div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    วันหมดอายุ
                  </div>
                  <div
                    class="text-body-2 font-weight-medium"
                    :class="
                      gapSearchResult.isExpired ? 'text-error' : 'text-success'
                    "
                  >
                    {{ gapSearchResult.expiryDate }}
                    <v-chip
                      v-if="gapSearchResult.isExpired"
                      size="x-small"
                      color="error"
                      variant="tonal"
                      class="ml-1"
                      >หมดอายุ</v-chip
                    >
                  </div>
                </div>
              </div>
              <v-btn
                color="export-user"
                size="small"
                prepend-icon="fas fa-plus"
                :disabled="
                  gapSearchResult.isExpired ||
                  gapAlreadyAdded(gapSearchResult.gapNo)
                "
                @click="addGapFromSearch"
              >
                {{
                  gapAlreadyAdded(gapSearchResult.gapNo) ? "เพิ่มแล้ว" : "เพิ่ม"
                }}
              </v-btn>
            </div>
          </div>

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
                  <td class="text-body-2 font-weight-bold text-export-user">
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
          <v-icon icon="fas fa-user" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >เอกสารกรณีบุคคลธรรมดา</span
          >
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
                      :color="
                        uploadedFiles[doc.key] ? 'success' : 'export-user'
                      "
                      variant="tonal"
                      size="small"
                      prepend-icon="fas fa-upload"
                      @click="mockUploadFile(doc.key)"
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
          <v-icon icon="fas fa-building" color="export-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >เอกสารกรณีนิติบุคคล</span
          >
        </div>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col v-for="doc in docJuristic" :key="doc.key" cols="12">
              <div class="item-row rounded-lg pa-3 mb-2">
                <v-row align="center" no-gutters>
                  <v-col>
                    <div class="text-body-2 font-weight-medium">
                      {{ doc.label }}
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
                      :color="
                        uploadedFiles[doc.key] ? 'success' : 'export-user'
                      "
                      variant="tonal"
                      size="small"
                      prepend-icon="fas fa-upload"
                      @click="mockUploadFile(doc.key)"
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
          color="export-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="export-user"
          append-icon="fas fa-arrow-right"
          @click="nextStep"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="export-user"
          prepend-icon="fas fa-paper-plane"
          @click="openConfirmDialog"
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
          <v-btn variant="tonal" color="grey" block @click="closeConfirmDialog"
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
          <v-btn color="export-user" block @click="goToApplicationList"
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
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const route = useRoute();

function goToApplicationList() {
  router.push({ name: "ExportUserApplicationList" });
}
function prevStep() {
  currentStep.value--;
}
function nextStep() {
  currentStep.value++;
}

const typeTitles = {
  newrequest: "คำขอขึ้นทะเบียนผู้ส่งออกสินค้าพืช",
  amendment: "คำขอแก้ไขใบรับรองผู้ส่งออก",
  kk1: "คำร้องขอขึ้นทะเบียน ก.ก.1 (โรงบรรจุ/โรงรมทรีทเม้นต์/สวนส่งออก เกาหลี)",
  smpv5: "คำร้องขอ สมพ.5 (จดทะเบียนผู้ส่งออกผักและผลไม้)",
  smpv5_other: "คำร้องขอ สมพ.5 (กรณีอื่น)",
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
  "DOA-12345": {
    doaNo: "DOA-12345",
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
  "GAP-12345": {
    gapNo: "GAP-12345",
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
  form.gaps.push({ ...gapSearchResult.value });
  gapSearchResult.value = null;
  gapSearchNo.value = "";
}

function removeGap(idx) {
  form.gaps.splice(idx, 1);
}

const uploadedFiles = reactive({});
function mockUploadFile(key) {
  uploadedFiles[key] = "เอกสาร.pdf";
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
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
