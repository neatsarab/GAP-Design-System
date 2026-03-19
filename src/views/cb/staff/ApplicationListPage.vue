<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="page-title mb-1">รายการคำขอ CB</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการคำขอขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืชทั้งหมด
      </p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="3">
            <div class="field-label"><div>วันที่ยื่น (จาก)</div><div class="field-label-en">Submit Date (From)</div></div>
            <v-text-field
              v-model="filters.dateFrom"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label"><div>วันที่ยื่น (ถึง)</div><div class="field-label-en">Submit Date (To)</div></div>
            <v-text-field
              v-model="filters.dateTo"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label"><div>ประเภทคำขอ</div><div class="field-label-en">Request Type</div></div>
            <v-autocomplete
              v-model="filters.type"
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
          <v-col cols="12" sm="6" md="3">
            <div class="field-label"><div>สถานะคำขอ</div><div class="field-label-en">Status</div></div>
            <v-autocomplete
              v-model="filters.status"
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

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="filteredItems"
        show-select
        item-value="id"
        rounded="xl"
        hover
      >
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
            color="cb-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/cb/staff/applications/${item.id}`)"
          >
            ดู
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selected = ref<string[]>([]);

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null as string | null,
  status: null as string | null,
});

const typeOptions = [
  { label: "ขึ้นทะเบียน", value: "register" },
  { label: "ต่ออายุ", value: "renew" },
  { label: "เพิ่ม/ลดขอบข่าย", value: "scope" },
  { label: "อื่น ๆ", value: "other" },
];

const statusOptions = [
  { label: "รอพิจารณา", value: "pending" },
  { label: "อยู่ระหว่างพิจารณา", value: "reviewing" },
  { label: "ผ่าน", value: "approved" },
  { label: "ปรับปรุง", value: "improve" },
  { label: "ไม่ผ่าน", value: "rejected" },
];

const headers = [
  { title: "Running No.", key: "runNo", sortable: true },
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "ผู้ยื่นคำขอ", key: "applicant", sortable: true },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  {
    id: "CB-2568-001",
    runNo: "001",
    requestNo: "CB-0001",
    type: "register",
    applicant: "บ.ไทยเซอร์ติฟาย จก.",
    submittedDate: "01/01/2568",
    status: "pending",
  },
  {
    id: "CB-2568-002",
    runNo: "002",
    requestNo: "CB-0002",
    type: "renew",
    applicant: "บ.สยามแล็บ จก.",
    submittedDate: "05/02/2568",
    status: "reviewing",
  },
  {
    id: "CB-2568-003",
    runNo: "003",
    requestNo: "CB-0003",
    type: "scope",
    applicant: "บ.กรีนเซิร์ต จก.",
    submittedDate: "10/03/2568",
    status: "approved",
  },
  {
    id: "CB-2568-004",
    runNo: "004",
    requestNo: "CB-0004",
    type: "register",
    applicant: "บ.อีสานเซอร์ต จก.",
    submittedDate: "12/03/2568",
    status: "improve",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.status) items = items.filter((i) => i.status === filters.status);
  return items;
});

function clearFilters() {
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.type = null;
  filters.status = null;
}

function typeLabel(t: string) {
  return (
    {
      register: "ขึ้นทะเบียน",
      renew: "ต่ออายุ",
      scope: "เพิ่ม/ลดขอบข่าย",
      other: "อื่น ๆ",
    }[t] ?? t
  );
}
function statusColor(s: string) {
  return (
    {
      pending: "warning",
      reviewing: "info",
      approved: "success",
      improve: "orange",
      rejected: "error",
    }[s] ?? "grey"
  );
}
function statusLabel(s: string) {
  return (
    {
      pending: "รอพิจารณา",
      reviewing: "อยู่ระหว่างพิจารณา",
      approved: "ผ่าน",
      improve: "ปรับปรุง",
      rejected: "ไม่ผ่าน",
    }[s] ?? s
  );
}
</script>
