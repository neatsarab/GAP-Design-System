<template>
  <div>
    <!-- All statuses -->
    <div class="ds-subtitle mb-3">ทุกสถานะ (default size)</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-2 pa-5">
        <AppStatusChip v-for="s in gapStatusList" :key="s" :status="s" />
      </v-card-text>
    </v-card>

    <!-- Sizes -->
    <div class="ds-subtitle mb-3">Sizes</div>
    <v-card class="mb-5">
      <v-card-text class="pa-5">
        <div v-for="size in sizes" :key="size" class="d-flex align-center ga-3 mb-3">
          <span class="text-caption text-medium-emphasis" style="min-width:60px">{{ size }}</span>
          <div class="d-flex flex-wrap ga-2">
            <AppStatusChip
              v-for="s in ['DRAFT','APPROVED','REJECTED','CERT_ISSUED']"
              :key="s"
              :status="s"
              :size="size"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- showIcon / showLabel -->
    <div class="ds-subtitle mb-3">Icon & Label Variants</div>
    <v-card class="mb-5">
      <v-card-text class="pa-5">
        <div class="d-flex flex-column ga-4">
          <div class="d-flex align-center ga-3">
            <span class="text-caption text-medium-emphasis" style="min-width:120px">icon + label</span>
            <div class="d-flex flex-wrap ga-2">
              <AppStatusChip v-for="s in sampleStatuses" :key="s" :status="s" :show-icon="true"  :show-label="true"  />
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <span class="text-caption text-medium-emphasis" style="min-width:120px">icon only</span>
            <div class="d-flex flex-wrap ga-2">
              <AppStatusChip v-for="s in sampleStatuses" :key="s" :status="s" :show-icon="true"  :show-label="false" />
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <span class="text-caption text-medium-emphasis" style="min-width:120px">label only</span>
            <div class="d-flex flex-wrap ga-2">
              <AppStatusChip v-for="s in sampleStatuses" :key="s" :status="s" :show-icon="false" :show-label="true"  />
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- In Data Table -->
    <div class="ds-subtitle mb-3">ใน Data Table</div>
    <v-data-table
      :headers="headers"
      :items="rows"
      density="comfortable"
      hover
    >
      <template #item.status="{ item }">
        <AppStatusChip :status="item.status" size="small" show-tooltip />
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import AppStatusChip from '@/components/common/AppStatusChip.vue'

const gapStatusList = [
  'DRAFT', 'SUBMITTED', 'DOC_REVIEW', 'INSPECTION_SCHEDULED',
  'INSPECTING', 'APPROVED', 'REJECTED', 'CANCELLED', 'CERT_ISSUED', 'CERT_EXPIRED',
]

const sampleStatuses = ['DRAFT', 'APPROVED', 'REJECTED', 'CERT_ISSUED', 'CERT_EXPIRED']

const sizes = ['x-small', 'small', 'default', 'large']

const headers = [
  { title: 'เลขที่คำขอ', key: 'no' },
  { title: 'เกษตรกร',    key: 'farmer' },
  { title: 'สถานะ',      key: 'status' },
]

const rows = [
  { no: 'GAP-2567-001', farmer: 'นาย สมชาย ใจดี',    status: 'DOC_REVIEW'   },
  { no: 'GAP-2567-002', farmer: 'นาง มาลี เกษตรกิจ', status: 'APPROVED'     },
  { no: 'GAP-2567-003', farmer: 'นาย วิชัย ทำนา',    status: 'CERT_EXPIRED' },
  { no: 'GAP-2567-004', farmer: 'นาง สมศรี ปลูกผัก', status: 'REJECTED'     },
  { no: 'GAP-2567-005', farmer: 'นาย ประสิทธิ์ ไร่ดี', status: 'CERT_ISSUED' },
  { no: 'GAP-2567-006', farmer: 'นาย อภิชาติ นาดี',  status: 'INSPECTING'   },
]
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary)); opacity: 0.75;
}
</style>
