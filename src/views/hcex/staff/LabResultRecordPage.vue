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
        <h1 class="page-title mb-0">บันทึกผล LAB</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hcex-staff font-weight-medium">{{
            route.params.id ?? "LABW-0001"
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-chip color="warning" variant="tonal">
        <v-icon icon="fas fa-clock" size="13" class="mr-1" />
        รอตรวจ
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
      <!-- Left: tabs -->
      <v-col cols="12" md="8">
        <v-tabs v-model="activeTab" color="hcex-staff" class="mb-4">
          <v-tab value="info" prepend-icon="fas fa-file-lines"
            >ข้อมูลคำขอ</v-tab
          >
          <v-tab value="record" prepend-icon="fas fa-microscope"
            >บันทึกผล LAB</v-tab
          >
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Tab 1: ข้อมูลคำขอ -->
          <v-window-item value="info">
            <!-- ข้อมูลตัวอย่าง -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-box" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ข้อมูลตัวอย่าง</span
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
                    <div class="info-label">วันที่ส่งตรวจ</div>
                    <div class="info-value">{{ application.dateSent }}</div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="info-label">วันที่เก็บตัวอย่าง</div>
                    <div class="info-value">
                      {{ application.dateCollected }}
                    </div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="info-label">วันผลิต</div>
                    <div class="info-value">{{ application.mfgDate }}</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อผลิตภัณฑ์ (ไทย)</div>
                    <div class="info-value">
                      {{ application.productNameTh }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ชื่อผลิตภัณฑ์ (อังกฤษ)</div>
                    <div class="info-value">
                      {{ application.productNameEn }}
                    </div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="info-label">รหัสผลิตภัณฑ์</div>
                    <div class="info-value">{{ application.productCode }}</div>
                  </v-col>
                  <v-col cols="6" md="3">
                    <div class="info-label">วันหมดอายุ</div>
                    <div class="info-value">{{ application.expDate }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ข้อมูลผู้ประกอบการ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-user-tie" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ผู้ประกอบการ</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">บริษัท / ผู้ประกอบการ</div>
                    <div class="info-value">{{ application.operatorName }}</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ที่อยู่</div>
                    <div class="info-value">
                      {{ application.operatorAddress }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- สถานที่เก็บตัวอย่าง -->
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
                  >สถานที่เก็บตัวอย่าง & ห้องปฏิบัติการ</span
                >
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="info-label">สถานที่เก็บตัวอย่าง</div>
                    <div class="info-value">
                      {{ application.collectingLocation }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-label">ห้องปฏิบัติการ</div>
                    <div class="info-value">
                      {{ application.laboratoryName }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ประเภทการตรวจและรายการทดสอบ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-vials" color="hcex-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ประเภทการตรวจและรายการทดสอบ</span
                >
              </div>
              <v-card-text class="pa-4">
                <div class="d-flex flex-wrap ga-2 mb-4">
                  <v-chip
                    v-for="t in application.labType"
                    :key="t"
                    :color="labTypeColor(t)"
                    variant="tonal"
                    size="small"
                  >
                    <v-icon :icon="labTypeIcon(t)" size="11" class="mr-1" />
                    {{ labTypeLabel(t) }}
                  </v-chip>
                </div>
                <v-divider class="mb-3" />
                <div v-for="t in application.labType" :key="t" class="mb-4">
                  <div class="d-flex align-center ga-2 mb-2">
                    <v-chip
                      :color="labTypeColor(t)"
                      variant="tonal"
                      size="x-small"
                    >
                      {{ labTypeLabel(t) }}
                    </v-chip>
                    <span class="text-body-2 font-weight-medium"
                      >รายการทดสอบ</span
                    >
                  </div>
                  <div
                    v-for="item in application.testItems[t]"
                    :key="item.name"
                    class="item-row rounded-lg px-3 py-2 mb-1 d-flex align-center justify-space-between"
                  >
                    <div class="d-flex align-center ga-2">
                      <v-icon
                        icon="fas fa-circle"
                        :color="labTypeColor(t)"
                        size="6"
                      />
                      <span class="text-body-2">{{ item.name }}</span>
                    </div>
                    <span class="text-caption text-medium-emphasis">{{
                      item.criteria
                    }}</span>
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

          <!-- Tab 2: บันทึกผล LAB -->
          <v-window-item value="record">
            <!-- ส่วนที่บันทึกแล้วโดยเจ้าหน้าที่อื่น (read-only) -->
            <template v-for="t in application.labType" :key="t">
              <template v-if="recordedResults[t]">
                <v-card
                  rounded="xl"
                  elevation="0"
                  class="section-card mb-4 recorded-card"
                >
                  <div
                    class="section-header px-4 py-3 border-b d-flex align-center ga-2"
                  >
                    <v-icon
                      :icon="labTypeIcon(t)"
                      :color="labTypeColor(t)"
                      size="15"
                    />
                    <span class="text-subtitle-2 font-weight-bold">
                      ผลการตรวจ{{ labTypeLabel(t) }}
                    </span>
                    <v-chip
                      :color="labTypeColor(t)"
                      variant="tonal"
                      size="x-small"
                      class="ml-1"
                    >
                      {{ labTypeLabel(t) }}
                    </v-chip>
                    <v-spacer />
                    <v-chip color="success" variant="tonal" size="x-small">
                      <v-icon
                        icon="fas fa-circle-check"
                        size="10"
                        class="mr-1"
                      />
                      บันทึกแล้ว
                    </v-chip>
                  </div>
                  <v-card-text class="pa-5">
                    <div class="d-flex align-center ga-2 mb-3">
                      <v-icon
                        icon="fas fa-user"
                        size="12"
                        color="medium-emphasis"
                      />
                      <span class="text-caption text-medium-emphasis">
                        บันทึกโดย:
                        <strong>{{ recordedResults[t].recordedBy }}</strong>
                      </span>
                      <v-icon
                        icon="fas fa-calendar"
                        size="12"
                        color="medium-emphasis"
                        class="ml-2"
                      />
                      <span class="text-caption text-medium-emphasis">{{
                        recordedResults[t].recordedAt
                      }}</span>
                    </div>
                    <div class="recorded-text rounded-lg pa-3">
                      {{ recordedResults[t].result }}
                    </div>
                    <div v-if="recordedResults[t].fileName" class="mt-3">
                      <div
                        class="item-row rounded-lg px-3 py-2 d-flex align-center justify-space-between"
                      >
                        <div class="d-flex align-center ga-2">
                          <v-icon
                            icon="fas fa-file-pdf"
                            color="error"
                            size="16"
                          />
                          <span class="text-body-2">{{
                            recordedResults[t].fileName
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
                </v-card>
              </template>
            </template>

            <!-- ส่วนที่เจ้าหน้าที่จุลต้องบันทึก (editable) -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div
                class="section-header px-4 py-3 border-b d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-bacteria" color="info" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >ผลการตรวจจุลชีววิทยา</span
                >
                <v-chip color="info" variant="tonal" size="x-small" class="ml-1"
                  >จุลชีววิทยา</v-chip
                >
              </div>
              <v-card-text class="pa-5">
                <div class="field-label mb-1">
                  <div>ผลการตรวจวิเคราะห์ (จุลชีววิทยา)</div>
                  <div class="field-label-en">
                    Microbiological Analysis Result
                  </div>
                </div>
                <v-textarea
                  v-model="labResults.micro"
                  placeholder="กรอกผลการตรวจจุลชีววิทยา เช่น ค่าที่ตรวจพบ เทียบกับเกณฑ์มาตรฐาน และสรุปผล..."
                  variant="outlined"
                  rounded="lg"
                  :rows="6"
                  auto-grow
                  hide-details
                />
                <div class="field-label mb-1 mt-4">
                  <div>เอกสารรายงานผล</div>
                  <div class="field-label-en">Lab Report Document</div>
                </div>
                <v-file-input
                  v-model="labFiles.micro"
                  placeholder="แนบไฟล์รายงานผล จุลชีววิทยา (PDF)"
                  prepend-inner-icon="fas fa-paperclip"
                  prepend-icon=""
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  accept=".pdf,.doc,.docx"
                  hide-details
                />
              </v-card-text>
            </v-card>

            <!-- Submit button -->
            <div class="d-flex justify-end mt-2">
              <v-btn
                color="hcex-staff"
                rounded="lg"
                size="large"
                prepend-icon="fas fa-save"
                :disabled="!labResults.micro.trim()"
                @click="confirmDialog = true"
              >
                บันทึกผล
              </v-btn>
            </div>
          </v-window-item>
        </v-window>
      </v-col>

      <!-- Right: activity timeline (sticky) -->
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
              style="max-height: 480px; overflow-y: auto"
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

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-microscope" color="hcex-staff" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการบันทึกผล</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการบันทึกผลการตรวจ LAB สำหรับเลขคำขอ
            <strong class="text-hcex-staff">{{
              route.params.id ?? "LABW-0001"
            }}</strong>
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
                @click="confirmDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="hcex-staff"
                rounded="lg"
                block
                @click="submitResult"
              >
                ยืนยัน
              </v-btn>
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
          <h3 class="text-h6 font-weight-bold mb-2">บันทึกผลสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ผลการตรวจ LAB ของเลขคำขอ
            <strong class="text-hcex-staff">{{
              route.params.id ?? "LABW-0001"
            }}</strong>
            ถูกบันทึกเรียบร้อยแล้ว
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="hcex-staff"
            rounded="lg"
            block
            @click="router.push({ name: 'HCEXstaffLabWaitingList' })"
          >
            กลับรายการรอตรวจ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeTab = ref("info");
const confirmDialog = ref(false);
const successDialog = ref(false);

// Form state สำหรับส่วนที่ตัวเองบันทึก
const labResults = reactive({ micro: "" });
const labFiles = reactive({ micro: null });

// Mock ผลที่เจ้าหน้าที่อื่นบันทึกมาแล้ว (เคมีบันทึกแล้ว)
const recordedResults = {
  chem: {
    recordedBy: "นางสาวกมลา เคมีสุข (เจ้าหน้าที่ตรวจเคมี)",
    recordedAt: "07/04/2569 10:45",
    result:
      "Sulfites: ตรวจพบ 18.5 mg/kg (เกณฑ์ ≤ 30 mg/kg) — ผ่าน\nBenzoic acid: ไม่พบ — ผ่าน\nSorbic acid: ไม่พบ — ผ่าน\n\nสรุปผล: ผ่านทุกรายการ",
    fileName: "LabReport_Chem_LABW0001.pdf",
  },
};

const application = {
  requestNo: "LABW-0001",
  productNameTh: "มะม่วงอบแห้ง",
  productNameEn: "Dried Mango",
  productCode: "DM-2569-001",
  mfgDate: "20/12/2568",
  expDate: "20/12/2570",
  dateCollected: "28/03/2569",
  dateSent: "03/04/2569",
  operatorName: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
  operatorAddress: "456 ถนนรังสิต-นครนายก ต.รังสิต อ.ธัญบุรี จ.ปทุมธานี 12110",
  collectingLocation:
    "โกดังสินค้า บริษัท ไทยฟู้ดส์ แปรรูป จำกัด อ.ธัญบุรี จ.ปทุมธานี",
  laboratoryName: "ศูนย์วิทยาศาสตร์การแพทย์ที่ 4 สระบุรี",
  labType: ["micro", "chem"],
  testItems: {
    micro: [
      { name: "Total Plate Count", criteria: "≤ 1.0 × 10⁶ CFU/g" },
      { name: "Total Mold Count", criteria: "≤ 1.0 × 10² CFU/g" },
      { name: "Escherichia coli", criteria: "≤ 3.0 MPN/g" },
      { name: "Salmonella spp.", criteria: "ND in 25 g" },
      { name: "Staphylococcus aureus", criteria: "ND in 0.1 g" },
    ],
    chem: [
      { name: "Sulfites", criteria: "≤ 30 mg/kg" },
      { name: "Benzoic acid", criteria: "ไม่พบ" },
      { name: "Sorbic acid", criteria: "ไม่พบ" },
    ],
    contam: [],
  },
  attachments: [
    { label: "ใบนำส่งตัวอย่าง_LABW0001.pdf", docType: "ใบนำส่งตัวอย่าง" },
    { label: "กมพ.29_LABW0001.pdf", docType: "กมพ.29" },
  ],
  currentStep: 2,
  activityLog: [
    {
      type: "checking",
      action: "กำลังตรวจวิเคราะห์",
      actor: "เจ้าหน้าที่ห้องปฏิบัติการ",
      timestamp: "",
    },
    {
      type: "submit",
      action: "ส่งตัวอย่างเข้าห้องปฏิบัติการ",
      actor: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
      timestamp: "03/04/2569 09:30",
    },
    {
      type: "submit",
      action: "ยื่นคำขอพิจารณาผล Lab",
      actor: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
      timestamp: "01/04/2569 14:00",
    },
  ],
};

const timelineSteps = [
  { value: 0, title: "ยื่นคำขอ" },
  { value: 1, title: "ตรวจสอบ" },
  { value: 2, title: "ตรวจ Lab" },
];

function stepClass(v) {
  if (application.currentStep > v) return "step-done";
  if (application.currentStep === v) return "step-active";
  return "step-pending";
}

function labTypeColor(t) {
  return { micro: "info", chem: "warning", contam: "error" }[t] ?? "grey";
}

function labTypeIcon(t) {
  return (
    {
      micro: "fas fa-bacteria",
      chem: "fas fa-flask",
      contam: "fas fa-triangle-exclamation",
    }[t] ?? "fas fa-vial"
  );
}

function labTypeLabel(t) {
  return { micro: "จุลชีววิทยา", chem: "เคมี", contam: "สารปนเปื้อน" }[t] ?? t;
}

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      receive: "fas fa-inbox",
      checking: "fas fa-magnifying-glass",
      approve: "fas fa-circle-check",
      reject: "fas fa-circle-xmark",
    }[type] ?? "fas fa-circle"
  );
}

function eventColor(type) {
  return (
    {
      submit: "hcex-staff",
      receive: "info",
      checking: "hcex-staff",
      approve: "success",
      reject: "error",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      receive: "รับเรื่อง",
      checking: "ตรวจวิเคราะห์",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
    }[type] ?? type
  );
}

function submitResult() {
  confirmDialog.value = false;
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
  background: rgba(var(--v-theme-on-surface), 0.03);
}
.recorded-card {
  opacity: 0.85;
}
.recorded-text {
  background: rgba(var(--v-theme-on-surface), 0.04);
  font-size: 13px;
  white-space: pre-wrap;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface));
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
.activity-dot--checking {
  background: rgb(var(--v-theme-hcex-staff));
  animation: pulse-checking 1.6s ease-in-out infinite;
}
.activity-dot--approve {
  background: rgb(var(--v-theme-success));
}
.activity-dot--reject {
  background: rgb(var(--v-theme-error));
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
