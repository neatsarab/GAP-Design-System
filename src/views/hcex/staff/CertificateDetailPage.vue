<template>
  <div style="--v-theme-primary: var(--v-theme-hcex-staff)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดใบทะเบียน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขทะเบียน:
          <span class="text-hcex-staff font-weight-medium">{{
            route.params.id ?? cert.certNo
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-chip :color="certStatusColor(cert.status)" variant="tonal">
        <v-icon :icon="certStatusIcon(cert.status)" size="13" class="mr-1" />
        {{ certStatusLabel(cert.status) }}
      </v-chip>
    </div>

    <v-row>
      <!-- ── Left: data sections ── -->
      <v-col cols="12" md="8">
        <!-- สถานะใบทะเบียน -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-certificate" color="hcex-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบทะเบียน</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบทะเบียน / Certificate No.</div>
                <div class="info-value text-hcex-staff font-weight-bold">
                  {{ cert.certNo }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">เลขคำขออ้างอิง / Request No.</div>
                <div class="info-value">{{ cert.requestNo }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">สถานะ / Status</div>
                <div class="info-value">
                  <v-chip
                    :color="certStatusColor(cert.status)"
                    size="small"
                    variant="tonal"
                    :prepend-icon="certStatusIcon(cert.status)"
                  >
                    {{ certStatusLabel(cert.status) }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="info-label">ประเภทใบรับรอง / Certificate Type</div>
                <div class="info-value">
                  <v-chip size="small" color="hcex-staff" variant="tonal">
                    {{ cert.typecert }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">วันที่ออกใบรับรอง / Issue Date</div>
                <div class="info-value">{{ cert.issueDate }}</div>
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
                  {{ cert.exporterNameAddress }}
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
                  {{ cert.consigneeNameAddress }}
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
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลการขนส่ง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="3">
                <div class="info-label">Date of Shipment</div>
                <div class="info-value">{{ cert.shipment.date }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">Mode of Transport</div>
                <div class="d-flex flex-wrap ga-1 mt-1">
                  <v-chip
                    v-for="m in cert.shipment.modes"
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
                  {{ cert.shipment.countryDestination }}
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">Place of Departure</div>
                <div class="info-value">
                  {{ cert.shipment.placeOfDeparture }}
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Vessel / Vehicle</div>
                <div class="info-value">{{ cert.shipment.vessel }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลสินค้า -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-boxes-stacked" color="hcex-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลสินค้า</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">Manufacturer</div>
                <div class="info-value">{{ cert.goods.manufacturer }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">Analysis Report No.</div>
                <div class="info-value text-hcex-staff font-weight-bold">
                  {{ cert.goods.analysisReportNo }}
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">Date</div>
                <div class="info-value">{{ cert.goods.analysisDate }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Shipping Mark</div>
                <div class="info-value">{{ cert.goods.shippingMark }}</div>
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
                  {{ cert.goods.descriptionOfGoods }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">Quantity (CTNS.)</div>
                <div class="info-value">{{ cert.goods.quantity }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">Weight N.W. / G.W.</div>
                <div class="info-value">
                  {{ cert.goods.weightNW }} / {{ cert.goods.weightGW }} KGS.
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">Total Amount (USD)</div>
                <div class="info-value font-weight-bold">
                  {{ cert.goods.totalAmount }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Special Remark -->
        <v-card
          v-if="cert.specialRemark"
          rounded="xl"
          elevation="0"
          class="section-card mb-4"
        >
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-comment-dots" color="hcex-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Special Remark</span>
          </div>
          <v-card-text class="pa-4">
            <div
              class="info-value"
              style="font-family: monospace; text-transform: uppercase"
            >
              {{ cert.specialRemark }}
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
              v-for="doc in cert.attachments"
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
      </v-col>

      <!-- ── Right: actions + activity log ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ปุ่มดาวน์โหลดใบทะเบียน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4">
              <v-btn
                color="hcex-staff"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลดใบทะเบียน (PDF)
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- ประวัติใบทะเบียน -->
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
                >ประวัติใบทะเบียน</span
              >
            </div>
            <v-card-text
              class="pa-4"
              style="max-height: 420px; overflow-y: auto"
            >
              <div class="activity-timeline">
                <div
                  v-for="(event, i) in cert.activityLog"
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
                      v-if="i < cert.activityLog.length - 1"
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
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const cert = {
  certNo: "HC-2569-001",
  requestNo: "HC-0001",
  typecert: "กมพ.1 ใบรับรองสุขอนามัย สำหรับสินค้าแปรรูปด้านพืช",
  issueDate: "20/02/2569",
  status: "active",

  exporterNameAddress:
    "Thai Export Co., Ltd.\n88/1 Sukhumvit Rd., Bang Pakong,\nChachoengsao 24130, Thailand",
  consigneeNameAddress:
    "Japan Importer Co., Ltd.\n1-2-3 Shinjuku, Shinjuku-ku,\nTokyo 160-0022, Japan",

  shipment: {
    date: "15/02/2569",
    modes: ["SEA"],
    countryDestination: "Japan",
    placeOfDeparture: "Laem Chabang Port, Thailand",
    vessel: "MV THAI STAR / VOY.001",
  },

  goods: {
    manufacturer:
      "Thai Export Co., Ltd. 88/1 Sukhumvit Rd., Bang Pakong, Chachoengsao",
    analysisReportNo: "LAB-2569-00123",
    analysisDate: "20/12/2568",
    shippingMark: "TE/JP/2569/001",
    descriptionOfGoods:
      "Frozen Durian (Durio zibethinus Murr.)\nHS Code: 0811.90.90\nProduct of Thailand",
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
      type: "issue",
      action: "ออกใบทะเบียน",
      actor: "ระบบ",
      timestamp: "08/01/2569 11:23",
      remark: "เลขทะเบียน HC-2569-005",
    },
    {
      type: "forward",
      action: "ผ่านการลงนาม",
      actor: "นายศักดิ์ศรี นาดี (ผู้ลงนาม)",
      timestamp: "08/01/2569 11:23",
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

function certStatusColor(s) {
  return (
    { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey"
  );
}

function certStatusIcon(s) {
  return (
    {
      active: "fas fa-circle-check",
      expiring: "fas fa-clock",
      expired: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}

function certStatusLabel(s) {
  return (
    { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s
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
      issue: "fas fa-certificate",
      renew: "fas fa-rotate",
      revoke: "fas fa-ban",
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
      pending: "info",
      approve: "success",
      reject: "error",
      sendback: "warning",
      issue: "hcex-staff",
      renew: "info",
      revoke: "error",
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
      issue: "ออกใบทะเบียน",
      renew: "ต่ออายุ",
      revoke: "เพิกถอน",
    }[type] ?? type
  );
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
  background: rgb(var(--v-theme-success));
}
.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--pending {
  background: rgb(var(--v-theme-info));
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
.activity-dot--issue {
  background: rgb(var(--v-theme-hcex-staff));
}
.activity-dot--renew {
  background: rgb(var(--v-theme-info));
}
.activity-dot--revoke {
  background: rgb(var(--v-theme-error));
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
