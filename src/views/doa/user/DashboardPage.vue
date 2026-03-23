<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด DOA โรงงานผลิตสินค้าพืช</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ภาพรวมคำขอขึ้นทะเบียนโรงงานของคุณ</p>
      </div>
      <v-btn color="doa-user" prepend-icon="fas fa-file-pen" @click="router.push('/doa/user/applications/new')">
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
            <v-icon icon="fas fa-clock-rotate-left" color="doa-user" size="16" />
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-spacer />
            <v-btn variant="text" color="doa-user" size="small" append-icon="fas fa-arrow-right" @click="router.push('/doa/user/applications')">
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in recentApplications" :key="app.id">
              <v-list-item class="pa-3" @click="router.push(`/doa/user/applications/${app.id}`)">
                <template #prepend>
                  <v-avatar :color="statusColor(app.status)" variant="tonal" size="40" rounded="lg" class="mr-3">
                    <v-icon icon="fas fa-industry" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ app.requestNo }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ app.factoryName }} · {{ app.productType }}</v-list-item-subtitle>
                <template #append>
                  <div class="d-flex flex-column align-end ga-1">
                    <v-chip :color="statusColor(app.status)" size="x-small" variant="tonal">{{ statusLabel(app.status) }}</v-chip>
                    <span class="text-caption text-medium-emphasis">{{ app.submittedDate }}</span>
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
        <v-alert color="doa-user" variant="tonal" rounded="xl" class="mb-4" prepend-icon="fas fa-circle-info">
          <div class="text-body-2 font-weight-medium mb-1">อัพเดทสถานะ</div>
          <div class="text-body-2">คำขอ DOA-2568-00001 อยู่ระหว่างการตรวจสอบเอกสาร</div>
        </v-alert>
        <v-card rounded="xl" elevation="0">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-bolt" color="doa-user" size="16" />
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
  { label: "คำขอทั้งหมด", value: 2, icon: "fas fa-file-lines", iconColor: "primary" },
  { label: "อยู่ระหว่างตรวจสอบ", value: 1, icon: "fas fa-magnifying-glass", iconColor: "info" },
  { label: "อนุมัติแล้ว", value: 1, icon: "fas fa-circle-check", iconColor: "success" },
  { label: "โรงงานที่ขึ้นทะเบียน", value: 1, icon: "fas fa-industry", iconColor: "primary" },
];

const recentApplications = [
  { id: "DOA-2568-00002", requestNo: "DOA-2568-00002", factoryName: "บ.ไทยแลนด์ โปรดักส์ จก.", productType: "ผลไม้แปรรูป", submittedDate: "1 มี.ค. 2568", status: "under_review" },
  { id: "DOA-2568-00001", requestNo: "DOA-2568-00001", factoryName: "บ.ไทยแลนด์ โปรดักส์ จก.", productType: "ผักแปรรูป", submittedDate: "15 ม.ค. 2568", status: "approved" },
];

const quickActions = [
  { title: "ยื่นคำขอ DOA ใหม่", icon: "fas fa-file-pen", color: "primary", to: "/doa/user/applications/new" },
  { title: "รายการคำขอ", icon: "fas fa-file-lines", color: "primary", to: "/doa/user/applications" },
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
