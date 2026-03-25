<template>
  <div>
    <!-- Back + Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-3 flex-wrap">
          <h1 class="page-title mb-0">EL-2569-00002</h1>
          <v-chip color="el-user" size="small" variant="tonal">
            อยู่ระหว่างตรวจประเมิน
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          ยื่นเมื่อ 10 กุมภาพันธ์ 2569
        </p>
      </div>
    </div>

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
          <v-card-title
            class="pa-4 pb-2 text-subtitle-2 font-weight-bold d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-route" color="el-user" size="16" />
            ความคืบหน้าคำขอ
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <div class="timeline">
              <div
                v-for="(step, idx) in timeline"
                :key="step.key"
                class="timeline-item"
                :class="{
                  'timeline-item--done': isTimelineDone(idx),
                  'timeline-item--active': isTimelineActive(idx),
                  'timeline-item--pending': isTimelinePending(idx),
                }"
              >
                <div class="timeline-dot">
                  <v-icon
                    v-if="isTimelineDone(idx)"
                    icon="fas fa-check"
                    size="12"
                  />
                  <v-icon
                    v-else-if="isTimelineActive(idx)"
                    icon="fas fa-spinner"
                    size="12"
                    class="fa-spin"
                  />
                  <v-icon v-else icon="fas fa-circle" size="8" />
                </div>
                <div class="timeline-content">
                  <div class="text-body-2 font-weight-medium">
                    {{ step.label }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ step.desc }}
                  </div>
                  <div v-if="step.date" class="text-caption text-el-user mt-1">
                    {{ step.date }}
                  </div>
                  <div v-if="step.note" class="text-caption text-warning mt-1">
                    {{ step.note }}
                  </div>
                </div>
                <div v-if="idx < timeline.length - 1" class="timeline-line" />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "ELUserApplicationList" });
}

const activeTrackerStep = 2;

const currentStatusIdx = computed(() => activeTrackerStep);

const timeline = computed(() => [
  {
    key: "submitted",
    label: "ยื่นคำขอ",
    desc: appDetail.establishmentName,
    date: "10 ก.พ. 2569",
  },
  {
    key: "inspection",
    label: "ด่านเกษตรตรวจสอบ",
    desc: "ด่านเกษตร",
    date: "12 ก.พ. 2569",
  },
  {
    key: "assessment",
    label: "สวพ.ตรวจประเมิน",
    desc: "ทีมผู้ตรวจประเมิน",
    date: "15 ก.พ. 2569",
  },
  {
    key: "committee",
    label: "คณะกรรมการพิจารณา",
    desc: "",
    date: "",
  },
  {
    key: "registered",
    label: "ขึ้นทะเบียน EL",
    desc: "",
    date: "",
  },
]);

function isTimelineDone(idx) {
  return idx < currentStatusIdx.value;
}
function isTimelineActive(idx) {
  return idx === currentStatusIdx.value;
}
function isTimelinePending(idx) {
  return idx > currentStatusIdx.value;
}

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
    date: "10 ก.พ. 2569 09:30",
    color: "success",
    note: "เลขคำขอ EL-2569-00002",
  },
  {
    label: "ด่านเกษตรตรวจสอบเอกสาร",
    date: "12 ก.พ. 2569 14:00",
    color: "success",
    note: "เอกสารครบถ้วน ผ่านการตรวจสอบ",
  },
  {
    label: "ส่งให้ สวพ. ตรวจประเมิน",
    date: "15 ก.พ. 2569 10:00",
    color: "primary",
    note: "อยู่ระหว่างการนัดหมายการตรวจ",
  },
];
</script>

<style scoped>
.timeline-item--done .timeline-dot {
  background: rgb(var(--v-theme-el-user));
  color: white;
}
.timeline-item--active .timeline-dot {
  background: rgb(var(--v-theme-el-user));
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-el-user), 0.2);
}
.timeline-item--pending .timeline-dot {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.3);
}
.timeline-item--done .timeline-line {
  background: rgba(var(--v-theme-el-user), 0.35);
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
