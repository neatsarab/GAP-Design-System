<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">แดชบอร์ด EL โรงคัดบรรจุ</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        ภาพรวมงานตรวจประเมินโรงคัดบรรจุ (Establishment List)
      </p>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col
        v-for="stat in stats"
        :key="stat.label"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card rounded="xl" elevation="0" class="stat-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div
                class="stat-icon-box rounded-xl"
                :style="{ background: `rgba(var(--v-theme-${stat.color}), 0.1)` }"
              >
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
      <!-- Recent Applications Table -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0" class="section-card">
          <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between">
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-btn
              variant="text"
              color="el-staff"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="router.push('/el/staff/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="recentApplications"
            hide-default-footer
            density="compact"
            hover
            @click:row="(_, { item }) => router.push(`/el/staff/applications/${item.id}`)"
          >
            <template #item.status="{ item }">
              <v-chip :color="statusColor(item.status)" size="x-small" variant="tonal">
                {{ statusLabel(item.status) }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Work Queue + Quick Actions -->
      <v-col cols="12" md="4">
        <!-- Work Queue -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
            คิวงานที่รอดำเนินการ
          </v-card-title>
          <v-divider />
          <v-list density="compact" class="pa-2">
            <v-list-item
              v-for="task in workQueue"
              :key="task.label"
              rounded="lg"
              class="mb-1"
            >
              <template #prepend>
                <v-avatar :color="task.color" variant="tonal" size="32" rounded="lg" class="mr-3">
                  <v-icon :icon="task.icon" size="14" />
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2">{{ task.label }}</v-list-item-title>
              <template #append>
                <v-chip :color="task.color" size="x-small" variant="tonal">
                  {{ task.count }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Quick Actions -->
        <v-card rounded="xl" elevation="0" class="section-card">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
            เมนูด่วน
          </v-card-title>
          <v-list density="compact" nav class="px-2 pb-3">
            <v-list-item
              prepend-icon="fas fa-file-lines"
              title="ดูรายการคำขอ"
              rounded="lg"
              color="el-staff"
              class="mb-1"
              @click="router.push('/el/staff/applications')"
            />
            <v-list-item
              prepend-icon="fas fa-warehouse"
              title="ทะเบียนโรงคัดบรรจุ"
              rounded="lg"
              color="el-staff"
              @click="router.push('/el/staff/registry')"
            />
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
  { label: "รายการรอตรวจสอบ", value: 7, icon: "fas fa-file-lines", color: "warning" },
  { label: "นัดตรวจแล้ว", value: 3, icon: "fas fa-calendar-check", color: "el-staff" },
  { label: "รอ กตม. พิจารณา", value: 2, icon: "fas fa-users-gear", color: "secondary" },
  { label: "ขึ้นทะเบียนแล้ว", value: 45, icon: "fas fa-warehouse", color: "success" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo" },
  { title: "โรงคัดบรรจุ", key: "establishmentName" },
  { title: "ชนิดพืช", key: "cropType" },
  { title: "วันที่ยื่น", key: "submittedDate" },
  { title: "สถานะ", key: "status" },
];

const recentApplications = [
  { id: "EL-2568-00005", requestNo: "EL-2568-00005", establishmentName: "บ.สยามฟาร์ม จก.", cropType: "ทุเรียน", submittedDate: "11 มี.ค. 2568", status: "submitted" },
  { id: "EL-2568-00004", requestNo: "EL-2568-00004", establishmentName: "บ.อีสานโปรดิ๊วซ จก.", cropType: "มังคุด", submittedDate: "09 มี.ค. 2568", status: "under_review" },
  { id: "EL-2568-00003", requestNo: "EL-2568-00003", establishmentName: "บ.เชียงใหม่ฟรุ๊ต จก.", cropType: "ลำไย", submittedDate: "07 มี.ค. 2568", status: "inspection_scheduled" },
  { id: "EL-2568-00002", requestNo: "EL-2568-00002", establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.", cropType: "ทุเรียน", submittedDate: "10 ก.พ. 2568", status: "under_review" },
  { id: "EL-2568-00001", requestNo: "EL-2568-00001", establishmentName: "บ.กรีนฟาร์ม จก.", cropType: "ลิ้นจี่", submittedDate: "05 ก.พ. 2568", status: "approved" },
];

const workQueue = [
  { label: "รอตรวจสอบเอกสาร", count: 7, icon: "fas fa-file-circle-check", color: "warning" },
  { label: "รอนัดตรวจแปลง", count: 3, icon: "fas fa-calendar", color: "el-staff" },
  { label: "รอบันทึกผลตรวจ", count: 2, icon: "fas fa-clipboard-check", color: "secondary" },
  { label: "รอส่งคณะกรรมการ", count: 1, icon: "fas fa-paper-plane", color: "el-staff" },
];

function statusColor(status: string): string {
  const map: Record<string, string> = {
    submitted: "primary",
    under_review: "info",
    inspection_scheduled: "secondary",
    approved: "success",
    rejected: "error",
    revision_required: "warning",
  };
  return map[status] ?? "grey";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
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

<style scoped>
.stat-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.stat-icon-box {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
