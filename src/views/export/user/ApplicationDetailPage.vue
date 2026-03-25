<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 mb-1 flex-wrap">
          <h1 class="page-title">{{ app.requestNo }}</h1>
          <v-chip
            size="small"
            :color="statusColor(app.status)"
            variant="tonal"
            :prepend-icon="statusIcon(app.status)"
          >
            {{ statusLabel(app.status) }}
          </v-chip>
          <v-chip size="x-small" color="export-user" variant="tonal">{{
            typeLabel(app.type)
          }}</v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ยื่นเมื่อ {{ app.submittedDate }} · อัปเดตล่าสุด {{ app.updatedDate }}
        </p>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="info"
          prepend-icon="fas fa-download"
          size="small"
          >ดาวน์โหลด PDF</v-btn
        >
      </div>
    </div>

    <!-- Progress Timeline -->
    <v-card class="mb-5" rounded="xl" elevation="0">
      <v-card-title
        class="pa-4 pb-2 text-subtitle-2 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-route" color="export-user" size="16" />
        ความคืบหน้าคำขอ
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <div class="timeline">
          <div
            v-for="(step, idx) in timeline"
            :key="step.key"
            class="timeline-item"
            :class="{
              'timeline-item--done': isTimelineDone(idx),
              'timeline-item--active': isTimelineActive(idx),
              'timeline-item--pending': isTimelinePending(idx),
            }"
          >
            <div class="timeline-dot">
              <v-icon
                v-if="isTimelineDone(idx)"
                icon="fas fa-check"
                size="12"
              />
              <v-icon
                v-else-if="isTimelineActive(idx)"
                icon="fas fa-spinner"
                size="12"
                class="fa-spin"
              />
              <v-icon v-else icon="fas fa-circle" size="8" />
            </div>
            <div class="timeline-content">
              <div class="text-body-2 font-weight-medium">{{ step.label }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ step.desc }}
              </div>
              <div v-if="step.date" class="text-caption text-export-user mt-1">
                {{ step.date }}
              </div>
              <div v-if="step.note" class="text-caption text-warning mt-1">
                {{ step.note }}
              </div>
            </div>
            <div v-if="idx < timeline.length - 1" class="timeline-line" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Main -->
      <v-col cols="12" md="8">
        <!-- ข้อมูลผู้ยื่นคำขอ -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-user" color="export-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อ-นามสกุล</span
                ><span class="info-value">{{ app.applicantName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">เลขบัตรประชาชน</span
                ><span class="info-value">{{ app.idCard }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ตำแหน่ง</span
                ><span class="info-value">{{ app.position }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">โทรศัพท์</span
                ><span class="info-value">{{ app.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">อีเมล</span
                ><span class="info-value">{{ app.email }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลบริษัท / ผู้ส่งออก -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-ship" color="export-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลบริษัท / ผู้ส่งออก</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense class="mb-4">
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-export-user">
                    {{ app.exportRegType }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ประเภทการจดทะเบียน
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-info">
                    {{ app.productCategory }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ประเภทสินค้า
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-secondary">
                    {{ app.exportMarket }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ตลาดส่งออก
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-success">
                    {{ app.province }}
                  </div>
                  <div class="text-caption text-medium-emphasis">จังหวัด</div>
                </div>
              </v-col>
            </v-row>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อบริษัท (ไทย)</span
                ><span class="info-value">{{ app.companyNameTh }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ชื่อบริษัท (อังกฤษ)</span
                ><span class="info-value">{{ app.companyNameEn }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">เลขทะเบียนนิติบุคคล</span
                ><span class="info-value">{{ app.jurRegNo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">โทรศัพท์บริษัท</span
                ><span class="info-value">{{ app.companyPhone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่บริษัท</span
                ><span class="info-value">{{ app.companyAddress }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- สินค้าที่ส่งออก -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-boxes-stacked" color="export-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >สินค้าที่ขอจดทะเบียนส่งออก</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="d-flex flex-wrap ga-2 mb-3">
              <v-chip
                v-for="product in app.products"
                :key="product"
                color="export-user"
                variant="tonal"
                size="small"
              >
                <v-icon start icon="fas fa-leaf" size="10" />{{ product }}
              </v-chip>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ประเทศปลายทาง</span>
                <div class="d-flex flex-wrap ga-1 mt-1">
                  <v-chip
                    v-for="country in app.destinationCountries"
                    :key="country"
                    size="x-small"
                    variant="outlined"
                    color="secondary"
                    >{{ country }}</v-chip
                  >
                </div>
              </div>
              <div class="info-item">
                <span class="info-label">มาตรฐานที่ได้รับ</span>
                <div class="d-flex flex-wrap ga-1 mt-1">
                  <v-chip
                    v-for="std in app.standards"
                    :key="std"
                    size="x-small"
                    variant="tonal"
                    color="success"
                    >{{ std }}</v-chip
                  >
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-paperclip" color="export-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-list density="compact" class="pa-2">
            <v-list-item
              v-for="doc in app.documents"
              :key="doc.name"
              rounded="lg"
              class="mb-1"
            >
              <template #prepend>
                <v-icon
                  icon="fas fa-file-pdf"
                  color="error"
                  size="16"
                  class="mr-2"
                />
              </template>
              <v-list-item-title class="text-body-2">{{
                doc.name
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{
                doc.uploadedAt
              }}</v-list-item-subtitle>
              <template #append>
                <v-chip
                  size="x-small"
                  :color="doc.verified ? 'success' : 'warning'"
                  variant="tonal"
                  class="mr-2"
                >
                  {{ doc.verified ? "ตรวจสอบแล้ว" : "รอตรวจสอบ" }}
                </v-chip>
                <v-btn
                  size="x-small"
                  variant="text"
                  color="info"
                  icon="fas fa-download"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- เลขทะเบียน (ถ้าอนุมัติ) -->
        <v-card
          v-if="app.status === 'approved'"
          rounded="xl"
          elevation="0"
          class="mb-4"
          style="border: 1px solid rgba(var(--v-theme-success), 0.3)"
        >
          <div
            class="section-header"
            style="background: rgba(var(--v-theme-success), 0.06)"
          >
            <v-icon icon="fas fa-certificate" color="success" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ใบรับรองการจดทะเบียน</span
            >
          </div>
          <v-card-text class="pa-4 text-center">
            <div class="text-h6 font-weight-bold text-export-user mb-1">
              {{ app.regNo }}
            </div>
            <div class="text-caption text-medium-emphasis mb-3">
              เลขทะเบียนผู้ส่งออก
            </div>
            <v-btn
              color="success"
              variant="tonal"
              size="small"
              block
              rounded="lg"
              prepend-icon="fas fa-download"
            >
              ดาวน์โหลดใบทะเบียน
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Officer Note -->
        <v-alert
          v-if="app.officerNote"
          color="info"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">
            หมายเหตุจากเจ้าหน้าที่
          </div>
          <div class="text-body-2">{{ app.officerNote }}</div>
        </v-alert>

        <!-- Quick actions -->
        <v-card rounded="xl" elevation="0">
          <div class="section-header">
            <v-icon icon="fas fa-bolt" color="export-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ดำเนินการ</span>
          </div>
          <v-card-text class="pa-3">
            <v-btn
              block
              variant="tonal"
              color="export-user"
              class="mb-2"
              prepend-icon="fas fa-file-lines"
              rounded="lg"
              @click="goToApplicationList"
            >
              รายการคำขอทั้งหมด
            </v-btn>
            <v-btn
              block
              variant="tonal"
              color="info"
              prepend-icon="fas fa-download"
              rounded="lg"
            >
              ดาวน์โหลดใบรับคำขอ
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "ExportUserApplicationList" });
}

const app = {
  requestNo: "EXP-2569-00005",
  status: "reviewing",
  type: "register",
  submittedDate: "10/02/2569",
  updatedDate: "15/02/2569",
  exportRegType: "นิติบุคคล",
  productCategory: "ผัก / ผลไม้สด",
  exportMarket: "สหภาพยุโรป",
  province: "สมุทรสาคร",
  regNo: "",
  applicantName: "นางสาวพิมพ์ใจ ส่งออกดี",
  idCard: "1-2001-00000-00-0",
  position: "ผู้จัดการฝ่ายส่งออก",
  phone: "034-456-789",
  email: "pimjai@thaiexport.com",
  companyNameTh: "บริษัท ไทยเอ็กซ์พอร์ตฟูดส์ จำกัด",
  companyNameEn: "Thai Export Foods Co., Ltd.",
  jurRegNo: "0745566054321",
  companyPhone: "034-456-789",
  companyAddress: "88/1 ถ.เพชรเกษม ต.มหาชัย อ.เมือง จ.สมุทรสาคร 74000",
  officerNote: "อยู่ระหว่างตรวจสอบมาตรฐาน GAP และ GMP ของแหล่งวัตถุดิบ",
  products: ["มะม่วงสด", "มะพร้าวอ่อน", "สับปะรด", "ผักกาดหอม"],
  destinationCountries: ["สหภาพยุโรป (EU)", "ญี่ปุ่น", "เกาหลีใต้"],
  standards: ["GAP (มกษ.9001)", "GlobalG.A.P."],
  documents: [
    {
      name: "หนังสือรับรองบริษัท.pdf",
      uploadedAt: "10/02/2569",
      verified: true,
    },
    {
      name: "บัตรประชาชนผู้มีอำนาจ.pdf",
      uploadedAt: "10/02/2569",
      verified: true,
    },
    {
      name: "ใบรับรอง GAP แหล่งวัตถุดิบ.pdf",
      uploadedAt: "10/02/2569",
      verified: false,
    },
    { name: "แผนผังโรงคัดบรรจุ.pdf", uploadedAt: "10/02/2569", verified: true },
    {
      name: "รายการสินค้าที่ขอส่งออก.pdf",
      uploadedAt: "10/02/2569",
      verified: true,
    },
  ],
};

const currentStatusIdx = computed(() => {
  const m = {
    pending: 1,
    reviewing: 2,
    site_check: 3,
    approved: 5,
    rejected: 5,
  };
  return m[app.status] ?? 1;
});

const timeline = computed(() => [
  {
    key: "submitted",
    label: "ยื่นคำขอจดทะเบียน",
    desc: app.applicantName,
    date: "10/02/2569",
  },
  {
    key: "received",
    label: "รับคำขอเข้าสู่ระบบ",
    desc: "ระบบอัตโนมัติ",
    date: "11/02/2569",
  },
  {
    key: "reviewing",
    label: "ตรวจสอบเอกสารและคุณสมบัติ",
    desc: "เจ้าหน้าที่ผู้ส่งออก",
    date: "15/02/2569",
  },
  {
    key: "site_check",
    label: "ตรวจสอบแหล่งวัตถุดิบ / โรงงาน",
    desc: "ทีมตรวจสอบภาคสนาม",
    date: "",
  },
  {
    key: "committee",
    label: "คณะกรรมการพิจารณาอนุมัติ",
    desc: "",
    date: "",
  },
  {
    key: "approved",
    label: "ออกใบทะเบียนผู้ส่งออก",
    desc: "",
    date: "",
  },
]);

function isTimelineDone(idx) {
  return idx < currentStatusIdx.value;
}
function isTimelineActive(idx) {
  return idx === currentStatusIdx.value;
}
function isTimelinePending(idx) {
  return idx > currentStatusIdx.value;
}

function statusColor(s) {
  const m = {
    pending: "warning",
    reviewing: "info",
    site_check: "secondary",
    approved: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function statusIcon(s) {
  const m = {
    pending: "fas fa-clock",
    reviewing: "fas fa-magnifying-glass",
    site_check: "fas fa-warehouse",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  const m = {
    pending: "รอพิจารณา",
    reviewing: "อยู่ระหว่างพิจารณา",
    site_check: "ตรวจสอบภาคสนาม",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่ผ่าน",
  };
  return m[s] ?? s;
}
function typeLabel(t) {
  const m = {
    register: "ขอขึ้นทะเบียน",
    renew: "ต่ออายุ",
    amendment: "เปลี่ยนแปลงข้อมูล",
  };
  return m[t] ?? t;
}
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 16px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
.info-value {
  font-size: 14px;
  font-weight: 500;
}
.info-stat {
  padding: 10px;
  background: rgba(var(--v-border-color), 0.04);
  border-radius: 10px;
  text-align: center;
}
.timeline-item--done .timeline-dot {
  background: rgb(var(--v-theme-export-user));
  color: white;
}
.timeline-item--active .timeline-dot {
  background: rgb(var(--v-theme-export-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-export-user), 0.2);
}
.timeline-item--pending .timeline-dot {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.3);
}
.timeline-item--done .timeline-line {
  background: rgba(var(--v-theme-export-user), 0.35);
}
</style>
