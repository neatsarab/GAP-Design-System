<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.push('/cb/user/applications')" />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอขึ้นทะเบียนหน่วยรับรอง CB</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">เลือกประเภทคำขอที่ต้องการยื่น</p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row>
      <v-col v-for="type in appTypes" :key="type.route" cols="12" sm="6">
        <v-card class="type-card h-100" hover :ripple="false" @click="router.push(type.route)">
          <v-card-text class="pa-6 d-flex flex-column">
            <div class="d-flex align-center ga-3 mb-3">
              <div class="type-icon-box" :style="`background:rgba(var(--v-theme-${type.color}),0.1)`">
                <v-icon :icon="type.icon" :color="type.color" size="26" />
              </div>
              <div>
                <div class="d-flex align-center ga-2">
                  <h2 class="text-body-1 font-weight-bold">{{ type.title }}</h2>
                  <v-chip v-if="type.badge" size="x-small" :color="type.color" variant="tonal">{{ type.badge }}</v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">{{ type.subtitle }}</div>
              </div>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4 flex-grow-1">{{ type.description }}</p>
            <v-btn :color="type.color" variant="tonal" rounded="lg" append-icon="fas fa-arrow-right" block>
              เลือกประเภทนี้
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Info -->
    <v-alert type="info" variant="tonal" class="mt-6" rounded="xl" prepend-icon="fas fa-circle-info">
      <strong>หมายเหตุ:</strong> สำเนาเอกสารทุกฉบับต้องรับรองสำเนาถูกต้องโดยผู้มีอำนาจลงนาม
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const appTypes = [
  {
    route: "/cb/user/applications/new/register",
    title: "ขึ้นทะเบียนหน่วยรับรอง CB",
    subtitle: "คำขอใหม่",
    badge: "ทั่วไป",
    icon: "fas fa-building-shield",
    color: "cb-user",
    description: "สำหรับหน่วยรับรองที่ต้องการขึ้นทะเบียนกับกรมวิชาการเกษตรเป็นครั้งแรก เพื่อให้บริการตรวจรับรองโรงงานผลิตสินค้าพืช",
  },
  {
    route: "/cb/user/applications/new/renew",
    title: "ต่ออายุทะเบียนหน่วยรับรอง CB",
    subtitle: "ต่ออายุ",
    badge: null,
    icon: "fas fa-rotate",
    color: "cb-user",
    description: "สำหรับหน่วยรับรองที่ทะเบียนใกล้หมดอายุและต้องการต่ออายุเพื่อให้บริการตรวจรับรองต่อไป",
  },
  {
    route: "/cb/user/applications/new/scope",
    title: "เพิ่ม / ลดขอบข่าย",
    subtitle: "แก้ไขขอบข่าย",
    badge: null,
    icon: "fas fa-arrows-left-right",
    color: "warning",
    description: "สำหรับหน่วยรับรองที่ต้องการเพิ่มหรือลดขอบข่ายการรับรอง เช่น เพิ่มมาตรฐาน หรือเปลี่ยนประเภทสถานประกอบการที่รับรอง",
  },
  {
    route: "/cb/user/applications/new/other",
    title: "คำขออื่น ๆ",
    subtitle: "กรณีพิเศษ",
    badge: null,
    icon: "fas fa-ellipsis",
    color: "secondary",
    description: "สำหรับคำขอที่ไม่เข้าข่ายประเภทข้างต้น เช่น การแจ้งเปลี่ยนแปลงข้อมูลสำคัญ การระงับ หรือยกเลิกทะเบียน",
  },
];
</script>

<style scoped>
.type-card {
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 20px !important;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.type-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(var(--v-theme-cb-user), 0.1) !important;
}
.type-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
