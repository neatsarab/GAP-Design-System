<template>
  <div class="poa-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- Top bar -->
    <div class="poa-topbar">
      <div class="poa-topbar-inner">
        <div class="d-flex align-center ga-3">
          <div class="topbar-logo">
            <v-icon icon="fas fa-leaf" size="18" color="white" />
          </div>
          <div>
            <div
              class="text-body-2 font-weight-bold text-white"
              style="line-height: 1.2"
            >
              กรมวิชาการเกษตร
            </div>
            <div
              class="text-caption"
              style="color: rgba(255, 255, 255, 0.6); line-height: 1.2"
            >
              Department of Agriculture
            </div>
          </div>
        </div>
        <v-spacer />
        <div class="d-flex align-center ga-2">
          <v-btn
            variant="text"
            size="small"
            style="color: rgba(255, 255, 255, 0.8)"
            :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
            @click="themeStore.toggle()"
          >
            {{ themeStore.isDark ? "โหมดสว่าง" : "โหมดมืด" }}
          </v-btn>
          <div class="user-pill d-flex align-center ga-2">
            <div class="user-avatar-sm">
              <span class="text-caption font-weight-bold">นส</span>
            </div>
            <div class="d-none d-sm-block">
              <div
                class="text-caption font-weight-semibold text-white"
                style="line-height: 1.2"
              >
                นิธิพร เทิบจันทึก
              </div>
              <div
                class="text-caption"
                style="
                  color: rgba(255, 255, 255, 0.55);
                  line-height: 1.2;
                  font-size: 10px;
                "
              >
                ผู้ประกอบการ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="poa-body">
      <div class="poa-body-inner">
        <!-- Back + heading -->
        <div class="d-flex align-center ga-3 mb-6">
          <v-btn
            icon="fas fa-arrow-left"
            variant="tonal"
            size="small"
            rounded="lg"
            @click="router.push('/select-company')"
          />
          <div>
            <h1 class="text-h5 font-weight-bold mb-0">จัดการมอบอำนาจ</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              มอบสิทธิ์ให้บุคคลอื่นเข้าใช้งานระบบในนามบริษัท
            </p>
          </div>
        </div>

        <!-- Company info -->
        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
          <v-card-text class="pa-4">
            <div class="d-flex align-center ga-3">
              <div
                class="company-icon-box flex-shrink-0"
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 10px;
                  background: rgba(var(--v-theme-info), 0.12);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <v-icon icon="fas fa-building" size="18" color="info" />
              </div>
              <div>
                <div class="text-body-1 font-weight-bold">
                  {{ currentCompany.nameTh }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ currentCompany.nameEn }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Tabs -->
        <v-tabs v-model="activeTab" color="primary" class="mb-5">
          <v-tab value="grant">
            <v-icon start icon="fas fa-user-check" size="14" />
            มอบอำนาจ
            <v-chip
              size="x-small"
              color="primary"
              variant="tonal"
              class="ml-2"
              >{{ filteredDelegates.length }}</v-chip
            >
          </v-tab>
          <v-tab value="requests">
            <v-icon start icon="fas fa-inbox" size="14" />
            คำขอรับมอบอำนาจ
            <v-chip
              v-if="
                filteredRequests.filter((r) => r.status === 'pending').length
              "
              size="x-small"
              color="warning"
              variant="tonal"
              class="ml-2"
            >
              {{
                filteredRequests.filter((r) => r.status === "pending").length
              }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <!-- ── Tab 1: มอบอำนาจ ── -->
        <template v-if="activeTab === 'grant'">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <span class="text-body-1 font-weight-bold">ผู้รับมอบอำนาจ</span>
              <v-chip
                size="x-small"
                color="primary"
                variant="tonal"
                class="ml-2"
                >{{ filteredDelegates.length }} คน</v-chip
              >
            </div>
            <v-btn
              color="primary"
              rounded="lg"
              prepend-icon="fas fa-plus"
              @click="openAdd"
              >เพิ่มผู้รับมอบอำนาจ</v-btn
            >
          </div>

          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              v-if="filteredDelegates.length === 0"
              class="pa-12 text-center"
            >
              <v-icon
                icon="fas fa-user-plus"
                size="48"
                color="medium-emphasis"
                style="opacity: 0.3"
              />
              <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
                ยังไม่มีผู้รับมอบอำนาจสำหรับบริษัทนี้
              </p>
            </div>

            <template v-else>
              <div
                v-for="(d, idx) in filteredDelegates"
                :key="d.id"
                class="delegate-row"
                :class="{
                  'delegate-row--last': idx === filteredDelegates.length - 1,
                }"
              >
                <div class="delegate-avatar flex-shrink-0">
                  <span class="text-caption font-weight-bold">{{
                    initials(d.name)
                  }}</span>
                </div>

                <div class="flex-grow-1 overflow-hidden">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-body-2 font-weight-bold">{{
                      d.name
                    }}</span>
                    <v-chip
                      size="x-small"
                      :color="d.status === 'active' ? 'success' : 'default'"
                      variant="tonal"
                    >
                      {{ d.status === "active" ? "ใช้งาน" : "ระงับ" }}
                    </v-chip>
                    <v-chip
                      v-if="isExpiringSoon(d.expiry)"
                      size="x-small"
                      color="warning"
                      variant="tonal"
                      prepend-icon="fas fa-clock"
                      >ใกล้หมดอายุ</v-chip
                    >
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ d.idCard }} · {{ d.email }}
                  </div>
                  <div class="d-flex flex-wrap ga-1 mt-1">
                    <v-chip
                      v-for="sys in d.systems"
                      :key="sys"
                      size="x-small"
                      variant="tonal"
                      color="primary"
                      >{{ sys }}</v-chip
                    >
                  </div>
                </div>

                <div
                  class="d-none d-sm-block text-right flex-shrink-0"
                  style="min-width: 110px"
                >
                  <div class="text-caption text-medium-emphasis">หมดอายุ</div>
                  <div
                    class="text-body-2 font-weight-medium"
                    :class="isExpiringSoon(d.expiry) ? 'text-warning' : ''"
                  >
                    {{ d.expiry }}
                  </div>
                </div>

                <div class="d-flex ga-1 flex-shrink-0">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    rounded="lg"
                    icon="fas fa-pen"
                    @click="openEdit(d)"
                  />
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="error"
                    rounded="lg"
                    icon="fas fa-trash"
                    @click="openDelete(d)"
                  />
                </div>
              </div>
            </template>
          </v-card>
        </template>

        <!-- ── Tab 2: คำขอรับมอบอำนาจ ── -->
        <template v-else-if="activeTab === 'requests'">
          <!-- Filters -->
          <v-card class="mb-4">
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="" sm="6">
                  <v-text-field
                    v-model="requestSearch"
                    placeholder="ค้นหาชื่อ / เลขบัตร / อีเมล"
                    prepend-inner-icon="fas fa-magnifying-glass"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    clearable
                    style="max-width: 280px; min-width: 180px"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Status Chips -->
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="f in statusFilters"
              :key="f.value"
              :color="f.color"
              :variant="requestStatusFilter === f.value ? 'tonal' : 'outlined'"
              size="small"
              class="filter-chip"
              @click="requestStatusFilter = f.value"
            >
              <v-icon v-if="f.icon" :icon="f.icon" start size="11" />
              {{ f.label }}
              <span class="ml-1 text-caption">({{ countByStatus(f.value) }})</span>
            </v-chip>
          </div>

          <!-- Table -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <v-data-table
              :headers="requestHeaders"
              :items="tableRequests"
              :search="requestSearch"
              density="comfortable"
              hover
              class="request-table"
            >
              <!-- ผู้ขอ -->
              <template #item.name="{ item }">
                <div class="d-flex align-center ga-3 py-1">
                  <div
                    class="delegate-avatar flex-shrink-0"
                    :class="
                      item.status !== 'pending' ? 'delegate-avatar--muted' : ''
                    "
                  >
                    <span style="font-size: 11px; font-weight: 700">{{
                      initials(item.name)
                    }}</span>
                  </div>
                  <div>
                    <div class="text-body-2 font-weight-bold">
                      {{ item.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ item.idCard }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ item.email }}
                    </div>
                  </div>
                </div>
              </template>

              <!-- ระบบที่ขอ -->
              <template #item.requestedSystems="{ item }">
                <div class="d-flex flex-wrap ga-1 py-1">
                  <v-chip
                    v-for="sys in item.requestedSystems"
                    :key="sys"
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    >{{ sys }}</v-chip
                  >
                </div>
              </template>

              <!-- สถานะ -->
              <template #item.status="{ item }">
                <v-chip
                  size="small"
                  :color="
                    item.status === 'pending'
                      ? 'warning'
                      : item.status === 'approved'
                        ? 'success'
                        : 'error'
                  "
                  variant="tonal"
                >
                  <v-icon
                    start
                    :icon="
                      item.status === 'pending'
                        ? 'fas fa-clock'
                        : item.status === 'approved'
                          ? 'fas fa-circle-check'
                          : 'fas fa-circle-xmark'
                    "
                    size="11"
                  />
                  {{
                    item.status === "pending"
                      ? "รอดำเนินการ"
                      : item.status === "approved"
                        ? "อนุมัติแล้ว"
                        : "ปฏิเสธแล้ว"
                  }}
                </v-chip>
              </template>

              <!-- การดำเนินการ -->
              <template #item.actions="{ item }">
                <div class="d-flex ga-1" v-if="item.status === 'pending'">
                  <v-btn
                    size="x-small"
                    color="success"
                    rounded="lg"
                    variant="tonal"
                    prepend-icon="fas fa-check"
                    @click="openApprove(item)"
                    >อนุมัติ</v-btn
                  >
                  <v-btn
                    size="x-small"
                    color="error"
                    rounded="lg"
                    variant="tonal"
                    prepend-icon="fas fa-xmark"
                    @click="openReject(item)"
                    >ปฏิเสธ</v-btn
                  >
                </div>
                <span v-else class="text-caption text-medium-emphasis">—</span>
              </template>

              <!-- empty -->
              <template #no-data>
                <div class="pa-10 text-center">
                  <v-icon
                    icon="fas fa-inbox"
                    size="40"
                    color="medium-emphasis"
                    style="opacity: 0.3"
                  />
                  <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
                    ไม่พบคำขอรับมอบอำนาจ
                  </p>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </template>
      </div>
    </div>

    <!-- ── Add / Edit Dialog ── -->
    <v-dialog v-model="formDialog" max-width="580" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon
            :icon="editingItem ? 'fas fa-pen' : 'fas fa-user-plus'"
            color="primary"
            size="18"
          />
          {{ editingItem ? "แก้ไขผู้รับมอบอำนาจ" : "เพิ่มผู้รับมอบอำนาจ" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12" sm="7">
              <div class="field-label">
                ชื่อ-นามสกุล <span class="field-label-en">Full Name</span> <span class="req">*</span>
              </div>
              <v-text-field
                v-model="form.name"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อเต็ม"
              />
            </v-col>
            <v-col cols="12" sm="5">
              <div class="field-label">
                เลขบัตรประชาชน <span class="field-label-en">National ID No.</span> <span class="req">*</span>
              </div>
              <v-text-field
                v-model="form.idCard"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="1 xxxx xxxxx xx x"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                อีเมล <span class="field-label-en">Email</span> <span class="req">*</span>
              </div>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="example@email.com"
                prepend-inner-icon="fas fa-envelope"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                วันที่สิ้นสุดการมอบอำนาจ <span class="field-label-en">Authorization End Date</span> <span class="req">*</span>
              </div>
              <v-text-field
                v-model="form.expiry"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">สถานะ <span class="field-label-en">Status</span></div>
              <v-autocomplete
                v-model="form.status"
                :items="[
                  { title: 'ใช้งาน', value: 'active' },
                  { title: 'ระงับ', value: 'inactive' },
                ]"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                ระบบที่อนุญาตให้เข้าใช้งาน <span class="field-label-en">Authorized Systems</span> <span class="req">*</span>
              </div>
              <div class="system-checkbox-grid mt-1">
                <v-checkbox
                  v-for="sys in availableSystems"
                  :key="sys.value"
                  v-model="form.systems"
                  :value="sys.value"
                  :label="sys.label"
                  color="primary"
                  density="compact"
                  hide-details
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="formDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="primary"
            rounded="lg"
            :prepend-icon="
              editingItem ? 'fas fa-floppy-disk' : 'fas fa-user-plus'
            "
            @click="saveForm"
          >
            {{ editingItem ? "บันทึกการแก้ไข" : "เพิ่มผู้รับมอบอำนาจ" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Delete Confirm ── -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring confirm-ring--error mx-auto mb-4">
            <v-icon icon="fas fa-user-minus" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยกเลิกมอบอำนาจ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการยกเลิกการมอบอำนาจของ
            <strong>{{ deletingItem?.name }}</strong> ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="deleteDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="error" rounded="lg" block @click="confirmDelete"
            >ยืนยัน</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Approve Confirm ── -->
    <v-dialog v-model="approveDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring confirm-ring--success mx-auto mb-4">
            <v-icon icon="fas fa-user-check" color="success" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">อนุมัติการมอบอำนาจ</h3>
          <p class="text-body-2 text-medium-emphasis mb-3">
            ต้องการอนุมัติให้
            <strong>{{ actionRequest?.name }}</strong>
            รับมอบอำนาจจากบริษัทนี้ใช่หรือไม่?
          </p>
          <div
            v-if="actionRequest"
            class="d-flex flex-wrap ga-1 justify-center"
          >
            <v-chip
              v-for="sys in actionRequest.requestedSystems"
              :key="sys"
              size="x-small"
              variant="tonal"
              color="primary"
              >{{ sys }}</v-chip
            >
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="approveDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="success"
            rounded="lg"
            block
            prepend-icon="fas fa-check"
            @click="confirmApprove"
            >อนุมัติ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Reject Confirm ── -->
    <v-dialog v-model="rejectDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring confirm-ring--error mx-auto mb-4">
            <v-icon icon="fas fa-user-xmark" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ปฏิเสธคำขอมอบอำนาจ</h3>
          <p class="text-body-2 text-medium-emphasis mb-3">
            ต้องการปฏิเสธคำขอรับมอบอำนาจของ
            <strong>{{ actionRequest?.name }}</strong> ใช่หรือไม่?
          </p>
          <div class="field-label text-left mb-1">เหตุผล (ถ้ามี) <span class="field-label-en">Reason (if any)</span></div>
          <v-textarea
            v-model="rejectReason"
            variant="outlined"
            density="compact"
            rounded="lg"
            rows="2"
            hide-details
            placeholder="ระบุเหตุผลในการปฏิเสธ..."
          />
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="rejectDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="error"
            rounded="lg"
            block
            prepend-icon="fas fa-xmark"
            @click="confirmReject"
            >ปฏิเสธคำขอ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();

interface Company {
  id: string;
  nameTh: string;
  nameEn: string;
}
interface Delegate {
  id: number;
  companyId: string;
  name: string;
  idCard: string;
  email: string;
  expiry: string;
  status: "active" | "inactive";
  systems: string[];
}
interface PoaRequest {
  id: number;
  companyId: string;
  name: string;
  idCard: string;
  email: string;
  requestedExpiry: string;
  requestedSystems: string[];
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
}

const companies: Company[] = [
  {
    id: "co1",
    nameTh: "บริษัท ไทยเกษตรอินเตอร์ จำกัด",
    nameEn: "Thai Kaset International Co., Ltd.",
  },
  {
    id: "co2",
    nameTh: "ห้างหุ้นส่วนจำกัด สยามฟาร์มโปรดักส์",
    nameEn: "Siam Farm Products Ltd. Part.",
  },
  {
    id: "co3",
    nameTh: "บริษัท กรีนเซอร์ติฟาย (ประเทศไทย) จำกัด",
    nameEn: "Green Certify (Thailand) Co., Ltd.",
  },
];

const availableSystems = [
  { label: "GAP", value: "GAP" },
  { label: "DOA โรงงานพืช", value: "DOA" },
  { label: "CB หน่วยรับรอง", value: "CB" },
  { label: "ORG เกษตรอินทรีย์", value: "ORG" },
  { label: "ผู้ส่งออก", value: "ส่งออก" },
  { label: "HC สุขอนามัยพืช", value: "HC" },
  { label: "HCEX สินค้าแปรรูป", value: "HCEX" },
  { label: "EL Establishment List", value: "EL" },
];

const activeTab = ref("grant");
const selectedCompany = computed(
  () => (route.query.companyId as string) || "co1",
);
const currentCompany = computed(
  () => companies.find((c) => c.id === selectedCompany.value) ?? companies[0],
);

// ── Delegates (Tab 1) ──
const delegates = ref<Delegate[]>([
  {
    id: 1,
    companyId: "co1",
    name: "นายสมชาย ใจดี",
    idCard: "1 1002 00123 45 6",
    email: "somchai@example.com",
    expiry: "2025-12-31",
    status: "active",
    systems: ["GAP", "DOA"],
  },
  {
    id: 2,
    companyId: "co1",
    name: "นางสาวสุดา พัฒนา",
    idCard: "1 3701 00456 78 9",
    email: "suda@example.com",
    expiry: "2025-04-01",
    status: "active",
    systems: ["DOA", "ส่งออก", "HCEX"],
  },
  {
    id: 3,
    companyId: "co2",
    name: "นายวิชิต เกษตรกรรม",
    idCard: "1 4501 00789 01 2",
    email: "wichit@example.com",
    expiry: "2025-12-31",
    status: "inactive",
    systems: ["GAP"],
  },
]);
let nextId = 4;

const filteredDelegates = computed(() =>
  delegates.value.filter((d) => d.companyId === selectedCompany.value),
);

// ── POA Requests (Tab 2) ──
const poaRequests = ref<PoaRequest[]>([
  {
    id: 1,
    companyId: "co1",
    name: "นายประสิทธิ์ มีสุข",
    idCard: "1 2101 00321 11 3",
    email: "prasit@example.com",
    requestedExpiry: "2026-12-31",
    requestedSystems: ["GAP", "ส่งออก"],
    requestedAt: "15/03/2568",
    status: "pending",
  },
  {
    id: 2,
    companyId: "co1",
    name: "นางสาวอรทัย ลำดับดี",
    idCard: "1 5601 00654 22 8",
    email: "orathai@example.com",
    requestedExpiry: "2026-06-30",
    requestedSystems: ["DOA", "CB", "HCEX"],
    requestedAt: "10/03/2568",
    status: "pending",
  },
  {
    id: 3,
    companyId: "co1",
    name: "นายกิตติพงษ์ สุขสวัสดิ์",
    idCard: "1 1001 00987 33 5",
    email: "kitti@example.com",
    requestedExpiry: "2025-12-31",
    requestedSystems: ["GAP"],
    requestedAt: "01/03/2568",
    status: "approved",
  },
  {
    id: 4,
    companyId: "co2",
    name: "นางวิมล ทองดี",
    idCard: "1 6701 00111 44 7",
    email: "wimon@example.com",
    requestedExpiry: "2026-03-31",
    requestedSystems: ["GAP", "DOA"],
    requestedAt: "08/03/2568",
    status: "pending",
  },
  {
    id: 5,
    companyId: "co1",
    name: "นายธนพล รักษาดี",
    idCard: "1 3301 00555 66 1",
    email: "thanaphon@example.com",
    requestedExpiry: "2026-09-30",
    requestedSystems: ["HC", "HCEX"],
    requestedAt: "12/03/2568",
    status: "rejected",
  },
]);

const filteredRequests = computed(() =>
  poaRequests.value.filter((r) => r.companyId === selectedCompany.value),
);

// table filter state
const requestSearch = ref("");
const requestStatusFilter = ref<"all" | "pending" | "approved" | "rejected">(
  "all",
);

const statusFilters = [
  { value: "all", label: "ทั้งหมด", color: "primary", icon: "" },
  {
    value: "pending",
    label: "รอดำเนินการ",
    color: "warning",
    icon: "fas fa-clock",
  },
  {
    value: "approved",
    label: "อนุมัติแล้ว",
    color: "success",
    icon: "fas fa-circle-check",
  },
  {
    value: "rejected",
    label: "ปฏิเสธแล้ว",
    color: "error",
    icon: "fas fa-circle-xmark",
  },
] as const;

const requestHeaders = [
  { title: "ผู้ขอรับมอบอำนาจ", key: "name", sortable: true, width: "260px" },
  { title: "ระบบที่ขอ", key: "requestedSystems", sortable: false },
  {
    title: "ขอถึงวันที่",
    key: "requestedExpiry",
    sortable: true,
    width: "130px",
  },
  {
    title: "วันที่ยื่นคำขอ",
    key: "requestedAt",
    sortable: true,
    width: "130px",
  },
  { title: "สถานะ", key: "status", sortable: true, width: "150px" },
  { title: "การดำเนินการ", key: "actions", sortable: false, width: "160px" },
];

const tableRequests = computed(() => {
  const base = filteredRequests.value;
  if (requestStatusFilter.value === "all") return base;
  return base.filter((r) => r.status === requestStatusFilter.value);
});

function countByStatus(status: string) {
  const base = filteredRequests.value;
  if (status === "all") return base.length;
  return base.filter((r) => r.status === status).length;
}

// ── Form (Tab 1) ──
const formDialog = ref(false);
const editingItem = ref<Delegate | null>(null);
const form = reactive({
  name: "",
  idCard: "",
  email: "",
  expiry: "",
  status: "active" as "active" | "inactive",
  systems: [] as string[],
});

function openAdd() {
  editingItem.value = null;
  form.name = "";
  form.idCard = "";
  form.email = "";
  form.expiry = "";
  form.status = "active";
  form.systems = [];
  formDialog.value = true;
}

function openEdit(item: Delegate) {
  editingItem.value = item;
  form.name = item.name;
  form.idCard = item.idCard;
  form.email = item.email;
  form.expiry = item.expiry;
  form.status = item.status;
  form.systems = [...item.systems];
  formDialog.value = true;
}

function saveForm() {
  if (editingItem.value) {
    const idx = delegates.value.findIndex(
      (d) => d.id === editingItem.value!.id,
    );
    if (idx !== -1) {
      delegates.value[idx] = {
        ...editingItem.value,
        name: form.name,
        idCard: form.idCard,
        email: form.email,
        expiry: form.expiry,
        status: form.status,
        systems: [...form.systems],
      };
    }
  } else {
    delegates.value.push({
      id: nextId++,
      companyId: selectedCompany.value,
      name: form.name,
      idCard: form.idCard,
      email: form.email,
      expiry: form.expiry,
      status: form.status,
      systems: [...form.systems],
    });
  }
  formDialog.value = false;
}

// ── Delete (Tab 1) ──
const deleteDialog = ref(false);
const deletingItem = ref<Delegate | null>(null);
function openDelete(item: Delegate) {
  deletingItem.value = item;
  deleteDialog.value = true;
}
function confirmDelete() {
  delegates.value = delegates.value.filter(
    (d) => d.id !== deletingItem.value?.id,
  );
  deleteDialog.value = false;
}

// ── Approve / Reject (Tab 2) ──
const approveDialog = ref(false);
const rejectDialog = ref(false);
const actionRequest = ref<PoaRequest | null>(null);
const rejectReason = ref("");

function openApprove(req: PoaRequest) {
  actionRequest.value = req;
  approveDialog.value = true;
}
function openReject(req: PoaRequest) {
  actionRequest.value = req;
  rejectReason.value = "";
  rejectDialog.value = true;
}

function confirmApprove() {
  const idx = poaRequests.value.findIndex(
    (r) => r.id === actionRequest.value?.id,
  );
  if (idx !== -1) poaRequests.value[idx].status = "approved";
  approveDialog.value = false;
}

function confirmReject() {
  const idx = poaRequests.value.findIndex(
    (r) => r.id === actionRequest.value?.id,
  );
  if (idx !== -1) {
    poaRequests.value[idx].status = "rejected";
    poaRequests.value[idx].rejectReason = rejectReason.value;
  }
  rejectDialog.value = false;
}

// ── Helpers ──
function initials(name: string) {
  const parts = name.replace(/^(นาย|นาง|นางสาว)\s*/, "").split(" ");
  return parts
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function isExpiringSoon(expiry: string) {
  const diff = new Date(expiry).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
}
</script>

<style scoped>
.poa-root {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.poa-topbar {
  background: rgb(var(--v-theme-primary));
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
}
.is-dark .poa-topbar {
  background: rgba(var(--v-theme-primary), 0.18);
}
.poa-topbar-inner {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.topbar-logo {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-pill {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 6px 12px 6px 6px;
}
.user-avatar-sm {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.poa-body {
  padding: 40px 20px;
}
.poa-body-inner {
  max-width: 860px;
  margin: 0 auto;
}

.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
}

.delegate-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: background 0.15s;
}
.delegate-row:hover {
  background: rgba(var(--v-theme-primary), 0.03);
}
.delegate-row--last {
  border-bottom: none;
}

.delegate-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  border: 1.5px solid rgba(var(--v-theme-primary), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  font-size: 12px;
  font-weight: 700;
}
.delegate-avatar--muted {
  background: rgba(var(--v-border-color), 0.08);
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  color: rgba(var(--v-theme-on-surface), 0.4);
}

.system-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 4px;
  padding: 10px 12px;
  background: rgba(var(--v-border-color), 0.04);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
}

.confirm-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-ring--error {
  background: rgba(var(--v-theme-error), 0.1);
}
.confirm-ring--success {
  background: rgba(var(--v-theme-success), 0.1);
}

.filter-chip {
  cursor: pointer;
  transition: all 0.15s;
}

.request-table :deep(thead th) {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
  background: rgba(var(--v-border-color), 0.04) !important;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 4px;
}
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
.req {
  color: rgb(var(--v-theme-error));
}
</style>
