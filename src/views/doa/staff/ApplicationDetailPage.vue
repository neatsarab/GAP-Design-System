<template>
  <div style="--v-theme-primary: var(--v-theme-doa-staff)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-doa-staff font-weight-medium">{{
            route.params.id ?? "EXP-0001"
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
                    ? 'text-doa-staff font-weight-bold'
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
        <v-tabs v-model="activeTab" color="doa-staff" class="mb-4">
          <v-tab value="info" prepend-icon="fas fa-file-lines"
            >ข้อมูลคำขอ</v-tab
          >
          <v-tab value="review" prepend-icon="fas fa-clipboard-check">
            บันทึกผลการตรวจสอบ
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- ── Tab 1: ข้อมูลคำขอ ── -->
          <v-window-item value="info">
            <!-- ข้อมูลคำขอ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-list-check" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ข้อมูลคำขอ</span>
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="6" md="4">
                    <div class="info-label">เลขคำขอ</div>
                    <div class="info-value text-doa-staff font-weight-bold">
                      {{ application.requestNo }}
                    </div>
                  </v-col>
                  <v-col cols="6" md="4">
                    <div class="info-label">ประเภทคำขอ</div>
                    <div class="info-value">
                      <v-chip
                        size="x-small"
                        color="doa-staff"
                        variant="tonal"
                        >{{ application.requestType }}</v-chip
                      >
                    </div>
                  </v-col>
                  <v-col cols="6" md="4">
                    <div class="info-label">วันที่ยื่นคำขอ</div>
                    <div class="info-value">
                      {{ application.submittedDate }}
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="info-label">ประเภททะเบียน</div>
                    <div class="info-value">{{ application.typecert }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลผู้ยื่นคำขอ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-user" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลผู้ยื่นคำขอ</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อ-นามสกุล / Full Name</div>
                    <div class="info-value">
                      {{ application.applicantNameTh }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ที่อยู่ / Address</div>
                    <div class="info-value">{{ applicantAddress }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรศัพท์ / Phone</div>
                    <div class="info-value">
                      {{ application.applicantPhone }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรสาร / Fax</div>
                    <div class="info-value">{{ application.applicantFax }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">อีเมล / Email</div>
                    <div class="info-value">
                      {{ application.applicantEmail }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลสถานประกอบการ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-building" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลสถานประกอบการ</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อสถานประกอบการ (ไทย)</div>
                    <div class="info-value">
                      {{ application.companyNameTh }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">Company Name (English)</div>
                    <div class="info-value">
                      {{ application.companyNameEn }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ที่ตั้ง (ภาษาไทย)</div>
                    <div class="info-value">{{ companyAddressTh }}</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">Address (English)</div>
                    <div class="info-value">{{ companyAddressEn }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรศัพท์ / Phone</div>
                    <div class="info-value">{{ application.companyPhone }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรสาร / Fax</div>
                    <div class="info-value">{{ application.companyFax }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">อีเมล / Email</div>
                    <div class="info-value">{{ application.companyEmail }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ขอบข่ายประเทศ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-earth-asia" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ขอบข่ายประเทศ</span
                >
              </div>
              <v-card-text class="pa-4 pb-3">
                <div class="info-label mb-2">Scope of countries</div>
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="c in application.countries"
                    :key="c"
                    size="small"
                    variant="tonal"
                    color="doa-staff"
                    >{{ c }}</v-chip
                  >
                </div>
              </v-card-text>
            </v-card>

            <!-- โรงงาน -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-industry" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลโรงงานผลิตสินค้าพืช</span
                >
              </div>
              <v-table density="compact" class="pa-2">
                <thead>
                  <tr>
                    <th>เลขทะเบียน DOA</th>
                    <th>ชื่อโรงงาน</th>
                    <th>วันหมดอายุ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="factory in application.factories"
                    :key="factory.doaNo"
                  >
                    <td class="text-body-2 font-weight-bold text-doa-staff">
                      {{ factory.doaNo }}
                    </td>
                    <td class="text-body-2">{{ factory.factoryName }}</td>
                    <td class="text-body-2">{{ factory.expiryDate }}</td>
                    <td>
                      <div class="d-flex ga-1 justify-end">
                        <v-tooltip text="ดูข้อมูล" location="top">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              size="x-small"
                              variant="text"
                              color="doa-staff"
                              @click="openFactoryDialog(factory)"
                            >
                              <v-icon icon="fas fa-eye" size="14" />
                            </v-btn>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="ดาวน์โหลด" location="top">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              size="x-small"
                              variant="text"
                              color="doa-staff"
                            >
                              <v-icon icon="fas fa-download" size="14" />
                            </v-btn>
                          </template>
                        </v-tooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <!-- GAP -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-seedling" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >แหล่งผลิตพืชที่ได้การรับรอง GAP</span
                >
              </div>
              <v-table density="compact" class="pa-2">
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
                  <tr v-for="gap in application.gaps" :key="gap.gapNo">
                    <td class="text-body-2 font-weight-bold text-doa-staff">
                      {{ gap.gapNo }}
                    </td>
                    <td class="text-body-2">{{ gap.siteName }}</td>
                    <td class="text-body-2">{{ gap.certBody }}</td>
                    <td class="text-body-2">{{ gap.expiryDate }}</td>
                    <td>
                      <div class="d-flex ga-1 justify-end">
                        <v-tooltip text="ดูข้อมูล" location="top">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              size="x-small"
                              variant="text"
                              color="doa-staff"
                              @click="openGapDialog(gap)"
                            >
                              <v-icon icon="fas fa-eye" size="14" />
                            </v-btn>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="ดาวน์โหลด" location="top">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              size="x-small"
                              variant="text"
                              color="doa-staff"
                            >
                              <v-icon icon="fas fa-download" size="14" />
                            </v-btn>
                          </template>
                        </v-tooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <!-- เอกสารแนบ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-paperclip" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
              </div>
              <v-card-text class="pa-4">
                <div
                  v-for="doc in application.attachments"
                  :key="doc.label"
                  class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
                >
                  <div class="text-body-2">{{ doc.label }}</div>
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="doa-staff"
                    rounded="lg"
                    prepend-icon="fas fa-download"
                  >
                    ดาวน์โหลด
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- ── Tab 2: บันทึกผลการตรวจสอบ ── -->
          <v-window-item value="review">
            <v-card rounded="xl" elevation="0" class="section-card">
              <v-card-text class="pa-5">
                <!-- ผลการตรวจสอบ -->
                <div class="field-label mb-1">
                  <div>ผลการตรวจสอบ</div>
                  <div class="field-label-en">Review Result</div>
                </div>
                <v-radio-group
                  v-model="step1Review.result"
                  color="doa-staff"
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
                        <span class="font-weight-medium">ผ่าน</span>
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
                        <span class="font-weight-medium">ไม่ผ่าน</span>
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
                  v-model="step1Review.remark"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="4"
                  placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                  class="mb-5"
                />

                <!-- แก้ไขภายในระยะเวลา (เฉพาะ ปรับปรุง) -->
                <template v-if="step1Review.result === 'improve'">
                  <div class="field-label mb-1">
                    <div>แก้ไขภายในระยะเวลา</div>
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
                        class="mb-4"
                      />
                    </template>
                    <v-date-picker
                      v-model="step1Review.deadline"
                      hide-header
                      locale="th"
                      @update:model-value="deadlineMenu = false"
                    />
                  </v-menu>
                </template>

                <!-- Action buttons inline -->
                <v-row class="ga-2" no-gutters>
                  <v-col v-if="step1Review.result !== 'pass'">
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
                  <v-col v-if="step1Review.result === 'pass'">
                    <v-btn
                      color="doa-staff"
                      variant="flat"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-paper-plane"
                      @click="forwardDialog = true"
                    >
                      ส่งต่อพิจารณา
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>

      <!-- ── Right: actions + activity timeline (sticky) ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ความคืบหน้าคำขอ -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="doa-staff"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ความคืบหน้าคำขอ</span
              >
            </div>
            <v-card-text class="pa-4">
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
                        >{{ eventLabel(event.type) }}</v-chip
                      >
                    </div>
                    <div
                      v-if="event.remark"
                      class="text-caption text-medium-emphasis mb-1"
                    >
                      {{ event.remark }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon icon="fas fa-user" size="9" class="mr-1" />{{
                        event.actor
                      }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
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

    <!-- Factory Detail Dialog -->
    <v-dialog v-model="factoryDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
          <v-icon icon="fas fa-industry" color="doa-staff" size="16" />
          <span class="text-body-1 font-weight-bold">ข้อมูลโรงงาน</span>
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            @click="factoryDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <template v-if="selectedFactory">
            <div class="d-flex flex-column ga-3">
              <div>
                <div class="text-caption text-medium-emphasis">
                  เลขทะเบียน DOA
                </div>
                <div class="text-body-2 font-weight-bold text-doa-staff">
                  {{ selectedFactory.doaNo }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">ชื่อโรงงาน</div>
                <div class="text-body-2">{{ selectedFactory.factoryName }}</div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">วันหมดอายุ</div>
                <div class="text-body-2">{{ selectedFactory.expiryDate }}</div>
              </div>
            </div>
          </template>
        </v-card-text>
        <v-divider />
        <v-card-actions class="px-5 pb-5 pt-3">
          <v-btn
            color="doa-staff"
            variant="tonal"
            prepend-icon="fas fa-download"
            rounded="lg"
            block
          >
            ดาวน์โหลด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- GAP Detail Dialog -->
    <v-dialog v-model="gapDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
          <v-icon icon="fas fa-seedling" color="doa-staff" size="16" />
          <span class="text-body-1 font-weight-bold">ข้อมูล GAP</span>
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            @click="gapDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <template v-if="selectedGap">
            <div class="d-flex flex-column ga-3">
              <div>
                <div class="text-caption text-medium-emphasis">
                  เลขใบรับรอง GAP
                </div>
                <div class="text-body-2 font-weight-bold text-doa-staff">
                  {{ selectedGap.gapNo }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">
                  ชื่อแหล่งผลิต
                </div>
                <div class="text-body-2">{{ selectedGap.siteName }}</div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">
                  หน่วยงานรับรอง
                </div>
                <div class="text-body-2">{{ selectedGap.certBody }}</div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">วันหมดอายุ</div>
                <div class="text-body-2">{{ selectedGap.expiryDate }}</div>
              </div>
            </div>
          </template>
        </v-card-text>
        <v-divider />
        <v-card-actions class="px-5 pb-5 pt-3">
          <v-btn
            color="doa-staff"
            variant="tonal"
            prepend-icon="fas fa-download"
            rounded="lg"
            block
          >
            ดาวน์โหลด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Forward Dialog -->
    <v-dialog v-model="forwardDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="doa-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งต่อพิจารณา</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอนี้ไปยังเจ้าหน้าที่พิจารณา
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
                @click="forwardDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="doa-staff" rounded="lg" block @click="submitForward"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Send Back Dialog -->
    <v-dialog v-model="sendBackDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-warning), 0.1)"
          >
            <v-icon icon="fas fa-rotate-left" color="warning" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งกลับแก้ไข</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอกลับให้ผู้ยื่นแก้ไข
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
              <v-btn color="warning" rounded="lg" block @click="submitSendBack"
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
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ดำเนินการสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ successMessage }}
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="doa-staff"
            rounded="lg"
            block
            @click="router.push({ name: 'ExportStaffApplicationList' })"
          >
            กลับรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeTab = ref("info");
const forwardDialog = ref(false);
const sendBackDialog = ref(false);
const successDialog = ref(false);
const successMessage = ref("");

const factoryDialog = ref(false);
const selectedFactory = ref(null);
function openFactoryDialog(factory) {
  selectedFactory.value = factory;
  factoryDialog.value = true;
}

const gapDialog = ref(false);
const selectedGap = ref(null);
function openGapDialog(gap) {
  selectedGap.value = gap;
  gapDialog.value = true;
}

const step1Review = reactive({ result: "pass", remark: "", deadline: null });
const deadlineMenu = ref(false);
const deadlineBE = computed(() => {
  if (!step1Review.deadline) return "";
  const d = step1Review.deadline;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear() + 543}`;
});

const application = {
  requestNo: "EXP-0001",
  requestType: "ขึ้นทะเบียน",
  submittedDate: "01/01/2569",
  typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนโรงงานผลิตสินค้าพืช",
  status: "pending",
  currentStep: 1,

  applicantNameTh: "นายสมชาย ใจดี",
  applicantHouseNo: "123",
  applicantMoo: "3",
  applicantRoad: "พหลโยธิน",
  applicantTambol: "ลาดยาว",
  applicantDistrict: "จตุจักร",
  applicantProvince: "กรุงเทพมหานคร",
  applicantZipcode: "10900",
  applicantPhone: "02-123-4567",
  applicantFax: "-",
  applicantEmail: "somchai@example.com",

  companyNameTh: "บริษัท ไทย เอ็กซ์พอร์ต จำกัด",
  companyNameEn: "Thai Export Co., Ltd.",
  houseNo: "88/1",
  road: "สุขุมวิท",
  tambol: "บางปะกง",
  district: "บางปะกง",
  province: "ฉะเชิงเทรา",
  zipcode: "24130",
  houseNoEn: "88/1",
  roadEn: "Sukhumvit",
  tambolEn: "Bang Pakong",
  districtEn: "Bang Pakong",
  provinceEn: "Chachoengsao",
  zipcodeEn: "24130",
  companyPhone: "038-123-456",
  companyFax: "038-123-457",
  companyEmail: "info@thaiexport.co.th",

  countries: ["สหภาพยุโรป", "ญี่ปุ่น", "สิงคโปร์"],

  factories: [
    {
      doaNo: "DOA-12345",
      factoryName: "โรงบรรจุสินค้าไทยเอ็กซ์พอร์ต 1",
      expiryDate: "01/01/2570",
    },
    {
      doaNo: "DOA-12346",
      factoryName: "โรงรมทรีทเม้นต์ไทยเอ็กซ์พอร์ต",
      expiryDate: "01/06/2570",
    },
  ],

  gaps: [
    {
      gapNo: "GAP-00123",
      siteName: "สวนมะม่วงไทยเอ็กซ์พอร์ต",
      certBody: "กรมวิชาการเกษตร (DOA)",
      expiryDate: "01/03/2570",
    },
    {
      gapNo: "GAP-00456",
      siteName: "สวนมะละกอไทยเอ็กซ์พอร์ต",
      certBody: "สำนักงานเกษตรจังหวัด",
      expiryDate: "15/06/2570",
    },
  ],

  attachments: [
    { label: "หนังสือรับรองบริษัท" },
    { label: "สำเนาบัตรประชาชนกรรมการ" },
    { label: "หนังสือสำคัญขึ้นทะเบียนโรงงาน (DOA)" },
    { label: "หนังสือรับรอง GAP" },
  ],

  activityLog: [
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "01/01/2569 09:12",
      remark: "",
    },
    {
      type: "receive",
      action: "รับคำขอเข้าสู่ระบบ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่รับเรื่อง)",
      timestamp: "01/01/2569 10:45",
      remark: "ตรวจสอบเอกสารเบื้องต้นครบถ้วน",
    },
  ],
};

const applicantAddress = computed(() => {
  const a = application;
  return `${a.applicantHouseNo} หมู่ ${a.applicantMoo} ถ.${a.applicantRoad} ต.${a.applicantTambol} อ.${a.applicantDistrict} จ.${a.applicantProvince} ${a.applicantZipcode}`;
});

const companyAddressTh = computed(() => {
  const a = application;
  return `${a.houseNo} ถ.${a.road} ต.${a.tambol} อ.${a.district} จ.${a.province} ${a.zipcode}`;
});

const companyAddressEn = computed(() => {
  const a = application;
  return `${a.houseNoEn} ${a.roadEn} Rd., ${a.tambolEn}, ${a.districtEn}, ${a.provinceEn} ${a.zipcodeEn}`;
});

const timelineSteps = [
  { value: 0, title: "ยื่นคำขอ" },
  { value: 1, title: "ตรวจสอบ" },
  { value: 2, title: "พิจารณา" },
  { value: 3, title: "ลงนาม" },
];

function stepClass(v) {
  if (application.currentStep > v) return "step-done";
  if (application.currentStep === v) return "step-active";
  return "step-pending";
}

function statusColor(s) {
  return (
    {
      draft: "grey",
      pending: "warning",
      need_edit: "warning",
      reviewing: "warning",
      signing: "warning",
      approved: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}

function statusIcon(s) {
  return (
    {
      draft: "fas fa-pen",
      pending: "fas fa-clock",
      need_edit: "fas fa-pen",
      reviewing: "fas fa-magnifying-glass",
      signing: "fas fa-pen-nib",
      approved: "fas fa-circle-check",
      rejected: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}

function statusLabel(s) {
  return (
    {
      draft: "แบบร่าง",
      pending: "รอตรวจสอบ",
      need_edit: "รอแก้ไขคำขอ",
      reviewing: "รอพิจารณา",
      signing: "รอลงนาม",
      approved: "ได้รับอนุญาต",
      rejected: "ไม่อนุมัติ",
    }[s] ?? s
  );
}

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      receive: "fas fa-inbox",
      forward: "fas fa-share",
      review: "fas fa-magnifying-glass",
      pending: "fas fa-clock",
      approve: "fas fa-circle-check",
      reject: "fas fa-circle-xmark",
      sendback: "fas fa-rotate-left",
    }[type] ?? "fas fa-circle"
  );
}

function eventColor(type) {
  return (
    {
      submit: "doa-staff",
      receive: "info",
      forward: "doa-staff",
      review: "warning",
      pending: "warning",
      approve: "success",
      reject: "error",
      sendback: "orange",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      receive: "รับเรื่อง",
      forward: "ส่งต่อ",
      review: "กำลังพิจารณา",
      pending: "รอพิจารณา",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ส่งกลับ",
    }[type] ?? type
  );
}

function submitForward() {
  forwardDialog.value = false;
  successMessage.value = "ส่งต่อคำขอเพื่อพิจารณาเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitSendBack() {
  sendBackDialog.value = false;
  successMessage.value = "ส่งคำขอกลับให้ผู้ยื่นแก้ไขเรียบร้อยแล้ว";
  successDialog.value = true;
}
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-doa-staff));
  --step-color-tint: rgba(var(--v-theme-doa-staff), 0.2);
}

.sticky-col {
  position: sticky;
  top: 80px;
}

.info-label {
  font-size: 0.72rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
  margin-bottom: 2px;
}

.info-value {
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.item-row {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.step-line {
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.15);
  margin: 0 4px;
  margin-bottom: 20px;
}

.step-pending {
  background: rgba(var(--v-theme-on-surface), 0.12);
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-doa-staff)) !important;
  color: white !important;
}

.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-doa-staff), 0.2) !important;
}

.step-line--done {
  background: rgb(var(--v-theme-doa-staff)) !important;
}

/* Activity timeline */
.activity-timeline {
  padding-left: 4px;
}

.activity-item {
  display: flex;
  gap: 16px;
}

.activity-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.activity-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.activity-dot--submit {
  background: rgb(var(--v-theme-doa-staff));
}

.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}

.activity-dot--forward {
  background: rgb(var(--v-theme-doa-staff));
}

.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}

.activity-dot--pending {
  background: rgb(var(--v-theme-warning));
}

.activity-dot--approve {
  background: rgb(var(--v-theme-success));
}

.activity-dot--reject {
  background: rgb(var(--v-theme-error));
}

.activity-dot--sendback {
  background: #fb8c00;
}

.activity-line {
  width: 2px;
  flex-grow: 1;
  background: rgba(var(--v-theme-on-surface), 0.12);
  margin-top: 4px;
  min-height: 20px;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.confirm-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-doa-staff), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-success), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
