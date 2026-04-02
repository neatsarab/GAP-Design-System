<template>
  <div style="--v-theme-primary: var(--v-theme-cb-staff)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-cb-staff font-weight-medium">{{
            app.requestNo
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-chip :color="statusColor(app.status)" variant="tonal">
        <v-icon :icon="statusIcon(app.status)" size="13" class="mr-1" />
        {{ statusLabel(app.status) }}
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
                  v-if="currentStep > step.value"
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
                  currentStep >= step.value
                    ? 'text-cb-staff font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < timelineSteps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > step.value }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- ── Step 0: ตรวจคำขอ ── -->
    <template v-if="currentStep === 0">
      <v-row>
        <v-col cols="12" md="8">
          <v-tabs v-model="reviewTab" color="cb-staff" class="mb-4">
            <v-tab value="info" prepend-icon="fas fa-file-lines"
              >ข้อมูลคำขอ</v-tab
            >
            <v-tab value="review" prepend-icon="fas fa-clipboard-check"
              >บันทึกผลการตรวจ</v-tab
            >
          </v-tabs>

          <v-window v-model="reviewTab">
            <!-- Tab: ข้อมูลคำขอ -->
            <v-window-item value="info">
              <!-- ข้อมูลคำขอ -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-list-check" color="cb-staff" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >ข้อมูลคำขอ</span
                  >
                </div>
                <v-card-text class="pa-4">
                  <v-row dense>
                    <v-col cols="6" md="4">
                      <div class="info-label">เลขคำขอ</div>
                      <div class="info-value text-cb-staff font-weight-bold">
                        {{ app.requestNo }}
                      </div>
                    </v-col>
                    <v-col cols="6" md="4">
                      <div class="info-label">ประเภทคำขอ</div>
                      <div class="info-value">
                        <v-chip
                          size="x-small"
                          color="cb-staff"
                          variant="tonal"
                          >{{ app.requestType }}</v-chip
                        >
                      </div>
                    </v-col>
                    <v-col cols="6" md="4">
                      <div class="info-label">วันที่ยื่นคำขอ</div>
                      <div class="info-value">{{ app.submittedDate }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- ข้อมูลผู้ยื่นคำขอ -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-user" color="cb-staff" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >ข้อมูลผู้ยื่นคำขอ</span
                  >
                </div>
                <v-card-text class="pa-4">
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <div class="info-label">ชื่อ-นามสกุล / Full Name</div>
                      <div class="info-value">{{ app.applicantNameTh }}</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="info-label">ที่อยู่ / Address</div>
                      <div class="info-value">{{ applicantAddress }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">โทรศัพท์ / Phone</div>
                      <div class="info-value">{{ app.applicantPhone }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">โทรสาร / Fax</div>
                      <div class="info-value">{{ app.applicantFax }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">อีเมล / Email</div>
                      <div class="info-value">{{ app.applicantEmail }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- ข้อมูลสถานประกอบการ -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-building" color="cb-staff" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >ข้อมูลสถานประกอบการ</span
                  >
                </div>
                <v-card-text class="pa-4">
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <div class="info-label">ชื่อสถานประกอบการ (ไทย)</div>
                      <div class="info-value">{{ app.cbNameTh }}</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="info-label">Company Name (English)</div>
                      <div class="info-value">{{ app.cbNameEn }}</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="info-label">ที่ตั้ง (ภาษาไทย)</div>
                      <div class="info-value">{{ cbAddressTh }}</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="info-label">Address (English)</div>
                      <div class="info-value">{{ cbAddressEn }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">โทรศัพท์ / Phone</div>
                      <div class="info-value">{{ app.cbPhone }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">โทรสาร / Fax</div>
                      <div class="info-value">{{ app.cbFax }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="info-label">อีเมล / Email</div>
                      <div class="info-value">{{ app.cbEmail }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- ขอบข่ายมาตรฐานที่ขอขึ้นทะเบียน -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon
                    icon="fas fa-certificate"
                    color="cb-staff"
                    size="15"
                  />
                  <span class="text-subtitle-2 font-weight-bold"
                    >ขอบข่ายมาตรฐานที่ขอขึ้นทะเบียน</span
                  >
                </div>
                <v-table density="compact" class="pa-2">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ขอบข่ายมาตรฐาน</th>
                      <th>เลขที่ใบรับรองมาตรฐาน</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(std, i) in app.standards" :key="i">
                      <td class="text-body-2 text-medium-emphasis">
                        {{ i + 1 }}
                      </td>
                      <td class="text-body-2">{{ std.scope }}</td>
                      <td class="text-body-2 font-weight-medium text-cb-staff">
                        {{ std.certNo }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

              <!-- เอกสารแนบ -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-paperclip" color="cb-staff" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >เอกสารแนบ</span
                  >
                </div>
                <v-card-text class="pa-4">
                  <div
                    v-for="doc in app.attachments"
                    :key="doc.label"
                    class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
                  >
                    <div class="text-body-2">{{ doc.label }}</div>
                    <v-btn
                      size="x-small"
                      variant="tonal"
                      color="cb-staff"
                      rounded="lg"
                      prepend-icon="fas fa-download"
                    >
                      ดาวน์โหลด
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Tab: ผลการตรวจ -->
            <v-window-item value="review">
              <v-card rounded="xl" elevation="0" class="section-card">
                <v-card-text class="pa-5">
                  <!-- ผลการตรวจ -->
                  <div class="field-label mb-1">
                    <div>ผลการตรวจ</div>
                    <div class="field-label-en">Review Result</div>
                  </div>
                  <v-radio-group
                    v-model="review.decision"
                    color="cb-staff"
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
                    v-model="review.remark"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    rows="4"
                    placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                    class="mb-5"
                  />

                  <!-- แก้ไขภายในวันที่ (เฉพาะ ปรับปรุง) -->
                  <template v-if="review.decision === 'improve'">
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
                        v-model="review.deadline"
                        hide-header
                        locale="th"
                        @update:model-value="deadlineMenu = false"
                      />
                    </v-menu>
                    <div
                      v-if="review.deadline"
                      class="text-caption text-medium-emphasis mb-4"
                    >
                      จำนวน {{ deadlineDays }} วัน นับจากวันนี้
                    </div>
                  </template>

                  <!-- Action buttons -->
                  <v-row class="ga-2" no-gutters>
                    <v-col v-if="review.decision === 'improve'">
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
                    <v-col v-if="review.decision === 'fail'">
                      <v-btn
                        color="error"
                        variant="tonal"
                        block
                        rounded="lg"
                        prepend-icon="fas fa-circle-xmark"
                        @click="rejectDialog = true"
                      >
                        ส่งผลไม่ผ่าน
                      </v-btn>
                    </v-col>
                    <v-col v-if="review.decision === 'pass'">
                      <v-btn
                        color="cb-staff"
                        variant="flat"
                        block
                        rounded="lg"
                        prepend-icon="fas fa-paper-plane"
                        @click="saveReviewDialog = true"
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

        <!-- Right sidebar -->
        <v-col cols="12" md="4">
          <div class="sticky-col">
            <!-- ความคืบหน้าคำขอ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 d-flex align-center ga-2">
                <v-icon
                  icon="fas fa-clock-rotate-left"
                  color="cb-staff"
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
                    v-for="(event, i) in app.activityLog"
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
                        v-if="i < app.activityLog.length - 1"
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
                        <v-icon
                          icon="fas fa-calendar"
                          size="9"
                          class="mr-1"
                        />{{ event.timestamp }}
                      </div>
                      <v-btn
                        v-if="
                          event.type !== 'submit' && event.type !== 'checking'
                        "
                        size="x-small"
                        variant="text"
                        color="cb-staff"
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
    </template>

    <!-- Confirm Dialog: ส่งต่อพิจารณา (ผ่าน) -->
    <v-dialog v-model="saveReviewDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" size="28" color="cb-staff" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งต่อพิจารณา</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอนี้ไปยังเจ้าหน้าที่พิจารณา
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                block
                rounded="lg"
                @click="saveReviewDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="cb-staff"
                block
                rounded="lg"
                @click="submitSaveReview"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog: ส่งกลับแก้ไข (ปรับปรุง) -->
    <v-dialog v-model="sendBackDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-rotate-left" size="28" color="warning" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งกลับแก้ไข</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอกลับให้ผู้ยื่นแก้ไข
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                block
                rounded="lg"
                @click="sendBackDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="warning" block rounded="lg" @click="submitSendBack"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog: ส่งผลไม่ผ่าน (ไม่ผ่าน) -->
    <v-dialog v-model="rejectDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-xmark" size="28" color="error" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งผลไม่ผ่าน</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งผลการตรวจ "ไม่ผ่าน" กลับให้ผู้ยื่นคำขอ
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                block
                rounded="lg"
                @click="rejectDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="error" block rounded="lg" @click="submitReject"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
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
          <h3 class="text-h6 font-weight-bold mb-2">ดำเนินการสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ successMessage }}
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="cb-staff"
            rounded="lg"
            block
            @click="goToApplicationList"
            >กลับรายการคำขอ</v-btn
          >
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
                >{{ eventLabel(selectedEvent.type) }}</v-chip
              >
            </div>
          </div>
          <v-divider class="mb-4" />
          <div class="d-flex flex-column ga-3">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผู้ดำเนินการ
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-user" size="12" class="mr-1" />{{
                  selectedEvent?.actor
                }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                วันที่ / เวลา
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-calendar" size="12" class="mr-1" />{{
                  selectedEvent?.timestamp
                }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผลการพิจารณา
              </div>
              <v-chip
                size="small"
                :color="eventColor(selectedEvent?.type)"
                variant="tonal"
              >
                {{ eventLabel(selectedEvent?.type) }}
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
            color="cb-staff"
            variant="tonal"
            rounded="lg"
            block
            @click="activityDetailDialog = false"
            >ปิด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStaffSessionStore } from "@/stores/staff-session.store";

const router = useRouter();
const staffSessionStore = useStaffSessionStore();

function goToApplicationList() {
  router.push({ name: "CBStaffApplicationList" });
}

const currentStep = ref(0);
const reviewTab = ref("info");
const saveReviewDialog = ref(false);
const sendBackDialog = ref(false);
const rejectDialog = ref(false);
const successDialog = ref(false);
const successMessage = ref("");
const activityDetailDialog = ref(false);
const selectedEvent = ref(null);

function openActivityDetail(event) {
  selectedEvent.value = event;
  activityDetailDialog.value = true;
}

function submitSaveReview() {
  saveReviewDialog.value = false;
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
  successMessage.value = "ส่งผลการตรวจ 'ไม่ผ่าน' เรียบร้อยแล้ว";
  successDialog.value = true;
}

const timelineSteps = [
  { value: 0, title: "ตรวจคำขอ" },
  { value: 1, title: "พิจารณา" },
  { value: 2, title: "ลงนาม" },
];

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

const app = {
  requestNo: "CB-0001",
  requestType: "ขึ้นทะเบียน",
  submittedDate: "01/01/2569",
  typecert: "คำขอขึ้นทะเบียนเป็นหน่วยรับรองโรงงานผลิตสินค้าพืช",
  status: "pending",
  type: "register",

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

  cbNameTh: "บริษัท ไทยเซอร์ติฟาย จำกัด",
  cbNameEn: "Thai Certify Co., Ltd.",
  cbHouseNo: "456",
  cbRoad: "สุขุมวิท",
  cbTambol: "คลองเตย",
  cbDistrict: "คลองเตย",
  cbProvince: "กรุงเทพมหานคร",
  cbZipcode: "10110",
  cbHouseNoEn: "456",
  cbRoadEn: "Sukhumvit",
  cbTambolEn: "Khlong Toei",
  cbDistrictEn: "Khlong Toei",
  cbProvinceEn: "Bangkok",
  cbZipcodeEn: "10110",
  cbPhone: "02-456-7890",
  cbFax: "02-456-7891",
  cbEmail: "info@thaicertify.co.th",

  standards: [
    {
      scope:
        "มกษ. 9070-2566 หลักปฏิบัติในการตรวจและรับผลทุเรียนสำหรับโรงรวบรวมและโรงคัดบรรจุ",
      certNo: "NAC-2024-0001",
    },
    {
      scope: "มกษ. 9046-2560 การปฏิบัติที่ดีสำหรับการผลิตทุเรียนแช่เยือกแข็ง",
      certNo: "NAC-2024-0002",
    },
    {
      scope:
        "มกษ. 1004-2557 หลักปฏิบัติสำหรับกระบวนการรมผลไม้สดด้วยก๊าซซัลเฟอร์ไดออกไซด์",
      certNo: "NAC-2024-0003",
    },
  ],

  attachments: [
    {
      label:
        "แผนที่ตั้งสำนักงานใหญ่และสำนักงานสาขาในประเทศไทยที่ขอการรับรองโดยละเอียด",
    },
    {
      label:
        "ใบรับรองระบบงาน (Accreditation Certificate) จากสำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)",
    },
    { label: "สำเนาหลักฐานการอนุญาตเป็นผู้ประกอบการตรวจมาตรฐาน" },
    {
      label:
        "ทะเบียนรายชื่อผู้ตรวจประเมินของหน่วยรับรองโรงงานผลิตสินค้าพืช พร้อมประวัติการตรวจประเมินโรงงานผลิตสินค้าพืช",
    },
    { label: "ที่อยู่และรายชื่อสาขาที่อยู่ในประเทศไทย" },
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
      timestamp: "04/01/2569 10:30",
      remark: "",
    },
    {
      type: "sendback",
      action: "ส่งกลับแก้ไข",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
      timestamp: "03/01/2569 10:30",
      remark:
        "เอกสารสำเนาหนังสือรับรองนิติบุคคลไม่ครบถ้วน กรุณาแนบเอกสารฉบับที่ออกโดยกรมพัฒนาธุรกิจการค้าซึ่งออกไม่เกิน 3 เดือน",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "01/01/2569 09:12",
      remark: "",
    },
  ],

  // compat
  applicant: "บ.ไทยเซอร์ติฟาย จก.",
};

const applicantAddress = computed(() => {
  const a = app;
  return `${a.applicantHouseNo} ม.${a.applicantMoo} ถ.${a.applicantRoad} แขวง${a.applicantTambol} เขต${a.applicantDistrict} ${a.applicantProvince} ${a.applicantZipcode}`;
});

const cbAddressTh = computed(() => {
  const a = app;
  return `${a.cbHouseNo} ถ.${a.cbRoad} แขวง${a.cbTambol} เขต${a.cbDistrict} ${a.cbProvince} ${a.cbZipcode}`;
});

const cbAddressEn = computed(() => {
  const a = app;
  return `${a.cbHouseNoEn} ${a.cbRoadEn} Rd., ${a.cbTambolEn}, ${a.cbDistrictEn}, ${a.cbProvinceEn} ${a.cbZipcodeEn}`;
});

const review = reactive({ decision: "pass", remark: "", deadline: null });
const deadlineMenu = ref(false);
const deadlineBE = computed(() => {
  if (!review.deadline) return "";
  const d = review.deadline;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear() + 543}`;
});
const deadlineDays = computed(() => {
  if (!review.deadline) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(review.deadline);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
});

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
      submit: "cb-staff",
      receive: "info",
      forward: "cb-staff",
      review: "warning",
      checking: "cb-staff",
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

function statusColor(s) {
  return (
    {
      pending: "warning",
      reviewing: "info",
      signing: "info",
      need_edit: "error",
      approved: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}
function statusIcon(s) {
  return (
    {
      pending: "fas fa-clock",
      reviewing: "fas fa-magnifying-glass",
      signing: "fas fa-pen-nib",
      need_edit: "fas fa-rotate-left",
      approved: "fas fa-circle-check",
      rejected: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}
function statusLabel(s) {
  return (
    {
      pending: "รอตรวจ",
      reviewing: "อยู่ระหว่างตรวจ",
      signing: "รอลงนาม",
      need_edit: "รอแก้ไข",
      approved: "อนุมัติ",
      rejected: "ไม่อนุมัติ",
    }[s] ?? s
  );
}
</script>

<style scoped>
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
  background: rgb(var(--v-theme-cb-staff));
}
.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}
.activity-dot--forward {
  background: rgb(var(--v-theme-cb-staff));
}
.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--checking {
  background: rgb(var(--v-theme-cb-staff));
  animation: pulse-checking 1.6s ease-in-out infinite;
}
@keyframes pulse-checking {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-cb-staff), 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-cb-staff), 0);
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
</style>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-cb-staff));
  --step-color-tint: rgba(var(--v-theme-cb-staff), 0.2);
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-cb-staff)) !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-cb-staff), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-cb-staff)) !important;
}
.confirm-ring {
  background: rgba(var(--v-theme-cb-staff), 0.1) !important;
}
.section-header {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.info-label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
}
.info-value {
  font-size: 14px;
  font-weight: 500;
}

.item-row {
  background: rgba(var(--v-theme-cb-staff), 0.03);
}
</style>
