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
      <v-col v-for="appType in appTypes" :key="appType.key" cols="12">
        <v-card
          class="type-card"
          hover
          elevation="0"
          rounded="xl"
          @click="goToNewApplication(appType)"
        >
          <div class="d-flex align-center pa-6">
            <!-- Icon Box -->
            <div class="icon-box mr-6">
              <v-icon :icon="appType.icon" :color="appType.color" size="28" />
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <h2 class="text-h6 font-weight-bold mb-1">{{ appType.title }}</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ appType.description }}
              </p>
            </div>

            <!-- Action -->
            <div class="d-flex align-center">
              <div class="node-line-container">
                <div class="vertical-line"></div>
                <v-btn
                  icon
                  variant="flat"
                  color="hcex-user"
                  size="small"
                  class="node-dot"
                >
                  <v-icon icon="fas fa-arrow-right" size="14" color="white" />
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog: ต้องขึ้นทะเบียนประวัติก่อน -->
    <v-dialog v-model="blockDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <v-icon
            :icon="blockInfo.icon"
            :color="blockInfo.color"
            size="56"
            class="mb-4"
          />
          <h2 class="text-h6 font-weight-bold mb-2">{{ blockInfo.title }}</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ blockInfo.message }}
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 d-flex flex-column ga-2">
          <v-btn
            v-if="blockInfo.actionKey"
            :color="blockInfo.color"
            block
            rounded="lg"
            variant="flat"
            @click="goToBlockAction"
          >
            {{ blockInfo.actionLabel }}
          </v-btn>
          <v-btn block rounded="lg" variant="text" @click="blockDialog = false">
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const hasApprovedHistory = ref(false); // mock — จะเชื่อม API จริงในภายหลัง

// Dialog state
const blockDialog = ref(false);
const blockInfo = ref({});

function goToApplicationList() {
  router.push({ name: "HCEXUserApplicationList" });
}

function goToNewApplication(type) {
  router.push({ name: "HCEXUserNewApplication", params: { type: type.key } });
}

function goToBlockAction() {
  blockDialog.value = false;
  router.push({
    name: "HCEXUserNewApplication",
    params: { type: blockInfo.value.actionKey },
  });
}

const appTypes = [
  {
    key: "history",
    title: "ทะเบียนประวัติ",
    badge: null,
    icon: "fas fa-clock-rotate-left",
    color: "info",
    description:
      "ยื่นคำขอขึ้นทะเบียนประวัติสินค้าแปรรูป หรือแก้ไขเพิ่ม-ลดรายการสินค้าในทะเบียนที่มีอยู่",
    features: [
      "ขึ้นทะเบียนประวัติครั้งแรก",
      "เพิ่ม/ลดรายการสินค้าแปรรูป",
      "แก้ไขข้อมูลโรงงานและมาตรฐาน",
    ],
    requiresHistory: false,
  },
  {
    key: "lab",
    title: "คำขอพิจารณาผล Lab",
    badge: null,
    icon: "fas fa-flask",
    color: "success",
    description:
      "ยื่นคำขอให้เจ้าหน้าที่พิจารณาผลการตรวจวิเคราะห์ทางห้องปฏิบัติการ เพื่อประกอบการออกใบรับรองสุขอนามัย ",
    features: [
      "แนบผลการตรวจ Lab",
      "ระบุชนิดและปริมาณสินค้า",
      "ติดตามสถานะการพิจารณา",
    ],
    requiresHistory: false,
  },
  {
    key: "newrequest",
    title: "คำขอใบรับรอง",
    badge: null,
    icon: "fas fa-file-circle-plus",
    color: "primary",
    description:
      "ยื่นคำขอออกใบรับรองสุขอนามัย สำหรับสินค้าแปรรูปด้านพืช ต้องมีทะเบียนประวัติที่อนุมัติแล้วก่อน",
    features: [
      "รองรับใบรับรอง 4 ประเภท",
      "เชื่อมข้อมูลจากทะเบียนประวัติ",
      "ติดตามสถานะแบบ real-time",
    ],
    requiresHistory: true,
  },
  {
    key: "amendment",
    title: "คำขอแก้ไขใบรับรอง",
    badge: null,
    icon: "fas fa-file-pen",
    color: "warning",
    description:
      "สำหรับผู้ประกอบการที่ได้รับใบรับรองแล้ว และต้องการแก้ไขข้อมูลในใบรับรองสุขอนามัย ที่มีอยู่",
    features: [
      "แก้ไขข้อมูลในใบรับรอง",
      "แก้ไขข้อมูลสินค้าและปริมาณ",
      "แก้ไขประเทศปลายทาง",
    ],
    requiresHistory: true,
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-hcex-user), 0.12) !important;
}
</style>
