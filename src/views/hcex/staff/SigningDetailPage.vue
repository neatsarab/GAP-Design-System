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
          <v-tab value="signing" prepend-icon="fas fa-pen-nib">
            บันทึกการลงนาม
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- ── Tab 1: ข้อมูลคำขอ ── -->
          <v-window-item value="info">

            <!-- ข้อมูลทั่วไป -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                <v-icon icon="fas fa-list-check" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ข้อมูลทั่วไป</span>
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="6" md="3">
                    <div class="info-label">เลขคำขอ</div>
                    <div class="info-value text-hcex-staff font-weight-bold">{{ application.requestNo }}</div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="info-label">วันที่ยื่นคำขอ</div>
                    <div class="info-value">{{ application.submittedDate }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">ผู้ยื่นคำขอ</div>
                    <div class="info-value">{{ application.applicantName }}</div>
                  </v-col>
                  <v-col cols="6" md="2">
                    <div class="info-label">จำนวนใบรับรองที่ต้องการ</div>
                    <div class="info-value font-weight-bold">{{ application.certQty }} ฉบับ</div>
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
              <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                <v-icon icon="fas fa-user-tie" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ส่งออก / ผู้นำเข้า</span>
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label mb-1">Exporter Name and Address</div>
                    <div
                      class="info-value-block rounded-lg pa-3"
                      style="background: rgba(var(--v-theme-surface-variant), 0.5); font-family: monospace; white-space: pre-wrap; text-transform: uppercase"
                    >{{ application.exporterNameAddress }}</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label mb-1">Consignee Name and Address Including Country</div>
                    <div
                      class="info-value-block rounded-lg pa-3"
                      style="background: rgba(var(--v-theme-surface-variant), 0.5); font-family: monospace; white-space: pre-wrap; text-transform: uppercase"
                    >{{ application.consigneeNameAddress }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลการขนส่ง -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                <v-icon icon="fas fa-ship" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ข้อมูลการขนส่ง</span>
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="3">
                    <div class="info-label">Date of Shipment</div>
                    <div class="info-value">{{ application.shipment.date }}</div>
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
                      >{{ m }}</v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Country of Destination</div>
                    <div class="info-value">{{ application.shipment.countryDestination }}</div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Place of Departure</div>
                    <div class="info-value">{{ application.shipment.placeOfDeparture }}</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">Vessel / Vehicle</div>
                    <div class="info-value">{{ application.shipment.vessel }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลสินค้า -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                <v-icon icon="fas fa-boxes-stacked" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ข้อมูลสินค้า</span>
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">Manufacturer</div>
                    <div class="info-value">{{ application.goods.manufacturer }}</div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Analysis Report No.</div>
                    <div class="info-value text-hcex-staff font-weight-bold">{{ application.goods.analysisReportNo }}</div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="info-label">Date</div>
                    <div class="info-value">{{ application.goods.analysisDate }}</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">Shipping Mark</div>
                    <div class="info-value">{{ application.goods.shippingMark }}</div>
                  </v-col>
                  <v-col cols="12">
                    <div class="info-label mb-1">Description of Goods</div>
                    <div
                      class="info-value-block rounded-lg pa-3"
                      style="background: rgba(var(--v-theme-surface-variant), 0.5); font-family: monospace; white-space: pre-wrap; text-transform: uppercase"
                    >{{ application.goods.descriptionOfGoods }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">Quantity (CTNS.)</div>
                    <div class="info-value">{{ application.goods.quantity }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">Weight N.W. / G.W.</div>
                    <div class="info-value">{{ application.goods.weightNW }} / {{ application.goods.weightGW }} KGS.</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">Total Amount (USD)</div>
                    <div class="info-value font-weight-bold">{{ application.goods.totalAmount }}</div>
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
              <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                <v-icon icon="fas fa-comment-dots" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">Special Remark</span>
              </div>
              <v-card-text class="pa-4">
                <div class="info-value" style="font-family: monospace; text-transform: uppercase">
                  {{ application.specialRemark }}
                </div>
              </v-card-text>
            </v-card>

            <!-- เอกสารแนบ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
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
                      <div class="text-caption text-medium-emphasis">{{ doc.docType }}</div>
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

          <!-- ── Tab 2: บันทึกการลงนาม ── -->
          <v-window-item value="signing">
            <v-card rounded="xl" elevation="0" class="section-card">
              <v-card-text class="pa-5">
                <!-- เลขทะเบียน -->
                <div class="field-label mb-2">
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
                            color="hcex-staff"
                            variant="tonal"
                            >{{ item.country }}</v-chip
                          >
                        </td>
                        <td>
                          <span
                            class="text-body-2 font-weight-bold text-hcex-staff"
                            >{{ item.certNo }}</span
                          >
                        </td>
                        <td>
                          <v-btn
                            size="small"
                            variant="tonal"
                            color="hcex-staff"
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

                <!-- ผลการลงนาม -->
                <div class="field-label mb-3">
                  <div>ผลการลงนาม</div>
                  <div class="field-label-en">Signing Result</div>
                </div>
                <v-radio-group
                  v-model="signingResult.result"
                  color="hcex-staff"
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

                <!-- หมายเหตุ -->
                <div class="field-label mb-1">
                  <div>หมายเหตุ</div>
                  <div class="field-label-en">Remarks</div>
                </div>
                <v-textarea
                  v-model="signingResult.remark"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="4"
                  placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                  class="mb-5"
                />

                <!-- Action buttons inline -->
                <v-row class="ga-2" no-gutters>
                  <v-col v-if="signingResult.result === 'approve'">
                    <v-btn
                      color="hcex-staff"
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
                      v-if="event.type !== 'submit' && event.type !== 'signing'"
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

    <!-- Signing Dialog -->
    <v-dialog v-model="signingDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-pen-nib" color="hcex-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการลงนาม</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการลงนามในใบทะเบียน
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
                @click="signingDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="hcex-staff"
                rounded="lg"
                block
                @click="submitSigning"
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
            color="hcex-staff"
            rounded="lg"
            block
            @click="router.push({ name: 'HCEXstaffRegistry' })"
          >
            ไปยังหน้ารายการใบทะเบียน
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
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStaffSessionStore } from "@/stores/staff-session.store";

const route = useRoute();
const router = useRouter();
const staffSessionStore = useStaffSessionStore();

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
      <div style="font-size:16pt;font-weight:700;margin:8px 0">ใบรับรองสุขอนามัยพืชสำหรับสินค้าแปรรูปด้านพืช (กมพ.1)</div>
      <div class="label">Phytosanitary Certificate for Processed Plant Products</div>
      <div class="watermark">ร่าง / DRAFT</div>
      <div class="cert-no">${item.certNo}</div>
    </div>
    <hr />
    <div class="grid">
      <div>
        <div class="label">Exporter</div>
        <div class="value" style="font-family:monospace;text-transform:uppercase">${application.exporterNameAddress}</div>
      </div>
      <div>
        <div class="label">Consignee</div>
        <div class="value" style="font-family:monospace;text-transform:uppercase">${application.consigneeNameAddress}</div>
      </div>
      <div>
        <div class="label">Country of Destination</div>
        <div class="value">${application.shipment.countryDestination}</div>
      </div>
      <div>
        <div class="label">Mode of Transport</div>
        <div class="value">${application.shipment.modes.join(', ')}</div>
      </div>
      <div style="grid-column:1/-1">
        <div class="label">Description of Goods</div>
        <div class="value" style="font-family:monospace;text-transform:uppercase">${application.goods.descriptionOfGoods}</div>
      </div>
    </div>
    <hr />
    <div class="footer">ตัวอย่างเท่านั้น — เลขอาจเปลี่ยนแปลงได้ก่อนลงนาม</div>
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
  requestNo: "HC-0001",
  submittedDate: "01/01/2569",
  applicantName: "นายสมชาย ใจดี",
  certQty: 3,
  typecert: "กมพ.1 ใบรับรองสุขอนามัยพืชสำหรับสินค้าแปรรูปด้านพืช",
  status: "signing",
  currentStep: 2,

  exporterNameAddress: "Thai Export Co., Ltd.\n88/1 Sukhumvit Rd., Bang Pakong,\nChachoengsao 24130, Thailand",
  consigneeNameAddress: "Japan Importer Co., Ltd.\n1-2-3 Shinjuku, Shinjuku-ku,\nTokyo 160-0022, Japan",

  shipment: {
    date: "15/02/2569",
    modes: ["SEA"],
    countryDestination: "Japan",
    placeOfDeparture: "Laem Chabang Port, Thailand",
    vessel: "MV THAI STAR / VOY.001",
  },

  goods: {
    manufacturer: "Thai Export Co., Ltd. 88/1 Sukhumvit Rd., Bang Pakong, Chachoengsao",
    analysisReportNo: "LAB-2569-00123",
    analysisDate: "20/12/2568",
    shippingMark: "TE/JP/2569/001",
    descriptionOfGoods: "Frozen Durian (Durio zibethinus Murr.)\nHS Code: 0811.90.90\nProduct of Thailand",
    quantity: "500 CTNS.",
    weightNW: "10,000",
    weightGW: "11,500",
    totalAmount: "USD 45,000.00",
  },

  specialRemark: "",

  attachments: [
    { label: "รายงานผลการวิเคราะห์ (Test Report)", docType: "บังคับ" },
    { label: "ใบกำกับสินค้า (Invoice)", docType: "ประกอบ" },
    { label: "บัญชีราคาสินค้า (Packing List)", docType: "ประกอบ" },
  ],

  activityLog: [
    {
      type: "signing",
      action: "กำลังลงนาม",
      actor: staffSessionStore.displayName,
      timestamp: "",
      remark: "",
    },
    {
      type: "forward",
      action: "ผ่านการพิจารณา",
      actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
      timestamp: "06/01/2569 14:20",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
      timestamp: "05/01/2569 11:00",
    },
    {
      type: "sendback",
      action: "ส่งกลับแก้ไข",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
      timestamp: "03/01/2569 10:30",
      remark:
        "เอกสารสำเนาหนังสือรับรองนิติบุคคลไม่ครบถ้วน กรุณาแนบเอกสารฉบับที่ออกโดยกรมพัฒนาธุรกิจการค้าซึ่งออกไม่เกิน 3 เดือน และแก้ไขพิกัดที่ตั้งโรงงานให้ถูกต้องตามทะเบียนโรงงาน",
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

// Generate cert number per shipment
const certYearBE = new Date().getFullYear() + 543;
const certNumbers = reactive([
  {
    country: application.shipment.countryDestination,
    certNo: `HC-${certYearBE}-001`,
  },
]);

const timelineSteps = [
  { value: 0, title: "ตรวจคำขอ" },
  { value: 1, title: "พิจารณา" },
  { value: 2, title: "ลงนาม" },
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
      signing: "fas fa-pen-nib",
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
      forward: "success",
      review: "warning",
      signing: "hcex-staff",
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
      signing: "กำลังลงนาม",
      pending: "รอพิจารณา",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
    }[type] ?? type
  );
}

function submitSigning() {
  signingDialog.value = false;
  successMessage.value = "ลงนามใบทะเบียนเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitReject() {
  rejectDialog.value = false;
  successMessage.value = "บันทึกผลการไม่อนุมัติเรียบร้อยแล้ว";
  successDialog.value = true;
}
</script>

<style scoped>
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
.activity-dot--signing {
  background: rgb(var(--v-theme-hcex-staff));
  animation: pulse-signing 1.6s ease-in-out infinite;
}
@keyframes pulse-signing {
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
</style>
