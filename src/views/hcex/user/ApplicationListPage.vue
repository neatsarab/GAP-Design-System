<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">คำขอของฉัน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการคำขอใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืชทั้งหมด
        </p>
      </div>
      <v-btn
        color="hcex-user"
        prepend-icon="fas fa-file-pen"
        @click="goToNewApplication"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5">
            <div class="field-label">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขคำขอ / ผู้รับสินค้า"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
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
              placeholder="สถานะทั้งหมด"
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
          <span class="text-body-2 font-weight-medium text-hcex-user">{{
            item.requestNo
          }}</span>
        </template>
        <template #item.certType="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'correction' ? 'secondary' : 'hcex-user'"
            variant="tonal"
          >
            {{ item.type === "correction" ? "แก้ไขใบรับรอง" : item.certType }}
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
            color="hcex-user"
            prepend-icon="fas fa-eye"
            @click.stop="goToApplicationDetail(item.id)"
          >
            ติดตามสถานะ
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToNewApplication() {
  router.push({ name: "HCEXUserApplicationType" });
}

function goToApplicationDetail(id) {
  router.push({ name: "HCEXUserApplicationDetail", params: { id } });
}

const search = ref("");
const filterType = ref(null);
const filterStatus = ref(null);
const activeTab = ref("all");

function onRowClick(_e, row) {
  goToApplicationDetail(row.item.id);
}
function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterStatus.value = null;
  activeTab.value = "all";
}

const typeOptions = ["กมพ.1", "กมพ.1-1", "กมพ.1-2", "กมพ.1-3", "แก้ไขใบรับรอง"];
const statusOptions = [
  { label: "ฉบับร่าง", value: "draft" },
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "อยู่ระหว่างตรวจสอบ", value: "under_review" },
  { label: "รอพิจารณา Lab", value: "lab_verification" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ไม่อนุมัติ", value: "rejected" },
  { label: "รับใบรับรองแล้ว", value: "completed" },
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
    color: "primary",
    icon: "fas fa-hourglass-half",
    count: 2,
  },
  {
    label: "รับใบรับรองแล้ว",
    value: "completed",
    color: "success",
    icon: "fas fa-industry",
    count: 0,
  },
  {
    label: "ไม่อนุมัติ",
    value: "rejected",
    color: "error",
    icon: "fas fa-circle-xmark",
    count: 0,
  },
];

const allApplications = [
  {
    id: "HCEX-001",
    requestNo: "HCEX-2569-00012",
    certType: "กมพ.1",
    consignee: "Nippon Foods Co., Ltd.",
    destination: "ญี่ปุ่น",
    type: "new",
    submittedAt: "10 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HCEX-002",
    requestNo: "HCEX-2569-00010",
    certType: "กมพ.1-1",
    consignee: "Beijing Import Trading",
    destination: "จีน",
    type: "new",
    submittedAt: "5 ม.ค. 68",
    status: "lab_verification",
  },
  {
    id: "HCEX-003",
    requestNo: "HCEX-2569-00008",
    certType: "กมพ.1",
    consignee: "Seoul Food Distribution",
    destination: "เกาหลีใต้",
    type: "new",
    submittedAt: "2 ม.ค. 68",
    status: "approved",
  },
  {
    id: "HCEX-004",
    requestNo: "HCEX-2569-00005",
    certType: "กมพ.1-3",
    consignee: "SG Fresh Market Pte.",
    destination: "สิงคโปร์",
    type: "new",
    submittedAt: "20 ธ.ค. 67",
    status: "completed",
  },
  {
    id: "HCEX-005",
    requestNo: "HCEX-2569-00003",
    certType: "กมพ.1-2",
    consignee: "HK Agri Import Ltd.",
    destination: "ฮ่องกง",
    type: "new",
    submittedAt: "15 ธ.ค. 67",
    status: "completed",
  },
  {
    id: "HCEX-006",
    requestNo: "HCEX-2569-00001",
    certType: "กมพ.1",
    consignee: "Vietnam Fresh Import Co.",
    destination: "เวียดนาม",
    type: "correction",
    submittedAt: "10 ธ.ค. 67",
    status: "rejected",
  },
  {
    id: "HCEX-007",
    requestNo: "HCEX-2569-00013",
    certType: "กมพ.1-1",
    consignee: "Malaysia Food Corp.",
    destination: "มาเลเซีย",
    type: "new",
    submittedAt: "12 ม.ค. 68",
    status: "draft",
  },
];

const filteredItems = computed(() => {
  let items = allApplications;
  if (filterType.value) {
    if (filterType.value === "แก้ไขใบรับรอง") {
      items = items.filter((i) => i.type === "correction");
    } else {
      items = items.filter(
        (i) => i.certType === filterType.value && i.type === "new",
      );
    }
  }
  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);
  if (activeTab.value === "in_progress")
    items = items.filter((i) =>
      ["submitted", "under_review", "lab_verification"].includes(i.status),
    );
  else if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);
  return items;
});

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 170 },
  { title: "ประเภทคำขอ", key: "certType", width: 130 },
  { title: "ผู้รับสินค้า", key: "consignee", width: 200 },
  { title: "ประเทศปลายทาง", key: "destination", width: 130 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 200 },
  { title: "", key: "actions", width: 150, sortable: false },
];

function getStatusColor(s) {
  const m = {
    draft: "grey",
    submitted: "primary",
    under_review: "info",
    lab_verification: "secondary",
    approved: "success",
    rejected: "error",
    completed: "success",
  };
  return m[s] ?? "grey";
}
function getStatusIcon(s) {
  const m = {
    draft: "fas fa-pen",
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    lab_verification: "fas fa-flask-vial",
    approved: "fas fa-circle-check",
    completed: "fas fa-industry",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s) {
  const m = {
    draft: "ฉบับร่าง",
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    lab_verification: "รอพิจารณา Lab",
    approved: "อนุมัติแล้ว",
    completed: "รับใบรับรองแล้ว",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>
