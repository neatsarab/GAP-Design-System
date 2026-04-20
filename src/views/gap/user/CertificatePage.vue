<template>
    <div>
        <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
            <div>
                <h1 class="page-title mb-1">ใบรับรอง GAP</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">รายการใบรับรองแหล่งผลิต GAP พืชทั้งหมด</p>
            </div>
            <v-btn variant="flat" color="gap-user" prepend-icon="fas fa-plus">ยื่นคำขอใหม่</v-btn>
        </div>

        <v-card rounded="xl" elevation="0" class="mb-4 filter-card border">
            <v-card-text class="pa-4">
                <v-row dense align="center">
                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label mb-1 text-caption font-weight-bold">เลขใบรับรอง</div>
                        <v-text-field v-model="filters.certNo" placeholder="ระบุเลขใบรับรอง" variant="outlined"
                            density="compact" rounded="lg" hide-details clearable />
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label mb-1 text-caption font-weight-bold">ชื่อ - นามสกุล</div>
                        <v-text-field v-model="filters.fullName" placeholder="ระบุชื่อเกษตรกร" variant="outlined"
                            density="compact" rounded="lg" hide-details clearable />
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label mb-1 text-caption font-weight-bold">สถานะ</div>
                        <v-select v-model="filters.status" :items="statusOptions" item-title="label" item-value="value"
                            placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg" hide-details
                            clearable />
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label">
                            <div>วันที่ได้รับการรับรอง</div>
                        </div>
                        <v-menu v-model="dateFromMenu" :close-on-content-click="false" location="bottom start">
                            <template #activator="{ props }">
                                <v-text-field v-bind="props" density="compact" :model-value="dateFromBE" readonly
                                    clearable prepend-inner-icon="fas fa-calendar"
                                    placeholder="เลือกวันที่ / เดือน / ปี" hide-details style="cursor: pointer"
                                    @click:clear.stop="dateFromObj = null" />
                            </template>
                            <v-date-picker v-model="dateFromObj" color="gap-user" show-adjacent-months
                                :hide-header="!dateFromObj" title="วันที่ได้รับการรับรอง" locale="th"
                                @update:model-value="dateFromMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label">
                            <div>วันที่สิ้นสุดการรับรอง</div>
                        </div>
                        <v-menu v-model="dateToMenu" :close-on-content-click="false" location="bottom start">
                            <template #activator="{ props }">
                                <v-text-field v-bind="props" density="compact" :model-value="dateToBE2" readonly
                                    clearable prepend-inner-icon="fas fa-calendar"
                                    placeholder="เลือกวันที่ / เดือน / ปี" hide-details style="cursor: pointer"
                                    @click:clear.stop="dateToObj = null" />
                            </template>
                            <v-date-picker v-model="dateToObj" color="gap-user" show-adjacent-months
                                :hide-header="!dateToObj" title="วันที่สิ้นสุดการรับรอง" locale="th"
                                @update:model-value="dateToMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-row dense>
                        <v-col cols="auto" class="ml-auto mt-8 mr-2">
                            <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left"
                                @click="clearFilters">
                                ล้างตัวกรอง
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card rounded="xl" elevation="0" class="data-card border">
            <v-data-table :headers="headers" :items="filteredCerts" hover class="gap-table">
                <template #item.qrcode>
                    <v-icon icon="fas fa-qrcode" color="primary" size="18" />
                </template>

                <template #item.certStatus="{ item }">
                    <span :class="statusColorClass(item.certStatus)" class="text-body-2 font-weight-bold">
                        {{ statusLabel(item.certStatus) }}
                    </span>
                </template>

                <template #item.actions>
                    <v-btn icon="fas fa-eye" size="x-small" variant="text" color="success" />
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useLocale } from "vuetify";

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

function beDateToTs(str) {
    if (!str) return 0;
    const [d, m, y] = str.split("/").map(Number);
    return new Date(y - 543, m - 1, d).getTime();
}
const filters = reactive({
    certNo: "",
    fullName: "",
    status: null,
    dateFrom: "",
    dateTo: "",
});

const statusOptions = [
    { label: "ได้รับการรับรอง", value: "active" },
    { label: "หมดอายุ", value: "expired" },
    { label: "ถูกพักใช้", value: "suspended" },
    { label: "ถูกระงับ", value: "revoked" },
];

const certs = ref([
    {
        certNo: "กษ 03-9001-51-131-012046",
        issuedAt: "2026-04-26", // ค.ศ. สำหรับคำนวณ/กรอง
        issuedAtDisplay: "26-04-2569", // พ.ศ. สำหรับแสดงผล
        expiry: "2029-04-25",
        expiryDisplay: "25-04-2572",
        fullName: "นางวัชรา พินิจ",
        plotId: "510608-0200-0012",
        cropType: "ลำไย",
        certStatus: "active", // ได้รับการรับรอง
    },
    {
        certNo: "กษ 03-9001-55-117-000093",
        issuedAt: "2024-01-25",
        issuedAtDisplay: "25-01-2567",
        expiry: "2027-01-24",
        expiryDisplay: "24-01-2570",
        fullName: "นายวิโรจน์ สีสัน",
        plotId: "550301-0167-0004",
        cropType: "มะขามหวาน",
        certStatus: "expired", // หมดอายุ
    },
    {
        certNo: "กษ 03-9001-55-117-000092",
        issuedAt: "2024-01-25",
        issuedAtDisplay: "25-01-2567",
        expiry: "2027-01-24",
        expiryDisplay: "24-01-2570",
        fullName: "นางอรุณ ใจพันธ์",
        plotId: "550301-0167-0005",
        cropType: "มะขามหวาน",
        certStatus: "revoked", // ถูกระงับ
    },
    {
        certNo: "กษ 03-9001-55-117-000091",
        issuedAt: "2024-02-23",
        issuedAtDisplay: "23-02-2567",
        expiry: "2027-02-22",
        expiryDisplay: "22-02-2570",
        fullName: "นายบรรจง บุญเทพ",
        plotId: "550301-0167-0006",
        cropType: "มะขามหวาน",
        certStatus: "suspended", // ถูกพักใช้
    },
    {
        certNo: "กษ 03-9001-55-117-000090",
        issuedAt: "2024-01-25",
        issuedAtDisplay: "25-01-2567",
        expiry: "2027-01-24",
        expiryDisplay: "24-01-2570",
        fullName: "นายทุหลั่น อุปถัมภ์",
        plotId: "550301-0167-0007",
        cropType: "มะขามหวาน",
        certStatus: "active",
    }
]);

const headers = [
    { title: "QRCode", key: "qrcode", align: "center", width: "80px" },
    { title: "รหัสใบรับรอง", key: "certNo", width: "220px" },
    { title: "วันที่ได้รับการรับรอง", key: "issuedAtDisplay", width: "150px" },
    { title: "วันที่สิ้นสุดการรับรอง", key: "expiryDisplay", width: "150px" },
    { title: "ชื่อ - นามสกุล", key: "fullName", width: "180px" },
    { title: "รหัสแปลง", key: "plotId", width: "150px" },
    { title: "ชื่อพืช", key: "cropType", width: "120px" },
    { title: "สถานะ", key: "certStatus", width: "140px" },
    { title: "", key: "actions", sortable: false },
];


const filteredCerts = computed(() => {
    let items = certs.value;
    if (filters.certNo) {
        const q = filters.certNo.toLowerCase();
        items = items.filter((i) =>
            i.certNo && i.certNo.toLowerCase().includes(q)
        );
    }
    if (filters.fullName) {
        const q = filters.fullName.toLowerCase();
        items = items.filter((i) =>
            i.fullName && i.fullName.toLowerCase().includes(q)
        );
    }
    if (filters.status) {
        items = items.filter((i) => i.certStatus === filters.status);
    }
    if (filters.dateFrom) {
        const from = new Date(filters.dateFrom).getTime();
        items = items.filter((i) => beDateToTs(i.submittedDate) >= from);
    }
    if (filters.dateTo) {
        const to = new Date(filters.dateTo).getTime();
        items = items.filter((i) => beDateToTs(i.submittedDate) <= to);
    }

    return items;
});
function clearFilters() {
    filters.certNo = "";
    filters.fullName = "";
    filters.status = null;
    filters.issuedDate = "";
    filters.expiryDate = "";
    dateFromObj.value = null; // ล้างค่า Object วันที่ด้วย
    dateToObj.value = null;   // ล้างค่า Object วันที่ด้วย
}

function statusLabel(s) {
    const labels = { active: "ได้รับการรับรอง", expired: "หมดอายุ", revoked: "ถูกระงับ", suspended: "ถูกพักใช้" };
    return labels[s] || s;
}

function statusColorClass(s) {
    return { "text-success": s === "active", "text-error": s === "expired" || s === "revoked", "text-warning": s === "suspended" };
}
</script>

<style scoped>
.field-label {
    color: #555;
}

.gap-table :deep(thead th) {
    background-color: #f5f5f5 !important;
    font-weight: bold !important;
}
</style>