<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">รายการคำขอ DOA</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการคำขอขึ้นทะเบียนโรงงานผลิตสินค้าพืชของคุณ
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
            color="doa-user"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/doa/user/applications/${item.id}`)"
            >ดู</v-btn
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
  certType: null as string | null,
});

const typeOptions = [
  { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
  { label: "เปลี่ยนแปลงทะเบียน", value: "amendment" },
  { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
];

const certTypeOptions = [
  { label: "DOA", value: "doa" },
  { label: "GMP", value: "gmp" },
  { label: "HACCP", value: "haccp" },
];

const headers = [
  { title: "Running No.", key: "runNo", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "ประเภทใบรับรอง", key: "certType", sortable: false },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  {
    id: "DOA-2568-001",
    runNo: "001",
    type: "register",
    certType: "DOA",
    submittedDate: "01/01/2568",
    status: "reviewing",
  },
  {
    id: "DOA-2568-002",
    runNo: "002",
    type: "amendment",
    certType: "DOA",
    submittedDate: "05/02/2568",
    status: "pending",
  },
  {
    id: "DOA-2568-003",
    runNo: "003",
    type: "scope",
    certType: "GMP",
    submittedDate: "10/03/2568",
    status: "approved",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.certType)
    items = items.filter((i) => i.certType.toLowerCase() === filters.certType);
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
      register: "ขึ้นทะเบียน / ต่ออายุ",
      amendment: "เปลี่ยนแปลงทะเบียน",
      scope: "เพิ่ม / ลดขอบข่าย",
    }[t] ?? t
  );
}
function statusColor(s: string) {
  return (
    {
      pending: "warning",
      reviewing: "info",
      approved: "success",
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
      rejected: "ไม่ผ่าน",
    }[s] ?? s
  );
}
</script>
