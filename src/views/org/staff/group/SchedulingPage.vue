<template>
    <div>
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <div>
                <h1 class="page-title mb-1">นัดหมายการตรวจแปลง</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    จัดการคำขอรับรองมาตรฐาน GAP แบบกลุ่ม
                </p>
            </div>
        </div>

        <!-- Filters -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
            <v-card-text class="pa-4">
                <v-row dense align="center">
                    <v-col cols="12" sm="6" md="6">
                        <div class="field-label">
                            <div>ค้นหา</div>
                            <div class="field-label-en">Search</div>
                        </div>
                        <v-text-field v-model="search" placeholder="เลขคำขอ / ชื่อสถานประกอบการ / ชื่อผู้ยื่นคำขอ"
                            prepend-inner-icon="fas fa-search" variant="outlined" density="compact" rounded="lg"
                            hide-details clearable />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <div class="field-label">
                            <div>ประเภททะเบียน</div>
                            <div class="field-label-en">Certificate Type</div>
                        </div>
                        <v-autocomplete v-model="filters.typecert" :items="typecertOptions" item-title="label"
                            item-value="value" placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg"
                            hide-details clearable />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <div class="field-label">
                            <div>ประเภทคำขอ</div>
                            <div class="field-label-en">Request Type</div>
                        </div>
                        <v-autocomplete v-model="filters.type" :items="typeOptions" item-title="label"
                            item-value="value" placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg"
                            hide-details clearable />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <div class="field-label">
                            <div>สถานะคำขอ</div>
                            <div class="field-label-en">Status</div>
                        </div>
                        <v-autocomplete v-model="filters.status" :items="statusOptions" item-title="label"
                            item-value="value" placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg"
                            hide-details clearable />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
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
                            <v-date-picker v-model="dateFromObj" color="org-staff" show-adjacent-months
                                :hide-header="!dateFromObj" title="วันที่ยื่น (จาก)" locale="th"
                                @update:model-value="dateFromMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
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
                            <v-date-picker v-model="dateToObj" color="org-staff" show-adjacent-months
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

        <v-row class="pa-4 mb-1 mt-n5 d-flex align-center justify-end ga-2">
            <v-btn variant="tonal" color="org-staff" prepend-icon="fas fa-paper-plane"
                @click="dialogProposeToCC = true">
                นัดหมายการตรวจ
            </v-btn>
        </v-row>
        <template>
            <div class="text-center pa-4">
                <v-dialog v-model="dialogProposeToCC" max-width="600" persistent>
                    <v-card class="mx-auto" width="600">
                         <template v-slot:title>
                            <div class="d-flex align-center pa-2">
                                <v-icon icon="fas fa-file-check" class="mr-3" color="org-staff" size="22" />
                                <h5 class="font-weight-black text-h6">นัดหมายการตรวจแปลง</h5>
                            </div>
                        </template>

                        <v-divider />
                        <v-card-text class="pt-4">
                            <div class="field-label mb-1">วันที่นัดหมา</div>
                            <v-text-field v-model="filters.dateProposeToCC" type="date" variant="outlined" rounded="lg"
                                density="comfortable" readonly hide-details />
                        </v-card-text>
                        <v-card-actions class="pa-4 bg-grey-lighten-4">
                            <v-spacer></v-spacer>
                            <v-btn @click="dialogProposeToCC = false" color="grey-darken-1" variant="flat"
                                class="px-6 font-weight-bold">
                                ยกเลิก
                            </v-btn>
                            <v-btn @click="dialogProposeToCC = false" color="org-staff" variant="flat"
                                class="px-10 rounded-lg font-weight-bold" elevation="2">
                                <v-icon icon="fas fa-save" start size="14" />
                                ยืนยัน
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </template>


        <!-- Table -->
        <v-card rounded="xl" elevation="0" class="data-card">
            <v-data-table :headers="headers" :items="filteredItems" :custom-key-sort="customKeySort" rounded="xl" hover
                show-select>
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
                <template #header.applicantName="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                ชื่อผู้ยื่นคำขอ
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Applicant Name
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.typecert="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height: 1.3">
                                ประเภททะเบียน
                            </div>
                            <div class="text-caption text-medium-emphasis" style="line-height: 1.2">
                                Certificate Type
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
                        <v-tooltip text="ดูคำขอ" location="top">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon size="x-small" variant="text" color="org-staff"
                                    @click.stop="goToApplicationDetail(item.requestNo)">
                                    <v-icon icon="fas fa-eye" size="14" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-btn v-if="
                            ['pending', 'reviewing', 'signing', 'approved'].includes(
                                item.status,
                            )
                        " size="small" variant="tonal" color="warning" rounded="lg"
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
const dialogProposeToCC = ref(false);

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
    router.push({ name: "staffInspectionResultDetail", params: { id } });
}

const filters = reactive({
    dateFrom: "",
    dateTo: "",
    typecert: null,
    type: null,
    status: null,
    dateProposeToCC: null,
});

const typeOptions = [
    { label: "ขึ้นทะเบียน", value: "ขึ้นทะเบียน" },
    { label: "ต่ออายุ", value: "ต่ออายุ" },
    { label: "แก้ไข", value: "แก้ไข" },
];

const statusOptions = [
    { label: "รอตรวจสอบ", value: "pending" },
    { label: "รอแก้ไขคำขอ", value: "need_edit" },
    { label: "รอพิจารณา", value: "reviewing" },
    { label: "รอลงนาม", value: "signing" },
    { label: "ได้รับอนุญาต", value: "approved" },
];

const headers = [
    { title: "เลขคำขอ", key: "requestNo", sortable: true, fixed: "true" },
    { title: "ชื่อสถานประกอบการ", key: "companyName", sortable: true },
    { title: "ชื่อผู้ยื่นคำขอ", key: "applicantName", sortable: true },
    { title: "ประเภททะเบียน", key: "typecert", sortable: true },
    { title: "ประเภทคำขอ", key: "type", sortable: true },
    { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
    { title: "สถานะคำขอ", key: "status", sortable: true },
    { title: "", key: "actions", sortable: false, align: "end", fixed: "true" },
];

const allItems = [
    {
        requestNo: "EXP-0001",
        companyName: "บ.ไทย เอ็กซ์พอร์ต จก.",
        applicantName: "สมชาย ใจดี",
        typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
        type: "ขึ้นทะเบียน",
        submittedDate: "01/01/2569",
        status: "pending",
    },
    {
        requestNo: "EXP-0003",
        companyName: "บ.สยาม เอ็กซ์พอร์ต จก.",
        applicantName: "มาลี รักดี",
        typecert:
            "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
        type: "ขึ้นทะเบียน",
        submittedDate: "10/03/2569",
        status: "reviewing",
    },
    {
        requestNo: "EXP-0004",
        companyName: "บ.เอเชียแอกโกร จก.",
        applicantName: "ประสิทธิ์ พานิช",
        typecert: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
        type: "ต่ออายุ",
        submittedDate: "12/03/2569",
        status: "signing",
    },
    {
        requestNo: "EXP-0005",
        companyName: "บ.กรีนฟาร์ม จก.",
        applicantName: "วิไล สุขสม",
        typecert:
            "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
        type: "ขึ้นทะเบียน",
        submittedDate: "15/03/2569",
        status: "need_edit",
    },
    {
        requestNo: "EXP-0006",
        companyName: "บ.ไทยแลนด์ ฟรุ๊ต จก.",
        applicantName: "ชัยวัฒน์ เกษตรกร",
        typecert: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
        type: "ขึ้นทะเบียน",
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
                i.applicantName.toLowerCase().includes(q),
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

<style scope>
:deep(.v-data-tabletd:last-child),
:deep(.v-data-tableth:last-child) {
    position: sticky;
    right: 0;
    z-index: 1;
    background: rgb(var(--v-theme-surface));
}
</style>
