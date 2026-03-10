<template>
  <div>
    <!-- Timeline -->
    <div class="ds-subtitle mb-3">Activity Timeline</div>
    <v-card class="mb-6">
      <v-card-text class="pa-5">
        <AppTimeline :items="timelineItems" />
      </v-card-text>
    </v-card>

    <!-- Badges -->
    <div class="ds-subtitle mb-3">Badges</div>
    <v-card class="mb-6">
      <v-card-text class="d-flex flex-wrap ga-6 align-center pa-5">
        <v-badge content="4" color="error">
          <v-btn icon variant="tonal" color="primary">
            <v-icon icon="fas fa-bell" />
          </v-btn>
        </v-badge>
        <v-badge content="99+" color="primary">
          <v-btn icon variant="tonal" color="grey">
            <v-icon icon="fas fa-envelope" />
          </v-btn>
        </v-badge>
        <v-badge color="success" dot>
          <v-avatar color="primary" size="40">
            <v-icon icon="fas fa-user" />
          </v-avatar>
        </v-badge>
        <v-badge content="NEW" color="secondary" inline>
          <v-chip color="primary" variant="tonal">คำขอใหม่</v-chip>
        </v-badge>
      </v-card-text>
    </v-card>

    <!-- Rating -->
    <div class="ds-subtitle mb-3">Rating</div>
    <v-card>
      <v-card-text class="d-flex flex-column ga-3 pa-5">
        <div class="d-flex align-center ga-4">
          <v-rating v-model="rating" color="warning" active-color="warning" density="compact" />
          <span class="text-body-2 text-medium-emphasis">{{ rating }} / 5 ดาว</span>
        </div>
        <div class="d-flex align-center ga-4">
          <v-rating v-model="rating" color="warning" active-color="warning" size="small" half-increments />
          <span class="text-caption text-medium-emphasis">half-increments</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppTimeline, { type TimelineItem } from '@/components/common/AppTimeline.vue'

const rating = ref(4)

const timelineItems: TimelineItem[] = [
  { id: '1', title: 'ยื่นคำขอ',            description: 'สร้างคำขอ GAP-2567-001234',     date: '1 มี.ค. 67',  icon: 'fas fa-paper-plane',  iconColor: 'grey' },
  { id: '2', title: 'ตรวจเอกสาร',          description: 'เจ้าหน้าที่รับเรื่องแล้ว',        date: '3 มี.ค. 67',  icon: 'fas fa-file-magnifying-glass', iconColor: 'orange' },
  { id: '3', title: 'นัดตรวจแปลง',         description: 'วันที่ 15 มี.ค. เวลา 09:00',     date: '8 มี.ค. 67',  icon: 'fas fa-calendar-check', iconColor: 'purple' },
  { id: '4', title: 'ตรวจประเมินแปลง',     description: 'ผ่านเกณฑ์ 7/8 หมวด',            date: '15 มี.ค. 67', icon: 'fas fa-clipboard-check', iconColor: 'indigo' },
  { id: '5', title: 'อนุมัติ & ออกใบรับรอง', description: 'GAP-C-2567-0089 อายุ 1 ปี',  date: '20 มี.ค. 67', icon: 'fas fa-certificate',  iconColor: 'success' },
]
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary)); opacity: 0.75;
}
</style>
