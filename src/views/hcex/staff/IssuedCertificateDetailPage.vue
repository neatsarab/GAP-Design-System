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
        <h1 class="page-title mb-0">รายละเอียดใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขใบรับรอง:
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
      <!-- ── Left: certificate content ── -->
      <v-col cols="12" md="8">

        <!-- สถานะใบรับรอง -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
            <v-icon icon="fas fa-certificate" color="hcex-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบรับรอง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบรับรอง / Certificate No.</div>
                <div class="info-value text-hcex-staff font-weight-bold">{{ cert.certNo }}</div>
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
              <v-col cols="12" md="4">
                <div class="info-label">วันที่ยื่นคำขอ / Submit Date</div>
                <div class="info-value">{{ cert.submittedDate }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">ผู้ยื่นคำขอ</div>
                <div class="info-value">{{ cert.applicantName }}</div>
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
                >{{ cert.exporterNameAddress }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label mb-1">Consignee Name and Address Including Country</div>
                <div
                  class="info-value-block rounded-lg pa-3"
                  style="background: rgba(var(--v-theme-surface-variant), 0.5); font-family: monospace; white-space: pre-wrap; text-transform: uppercase"
                >{{ cert.consigneeNameAddress }}</div>
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
                  >{{ m }}</v-chip>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">Country of Destination</div>
                <div class="info-value">{{ cert.shipment.countryDestination }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">Place of Departure</div>
                <div class="info-value">{{ cert.shipment.placeOfDeparture }}</div>
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
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
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
                <div class="info-value text-hcex-staff font-weight-bold">{{ cert.goods.analysisReportNo }}</div>
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
                  style="background: rgba(var(--v-theme-surface-variant), 0.5); font-family: monospace; white-space: pre-wrap; text-transform: uppercase"
                >{{ cert.goods.descriptionOfGoods }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">Quantity (CTNS.)</div>
                <div class="info-value">{{ cert.goods.quantity }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">Weight N.W. / G.W.</div>
                <div class="info-value">{{ cert.goods.weightNW }} / {{ cert.goods.weightGW }} KGS.</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">Total Amount (USD)</div>
                <div class="info-value font-weight-bold">{{ cert.goods.totalAmount }}</div>
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
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
            <v-icon icon="fas fa-comment-dots" color="hcex-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">Special Remark</span>
          </div>
          <v-card-text class="pa-4">
            <div class="info-value" style="font-family: monospace; text-transform: uppercase">
              {{ cert.specialRemark }}
            </div>
          </v-card-text>
        </v-card>

        <!-- ลายเซ็นผู้ลงนาม -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
            <v-icon icon="fas fa-pen-nib" color="hcex-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">การลงนาม</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ผู้ลงนาม / Authorised Officer</div>
                <div class="info-value font-weight-medium">{{ cert.signerName }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">ตำแหน่ง / Position</div>
                <div class="info-value">{{ cert.signerPosition }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="info-label">วันที่ลงนาม / Signed Date</div>
                <div class="info-value">{{ cert.signedDate }}</div>
              </v-col>
            </v-row>
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
              v-for="doc in cert.attachments"
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
      </v-col>

      <!-- ── Right: actions + activity log ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ปุ่มดาวน์โหลด -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4 d-flex flex-column ga-2">
              <v-btn
                color="hcex-staff"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
                @click="downloadCertPdf"
              >
                ดาวน์โหลดใบรับรอง (PDF)
              </v-btn>
              <v-btn
                color="hcex-staff"
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

          <!-- ประวัติใบรับรอง -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
              <v-icon icon="fas fa-clock-rotate-left" color="hcex-staff" size="15" />
              <span class="text-subtitle-2 font-weight-bold">ประวัติใบรับรอง</span>
            </div>
            <v-card-text class="pa-4" style="max-height: 420px; overflow-y: auto">
              <div class="activity-timeline">
                <div
                  v-for="(event, i) in cert.activityLog"
                  :key="i"
                  class="activity-item"
                >
                  <div class="activity-dot-wrap">
                    <div class="activity-dot" :class="`activity-dot--${event.type}`">
                      <v-icon :icon="eventIcon(event.type)" size="11" color="white" />
                    </div>
                    <div v-if="i < cert.activityLog.length - 1" class="activity-line" />
                  </div>
                  <div class="activity-content pb-4">
                    <div class="d-flex align-center flex-wrap ga-1 mb-1">
                      <span class="text-body-2 font-weight-medium">{{ event.action }}</span>
                      <v-chip size="x-small" :color="eventColor(event.type)" variant="tonal">
                        {{ eventLabel(event.type) }}
                      </v-chip>
                    </div>
                    <div v-if="event.remark" class="text-caption text-medium-emphasis mb-1">
                      {{ event.remark }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon icon="fas fa-user" size="9" class="mr-1" />{{ event.actor }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      <v-icon icon="fas fa-calendar" size="9" class="mr-1" />{{ event.timestamp }}
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
  typecert: "กมพ.1 ใบรับรองสุขอนามัยพืชสำหรับสินค้าแปรรูปด้านพืช",
  status: "active",
  issueDate: "20/02/2569",
  submittedDate: "01/01/2569",
  applicantName: "นายสมชาย ใจดี",

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

  signerName: "นายศักดิ์ศรี นาดี",
  signerPosition: "นักวิชาการเกษตรชำนาญการพิเศษ",
  signedDate: "20/02/2569",

  attachments: [
    { label: "รายงานผลการวิเคราะห์ (Test Report)", docType: "บังคับ" },
    { label: "ใบกำกับสินค้า (Invoice)", docType: "ประกอบ" },
    { label: "บัญชีราคาสินค้า (Packing List)", docType: "ประกอบ" },
  ],

  activityLog: [
    {
      type: "issue",
      action: "ออกใบรับรอง",
      actor: "ระบบ",
      timestamp: "20/02/2569 11:23",
      remark: "เลขใบรับรอง HC-2569-001",
    },
    {
      type: "forward",
      action: "ผ่านการลงนาม",
      actor: "นายศักดิ์ศรี นาดี (ผู้ลงนาม)",
      timestamp: "20/02/2569 11:00",
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
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "01/01/2569 09:12",
    },
  ],
};

function downloadCertPdf() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate ${cert.certNo}</title>
  <style>
    @page { size: A4; margin: 20mm 25mm; }
    body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #1a1a1a; }
    .center { text-align: center; }
    .border-box { border: 2px solid #1a5276; border-radius: 4px; padding: 24px; }
    .header-title { font-size: 15pt; font-weight: 700; margin: 8px 0; }
    .cert-no { font-size: 16pt; font-weight: 700; color: #1a5276; border: 2px solid #1a5276;
      display: inline-block; padding: 4px 20px; border-radius: 4px; margin: 8px 0; }
    hr { border: none; border-top: 1px solid #ccc; margin: 12px 0; }
    .label { font-size: 9pt; color: #666; margin-bottom: 2px; }
    .value { font-size: 11pt; font-weight: 600; margin-bottom: 10px; }
    .mono { font-family: 'Courier New', monospace; text-transform: uppercase; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 16px; }
    .full { grid-column: 1/-1; }
    .footer { font-size: 9pt; color: #888; text-align: center; margin-top: 16px; }
    .sign-area { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; margin-top: 24px; }
    .sign-box { text-align: center; border-top: 1px solid #333; padding-top: 8px; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="border-box">
    <div class="center">
      <div class="label">กรมวิชาการเกษตร • Department of Agriculture, Thailand</div>
      <div class="header-title">ใบรับรองสุขอนามัยพืชสำหรับสินค้าแปรรูปด้านพืช</div>
      <div class="label">Phytosanitary Certificate for Processed Plant Products (กมพ.1)</div>
      <div class="cert-no">${cert.certNo}</div>
    </div>
    <hr />
    <div class="grid2">
      <div>
        <div class="label">1. Exporter Name and Address</div>
        <div class="value mono">${cert.exporterNameAddress}</div>
      </div>
      <div>
        <div class="label">2. Consignee Name and Address Including Country</div>
        <div class="value mono">${cert.consigneeNameAddress}</div>
      </div>
    </div>
    <hr />
    <div class="grid3">
      <div>
        <div class="label">3. Date of Shipment</div>
        <div class="value">${cert.shipment.date}</div>
      </div>
      <div>
        <div class="label">4. Mode of Transport</div>
        <div class="value">${cert.shipment.modes.join(', ')}</div>
      </div>
      <div>
        <div class="label">5. Country of Destination</div>
        <div class="value">${cert.shipment.countryDestination}</div>
      </div>
      <div>
        <div class="label">6. Place of Departure</div>
        <div class="value">${cert.shipment.placeOfDeparture}</div>
      </div>
      <div class="full">
        <div class="label">7. Vessel / Vehicle</div>
        <div class="value">${cert.shipment.vessel}</div>
      </div>
    </div>
    <hr />
    <div class="grid2">
      <div>
        <div class="label">8. Manufacturer</div>
        <div class="value">${cert.goods.manufacturer}</div>
      </div>
      <div>
        <div class="label">9. Analysis Report No. / Date</div>
        <div class="value">${cert.goods.analysisReportNo} / ${cert.goods.analysisDate}</div>
      </div>
      <div class="full">
        <div class="label">10. Description of Goods / Shipping Mark</div>
        <div class="value mono">${cert.goods.descriptionOfGoods}\n\nShipping Mark: ${cert.goods.shippingMark}</div>
      </div>
    </div>
    <div class="grid3">
      <div>
        <div class="label">11. Quantity (CTNS.)</div>
        <div class="value">${cert.goods.quantity}</div>
      </div>
      <div>
        <div class="label">12. Weight N.W. / G.W.</div>
        <div class="value">${cert.goods.weightNW} / ${cert.goods.weightGW} KGS.</div>
      </div>
      <div>
        <div class="label">13. Total Amount (USD)</div>
        <div class="value">${cert.goods.totalAmount}</div>
      </div>
    </div>
    <hr />
    <div class="sign-area">
      <div>
        <div class="label">Issued at / ออกที่: กรมวิชาการเกษตร, กรุงเทพมหานคร</div>
        <div class="label">Date / วันที่: ${cert.issueDate}</div>
        <div class="sign-box">
          <div>${cert.signerName}</div>
          <div class="label">${cert.signerPosition}</div>
          <div class="label">Department of Agriculture</div>
        </div>
      </div>
    </div>
    <div class="footer">เอกสารฉบับนี้ออกโดยกรมวิชาการเกษตร กระทรวงเกษตรและสหกรณ์ ประเทศไทย</div>
  </div>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function certStatusColor(s) {
  return { active: "success", revoked: "error" }[s] ?? "grey";
}

function certStatusIcon(s) {
  return (
    {
      active: "fas fa-circle-check",
      revoked: "fas fa-ban",
    }[s] ?? "fas fa-circle"
  );
}

function certStatusLabel(s) {
  return { active: "มีผล", revoked: "เพิกถอน" }[s] ?? s;
}

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      forward: "fas fa-share",
      issue: "fas fa-certificate",
      sendback: "fas fa-rotate-left",
    }[type] ?? "fas fa-circle"
  );
}

function eventColor(type) {
  return (
    {
      submit: "hcex-staff",
      forward: "success",
      issue: "hcex-staff",
      sendback: "warning",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      forward: "ผ่าน",
      issue: "ออกใบรับรอง",
      sendback: "ปรับปรุง",
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
.info-value-block {
  font-size: 0.875rem;
  min-height: 72px;
}
.item-row {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.section-header {
  border-color: rgba(var(--v-theme-on-surface), 0.08) !important;
}

/* Activity timeline */
.activity-timeline { padding-left: 4px; }
.activity-item { display: flex; gap: 16px; }
.activity-dot-wrap { display: flex; flex-direction: column; align-items: center; }
.activity-dot {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.activity-dot--submit   { background: rgb(var(--v-theme-hcex-staff)); }
.activity-dot--forward  { background: rgb(var(--v-theme-success)); }
.activity-dot--issue    { background: rgb(var(--v-theme-hcex-staff)); }
.activity-dot--sendback { background: rgb(var(--v-theme-warning)); }
.activity-line {
  width: 2px; flex-grow: 1; min-height: 12px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  margin: 4px 0;
}
.activity-content { flex: 1; min-width: 0; }

/* Stepper */
.section-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
