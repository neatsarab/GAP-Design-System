<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบออกใบรับรองสุขอนามัย ตามประกาศพืชควบคุมเฉพาะ
        </p>
      </div>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
        <AppStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <v-row>
      <!-- Recent Applications -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon
              icon="fas fa-clock-rotate-left"
              color="hc-staff"
              size="16"
            />
            <span class="text-body-1 font-weight-bold">คำขอรอดำเนินการ</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="hc-staff"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="goToApplicationList"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in pendingApplications" :key="app.id">
              <v-list-item class="pa-3" @click="goToApplicationDetail(app.id)">
                <template #prepend>
                  <v-avatar
                    :color="getStatusColor(app.status)"
                    variant="tonal"
                    size="40"
                    rounded="lg"
                    class="mr-3"
                  >
                    <v-icon icon="fas fa-file-shield" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  app.requestNo
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >{{ app.exporter }} · {{ app.type }}</v-list-item-subtitle
                >
                <template #append>
                  <div class="d-flex flex-column align-end ga-1">
                    <v-chip
                      :color="getStatusColor(app.status)"
                      size="x-small"
                      variant="tonal"
                      >{{ getStatusLabel(app.status) }}</v-chip
                    >
                    <span class="text-caption text-medium-emphasis">{{
                      app.submittedAt
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="i < pendingApplications.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Info Alert + Quick Actions -->
      <v-col cols="12" md="4">
        <v-alert
          color="hc-staff"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">
            สรุปงานที่รอดำเนินการ
          </div>
          <div class="text-body-2">มีคำขอรอดำเนินการทั้งหมด 12 รายการ</div>
        </v-alert>
        <!-- Status Summary -->
        <v-card rounded="xl" elevation="0" class="mt-4">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-chart-pie" color="info" size="16" />
            <span class="text-body-1 font-weight-bold">สัดส่วนสถานะ</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <div v-for="bar in statusBars" :key="bar.label" class="mb-3">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">{{ bar.label }}</span>
                <span class="text-caption font-weight-bold"
                  >{{ bar.value }} ({{ bar.pct }}%)</span
                >
              </div>
              <v-progress-linear
                :model-value="bar.pct"
                :color="bar.color"
                height="6"
                rounded
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import AppStatCard from "@/components/common/AppStatCard.vue";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "HCstaffApplicationList" });
}

function goToApplicationDetail(id) {
  router.push({ name: "HCstaffApplicationDetail", params: { id } });
}

const stats = [
  {
    label: "คำขอทั้งหมด",
    value: "148",
    icon: "fas fa-file-lines",
    iconColor: "hc-staff",
  },
  {
    label: "รอตรวจ",
    value: "12",
    icon: "fas fa-magnifying-glass",
    iconColor: "warning",
  },
  {
    label: "อนุมัติแล้ว",
    value: "9",
    icon: "fas fa-circle-check",
    iconColor: "success",
  },
  {
    label: "สถานประกอบการที่ขึ้นทะเบียน",
    value: "119",
    icon: "fas fa-file-shield",
    iconColor: "info",
  },
];

const pendingApplications = [
  {
    id: "HC-001",
    requestNo: "HC-2569-00041",
    exporter: "บ.ไทยฟรุ๊ต จก.",
    type: "ขอใบรับรอง",
    submittedAt: "15 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HC-002",
    requestNo: "HC-2569-00039",
    exporter: "บ.สยามเอ็กซ์พอร์ต",
    type: "ขอใบรับรอง",
    submittedAt: "13 ม.ค. 68",
    status: "pending_approval",
  },
  {
    id: "HC-003",
    requestNo: "HC-2569-00036",
    exporter: "บ.กรีนเฟรช จก.",
    type: "แก้ไขใบรับรอง",
    submittedAt: "10 ม.ค. 68",
    status: "signing",
  },
];

const statusBars = [
  { label: "ออกใบรับรองแล้ว", value: 119, pct: 81, color: "success" },
  { label: "รอตรวจ", value: 12, pct: 8, color: "warning" },
  { label: "อนุมัติแล้ว", value: 9, pct: 6, color: "info" },
  { label: "ไม่ผ่าน", value: 8, pct: 5, color: "error" },
];

function getStatusColor(s) {
  const m = {
    pending: "warning",
    under_review: "warning",
    pending_approval: "info",
    signing: "info",
    approved: "success",
    completed: "success",
    rejected: "error",
    need_edit: "error",
  };
  return m[s] ?? "grey";
}

function getStatusLabel(s) {
  const m = {
    pending: "รอตรวจ",
    under_review: "รอตรวจสอบ",
    pending_approval: "รอพิจารณา",
    signing: "รอลงนาม",
    approved: "อนุมัติแล้ว",
    completed: "เสร็จสิ้น",
    rejected: "ไม่อนุมัติ",
    need_edit: "รอแก้ไข",
  };
  return m[s] ?? s;
}
</script>
