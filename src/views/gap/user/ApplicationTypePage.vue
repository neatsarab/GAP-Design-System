<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/gap/user/applications')"
      />
      <div>
        <h1 class="page-title mb-0">
          ยื่นคำขอรับรองแหล่งผลิต GAP
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอที่ต้องการยื่น
        </p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row justify="center">
      <v-col v-for="type in appTypes" :key="type.route" cols="12" md="4">
        <v-card
          class="type-card h-100"
          hover
          :ripple="false"
          :disabled="type.disabled"
          @click="!type.disabled && router.push(type.route)"
        >
          <v-card-text class="pa-7 d-flex flex-column align-center text-center">
            <!-- Icon -->
            <div
              class="type-icon-box mb-5"
              :style="
                type.disabled
                  ? 'background:rgba(var(--v-border-color),0.08)'
                  : `background:rgba(var(--v-theme-${type.color}),0.1)`
              "
            >
              <v-icon
                :icon="type.icon"
                :color="type.disabled ? 'medium-emphasis' : type.color"
                size="40"
              />
            </div>

            <!-- Title & Badge -->
            <div class="d-flex align-center ga-2 mb-2">
              <h2 class="text-h6 font-weight-bold">{{ type.title }}</h2>
              <v-chip
                v-if="type.badge"
                size="x-small"
                :color="type.disabled ? 'grey' : type.color"
                variant="tonal"
                >{{ type.badge }}</v-chip
              >
            </div>

            <p class="text-body-2 text-medium-emphasis mb-5">
              {{ type.description }}
            </p>

            <!-- Features list -->
            <v-list
              density="compact"
              class="w-100 text-left mb-5 bg-transparent pa-0"
            >
              <v-list-item
                v-for="f in type.features"
                :key="f"
                prepend-icon="fas fa-circle-check"
                :title="f"
                :base-color="type.disabled ? 'grey' : type.color"
                class="px-0"
                density="compact"
              />
            </v-list>

            <v-btn
              :color="type.disabled ? 'grey' : type.color"
              :disabled="type.disabled"
              block
              rounded="lg"
              append-icon="fas fa-arrow-right"
            >
              {{
                type.disabled
                  ? sessionStore.isGroupMode
                    ? "ใช้ได้เฉพาะโหมดเดี่ยว"
                    : "ต้องเข้าโหมดกลุ่มก่อน"
                  : "เลือกประเภทนี้"
              }}
            </v-btn>
          </v-card-text>
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

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const sessionStore = useSessionStore();

const appTypes = computed(() => [
  {
    route: "/gap/user/applications/new/individual",
    title: "คำขอรายเดี่ยว",
    badge: "ทั่วไป",
    icon: "fas fa-user",
    color: "gap-user",
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
    route: "/gap/user/applications/new/group/new",
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
.type-icon-box {
  width: 88px;
  height: 88px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
