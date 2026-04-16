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
          @click="goToNewApplication(appType.key)"
        >
          <div class="d-flex align-center pa-6">
            <!-- Icon Box -->
            <div class="icon-box mr-6">
              <v-icon :icon="appType.icon" :color="appType.color" size="28" />
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <h2 class="text-h6 font-weight-bold mb-1">{{ appType.title }}</h2>
              <p
                v-if="appType.description"
                class="text-body-2 text-medium-emphasis mb-0"
              >
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
                  color="export-user"
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
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToNewApplication(type) {
  if (type === "cancellation") {
    router.push({ name: "ExportUserCancellation" });
  } else if (type === "amendment") {
    router.push({ name: "ExportUserAmendment" });
  } else {
    router.push({ name: "ExportUserNewApplication", params: { type } });
  }
}

const appTypes = [
  {
    key: "newrequest",
    title: "คำขอขึ้น / ต่ออายุทะเบียน",
    badge: null,
    icon: "fas fa-file-circle-plus",
    color: "primary",
    description:
      "สำหรับผู้ประกอบการที่ต้องการขึ้นทะเบียนเป็นผู้ส่งออกสินค้าพืช หรือต่ออายุทะเบียนที่ใกล้หมดอายุ",
  },
  {
    key: "amendment",
    title: "คำขอแก้ไขใบทะเบียน",
    badge: null,
    icon: "fas fa-file-pen",
    color: "warning",
    description:
      "สำหรับผู้ที่ต้องการแก้ไขข้อมูลในใบทะเบียนที่ออกแล้ว สามารถยื่นแก้ไขได้มากกว่า 1 ทะเบียนในคราวเดียวกัน",
  },
  {
    key: "cancellation",
    title: "คำขอยกเลิกทะเบียน",
    badge: null,
    icon: "fas fa-file-circle-xmark",
    color: "error",
    description:
      "สำหรับผู้ที่ต้องการยกเลิกใบทะเบียนผู้ส่งออก สามารถยื่นยกเลิกได้มากกว่า 1 ทะเบียนในคราวเดียวกัน",
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
  box-shadow: 0 12px 32px rgba(var(--v-theme-export-user), 0.12) !important;
}
</style>
