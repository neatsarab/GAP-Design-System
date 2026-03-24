<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">{{ pageTitle }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          จัดการคำขอรับรองมาตรฐานเกษตรอินทรีย์ทั้งหมด
        </p>
      </div>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="4">
            <div class="field-label mb-1">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขที่คำขอ / ชื่อผู้ยื่น"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="6" sm="2">
            <div class="field-label mb-1">
              <div>ประเภท</div>
              <div class="field-label-en">Type</div>
            </div>
            <v-select
              v-model="filterType"
              :items="typeOptions"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="2">
            <div class="field-label mb-1">
              <div>จังหวัด</div>
              <div class="field-label-en">Province</div>
            </div>
            <v-select
              v-model="filterProvince"
              :items="provinceOptions"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="3">
            <div class="field-label mb-1">
              <div>สถานะ</div>
              <div class="field-label-en">Status</div>
            </div>
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              item-title="label"
              item-value="value"
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
          v-if="tab.value !== 'all'"
          :content="countByStatus(tab.value)"
          inline
          :color="tab.color"
          class="ml-1"
        />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        hover
        @click:row="onRowClick"
      >
        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-bold text-org-staff">{{
            item.requestNo
          }}</span>
        </template>
        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'individual' ? 'org-staff' : 'secondary'"
            variant="tonal"
          >
            <v-icon
              start
              :icon="
                item.type === 'individual'
                  ? 'fas fa-user'
                  : 'fas fa-people-group'
              "
              size="10"
            />
            {{ item.type === "individual" ? "รายเดี่ยว" : "รายกลุ่ม" }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip
            size="small"
            :color="statusColor(item.status)"
            variant="tonal"
            :prepend-icon="statusIcon(item.status)"
          >
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="org-staff"
            prepend-icon="fas fa-eye"
            @click.stop="goToApplicationDetail(item.id)"
          >
            ดำเนินการ
          </v-btn>
        </template>
        <template #no-data>
          <div class="pa-10 text-center">
            <v-icon
              icon="fas fa-leaf"
              size="48"
              color="org-staff"
              style="opacity: 0.2"
            />
            <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
              ไม่พบรายการคำขอ
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const pageTitle = computed(() => {
  const sf = route.meta.statusFilter;
  if (sf === "inspection") return "นัดตรวจแปลง ORG";
  if (sf === "pending_cc") return "เสนอแปลงต่อ CC";
  return "รายการคำขอ ORG";
});

const search = ref("");
const filterType = ref(null);
const filterProvince = ref(null);
const filterStatus = ref(null);
const activeTab = ref("all");

const typeOptions = ["รายเดี่ยว", "รายกลุ่ม"];
const provinceOptions = [
  "เชียงใหม่",
  "เชียงราย",
  "อุบลราชธานี",
  "ยโสธร",
  "สุรินทร์",
  "เลย",
];
const statusOptions = [
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "อยู่ระหว่างตรวจสอบเอกสาร", value: "doc_review" },
  { label: "รอแก้ไข", value: "revision_required" },
  { label: "นัดตรวจแปลงแล้ว", value: "inspection_scheduled" },
  { label: "ตรวจแปลงแล้ว", value: "inspected" },
  { label: "รอเสนอ CC", value: "pending_cc" },
  { label: "อยู่ระหว่าง CC", value: "cc_reviewing" },
  { label: "อนุมัติ", value: "approved" },
  { label: "ไม่อนุมัติ", value: "rejected" },
];

const statusTabs = [
  { value: "all", label: "ทั้งหมด", color: "org-staff", icon: "fas fa-list" },
  {
    value: "submitted",
    label: "ยื่นแล้ว",
    color: "org-staff",
    icon: "fas fa-paper-plane",
  },
  {
    value: "doc_review",
    label: "ตรวจเอกสาร",
    color: "info",
    icon: "fas fa-magnifying-glass",
  },
  {
    value: "inspection_scheduled",
    label: "นัดตรวจแล้ว",
    color: "secondary",
    icon: "fas fa-calendar-check",
  },
  {
    value: "pending_cc",
    label: "รอ CC",
    color: "warning",
    icon: "fas fa-gavel",
  },
  {
    value: "approved",
    label: "อนุมัติ",
    color: "success",
    icon: "fas fa-circle-check",
  },
];

const allApplications = [
  {
    id: "ORG-2569-00010",
    requestNo: "ORG-2569-00010",
    applicantName: "นายสมศักดิ์ นาดี",
    farmName: "แปลงข้าวอินทรีย์",
    crop: "ข้าว",
    area: "20",
    type: "individual",
    province: "สุรินทร์",
    submittedDate: "8 มี.ค. 2569",
    status: "submitted",
  },
  {
    id: "ORG-2569-00009",
    requestNo: "ORG-2569-00009",
    applicantName: "นางมาลี พืชผล",
    farmName: "สวนผักอินทรีย์",
    crop: "ผัก",
    area: "8",
    type: "individual",
    province: "อุบลราชธานี",
    submittedDate: "6 มี.ค. 2569",
    status: "doc_review",
  },
  {
    id: "ORG-2569-00008",
    requestNo: "ORG-2569-00008",
    applicantName: "นายวีรชัย เกษตร",
    farmName: "สวนไม้ผลอินทรีย์",
    crop: "ลำไย",
    area: "15",
    type: "individual",
    province: "เชียงราย",
    submittedDate: "1 มี.ค. 2569",
    status: "inspection_scheduled",
  },
  {
    id: "ORG-2569-00007",
    requestNo: "ORG-2569-00007",
    applicantName: "นางสาวรุ่งนภา ฟาร์ม",
    farmName: "แปลงผักอินทรีย์",
    crop: "ผัก",
    area: "5",
    type: "individual",
    province: "เลย",
    submittedDate: "25 ก.พ. 2569",
    status: "revision_required",
  },
  {
    id: "ORG-2569-00006",
    requestNo: "ORG-2569-00006",
    applicantName: "นายประสิทธิ์ มีสุข",
    farmName: "สวนชาอินทรีย์",
    crop: "ชา",
    area: "30",
    type: "individual",
    province: "เชียงใหม่",
    submittedDate: "20 ก.พ. 2569",
    status: "pending_cc",
  },
  {
    id: "ORG-2569-00005",
    requestNo: "ORG-2569-00005",
    applicantName: "นางวิมล ทองดี",
    farmName: "แปลงสมุนไพร",
    crop: "สมุนไพร",
    area: "12",
    type: "individual",
    province: "เลย",
    submittedDate: "10 ก.พ. 2569",
    status: "cc_reviewing",
  },
  {
    id: "ORG-2569-00003",
    requestNo: "ORG-2569-00003",
    applicantName: "นายสมชาย เกษตรดี",
    farmName: "แปลงข้าวอินทรีย์",
    crop: "ข้าว",
    area: "18",
    type: "individual",
    province: "ยโสธร",
    submittedDate: "15 ม.ค. 2569",
    status: "approved",
  },
  {
    id: "ORG-GRP-2569-00004",
    requestNo: "ORG-GRP-2569-00004",
    applicantName: "กลุ่มเกษตรอินทรีย์บ้านโนน",
    farmName: "กลุ่มผักรวม",
    crop: "ผักรวม",
    area: "120",
    type: "group",
    province: "อุบลราชธานี",
    submittedDate: "3 มี.ค. 2569",
    status: "submitted",
  },
  {
    id: "ORG-GRP-2569-00003",
    requestNo: "ORG-GRP-2569-00003",
    applicantName: "วิสาหกิจชุมชนเกษตรอินทรีย์",
    farmName: "กลุ่มข้าวอินทรีย์",
    crop: "ข้าว",
    area: "350",
    type: "group",
    province: "ยโสธร",
    submittedDate: "20 ก.พ. 2569",
    status: "approved",
  },
];

function countByStatus(status) {
  return allApplications.filter((a) => a.status === status).length;
}

const filteredItems = computed(() => {
  let items = allApplications;
  if (filterType.value)
    items = items.filter((i) =>
      filterType.value === "รายเดี่ยว"
        ? i.type === "individual"
        : i.type === "group",
    );
  if (filterProvince.value)
    items = items.filter((i) => i.province === filterProvince.value);
  if (filterStatus.value)
    items = items.filter((i) => i.status === filterStatus.value);
  if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);
  return items;
});

function clearFilters() {
  search.value = "";
  filterType.value = null;
  filterProvince.value = null;
  filterStatus.value = null;
  activeTab.value = "all";
}

const headers = [
  { title: "เลขที่คำขอ", key: "requestNo", width: 170 },
  { title: "ผู้ยื่นคำขอ", key: "applicantName", width: 180 },
  { title: "ชนิดพืช", key: "crop", width: 110 },
  { title: "พื้นที่ (ไร่)", key: "area", width: 100 },
  { title: "ประเภท", key: "type", width: 110 },
  { title: "จังหวัด", key: "province", width: 120 },
  { title: "วันที่ยื่น", key: "submittedDate", width: 130 },
  { title: "สถานะ", key: "status", width: 200 },
  { title: "", key: "actions", width: 130, sortable: false },
];

function onRowClick(_e, row) {
  goToApplicationDetail(row.item.id);
}

function goToApplicationDetail(id) {
  router.push({ name: "ORGStaffApplicationDetail", params: { id } });
}

function statusColor(s) {
  const m = {
    submitted: "org-staff",
    doc_review: "info",
    revision_required: "warning",
    inspection_scheduled: "secondary",
    inspected: "secondary",
    pending_cc: "warning",
    cc_reviewing: "error",
    approved: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function statusIcon(s) {
  const m = {
    submitted: "fas fa-paper-plane",
    doc_review: "fas fa-magnifying-glass",
    revision_required: "fas fa-pen-to-square",
    inspection_scheduled: "fas fa-calendar-check",
    inspected: "fas fa-clipboard-check",
    pending_cc: "fas fa-paper-plane",
    cc_reviewing: "fas fa-gavel",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  const m = {
    submitted: "ยื่นแล้ว",
    doc_review: "อยู่ระหว่างตรวจสอบ",
    revision_required: "รอแก้ไข",
    inspection_scheduled: "นัดตรวจแล้ว",
    inspected: "ตรวจแปลงแล้ว",
    pending_cc: "รอเสนอ CC",
    cc_reviewing: "อยู่ระหว่าง CC",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>
