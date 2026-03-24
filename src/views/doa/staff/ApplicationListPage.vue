<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">รายการคำขอ DOA</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการคำขอขึ้นทะเบียนโรงงานผลิตสินค้าพืชทั้งหมด
      </p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="4">
            <div class="field-label">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขคำขอ / ผู้ยื่นคำขอ"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label">
              <div>ประเภทคำขอ</div>
              <div class="field-label-en">Request Type</div>
            </div>
            <v-autocomplete
              v-model="filterType"
              :items="typeOptions"
              item-title="label"
              item-value="value"
              placeholder="ทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <div class="field-label">
              <div>สถานะ</div>
              <div class="field-label-en">Status</div>
            </div>
            <v-autocomplete
              v-model="filterStatus"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              placeholder="ทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="auto" class="ml-auto">
            <v-btn
              variant="tonal"
              color="grey"
              size="small"
              prepend-icon="fas fa-rotate-left"
              @click="clearFilters"
              >ล้างตัวกรอง</v-btn
            >
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
          <span class="text-body-2 font-weight-medium text-doa-staff">{{
            item.requestNo
          }}</span>
        </template>
        <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            size="small"
            variant="tonal"
            >{{ statusLabel(item.status) }}</v-chip
          >
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="doa-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="goToApplicationDetail(item.id)"
            >ดูรายละเอียด</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const search = ref("");
const filterType = ref(null);
const filterStatus = ref(null);
const activeTab = ref("all");

function onRowClick(_e, row) {
  goToApplicationDetail(row.item.id);
}

function goToApplicationDetail(id) {
  router.push({ name: "DOAStaffApplicationDetail", params: { id } });
}
function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterStatus.value = null;
  activeTab.value = "all";
}

const typeOptions = [
  { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
  { label: "เปลี่ยนแปลงทะเบียน", value: "amendment" },
  { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
];
const statusOptions = [
  { label: "รอพิจารณา", value: "pending" },
  { label: "อยู่ระหว่างพิจารณา", value: "reviewing" },
  { label: "รอลงนาม", value: "signing" },
  { label: "ผ่าน", value: "approved" },
  { label: "ปรับปรุง", value: "improve" },
  { label: "ไม่ผ่าน", value: "rejected" },
];
const statusTabs = [
  {
    label: "ทั้งหมด",
    value: "all",
    color: "primary",
    icon: "fas fa-list",
    count: 0,
  },
  {
    label: "รอพิจารณา",
    value: "pending",
    color: "warning",
    icon: "fas fa-clock",
    count: 1,
  },
  {
    label: "อยู่ระหว่างพิจารณา",
    value: "reviewing",
    color: "info",
    icon: "fas fa-magnifying-glass",
    count: 1,
  },
  {
    label: "รอลงนาม",
    value: "signing",
    color: "secondary",
    icon: "fas fa-pen-nib",
    count: 1,
  },
  {
    label: "ผ่าน",
    value: "approved",
    color: "success",
    icon: "fas fa-circle-check",
    count: 1,
  },
  {
    label: "ไม่ผ่าน",
    value: "rejected",
    color: "error",
    icon: "fas fa-circle-xmark",
    count: 0,
  },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 150 },
  { title: "ประเภทคำขอ", key: "type", width: 180 },
  { title: "ผู้ยื่นคำขอ", key: "applicant" },
  { title: "วันที่ยื่น", key: "submittedDate", width: 130 },
  { title: "สถานะ", key: "status", width: 190 },
  { title: "", key: "actions", width: 150, sortable: false },
];

const allItems = [
  {
    id: "DOA-2569-001",
    runNo: "001",
    requestNo: "DOA-0001",
    type: "register",
    applicant: "บ.สยามฟู้ด จก.",
    submittedDate: "01/01/2569",
    status: "pending",
  },
  {
    id: "DOA-2569-002",
    runNo: "002",
    requestNo: "DOA-0002",
    type: "register",
    applicant: "บ.ไทยโปรเซส จก.",
    submittedDate: "05/02/2569",
    status: "reviewing",
  },
  {
    id: "DOA-2569-003",
    runNo: "003",
    requestNo: "DOA-0003",
    type: "amendment",
    applicant: "บ.เอเชียฟาร์ม จก.",
    submittedDate: "10/03/2569",
    status: "signing",
  },
  {
    id: "DOA-2569-004",
    runNo: "004",
    requestNo: "DOA-0004",
    type: "scope",
    applicant: "บ.กรีนฟู้ด จก.",
    submittedDate: "12/03/2569",
    status: "approved",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (filterType.value)
    items = items.filter((i) => i.type === filterType.value);
  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);
  if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);
  return items;
});

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
      signing: "secondary",
      approved: "success",
      improve: "warning",
      rejected: "error",
    }[s] ?? "grey"
  );
}
function statusLabel(s) {
  return (
    {
      pending: "รอพิจารณา",
      reviewing: "อยู่ระหว่างพิจารณา",
      signing: "รอลงนาม",
      approved: "ผ่าน",
      improve: "ปรับปรุง",
      rejected: "ไม่ผ่าน",
    }[s] ?? s
  );
}
</script>
