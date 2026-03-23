<template>
  <div>
    <!-- Chip Variants -->
    <div class="ds-subtitle mb-3">Chip Variants</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-chip color="primary" variant="elevated">elevated</v-chip>
        <v-chip color="primary" variant="tonal">tonal</v-chip>
        <v-chip color="primary" variant="outlined">outlined</v-chip>
        <v-chip color="primary" variant="text">text</v-chip>
        <v-chip color="primary" variant="flat">flat</v-chip>
      </v-card-text>
    </v-card>

    <!-- Sizes -->
    <div class="ds-subtitle mb-3">Sizes</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-chip color="primary" size="x-small">x-small</v-chip>
        <v-chip color="primary" size="small">small</v-chip>
        <v-chip color="primary" size="default">default</v-chip>
        <v-chip color="primary" size="large">large</v-chip>
      </v-card-text>
    </v-card>

    <!-- With Icons & Closable -->
    <div class="ds-subtitle mb-3">Icons & Closable</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-chip color="primary" prepend-icon="fas fa-leaf" variant="tonal">เกษตรอินทรีย์</v-chip>
        <v-chip color="success" prepend-icon="fas fa-circle-check" variant="tonal">อนุมัติ</v-chip>
        <v-chip color="error"   prepend-icon="fas fa-circle-xmark" variant="tonal">ไม่ผ่าน</v-chip>
        <v-chip color="warning" closable variant="tonal">ปิดได้ (closable)</v-chip>
        <v-chip label color="info" variant="tonal">label chip</v-chip>
      </v-card-text>
    </v-card>

    <!-- Application Status Colors -->
    <div class="ds-subtitle mb-3">Application Status Colors</div>
    <v-card>
      <v-card-text class="pa-5">
        <div class="d-flex flex-wrap ga-3 mb-4">
          <v-chip
            v-for="s in allStatuses"
            :key="s.status"
            :color="s.color"
            :prepend-icon="s.icon"
            variant="tonal"
            size="small"
            label
          >
            {{ s.label }}
          </v-chip>
        </div>
        <v-divider class="my-4" />
        <div class="ds-subtitle mb-3">AppStatusChip Component</div>
        <div class="d-flex flex-wrap ga-2">
          <AppStatusChip
            v-for="status in gapStatusList"
            :key="status"
            :status="status"
            size="small"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import AppStatusChip from '@/components/common/AppStatusChip.vue'

const allStatuses = [
  { status: 'DRAFT',                color: 'grey',   icon: 'fas fa-pencil',               label: 'ร่าง' },
  { status: 'SUBMITTED',            color: 'blue',   icon: 'fas fa-paper-plane',          label: 'ยื่นแล้ว' },
  { status: 'DOC_REVIEW',           color: 'orange', icon: 'fas fa-file-magnifying-glass', label: 'ตรวจเอกสาร' },
  { status: 'INSPECTION_SCHEDULED', color: 'purple', icon: 'fas fa-calendar-days',        label: 'นัดตรวจ' },
  { status: 'INSPECTING',           color: 'indigo', icon: 'fas fa-clipboard-check',      label: 'กำลังตรวจ' },
  { status: 'APPROVED',             color: 'green',  icon: 'fas fa-circle-check',         label: 'อนุมัติ' },
  { status: 'REJECTED',             color: 'red',    icon: 'fas fa-circle-xmark',         label: 'ไม่ผ่าน' },
  { status: 'CANCELLED',            color: 'grey',   icon: 'fas fa-ban',                  label: 'ยกเลิก' },
  { status: 'CERT_ISSUED',          color: 'teal',   icon: 'fas fa-certificate',          label: 'ออกใบรับรอง' },
  { status: 'CERT_EXPIRED',         color: 'brown',  icon: 'fas fa-clock',                label: 'หมดอายุ' },
]

const gapStatusList = [
  'DRAFT', 'SUBMITTED', 'DOC_REVIEW', 'INSPECTION_SCHEDULED',
  'INSPECTING', 'APPROVED', 'REJECTED', 'CANCELLED', 'CERT_ISSUED', 'CERT_EXPIRED',
]
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary)); opacity: 0.75;
}
</style>
