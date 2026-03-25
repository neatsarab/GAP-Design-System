<template>
    <div>
        <div class="mb-6">
            <h1 class="page-title mb-1">รายการคำขอ DOA</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
                รายการคำขอขึ้นทะเบียนโรงงานผลิตสินค้าพืชของคุณ
            </p>
        </div>

        <!-- Filters -->
        <!-- <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
            <v-card-text class="pa-4">
                <v-row dense align="center">
                    <v-col cols="12" sm="6" md="3">
                        <div class="field-label">
                            <div>วันที่ยื่น (จาก)</div>
                            <div class="field-label-en">Submit Date (From)</div>
                        </div>
                        <v-text-field v-model="filters.dateFrom" type="date" variant="outlined" density="compact"
                            rounded="lg" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <div class="field-label">
                            <div>วันที่ยื่น (ถึง)</div>
                            <div class="field-label-en">Submit Date (To)</div>
                        </div>
                        <v-text-field v-model="filters.dateTo" type="date" variant="outlined" density="compact"
                            rounded="lg" hide-details />
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
                            <div>ประเภทใบรับรอง</div>
                            <div class="field-label-en">Certificate Type</div>
                        </div>
                        <v-autocomplete v-model="filters.certType" :items="certTypeOptions" item-title="label"
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
        </v-card> -->
        <!-- Filters ตามรูปแบบในภาพ -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card border">
            <v-card-text class="pa-6">
                <v-row dense align="center">
                    <!-- 1. ค้นหาคำขอ -->
                    <v-col cols="12" md="4">
                        <div class="field-label mb-1">ค้นหาคำขอ</div>
                        <v-text-field v-model="filters.search" placeholder="กรอกข้อมูลคำขอ" variant="outlined"
                            density="comfortable" rounded="lg" hide-details
                            prepend-inner-icon="fas fa-magnifying-glass" />
                    </v-col>

                    <!-- 2. สถานะคำขอ -->
                    <v-col cols="12" md="4">
                        <div class="field-label mb-1">สถานะคำขอ</div>
                        <v-select v-model="filters.status" :items="statusOptions" placeholder="ทั้งหมด"
                            variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                    </v-col>

                    <v-spacer />

                    <!-- 3. ปุ่มล้างการค้นหา-->
                    <v-col cols="12" md="auto" class="pt-6">
                        <v-btn color="doa-user" height="48" min-width="140" rounded="lg" elevation="0"
                            @click="clearFilters">
                            ล้างการค้นหา
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <!-- Table -->
        <v-card rounded="xl" elevation="0" class="data-card">
            <v-data-table :headers="headers" :items="filteredItems" rounded="xl" hover>
                <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
                <template #item.status="{ item }">
                    <v-chip :color="statusColor(item.status)" size="small" variant="tonal">{{ statusLabel(item.status)
                    }}</v-chip>
                </template>
                <template #item.actions="{ item }">
                    <v-btn size="small" color="doa-user" variant="tonal" rounded="lg" prepend-icon="fas fa-eye"
                        @click.stop="goToApplicationDetail(item.id)">ดูคำขอ</v-btn>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationDetail(id) {
    router.push({ name: "DOAUserApplicationDetail", params: { id } });
}

const filters = reactive({
    dateFrom: "",
    dateTo: "",
    type: null,
    certType: null,
    search: "",   
    status: null,
});

const typeOptions = [
    { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
    { label: "เปลี่ยนแปลงทะเบียน", value: "amendment" },
    { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
];

const certTypeOptions = [
    { label: "DOA", value: "doa" },
    { label: "GMP", value: "gmp" },
    { label: "HACCP", value: "haccp" },
];

// รายการตัวเลือกสถานะคำขอ
const statusOptions = [
    { title: "รอพิจารณา", value: "pending" },
    { title: "อยู่ระหว่างพิจารณา", value: "reviewing" },
    { title: "ผ่าน", value: "approved" },
    { title: "ไม่ผ่าน", value: "rejected" },
];

const headers = [
    { title: "เลขคำขอ", key: "requestNumber", sortable: true },
    { title: "ชื่อโรงคัดบรรจุ", key: "packingHouseName", sortable: true },
    { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
    { title: "สถานะคำขอ", key: "status", sortable: false },
    { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
    {
        id: "DOA-2569-001",
        requestNumber: "DOA-2569-001",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        submittedDate: "01/01/2569",
        status: "reviewing",
    },
    {
        id: "DOA-2569-002",
        requestNumber: "DOA-2569-002",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        submittedDate: "05/02/2569",
        status: "pending",
    },
    {
        id: "DOA-2569-003",
        requestNumber: "DOA-2569-003",
        packingHouseName: "บริษัท เอส.ดับบลิว เทค แอนด์ มีเดีย จำกัด",
        submittedDate: "10/03/2569",
        status: "approved",
    },
];

// const filteredItems = computed(() => {
//     let items = allItems;
//     if (filters.type) items = items.filter((i) => i.type === filters.type);
//     if (filters.certType)
//         items = items.filter((i) => i.certType.toLowerCase() === filters.certType);
//     return items;
// });
const filteredItems = computed(() => {
    let items = allItems;

    // กรองจากช่อง Text Search (เลขคำขอ หรือ ชื่อโรงคัดบรรจุ)
    if (filters.search) {
        const s = filters.search.toLowerCase();
        items = items.filter(i => 
            i.requestNumber.toLowerCase().includes(s) || 
            i.packingHouseName.toLowerCase().includes(s)
        );
    }

    // กรองจากสถานะ
    if (filters.status) {
        items = items.filter(i => i.status === filters.status);
    }

    return items;
});

function clearFilters() {
    filters.dateFrom = "";
    filters.dateTo = "";
    filters.type = null;
    filters.certType = null;
    filters.search = "";
    filters.status = null;
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
            pending: "warning",
            reviewing: "info",
            approved: "success",
            rejected: "error",
        }[s] ?? "grey"
    );
}
function statusLabel(s) {
    return (
        {
            pending: "รอพิจารณา",
            reviewing: "อยู่ระหว่างพิจารณา",
            approved: "ผ่าน",
            rejected: "ไม่ผ่าน",
        }[s] ?? s
    );
}
</script>
