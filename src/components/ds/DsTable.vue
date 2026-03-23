<template>
  <v-card>
    <div class="d-flex align-center px-4 py-3 border-b ga-3 flex-wrap">
      <span class="text-subtitle-2 font-weight-bold">รายการคำขอ GAP</span>
      <v-spacer />
      <v-text-field
        v-model="tableSearch"
        prepend-inner-icon="fas fa-magnifying-glass"
        placeholder="ค้นหา..."
        variant="solo-filled"
        density="compact"
        hide-details
        flat
        rounded="lg"
        style="max-width:220px"
      />
    </div>

    <v-data-table
      :headers="tableHeaders"
      :items="tableItems"
      :search="tableSearch"
      hover
      density="comfortable"
    >
      <template #item.status="{ item }">
        <v-chip
          :color="statusColorMap[item.status]"
          :prepend-icon="statusIconMap[item.status]"
          variant="tonal"
          size="small"
          label
        >
          {{ statusLabelMap[item.status] }}
        </v-chip>
      </template>

      <template #item.actions>
        <div class="d-flex ga-1">
          <v-btn icon size="x-small" variant="text" color="primary">
            <v-icon icon="fas fa-eye" size="14" />
          </v-btn>
          <v-btn icon size="x-small" variant="text" color="warning">
            <v-icon icon="fas fa-pencil" size="14" />
          </v-btn>
          <v-btn icon size="x-small" variant="text" color="error">
            <v-icon icon="fas fa-trash" size="14" />
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const tableSearch = ref('')

const tableHeaders = [
  { title: 'เลขที่คำขอ', key: 'no',       sortable: true },
  { title: 'เกษตรกร',    key: 'farmer',   sortable: true },
  { title: 'ชนิดพืช',    key: 'crop',     sortable: true },
  { title: 'จังหวัด',    key: 'province', sortable: true },
  { title: 'วันที่ยื่น',  key: 'date',     sortable: true },
  { title: 'สถานะ',      key: 'status',   sortable: false },
  { title: '',           key: 'actions',  sortable: false },
]

const tableItems = [
  { no: 'GAP-2567-001', farmer: 'นาย สมชาย ใจดี',      crop: 'ข้าวหอมมะลิ', province: 'นครราชสีมา', date: '1 มี.ค. 67', status: 'DOC_REVIEW' },
  { no: 'GAP-2567-002', farmer: 'นาง มาลี เกษตรกิจ',   crop: 'มันสำปะหลัง', province: 'ขอนแก่น',    date: '3 มี.ค. 67', status: 'APPROVED' },
  { no: 'GAP-2567-003', farmer: 'นาย วิชัย ทำนา',      crop: 'อ้อย',        province: 'สุพรรณบุรี', date: '5 มี.ค. 67', status: 'INSPECTING' },
  { no: 'GAP-2567-004', farmer: 'นาง สมศรี ปลูกผัก',   crop: 'ผักกาดขาว',  province: 'เชียงใหม่',  date: '7 มี.ค. 67', status: 'SUBMITTED' },
  { no: 'GAP-2567-005', farmer: 'นาย ประสิทธิ์ ไร่ดี',  crop: 'ข้าวโพด',    province: 'เพชรบูรณ์',  date: '9 มี.ค. 67', status: 'CERT_ISSUED' },
]

const statusColorMap = {
  DRAFT: 'grey', SUBMITTED: 'blue', DOC_REVIEW: 'orange',
  INSPECTION_SCHEDULED: 'purple', INSPECTING: 'indigo',
  APPROVED: 'green', REJECTED: 'red', CERT_ISSUED: 'teal', CERT_EXPIRED: 'brown',
}
const statusIconMap = {
  DRAFT: 'fas fa-pencil', SUBMITTED: 'fas fa-paper-plane',
  DOC_REVIEW: 'fas fa-file-magnifying-glass', INSPECTION_SCHEDULED: 'fas fa-calendar-days',
  INSPECTING: 'fas fa-clipboard-check', APPROVED: 'fas fa-circle-check',
  REJECTED: 'fas fa-circle-xmark', CERT_ISSUED: 'fas fa-certificate', CERT_EXPIRED: 'fas fa-clock',
}
const statusLabelMap = {
  DRAFT: 'ร่าง', SUBMITTED: 'ยื่นแล้ว', DOC_REVIEW: 'ตรวจเอกสาร',
  INSPECTION_SCHEDULED: 'นัดตรวจ', INSPECTING: 'กำลังตรวจ',
  APPROVED: 'อนุมัติ', REJECTED: 'ไม่ผ่าน', CERT_ISSUED: 'ออกใบรับรอง', CERT_EXPIRED: 'หมดอายุ',
}
</script>
