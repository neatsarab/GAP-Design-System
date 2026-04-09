<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">การยื่นคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอใบรับรองมาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืช
          (GAP)
        </p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row>
      <v-col v-for="type in appTypes" :key="type.route" cols="12">
        <v-card
          class="type-card"
          hover
          elevation="0"
          rounded="xl"
          :disabled="type.disabled"
          @click="!type.disabled && goToAppType(type.route)"
        >
          <div class="d-flex align-center pa-6">
            <!-- Icon Box -->
            <div class="icon-box mr-6">
              <v-icon
                :icon="type.icon"
                :color="type.disabled ? 'medium-emphasis' : type.color"
                size="28"
              />
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <h2 class="text-h6 font-weight-bold mb-1">{{ type.title }}</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ type.description }}</p>
            </div>

            <!-- Action -->
            <div class="d-flex align-center">
              <div class="node-line-container">
                <div class="vertical-line"></div>
                <v-btn icon variant="flat" color="gap-user" size="small" class="node-dot" :disabled="type.disabled">
                  <v-icon icon="fas fa-arrow-right" size="14" color="white" />
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Info Alert -->
    <v-alert
      type="info"
      variant="tonal"
      class="mt-6"
      prepend-icon="fas fa-circle-info"
    >
      <strong>หมายเหตุ:</strong> ใบคำขอทุกประเภทต้องใช้เอกสารสำเนาโฉนดที่ดิน
      และผลวิเคราะห์คุณภาพน้ำ สามารถศึกษาคู่มือการยื่นคำขอได้ที่
      <v-btn variant="text" size="x-small" color="info" class="pa-0 ml-1"
        >ดาวน์โหลดคู่มือ</v-btn
      >
    </v-alert>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const sessionStore = useSessionStore();

function goToApplicationList() {
  router.push({ name: "ApplicationList" });
}

function goToAppType(route) {
  router.push(route);
}

const appTypes = computed(() => [
  {
    route: "/gap/user/applications/new/individual",
    title: "คำขอรายเดี่ยว",
    badge: "ทั่วไป",
    icon: "fas fa-user",
    color: "primary",
    disabled: sessionStore.isGroupMode,
    description:
      "สำหรับเกษตรกรรายบุคคลที่ต้องการขอรับรองแหล่งผลิต GAP สำหรับแปลงของตนเอง",
    features: [
      "เกษตรกรยื่นคำขอเอง",
      "ตรวจสอบแปลงปลูกรายคน",
      "ได้รับใบรับรองรายบุคคล",
    ],
  },
  {
    route: "/gap/user/applications/new/group",
    title: "คำขอรายกลุ่ม",
    badge: "กลุ่มเกษตรกร",
    icon: "fas fa-users",
    color: "info",
    disabled: !sessionStore.isGroupMode,
    description:
      "สำหรับกลุ่มเกษตรกร วิสาหกิจชุมชน หรือสหกรณ์ที่ต้องการยื่นคำขอพร้อมกัน",
    features: [
      "ผู้แทนกลุ่มยื่นแทนสมาชิก",
      "ตรวจสอบแปลงทุกสมาชิกพร้อมกัน",
      "ลดต้นทุนและระยะเวลาการตรวจ",
    ],
  },
  {
    route: "/gap/user/applications/new/amendment",
    title: "ขอแก้ไข / ยกเลิกใบรับรอง",
    badge: null,
    icon: "fas fa-file-pen",
    color: "warning",
    disabled: sessionStore.isGroupMode,
    description:
      "สำหรับผู้ที่ต้องการแก้ไขข้อมูลในใบรับรองที่ออกแล้ว หรือขอยกเลิกใบรับรอง",
    features: [
      "แก้ไขข้อมูลใบรับรองเดิม",
      "ยกเลิกใบรับรองก่อนหมดอายุ",
      "ระบุเหตุผลและแนบเอกสาร",
    ],
  },
]);
</script>

<style scoped>
.type-card {
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 20px !important;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.type-card:hover:not(.v-card--disabled) {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(var(--v-theme-gap-user), 0.1) !important;
}
</style>
