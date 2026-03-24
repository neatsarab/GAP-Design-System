<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">รายการคำขอ</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการคำขอจดทะเบียนผู้ส่งออกของคุณ
      </p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>วันที่ยื่น (จาก)</div>
              <div class="field-label-en">Submit Date (From)</div>
            </div>
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
            <div class="field-label">
              <div>วันที่ยื่น (ถึง)</div>
              <div class="field-label-en">Submit Date (To)</div>
            </div>
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
            <div class="field-label">
              <div>ประเภทคำขอ</div>
              <div class="field-label-en">Request Type</div>
            </div>
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
            <div class="field-label">
              <div>สถานะคำขอ</div>
              <div class="field-label-en">Status</div>
            </div>
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

    <!-- New Application Button -->
    <div class="d-flex justify-end mb-4">
      <v-btn
        color="export-user"
        rounded="lg"
        prepend-icon="fas fa-plus"
        @click="goToNewApplication"
      >
        จดทะเบียนใหม่
      </v-btn>
    </div>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        rounded="xl"
        hover
      >
        <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
        <template #item.submitterStatus="{ item }">
          <v-chip
            :color="
              item.submitterStatus === 'ตัวแทน' ? 'secondary' : 'export-user'
            "
            size="x-small"
            variant="tonal"
          >
            {{ item.submitterStatus }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            size="small"
            variant="tonal"
            >{{ statusLabel(item.status) }}</v-chip
          >
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              v-if="item.status === 'draft' || item.status === 'need_edit'"
              size="small"
              color="export-user"
              variant="tonal"
              rounded="lg"
              prepend-icon="fas fa-pen"
              @click.stop
              >แก้ไข</v-btn
            >
            <v-btn
              v-if="item.status !== 'approved'"
              size="small"
              color="error"
              variant="tonal"
              rounded="lg"
              icon="fas fa-xmark"
              @click.stop
            />
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToNewApplication() {
  router.push({ name: "ExportUserApplicationType" });
}

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null,
  status: null,
});

const typeOptions = [
  { label: "ก.ก.1", value: "kk1" },
  { label: "สมพ.5", value: "smpv5" },
  { label: "สมพ.5 (กรณีอื่น)", value: "smpv5_other" },
  { label: "ขอแก้ไขใบรับรอง", value: "amendment" },
];

const statusOptions = [
  { label: "รอตรวจสอบ", value: "pending" },
  { label: "รอแก้ไขคำขอ", value: "need_edit" },
  { label: "รอพิจารณา", value: "reviewing" },
  { label: "รอลงนาม", value: "signing" },
  { label: "ได้รับอนุญาต", value: "approved" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "ผู้ยื่นคำขอ", key: "applicant", sortable: true },
  { title: "สถานะผู้ยื่น", key: "submitterStatus", sortable: false },
  { title: "ผู้มอบอำนาจ", key: "principal", sortable: false },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะคำขอ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  {
    id: "EXP-2569-001",
    requestNo: "EXP-0001",
    type: "kk1",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "01/01/2569",
    status: "pending",
  },
  {
    id: "EXP-2569-002",
    requestNo: "EXP-0002",
    type: "smpv5",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "ตัวแทน",
    principal: "นายสมชาย ใจดี",
    submittedDate: "05/02/2569",
    status: "need_edit",
  },
  {
    id: "EXP-2569-003",
    requestNo: "EXP-0003",
    type: "smpv5",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "10/03/2569",
    status: "reviewing",
  },
  {
    id: "EXP-2569-004",
    requestNo: "EXP-0004",
    type: "smpv5_other",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "12/03/2569",
    status: "signing",
  },
  {
    id: "EXP-2569-005",
    requestNo: "EXP-0005",
    type: "amendment",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "15/03/2569",
    status: "approved",
  },
  {
    id: "EXP-2569-006",
    requestNo: "EXP-0006",
    type: "kk1",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "ตัวแทน",
    principal: "นายวิชัย สมบูรณ์",
    submittedDate: "20/03/2569",
    status: "pending",
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

function typeLabel(t) {
  return (
    {
      kk1: "ก.ก.1",
      smpv5: "สมพ.5",
      smpv5_other: "สมพ.5 (กรณีอื่น)",
      amendment: "ขอแก้ไขใบรับรอง",
    }[t] ?? t
  );
}

function statusColor(s) {
  return (
    {
      pending: "warning",
      need_edit: "orange",
      reviewing: "info",
      signing: "secondary",
      approved: "success",
    }[s] ?? "grey"
  );
}

function statusLabel(s) {
  return (
    {
      pending: "รอตรวจสอบ",
      need_edit: "รอแก้ไขคำขอ",
      reviewing: "รอพิจารณา",
      signing: "รอลงนาม",
      approved: "ได้รับอนุญาต",
    }[s] ?? s
  );
}
</script>
