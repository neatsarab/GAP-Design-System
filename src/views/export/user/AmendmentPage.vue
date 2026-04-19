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
                  placeholder="เช่น EXP-2569-12345"
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

          <!-- Amendment Matrix -->
          <v-card
            v-if="selected.length > 0"
            rounded="xl"
            elevation="0"
            class="section-card mb-4"
          >
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-table-cells" color="export-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >เลือกรายการที่ต้องการแก้ไข</span
              >
              <v-chip
                size="x-small"
                color="export-user"
                variant="tonal"
                class="ml-1"
              >
                คลิกช่องเพื่อเลือก
              </v-chip>
            </div>
            <v-card-text class="pa-4">
              <div class="matrix-wrapper">
                <table class="amend-matrix w-100">
                  <thead>
                    <tr>
                      <th class="matrix-cert-col text-left">ใบทะเบียน</th>
                      <th
                        v-for="item in amendItems"
                        :key="item.value"
                        class="matrix-type-col text-center"
                      >
                        <div class="text-caption font-weight-bold">
                          {{ item.label }}
                        </div>
                        <div
                          class="text-caption text-medium-emphasis"
                          style="font-size: 10px"
                        >
                          {{ item.labelEn }}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="cert in selected"
                      :key="cert.certNo"
                      class="matrix-row"
                    >
                      <td class="matrix-cert-col py-2 px-3">
                        <div
                          class="text-body-2 font-weight-bold text-export-user"
                        >
                          {{ cert.certNo }}
                        </div>
                        <div
                          class="text-caption text-medium-emphasis"
                          style="max-width: 200px; line-height: 1.3"
                        >
                          {{ cert.typecert }}
                        </div>
                      </td>
                      <td
                        v-for="item in amendItems"
                        :key="item.value"
                        class="matrix-type-col text-center"
                        :class="{
                          'matrix-cell--checked': certHasAmend(
                            cert.certNo,
                            item.value,
                          ),
                        }"
                        @click="toggleCertAmend(cert.certNo, item.value)"
                      >
                        <v-icon
                          :icon="
                            certHasAmend(cert.certNo, item.value)
                              ? 'fas fa-circle-check'
                              : 'far fa-circle'
                          "
                          :color="
                            certHasAmend(cert.certNo, item.value)
                              ? 'export-user'
                              : 'grey-lighten-1'
                          "
                          size="20"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-card-text>
          </v-card>

          <!-- Per-cert amendment forms -->
          <template v-for="cert in selected" :key="'form-' + cert.certNo">
            <v-card
              v-if="hasCertAmend(cert.certNo)"
              rounded="xl"
              elevation="0"
              class="section-card mb-4"
            >
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2 flex-wrap"
                style="cursor: pointer"
                @click="toggleCertExpand(cert.certNo)"
              >
                <v-icon
                  icon="fas fa-certificate"
                  color="export-user"
                  size="15"
                />
                <span
                  class="text-subtitle-2 font-weight-bold text-export-user"
                  >{{ cert.certNo }}</span
                >
                <span
                  class="text-caption text-medium-emphasis flex-grow-1 text-truncate"
                  >— {{ cert.typecert }}</span
                >
                <div class="d-flex flex-wrap ga-1 align-center">
                  <v-chip
                    v-for="item in amendItems.filter((i) =>
                      certHasAmend(cert.certNo, i.value),
                    )"
                    :key="item.value"
                    size="x-small"
                    color="export-user"
                    variant="tonal"
                    label
                    >{{ item.label }}</v-chip
                  >
                  <v-icon
                    :icon="isCertExpanded(cert.certNo) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
                    size="12"
                    color="grey"
                    class="ml-1"
                  />
                </div>
              </div>
              <v-expand-transition>
              <v-card-text v-if="isCertExpanded(cert.certNo)" class="pa-5">
                <!-- ชื่อสถานประกอบการ -->
                <template v-if="certHasAmend(cert.certNo, 'company_name')">
                  <div class="amend-section-block mb-3">
                  <div class="field-section-label mb-1">ชื่อสถานประกอบการ</div>
                  <div class="field-section-sub mb-2">
                    ข้อมูลปัจจุบัน (บนใบทะเบียน)
                  </div>
                  <v-row dense class="mb-3">
                    <v-col cols="12" sm="6">
                      <div class="field-label">
                        <div>ชื่อสถานประกอบการ (ภาษาไทย)</div>
                        <div class="field-label-en">Company Name (Thai)</div>
                      </div>
                      <v-text-field
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="cert.companyNameTh ?? '-'"
                        readonly
                        class="field-readonly"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="field-label">
                        <div>ชื่อสถานประกอบการ (ภาษาอังกฤษ)</div>
                        <div class="field-label-en">Company Name (English)</div>
                      </div>
                      <v-text-field
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        :model-value="cert.companyNameEn ?? '-'"
                        readonly
                        class="field-readonly"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <div class="field-section-sub mb-2">ข้อมูลใหม่ (DBD)</div>
                  <v-row dense class="mb-4">
                    <v-col cols="12" sm="6">
                      <div class="field-label">
                        <div>ชื่อสถานประกอบการ (ภาษาไทย)</div>
                        <div class="field-label-en">Company Name (Thai)</div>
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
                        <div class="field-label-en">Company Name (English)</div>
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
                  </div>
                </template>

                <!-- ที่อยู่สถานประกอบการ -->
                <template v-if="certHasAmend(cert.certNo, 'address')">
                  <div class="amend-section-block mb-3">
                  <div class="field-section-label mb-1">
                    ที่อยู่สถานประกอบการ
                  </div>
                  <div class="field-section-sub mb-2">
                    ข้อมูลปัจจุบัน (บนใบทะเบียน)
                  </div>
                  <v-row dense class="mb-4">
                    <v-col cols="6" sm="3">
                      <div class="field-label">
                        <div>บ้านเลขที่</div>
                        <div class="field-label-en">House No.</div>
                      </div>
                      <v-text-field
                        :model-value="cert.houseNo ?? '-'"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
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
                        :model-value="cert.alley ?? '-'"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
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
                        :model-value="cert.road ?? '-'"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
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
                        :model-value="cert.tambol ?? '-'"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
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
                        :model-value="cert.district ?? '-'"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
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
                        :model-value="cert.province ?? '-'"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
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
                        :model-value="cert.zipcode ?? '-'"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        readonly
                        class="field-readonly"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <div class="field-section-sub mb-2">
                    ที่อยู่ใหม่ที่ต้องการ <span class="req">*</span>
                  </div>
                  <v-row dense class="mb-3">
                    <v-col cols="12" sm="6">
                      <div class="field-label">
                        <div>เลือกสาขา / สำนักงานใหญ่ (SSO)</div>
                        <div class="field-label-en">
                          Select Branch / HQ from SSO
                        </div>
                      </div>
                      <v-autocomplete
                        v-model="perCertData[cert.certNo].addressBranch"
                        :items="ssoBranches"
                        item-title="label"
                        item-value="id"
                        placeholder="เลือกสาขา"
                        density="compact"
                        variant="outlined"
                        rounded="lg"
                        hide-details
                        clearable
                        prepend-inner-icon="fas fa-building"
                      />
                    </v-col>
                  </v-row>
                  <v-expand-transition>
                    <div v-if="getSelectedBranch(cert.certNo)" class="mt-1">
                      <div
                        class="text-caption font-weight-medium text-medium-emphasis mb-2"
                      >
                        ภาษาไทย
                      </div>
                      <v-row dense class="mb-3">
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>บ้านเลขที่</div>
                            <div class="field-label-en">House No.</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).houseNo
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>ตรอก / ซอย</div>
                            <div class="field-label-en">Alley / Soi</div>
                          </div>
                          <v-text-field
                            :model-value="getSelectedBranch(cert.certNo).alley"
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>ถนน</div>
                            <div class="field-label-en">Road</div>
                          </div>
                          <v-text-field
                            :model-value="getSelectedBranch(cert.certNo).road"
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>ตำบล / แขวง</div>
                            <div class="field-label-en">Sub-district</div>
                          </div>
                          <v-text-field
                            :model-value="getSelectedBranch(cert.certNo).tambol"
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>อำเภอ / เขต</div>
                            <div class="field-label-en">District</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).district
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>จังหวัด</div>
                            <div class="field-label-en">Province</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).province
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>รหัสไปรษณีย์</div>
                            <div class="field-label-en">Postcode</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).zipcode
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                      </v-row>
                      <v-divider class="my-3" />
                      <div
                        class="text-caption font-weight-medium text-medium-emphasis mb-2"
                      >
                        English
                      </div>
                      <v-row dense>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>บ้านเลขที่</div>
                            <div class="field-label-en">House No.</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).houseNoEn
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>ตรอก / ซอย</div>
                            <div class="field-label-en">Alley / Soi</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).alleyEn
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>ถนน</div>
                            <div class="field-label-en">Road</div>
                          </div>
                          <v-text-field
                            :model-value="getSelectedBranch(cert.certNo).roadEn"
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>ตำบล / แขวง</div>
                            <div class="field-label-en">Sub-district</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).tambolEn
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>อำเภอ / เขต</div>
                            <div class="field-label-en">District</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).districtEn
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                        <v-col cols="6" sm="3"
                          ><div class="field-label">
                            <div>จังหวัด</div>
                            <div class="field-label-en">Province</div>
                          </div>
                          <v-text-field
                            :model-value="
                              getSelectedBranch(cert.certNo).provinceEn
                            "
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            readonly
                            class="field-readonly"
                            hide-details
                        /></v-col>
                      </v-row>
                    </div>
                  </v-expand-transition>
                  </div>
                </template>

                <!-- ข้อมูลโรงงานผลิตสินค้าพืช -->
                <template v-if="certHasAmend(cert.certNo, 'factory')">
                  <div class="amend-section-block mb-3">
                  <div class="field-section-label mb-1">
                    ข้อมูลโรงงานผลิตสินค้าพืช
                  </div>
                  <div class="field-section-sub mb-2">
                    ข้อมูลปัจจุบัน (บนใบทะเบียน)
                  </div>
                  <v-data-table
                    :headers="factoryHeaders"
                    :items="cert.factories"
                    density="compact"
                    :hide-default-footer="true"
                    no-data-text="ไม่มีข้อมูลโรงงานบนใบทะเบียน"
                    class="mb-4 rounded-lg border-table"
                  >
                    <template #item.no="{ index }">{{ index + 1 }}</template>
                  </v-data-table>
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="field-section-sub mb-0">
                      ข้อมูลโรงงานใหม่ที่ต้องการ
                    </div>
                    <v-btn
                      color="export-user"
                      variant="tonal"
                      prepend-icon="fas fa-plus"
                      size="small"
                      @click="openFactoryDialog(cert.certNo)"
                      >เพิ่มโรงงาน</v-btn
                    >
                  </div>
                  <v-data-table
                    :headers="factoryEditHeaders"
                    :items="perCertData[cert.certNo]?.factories ?? []"
                    density="compact"
                    :hide-default-footer="
                      (perCertData[cert.certNo]?.factories?.length ?? 0) <= 10
                    "
                    no-data-text="ยังไม่มีข้อมูล กรุณากดเพิ่มโรงงาน"
                    class="rounded-lg border-table mb-4"
                  >
                    <template #item.no="{ index }">{{ index + 1 }}</template>
                    <template #item.actions="{ index }">
                      <div class="d-flex align-center">
                        <v-btn
                          icon="fas fa-pen"
                          size="x-small"
                          variant="text"
                          color="export-user"
                          @click="openFactoryDialog(cert.certNo, index)"
                        />
                        <v-btn
                          icon="fas fa-trash"
                          size="x-small"
                          variant="text"
                          color="error"
                          @click="
                            perCertData[cert.certNo].factories.splice(index, 1)
                          "
                        />
                      </div>
                    </template>
                  </v-data-table>
                  </div>
                </template>

                <!-- ข้อมูลแหล่งผลิตพืชที่ได้รับการรับรอง GAP -->
                <template v-if="certHasAmend(cert.certNo, 'gap')">
                  <div class="amend-section-block">
                  <div class="field-section-label mb-1">
                    ข้อมูลแหล่งผลิตพืชที่ได้รับการรับรอง GAP
                  </div>
                  <div class="field-section-sub mb-2">
                    ข้อมูลปัจจุบัน (บนใบทะเบียน)
                  </div>
                  <v-data-table
                    :headers="gapHeaders"
                    :items="cert.gapSites"
                    density="compact"
                    :hide-default-footer="true"
                    no-data-text="ไม่มีข้อมูลแหล่งผลิต GAP บนใบทะเบียน"
                    class="mb-4 rounded-lg border-table"
                  >
                    <template #item.no="{ index }">{{ index + 1 }}</template>
                  </v-data-table>
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="field-section-sub mb-0">
                      แหล่งผลิต GAP ใหม่ที่ต้องการ
                    </div>
                    <v-btn
                      color="export-user"
                      variant="tonal"
                      prepend-icon="fas fa-plus"
                      size="small"
                      @click="openGapDialog(cert.certNo)"
                      >เพิ่มแหล่งผลิต</v-btn
                    >
                  </div>
                  <v-data-table
                    :headers="gapEditHeaders"
                    :items="perCertData[cert.certNo]?.gapSites ?? []"
                    density="compact"
                    :hide-default-footer="
                      (perCertData[cert.certNo]?.gapSites?.length ?? 0) <= 10
                    "
                    no-data-text="ยังไม่มีข้อมูล กรุณากดเพิ่มแหล่งผลิต"
                    class="rounded-lg border-table"
                  >
                    <template #item.no="{ index }">{{ index + 1 }}</template>
                    <template #item.actions="{ index }">
                      <div class="d-flex align-center">
                        <v-btn
                          icon="fas fa-pen"
                          size="x-small"
                          variant="text"
                          color="export-user"
                          @click="openGapDialog(cert.certNo, index)"
                        />
                        <v-btn
                          icon="fas fa-trash"
                          size="x-small"
                          variant="text"
                          color="error"
                          @click="
                            perCertData[cert.certNo].gapSites.splice(index, 1)
                          "
                        />
                      </div>
                    </template>
                  </v-data-table>
                  </div>
                </template>
              </v-card-text>
              </v-expand-transition>
            </v-card>
          </template>
        </v-col>

        <!-- Right: Selected (sticky) -->
        <v-col cols="12" md="4">
          <div class="sticky-col">
            <v-card rounded="xl" elevation="0" class="section-card">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
                style="cursor: pointer"
                @click="showCertList = !showCertList"
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
                  class="mr-1"
                >
                  {{ selected.length }} รายการ
                </v-chip>
                <v-icon
                  :icon="
                    showCertList ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
                  "
                  size="12"
                  color="grey"
                />
              </div>
              <v-expand-transition>
                <v-card-text
                  v-if="showCertList"
                  class="pa-3"
                  style="max-height: 280px; overflow-y: auto"
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
                      <div
                        class="text-body-2 font-weight-bold text-export-user"
                      >
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
              </v-expand-transition>
              <v-divider />
              <!-- Amendment summary -->
              <v-card-text class="pa-3 pb-2" v-if="amendTypes.length > 0">
                <div
                  class="text-caption font-weight-bold text-medium-emphasis mb-2"
                >
                  รายการแก้ไข
                </div>
                <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    v-for="aItem in amendItems.filter((i) =>
                      amendTypes.includes(i.value),
                    )"
                    :key="aItem.value"
                    size="x-small"
                    color="export-user"
                    variant="tonal"
                    label
                  >
                    {{ aItem.label }}
                  </v-chip>
                </div>
              </v-card-text>
              <v-divider v-if="amendTypes.length > 0" />
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
          {{
            dialogEditIndex !== null ? "แก้ไขข้อมูลโรงงาน" : "เพิ่มข้อมูลโรงงาน"
          }}
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
          {{
            dialogEditIndex !== null
              ? "แก้ไขแหล่งผลิต GAP"
              : "เพิ่มแหล่งผลิต GAP"
          }}
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
// Per-cert amendment selection: { [amendValue]: string[] of certNos }
const certAmendTypes = reactive({});

// Derived: which amendment types have at least one cert selected
const amendTypes = computed(() =>
  amendItems
    .map((i) => i.value)
    .filter((v) => (certAmendTypes[v]?.length ?? 0) > 0),
);

function certHasAmend(certNo, amendValue) {
  return certAmendTypes[amendValue]?.includes(certNo) ?? false;
}

function hasCertAmend(certNo) {
  return amendItems.some((i) => certHasAmend(certNo, i.value));
}

function toggleCertAmend(certNo, amendValue) {
  if (!certAmendTypes[amendValue]) {
    certAmendTypes[amendValue] = [];
  }
  const idx = certAmendTypes[amendValue].indexOf(certNo);
  if (idx >= 0) {
    certAmendTypes[amendValue].splice(idx, 1);
  } else {
    certAmendTypes[amendValue].push(certNo);
  }
}

function amendItemLabel(value) {
  return amendItems.find((i) => i.value === value)?.label ?? value;
}

// ── Mock DBD / SSO fetched data (read-only from external source) ────
const dbdData = {
  companyNameTh: "บริษัท สยามเกษตรส่งออก จำกัด",
  companyNameEn: "Siam Agriculture Export Co., Ltd.",
};
const ssoBranches = [
  {
    id: "HQ",
    label: "สำนักงานใหญ่",
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
  },
  {
    id: "BR1",
    label: "สาขา 1 - นนทบุรี",
    houseNo: "88/12",
    alley: "",
    road: "ถนนติวานนท์",
    tambol: "บางกระสอ",
    district: "เมืองนนทบุรี",
    province: "นนทบุรี",
    zipcode: "11000",
    houseNoEn: "88/12",
    alleyEn: "",
    roadEn: "Tiwanon Rd.",
    tambolEn: "Bang Kraso",
    districtEn: "Mueang Nonthaburi",
    provinceEn: "Nonthaburi",
  },
  {
    id: "BR2",
    label: "สาขา 2 - เชียงใหม่",
    houseNo: "22/5",
    alley: "ซอยนิมมาน 13",
    road: "ถนนนิมมานเหมินทร์",
    tambol: "สุเทพ",
    district: "เมืองเชียงใหม่",
    province: "เชียงใหม่",
    zipcode: "50200",
    houseNoEn: "22/5",
    alleyEn: "Nimman Soi 13",
    roadEn: "Nimman Hemin Rd.",
    tambolEn: "Su Thep",
    districtEn: "Mueang Chiang Mai",
    provinceEn: "Chiang Mai",
  },
];

function getSelectedBranch(certNo) {
  const branchId = perCertData[certNo]?.addressBranch;
  if (!branchId) return null;
  return ssoBranches.find((b) => b.id === branchId) ?? null;
}

// ── Per-cert editable data ───────────────────────────
const perCertData = reactive({});

// ── Mock certificate data ───────────────────────────
const allCerts = [
  {
    certNo: "EXP-2569-10001",
    typecert: "หนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
    issuedDate: "14/03/2567",
    expireDate: "14/03/2569",
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
      { certNo: "GAP-2568-00123", cropName: "ข้าว", province: "นครราชสีมา" },
    ],
  },
  {
    certNo: "EXP-2569-10002",
    typecert: "หนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    issuedDate: "09/08/2567",
    expireDate: "09/08/2569",
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
      { certNo: "GAP-2568-00456", cropName: "กล้วยหอม", province: "กำแพงเพชร" },
    ],
  },
  {
    certNo: "EXP-2569-10003",
    typecert: "ทะเบียนผู้ส่งออกพืชควบคุม",
    issuedDate: "01/01/2567",
    expireDate: "15/04/2569",
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
    certNo: "EXP-2569-10004",
    typecert:
      "หนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งผลทุเรียนสดออกไปนอกราชอาณาจักร",
    issuedDate: "19/02/2565",
    expireDate: "19/02/2567",
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
    certNo: "EXP-2569-10005",
    typecert: "ทะเบียนผู้ส่งออกสินค้าเกษตรไปนอกราชอาณาจักร",
    issuedDate: "04/05/2567",
    expireDate: "04/05/2569",
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
const showCertList = ref(true);

// ── Collapse/expand per-cert form cards ─────────────
const expandedCerts = reactive(new Set());

function toggleCertExpand(certNo) {
  if (expandedCerts.has(certNo)) {
    expandedCerts.delete(certNo);
  } else {
    expandedCerts.add(certNo);
  }
}

function isCertExpanded(certNo) {
  return expandedCerts.has(certNo);
}

function isSelected(certNo) {
  return selected.value.some((c) => c.certNo === certNo);
}
function addToSelection(cert) {
  if (!isSelected(cert.certNo)) {
    selected.value.push(cert);
    perCertData[cert.certNo] = {
      factories: cert.factories.map((f) => ({ ...f })),
      gapSites: cert.gapSites.map((g) => ({ ...g })),
      addressBranch: null,
    };
    expandedCerts.add(cert.certNo);
  }
}
function removeFromSelection(certNo) {
  selected.value = selected.value.filter((c) => c.certNo !== certNo);
  delete perCertData[certNo];
  expandedCerts.delete(certNo);
  Object.keys(certAmendTypes).forEach((v) => {
    const idx = certAmendTypes[v].indexOf(certNo);
    if (idx >= 0) certAmendTypes[v].splice(idx, 1);
  });
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
const dialogCertNo = ref("");
const dialogEditIndex = ref(null);

function openFactoryDialog(certNo, editIndex = null) {
  dialogCertNo.value = certNo;
  dialogEditIndex.value = editIndex;
  if (editIndex !== null) {
    const row = perCertData[certNo].factories[editIndex];
    factoryForm.name = row.name;
    factoryForm.location = row.location;
    factoryForm.product = row.product;
  } else {
    factoryForm.name = "";
    factoryForm.location = "";
    factoryForm.product = "";
  }
  factoryDialog.value = true;
}
function saveFactory() {
  const list = perCertData[dialogCertNo.value].factories;
  if (dialogEditIndex.value !== null) {
    list.splice(dialogEditIndex.value, 1, { ...factoryForm });
  } else {
    list.push({ ...factoryForm });
  }
  factoryDialog.value = false;
}

// ── GAP dialog ──────────────────────────────────────
const gapDialog = ref(false);
const gapForm = reactive({ certNo: "", cropName: "", province: "" });
const gapDialogCertNo = ref("");
const gapDialogEditIndex = ref(null);

function openGapDialog(certNo, editIndex = null) {
  gapDialogCertNo.value = certNo;
  gapDialogEditIndex.value = editIndex;
  if (editIndex !== null) {
    const row = perCertData[certNo].gapSites[editIndex];
    gapForm.certNo = row.certNo;
    gapForm.cropName = row.cropName;
    gapForm.province = row.province;
  } else {
    gapForm.certNo = "";
    gapForm.cropName = "";
    gapForm.province = "";
  }
  gapDialog.value = true;
}
function saveGap() {
  const list = perCertData[gapDialogCertNo.value].gapSites;
  if (gapDialogEditIndex.value !== null) {
    list.splice(gapDialogEditIndex.value, 1, { ...gapForm });
  } else {
    list.push({ ...gapForm });
  }
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

/* Matrix */
.matrix-wrapper {
  overflow-x: auto;
}
.amend-matrix {
  border-collapse: collapse;
  min-width: 100%;
}
.amend-matrix thead tr {
  border-bottom: 2px solid rgba(var(--v-theme-on-surface), 0.12);
}
.amend-matrix th,
.amend-matrix td {
  padding: 8px 12px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  vertical-align: middle;
}
.amend-matrix th {
  background: rgba(var(--v-theme-export-user), 0.04);
}
.matrix-cert-col {
  min-width: 180px;
}
.matrix-type-col {
  min-width: 130px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.matrix-row:hover td {
  background: rgba(var(--v-theme-export-user), 0.03);
}
.matrix-cell--checked {
  background: rgba(var(--v-theme-export-user), 0.08) !important;
}
.field-section-sub {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* File rows */
.item-row {
  background: rgba(var(--v-theme-export-user), 0.04);
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

/* Amendment section blocks */
.amend-section-block {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-left: 3px solid rgb(var(--v-theme-export-user));
  border-radius: 10px;
  padding: 14px 16px 12px;
  background: rgba(var(--v-theme-on-surface), 0.01);
}
</style>
