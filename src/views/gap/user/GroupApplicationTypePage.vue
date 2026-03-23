<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/gap/user/applications/new')"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอ GAP รายกลุ่ม</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอสำหรับกลุ่มเกษตรกร / วิสาหกิจชุมชน
        </p>
      </div>
    </div>

    <!-- Group mode warning (ถ้าเข้ามาผิดโหมด) -->
    <v-alert
      v-if="!sessionStore.isGroupMode"
      type="warning"
      variant="tonal"
      rounded="xl"
      class="mb-6"
      prepend-icon="fas fa-triangle-exclamation"
    >
      หน้านี้ใช้ได้เฉพาะในโหมดกลุ่มเท่านั้น
      กรุณาย้อนกลับและเลือกโหมดการเข้าใช้ให้ถูกต้อง
    </v-alert>

    <!-- Type Cards -->
    <v-row justify="start">
      <v-col v-for="type in appTypes" :key="type.key" cols="12" md="6" lg="3">
        <v-card
          class="type-card h-100"
          hover
          :ripple="false"
          :disabled="type.disabled"
          @click="
            !type.disabled &&
            router.push(`/gap/user/applications/new/group/${type.key}`)
          "
        >
          <v-card-text class="pa-8 d-flex flex-column align-center text-center">
            <div
              class="type-icon-box mb-5"
              :style="
                type.disabled
                  ? 'background:rgba(var(--v-border-color),0.08)'
                  : `background:rgba(var(--v-theme-${type.color}),0.1)`
              "
            >
              <v-icon
                :icon="type.icon"
                :color="type.disabled ? 'medium-emphasis' : type.color"
                size="40"
              />
            </div>

            <div class="d-flex align-center ga-2 mb-2">
              <h2 class="text-h6 font-weight-bold">{{ type.title }}</h2>
              <v-chip
                v-if="type.badge"
                size="x-small"
                :color="type.disabled ? 'grey' : type.color"
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
              {{
                type.disabled
                  ? sessionStore.isGroupMode
                    ? "ยังไม่เปิดให้บริการ"
                    : "ใช้ได้เฉพาะโหมดกลุ่ม"
                  : "เลือกประเภทนี้"
              }}
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
      <strong>หมายเหตุ:</strong> คำขอ GAP
      รายกลุ่มต้องมีผู้แทนกลุ่มที่มีอำนาจลงนาม
      พร้อมรายชื่อสมาชิกและข้อมูลแปลงของทุกสมาชิกในกลุ่ม
    </v-alert>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const sessionStore = useSessionStore();

const appTypes = computed(() => [
  {
    key: "new",
    title: "คำขอรายเดี่ยว",
    badge: "ใหม่",
    icon: "fas fa-users",
    color: "primary",
    disabled: !sessionStore.isGroupMode,
    description:
      "สำหรับเกษตรกรรายบุคคลที่ต้องการขอรับรองแหล่งผลิต GAP สำหรับแปลงของคนเอง",
    features: [
      "เกษตรกรยื่นคำขอเอง",
      "ตรวจสอบแปลงปลูกรายคน",
      "ได้รับใบรับรองรายบุคคล",
    ],
  },
  {
    key: "renew",
    title: "ต่ออายุใบรับรองกลุ่ม",
    badge: "เร็วๆ นี้",
    icon: "fas fa-rotate",
    color: "primary",
    disabled: true,
    description:
      "สำหรับกลุ่มเกษตรกรที่ใบรับรองใกล้หมดอายุและต้องการต่ออายุพร้อมกันทั้งกลุ่ม",
    features: [
      "ต่ออายุพร้อมกันทั้งกลุ่ม",
      "อัปเดตรายชื่อสมาชิก",
      "ยืนยันข้อมูลแปลงเดิม",
    ],
  },
  {
    key: "amendment",
    title: "แก้ไขข้อมูลกลุ่ม",
    badge: "เร็วๆ นี้",
    icon: "fas fa-pen-to-square",
    color: "warning",
    disabled: true,
    description:
      "สำหรับกลุ่มที่ต้องการแก้ไขข้อมูล เช่น เพิ่ม/ลดสมาชิก หรือแก้ไขข้อมูลแปลงของสมาชิก",
    features: [
      "เพิ่ม / ลดสมาชิกในกลุ่ม",
      "แก้ไขข้อมูลแปลงสมาชิก",
      "ต้องมีใบรับรองกลุ่มเดิม",
    ],
  },
]);
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-gap-user), 0.12) !important;
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
