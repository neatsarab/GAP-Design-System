<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอขึ้นทะเบียนหน่วยรับรอง CB</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">เลือกประเภทคำขอที่ต้องการยื่น</p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row justify="start">
      <v-col v-for="type in appTypes" :key="type.key" cols="12" md="6" lg="3">
        <v-card
          class="type-card h-100"
          hover
          :ripple="false"
          @click="goToAppType(type.route)"
        >
          <v-card-text class="pa-8 d-flex flex-column align-center text-center">
            <div
              class="type-icon-box mb-5"
              :style="`background:rgba(var(--v-theme-${type.color}),0.1)`"
            >
              <v-icon :icon="type.icon" :color="type.color" size="40" />
            </div>

            <div class="d-flex align-center ga-2 mb-2">
              <h2 class="text-h6 font-weight-bold">{{ type.title }}</h2>
              <v-chip v-if="type.badge" size="x-small" :color="type.color" variant="tonal">
                {{ type.badge }}
              </v-chip>
            </div>

            <p class="text-body-2 text-medium-emphasis mb-5">{{ type.description }}</p>

            <v-list density="compact" class="w-100 text-left mb-6 bg-transparent pa-0">
              <v-list-item
                v-for="f in type.features"
                :key="f"
                prepend-icon="fas fa-circle-check"
                :title="f"
                :base-color="type.color"
                class="px-0"
                density="compact"
              />
            </v-list>

            <v-btn :color="type.color" block rounded="lg" append-icon="fas fa-arrow-right">
              เลือกประเภทนี้
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Info -->
    <v-alert
      type="info"
      variant="tonal"
      class="mt-6"
      prepend-icon="fas fa-circle-info"
      rounded="xl"
    >
      <strong>หมายเหตุ:</strong> สำเนาเอกสารทุกฉบับต้องรับรองสำเนาถูกต้องโดยผู้มีอำนาจลงนาม
      การขึ้นทะเบียนหน่วยรับรองต้องผ่านการประเมินความสามารถตามมาตรฐาน ISO/IEC 17065
    </v-alert>
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
    title: "ขึ้นทะเบียนหน่วยรับรอง CB",
    badge: "ใหม่",
    icon: "fas fa-building-shield",
    color: "primary",
    description:
      "สำหรับหน่วยรับรองที่ต้องการขึ้นทะเบียนกับกรมวิชาการเกษตรเป็นครั้งแรก เพื่อให้บริการตรวจรับรองโรงงานผลิตสินค้าพืช",
    features: ["ขึ้นทะเบียนหน่วยรับรองใหม่", "กำหนดขอบข่ายมาตรฐาน", "ISO/IEC 17065"],
  },
  {
    key: "renew",
    route: "/cb/user/applications/new/renew",
    title: "ต่ออายุทะเบียนหน่วยรับรอง",
    badge: null,
    icon: "fas fa-rotate",
    color: "primary",
    description:
      "สำหรับหน่วยรับรองที่ทะเบียนใกล้หมดอายุและต้องการต่ออายุเพื่อให้บริการตรวจรับรองต่อไป",
    features: ["ต่ออายุใบรับรองที่หมดอายุ", "ยืนยันขอบข่ายเดิม", "อัปเดตเอกสารประกอบ"],
  },
  {
    key: "scope",
    route: "/cb/user/applications/new/scope",
    title: "เพิ่ม / ลดขอบข่าย",
    badge: null,
    icon: "fas fa-arrows-left-right",
    color: "warning",
    description:
      "สำหรับหน่วยรับรองที่ต้องการเพิ่มหรือลดขอบข่ายการรับรอง เช่น เพิ่มมาตรฐาน หรือเปลี่ยนประเภทสถานประกอบการที่รับรอง",
    features: ["เพิ่ม / ลดมาตรฐาน", "เปลี่ยนประเภทสถานประกอบการ", "ต้องมีทะเบียนเดิม"],
  },
  {
    key: "other",
    route: "/cb/user/applications/new/other",
    title: "คำขออื่น ๆ",
    badge: null,
    icon: "fas fa-ellipsis",
    color: "secondary",
    description:
      "สำหรับคำขอที่ไม่เข้าข่ายประเภทข้างต้น เช่น การแจ้งเปลี่ยนแปลงข้อมูลสำคัญ การระงับ หรือยกเลิกทะเบียน",
    features: ["แจ้งเปลี่ยนแปลงข้อมูลสำคัญ", "ระงับ / ยกเลิกทะเบียน", "กรณีพิเศษอื่น ๆ"],
  },
];
</script>

<style scoped>
.type-card {
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 20px !important;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(var(--v-theme-cb-user), 0.12) !important;
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
