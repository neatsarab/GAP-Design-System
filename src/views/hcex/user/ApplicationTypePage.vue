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
        <h1 class="page-title mb-0">ยื่นคำขอใหม่</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอที่ต้องการยื่น
        </p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row justify="start">
      <v-col
        v-for="appType in appTypes"
        :key="appType.key"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          class="type-card h-100"
          hover
          :ripple="false"
          @click="goToNewApplication(appType.key)"
        >
          <v-card-text class="pa-8 d-flex flex-column align-center text-center">
            <div
              class="type-icon-box mb-5"
              :style="`background:rgba(var(--v-theme-${appType.color}),0.1)`"
            >
              <v-icon :icon="appType.icon" :color="appType.color" size="40" />
            </div>

            <div class="d-flex align-center ga-2 mb-2">
              <h2 class="text-h6 font-weight-bold">{{ appType.title }}</h2>
              <v-chip
                v-if="appType.badge"
                size="x-small"
                :color="appType.color"
                variant="tonal"
              >
                {{ appType.badge }}
              </v-chip>
            </div>

            <p class="text-body-2 text-medium-emphasis mb-5">
              {{ appType.description }}
            </p>

            <v-list
              density="compact"
              class="w-100 text-left mb-6 bg-transparent pa-0"
            >
              <v-list-item
                v-for="f in appType.features"
                :key="f"
                prepend-icon="fas fa-circle-check"
                :title="f"
                :base-color="appType.color"
                class="px-0"
                density="compact"
              />
            </v-list>

            <v-btn
              :color="appType.color"
              block
              rounded="lg"
              append-icon="fas fa-arrow-right"
            >
              เลือกประเภทนี้
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Info -->
    <!-- <v-alert
      type="info"
      variant="tonal"
      class="mt-6"
      prepend-icon="fas fa-circle-info"
      rounded="xl"
    >
      <strong>หมายเหตุ:</strong>
      เอกสารที่ใช้ประกอบการยื่นคำขอต้องรับรองสำเนาถูกต้อง
      ผู้ยื่นคำขอต้องเป็นผู้มีอำนาจลงนาม หากยื่นด้วยตนเองต้องแสดง<strong
        >บัตรประชาชนตัวจริง</strong
      >
    </v-alert> -->
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "HCEXUserApplicationList" });
}

function goToNewApplication(type) {
  router.push({ name: "HCEXUserNewApplication", params: { type } });
}

const appTypes = [
  {
    key: "history",
    title: "คำขอขึ้นทะเบียนประวัติ",
    badge: null,
    icon: "fas fa-clock-rotate-left",
    color: "info",
    description:
      "ยื่นคำขอขึ้นทะเบียนประวัติสินค้าแปรรูป สำหรับสถานประกอบการที่ต้องการบันทึกประวัติการผลิตและส่งออก",
    features: [
      "บันทึกประวัติสินค้าแปรรูป",
      "ระบุแหล่งที่มาวัตถุดิบ",
      "รายละเอียดกระบวนการผลิต",
    ],
  },
  {
    key: "lab",
    title: "คำขอพิจารณาผล Lab",
    badge: null,
    icon: "fas fa-flask",
    color: "success",
    description:
      "ยื่นคำขอให้เจ้าหน้าที่พิจารณาผลการตรวจวิเคราะห์ทางห้องปฏิบัติการ เพื่อประกอบการออกใบรับรองสุขอนามัยพืช",
    features: [
      "แนบผลการตรวจ Lab",
      "ระบุชนิดและปริมาณสินค้า",
      "ติดตามสถานะการพิจารณา",
    ],
  },
  {
    key: "newrequest",
    title: "คำขอใบรับรอง",
    badge: null,
    icon: "fas fa-file-circle-plus",
    color: "primary",
    description:
      "ยื่นคำขอขึ้นทะเบียนสถานประกอบการสินค้าแปรรูปด้านพืช สำหรับผู้ประกอบการรายใหม่ที่ยังไม่เคยขึ้นทะเบียน",
    features: [
      "ขึ้นทะเบียนสถานประกอบการ",
      "รองรับสินค้าแปรรูปหลายประเภท",
      "จัดการข้อมูลผู้ประกอบการ",
    ],
  },
  {
    key: "amendment",
    title: "คำขอแก้ไขใบรับรอง",
    badge: null,
    icon: "fas fa-file-pen",
    color: "warning",
    description:
      "สำหรับผู้ประกอบการที่ได้รับใบรับรองแล้ว และต้องการแก้ไขข้อมูลในใบรับรองสุขอนามัยพืชที่มีอยู่",
    features: [
      "แก้ไขข้อมูลในใบรับรอง",
      "แก้ไขข้อมูลสินค้าและปริมาณ",
      "แก้ไขประเทศปลายทาง",
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
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(var(--v-theme-hcex-user), 0.12) !important;
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
