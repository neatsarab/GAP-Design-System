<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด GAP (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices)
        </p>
      </div>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="4" md="2">
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
              color="gap-staff"
              size="16"
            />
            <span class="text-body-1 font-weight-bold">คำขอรอดำเนินการ</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="gap-staff"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="router.push('/gap/staff/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in workQueue" :key="app.id">
              <v-list-item
                class="pa-3"
                @click="router.push(`/gap/staff/applications/${app.id}`)"
              >
                <template #prepend>
                  <v-avatar
                    :color="app.color"
                    variant="tonal"
                    size="40"
                    rounded="lg"
                    class="mr-3"
                  >
                    <v-icon :icon="app.icon" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  app.title
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{
                  app.subtitle
                }}</v-list-item-subtitle>
                <template #append>
                  <div class="d-flex flex-column align-end ga-1">
                    <v-chip :color="app.color" size="x-small" variant="tonal">{{
                      app.statusLabel
                    }}</v-chip>
                    <span class="text-caption text-medium-emphasis">{{
                      app.date
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="i < workQueue.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Info Alert + Quick Actions -->
      <v-col cols="12" md="4">
        <v-alert
          color="gap-staff"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">
            สรุปงานที่รอดำเนินการ
          </div>
          <div class="text-body-2">
            มีคำขอรอดำเนินการทั้งหมด 7 รายการ รวมถึงรอนัดตรวจแปลง 5 รายการ
          </div>
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

<script setup lang="ts">
import { useRouter } from "vue-router";
import AppStatCard from "@/components/common/AppStatCard.vue";

const router = useRouter();

const stats = [
  {
    label: "คำขอทั้งหมด",
    icon: "fas fa-file-lines",
    iconColor: "primary",
    value: 48,
  },
  {
    label: "รอตรวจคำขอ",
    icon: "fas fa-magnifying-glass",
    iconColor: "warning",
    value: 7,
  },
  {
    label: "รอนัดตรวจแปลง",
    icon: "fas fa-calendar-clock",
    iconColor: "info",
    value: 5,
  },
  {
    label: "อยู่ระหว่างตรวจ",
    icon: "fas fa-person-walking",
    iconColor: "secondary",
    value: 4,
  },
  { label: "รอพิจารณา CC", icon: "fas fa-gavel", iconColor: "error", value: 6 },
  {
    label: "ออกใบรับรองแล้ว",
    icon: "fas fa-certificate",
    iconColor: "success",
    value: 26,
  },
];

const workQueue = [
  {
    id: "APP-001",
    icon: "fas fa-magnifying-glass",
    color: "warning",
    statusLabel: "รอตรวจคำขอ",
    title: "GAP-2568-00041 · นายสมชาย ใจดี",
    subtitle: "มะม่วง · 12 ไร่ · เชียงใหม่",
    date: "15 ม.ค. 68",
  },
  {
    id: "APP-002",
    icon: "fas fa-calendar-check",
    color: "info",
    statusLabel: "รอนัดตรวจแปลง",
    title: "GAP-2568-00039 · น.ส.วิไล สุขใส",
    subtitle: "ข้าวโพดหวาน · 8 ไร่ · เพชรบูรณ์",
    date: "13 ม.ค. 68",
  },
  {
    id: "APP-003",
    icon: "fas fa-paper-plane",
    color: "secondary",
    statusLabel: "รอเสนอ CC",
    title: "GAP-2568-00036 · นายประสิทธิ์ มั่นคง",
    subtitle: "กล้วยหอม · 20 ไร่ · นครปฐม",
    date: "10 ม.ค. 68",
  },
  {
    id: "APP-004",
    icon: "fas fa-gavel",
    color: "error",
    statusLabel: "รอผล CC",
    title: "GAP-2568-00034 · น.ส.มาลี รุ่งเรือง",
    subtitle: "ลำไย · 30 ไร่ · เชียงราย",
    date: "8 ม.ค. 68",
  },
  {
    id: "APP-005",
    icon: "fas fa-pen-to-square",
    color: "warning",
    statusLabel: "รอตรวจคำขอ",
    title: "GAP-2568-00042 · นายอำนาจ วีระชัย",
    subtitle: "พริก · 5 ไร่ · สระแก้ว",
    date: "15 ม.ค. 68",
  },
];

const statusBars = [
  { label: "ออกใบรับรองแล้ว", value: 26, pct: 54, color: "success" },
  { label: "รอตรวจคำขอ", value: 7, pct: 15, color: "warning" },
  { label: "รอพิจารณา CC", value: 6, pct: 13, color: "error" },
  { label: "รอนัดตรวจแปลง", value: 5, pct: 10, color: "info" },
  { label: "อยู่ระหว่างตรวจ", value: 4, pct: 8, color: "secondary" },
];
</script>
