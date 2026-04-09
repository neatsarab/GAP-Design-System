<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดคำขอพิจารณาผล Lab</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hcex-staff font-weight-medium">{{
            route.params.id ?? "LAB-0001"
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-chip :color="statusColor(application.status)" variant="tonal">
        <v-icon :icon="statusIcon(application.status)" size="13" class="mr-1" />
        {{ statusLabel(application.status) }}
      </v-chip>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="mb-4 section-card">
      <v-card-text class="pa-4">
        <div class="d-flex align-center">
          <template v-for="(step, i) in timelineSteps" :key="step.value">
            <div
              class="step-item d-flex flex-column align-center"
              style="min-width: 72px"
            >
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon
                  v-if="application.currentStep > step.value"
                  icon="fas fa-check"
                  size="12"
                  color="white"
                />
                <span v-else class="text-caption font-weight-bold">{{
                  step.value + 1
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  application.currentStep >= step.value
                    ? 'text-hcex-staff font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < timelineSteps.length - 1"
              class="step-line flex-grow-1"
              :class="{
                'step-line--done': application.currentStep > step.value,
              }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- 2-column layout -->
    <v-row>
      <!-- ── Left: tabs ── -->
      <v-col cols="12" md="8">
        <v-tabs v-model="activeTab" color="hcex-staff" class="mb-4">
          <v-tab value="info" prepend-icon="fas fa-file-lines"
            >ข้อมูลคำขอ</v-tab
          >
          <v-tab value="review" prepend-icon="fas fa-flask"
            >บันทึกผลการพิจารณา</v-tab
          >
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- ── Tab 1: ข้อมูลคำขอ ── -->
          <v-window-item value="info">
            <!-- ข้อมูลทั่วไป -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-list-check" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ข้อมูลคำขอ</span>
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="6" md="4">
                    <div class="info-label">เลขคำขอ</div>
                    <div class="info-value text-hcex-staff font-weight-bold">
                      {{ application.requestNo }}
                    </div>
                  </v-col>
                  <v-col cols="6" md="4">
                    <div class="info-label">วัตถุประสงค์</div>
                    <div class="info-value">
                      <v-chip
                        size="x-small"
                        :color="objectiveColor(application.objective)"
                        variant="tonal"
                      >
                        {{ objectiveLabel(application.objective) }}
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="6" md="4">
                    <div class="info-label">วันที่ยื่นคำขอ</div>
                    <div class="info-value">
                      {{ application.submittedDate }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลตัวอย่างและสินค้า -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-vial" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลตัวอย่างและสินค้า</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อผลิตภัณฑ์ (ภาษาไทย)</div>
                    <div class="info-value">
                      {{ application.sample.productNameTh }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">Product Name (English)</div>
                    <div class="info-value">
                      {{ application.sample.productNameEn }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">รหัสผลิตภัณฑ์ / Product Code</div>
                    <div class="info-value text-hcex-staff font-weight-bold">
                      {{ application.sample.productCode }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">วันที่ผลิต / MFG Date</div>
                    <div class="info-value">
                      {{ application.sample.mfgDate }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">วันหมดอายุ / EXP Date</div>
                    <div class="info-value">
                      {{ application.sample.expDate }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">
                      วันที่สุ่มเก็บตัวอย่าง / Date Collected
                    </div>
                    <div class="info-value">
                      {{ application.sample.dateCollected }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">
                      วันที่นำส่งตัวอย่าง / Date Delivered
                    </div>
                    <div class="info-value">
                      {{ application.sample.dateDelivered }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- สถานที่ผู้ผลิต -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-industry" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >สถานที่ผู้ผลิต (Manufacturer)</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ผู้ผลิต / Manufacturer</div>
                    <div class="info-value font-weight-medium">
                      {{ application.manufacturer.name }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">
                      ที่อยู่โรงงาน / Factory Address
                    </div>
                    <div class="info-value">
                      {{ application.manufacturer.address }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- สถานที่สุ่มเก็บตัวอย่าง -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon
                  icon="fas fa-location-dot"
                  color="hcex-staff"
                  size="15"
                />
                <span class="text-subtitle-2 font-weight-bold"
                  >สถานที่สุ่มเก็บตัวอย่าง (Collecting Location)</span
                >
              </div>
              <v-card-text class="pa-4">
                <div class="info-value">
                  {{ application.collectingLocation }}
                </div>
              </v-card-text>
            </v-card>

            <!-- ห้องปฏิบัติการ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-microscope" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ห้องปฏิบัติการที่ส่งทดสอบ (Testing Laboratory)</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อห้องปฏิบัติการ</div>
                    <div class="info-value font-weight-medium">
                      {{ application.laboratory.name }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ที่อยู่</div>
                    <div class="info-value">
                      {{ application.laboratory.address }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ประเทศปลายทาง -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-earth-asia" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ประเทศปลายทาง (Country of Destination)</span
                >
              </div>
              <v-card-text class="pa-4">
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="c in application.destinationCountries"
                    :key="c"
                    size="small"
                    variant="tonal"
                    color="hcex-staff"
                    >{{ c }}</v-chip
                  >
                </div>
              </v-card-text>
            </v-card>

            <!-- วัตถุประสงค์และปริมาณ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-bullseye" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >วัตถุประสงค์และปริมาณการส่งออก</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">
                      วัตถุประสงค์การสุ่มเก็บตัวอย่าง
                    </div>
                    <div class="info-value">
                      <v-chip
                        size="small"
                        :color="objectiveColor(application.objective)"
                        variant="tonal"
                      >
                        {{ objectiveLabelFull(application.objective) }}
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">
                      ปริมาณการส่งออก / Export Volume
                    </div>
                    <div class="info-value">
                      {{ application.exportVolume.amount }}
                      {{ application.exportVolume.unit }}
                    </div>
                  </v-col>
                  <!-- Whole Product System info -->
                  <template v-if="application.objective === 'whole'">
                    <v-col cols="12">
                      <v-divider class="my-2" />
                      <div class="text-subtitle-2 font-weight-medium mb-2">
                        ข้อมูลทะเบียนประวัติ (Whole Product System)
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">หมายเลขทะเบียนโรงงาน</div>
                      <div class="info-value text-hcex-staff font-weight-bold">
                        {{ application.wholeSystem.factoryRegNo }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">มาตรฐาน GMP/HACCP</div>
                      <div class="info-value">
                        {{ application.wholeSystem.standard }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">วันหมดอายุ</div>
                      <div class="info-value">
                        {{ application.wholeSystem.expiryDate }}
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="info-label">วัตถุประสงค์การทดสอบ</div>
                      <div class="info-value">
                        {{ application.wholeSystem.testPurpose }}
                      </div>
                    </v-col>
                  </template>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- รายการทดสอบ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-flask" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >รายการทดสอบตามมาตรฐาน</span
                >
              </div>
              <v-table density="compact" class="pa-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>รายการทดสอบ</th>
                    <th>เกณฑ์มาตรฐาน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(t, idx) in application.testItems" :key="t.name">
                    <td class="text-body-2 text-medium-emphasis">
                      {{ idx + 1 }}
                    </td>
                    <td class="text-body-2 font-weight-medium">{{ t.name }}</td>
                    <td class="text-body-2 text-medium-emphasis">
                      {{ t.criteria }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <div class="px-4 py-3 border-t">
                <div class="info-label mb-1">
                  มาตรฐานอ้างอิง (กรมวิชาการเกษตร)
                </div>
                <div class="text-body-2">{{ application.doareference }}</div>
              </div>
            </v-card>

            <!-- Special Remark -->
            <v-card
              v-if="application.specialRemark"
              rounded="xl"
              elevation="0"
              class="section-card mb-4"
            >
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon
                  icon="fas fa-comment-dots"
                  color="hcex-staff"
                  size="15"
                />
                <span class="text-subtitle-2 font-weight-bold"
                  >Special Remark</span
                >
              </div>
              <v-card-text class="pa-4">
                <div class="info-value">{{ application.specialRemark }}</div>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลอื่นๆ -->
            <v-card
              v-if="application.otherData"
              rounded="xl"
              elevation="0"
              class="section-card mb-4"
            >
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon
                  icon="fas fa-circle-info"
                  color="hcex-staff"
                  size="15"
                />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลอื่นๆ (Other Data)</span
                >
              </div>
              <v-card-text class="pa-4">
                <div class="info-value">{{ application.otherData }}</div>
              </v-card-text>
            </v-card>

            <!-- เอกสารแนบ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-paperclip" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
              </div>
              <v-card-text class="pa-4">
                <div
                  v-for="doc in application.attachments"
                  :key="doc.label"
                  class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
                >
                  <div class="d-flex align-center ga-2">
                    <v-icon
                      :icon="
                        doc.type === 'pdf'
                          ? 'fas fa-file-pdf'
                          : 'fas fa-file-image'
                      "
                      :color="doc.type === 'pdf' ? 'error' : 'info'"
                      size="16"
                    />
                    <div>
                      <div class="text-body-2">{{ doc.label }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ doc.docType }}
                      </div>
                    </div>
                  </div>
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="hcex-staff"
                    rounded="lg"
                    prepend-icon="fas fa-download"
                  >
                    ดาวน์โหลด
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- ── Tab 2: บันทึกผลการพิจารณา ── -->
          <v-window-item value="review">
            <v-card rounded="xl" elevation="0" class="section-card">
              <v-card-text class="pa-5">
                <!-- ผลการพิจารณา -->
                <div class="field-label mb-1">
                  <div>ผลการพิจารณา</div>
                  <div class="field-label-en">Review Result</div>
                </div>
                <v-radio-group
                  v-model="reviewForm.result"
                  color="hcex-staff"
                  inline
                >
                  <v-radio value="pass" class="mr-6">
                    <template #label>
                      <div class="d-flex align-center ga-2">
                        <v-icon
                          icon="fas fa-circle-check"
                          color="success"
                          size="18"
                        />
                        <span class="font-weight-medium">อนุมัติ</span>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="improve" class="mr-6">
                    <template #label>
                      <div class="d-flex align-center ga-2">
                        <v-icon
                          icon="fas fa-circle-exclamation"
                          color="warning"
                          size="18"
                        />
                        <span class="font-weight-medium">ปรับปรุง</span>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="fail">
                    <template #label>
                      <div class="d-flex align-center ga-2">
                        <v-icon
                          icon="fas fa-circle-xmark"
                          color="error"
                          size="18"
                        />
                        <span class="font-weight-medium">ไม่อนุมัติ</span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>

                <!-- หมายเหตุ -->
                <div class="field-label mb-1">
                  <div>หมายเหตุ</div>
                  <div class="field-label-en">Remarks</div>
                </div>
                <v-textarea
                  v-model="reviewForm.remark"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="4"
                  placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                  class="mb-5"
                />

                <!-- แก้ไขภายในวันที่ -->
                <template v-if="reviewForm.result === 'improve'">
                  <div class="field-label mb-1">
                    <div>แก้ไขภายในวันที่</div>
                    <div class="field-label-en">Deadline</div>
                  </div>
                  <v-menu
                    v-model="deadlineMenu"
                    :close-on-content-click="false"
                    min-width="0"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="deadlineBE"
                        variant="outlined"
                        density="compact"
                        rounded="lg"
                        hide-details
                        readonly
                        placeholder="วว/ดด/ปปปป"
                        prepend-inner-icon="fas fa-calendar"
                        class="mb-1"
                      />
                    </template>
                    <v-date-picker
                      v-model="reviewForm.deadline"
                      hide-header
                      locale="th"
                      @update:model-value="deadlineMenu = false"
                    />
                  </v-menu>
                  <div
                    v-if="reviewForm.deadline"
                    class="text-caption text-medium-emphasis mb-4"
                  >
                    จำนวน {{ deadlineDays }} วัน นับจากวันนี้
                  </div>
                </template>

                <!-- ส่งตรวจ (แสดงเฉพาะเมื่อผ่านการพิจารณา) -->
                <template v-if="reviewForm.result === 'pass'">
                  <div class="field-label mb-2">
                    <div>ส่งตรวจ</div>
                    <div class="field-label-en">Testing Location</div>
                  </div>
                  <div class="d-flex flex-wrap ga-3 mb-5">
                    <v-checkbox
                      v-model="reviewForm.labTypes"
                      value="micro"
                      color="hcex-staff"
                      density="compact"
                      hide-details
                    >
                      <template #label>
                        <div class="d-flex align-center ga-2">
                          <v-icon
                            icon="fas fa-bacteria"
                            size="16"
                            color="hcex-staff"
                          />
                          <span class="text-body-2 font-weight-medium"
                            >จุล</span
                          >
                        </div>
                      </template>
                    </v-checkbox>
                    <v-checkbox
                      v-model="reviewForm.labTypes"
                      value="chem"
                      color="hcex-staff"
                      density="compact"
                      hide-details
                    >
                      <template #label>
                        <div class="d-flex align-center ga-2">
                          <v-icon
                            icon="fas fa-flask"
                            size="16"
                            color="hcex-staff"
                          />
                          <span class="text-body-2 font-weight-medium"
                            >เคมี</span
                          >
                        </div>
                      </template>
                    </v-checkbox>
                    <v-checkbox
                      v-model="reviewForm.labTypes"
                      value="contam"
                      color="hcex-staff"
                      density="compact"
                      hide-details
                    >
                      <template #label>
                        <div class="d-flex align-center ga-2">
                          <v-icon
                            icon="fas fa-radiation"
                            size="16"
                            color="hcex-staff"
                          />
                          <span class="text-body-2 font-weight-medium"
                            >ปนเปื้อน</span
                          >
                        </div>
                      </template>
                    </v-checkbox>
                  </div>
                </template>

                <!-- Action buttons -->
                <v-row class="ga-2" no-gutters>
                  <v-col v-if="reviewForm.result === 'improve'">
                    <v-btn
                      color="warning"
                      variant="tonal"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-rotate-left"
                      @click="sendBackDialog = true"
                    >
                      ส่งกลับแก้ไข
                    </v-btn>
                  </v-col>
                  <v-col v-if="reviewForm.result === 'fail'">
                    <v-btn
                      color="error"
                      variant="tonal"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-circle-xmark"
                      @click="rejectDialog = true"
                    >
                      ส่งผลไม่อนุมัติ
                    </v-btn>
                  </v-col>
                  <v-col v-if="reviewForm.result === 'pass'">
                    <v-btn
                      color="hcex-staff"
                      variant="flat"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-circle-check"
                      @click="approveDialog = true"
                    >
                      ส่งต่อไปตรวจ
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>

      <!-- ── Right: activity timeline ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="hcex-staff"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ความคืบหน้าคำขอ</span
              >
            </div>
            <v-card-text
              class="pa-4"
              style="max-height: 420px; overflow-y: auto"
            >
              <div class="activity-timeline">
                <div
                  v-for="(event, i) in application.activityLog"
                  :key="i"
                  class="activity-item"
                >
                  <div class="activity-dot-wrap">
                    <div
                      class="activity-dot"
                      :class="`activity-dot--${event.type}`"
                    >
                      <v-icon
                        :icon="eventIcon(event.type)"
                        size="11"
                        color="white"
                      />
                    </div>
                    <div
                      v-if="i < application.activityLog.length - 1"
                      class="activity-line"
                    />
                  </div>
                  <div class="activity-content pb-4">
                    <div class="d-flex align-center flex-wrap ga-1 mb-1">
                      <span class="text-body-2 font-weight-medium">{{
                        event.action
                      }}</span>
                      <v-chip
                        size="x-small"
                        :color="eventColor(event.type)"
                        variant="tonal"
                      >
                        {{ eventLabel(event.type) }}
                      </v-chip>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon icon="fas fa-user" size="9" class="mr-1" />{{
                        event.actor
                      }}
                    </div>
                    <div
                      v-if="event.timestamp"
                      class="text-caption text-medium-emphasis mt-1"
                    >
                      <v-icon icon="fas fa-calendar" size="9" class="mr-1" />{{
                        event.timestamp
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <v-dialog v-model="sendBackDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-rotate-left" color="warning" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งกลับแก้ไข</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอนี้กลับให้ผู้ประกอบการแก้ไข
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
                @click="sendBackDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="warning"
                rounded="lg"
                block
                @click="sendBackDialog = false"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="rejectDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-xmark" color="error" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ไม่ผ่านการพิจารณา</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการปฏิเสธคำขอผล Lab นี้
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
                @click="rejectDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="error"
                rounded="lg"
                block
                @click="rejectDialog = false"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="approveDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" color="hcex-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งต่อไปตรวจ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอนี้ไปยังเจ้าหน้า LAB
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
                @click="approveDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="hcex-staff"
                rounded="lg"
                block
                @click="confirmApprove"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ดำเนินการสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">
            ส่งคำขอไปยังเจ้าหน้าที่ LAB เรียบร้อยแล้ว
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-0">
          <v-btn color="hcex-staff" block rounded="lg" @click="goBackToList">
            กลับรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeTab = ref("info");
const deadlineMenu = ref(false);
const sendBackDialog = ref(false);
const rejectDialog = ref(false);
const approveDialog = ref(false);
const successDialog = ref(false);

function confirmApprove() {
  approveDialog.value = false;
  successDialog.value = true;
}

function goBackToList() {
  successDialog.value = false;
  router.push({ name: "HCEXstaffLabApplicationList" });
}

const reviewForm = ref({
  result: null,
  remark: "",
  deadline: null,
  labTypes: [],
});

const deadlineBE = computed(() => {
  if (!reviewForm.value.deadline) return "";
  const date = new Date(reviewForm.value.deadline);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear() + 543}`;
});

const deadlineDays = computed(() => {
  if (!reviewForm.value.deadline) return 0;
  return Math.ceil(
    (new Date(reviewForm.value.deadline) - new Date()) / (1000 * 60 * 60 * 24),
  );
});

const timelineSteps = [
  { value: 0, title: "ยื่นคำขอ" },
  { value: 1, title: "ตรวจสอบ" },
  { value: 2, title: "ตรวจ Lab" },
];

function stepClass(val) {
  if (application.value.currentStep > val) return "step-done";
  if (application.value.currentStep === val) return "step-active";
  return "step-pending";
}

const application = ref({
  requestNo: route.params.id ?? "LAB-0001",
  objective: "hc",
  submittedDate: "03/01/2569",
  status: "reviewing",
  currentStep: 1,
  sample: {
    productNameTh: "มะม่วงอบแห้ง",
    productNameEn: "Dried Mango",
    productCode: "DM-2569-001",
    mfgDate: "20/12/2568",
    expDate: "20/12/2570",
    dateCollected: "28/12/2568",
    dateDelivered: "02/01/2569",
  },
  manufacturer: {
    name: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
    address: "456 ถนนรังสิต-นครนายก ต.รังสิต อ.ธัญบุรี จ.ปทุมธานี 12110",
  },
  collectingLocation:
    "โกดังสินค้า บริษัท ไทยฟู้ดส์ แปรรูป จำกัด 456 ถนนรังสิต-นครนายก ต.รังสิต อ.ธัญบุรี จ.ปทุมธานี",
  laboratory: {
    name: "ศูนย์วิทยาศาสตร์การแพทย์ที่ 4 สระบุรี",
    address: "68 หมู่ 1 ต.หนองโดน อ.หนองโดน จ.สระบุรี 18190",
  },
  destinationCountries: ["ญี่ปุ่น", "เกาหลีใต้", "จีน"],
  exportVolume: {
    amount: "500",
    unit: "Cartons",
  },
  wholeSystem: {
    factoryRegNo: "DOA-2566-00123",
    standard: "GMP / HACCP",
    expiryDate: "31/12/2569",
    testPurpose: "ทดสอบเพื่อขยายขอบข่าย (Extend Scope)",
  },
  testItems: [
    { name: "Sulfites", criteria: "≤ 30 mg/kg" },
    { name: "Total Plate Count", criteria: "≤ 1.0 × 10⁶ CFU/g" },
    { name: "Total Mold Count", criteria: "≤ 1.0 × 10² CFU/g" },
    { name: "Escherichia coli", criteria: "≤ 3.0 MPN/g" },
    { name: "Staphylococcus aureus", criteria: "ND in 0.1 g" },
    { name: "Salmonella spp.", criteria: "ND in 25 g" },
  ],
  doareference:
    "ภาคผนวก 3 ลำดับที่ 12 — มาตรฐานสำหรับสินค้าแปรรูปพืชส่งออกไปญี่ปุ่น เกาหลี และจีน",
  specialRemark: "FIT FOR HUMAN CONSUMPTION",
  otherData: "",
  attachments: [
    { label: "Test_Report_DM2569001.pdf", docType: "Test Report", type: "pdf" },
    { label: "กมพ.29_DM2569001.pdf", docType: "กมพ.29", type: "pdf" },
    { label: "Cert_ISO22000.pdf", docType: "เอกสารอ้างอิง", type: "pdf" },
  ],
  activityLog: [
    {
      type: "submit",
      action: "ยื่นคำขอพิจารณาผล Lab",
      actor: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
      timestamp: "03/01/2569 10:15",
    },
    {
      type: "checking",
      action: "รับคำขอเข้าระบบ",
      actor: "ระบบ",
      timestamp: "03/01/2569 10:16",
    },
  ],
});

function objectiveColor(o) {
  return { hc: "primary", lot: "info", whole: "success" }[o] ?? "grey";
}

function objectiveLabel(o) {
  return (
    { hc: "Issuance of HC", lot: "Lot by Lot", whole: "Whole Product System" }[
      o
    ] ?? o
  );
}

function objectiveLabelFull(o) {
  return (
    {
      hc: "ขอใบรับรองสุขอนามัย (Issuance of HC)",
      lot: "แนบทะเบียนประวัติ (Lot by Lot)",
      whole: "ทั้งระบบการผลิต (Whole Product System)",
    }[o] ?? o
  );
}

function statusColor(s) {
  return (
    {
      pending: "info",
      reviewing: "info",
      need_edit: "warning",
      approved: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}

function statusLabel(s) {
  return (
    {
      pending: "รอตรวจสอบ",
      reviewing: "อยู่ระหว่างตรวจสอบ",
      need_edit: "รอแก้ไข",
      approved: "ผ่านการพิจารณา",
      rejected: "ไม่ผ่านการพิจารณา",
    }[s] ?? s
  );
}

function statusIcon(s) {
  return (
    {
      pending: "fas fa-clock",
      reviewing: "fas fa-magnifying-glass",
      need_edit: "fas fa-circle-exclamation",
      approved: "fas fa-circle-check",
      rejected: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      checking: "fas fa-magnifying-glass",
      approve: "fas fa-check",
      improve: "fas fa-rotate-left",
      reject: "fas fa-xmark",
    }[type] ?? "fas fa-circle"
  );
}

function eventColor(type) {
  return (
    {
      submit: "info",
      checking: "info",
      approve: "success",
      improve: "warning",
      reject: "error",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      checking: "ตรวจสอบ",
      approve: "อนุมัติ",
      improve: "ส่งกลับ",
      reject: "ปฏิเสธ",
    }[type] ?? type
  );
}
</script>

<style scoped>
.sticky-col {
  position: sticky;
  top: 80px;
}
div {
  --step-color: rgb(var(--v-theme-hcex-staff));
  --step-color-tint: rgba(var(--v-theme-hcex-staff), 0.2);
}
.step-done,
.step-active {
  background: rgb(var(--v-theme-hcex-staff)) !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hcex-staff), 0.2) !important;
}
.step-line {
  height: 2px;
  background: rgba(var(--v-border-color), 0.2);
  margin: 0 4px;
  margin-bottom: 20px;
}
.step-line--done {
  background: rgb(var(--v-theme-hcex-staff)) !important;
}
.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.section-header {
  background: rgba(var(--v-theme-surface-variant), 0.4);
}
.info-label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  margin-bottom: 2px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.info-value {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface));
  min-height: 20px;
}
.item-row {
  background: rgba(var(--v-theme-surface-variant), 0.4);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.activity-timeline {
  position: relative;
}
.activity-item {
  display: flex;
  gap: 12px;
}
.activity-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 22px;
}
.activity-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.activity-dot--submit {
  background: rgb(var(--v-theme-info));
}
.activity-dot--checking {
  background: rgb(var(--v-theme-info));
}
.activity-dot--approve {
  background: rgb(var(--v-theme-success));
}
.activity-dot--improve {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--reject {
  background: rgb(var(--v-theme-error));
}
.activity-line {
  width: 2px;
  flex-grow: 1;
  background: rgba(var(--v-border-color), 0.3);
  margin-top: 4px;
}
.activity-content {
  flex: 1;
}
.confirm-ring {
  background: rgba(var(--v-theme-hcex-staff), 0.1) !important;
}
.success-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(var(--v-theme-success), 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
