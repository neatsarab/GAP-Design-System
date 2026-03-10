<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">แดชบอร์ด</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ภาพรวมระบบรับรองแหล่งผลิต GAP พืช · ข้อมูล ณ วันที่ 10 มี.ค. 2567</p>
      </div>
      <v-btn color="primary" prepend-icon="fas fa-file-pen" @click="router.push('/app/applications/new')">
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-4">
      <v-col v-for="card in statCards" :key="card.label" cols="12" sm="6" lg="3">
        <AppStatCard v-bind="card" />
      </v-col>
    </v-row>

    <!-- Recent + Status distribution -->
    <v-row>
      <!-- Recent Applications -->
      <v-col cols="12" lg="8">
        <v-card>
          <div class="d-flex align-center px-5 py-4 border-b">
            <v-icon icon="fas fa-clock-rotate-left" color="primary" size="16" class="mr-2" />
            <span class="text-subtitle-2 font-weight-bold">คำขอล่าสุด</span>
            <v-spacer />
            <v-btn variant="text" size="small" color="primary" append-icon="fas fa-arrow-right"
              @click="router.push('/app/applications')">ดูทั้งหมด</v-btn>
          </div>
          <v-data-table
            :headers="tableHeaders"
            :items="recentItems"
            density="comfortable"
            hide-default-footer
            hover
          >
            <template #item.status="{ item }">
              <AppStatusChip :status="item.status" size="small" />
            </template>
            <template #item.actions="{ item }">
              <v-btn icon size="x-small" variant="text" color="primary"
                @click="router.push(`/app/applications/${item.no}`)">
                <v-icon icon="fas fa-eye" size="14" />
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Status Pie -->
      <v-col cols="12" lg="4">
        <v-card class="h-100">
          <div class="d-flex align-center px-5 py-4 border-b">
            <v-icon icon="fas fa-circle-half-stroke" color="primary" size="16" class="mr-2" />
            <span class="text-subtitle-2 font-weight-bold">สัดส่วนสถานะ</span>
          </div>
          <v-card-text class="pa-4">
            <div v-for="item in statusDistribution" :key="item.status" class="mb-3">
              <div class="d-flex align-center justify-space-between mb-1">
                <AppStatusChip :status="item.status" size="x-small" />
                <span class="text-caption font-weight-bold">{{ item.count }}</span>
              </div>
              <v-progress-linear
                :model-value="(item.count / totalApps) * 100"
                :color="item.color"
                height="6"
                rounded
                bg-color="surface-variant"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick actions -->
    <v-row class="mt-2">
      <v-col v-for="action in quickActions" :key="action.title" cols="12" sm="6" md="4">
        <v-card hover class="quick-action-card" @click="router.push(action.to)">
          <v-card-text class="d-flex align-center ga-3 pa-4">
            <div class="action-icon-box" :style="`background:rgba(var(--v-theme-${action.color}),0.12)`">
              <v-icon :icon="action.icon" :color="action.color" size="20" />
            </div>
            <div>
              <div class="text-body-2 font-weight-bold">{{ action.title }}</div>
              <div class="text-caption text-medium-emphasis">{{ action.desc }}</div>
            </div>
            <v-spacer />
            <v-icon icon="fas fa-chevron-right" size="12" color="on-surface-variant" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppStatCard  from '@/components/common/AppStatCard.vue'
import AppStatusChip from '@/components/common/AppStatusChip.vue'
import type { GapStatus } from '@/types/gap-status.types'

const router = useRouter()

const statCards = [
  { label: 'คำขอทั้งหมด',         value: 128, icon: 'fas fa-copy',        iconColor: 'primary', trend: 12.4, trendLabel: 'vs เดือนที่แล้ว' },
  { label: 'รอดำเนินการ',         value: 34,  icon: 'fas fa-clock',        iconColor: 'warning', trend: -3.2, trendLabel: 'vs เดือนที่แล้ว' },
  { label: 'ผ่านการรับรอง',        value: 82,  icon: 'fas fa-circle-check', iconColor: 'success', trend: 8.1,  trendLabel: 'vs เดือนที่แล้ว' },
  { label: 'ใบรับรองที่ใช้งานอยู่', value: 76,  icon: 'fas fa-certificate',  iconColor: 'info',    trend: 5.7,  trendLabel: 'vs เดือนที่แล้ว' },
]

const tableHeaders = [
  { title: 'เลขที่คำขอ', key: 'no',      sortable: false },
  { title: 'เกษตรกร',    key: 'farmer',  sortable: false },
  { title: 'ชนิดพืช',    key: 'crop',    sortable: false },
  { title: 'สถานะ',      key: 'status',  sortable: false },
  { title: '',           key: 'actions', sortable: false },
]

const recentItems: { no: string; farmer: string; crop: string; status: GapStatus }[] = [
  { no: 'GAP-2567-001', farmer: 'นาย สมชาย ใจดี',      crop: 'ข้าวหอมมะลิ', status: 'DOC_REVIEW' },
  { no: 'GAP-2567-002', farmer: 'นาง มาลี เกษตรกิจ',   crop: 'มันสำปะหลัง', status: 'APPROVED' },
  { no: 'GAP-2567-003', farmer: 'นาย วิชัย ทำนา',      crop: 'อ้อย',         status: 'INSPECTING' },
  { no: 'GAP-2567-004', farmer: 'นาง สมศรี ปลูกผัก',   crop: 'ผักกาดขาว',   status: 'SUBMITTED' },
  { no: 'GAP-2567-005', farmer: 'นาย ประสิทธิ์ ไร่ดี',  crop: 'ข้าวโพด',     status: 'CERT_ISSUED' },
]

const statusDistribution: { status: GapStatus; count: number; color: string }[] = [
  { status: 'SUBMITTED',   count: 12, color: 'blue' },
  { status: 'DOC_REVIEW',  count: 8,  color: 'orange' },
  { status: 'INSPECTING',  count: 6,  color: 'indigo' },
  { status: 'APPROVED',    count: 45, color: 'success' },
  { status: 'CERT_ISSUED', count: 31, color: 'teal' },
  { status: 'REJECTED',    count: 7,  color: 'error' },
  { status: 'CERT_EXPIRED',count: 19, color: 'warning' },
]

const totalApps = computed(() => statusDistribution.reduce((s, i) => s + i.count, 0))

const quickActions = [
  { title: 'ยื่นคำขอใหม่',   desc: 'สร้างคำขอรับรอง GAP',       icon: 'fas fa-file-pen',      color: 'primary',   to: '/app/applications/new' },
  { title: 'รายการคำขอ',     desc: 'ดูและจัดการคำขอทั้งหมด',    icon: 'fas fa-file-lines',    color: 'info',      to: '/app/applications' },
  { title: 'ตั้งค่าระบบ',     desc: 'จัดการผู้ใช้และสิทธิ์',     icon: 'fas fa-gear',          color: 'secondary', to: '/app/settings' },
]
</script>

<style scoped>
.quick-action-card { cursor: pointer; transition: transform 0.15s ease; }
.quick-action-card:hover { transform: translateY(-2px); }
.action-icon-box {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
</style>
