<template>
  <div>
    <!-- Alert Types -->
    <div class="ds-subtitle mb-3">Alert Types</div>
    <div class="d-flex flex-column ga-3 mb-6">
      <v-alert type="success" variant="tonal" prepend-icon="fas fa-circle-check">
        <v-alert-title>สำเร็จ</v-alert-title>
        คำขอ GAP-2567-001 ได้รับการอนุมัติเรียบร้อยแล้ว
      </v-alert>
      <v-alert type="info" variant="tonal" prepend-icon="fas fa-circle-info">
        <v-alert-title>ข้อมูล</v-alert-title>
        กรุณาตรวจสอบเอกสารให้ครบถ้วนก่อนยื่นคำขอ
      </v-alert>
      <v-alert type="warning" variant="tonal" prepend-icon="fas fa-triangle-exclamation">
        <v-alert-title>แจ้งเตือน</v-alert-title>
        ใบรับรองของท่านจะหมดอายุในอีก 30 วัน
      </v-alert>
      <v-alert type="error" variant="tonal" prepend-icon="fas fa-circle-xmark">
        <v-alert-title>ข้อผิดพลาด</v-alert-title>
        ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง
      </v-alert>
    </div>

    <!-- Border Alert -->
    <div class="ds-subtitle mb-3">Border Alert</div>
    <div class="d-flex flex-column ga-3 mb-6">
      <v-alert border="start" border-color="primary" variant="tonal">
        <div class="text-subtitle-2 font-weight-bold mb-1">ขั้นตอนการยื่นคำขอ GAP</div>
        กรอกข้อมูล → ยื่นคำขอ → ตรวจเอกสาร → นัดตรวจแปลง → ออกใบรับรอง
      </v-alert>
    </div>

    <!-- Empty State -->
    <div class="ds-subtitle mb-3">Empty State</div>
    <v-card class="mb-6">
      <AppEmptyState
        icon="fas fa-folder-open"
        title="ยังไม่มีคำขอ"
        message="คุณยังไม่มีคำขอ GAP สามารถเริ่มต้นยื่นคำขอใหม่ได้เลย"
        action-label="ยื่นคำขอใหม่"
        @action="snackbar = true"
      />
    </v-card>

    <!-- Snackbar demo -->
    <div class="ds-subtitle mb-3">Snackbar (Toast)</div>
    <v-card>
      <v-card-text class="d-flex flex-wrap ga-3 pa-5">
        <v-btn color="success" variant="tonal" prepend-icon="fas fa-circle-check" @click="showSnack('success')">Success</v-btn>
        <v-btn color="error"   variant="tonal" prepend-icon="fas fa-circle-xmark" @click="showSnack('error')">Error</v-btn>
        <v-btn color="info"    variant="tonal" prepend-icon="fas fa-circle-info"  @click="showSnack('info')">Info</v-btn>
        <v-btn color="warning" variant="tonal" prepend-icon="fas fa-triangle-exclamation" @click="showSnack('warning')">Warning</v-btn>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackColor" location="bottom end" rounded="lg" timeout="3000">
      <v-icon :icon="snackIcon" class="mr-2" />{{ snackMessage }}
      <template #actions>
        <v-btn variant="text" icon="fas fa-xmark" @click="snackbar = false" />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'

const snackbar   = ref(false)
const snackColor = ref('success')
const snackMessage = ref('')
const snackIcon  = ref('fas fa-circle-check')

const snackConfig = {
  success: { color: 'success', icon: 'fas fa-circle-check',          message: 'บันทึกข้อมูลสำเร็จ' },
  error:   { color: 'error',   icon: 'fas fa-circle-xmark',          message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
  info:    { color: 'info',    icon: 'fas fa-circle-info',            message: 'ระบบกำลังประมวลผล' },
  warning: { color: 'warning', icon: 'fas fa-triangle-exclamation',   message: 'ใบรับรองใกล้หมดอายุ' },
}

function showSnack(type: 'success' | 'error' | 'info' | 'warning') {
  const cfg = snackConfig[type]
  snackColor.value   = cfg.color
  snackIcon.value    = cfg.icon
  snackMessage.value = cfg.message
  snackbar.value     = true
}
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary)); opacity: 0.75;
}
</style>
