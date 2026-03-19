<template>
  <div>
    <!-- Back + Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/el/user/applications')"
      />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-3 flex-wrap">
          <h1 class="page-title mb-0">EL-2568-00002</h1>
          <v-chip color="el-user" size="small" variant="tonal">
            อยู่ระหว่างตรวจประเมิน
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          ยื่นเมื่อ 10 กุมภาพันธ์ 2568
        </p>
      </div>
    </div>

    <!-- 5-Step Tracker -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
        สถานะการดำเนินการ
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-0">
          <div
            v-for="(step, idx) in trackerSteps"
            :key="step.label"
            class="d-flex align-center flex-grow-1"
          >
            <div
              class="d-flex flex-column align-center"
              style="min-width: 80px"
            >
              <div
                class="tracker-circle"
                :class="{
                  'tracker-circle--done': idx < activeTrackerStep,
                  'tracker-circle--active': idx === activeTrackerStep,
                }"
              >
                <v-icon
                  v-if="idx < activeTrackerStep"
                  icon="fas fa-check"
                  size="14"
                />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <span
                class="text-caption text-center mt-2"
                :class="
                  idx <= activeTrackerStep
                    ? 'font-weight-medium text-primary'
                    : 'text-medium-emphasis'
                "
                style="max-width: 80px; line-height: 1.3"
              >
                {{ step.label }}
              </span>
            </div>
            <div
              v-if="idx < trackerSteps.length - 1"
              class="tracker-line flex-grow-1"
              :class="{ 'tracker-line--done': idx < activeTrackerStep }"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Alert -->
    <v-alert
      v-if="appDetail.status === 'under_review'"
      color="el-user"
      variant="tonal"
      rounded="xl"
      class="mb-6"
      prepend-icon="fas fa-circle-info"
    >
      คำขอของท่านอยู่ในระหว่างการตรวจประเมินสถานประกอบการ
      ทีมเจ้าหน้าที่จะติดต่อเพื่อนัดหมายการตรวจ
    </v-alert>

    <!-- Revision Notice -->
    <v-card
      v-if="appDetail.status === 'revision_required'"
      rounded="xl"
      elevation="0"
      color="warning"
      variant="tonal"
      class="mb-6"
    >
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-2 mb-3">
          <v-icon icon="fas fa-triangle-exclamation" color="warning" />
          <span class="text-body-1 font-weight-bold">ต้องแก้ไขเอกสาร</span>
        </div>
        <v-list density="compact" class="bg-transparent pa-0">
          <v-list-item
            v-for="item in revisionItems"
            :key="item"
            density="compact"
            class="pl-0"
          >
            <template #prepend>
              <v-icon
                icon="fas fa-circle-xmark"
                color="warning"
                size="14"
                class="mr-2"
              />
            </template>
            {{ item }}
          </v-list-item>
        </v-list>
        <v-btn
          color="warning"
          variant="elevated"
          rounded="lg"
          class="mt-4"
          prepend-icon="fas fa-pen"
        >
          แก้ไขคำขอ
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Info Cards -->
      <v-col cols="12" md="7">
        <!-- ข้อมูลโรงคัดบรรจุ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <v-card-title class="pa-5 pb-3 section-title">
            <v-icon
              icon="fas fa-warehouse"
              color="el-user"
              class="mr-2"
              size="18"
            />
            ข้อมูลโรงคัดบรรจุ
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="info-label">ชื่อโรงคัดบรรจุ</div>
                <div class="info-value">{{ appDetail.establishmentName }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="info-label">ที่อยู่</div>
                <div class="info-value">{{ appDetail.address }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="info-label">ชนิดพืช</div>
                <div class="info-value">{{ appDetail.cropType }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-label">ใบรับรอง GMP</div>
                <v-chip color="success" size="x-small" variant="tonal">{{
                  appDetail.gmpCertNo
                }}</v-chip>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-label">ใบรับรอง HACCP</div>
                <v-chip color="success" size="x-small" variant="tonal">{{
                  appDetail.haccpCertNo
                }}</v-chip>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-label">จำนวนเกษตรกร</div>
                <div class="info-value font-weight-bold">12 ราย</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="info-label">จำนวนแปลง</div>
                <div class="info-value font-weight-bold">18 แปลง</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Timeline -->
      <v-col cols="12" md="5">
        <v-card rounded="xl" elevation="0" class="section-card">
          <v-card-title class="pa-5 pb-3 section-title">
            <v-icon
              icon="fas fa-clock-rotate-left"
              color="el-user"
              class="mr-2"
              size="18"
            />
            ประวัติสถานะ
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <v-timeline density="compact" align="start" side="end">
              <v-timeline-item
                v-for="event in statusHistory"
                :key="event.date"
                :dot-color="event.color"
                size="small"
              >
                <div class="text-body-2 font-weight-medium">
                  {{ event.label }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ event.date }}
                </div>
                <div v-if="event.note" class="text-caption mt-1">
                  {{ event.note }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const activeTrackerStep = 2;

const trackerSteps = [
  { label: "ยื่นคำขอ" },
  { label: "ด่านเกษตรตรวจสอบ" },
  { label: "สวพ.ตรวจประเมิน" },
  { label: "คณะกรรมการพิจารณา" },
  { label: "ขึ้นทะเบียน EL" },
];

const appDetail = {
  status: "under_review",
  establishmentName: "บริษัท ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จำกัด",
  address: "123 ถนนพหลโยธิน เขตลาดยาว กรุงเทพฯ",
  cropType: "ทุเรียน",
  gmpCertNo: "GMP-2566-00125",
  haccpCertNo: "HACCP-2566-00078",
};

const revisionItems = [
  "กรุณาแนบสำเนาใบรับรอง GAP ฉบับปัจจุบัน",
  "แผนที่แปลงไม่ครบถ้วน กรุณาแนบแปลงที่ขาด",
  "HACCP Plan ต้องระบุ CCP ให้ครบ",
];

const statusHistory = [
  {
    label: "รับคำขอแล้ว",
    date: "10 ก.พ. 2568 09:30",
    color: "success",
    note: "เลขคำขอ EL-2568-00002",
  },
  {
    label: "ด่านเกษตรตรวจสอบเอกสาร",
    date: "12 ก.พ. 2568 14:00",
    color: "success",
    note: "เอกสารครบถ้วน ผ่านการตรวจสอบ",
  },
  {
    label: "ส่งให้ สวพ. ตรวจประเมิน",
    date: "15 ก.พ. 2568 10:00",
    color: "el-user",
    note: "อยู่ระหว่างการนัดหมายการตรวจ",
  },
];
</script>

<style scoped>
.tracker-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.4);
  background: transparent;
  flex-shrink: 0;
}
.tracker-circle--active {
  border-color: rgb(var(--v-theme-el-user));
  color: rgb(var(--v-theme-el-user));
  background: rgba(var(--v-theme-el-user), 0.08);
}
.tracker-circle--done {
  border-color: rgb(var(--v-theme-el-user));
  background: rgb(var(--v-theme-el-user));
  color: white;
}
.tracker-line {
  height: 2px;
  background: rgba(var(--v-border-color), var(--v-border-opacity));
  margin: 0 6px;
  margin-bottom: 28px;
  min-width: 16px;
}
.tracker-line--done {
  background: rgb(var(--v-theme-el-user));
}
.info-label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
}
.info-value {
  font-size: 14px;
  font-weight: 500;
}
</style>
