<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">ลงนาม DOA</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการคำขอที่ผ่านการพิจารณาทะเบียนแล้ว
        รอเจ้าหน้าที่ผู้มีอำนาจลงนามอนุมัติ
      </p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="4">
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
          <v-col cols="12" sm="6" md="4">
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
          <v-col cols="12" sm="6" md="4">
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
        <template #item.reviewResult="{ item }">
          <v-chip
            :color="item.reviewResult === 'approved' ? 'success' : 'warning'"
            size="small"
            variant="tonal"
          >
            {{ item.reviewResult === "approved" ? "ผ่าน" : "ปรับปรุง" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="doa-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-pen-nib"
            @click.stop="
              router.push(`/doa/staff/applications/${item.id}?step=3`)
            "
          >
            ลงนาม
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
  { title: "ผลพิจารณา", key: "reviewResult", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  {
    id: "DOA-2568-003",
    runNo: "003",
    requestNo: "DOA-0003",
    type: "register",
    applicant: "บ.เอเชียฟาร์ม จก.",
    submittedDate: "10/03/2568",
    reviewResult: "approved",
  },
  {
    id: "DOA-2568-007",
    runNo: "007",
    requestNo: "DOA-0007",
    type: "scope",
    applicant: "บ.สยามกรีน จก.",
    submittedDate: "16/03/2568",
    reviewResult: "approved",
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
