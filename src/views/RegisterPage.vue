<template>
  <div class="page-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- ═══ Left Panel ═══ -->
    <div class="left-panel d-none d-md-flex">
      <div class="left-panel-inner">
        <div class="brand-ring mb-8">
          <v-icon icon="fas fa-leaf" size="36" color="white" />
        </div>
        <h1 class="text-h5 font-weight-bold text-white mb-3 lh-tight">
          ระบบการให้บริการทางอิเล็กทรอนิกส์
        </h1>
        <p class="text-body-1 mb-10" style="color: rgba(255, 255, 255, 0.75)">
          กรมวิชาการเกษตร กระทรวงเกษตรและสหกรณ์
        </p>
        <div class="feature-list">
          <div v-for="f in features" :key="f.text" class="feature-item">
            <div class="feature-icon">
              <v-icon :icon="f.icon" size="15" color="white" />
            </div>
            <span
              class="text-body-2"
              style="color: rgba(255, 255, 255, 0.85)"
              >{{ f.text }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Right Panel ═══ -->
    <div class="right-panel">
      <div class="page-form-wrapper">
        <!-- Top bar -->
        <div class="d-flex align-center justify-space-between mb-6">
          <div class="d-flex d-md-none align-center ga-2">
            <div class="brand-ring-sm">
              <v-icon icon="fas fa-leaf" size="18" color="white" />
            </div>
            <div>
              <div class="text-body-2 font-weight-bold text-primary lh-tight">
                กรมวิชาการเกษตร
              </div>
              <div class="text-caption text-medium-emphasis">
                ระบบการให้บริการทางอิเล็กทรอนิกส์
              </div>
            </div>
          </div>
          <div class="d-none d-md-block" />
          <v-btn
            variant="tonal"
            size="small"
            :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
            @click="themeStore.toggle()"
          >
            {{ themeStore.isDark ? "โหมดสว่าง" : "โหมดมืด" }}
          </v-btn>
        </div>

        <!-- Heading -->
        <div class="mb-6">
          <h2 class="page-title mb-1">ลงทะเบียนผู้ใช้งานใหม่</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            สร้างบัญชีเพื่อเข้าใช้งานระบบบริการออนไลน์ กรมวิชาการเกษตร
          </p>
        </div>

        <!-- Step Indicator -->
        <div class="d-flex align-center mb-8">
          <template v-for="(step, idx) in steps" :key="step.key">
            <div class="d-flex flex-column align-center">
              <div
                class="step-circle"
                :class="{
                  'step-circle--done': currentStep > idx,
                  'step-circle--active': currentStep === idx,
                  'step-circle--pending': currentStep < idx,
                }"
              >
                <v-icon
                  v-if="currentStep > idx"
                  icon="fas fa-check"
                  size="14"
                />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div class="mt-2 text-center" style="min-width: 80px">
                <div
                  class="text-caption font-weight-bold"
                  :class="
                    currentStep === idx
                      ? 'text-primary'
                      : currentStep > idx
                        ? 'text-primary'
                        : 'text-disabled'
                  "
                >
                  {{ step.label }}
                </div>
              </div>
            </div>
            <div
              v-if="idx < steps.length - 1"
              class="step-connector flex-grow-1 mb-7"
              :class="{ 'step-connector--done': currentStep > idx }"
            />
          </template>
        </div>

        <!-- ═══ Step 0: เลือกวิธีลงทะเบียน ═══ -->
        <div v-if="currentStep === 0">
          <!-- ThaiD -->
          <div class="thaid-hero mb-5">
            <div class="thaid-icon-wrap mb-4">
              <v-icon icon="fas fa-id-card" size="40" color="primary" />
            </div>
            <div class="text-body-1 font-weight-bold mb-1">
              ยืนยันตัวตนผ่าน ThaiD
            </div>
            <div
              class="text-body-2 text-medium-emphasis mb-6"
              style="max-width: 320px; margin: 0 auto"
            >
              ใช้แอปพลิเคชัน ThaiD เพื่อยืนยันตัวตนอย่างปลอดภัย
              ระบบจะดึงข้อมูลของท่านโดยอัตโนมัติ
            </div>
            <v-btn
              color="primary"
              size="large"
              rounded="lg"
              prepend-icon="fas fa-mobile-screen"
              :loading="thaidLoading"
              style="min-width: 260px"
              @click="doThaiDVerify"
            >
              ยืนยันตัวตนด้วย ThaiD
            </v-btn>
          </div>

          <div class="divider-or mb-5">
            <span class="divider-or-text">หรือเลือกวิธีอื่น</span>
          </div>

          <!-- Manual options -->
          <div class="d-flex ga-3">
            <div
              class="mode-card flex-1-1 rounded-xl pa-4 cursor-pointer"
              :class="{ 'mode-card--active': registrationMode === 'thai' }"
              @click="selectMode('thai')"
            >
              <div class="d-flex align-center ga-2 mb-2">
                <div class="mode-icon-box mode-icon-box--thai">
                  <v-icon
                    icon="fas fa-id-card-clip"
                    size="18"
                    color="primary"
                  />
                </div>
                <v-icon
                  v-if="registrationMode === 'thai'"
                  icon="fas fa-circle-check"
                  size="16"
                  color="primary"
                  class="ml-auto"
                />
              </div>
              <div class="text-body-2 font-weight-bold mb-1">คนสัญชาติไทย</div>
              <div class="text-caption text-medium-emphasis">
                ใช้เลขบัตรประชาชน 13 หลัก
              </div>
            </div>

            <div
              v-if="!isStaff"
              class="mode-card flex-1-1 rounded-xl pa-4 cursor-pointer"
              :class="{
                'mode-card--active mode-card--foreign':
                  registrationMode === 'foreigner',
              }"
              @click="selectMode('foreigner')"
            >
              <div class="d-flex align-center ga-2 mb-2">
                <div class="mode-icon-box mode-icon-box--foreign">
                  <v-icon icon="fas fa-passport" size="18" color="teal" />
                </div>
                <v-icon
                  v-if="registrationMode === 'foreigner'"
                  icon="fas fa-circle-check"
                  size="16"
                  color="teal"
                  class="ml-auto"
                />
              </div>
              <div class="text-body-2 font-weight-bold mb-1">ชาวต่างชาติ</div>
              <div class="text-caption text-medium-emphasis">
                Foreigner — ใช้เลข Passport
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ Step 1: กรอกข้อมูล ═══ -->
        <div v-else-if="currentStep === 1">
          <v-alert
            v-if="registrationMode === 'thaid'"
            color="success"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-circle-check"
            class="mb-5"
          >
            ดึงข้อมูลจาก ThaiD API สำเร็จ — ช่องสีเทาถูกเติมอัตโนมัติ
          </v-alert>

          <v-alert
            v-else-if="registrationMode === 'foreigner'"
            color="teal"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-passport"
            class="mb-5"
          >
            <strong>Foreign National Registration</strong> —
            กรุณากรอกข้อมูลเป็นภาษาอังกฤษ
          </v-alert>

          <v-form ref="formRef">
            <!-- ── ข้อมูลส่วนตัว ── -->
            <div class="form-section-title mb-3">
              <v-icon icon="fas fa-user" size="13" class="mr-1" />
              {{
                registrationMode === "foreigner"
                  ? "Personal Information"
                  : "ข้อมูลส่วนตัว"
              }}
            </div>

            <!-- Thai (ThaiD or manual) -->
            <template v-if="registrationMode !== 'foreigner'">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="fl mb-1">คำนำหน้า <span class="req">*</span></div>
                  <div class="fl-sub mb-1">Title</div>
                  <v-autocomplete
                    v-model="form.prefix"
                    :items="['นาย', 'นาง', 'นางสาว']"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :readonly="registrationMode === 'thaid'"
                    :class="{ 'autofill-field': registrationMode === 'thaid' }"
                  />
                </v-col>
                <v-col cols="12" sm="8">
                  <div class="fl mb-1">
                    เลขบัตรประชาชน <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">National ID No.</div>
                  <v-text-field
                    v-model="form.idCard"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required, rules.thaiId]"
                    :readonly="registrationMode === 'thaid'"
                    :class="{ 'autofill-field': registrationMode === 'thaid' }"
                    placeholder="X-XXXX-XXXXX-XX-X"
                  />
                </v-col>
                <v-col cols="6">
                  <div class="fl mt-3 mb-1">
                    ชื่อ <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">First Name</div>
                  <v-text-field
                    v-model="form.firstName"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :readonly="registrationMode === 'thaid'"
                    :class="{ 'autofill-field': registrationMode === 'thaid' }"
                  />
                </v-col>
                <v-col cols="6">
                  <div class="fl mt-3 mb-1">
                    นามสกุล <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">Last Name</div>
                  <v-text-field
                    v-model="form.lastName"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :readonly="registrationMode === 'thaid'"
                    :class="{ 'autofill-field': registrationMode === 'thaid' }"
                  />
                </v-col>
              </v-row>
            </template>

            <!-- Foreigner -->
            <template v-else>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="fl mb-1">Title <span class="req">*</span></div>
                  <div class="fl-sub mb-1">คำนำหน้า</div>
                  <v-autocomplete
                    v-model="form.prefix"
                    :items="['Mr.', 'Mrs.', 'Miss', 'Ms.', 'Dr.']"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="8">
                  <div class="fl mb-1">
                    Nationality <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">สัญชาติ</div>
                  <v-autocomplete
                    v-model="form.nationality"
                    :items="nationalities"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="6">
                  <div class="fl mt-3 mb-1">
                    First Name <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">ชื่อ</div>
                  <v-text-field
                    v-model="form.firstName"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                    placeholder="e.g. John"
                  />
                </v-col>
                <v-col cols="6">
                  <div class="fl mt-3 mb-1">
                    Last Name <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">นามสกุล</div>
                  <v-text-field
                    v-model="form.lastName"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                    placeholder="e.g. Smith"
                  />
                </v-col>
                <v-col cols="12" sm="7">
                  <div class="fl mt-3 mb-1">
                    Passport No. <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">เลขหนังสือเดินทาง</div>
                  <v-text-field
                    v-model="form.passportNo"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.required]"
                    placeholder="e.g. AA1234567"
                    prepend-inner-icon="fas fa-passport"
                  />
                </v-col>
                <v-col cols="12" sm="5">
                  <div class="fl mt-3 mb-1">
                    Passport Expiry <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">วันหมดอายุ</div>
                  <v-menu
                    v-model="passportExpiryMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="form.passportExpiry"
                        variant="outlined"
                        density="compact"
                        rounded="lg"
                        hide-details="auto"
                        :rules="[rules.required]"
                        placeholder="DD/MM/YYYY"
                        prepend-inner-icon="fas fa-calendar"
                        readonly
                      />
                    </template>
                    <v-date-picker
                      v-model="passportExpiryDate"
                      color="primary"
                      @update:model-value="onPassportExpiryPick"
                    />
                  </v-menu>
                </v-col>
              </v-row>
            </template>

            <v-divider class="my-5" />

            <!-- ── ข้อมูลติดต่อ ── -->
            <div class="d-flex align-center gap-2 mb-3">
              <div class="form-section-title">
                <v-icon icon="fas fa-address-book" size="13" class="mr-1" />
                {{
                  registrationMode === "foreigner"
                    ? "Contact Information"
                    : "ข้อมูลติดต่อ"
                }}
              </div>
            </div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="fl mb-1">อีเมล <span class="req">*</span></div>
                <div class="fl-sub mb-1">Email</div>
                <v-text-field
                  v-model="form.email"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="fas fa-envelope"
                  placeholder="example@email.com"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="fl mb-1">
                  เบอร์โทรศัพท์ <span class="req">*</span>
                </div>
                <div class="fl-sub mb-1">Phone Number</div>
                <v-text-field
                  v-model="form.phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[rules.required]"
                  prepend-inner-icon="fas fa-phone"
                  :placeholder="
                    registrationMode === 'foreigner'
                      ? '+66-XX-XXX-XXXX'
                      : '0XX-XXX-XXXX'
                  "
                />
              </v-col>
              <!-- ── ที่อยู่: ThaiD readonly ── -->
              <template v-if="registrationMode === 'thaid' && !isStaff">
                <v-col cols="12" sm="6">
                  <div class="fl mt-3 mb-1">
                    บ้านเลขที่ / อาคาร <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">House No. / Building</div>
                  <v-text-field
                    v-model="form.houseNo"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    class="autofill-field"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="fl mt-3 mb-1">ถนน</div>
                  <div class="fl-sub mb-1">Road</div>
                  <v-text-field
                    v-model="form.road"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    class="autofill-field"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="fl mt-3 mb-1">
                    แขวง / ตำบล <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">Sub-district</div>
                  <v-text-field
                    v-model="form.subdistrict"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    class="autofill-field"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="fl mt-3 mb-1">
                    เขต / อำเภอ <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">District</div>
                  <v-text-field
                    v-model="form.district"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    class="autofill-field"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="fl mt-3 mb-1">
                    จังหวัด <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">Province</div>
                  <v-text-field
                    v-model="form.province"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    class="autofill-field"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="fl mt-3 mb-1">
                    รหัสไปรษณีย์ <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">Postal Code</div>
                  <v-text-field
                    v-model="form.zipCode"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    class="autofill-field"
                  />
                </v-col>
              </template>

              <!-- ── ที่อยู่: ระบุเอง ── -->
              <template v-else-if="!isStaff">
                <!-- Toggle สำหรับ foreigner เท่านั้น -->
                <v-col v-if="registrationMode === 'foreigner'" cols="12">
                  <div class="fl mt-3 mb-2">
                    Address Type <span class="req">*</span>
                  </div>
                  <div class="addr-type-group">
                    <v-btn
                      :color="
                        foreignerAddressType === 'thai' ? 'primary' : undefined
                      "
                      :variant="
                        foreignerAddressType === 'thai' ? 'tonal' : 'outlined'
                      "
                      size="small"
                      rounded="lg"
                      @click="foreignerAddressType = 'thai'"
                    >
                      <v-icon start icon="fas fa-map-marker-alt" size="13" />
                      ที่อยู่ในประเทศไทย
                    </v-btn>
                    <v-btn
                      :color="
                        foreignerAddressType === 'foreign'
                          ? 'primary'
                          : undefined
                      "
                      :variant="
                        foreignerAddressType === 'foreign'
                          ? 'tonal'
                          : 'outlined'
                      "
                      size="small"
                      rounded="lg"
                      @click="foreignerAddressType = 'foreign'"
                    >
                      <v-icon start icon="fas fa-globe" size="13" />
                      ที่อยู่ต่างประเทศ
                    </v-btn>
                  </div>
                </v-col>

                <!-- ── ที่อยู่ต่างประเทศ ── -->
                <template
                  v-if="
                    registrationMode === 'foreigner' &&
                    foreignerAddressType === 'foreign'
                  "
                >
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">
                      Country <span class="req">*</span>
                    </div>
                    <div class="fl-sub mb-1">ประเทศ</div>
                    <v-autocomplete
                      v-model="form.country"
                      :items="countries"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details="auto"
                      :rules="[rules.required]"
                      placeholder="Select country"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">Postal / ZIP Code</div>
                    <div class="fl-sub mb-1">รหัสไปรษณีย์</div>
                    <v-text-field
                      v-model="form.zipCode"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details
                      placeholder="Postal code"
                    />
                  </v-col>
                  <v-col cols="12">
                    <div class="fl mt-3 mb-1">
                      Address <span class="req">*</span>
                    </div>
                    <div class="fl-sub mb-1">ที่อยู่</div>
                    <v-textarea
                      v-model="form.foreignAddress"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details="auto"
                      :rules="[rules.required]"
                      rows="3"
                      placeholder="House No., Street, City, State / Province..."
                    />
                  </v-col>
                </template>

                <!-- ── ที่อยู่ไทย (สัมพันธ์) ── -->
                <template v-else>
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">
                      บ้านเลขที่ / อาคาร <span class="req">*</span>
                    </div>
                    <div class="fl-sub mb-1">House No. / Building</div>
                    <v-text-field
                      v-model="form.houseNo"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details="auto"
                      :rules="[rules.required]"
                      placeholder="เช่น 88/1 อาคาร..."
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">ถนน</div>
                    <div class="fl-sub mb-1">Road</div>
                    <v-text-field
                      v-model="form.road"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details
                      placeholder="เช่น ถนนพหลโยธิน"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">
                      จังหวัด <span class="req">*</span>
                    </div>
                    <div class="fl-sub mb-1">Province</div>
                    <v-autocomplete
                      v-model="form.province"
                      :items="provinces"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details="auto"
                      :rules="[rules.required]"
                      placeholder="เลือกจังหวัด"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">
                      เขต / อำเภอ <span class="req">*</span>
                    </div>
                    <div class="fl-sub mb-1">District</div>
                    <v-autocomplete
                      v-model="form.district"
                      :items="regDistricts"
                      :disabled="!form.province"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details="auto"
                      :rules="[rules.required]"
                      placeholder="เลือกเขต / อำเภอ"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">
                      แขวง / ตำบล <span class="req">*</span>
                    </div>
                    <div class="fl-sub mb-1">Sub-district</div>
                    <v-autocomplete
                      v-model="form.subdistrict"
                      :items="regSubdistricts"
                      :disabled="!form.district"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details="auto"
                      :rules="[rules.required]"
                      placeholder="เลือกแขวง / ตำบล"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="fl mt-3 mb-1">
                      รหัสไปรษณีย์ <span class="req">*</span>
                    </div>
                    <div class="fl-sub mb-1">Postal Code</div>
                    <v-text-field
                      v-model="form.zipCode"
                      variant="outlined"
                      density="compact"
                      rounded="lg"
                      hide-details="auto"
                      :rules="[rules.required]"
                      maxlength="5"
                      placeholder="XXXXX"
                    />
                  </v-col> </template
                ><!-- end ที่อยู่ไทย --> </template
              ><!-- end v-else -->
            </v-row>

            <!-- ── ระบบที่ใช้งาน (เจ้าหน้าที่เท่านั้น) ── -->
            <template v-if="isStaff">
              <v-divider class="my-5" />
              <div class="form-section-title mb-3">
                <v-icon icon="fas fa-desktop" size="13" class="mr-1" />
                ระบบที่ต้องการใช้งาน <span class="req">*</span>
              </div>
              <div class="text-caption text-medium-emphasis mb-3">
                เลือกได้มากกว่า 1 ระบบ
              </div>
              <v-row dense>
                <v-col
                  v-for="sys in staffSystemOptions"
                  :key="sys.value"
                  cols="12"
                  sm="12"
                >
                  <v-checkbox
                    v-model="form.staffSystems"
                    :value="sys.value"
                    :label="sys.label"
                    density="compact"
                    hide-details
                    color="info"
                    class="mb-1"
                  />
                </v-col>
              </v-row>
            </template>

            <template v-if="registrationMode !== 'thaid' && !isStaff">
              <v-divider class="my-5" />

              <!-- ── เอกสารประกอบ ── -->
              <div class="form-section-title mb-3">
                <v-icon icon="fas fa-paperclip" size="13" class="mr-1" />
                {{
                  registrationMode === "foreigner"
                    ? "Supporting Documents"
                    : "เอกสารประกอบ"
                }}
              </div>
              <v-row dense>
                <v-col v-if="registrationMode !== 'thaid'" cols="12">
                  <div class="fl mb-1">
                    {{
                      registrationMode === "foreigner"
                        ? "Passport Copy"
                        : "สำเนาบัตรประชาชน"
                    }}
                    <span class="req">*</span>
                  </div>
                  <div class="fl-sub mb-1">
                    {{
                      registrationMode === "foreigner"
                        ? "สำเนาหนังสือเดินทาง"
                        : "ID Card Copy"
                    }}
                  </div>
                  <v-file-input
                    v-model="form.idDoc"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                    :rules="[rules.requiredFile]"
                    prepend-icon=""
                    prepend-inner-icon="fas fa-paperclip"
                    accept=".pdf,.jpg,.jpeg,.png"
                    :placeholder="
                      registrationMode === 'foreigner'
                        ? 'Select file .pdf .jpg .png'
                        : 'เลือกไฟล์ .pdf .jpg .png'
                    "
                  />
                </v-col>
                <v-col v-if="registrationMode === 'foreigner'" cols="12">
                  <div class="fl mt-3 mb-1">Visa / Work Permit Copy</div>
                  <div class="fl-sub mb-1">
                    สำเนา Visa หรือใบอนุญาตทำงาน (ถ้ามี)
                  </div>
                  <v-file-input
                    v-model="form.visaDoc"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    prepend-icon=""
                    prepend-inner-icon="fas fa-paperclip"
                    accept=".pdf,.jpg,.jpeg,.png"
                    placeholder="Select file (optional)"
                  />
                </v-col>
              </v-row>
            </template>
          </v-form>

          <div class="step-actions mt-6">
            <v-btn
              variant="tonal"
              color="grey"
              size="large"
              rounded="lg"
              prepend-icon="fas fa-chevron-left"
              @click="prevStep"
            >
              ย้อนกลับ
            </v-btn>
            <v-btn
              color="primary"
              size="large"
              rounded="lg"
              style="flex: 1"
              append-icon="fas fa-chevron-right"
              @click="nextFromInfo"
            >
              ถัดไป
            </v-btn>
          </div>
        </div>

        <!-- ═══ Step 2: ตรวจสอบ & ยืนยัน ═══ -->
        <div v-else-if="currentStep === 2">
          <v-card variant="outlined" rounded="xl" class="mb-5">
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-2 mb-4">
                <div class="summary-icon-box">
                  <v-icon
                    icon="fas fa-clipboard-list"
                    size="16"
                    color="primary"
                  />
                </div>
                <span class="text-body-2 font-weight-bold"
                  >สรุปข้อมูลการลงทะเบียน</span
                >
                <v-chip
                  size="x-small"
                  :color="registrationMode === 'foreigner' ? 'teal' : 'primary'"
                  variant="tonal"
                  class="ml-auto"
                >
                  {{
                    registrationMode === "foreigner"
                      ? "Foreigner"
                      : registrationMode === "thaid"
                        ? "ThaiD"
                        : "คนไทย (Manual)"
                  }}
                </v-chip>
              </div>

              <div class="confirm-row">
                <span class="confirm-label">ชื่อ-นามสกุล</span>
                <span class="confirm-value"
                  >{{ form.prefix }} {{ form.firstName }}
                  {{ form.lastName }}</span
                >
              </div>
              <div class="confirm-row">
                <span class="confirm-label">{{
                  registrationMode === "foreigner"
                    ? "Passport No."
                    : "เลขบัตรประชาชน"
                }}</span>
                <span class="confirm-value">
                  {{
                    registrationMode === "foreigner"
                      ? form.passportNo
                      : maskIdCard(form.idCard)
                  }}
                </span>
              </div>
              <div v-if="registrationMode === 'foreigner'" class="confirm-row">
                <span class="confirm-label">Nationality</span>
                <span class="confirm-value">{{ form.nationality }}</span>
              </div>
              <div v-if="registrationMode === 'foreigner'" class="confirm-row">
                <span class="confirm-label">Passport Expiry</span>
                <span class="confirm-value">{{ form.passportExpiry }}</span>
              </div>
              <v-divider class="my-3" />
              <div class="confirm-row">
                <span class="confirm-label">อีเมล</span>
                <span class="confirm-value">{{ form.email }}</span>
              </div>
              <div class="confirm-row">
                <span class="confirm-label">เบอร์โทรศัพท์</span>
                <span class="confirm-value">{{ form.phone }}</span>
              </div>
              <div v-if="!isStaff" class="confirm-row">
                <span class="confirm-label">ที่อยู่</span>
                <span class="confirm-value">
                  <template
                    v-if="
                      registrationMode === 'foreigner' &&
                      foreignerAddressType === 'foreign'
                    "
                  >
                    {{
                      [form.foreignAddress, form.zipCode, form.country]
                        .filter(Boolean)
                        .join(", ")
                    }}
                  </template>
                  <template v-else>
                    {{
                      [
                        form.houseNo,
                        form.road,
                        form.subdistrict,
                        form.district,
                        form.province,
                        form.zipCode,
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }}
                  </template>
                </span>
              </div>
              <div
                v-if="isStaff && form.staffSystems.length > 0"
                class="confirm-row"
              >
                <span class="confirm-label">ระบบที่ใช้งาน</span>
                <span class="confirm-value">
                  <div class="d-flex flex-wrap ga-1 mt-1">
                    <v-chip
                      v-for="s in form.staffSystems"
                      :key="s"
                      size="x-small"
                      color="info"
                      variant="tonal"
                    >
                      {{ staffSystemOptions.find((o) => o.value === s)?.label }}
                    </v-chip>
                  </div>
                </span>
              </div>
            </v-card-text>
          </v-card>

          <v-alert
            color="info"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-circle-info"
            class="mb-5"
          >
            <span class="text-body-2">
              หลังส่งคำขอ เจ้าหน้าที่จะตรวจสอบข้อมูลและอนุมัติสิทธิ์ภายใน
              <strong>3-5 วันทำการ</strong>
            </span>
          </v-alert>

          <v-checkbox
            v-model="form.acceptTerms"
            hide-details="auto"
            :rules="[(v) => !!v || 'กรุณายอมรับเงื่อนไข']"
            class="mb-5"
          >
            <template #label>
              <span class="text-body-2">
                ฉันยอมรับ
                <a href="#" class="text-primary text-decoration-none"
                  >นโยบายความเป็นส่วนตัว</a
                >
                และ
                <a href="#" class="text-primary text-decoration-none"
                  >เงื่อนไขการใช้งาน</a
                >
              </span>
            </template>
          </v-checkbox>

          <div class="step-actions">
            <v-btn
              variant="tonal"
              color="grey"
              size="large"
              rounded="lg"
              prepend-icon="fas fa-chevron-left"
              @click="prevStep"
            >
              ย้อนกลับ
            </v-btn>
            <v-btn
              color="primary"
              size="large"
              rounded="lg"
              style="flex: 1"
              prepend-icon="fas fa-paper-plane"
              :loading="loading"
              @click="doSubmit"
            >
              ส่งคำขอลงทะเบียน
            </v-btn>
          </div>
        </div>

        <!-- Login link -->
        <div class="login-row mt-6">
          <span class="text-body-2 text-medium-emphasis">มีบัญชีแล้ว?</span>
          <v-btn
            variant="text"
            size="small"
            color="primary"
            class="ml-1 pa-0"
            @click="goToLogin"
            >เข้าสู่ระบบ</v-btn
          >
        </div>

        <!-- Footer -->
        <div class="d-flex align-center justify-space-between mt-4">
          <v-btn
            variant="text"
            size="small"
            color="medium-emphasis"
            prepend-icon="fas fa-arrow-left"
            @click="goToPortal"
          >
            กลับหน้าหลัก
          </v-btn>
          <span class="text-caption text-medium-emphasis"
            >© 2569 กรมวิชาการเกษตร</span
          >
        </div>
      </div>
    </div>

    <!-- ═══ Success Dialog ═══ -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-paper-plane" size="36" color="primary" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งคำขอลงทะเบียนสำเร็จ!</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            ระบบได้รับคำขอของคุณแล้ว เจ้าหน้าที่จะตรวจสอบข้อมูลและอนุมัติสิทธิ์
          </p>

          <v-alert
            color="warning"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-clock"
            class="text-left mb-3"
          >
            <span class="text-body-2"
              >รอผลการอนุมัติภายใน <strong>3-5 วันทำการ</strong></span
            >
          </v-alert>
          <v-alert
            color="info"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-envelope"
            class="text-left"
          >
            <span class="text-body-2"
              >ระบบจะส่งอีเมลยืนยันและรหัสผ่านสำหรับการเข้าใช้งานไปที่
              <strong>{{ form.email }}</strong>
            </span>
          </v-alert>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn color="primary" block rounded="lg" @click="goToLogin"
            >กลับหน้าเข้าสู่ระบบ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();

const isStaff = computed(() => route.query.role === "staff");

const currentStep = ref(0);
const loading = ref(false);
const thaidLoading = ref(false);
const successDialog = ref(false);
const formRef = ref();

// 'thaid' | 'thai' | 'foreigner'
const registrationMode = ref(null);

// foreigner address type: 'thai' | 'foreign'
const foreignerAddressType = ref("thai");

const staffSystemOptions = [
  {
    value: "gap",
    label: "ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) พืช",
  },
  { value: "org", label: "ระบบการรับรองมาตรฐาน ORG (Organic Agriculture) พืช" },
  { value: "doa", label: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)" },
  {
    value: "cb",
    label:
      "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body : CB",
  },
  { value: "export", label: "ระบบจดทะเบียนผู้ส่งออก" },
  { value: "hc", label: "ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ" },
  { value: "hcex", label: "ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช" },
  {
    value: "el",
    label:
      "ระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment List: EL)",
  },
];

watch(registrationMode, () => {
  foreignerAddressType.value = "thai";
});

const passportExpiryMenu = ref(false);
const passportExpiryDate = ref(null);

function onPassportExpiryPick(val) {
  const d = new Date(val);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  form.value.passportExpiry = `${day}/${month}/${year}`;
  passportExpiryMenu.value = false;
}

const steps = [
  { key: "verify", label: "เลือกวิธี" },
  { key: "info", label: "กรอกข้อมูล" },
  { key: "confirm", label: "ยืนยัน" },
];

const form = ref({
  prefix: "",
  firstName: "",
  lastName: "",
  // Thai
  idCard: "",
  // Foreigner
  nationality: "",
  passportNo: "",
  passportExpiry: "",
  visaDoc: null,
  // Common
  email: "",
  phone: "",
  houseNo: "",
  road: "",
  subdistrict: "",
  district: "",
  province: "",
  zipCode: "",
  // Foreigner foreign address
  country: "",
  foreignAddress: "",
  idDoc: null,
  staffSystems: [],
  acceptTerms: false,
});

const features = [
  {
    icon: "fas fa-seedling",
    text: "ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) พืช",
  },
  {
    icon: "fas fa-leaf",
    text: "ระบบการรับรองมาตรฐาน ORG (Organic Agriculture) พืช",
  },
  {
    icon: "fas fa-industry",
    text: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)",
  },
  {
    icon: "fas fa-certificate",
    text: "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body : CB)",
  },
  { icon: "fas fa-ship", text: "ระบบจดทะเบียนผู้ส่งออก" },
  {
    icon: "fas fa-virus",
    text: "ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ",
  },
  {
    icon: "fas fa-file-medical",
    text: "ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช",
  },
  {
    icon: "fas fa-warehouse",
    text: "ระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment List: EL)",
  },
];

const addressData = {
  กรุงเทพมหานคร: {
    ห้วยขวาง: {
      zipCode: "10310",
      subdistricts: ["ห้วยขวาง", "บางกะปิ", "สามเสนนอก"],
    },
    บางรัก: {
      zipCode: "10500",
      subdistricts: ["บางรัก", "มหาพฤฒาราม", "สีลม", "สุริยวงศ์"],
    },
    ลาดพร้าว: { zipCode: "10230", subdistricts: ["ลาดพร้าว", "จรเข้บัว"] },
    จตุจักร: {
      zipCode: "10900",
      subdistricts: ["จตุจักร", "จอมพล", "เสนานิคม", "ลาดยาว", "จันทรเกษม"],
    },
    บึงกุ่ม: {
      zipCode: "10230",
      subdistricts: ["คลองกุ่ม", "นวมินทร์", "นวลจันทร์"],
    },
    บางกะปิ: { zipCode: "10240", subdistricts: ["คลองจั่น", "หัวหมาก"] },
  },
  เชียงใหม่: {
    เมืองเชียงใหม่: {
      zipCode: "50000",
      subdistricts: ["ศรีภูมิ", "พระสิงห์", "หายยา", "ช้างมอย", "ช้างคลาน"],
    },
    สันทราย: {
      zipCode: "50210",
      subdistricts: ["สันทรายหลวง", "สันทรายน้อย", "สันพระเนตร"],
    },
    หางดง: {
      zipCode: "50230",
      subdistricts: ["หางดง", "หนองควาย", "บ้านแหวน"],
    },
  },
  เชียงราย: {
    เมืองเชียงราย: {
      zipCode: "57000",
      subdistricts: ["เวียง", "รอบเวียง", "บ้านดู่", "นางแล"],
    },
    แม่จัน: {
      zipCode: "57110",
      subdistricts: ["แม่จัน", "จันจว้า", "แม่คำ", "ป่าซาง"],
    },
  },
  ขอนแก่น: {
    เมืองขอนแก่น: {
      zipCode: "40000",
      subdistricts: ["พระลับ", "สาวะถี", "บ้านทุ่ม", "เมืองเก่า"],
    },
    บ้านฝาง: {
      zipCode: "40270",
      subdistricts: ["บ้านฝาง", "ป่าหวายนั่ง", "โนนฆ้อง"],
    },
  },
  นครราชสีมา: {
    เมืองนครราชสีมา: {
      zipCode: "30000",
      subdistricts: ["ในเมือง", "โพธิ์กลาง", "หัวทะเล", "จอหอ"],
    },
    โชคชัย: { zipCode: "30190", subdistricts: ["โชคชัย", "กระโทก", "พลับพลา"] },
  },
  สงขลา: {
    เมืองสงขลา: {
      zipCode: "90000",
      subdistricts: ["บ่อยาง", "เขารูปช้าง", "เกาะแต้ว", "พะวง"],
    },
    หาดใหญ่: {
      zipCode: "90110",
      subdistricts: ["หาดใหญ่", "คลองแห", "คูเต่า", "คลองอู่ตะเภา"],
    },
  },
  ภูเก็ต: {
    เมืองภูเก็ต: {
      zipCode: "83000",
      subdistricts: ["ตลาดใหญ่", "ตลาดเหนือ", "เกาะแก้ว", "รัษฎา"],
    },
    กะทู้: { zipCode: "83120", subdistricts: ["กะทู้", "กมลา", "ป่าตอง"] },
    ถลาง: {
      zipCode: "83110",
      subdistricts: ["เทพกษัตรี", "ศรีสุนทร", "เชิงทะเล"],
    },
  },
  อุบลราชธานี: {
    เมืองอุบลราชธานี: {
      zipCode: "34000",
      subdistricts: ["ในเมือง", "ขามใหญ่", "แจระแม", "หัวเรือ"],
    },
    วารินชำราบ: {
      zipCode: "34190",
      subdistricts: ["วารินชำราบ", "ธาตุน้อย", "บุ่งหวาย"],
    },
  },
  นครปฐม: {
    เมืองนครปฐม: {
      zipCode: "73000",
      subdistricts: ["พระปฐมเจดีย์", "บางแขม", "พระประโทน", "สามควายเนียม"],
    },
    สามพราน: {
      zipCode: "73110",
      subdistricts: ["สามพราน", "ท่าข้าม", "หอมเกร็ด", "บางกระทึก"],
    },
  },
  ระยอง: {
    เมืองระยอง: {
      zipCode: "21000",
      subdistricts: ["ท่าประดู่", "เชิงเนิน", "ตะพง", "ปากน้ำ"],
    },
    มาบตาพุด: {
      zipCode: "21150",
      subdistricts: ["มาบตาพุด", "เนินพระ", "ทับมา"],
    },
  },
  ชลบุรี: {
    เมืองชลบุรี: {
      zipCode: "20000",
      subdistricts: ["บางปลาสร้อย", "มะขามหย่ง", "บ้านโขด"],
    },
    พัทยา: {
      zipCode: "20150",
      subdistricts: ["หนองปรือ", "หนองปลาไหล", "นาเกลือ"],
    },
    ศรีราชา: {
      zipCode: "20110",
      subdistricts: ["ศรีราชา", "สุรศักดิ์", "บึง", "หนองขาม"],
    },
  },
};

const provinces = Object.keys(addressData);

const regDistricts = computed(() =>
  form.value.province
    ? Object.keys(addressData[form.value.province] ?? {})
    : [],
);

const regSubdistricts = computed(() =>
  form.value.province && form.value.district
    ? (addressData[form.value.province]?.[form.value.district]?.subdistricts ??
      [])
    : [],
);

watch(
  () => form.value.province,
  () => {
    form.value.district = "";
    form.value.subdistrict = "";
    form.value.zipCode = "";
  },
);

watch(
  () => form.value.district,
  (newDistrict) => {
    form.value.subdistrict = "";
    if (form.value.province && newDistrict) {
      form.value.zipCode =
        addressData[form.value.province]?.[newDistrict]?.zipCode ?? "";
    }
  },
);

const nationalities = [
  "Chinese / จีน",
  "Japanese / ญี่ปุ่น",
  "Korean / เกาหลี",
  "American / อเมริกัน",
  "British / อังกฤษ",
  "French / ฝรั่งเศส",
  "German / เยอรมัน",
  "Australian / ออสเตรเลีย",
  "Indian / อินเดีย",
  "Vietnamese / เวียดนาม",
  "Myanmar / พม่า",
  "Cambodian / กัมพูชา",
  "Malaysian / มาเลเซีย",
  "Singaporean / สิงคโปร์",
  "Other / อื่นๆ",
];

const countries = [
  "Thailand / ไทย",
  "China / จีน",
  "Japan / ญี่ปุ่น",
  "South Korea / เกาหลีใต้",
  "United States / สหรัฐอเมริกา",
  "United Kingdom / สหราชอาณาจักร",
  "France / ฝรั่งเศส",
  "Germany / เยอรมนี",
  "Australia / ออสเตรเลีย",
  "India / อินเดีย",
  "Vietnam / เวียดนาม",
  "Myanmar / เมียนมา",
  "Cambodia / กัมพูชา",
  "Malaysia / มาเลเซีย",
  "Singapore / สิงคโปร์",
  "Indonesia / อินโดนีเซีย",
  "Philippines / ฟิลิปปินส์",
  "Laos / ลาว",
  "Taiwan / ไต้หวัน",
  "Hong Kong / ฮ่องกง",
  "Canada / แคนาดา",
  "Netherlands / เนเธอร์แลนด์",
  "Switzerland / สวิตเซอร์แลนด์",
  "Sweden / สวีเดน",
  "Denmark / เดนมาร์ก",
  "New Zealand / นิวซีแลนด์",
  "Other / อื่นๆ",
];

const rules = {
  required: (v) => !!v || "กรุณากรอกข้อมูล",
  email: (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
  thaiId: (v) =>
    !v || v.replace(/-/g, "").length === 13 || "เลขบัตรประชาชนต้องมี 13 หลัก",
  requiredFile: (v) => {
    if (!v) return "กรุณาแนบเอกสาร";
    if (Array.isArray(v)) return v.length > 0 || "กรุณาแนบเอกสาร";
    return true;
  },
};

function selectMode(mode) {
  registrationMode.value = mode;
  currentStep.value = 1;
}

function doThaiDVerify() {
  thaidLoading.value = true;
  setTimeout(() => {
    registrationMode.value = "thaid";
    thaidLoading.value = false;
    form.value.prefix = "นาย";
    form.value.firstName = "สมชาย";
    form.value.lastName = "ใจดี";
    form.value.idCard = "1100200123456";
    form.value.houseNo = "88/1";
    form.value.road = "ถนนลาดพร้าว";
    form.value.subdistrict = "คลองจั่น";
    form.value.district = "บางกะปิ";
    form.value.province = "กรุงเทพมหานคร";
    form.value.zipCode = "10240";
    currentStep.value = 1;
  }, 1200);
}

async function nextFromInfo() {
  if (!formRef.value) {
    currentStep.value = 2;
    return;
  }
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  currentStep.value = 2;
}

async function doSubmit() {
  if (!form.value.acceptTerms) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  loading.value = false;
  successDialog.value = true;
}

function prevStep() {
  currentStep.value--;
}

function goToLogin() {
  router.push({ name: "Login" });
}

function goToPortal() {
  router.push({ name: "Portal" });
}

function maskIdCard(v) {
  if (!v || v.length < 5) return v;
  return v.slice(0, 1) + "-XXXX-XXXXX-" + v.slice(-2);
}
</script>

<style scoped>
/* ThaiD hero */
.thaid-hero {
  border: 1.5px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 20px;
  padding: 36px 24px;
  text-align: center;
  background: rgba(var(--v-theme-primary), 0.02);
}
.thaid-icon-wrap {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* Mode cards */
.mode-card {
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition:
    border-color 0.15s,
    background 0.15s;
}
.mode-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  background: rgba(var(--v-theme-primary), 0.03);
}
.mode-card--active {
  border-color: rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.06) !important;
}
.mode-card--active.mode-card--foreign {
  border-color: rgb(var(--v-theme-teal)) !important;
  background: rgba(var(--v-theme-teal), 0.06) !important;
}
.mode-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mode-icon-box--thai {
  background: rgba(var(--v-theme-primary), 0.12);
}
.mode-icon-box--foreign {
  background: rgba(var(--v-theme-teal), 0.12);
}

/* Bilingual labels */
.addr-type-group {
  display: flex;
  gap: 8px;
}
.fl {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.87);
}
.fl-sub {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.45);
  font-weight: 400;
}
.req {
  color: rgb(var(--v-theme-error));
}

/* Form */
.form-section-title {
  font-size: 12px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: flex;
  align-items: center;
}
.autofill-field :deep(.v-field__input) {
  color: rgba(var(--v-theme-on-surface), 0.45) !important;
}
.autofill-field :deep(.v-field) {
  background: rgba(var(--v-border-color), 0.04) !important;
}

/* Step Actions */
.step-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.step-actions .v-btn:first-child {
  flex-shrink: 0;
  width: 130px;
}

/* Step 2 Summary */
.summary-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.confirm-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.5);
}
.confirm-row:last-child {
  border-bottom: none;
}
.confirm-label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-weight: 600;
}
.confirm-value {
  font-size: 13px;
  font-weight: 500;
  text-align: right;
}

/* Stepper */
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  transition:
    background 0.2s,
    color 0.2s;
}
.step-circle--active {
  background: rgb(var(--v-theme-primary));
  color: #fff;
}
.step-circle--done {
  background: rgb(var(--v-theme-primary));
  color: #fff;
}
.step-circle--pending {
  background: rgba(var(--v-theme-on-surface), 0.1);
  color: rgba(var(--v-theme-on-surface), 0.4);
}
.step-connector {
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.12);
  margin-bottom: 28px;
  transition: background 0.2s;
}
.step-connector--done {
  background: rgb(var(--v-theme-primary));
}

/* Bottom */
.login-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
