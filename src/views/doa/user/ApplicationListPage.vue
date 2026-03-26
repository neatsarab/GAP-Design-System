<template>
    <div>
        <div class="mb-6">
            <h1 class="page-title mb-1">รายการคำขอ DOA</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
                รายการคำขอขึ้นทะเบียนโรงงานผลิตสินค้าพืชของคุณ
            </p>
        </div>

        <!-- Filters -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
            <v-card-text class="pa-4">
                <v-row dense align="center">
                    <v-col cols="12" sm="6" md="6">
                        <div class="field-label">
                            <div>หมายเลขคำขอ</div>
                            <div class="field-label-en">Request No.</div>
                        </div>
                        <v-text-field v-model="search" placeholder="ค้นหาหมายเลขคำขอ" prepend-inner-icon="fas fa-search"
                            variant="outlined" density="compact" rounded="lg" hide-details clearable />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <div class="field-label">
                            <div>ชื่อโรงคัดบรรจุ</div>
                            <div class="field-label-en">Packing House Name</div>
                        </div>
                        <v-autocomplete v-model="filters.packingHouseName" :items="packingHouseNameOptions"
                            item-title="label" item-value="value" placeholder="ทั้งหมด" variant="outlined"
                            density="compact" rounded="lg" hide-details clearable />
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
                            <v-date-picker v-model="dateFromObj" color="doa-user" show-adjacent-months
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
                            <v-date-picker v-model="dateToObj" color="doa-user" show-adjacent-months
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
        <!-- Table -->
        <v-card rounded="xl" elevation="0" class="data-card">
            <v-data-table :headers="headers" :items="filteredItems" rounded="xl" hover>
                <template #header.requestNo="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height:1.3">หมายเลขคำขอ</div>
                            <div class="text-caption text-medium-emphasis" style="line-height:1.2">Request No.</div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.packingHouseName="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height:1.3">ชื่อโรงคัดบรรจุ</div>
                            <div class="text-caption text-medium-emphasis" style="line-height:1.2">Packing House Name
                            </div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.type="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height:1.3">ประเภทคำขอ</div>
                            <div class="text-caption text-medium-emphasis" style="line-height:1.2">Request Type</div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.submittedDate="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height:1.3">วันที่ยื่น</div>
                            <div class="text-caption text-medium-emphasis" style="line-height:1.2">Submit Date</div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #header.status="{ column, isSorted, getSortIcon }">
                    <span class="d-inline-flex align-center ga-1">
                        <span>
                            <div class="text-body-2 font-weight-medium" style="line-height:1.3">สถานะคำขอ</div>
                            <div class="text-caption text-medium-emphasis" style="line-height:1.2">Status</div>
                        </span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
                    </span>
                </template>
                <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
                <template #item.status="{ item }">
                    <v-chip :color="statusColor(item.status)" size="small" variant="tonal">{{ statusLabel(item.status)
                    }}</v-chip>
                </template>
                <template #item.actions="{ item }">
                    <div class="d-flex ga-1">
                        <v-tooltip text="ดูรายละเอียด" location="top">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon size="x-small" variant="text" color="doa-user"
                                    @click.stop="goToApplicationDetail(item.id)">
                                    <v-icon icon="fas fa-eye" size="14" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip v-if="item.status === 'draft'" text="แก้ไข" location="top">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon size="x-small" variant="text" color="info"
                                    @click.stop="goToEditApplicationDetail(item.id)">
                                    <v-icon icon="fas fa-pencil" size="14" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip v-if="item.status !== 'approved'" text="ยกเลิก" location="top">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon size="x-small" variant="text" color="error" @click.stop>
                                    <v-icon icon="fas fa-xmark" size="14" />
                                </v-btn>
                            </template>
                        </v-tooltip>
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
    router.push({ name: "DOAUserApplicationDetail", params: { id } });
}
function goToEditApplicationDetail(id) {
    router.push({ name: "DOAUserApplicationEdit", params: { id } });
}

const filters = reactive({
    dateFrom: "",
    dateTo: "",
    packingHouseName: null,
    type: null,
    status: null,
});

const typeOptions = [
    { label: "ขึ้นทะเบียน", value: "ขึ้นทะเบียน" },
    { label: "ต่ออายุ", value: "ต่ออายุ" },
    { label: "แก้ไข", value: "แก้ไข" },
];

const packingHouseNameOptions = [
    { label: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด", value: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด" },
];

// รายการตัวเลือกสถานะคำขอ
const statusOptions = [
    { label: "แบบร่าง", value: "draft" },
    { label: "รอตรวจสอบ", value: "pending" },
    { label: "รอแก้ไขคำขอ", value: "need_edit" },
    { label: "รอพิจารณา", value: "reviewing" },
    { label: "รอลงนาม", value: "signing" },
    { label: "ได้รับอนุญาต", value: "approved" },
];

const headers = [
    { title: "หมายเลขคำขอ", key: "requestNo", sortable: true },
    { title: "ชื่อโรงคัดบรรจุ", key: "packingHouseName", sortable: true },
    { title: "ประเภทคำขอ", key: "type", sortable: true },
    { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
    { title: "สถานะคำขอ", key: "status", sortable: false },
    { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
    {
        id: "DOA-2569-001",
        requestNo: "DOA-2569-001",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        type: "ขึ้นทะเบียน",
        submittedDate: "01/01/2569",
        status: "draft",
    },
    {
        id: "DOA-2569-002",
        requestNo: "DOA-2569-002",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        type: "ต่ออายุ",
        submittedDate: "05/02/2569",
        status: "pending",
    },
    {
        id: "DOA-2569-003",
        requestNo: "DOA-2569-003",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        type: "ขึ้นทะเบียน",
        submittedDate: "10/03/2569",
        status: "need_edit",
    },
    {
        id: "DOA-2569-004",
        requestNo: "DOA-2569-004",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        type: "ขึ้นทะเบียน",
        submittedDate: "01/01/2569",
        status: "reviewing",
    },
    {
        id: "DOA-2569-005",
        requestNo: "DOA-2569-005",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        type: "ต่ออายุ",
        submittedDate: "05/02/2569",
        status: "signing",
    },
    {
        id: "DOA-2569-006",
        requestNo: "DOA-2569-006",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        type: "ขึ้นทะเบียน",
        submittedDate: "10/03/2569",
        status: "approved",
    }
];

const filteredItems = computed(() => {
    let items = allItems;
    if (search.value) {
        const q = search.value.toLowerCase();
        items = items.filter(
            (i) =>
                i.requestNo.toLowerCase().includes(q) ||
                i.packingHouseName.toLowerCase().includes(q),
        );
    }
    if (filters.packingHouseName)
        items = items.filter((i) => i.packingHouseName === filters.packingHouseName);
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
    filters.packingHouseName = null;
    filters.type = null;
    filters.status = null;
    dateFromObj.value = null;
    dateToObj.value = null;
}

function typeLabel(t) {
    return (
        {
            register: "ขึ้นทะเบียน / ต่ออายุ",
            amendment: "เปลี่ยนแปลงทะเบียน",
            scope: "เพิ่ม / ลดขอบข่าย",
        }[t] ?? t
    );
}
function statusColor(s) {
    return (
        {
            draft: "grey",
            pending: "info",
            need_edit: "warning",
            reviewing: "info",
            signing: "info",
            approved: "success",
        }[s] ?? "grey"
    );
}
function statusLabel(s) {
    return (
        {
            draft: "แบบร่าง",
            pending: "รอตรวจสอบ",
            need_edit: "รอแก้ไขคำขอ",
            reviewing: "รอพิจารณา",
            signing: "รอลงนาม",
            approved: "ได้รับอนุญาต",
        }[s] ?? s
    );
}
</script>
