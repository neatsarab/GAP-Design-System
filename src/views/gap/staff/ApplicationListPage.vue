<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">{{ pageTitle }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">จัดการคำขอรับรองมาตรฐาน GAP แบบเดี่ยว</p>
      </div>
      <v-btn color="primary" prepend-icon="fas fa-file-pen" @click="router.push('/gap/staff/applications/new')">
        ยื่นคำขอรับรองใหม่
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              label="ค้นหาเลขที่คำขอ / ชื่อผู้ยื่น"
              prepend-inner-icon="fas fa-search"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="6" sm="2">
            <v-select
              v-model="filterType"
              label="ประเภทคำขอ"
              :items="typeOptions"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="2">
            <v-select
              v-model="filterCert"
              label="ประเภทใบรับรอง"
              :items="certOptions"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="filterStatus"
              label="สถานะ"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="auto" class="d-flex align-self-center">
            <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left" @click="clearFilters">
              ล้างตัวกรอง
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Status quick-filter tabs -->
    <v-chip-group v-model="activeTab" class="mb-4" selected-class="v-chip--selected" mandatory>
      <v-chip
        v-for="tab in statusTabs" :key="tab.value"
        :value="tab.value"
        :color="tab.color"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start :icon="tab.icon" size="12" />
        {{ tab.label }}
        <v-badge v-if="tab.count" :content="tab.count" inline color="error" class="ml-1" />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        hover
        @click:row="onRowClick"
      >
        <!-- Request No -->
        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-medium text-primary">{{ item.requestNo }}</span>
        </template>

        <!-- Type -->
        <template #item.type="{ item }">
          <v-chip size="x-small" :color="item.type === 'individual' ? 'primary' : 'secondary'" variant="tonal">
            <v-icon start :icon="item.type === 'individual' ? 'fas fa-user' : 'fas fa-users'" size="10" />
            {{ item.type === 'individual' ? 'เดี่ยว' : 'กลุ่ม' }}
          </v-chip>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip size="small" :color="getStatusColor(item.status)" variant="tonal" :prepend-icon="getStatusIcon(item.status)">
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/staff/applications/${item.id}`)"
          >
            ดูรายละเอียด
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route  = useRoute()

// Page title from route meta
const pageTitle = computed(() => {
  const meta = route.meta as Record<string, unknown>
  if (meta.statusFilter === 'scheduling')  return 'นัดตรวจแปลง'
  if (meta.statusFilter === 'inspected')   return 'ผลการตรวจแปลง'
  if (meta.statusFilter === 'pending_cc')  return 'เสนอแปลงต่อ CC'
  if (meta.statusFilter === 'cc_reviewing') return 'บันทึกผลจาก CC'
  return 'รายการคำขอรับรอง GAP'
})

// Filters
const search       = ref('')
const filterType   = ref<string | null>(null)
const filterCert   = ref<string | null>(null)
const filterStatus = ref<string | null>((route.meta as Record<string, unknown>).statusFilter as string | null ?? null)
const activeTab    = ref<string>('all')

function onRowClick(_e: unknown, row: { item: ApplicationRow }) {
  router.push(`/staff/applications/${row.item.id}`)
}

function clearFilters() {
  search.value       = ''
  filterType.value   = null
  filterCert.value   = null
  filterStatus.value = null
  activeTab.value    = 'all'
}

const typeOptions = ['เดี่ยว', 'กลุ่ม']
const certOptions = ['มกษ. 9001', 'มกษ. 3502']
const statusOptions = [
  { label: 'รอตรวจคำขอ',       value: 'reviewing'    },
  { label: 'รอนัดตรวจแปลง',   value: 'scheduling'   },
  { label: 'อยู่ระหว่างตรวจแปลง', value: 'inspecting' },
  { label: 'ตรวจแปลงแล้ว',    value: 'inspected'    },
  { label: 'รอเสนอ CC',        value: 'pending_cc'   },
  { label: 'อยู่ระหว่าง CC',   value: 'cc_reviewing' },
  { label: 'อนุมัติแล้ว',      value: 'approved'     },
  { label: 'ออกใบรับรองแล้ว', value: 'cert_issued'  },
  { label: 'ไม่อนุมัติ',       value: 'rejected'     },
]

const statusTabs = [
  { label: 'ทั้งหมด',          value: 'all',         color: 'default',   icon: 'fas fa-list',           count: 0  },
  { label: 'รอตรวจคำขอ',      value: 'reviewing',   color: 'warning',   icon: 'fas fa-magnifying-glass', count: 7 },
  { label: 'รอนัดตรวจแปลง',  value: 'scheduling',  color: 'info',      icon: 'fas fa-calendar-clock',  count: 5 },
  { label: 'ตรวจแปลงแล้ว',   value: 'inspected',   color: 'secondary', icon: 'fas fa-clipboard-check', count: 4 },
  { label: 'รอ CC',            value: 'pending_cc',  color: 'error',     icon: 'fas fa-gavel',           count: 6 },
  { label: 'อนุมัติ/ออกแล้ว', value: 'done',        color: 'success',   icon: 'fas fa-certificate',     count: 0 },
]

// Mock data
interface ApplicationRow {
  id: string
  requestNo: string
  farmerName: string
  certType: string
  type: 'individual' | 'group'
  submittedAt: string
  status: string
  crop: string
  province: string
}

const allApplications: ApplicationRow[] = [
  { id: 'APP-001', requestNo: 'GAP-2568-00041', farmerName: 'นายสมชาย ใจดี',       certType: 'มกษ. 9001', type: 'individual', submittedAt: '15 ม.ค. 68', status: 'reviewing',    crop: 'มะม่วง',     province: 'เชียงใหม่' },
  { id: 'APP-002', requestNo: 'GAP-2568-00039', farmerName: 'น.ส.วิไล สุขใส',       certType: 'มกษ. 9001', type: 'individual', submittedAt: '13 ม.ค. 68', status: 'scheduling',   crop: 'ข้าวโพดหวาน', province: 'เพชรบูรณ์' },
  { id: 'APP-003', requestNo: 'GAP-2568-00036', farmerName: 'นายประสิทธิ์ มั่นคง', certType: 'มกษ. 9001', type: 'individual', submittedAt: '10 ม.ค. 68', status: 'pending_cc',   crop: 'กล้วยหอม',   province: 'นครปฐม'   },
  { id: 'APP-004', requestNo: 'GAP-2568-00034', farmerName: 'น.ส.มาลี รุ่งเรือง',  certType: 'มกษ. 3502', type: 'individual', submittedAt: '8 ม.ค. 68',  status: 'cc_reviewing', crop: 'ลำไย',        province: 'เชียงราย' },
  { id: 'APP-005', requestNo: 'GAP-2568-00042', farmerName: 'นายอำนาจ วีระชัย',    certType: 'มกษ. 9001', type: 'individual', submittedAt: '15 ม.ค. 68', status: 'reviewing',    crop: 'พริก',        province: 'สระแก้ว'  },
  { id: 'APP-006', requestNo: 'GAP-2568-00040', farmerName: 'นายชัยพร ดีงาม',       certType: 'มกษ. 9001', type: 'individual', submittedAt: '14 ม.ค. 68', status: 'inspecting',   crop: 'ส้มโอ',       province: 'นครศรีธรรมราช' },
  { id: 'APP-007', requestNo: 'GAP-2568-00038', farmerName: 'น.ส.รัตนา พงศ์ไพร',   certType: 'มกษ. 9001', type: 'individual', submittedAt: '12 ม.ค. 68', status: 'inspected',    crop: 'กระเทียม',   province: 'เชียงใหม่' },
  { id: 'APP-008', requestNo: 'GAP-2568-00035', farmerName: 'นายสุรชัย แสงทอง',    certType: 'มกษ. 9001', type: 'individual', submittedAt: '9 ม.ค. 68',  status: 'approved',     crop: 'ฝรั่ง',       province: 'กาญจนบุรี' },
  { id: 'APP-009', requestNo: 'GAP-2568-00033', farmerName: 'นายพิชัย ชมพู',        certType: 'มกษ. 9001', type: 'individual', submittedAt: '7 ม.ค. 68',  status: 'cert_issued',  crop: 'มะนาว',       province: 'นครปฐม'   },
  { id: 'APP-010', requestNo: 'GAP-2568-00030', farmerName: 'น.ส.ศิริพร เกษตรดี',  certType: 'มกษ. 3502', type: 'individual', submittedAt: '3 ม.ค. 68',  status: 'rejected',     crop: 'ขมิ้น',       province: 'สุราษฎร์ธานี' },
]

const filteredItems = computed(() => {
  let items = allApplications
  if (filterType.value)   items = items.filter(i => (filterType.value === 'เดี่ยว' ? i.type === 'individual' : i.type === 'group'))
  if (filterCert.value)   items = items.filter(i => i.certType === filterCert.value)
  if (filterStatus.value) items = items.filter(i => i.status === filterStatus.value)
  if (activeTab.value && activeTab.value !== 'all') {
    if (activeTab.value === 'done') {
      items = items.filter(i => i.status === 'approved' || i.status === 'cert_issued')
    } else {
      items = items.filter(i => i.status === activeTab.value)
    }
  }
  return items
})

const headers = [
  { title: 'เลขที่คำขอ',    key: 'requestNo',   width: 160 },
  { title: 'ชื่อผู้ยื่นคำขอ', key: 'farmerName',  width: 180 },
  { title: 'พืช',            key: 'crop',        width: 120 },
  { title: 'จังหวัด',        key: 'province',    width: 130 },
  { title: 'ประเภทใบรับรอง', key: 'certType',    width: 130 },
  { title: 'ประเภทคำขอ',    key: 'type',        width: 100 },
  { title: 'วันที่ยื่น',     key: 'submittedAt', width: 120 },
  { title: 'สถานะ',          key: 'status',      width: 160 },
  { title: '',               key: 'actions',     width: 130, sortable: false },
]

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    reviewing:    'warning',
    scheduling:   'info',
    inspecting:   'secondary',
    inspected:    'secondary',
    pending_cc:   'primary',
    cc_reviewing: 'error',
    approved:     'success',
    cert_issued:  'success',
    rejected:     'error',
  }
  return map[status] ?? 'grey'
}

function getStatusIcon(status: string): string {
  const map: Record<string, string> = {
    reviewing:    'fas fa-magnifying-glass',
    scheduling:   'fas fa-calendar-clock',
    inspecting:   'fas fa-person-walking',
    inspected:    'fas fa-clipboard-check',
    pending_cc:   'fas fa-paper-plane',
    cc_reviewing: 'fas fa-gavel',
    approved:     'fas fa-circle-check',
    cert_issued:  'fas fa-certificate',
    rejected:     'fas fa-circle-xmark',
  }
  return map[status] ?? 'fas fa-circle'
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    reviewing:    'รอตรวจคำขอ',
    scheduling:   'รอนัดตรวจแปลง',
    inspecting:   'อยู่ระหว่างตรวจแปลง',
    inspected:    'ตรวจแปลงแล้ว',
    pending_cc:   'รอเสนอ CC',
    cc_reviewing: 'อยู่ระหว่าง CC',
    approved:     'อนุมัติแล้ว',
    cert_issued:  'ออกใบรับรองแล้ว',
    rejected:     'ไม่อนุมัติ',
  }
  return map[status] ?? status
}
</script>
