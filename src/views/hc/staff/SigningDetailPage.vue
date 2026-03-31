<template>
  <div style="--v-theme-primary: var(--v-theme-hc-staff)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToSigningList"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hc-staff font-weight-medium">{{
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
                    ? 'text-hc-staff font-weight-bold'
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

    <!-- ── Step: ลงนาม ── -->
    <template v-if="currentStep === 2">
      <v-row>
        <v-col cols="12" md="8">
          <v-tabs v-model="signingTab" color="hc-staff" class="mb-4">
            <v-tab value="info" prepend-icon="fas fa-file-lines"
              >ข้อมูลคำขอ</v-tab
            >
            <v-tab value="signing" prepend-icon="fas fa-pen-nib"
              >บันทึกการลงนาม</v-tab
            >
          </v-tabs>

          <v-window v-model="signingTab">
            <!-- Tab: ข้อมูลคำขอ -->
            <v-window-item value="info">
              <!-- ข้อมูลคำขอ -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-list-check" color="hc-staff" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >ข้อมูลคำขอ</span
                  >
                </div>
                <v-card-text class="pa-4">
                  <v-row dense>
                    <v-col cols="6" md="4">
                      <div class="info-label">เลขคำขอ</div>
                      <div class="info-value text-hc-staff font-weight-bold">
                        {{ app.requestNo }}
                      </div>
                    </v-col>
                    <v-col cols="6" md="4">
                      <div class="info-label">ประเภทคำขอ</div>
                      <div class="info-value">
                        <v-chip
                          size="x-small"
                          color="hc-staff"
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
                  <v-icon icon="fas fa-user" color="hc-staff" size="15" />
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

              <!-- ข้อมูลผู้ส่งออก -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-building" color="hc-staff" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >ข้อมูลผู้ส่งออก</span
                  >
                </div>
                <v-card-text class="pa-4">
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <div class="info-label">ชื่อผู้ส่งออก (ไทย)</div>
                      <div class="info-value">{{ app.cbNameTh }}</div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="info-label">Exporter Name (English)</div>
                      <div class="info-value">{{ app.cbNameEn }}</div>
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

              <!-- เอกสารแนบ -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-paperclip" color="hc-staff" size="15" />
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
                      color="hc-staff"
                      rounded="lg"
                      prepend-icon="fas fa-download"
                    >
                      ดาวน์โหลด
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Tab: ลงนาม -->
            <v-window-item value="signing">
              <v-card rounded="xl" elevation="0" class="section-card">
                <v-card-text class="pa-5">
                  <!-- เลขใบรับรอง -->
                  <div class="field-label mb-2">
                    <div>เลขใบรับรอง</div>
                    <div class="field-label-en">Certificate Number</div>
                  </div>
                  <v-card variant="outlined" rounded="lg" class="mb-5">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>เลขใบรับรอง</th>
                          <th style="width: 110px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <span
                              class="text-body-2 font-weight-bold text-hc-staff"
                              >{{ certNo }}</span
                            >
                          </td>
                          <td>
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="hc-staff"
                              rounded="lg"
                              prepend-icon="fas fa-eye"
                              :disabled="!certNo"
                            >
                              ดูตัวอย่าง
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card>

                  <!-- ผลการลงนาม -->
                  <div class="field-label mb-1">
                    <div>ผลการลงนาม</div>
                    <div class="field-label-en">Signing Result</div>
                  </div>
                  <v-radio-group
                    v-model="signing.decision"
                    color="hc-staff"
                    inline
                  >
                    <v-radio value="approve" class="mr-6">
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
                    <v-radio value="reject">
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
                    v-model="signing.remark"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    rows="4"
                    placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                    class="mb-5"
                  />

                  <!-- Action buttons -->
                  <v-row class="ga-2" no-gutters>
                    <v-col v-if="signing.decision === 'reject'">
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
                    <v-col v-if="signing.decision === 'approve'">
                      <v-btn
                        color="hc-staff"
                        variant="flat"
                        block
                        rounded="lg"
                        prepend-icon="fas fa-pen-nib"
                        @click="approveDialog = true"
                      >
                        ลงนาม
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
                  color="hc-staff"
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
                          event.type !== 'submit' && event.type !== 'signing'
                        "
                        size="x-small"
                        variant="text"
                        color="hc-staff"
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

    <!-- Confirm Dialog: ลงนามอนุมัติ -->
    <v-dialog v-model="approveDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-pen-nib" size="28" color="hc-staff" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลงนามอนุมัติ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการลงนามอนุมัติคำขอนี้ใช่หรือไม่?
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
                @click="approveDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="hc-staff" block rounded="lg" @click="submitApprove"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog: ไม่อนุมัติ -->
    <v-dialog v-model="rejectDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-xmark" size="28" color="error" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ไม่อนุมัติ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการไม่อนุมัติคำขอนี้ใช่หรือไม่?
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
          <v-btn color="hc-staff" rounded="lg" block @click="goToSigningList"
            >กลับรายการรอลงนาม</v-btn
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
            color="hc-staff"
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

const staffSessionStore = useStaffSessionStore();
const router = useRouter();

function goToSigningList() {
  router.push({ name: "HCStaffSigningList" });
}

const currentStep = ref(2);
const signingTab = ref("info");
const approveDialog = ref(false);
const rejectDialog = ref(false);
const successDialog = ref(false);
const successMessage = ref("");
const activityDetailDialog = ref(false);
const selectedEvent = ref(null);

function openActivityDetail(event) {
  selectedEvent.value = event;
  activityDetailDialog.value = true;
}

function submitApprove() {
  approveDialog.value = false;
  successMessage.value = "ลงนามอนุมัติคำขอเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitReject() {
  rejectDialog.value = false;
  successMessage.value = "บันทึกผลการไม่อนุมัติเรียบร้อยแล้ว";
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
  requestNo: "HC-0003",
  requestType: "ขอใบรับรอง",
  submittedDate: "10/03/2569",
  status: "signing",
  type: "new",

  applicantNameTh: "นายประสิทธิ์ พานิช",
  applicantHouseNo: "88",
  applicantMoo: "5",
  applicantRoad: "รามคำแหง",
  applicantTambol: "หัวหมาก",
  applicantDistrict: "บางกะปิ",
  applicantProvince: "กรุงเทพมหานคร",
  applicantZipcode: "10240",
  applicantPhone: "02-987-6543",
  applicantFax: "-",
  applicantEmail: "prasit@greenfresh.co.th",

  cbNameTh: "บริษัท กรีนเฟรช จำกัด",
  cbNameEn: "Green Fresh Co., Ltd.",
  cbPhone: "02-987-6543",
  cbFax: "02-987-6544",
  cbEmail: "info@greenfresh.co.th",

  attachments: [
    { label: "แบบคำขอออกหนังสือรับรองสุขอนามัยพืช" },
    { label: "สำเนาใบรับรอง GAP" },
    { label: "เอกสารแสดงปริมาณสินค้า" },
    { label: "ผลการตรวจวิเคราะห์ตัวอย่าง" },
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
      actor: "นายสมศักดิ์ มั่นคง (เจ้าหน้าที่พิจารณา)",
      timestamp: "08/03/2569 15:30",
      remark: "ตรวจครบถ้วน อนุมัติ",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
      timestamp: "05/03/2569 11:00",
      remark: "ตรวจเอกสารครบถ้วน ส่งต่อพิจารณา",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายประสิทธิ์ พานิช (ผู้ยื่นคำขอ)",
      timestamp: "10/03/2569 09:00",
      remark: "",
    },
  ],
};

const signing = reactive({ decision: "approve", remark: "" });

function generateCertNo() {
  const now = new Date();
  const year = now.getFullYear() + 543;
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `HC-${year}-${seq}`;
}

const certNo = ref(generateCertNo());

const applicantAddress = computed(() => {
  const a = app;
  return `${a.applicantHouseNo} ม.${a.applicantMoo} ถ.${a.applicantRoad} แขวง${a.applicantTambol} เขต${a.applicantDistrict} ${a.applicantProvince} ${a.applicantZipcode}`;
});

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      signing: "fas fa-pen-nib",
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
      submit: "hc-staff",
      receive: "info",
      forward: "success",
      signing: "hc-staff",
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
      signing: "กำลังลงนาม",
      review: "กำลังพิจารณา",
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
      signing: "warning",
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
  background: rgb(var(--v-theme-hc-staff));
}
.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}
.activity-dot--forward {
  background: rgb(var(--v-theme-hc-staff));
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
.activity-dot--signing {
  background: rgb(var(--v-theme-hc-staff));
  animation: pulse-signing 1.6s ease-in-out infinite;
}
@keyframes pulse-signing {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-hc-staff), 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-hc-staff), 0);
  }
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

div {
  --step-color: rgb(var(--v-theme-hc-staff));
  --step-color-tint: rgba(var(--v-theme-hc-staff), 0.2);
}
.step-done,
.step-active {
  background: rgb(var(--v-theme-hc-staff)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hc-staff), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hc-staff)) !important;
}
.confirm-ring {
  background: rgba(var(--v-theme-hc-staff), 0.1) !important;
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
  background: rgba(var(--v-theme-hc-staff), 0.03);
}
</style>
