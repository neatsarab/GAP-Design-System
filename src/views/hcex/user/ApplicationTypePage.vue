<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/hcex/user/applications')"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอ HC แปรรูป</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืช
        </p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row justify="start">
      <v-col v-for="type in appTypes" :key="type.key" cols="12" md="6" lg="4">
        <v-card
          class="type-card h-100"
          hover
          :ripple="false"
          @click="router.push(`/hcex/user/applications/new/${type.key}`)"
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
      <strong>หมายเหตุ:</strong> การยื่นคำขอใบรับรองสุขอนามัยสินค้าแปรรูปต้องมีผลการทดสอบห้องปฏิบัติการ (Lab)
      ที่ผ่านการพิจารณาของเจ้าหน้าที่ก่อน หากยังไม่มีผล Lab สามารถยื่นขอผล Lab ได้ในขั้นตอนถัดไป
    </v-alert>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const appTypes = [
  {
    key: "kmp1",
    title: "กมพ.1",
    badge: "ทั่วไป",
    icon: "fas fa-file-circle-check",
    color: "primary",
    description: "ใบรับรองสุขอนามัยสำหรับสินค้าแปรรูปด้านพืชทั่วไป",
    features: [
      "สินค้าแปรรูปด้านพืชทั่วไป",
      "ต้องมีผลการทดสอบ Lab",
      "ระบุโรงงานและผู้รับสินค้า",
    ],
  },
  {
    key: "kmp1-1",
    title: "กมพ.1-1",
    badge: "แป้ง / ธัญพืช",
    icon: "fas fa-wheat-awn",
    color: "warning",
    description: "ใบรับรองสุขอนามัยสำหรับผลิตภัณฑ์แป้งและธัญพืชแปรรูป",
    features: [
      "แป้งและธัญพืชแปรรูป",
      "ต้องมีผลการทดสอบ Lab",
      "แนบมาตรฐานการผลิต",
    ],
  },
  {
    key: "kmp1-2",
    title: "กมพ.1-2",
    badge: "ผัก / ผลไม้",
    icon: "fas fa-jar",
    color: "success",
    description: "ใบรับรองสำหรับผลิตภัณฑ์ผักและผลไม้แปรรูป",
    features: [
      "ผักและผลไม้แปรรูป",
      "ต้องมีผลการทดสอบ Lab",
      "แนบใบรับรองแหล่งผลิต GAP",
    ],
  },
  {
    key: "kmp1-3",
    title: "กมพ.1-3",
    badge: "เครื่องเทศ",
    icon: "fas fa-mortar-pestle",
    color: "primary",
    description: "ใบรับรองสำหรับเครื่องเทศและสมุนไพรแปรรูป",
    features: [
      "เครื่องเทศและสมุนไพรแปรรูป",
      "ต้องมีผลการทดสอบ Lab",
      "แนบมาตรฐานการผลิตสมุนไพร",
    ],
  },
  {
    key: "correction",
    title: "ขอแก้ไขใบรับรอง",
    badge: null,
    icon: "fas fa-file-pen",
    color: "secondary",
    description: "ยื่นคำขอแก้ไขข้อมูลในใบรับรองสุขอนามัยสินค้าแปรรูปที่ออกแล้ว",
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
