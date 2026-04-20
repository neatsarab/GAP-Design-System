<template>
    <div>
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <div>
                <h1 class="page-title mb-1">{{ reportTitle }}</h1>
            </div>
        </div>

        <!-- Filters -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
            <v-card-text class="pa-4">
                <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                        <div class="text-caption font-weight-medium mb-1">ชื่อโรงคัดบรรจุ</div>
                        <v-text-field v-model="filters.packingPlant" placeholder="ระบุชื่อโรงคัดบรรจุ"
                            variant="outlined" density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="text-caption font-weight-medium mb-1">ชื่อเกษตรกร</div>
                        <v-text-field v-model="filters.farmer" placeholder="ระบุชื่อเกษตรกร" variant="outlined"
                            density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="text-caption font-weight-medium mb-1">เลขที่ใบรับรอง / รหัสแปลง</div>
                        <v-text-field v-model="filters.certCode" placeholder="ระบุเลขที่ใบรับรอง หรือ รหัสแปลง"
                            variant="outlined" density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="text-caption font-weight-medium mb-1">ชนิดพืช</div>
                        <v-select v-model="filters.status" :items="statusOptions" placeholder="ชนิดพืช"
                            variant="outlined" density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="text-caption font-weight-medium mb-1">ผลการพิจารณา</div>
                        <v-select v-model="filters.status" :items="statusOptions" placeholder="ผลการพิจารณา"
                            variant="outlined" density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="text-caption font-weight-medium mb-1">สถานะ</div>
                        <v-select v-model="filters.status" :items="statusOptions" placeholder="สถานะทั้งหมด"
                            variant="outlined" density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label">
                            <div>วันที่ยื่น (จาก)</div>
                            <div class="field-label-en">Submit Date (From)</div>
                        </div>
                        <v-menu v-model="dateFromMenu" :close-on-content-click="false" location="bottom start">
                            <template #activator="{ props }">
                                <v-text-field v-bind="props" density="compact" :model-value="dateFromBE" readonly
                                    clearable prepend-inner-icon="fas fa-calendar"
                                    placeholder="เลือกวันที่ / เดือน / ปี" hide-details style="cursor: pointer"
                                    @click:clear.stop="dateFromObj = null" />
                            </template>
                            <v-date-picker v-model="dateFromObj" color="gap-staff" show-adjacent-months
                                :hide-header="!dateFromObj" title="วันที่ยื่น (จาก)" locale="th"
                                @update:model-value="dateFromMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label">
                            <div>วันที่ยื่น (ถึง)</div>
                            <div class="field-label-en">Submit Date (To)</div>
                        </div>
                        <v-menu v-model="dateToMenu" :close-on-content-click="false" location="bottom start">
                            <template #activator="{ props }">
                                <v-text-field v-bind="props" density="compact" :model-value="dateToBE2" readonly
                                    clearable prepend-inner-icon="fas fa-calendar"
                                    placeholder="เลือกวันที่ / เดือน / ปี" hide-details style="cursor: pointer"
                                    @click:clear.stop="dateToObj = null" />
                            </template>
                            <v-date-picker v-model="dateToObj" color="gap-staff" show-adjacent-months
                                :hide-header="!dateToObj" title="วันที่ยื่น (ถึง)" locale="th"
                                @update:model-value="dateToMenu = false" />
                        </v-menu>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="auto" class="ml-auto">
                        <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left"
                            @click="clearFilters">
                            ล้างตัวกรอง
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="el-staff" prepend-icon="fas fa-download">EXPORT</v-btn>
        </div>

        <!-- Table -->
        <v-card rounded="xl" elevation="0" class="data-card">
            <v-data-table :headers="headers" :items="filteredItems" hover>
                <template #item.status="{ item }">
                    <v-chip size="small" color="primary" variant="tonal">{{ item.status }}</v-chip>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script setup>
import { width } from "@fortawesome/free-brands-svg-icons/fa11ty";
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLocale } from "vuetify";
const route = useRoute();
const reportId = route.params.id;

// ฟังก์ชันแมป ID ไปเป็นชื่อรายงาน (สามารถดึงจาก Array รายการที่คุณมี)
const reportTitle = computed(() => {
    const titles = {
        'assessment-doa': 'รายงานการตรวจประเมินแปลงเกษตรและโรงงานผลิตสินค้าพืช (DOA)',
        'registration-summary': 'รายงานสรุปการขึ้นทะเบียนพืชของแปลงเกษตรกรและโรงงานผลิตสินค้าพืช (DOA)',
        'inspection-summary': 'รายงานสรุปการตรวจแปลงเกษตรกรและโรงงานผลิตสินค้าพืช (DOA)',
        // ... เพิ่มรายการอื่นๆ ให้ครบตาม appTypes เดิมของคุณ
    };
    return titles[reportId] || "รายงาน";
});

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const dateFromMenu = ref(false);
const dateFromObj = ref(null);
const dateToMenu = ref(false);
const dateToObj = ref(null);

function dateToBE(date) {
    if (!date) return "";
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${date.getFullYear() + 543}`;
}

const dateFromBE = computed(() => dateToBE(dateFromObj.value));
const dateToBE2 = computed(() => dateToBE(dateToObj.value));

watch(dateFromObj, (v) => {
    filters.dateFrom = v ? v.toISOString().slice(0, 10) : "";
});
watch(dateToObj, (v) => {
    filters.dateTo = v ? v.toISOString().slice(0, 10) : "";
});

// แปลง DD/MM/YYYY (พ.ศ.) → timestamp เพื่อ sort
function beDateToTs(str) {
    if (!str) return 0;
    const [d, m, y] = str.split("/").map(Number);
    return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
    submittedDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const router = useRouter();
const search = ref("");

function goToApplicationDetail(id) {
    router.push({ name: "ELStaffBoardApplicationDetail", params: { id } });
}

const filters = reactive({
    dateFrom: "",
    dateTo: "",
    typecert: null,
    type: null,
    status: null,
});

const typeOptions = [
    { label: "ขึ้นทะเบียน", value: "ขึ้นทะเบียน" },
    { label: "ต่ออายุ", value: "ต่ออายุ" },
    { label: "แก้ไข", value: "แก้ไข" },
];

const statusOptions = [
    { label: "รอตรวจ", value: "pending" },
    { label: "รอศวพ. ตรวจคำขอ", value: "pending_edit" },
    { label: "รอศวพ. ตรวจแปลง", value: "reviewing" },
];

const headers = [
    { title: "ประเภท", key: "type", width: '150px' },
    { title: "ชื่อโรงคัดบรรจุ", key: "packingPlant", width: '200px' },
    { title: "รหัสรับรองโรงคัดบรรจุ", key: "certCode", width: '200px' },
    { title: "ชนิดพืช", key: "plant", width: '150px' },
    { title: "ชื่อเกษตรกร", key: "farmer", width: '200px' },
    { title: "เลขที่ใบรับรอง", key: "docNo", width: '250px' },
    { title: "รหัสแปลง", key: "plotCode", width: '200px' },
    { title: "ผลการตรวจแปลง", key: "fieldResult", width: '200px' },
    { title: "ผลการตรวจโรงคัด", key: "plantResult", width: '150px' },
    { title: "ผลการพิจารณา", key: "decision", width: '150px' },
    { title: "สถานะ", key: "status", width: '150px' },
    { title: "วันที่อนุมัติ", key: "approveDate", width: '150px' },
];

const allItems = ref([
    {
        type: "ตรวจขึ้นทะเบียนใหม่",
        packingPlant: "บริษัท ไทยชิน เวเกทเทเบิ้ล แอนด์ ฟรุต (ไทยแลนด์) จำกัด",
        certCode: "DOA 12700 02 010060",
        plant: "โหระพา",
        farmer: "นาย ภักสิษฐ์ เท่งสี",
        docNo: "กษ 03-9001-73-435-000318",
        plotCode: "73020400-9435-0001",
        fieldResult: "ผ่าน",
        plantResult: "ผ่าน",
        decision: "รอพิจารณาผล",
        status: "รออนุมัติผล",
        approveDate: "-"
    },
    {
        type: "ตรวจขึ้นทะเบียนใหม่",
        packingPlant: "บริษัท ไทยชิน เวเกทเทเบิ้ล แอนด์ ฟรุต (ไทยแลนด์) จำกัด",
        certCode: "DOA 12700 02 010060",
        plant: "พริกจินดา",
        farmer: "นาย ภักสิษฐ์ เท่งสี",
        docNo: "กษ 03-9001-73-373-000121",
        plotCode: "73020400-9373-0001",
        fieldResult: "ผ่าน",
        plantResult: "ผ่าน",
        decision: "รอพิจารณาผล",
        status: "รออนุมัติผล",
        approveDate: "-"
    },
    {
        type: "ตรวจขึ้นทะเบียนใหม่",
        packingPlant: "บริษัท ไทยเฟรชการ์เด้นท์ อินเตอร์เนชั่นแนล จำกัด",
        certCode: "DOA 12000 09 013511",
        plant: "ผักชีฝรั่ง",
        farmer: "นางสาว ภาณี บุญโชคสุข",
        docNo: "กษ 03-9001-73-364-000053",
        plotCode: "730514-9364-0001-0065",
        fieldResult: "ผ่าน",
        plantResult: "ผ่าน",
        decision: "รอพิจารณาผล",
        status: "รออนุมัติผล",
        approveDate: "-"
    },
    {
        type: "ตรวจขึ้นทะเบียนใหม่",
        packingPlant: "บริษัท ไทยเฟรชการ์เด้นท์ อินเตอร์เนชั่นแนล จำกัด",
        certCode: "DOA 12000 09 013511",
        plant: "ขึ้นฉ่าย",
        farmer: "นาง ไพรัตน์ พรมชน",
        docNo: "03900130364000096",
        plotCode: "3021040093640001029",
        fieldResult: "ผ่าน",
        plantResult: "ผ่าน",
        decision: "รอพิจารณาผล",
        status: "รออนุมัติผล",
        approveDate: "-"
    },
    {
        type: "ตรวจขึ้นทะเบียนใหม่",
        packingPlant: "บริษัท พีดับบลิวเค เอลท์ เพอร์เฟคชั่น กรุ๊ป จำกัด",
        certCode: "DOA 12700 01 010126",
        plant: "ผักชีฝรั่ง",
        farmer: "นาง สุวัฒน์ แสงอ่อง",
        docNo: "กษ 03-9001-33542378364",
        plotCode: "67032300-9364-0082",
        fieldResult: "ผ่าน",
        plantResult: "ผ่าน",
        decision: "รอพิจารณาผล",
        status: "รออนุมัติผล",
        approveDate: "-"
    }
]);

const typecertOptions = [
    {
        label: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
        value: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
    },
    {
        label:
            "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
        value:
            "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    },
    {
        label:
            "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งผลทุเรียนสดออกไปนอกราชอาณาจักร",
        value:
            "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งผลทุเรียนสดออกไปนอกราชอาณาจักร",
    },
    {
        label: "คำขอจดทะเบียนเป็นผู้ส่งออกสินค้าเกษตรไปนอกราชอาณาจักร",
        value: "คำขอจดทะเบียนเป็นผู้ส่งออกสินค้าเกษตรไปนอกราชอาณาจักร",
    },
    {
        label:
            "คำขอหนังสือสำคัญการจดทะเบียนเป็นผู้ส่งออกลูกเดือย, เมล็ดแมงลัก และพริกแห้ง ไปนอกราชอาณาจักร",
        value:
            "คำขอหนังสือสำคัญการจดทะเบียนเป็นผู้ส่งออกลูกเดือย, เมล็ดแมงลัก และพริกแห้ง ไปนอกราชอาณาจักร",
    },
    {
        label: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
        value: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
    },
];

const filteredItems = computed(() => {
    // 1. ดึงค่า .value ออกมาเพื่อให้เป็น Array
    let items = allItems.value;

    // 2. กรองข้อมูลตาม Filter ต่างๆ
    if (filters.packingPlant) {
        items = items.filter(i => i.packingPlant.includes(filters.packingPlant));
    }
    if (filters.farmer) {
        items = items.filter(i => i.farmer.includes(filters.farmer));
    }
    if (filters.certCode) {
        items = items.filter(i => i.certCode.includes(filters.certCode) || i.plotCode.includes(filters.certCode));
    }
    if (filters.plant) { // สมมติว่ามี key นี้ใน filters
        items = items.filter(i => i.plant === filters.plant);
    }
    if (filters.decision) { // สมมติว่ามี key นี้ใน filters
        items = items.filter(i => i.decision === filters.decision);
    }
    if (filters.status) {
        items = items.filter(i => i.status === filters.status);
    }

    // กรองวันที่
    if (filters.dateFrom) {
        const from = new Date(filters.dateFrom).getTime();
        items = items.filter(i => beDateToTs(i.approveDate) >= from);
    }
    if (filters.dateTo) {
        const to = new Date(filters.dateTo).getTime();
        items = items.filter(i => beDateToTs(i.approveDate) <= to);
    }

    return items;
});

function clearFilters() {
    filters.packingPlant = "";
    filters.farmer = "";
    filters.certCode = "";
    filters.plant = null;
    filters.decision = null;
    filters.status = null;
    filters.dateFrom = "";
    filters.dateTo = "";
    dateFromObj.value = null;
    dateToObj.value = null;
}

function statusColor(s) {
    return (
        {
            pending: "warning",
            need_edit: "info",
            reviewing: "warning",
            signing: "warning",
            approved: "success",
        }[s] ?? "grey"
    );
}

function statusLabel(s) {
    return (
        {
            pending: "รอตรวจสอบ",
            need_edit: "รอแก้ไขคำขอ",
            reviewing: "รอพิจารณา",
            signing: "รอลงนาม",
            approved: "ได้รับอนุญาต",
        }[s] ?? s
    );
}
</script>

<style scoped>
:deep(.v-data-table table) {
    table-layout: fixed !important;
    width: 100% !important;
    min-width: 1400px;
}

:deep(.v-data-table__th:last-child),
:deep(.v-data-table__td:last-child) {
    position: sticky !important;
    right: 0 !important;
    z-index: 2 !important;
    background: white !important;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
}

:deep(.v-data-table__th) {
    z-index: 3 !important;
}

:deep(.v-data-table__td) {
    white-space: normal !important;
    word-wrap: break-word;
    font-size: 0.875rem;
}
</style>
