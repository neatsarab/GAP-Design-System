<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการคำขอ CB</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ตรวจสอบสถานะคำขอที่ยื่นไปแล้ว</p>
      </div>
      <v-btn color="cb-user" prepend-icon="fas fa-plus" rounded="lg" @click="router.push('/cb/user/applications/new')">
        ยื่นคำขอใหม่
      </v-btn>
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
              placeholder="ประเภทคำขอทั้งหมด"
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
              placeholder="ประเภทใบรับรองทั้งหมด"
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
          <v-btn variant="tonal" color="grey" rounded="lg" size="small" prepend-icon="fas fa-rotate-left" @click="clearFilters">ล้างตัวกรอง</v-btn>
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
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="cb-user"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/cb/user/applications/${item.id}`)"
          >
            ดู / แก้ไข
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filters = reactive({ dateFrom: "", dateTo: "", type: null, certType: null });

const typeOptions = [
  { label: "ขึ้นทะเบียน", value: "register" },
  { label: "ต่ออายุ", value: "renew" },
  { label: "เพิ่ม/ลดขอบข่าย", value: "scope" },
  { label: "อื่น ๆ", value: "other" },
];

const certTypeOptions = [
  { label: "CB", value: "CB" },
];

const headers = [
  { title: "Running No.", key: "runNo", sortable: true },
  { title: "ประเภทคำขอ", key: "type", sortable: true },
  { title: "ประเภทใบรับรอง", key: "certType", sortable: false },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  { id: "CB-2568-001", runNo: "001", type: "register", certType: "CB", submittedDate: "18/02/2568", status: "under_review" },
  { id: "CB-2568-002", runNo: "002", type: "renew",    certType: "CB", submittedDate: "05/03/2568", status: "approved" },
  { id: "CB-2568-003", runNo: "003", type: "scope",    certType: "CB", submittedDate: "10/03/2568", status: "draft" },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.certType) items = items.filter((i) => i.certType === filters.certType);
  return items;
});

function clearFilters() {
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.type = null;
  filters.certType = null;
}

function statusColor(s) {
  const m = { draft: "grey", under_review: "warning", approved: "success", rejected: "error", revision_required: "orange" };
  return m[s] ?? "grey";
}
function statusLabel(s) {
  const m = { draft: "แบบร่าง", under_review: "อยู่ระหว่างพิจารณา", approved: "อนุมัติแล้ว", rejected: "ไม่ผ่าน", revision_required: "รอแก้ไข" };
  return m[s] ?? s;
}

function typeLabel(t) {
  const m = { register: "ขึ้นทะเบียน", renew: "ต่ออายุ", scope: "เพิ่ม/ลดขอบข่าย", other: "อื่น ๆ" };
  return m[t] ?? t;
}
</script>
