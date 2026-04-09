<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">การยื่นคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอที่ต้องการดำเนินการ
        </p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row>
      <v-col v-for="type in appTypes" :key="type.key" cols="12">
        <v-card class="type-card" hover elevation="0" rounded="xl" @click="goToAppType(type.route)">
          <div class="d-flex align-center pa-6">
            <!-- Icon Box -->
            <div class="icon-box mr-6">
              <v-icon :icon="type.icon" :color="type.color" size="28" />
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
                <v-btn icon variant="flat" color="cb-user" size="small" class="node-dot">
                  <v-icon icon="fas fa-arrow-right" size="14" color="white" />
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "CBUserApplicationList" });
}

function goToAppType(route) {
  router.push(route);
}

const appTypes = [
  {
    key: "register",
    route: "/cb/user/applications/new/register",
    title: "คำขอขึ้น / ต่ออายุทะเบียน",
    badge: null,
    icon: "fas fa-file-circle-plus",
    color: "primary",
    description:
      "สำหรับผู้ประกอบการที่ต้องการยื่นขอขึ้นทะเบียนใหม่ เพื่อให้สามารถดำเนินการตามข้อกำหนดของกรมวิชาการเกษตรได้",
    features: [
      "ขึ้นทะเบียนหน่วยรับรองใหม่",
      "ต่ออายุทะเบียนหน่วยรับรอง",
      "กำหนดขอบข่ายมาตรฐาน",
    ],
  },
  {
    key: "scope",
    route: "/cb/user/applications/new/scope",
    title: "คำขอเพิ่ม-ลด ขอบข่าย",
    badge: null,
    icon: "fas fa-arrows-left-right",
    color: "info",
    description:
      "สำหรับหน่วยรับรองที่ต้องการเพิ่มหรือลดขอบข่ายการรับรอง เช่น เพิ่มมาตรฐาน หรือเปลี่ยนประเภทสถานประกอบการที่รับรอง",
    features: [
      "เพิ่ม / ลดมาตรฐาน",
      "เปลี่ยนประเภทสถานประกอบการ",
      "ต้องมีทะเบียนเดิม",
    ],
  },
  {
    key: "amend",
    route: "/cb/user/applications/new/amend",
    title: "คำขอแก้ไขใบทะเบียน",
    badge: null,
    icon: "fas fa-file-pen",
    color: "warning",
    description:
      "สำหรับหน่วยรับรองที่ต้องการแก้ไขข้อมูลในทะเบียน เช่น เปลี่ยนแปลงผู้บริหาร ที่อยู่สำนักงาน หรือข้อมูลสำคัญอื่น ๆ",
    features: [
      "แก้ไขข้อมูลหน่วยรับรอง",
      "เปลี่ยนแปลงที่ตั้ง",
      "ต้องมีทะเบียนเดิม",
    ],
  },
  {
    key: "cancel",
    route: "/cb/user/applications/new/cancel",
    title: "คำขอยกเลิกใบทะเบียน",
    badge: null,
    icon: "fas fa-file-circle-xmark",
    color: "error",
    description:
      "สำหรับหน่วยรับรองที่ต้องการยกเลิกการขึ้นทะเบียนกับกรมวิชาการเกษตรและหยุดให้บริการตรวจรับรองโรงงานผลิตสินค้าพืช",
    features: [
      "ยกเลิกใบทะเบียนหน่วยรับรอง",
      "หยุดให้บริการตรวจรับรอง",
      "ต้องมีทะเบียนเดิม",
    ],
  },
];
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-cb-user), 0.12) !important;
}
</style>
