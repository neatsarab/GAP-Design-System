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
          <v-chip size="x-small" color="cb-user" variant="tonal">{{
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
        <v-icon icon="fas fa-route" color="cb-user" size="16" />
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
              <div v-if="step.date" class="text-caption text-cb-user mt-1">
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
            <v-icon icon="fas fa-user" color="cb-user" size="15" />
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

        <!-- ข้อมูลหน่วยรับรอง -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-certificate" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลหน่วยรับรอง (CB)</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense class="mb-4">
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-cb-user">
                    {{ app.accreditationType }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ประเภทการรับรอง
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-info">
                    {{ app.scopeCount }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    จำนวนขอบข่าย
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-secondary">
                    {{ app.province }}
                  </div>
                  <div class="text-caption text-medium-emphasis">จังหวัด</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-body-1 font-weight-bold text-success">
                    {{ app.accreditedBy }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ได้รับการรับรองจาก
                  </div>
                </div>
              </v-col>
            </v-row>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อหน่วยรับรอง (ไทย)</span
                ><span class="info-value">{{ app.cbNameTh }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ชื่อหน่วยรับรอง (อังกฤษ)</span
                ><span class="info-value">{{ app.cbNameEn }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">เลขทะเบียนนิติบุคคล</span
                ><span class="info-value">{{ app.jurRegNo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่</span
                ><span class="info-value">{{ app.address }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ขอบข่ายมาตรฐานที่ขอ -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-list-check" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ขอบข่ายมาตรฐานที่ขอ</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="scope in app.scopes"
                :key="scope"
                color="cb-user"
                variant="tonal"
                size="small"
              >
                <v-icon start icon="fas fa-check" size="10" />{{ scope }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="mb-4">
          <div class="section-header">
            <v-icon icon="fas fa-paperclip" color="cb-user" size="15" />
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
            <v-icon icon="fas fa-bolt" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ดำเนินการ</span>
          </div>
          <v-card-text class="pa-3">
            <v-btn
              block
              variant="tonal"
              color="cb-user"
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
  router.push({ name: "CBUserApplicationList" });
}

const app = {
  requestNo: "CB-2569-00001",
  status: "reviewing",
  type: "register",
  submittedDate: "15/01/2569",
  updatedDate: "20/01/2569",
  accreditationType: "GAP / ORG",
  scopeCount: "3",
  province: "กรุงเทพมหานคร",
  accreditedBy: "NAC",
  applicantName: "นายวิชัย รับรองดี",
  idCard: "1-1001-00000-00-0",
  position: "ผู้อำนวยการ",
  phone: "02-345-6789",
  email: "wichai@cbcert.co.th",
  cbNameTh: "บริษัท ไทยเซิร์ทแล็บ จำกัด",
  cbNameEn: "Thai CertLab Co., Ltd.",
  jurRegNo: "0105560012345",
  address: "999 อาคารเจริญนคร ชั้น 12 ถ.เจริญนคร เขตคลองสาน กรุงเทพฯ 10600",
  officerNote:
    "อยู่ระหว่างตรวจสอบหนังสือรับรองการรับรอง (Accreditation Certificate) จาก NAC",
  scopes: [
    "GAP พืช (มกษ. 9001)",
    "เกษตรอินทรีย์ (มกษ. 9000)",
    "GAP ข้าว (มกษ. 4403)",
  ],
  documents: [
    {
      name: "หนังสือรับรองบริษัท.pdf",
      uploadedAt: "15/01/2569",
      verified: true,
    },
    {
      name: "ใบรับรอง Accreditation (NAC).pdf",
      uploadedAt: "15/01/2569",
      verified: false,
    },
    {
      name: "คู่มือคุณภาพ (Quality Manual).pdf",
      uploadedAt: "15/01/2569",
      verified: true,
    },
    {
      name: "รายชื่อผู้ตรวจประเมิน.pdf",
      uploadedAt: "15/01/2569",
      verified: true,
    },
    { name: "แผนผังองค์กร.pdf", uploadedAt: "15/01/2569", verified: true },
  ],
};

const currentStatusIdx = computed(() => {
  const m = {
    pending: 1,
    reviewing: 2,
    assessment: 3,
    approved: 5,
    rejected: 5,
  };
  return m[app.status] ?? 1;
});

const timeline = computed(() => [
  {
    key: "submitted",
    label: "ยื่นคำขอ",
    desc: app.applicantName,
    date: "15/01/2569",
  },
  {
    key: "received",
    label: "รับคำขอเข้าสู่ระบบ",
    desc: "ระบบอัตโนมัติ",
    date: "16/01/2569",
  },
  {
    key: "reviewing",
    label: "ตรวจสอบเอกสารเบื้องต้น",
    desc: "เจ้าหน้าที่ CB",
    date: "20/01/2569",
  },
  {
    key: "assessment",
    label: "ประเมินและตรวจสอบภาคสนาม",
    desc: "ทีมผู้ตรวจประเมิน",
    date: "",
  },
  {
    key: "committee",
    label: "คณะกรรมการพิจารณา",
    desc: "",
    date: "",
  },
  {
    key: "approved",
    label: "ออกใบรับรองหน่วยรับรอง",
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
    assessment: "secondary",
    approved: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function statusIcon(s) {
  const m = {
    pending: "fas fa-clock",
    reviewing: "fas fa-magnifying-glass",
    assessment: "fas fa-clipboard-check",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  const m = {
    pending: "รอพิจารณา",
    reviewing: "อยู่ระหว่างพิจารณา",
    assessment: "อยู่ระหว่างประเมิน",
    approved: "ผ่าน",
    rejected: "ไม่ผ่าน",
  };
  return m[s] ?? s;
}
function typeLabel(t) {
  const m = {
    register: "ขึ้นทะเบียนใหม่",
    renew: "ต่ออายุ",
    amendment: "เปลี่ยนแปลงขอบข่าย",
    expand: "ขยายขอบข่าย",
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
  background: rgb(var(--v-theme-cb-user));
  color: white;
}
.timeline-item--active .timeline-dot {
  background: rgb(var(--v-theme-cb-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-cb-user), 0.2);
}
.timeline-item--pending .timeline-dot {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.3);
}
.timeline-item--done .timeline-line {
  background: rgba(var(--v-theme-cb-user), 0.35);
}
</style>
