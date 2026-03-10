<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">รายงาน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">สรุปผลการดำเนินงานระบบรับรองแหล่งผลิต GAP พืช</p>
      </div>
      <v-btn color="primary" prepend-icon="fas fa-download" variant="tonal">ดาวน์โหลดรายงาน</v-btn>
    </div>

    <v-row>
      <v-col v-for="card in reportCards" :key="card.title" cols="12" sm="6" lg="3">
        <AppStatCard v-bind="card" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <AppEmptyState
          icon="fas fa-chart-bar"
          title="อยู่ระหว่างพัฒนา"
          message="ระบบรายงานกำลังอยู่ระหว่างการพัฒนา จะเปิดใช้งานในเร็วๆ นี้"
          action-label="กลับหน้าแดชบอร์ด"
          @action="router.push('/app/dashboard')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppStatCard  from '@/components/common/AppStatCard.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'

const router = useRouter()

const reportCards = [
  { label: 'คำขอปีนี้',    value: 128, icon: 'fas fa-file-lines',   iconColor: 'primary', trend: 12.4, trendLabel: 'vs ปีที่แล้ว' },
  { label: 'ผ่านการรับรอง', value: 82,  icon: 'fas fa-certificate',  iconColor: 'success', trend: 8.1,  trendLabel: 'vs ปีที่แล้ว' },
  { label: 'ไม่ผ่าน',       value: 7,   icon: 'fas fa-circle-xmark', iconColor: 'error',   trend: -2.3, trendLabel: 'vs ปีที่แล้ว' },
  { label: 'หมดอายุ',       value: 19,  icon: 'fas fa-clock',        iconColor: 'warning', trend: 5.7,  trendLabel: 'vs ปีที่แล้ว' },
]
</script>
