<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">แดชบอร์ด</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          <v-icon icon="fas fa-calendar" size="13" class="mr-1" />{{
            currentDate
          }}
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="fas fa-file-pen"
        @click="router.push('/gap/staff/applications/new')"
      >
        ยื่นคำขอรับรองใหม่
      </v-btn>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="4" md="2">
        <v-card
          class="stat-card h-100"
          :style="`border-top: 3px solid rgb(var(--v-theme-${stat.color}))`"
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <div
                class="stat-icon-box"
                :style="`background: rgba(var(--v-theme-${stat.color}), 0.12)`"
              >
                <v-icon :icon="stat.icon" :color="stat.color" size="18" />
              </div>
              <span
                class="text-h5 font-weight-bold"
                :class="`text-${stat.color}`"
                >{{ stat.value }}</span
              >
            </div>
            <p
              class="text-caption text-medium-emphasis mb-0"
              style="line-height: 1.4"
            >
              {{ stat.label }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Work Queue -->
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-list-check" color="primary" size="18" />
            <span class="text-body-1 font-weight-bold"
              >งานที่ต้องดำเนินการ</span
            >
            <v-chip size="x-small" color="error" variant="flat" class="ml-auto">
              {{ workQueue.length }} รายการ
            </v-chip>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(item, i) in workQueue" :key="item.id">
              <v-list-item
                :prepend-icon="item.icon"
                :active="false"
                class="queue-item"
                @click="router.push(`/staff/applications/${item.id}`)"
              >
                <template v-slot:prepend>
                  <div
                    class="queue-icon-box mr-3"
                    :style="`background:rgba(var(--v-theme-${item.color}),0.12)`"
                  >
                    <v-icon :icon="item.icon" :color="item.color" size="16" />
                  </div>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  item.title
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{
                  item.subtitle
                }}</v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-right">
                    <v-chip
                      size="x-small"
                      :color="item.color"
                      variant="tonal"
                      >{{ item.statusLabel }}</v-chip
                    >
                    <div class="text-caption text-medium-emphasis mt-1">
                      {{ item.date }}
                    </div>
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="i < workQueue.length - 1" />
            </template>
          </v-list>
          <v-card-actions class="pa-3">
            <v-btn
              variant="text"
              color="primary"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="router.push('/gap/staff/applications')"
            >
              ดูรายการทั้งหมด
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Right column -->
      <v-col cols="12" md="5">
        <!-- Quick Actions -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-bolt" color="warning" size="18" />
            <span class="text-body-1 font-weight-bold">ดำเนินการด่วน</span>
          </v-card-title>
          <v-divider />
          <v-list density="compact" nav class="pa-2">
            <v-list-item
              v-for="qa in quickActions"
              :key="qa.label"
              :prepend-icon="qa.icon"
              :title="qa.label"
              rounded="lg"
              class="mb-1"
              @click="router.push(qa.to)"
            >
              <template v-slot:append>
                <v-chip
                  v-if="qa.count"
                  size="x-small"
                  :color="qa.color"
                  variant="flat"
                  >{{ qa.count }}</v-chip
                >
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Status Summary -->
        <v-card>
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-chart-pie" color="info" size="18" />
            <span class="text-body-1 font-weight-bold">สัดส่วนสถานะคำขอ</span>
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
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const currentDate = computed(() =>
  new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }),
);

const stats = [
  {
    label: "คำขอทั้งหมด",
    icon: "fas fa-file-lines",
    color: "primary",
    value: 48,
  },
  {
    label: "รอตรวจคำขอ",
    icon: "fas fa-magnifying-glass",
    color: "warning",
    value: 7,
  },
  {
    label: "รอนัดตรวจแปลง",
    icon: "fas fa-calendar-clock",
    color: "info",
    value: 5,
  },
  {
    label: "อยู่ระหว่างตรวจ",
    icon: "fas fa-person-walking",
    color: "secondary",
    value: 4,
  },
  { label: "รอพิจารณา CC", icon: "fas fa-gavel", color: "error", value: 6 },
  {
    label: "ออกใบรับรองแล้ว",
    icon: "fas fa-certificate",
    color: "success",
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

const quickActions = [
  {
    label: "นัดตรวจแปลง (5 รายการ)",
    icon: "fas fa-calendar-check",
    color: "info",
    count: 5,
    to: "/gap/staff/schedule",
  },
  {
    label: "บันทึกผลตรวจ (4 รายการ)",
    icon: "fas fa-clipboard-check",
    color: "secondary",
    count: 4,
    to: "/gap/staff/inspection-results",
  },
  {
    label: "เสนอแปลงต่อ CC (3 รายการ)",
    icon: "fas fa-paper-plane",
    color: "primary",
    count: 3,
    to: "/gap/staff/propose-cc",
  },
  {
    label: "บันทึกผล CC (6 รายการ)",
    icon: "fas fa-gavel",
    color: "error",
    count: 6,
    to: "/gap/staff/cc-results",
  },
];

const statusBars = [
  { label: "ออกใบรับรองแล้ว", value: 26, pct: 54, color: "success" },
  { label: "รอพิจารณา CC", value: 6, pct: 13, color: "error" },
  { label: "รอตรวจคำขอ", value: 7, pct: 15, color: "warning" },
  { label: "รอนัดตรวจแปลง", value: 5, pct: 10, color: "info" },
  { label: "อยู่ระหว่างตรวจ", value: 4, pct: 8, color: "secondary" },
];
</script>

<style scoped>
.stat-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: transform 0.15s;
}
.stat-card:hover {
  transform: translateY(-2px);
}
.stat-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.queue-item {
  cursor: pointer;
  transition: background 0.15s;
}
.queue-item:hover {
  background: rgba(var(--v-theme-primary), 0.04);
}
.queue-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
