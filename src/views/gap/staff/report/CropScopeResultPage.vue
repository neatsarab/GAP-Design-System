<template>
    <div>
        <v-card rounded="xl" elevation="0" class="data-card pa-4">
            <v-card-title class="d-flex align-center py-4 px-6">
                <span class="text-h6 font-weight-bold ml-n5">ผลการดำเนินงานแยกตามขอบข่ายพืช</span>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" prepend-inner-icon="fas fa-search" label="ค้นหาจังหวัด..."
                    variant="solo-filled" flat hide-details density="compact" style="max-width: 300px"></v-text-field>
                <v-btn variant="tonal" color="gap-staff" prepend-icon="fas fa-download" class="ml-2">ส่งออก</v-btn>
            </v-card-title>

            <v-divider></v-divider>
            <v-data-table :headers="headers" :items="provinceItems" density="compact" hover rounded="xl"
                class="province-table">
                <template #column.header="{ column }">
                    <div class="text-body-2 font-weight-bold text-center py-2">
                        {{ column.title }}
                    </div>
                </template>

                <template #item.wait_area="{ value }">{{ formatNumber(value) }}</template>
                <template #item.new_area="{ value }">{{ formatNumber(value) }}</template>
                <template #item.follow_area="{ value }">{{ formatNumber(value) }}</template>
                <template #item.renew_area="{ value }">{{ formatNumber(value) }}</template>
                <template #item.cert_area="{ value }">{{ formatNumber(value) }}</template>

            </v-data-table>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// ฟังก์ชันจัดรูปแบบตัวเลข
const formatNumber = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })

// ข้อมูลหัวตาราง (ปรับเป็นแบบกลุ่มตามรูปภาพ)
const headers = ref([
    { title: 'จังหวัด', key: 'province', align: 'start', sortable: true, width: '150px' },
    {
        title: 'รอตรวจ',
        align: 'center',
        children: [
            { title: 'ราย', key: 'wait_r', align: 'end' },
            { title: 'แปลง', key: 'wait_p', align: 'end' },
            { title: 'ไร่', key: 'wait_area', align: 'end' },
        ],
    },
    {
        title: 'ระหว่างตรวจ (แปลงใหม่)',
        align: 'center',
        children: [
            { title: 'ราย', key: 'new_r', align: 'end' },
            { title: 'แปลง', key: 'new_p', align: 'end' },
            { title: 'ไร่', key: 'new_area', align: 'end' },
        ],
    },
    {
        title: 'ระหว่างตรวจ (แปลงตรวจติดตาม)',
        align: 'center',
        children: [
            { title: 'ราย', key: 'follow_r', align: 'end' },
            { title: 'แปลง', key: 'follow_p', align: 'end' },
            { title: 'ไร่', key: 'follow_area', align: 'end' },
        ],
    },
    {
        title: 'ระหว่างตรวจ (แปลงต่ออายุ)',
        align: 'center',
        children: [
            { title: 'ราย', key: 'renew_r', align: 'end' },
            { title: 'แปลง', key: 'renew_p', align: 'end' },
            { title: 'ไร่', key: 'renew_area', align: 'end' },
        ],
    },
    {
        title: 'ได้รับการรับรอง',
        align: 'center',
        children: [
            { title: 'ราย', key: 'cert_r', align: 'end' },
            { title: 'แปลง', key: 'cert_p', align: 'end' },
            { title: 'ไร่', key: 'cert_area', align: 'end' },
        ],
    },
    {
        title: 'รวม',
        align: 'center',
        children: [
            { title: 'ราย', key: 'total_r', align: 'end' },
            { title: 'แปลง', key: 'total_p', align: 'end' },
        ],
    },
])

// ข้อมูลในตาราง (ข้อมูลจากรูปภาพบางส่วน)
const provinceItems = ref([
    {
        province: 'กระบี่',
        wait_r: 0, wait_p: 0, wait_area: 0.00,
        new_r: 4, new_p: 4, new_area: 4.25,
        follow_r: 0, follow_p: 0, follow_area: 0.00,
        renew_r: 16, renew_p: 20, renew_area: 38.31,
        cert_r: 1342, cert_p: 3797, cert_area: 9085.85,
        total_r: 1363, total_p: 3822
    },
    {
        province: 'กรุงเทพมหานคร',
        wait_r: 0, wait_p: 0, wait_area: 0.00,
        new_r: 5, new_p: 55, new_area: 3.54,
        follow_r: 0, follow_p: 0, follow_area: 0.00,
        renew_r: 2, renew_p: 17, renew_area: 0.83,
        cert_r: 112, cert_p: 355, cert_area: 304.41,
        total_r: 119, total_p: 427
    },
    {
        province: 'กาญจนบุรี',
        wait_r: 25, wait_p: 48, wait_area: 206.23,
        new_r: 25, new_p: 46, new_area: 325.60,
        follow_r: 4, follow_p: 25, follow_area: 14.46,
        renew_r: 36, renew_p: 41, renew_area: 210.88,
        cert_r: 840, cert_p: 1328, cert_area: 8592.79,
        total_r: 930, total_p: 1488
    },
    {
        province: 'กาฬสินธุ์',
        wait_r: 8, wait_p: 8, wait_area: 49.29,
        new_r: 95, new_p: 156, new_area: 177.64,
        follow_r: 1, follow_p: 1, follow_area: 21.00,
        renew_r: 18, renew_p: 18, renew_area: 46.25,
        cert_r: 3878, cert_p: 4817, cert_area: 15262.92,
        total_r: 4017, total_p: 5017
    },
    {
        province: 'กำแพงเพชร',
        wait_r: 42, wait_p: 42, wait_area: 48.45,
        new_r: 0, new_p: 0, new_area: 0.00,
        follow_r: 0, follow_p: 0, follow_area: 0.00,
        renew_r: 17, renew_p: 17, renew_area: 14.75,
        cert_r: 925, cert_p: 998, cert_area: 9087.52,
        total_r: 984, total_p: 1057
    },
    {
        province: 'ขอนแก่น',
        wait_r: 10, wait_p: 48, wait_area: 5.33,
        new_r: 0, new_p: 0, new_area: 0.00,
        follow_r: 0, follow_p: 0, follow_area: 0.00,
        renew_r: 0, renew_p: 0, renew_area: 0.00,
        cert_r: 3507, cert_p: 5323, cert_area: 11189.98,
        total_r: 3538, total_p: 5397
    },
    {
        province: 'จันทบุรี',
        wait_r: 289, wait_p: 368, wait_area: 4449.25,
        new_r: 6, new_p: 6, new_area: 41.00,
        follow_r: 247, follow_p: 325, follow_area: 2749.30,
        renew_r: 1073, renew_p: 1298, renew_area: 14203.35,
        cert_r: 42425, cert_p: 63304, cert_area: 704530.74,
        total_r: 44042, total_p: 65303
    },
    {
        province: 'ฉะเชิงเทรา',
        wait_r: 4, wait_p: 5, wait_area: 53.00,
        new_r: 0, new_p: 0, new_area: 0.00,
        follow_r: 0, follow_p: 0, follow_area: 0.00,
        renew_r: 0, renew_p: 0, renew_area: 0.00,
        cert_r: 808, cert_p: 1395, cert_area: 8402.42,
        total_r: 812, total_p: 1400
    },
    {
        province: 'ชลบุรี',
        wait_r: 46, wait_p: 67, wait_area: 282.93,
        new_r: 8, new_p: 10, new_area: 10.74,
        follow_r: 18, follow_p: 47, follow_area: 168.02,
        renew_r: 1, renew_p: 1, renew_area: 3.00,
        cert_r: 294, cert_p: 495, cert_area: 2608.77,
        total_r: 367, total_p: 620
    },
    {
        province: 'ชัยนาท',
        wait_r: 1, wait_p: 2, wait_area: 2.00,
        new_r: 2, new_p: 10, new_area: 3.53,
        follow_r: 0, follow_p: 0, follow_area: 0.00,
        renew_r: 14, renew_p: 20, renew_area: 6.75,
        cert_r: 146, cert_p: 207, cert_area: 639.50,
        total_r: 163, total_p: 239
    }
])

const viewDetails = (item) => {
    console.log('Viewing details for:', item.province)
}
</script>

<style scoped>
.province-table :deep(thead tr th) {
    border-right: 1px solid #eeeeee !important;
    border-bottom: 1px solid #eeeeee !important;
    background-color: #fcfcfc !important;
}

.province-table :deep(tbody td) {
    border-right: 1px solid #f5f5f5 !important;
}

/* ลบ border คอลัมน์สุดท้าย */
.province-table :deep(th:last-child),
.province-table :deep(td:last-child) {
    border-right: none !important;
}
</style>