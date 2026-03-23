<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด HC สินค้าแปรรูป</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบออกใบรับรองสุขอนามัย (Health Certificate)
          สินค้าแปรรูปด้านพืช
        </p>
      </div>
      <v-btn
        color="hcex-user"
        prepend-icon="fas fa-file-pen"
        @click="router.push('/hcex/user/applications/new')"
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
            <v-icon
              icon="fas fa-clock-rotate-left"
              color="hcex-user"
              size="16"
            />
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="hcex-user"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="router.push('/hcex/user/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in recentApps" :key="app.id">
              <v-list-item
                class="pa-3"
                @click="router.push(`/hcex/user/applications/${app.id}`)"
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
                  >{{ app.certType }} →
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
          color="hcex-user"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-triangle-exclamation"
        >
          <div class="text-body-2 font-weight-medium mb-1">อัพเดทสถานะ</div>
          <div class="text-caption">คำขอ HCEX-2568-00008 รอเลือกผล Lab</div>
        </v-alert>
        <v-card rounded="xl" elevation="0">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-bolt" color="hcex-user" size="16" />
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

<script setup>
import { useRouter } from "vue-router";
import AppStatCard from "@/components/common/AppStatCard.vue";

const router = useRouter();

const stats = [
  {
    label: "คำขอทั้งหมด",
    value: "6",
    icon: "fas fa-file-lines",
    iconColor: "primary",
  },
  {
    label: "รอดำเนินการ",
    value: "2",
    icon: "fas fa-hourglass-half",
    iconColor: "info",
  },
  {
    label: "อนุมัติแล้ว",
    value: "3",
    icon: "fas fa-circle-check",
    iconColor: "success",
  },
  {
    label: "ใบรับรองมีผล",
    value: "3",
    icon: "fas fa-industry",
    iconColor: "primary",
  },
];

const recentApps = [
  {
    id: "HCEX-001",
    requestNo: "HCEX-2568-00012",
    certType: "กมพ.1",
    destination: "ญี่ปุ่น",
    submittedAt: "10 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HCEX-002",
    requestNo: "HCEX-2568-00010",
    certType: "กมพ.1-1",
    destination: "จีน",
    submittedAt: "5 ม.ค. 68",
    status: "lab_verification",
  },
  {
    id: "HCEX-003",
    requestNo: "HCEX-2568-00008",
    certType: "กมพ.1",
    destination: "เกาหลีใต้",
    submittedAt: "2 ม.ค. 68",
    status: "approved",
  },
  {
    id: "HCEX-004",
    requestNo: "HCEX-2568-00005",
    certType: "กมพ.1-3",
    destination: "สิงคโปร์",
    submittedAt: "20 ธ.ค. 67",
    status: "completed",
  },
];

const quickActions = [
  {
    title: "ยื่นคำขอใบรับรองใหม่",
    icon: "fas fa-file-pen",
    color: "primary",
    to: "/hcex/user/applications/new",
  },
  {
    title: "ยื่นคำขอแก้ไขใบรับรอง",
    icon: "fas fa-pen-to-square",
    color: "secondary",
    to: "/hcex/user/applications/new?type=correction",
  },
  {
    title: "รายการใบรับรอง",
    icon: "fas fa-industry",
    color: "primary",
    to: "/hcex/user/certificates",
  },
];

function getStatusColor(s) {
  const m = {
    draft: "grey",
    submitted: "primary",
    under_review: "info",
    lab_verification: "secondary",
    approved: "success",
    rejected: "error",
    completed: "success",
  };
  return m[s] ?? "grey";
}

function getStatusIcon(s) {
  const m = {
    draft: "fas fa-pen",
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    lab_verification: "fas fa-flask-vial",
    approved: "fas fa-circle-check",
    completed: "fas fa-industry",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}

function getStatusLabel(s) {
  const m = {
    draft: "ฉบับร่าง",
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    lab_verification: "รอพิจารณา Lab",
    approved: "อนุมัติแล้ว",
    completed: "รับใบรับรองแล้ว",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>
