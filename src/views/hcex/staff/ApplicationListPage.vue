<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการคำขอ HC สินค้าแปรรูป</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการคำขอใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืชทั้งหมด
        </p>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="4">
            <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
            <v-text-field
              v-model="search"
              prepend-inner-icon="fas fa-search"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label mb-1"><div>ประเภทคำขอ</div><div class="field-label-en">Request Type</div></div>
            <v-autocomplete
              v-model="filterType"
              :items="typeOptions"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label mb-1"><div>สถานะ</div><div class="field-label-en">Status</div></div>
            <v-autocomplete
              v-model="filterStatus"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="auto" class="ml-auto d-flex align-self-center">
            <v-btn
              variant="tonal"
              color="grey"
              size="small"
              prepend-icon="fas fa-rotate-left"
              @click="clearFilters"
            >
              ล้างตัวกรอง
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Status tabs -->
    <v-chip-group v-model="activeTab" class="mb-4" mandatory>
      <v-chip
        v-for="tab in statusTabs"
        :key="tab.value"
        :value="tab.value"
        :color="tab.color"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start :icon="tab.icon" size="12" />
        {{ tab.label }}
        <v-badge
          v-if="tab.count"
          :content="tab.count"
          inline
          color="error"
          class="ml-1"
        />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        hover
        @click:row="onRowClick"
      >
        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-medium text-warning">{{
            item.requestNo
          }}</span>
        </template>

        <template #item.certType="{ item }">
          <v-chip size="x-small" color="hcex-staff" variant="tonal">
            {{ item.certType }}
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            :color="getStatusColor(item.status)"
            variant="tonal"
            :prepend-icon="getStatusIcon(item.status)"
          >
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="hcex-staff"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/hcex/staff/applications/${item.id}`)"
          >
            ดูรายละเอียด
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const search = ref("");
const filterType = ref<string | null>(null);
const filterStatus = ref<string | null>(null);
const activeTab = ref<string>("all");

function onRowClick(_e: unknown, row: { item: HCEXApp }) {
  router.push(`/hcex/staff/applications/${row.item.id}`);
}
function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterStatus.value = null;
  activeTab.value = "all";
}

const typeOptions = ["กมพ.1", "กมพ.1-1", "กมพ.1-2", "กมพ.1-3", "แก้ไขใบรับรอง"];
const statusOptions = [
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "รอตรวจสอบ", value: "under_review" },
  { label: "รอพิจารณา Lab", value: "lab_verification" },
  { label: "รอลงนาม", value: "pending_signing" },
  { label: "เสร็จสิ้น", value: "completed" },
  { label: "ไม่อนุมัติ", value: "rejected" },
];

const statusTabs = [
  {
    label: "ทั้งหมด",
    value: "all",
    color: "hcex-staff",
    icon: "fas fa-list",
    count: 0,
  },
  {
    label: "รอตรวจสอบ",
    value: "under_review",
    color: "hcex-staff",
    icon: "fas fa-magnifying-glass",
    count: 9,
  },
  {
    label: "รอผล Lab",
    value: "lab_verification",
    color: "info",
    icon: "fas fa-flask-vial",
    count: 5,
  },
  {
    label: "รอลงนาม",
    value: "pending_signing",
    color: "secondary",
    icon: "fas fa-signature",
    count: 3,
  },
  {
    label: "เสร็จแล้ว",
    value: "completed",
    color: "success",
    icon: "fas fa-industry",
    count: 0,
  },
];

interface HCEXApp {
  id: string;
  requestNo: string;
  certType: string;
  exporter: string;
  destination: string;
  submittedAt: string;
  status: string;
}

const allApplications: HCEXApp[] = [
  {
    id: "HCEX-001",
    requestNo: "HCEX-2568-00012",
    certType: "กมพ.1",
    exporter: "บ.ไทยฟู้ดโปรเซส จก.",
    destination: "ญี่ปุ่น",
    submittedAt: "10 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HCEX-002",
    requestNo: "HCEX-2568-00011",
    certType: "กมพ.1-1",
    exporter: "บ.สยามแปรรูป จก.",
    destination: "จีน",
    submittedAt: "9 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HCEX-003",
    requestNo: "HCEX-2568-00010",
    certType: "กมพ.1-2",
    exporter: "บ.กรีนโปรดักส์ จก.",
    destination: "ฮ่องกง",
    submittedAt: "7 ม.ค. 68",
    status: "lab_verification",
  },
  {
    id: "HCEX-004",
    requestNo: "HCEX-2568-00009",
    certType: "กมพ.1",
    exporter: "บ.ดอยอาหาร จก.",
    destination: "เกาหลีใต้",
    submittedAt: "5 ม.ค. 68",
    status: "lab_verification",
  },
  {
    id: "HCEX-005",
    requestNo: "HCEX-2568-00008",
    certType: "กมพ.1-3",
    exporter: "บ.เอเชียฟู้ดส์ จก.",
    destination: "สิงคโปร์",
    submittedAt: "3 ม.ค. 68",
    status: "pending_signing",
  },
  {
    id: "HCEX-006",
    requestNo: "HCEX-2568-00007",
    certType: "กมพ.1",
    exporter: "บ.นอร์ทเทิร์นฟู้ด จก.",
    destination: "เวียดนาม",
    submittedAt: "2 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HCEX-007",
    requestNo: "HCEX-2568-00006",
    certType: "กมพ.1-1",
    exporter: "บ.ไทยกรีน จก.",
    destination: "มาเลเซีย",
    submittedAt: "1 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HCEX-008",
    requestNo: "HCEX-2568-00005",
    certType: "กมพ.1-3",
    exporter: "บ.สยามแปรรูป จก.",
    destination: "จีน",
    submittedAt: "28 ธ.ค. 67",
    status: "rejected",
  },
  {
    id: "HCEX-009",
    requestNo: "HCEX-2568-00013",
    certType: "กมพ.1",
    exporter: "บ.อีสานฟู้ดส์ จก.",
    destination: "ออสเตรเลีย",
    submittedAt: "12 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HCEX-010",
    requestNo: "HCEX-2568-00014",
    certType: "กมพ.1-2",
    exporter: "บ.ชิ้นส่วนอาหาร จก.",
    destination: "ญี่ปุ่น",
    submittedAt: "13 ม.ค. 68",
    status: "submitted",
  },
];

const filteredItems = computed(() => {
  let items = allApplications;
  if (filterType.value) {
    items = items.filter((i) => i.certType === filterType.value);
  }
  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);
  if (activeTab.value && activeTab.value !== "all") {
    items = items.filter((i) => i.status === activeTab.value);
  }
  return items;
});

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 170 },
  { title: "ประเภทใบรับรอง", key: "certType", width: 140 },
  { title: "ผู้ประกอบการ", key: "exporter", width: 200 },
  { title: "ประเทศปลายทาง", key: "destination", width: 130 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 160 },
  { title: "", key: "actions", width: 140, sortable: false },
];

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    submitted: "warning",
    under_review: "warning",
    lab_verification: "info",
    pending_signing: "secondary",
    completed: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function getStatusIcon(s: string) {
  const m: Record<string, string> = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    lab_verification: "fas fa-flask-vial",
    pending_signing: "fas fa-signature",
    completed: "fas fa-industry",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    submitted: "ยื่นแล้ว",
    under_review: "รอตรวจสอบ",
    lab_verification: "รอพิจารณา Lab",
    pending_signing: "รอลงนาม",
    completed: "เสร็จสิ้น",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>
