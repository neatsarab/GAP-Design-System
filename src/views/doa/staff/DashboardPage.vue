<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">แดชบอร์ด DOA (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ภาพรวมคำขอขึ้นทะเบียนโรงงานผลิตสินค้าพืชทั้งหมด</p>
      </div>
    </div>

    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
        <v-card rounded="xl" elevation="0" class="stat-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stat-icon-box rounded-xl" :style="{ background: `rgba(var(--v-theme-${stat.color}), 0.1)` }">
                <v-icon :icon="stat.icon" :color="stat.color" size="20" />
              </div>
              <span class="text-h4 font-weight-bold">{{ stat.value }}</span>
            </div>
            <div class="text-body-2 font-weight-medium">{{ stat.label }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0" class="h-100">
          <v-card-title class="pa-5 pb-0 d-flex align-center justify-space-between">
            <span class="text-body-1 font-weight-bold">คำขอรอดำเนินการ</span>
            <v-btn variant="text" color="doa-staff" size="small" append-icon="fas fa-arrow-right" @click="router.push('/doa/staff/applications')">
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-list lines="two" class="pa-2">
            <v-list-item v-for="app in pendingApplications" :key="app.id" rounded="lg" class="mb-1" @click="router.push(`/doa/staff/applications/${app.id}`)">
              <template #prepend>
                <v-avatar :color="statusColor(app.status)" variant="tonal" size="40" rounded="lg" class="mr-3">
                  <v-icon icon="fas fa-industry" size="18" />
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ app.requestNo }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ app.companyName }} · {{ app.productType }}</v-list-item-subtitle>
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
        <v-card rounded="xl" elevation="0">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">เมนูด่วน</v-card-title>
          <v-list density="compact" nav class="px-2 pb-3">
            <v-list-item prepend-icon="fas fa-file-lines" title="รายการคำขอทั้งหมด" rounded="lg" color="doa-staff" class="mb-1" @click="router.push('/doa/staff/applications')" />
            <v-list-item prepend-icon="fas fa-calendar-check" title="นัดตรวจโรงงาน" rounded="lg" color="doa-staff" @click="router.push('/doa/staff/schedule')" />
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
  { label: "คำขอทั้งหมด", value: 42, icon: "fas fa-file-lines", color: "doa-staff" },
  { label: "รอตรวจสอบ", value: 9, icon: "fas fa-clock", color: "warning" },
  { label: "นัดตรวจโรงงานแล้ว", value: 4, icon: "fas fa-calendar-check", color: "info" },
  { label: "อนุมัติแล้ว", value: 27, icon: "fas fa-circle-check", color: "success" },
];

const pendingApplications = [
  { id: "DOA-2568-00015", requestNo: "DOA-2568-00015", companyName: "บ.สยามฟู้ด จก.", productType: "ผลไม้กระป๋อง", submittedDate: "10 มี.ค. 2568", status: "submitted" },
  { id: "DOA-2568-00014", requestNo: "DOA-2568-00014", companyName: "บ.ไทยโปรเซส จก.", productType: "น้ำผลไม้", submittedDate: "7 มี.ค. 2568", status: "under_review" },
  { id: "DOA-2568-00013", requestNo: "DOA-2568-00013", companyName: "บ.เอเชียฟาร์ม จก.", productType: "ผักแช่แข็ง", submittedDate: "3 มี.ค. 2568", status: "inspection_scheduled" },
  { id: "DOA-2568-00012", requestNo: "DOA-2568-00012", companyName: "บ.กรีนฟู้ด จก.", productType: "ผลิตภัณฑ์แปรรูป", submittedDate: "28 ก.พ. 2568", status: "revision_required" },
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

<style scoped>
.stat-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.stat-icon-box { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
</style>
