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
        <h1 class="page-title mb-0">รายละเอียดใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขใบรับรอง:
          <span class="text-hcex-user font-weight-medium">{{
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
        <!-- สถานะใบรับรอง -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-certificate" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบรับรอง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบรับรอง / Certificate No.</div>
                <div class="info-value text-hcex-user font-weight-bold">
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
                  <v-chip size="small" color="hcex-user" variant="tonal">{{
                    cert.typecert
                  }}</v-chip>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">วันที่ออกใบรับรอง / Issue Date</div>
                <div class="info-value">{{ cert.issueDate }}</div>
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
                  {{ cert.exporterNameAddress }}
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
                  {{ cert.consigneeNameAddress }}
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
                <div class="info-value">{{ cert.shipment.date }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">วิธีการขนส่ง / Mode of Transport</div>
                <div class="info-value d-flex flex-wrap ga-1">
                  <v-chip
                    v-for="m in cert.shipment.modes"
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
                <div class="info-value">{{ cert.shipment.countryDestination }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">
                  สถานที่ส่งออก / Place of Departure
                </div>
                <div class="info-value">{{ cert.shipment.placeOfDeparture }}</div>
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
                <div class="info-value">{{ cert.goods.manufacturer }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">เลขที่รายงาน / Analysis Report No.</div>
                <div class="info-value">{{ cert.goods.analysisReportNo }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">วันที่วิเคราะห์ / Analysis Date</div>
                <div class="info-value">{{ cert.goods.analysisDate }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">เครื่องหมายสินค้า / Shipping Mark</div>
                <div
                  class="info-value"
                  style="
                    font-family: monospace;
                    white-space: pre-line;
                    text-transform: uppercase;
                  "
                >
                  {{ cert.goods.shippingMark }}
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
                  {{ cert.goods.descriptionOfGoods }}
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">จำนวน / Quantity</div>
                <div class="info-value">{{ cert.goods.quantity }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">น้ำหนักสุทธิ / Net Weight</div>
                <div class="info-value">{{ cert.goods.weightNW }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">น้ำหนักรวม / Gross Weight</div>
                <div class="info-value">{{ cert.goods.weightGW }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">มูลค่ารวม / Total Amount</div>
                <div class="info-value">{{ cert.goods.totalAmount }}</div>
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
            <v-icon icon="fas fa-comment-dots" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Special Remark</span>
          </div>
          <v-card-text class="pa-4">
            <div class="text-body-2">{{ cert.specialRemark }}</div>
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
              v-for="doc in cert.attachments"
              :key="doc.label"
              class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center ga-2">
                <v-icon
                  icon="fas fa-file-alt"
                  size="13"
                  color="hcex-user"
                />
                <div>
                  <div class="text-caption text-medium-emphasis">{{ doc.docType }}</div>
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

      <!-- ── Right: cert actions + activity log ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ปุ่มดาวน์โหลดใบรับรอง -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4 d-flex flex-column ga-2">
              <v-btn
                color="hcex-user"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
                @click="downloadCertPdf"
              >
                ดาวน์โหลดใบรับรอง (PDF)
              </v-btn>
              <v-btn
                color="hcex-user"
                variant="tonal"
                block
                rounded="lg"
                prepend-icon="fas fa-print"
                @click="downloadCertPdf"
              >
                พิมพ์ใบรับรอง
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- ความคืบหน้า -->
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
                >ประวัติใบรับรอง</span
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
                ผลการดำเนินการ
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

const cert = {
  certNo: "HC-2569-001",
  requestNo: "HC-REQ-2569-001",
  typecert: "กมพ.1 ใบรับรองสุขอนามัยพืชสำหรับการส่งออก",
  issueDate: "15/03/2569",
  status: "issued",

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

  specialRemark:
    "สินค้าผ่านการตรวจสอบตามมาตรฐานการส่งออกของกรมวิชาการเกษตร",

  attachments: [
    {
      docType: "ผลการวิเคราะห์ทางห้องปฏิบัติการ",
      label: "LAB-2569-12345.pdf",
    },
    { docType: "ใบรับรอง GAP", label: "GAP-2568-00123.pdf" },
  ],

  activityLog: [
    {
      type: "issue",
      action: "ออกใบรับรอง",
      actor: "ระบบ",
      timestamp: "15/03/2569 10:00",
      remark: "เลขใบรับรอง HC-2569-001",
    },
    {
      type: "forward",
      action: "ผ่านการลงนาม",
      actor: "นายศักดิ์ศรี นาดี (ผู้ลงนาม)",
      timestamp: "15/03/2569 09:30",
    },
    {
      type: "forward",
      action: "ผ่านการพิจารณา",
      actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
      timestamp: "13/03/2569 14:20",
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

function certStatusColor(s) {
  return (
    {
      issued: "success",
      active: "success",
      expiring: "warning",
      expired: "error",
    }[s] ?? "grey"
  );
}

function certStatusIcon(s) {
  return (
    {
      issued: "fas fa-circle-check",
      active: "fas fa-circle-check",
      expiring: "fas fa-clock",
      expired: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}

function certStatusLabel(s) {
  return (
    {
      issued: "ออกใบรับรองแล้ว",
      active: "มีผล",
      expiring: "ใกล้หมดอายุ",
      expired: "หมดอายุ",
    }[s] ?? s
  );
}

function downloadCertPdf() {
  const c = cert;
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>ใบรับรอง ${c.certNo}</title>
<style>
  body { font-family: 'Arial', sans-serif; margin: 0; padding: 32px; font-size: 12px; }
  .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 4px; }
  .subtitle { text-align: center; font-size: 13px; margin-bottom: 20px; }
  .cert-no { text-align: center; font-size: 13px; font-weight: bold; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  td { padding: 6px 8px; vertical-align: top; }
  .label { width: 38%; font-weight: bold; color: #444; }
  .mono { font-family: monospace; white-space: pre-line; text-transform: uppercase; }
  .border-box { border: 1px solid #999; padding: 10px; margin-bottom: 12px; }
  .section-title { font-weight: bold; font-size: 12px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; }
  .sig-area { margin-top: 40px; text-align: right; }
  .sig-line { border-top: 1px solid #333; width: 220px; display: inline-block; margin-top: 40px; }
</style></head><body>
<div class="title">กรมวิชาการเกษตร</div>
<div class="subtitle">ใบรับรองสุขอนามัยพืชสำหรับการส่งออก (กมพ.1)</div>
<div class="cert-no">เลขที่ใบรับรอง: ${c.certNo}</div>
<table>
  <tr><td class="label">เลขคำขออ้างอิง / Request No.</td><td>${c.requestNo}</td>
      <td class="label">วันที่ออก / Issue Date</td><td>${c.issueDate}</td></tr>
</table>
<div class="border-box">
  <div class="section-title">ผู้ส่งออก / Exporter</div>
  <div class="mono">${c.exporterNameAddress}</div>
</div>
<div class="border-box">
  <div class="section-title">ผู้นำเข้า / Consignee</div>
  <div class="mono">${c.consigneeNameAddress}</div>
</div>
<div class="section-title">การขนส่ง / Shipment</div>
<table>
  <tr><td class="label">วันที่ส่งออก</td><td>${c.shipment.date}</td>
      <td class="label">วิธีการขนส่ง</td><td>${c.shipment.modes.join(", ")}</td></tr>
  <tr><td class="label">ประเทศปลายทาง</td><td>${c.shipment.countryDestination}</td>
      <td class="label">สถานที่ส่งออก</td><td>${c.shipment.placeOfDeparture}</td></tr>
</table>
<div class="section-title">รายละเอียดสินค้า / Goods</div>
<table>
  <tr><td class="label">ผู้ผลิต</td><td colspan="3">${c.goods.manufacturer}</td></tr>
  <tr><td class="label">เลขที่รายงานวิเคราะห์</td><td>${c.goods.analysisReportNo}</td>
      <td class="label">วันที่วิเคราะห์</td><td>${c.goods.analysisDate}</td></tr>
  <tr><td class="label">เครื่องหมายสินค้า</td><td class="mono">${c.goods.shippingMark}</td>
      <td class="label">รายละเอียดสินค้า</td><td class="mono">${c.goods.descriptionOfGoods}</td></tr>
  <tr><td class="label">จำนวน</td><td>${c.goods.quantity}</td>
      <td class="label">น้ำหนักสุทธิ</td><td>${c.goods.weightNW}</td></tr>
  <tr><td class="label">น้ำหนักรวม</td><td>${c.goods.weightGW}</td>
      <td class="label">มูลค่ารวม</td><td>${c.goods.totalAmount}</td></tr>
</table>
${c.specialRemark ? `<div class="section-title">Special Remark</div><p>${c.specialRemark}</p>` : ""}
<div class="sig-area">
  <div class="sig-line"></div><br/>
  <div>เจ้าหน้าที่ผู้ออกใบรับรอง</div>
  <div>กรมวิชาการเกษตร</div>
</div>
</body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
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
      submit: "hcex-user",
      receive: "info",
      forward: "success",
      review: "warning",
      pending: "info",
      approve: "success",
      reject: "error",
      sendback: "warning",
      issue: "hcex-user",
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
      issue: "ออกใบรับรอง",
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
  background: rgb(var(--v-theme-hcex-user));
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
.activity-dot--issue {
  background: rgb(var(--v-theme-hcex-user));
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
