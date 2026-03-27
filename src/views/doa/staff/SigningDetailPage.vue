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
          <v-tab value="signing" prepend-icon="fas fa-pen-nib">
            บันทึกการลงนาม
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

          <!-- ── Tab 2: บันทึกการลงนาม ── -->
          <v-window-item value="signing">
            <v-card rounded="xl" elevation="0" class="section-card">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-pen-nib" color="doa-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >บันทึกการลงนาม</span
                >
              </div>
              <v-card-text class="pa-5">
                <!-- ผลการลงนาม -->
                <div class="field-label mb-3">
                  <div>ผลการลงนาม</div>
                  <div class="field-label-en">Signing Result</div>
                </div>
                <v-radio-group
                  v-model="signingResult.result"
                  color="doa-staff"
                  inline
                  class="mb-4"
                >
                  <v-radio value="approve" class="mr-6">
                    <template #label>
                      <div class="d-flex align-center ga-2">
                        <v-icon
                          icon="fas fa-circle-check"
                          color="success"
                          size="16"
                        />
                        <span class="font-weight-medium">อนุมัติ</span>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="reject">
                    <template #label>
                      <div class="d-flex align-center ga-2">
                        <v-icon
                          icon="fas fa-circle-xmark"
                          color="error"
                          size="16"
                        />
                        <span class="font-weight-medium">ไม่อนุมัติ</span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>

                <!-- เลขทะเบียน (แสดงเมื่ออนุมัติ) -->
                <template v-if="signingResult.result === 'approve'">
                  <div class="field-label mb-2 mt-3">
                    <div>เลขทะเบียน</div>
                    <div class="field-label-en">Certificate Number(s)</div>
                  </div>
                  <v-card variant="outlined" rounded="lg" class="mb-4">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th style="width: 180px">ขอบเขตประเทศ</th>
                          <th>เลขทะเบียน</th>
                          <th style="width: 48px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, idx) in certNumbers" :key="idx">
                          <td>
                            <v-chip
                              size="small"
                              color="doa-staff"
                              variant="tonal"
                              >{{ item.country }}</v-chip
                            >
                          </td>
                          <td>
                            <span
                              class="text-body-2 font-weight-bold text-doa-staff"
                            >
                              {{ item.certNo }}
                            </span>
                          </td>
                          <td>
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="doa-staff"
                              rounded="lg"
                              prepend-icon="fas fa-eye"
                              @click="previewCertPdf(item)"
                            >
                              ดูตัวอย่าง
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </template>

                <!-- Action buttons inline -->
                <v-row class="ga-2" no-gutters>
                  <v-col v-if="signingResult.result === 'approve'">
                    <v-btn
                      color="doa-staff"
                      variant="flat"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-pen-nib"
                      @click="signingDialog = true"
                    >
                      ลงนาม
                    </v-btn>
                  </v-col>
                  <v-col v-if="signingResult.result === 'reject'">
                    <v-btn
                      color="error"
                      variant="tonal"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-circle-xmark"
                      @click="rejectDialog = true"
                    >
                      ไม่อนุมัติ
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
                    <v-btn
                      v-if="event.type !== 'submit'"
                      size="x-small"
                      variant="text"
                      color="doa-staff"
                      class="mt-1 px-0"
                      @click="openActivityDetail(event)"
                    >
                      ดูรายละเอียด
                      <v-icon
                        icon="fas fa-chevron-right"
                        size="10"
                        class="ml-1"
                      />
                    </v-btn>
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

    <!-- Signing Dialog -->
    <v-dialog v-model="signingDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-pen-nib" color="doa-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการลงนาม</h3>
          <p class="text-body-2 text-medium-emphasis">ยืนยันการลงนามใบรับรอง</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                block
                @click="signingDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="doa-staff" rounded="lg" block @click="submitSigning"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reject Dialog -->
    <v-dialog v-model="rejectDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-error), 0.1)"
          >
            <v-icon icon="fas fa-circle-xmark" color="error" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการไม่อนุมัติ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการไม่อนุมัติคำขอนี้
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
              <v-btn color="error" rounded="lg" block @click="submitReject"
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
            @click="router.push({ name: 'DOAStaffSigningList' })"
          >
            ไปยังหน้ารายการใบรับรอง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Activity Detail Dialog -->
    <v-dialog v-model="activityDetailDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-3 mb-4">
            <div
              class="activity-dot flex-shrink-0"
              :class="
                selectedEvent ? `activity-dot--${selectedEvent.type}` : ''
              "
              style="width: 36px; height: 36px"
            >
              <v-icon
                v-if="selectedEvent"
                :icon="eventIcon(selectedEvent.type)"
                size="14"
                color="white"
              />
            </div>
            <div>
              <div class="text-subtitle-2 font-weight-bold">
                {{ selectedEvent?.action }}
              </div>
              <v-chip
                v-if="selectedEvent"
                size="x-small"
                :color="eventColor(selectedEvent.type)"
                variant="tonal"
                class="mt-1"
              >
                {{ eventLabel(selectedEvent.type) }}
              </v-chip>
            </div>
          </div>
          <v-divider class="mb-4" />
          <div class="d-flex flex-column ga-3">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผู้ดำเนินการ
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-user" size="12" class="mr-1" />
                {{ selectedEvent?.actor }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                วันที่ / เวลา
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-calendar" size="12" class="mr-1" />
                {{ selectedEvent?.timestamp }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผลการพิจารณา
              </div>
              <v-chip
                size="small"
                :color="eventColor(selectedEvent.type)"
                variant="tonal"
              >
                {{ eventLabel(selectedEvent.type) }}
              </v-chip>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">หมายเหตุ</div>
              <div
                v-if="selectedEvent?.remark"
                class="text-body-2 pa-3 rounded-lg"
                style="background: rgba(var(--v-theme-on-surface), 0.05)"
              >
                {{ selectedEvent.remark }}
              </div>
              <div v-else class="text-body-2 text-medium-emphasis">-</div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 pt-0">
          <v-btn
            color="doa-staff"
            variant="tonal"
            rounded="lg"
            block
            @click="activityDetailDialog = false"
          >
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeTab = ref("info");
const signingDialog = ref(false);
const rejectDialog = ref(false);
const successDialog = ref(false);
const successMessage = ref("");

const activityDetailDialog = ref(false);
const selectedEvent = ref(null);

watch(activityDetailDialog, (val) => {
  if (val) {
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  } else {
    const scrollY = document.body.style.top;
    document.documentElement.style.overflow = "";
    document.documentElement.style.height = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }
});

function openActivityDetail(event) {
  selectedEvent.value = event;
  activityDetailDialog.value = true;
}

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

const signingResult = reactive({ result: "approve", remark: "" });

function previewCertPdf(item) {
  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>ตัวอย่างใบรับรอง ${item.certNo}</title>
  <style>
    @page { size: A4; margin: 20mm 25mm; }
    body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14pt; color: #1a1a1a; }
    .center { text-align: center; }
    .border-box { border: 2px solid #2e7d32; border-radius: 8px; padding: 32px; margin: 16px 0; }
    .label { font-size: 11pt; color: #555; margin-bottom: 2px; }
    .value { font-size: 13pt; font-weight: 600; margin-bottom: 14px; }
    .cert-no { font-size: 18pt; font-weight: 700; color: #2e7d32; border: 2px solid #2e7d32;
      display: inline-block; padding: 6px 24px; border-radius: 6px; margin: 12px 0; }
    hr { border: none; border-top: 1px solid #ccc; margin: 16px 0; }
    .watermark { color: #e0e0e0; font-size: 36pt; font-weight: 700; text-align: center;
      opacity: 0.5; margin: 8px 0; }
    .footer { font-size: 10pt; color: #888; text-align: center; margin-top: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
  </style>
</head>
<body>
  <div class="border-box">
    <div class="center">
      <div class="label">กรมวิชาการเกษตร • Department of Agriculture</div>
      <div style="font-size:16pt;font-weight:700;margin:8px 0">หนังสือสำคัญแสดงการจดทะเบียนผู้ส่งออกสินค้าพืช</div>
      <div class="label">Certificate of DOA Registration</div>
      <div class="watermark">ร่าง / DRAFT</div>
      <div class="cert-no">${item.certNo}</div>
    </div>
    <hr />
    <div class="grid">
      <div>
        <div class="label">ชื่อสถานประกอบการ</div>
        <div class="value">${application.companyNameTh}</div>
      </div>
      <div>
        <div class="label">Company Name</div>
        <div class="value">${application.companyNameEn}</div>
      </div>
      <div>
        <div class="label">ขอบเขตประเทศ / Scope</div>
        <div class="value">${item.country}</div>
      </div>
      <div>
        <div class="label">ประเภทคำขอ</div>
        <div class="value">${application.requestType}</div>
      </div>
      <div style="grid-column:1/-1">
        <div class="label">ประเภททะเบียน</div>
        <div class="value">${application.typecert}</div>
      </div>
    </div>
    <hr />
    <div class="footer">ตัวอย่างเท่านั้น — เลขทะเบียนอาจเปลี่ยนแปลงได้ก่อนลงนาม</div>
  </div>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const application = {
  requestNo: "EXP-0001",
  requestType: "ขึ้นทะเบียน",
  submittedDate: "01/01/2569",
  typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนโรงงานผลิตสินค้าพืช",
  status: "signing",
  currentStep: 3,

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
      type: "sendback",
      action: "ส่งกลับแก้ไข",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
      timestamp: "03/01/2569 10:30",
      remark:
        "เอกสารสำเนาหนังสือรับรองนิติบุคคลไม่ครบถ้วน กรุณาแนบเอกสารฉบับที่ออกโดยกรมพัฒนาธุรกิจการค้าซึ่งออกไม่เกิน 3 เดือน และแก้ไขพิกัดที่ตั้งโรงงานให้ถูกต้องตามทะเบียนโรงงาน",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจสอบ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
      timestamp: "05/01/2569 11:00",
    },
    {
      type: "forward",
      action: "พิจารณาพิจารณา",
      actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
      timestamp: "06/01/2569 14:20",
    },
  ],
};

// Generate cert numbers: 1 per country scope
const certYearBE = new Date().getFullYear() + 543;
const certNumbers = reactive(
  application.countries.map((country, i) => ({
    country,
    certNo: `EXP-${certYearBE}-${String(i + 1).padStart(3, "0")}`,
  })),
);

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
      forward: "success",
      review: "warning",
      pending: "warning",
      approve: "success",
      reject: "error",
      sendback: "warning",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      receive: "รับเรื่อง",
      forward: "ผ่าน",
      review: "กำลังพิจารณา",
      pending: "รอพิจารณา",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
    }[type] ?? type
  );
}

function submitSigning() {
  signingDialog.value = false;
  successMessage.value = "ลงนามใบรับรองเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitReject() {
  rejectDialog.value = false;
  successMessage.value = "บันทึกผลการไม่อนุมัติเรียบร้อยแล้ว";
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
