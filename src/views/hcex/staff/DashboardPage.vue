<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">แดชบอร์ด</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบออกใบรับรองสุขอนามัย (Health Certificate)
          สินค้าแปรรูปด้านพืช
        </p>
      </div>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="4" md="3">
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
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="hcex-staff"
                size="16"
              />
              <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            </div>
            <v-btn
              variant="text"
              color="hcex-staff"
              size="small"
              @click="router.push('/hcex/staff/applications')"
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
                  router.push(`/hcex/staff/applications/${row.item.id}`)
              "
            >
              <template #item.requestNo="{ item }">
                <span class="text-body-2 font-weight-medium text-warning">{{
                  item.requestNo
                }}</span>
              </template>
              <template #item.status="{ item }">
                <v-chip
                  size="small"
                  :color="getStatusColor(item.status)"
                  variant="tonal"
                >
                  {{ getStatusLabel(item.status) }}
                </v-chip>
              </template>
              <template #item.certType="{ item }">
                <v-chip size="x-small" color="hcex-staff" variant="tonal">
                  {{ item.certType }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Work Queue -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-list-check" color="hcex-staff" size="16" />
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

        <!-- Quick Actions -->
        <v-card>
          <v-card-title class="pa-4 pb-2">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-bolt" color="hcex-staff" size="16" />
              <span class="text-body-1 font-weight-bold">Quick Actions</span>
            </div>
          </v-card-title>
          <v-card-text class="pt-0 pb-3 d-flex flex-column ga-2">
            <v-btn
              variant="tonal"
              color="hcex-staff"
              prepend-icon="fas fa-file-lines"
              class="justify-start"
              @click="router.push('/hcex/staff/applications')"
            >
              ดูรายการคำขอ
            </v-btn>
            <v-btn
              variant="tonal"
              color="info"
              prepend-icon="fas fa-flask-vial"
              class="justify-start"
              @click="router.push('/hcex/staff/lab-results')"
            >
              จัดการผล Lab
            </v-btn>
          </v-card-text>
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
    label: "คำขอรอตรวจสอบ",
    value: "9",
    icon: "fas fa-magnifying-glass",
    color: "hcex-staff",
    trend: null,
    trendColor: "warning",
  },
  {
    label: "รอพิจารณา Lab",
    value: "5",
    icon: "fas fa-flask-vial",
    color: "info",
    trend: null,
    trendColor: "",
  },
  {
    label: "รอลงนาม",
    value: "3",
    icon: "fas fa-signature",
    color: "secondary",
    trend: null,
    trendColor: "error",
  },
  {
    label: "ออกใบรับรองแล้ว",
    value: "87",
    icon: "fas fa-industry",
    color: "success",
    trend: null,
    trendColor: "",
  },
];

const workQueue = [
  {
    label: "คำขอรอตรวจสอบ",
    icon: "fas fa-magnifying-glass",
    to: "/hcex/staff/applications",
    color: "hcex-staff",
    count: 9,
  },
  {
    label: "รอพิจารณา Lab",
    icon: "fas fa-flask-vial",
    to: "/hcex/staff/lab-results",
    color: "info",
    count: 5,
  },
  {
    label: "รอลงนาม",
    icon: "fas fa-signature",
    to: "/hcex/staff/signing",
    color: "error",
    count: 3,
  },
];

interface RecentApp {
  id: string;
  requestNo: string;
  exporter: string;
  certType: string;
  submittedAt: string;
  status: string;
}

const recentApplications: RecentApp[] = [
  {
    id: "HCEX-001",
    requestNo: "HCEX-2568-00012",
    exporter: "บ.ไทยฟู้ดโปรเซส จก.",
    certType: "กมพ.1",
    submittedAt: "10 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HCEX-002",
    requestNo: "HCEX-2568-00011",
    exporter: "บ.สยามแปรรูป จก.",
    certType: "กมพ.1-1",
    submittedAt: "9 ม.ค. 68",
    status: "lab_verification",
  },
  {
    id: "HCEX-003",
    requestNo: "HCEX-2568-00010",
    exporter: "บ.กรีนโปรดักส์ จก.",
    certType: "กมพ.1-2",
    submittedAt: "7 ม.ค. 68",
    status: "pending_signing",
  },
  {
    id: "HCEX-004",
    requestNo: "HCEX-2568-00009",
    exporter: "บ.ดอยอาหาร จก.",
    certType: "กมพ.1",
    submittedAt: "5 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HCEX-005",
    requestNo: "HCEX-2568-00008",
    exporter: "บ.เอเชียฟู้ดส์ จก.",
    certType: "กมพ.1-3",
    submittedAt: "3 ม.ค. 68",
    status: "completed",
  },
];

const recentHeaders = [
  { title: "เลขคำขอ", key: "requestNo", width: 170 },
  { title: "ผู้ประกอบการ", key: "exporter", width: 170 },
  { title: "ประเภท", key: "certType", width: 100 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 150 },
];

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    draft: "grey",
    submitted: "warning",
    under_review: "info",
    lab_verification: "secondary",
    pending_signing: "primary",
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
    lab_verification: "รอพิจารณา Lab",
    pending_signing: "รอลงนาม",
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
