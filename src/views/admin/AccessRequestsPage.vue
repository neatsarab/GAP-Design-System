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
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
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
          <div v-if="!restrictedSystem" style="width: 160px">
            <div class="field-label mb-1">
              <div>ระบบ</div>
              <div class="field-label-en">System</div>
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
          <div style="width: 160px">
            <div class="field-label mb-1">
              <div>สถานะ</div>
              <div class="field-label-en">Status</div>
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
            <div class="text-body-2 font-weight-medium">
              {{ item.operatorName }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ item.taxId }}
            </div>
          </div>
        </template>

        <!-- Entity type -->
        <template #item.entityType="{ item }">
          <v-chip
            size="small"
            :color="item.entityType === 'juristic' ? 'info' : 'success'"
            variant="tonal"
          >
            <v-icon
              start
              :icon="
                item.entityType === 'juristic'
                  ? 'fas fa-building'
                  : 'fas fa-user'
              "
              size="11"
            />
            {{ item.entityType === "juristic" ? "นิติบุคคล" : "บุคคลธรรมดา" }}
          </v-chip>
        </template>

        <!-- Systems -->
        <template #item.systems="{ item }">
          <div class="d-flex flex-wrap ga-1 py-1">
            <v-chip
              v-for="sys in visibleSystems(item)"
              :key="sys"
              class="chip-fit"
              color="admin"
              variant="tonal"
              >{{ sys }}</v-chip
            >
          </div>
        </template>

        <!-- Status per system -->
        <template #item.status="{ item }">
          <div class="d-flex flex-wrap ga-1 py-1">
            <v-chip
              v-for="sys in visibleSystems(item)"
              :key="sys"
              class="chip-fit"
              :color="statusColor(item.systemApprovals[sys])"
              variant="tonal"
            >
              <v-icon
                start
                :icon="statusIcon(item.systemApprovals[sys])"
                size="10"
              />
              {{ statusLabel(item.systemApprovals[sys]) }}
            </v-chip>
          </div>
        </template>

        <!-- Requester -->
        <template #item.officers="{ item }">
          <div class="py-1">
            <div class="text-body-2">{{ item.requesterName }}</div>
          </div>
        </template>

        <!-- Date -->
        <template #item.requestDate="{ item }">
          <span class="text-body-2">{{ item.requestDate }}</span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1 justify-end">
            <v-btn
              size="x-small"
              color="info"
              variant="tonal"
              rounded="lg"
              prepend-icon="fas fa-eye"
              @click="openDetail(item)"
              >ดู</v-btn
            >
            <template v-if="hasPending(item)">
              <v-btn
                size="x-small"
                color="success"
                variant="tonal"
                rounded="lg"
                prepend-icon="fas fa-check"
                @click="approveAll(item)"
                >อนุมัติ</v-btn
              >
              <v-btn
                size="x-small"
                color="error"
                variant="tonal"
                rounded="lg"
                prepend-icon="fas fa-xmark"
                @click="rejectAll(item)"
                >ปฏิเสธ</v-btn
              >
            </template>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail dialog -->
    <v-dialog v-model="detailDialog" max-width="560" scrollable>
      <v-card v-if="selectedItem" rounded="xl" max-height="90vh">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-file-circle-check" color="info" size="20" />
          <span class="text-body-1 font-weight-bold">รายละเอียดคำขอ</span>
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            @click="detailDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <!-- Operator info -->
          <div class="detail-row">
            <span class="detail-label">ผู้ประกอบการ</span>
            <span class="text-body-2 font-weight-medium">{{
              selectedItem.operatorName
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">เลขประจำตัว</span>
            <span class="text-body-2">{{ selectedItem.taxId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ประเภท</span>
            <v-chip
              size="x-small"
              :color="
                selectedItem.entityType === 'juristic' ? 'info' : 'success'
              "
              variant="tonal"
            >
              <v-icon
                start
                :icon="
                  selectedItem.entityType === 'juristic'
                    ? 'fas fa-building'
                    : 'fas fa-user'
                "
                size="10"
              />
              {{
                selectedItem.entityType === "juristic"
                  ? "นิติบุคคล"
                  : "บุคคลธรรมดา"
              }}
            </v-chip>
          </div>
          <div class="detail-row">
            <span class="detail-label">วันที่ยื่นคำขอ</span>
            <span class="text-body-2">{{ selectedItem.requestDate }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ผู้ยื่นคำขอ</span>
            <span class="text-body-2">{{ selectedItem.requesterName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">เบอร์ติดต่อ</span>
            <span class="text-body-2">{{ selectedItem.requesterPhone }}</span>
          </div>

          <v-divider class="my-4" />

          <!-- Attachments -->
          <div class="text-body-2 font-weight-bold mb-3">เอกสารแนบ</div>
          <div
            v-if="selectedItem.attachments.length === 0"
            class="text-caption text-medium-emphasis mb-3"
          >
            ไม่มีเอกสารแนบ
          </div>
          <div class="d-flex flex-column ga-2 mb-1">
            <div
              v-for="(file, i) in selectedItem.attachments"
              :key="i"
              class="attachment-row"
            >
              <v-icon
                :icon="attachmentIcon(file.type)"
                size="16"
                class="attachment-icon"
                :color="attachmentColor(file.type)"
              />
              <div class="flex-1-1">
                <div class="text-body-2">{{ file.name }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ file.size }}
                </div>
              </div>
              <v-btn
                size="x-small"
                variant="tonal"
                color="info"
                rounded="lg"
                prepend-icon="fas fa-eye"
                :href="file.url"
                target="_blank"
                >ดู</v-btn
              >
              <v-btn
                size="x-small"
                variant="tonal"
                color="secondary"
                rounded="lg"
                icon="fas fa-download"
                :href="file.url"
                download
              />
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- Per-system approval -->
          <div class="text-body-2 font-weight-bold mb-3">
            การพิจารณาแยกตามระบบ
          </div>
          <div
            v-for="sys in visibleSystems(selectedItem)"
            :key="sys"
            class="sys-approval-row"
          >
            <!-- System + status -->
            <div class="d-flex align-center ga-2 mb-3">
              <v-chip size="x-small" color="admin" variant="tonal">{{
                sys
              }}</v-chip>
              <v-chip
                size="x-small"
                :color="statusColor(selectedItem.systemApprovals[sys])"
                variant="tonal"
              >
                <v-icon
                  start
                  :icon="statusIcon(selectedItem.systemApprovals[sys])"
                  size="9"
                />
                {{ statusLabel(selectedItem.systemApprovals[sys]) }}
              </v-chip>
            </div>
            <!-- Action buttons -->
            <v-row v-if="selectedItem.systemApprovals[sys] === 'pending'" dense>
              <v-col cols="6">
                <v-btn
                  color="success"
                  variant="tonal"
                  rounded="lg"
                  prepend-icon="fas fa-check"
                  block
                  @click="approveSystem(selectedItem, sys)"
                  >อนุมัติ</v-btn
                >
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="error"
                  variant="tonal"
                  rounded="lg"
                  prepend-icon="fas fa-xmark"
                  block
                  @click="rejectSystem(selectedItem, sys)"
                  >ปฏิเสธ</v-btn
                >
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAdminStore } from "@/stores/admin.store";

const adminStore = useAdminStore();

const officerSystemMap: Record<string, string> = {
  adminsso01: "GAP",
  adminsso02: "ORG",
};

const restrictedSystem = computed(
  () => officerSystemMap[adminStore.username] ?? null,
);

interface SystemApproval {
  [system: string]: "pending" | "approved" | "rejected";
}

interface Attachment {
  name: string;
  size: string;
  type: "pdf" | "image" | "doc";
  url: string;
}

interface AccessRequest {
  id: number;
  operatorName: string;
  taxId: string;
  entityType: "personal" | "juristic";
  systems: string[];
  systemApprovals: SystemApproval;
  requestDate: string;
  requesterName: string;
  requesterPhone: string;
  attachments: Attachment[];
}

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
  { title: "ระบบ", key: "systems", sortable: false },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "ผู้ยื่นคำขอ", key: "officers", sortable: false },
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
    requesterName: "นายอานนท์ เกษตรดี",
    requesterPhone: "081-234-5678",
    attachments: [
      {
        name: "หนังสือรับรองบริษัท.pdf",
        size: "1.2 MB",
        type: "pdf",
        url: "#",
      },
      { name: "สำเนาบัตรประชาชน.pdf", size: "540 KB", type: "pdf", url: "#" },
      { name: "แผนที่ตั้งฟาร์ม.jpg", size: "2.1 MB", type: "image", url: "#" },
    ],
  },
  {
    id: 2,
    operatorName: "นิธิพร เทิบจันทึก",
    taxId: "3 1001 00123 45 6",
    entityType: "personal",
    systems: ["GAP"],
    systemApprovals: { GAP: "pending" },
    requestDate: "16 มี.ค. 2568",
    requesterName: "นิธิพร เทิบจันทึก",
    requesterPhone: "089-111-2233",
    attachments: [
      { name: "สำเนาบัตรประชาชน.pdf", size: "480 KB", type: "pdf", url: "#" },
      { name: "โฉนดที่ดิน.pdf", size: "3.4 MB", type: "pdf", url: "#" },
    ],
  },
  {
    id: 3,
    operatorName: "บริษัท สยามออร์แกนิค จำกัด",
    taxId: "0105566078901",
    entityType: "juristic",
    systems: ["ORG"],
    systemApprovals: { ORG: "approved" },
    requestDate: "15 มี.ค. 2568",
    requesterName: "นางสาวพิมพ์ใจ สีเขียว",
    requesterPhone: "062-345-6789",
    attachments: [
      {
        name: "หนังสือรับรองบริษัท.pdf",
        size: "1.0 MB",
        type: "pdf",
        url: "#",
      },
      { name: "ใบอนุญาตประกอบการ.pdf", size: "760 KB", type: "pdf", url: "#" },
      { name: "รูปถ่ายสถานที่.jpg", size: "1.8 MB", type: "image", url: "#" },
    ],
  },
  {
    id: 4,
    operatorName: "บริษัท ดีโอเอโปรดักส์ จำกัด",
    taxId: "0105564023456",
    entityType: "juristic",
    systems: ["DOA", "CB"],
    systemApprovals: { DOA: "pending", CB: "approved" },
    requestDate: "14 มี.ค. 2568",
    requesterName: "นายวิชัย ผลิตภัณฑ์",
    requesterPhone: "065-987-6543",
    attachments: [
      {
        name: "หนังสือรับรองบริษัท.pdf",
        size: "1.1 MB",
        type: "pdf",
        url: "#",
      },
      { name: "แบบฟอร์มคำขอ.docx", size: "320 KB", type: "doc", url: "#" },
    ],
  },
  {
    id: 5,
    operatorName: "นายสมชาย รักดี",
    taxId: "1 2003 00456 78 9",
    entityType: "personal",
    systems: ["EL"],
    systemApprovals: { EL: "rejected" },
    requestDate: "12 มี.ค. 2568",
    requesterName: "นายสมชาย รักดี",
    requesterPhone: "091-456-7890",
    attachments: [
      { name: "สำเนาบัตรประชาชน.pdf", size: "510 KB", type: "pdf", url: "#" },
    ],
  },
  {
    id: 6,
    operatorName: "บริษัท เซิร์ทบอดี้ไทย จำกัด",
    taxId: "0105562099999",
    entityType: "juristic",
    systems: ["CB", "EL", "HC"],
    systemApprovals: { CB: "approved", EL: "pending", HC: "pending" },
    requestDate: "10 มี.ค. 2568",
    requesterName: "นางสาวกัลยา รับรอง",
    requesterPhone: "083-654-3210",
    attachments: [
      {
        name: "หนังสือรับรองบริษัท.pdf",
        size: "980 KB",
        type: "pdf",
        url: "#",
      },
      { name: "ใบรับรอง ISO.pdf", size: "1.5 MB", type: "pdf", url: "#" },
      { name: "รูปถ่ายโรงงาน.jpg", size: "2.3 MB", type: "image", url: "#" },
      { name: "แบบฟอร์มคำขอ.docx", size: "410 KB", type: "doc", url: "#" },
    ],
  },
]);

// helper: ระบบที่ต้องตรวจสอบของ item ตาม role
function visibleSystems(item: AccessRequest) {
  return restrictedSystem.value
    ? item.systems.filter((s) => s === restrictedSystem.value)
    : item.systems;
}

// กรองคำขอที่มองเห็นได้ตาม role
const visibleRequests = computed(() => {
  if (restrictedSystem.value) {
    return requests.value.filter((r) =>
      r.systems.includes(restrictedSystem.value!),
    );
  }
  return requests.value;
});

// Overall pending = any system still pending (เฉพาะระบบที่ตนรับผิดชอบ)
const pendingCount = computed(
  () =>
    visibleRequests.value.filter((r) =>
      visibleSystems(r).some((s) => r.systemApprovals[s] === "pending"),
    ).length,
);

const filteredRequests = computed(() => {
  const q = search.value.toLowerCase();
  return visibleRequests.value.filter((r) => {
    if (filterSystem.value && !r.systems.includes(filterSystem.value))
      return false;
    if (filterStatus.value) {
      const hasStatus = visibleSystems(r).some(
        (s) => r.systemApprovals[s] === filterStatus.value,
      );
      if (!hasStatus) return false;
    }
    if (q && !r.operatorName.toLowerCase().includes(q) && !r.taxId.includes(q))
      return false;
    return true;
  });
});

function attachmentIcon(type: Attachment["type"]) {
  return type === "pdf"
    ? "fas fa-file-pdf"
    : type === "image"
      ? "fas fa-file-image"
      : "fas fa-file-word";
}
function attachmentColor(type: Attachment["type"]) {
  return type === "pdf" ? "error" : type === "image" ? "success" : "info";
}

function statusColor(s: string) {
  return s === "pending" ? "warning" : s === "approved" ? "success" : "error";
}
function statusIcon(s: string) {
  return s === "pending"
    ? "fas fa-clock"
    : s === "approved"
      ? "fas fa-check"
      : "fas fa-xmark";
}
function statusLabel(s: string) {
  return s === "pending"
    ? "รอพิจารณา"
    : s === "approved"
      ? "อนุมัติ"
      : "ปฏิเสธ";
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

function hasPending(item: AccessRequest) {
  return visibleSystems(item).some(
    (s) => item.systemApprovals[s] === "pending",
  );
}

function approveAll(item: AccessRequest) {
  visibleSystems(item).forEach((s) => {
    item.systemApprovals[s] = "approved";
  });
}

function rejectAll(item: AccessRequest) {
  visibleSystems(item).forEach((s) => {
    item.systemApprovals[s] = "rejected";
  });
}
</script>

<style scoped>
.chip-fit {
  height: auto !important;
  min-height: 24px;
  padding: 2px 10px !important;
  font-size: 12px;
  white-space: nowrap;
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
.attachment-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface-variant), 0.3);
}
.attachment-icon {
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
