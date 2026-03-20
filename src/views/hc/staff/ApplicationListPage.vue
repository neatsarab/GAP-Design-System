<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">{{ pageTitle }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการคำขอใบรับรองสุขอนามัยพืช (Health Certificate)
        </p>
      </div>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
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
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        hover
        @click:row="onRowClick"
      >
        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-medium text-info">{{
            item.requestNo
          }}</span>
        </template>

        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'correction' ? 'secondary' : 'info'"
            variant="tonal"
          >
            {{ item.type === "correction" ? "แก้ไขใบรับรอง" : "ขอใบรับรอง" }}
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
            color="hc-staff"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/hc/applications/${item.id}`)"
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
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const pageTitle = computed(() => {
  const meta = route.meta as Record<string, unknown>;
  if (meta.statusFilter === "under_review") return "ตรวจสอบคำขอ";
  if (meta.statusFilter === "testing") return "ผลตรวจตัวอย่าง";
  if (meta.statusFilter === "pending_approval") return "พิจารณาออกใบรับรอง";
  return "คำขอทั้งหมด";
});

const search = ref("");
const filterType = ref<string | null>(null);
const filterStatus = ref<string | null>(
  ((route.meta as Record<string, unknown>).statusFilter as string | null) ??
    null,
);
const activeTab = ref<string>("all");

function onRowClick(_e: unknown, row: { item: HCApp }) {
  router.push(`/hc/applications/${row.item.id}`);
}
function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterStatus.value = null;
  activeTab.value = "all";
}

const typeOptions = ["ขอใบรับรอง", "แก้ไขใบรับรอง"];
const statusOptions = [
  { label: "ฉบับร่าง", value: "draft" },
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "รอตรวจสอบ", value: "under_review" },
  { label: "ตรวจ Lab", value: "testing" },
  { label: "รอพิจารณา", value: "pending_approval" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ต้องแก้ไข", value: "correction_required" },
  { label: "เสร็จสิ้น", value: "completed" },
  { label: "ไม่อนุมัติ", value: "rejected" },
];

const statusTabs = [
  {
    label: "ทั้งหมด",
    value: "all",
    color: "hc-staff",
    icon: "fas fa-list",
    count: 0,
  },
  {
    label: "รอตรวจสอบ",
    value: "under_review",
    color: "warning",
    icon: "fas fa-magnifying-glass",
    count: 12,
  },
  {
    label: "ตรวจ Lab",
    value: "testing",
    color: "secondary",
    icon: "fas fa-flask",
    count: 8,
  },
  {
    label: "รอพิจารณา",
    value: "pending_approval",
    color: "primary",
    icon: "fas fa-gavel",
    count: 5,
  },
  {
    label: "รอลงนาม",
    value: "approved",
    color: "error",
    icon: "fas fa-signature",
    count: 4,
  },
  {
    label: "เสร็จสิ้น",
    value: "completed",
    color: "success",
    icon: "fas fa-file-shield",
    count: 0,
  },
];

interface HCApp {
  id: string;
  requestNo: string;
  exporter: string;
  product: string;
  destination: string;
  type: "new" | "correction";
  submittedAt: string;
  status: string;
}

const allApplications: HCApp[] = [
  {
    id: "HC-001",
    requestNo: "HC-2568-00041",
    exporter: "บ.ไทยฟรุ๊ต จำกัด",
    product: "ทุเรียน",
    destination: "จีน",
    type: "new",
    submittedAt: "15 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HC-002",
    requestNo: "HC-2568-00039",
    exporter: "บ.สยามเอ็กซ์พอร์ต จำกัด",
    product: "มะม่วง",
    destination: "ญี่ปุ่น",
    type: "new",
    submittedAt: "13 ม.ค. 68",
    status: "testing",
  },
  {
    id: "HC-003",
    requestNo: "HC-2568-00036",
    exporter: "บ.กรีนเฟรช จำกัด",
    product: "ลำไย",
    destination: "เวียดนาม",
    type: "correction",
    submittedAt: "10 ม.ค. 68",
    status: "pending_approval",
  },
  {
    id: "HC-004",
    requestNo: "HC-2568-00034",
    exporter: "บ.ดีเอ็กซ์พอร์ต จำกัด",
    product: "กระเทียม",
    destination: "เกาหลีใต้",
    type: "new",
    submittedAt: "8 ม.ค. 68",
    status: "approved",
  },
  {
    id: "HC-005",
    requestNo: "HC-2568-00033",
    exporter: "บ.ไทยอะกริ จำกัด",
    product: "ส้มโอ",
    destination: "สิงคโปร์",
    type: "new",
    submittedAt: "7 ม.ค. 68",
    status: "approved",
  },
  {
    id: "HC-006",
    requestNo: "HC-2568-00031",
    exporter: "บ.อีสานฟาร์ม จำกัด",
    product: "มันสำปะหลัง",
    destination: "จีน",
    type: "new",
    submittedAt: "5 ม.ค. 68",
    status: "testing",
  },
  {
    id: "HC-007",
    requestNo: "HC-2568-00029",
    exporter: "บ.เอเชียแอกริ จำกัด",
    product: "ข้าว",
    destination: "ฮ่องกง",
    type: "new",
    submittedAt: "3 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HC-008",
    requestNo: "HC-2568-00027",
    exporter: "บ.ไทยฟรุ๊ต จำกัด",
    product: "มังคุด",
    destination: "จีน",
    type: "new",
    submittedAt: "2 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HC-009",
    requestNo: "HC-2568-00025",
    exporter: "บ.กรีนเฟรช จำกัด",
    product: "กล้วยหอม",
    destination: "ญี่ปุ่น",
    type: "new",
    submittedAt: "1 ม.ค. 68",
    status: "rejected",
  },
  {
    id: "HC-010",
    requestNo: "HC-2568-00042",
    exporter: "บ.นอร์ทเทิร์นเฟรช จำกัด",
    product: "ลิ้นจี่",
    destination: "เกาหลีใต้",
    type: "new",
    submittedAt: "16 ม.ค. 68",
    status: "submitted",
  },
];

const filteredItems = computed(() => {
  let items = allApplications;
  if (filterType.value)
    items = items.filter((i) => {
      const t = filterType.value === "แก้ไขใบรับรอง" ? "correction" : "new";
      return i.type === t;
    });
  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);
  if (activeTab.value && activeTab.value !== "all") {
    items = items.filter((i) => i.status === activeTab.value);
  }
  return items;
});

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 160 },
  { title: "ผู้ส่งออก", key: "exporter", width: 200 },
  { title: "สินค้า", key: "product", width: 110 },
  { title: "ปลายทาง", key: "destination", width: 110 },
  { title: "ประเภทคำขอ", key: "type", width: 130 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 150 },
  { title: "", key: "actions", width: 130, sortable: false },
];

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    draft: "grey",
    submitted: "info",
    under_review: "warning",
    testing: "secondary",
    pending_approval: "primary",
    approved: "success",
    correction_required: "error",
    completed: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function getStatusIcon(s: string) {
  const m: Record<string, string> = {
    draft: "fas fa-pen",
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    testing: "fas fa-flask",
    pending_approval: "fas fa-gavel",
    approved: "fas fa-circle-check",
    correction_required: "fas fa-triangle-exclamation",
    completed: "fas fa-file-shield",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    draft: "ฉบับร่าง",
    submitted: "ยื่นแล้ว",
    under_review: "รอตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติแล้ว",
    correction_required: "ต้องแก้ไข",
    completed: "เสร็จสิ้น",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>
