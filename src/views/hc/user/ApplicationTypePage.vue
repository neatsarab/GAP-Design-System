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
        <v-card class="type-card" hover elevation="0" rounded="xl" @click="goToNewApplication(type.key)">
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
                <v-btn icon variant="flat" color="hc-user" size="small" class="node-dot">
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
  router.push({ name: "HCUserApplicationList" });
}

function goToNewApplication(key) {
  if (key === "correction") {
    router.push({ name: "HCUserCorrectionApplication" });
  } else {
    router.push({ name: "HCUserNewApplication", params: { type: key } });
  }
}

const appTypes = [
  {
    key: "new",
    title: "คำขอใบรับรอง",
    badge: null,
    icon: "fas fa-file-circle-plus",
    color: "primary",
    description:
      "ยื่นคำขอออกใบรับรองสุขอนามัยพืชเพื่อประกอบการส่งออกสินค้าพืชควบคุมเฉพาะ",
    features: [
      "พืชควบคุมเฉพาะเพื่อการส่งออก",
      "ระบุโรงคัดบรรจุและผู้รับสินค้า",
      "แนบใบรับรอง GAP",
    ],
  },
  {
    key: "correction",
    title: "คำขอแก้ไขใบรับรอง",
    badge: null,
    icon: "fas fa-file-pen",
    color: "secondary",
    description:
      "สำหรับผู้ส่งออกที่ต้องการแก้ไขข้อมูลในใบรับรองสุขอนามัยพืชที่ออกแล้ว",
    features: [
      "ต้องมีใบรับรองเดิมที่ออกแล้ว",
      "แก้ไขข้อมูลที่ผิดพลาด",
      "ระบุเหตุผลการแก้ไข",
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-hc-user), 0.12) !important;
}
</style>
