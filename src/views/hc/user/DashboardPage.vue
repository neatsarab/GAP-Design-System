<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด HC ผู้ประกอบการ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบออกใบรับรองสุขอนามัย (Health Certificate)
          ตามประกาศพืชควบคุมเฉพาะ
        </p>
      </div>
      <v-btn
        color="hc-user"
        prepend-icon="fas fa-file-pen"
        @click="router.push('/hc/user/applications/new')"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

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
            <v-icon icon="fas fa-clock-rotate-left" color="hc-user" size="16" />
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="hc-user"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="router.push('/hc/user/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in recentApps" :key="app.id">
              <v-list-item
                class="pa-3"
                @click="router.push(`/hc/user/applications/${app.id}`)"
              >
                <template #prepend>
                  <v-avatar
                    :color="getStatusColor(app.status)"
                    variant="tonal"
                    size="40"
                    rounded="lg"
                    class="mr-3"
                  >
                    <v-icon :icon="getStatusIcon(app.status)" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  app.requestNo
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >{{ app.product }} →
                  {{ app.destination }}</v-list-item-subtitle
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
              <v-divider v-if="i < recentApps.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Info Alert + Quick Actions -->
      <v-col cols="12" md="4">
        <v-alert
          color="hc-user"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-triangle-exclamation"
        >
          <div class="text-body-2 font-weight-medium mb-1">อัพเดทสถานะ</div>
          <div class="text-caption">
            คำขอ HC-2568-00041 รอชำระค่าธรรมเนียม กรุณาดำเนินการภายใน 7 วัน
          </div>
        </v-alert>
        <v-card rounded="xl" elevation="0">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-bolt" color="hc-user" size="16" />
            <span class="text-body-1 font-weight-bold">ดำเนินการด่วน</span>
          </v-card-title>
          <v-divider />
          <v-list density="compact" nav class="pa-2">
            <v-list-item
              v-for="action in quickActions"
              :key="action.title"
              :prepend-icon="action.icon"
              :title="action.title"
              rounded="lg"
              :color="action.color"
              class="mb-1"
              @click="router.push(action.to)"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import AppStatCard from "@/components/common/AppStatCard.vue";

const router = useRouter();

const stats = [
  {
    label: "คำขอทั้งหมด",
    value: "8",
    icon: "fas fa-file-lines",
    iconColor: "hc-user",
  },
  {
    label: "อยู่ระหว่างดำเนินการ",
    value: "3",
    icon: "fas fa-hourglass-half",
    iconColor: "warning",
  },
  {
    label: "ใบรับรองมีผล",
    value: "4",
    icon: "fas fa-file-shield",
    iconColor: "success",
  },
  { label: "รอชำระเงิน", value: "1", icon: "fas fa-coins", iconColor: "error" },
];

const recentApps = [
  {
    id: "HC-001",
    requestNo: "HC-2568-00041",
    product: "ทุเรียน",
    destination: "จีน",
    submittedAt: "15 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HC-003",
    requestNo: "HC-2568-00036",
    product: "ลำไย",
    destination: "เวียดนาม",
    submittedAt: "10 ม.ค. 68",
    status: "approved",
  },
  {
    id: "HC-008",
    requestNo: "HC-2568-00025",
    product: "มังคุด",
    destination: "จีน",
    submittedAt: "2 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HC-010",
    requestNo: "HC-2568-00042",
    product: "ลิ้นจี่",
    destination: "เกาหลีใต้",
    submittedAt: "16 ม.ค. 68",
    status: "submitted",
  },
];

const quickActions = [
  {
    title: "ยื่นคำขอใบรับรองใหม่",
    icon: "fas fa-file-pen",
    color: "hc-user",
    to: "/hc/user/applications/new",
  },
  {
    title: "ยื่นคำขอแก้ไขใบรับรอง",
    icon: "fas fa-pen-to-square",
    color: "secondary",
    to: "/hc/user/applications/new?type=correction",
  },
  {
    title: "รายการใบรับรอง",
    icon: "fas fa-file-shield",
    color: "hc-user",
    to: "/hc/user/certificates",
  },
];

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    submitted: "hc-user",
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

function getStatusIcon(s: string) {
  const m: Record<string, string> = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    testing: "fas fa-flask",
    pending_approval: "fas fa-gavel",
    approved: "fas fa-circle-check",
    completed: "fas fa-file-shield",
    correction_required: "fas fa-triangle-exclamation",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}

function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติแล้ว",
    completed: "รับใบรับรองแล้ว",
    correction_required: "ต้องแก้ไข",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>
