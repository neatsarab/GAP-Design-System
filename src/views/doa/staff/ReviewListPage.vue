<template>
    <div>
        <div class="mb-6">
            <h1 class="page-title mb-1">พิจารณาทะเบียน DOA</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
                รายการคำขอที่ผ่านการตรวจสอบเบื้องต้นแล้ว รอเจ้าหน้าที่พิจารณาทะเบียน
            </p>
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
                            <v-date-picker v-model="dateFromObj" color="doa-staff" show-adjacent-months
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
                            <v-date-picker v-model="dateToObj" color="doa-staff" show-adjacent-months
                                :hide-header="!dateToObj" title="วันที่ยื่น (ถึง)" locale="th"
                                @update:model-value="dateToMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <div class="field-label">
                            <div>ประเภทคำขอ</div>
                            <div class="field-label-en">Request Type</div>
                        </div>
                        <v-autocomplete v-model="filters.type" :items="typeOptions" item-title="label"
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
            <v-data-table v-model="selected" :headers="headers" :items="filteredItems" show-select item-value="id"
                rounded="xl" hover>
                <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
                <template #item.status>
                    <v-chip color="info" size="small" variant="tonal">อยู่ระหว่างพิจารณา</v-chip>
                </template>
                <template #item.actions="{ item }">
                    <v-btn size="small" color="doa-staff" variant="tonal" rounded="lg"
                        prepend-icon="fas fa-scale-balanced" @click.stop="goToReview(item.id)">
                        พิจารณา
                    </v-btn>
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

const router = useRouter();

function goToReview(id) {
    router.push({ name: "DOAStaffApplicationDetail", params: { id }, query: { step: 2 } });
}
const selected = ref([]);

const filters = reactive({
    dateFrom: "",
    dateTo: "",
    type: null,
});

const typeOptions = [
    { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
    { label: "เปลี่ยนแปลงทะเบียน", value: "amendment" },
    { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
];

const headers = [
    { title: "Running No.", key: "runNo", sortable: true },
    { title: "เลขคำขอ", key: "requestNo", sortable: true },
    { title: "ประเภทคำขอ", key: "type", sortable: true },
    { title: "ผู้ยื่นคำขอ", key: "applicant", sortable: true },
    { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
    { title: "สถานะ", key: "status", sortable: false },
    { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
    {
        id: "DOA-2569-002",
        runNo: "002",
        requestNo: "DOA-0002",
        type: "register",
        applicant: "บ.ไทยโปรเซส จก.",
        submittedDate: "05/02/2569",
    },
    {
        id: "DOA-2569-005",
        runNo: "005",
        requestNo: "DOA-0005",
        type: "amendment",
        applicant: "บ.เอเชียฟาร์ม จก.",
        submittedDate: "14/03/2569",
    },
    {
        id: "DOA-2569-006",
        runNo: "006",
        requestNo: "DOA-0006",
        type: "scope",
        applicant: "บ.นอร์ธกรีน จก.",
        submittedDate: "15/03/2569",
    },
];

const filteredItems = computed(() => {
    let items = allItems;
    if (filters.type) items = items.filter((i) => i.type === filters.type);
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
    filters.dateFrom = "";
    filters.dateTo = "";
    filters.type = null;
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
</script>
