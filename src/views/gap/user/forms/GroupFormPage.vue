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
            prepend-icon="fas fa-users"
            >รายกลุ่ม</v-chip
          >
        </div>
        <h1 class="page-title mb-0">คำขอรับรองแหล่งผลิต GAP พืช (รายกลุ่ม)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          สำหรับกลุ่มเกษตรกร / วิสาหกิจชุมชน / สหกรณ์
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
      <!-- Step 1: ข้อมูลกลุ่ม -->
      <v-window-item :value="0">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-users</v-icon>
            <span class="text-subtitle-2">ข้อมูลกลุ่มเกษตรกร</span>
          </div>
          <v-card-text class="pt-5">
            <div class="field-section-label mb-3">ข้อมูลกลุ่ม</div>
            <v-row dense>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  <div>ชื่อกลุ่ม <span class="req">*</span></div>
                  <div class="field-label-en">Group Name</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.groupName"
                  placeholder="เช่น กลุ่มเกษตรกรทำนาบ้านทุ่งสวรรค์"
                  prepend-inner-icon="fas fa-users"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  เลขทะเบียนกลุ่ม
                  <div></div>
                  <div class="field-label-en">Group Registration No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.groupRegNo"
                  placeholder="เลขทะเบียน (ถ้ามี)"
                  prepend-inner-icon="fas fa-hashtag"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ประเภทกลุ่ม <span class="req">*</span></div>
                  <div class="field-label-en">Group Type</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.groupType"
                  :items="[
                    'กลุ่มเกษตรกร',
                    'วิสาหกิจชุมชน',
                    'สหกรณ์การเกษตร',
                    'กลุ่มแม่บ้านเกษตรกร',
                    'อื่นๆ',
                  ]"
                  prepend-inner-icon="fas fa-sitemap"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  จำนวนสมาชิก (คน)
                  <div></div>
                  <div class="field-label-en">No. of Members</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model.number="form.memberCount"
                  type="number"
                  :min="2"
                  prepend-inner-icon="fas fa-user-group"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12">
                <v-divider class="my-2" />
                <div class="field-section-label mt-3 mb-2">
                  ผู้แทนกลุ่ม / ผู้ประสานงาน
                  <span class="req" style="font-size: 12px">*</span>
                </div>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="field-label">
                  <div>คำนำหน้า</div>
                  <div class="field-label-en">Title</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.repPrefix"
                  :items="['นาย', 'นาง', 'นางสาว']"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  <div>ชื่อ <span class="req">*</span></div>
                  <div class="field-label-en">First Name</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.repFirstName"
                  placeholder="ชื่อจริง"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">
                  <div>นามสกุล <span class="req">*</span></div>
                  <div class="field-label-en">Last Name</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.repLastName"
                  placeholder="นามสกุล"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  เลขบัตรประชาชน <span class="req">*</span>
                  <div class="field-label-en">National ID No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.repIdCard"
                  placeholder="X-XXXX-XXXXX-XX-X"
                  prepend-inner-icon="fas fa-id-card"
                  :rules="[rules.required, rules.idCard]"
                  maxlength="13"
                  counter
                  hint="ตัวเลข 13 หลัก"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>เบอร์โทรศัพท์ <span class="req">*</span></div>
                  <div class="field-label-en">Phone Number</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.repPhone"
                  placeholder="0XX-XXX-XXXX"
                  prepend-inner-icon="fas fa-phone"
                  :rules="[rules.required, rules.phone]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>อีเมล</div>
                  <div class="field-label-en">Email</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.repEmail"
                  placeholder="example@email.com"
                  prepend-inner-icon="fas fa-envelope"
                  hint="ถ้ามี"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 2: รายชื่อสมาชิก -->
      <v-window-item :value="1">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-list-ul</v-icon>
            <span class="text-subtitle-2">รายชื่อสมาชิกกลุ่ม</span>
            <v-spacer />
            <v-btn
              size="small"
              color="gap-user"
              variant="tonal"
              prepend-icon="fas fa-plus"
              @click="addMember"
            >
              เพิ่มสมาชิก
            </v-btn>
          </div>
          <v-card-text class="pa-4">
            <v-alert
              v-if="members.length === 0"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              กดปุ่ม "เพิ่มสมาชิก" เพื่อเพิ่มรายชื่อสมาชิกในกลุ่ม
            </v-alert>

            <div
              v-for="(m, i) in members"
              :key="i"
              class="member-row mb-3 pa-4 rounded-xl"
            >
              <div class="d-flex align-center mb-3">
                <v-chip
                  size="small"
                  color="gap-user"
                  variant="tonal"
                  class="mr-2"
                  >สมาชิกที่ {{ i + 1 }}</v-chip
                >
                <v-spacer />
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  color="error"
                  @click="members.splice(i, 1)"
                >
                  <v-icon icon="fas fa-trash" size="14" />
                </v-btn>
              </div>
              <v-row dense>
                <v-col cols="12" sm="2">
                  <div class="field-label">
                    <div>คำนำหน้า</div>
                    <div class="field-label-en">Title</div>
                  </div>
                  <v-autocomplete
                    variant="outlined"
                    rounded="lg"
                    v-model="m.prefix"
                    :items="['นาย', 'นาง', 'นางสาว']"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>ชื่อ <span class="req">*</span></div>
                    <div class="field-label-en">First Name</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    rounded="lg"
                    v-model="m.firstName"
                    placeholder="ชื่อจริง"
                    density="compact"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    <div>นามสกุล</div>
                    <div class="field-label-en">Last Name</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    rounded="lg"
                    v-model="m.lastName"
                    placeholder="นามสกุล"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    เลขบัตรประชาชน
                    <div></div>
                    <div class="field-label-en">National ID No.</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    rounded="lg"
                    v-model="m.idCard"
                    placeholder="13 หลัก"
                    maxlength="13"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>ชนิดพืช</div>
                    <div class="field-label-en">Crop Type</div>
                  </div>
                  <v-autocomplete
                    variant="outlined"
                    rounded="lg"
                    v-model="m.crops"
                    :items="cropTypes"
                    multiple
                    chips
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>พื้นที่ (ไร่)</div>
                    <div class="field-label-en">Area (Rai)</div>
                  </div>
                  <v-text-field
                    variant="outlined"
                    rounded="lg"
                    v-model.number="m.area"
                    type="number"
                    suffix="ไร่"
                    density="compact"
                    hide-details
                    :min="0"
                  />
                </v-col>
              </v-row>
            </div>

            <v-btn
              v-if="members.length > 0"
              block
              variant="tonal"
              color="gap-user"
              prepend-icon="fas fa-plus"
              class="mt-2"
              @click="addMember"
            >
              เพิ่มสมาชิก
            </v-btn>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 3: ที่อยู่ + แปลง (รวม) -->
      <v-window-item :value="2">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-location-dot</v-icon>
            <span class="text-subtitle-2"
              >ที่อยู่สำนักงานกลุ่ม / แหล่งผลิตหลัก</span
            >
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="9">
                <div class="field-label">
                  <div>ที่อยู่ <span class="req">*</span></div>
                  <div class="field-label-en">Address</div>
                </div>
                <v-textarea
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.address"
                  placeholder="บ้านเลขที่ / หมู่ที่ / ซอย / ถนน"
                  prepend-inner-icon="fas fa-house"
                  rows="2"
                  auto-grow
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
                  maxlength="5"
                  prepend-inner-icon="fas fa-map-pin"
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
                  v-model="form.province"
                  :items="provinces"
                  prepend-inner-icon="fas fa-map"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>อำเภอ / เขต</div>
                  <div class="field-label-en">District</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.district"
                  :items="['อำเภอเมือง', 'อำเภอปากช่อง']"
                  prepend-inner-icon="fas fa-city"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  <div>ตำบล / แขวง</div>
                  <div class="field-label-en">Sub-district</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.subDistrict"
                  :items="['ตำบลในเมือง', 'ตำบลโพธิ์กลาง']"
                  prepend-inner-icon="fas fa-map-pin"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-seedling</v-icon>
            <span class="text-subtitle-2">ข้อมูลการผลิตรวมกลุ่ม</span>
          </div>
          <v-card-text class="pt-5">
            <div class="field-section-label mb-3">ข้อมูลการผลิต</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  ชนิดพืชหลัก (รวมกลุ่ม) <span class="req">*</span>
                  <div class="field-label-en">Main Crop Type (Group)</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.cropTypes"
                  :items="cropTypes"
                  prepend-inner-icon="fas fa-seedling"
                  multiple
                  chips
                  closable-chips
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ผู้ตรวจประเมิน</div>
                  <div class="field-label-en">Inspector</div>
                </div>
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.inspector"
                  :items="inspectors"
                  prepend-inner-icon="fas fa-user-check"
                  clearable
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  พื้นที่รวมทั้งกลุ่ม (ไร่)
                  <div></div>
                  <div class="field-label-en">Total Group Area (Rai)</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model.number="form.totalArea"
                  type="number"
                  suffix="ไร่"
                  prepend-inner-icon="fas fa-ruler-combined"
                  hide-details="auto"
                  :min="0"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  ข้อกำหนด GAP
                  <div></div>
                  <div class="field-label-en">GAP Requirements</div>
                </div>
                <div class="rounded-lg pa-3 bg-surface-variant">
                  <v-checkbox
                    v-model="form.water"
                    label="มีแหล่งน้ำในพื้นที่"
                    color="gap-user"
                    density="compact"
                    hide-details
                    class="mb-1"
                  />
                  <v-checkbox
                    v-model="form.record"
                    label="มีการบันทึกการผลิต"
                    color="gap-user"
                    density="compact"
                    hide-details
                    class="mb-1"
                  />
                  <v-checkbox
                    v-model="form.chemical"
                    label="บันทึกการใช้สารเคมี"
                    color="warning"
                    density="compact"
                    hide-details
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 4: เอกสาร -->
      <v-window-item :value="3">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-paperclip</v-icon>
            <span class="text-subtitle-2">เอกสารและหลักฐาน</span>
            <v-spacer />
            <v-chip size="x-small" variant="tonal" color="warning"
              >ไม่เกินไฟล์ละ 10 MB</v-chip
            >
          </div>
          <v-card-text class="pt-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  เอกสารกลุ่ม (ทะเบียนกลุ่ม, รายชื่อสมาชิก)
                  <div></div>
                  <div class="field-label-en">Group Documents</div>
                </div>
                <v-file-input
                  v-model="form.groupDocs"
                  accept=".pdf,.doc,.docx"
                  multiple
                  show-size
                  chips
                  hint="รองรับ PDF, DOC"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  เอกสารแปลง (สำเนาโฉนด, ผลวิเคราะห์น้ำ)
                  <div></div>
                  <div class="field-label-en">Plot Documents</div>
                </div>
                <v-file-input
                  v-model="form.docs"
                  accept=".pdf,.doc,.docx"
                  multiple
                  show-size
                  chips
                  hint="รองรับ PDF, DOC"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>รูปภาพแปลงปลูก</div>
                  <div class="field-label-en">Plot Photos</div>
                </div>
                <v-file-input
                  v-model="form.photos"
                  prepend-icon="fas fa-camera"
                  accept="image/*"
                  multiple
                  show-size
                  chips
                  hint="JPG, PNG"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 5: ตรวจสอบ -->
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
                  <v-list-item subtitle="ชื่อกลุ่ม"
                    ><v-list-item-title>{{
                      form.groupName || "-"
                    }}</v-list-item-title></v-list-item
                  >
                  <v-list-item subtitle="ประเภทกลุ่ม"
                    ><v-list-item-title>{{
                      form.groupType || "-"
                    }}</v-list-item-title></v-list-item
                  >
                  <v-list-item subtitle="ผู้แทนกลุ่ม"
                    ><v-list-item-title
                      >{{ form.repPrefix }} {{ form.repFirstName }}
                      {{ form.repLastName }}</v-list-item-title
                    ></v-list-item
                  >
                  <v-list-item subtitle="จำนวนสมาชิก"
                    ><v-list-item-title
                      >{{ members.length }} คน (กรอกแล้ว) /
                      {{ form.memberCount }} คน (ระบุ)</v-list-item-title
                    ></v-list-item
                  >
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ชนิดพืชหลัก"
                    ><v-list-item-title>{{
                      form.cropTypes.join(", ") || "-"
                    }}</v-list-item-title></v-list-item
                  >
                  <v-list-item subtitle="พื้นที่รวม"
                    ><v-list-item-title
                      >{{ form.totalArea }} ไร่</v-list-item-title
                    ></v-list-item
                  >
                  <v-list-item subtitle="จังหวัด"
                    ><v-list-item-title>{{
                      form.province || "-"
                    }}</v-list-item-title></v-list-item
                  >
                  <v-list-item subtitle="ประเภทคำขอ"
                    ><v-list-item-title
                      >รายกลุ่ม</v-list-item-title
                    ></v-list-item
                  >
                </v-list>
              </v-col>
            </v-row>
            <v-alert
              type="info"
              variant="tonal"
              class="mt-4"
              prepend-icon="fas fa-circle-info"
            >
              กรุณาตรวจสอบข้อมูลให้ถูกต้อง
              โดยเฉพาะรายชื่อสมาชิกและพื้นที่แปลงก่อนยื่น
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
          <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h2>
          <p class="text-body-2 text-medium-emphasis mb-5">
            เลขที่คำขอ: <strong class="text-gap-user">GAP-2569-012</strong
            ><br />
            ประเภท: <strong>รายกลุ่ม</strong> · สมาชิก
            {{ members.length }} คน<br />
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
import { ref } from "vue";
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
  { value: 0, title: "ข้อมูลกลุ่ม" },
  { value: 1, title: "รายชื่อสมาชิก" },
  { value: 2, title: "แปลงผลิต" },
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

const members = ref([]);
function addMember() {
  members.value.push({
    prefix: "นาย",
    firstName: "",
    lastName: "",
    idCard: "",
    crops: [],
    area: 0,
  });
}

const form = ref({
  groupName: "",
  groupRegNo: "",
  groupType: null,
  memberCount: 2,
  repPrefix: "นาย",
  repFirstName: "",
  repLastName: "",
  repIdCard: "",
  repPhone: "",
  repEmail: "",
  address: "",
  postalCode: "",
  province: null,
  district: null,
  subDistrict: null,
  cropTypes: [],
  inspector: null,
  totalArea: 0,
  water: true,
  record: false,
  chemical: false,
  docs: [],
  groupDocs: [],
  photos: [],
});

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
];
const cropTypes = [
  "ข้าวหอมมะลิ",
  "ข้าวโพด",
  "มันสำปะหลัง",
  "อ้อย",
  "ผักกาดขาว",
  "มะเขือเทศ",
];
const inspectors = [
  "นาย วิจัย ตรวจดี",
  "นาง สุดา ประเมิน",
  "นาย ชัยวัฒน์ ผลตรวจ",
];
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-gap-user));
  --step-color-tint: rgba(var(--v-theme-gap-user), 0.2);
}
.member-row {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface-variant), 0.5);
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
