<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/el/user/applications')"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอ EL</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอขึ้นทะเบียนโรงคัดบรรจุ
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
          :disabled="type.disabled"
          @click="
            !type.disabled &&
            router.push(`/el/user/applications/new/${type.key}`)
          "
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
              <v-chip
                v-if="type.badge"
                size="x-small"
                :color="type.color"
                variant="tonal"
              >
                {{ type.badge }}
              </v-chip>
            </div>

            <p class="text-body-2 text-medium-emphasis mb-5">
              {{ type.description }}
            </p>

            <v-list
              density="compact"
              class="w-100 text-left mb-6 bg-transparent pa-0"
            >
              <v-list-item
                v-for="f in type.features"
                :key="f"
                prepend-icon="fas fa-circle-check"
                :title="f"
                :base-color="type.disabled ? 'grey' : type.color"
                class="px-0"
                density="compact"
              />
            </v-list>

            <v-btn
              :color="type.disabled ? 'grey' : type.color"
              :disabled="type.disabled"
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
    <v-alert
      type="info"
      variant="tonal"
      class="mt-6"
      prepend-icon="fas fa-circle-info"
      rounded="xl"
    >
      <strong>หมายเหตุ:</strong> การขึ้นทะเบียนโรงคัดบรรจุต้องผ่านการตรวจประเมิน
      GMP/HACCP โดยด่านตรวจพืชก่อนได้รับการอนุมัติ กรุณาเตรียมเอกสารให้ครบถ้วน
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const appTypes = [
  {
    key: "register",
    title: "ขึ้นทะเบียนใหม่",
    badge: "ทั่วไป",
    icon: "fas fa-warehouse",
    color: "primary",
    disabled: false,
    description:
      "สำหรับโรงคัดบรรจุที่ต้องการขึ้นทะเบียนกับกรมวิชาการเกษตรเป็นครั้งแรก",
    features: [
      "ขึ้นทะเบียนโรงคัดบรรจุใหม่",
      "แจ้งรายชื่อเกษตรกรและแปลง",
      "ขอใบรับรอง EL ครั้งแรก",
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-el-user), 0.12) !important;
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
