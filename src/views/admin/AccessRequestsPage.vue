<template>
  <div>
    <!-- Page header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="text-h6 font-weight-bold mb-1">คำขอสมัครใช้งาน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการคำขอสมัครเข้าใช้งานระบบของผู้ประกอบการ
        </p>
      </div>
      <div class="d-flex align-center ga-2">
        <v-chip color="warning" variant="tonal" prepend-icon="fas fa-clock">
          รอพิจารณา {{ pendingCount }}
        </v-chip>
      </div>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="filter-card mb-5">
      <v-card-text class="pa-4">
        <div class="d-flex align-center ga-3 flex-wrap">
          <div style="min-width: 260px; max-width: 360px">
            <div class="field-label mb-1">
              ค้นหา <span class="field-label-en">Search</span>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาชื่อผู้ประกอบการ / เลขนิติบุคคล"
              prepend-inner-icon="fas fa-magnifying-glass"
              hide-details
              density="compact"
              rounded="lg"
              clearable
            />
          </div>
          <div style="min-width: 180px; max-width: 220px">
            <div class="field-label mb-1">
              ระบบ <span class="field-label-en">System</span>
            </div>
            <v-autocomplete
              v-model="filterSystem"
              :items="systemOptions"
              item-title="label"
              item-value="value"
              placeholder="ระบบทั้งหมด"
              hide-details
              density="compact"
              rounded="lg"
              clearable
            />
          </div>
          <div style="min-width: 160px; max-width: 200px">
            <div class="field-label mb-1">
              สถานะ <span class="field-label-en">Status</span>
            </div>
            <v-autocomplete
              v-model="filterStatus"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              placeholder="สถานะทั้งหมด"
              hide-details
              density="compact"
              rounded="lg"
              clearable
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="table-card">
      <v-data-table
        :headers="headers"
        :items="filteredRequests"
        items-per-page="10"
        rounded="xl"
      >
        <!-- Operator -->
        <template #item.operator="{ item }">
          <div class="py-1">
            <div class="text-body-2 font-weight-medium">{{ item.operatorName }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.taxId }}</div>
          </div>
        </template>

        <!-- Entity type -->
        <template #item.entityType="{ item }">
          <v-chip size="x-small" :color="item.entityType === 'juristic' ? 'info' : 'success'" variant="tonal">
            <v-icon start :icon="item.entityType === 'juristic' ? 'fas fa-building' : 'fas fa-user'" size="10" />
            {{ item.entityType === "juristic" ? "นิติบุคคล" : "บุคคลธรรมดา" }}
          </v-chip>
        </template>

        <!-- Systems + per-system status -->
        <template #item.systems="{ item }">
          <div class="d-flex flex-column ga-1 py-1">
            <div
              v-for="sys in item.systems"
              :key="sys"
              class="d-flex align-center ga-1"
            >
              <v-chip size="x-small" color="admin" variant="tonal">{{ sys }}</v-chip>
              <v-chip size="x-small" :color="statusColor(item.systemApprovals[sys])" variant="tonal">
                <v-icon start :icon="statusIcon(item.systemApprovals[sys])" size="9" />
                {{ statusLabel(item.systemApprovals[sys]) }}
              </v-chip>
            </div>
          </div>
        </template>

        <!-- Responsible officers -->
        <template #item.officers="{ item }">
          <div class="d-flex flex-column ga-1 py-1">
            <div v-for="sys in item.systems" :key="sys" class="d-flex align-center ga-1">
              <span class="sys-tag">{{ sys }}</span>
              <span class="text-caption">{{ systemOwners[sys]?.name ?? '-' }}</span>
            </div>
          </div>
        </template>

        <!-- Date -->
        <template #item.requestDate="{ item }">
          <span class="text-body-2">{{ item.requestDate }}</span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn
            size="x-small"
            color="info"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click="openDetail(item)"
          >ดู</v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail dialog -->
    <v-dialog v-model="detailDialog" max-width="560">
      <v-card v-if="selectedItem" rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-file-circle-check" color="info" size="20" />
          <span class="text-body-1 font-weight-bold">รายละเอียดคำขอ</span>
          <v-spacer />
          <v-btn icon="fas fa-xmark" variant="text" size="small" @click="detailDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <!-- Operator info -->
          <div class="detail-row">
            <span class="detail-label">ผู้ประกอบการ</span>
            <span class="text-body-2 font-weight-medium">{{ selectedItem.operatorName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">เลขประจำตัว</span>
            <span class="text-body-2">{{ selectedItem.taxId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ประเภท</span>
            <v-chip size="x-small" :color="selectedItem.entityType === 'juristic' ? 'info' : 'success'" variant="tonal">
              <v-icon start :icon="selectedItem.entityType === 'juristic' ? 'fas fa-building' : 'fas fa-user'" size="10" />
              {{ selectedItem.entityType === "juristic" ? "นิติบุคคล" : "บุคคลธรรมดา" }}
            </v-chip>
          </div>
          <div class="detail-row">
            <span class="detail-label">วันที่ยื่นคำขอ</span>
            <span class="text-body-2">{{ selectedItem.requestDate }}</span>
          </div>

          <v-divider class="my-4" />

          <!-- Per-system approval -->
          <div class="text-body-2 font-weight-bold mb-3">การพิจารณาแยกตามระบบ</div>
          <div
            v-for="sys in selectedItem.systems"
            :key="sys"
            class="sys-approval-row"
          >
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="d-flex align-center ga-2">
                <v-chip size="x-small" color="admin" variant="tonal">{{ sys }}</v-chip>
                <v-chip size="x-small" :color="statusColor(selectedItem.systemApprovals[sys])" variant="tonal">
                  <v-icon start :icon="statusIcon(selectedItem.systemApprovals[sys])" size="9" />
                  {{ statusLabel(selectedItem.systemApprovals[sys]) }}
                </v-chip>
              </div>
              <div class="d-flex ga-1" v-if="selectedItem.systemApprovals[sys] === 'pending'">
                <v-btn size="x-small" color="success" variant="tonal" rounded="lg" prepend-icon="fas fa-check" @click="approveSystem(selectedItem, sys)">อนุมัติ</v-btn>
                <v-btn size="x-small" color="error" variant="tonal" rounded="lg" prepend-icon="fas fa-xmark" @click="rejectSystem(selectedItem, sys)">ปฏิเสธ</v-btn>
              </div>
            </div>
            <div class="officer-info">
              <v-icon icon="fas fa-user-tie" size="12" class="mr-1" />
              <span class="text-caption font-weight-medium">{{ systemOwners[sys]?.name ?? '-' }}</span>
              <span class="text-caption text-medium-emphasis ml-1">· {{ systemOwners[sys]?.section ?? '' }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface SystemApproval {
  [system: string]: "pending" | "approved" | "rejected";
}

interface AccessRequest {
  id: number;
  operatorName: string;
  taxId: string;
  entityType: "personal" | "juristic";
  systems: string[];
  systemApprovals: SystemApproval;
  requestDate: string;
}

const systemOwners: Record<string, { name: string; section: string }> = {
  GAP:    { name: "นางสาวสุดา วิชาการ",       section: "กลุ่มรับรอง GAP" },
  DOA:    { name: "นายวิจัย ตรวจดี",           section: "กลุ่มทะเบียนโรงงาน" },
  CB:     { name: "นางสาวประภา ออกใบ",         section: "กลุ่มหน่วยรับรอง" },
  ORG:    { name: "นายสมชาย เกษตรอินทรีย์",   section: "กลุ่มเกษตรอินทรีย์" },
  EL:     { name: "นางมาลี รายชื่อ",           section: "กลุ่ม Establishment List" },
  HC:     { name: "นายชัยวัฒน์ สุขอนามัย",    section: "กลุ่มสุขอนามัยพืช" },
  HCEX:   { name: "นายชัยวัฒน์ สุขอนามัย",    section: "กลุ่มสุขอนามัยพืช" },
  ส่งออก: { name: "นางสาวปวีณา ส่งออก",       section: "กลุ่มทะเบียนผู้ส่งออก" },
};

const search = ref("");
const filterSystem = ref<string | null>(null);
const filterStatus = ref<string | null>(null);
const detailDialog = ref(false);
const selectedItem = ref<AccessRequest | null>(null);

const systemOptions = [
  { label: "GAP", value: "GAP" },
  { label: "ORG", value: "ORG" },
  { label: "DOA", value: "DOA" },
  { label: "CB", value: "CB" },
  { label: "EL", value: "EL" },
  { label: "HC", value: "HC" },
  { label: "ส่งออก", value: "ส่งออก" },
];

const statusOptions = [
  { label: "รอพิจารณา", value: "pending" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ปฏิเสธ", value: "rejected" },
];

const headers = [
  { title: "ผู้ประกอบการ", key: "operator", sortable: false },
  { title: "ประเภท", key: "entityType", sortable: false },
  { title: "ระบบ / สถานะ", key: "systems", sortable: false },
  { title: "ผู้รับผิดชอบ", key: "officers", sortable: false },
  { title: "วันที่ยื่น", key: "requestDate", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const requests = ref<AccessRequest[]>([
  {
    id: 1,
    operatorName: "บริษัท ไทยเกษตรอินเตอร์ จำกัด",
    taxId: "0105565012345",
    entityType: "juristic",
    systems: ["GAP", "DOA"],
    systemApprovals: { GAP: "pending", DOA: "pending" },
    requestDate: "17 มี.ค. 2568",
  },
  {
    id: 2,
    operatorName: "นิธิพร เทิบจันทึก",
    taxId: "3 1001 00123 45 6",
    entityType: "personal",
    systems: ["GAP"],
    systemApprovals: { GAP: "pending" },
    requestDate: "16 มี.ค. 2568",
  },
  {
    id: 3,
    operatorName: "บริษัท สยามออร์แกนิค จำกัด",
    taxId: "0105566078901",
    entityType: "juristic",
    systems: ["ORG"],
    systemApprovals: { ORG: "approved" },
    requestDate: "15 มี.ค. 2568",
  },
  {
    id: 4,
    operatorName: "บริษัท ดีโอเอโปรดักส์ จำกัด",
    taxId: "0105564023456",
    entityType: "juristic",
    systems: ["DOA", "CB"],
    systemApprovals: { DOA: "pending", CB: "approved" },
    requestDate: "14 มี.ค. 2568",
  },
  {
    id: 5,
    operatorName: "นายสมชาย รักดี",
    taxId: "1 2003 00456 78 9",
    entityType: "personal",
    systems: ["EL"],
    systemApprovals: { EL: "rejected" },
    requestDate: "12 มี.ค. 2568",
  },
  {
    id: 6,
    operatorName: "บริษัท เซิร์ทบอดี้ไทย จำกัด",
    taxId: "0105562099999",
    entityType: "juristic",
    systems: ["CB", "EL", "HC"],
    systemApprovals: { CB: "approved", EL: "pending", HC: "pending" },
    requestDate: "10 มี.ค. 2568",
  },
]);

// Overall pending = any system still pending
const pendingCount = computed(() =>
  requests.value.filter((r) =>
    r.systems.some((s) => r.systemApprovals[s] === "pending")
  ).length
);

const filteredRequests = computed(() => {
  const q = search.value.toLowerCase();
  return requests.value.filter((r) => {
    if (filterSystem.value && !r.systems.includes(filterSystem.value)) return false;
    if (filterStatus.value) {
      const hasStatus = r.systems.some((s) => r.systemApprovals[s] === filterStatus.value);
      if (!hasStatus) return false;
    }
    if (q && !r.operatorName.toLowerCase().includes(q) && !r.taxId.includes(q)) return false;
    return true;
  });
});

function statusColor(s: string) {
  return s === "pending" ? "warning" : s === "approved" ? "success" : "error";
}
function statusIcon(s: string) {
  return s === "pending" ? "fas fa-clock" : s === "approved" ? "fas fa-check" : "fas fa-xmark";
}
function statusLabel(s: string) {
  return s === "pending" ? "รอพิจารณา" : s === "approved" ? "อนุมัติ" : "ปฏิเสธ";
}

function openDetail(item: AccessRequest) {
  selectedItem.value = item;
  detailDialog.value = true;
}

function approveSystem(item: AccessRequest, sys: string) {
  item.systemApprovals[sys] = "approved";
}

function rejectSystem(item: AccessRequest, sys: string) {
  item.systemApprovals[sys] = "rejected";
}
</script>

<style scoped>
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
}
.field-label-en {
  font-size: 11px;
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.4);
  margin-left: 4px;
}
.filter-card,
.table-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.detail-row:last-child {
  border-bottom: none;
}
.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
  min-width: 120px;
  flex-shrink: 0;
}
/* Per-system approval block */
.sys-approval-row {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 8px;
}
.sys-approval-row:last-child {
  margin-bottom: 0;
}
.officer-info {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
/* Small system tag in table */
.sys-tag {
  font-size: 10px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.45);
  min-width: 36px;
}
</style>
