<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด</h1>
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

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="3">
        <v-card rounded="xl" elevation="0" class="stat-card h-100">
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
        <v-card rounded="xl" elevation="0" class="stat-card">
          <v-card-title
            class="pa-4 pb-0 d-flex align-center justify-space-between"
          >
            <div class="d-flex align-center ga-2">
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="hc-user"
                size="16"
              />
              <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            </div>
            <v-btn
              variant="text"
              color="hc-user"
              size="small"
              @click="router.push('/hc/user/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list lines="two" class="pa-2">
              <v-list-item
                v-for="app in recentApps"
                :key="app.id"
                :subtitle="app.product + ' → ' + app.destination"
                rounded="lg"
                class="mb-1"
                @click="router.push(`/hc/user/applications/${app.id}`)"
              >
                <template #title>
                  <div class="d-flex align-center ga-2 mb-1">
                    <span class="text-body-2 font-weight-medium text-hc-user">{{
                      app.requestNo
                    }}</span>
                    <v-chip
                      size="x-small"
                      :color="getStatusColor(app.status)"
                      variant="tonal"
                    >
                      {{ getStatusLabel(app.status) }}
                    </v-chip>
                  </div>
                </template>
                <template #prepend>
                  <div
                    class="app-icon-box mr-2"
                    :style="{
                      background: `rgba(var(--v-theme-${getStatusColor(app.status)}),0.1)`,
                    }"
                  >
                    <v-icon
                      :icon="getStatusIcon(app.status)"
                      :color="getStatusColor(app.status)"
                      size="16"
                    />
                  </div>
                </template>
                <template #append>
                  <span class="text-caption text-medium-emphasis">{{
                    app.submittedAt
                  }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quick Actions + Certificates -->
      <v-col cols="12" md="4">
        <!-- Quick Actions -->
        <v-card rounded="xl" elevation="0" class="stat-card mb-4">
          <v-card-title class="pa-4 pb-2">
            <div class="d-flex align-center ga-2">
              <v-icon icon="fas fa-bolt" color="hc-user" size="16" />
              <span class="text-body-1 font-weight-bold">ดำเนินการด่วน</span>
            </div>
          </v-card-title>
          <v-card-text class="pt-0 pb-3 d-flex flex-column ga-2">
            <v-btn
              color="hc-user"
              prepend-icon="fas fa-file-pen"
              class="justify-start"
              @click="router.push('/hc/user/applications/new')"
            >
              ยื่นคำขอใบรับรองใหม่
            </v-btn>
            <v-btn
              variant="tonal"
              color="secondary"
              prepend-icon="fas fa-file-pen"
              class="justify-start"
              @click="router.push('/hc/user/applications/new?type=correction')"
            >
              ยื่นคำขอแก้ไขใบรับรอง
            </v-btn>
            <v-btn
              variant="tonal"
              color="hc-user"
              prepend-icon="fas fa-file-shield"
              class="justify-start"
              @click="router.push('/hc/user/certificates')"
            >
              รายการใบรับรอง
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Notice -->
        <v-alert
          color="warning"
          variant="tonal"
          rounded="lg"
          density="compact"
          prepend-icon="fas fa-triangle-exclamation"
        >
          <div class="text-body-2 font-weight-bold mb-1">มีคำขอรอดำเนินการ</div>
          <div class="text-caption">
            คำขอ HC-2568-00041 รอชำระค่าธรรมเนียม กรุณาดำเนินการภายใน 7 วัน
          </div>
          <template #append>
            <v-btn size="small" color="warning" variant="tonal" class="mt-1"
              >ดำเนินการ</v-btn
            >
          </template>
        </v-alert>
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
    value: "8",
    icon: "fas fa-file-lines",
    color: "hc-user",
  },
  {
    label: "อยู่ระหว่างดำเนินการ",
    value: "3",
    icon: "fas fa-hourglass-half",
    color: "warning",
  },
  {
    label: "ใบรับรองมีผล",
    value: "4",
    icon: "fas fa-file-shield",
    color: "success",
  },
  { label: "รอชำระเงิน", value: "1", icon: "fas fa-coins", color: "error" },
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
