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
        <h1 class="page-title mb-0">รายละเอียดคำขอทะเบียนประวัติ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hcex-staff font-weight-medium">{{
            route.params.id ?? "HIS-0001"
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-btn
        variant="tonal"
        color="info"
        rounded="lg"
        size="small"
        prepend-icon="fas fa-file-pdf"
      >
        พิมพ์ PDF
      </v-btn>
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
          <v-tab value="review" prepend-icon="fas fa-clipboard-check">
            บันทึกผลการตรวจ
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- ── Tab 1: ข้อมูลคำขอ ── -->
          <v-window-item value="info">
            <!-- ข้อมูลทั่วไปคำขอ -->
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
                    <div class="info-label">ประเภทการยื่น</div>
                    <div class="info-value">
                      <v-chip
                        size="x-small"
                        :color="
                          application.submissionType === 'whole'
                            ? 'primary'
                            : 'info'
                        "
                        variant="tonal"
                      >
                        {{
                          application.submissionType === "whole"
                            ? "ทั้งระบบการผลิต"
                            : "แต่ละรุ่นการผลิต"
                        }}
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

            <!-- ข้อมูลโรงงานผู้ผลิต -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-industry" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลโรงงานผู้ผลิต</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อบริษัทผู้ผลิต</div>
                    <div class="info-value">
                      {{ application.manufacturer.companyName }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ที่อยู่</div>
                    <div class="info-value">
                      {{ application.manufacturer.address }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรศัพท์</div>
                    <div class="info-value">
                      {{ application.manufacturer.phone }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรสาร</div>
                    <div class="info-value">
                      {{ application.manufacturer.fax || "-" }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">E-mail</div>
                    <div class="info-value">
                      {{ application.manufacturer.email }}
                    </div>
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <div class="text-subtitle-2 font-weight-medium mb-3">
                  ผู้ประสานงานโรงงานผู้ผลิต
                </div>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อ-นามสกุล</div>
                    <div class="info-value">
                      {{ application.manufacturer.coordinator.name }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ตำแหน่ง</div>
                    <div class="info-value">
                      {{ application.manufacturer.coordinator.position }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรศัพท์</div>
                    <div class="info-value">
                      {{ application.manufacturer.coordinator.phone }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรสาร</div>
                    <div class="info-value">
                      {{ application.manufacturer.coordinator.fax || "-" }}
                    </div>
                  </v-col>
                </v-row>

                <!-- หนังสือสำคัญฯ (ถ้ามี) -->
                <template v-if="application.manufacturer.doaRegNo">
                  <v-divider class="my-4" />
                  <div class="text-subtitle-2 font-weight-medium mb-3">
                    หนังสือสำคัญแสดงการขึ้นทะเบียนโรงงานกับกรมวิชาการเกษตร
                  </div>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <div class="info-label">ทะเบียนเลขที่</div>
                      <div class="info-value text-hcex-staff font-weight-bold">
                        {{ application.manufacturer.doaRegNo }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="info-label">วันที่หมดอายุ</div>
                      <div class="info-value">
                        {{ application.manufacturer.doaExpiryDate }}
                      </div>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>

            <!-- มาตรฐานการผลิต -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-award" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >มาตรฐานการผลิตของโรงงาน</span
                >
              </div>
              <v-table density="compact" class="pa-2">
                <thead>
                  <tr>
                    <th>ชื่อมาตรฐาน</th>
                    <th>หน่วยงานที่รับรอง</th>
                    <th>หมายเลขการรับรอง</th>
                    <th>วันที่หมดอายุ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="std in application.standards" :key="std.certNo">
                    <td class="text-body-2 font-weight-medium">
                      {{ std.name }}
                    </td>
                    <td class="text-body-2">{{ std.certBody }}</td>
                    <td class="text-body-2 text-hcex-staff font-weight-bold">
                      {{ std.certNo }}
                    </td>
                    <td class="text-body-2">{{ std.expiryDate }}</td>
                    <td class="text-right">
                      <v-tooltip text="ดูรายละเอียด" location="top">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon
                            size="x-small"
                            variant="text"
                            color="hcex-staff"
                            @click="openStdDetail(std)"
                          >
                            <v-icon icon="fas fa-eye" size="13" />
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <!-- ข้อมูลบริษัทผู้ส่งออก -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-building" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลบริษัทผู้ส่งออก</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อบริษัทผู้ส่งออก</div>
                    <div class="info-value">
                      {{ application.exporter.companyName }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ที่อยู่</div>
                    <div class="info-value">
                      {{ application.exporter.address }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรศัพท์</div>
                    <div class="info-value">
                      {{ application.exporter.phone }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรสาร</div>
                    <div class="info-value">
                      {{ application.exporter.fax || "-" }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">E-mail</div>
                    <div class="info-value">
                      {{ application.exporter.email }}
                    </div>
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <div class="text-subtitle-2 font-weight-medium mb-3">
                  ผู้ประสานงานบริษัทผู้ส่งออก
                </div>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อ-นามสกุล</div>
                    <div class="info-value">
                      {{ application.exporter.coordinator.name }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ตำแหน่ง</div>
                    <div class="info-value">
                      {{ application.exporter.coordinator.position }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรศัพท์</div>
                    <div class="info-value">
                      {{ application.exporter.coordinator.phone }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">โทรสาร</div>
                    <div class="info-value">
                      {{ application.exporter.coordinator.fax || "-" }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- รายละเอียดสินค้า -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon
                  icon="fas fa-boxes-stacked"
                  color="hcex-staff"
                  size="15"
                />
                <span class="text-subtitle-2 font-weight-bold"
                  >รายละเอียดสินค้า</span
                >
              </div>
              <v-card-text class="pa-4 pb-2">
                <div
                  v-for="(product, idx) in application.products"
                  :key="idx"
                  class="item-row rounded-lg px-4 py-4 mb-3"
                >
                  <div class="d-flex align-center ga-2 mb-3">
                    <v-chip size="x-small" color="hcex-staff" variant="tonal"
                      >สินค้า {{ idx + 1 }}</v-chip
                    >
                    <span class="text-body-2 font-weight-medium">{{
                      product.name
                    }}</span>
                  </div>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <div class="info-label">มาตรฐานสินค้า</div>
                      <div class="info-value">{{ product.standard }}</div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <div class="info-label">ประเทศปลายทาง</div>
                      <div class="d-flex flex-wrap ga-1 mt-1">
                        <v-chip
                          v-for="c in product.destinationCountries"
                          :key="c"
                          size="x-small"
                          color="hcex-staff"
                          variant="tonal"
                          >{{ c }}</v-chip
                        >
                      </div>
                    </v-col>
                    <v-col cols="12" class="mt-2">
                      <div class="info-label">รายการทดสอบ</div>
                      <div class="d-flex flex-wrap ga-1 mt-1">
                        <v-chip
                          v-for="t in product.testItems"
                          :key="t"
                          size="x-small"
                          variant="outlined"
                          color="grey"
                          >{{ t }}</v-chip
                        >
                      </div>
                    </v-col>
                  </v-row>
                </div>
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
                    <v-icon icon="fas fa-file-pdf" color="error" size="16" />
                    <div class="text-body-2">{{ doc.label }}</div>
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

          <!-- ── Tab 2: บันทึกผลการตรวจ ── -->
          <v-window-item value="review">
            <v-card rounded="xl" elevation="0" class="section-card">
              <v-card-text class="pa-5">
                <!-- ผลการตรวจ -->
                <div class="field-label mb-1">
                  <div>ผลการตรวจ</div>
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
                        <span class="font-weight-medium">ส่งกลับแก้ไข</span>
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

                <!-- แก้ไขภายในวันที่ (เฉพาะ ส่งกลับแก้ไข) -->
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
                      อนุมัติคำขอ
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
              <v-btn color="warning" rounded="lg" block @click="submitSendBack"
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
          <h3 class="text-h6 font-weight-bold mb-2">ไม่อนุมัติคำขอ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการปฏิเสธคำขอนี้ ผู้ประกอบการจะได้รับการแจ้งเตือน
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

    <!-- Approve Dialog -->
    <v-dialog v-model="approveDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" color="hcex-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">อนุมัติคำขอ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการอนุมัติคำขอทะเบียนประวัตินี้
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
                @click="submitApprove"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Standard Detail Dialog -->
    <v-dialog v-model="stdDialog" max-width="480">
      <v-card v-if="selectedStd" rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-award" color="hcex-staff" size="18" />
          <span class="text-body-1 font-weight-bold"
            >รายละเอียดมาตรฐานการผลิต</span
          >
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            @click="stdDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="std-detail-row">
            <span class="std-detail-label">ชื่อมาตรฐาน</span>
            <span class="text-body-2 font-weight-bold">{{
              selectedStd.name
            }}</span>
          </div>
          <div class="std-detail-row">
            <span class="std-detail-label">หน่วยงานที่รับรอง</span>
            <span class="text-body-2">{{ selectedStd.certBody }}</span>
          </div>
          <div class="std-detail-row">
            <span class="std-detail-label">หมายเลขการรับรอง</span>
            <span class="text-body-2 font-weight-bold text-hcex-staff">{{
              selectedStd.certNo
            }}</span>
          </div>
          <div class="std-detail-row">
            <span class="std-detail-label">วันที่หมดอายุ</span>
            <span
              class="text-body-2"
              :class="
                isExpiringSoon(selectedStd.expiryDate)
                  ? 'text-warning font-weight-medium'
                  : ''
              "
            >
              {{ selectedStd.expiryDate }}
              <v-chip
                v-if="isExpiringSoon(selectedStd.expiryDate)"
                size="x-small"
                color="warning"
                variant="tonal"
                class="ml-1"
              >
                ใกล้หมดอายุ
              </v-chip>
            </span>
          </div>
          <div v-if="selectedStd.scope" class="std-detail-row">
            <span class="std-detail-label">ขอบข่ายการรับรอง</span>
            <span class="text-body-2">{{ selectedStd.scope }}</span>
          </div>
          <div v-if="selectedStd.attachmentLabel" class="std-detail-row">
            <span class="std-detail-label">เอกสารใบรับรอง</span>
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-file-pdf" color="error" size="14" />
              <span class="text-body-2">{{ selectedStd.attachmentLabel }}</span>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 d-flex ga-2 justify-end">
          <v-btn
            v-if="selectedStd.attachmentLabel"
            variant="tonal"
            color="hcex-staff"
            rounded="lg"
            prepend-icon="fas fa-download"
            size="small"
          >
            ดาวน์โหลดใบรับรอง
          </v-btn>
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            size="small"
            @click="stdDialog = false"
          >
            ปิด
          </v-btn>
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
            color="hcex-staff"
            rounded="lg"
            block
            @click="router.push({ name: 'HCEXstaffHistoryApplicationList' })"
          >
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
const successMessage = ref("");

// Standard detail dialog
const stdDialog = ref(false);
const selectedStd = ref(null);

function openStdDetail(std) {
  selectedStd.value = std;
  stdDialog.value = true;
}

function isExpiringSoon(dateStr) {
  if (!dateStr) return false;
  const [d, m, y] = dateStr.split("/").map(Number);
  const expiry = new Date(y - 543, m - 1, d);
  const now = new Date();
  const diff = (expiry - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 90;
}

const reviewForm = ref({
  result: null,
  remark: "",
  deadline: null,
});

const deadlineBE = computed(() => {
  if (!reviewForm.value.deadline) return "";
  const d = reviewForm.value.deadline;
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear() + 543}`;
});

const deadlineDays = computed(() => {
  if (!reviewForm.value.deadline) return 0;
  const diff = new Date(reviewForm.value.deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const timelineSteps = [
  { value: 0, title: "ยื่นคำขอ" },
  { value: 1, title: "ตรวจสอบ" },
];

function stepClass(val) {
  if (application.value.currentStep > val) return "step-done";
  if (application.value.currentStep === val) return "step-active";
  return "step-pending";
}

const application = ref({
  requestNo: route.params.id ?? "HIS-0001",
  submissionType: "lot",
  submittedDate: "12/01/2569",
  status: "reviewing",
  currentStep: 1,
  manufacturer: {
    companyName: "บริษัท กรีนโปร เอ็กซ์พอร์ต จำกัด",
    address: "123 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900",
    phone: "02-123-4567",
    fax: "02-123-4568",
    email: "info@greenpro.co.th",
    coordinator: {
      name: "นางสาว สมใจ รักษ์ไทย",
      position: "ผู้จัดการฝ่ายผลิต",
      phone: "081-234-5678",
      fax: "",
    },
    doaRegNo: "DOA-2566-00123",
    doaExpiryDate: "31/12/2569",
  },
  exporter: {
    companyName: "บริษัท กรีนโปร เอ็กซ์พอร์ต จำกัด",
    address: "123 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900",
    phone: "02-123-4567",
    fax: "02-123-4568",
    email: "export@greenpro.co.th",
    coordinator: {
      name: "นาย วิชัย ส่งออกดี",
      position: "ผู้จัดการฝ่ายส่งออก",
      phone: "089-876-5432",
      fax: "",
    },
  },
  standards: [
    {
      name: "GMP",
      certBody: "กรมวิชาการเกษตร",
      certNo: "GMP-2566-0045",
      expiryDate: "30/06/2569",
      scope: "การผลิตผักและผลไม้อบแห้ง",
      attachmentLabel: "ใบรับรอง GMP-2566-0045.pdf",
    },
    {
      name: "HACCP",
      certBody: "Bureau Veritas",
      certNo: "BV-HACCP-2023-TH-001",
      expiryDate: "15/09/2569",
      scope: "กระบวนการแปรรูปมะม่วงและลำไย",
      attachmentLabel: "ใบรับรอง HACCP BV-2023.pdf",
    },
    {
      name: "ISO 22000",
      certBody: "SGS Thailand",
      certNo: "SGS-TH22000-2567",
      expiryDate: "20/11/2569",
      scope: "ระบบการจัดการความปลอดภัยของอาหาร",
      attachmentLabel: "ใบรับรอง ISO22000 SGS-2567.pdf",
    },
  ],
  products: [
    {
      name: "มะม่วงอบแห้ง (Dried Mango)",
      standard: "Codex Stan 192",
      destinationCountries: ["ญี่ปุ่น", "เกาหลีใต้", "จีน"],
      testItems: [
        "Sulfites",
        "Total Plate Count",
        "Salmonella spp.",
        "Escherichia coli",
      ],
    },
    {
      name: "ลำไยอบแห้ง (Dried Longan)",
      standard: "EU Regulation",
      destinationCountries: ["เยอรมนี", "ฝรั่งเศส", "เนเธอร์แลนด์"],
      testItems: [
        "Total Plate Count",
        "Total Mold Count",
        "Salmonella spp.",
        "Staphylococcus aureus",
      ],
    },
  ],
  attachments: [
    { label: "ใบรับรองมาตรฐาน GMP.pdf" },
    { label: "ใบรับรองมาตรฐาน HACCP.pdf" },
    { label: "เอกสารหลักฐานการจดทะเบียน.pdf" },
  ],
  activityLog: [
    {
      type: "submit",
      action: "ยื่นคำขอทะเบียนประวัติ",
      actor: "บริษัท กรีนโปร เอ็กซ์พอร์ต จำกัด",
      timestamp: "12/01/2569 09:30",
    },
    {
      type: "checking",
      action: "รับคำขอเข้าระบบ",
      actor: "ระบบ",
      timestamp: "12/01/2569 09:31",
    },
  ],
});

function statusColor(s) {
  return (
    {
      pending: "info",
      reviewing: "warning",
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
      approved: "อนุมัติ",
      rejected: "ไม่อนุมัติ",
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

function submitSendBack() {
  sendBackDialog.value = false;
  successMessage.value = "ส่งคำขอกลับให้ผู้ประกอบการแก้ไขเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitReject() {
  rejectDialog.value = false;
  successMessage.value = "ส่งผลการตรวจ 'ไม่อนุมัติ' เรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitApprove() {
  approveDialog.value = false;
  successMessage.value = "อนุมัติคำขอทะเบียนประวัติเรียบร้อยแล้ว";
  successDialog.value = true;
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-hcex-staff), 0.1);
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
.std-detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.std-detail-row:last-child {
  border-bottom: none;
}
.std-detail-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.55);
  min-width: 140px;
  flex-shrink: 0;
  padding-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
</style>
