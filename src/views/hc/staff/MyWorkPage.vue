<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">งานที่ได้รับมอบหมาย</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          แสดงเฉพาะคำขอที่อยู่ในขั้นตอนความรับผิดชอบของบทบาทที่เลือก
        </p>
      </div>
    </div>

    <!-- Search -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              label="ค้นหาเลขคำขอ / ผู้ส่งออก"
              prepend-inner-icon="fas fa-search"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="filterType"
              label="ประเภทคำขอ"
              :items="typeOptions"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="auto" class="d-flex align-self-center">
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

    <!-- Role Selector -->
    <v-chip-group v-model="selectedRole" class="mb-4" mandatory>
      <v-chip
        v-for="role in roles"
        :key="role.value"
        :value="role.value"
        :color="role.color"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start :icon="role.icon" size="12" />
        {{ role.label }}
        <v-badge
          :content="countByStatus(role.statuses)"
          inline
          :color="role.color"
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
        <!-- Empty state -->
        <template #no-data>
          <div class="text-center py-10">
            <v-icon
              icon="fas fa-circle-check"
              size="40"
              :color="currentRole.color"
              class="mb-3"
            />
            <p class="text-body-2 text-medium-emphasis mb-0">
              ไม่มีงานค้างในขั้นตอนนี้
            </p>
          </div>
        </template>

        <template #item.requestNo="{ item }">
          <span class="text-body-2 font-weight-medium text-info">{{
            item.requestNo
          }}</span>
        </template>

        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            :color="item.type === 'correction' ? 'warning' : 'info'"
            variant="tonal"
          >
            <v-icon
              start
              :icon="
                item.type === 'correction'
                  ? 'fas fa-pen-to-square'
                  : 'fas fa-file-shield'
              "
              size="10"
            />
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
            :color="currentRole.color"
            :prepend-icon="currentRole.actionIcon"
            @click.stop="router.push(`/hc/staff/applications/${item.id}`)"
          >
            {{ currentRole.actionLabel }}
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

const typeOptions = ["ขอใบรับรอง", "แก้ไขใบรับรอง"];

function clearFilters() {
  search.value = "";
  filterType.value = null;
}

interface Role {
  value: string;
  label: string;
  icon: string;
  color: string;
  desc: string;
  statuses: string[];
  actionLabel: string;
  actionIcon: string;
}

const roles: Role[] = [
  {
    value: "intake",
    label: "เจ้าหน้าที่รับเรื่อง",
    icon: "fas fa-inbox",
    color: "hc-staff",
    desc: "รับและตรวจสอบความครบถ้วนของคำขอที่ยื่นเข้ามา",
    statuses: ["submitted"],
    actionLabel: "รับเรื่อง",
    actionIcon: "fas fa-inbox",
  },
  {
    value: "reviewer",
    label: "เจ้าหน้าที่ตรวจสอบ",
    icon: "fas fa-magnifying-glass",
    color: "warning",
    desc: "ตรวจสอบเอกสารและข้อมูลคำขอให้ครบถ้วนถูกต้อง",
    statuses: ["under_review"],
    actionLabel: "ตรวจสอบ",
    actionIcon: "fas fa-magnifying-glass",
  },
  {
    value: "lab",
    label: "เจ้าหน้าที่ Lab",
    icon: "fas fa-flask",
    color: "secondary",
    desc: "บันทึกผลการตรวจวิเคราะห์ตัวอย่างจากห้องปฏิบัติการ",
    statuses: ["testing"],
    actionLabel: "บันทึกผล Lab",
    actionIcon: "fas fa-flask",
  },
  {
    value: "approver",
    label: "ผู้พิจารณาอนุมัติ",
    icon: "fas fa-gavel",
    color: "primary",
    desc: "พิจารณาและอนุมัติการออกใบรับรองสุขอนามัยพืช",
    statuses: ["pending_approval"],
    actionLabel: "พิจารณา",
    actionIcon: "fas fa-gavel",
  },
];

const selectedRole = ref<string>("intake");
const currentRole = computed(
  () => roles.find((r) => r.value === selectedRole.value)!,
);

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
  {
    id: "HC-011",
    requestNo: "HC-2568-00043",
    exporter: "บ.ไทยฟรุ๊ต จำกัด",
    product: "ลำไย",
    destination: "จีน",
    type: "new",
    submittedAt: "17 ม.ค. 68",
    status: "submitted",
  },
  {
    id: "HC-012",
    requestNo: "HC-2568-00044",
    exporter: "บ.สยามเฟรช จำกัด",
    product: "มะพร้าว",
    destination: "อินเดีย",
    type: "correction",
    submittedAt: "17 ม.ค. 68",
    status: "under_review",
  },
  {
    id: "HC-013",
    requestNo: "HC-2568-00045",
    exporter: "บ.ภาคเหนือเกษตร จำกัด",
    product: "กระเทียม",
    destination: "ไต้หวัน",
    type: "new",
    submittedAt: "18 ม.ค. 68",
    status: "testing",
  },
  {
    id: "HC-014",
    requestNo: "HC-2568-00046",
    exporter: "บ.อีสานเกษตร จำกัด",
    product: "ข้าวโพด",
    destination: "มาเลเซีย",
    type: "new",
    submittedAt: "18 ม.ค. 68",
    status: "pending_approval",
  },
];

function countByStatus(statuses: string[]) {
  return allApplications.filter((a) => statuses.includes(a.status)).length;
}

const filteredItems = computed(() => {
  let items = allApplications.filter((a) =>
    currentRole.value.statuses.includes(a.status),
  );
  if (filterType.value) {
    const t = filterType.value === "แก้ไขใบรับรอง" ? "correction" : "new";
    items = items.filter((a) => a.type === t);
  }
  return items;
});

function onRowClick(_e: unknown, row: { item: HCApp }) {
  router.push(`/hc/staff/applications/${row.item.id}`);
}

const headers = [
  { title: "เลขคำขอ", key: "requestNo", width: 160 },
  { title: "ผู้ส่งออก", key: "exporter", width: 200 },
  { title: "สินค้า", key: "product", width: 110 },
  { title: "ปลายทาง", key: "destination", width: 120 },
  { title: "ประเภทคำขอ", key: "type", width: 130 },
  { title: "วันที่ยื่น", key: "submittedAt", width: 110 },
  { title: "สถานะ", key: "status", width: 150 },
  { title: "", key: "actions", width: 140, sortable: false },
];

function getStatusColor(s: string) {
  const m: Record<string, string> = {
    submitted: "info",
    under_review: "warning",
    testing: "secondary",
    pending_approval: "primary",
    approved: "success",
    completed: "success",
    correction_required: "error",
    rejected: "error",
    draft: "grey",
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
    draft: "fas fa-pen",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = {
    submitted: "ยื่นแล้ว",
    under_review: "รอตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติแล้ว",
    completed: "เสร็จสิ้น",
    correction_required: "ต้องแก้ไข",
    rejected: "ไม่อนุมัติ",
    draft: "ฉบับร่าง",
  };
  return m[s] ?? s;
}
</script>
