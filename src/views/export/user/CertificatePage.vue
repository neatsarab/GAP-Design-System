<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">ใบรับรอง</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการใบรับรองการจดทะเบียนผู้ส่งออกที่ได้รับการอนุมัติ
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
            <div class="field-label"><div>ประเภทใบรับรอง</div><div class="field-label-en">Certificate Type</div></div>
            <v-autocomplete
              v-model="filters.certType"
              :items="certTypeOptions"
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
      >
        <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
        <template #item.status>
          <v-chip color="success" size="small" variant="tonal"
            >ได้รับอนุญาต</v-chip
          >
        </template>
        <template #item.actions>
          <div class="d-flex ga-1 justify-end">
            <v-btn
              size="small"
              color="export-user"
              variant="tonal"
              rounded="lg"
              prepend-icon="fas fa-download"
            >
              ดาวน์โหลด
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null as string | null,
  certType: null as string | null,
});

const typeOptions = [
  { label: "ก.ก.1", value: "kk1" },
  { label: "สมพ.5", value: "smpv5" },
  { label: "สมพ.5 (กรณีอื่น)", value: "smpv5_other" },
  { label: "ขอแก้ไขใบรับรอง", value: "amendment" },
];

const certTypeOptions = [
  { label: "ก.ก.1", value: "kk1" },
  { label: "สมพ.5", value: "smpv5" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "ผู้ยื่นคำขอ", key: "applicant", sortable: true },
  { title: "สถานะผู้ยื่น", key: "submitterStatus", sortable: false },
  { title: "ผู้มอบอำนาจ", key: "principal", sortable: false },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะคำขอ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  {
    id: "EXP-2568-005",
    requestNo: "EXP-0005",
    type: "amendment",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "15/03/2568",
    status: "approved",
  },
  {
    id: "EXP-2567-010",
    requestNo: "EXP-0010",
    type: "smpv5",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "01/06/2567",
    status: "approved",
  },
  {
    id: "EXP-2567-003",
    requestNo: "EXP-0003",
    type: "kk1",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "ตัวแทน",
    principal: "นายสมชาย ใจดี",
    submittedDate: "20/02/2567",
    status: "approved",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  return items;
});

function clearFilters() {
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.type = null;
  filters.certType = null;
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
</script>

<style scoped>
</style>
