<template>
  <div>
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" @click="router.back()" />
      <div>
        <h1 class="page-title mb-1">ยื่นคำขอ Health Certificate</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอที่ต้องการยื่น
        </p>
      </div>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-card
          class="type-card type-card--active h-100"
          @click="goToNewCertificate"
        >
          <div class="type-card-accent bg-info" />
          <v-card-text class="pa-6 text-center">
            <div
              class="type-icon-box mx-auto mb-4"
              style="background: rgba(var(--v-theme-hc-staff), 0.1)"
            >
              <v-icon icon="fas fa-file-shield" color="hc-staff" size="32" />
            </div>
            <h3 class="text-h6 font-weight-bold mb-2">ขอใบรับรองสุขอนามัย</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              สำหรับพืชที่อยู่ภายใต้ประกาศพืชควบคุมเฉพาะ เพื่อการส่งออก
            </p>
            <div class="d-flex flex-wrap ga-2 justify-center mb-5">
              <v-chip size="x-small" color="hc-staff" variant="tonal"
                >Form HC</v-chip
              >
              <v-chip size="x-small" color="hc-staff" variant="tonal"
                >Attachment Sheet</v-chip
              >
              <v-chip size="x-small" color="hc-staff" variant="tonal"
                >เอกสารประกอบ</v-chip
              >
            </div>
            <v-btn color="hc-staff" block append-icon="fas fa-arrow-right"
              >เลือก</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card
          class="type-card type-card--active h-100"
          @click="goToNewCorrection"
        >
          <div class="type-card-accent bg-secondary" />
          <v-card-text class="pa-6 text-center">
            <div
              class="type-icon-box mx-auto mb-4"
              style="background: rgba(var(--v-theme-secondary), 0.1)"
            >
              <v-icon icon="fas fa-file-pen" color="secondary" size="32" />
            </div>
            <h3 class="text-h6 font-weight-bold mb-2">
              ขอแก้ไขใบรับรองสุขอนามัย
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              แก้ไขข้อมูลในใบรับรองที่ออกแล้ว เช่น ชื่อผู้รับสินค้า
              รายละเอียดสินค้า
            </p>
            <div class="d-flex flex-wrap ga-2 justify-center mb-5">
              <v-chip size="x-small" color="secondary" variant="tonal"
                >เลขใบรับรอง</v-chip
              >
              <v-chip size="x-small" color="secondary" variant="tonal"
                >รายการที่แก้ไข</v-chip
              >
            </div>
            <v-btn color="secondary" block append-icon="fas fa-arrow-right"
              >เลือก</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ข้อมูลที่ต้องเตรียม -->
    <v-card class="mt-6" variant="tonal" color="hc-staff">
      <v-card-text class="pa-4">
        <div class="d-flex align-start ga-3">
          <v-icon
            icon="fas fa-circle-info"
            color="hc-staff"
            size="18"
            class="mt-1 flex-shrink-0"
          />
          <div>
            <div class="text-body-2 font-weight-bold mb-2">
              เอกสารที่ต้องเตรียม
            </div>
            <div class="text-body-2 text-medium-emphasis">
              ใบกำกับสินค้า · ใบขนสินค้า · ใบรับรองแหล่งผลิต (GAP) ·
              ใบรับรองโรงคัดบรรจุ
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goToNewCertificate() {
  router.push({
    name: "HCstaffNewApplication",
    params: { type: "certificate" },
  });
}

function goToNewCorrection() {
  router.push({
    name: "HCstaffNewApplication",
    params: { type: "correction" },
  });
}
</script>

<style scoped>
.type-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.type-card--active:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.1) !important;
}
.type-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}
.type-icon-box {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
