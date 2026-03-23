<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบขึ้นทะเบียนหน่วยรับรอง (Certification Body)
        </p>
      </div>
      <v-btn
        color="cb-user"
        prepend-icon="fas fa-file-pen"
        @click="router.push('/cb/user/applications/new')"
      >
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
            <v-icon icon="fas fa-clock-rotate-left" color="cb-user" size="16" />
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="cb-user"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="router.push('/cb/user/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(app, i) in recentApplications" :key="app.id">
              <v-list-item
                class="pa-3"
                @click="router.push(`/cb/user/applications/${app.id}`)"
              >
                <template #prepend>
                  <v-avatar
                    :color="statusColor(app.status)"
                    variant="tonal"
                    size="40"
                    rounded="lg"
                    class="mr-3"
                  >
                    <v-icon icon="fas fa-certificate" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  app.requestNo
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >ยื่นเมื่อ {{ app.submittedDate }}</v-list-item-subtitle
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
              <v-divider v-if="i < recentApplications.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Info Alert + Quick Actions -->
      <v-col cols="12" md="4">
        <v-alert
          color="cb-user"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">อัพเดทสถานะ</div>
          <div class="text-body-2">
            คำขอ CB-2568-00002 อยู่ระหว่างการตรวจประเมิน CB
          </div>
        </v-alert>
        <v-card rounded="xl" elevation="0">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-bolt" color="cb-user" size="16" />
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

<script setup>
import { useRouter } from "vue-router";
import AppStatCard from "@/components/common/AppStatCard.vue";

const router = useRouter();

const stats = [
  { label: "คำขอทั้งหมด", value: 4, icon: "fas fa-file-lines", iconColor: "cb-user" },
  { label: "อยู่ระหว่างตรวจสอบ", value: 1, icon: "fas fa-magnifying-glass", iconColor: "info" },
  { label: "อนุมัติแล้ว", value: 2, icon: "fas fa-circle-check", iconColor: "success" },
  { label: "รอแก้ไข", value: 1, icon: "fas fa-triangle-exclamation", iconColor: "warning" },
];

const recentApplications = [
  { id: "CB-2568-00003", requestNo: "CB-2568-00003", submittedDate: "5 มี.ค. 2568", status: "under_review" },
  { id: "CB-2568-00002", requestNo: "CB-2568-00002", submittedDate: "20 ก.พ. 2568", status: "inspection_scheduled" },
  { id: "CB-2568-00001", requestNo: "CB-2568-00001", submittedDate: "10 ม.ค. 2568", status: "approved" },
];

const quickActions = [
  { title: "ยื่นคำขอใหม่", icon: "fas fa-file-pen", color: "primary", to: "/cb/user/applications/new" },
  { title: "รายการคำขอ", icon: "fas fa-file-lines", color: "primary", to: "/cb/user/applications" },
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
