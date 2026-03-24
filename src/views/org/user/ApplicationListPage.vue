<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการคำขอ ORG ของฉัน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ติดตามสถานะคำขอรับรองมาตรฐานเกษตรอินทรีย์ทั้งหมด
        </p>
      </div>
      <v-btn
        color="org-user"
        prepend-icon="fas fa-file-pen"
        @click="goToNewApplication"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5">
            <div class="field-label mb-1">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขที่คำขอ / ชื่อแปลง"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="3">
            <div class="field-label mb-1">
              <div>ประเภทคำขอ</div>
              <div class="field-label-en">Type</div>
            </div>
            <v-select
              v-model="filterType"
              :items="typeOptions"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
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
              @click="
                search = '';
                filterType = null;
                activeTab = 'all';
              "
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
          <span class="text-body-2 font-weight-bold text-org-user">{{
            item.requestNo
          }}</span>
        </template>
        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'individual' ? 'org-user' : 'secondary'"
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
            color="org-user"
            prepend-icon="fas fa-eye"
            @click.stop="goToApplicationDetail(item.id)"
          >
            ดูรายละเอียด
          </v-btn>
        </template>
        <template #no-data>
          <div class="pa-10 text-center">
            <v-icon
              icon="fas fa-leaf"
              size="48"
              color="org-user"
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
import { useRouter } from "vue-router";

const router = useRouter();
const search = ref("");
const filterType = ref(null);
const activeTab = ref("all");

const typeOptions = ["รายเดี่ยว", "รายกลุ่ม"];

const statusTabs = [
  { value: "all", label: "ทั้งหมด", color: "org-user", icon: "fas fa-list" },
  {
    value: "submitted",
    label: "ยื่นแล้ว",
    color: "org-user",
    icon: "fas fa-paper-plane",
  },
  {
    value: "under_review",
    label: "อยู่ระหว่างตรวจสอบ",
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
    value: "revision_required",
    label: "รอแก้ไข",
    color: "warning",
    icon: "fas fa-pen-to-square",
  },
  {
    value: "approved",
    label: "อนุมัติแล้ว",
    color: "success",
    icon: "fas fa-circle-check",
  },
  {
    value: "rejected",
    label: "ไม่ผ่าน",
    color: "error",
    icon: "fas fa-circle-xmark",
  },
];

const applications = [
  {
    id: "ORG-2569-00003",
    requestNo: "ORG-2569-00003",
    farmName: "แปลงสวนอินทรีย์ A",
    crop: "ข้าว",
    area: "15",
    type: "individual",
    submittedDate: "5 มี.ค. 2569",
    status: "under_review",
  },
  {
    id: "ORG-2569-00002",
    requestNo: "ORG-2569-00002",
    farmName: "แปลงสวนอินทรีย์ B",
    crop: "ผัก",
    area: "8",
    type: "individual",
    submittedDate: "20 ก.พ. 2569",
    status: "inspection_scheduled",
  },
  {
    id: "ORG-2569-00001",
    requestNo: "ORG-2569-00001",
    farmName: "แปลงสวนอินทรีย์ A",
    crop: "สมุนไพร",
    area: "15",
    type: "individual",
    submittedDate: "10 ม.ค. 2569",
    status: "approved",
  },
  {
    id: "ORG-GRP-2569-00001",
    requestNo: "ORG-GRP-2569-00001",
    farmName: "กลุ่มเกษตรอินทรีย์บ้านโนน",
    crop: "ผักรวม",
    area: "120",
    type: "group",
    submittedDate: "1 มี.ค. 2569",
    status: "revision_required",
  },
];

function countByStatus(status) {
  if (status === "all") return applications.length;
  return applications.filter((a) => a.status === status).length;
}

const filteredItems = computed(() => {
  let items = applications;
  if (filterType.value)
    items = items.filter((i) =>
      filterType.value === "รายเดี่ยว"
        ? i.type === "individual"
        : i.type === "group",
    );
  if (activeTab.value !== "all")
    items = items.filter((i) => i.status === activeTab.value);
  return items;
});

const headers = [
  { title: "เลขที่คำขอ", key: "requestNo", width: 170 },
  { title: "ชื่อแปลง", key: "farmName", width: 200 },
  { title: "ชนิดพืช", key: "crop", width: 120 },
  { title: "พื้นที่ (ไร่)", key: "area", width: 110 },
  { title: "ประเภท", key: "type", width: 110 },
  { title: "วันที่ยื่น", key: "submittedDate", width: 130 },
  { title: "สถานะ", key: "status", width: 180 },
  { title: "", key: "actions", width: 140, sortable: false },
];

function onRowClick(_e, row) {
  goToApplicationDetail(row.item.id);
}

function goToNewApplication() {
  router.push({ name: "ORGUserApplicationType" });
}

function goToApplicationDetail(id) {
  router.push({ name: "ORGUserApplicationDetail", params: { id } });
}

function statusColor(s) {
  const map = {
    submitted: "org-user",
    under_review: "info",
    inspection_scheduled: "secondary",
    revision_required: "warning",
    approved: "success",
    rejected: "error",
  };
  return map[s] ?? "grey";
}
function statusIcon(s) {
  const map = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    inspection_scheduled: "fas fa-calendar-check",
    revision_required: "fas fa-pen-to-square",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
  };
  return map[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  const map = {
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    inspection_scheduled: "นัดตรวจแล้ว",
    revision_required: "รอแก้ไข",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่ผ่าน",
  };
  return map[s] ?? s;
}
</script>
