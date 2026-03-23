<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="ds-subtitle mb-3">Breadcrumbs</div>
    <v-card class="mb-5">
      <v-card-text class="pa-5">
        <v-breadcrumbs :items="breadcrumbs" density="compact" class="pa-0">
          <template #divider>
            <v-icon icon="fas fa-chevron-right" size="10" />
          </template>
        </v-breadcrumbs>
      </v-card-text>
    </v-card>

    <!-- Pagination -->
    <div class="ds-subtitle mb-3">Pagination</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-column ga-4 align-center pa-5">
        <v-pagination v-model="currentPage" :length="8" rounded="circle" />
        <v-pagination v-model="currentPage" :length="8" rounded="circle" size="small" show-first-last-page />
        <div class="text-caption text-medium-emphasis">หน้า {{ currentPage }} จาก 8</div>
      </v-card-text>
    </v-card>

    <!-- Tabs -->
    <div class="ds-subtitle mb-3">Tabs</div>
    <v-card class="mb-5">
      <v-tabs v-model="activeTab" color="primary" bg-color="transparent">
        <v-tab value="all"      prepend-icon="fas fa-list">ทั้งหมด</v-tab>
        <v-tab value="pending"  prepend-icon="fas fa-clock">รอดำเนินการ</v-tab>
        <v-tab value="approved" prepend-icon="fas fa-circle-check">อนุมัติแล้ว</v-tab>
        <v-tab value="expired"  prepend-icon="fas fa-clock-rotate-left">หมดอายุ</v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="activeTab">
        <v-window-item v-for="t in tabItems" :key="t.value" :value="t.value">
          <v-card-text class="pa-5 text-center text-medium-emphasis">
            <v-icon :icon="t.icon" size="32" class="mb-2" />
            <div class="text-body-2">แท็บ: {{ t.label }}</div>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Button Toggle -->
    <div class="ds-subtitle mb-3">Button Toggle</div>
    <v-card>
      <v-card-text class="pa-5">
        <v-btn-toggle v-model="viewMode" color="primary" rounded="lg" mandatory>
          <v-btn value="list"  prepend-icon="fas fa-list">รายการ</v-btn>
          <v-btn value="grid"  prepend-icon="fas fa-grip">ตาราง</v-btn>
          <v-btn value="chart" prepend-icon="fas fa-chart-bar">กราฟ</v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref(1)
const activeTab   = ref('all')
const viewMode    = ref('list')

const breadcrumbs = [
  { title: 'หน้าหลัก',    href: '/' },
  { title: 'คำขอ GAP',    href: '/applications' },
  { title: 'GAP-2567-001' },
]

const tabItems = [
  { value: 'all',      label: 'ทั้งหมด',       icon: 'fas fa-list' },
  { value: 'pending',  label: 'รอดำเนินการ',   icon: 'fas fa-clock' },
  { value: 'approved', label: 'อนุมัติแล้ว',    icon: 'fas fa-circle-check' },
  { value: 'expired',  label: 'หมดอายุ',        icon: 'fas fa-clock-rotate-left' },
]
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary)); opacity: 0.75;
}
</style>
