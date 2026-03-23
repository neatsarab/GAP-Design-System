<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/org/user/applications')"
      />
      <div>
        <h1 class="page-title mb-0">ยื่นคำขอ ORG ใหม่</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลือกประเภทคำขอรับรองมาตรฐานเกษตรอินทรีย์
        </p>
      </div>
    </div>

    <!-- Type Cards -->
    <v-row justify="start">
      <v-col
        v-for="type in applicationTypes"
        :key="type.value"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="type-card h-100"
          hover
          :ripple="false"
          :disabled="type.disabled"
          @click="!type.disabled && selectType(type.value)"
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
                :color="type.color"
                variant="tonal"
              >
                {{ type.badge }}
              </v-chip>
            </div>

            <p class="text-body-2 text-medium-emphasis mb-5">{{ type.desc }}</p>

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
                    ? "ใช้ได้เฉพาะโหมดเดี่ยว"
                    : "ต้องเข้าโหมดกลุ่มก่อน"
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

function selectType(value) {
  if (value === "individual")
    router.push("/org/user/applications/new/individual");
  else if (value === "group") router.push("/org/user/applications/new/group");
  else if (value === "amendment")
    router.push("/org/user/applications/new/amendment");
  else if (value === "cancel") router.push("/org/user/applications/new/cancel");
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
.type-icon-box {
  width: 88px;
  height: 88px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
