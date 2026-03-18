<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">คำขอของฉัน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการคำขอใบรับรองสุขอนามัยพืชทั้งหมด
        </p>
      </div>
      <v-btn
        color="hc-user"
        prepend-icon="fas fa-file-pen"
        @click="router.push('/hc/user/applications/new')"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="5">
            <div class="field-label mb-1">ค้นหา <span class="field-label-en">Search</span></div>
            <v-text-field
              v-model="search"
              prepend-inner-icon="fas fa-search"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label mb-1">ประเภทคำขอ <span class="field-label-en">Request Type</span></div>
            <v-autocomplete
              v-model="filterType"
              :items="typeOptions"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label mb-1">สถานะ <span class="field-label-en">Status</span></div>
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

    <!-- Status Tabs -->
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
          <span class="text-body-2 font-weight-medium text-hc-user">{{
            item.requestNo
          }}</span>
        </template>
        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'correction' ? 'secondary' : 'hc-user'"
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
            color="hc-user"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/hc/user/applications/${item.id}`)"
          >
            ติดตามสถานะ
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

function onRowClick(_e: unknown, row: { item: HCApp }) {
  router.push(`/hc/user/applications/${row.item.id}`);
}
function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterStatus.value = null;
  activeTab.value = "all";
}

const typeOptions = ["ขอใบรับรอง", "แก้ไขใบรับรอง"];
const statusOptions = [
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "อยู่ระหว่างตรวจสอบ", value: "under_review" },
  { label: "ตรวจ Lab", value: "testing" },
  { label: "รอพิจารณา", value: "pending_approval" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ต้องแก้ไข", value: "correction_required" },
  { label: "รับใบรับรองแล้ว", value: "completed" },
  { label: "ไม่อนุมัติ", value: "rejected" },
];
const statusTabs = [
  {
    label: "ทั้งหมด",
    value: "all",
    color: "default",
    icon: "fas fa-list",
    count: 0,
  },
  {
    label: "อยู่ระหว่างดำเนินการ",
    value: "in_progress",
    color: "warning",
    icon: "fas fa-hourglass-half",
    count: 3,
  },
  {
    label: "รับใบรับรองแล้ว",
    value: "completed",
    color: "success",
    icon: "fas fa-file-shield",
    count: 0,
  },
  {
    label: "ต้องแก้ไข",
    value: "correction_required",
    color: "error",
    icon: "fas fa-triangle-exclamation",
    count: 0,
  },
];

interface HCApp {
  id: string;
  requestNo: string;
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
    product: "ทุเรียน",
    destination: "จีน",
    type: "new",
    submittedAt: "15 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HC-003",
    requestNo: "HC-2568-00036",
    product: "ลำไย",
    destination: "เวียดนาม",
    type: "correction",
    submittedAt: "10 ม.ค. 68",
    status: "approved",
  },
  {
    id: "HC-004",
    requestNo: "HC-2568-00034",
    product: "กระเทียม",
    destination: "เกาหลีใต้",
    type: "new",
    submittedAt: "8 ม.ค. 68",
    status: "testing",
  },
  {
    id: "HC-008",
    requestNo: "HC-2568-00025",
    product: "มังคุด",
    destination: "จีน",
    type: "new",
    submittedAt: "2 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HC-010",
    requestNo: "HC-2568-00042",
    product: "ลิ้นจี่",
    destination: "เกาหลีใต้",
    type: "new",
    submittedAt: "16 ม.ค. 68",
    status: "submitted",
  },
  {
    id: "HC-009",
    requestNo: "HC-2568-00022",
    product: "กล้วยหอม",
    destination: "ญี่ปุ่น",
    type: "new",
    submittedAt: "1 ม.ค. 68",
    status: "completed",
  },
  {
    id: "HC-011",
    requestNo: "HC-2568-00020",
    product: "ส้มโอ",
    destination: "สิงคโปร์",
    type: "new",
    submittedAt: "28 ธ.ค. 67",
    status: "rejected",
  },
  {
    id: "HC-012",
    requestNo: "HC-2568-00018",
    product: "มะม่วง",
    destination: "ญี่ปุ่น",
    type: "new",
    submittedAt: "20 ธ.ค. 67",
    status: "completed",
  },
];

const filteredItems = computed(() => {
  let items = allApplications;
  if (filterType.value)
    items = items.filter((i) =>
      filterType.value === "แก้ไขใบรับรอง"
        ? i.type === "correction"
        : i.type === "new",
    );
  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);
  if (activeTab.value === "in_progress")
    items = items.filter((i) =>
      ["submitted", "under_review", "testing", "pending_approval"].includes(
        i.status,
      ),
    );
  else if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);
  return items;
});

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 160 },
  { title: "สินค้า", key: "product", width: 120 },
  { title: "ปลายทาง", key: "destination", width: 120 },
  { title: "ประเภทคำขอ", key: "type", width: 130 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 200 },
  { title: "", key: "actions", width: 140, sortable: false },
];

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    submitted: "hc-user",
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
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    testing: "fas fa-flask",
    pending_approval: "fas fa-gavel",
    approved: "fas fa-circle-check",
    completed: "fas fa-file-shield",
    correction_required: "fas fa-triangle-exclamation",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติแล้ว",
    completed: "รับใบรับรองแล้ว",
    correction_required: "ต้องแก้ไข",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>

<style scoped>
.field-label { font-size: 12px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.75); }
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
</style>
