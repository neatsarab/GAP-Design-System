<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด EL (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ภาพรวมงานตรวจประเมินโรงคัดบรรจุ (Establishment List)</p>
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
            <v-icon icon="fas fa-clock-rotate-left" color="el-staff" size="16" />
            <span class="text-body-1 font-weight-bold">คำขอรอดำเนินการ</span>
            <v-spacer />
            <v-btn variant="text" color="el-staff" size="small" append-icon="fas fa-arrow-right" @click="router.push('/el/staff/applications')">
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in recentApplications" :key="app.id">
              <v-list-item class="pa-3" @click="router.push(`/el/staff/applications/${app.id}`)">
                <template #prepend>
                  <v-avatar :color="statusColor(app.status)" variant="tonal" size="40" rounded="lg" class="mr-3">
                    <v-icon icon="fas fa-warehouse" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ app.requestNo }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ app.establishmentName }} · {{ app.cropType }}</v-list-item-subtitle>
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
        <v-alert color="el-staff" variant="tonal" rounded="xl" class="mb-4" prepend-icon="fas fa-circle-info">
          <div class="text-body-2 font-weight-medium mb-1">สรุปงานที่รอดำเนินการ</div>
          <div class="text-body-2">มีงานรอดำเนินการ 13 รายการ รวมถึงรอตรวจสอบเอกสาร 7 รายการ</div>
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
                <span class="text-caption font-weight-bold">{{ bar.value }} ({{ bar.pct }}%)</span>
              </div>
              <v-progress-linear :model-value="bar.pct" :color="bar.color" height="6" rounded />
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

const stats = [
  { label: "รายการรอตรวจสอบ", value: 7, icon: "fas fa-file-lines", iconColor: "warning" },
  { label: "นัดตรวจแล้ว", value: 3, icon: "fas fa-calendar-check", iconColor: "primary" },
  { label: "รอ กตม. พิจารณา", value: 2, icon: "fas fa-users-gear", iconColor: "secondary" },
  { label: "ขึ้นทะเบียนแล้ว", value: 45, icon: "fas fa-warehouse", iconColor: "success" },
];

const recentApplications = [
  { id: "EL-2568-00005", requestNo: "EL-2568-00005", establishmentName: "บ.สยามฟาร์ม จก.", cropType: "ทุเรียน", submittedDate: "11 มี.ค. 2568", status: "submitted" },
  { id: "EL-2568-00004", requestNo: "EL-2568-00004", establishmentName: "บ.อีสานโปรดิ๊วซ จก.", cropType: "มังคุด", submittedDate: "9 มี.ค. 2568", status: "under_review" },
  { id: "EL-2568-00003", requestNo: "EL-2568-00003", establishmentName: "บ.เชียงใหม่ฟรุ๊ต จก.", cropType: "ลำไย", submittedDate: "7 มี.ค. 2568", status: "inspection_scheduled" },
  { id: "EL-2568-00002", requestNo: "EL-2568-00002", establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.", cropType: "ทุเรียน", submittedDate: "10 ก.พ. 2568", status: "under_review" },
  { id: "EL-2568-00001", requestNo: "EL-2568-00001", establishmentName: "บ.กรีนฟาร์ม จก.", cropType: "ลิ้นจี่", submittedDate: "5 ก.พ. 2568", status: "approved" },
];

const statusBars = [
  { label: "ขึ้นทะเบียนแล้ว", value: 45, pct: 79, color: "success" },
  { label: "รอตรวจสอบเอกสาร", value: 7, pct: 12, color: "warning" },
  { label: "นัดตรวจแล้ว", value: 3, pct: 5, color: "primary" },
  { label: "รอ กตม. พิจารณา", value: 2, pct: 4, color: "secondary" },
];

function statusColor(status) {
  const map = {
    draft: "grey", submitted: "primary", under_review: "info",
    inspection_scheduled: "secondary", approved: "success",
    rejected: "error", revision_required: "warning",
  };
  return map[status] ?? "grey";
}

function statusLabel(status) {
  const map = {
    draft: "แบบร่าง", submitted: "ยื่นแล้ว", under_review: "อยู่ระหว่างตรวจสอบ",
    inspection_scheduled: "นัดตรวจแล้ว", approved: "อนุมัติแล้ว",
    rejected: "ไม่ผ่าน", revision_required: "รอแก้ไข",
  };
  return map[status] ?? status;
}
</script>
