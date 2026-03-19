<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/gap/user/applications')"
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

      <!-- Sidebar: Timeline + Actions -->
      <v-col cols="12" md="4">
        <!-- Status Action Card -->
        <v-card class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-bolt" color="gap-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">การดำเนินการ</span>
          </div>
          <v-card-text class="pa-4 d-flex flex-column ga-2">
            <v-btn
              color="gap-user"
              block
              prepend-icon="fas fa-calendar-check"
              variant="tonal"
            >
              นัดตรวจแปลง
            </v-btn>
            <v-btn
              color="success"
              block
              prepend-icon="fas fa-circle-check"
              variant="tonal"
            >
              อนุมัติคำขอ
            </v-btn>
            <v-btn
              color="error"
              block
              prepend-icon="fas fa-circle-xmark"
              variant="tonal"
            >
              ไม่ผ่านการรับรอง
            </v-btn>
            <v-btn
              color="warning"
              block
              prepend-icon="fas fa-file-pen"
              variant="outlined"
            >
              ขอเอกสารเพิ่มเติม
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Timeline -->
        <v-card>
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-timeline" color="gap-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ประวัติดำเนินการ</span
            >
          </div>
          <v-card-text class="pa-4">
            <AppTimeline :items="timelineItems" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppStatusChip from "@/components/common/AppStatusChip.vue";
import AppTimeline, {
  type TimelineItem,
} from "@/components/common/AppTimeline.vue";
import type { GapStatus } from "@/types/gap-status.types";

const router = useRouter();
const route = useRoute();

// Mock data — in production this would come from an API call using route.params.id
const application = computed(() => ({
  no: String(route.params.id ?? "GAP-2567-001"),
  farmer: "นาย สมชาย ใจดี",
  crop: "ข้าวหอมมะลิ",
  province: "นครราชสีมา",
  area: "15 ไร่",
  appType: "รายเดี่ยว",
  status: "DOC_REVIEW" as GapStatus,
  submittedDate: "1 มี.ค. 67",
  updatedDate: "3 มี.ค. 67",
}));

const documents = [
  { name: "สำเนาโฉนดที่ดิน.pdf", icon: "fas fa-file-pdf", size: "2.4 MB" },
  { name: "ผลวิเคราะห์คุณภาพน้ำ.pdf", icon: "fas fa-file-pdf", size: "1.1 MB" },
  { name: "แผนที่แปลงปลูก.jpg", icon: "fas fa-image", size: "3.8 MB" },
];

const timelineItems: TimelineItem[] = [
  {
    id: "1",
    title: "ยื่นคำขอ",
    description: "สร้างคำขอ GAP-2567-001",
    date: "1 มี.ค. 67",
    icon: "fas fa-paper-plane",
    iconColor: "grey",
  },
  {
    id: "2",
    title: "ตรวจเอกสาร",
    description: "เจ้าหน้าที่รับเรื่องแล้ว",
    date: "3 มี.ค. 67",
    icon: "fas fa-file-magnifying-glass",
    iconColor: "orange",
  },
  {
    id: "3",
    title: "นัดตรวจแปลง",
    description: "วันที่ 15 มี.ค. เวลา 09:00",
    date: "8 มี.ค. 67",
    icon: "fas fa-calendar-check",
    iconColor: "purple",
  },
  {
    id: "4",
    title: "ตรวจประเมินแปลง",
    description: "ผ่านเกณฑ์ 7/8 หมวด",
    date: "15 มี.ค. 67",
    icon: "fas fa-clipboard-check",
    iconColor: "indigo",
  },
  {
    id: "5",
    title: "อนุมัติ & ออกใบรับรอง",
    description: "GAP-C-2567-0089 อายุ 1 ปี",
    date: "20 มี.ค. 67",
    icon: "fas fa-certificate",
    iconColor: "success",
  },
];
</script>

<style scoped>
.info-stat {
  text-align: center;
  padding: 12px 8px;
  border-radius: 10px;
  background: rgba(var(--v-theme-surface-variant), 1);
}
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 12px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.55); text-transform: uppercase; letter-spacing: 0.4px; }
.info-value { font-size: 14px; color: rgba(var(--v-theme-on-surface), 0.87); }
</style>
