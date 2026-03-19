<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="page-title mb-1">ใบรับรอง CB</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">รายการใบรับรองที่ได้รับอนุมัติแล้ว</p>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="3">
            <div class="field-label"><div>วันที่ออกใบรับรอง (จาก)</div><div class="field-label-en">Issue Date (From)</div></div>
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
            <div class="field-label"><div>วันที่ออกใบรับรอง (ถึง)</div><div class="field-label-en">Issue Date (To)</div></div>
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
          <v-col cols="auto" class="ml-auto d-flex align-self-center">
            <v-btn variant="tonal" color="grey" rounded="lg" size="small" @click="clearFilters">ล้างตัวกรอง</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="filteredItems" rounded="xl" hover>
        <template #item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'success' : item.status === 'expired' ? 'error' : 'warning'" size="small" variant="tonal">
            {{ item.status === "active" ? "Active" : item.status === "expired" ? "หมดอายุ" : "ใกล้หมดอายุ" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn size="small" color="cb-user" variant="tonal" rounded="lg" prepend-icon="fas fa-eye" @click.stop="viewCert(item)">
              ดู
            </v-btn>
            <v-btn size="small" color="cb-user" variant="outlined" rounded="lg" icon="fas fa-download" @click.stop="downloadCert(item)" />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="560">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
          <v-icon icon="fas fa-certificate" color="cb-user" class="mr-2" size="18" />
          รายละเอียดใบรับรอง
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5" v-if="selectedCert">
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="info-label">Running No.</div>
              <div class="info-value">{{ selectedCert.runNo }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-label">ประเภท</div>
              <div class="info-value">{{ selectedCert.certType }}</div>
            </v-col>
            <v-col cols="12">
              <div class="info-label">ชื่อหน่วยรับรอง</div>
              <div class="info-value">{{ selectedCert.cbName }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-label">วันที่ออก</div>
              <div class="info-value">{{ selectedCert.issueDate }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-label">วันหมดอายุ</div>
              <div class="info-value">{{ selectedCert.expireDate }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-label">สถานะ</div>
              <v-chip :color="selectedCert.status === 'active' ? 'success' : 'error'" size="small" variant="tonal">
                {{ selectedCert.status === "active" ? "Active" : "หมดอายุ" }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="viewDialog = false">ปิด</v-btn>
          <v-btn color="cb-user" rounded="lg" prepend-icon="fas fa-download" @click="downloadCert(selectedCert!)">ดาวน์โหลด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

const filters = reactive({ dateFrom: "", dateTo: "", type: null as string | null, certType: null as string | null });

const typeOptions = [
  { label: "ขึ้นทะเบียน", value: "register" },
  { label: "ต่ออายุ", value: "renew" },
];
const certTypeOptions = [{ label: "CB", value: "CB" }];

const headers = [
  { title: "Running No.", key: "runNo", sortable: true },
  { title: "ชื่อหน่วยรับรอง", key: "cbName", sortable: true },
  { title: "ประเภท", key: "certType", sortable: false },
  { title: "วันที่ออก", key: "issueDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  { id: "cert-001", runNo: "001", cbName: "บ.ไทยเซอร์ติฟาย จก.", certType: "CB", issueDate: "18/02/2566", expireDate: "18/02/2569", status: "active", type: "register" },
  { id: "cert-002", runNo: "002", cbName: "บ.สยามแล็บ จก.", certType: "CB", issueDate: "01/06/2564", expireDate: "01/06/2567", status: "expired", type: "register" },
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

type CertItem = (typeof allItems)[number];
const viewDialog = ref(false);
const selectedCert = ref<CertItem | null>(null);

function viewCert(item: CertItem) { selectedCert.value = item; viewDialog.value = true; }
function downloadCert(_item: CertItem | null) { /* mock */ }
</script>

<style scoped>
.info-label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
.info-value { font-size: 14px; font-weight: 500; }
</style>
