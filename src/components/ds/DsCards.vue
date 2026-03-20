<template>
  <div>
    <!-- Stat Cards -->
    <div class="ds-subtitle mb-3">Stat Cards (Dashboard)</div>
    <v-row class="mb-6">
      <v-col
        v-for="card in summaryCards"
        :key="card.title"
        cols="12"
        sm="6"
        md="3"
      >
        <AppStatCard
          :icon="card.icon"
          :icon-color="card.color"
          :label="card.title"
          :value="card.value"
          :trend="card.trend"
          trend-label="เทียบกับเดือนที่ผ่านมา"
        />
      </v-col>
    </v-row>

    <!-- Card Variations -->
    <div class="ds-subtitle mb-3">Card Variations</div>
    <v-row>
      <v-col cols="12" md="4">
        <v-card height="100%">
          <v-card-title class="pa-5 pb-3">
            <v-icon icon="fas fa-file-lines" color="primary" class="mr-2" />
            Default Card
          </v-card-title>
          <v-card-text
            >เนื้อหาของ card ทั่วไป ใช้ elevation จาก default theme</v-card-text
          >
          <v-card-actions class="pa-4 pt-0">
            <v-spacer />
            <v-btn variant="text">ยกเลิก</v-btn>
            <v-btn color="primary" variant="flat" size="small">บันทึก</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card height="100%" border elevation="0">
          <div
            class="border-l-4 border-primary pl-4 py-3 px-5 d-flex align-center ga-3"
          >
            <v-icon icon="fas fa-circle-info" color="primary" />
            <span class="text-subtitle-2 font-weight-bold">Bordered Card</span>
          </div>
          <v-card-text class="pt-4"
            >Card แบบ border — ใช้สำหรับ form section ในระบบราชการ</v-card-text
          >
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          height="100%"
          style="
            background: linear-gradient(
              135deg,
              rgb(var(--v-theme-primary)) 0%,
              rgb(var(--v-theme-success)) 100%
            );
          "
        >
          <v-card-text class="pa-5">
            <v-icon
              icon="fas fa-certificate"
              size="32"
              color="white"
              class="mb-3"
            />
            <div class="text-h6 font-weight-bold text-white">Gradient Card</div>
            <div class="text-body-2 text-white" style="opacity: 0.85">
              ใช้สำหรับ highlight สำคัญ
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import AppStatCard from "@/components/common/AppStatCard.vue";

const summaryCards = [
  {
    title: "คำขอทั้งหมด",
    value: 128,
    icon: "fas fa-copy",
    color: "primary",
    trend: 12.4,
  },
  {
    title: "รอดำเนินการ",
    value: 34,
    icon: "far fa-clock",
    color: "warning",
    trend: -3.2,
  },
  {
    title: "ผ่านการรับรอง",
    value: 82,
    icon: "far fa-circle-check",
    color: "success",
    trend: 8.1,
  },
  {
    title: "ใบรับรองที่ใช้งานอยู่",
    value: 76,
    icon: "fas fa-certificate",
    color: "info",
    trend: 5.7,
  },
];
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary));
  opacity: 0.75;
}
</style>
