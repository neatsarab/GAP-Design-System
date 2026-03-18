<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">รายการคำขอ</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการคำขอจดทะเบียนผู้ส่งออกทั้งหมด
      </p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">วันที่ยื่น (จาก) <span class="field-label-en">Submit Date (From)</span></div>
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
            <div class="field-label">วันที่ยื่น (ถึง) <span class="field-label-en">Submit Date (To)</span></div>
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
            <div class="field-label">ประเภทคำขอ <span class="field-label-en">Request Type</span></div>
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
            <div class="field-label">สถานะคำขอ <span class="field-label-en">Status</span></div>
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
        :headers="headers"
        :items="filteredItems"
        rounded="xl"
        hover
        @click:row="
          (_event: MouseEvent, { item }: { item: (typeof allItems)[0] }) =>
            router.push(`/export/staff/applications/${item.id}`)
        "
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
            color="export-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/export/staff/applications/${item.id}`)"
            >ดูรายละเอียด</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null as string | null,
  status: null as string | null,
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
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  {
    id: "EXP-2568-001",
    requestNo: "EXP-0001",
    type: "kk1",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submittedDate: "01/01/2568",
    status: "pending",
  },
  {
    id: "EXP-2568-002",
    requestNo: "EXP-0002",
    type: "smpv5",
    applicant: "บ.กรีนฟาร์ม จก.",
    submittedDate: "05/02/2568",
    status: "need_edit",
  },
  {
    id: "EXP-2568-003",
    requestNo: "EXP-0003",
    type: "smpv5",
    applicant: "บ.สยามเอ็กซ์พอร์ต จก.",
    submittedDate: "10/03/2568",
    status: "reviewing",
  },
  {
    id: "EXP-2568-004",
    requestNo: "EXP-0004",
    type: "smpv5_other",
    applicant: "บ.ไทยโปรดิวส์ จก.",
    submittedDate: "12/03/2568",
    status: "signing",
  },
  {
    id: "EXP-2568-005",
    requestNo: "EXP-0005",
    type: "amendment",
    applicant: "บ.เอเชียฟาร์ม จก.",
    submittedDate: "15/03/2568",
    status: "approved",
  },
  {
    id: "EXP-2568-006",
    requestNo: "EXP-0006",
    type: "kk1",
    applicant: "บ.ไทยอะกริ จก.",
    submittedDate: "20/03/2568",
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

function typeLabel(t: string) {
  return (
    {
      kk1: "ก.ก.1",
      smpv5: "สมพ.5",
      smpv5_other: "สมพ.5 (กรณีอื่น)",
      amendment: "ขอแก้ไขใบรับรอง",
    }[t] ?? t
  );
}

function statusColor(s: string) {
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

function statusLabel(s: string) {
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

<style scoped>
.filter-card,
.data-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.field-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 4px;
}
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
</style>
