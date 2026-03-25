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
          <h1 class="page-title">{{ application.no }}</h1>
          <AppStatusChip :status="application.status" />
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ยื่นเมื่อ {{ application.submittedDate }} · อัปเดตล่าสุด
          {{ application.updatedDate }}
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
        <v-btn
          variant="tonal"
          color="gap-user"
          prepend-icon="fas fa-pencil"
          size="small"
          >แก้ไข</v-btn
        >
      </div>
    </div>

    <!-- Progress Timeline -->
    <v-card class="mb-5" rounded="xl" elevation="0">
      <v-card-title
        class="pa-4 pb-2 text-subtitle-2 font-weight-bold d-flex align-center ga-2"
      >
        <v-icon icon="fas fa-route" color="gap-user" size="16" />
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
              <div v-if="step.date" class="text-caption text-gap-user mt-1">
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
      <!-- Main Info -->
      <v-col cols="12" md="8">
        <!-- Applicant Info -->
        <v-card class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-user" color="gap-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
          </div>
          <v-card-text>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ชื่อ-นามสกุล</span>
                <span class="info-value">{{ application.farmer }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">เลขบัตรประชาชน</span>
                <span class="info-value">3-1234-56789-01-2</span>
              </div>
              <div class="info-item">
                <span class="info-label">เบอร์โทรศัพท์</span>
                <span class="info-value">081-234-5678</span>
              </div>
              <div class="info-item">
                <span class="info-label">อีเมล</span>
                <span class="info-value">farmer@example.com</span>
              </div>
              <div class="info-item">
                <span class="info-label">จังหวัด</span>
                <span class="info-value">{{ application.province }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ผู้ตรวจประเมิน</span>
                <span class="info-value">นาย วิจัย ตรวจดี</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Farm Info -->
        <v-card class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-seedling" color="gap-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลแปลงและการผลิต</span
            >
          </div>
          <v-card-text>
            <v-row dense>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-gap-user">
                    {{ application.area }}
                  </div>
                  <div class="text-caption text-medium-emphasis">ไร่</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-info">
                    {{ application.crop }}
                  </div>
                  <div class="text-caption text-medium-emphasis">ชนิดพืช</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-success">
                    {{ application.appType }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ประเภทคำขอ
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-stat">
                  <div class="text-h6 font-weight-bold text-warning">7/8</div>
                  <div class="text-caption text-medium-emphasis">ผ่านเกณฑ์</div>
                </div>
              </v-col>
            </v-row>
            <v-divider class="my-3" />
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                size="small"
                color="success"
                variant="tonal"
                prepend-icon="fas fa-droplet"
                >มีแหล่งน้ำ</v-chip
              >
              <v-chip
                size="small"
                color="gap-user"
                variant="tonal"
                prepend-icon="fas fa-book"
                >บันทึกการผลิต</v-chip
              >
              <v-chip
                size="small"
                color="warning"
                variant="tonal"
                prepend-icon="fas fa-flask"
                >บันทึกสารเคมี</v-chip
              >
            </div>
          </v-card-text>
        </v-card>

        <!-- Documents -->
        <v-card>
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-paperclip" color="gap-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="doc in documents"
              :key="doc.name"
              :prepend-icon="doc.icon"
              :subtitle="doc.size"
            >
              <v-list-item-title>{{ doc.name }}</v-list-item-title>
              <template v-slot:append>
                <v-btn icon size="x-small" variant="text" color="gap-user">
                  <v-icon icon="fas fa-download" size="14" />
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Quick actions -->
        <v-card rounded="xl" elevation="0">
          <div class="section-header">
            <v-icon icon="fas fa-bolt" color="gap-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ดำเนินการ</span>
          </div>
          <v-card-text class="pa-3">
            <v-btn
              block
              variant="tonal"
              color="gap-user"
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
import { useRouter, useRoute } from "vue-router";
import AppStatusChip from "@/components/common/AppStatusChip.vue";

const router = useRouter();
const route = useRoute();

function goToApplicationList() {
  router.push({ name: "ApplicationList" });
}

// Mock data — in production this would come from an API call using route.params.id
const application = computed(() => ({
  no: String(route.params.id ?? "GAP-2569-001"),
  farmer: "นาย สมชาย ใจดี",
  crop: "ข้าวหอมมะลิ",
  province: "นครราชสีมา",
  area: "15 ไร่",
  appType: "รายเดี่ยว",
  status: "DOC_REVIEW",
  submittedDate: "1 มี.ค. 67",
  updatedDate: "3 มี.ค. 67",
}));

const documents = [
  { name: "สำเนาโฉนดที่ดิน.pdf", icon: "fas fa-file-pdf", size: "2.4 MB" },
  { name: "ผลวิเคราะห์คุณภาพน้ำ.pdf", icon: "fas fa-file-pdf", size: "1.1 MB" },
  { name: "แผนที่แปลงปลูก.jpg", icon: "fas fa-image", size: "3.8 MB" },
];

const currentStatusIdx = computed(() => {
  const m = {
    SUBMITTED: 0,
    DOC_REVIEW: 1,
    SCHEDULED: 2,
    INSPECTION: 3,
    APPROVED: 4,
    REJECTED: 4,
  };
  return m[application.value.status] ?? 0;
});

const timeline = computed(() => [
  {
    key: "submitted",
    label: "ยื่นคำขอ",
    desc: "สร้างคำขอ " + application.value.no,
    date: "1 มี.ค. 67",
  },
  {
    key: "doc_review",
    label: "ตรวจเอกสาร",
    desc: "เจ้าหน้าที่รับเรื่องแล้ว",
    date: currentStatusIdx.value >= 1 ? "3 มี.ค. 67" : "",
  },
  {
    key: "scheduled",
    label: "นัดตรวจแปลง",
    desc: "วันที่ 15 มี.ค. เวลา 09:00",
    date: currentStatusIdx.value >= 2 ? "8 มี.ค. 67" : "",
  },
  {
    key: "inspection",
    label: "ตรวจประเมินแปลง",
    desc: "ผ่านเกณฑ์ 7/8 หมวด",
    date: currentStatusIdx.value >= 3 ? "15 มี.ค. 67" : "",
  },
  {
    key: "approved",
    label: "อนุมัติ & ออกใบรับรอง",
    desc: "GAP-C-2569-0089 อายุ 1 ปี",
    date: currentStatusIdx.value >= 4 ? "20 มี.ค. 67" : "",
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
</script>

<style scoped>
.info-stat {
  text-align: center;
  padding: 12px 8px;
  border-radius: 10px;
  background: rgba(var(--v-theme-surface-variant), 1);
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
.timeline-item--done .timeline-dot {
  background: rgb(var(--v-theme-gap-user));
  color: white;
}
.timeline-item--active .timeline-dot {
  background: rgb(var(--v-theme-gap-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-gap-user), 0.2);
}
.timeline-item--pending .timeline-dot {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.3);
}
.timeline-item--done .timeline-line {
  background: rgba(var(--v-theme-gap-user), 0.35);
}
</style>
