<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายงาน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ดูข้อมูลสรุปและส่งออกข้อมูลในแต่ละประเภท
        </p>
      </div>
    </div>

    <!-- Report Cards -->
    <v-row>
      <v-col v-for="report in reports" :key="report.key" cols="12" md="12">
        <v-card
          rounded="xl"
          elevation="0"
          class="report-card h-100"
          border
          hover
          :to="{ name: 'HCEXstaffReport', params: { type: report.key } }"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center ga-4">
              <!-- Icon -->
              <div
                class="report-icon-box flex-shrink-0"
                :style="{ background: `rgba(var(--v-theme-hcex-staff), 0.1)` }"
              >
                <v-icon :icon="report.icon" color="hcex-staff" size="22" />
              </div>

              <!-- Content -->
              <div class="flex-grow-1">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  {{ report.title }}
                </div>
                <div
                  class="text-body-2 text-medium-emphasis mb-2"
                  style="line-height: 1.5"
                >
                  {{ report.description }}
                </div>

                <!-- Period chips -->
                <!-- <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    v-for="p in report.periods"
                    :key="p"
                    size="x-small"
                    color="hcex-staff"
                    variant="tonal"
                    label
                    >{{ p }}</v-chip
                  >
                </div> -->
              </div>

              <!-- Arrow -->
              <!-- <v-icon
                icon="fas fa-chevron-right"
                size="14"
                color="grey"
                class="flex-shrink-0"
              /> -->

              <!-- Action -->
              <div class="d-flex align-center">
                <div class="node-line-container">
                  <div class="vertical-line"></div>
                  <v-btn
                    icon
                    variant="flat"
                    color="hcex-staff"
                    size="small"
                    class="node-dot"
                  >
                    <v-icon icon="fas fa-arrow-right" size="14" color="white" />
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const reports = [
  {
    key: "hcex",
    icon: "fas fa-file-medical",
    title: "รายงานเกี่ยวกับใบรับรองสุขอนามัย (Health Certificate)",
    description:
      "รายงานสินค้าเกษตรแปรรูปด้านพืช ใช้สำหรับติดตามและสรุปการออกใบรับรองสุขอนามัย",
    periods: ["รายวัน", "รายสัปดาห์", "รายเดือน", "รายไตรมาส", "รายปี"],
  },
];
</script>

<style scoped>
.report-card {
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-hcex-staff), 0.1) !important;
}
.report-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
