<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">การยื่นคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอใบรับรองมาตรฐานเกษตรอินทรีย์ (Organic Agriculture)
        </p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row>
      <v-col v-for="type in applicationTypes" :key="type.value" cols="12">
        <v-card
          class="type-card"
          hover
          elevation="0"
          rounded="xl"
          :disabled="type.disabled"
          @click="!type.disabled && selectType(type.value)"
        >
          <div class="d-flex align-center pa-6">
            <!-- Icon Box -->
            <div class="icon-box mr-6">
              <v-icon
                :icon="type.icon"
                :color="type.disabled ? 'medium-emphasis' : type.color"
                size="28"
              />
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <h2 class="text-h6 font-weight-bold mb-1">{{ type.title }}</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ type.desc }}</p>
            </div>

            <!-- Action -->
            <div class="d-flex align-center">
              <div class="node-line-container">
                <div class="vertical-line"></div>
                <v-btn icon variant="flat" color="org-user" size="small" class="node-dot" :disabled="type.disabled">
                  <v-icon icon="fas fa-arrow-right" size="14" color="white" />
                </v-btn>
              </div>
            </div>
          </div>
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
      <strong>หมายเหตุ:</strong>
      คำขอรับรองเกษตรอินทรีย์ต้องผ่านการตรวจแปลงโดยเจ้าหน้าที่
      กรุณาเตรียมเอกสารและข้อมูลแปลงเพาะปลูกให้พร้อม
    </v-alert>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const sessionStore = useSessionStore();

const applicationTypes = computed(() => [
  {
    value: "individual",
    title: "คำขอรับรอง (รายเดี่ยว)",
    badge: "ทั่วไป",
    icon: "fas fa-user",
    color: "primary",
    disabled: sessionStore.isGroupMode,
    desc: "สำหรับเกษตรกรรายบุคคลที่ต้องการขอรับรองแปลงเพาะปลูกเกษตรอินทรีย์",
    features: ["เกษตรกรรายบุคคล", "ระบุพิกัดแปลง", "มาตรฐาน มกษ.9000"],
  },
  {
    value: "group",
    title: "คำขอรับรอง (รายกลุ่ม)",
    badge: "กลุ่ม",
    icon: "fas fa-people-group",
    color: "secondary",
    disabled: !sessionStore.isGroupMode,
    desc: "สำหรับกลุ่มเกษตรกรหรือวิสาหกิจชุมชนที่ต้องการขอรับรองพร้อมกัน",
    features: [
      "กลุ่มเกษตรกร / วิสาหกิจชุมชน",
      "ยื่นพร้อมกันหลายแปลง",
      "ICS ระบบควบคุมภายใน",
    ],
  },
  {
    value: "amendment",
    title: "คำขอแก้ไขข้อมูล",
    badge: null,
    icon: "fas fa-pen-to-square",
    color: "warning",
    disabled: sessionStore.isGroupMode,
    desc: "แก้ไขเปลี่ยนแปลงข้อมูลในใบรับรองที่มีอยู่ เช่น พื้นที่ ชนิดพืช หรือข้อมูลผู้ยื่น",
    features: [
      "ต้องมีใบรับรองเดิม",
      "แก้ไขข้อมูลแปลง / ชนิดพืช",
      "เปลี่ยนแปลงข้อมูลผู้ยื่น",
    ],
  },
]);

function goToApplicationList() {
  router.push({ name: "ORGUserApplicationList" });
}

function selectType(value) {
  if (value === "individual") router.push({ name: "ORGUserNewIndividual" });
  else if (value === "group") router.push({ name: "ORGUserApplicationTypeGroup" });
  else if (value === "amendment") router.push({ name: "ORGUserAmendment" });
  else if (value === "cancel") router.push({ name: "ORGUserCancel" });
}
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-org-user), 0.12) !important;
}
</style>
