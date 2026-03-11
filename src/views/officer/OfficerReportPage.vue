<template>
  <div>
    <div class="mb-5">
      <h1 class="text-h5 font-weight-bold mb-1">รายงาน</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">สร้างและดาวน์โหลดรายงานการดำเนินงาน GAP</p>
    </div>

    <!-- Report Types -->
    <v-row class="mb-6">
      <v-col v-for="rpt in reportTypes" :key="rpt.id" cols="12" sm="6" md="3">
        <v-card class="report-card h-100" @click="selectReport(rpt)">
          <v-card-text class="pa-5 d-flex flex-column align-center text-center">
            <div class="report-icon-box mb-3" :style="`background:rgba(var(--v-theme-${rpt.color}),0.12)`">
              <v-icon :icon="rpt.icon" :color="rpt.color" size="28" />
            </div>
            <div class="text-body-1 font-weight-bold mb-2">{{ rpt.name }}</div>
            <p class="text-caption text-medium-emphasis mb-0">{{ rpt.desc }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Report Generator -->
    <v-card v-if="selectedReport">
      <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
        <v-icon :icon="selectedReport.icon" :color="selectedReport.color" size="20" />
        {{ selectedReport.name }}
        <v-spacer />
        <v-btn icon="fas fa-xmark" variant="text" size="small" @click="selectedReport = null" />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-5">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="reportForm.dateFrom" label="จากวันที่" type="date" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="reportForm.dateTo" label="ถึงวันที่" type="date" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select v-model="reportForm.format" label="รูปแบบไฟล์" :items="['PDF', 'Excel (.xlsx)', 'CSV']" />
          </v-col>
          <v-col v-if="selectedReport.hasStatusFilter" cols="12" sm="4">
            <v-select v-model="reportForm.status" label="สถานะ" :items="statusOptions" item-title="label" item-value="value" clearable />
          </v-col>
          <v-col v-if="selectedReport.hasProvinceFilter" cols="12" sm="4">
            <v-select v-model="reportForm.province" label="จังหวัด" :items="provinces" clearable />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-5 pb-5 ga-3">
        <v-btn color="primary" prepend-icon="fas fa-chart-bar" @click="generateReport">
          สร้างรายงาน
        </v-btn>
        <v-btn variant="tonal" color="grey" @click="selectedReport = null">ยกเลิก</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Recent Reports -->
    <div class="mt-6">
      <div class="text-body-1 font-weight-bold mb-3 d-flex align-center ga-2">
        <v-icon icon="fas fa-clock-rotate-left" color="primary" size="18" />
        รายงานล่าสุด
      </div>
      <v-card>
        <v-list lines="two" class="pa-0">
          <template v-for="(r, i) in recentReports" :key="r.id">
            <v-list-item>
              <template v-slot:prepend>
                <div class="recent-icon mr-3" :style="`background:rgba(var(--v-theme-${r.color}),0.1)`">
                  <v-icon :icon="r.icon" :color="r.color" size="16" />
                </div>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ r.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ r.period }} · {{ r.format }}</v-list-item-subtitle>
              <template v-slot:append>
                <div class="d-flex align-center ga-2">
                  <span class="text-caption text-medium-emphasis">{{ r.generatedAt }}</span>
                  <v-btn size="small" variant="tonal" color="primary" prepend-icon="fas fa-download" @click="">
                    ดาวน์โหลด
                  </v-btn>
                </div>
              </template>
            </v-list-item>
            <v-divider v-if="i < recentReports.length - 1" />
          </template>
        </v-list>
      </v-card>
    </div>

    <!-- Snackbar -->
    <v-snackbar v-model="snack" color="success" timeout="3000" location="top right">
      <v-icon icon="fas fa-circle-check" class="mr-2" />
      สร้างรายงานเรียบร้อยแล้ว กำลังดาวน์โหลด...
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const snack = ref(false)

interface ReportType {
  id: string; name: string; desc: string; icon: string; color: string
  hasStatusFilter?: boolean; hasProvinceFilter?: boolean
}

const reportTypes: ReportType[] = [
  { id: 'applications', name: 'รายงานคำขอ',          desc: 'สรุปจำนวนคำขอตามสถานะและช่วงเวลา',         icon: 'fas fa-file-lines',    color: 'primary',  hasStatusFilter: true, hasProvinceFilter: true  },
  { id: 'inspection',   name: 'รายงานการตรวจแปลง',   desc: 'ผลการตรวจประเมินแปลงและการวิเคราะห์ตัวอย่าง', icon: 'fas fa-clipboard-list', color: 'secondary', hasStatusFilter: false, hasProvinceFilter: true },
  { id: 'certificate',  name: 'รายงานใบรับรอง',       desc: 'รายการใบรับรองที่ออกแล้ว สถานะ หมดอายุ',    icon: 'fas fa-certificate',   color: 'success',  hasStatusFilter: false, hasProvinceFilter: true  },
  { id: 'statistics',   name: 'รายงานสถิติระบบ',      desc: 'ภาพรวมสถิติการใช้งานระบบและแนวโน้ม',        icon: 'fas fa-chart-bar',     color: 'info',     hasStatusFilter: false, hasProvinceFilter: false },
]

const selectedReport = ref<ReportType | null>(null)

const reportForm = ref({
  dateFrom: '',
  dateTo: '',
  format: 'PDF',
  status: null as string | null,
  province: null as string | null,
})

const statusOptions = [
  { label: 'รอตรวจคำขอ', value: 'reviewing' },
  { label: 'รอนัดตรวจแปลง', value: 'scheduling' },
  { label: 'อนุมัติแล้ว', value: 'approved' },
  { label: 'ออกใบรับรองแล้ว', value: 'cert_issued' },
]

const provinces = ['เชียงใหม่', 'เชียงราย', 'นครปฐม', 'เพชรบูรณ์', 'สระแก้ว', 'กาญจนบุรี', 'นครศรีธรรมราช', 'สุราษฎร์ธานี']

function selectReport(rpt: ReportType) {
  selectedReport.value = rpt
}

function generateReport() {
  snack.value = true
  selectedReport.value = null
}

const recentReports = [
  { id: 1, name: 'รายงานคำขอประจำเดือน ม.ค. 2568',         period: '1–15 ม.ค. 68', format: 'PDF',          icon: 'fas fa-file-pdf',  color: 'error',   generatedAt: '15 ม.ค. 68 09:30' },
  { id: 2, name: 'รายงานใบรับรองที่ออกในไตรมาส 1/2568',    period: 'ต.ค.–ธ.ค. 67', format: 'Excel (.xlsx)', icon: 'fas fa-file-excel', color: 'success', generatedAt: '1 ม.ค. 68 10:00' },
  { id: 3, name: 'รายงานการตรวจแปลงเดือน ธ.ค. 2567',       period: 'ธ.ค. 67',       format: 'PDF',          icon: 'fas fa-file-pdf',  color: 'error',   generatedAt: '2 ม.ค. 68 14:20' },
]
</script>

<style scoped>
.report-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
}
.report-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
}
.report-icon-box {
  width: 60px; height: 60px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
}
.recent-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
</style>
