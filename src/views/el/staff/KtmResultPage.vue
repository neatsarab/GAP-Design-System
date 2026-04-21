<template>
    <div>
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <div>
                <h1 class="page-title mb-1">รายการตรวจเอกสาร EL</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    รายการคำขอโรงคัดบรรจุที่ขึ้นทะเบียนในระบบ Establishment List
                </p>
            </div>
        </div>

        <!-- Filters -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
            <v-card-text class="pa-4">
                <v-row dense align="center">
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
                            <v-date-picker v-model="dateFromObj" color="el-staff" show-adjacent-months
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
                            <v-date-picker v-model="dateToObj" color="el-staff" show-adjacent-months
                                :hide-header="!dateToObj" title="วันที่ยื่น (ถึง)" locale="th"
                                @update:model-value="dateToMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label">
                            <div>สถานะคำขอ</div>
                            <div class="field-label-en">Status</div>
                        </div>
                        <v-autocomplete v-model="filters.status" :items="statusOptions" item-title="label"
                            item-value="value" placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg"
                            hide-details clearable />
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

        <!-- Table -->
        <v-card rounded="xl" elevation="0" class="data-card">
            <v-data-table :headers="headers" :items="filteredItems" :custom-key-sort="customKeySort" rounded="xl" hover>
                <template #header.requestNo="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                เลขคำขอ
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Request No.
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.companyName="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                ชื่อสถานประกอบการ
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Company Name
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.plantProduction="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                ทะเบียนโรงงานผลิตสินค้าพืช (DOA)
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Plant Production Facility Registration (DOA)
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.typecert="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                กลุ่มพืช
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Plant Group
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.type="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                ประเภทคำขอ
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Request Type
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.submittedDate="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                วันที่ยื่น
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Submit Date
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.status="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                สถานะคำขอ
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Status
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>

                <template #item.status="{ item }">
                    <v-chip :color="statusColor(item.status)" size="small" variant="tonal">{{ statusLabel(item.status)
                    }}</v-chip>
                </template>
                <template #item.actions="{ item }">
                    <div class="d-flex align-center ga-1">
                        <!-- <v-tooltip text="ดูคำขอ" location="top">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon size="x-small" variant="text" color="el-staff"
                                    @click.stop="goToApplicationDetail(item.requestNo)">
                                    <v-icon icon="fas fa-eye" size="14" />
                                </v-btn>
                            </template>
                        </v-tooltip> -->
                        <v-btn v-if="
                            ['pending', 'reviewing', 'signing', 'approved'].includes(
                                item.status,
                            )
                        " size="small" variant="tonal" color="el-staff" rounded="lg"
                            prepend-icon="fas fa-clipboard-check" @click.stop="goToApplicationDetail(item.requestNo)">
                            ตรวจสอบคำขอ
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
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
    router.push({ name: "ELStaffKtmResultDetail", params: { id } });
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
    { title: "เลขคำขอ", key: "requestNo", sortable: true, fixed: "true", width: '100px', },
    { title: "ชื่อสถานประกอบการ", key: "companyName", sortable: true, width: '180px', },
    { title: "ทะเบียนโรงงานผลิตสินค้าพืช (DOA)", key: "plantProduction", sortable: true, width: '250px' },
    { title: "กลุ่มพืช", key: "typecert", sortable: true },
    { title: "ประเภทคำขอ", key: "type", sortable: true, width: '15%', },
    { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
    { title: "สถานะคำขอ", key: "status", sortable: true },
    { title: "", key: "actions", sortable: false, align: "end", fixed: "true" },
];

const allItems = [
    {
        requestNo: "EXP-0001",
        companyName: "บ.ไทย เอ็กซ์พอร์ต จก.",
        plantProduction: "DOA-12345678",
        typecert: "กลุ่มพืช 1",
        type: "ขึ้นทะเบียนใหม่",
        submittedDate: "01/01/2569",
        status: "pending",
    },
    {
        requestNo: "EXP-0003",
        companyName: "บ.สยาม เอ็กซ์พอร์ต จก.",
        plantProduction: "DOA-12345678",
        typecert: "กลุ่มพืช 1",
        type: "ขึ้นทะเบียนใหม่",
        submittedDate: "10/03/2569",
        status: "reviewing",
    },
    {
        requestNo: "EXP-0004",
        companyName: "บ.เอเชียแอกโกร จก.",
        plantProduction: "DOA-12345678",
        typecert: "กลุ่มพืช 1",
        type: "ขึ้นทะเบียนใหม่",
        submittedDate: "12/03/2569",
        status: "signing",
    },
    {
        requestNo: "EXP-0005",
        companyName: "บ.กรีนฟาร์ม จก.",
        plantProduction: "DOA-12345678",
        typecert: "กลุ่มพืช 2",
        type: "เพิ่มพืช",
        submittedDate: "15/03/2569",
        status: "need_edit",
    },
    {
        requestNo: "EXP-0006",
        companyName: "บ.ไทยแลนด์ ฟรุ๊ต จก.",
        plantProduction: "DOA-12345678",
        typecert: "กลุ่มพืช 2",
        type: "เพิ่มแปลง",
        submittedDate: "20/03/2569",
        status: "pending",
    },
];

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
    let items = allItems;
    if (search.value) {
        const q = search.value.toLowerCase();
        items = items.filter(
            (i) =>
                i.requestNo.toLowerCase().includes(q) ||
                i.companyName.toLowerCase().includes(q) ||
                i.plantProduction.toLowerCase().includes(q),
        );
    }
    if (filters.typecert)
        items = items.filter((i) => i.typecert === filters.typecert);
    if (filters.type) items = items.filter((i) => i.type === filters.type);
    if (filters.status) items = items.filter((i) => i.status === filters.status);
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
    search.value = "";
    filters.dateFrom = "";
    filters.dateTo = "";
    filters.typecert = null;
    filters.type = null;
    filters.status = null;
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
    box-shadow: -2px 0 5px rgba(0,0,0,0.05);
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
