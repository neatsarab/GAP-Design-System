<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด GAP เกษตรกร</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices)
        </p>
      </div>
      <v-btn
        color="gap-user"
        prepend-icon="fas fa-file-pen"
        @click="router.push('/gap/user/applications/new')"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <v-row class="mb-6">
      <v-col
        v-for="stat in statCards"
        :key="stat.label"
        cols="12"
        sm="6"
        md="3"
      >
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
              color="gap-user"
              size="16"
            />
            <span class="text-body-1 font-weight-bold">คำขอล่าสุด</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="gap-user"
              size="small"
              append-icon="fas fa-arrow-right"
              @click="router.push('/gap/user/applications')"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(item, i) in recentItems" :key="item.no">
              <v-list-item
                class="pa-3"
                @click="router.push(`/gap/user/applications/${item.no}`)"
              >
                <template #prepend>
                  <v-avatar
                    color="gap-user"
                    variant="tonal"
                    size="40"
                    rounded="lg"
                    class="mr-3"
                  >
                    <v-icon icon="fas fa-seedling" size="18" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{
                  item.no
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >{{ item.farmer }} · {{ item.crop }}</v-list-item-subtitle
                >
                <template #append>
                  <AppStatusChip :status="item.status" size="x-small" />
                </template>
              </v-list-item>
              <v-divider v-if="i < recentItems.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Info Alert + Quick Actions -->
      <v-col cols="12" md="4">
        <v-alert
          color="gap-user"
          variant="tonal"
          rounded="xl"
          class="mb-4"
          prepend-icon="fas fa-circle-info"
        >
          <div class="text-body-2 font-weight-medium mb-1">อัพเดทสถานะ</div>
          <div class="text-body-2">
            คำขอ GAP-2567-001 อยู่ระหว่างการตรวจสอบเอกสาร
          </div>
        </v-alert>
        <v-card rounded="xl" elevation="0">
          <v-card-title class="d-flex align-center ga-2 pa-4 pb-3">
            <v-icon icon="fas fa-bolt" color="gap-user" size="16" />
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
import AppStatusChip from "@/components/common/AppStatusChip.vue";
import type { GapStatus } from "@/types/gap-status.types";

const router = useRouter();

const statCards = [
  {
    label: "คำขอทั้งหมด",
    value: 128,
    icon: "fas fa-copy",
    iconColor: "gap-user",
  },
  {
    label: "รอดำเนินการ",
    value: 34,
    icon: "fas fa-clock",
    iconColor: "warning",
  },
  {
    label: "ผ่านการรับรอง",
    value: 82,
    icon: "fas fa-circle-check",
    iconColor: "success",
  },
  {
    label: "ใบรับรองที่ใช้งานอยู่",
    value: 76,
    icon: "fas fa-certificate",
    iconColor: "info",
  },
];

const recentItems: {
  no: string;
  farmer: string;
  crop: string;
  status: GapStatus;
}[] = [
  {
    no: "GAP-2567-001",
    farmer: "นาย สมชาย ใจดี",
    crop: "ข้าวหอมมะลิ",
    status: "DOC_REVIEW",
  },
  {
    no: "GAP-2567-002",
    farmer: "นาง มาลี เกษตรกิจ",
    crop: "มันสำปะหลัง",
    status: "APPROVED",
  },
  {
    no: "GAP-2567-003",
    farmer: "นาย วิชัย ทำนา",
    crop: "อ้อย",
    status: "INSPECTING",
  },
  {
    no: "GAP-2567-004",
    farmer: "นาง สมศรี ปลูกผัก",
    crop: "ผักกาดขาว",
    status: "SUBMITTED",
  },
  {
    no: "GAP-2567-005",
    farmer: "นาย ประสิทธิ์ ไร่ดี",
    crop: "ข้าวโพด",
    status: "CERT_ISSUED",
  },
];

const quickActions = [
  {
    title: "ยื่นคำขอใหม่",
    icon: "fas fa-file-pen",
    color: "gap-user",
    to: "/gap/user/applications/new",
  },
  {
    title: "รายการคำขอ",
    icon: "fas fa-file-lines",
    color: "gap-user",
    to: "/gap/user/applications",
  },
];
</script>
