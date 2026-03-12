<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">ข้อมูลใบรับรอง GAP</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">รายการใบรับรองมาตรฐานการปฏิบัติทางการเกษตรที่ดีที่ออกแล้ว</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="gap-staff" prepend-icon="fas fa-download">ส่งออก Excel</v-btn>
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in certStats" :key="s.label" cols="6" sm="3">
        <v-card>
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div class="cert-stat-icon" :style="`background:rgba(var(--v-theme-${s.color}),0.12)`">
              <v-icon :icon="s.icon" :color="s.color" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">{{ s.value }}</div>
              <div class="text-caption text-medium-emphasis">{{ s.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field v-model="search" label="ค้นหาเลขที่ใบรับรอง / ชื่อ" prepend-inner-icon="fas fa-search" clearable hide-details />
          </v-col>
          <v-col cols="6" sm="2">
            <v-select v-model="filterStatus" label="สถานะ" :items="['มีผล', 'ใกล้หมดอายุ', 'หมดอายุ']" clearable hide-details />
          </v-col>
          <v-col cols="6" sm="2">
            <v-select v-model="filterCert" label="ประเภทใบรับรอง" :items="['มกษ. 9001', 'มกษ. 3502']" clearable hide-details />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card>
      <v-data-table :headers="headers" :items="filteredCerts" :search="search" hover>
        <template #item.certNo="{ item }">
          <span class="text-body-2 font-weight-medium text-primary">{{ item.certNo }}</span>
        </template>
        <template #item.status="{ item }">
          <v-chip size="small" :color="getCertStatusColor(item.status)" variant="tonal" :prepend-icon="getCertStatusIcon(item.status)">
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn size="small" variant="text" color="gap-staff" icon="fas fa-eye" />
            <v-btn size="small" variant="text" color="success" icon="fas fa-download" />
            <v-btn size="small" variant="text" color="warning" icon="fas fa-print" />
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const search       = ref('')
const filterStatus = ref<string | null>(null)
const filterCert   = ref<string | null>(null)

const certStats = [
  { label: 'ใบรับรองทั้งหมด',   icon: 'fas fa-certificate',          color: 'primary',  value: 42 },
  { label: 'มีผล',               icon: 'fas fa-circle-check',         color: 'success',  value: 35 },
  { label: 'ใกล้หมดอายุ (30 วัน)', icon: 'fas fa-triangle-exclamation', color: 'warning',  value: 4  },
  { label: 'หมดอายุ',            icon: 'fas fa-clock',                color: 'error',    value: 3  },
]

const certificates = [
  { certNo: 'GAP-CERT-2568-0035', farmerName: 'นายสมชาย ใจดี',       crop: 'มะม่วง',     area: 12, province: 'เชียงใหม่',    certType: 'มกษ. 9001', issuedDate: '20 พ.ย. 67', expiryDate: '19 พ.ย. 68', status: 'มีผล' },
  { certNo: 'GAP-CERT-2568-0034', farmerName: 'น.ส.รัตนา พงศ์ไพร',  crop: 'กระเทียม',   area: 6,  province: 'เชียงใหม่',    certType: 'มกษ. 9001', issuedDate: '18 พ.ย. 67', expiryDate: '17 ก.พ. 68', status: 'ใกล้หมดอายุ' },
  { certNo: 'GAP-CERT-2568-0033', farmerName: 'นายสุรชัย แสงทอง',   crop: 'ฝรั่ง',      area: 8,  province: 'กาญจนบุรี',    certType: 'มกษ. 9001', issuedDate: '15 พ.ย. 67', expiryDate: '14 พ.ย. 68', status: 'มีผล' },
  { certNo: 'GAP-CERT-2568-0030', farmerName: 'นายพิชัย ชมพู',       crop: 'มะนาว',      area: 5,  province: 'นครปฐม',       certType: 'มกษ. 9001', issuedDate: '1 พ.ย. 67',  expiryDate: '31 ต.ค. 68', status: 'มีผล' },
  { certNo: 'GAP-CERT-2567-0120', farmerName: 'นายอำนาจ วีระชัย',   crop: 'พริก',        area: 5,  province: 'สระแก้ว',      certType: 'มกษ. 9001', issuedDate: '5 ม.ค. 67',  expiryDate: '4 ม.ค. 68',  status: 'หมดอายุ' },
  { certNo: 'GAP-CERT-2568-0032', farmerName: 'น.ส.มาลี รุ่งเรือง', crop: 'ลำไย',        area: 30, province: 'เชียงราย',     certType: 'มกษ. 3502', issuedDate: '10 พ.ย. 67', expiryDate: '9 พ.ย. 68',  status: 'มีผล' },
  { certNo: 'GAP-CERT-2568-0031', farmerName: 'นายชัยพร ดีงาม',      crop: 'ส้มโอ',       area: 15, province: 'นครศรีธรรมราช', certType: 'มกษ. 9001', issuedDate: '8 พ.ย. 67',  expiryDate: '7 ก.พ. 68',  status: 'ใกล้หมดอายุ' },
]

const filteredCerts = computed(() => {
  let items = certificates
  if (filterStatus.value) items = items.filter(i => i.status === filterStatus.value)
  if (filterCert.value)   items = items.filter(i => i.certType === filterCert.value)
  return items
})

const headers = [
  { title: 'เลขที่ใบรับรอง',     key: 'certNo',      width: 180 },
  { title: 'ชื่อเกษตรกร',        key: 'farmerName',  width: 180 },
  { title: 'พืช',                 key: 'crop',        width: 110 },
  { title: 'พื้นที่ (ไร่)',       key: 'area',        width: 100 },
  { title: 'จังหวัด',             key: 'province',    width: 130 },
  { title: 'ประเภทใบรับรอง',     key: 'certType',    width: 130 },
  { title: 'วันที่ออก',           key: 'issuedDate',  width: 120 },
  { title: 'วันหมดอายุ',          key: 'expiryDate',  width: 120 },
  { title: 'สถานะ',               key: 'status',      width: 140 },
  { title: '',                    key: 'actions',     width: 120, sortable: false },
]

function getCertStatusColor(s: string) {
  return s === 'มีผล' ? 'success' : s === 'ใกล้หมดอายุ' ? 'warning' : 'error'
}
function getCertStatusIcon(s: string) {
  return s === 'มีผล' ? 'fas fa-circle-check' : s === 'ใกล้หมดอายุ' ? 'fas fa-triangle-exclamation' : 'fas fa-clock'
}
</script>

<style scoped>
.cert-stat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
</style>
