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
        <h1 class="page-title mb-0">จดทะเบียนผู้ส่งออก</h1>
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
          @click="goToNewApplication(type.key)"
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
      <strong>หมายเหตุ:</strong> เอกสารที่ใช้ประกอบการยื่นคำขอต้องรับรองสำเนาถูกต้อง
      ผู้ยื่นคำขอต้องเป็นผู้มีอำนาจลงนาม หากยื่นด้วยตนเองต้องแสดง<strong>บัตรประชาชนตัวจริง</strong>
    </v-alert>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "ExportUserApplicationList" });
}

function goToNewApplication(key) {
  router.push({ name: "ExportUserNewApplication", params: { key } });
}

const appTypes = [
  {
    key: "kk1",
    title: "ก.ก.1",
    badge: "เกาหลี",
    icon: "fas fa-warehouse",
    color: "primary",
    description:
      "คำร้องขอขึ้นทะเบียนโรงบรรจุสินค้า โรงรมทรีทเม้นต์ และสวนส่งออกไปประเทศเกาหลี",
    features: [
      "ขึ้นทะเบียนโรงบรรจุสินค้า",
      "โรงรมทรีทเม้นต์",
      "สวนส่งออกไปเกาหลี",
    ],
  },
  {
    key: "smpv5",
    title: "สมพ.5",
    badge: "ทั่วไป",
    icon: "fas fa-truck-ramp-box",
    color: "primary",
    description:
      "คำร้องขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกผักและผลไม้",
    features: [
      "จดทะเบียนผู้ส่งออกผักและผลไม้",
      "ขอหนังสือสำคัญแสดงการจดทะเบียน",
      "ต่ออายุทะเบียนผู้ส่งออก",
    ],
  },
  {
    key: "smpv5_other",
    title: "สมพ.5 (กรณีอื่น)",
    badge: null,
    icon: "fas fa-file-circle-plus",
    color: "warning",
    description:
      "คำร้องขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกผักและผลไม้ (กรณีอื่น)",
    features: [
      "กรณีพิเศษนอกเหนือจาก สมพ.5 ปกติ",
      "แนบเอกสารเพิ่มเติมตามที่กำหนด",
      "ติดต่อเจ้าหน้าที่ก่อนยื่น",
    ],
  },
  {
    key: "amendment",
    title: "ขอแก้ไขใบรับรอง",
    badge: null,
    icon: "fas fa-file-pen",
    color: "secondary",
    description:
      "สำหรับผู้ส่งออกที่ต้องการแก้ไขข้อมูลในใบรับรองที่ได้รับการอนุมัติแล้ว",
    features: [
      "แก้ไขข้อมูลสถานประกอบการ",
      "แก้ไขประเทศปลายทาง",
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
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(var(--v-theme-export-user), 0.12) !important;
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
