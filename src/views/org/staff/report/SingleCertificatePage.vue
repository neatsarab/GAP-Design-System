<template>
    <div>
        <v-card rounded="xl" elevation="0" class="data-card pa-4">
            <v-card-title class="d-flex align-center py-4 px-6">
                <span class="text-h6 font-weight-bold ml-n5">รายงานแปลงเดี่ยว</span>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" prepend-inner-icon="fas fa-search" label="ค้นหาใบรับรอง..."
                    variant="solo-filled" flat hide-details density="compact" style="max-width: 300px"></v-text-field>
                <v-btn variant="tonal" color="org-staff" prepend-icon="fas fa-download" class="ml-2">ส่งออก</v-btn>
            </v-card-title>
            <v-divider></v-divider>

            <v-data-table :headers="headers" :items="reportItems" :search="search" density="compact" hover
                class="report-table">
                <template #item.opt="{ item }">
                    <v-btn icon size="x-small" color="org-staff" variant="flat" class="text-white">
                        <v-icon icon="fas fa-print" size="12"></v-icon>
                    </v-btn>
                </template>

                <template #item.status="{ value }">
                    <span class="text-error font-weight-medium">{{ value }}</span>
                </template>

                <template #item.phone="{ value }">
                    {{ value || '-' }}
                </template>
                <template #item.email="{ value }">
                    {{ value || '-' }}
                </template>

            </v-data-table>
        </v-card>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const search = ref('')

const headers = [
    { title: 'Opt', key: 'opt', sortable: false, width: '50px', align: 'center' },
    { title: 'ลำดับ', key: 'index', align: 'center' },
    { title: 'วันรับรอง', key: 'certDate', },
    { title: 'วันหมดอายุ', key: 'expDate', },
    { title: 'รหัสใบรับรอง', key: 'certCode' },
    { title: 'รหัสใบรับรอง (ใหม่)', key: 'certCodeNew' },
    { title: 'สถานะ', key: 'status', align: 'center' },
    { title: 'รหัสแหล่งผลิต', key: 'sourceCode' },
    { title: 'ชื่อ-นามสกุล', key: 'fullName' },
]

const reportItems = ref([
    { index: 1, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055940', status: 'ได้รับการรับรอง', sourceCode: '570708-00040', fullName: 'นางผ่องศรี โชติ' },
    { index: 2, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055939', status: 'ได้รับการรับรอง', sourceCode: '570708-00039', fullName: 'นางสาวสุภาวดี ศิริหงษ์' },
    { index: 3, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055938', status: 'ได้รับการรับรอง', sourceCode: '570708-00038', fullName: 'นายชวลิต แซ่ลี้' },
    { index: 4, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055941', status: 'ได้รับการรับรอง', sourceCode: '570708-00037', fullName: 'นายกมล อนวรชิกา' },
    { index: 5, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055936', status: 'ได้รับการรับรอง', sourceCode: '570708-00036', fullName: 'นายชัยณรงค์ แซ่ตั้ง' },
    { index: 6, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055937', status: 'ได้รับการรับรอง', sourceCode: '570708-00035', fullName: 'นางสาวอุบลรัตน์ แซ่จ่าว' },
    { index: 7, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055935', status: 'ได้รับการรับรอง', sourceCode: '570708-00034', fullName: 'นางสาวธนิดา วิมลบรรณกิจ' },
    { index: 8, certDate: '25 มี.ค. 2569', expDate: '24 มี.ค. 2571', certCode: '', certCodeNew: 'กษ 03-9000-57-990-055934', status: 'ได้รับการรับรอง', sourceCode: '570708-00033', fullName: 'นายนายเกาชิง แซ่กง' },
    
])
</script>

<style scoped>
.report-table {
    /* บังคับให้ตารางรองรับการ Scroll แนวนอน */
    overflow-x: auto;
}

.report-table :deep(thead tr th) {
    border-right: 1px solid #eeeeee !important;
    border-bottom: 1px solid #eeeeee !important;
    background-color: #fcfcfc !important;
    font-weight: bold !important;
    /* ป้องกันหัวตารางตัดบรรทัด */
    white-space: nowrap !important;
}

.report-table :deep(tbody td) {
    border-right: 1px solid #f5f5f5 !important;
    /* ป้องกันข้อมูลในตารางตัดบรรทัด ทำให้ตารางยาวออกไปด้านข้าง */
    white-space: nowrap !important;
    padding: 8px 12px !important;
}

/* ตกแต่ง Scrollbar ให้ดูสวยงาม (สำหรับ Chrome/Safari) */
.report-table :deep(.v-table__wrapper::-webkit-scrollbar) {
    height: 8px;
}

.report-table :deep(.v-table__wrapper::-webkit-scrollbar-thumb) {
    background: #e0e0e0;
    border-radius: 10px;
}

.report-table :deep(.v-table__wrapper::-webkit-scrollbar-thumb:hover) {
    background: #bdbdbd;
}

.report-table :deep(th:last-child),
.report-table :deep(td:last-child) {
    border-right: none !important;
}
</style>