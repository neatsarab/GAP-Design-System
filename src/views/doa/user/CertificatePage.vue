<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">ใบรับรอง DOA</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายการใบรับรองขึ้นทะเบียนโรงงานผลิตสินค้าพืชที่ได้รับการอนุมัติ
      </p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">วันที่ออกใบรับรอง (จาก) <span class="field-label-en">Issue Date (From)</span></div>
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
            <div class="field-label">วันที่ออกใบรับรอง (ถึง) <span class="field-label-en">Issue Date (To)</span></div>
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
            <div class="field-label">ประเภทใบรับรอง <span class="field-label-en">Certificate Type</span></div>
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
        <template #item.status="{ item }">
          <v-chip
            :color="
              item.status === 'active'
                ? 'success'
                : item.status === 'expiring'
                  ? 'warning'
                  : 'error'
            "
            size="small"
            variant="tonal"
          >
            {{
              item.status === "active"
                ? "Active"
                : item.status === "expiring"
                  ? "ใกล้หมดอายุ"
                  : "หมดอายุ"
            }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              size="small"
              color="doa-user"
              variant="tonal"
              rounded="lg"
              prepend-icon="fas fa-eye"
              @click.stop="openDetail(item)"
              >ดู</v-btn
            >
            <v-btn
              size="small"
              color="grey"
              variant="tonal"
              rounded="lg"
              icon="fas fa-download"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="560">
      <v-card rounded="xl">
        <v-card-title
          class="pa-5 pb-3 d-flex align-center justify-space-between text-body-1 font-weight-bold"
        >
          <span
            ><v-icon
              icon="fas fa-certificate"
              color="doa-user"
              class="mr-2"
              size="18"
            />รายละเอียดใบรับรอง</span
          >
          <v-chip
            v-if="selected"
            :color="
              selected.status === 'active'
                ? 'success'
                : selected.status === 'expiring'
                  ? 'warning'
                  : 'error'
            "
            size="small"
            variant="tonal"
          >
            {{
              selected.status === "active"
                ? "Active"
                : selected.status === "expiring"
                  ? "ใกล้หมดอายุ"
                  : "หมดอายุ"
            }}
          </v-chip>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5" v-if="selected">
          <v-row dense>
            <v-col cols="6"
              ><div class="info-label">Running No.</div>
              <div class="info-value">{{ selected.runNo }}</div></v-col
            >
            <v-col cols="6"
              ><div class="info-label">ประเภทคำขอ</div>
              <div class="info-value">
                {{ typeLabel(selected.type) }}
              </div></v-col
            >
            <v-col cols="12"
              ><div class="info-label">ชื่อโรงงาน</div>
              <div class="info-value">{{ selected.factoryName }}</div></v-col
            >
            <v-col cols="6"
              ><div class="info-label">มาตรฐาน</div>
              <div class="info-value">{{ selected.standard }}</div></v-col
            >
            <v-col cols="6"
              ><div class="info-label">ประเภทใบรับรอง</div>
              <div class="info-value">{{ selected.certType }}</div></v-col
            >
            <v-col cols="6"
              ><div class="info-label">วันที่ออกใบรับรอง</div>
              <div class="info-value">{{ selected.issueDate }}</div></v-col
            >
            <v-col cols="6"
              ><div class="info-label">วันหมดอายุ</div>
              <div class="info-value">{{ selected.expireDate }}</div></v-col
            >
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="detailDialog = false"
            >ปิด</v-btn
          >
          <v-btn
            color="doa-user"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-download"
            >ดาวน์โหลด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null as string | null,
  certType: null as string | null,
});
const detailDialog = ref(false);

interface CertItem {
  id: string;
  runNo: string;
  factoryName: string;
  type: string;
  standard: string;
  certType: string;
  issueDate: string;
  expireDate: string;
  status: "active" | "expiring" | "expired";
}

const allItems: CertItem[] = [
  {
    id: "c1",
    runNo: "001",
    factoryName: "โรงงานไทยเกษตรอินเตอร์",
    type: "register",
    standard: "มกษ. 9023-2550",
    certType: "DOA",
    issueDate: "01/01/2566",
    expireDate: "01/01/2569",
    status: "active",
  },
  {
    id: "c2",
    runNo: "002",
    factoryName: "โรงงานสยามฟาร์มโปรดักส์",
    type: "register",
    standard: "มกษ. 9024-2550",
    certType: "DOA",
    issueDate: "15/03/2565",
    expireDate: "15/03/2568",
    status: "expiring",
  },
  {
    id: "c3",
    runNo: "003",
    factoryName: "โรงงานกรีนโปรเซส",
    type: "scope",
    standard: "ISO 22000",
    certType: "GMP",
    issueDate: "10/01/2563",
    expireDate: "10/01/2566",
    status: "expired",
  },
];

const typeOptions = [
  { label: "ขึ้นทะเบียน / ต่ออายุ", value: "register" },
  { label: "เปลี่ยนแปลงทะเบียน", value: "amendment" },
  { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
];
const certTypeOptions = [
  { label: "DOA", value: "DOA" },
  { label: "GMP", value: "GMP" },
  { label: "HACCP", value: "HACCP" },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.certType)
    items = items.filter((i) => i.certType === filters.certType);
  return items;
});

function clearFilters() {
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.type = null;
  filters.certType = null;
}

const headers = [
  { title: "Running No.", key: "runNo", sortable: true },
  { title: "ชื่อโรงงาน", key: "factoryName", sortable: true },
  { title: "มาตรฐาน", key: "standard", sortable: false },
  { title: "วันที่ออกใบรับรอง", key: "issueDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const selected = ref<CertItem | null>(null);
function openDetail(item: CertItem) {
  selected.value = item;
  detailDialog.value = true;
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
.info-label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
}
.info-value {
  font-size: 14px;
  font-weight: 500;
}
</style>
