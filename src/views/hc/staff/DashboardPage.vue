<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">แดชบอร์ด</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบออกใบรับรองสุขอนามัย (Health Certificate)
          ตามประกาศพืชควบคุมเฉพาะ
        </p>
      </div>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="4" md="2">
        <v-card class="stat-card h-100">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between mb-3">
              <div
                class="stat-icon-box"
                :style="{
                  background: `rgba(var(--v-theme-${stat.color}),0.12)`,
                }"
              >
                <v-icon :icon="stat.icon" :color="stat.color" size="18" />
              </div>
              <v-chip
                v-if="stat.trend"
                size="x-small"
                :color="stat.trendColor"
                variant="tonal"
              >
                <v-icon start icon="fas fa-arrow-up" size="8" />{{ stat.trend }}
              </v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stat.value }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ stat.label }}
            </div>
          </v-card-text>
          <div
            class="stat-accent"
            :style="{ background: `rgb(var(--v-theme-${stat.color}))` }"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Recent Applications -->
      <v-col cols="12" md="8">
        <v-card class="h-100">
          <v-card-title
            class="pa-4 pb-0 d-flex align-center justify-space-between"
          >
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-clock-rotate-left" color="hc-staff" size="16" />
              <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            </div>
            <v-btn
              variant="text"
              color="hc-staff"
              size="small"
              @click="router.push('/hc/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="recentHeaders"
              :items="recentApplications"
              hide-default-footer
              hover
              @click:row="
                (_e: unknown, row: { item: RecentApp }) =>
                  router.push(`/hc/applications/${row.item.id}`)
              "
            >
              <template #item.status="{ item }">
                <v-chip
                  size="small"
                  :color="getStatusColor(item.status)"
                  variant="tonal"
                >
                  {{ getStatusLabel(item.status) }}
                </v-chip>
              </template>
              <template #item.type="{ item }">
                <v-chip
                  size="x-small"
                  :color="getTypeColor(item.type)"
                  variant="tonal"
                >
                  <v-icon start :icon="getTypeIcon(item.type)" size="10" />
                  {{ item.type }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Work Queue + Quick Actions -->
      <v-col cols="12" md="4">
        <!-- Work Queue -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-list-check" color="hc-staff" size="16" />
              <span class="text-body-1 font-weight-bold">งานรอดำเนินการ</span>
            </div>
          </v-card-title>
          <v-list density="compact" class="px-2 pb-2">
            <v-list-item
              v-for="q in workQueue"
              :key="q.label"
              :prepend-icon="q.icon"
              :to="q.to"
              rounded="lg"
              class="mb-1"
            >
              <template #title>
                <span class="text-body-2">{{ q.label }}</span>
              </template>
              <template #append>
                <v-chip size="x-small" :color="q.color" variant="tonal">{{
                  q.count
                }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const stats = [
  {
    label: "คำขอทั้งหมด",
    value: "148",
    icon: "fas fa-file-lines",
    color: "hc-staff",
    trend: null,
    trendColor: "",
  },
  {
    label: "รอตรวจสอบ",
    value: "12",
    icon: "fas fa-magnifying-glass",
    color: "warning",
    trend: null,
    trendColor: "warning",
  },
  {
    label: "ตรวจ Lab",
    value: "8",
    icon: "fas fa-flask",
    color: "warning",
    trend: null,
    trendColor: "",
  },
  {
    label: "รอพิจารณา",
    value: "5",
    icon: "fas fa-gavel",
    color: "warning",
    trend: null,
    trendColor: "",
  },
  {
    label: "รอลงนาม",
    value: "4",
    icon: "fas fa-signature",
    color: "warning",
    trend: null,
    trendColor: "error",
  },
  {
    label: "ออกใบรับรองแล้ว",
    value: "119",
    icon: "fas fa-file-shield",
    color: "success",
    trend: null,
    trendColor: "",
  },
];

const workQueue = [
  {
    label: "คำขอรอตรวจสอบ",
    icon: "fas fa-magnifying-glass",
    to: "/hc/review",
    color: "warning",
    count: 12,
  },
  {
    label: "รอบันทึกผล Lab",
    icon: "fas fa-flask",
    to: "/hc/lab-results",
    color: "secondary",
    count: 8,
  },
  {
    label: "รอพิจารณาออกใบรับรอง",
    icon: "fas fa-gavel",
    to: "/hc/approval",
    color: "primary",
    count: 5,
  },
  {
    label: "รอลงนาม",
    icon: "fas fa-signature",
    to: "/hc/sign",
    color: "error",
    count: 4,
  },
];

interface RecentApp {
  id: string;
  requestNo: string;
  exporter: string;
  type: string;
  submittedAt: string;
  status: string;
}

const recentApplications: RecentApp[] = [
  {
    id: "HC-001",
    requestNo: "HC-2568-00041",
    exporter: "บ.ไทยฟรุ๊ต จก.",
    type: "ขอใบรับรอง",
    submittedAt: "15 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HC-002",
    requestNo: "HC-2568-00039",
    exporter: "บ.สยามเอ็กซ์พอร์ต",
    type: "ขอใบรับรอง",
    submittedAt: "13 ม.ค. 68",
    status: "testing",
  },
  {
    id: "HC-003",
    requestNo: "HC-2568-00036",
    exporter: "บ.กรีนเฟรช จก.",
    type: "แก้ไขใบรับรอง",
    submittedAt: "10 ม.ค. 68",
    status: "pending_approval",
  },
  {
    id: "HC-004",
    requestNo: "HC-2568-00034",
    exporter: "บ.ดีเอ็กซ์พอร์ต",
    type: "ขอใบรับรอง",
    submittedAt: "8 ม.ค. 68",
    status: "approved",
  },
  {
    id: "HC-005",
    requestNo: "HC-2568-00030",
    exporter: "บ.ไทยอะกริ จก.",
    type: "ขอใบรับรอง",
    submittedAt: "3 ม.ค. 68",
    status: "completed",
  },
];

const recentHeaders = [
  { title: "เลขคำขอ", key: "requestNo", width: 150 },
  { title: "ผู้ส่งออก", key: "exporter", width: 160 },
  { title: "ประเภท", key: "type", width: 110 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 140 },
];

function getTypeColor(t: string) {
  return t === "แก้ไขใบรับรอง" ? "warning" : "info";
}
function getTypeIcon(t: string) {
  return t === "แก้ไขใบรับรอง" ? "fas fa-pen-to-square" : "fas fa-file-shield";
}

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    draft: "grey",
    submitted: "info",
    under_review: "warning",
    testing: "secondary",
    pending_approval: "primary",
    approved: "success",
    correction_required: "error",
    completed: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    draft: "ฉบับร่าง",
    submitted: "ยื่นแล้ว",
    under_review: "รอตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติแล้ว",
    correction_required: "ต้องแก้ไข",
    completed: "เสร็จสิ้น",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>

<style scoped>
.stat-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: relative;
  overflow: hidden;
}
.stat-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0.6;
}
</style>
