<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด DOA (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมคำขอขึ้นทะเบียนโรงงานผลิตสินค้าพืชทั้งหมด
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
              color="doa-staff"
              size="16"
            />
            <span class="text-body-1 font-weight-bold">คำขอรอดำเนินการ</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="doa-staff"
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
                    :color="statusColor(app.status)"
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
                  >{{ app.companyName }} ·
                  {{ app.productType }}</v-list-item-subtitle
                >
                <template #append>
                  <div class="d-flex flex-column align-end ga-1">
                    <v-chip
                      :color="statusColor(app.status)"
                      size="x-small"
                      variant="tonal"
                      >{{ statusLabel(app.status) }}</v-chip
                    >
                    <span class="text-caption text-medium-emphasis">{{
                      app.submittedDate
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
          color="doa-staff"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">
            สรุปงานที่รอดำเนินการ
          </div>
          <div class="text-body-2">
            มีคำขอรอดำเนินการทั้งหมด 9 รายการ รวมถึงนัดตรวจโรงงาน 4 รายการ
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
  router.push({ name: "DOAStaffApplicationList" });
}

function goToApplicationDetail(id) {
  router.push({ name: "DOAStaffApplicationDetail", params: { id } });
}

const stats = [
  {
    label: "คำขอทั้งหมด",
    value: 42,
    icon: "fas fa-file-lines",
    iconColor: "primary",
  },
  { label: "รอตรวจสอบ", value: 9, icon: "fas fa-clock", iconColor: "warning" },
  {
    label: "นัดตรวจโรงงานแล้ว",
    value: 4,
    icon: "fas fa-calendar-check",
    iconColor: "info",
  },
  {
    label: "อนุมัติแล้ว",
    value: 27,
    icon: "fas fa-circle-check",
    iconColor: "success",
  },
];

const pendingApplications = [
  {
    id: "DOA-2569-00015",
    requestNo: "DOA-2569-00015",
    companyName: "บ.สยามฟู้ด จก.",
    productType: "ผลไม้กระป๋อง",
    submittedDate: "10 มี.ค. 2569",
    status: "submitted",
  },
  {
    id: "DOA-2569-00014",
    requestNo: "DOA-2569-00014",
    companyName: "บ.ไทยโปรเซส จก.",
    productType: "น้ำผลไม้",
    submittedDate: "7 มี.ค. 2569",
    status: "under_review",
  },
  {
    id: "DOA-2569-00013",
    requestNo: "DOA-2569-00013",
    companyName: "บ.เอเชียฟาร์ม จก.",
    productType: "ผักแช่แข็ง",
    submittedDate: "3 มี.ค. 2569",
    status: "inspection_scheduled",
  },
  {
    id: "DOA-2569-00012",
    requestNo: "DOA-2569-00012",
    companyName: "บ.กรีนฟู้ด จก.",
    productType: "ผลิตภัณฑ์แปรรูป",
    submittedDate: "28 ก.พ. 2569",
    status: "revision_required",
  },
];

const statusBars = [
  { label: "อนุมัติแล้ว", value: 27, pct: 64, color: "success" },
  { label: "รอตรวจสอบ", value: 9, pct: 21, color: "warning" },
  { label: "นัดตรวจโรงงานแล้ว", value: 4, pct: 10, color: "info" },
  { label: "รอแก้ไข", value: 2, pct: 5, color: "error" },
];

function statusColor(status) {
  const map = {
    draft: "grey",
    submitted: "primary",
    under_review: "info",
    inspection_scheduled: "secondary",
    approved: "success",
    rejected: "error",
    revision_required: "warning",
  };
  return map[status] ?? "grey";
}

function statusLabel(status) {
  const map = {
    draft: "แบบร่าง",
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    inspection_scheduled: "นัดตรวจแล้ว",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่ผ่าน",
    revision_required: "รอแก้ไข",
  };
  return map[status] ?? status;
}
</script>
