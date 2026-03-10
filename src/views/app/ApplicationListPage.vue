<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">รายการคำขอ GAP</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">จัดการและติดตามคำขอรับรองแหล่งผลิตทั้งหมด</p>
      </div>
      <v-btn color="primary" prepend-icon="fas fa-file-pen" @click="router.push('/app/applications/new')">
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Filter Bar -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5" md="4">
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขที่คำขอ, ชื่อเกษตรกร..."
              prepend-inner-icon="fas fa-magnifying-glass"
              variant="outlined" density="compact"
              hide-details clearable
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="filterStatus"
              :items="statusFilterItems"
              item-title="label" item-value="value"
              placeholder="กรองตามสถานะ"
              prepend-inner-icon="fas fa-filter"
              variant="outlined" density="compact"
              hide-details clearable
            />
          </v-col>
          <v-col cols="12" sm="3" md="2">
            <v-select
              v-model="filterProvince"
              :items="provinces"
              placeholder="จังหวัด"
              prepend-inner-icon="fas fa-map"
              variant="outlined" density="compact"
              hide-details clearable
            />
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <v-btn-toggle v-model="viewMode" color="primary" density="compact" rounded="lg" mandatory>
              <v-btn value="table" icon="fas fa-table-list" size="small" />
              <v-btn value="card"  icon="fas fa-grip"       size="small" />
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Status Tab Bar -->
    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="all">ทั้งหมด <v-chip class="ml-2" size="x-small" color="primary" variant="tonal">{{ items.length }}</v-chip></v-tab>
      <v-tab value="pending">รอดำเนินการ <v-chip class="ml-2" size="x-small" color="warning" variant="tonal">{{ pendingCount }}</v-chip></v-tab>
      <v-tab value="approved">อนุมัติแล้ว <v-chip class="ml-2" size="x-small" color="success" variant="tonal">{{ approvedCount }}</v-chip></v-tab>
      <v-tab value="expired">หมดอายุ <v-chip class="ml-2" size="x-small" color="error" variant="tonal">{{ expiredCount }}</v-chip></v-tab>
    </v-tabs>

    <!-- Table View -->
    <v-card v-if="viewMode === 'table'">
      <v-data-table
        :headers="tableHeaders"
        :items="filteredItems"
        :search="search"
        density="comfortable"
        hover
        items-per-page="10"
      >
        <template #item.status="{ item }">
          <AppStatusChip :status="item.status" size="small" show-tooltip />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon size="x-small" variant="text" color="primary"
                  @click="router.push(`/app/applications/${item.no}`)">
                  <v-icon icon="fas fa-eye" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="แก้ไข" location="top">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon size="x-small" variant="text" color="info">
                  <v-icon icon="fas fa-pencil" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="ดาวน์โหลด" location="top">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon size="x-small" variant="text" color="success">
                  <v-icon icon="fas fa-download" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Card View -->
    <v-row v-else>
      <v-col v-for="item in filteredItems" :key="item.no" cols="12" sm="6" lg="4">
        <v-card hover class="app-card" @click="router.push(`/app/applications/${item.no}`)">
          <v-card-text class="pa-4">
            <div class="d-flex align-start justify-space-between mb-3">
              <div>
                <div class="text-body-2 font-weight-bold text-primary">{{ item.no }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.date }}</div>
              </div>
              <AppStatusChip :status="item.status" size="small" />
            </div>
            <div class="text-body-2 font-weight-medium mb-1">{{ item.farmer }}</div>
            <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
              <v-icon icon="fas fa-seedling" size="12" />{{ item.crop }}
              <v-icon icon="fas fa-map-pin" size="12" class="ml-2" />{{ item.province }}
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions class="px-4 py-2">
            <v-btn size="x-small" variant="text" color="primary" prepend-icon="fas fa-eye">รายละเอียด</v-btn>
            <v-spacer />
            <v-btn size="x-small" variant="text" color="info" icon="fas fa-pencil" />
            <v-btn size="x-small" variant="text" color="success" icon="fas fa-download" />
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col v-if="filteredItems.length === 0" cols="12">
        <AppEmptyState
          icon="fas fa-file-circle-xmark"
          title="ไม่พบคำขอ"
          message="ลองเปลี่ยนตัวกรองหรือค้นหาด้วยคำอื่น"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppStatusChip from '@/components/common/AppStatusChip.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import type { GapStatus } from '@/types/gap-status.types'

const router = useRouter()
const search         = ref('')
const filterStatus   = ref<string | null>(null)
const filterProvince = ref<string | null>(null)
const viewMode       = ref<'table' | 'card'>('table')
const activeTab      = ref('all')

const statusFilterItems = [
  { label: 'ร่าง',           value: 'DRAFT' },
  { label: 'ยื่นแล้ว',       value: 'SUBMITTED' },
  { label: 'ตรวจเอกสาร',    value: 'DOC_REVIEW' },
  { label: 'นัดตรวจ',        value: 'INSPECTION_SCHEDULED' },
  { label: 'กำลังตรวจ',     value: 'INSPECTING' },
  { label: 'อนุมัติ',        value: 'APPROVED' },
  { label: 'ไม่ผ่าน',        value: 'REJECTED' },
  { label: 'ออกใบรับรอง',   value: 'CERT_ISSUED' },
  { label: 'หมดอายุ',        value: 'CERT_EXPIRED' },
]

const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ขอนแก่น', 'นครราชสีมา', 'สุพรรณบุรี', 'เพชรบูรณ์']

const tableHeaders = [
  { title: 'เลขที่คำขอ', key: 'no',       sortable: true },
  { title: 'เกษตรกร',    key: 'farmer',   sortable: true },
  { title: 'ชนิดพืช',    key: 'crop',     sortable: true },
  { title: 'จังหวัด',    key: 'province', sortable: true },
  { title: 'วันที่ยื่น',  key: 'date',     sortable: true },
  { title: 'สถานะ',      key: 'status',   sortable: false },
  { title: '',           key: 'actions',  sortable: false },
]

const items: { no: string; farmer: string; crop: string; province: string; date: string; status: GapStatus }[] = [
  { no: 'GAP-2567-001', farmer: 'นาย สมชาย ใจดี',      crop: 'ข้าวหอมมะลิ', province: 'นครราชสีมา', date: '1 มี.ค. 67',  status: 'DOC_REVIEW' },
  { no: 'GAP-2567-002', farmer: 'นาง มาลี เกษตรกิจ',   crop: 'มันสำปะหลัง', province: 'ขอนแก่น',    date: '3 มี.ค. 67',  status: 'APPROVED' },
  { no: 'GAP-2567-003', farmer: 'นาย วิชัย ทำนา',      crop: 'อ้อย',         province: 'สุพรรณบุรี', date: '5 มี.ค. 67',  status: 'INSPECTING' },
  { no: 'GAP-2567-004', farmer: 'นาง สมศรี ปลูกผัก',   crop: 'ผักกาดขาว',   province: 'เชียงใหม่',  date: '7 มี.ค. 67',  status: 'SUBMITTED' },
  { no: 'GAP-2567-005', farmer: 'นาย ประสิทธิ์ ไร่ดี',  crop: 'ข้าวโพด',     province: 'เพชรบูรณ์',  date: '9 มี.ค. 67',  status: 'CERT_ISSUED' },
  { no: 'GAP-2567-006', farmer: 'นาย อภิชาติ นาดี',    crop: 'มะเขือเทศ',   province: 'เชียงใหม่',  date: '10 มี.ค. 67', status: 'DRAFT' },
  { no: 'GAP-2567-007', farmer: 'นาง วิไล ทุ่งนา',     crop: 'ข้าวหอมมะลิ', province: 'ขอนแก่น',    date: '11 มี.ค. 67', status: 'REJECTED' },
  { no: 'GAP-2567-008', farmer: 'นาย ชัยวัฒน์ เกษม',   crop: 'ข้าวโพด',     province: 'นครราชสีมา', date: '12 มี.ค. 67', status: 'CERT_EXPIRED' },
  { no: 'GAP-2567-009', farmer: 'นาง สุดา ไร่สวย',     crop: 'อ้อย',         province: 'สุพรรณบุรี', date: '13 มี.ค. 67', status: 'INSPECTION_SCHEDULED' },
  { no: 'GAP-2567-010', farmer: 'นาย สมศักดิ์ ผืนนา',  crop: 'มันสำปะหลัง', province: 'เพชรบูรณ์',  date: '14 มี.ค. 67', status: 'APPROVED' },
]

const pendingStatuses: GapStatus[] = ['SUBMITTED', 'DOC_REVIEW', 'INSPECTION_SCHEDULED', 'INSPECTING']
const approvedStatuses: GapStatus[] = ['APPROVED', 'CERT_ISSUED']
const expiredStatuses: GapStatus[] = ['CERT_EXPIRED', 'REJECTED', 'CANCELLED']

const pendingCount  = computed(() => items.filter(i => pendingStatuses.includes(i.status)).length)
const approvedCount = computed(() => items.filter(i => approvedStatuses.includes(i.status)).length)
const expiredCount  = computed(() => items.filter(i => expiredStatuses.includes(i.status)).length)

const filteredItems = computed(() => {
  let result = items

  if (activeTab.value === 'pending')  result = result.filter(i => pendingStatuses.includes(i.status))
  if (activeTab.value === 'approved') result = result.filter(i => approvedStatuses.includes(i.status))
  if (activeTab.value === 'expired')  result = result.filter(i => expiredStatuses.includes(i.status))

  if (filterStatus.value)   result = result.filter(i => i.status === filterStatus.value)
  if (filterProvince.value) result = result.filter(i => i.province === filterProvince.value)

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(i =>
      i.no.toLowerCase().includes(q) || i.farmer.toLowerCase().includes(q)
    )
  }

  return result
})
</script>

<style scoped>
.app-card { cursor: pointer; transition: transform 0.15s ease; }
.app-card:hover { transform: translateY(-2px); }
</style>
