<template>
  <div>
    <div class="d-flex flex-wrap ga-3 mb-6">
      <v-btn color="error"   variant="tonal" prepend-icon="fas fa-trash"         @click="confirmDialog = true">Confirm Dialog</v-btn>
      <v-btn color="primary" variant="tonal" prepend-icon="fas fa-calendar-plus" @click="formDialog = true">Form Dialog</v-btn>
      <v-btn color="teal"    variant="tonal" prepend-icon="fas fa-certificate"   @click="infoDialog = true">Info Dialog</v-btn>
    </div>

    <!-- Confirm Dialog -->
    <AppConfirmDialog
      v-model="confirmDialog"
      title="ยืนยันการลบคำขอ"
      message="คุณต้องการลบคำขอ GAP-2567-001 ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      confirm-text="ลบ"
      :loading="confirmLoading"
      @confirm="handleConfirm"
      @cancel="confirmDialog = false"
    />

    <!-- Form Dialog -->
    <v-dialog v-model="formDialog" max-width="560">
      <v-card rounded="xl">
        <div class="d-flex align-center ga-3 px-6 pt-6 pb-4 border-b">
          <div class="rounded-lg d-flex align-center justify-center" style="width:36px;height:36px;background:rgba(var(--v-theme-primary),0.12)">
            <v-icon icon="fas fa-calendar-plus" color="primary" size="18" />
          </div>
          <span class="text-subtitle-1 font-weight-bold">นัดหมายตรวจแปลง</span>
          <v-spacer />
          <v-btn icon size="small" variant="text" @click="formDialog = false">
            <v-icon icon="fas fa-xmark" />
          </v-btn>
        </div>
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <v-text-field label="เลขที่คำขอ" model-value="GAP-2567-001" readonly />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="วันที่นัดตรวจ" type="date" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete label="ผู้ตรวจประเมิน" :items="['นาย วิจัย ตรวจดี', 'นาง สุดา ประเมิน']" />
            </v-col>
            <v-col cols="12">
              <v-textarea label="หมายเหตุ" rows="3" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="formDialog = false">ยกเลิก</v-btn>
          <v-btn color="primary" variant="flat" @click="formDialog = false">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Info Dialog -->
    <v-dialog v-model="infoDialog" max-width="480">
      <v-card rounded="xl">
        <div class="d-flex align-center ga-3 px-6 pt-6 pb-4 border-b">
          <div class="rounded-lg d-flex align-center justify-center" style="width:36px;height:36px;background:rgba(var(--v-theme-info),0.12)">
            <v-icon icon="fas fa-certificate" color="teal" size="18" />
          </div>
          <span class="text-subtitle-1 font-weight-bold">ใบรับรอง GAP-C-2567-0089</span>
          <v-spacer />
          <v-btn icon size="small" variant="text" @click="infoDialog = false">
            <v-icon icon="fas fa-xmark" />
          </v-btn>
        </div>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item v-for="info in certInfo" :key="info.label">
              <template #prepend>
                <v-icon :icon="info.icon" color="primary" size="18" class="mr-2" />
              </template>
              <v-list-item-subtitle>{{ info.label }}</v-list-item-subtitle>
              <v-list-item-title class="font-weight-medium">{{ info.value }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-2">
          <v-btn color="primary" variant="tonal" prepend-icon="fas fa-download" class="flex-grow-1">ดาวน์โหลด PDF</v-btn>
          <v-btn variant="text" @click="infoDialog = false">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar feedback -->
    <v-snackbar v-model="snackbar" color="success" location="bottom end" rounded="lg" timeout="3000">
      <v-icon icon="fas fa-circle-check" class="mr-2" />ดำเนินการสำเร็จ
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'

const confirmDialog = ref(false)
const formDialog    = ref(false)
const infoDialog    = ref(false)
const confirmLoading = ref(false)
const snackbar      = ref(false)

function handleConfirm() {
  confirmLoading.value = true
  setTimeout(() => {
    confirmLoading.value = false
    confirmDialog.value  = false
    snackbar.value       = true
  }, 1500)
}

const certInfo = [
  { label: 'เกษตรกร',      value: 'นาย สมชาย ใจดี',     icon: 'fas fa-user' },
  { label: 'ชนิดพืช',      value: 'ข้าวหอมมะลิ',         icon: 'fas fa-seedling' },
  { label: 'จังหวัด',      value: 'นครราชสีมา',           icon: 'fas fa-location-dot' },
  { label: 'วันออกใบรับรอง', value: '20 มี.ค. 2567',     icon: 'fas fa-calendar-days' },
  { label: 'วันหมดอายุ',   value: '19 มี.ค. 2568',       icon: 'fas fa-clock' },
]
</script>

<style scoped>
</style>
