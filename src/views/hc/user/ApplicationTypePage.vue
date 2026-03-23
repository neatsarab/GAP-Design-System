<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/hc/user/applications')"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอ HC ใบรับรองสุขอนามัยพืช</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">เลือกประเภทคำขอที่ต้องการยื่น</p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row justify="start">
      <v-col v-for="type in appTypes" :key="type.key" cols="12" md="6" lg="4">
        <v-card
          class="type-card h-100"
          hover
          :ripple="false"
          @click="router.push(`/hc/user/applications/new/${type.key}`)"
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
      <strong>หมายเหตุ:</strong> ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate)
      ออกโดยกรมวิชาการเกษตรตามพระราชบัญญัติกักพืช พ.ศ. 2507
      กรุณาเตรียมข้อมูลผู้ส่งออก โรงคัดบรรจุ และรายละเอียดสินค้าให้ครบถ้วน
    </v-alert>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const appTypes = [
  {
    key: "new",
    title: "ขอใบรับรองสุขอนามัยพืช",
    badge: "ทั่วไป",
    icon: "fas fa-file-shield",
    color: "primary",
    description:
      "สำหรับผู้ส่งออกที่ต้องการขอใบรับรองสุขอนามัยพืชเพื่อประกอบการส่งออกสินค้าพืชควบคุมเฉพาะ",
    features: [
      "พืชควบคุมเฉพาะเพื่อการส่งออก",
      "ระบุโรงคัดบรรจุและผู้รับสินค้า",
      "แนบใบรับรอง GAP",
    ],
  },
  {
    key: "correction",
    title: "ขอแก้ไขใบรับรอง",
    badge: null,
    icon: "fas fa-file-pen",
    color: "secondary",
    description:
      "สำหรับผู้ส่งออกที่ต้องการแก้ไขข้อมูลในใบรับรองสุขอนามัยพืชที่ออกแล้ว เช่น ชื่อ ที่อยู่ หรือรายการสินค้า",
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
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(var(--v-theme-hc-user), 0.12) !important;
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
