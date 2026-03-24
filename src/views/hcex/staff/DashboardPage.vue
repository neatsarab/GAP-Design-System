<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด HCEX (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบออกใบรับรองสุขอนามัย (Health Certificate)
          สินค้าแปรรูปด้านพืช
        </p>
      </div>
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
              color="hcex-staff"
              size="16"
            />
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="hcex-staff"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="goToApplicationList"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in recentApplications" :key="app.id">
              <v-list-item
                class="pa-3"
                @click="goToApplicationDetail(app.id)"
              >
                <template #prepend>
                  <v-avatar
                    :color="getStatusColor(app.status)"
                    variant="tonal"
                    size="40"
                    rounded="lg"
                    class="mr-3"
                  >
                    <v-icon icon="fas fa-industry" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  app.requestNo
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >{{ app.exporter }} · {{ app.certType }}</v-list-item-subtitle
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
              <v-divider v-if="i < recentApplications.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Info Alert + Quick Actions -->
      <v-col cols="12" md="4">
        <v-alert
          color="hcex-staff"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">
            สรุปงานที่รอดำเนินการ
          </div>
          <div class="text-body-2">
            มีคำขอรอดำเนินการ 9 รายการ รวมถึงรอพิจารณา Lab 5 รายการ
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

<script setup>
import { useRouter } from "vue-router";
import AppStatCard from "@/components/common/AppStatCard.vue";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "HCEXstaffApplicationList" });
}

function goToApplicationDetail(id) {
  router.push({ name: "HCEXstaffApplicationDetail", params: { id } });
}

const stats = [
  {
    label: "คำขอรอตรวจสอบ",
    value: "9",
    icon: "fas fa-magnifying-glass",
    iconColor: "primary",
  },
  {
    label: "รอพิจารณา Lab",
    value: "5",
    icon: "fas fa-flask-vial",
    iconColor: "info",
  },
  {
    label: "รอลงนาม",
    value: "3",
    icon: "fas fa-signature",
    iconColor: "secondary",
  },
  {
    label: "ออกใบรับรองแล้ว",
    value: "87",
    icon: "fas fa-industry",
    iconColor: "success",
  },
];

const recentApplications = [
  {
    id: "HCEX-001",
    requestNo: "HCEX-2569-00012",
    exporter: "บ.ไทยฟู้ดโปรเซส จก.",
    certType: "กมพ.1",
    submittedAt: "10 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HCEX-002",
    requestNo: "HCEX-2569-00011",
    exporter: "บ.สยามแปรรูป จก.",
    certType: "กมพ.1-1",
    submittedAt: "9 ม.ค. 68",
    status: "lab_verification",
  },
  {
    id: "HCEX-003",
    requestNo: "HCEX-2569-00010",
    exporter: "บ.กรีนโปรดักส์ จก.",
    certType: "กมพ.1-2",
    submittedAt: "7 ม.ค. 68",
    status: "pending_signing",
  },
  {
    id: "HCEX-004",
    requestNo: "HCEX-2569-00009",
    exporter: "บ.ดอยอาหาร จก.",
    certType: "กมพ.1",
    submittedAt: "5 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HCEX-005",
    requestNo: "HCEX-2569-00008",
    exporter: "บ.เอเชียฟู้ดส์ จก.",
    certType: "กมพ.1-3",
    submittedAt: "3 ม.ค. 68",
    status: "completed",
  },
];

const statusBars = [
  { label: "ออกใบรับรองแล้ว", value: 87, pct: 84, color: "success" },
  { label: "รอตรวจสอบ", value: 9, pct: 9, color: "primary" },
  { label: "รอพิจารณา Lab", value: 5, pct: 5, color: "info" },
  { label: "รอลงนาม", value: 3, pct: 3, color: "error" },
];

function getStatusColor(s) {
  const m = {
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

function getStatusLabel(s) {
  const m = {
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
