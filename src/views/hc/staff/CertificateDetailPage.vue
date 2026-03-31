<template>
  <div style="--v-theme-primary: var(--v-theme-hc-staff)">
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
          เลขทะเบียน:
          <span class="text-hc-staff font-weight-medium">{{
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
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
            <v-icon icon="fas fa-file-shield" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบรับรอง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบรับรอง / Certificate No.</div>
                <div class="info-value text-hc-staff font-weight-bold">
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
              <v-col cols="12" md="4">
                <div class="info-label">วันที่ออกใบรับรอง / Issue Date</div>
                <div class="info-value">{{ cert.issueDate }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">วันหมดอายุ / Expire Date</div>
                <div
                  class="info-value"
                  :class="
                    cert.status === 'expiring'
                      ? 'text-warning font-weight-medium'
                      : cert.status === 'expired'
                        ? 'text-error'
                        : ''
                  "
                >
                  {{ cert.expireDate }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ยื่นคำขอ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
            <v-icon icon="fas fa-user" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ยื่นคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อ-นามสกุล / Full Name</div>
                <div class="info-value">{{ cert.applicantNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่อยู่ / Address</div>
                <div class="info-value">{{ applicantAddress }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ cert.applicantPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ cert.applicantFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ cert.applicantEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ส่งออก -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
            <v-icon icon="fas fa-truck" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ส่งออก</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อผู้ส่งออก (ไทย)</div>
                <div class="info-value">{{ cert.exporterNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Exporter Name (English)</div>
                <div class="info-value">{{ cert.exporterNameEn }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่ตั้ง (ภาษาไทย)</div>
                <div class="info-value">{{ exporterAddressTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Address (English)</div>
                <div class="info-value">{{ exporterAddressEn }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ cert.exporterPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">ชนิดสินค้า / Product</div>
                <div class="info-value">{{ cert.product }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">ประเทศปลายทาง / Destination</div>
                <div class="info-value">{{ cert.destination }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
            <v-icon icon="fas fa-paperclip" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-card-text class="pa-4">
            <div
              v-for="doc in cert.attachments"
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
      </v-col>

      <!-- ── Right: actions + activity log ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ปุ่มดาวน์โหลด + จัดการ -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4 d-flex flex-column ga-2">
              <v-btn
                color="hc-staff"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลดใบรับรอง (PDF)
              </v-btn>
              <v-btn
                color="warning"
                variant="tonal"
                block
                rounded="lg"
                prepend-icon="fas fa-file-pen"
                @click="goToManage"
              >
                จัดการใบรับรอง
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- ประวัติใบรับรอง -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
              <v-icon icon="fas fa-clock-rotate-left" color="hc-staff" size="15" />
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
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

function goToManage() {
  router.push({ name: "HCStaffCertificateManage", params: { id: route.params.id } });
}

const cert = {
  certNo: "THHC-2569-00041",
  requestNo: "HC-2569-00041",
  issueDate: "20/01/2569",
  expireDate: "20/01/2570",
  status: "active",

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

  exporterNameTh: "บริษัท ไทยฟรุ๊ต จำกัด",
  exporterNameEn: "Thai Fruit Co., Ltd.",
  exporterHouseNo: "456",
  exporterRoad: "สุขุมวิท",
  exporterTambol: "คลองเตย",
  exporterDistrict: "คลองเตย",
  exporterProvince: "กรุงเทพมหานคร",
  exporterZipcode: "10110",
  exporterHouseNoEn: "456",
  exporterRoadEn: "Sukhumvit",
  exporterTambolEn: "Khlong Toei",
  exporterDistrictEn: "Khlong Toei",
  exporterProvinceEn: "Bangkok",
  exporterZipcodeEn: "10110",
  exporterPhone: "02-456-7890",
  product: "ทุเรียน",
  destination: "จีน",

  attachments: [
    { label: "ใบอนุญาตส่งออก (Export License)" },
    { label: "หนังสือรับรองการตรวจพืช (Phytosanitary Certificate)" },
    { label: "ผลการตรวจวิเคราะห์ (Laboratory Analysis Report)" },
    { label: "บัญชีรายการสินค้า (Packing List)" },
  ],

  activityLog: [
    {
      type: "issue",
      action: "ออกใบรับรอง",
      actor: "ระบบ",
      timestamp: "20/01/2569 10:00",
      remark: "เลขทะเบียน THHC-2569-00041",
    },
    {
      type: "forward",
      action: "ผ่านการลงนาม",
      actor: "นายศักดิ์ศรี นาดี (ผู้ลงนาม)",
      timestamp: "20/01/2569 09:45",
    },
    {
      type: "forward",
      action: "ผ่านการพิจารณา",
      actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
      timestamp: "18/01/2569 14:20",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
      timestamp: "16/01/2569 11:00",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "15/01/2569 09:12",
      remark: "",
    },
  ],
};

const applicantAddress = computed(() => {
  const a = cert;
  return `${a.applicantHouseNo} หมู่ ${a.applicantMoo} ถ.${a.applicantRoad} ต.${a.applicantTambol} อ.${a.applicantDistrict} จ.${a.applicantProvince} ${a.applicantZipcode}`;
});

const exporterAddressTh = computed(() => {
  const a = cert;
  return `${a.exporterHouseNo} ถ.${a.exporterRoad} ต.${a.exporterTambol} อ.${a.exporterDistrict} จ.${a.exporterProvince} ${a.exporterZipcode}`;
});

const exporterAddressEn = computed(() => {
  const a = cert;
  return `${a.exporterHouseNoEn} ${a.exporterRoadEn} Rd., ${a.exporterTambolEn}, ${a.exporterDistrictEn}, ${a.exporterProvinceEn} ${a.exporterZipcodeEn}`;
});

function certStatusColor(s) {
  return { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey";
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
  return { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s;
}

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      receive: "fas fa-inbox",
      forward: "fas fa-share",
      review: "fas fa-magnifying-glass",
      approve: "fas fa-circle-check",
      reject: "fas fa-circle-xmark",
      sendback: "fas fa-rotate-left",
      issue: "fas fa-file-shield",
      revoke: "fas fa-ban",
    }[type] ?? "fas fa-circle"
  );
}
function eventColor(type) {
  return (
    {
      submit: "hc-staff",
      receive: "info",
      forward: "success",
      review: "warning",
      approve: "success",
      reject: "error",
      sendback: "warning",
      issue: "hc-staff",
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
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
      issue: "ออกใบรับรอง",
      revoke: "เพิกถอน",
    }[type] ?? type
  );
}
</script>

<style scoped>
.sticky-col { position: sticky; top: 80px; }
.info-label {
  font-size: 0.72rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
  margin-bottom: 2px;
}
.info-value { font-size: 0.875rem; margin-bottom: 8px; }
.item-row {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.section-header { border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08); }

/* Activity timeline */
.activity-timeline { padding-left: 4px; }
.activity-item { display: flex; gap: 16px; }
.activity-dot-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.activity-dot {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; z-index: 1;
}
.activity-dot--submit { background: rgb(var(--v-theme-hc-staff)); }
.activity-dot--receive { background: rgb(var(--v-theme-info)); }
.activity-dot--forward { background: rgb(var(--v-theme-success)); }
.activity-dot--review { background: rgb(var(--v-theme-warning)); }
.activity-dot--approve { background: rgb(var(--v-theme-success)); }
.activity-dot--reject { background: rgb(var(--v-theme-error)); }
.activity-dot--sendback { background: #fb8c00; }
.activity-dot--issue { background: rgb(var(--v-theme-hc-staff)); }
.activity-dot--revoke { background: rgb(var(--v-theme-error)); }
.activity-line {
  width: 2px; flex-grow: 1;
  background: rgba(var(--v-theme-on-surface), 0.12);
  margin-top: 4px; min-height: 20px;
}
.activity-content { flex: 1; min-width: 0; }
</style>
