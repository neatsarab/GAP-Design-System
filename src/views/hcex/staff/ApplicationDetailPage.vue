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
        <h1 class="page-title mb-0">รายละเอียดคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hcex-staff font-weight-medium">{{
            route.params.id ?? "HC-0001"
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
            <!-- ข้อมูลทั่วไป -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-list-check" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลทั่วไป</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="6" md="3">
                    <div class="info-label">เลขคำขอ</div>
                    <div class="info-value text-hcex-staff font-weight-bold">
                      {{ application.requestNo }}
                    </div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="info-label">วันที่ยื่นคำขอ</div>
                    <div class="info-value">
                      {{ application.submittedDate }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">ผู้ยื่นคำขอ</div>
                    <div class="info-value">
                      {{ application.applicantName }}
                    </div>
                  </v-col>
                  <v-col cols="6" md="2">
                    <div class="info-label">จำนวนใบรับรองที่ต้องการ</div>
                    <div class="info-value font-weight-bold">
                      {{ application.certQty }} ฉบับ
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="info-label">ประเภทใบรับรอง</div>
                    <div class="info-value">
                      <v-chip size="small" color="hcex-staff" variant="tonal">
                        {{ application.typecert }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลผู้ส่งออก / ผู้นำเข้า -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-user-tie" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลผู้ส่งออก / ผู้นำเข้า</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label mb-1">Exporter Name and Address</div>
                    <div
                      class="info-value-block rounded-lg pa-3"
                      style="
                        background: rgba(var(--v-theme-surface-variant), 0.5);
                        font-family: monospace;
                        white-space: pre-wrap;
                        text-transform: uppercase;
                      "
                    >
                      {{ application.exporterNameAddress }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label mb-1">
                      Consignee Name and Address Including Country
                    </div>
                    <div
                      class="info-value-block rounded-lg pa-3"
                      style="
                        background: rgba(var(--v-theme-surface-variant), 0.5);
                        font-family: monospace;
                        white-space: pre-wrap;
                        text-transform: uppercase;
                      "
                    >
                      {{ application.consigneeNameAddress }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลการขนส่ง -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-ship" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลการขนส่ง</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="3">
                    <div class="info-label">Date of Shipment</div>
                    <div class="info-value">
                      {{ application.shipment.date }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Mode of Transport</div>
                    <div class="d-flex flex-wrap ga-1 mt-1">
                      <v-chip
                        v-for="m in application.shipment.modes"
                        :key="m"
                        size="x-small"
                        color="hcex-staff"
                        variant="tonal"
                        >{{ m }}</v-chip
                      >
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Country of Destination</div>
                    <div class="info-value">
                      {{ application.shipment.countryDestination }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Place of Departure</div>
                    <div class="info-value">
                      {{ application.shipment.placeOfDeparture }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">Vessel / Vehicle</div>
                    <div class="info-value">
                      {{ application.shipment.vessel }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลสินค้า -->
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
                  >ข้อมูลสินค้า</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">Manufacturer</div>
                    <div class="info-value">
                      {{ application.goods.manufacturer }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Analysis Report No.</div>
                    <div class="info-value text-hcex-staff font-weight-bold">
                      {{ application.goods.analysisReportNo }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Date</div>
                    <div class="info-value">
                      {{ application.goods.analysisDate }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">Shipping Mark</div>
                    <div class="info-value">
                      {{ application.goods.shippingMark }}
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="info-label mb-1">Description of Goods</div>
                    <div
                      class="info-value-block rounded-lg pa-3"
                      style="
                        background: rgba(var(--v-theme-surface-variant), 0.5);
                        font-family: monospace;
                        white-space: pre-wrap;
                        text-transform: uppercase;
                      "
                    >
                      {{ application.goods.descriptionOfGoods }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">Quantity (CTNS.)</div>
                    <div class="info-value">
                      {{ application.goods.quantity }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">Weight N.W. / G.W.</div>
                    <div class="info-value">
                      {{ application.goods.weightNW }} /
                      {{ application.goods.weightGW }} KGS.
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">Total Amount (USD)</div>
                    <div class="info-value font-weight-bold">
                      {{ application.goods.totalAmount }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
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
                <div
                  class="info-value"
                  style="font-family: monospace; text-transform: uppercase"
                >
                  {{ application.specialRemark }}
                </div>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลผล LAB -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-flask-vial" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลผล LAB</span
                >
                <v-chip
                  color="hcex-staff"
                  variant="tonal"
                  size="x-small"
                  class="ml-1"
                >
                  {{ application.goods.analysisReportNo }}
                </v-chip>
                <v-spacer />
                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="hcex-staff"
                  rounded="lg"
                  prepend-icon="fas fa-file-lines"
                  class="mr-1"
                  @click="previewLabSummaryPdf"
                >
                  ดูใบสรุปผล
                </v-btn>
              </div>
              <v-card-text class="pa-4">
                <div class="text-caption text-medium-emphasis mb-3">
                  วันที่รายงาน: {{ application.goods.analysisDate }}
                </div>
                <div class="d-flex flex-column ga-2">
                  <div
                    v-for="lab in labTypes"
                    :key="lab.key"
                    class="lab-result-row rounded-lg px-4 py-3 d-flex align-center ga-3"
                  >
                    <v-icon :icon="lab.icon" :color="lab.color" size="16" />
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">
                        {{ lab.label }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ labResultsData[lab.key]?.reportNo }}
                      </div>
                    </div>
                    <v-chip
                      v-if="labResultsData[lab.key]"
                      size="x-small"
                      :color="
                        labResultsData[lab.key].status === 'pass'
                          ? 'success'
                          : 'error'
                      "
                      variant="tonal"
                    >
                      <v-icon
                        :icon="
                          labResultsData[lab.key].status === 'pass'
                            ? 'fas fa-circle-check'
                            : 'fas fa-circle-xmark'
                        "
                        size="9"
                        class="mr-1"
                      />
                      {{
                        labResultsData[lab.key].status === "pass"
                          ? "ผ่าน"
                          : "ไม่ผ่าน"
                      }}
                    </v-chip>
                    <v-chip v-else size="x-small" color="grey" variant="tonal">
                      ยังไม่มีผล
                    </v-chip>
                    <v-btn
                      v-if="labResultsData[lab.key]"
                      icon
                      size="x-small"
                      variant="tonal"
                      :color="lab.color"
                      @click="openLabDetail(lab.key)"
                    >
                      <v-icon icon="fas fa-eye" size="13" />
                    </v-btn>
                  </div>
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
                  v-model="step1Review.result"
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
                  v-model="step1Review.remark"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="4"
                  placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                  class="mb-5"
                />

                <!-- แก้ไขภายในวันที่ (เฉพาะ ปรับปรุง) -->
                <template v-if="step1Review.result === 'improve'">
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
                      v-model="step1Review.deadline"
                      hide-header
                      locale="th"
                      @update:model-value="deadlineMenu = false"
                    />
                  </v-menu>
                  <div
                    v-if="step1Review.deadline"
                    class="text-caption text-medium-emphasis mb-4"
                  >
                    จำนวน {{ deadlineDays }} วัน นับจากวันนี้
                  </div>
                </template>

                <!-- Action buttons inline -->
                <v-row class="ga-2" no-gutters>
                  <v-col v-if="step1Review.result === 'improve'">
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
                  <v-col v-if="step1Review.result === 'fail'">
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
                  <v-col v-if="step1Review.result === 'pass'">
                    <v-btn
                      color="hcex-staff"
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
                        >{{ eventLabel(event.type) }}</v-chip
                      >
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
                    <v-btn
                      v-if="
                        event.type !== 'submit' && event.type !== 'checking'
                      "
                      size="x-small"
                      variant="text"
                      color="hcex-staff"
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
          <v-icon icon="fas fa-industry" color="hcex-staff" size="16" />
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
                <div class="text-body-2 font-weight-bold text-hcex-staff">
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
            color="hcex-staff"
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
          <v-icon icon="fas fa-seedling" color="hcex-staff" size="16" />
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
                <div class="text-body-2 font-weight-bold text-hcex-staff">
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
            color="hcex-staff"
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
            <v-icon icon="fas fa-paper-plane" color="hcex-staff" size="28" />
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
              <v-btn
                color="hcex-staff"
                rounded="lg"
                block
                @click="submitForward"
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
          <h3 class="text-h6 font-weight-bold mb-2">ส่งผลไม่อนุมัติ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งผลการตรวจ "ไม่อนุมัติ" กลับให้ผู้ยื่นคำขอ
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
            color="hcex-staff"
            rounded="lg"
            block
            @click="router.push({ name: 'HCEXstaffApplicationList' })"
          >
            กลับรายการคำขอ
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
            color="hcex-staff"
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

    <!-- LAB Detail Dialog -->
    <v-dialog v-model="labDetailDialog" max-width="540" scrollable>
      <v-card v-if="selectedLabType" rounded="xl" max-height="90vh">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon
            :icon="labTypes.find((l) => l.key === selectedLabType)?.icon"
            :color="labTypes.find((l) => l.key === selectedLabType)?.color"
            size="18"
          />
          <span class="text-body-1 font-weight-bold">
            ผลการตรวจ{{
              labTypes.find((l) => l.key === selectedLabType)?.label
            }}
          </span>
          <v-spacer />
          <v-chip
            size="x-small"
            :color="
              labResultsData[selectedLabType].status === 'pass'
                ? 'success'
                : 'error'
            "
            variant="tonal"
          >
            <v-icon
              :icon="
                labResultsData[selectedLabType].status === 'pass'
                  ? 'fas fa-circle-check'
                  : 'fas fa-circle-xmark'
              "
              size="9"
              class="mr-1"
            />
            {{
              labResultsData[selectedLabType].status === "pass"
                ? "ผ่าน"
                : "ไม่ผ่าน"
            }}
          </v-chip>
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            class="ml-1"
            @click="labDetailDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="lab-dialog-row">
            <span class="lab-dialog-label">เลขรายงาน</span>
            <span class="text-body-2 font-weight-bold text-hcex-staff">
              {{ labResultsData[selectedLabType].reportNo }}
            </span>
          </div>
          <div class="lab-dialog-row">
            <span class="lab-dialog-label">บันทึกโดย</span>
            <span class="text-body-2">{{
              labResultsData[selectedLabType].recordedBy
            }}</span>
          </div>
          <div class="lab-dialog-row">
            <span class="lab-dialog-label">วันที่บันทึก</span>
            <span class="text-body-2">{{
              labResultsData[selectedLabType].recordedAt
            }}</span>
          </div>
          <v-divider class="my-4" />
          <div
            class="text-caption text-medium-emphasis font-weight-medium mb-2 text-uppercase"
            style="letter-spacing: 0.5px"
          >
            ผลการตรวจวิเคราะห์
          </div>
          <div
            class="pa-3 rounded-lg text-body-2"
            style="
              background: rgba(var(--v-theme-on-surface), 0.04);
              white-space: pre-wrap;
              line-height: 1.8;
            "
          >
            {{ labResultsData[selectedLabType].result }}
          </div>
          <div v-if="labResultsData[selectedLabType].fileName" class="mt-4">
            <div
              class="item-row rounded-lg px-3 py-2 d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center ga-2">
                <v-icon icon="fas fa-file-pdf" color="error" size="16" />
                <span class="text-body-2">{{
                  labResultsData[selectedLabType].fileName
                }}</span>
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
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="labDetailDialog = false"
            >ปิด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStaffSessionStore } from "@/stores/staff-session.store";

const route = useRoute();
const router = useRouter();
const staffSessionStore = useStaffSessionStore();

const activeTab = ref("info");
const forwardDialog = ref(false);
const sendBackDialog = ref(false);
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

// ── LAB result data ───────────────────────────────────────
const labDetailDialog = ref(false);
const selectedLabType = ref(null);

const labTypes = [
  {
    key: "micro",
    label: "จุลชีววิทยา",
    icon: "fas fa-bacteria",
    color: "info",
  },
  { key: "chem", label: "เคมี", icon: "fas fa-flask", color: "warning" },
  {
    key: "contam",
    label: "สารปนเปื้อน",
    icon: "fas fa-triangle-exclamation",
    color: "error",
  },
];

const labResultsData = {
  micro: {
    reportNo: "LAB-0001-M",
    recordedBy: "นางสาวกมลา เคมีสุข (เจ้าหน้าที่ตรวจจุลชีววิทยา)",
    recordedAt: "03/01/2569 10:30",
    status: "pass",
    result:
      "Total Plate Count: 2.3 × 10³ CFU/g (เกณฑ์ ≤ 1.0 × 10⁶) — ผ่าน\nTotal Mold Count: < 10 CFU/g (เกณฑ์ ≤ 1.0 × 10²) — ผ่าน\nEscherichia coli: < 3.0 MPN/g — ผ่าน\nSalmonella spp.: ND in 25 g — ผ่าน\nStaphylococcus aureus: ND in 0.1 g — ผ่าน\n\nสรุปผล: ผ่านทุกรายการ",
    fileName: "LabReport_Micro_LAB0001.pdf",
  },
  chem: {
    reportNo: "LAB-0001-C",
    recordedBy: "นายวีระ เคมีดี (เจ้าหน้าที่ตรวจเคมี)",
    recordedAt: "03/01/2569 11:00",
    status: "pass",
    result:
      "Sulfites: 18.5 mg/kg (เกณฑ์ ≤ 30 mg/kg) — ผ่าน\nBenzoic acid: ไม่พบ — ผ่าน\nSorbic acid: ไม่พบ — ผ่าน\n\nสรุปผล: ผ่านทุกรายการ",
    fileName: "LabReport_Chem_LAB0001.pdf",
  },
  contam: {
    reportNo: "LAB-0001-P",
    recordedBy: "นางสาวประภา ปนเปื้อน (เจ้าหน้าที่ตรวจสารปนเปื้อน)",
    recordedAt: "03/01/2569 13:15",
    status: "pass",
    result:
      "Lead (Pb): < 0.01 mg/kg (เกณฑ์ ≤ 0.2 mg/kg) — ผ่าน\nCadmium (Cd): < 0.005 mg/kg (เกณฑ์ ≤ 0.05 mg/kg) — ผ่าน\nArsenic (As): < 0.01 mg/kg (เกณฑ์ ≤ 1.0 mg/kg) — ผ่าน\nMercury (Hg): < 0.001 mg/kg (เกณฑ์ ≤ 0.05 mg/kg) — ผ่าน\n\nสรุปผล: ผ่านทุกรายการ",
    fileName: "LabReport_Contam_LAB0001.pdf",
  },
};

function openLabDetail(type) {
  selectedLabType.value = type;
  labDetailDialog.value = true;
}

// ─────────────────────────────────────────────────────────
const step1Review = reactive({ result: "pass", remark: "", deadline: null });
const deadlineMenu = ref(false);
const deadlineBE = computed(() => {
  if (!step1Review.deadline) return "";
  const d = step1Review.deadline;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear() + 543}`;
});
const deadlineDays = computed(() => {
  if (!step1Review.deadline) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(step1Review.deadline);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
});

const application = {
  requestNo: "HC-0001",
  typecert: "คำร้องขอใบรับรองสุขอนามัย Health Certificate (กมพ.1)",
  submittedDate: "01/01/2569",
  applicantName: "นายสมชาย ใจดี",
  certQty: 3,
  status: "pending",
  currentStep: 0,

  exporterNameAddress:
    "THAI EXPORT CO., LTD.\n88/1 SUKHUMVIT ROAD, BANG PAKONG,\nCHACHOENGSAO 24130, THAILAND",

  consigneeNameAddress:
    "JAPAN FOOD IMPORT CO., LTD.\n1-2-3 SHIBUYA, TOKYO 150-0001\nJAPAN",

  shipment: {
    date: "15/01/2569",
    modes: ["SEA"],
    countryDestination: "JAPAN",
    placeOfDeparture: "ท่าเรือแหลมฉบัง (LAEM CHABANG PORT)",
    vessel: "EVER GIVEN V.001E",
  },

  goods: {
    manufacturer: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด (DOA-2566-00123)",
    analysisReportNo: "LAB-0001",
    analysisDate: "03/01/2569",
    shippingMark: "TH/EX/2569/001",
    descriptionOfGoods:
      "DRIED MANGO\nPRODUCED FROM FRESH MANGO\nCOUNTRY OF ORIGIN: THAILAND",
    quantity: "500",
    weightNW: "5,000",
    weightGW: "5,500",
    totalAmount: "USD 25,000.00",
  },

  specialRemark: "FIT FOR HUMAN CONSUMPTION",

  attachments: [
    { label: "Test_Report_LAB0001.pdf", docType: "Test Report" },
    { label: "Certificate_ISO22000.pdf", docType: "เอกสารประกอบ" },
  ],

  activityLog: [
    {
      type: "checking",
      action: "กำลังตรวจคำขอ",
      actor: staffSessionStore.displayName,
      timestamp: "",
      remark: "",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "01/01/2569 09:12",
      remark: "",
    },
  ],
};

const timelineSteps = [
  { value: 0, title: "ตรวจคำขอ" },
  { value: 1, title: "พิจารณา" },
  { value: 2, title: "ลงนาม" },
  { value: 3, title: "ชำระเงิน" },
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
      pending: "รอตรวจ",
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
      checking: "fas fa-magnifying-glass",
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
      submit: "hcex-staff",
      receive: "info",
      forward: "hcex-staff",
      review: "warning",
      checking: "hcex-staff",
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
      forward: "ส่งต่อ",
      review: "กำลังพิจารณา",
      checking: "ตรวจคำขอ",
      pending: "รอพิจารณา",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
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

function submitReject() {
  rejectDialog.value = false;
  successMessage.value = "ส่งผลการตรวจ 'ไม่อนุมัติ' เรียบร้อยแล้ว";
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
.step-line--done {
  background: rgb(var(--v-theme-hcex-staff)) !important;
}
.confirm-ring {
  background: rgba(var(--v-theme-hcex-staff), 0.1) !important;
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
  background: rgb(var(--v-theme-hcex-staff));
}
.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}
.activity-dot--forward {
  background: rgb(var(--v-theme-hcex-staff));
}
.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--checking {
  background: rgb(var(--v-theme-hcex-staff));
  animation: pulse-checking 1.6s ease-in-out infinite;
}
@keyframes pulse-checking {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-hcex-staff), 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-hcex-staff), 0);
  }
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
  background: rgb(var(--v-theme-warning));
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
.lab-result-row {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.lab-dialog-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.lab-dialog-row:last-child {
  border-bottom: none;
}
.lab-dialog-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.55);
  min-width: 120px;
  flex-shrink: 0;
  padding-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
</style>
