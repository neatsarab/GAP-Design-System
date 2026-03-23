<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">พิจารณาทะเบียน DOA</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการคำขอที่ผ่านการตรวจสอบเบื้องต้นแล้ว รอเจ้าหน้าที่พิจารณาทะเบียน
      </p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="4">
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
          <v-col cols="12" sm="6" md="4">
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
          <v-col cols="12" sm="6" md="4">
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
        <template #item.status>
          <v-chip color="info" size="small" variant="tonal"
            >อยู่ระหว่างพิจารณา</v-chip
          >
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="doa-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-scale-balanced"
            @click.stop="
              router.push(`/doa/staff/applications/${item.id}?step=2`)
            "
          >
            พิจารณา
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
});

const typeOptions = [
  { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
  { label: "เปลี่ยนแปลงทะเบียน", value: "amendment" },
  { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
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
    id: "DOA-2568-002",
    runNo: "002",
    requestNo: "DOA-0002",
    type: "register",
    applicant: "บ.ไทยโปรเซส จก.",
    submittedDate: "05/02/2568",
  },
  {
    id: "DOA-2568-005",
    runNo: "005",
    requestNo: "DOA-0005",
    type: "amendment",
    applicant: "บ.เอเชียฟาร์ม จก.",
    submittedDate: "14/03/2568",
  },
  {
    id: "DOA-2568-006",
    runNo: "006",
    requestNo: "DOA-0006",
    type: "scope",
    applicant: "บ.นอร์ธกรีน จก.",
    submittedDate: "15/03/2568",
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
</script>

