<template>
    <div>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
            <div>
                <h1 class="page-title mb-1">รายการทะเบียน</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    รายการทะเบียนทั้งหมด
                </p>
            </div>
        </div>

        <!-- Filter -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
            <v-card-text class="pa-4">
                <v-row dense align="center">
                    <v-col cols="12" sm="5">
                        <div class="field-label">
                            <div>ค้นหา</div>
                            <div class="field-label-en">Search</div>
                        </div>
                        <v-text-field v-model="search" placeholder="ค้นหาชื่อโรงงาน" prepend-inner-icon="fas fa-search"
                            variant="outlined" density="compact" rounded="lg" hide-details clearable />
                    </v-col>
                    <v-col cols="6" sm="3">
                        <div class="field-label">
                            <div>ประเภทคำขอ</div>
                            <div class="field-label-en">Request Type</div>
                        </div>
                        <v-autocomplete v-model="filterType" :items="typeOptions" item-title="label" item-value="value"
                            placeholder="ทั้งหมด" variant="outlined" density="compact" rounded="lg" hide-details
                            clearable />
                    </v-col>
                    <v-col cols="6" sm="3">
                        <div class="field-label">
                            <div>มาตรฐาน</div>
                            <div class="field-label-en">Standard</div>
                        </div>
                        <v-autocomplete v-model="filterStandard" :items="standardOptions" placeholder="ทั้งหมด"
                            variant="outlined" density="compact" rounded="lg" hide-details clearable />
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="auto" class="ml-auto">
                        <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left"
                            @click="clearFilters">ล้างตัวกรอง</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Chip tabs -->
        <!-- <v-chip-group v-model="activeTab" class="mb-4" mandatory>
            <v-chip value="all" color="doa-user" variant="tonal" filter size="small">
                <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
                <v-badge :content="allItems.length" inline color="doa-user" class="ml-1" />
            </v-chip>
            <v-chip value="active" color="success" variant="tonal" filter size="small">
                <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
                <v-badge :content="countByStatus('active')" inline color="success" class="ml-1" />
            </v-chip>
            <v-chip value="expiring" color="warning" variant="tonal" filter size="small">
                <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
                <v-badge :content="countByStatus('expiring')" inline color="warning" class="ml-1" />
            </v-chip>
            <v-chip value="expired" color="error" variant="tonal" filter size="small">
                <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
                <v-badge :content="countByStatus('expired')" inline color="error" class="ml-1" />
            </v-chip>
            <v-chip value="cancel" color="error" variant="tonal" filter size="small">
                <v-icon start icon="fas fa-circle-xmark" size="12" /> ยกเลิก
                <v-badge :content="countByStatus('cancel')" inline color="error" class="ml-1" />
            </v-chip>
            <v-chip value="suspended" color="error" variant="tonal" filter size="small">
                <v-icon start icon="fas fa-circle-xmark" size="12" /> ระงับ
                <v-badge :content="countByStatus('suspended')" inline color="error" class="ml-1" />
            </v-chip>
            <v-chip value="revoked" color="error" variant="tonal" filter size="small">
                <v-icon start icon="fas fa-circle-xmark" size="12" /> พักใช้
                <v-badge :content="countByStatus('revoked')" inline color="error" class="ml-1" />
            </v-chip>
        </v-chip-group> -->

        <!-- Table -->
        <v-card rounded="xl" elevation="0" class="data-card">
            <v-data-table :headers="headers" :items="filteredItems" :search="search" hover>
                <template #item.factoryName="{ item }">
                    <span class="text-body-2 font-weight-medium text-doa-user">{{
                        item.factoryName
                    }}</span>
                </template>
                <template #item.status="{ item }">
                    <v-chip :color="statusColor(item.status)" size="small" variant="tonal"
                        :prepend-icon="statusIcon(item.status)">
                        {{ statusLabel(item.status) }}
                    </v-chip>
                </template>
                <template #item.expireDate="{ item }">
                    <span :class="item.status === 'expiring'
                        ? 'text-warning font-weight-medium'
                        : item.status === 'expired'
                            ? 'text-error'
                            : ''
                        ">{{ item.expireDate }}</span>
                </template>
                <template #item.actions="{ item }">
                    <div class="d-flex ga-1">
                        <!-- <v-btn size="small" color="doa-user" variant="tonal" rounded="lg" prepend-icon="fas fa-eye"
                            @click.stop="goToCertificatenDetail(item)"></v-btn> -->
                        <v-btn size="small" variant="text" color="doa-user" icon="fas fa-eye"
                            @click.stop="goToCertificatenDetail(item)" />
                        <v-btn v-if="item.status === 'active'" size="small" color="error" variant="tonal" rounded="lg"
                            prepend-icon="fas fa-ban" @click.stop="openDetail(item)" class="mt-1">ยกเลิกทะเบียน</v-btn>
                        <!-- <v-btn size="small" variant="text" color="success" icon="fas fa-download"
                            :disabled="item.status === 'expired'" /> -->

                    </div>
                </template>
            </v-data-table>
        </v-card>

        <!-- Detail Dialog -->
        <v-dialog v-model="detailDialog" max-width="560">
            <v-card rounded="xl">
                <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between text-body-1 font-weight-bold">
                    <span><v-icon icon="fas fa-certificate" color="doa-user" class="mr-2"
                            size="18" />รายละเอียดใบรับรอง</span>
                    <v-chip v-if="selected" :color="statusColor(selected.status)" size="small" variant="tonal">{{
                        statusLabel(selected.status) }}</v-chip>
                </v-card-title>
                <v-divider />
                <v-card-text v-if="selected" class="pa-5">
                    <v-row dense>
                        <v-col cols="6">
                            <div class="info-label">ประเภทคำขอ</div>
                            <div class="info-value">
                                {{ typeLabel(selected.type) }}
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-label">ชื่อโรงงาน</div>
                            <div class="info-value">{{ selected.factoryName }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">มาตรฐาน</div>
                            <div class="info-value">{{ selected.standard }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">ประเภทใบรับรอง</div>
                            <div class="info-value">{{ selected.certType }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">วันที่ออกใบรับรอง</div>
                            <div class="info-value">{{ selected.issueDate }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">วันหมดอายุ</div>
                            <div class="info-value">{{ selected.expireDate }}</div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="px-5 pb-5 ga-2">
                    <v-spacer />
                    <v-btn variant="tonal" color="grey" rounded="lg" @click="closeDetailDialog">ปิด</v-btn>
                    <v-btn color="doa-user" variant="tonal" rounded="lg"
                        prepend-icon="fas fa-download">ดาวน์โหลด</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToCertificatenDetail(item) {
    router.push({ 
        name: "DOAUserCertificateDetail", 
        params: { id: item.id },
        state: { certificateData: item }
    });
}
const search = ref("");
const filterType = ref(null);
const filterStandard = ref(null);
const activeTab = ref("all");
const detailDialog = ref(false);

const typeOptions = [
    { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
    { label: "เปลี่ยนแปลงทะเบียน", value: "amendment" },
    { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
];
const standardOptions = [
    "มกษ. 9023-2550",
    "มกษ. 9024-2550",
    "ISO 22000",
    "GMP",
    "HACCP",
];

const allItems = [
    {
        id: "c1",
        cerNumber: "9023-2550",
        factoryName: "โรงงานไทยเกษตรอินเตอร์",
        submissionDate: "01/01/2566",
        status: "active",
    },
    {
        id: "c2",
        cerNumber: "9023-2550",
        factoryName: "โรงงานสยามฟาร์มโปรดักส์",
        submissionDate: "15/03/2565",
        status: "expiring",
    },
    {
        id: "c3",
        cerNumber: "9023-2550",
        factoryName: "โรงงานกรีนโปรเซส",
        submissionDate: "10/01/2563",
        status: "expired",
    },
    {
        id: "c4",
        cerNumber: "9023-2550",
        factoryName: "โรงงานกรีนโปรเซส",
        submissionDate: "10/01/2563",
        status: "cancel",
    },
    {
        id: "c5",
        cerNumber: "9023-2550",
        factoryName: "โรงงานกรีนโปรเซส",
        submissionDate: "10/01/2563",
        status: "suspended",
    },
    {
        id: "c6",
        cerNumber: "9023-2550",
        factoryName: "โรงงานกรีนโปรเซส",
        submissionDate: "10/01/2563",
        status: "revoked",
    },
];

const stats = computed(() => [
    {
        label: "ทั้งหมด",
        icon: "fas fa-industry",
        color: "primary",
        value: allItems.length,
    },
    {
        label: "ยังไม่หมดอายุ",
        icon: "fas fa-circle-check",
        color: "success",
        value: countByStatus("active"),
    },
    {
        label: "ใกล้หมดอายุ",
        icon: "fas fa-clock",
        color: "warning",
        value: countByStatus("expiring"),
    },
    {
        label: "หมดอายุ",
        icon: "fas fa-circle-xmark",
        color: "error",
        value: countByStatus("expired"),
    },
    {
        label: "ยกเลิก",
        icon: "fas fa-circle-xmark",
        color: "error",
        value: countByStatus("cancel"),
    },
    {
        label: "ระงับ",
        icon: "fas fa-circle-xmark",
        color: "error",
        value: countByStatus("suspended"),
    },
    {
        label: "พักใช้",
        icon: "fas fa-circle-xmark",
        color: "error",
        value: countByStatus("revoked"),
    },
]);

function countByStatus(s) {
    return allItems.filter((i) => i.status === s).length;
}

const filteredItems = computed(() => {
    let items = allItems;
    if (activeTab.value !== "all")
        items = items.filter((i) => i.status === activeTab.value);
    if (filterType.value)
        items = items.filter((i) => i.type === filterType.value);
    if (filterStandard.value)
        items = items.filter((i) => i.standard === filterStandard.value);
    return items;
});

function clearFilters() {
    search.value = "";
    filterType.value = null;
    filterStandard.value = null;
    activeTab.value = "all";
}

const headers = [
    { title: "เลขใบรับรอง", key: "cerNumber", sortable: true },
    { title: "ชื่อโรงคัดบรรจุ", key: "factoryName", sortable: true },
    { title: "วันที่ยื่น", key: "submissionDate", sortable: false },
    { title: "สถานะการรับรอง", key: "status", sortable: false },
    { title: "", key: "actions", sortable: false, align: "end" },
];

function closeDetailDialog() {
    detailDialog.value = false;
}
const selected = ref(null);
function openDetail(item) {
    selected.value = item;
    detailDialog.value = true;
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
            active: "success", expiring: "warning", expired: "error", cancel: "error", suspended: "error", revoked: "error",
        }[s] ?? "grey"
    );
}
function statusIcon(s) {
    return (
        {
            active: "fas fa-circle-check",
            expiring: "fas fa-clock",
            expired: "fas fa-circle-xmark",
            cancel: "fas fa-circle-xmark",
            suspended: "fas fa-circle-xmark",
            revoked: "fas fa-circle-xmark",

        }[s] ?? "fas fa-circle"
    );
}
function statusLabel(s) {
    return (
        { active: "ยังไม่หมดอายุ", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ", cancel: "ยกเลิก", suspended: "ระงับ", revoked: "พักใช้" }[s] ?? s
    );
}
</script>

<style scoped>
.stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.info-label {
    font-size: 11px;
    color: rgba(var(--v-theme-on-surface), 0.5);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 2px;
}

.info-value {
    font-size: 14px;
    font-weight: 500;
}
</style>
