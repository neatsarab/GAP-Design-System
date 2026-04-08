<template>
  <div style="--v-theme-primary: var(--v-theme-hcex-user)">
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
          <span class="text-hcex-user font-weight-medium">{{
            route.params.id ?? application.requestNo
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
                    ? 'text-hcex-user font-weight-bold'
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
      <!-- ── Left: data sections ── -->
      <v-col cols="12" md="8">
        <!-- ข้อมูลคำขอ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-list-check" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลทั่วไป</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="6" md="4">
                <div class="info-label">เลขคำขอ</div>
                <div class="info-value text-hcex-user font-weight-bold">
                  {{ application.requestNo }}
                </div>
              </v-col>
              <v-col cols="6" md="4">
                <div class="info-label">ประเภทคำขอ</div>
                <div class="info-value">
                  <v-chip size="x-small" color="hcex-user" variant="tonal">{{
                    application.requestType
                  }}</v-chip>
                </div>
              </v-col>
              <v-col cols="6" md="4">
                <div class="info-label">วันที่ยื่นคำขอ</div>
                <div class="info-value">{{ application.submittedDate }}</div>
              </v-col>
              <v-col cols="6" md="4">
                <div class="info-label">จำนวนใบรับรองที่ขอ</div>
                <div class="info-value">{{ application.certQty }} ฉบับ</div>
              </v-col>
              <v-col cols="12">
                <div class="info-label">ประเภทใบรับรอง / Certificate Type</div>
                <div class="info-value">
                  <v-chip size="small" color="hcex-user" variant="tonal">{{
                    application.typecert
                  }}</v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ผู้ส่งออก / ผู้นำเข้า -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-user-tie" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ผู้ส่งออก / ผู้นำเข้า</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">
                  ผู้ส่งออก / Exporter Name &amp; Address
                </div>
                <div
                  class="info-value"
                  style="
                    font-family: monospace;
                    white-space: pre-line;
                    text-transform: uppercase;
                  "
                >
                  {{ application.exporterNameAddress }}
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">
                  ผู้นำเข้า / Consignee Name &amp; Address
                </div>
                <div
                  class="info-value"
                  style="
                    font-family: monospace;
                    white-space: pre-line;
                    text-transform: uppercase;
                  "
                >
                  {{ application.consigneeNameAddress }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- การขนส่ง -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-ship" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">การขนส่ง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">วันที่ส่งออก / Date of Departure</div>
                <div class="info-value">{{ application.shipment.date }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">
                  วิธีการขนส่ง / Mode of Transport
                </div>
                <div class="info-value d-flex flex-wrap ga-1">
                  <v-chip
                    v-for="m in application.shipment.modes"
                    :key="m"
                    size="x-small"
                    variant="tonal"
                    color="hcex-user"
                    >{{ m }}</v-chip
                  >
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">
                  ประเทศปลายทาง / Country of Destination
                </div>
                <div class="info-value">
                  {{ application.shipment.countryDestination }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">
                  สถานที่ส่งออก / Place of Departure
                </div>
                <div class="info-value">
                  {{ application.shipment.placeOfDeparture }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- สินค้า -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-box-open" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สินค้า</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">
                  ผู้ผลิต / Name and Address of Manufacturer
                </div>
                <div class="info-value">{{ application.goods.manufacturer }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">
                  เลขที่รายงาน / Analysis Report No.
                </div>
                <div class="info-value">
                  {{ application.goods.analysisReportNo }}
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">วันที่วิเคราะห์ / Analysis Date</div>
                <div class="info-value">{{ application.goods.analysisDate }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">
                  เครื่องหมายสินค้า / Shipping Mark
                </div>
                <div
                  class="info-value"
                  style="
                    font-family: monospace;
                    white-space: pre-line;
                    text-transform: uppercase;
                  "
                >
                  {{ application.goods.shippingMark }}
                </div>
              </v-col>
              <v-col cols="12" md="8">
                <div class="info-label">
                  รายละเอียดสินค้า / Description of Goods
                </div>
                <div
                  class="info-value"
                  style="
                    font-family: monospace;
                    white-space: pre-line;
                    text-transform: uppercase;
                  "
                >
                  {{ application.goods.descriptionOfGoods }}
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">จำนวน / Quantity</div>
                <div class="info-value">{{ application.goods.quantity }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">น้ำหนักสุทธิ / Net Weight</div>
                <div class="info-value">{{ application.goods.weightNW }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">น้ำหนักรวม / Gross Weight</div>
                <div class="info-value">{{ application.goods.weightGW }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">มูลค่ารวม / Total Amount</div>
                <div class="info-value">{{ application.goods.totalAmount }}</div>
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
            <v-icon icon="fas fa-comment-dots" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Special Remark</span>
          </div>
          <v-card-text class="pa-4">
            <div class="text-body-2">{{ application.specialRemark }}</div>
          </v-card-text>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-paperclip" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-card-text class="pa-4">
            <div
              v-for="doc in application.attachments"
              :key="doc.label"
              class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center ga-2">
                <v-icon icon="fas fa-file-alt" size="13" color="hcex-user" />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ doc.docType }}
                  </div>
                  <div class="text-body-2">{{ doc.label }}</div>
                </div>
              </div>
              <v-btn
                size="x-small"
                variant="tonal"
                color="hcex-user"
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลด
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: activity timeline (sticky) ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="hcex-user"
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
                    <div
                      v-if="event.type !== 'pending'"
                      class="text-caption text-medium-emphasis"
                    >
                      <v-icon icon="fas fa-user" size="9" class="mr-1" />{{
                        event.actor
                      }}
                    </div>
                    <div
                      v-if="event.type !== 'pending'"
                      class="text-caption text-medium-emphasis mt-1"
                    >
                      <v-icon icon="fas fa-calendar" size="9" class="mr-1" />{{
                        event.timestamp
                      }}
                    </div>
                    <v-btn
                      v-if="
                        event.type !== 'submit' && event.type !== 'pending'
                      "
                      size="x-small"
                      variant="text"
                      color="hcex-user"
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
            color="hcex-user"
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

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

const application = {
  requestNo: "HC-REQ-2569-001",
  requestType: "ใหม่",
  submittedDate: "10/03/2569",
  certQty: 1,
  typecert: "กมพ.1 ใบรับรองสุขอนามัยพืชสำหรับการส่งออก",
  status: "pending",
  currentStep: 1,

  exporterNameAddress:
    "THAI EXPORT CO., LTD.\n88/1 SUKHUMVIT RD., BANG PAKONG,\nCHACHOENGSAO 24130, THAILAND",
  consigneeNameAddress:
    "JAPAN IMPORT CO., LTD.\n1-2-3 SHINJUKU, TOKYO,\nJAPAN 160-0022",

  shipment: {
    date: "20/03/2569",
    modes: ["เรือ"],
    countryDestination: "ญี่ปุ่น",
    placeOfDeparture: "ท่าเรือแหลมฉบัง",
  },

  goods: {
    manufacturer: "บริษัท ไทย เอ็กซ์พอร์ต จำกัด",
    analysisReportNo: "LAB-2569-12345",
    analysisDate: "10/03/2569",
    shippingMark: "THAI EXPORT\nJAPAN",
    descriptionOfGoods:
      "FRESH MANGOES (MANGIFERA INDICA L.)\nVARIETY: NAM DOK MAI\nHARVESTED: MARCH 2569",
    quantity: "500 CARTONS",
    weightNW: "5,000 KGS",
    weightGW: "5,500 KGS",
    totalAmount: "500,000.00 THB",
  },

  specialRemark: "",

  attachments: [
    {
      docType: "ผลการวิเคราะห์ทางห้องปฏิบัติการ",
      label: "LAB-2569-12345.pdf",
    },
    { docType: "ใบรับรอง GAP", label: "GAP-2568-00123.pdf" },
  ],

  activityLog: [
    {
      type: "pending",
      action: "กำลังรอพิจารณา",
      actor: "",
      timestamp: "",
      remark: "",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจสอบ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
      timestamp: "12/03/2569 11:00",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "10/03/2569 09:00",
      remark: "",
    },
  ],
};

const timelineSteps = [
  { value: 0, title: "ยื่นคำขอ" },
  { value: 1, title: "ตรวจสอบ" },
  { value: 2, title: "พิจารณา" },
  { value: 3, title: "ลงนาม" },
  { value: 4, title: "ออกใบรับรอง" },
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
      pending: "info",
      reviewing: "warning",
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
      reviewing: "fas fa-magnifying-glass",
      approved: "fas fa-circle-check",
      rejected: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}

function statusLabel(s) {
  return (
    {
      draft: "แบบร่าง",
      pending: "รอพิจารณา",
      reviewing: "กำลังพิจารณา",
      approved: "อนุมัติ",
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
      submit: "hcex-user",
      receive: "info",
      forward: "success",
      review: "warning",
      pending: "info",
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
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-hcex-user));
  --step-color-tint: rgba(var(--v-theme-hcex-user), 0.2);
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
  background: rgb(var(--v-theme-hcex-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hcex-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hcex-user)) !important;
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
  background: rgb(var(--v-theme-hcex-user));
}
.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}
.activity-dot--forward {
  background: rgb(var(--v-theme-hcex-user));
}
.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--pending {
  background: rgb(var(--v-theme-info));
  animation: pulse-pending 1.6s ease-in-out infinite;
}
@keyframes pulse-pending {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-info), 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-info), 0);
  }
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
  margin-bottom: 0;
  min-height: 20px;
}
.activity-content {
  flex: 1;
  min-width: 0;
}
</style>
