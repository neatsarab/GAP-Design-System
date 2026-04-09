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
      <v-col v-for="type in appTypes" :key="type.route" cols="12">
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
                <v-btn icon variant="flat" color="doa-user" size="small" class="node-dot">
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
  router.push({ name: "DOAUserApplicationList" });
}

function goToAppType(route) {
  router.push(route);
}

const appTypes = [
  {
    route: "/doa/user/applications/new/register",
    title: "คำขอขึ้น / ต่ออายุทะเบียน",
    badge: null,
    icon: "fas fa-industry",
    color: "primary",
    description:
      "สำหรับผู้ประกอบการที่ต้องการขึ้นทะเบียนโรงงานผลิตสินค้าพืชใหม่ หรือต่ออายุการขึ้นทะเบียนที่หมดอายุแล้ว",
    features: [
      "ขึ้นทะเบียนโรงงานผลิตสินค้าพืชครั้งแรก",
      "ต่ออายุการขึ้นทะเบียนเดิม",
      "ระบุมาตรฐานที่ได้รับรอง (GMP/HACCP)",
    ],
  },
  {
    route: "/doa/user/applications/new/scope",
    title: "คำขอเพิ่ม-ลดขอบข่าย",
    badge: null,
    icon: "fas fa-sliders",
    color: "info",
    description:
      "สำหรับผู้ประกอบการที่ต้องการเพิ่มหรือลดขอบข่ายมาตรฐานในทะเบียนโรงงานที่ได้รับรองแล้ว",
    features: [
      "เพิ่มมาตรฐาน มกษ. ใหม่",
      "ลดมาตรฐาน มกษ. ที่มีอยู่",
      "อัปเดตขอบข่ายผลิตภัณฑ์",
    ],
  },
  {
    route: "/doa/user/applications/new/amendment",
    title: "คำขอแก้ไขใบทะเบียน",
    badge: null,
    icon: "fas fa-file-pen",
    color: "warning",
    description:
      "สำหรับผู้ประกอบการที่ต้องการแก้ไขข้อมูลทะเบียนโรงงานที่ได้รับรองแล้ว เช่น ที่อยู่ ประเภทผลิตภัณฑ์ หรือมาตรฐาน",
    features: [
      "แก้ไขข้อมูลสถานประกอบการ",
      "เพิ่ม / ลดขอบข่ายมาตรฐาน",
      "อัปเดตเอกสารประกอบ",
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-doa-user), 0.12) !important;
}
</style>
