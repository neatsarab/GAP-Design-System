<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">แดชบอร์ด</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ภาพรวมระบบการรับรองมาตรฐาน GAP
        </p>
      </div>
      <v-btn
        color="gap-user"
        prepend-icon="fas fa-plus"
        @click="goToNewApplication"
      >
        ยื่นคำขอ
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
              @click="goToApplicationList"
            >
              ดูทั้งหมด
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="pa-0">
            <template v-for="(item, i) in recentItems" :key="item.no">
              <v-list-item class="pa-3" @click="goToApplicationDetail(item.no)">
                <template #prepend>
                  <v-avatar
                    :color="statusColor(item.status)"
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
                  >ยื่นเมื่อ {{ item.submittedDate }}</v-list-item-subtitle
                >
                <template #append>
                  <div class="d-flex flex-column align-end ga-1">
                    <v-chip
                      :color="statusColor(item.status)"
                      size="x-small"
                      variant="tonal"
                      >{{ statusLabel(item.status) }}</v-chip
                    >
                    <span class="text-caption text-medium-emphasis">{{
                      item.submittedDate
                    }}</span>
                  </div>
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
            คำขอ GAP-2569-001 อยู่ระหว่างการตรวจสอบเอกสาร
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
              @click="goToAction(action.to)"
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

const statCards = [
  {
    label: "คำขอทั้งหมด",
    value: 4,
    icon: "fas fa-file-lines",
    iconColor: "gap-user",
  },
  {
    label: "อยู่ระหว่างตรวจสอบ",
    value: 1,
    icon: "fas fa-magnifying-glass",
    iconColor: "info",
  },
  {
    label: "อนุมัติแล้ว",
    value: 2,
    icon: "fas fa-circle-check",
    iconColor: "success",
  },
  {
    label: "รอแก้ไข",
    value: 1,
    icon: "fas fa-triangle-exclamation",
    iconColor: "warning",
  },
];

const recentItems = [
  {
    no: "GAP-2569-001",
    farmer: "นาย สมชาย ใจดี",
    crop: "ข้าวหอมมะลิ",
    status: "DOC_REVIEW",
    submittedDate: "15 มี.ค. 2569",
  },
  {
    no: "GAP-2569-002",
    farmer: "นาง มาลี เกษตรกิจ",
    crop: "มันสำปะหลัง",
    status: "APPROVED",
    submittedDate: "10 มี.ค. 2569",
  },
  {
    no: "GAP-2569-003",
    farmer: "นาย วิชัย ทำนา",
    crop: "อ้อย",
    status: "INSPECTING",
    submittedDate: "5 มี.ค. 2569",
  },
  {
    no: "GAP-2569-004",
    farmer: "นาง สมศรี ปลูกผัก",
    crop: "ผักกาดขาว",
    status: "SUBMITTED",
    submittedDate: "1 มี.ค. 2569",
  },
  {
    no: "GAP-2569-005",
    farmer: "นาย ประสิทธิ์ ไร่ดี",
    crop: "ข้าวโพด",
    status: "CERT_ISSUED",
    submittedDate: "20 ก.พ. 2569",
  },
];

const quickActions = [
  {
    title: "ยื่นคำขอ",
    icon: "fas fa-file-pen",
    color: "primary",
    to: "/gap/user/applications/new",
  },
  {
    title: "รายการคำขอ",
    icon: "fas fa-file-lines",
    color: "primary",
    to: "/gap/user/applications",
  },
];

function goToNewApplication() {
  router.push({ name: "ApplicationType" });
}

function goToApplicationList() {
  router.push({ name: "ApplicationList" });
}

function goToApplicationDetail(id) {
  router.push({ name: "ApplicationDetail", params: { id } });
}

function goToAction(to) {
  router.push(to);
}

function statusColor(status) {
  const map = {
    DRAFT: "grey",
    SUBMITTED: "primary",
    DOC_REVIEW: "info",
    INSPECTING: "secondary",
    APPROVED: "success",
    REJECTED: "error",
    CERT_ISSUED: "teal",
    REVISION_REQUIRED: "warning",
  };
  return map[status] ?? "grey";
}

function statusLabel(status) {
  const map = {
    DRAFT: "แบบร่าง",
    SUBMITTED: "ยื่นแล้ว",
    DOC_REVIEW: "อยู่ระหว่างตรวจสอบ",
    INSPECTING: "อยู่ระหว่างตรวจแปลง",
    APPROVED: "อนุมัติแล้ว",
    REJECTED: "ไม่ผ่าน",
    CERT_ISSUED: "ออกใบรับรองแล้ว",
    REVISION_REQUIRED: "รอแก้ไข",
  };
  return map[status] ?? status;
}
</script>
