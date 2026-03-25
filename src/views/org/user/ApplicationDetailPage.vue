<template>
  <div v-if="app">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div class="d-flex align-center ga-3">
        <v-btn
          icon="fas fa-arrow-left"
          variant="text"
          @click="goToApplicationList"
        />
        <div>
          <div class="d-flex align-center ga-2 mb-1 flex-wrap">
            <h1 class="text-h6 font-weight-bold">{{ app.requestNo }}</h1>
            <v-chip
              size="small"
              :color="statusColor(app.status)"
              variant="tonal"
              :prepend-icon="statusIcon(app.status)"
            >
              {{ statusLabel(app.status) }}
            </v-chip>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ยื่นเมื่อ {{ app.submittedDate }} · อัปเดตล่าสุด
            {{ app.updatedDate }}
          </p>
        </div>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          v-if="app.status === 'approved'"
          color="success"
          variant="tonal"
          prepend-icon="fas fa-certificate"
          size="small"
          @click="goToCertificates"
        >
          ดูใบรับรอง
        </v-btn>
        <v-btn
          v-if="app.status === 'revision_required'"
          color="warning"
          variant="tonal"
          prepend-icon="fas fa-pen-to-square"
          size="small"
        >
          แก้ไขคำขอ
        </v-btn>
        <v-btn
          variant="tonal"
          color="info"
          prepend-icon="fas fa-download"
          size="small"
        >
          ดาวน์โหลด PDF
        </v-btn>
      </div>
    </div>

    <!-- Progress Timeline -->
    <v-card class="mb-5" rounded="xl" elevation="0">
      <v-card-title
        class="pa-4 pb-2 text-subtitle-2 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-route" color="org-user" size="16" />
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
              <div v-if="step.date" class="text-caption text-org-user mt-1">
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

    <!-- Details -->
    <v-row>
      <!-- Main Info -->
      <v-col cols="12" md="8">
        <!-- Applicant Info -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-user" color="org-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อ-นามสกุล</span>
                <span class="info-value">{{ app.applicantName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">เลขบัตรประชาชน</span>
                <span class="info-value">{{ app.idCard }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">เบอร์โทรศัพท์</span>
                <span class="info-value">{{ app.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">อีเมล</span>
                <span class="info-value">{{ app.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่</span>
                <span class="info-value">{{ app.address }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">จังหวัด</span>
                <span class="info-value">{{ app.province }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Plot Info -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-seedling" color="org-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลแปลงเพาะปลูก</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense class="mb-4">
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-org-user">
                    {{ app.area }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    พื้นที่ (ไร่)
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-info">
                    {{ app.cropType }}
                  </div>
                  <div class="text-caption text-medium-emphasis">ชนิดพืช</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-secondary">
                    {{ app.plotCount }}
                  </div>
                  <div class="text-caption text-medium-emphasis">จำนวนแปลง</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-success">
                    {{ app.standard }}
                  </div>
                  <div class="text-caption text-medium-emphasis">มาตรฐาน</div>
                </div>
              </v-col>
            </v-row>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ที่ตั้งแปลง</span>
                <span class="info-value">{{ app.plotAddress }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">พิกัด GPS</span>
                <span class="info-value">{{ app.coordinates }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Documents -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-paperclip" color="org-user" size="15" />
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
                  size="18"
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
        <!-- Officer Note -->
        <v-alert
          v-if="app.officerNote"
          color="warning"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-triangle-exclamation"
        >
          <div class="text-body-2 font-weight-medium mb-1">
            หมายเหตุจากเจ้าหน้าที่
          </div>
          <div class="text-body-2">{{ app.officerNote }}</div>
        </v-alert>

        <!-- Certificate Card -->
        <v-card
          v-if="app.status === 'approved'"
          rounded="xl"
          elevation="0"
          class="mb-4"
        >
          <div class="section-header">
            <v-icon icon="fas fa-certificate" color="success" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ใบรับรองเกษตรอินทรีย์</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-grid mb-3">
              <div class="info-item">
                <span class="info-label">เลขใบรับรอง</span>
                <span class="info-value text-success font-weight-bold"
                  >ORG-2569-00003</span
                >
              </div>
              <div class="info-item">
                <span class="info-label">วันที่ออก</span>
                <span class="info-value">{{ app.updatedDate }}</span>
              </div>
            </div>
            <v-btn
              color="success"
              block
              rounded="lg"
              prepend-icon="fas fa-download"
            >
              ดาวน์โหลดใบรับรอง (PDF)
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Actions -->
        <v-card
          v-if="app.status === 'revision_required'"
          rounded="xl"
          elevation="0"
        >
          <div class="section-header">
            <v-icon icon="fas fa-bolt" color="warning" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ดำเนินการ</span>
          </div>
          <v-card-text class="pa-4">
            <v-btn
              color="warning"
              variant="tonal"
              block
              rounded="lg"
              prepend-icon="fas fa-pen-to-square"
            >
              แก้ไขและส่งใหม่
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Status Card (default) -->
        <v-card
          v-if="!['revision_required', 'approved'].includes(app.status)"
          rounded="xl"
          elevation="0"
        >
          <v-card-text class="pa-4 text-center">
            <div
              class="status-icon-box mx-auto mb-3"
              :style="{
                background: `rgba(var(--v-theme-${statusColor(app.status)}),0.1)`,
              }"
            >
              <v-icon
                :icon="statusIcon(app.status)"
                :color="statusColor(app.status)"
                size="28"
              />
            </div>
            <div class="text-body-1 font-weight-bold mb-1">
              {{ statusLabel(app.status) }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              เจ้าหน้าที่กำลังดำเนินการ<br />จะแจ้งผลทางอีเมล
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

function goToApplicationList() {
  router.push({ name: "ORGUserApplicationList" });
}

function goToCertificates() {
  router.push({ name: "ORGUserCertificates" });
}

const mockApps = {
  "ORG-001": {
    id: "ORG-001",
    requestNo: "ORG-2569-00001",
    status: "under_review",
    submittedDate: "1 มี.ค. 2569",
    updatedDate: "3 มี.ค. 2569",
    applicantName: "นายสมชาย ใจดี",
    idCard: "1-1000-00000-00-0",
    phone: "081-234-5678",
    email: "somchai@example.com",
    address: "123 หมู่ 5 ต.บ้านดง",
    province: "เชียงใหม่",
    area: "15",
    cropType: "ข้าว",
    plotCount: "3",
    standard: "มกษ.9000",
    plotAddress: "ต.บ้านดง อ.แม่แจ่ม จ.เชียงใหม่",
    coordinates: "18.7061° N, 98.9817° E",
    officerNote: null,
    documents: [
      { name: "สำเนาบัตรประชาชน.pdf", uploadedAt: "1 มี.ค. 2569" },
      { name: "ทะเบียนบ้าน.pdf", uploadedAt: "1 มี.ค. 2569" },
      { name: "เอกสารสิทธิ์ที่ดิน.pdf", uploadedAt: "1 มี.ค. 2569" },
    ],
  },
  "ORG-002": {
    id: "ORG-002",
    requestNo: "ORG-2569-00002",
    status: "inspection_scheduled",
    submittedDate: "15 ก.พ. 2569",
    updatedDate: "20 ก.พ. 2569",
    applicantName: "นางสาวมาลี รักไพร",
    idCard: "1-2000-00000-00-0",
    phone: "089-876-5432",
    email: "malee@example.com",
    address: "456 หมู่ 2 ต.ท่าข้าม",
    province: "เชียงราย",
    area: "30",
    cropType: "ชา",
    plotCount: "5",
    standard: "มกษ.9000",
    plotAddress: "ต.ท่าข้าม อ.เวียงแก่น จ.เชียงราย",
    coordinates: "19.5000° N, 100.3500° E",
    officerNote: null,
    documents: [
      { name: "สำเนาบัตรประชาชน.pdf", uploadedAt: "15 ก.พ. 2569" },
      { name: "โฉนดที่ดิน.pdf", uploadedAt: "15 ก.พ. 2569" },
    ],
  },
  "ORG-003": {
    id: "ORG-003",
    requestNo: "ORG-2569-00003",
    status: "revision_required",
    submittedDate: "5 มี.ค. 2569",
    updatedDate: "10 มี.ค. 2569",
    applicantName: "นายวิชัย สวนงาม",
    idCard: "1-3000-00000-00-0",
    phone: "085-111-2222",
    email: "wichai@example.com",
    address: "789 หมู่ 3 ต.นาทอง",
    province: "อุบลราชธานี",
    area: "20",
    cropType: "อ้อย",
    plotCount: "2",
    standard: "มกษ.9000",
    plotAddress: "ต.นาทอง อ.ม่วงสามสิบ จ.อุบลราชธานี",
    coordinates: "15.3500° N, 104.1000° E",
    officerNote: "เอกสารสิทธิ์ที่ดินไม่ครบถ้วน กรุณาแนบโฉนดที่ดินให้ครบทุกแปลง",
    documents: [
      { name: "สำเนาบัตรประชาชน.pdf", uploadedAt: "5 มี.ค. 2569" },
      { name: "ทะเบียนบ้าน.pdf", uploadedAt: "5 มี.ค. 2569" },
      { name: "เอกสารสิทธิ์ที่ดิน.pdf", uploadedAt: "5 มี.ค. 2569" },
    ],
  },
  "ORG-004": {
    id: "ORG-004",
    requestNo: "ORG-2569-00004",
    status: "approved",
    submittedDate: "1 ม.ค. 2569",
    updatedDate: "20 ม.ค. 2569",
    applicantName: "นายประสิทธิ์ เกษตรดี",
    idCard: "1-4000-00000-00-0",
    phone: "086-333-4444",
    email: "prasit@example.com",
    address: "321 หมู่ 1 ต.สวนผึ้ง",
    province: "ราชบุรี",
    area: "50",
    cropType: "พริกไทย",
    plotCount: "4",
    standard: "มกษ.9000",
    plotAddress: "ต.สวนผึ้ง อ.สวนผึ้ง จ.ราชบุรี",
    coordinates: "13.5500° N, 99.3500° E",
    officerNote: null,
    documents: [
      { name: "สำเนาบัตรประชาชน.pdf", uploadedAt: "1 ม.ค. 2569" },
      { name: "โฉนดที่ดิน.pdf", uploadedAt: "1 ม.ค. 2569" },
      { name: "แผนผังแปลง.pdf", uploadedAt: "1 ม.ค. 2569" },
    ],
  },
};

const appId = route.params.id;
const app = ref(mockApps[appId] ?? mockApps["ORG-001"]);

const statusOrder = [
  "submitted",
  "under_review",
  "inspection_scheduled",
  "cc_review",
  "approved",
];

const currentStatusIdx = computed(() => {
  if (app.value.status === "revision_required") {
    return statusOrder.indexOf("under_review");
  }
  return statusOrder.indexOf(app.value.status);
});

const timeline = computed(() => [
  {
    key: "submitted",
    label: "ยื่นคำขอ",
    desc: "รับคำขอเรียบร้อย",
    date: app.value.submittedDate,
  },
  {
    key: "under_review",
    label: "ตรวจสอบเอกสาร",
    desc:
      app.value.status === "revision_required"
        ? "เอกสารไม่ครบถ้วน — รอการแก้ไข"
        : "เจ้าหน้าที่ตรวจสอบเอกสาร",
    date: currentStatusIdx.value >= 1 ? app.value.updatedDate : "",
    note: app.value.status === "revision_required" ? "รอผู้ยื่นคำขอแก้ไข" : "",
  },
  {
    key: "inspection_scheduled",
    label: "ตรวจแปลง",
    desc: "เจ้าหน้าที่ลงพื้นที่ตรวจสอบแปลง",
    date: currentStatusIdx.value >= 2 ? "+7 วัน" : "",
  },
  {
    key: "cc_review",
    label: "เสนอคณะกรรมการ (CC)",
    desc: "คณะกรรมการพิจารณาผลการตรวจ",
    date: currentStatusIdx.value >= 3 ? "+14 วัน" : "",
  },
  {
    key: "approved",
    label: "อนุมัติ / ออกใบรับรอง",
    desc: "ออกใบรับรองเกษตรอินทรีย์แล้ว",
    date: currentStatusIdx.value >= 4 ? "+21 วัน" : "",
  },
]);

function isTimelineDone(idx) {
  return currentStatusIdx.value > idx;
}
function isTimelineActive(idx) {
  return currentStatusIdx.value === idx;
}
function isTimelinePending(idx) {
  return currentStatusIdx.value < idx;
}

function statusColor(s) {
  const m = {
    submitted: "org-user",
    under_review: "info",
    inspection_scheduled: "secondary",
    revision_required: "warning",
    cc_review: "primary",
    approved: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function statusIcon(s) {
  const m = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    inspection_scheduled: "fas fa-calendar-check",
    revision_required: "fas fa-pen-to-square",
    cc_review: "fas fa-gavel",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  const m = {
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    inspection_scheduled: "นัดตรวจแปลงแล้ว",
    revision_required: "รอแก้ไขเอกสาร",
    cc_review: "รอพิจารณา CC",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่ผ่านการพิจารณา",
  };
  return m[s] ?? s;
}
</script>

<style scoped>
/* Timeline colors — org-user */
.timeline-item--done .timeline-dot {
  background: rgb(var(--v-theme-org-user));
  color: white;
}
.timeline-item--active .timeline-dot {
  background: rgb(var(--v-theme-org-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-org-user), 0.2);
}
.timeline-item--pending .timeline-dot {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.3);
}
.timeline-item--done .timeline-line {
  background: rgba(var(--v-theme-org-user), 0.35);
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.55);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.info-value {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.87);
}
.info-stat {
  padding: 12px;
  background: rgba(var(--v-border-color), 0.04);
  border-radius: 10px;
  text-align: center;
}

/* Status Icon */
.status-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
