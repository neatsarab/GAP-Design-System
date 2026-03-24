<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด ผู้ส่งออก (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมคำขอจดทะเบียนผู้ส่งออกสินค้าพืชทั้งหมด
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
              color="export-staff"
              size="16"
            />
            <span class="text-body-1 font-weight-bold">คำขอรอดำเนินการ</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="export-staff"
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
              <v-list-item
                class="pa-3"
                @click="goToApplicationDetail(app.id)"
              >
                <template #prepend>
                  <v-avatar
                    :color="statusColor(app.status)"
                    variant="tonal"
                    size="40"
                    rounded="lg"
                    class="mr-3"
                  >
                    <v-icon icon="fas fa-ship" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  app.requestNo
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >{{ app.companyName }} ·
                  {{ app.productCategory }}</v-list-item-subtitle
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
          color="export-staff"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">
            สรุปงานที่รอดำเนินการ
          </div>
          <div class="text-body-2">
            มีคำขอรอดำเนินการทั้งหมด 11 รายการ รวมถึงรอแก้ไข 3 รายการ
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
  router.push({ name: "ExportStaffApplicationList" });
}

function goToApplicationDetail(id) {
  router.push({ name: "ExportStaffApplicationDetail", params: { id } });
}

const stats = [
  {
    label: "คำขอทั้งหมด",
    value: 56,
    icon: "fas fa-file-lines",
    iconColor: "primary",
  },
  { label: "รอตรวจสอบ", value: 11, icon: "fas fa-clock", iconColor: "warning" },
  {
    label: "อนุมัติแล้ว",
    value: 38,
    icon: "fas fa-circle-check",
    iconColor: "success",
  },
  {
    label: "ผู้ส่งออกที่ขึ้นทะเบียน",
    value: 38,
    icon: "fas fa-id-card",
    iconColor: "info",
  },
];

const pendingApplications = [
  {
    id: "EXP-2569-00020",
    requestNo: "EXP-2569-00020",
    companyName: "บ.สยาม เอ็กซ์พอร์ต จก.",
    productCategory: "ทุเรียนสด",
    submittedDate: "11 มี.ค. 2569",
    status: "submitted",
  },
  {
    id: "EXP-2569-00019",
    requestNo: "EXP-2569-00019",
    companyName: "บ.ไทยแลนด์ ฟรุ๊ต จก.",
    productCategory: "มังคุดสด",
    submittedDate: "8 มี.ค. 2569",
    status: "under_review",
  },
  {
    id: "EXP-2569-00018",
    requestNo: "EXP-2569-00018",
    companyName: "บ.เอเชียแอกโกร จก.",
    productCategory: "ผักออร์แกนิก",
    submittedDate: "4 มี.ค. 2569",
    status: "revision_required",
  },
  {
    id: "EXP-2569-00017",
    requestNo: "EXP-2569-00017",
    companyName: "บ.กรีนฟาร์ม จก.",
    productCategory: "ลำไยสด",
    submittedDate: "1 มี.ค. 2569",
    status: "under_review",
  },
];

const statusBars = [
  { label: "อนุมัติแล้ว", value: 38, pct: 68, color: "success" },
  { label: "รอตรวจสอบ", value: 11, pct: 20, color: "warning" },
  { label: "รอแก้ไข", value: 4, pct: 7, color: "error" },
  { label: "ปฏิเสธ", value: 3, pct: 5, color: "secondary" },
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
