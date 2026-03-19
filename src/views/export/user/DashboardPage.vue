<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด จดทะเบียนผู้ส่งออก</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ภาพรวมคำขอจดทะเบียนผู้ส่งออกสินค้าพืชของคุณ</p>
      </div>
      <v-btn color="export-user" prepend-icon="fas fa-file-pen" rounded="lg" @click="router.push('/export/user/applications/new')">
        จดทะเบียนใหม่
      </v-btn>
    </div>

    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
        <v-card rounded="xl" elevation="0" class="stat-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stat-icon-box rounded-xl" :style="{ background: `rgba(var(--v-theme-${stat.color}), 0.1)` }">
                <v-icon :icon="stat.icon" :color="stat.color" size="20" />
              </div>
              <span class="stat-num">{{ stat.value }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0" class="h-100">
          <v-card-title class="pa-5 pb-0 d-flex align-center justify-space-between">
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-btn variant="text" color="export-user" size="small" append-icon="fas fa-arrow-right" @click="router.push('/export/user/applications')">
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-list lines="two" class="pa-2">
            <v-list-item v-for="app in recentApplications" :key="app.id" rounded="lg" class="mb-1" @click="router.push(`/export/user/applications/${app.id}`)">
              <template #prepend>
                <v-avatar :color="statusColor(app.status)" variant="tonal" size="40" rounded="lg" class="mr-3">
                  <v-icon icon="fas fa-ship" size="18" />
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ app.requestNo }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ app.companyName }} · {{ app.productCategory }}</v-list-item-subtitle>
              <template #append>
                <div class="d-flex flex-column align-end ga-1">
                  <v-chip :color="statusColor(app.status)" size="x-small" variant="tonal">{{ statusLabel(app.status) }}</v-chip>
                  <span class="text-caption text-medium-emphasis">{{ app.submittedDate }}</span>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-alert color="export-user" variant="tonal" rounded="xl" class="mb-4" prepend-icon="fas fa-circle-info">
          <div class="text-body-2 font-weight-medium mb-1">อัพเดทสถานะ</div>
          <div class="text-body-2">คำขอ EXP-2568-00001 ได้รับการอนุมัติแล้ว</div>
        </v-alert>
        <v-card rounded="xl" elevation="0">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">เมนูด่วน</v-card-title>
          <v-list density="compact" nav class="px-2 pb-3">
            <v-list-item prepend-icon="fas fa-file-pen" title="จดทะเบียนผู้ส่งออกใหม่" rounded="lg" color="export-user" class="mb-1" @click="router.push('/export/user/applications/new')" />
            <v-list-item prepend-icon="fas fa-file-lines" title="รายการคำขอ" rounded="lg" color="export-user" @click="router.push('/export/user/applications')" />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const stats = [
  { label: "คำขอทั้งหมด", value: 3, icon: "fas fa-file-lines", color: "export-user" },
  { label: "อยู่ระหว่างตรวจสอบ", value: 1, icon: "fas fa-magnifying-glass", color: "export-user" },
  { label: "อนุมัติแล้ว", value: 2, icon: "fas fa-circle-check", color: "success" },
  { label: "ใบอนุญาตที่ยังมีผล", value: 2, icon: "fas fa-id-card", color: "info" },
];

const recentApplications = [
  { id: "EXP-2568-00003", requestNo: "EXP-2568-00003", companyName: "บ.ไทย เอ็กซ์พอร์ต จก.", productCategory: "ผลไม้สด", submittedDate: "8 มี.ค. 2568", status: "under_review" },
  { id: "EXP-2568-00002", requestNo: "EXP-2568-00002", companyName: "บ.ไทย เอ็กซ์พอร์ต จก.", productCategory: "ผักสด", submittedDate: "1 ก.พ. 2568", status: "approved" },
  { id: "EXP-2568-00001", requestNo: "EXP-2568-00001", companyName: "บ.ไทย เอ็กซ์พอร์ต จก.", productCategory: "ผลไม้แปรรูป", submittedDate: "10 ม.ค. 2568", status: "approved" },
];

function statusColor(status: string): string {
  const map: Record<string, string> = {
    draft: "grey", submitted: "primary", under_review: "info",
    inspection_scheduled: "secondary", approved: "success",
    rejected: "error", revision_required: "warning",
  };
  return map[status] ?? "grey";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "แบบร่าง", submitted: "ยื่นแล้ว", under_review: "อยู่ระหว่างตรวจสอบ",
    inspection_scheduled: "นัดตรวจแล้ว", approved: "อนุมัติแล้ว",
    rejected: "ไม่ผ่าน", revision_required: "รอแก้ไข",
  };
  return map[status] ?? status;
}
</script>
