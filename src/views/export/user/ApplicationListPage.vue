<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">รายการคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          การจดทะเบียนผู้ส่งออกสินค้าพืช
        </p>
      </div>
      <v-btn
        color="export-user"
        prepend-icon="fas fa-plus"
        @click="goToNewApplication"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="6">
            <div class="field-label">
              <div>หมายเลขคำขอ</div>
              <div class="field-label-en">Request No.</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาหมายเลขคำขอ"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <div class="field-label">
              <div>ประเภททะเบียน</div>
              <div class="field-label-en">Certificate Type</div>
            </div>
            <v-autocomplete
              v-model="filters.typecert"
              :items="typecertOptions"
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
            <div class="field-label">
              <div>ประเภทคำขอ</div>
              <div class="field-label-en">Request Type</div>
            </div>
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
            <div class="field-label">
              <div>สถานะคำขอ</div>
              <div class="field-label-en">Status</div>
            </div>
            <v-autocomplete
              v-model="filters.status"
              :items="statusOptions"
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
            <div class="field-label">
              <div>วันที่ยื่น (จาก)</div>
              <div class="field-label-en">Submit Date (From)</div>
            </div>
            <v-menu
              v-model="dateFromMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="dateFromBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่ / เดือน / ปี"
                  hide-details
                  style="cursor: pointer"
                  @click:clear.stop="dateFromObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateFromObj"
                color="export-user"
                show-adjacent-months
                :hide-header="!dateFromObj"
                title="วันที่ยื่น (จาก)"
                locale="th"
                @update:model-value="dateFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="field-label">
              <div>วันที่ยื่น (ถึง)</div>
              <div class="field-label-en">Submit Date (To)</div>
            </div>
            <v-menu
              v-model="dateToMenu"
              :close-on-content-click="false"
              location="bottom start"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  :model-value="dateToBE2"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่ / เดือน / ปี"
                  hide-details
                  style="cursor: pointer"
                  @click:clear.stop="dateToObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateToObj"
                color="export-user"
                show-adjacent-months
                :hide-header="!dateToObj"
                title="วันที่ยื่น (ถึง)"
                locale="th"
                @update:model-value="dateToMenu = false"
              />
            </v-menu>
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
        :headers="headers"
        :items="filteredItems"
        :custom-key-sort="customKeySort"
        rounded="xl"
        hover
      >
        <template
          v-for="h in headers.filter((c) => c.titleEn)"
          #["header."+h.key]="{ column, isSorted, getSortIcon }"
          :key="h.key"
        >
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                {{ h.title }}
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                {{ h.titleEn }}
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>

        <template #item.type="{ item }">{{ typeLabel(item.type) }}</template>
        <template #item.submitterStatus="{ item }">
          <v-chip
            :color="
              item.submitterStatus === 'ตัวแทน' ? 'secondary' : 'export-user'
            "
            size="x-small"
            variant="tonal"
          >
            {{ item.submitterStatus }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            size="small"
            variant="tonal"
            >{{ statusLabel(item.status) }}</v-chip
          >
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="export-user"
                  @click.stop
                >
                  <v-icon icon="fas fa-eye" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip
              v-if="item.status === 'draft'"
              text="แก้ไข"
              location="top"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="info"
                  @click.stop
                >
                  <v-icon icon="fas fa-pencil" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip
              v-if="item.status !== 'approved'"
              text="ยกเลิก"
              location="top"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="error"
                  @click.stop
                >
                  <v-icon icon="fas fa-xmark" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
// @ts-nocheck
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const dateFromMenu = ref(false);
const dateFromObj = ref(null);
const dateToMenu = ref(false);
const dateToObj = ref(null);

function dateToBE(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const dateFromBE = computed(() => dateToBE(dateFromObj.value));
const dateToBE2 = computed(() => dateToBE(dateToObj.value));

watch(dateFromObj, (v) => {
  filters.dateFrom = v ? v.toISOString().slice(0, 10) : "";
});
watch(dateToObj, (v) => {
  filters.dateTo = v ? v.toISOString().slice(0, 10) : "";
});

// แปลง DD/MM/YYYY (พ.ศ.) → timestamp เพื่อ sort
function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  submittedDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const router = useRouter();

function goToNewApplication() {
  router.push({ name: "ExportUserApplicationType" });
}

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  typecert: null,
  type: null,
  status: null,
});

const typeOptions = [
  { label: "ขึ้นทะเบียน", value: "ขึ้นทะเบียน" },
  { label: "ต่ออายุ", value: "ต่ออายุ" },
  { label: "แก้ไข", value: "แก้ไข" },
];

const typecertOptions = [
  {
    label: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
    value: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
  },
  {
    label:
      "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    value:
      "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
  },
  {
    label:
      "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งผลทุเรียนสดออกไปนอกราชอาณาจักร",
    value:
      "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งผลทุเรียนสดออกไปนอกราชอาณาจักร",
  },
  {
    label: "คำขอจดทะเบียนเป็นผู้ส่งออกสินค้าเกษตรไปนอกราชอาณาจักร",
    value: "คำขอจดทะเบียนเป็นผู้ส่งออกสินค้าเกษตรไปนอกราชอาณาจักร",
  },
  {
    label:
      "คำขอหนังสือสำคัญการจดทะเบียนเป็นผู้ส่งออกลูกเดือย, เมล็ดแมงลัก และพริกแห้ง ไปนอกราชอาณาจักร",
    value:
      "คำขอหนังสือสำคัญการจดทะเบียนเป็นผู้ส่งออกลูกเดือย, เมล็ดแมงลัก และพริกแห้ง ไปนอกราชอาณาจักร",
  },
  {
    label: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
    value: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
  },
];

const statusOptions = [
  { label: "รอตรวจสอบ", value: "pending" },
  { label: "รอแก้ไขคำขอ", value: "draft" },
  { label: "รอพิจารณา", value: "reviewing" },
  { label: "รอลงนาม", value: "signing" },
  { label: "ได้รับอนุญาต", value: "approved" },
];

const headers = [
  {
    title: "หมายเลขคำขอ",
    titleEn: "Request No.",
    key: "requestNo",
    sortable: true,
  },
  {
    title: "ประเภททะเบียน",
    titleEn: "Certificate Type",
    key: "typecert",
    sortable: true,
  },
  { title: "ประเภทคำขอ", titleEn: "Request Type", key: "type", sortable: true },
  {
    title: "วันที่ยื่น",
    titleEn: "Submit Date",
    key: "submittedDate",
    sortable: true,
  },
  { title: "สถานะคำขอ", titleEn: "Status", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  {
    id: "EXP-2569-001",
    requestNo: "EXP-0001",
    typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
    type: "ขึ้นทะเบียน",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "01/01/2569",
    status: "pending",
  },
  {
    id: "EXP-2569-002",
    requestNo: "EXP-0002",
    typecert:
      "คำร้องขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    type: "ขึ้นทะเบียน",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "ตัวแทน",
    principal: "นายสมชาย ใจดี",
    submittedDate: "05/02/2569",
    status: "draft",
  },
  {
    id: "EXP-2569-003",
    requestNo: "EXP-0003",
    typecert:
      "คำร้องขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    type: "ขึ้นทะเบียน",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "10/03/2569",
    status: "reviewing",
  },
  {
    id: "EXP-2569-004",
    requestNo: "EXP-0004",
    typecert: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
    type: "ต่ออายุ",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "12/03/2569",
    status: "signing",
  },
  {
    id: "EXP-2569-005",
    requestNo: "EXP-0005",
    typecert:
      "คำร้องขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    type: "ขึ้นทะเบียน",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "เจ้าของ",
    principal: "-",
    submittedDate: "15/03/2569",
    status: "approved",
  },
  {
    id: "EXP-2569-006",
    requestNo: "EXP-0006",
    typecert: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
    type: "ขึ้นทะเบียน",
    applicant: "บ.ไทย เอ็กซ์พอร์ต จก.",
    submitterStatus: "ตัวแทน",
    principal: "นายวิชัย สมบูรณ์",
    submittedDate: "20/03/2569",
    status: "pending",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (filters.typecert)
    items = items.filter((i) => i.typecert === filters.typecert);
  if (filters.type) items = items.filter((i) => i.type === filters.type);
  if (filters.status) items = items.filter((i) => i.status === filters.status);
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    items = items.filter((i) => beDateToTs(i.submittedDate) >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    items = items.filter((i) => beDateToTs(i.submittedDate) <= to);
  }
  return items;
});

function clearFilters() {
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.typecert = null;
  filters.type = null;
  filters.status = null;
  dateFromObj.value = null;
  dateToObj.value = null;
}

function typeLabel(t) {
  return (
    {
      newrequest: "คำขอขึ้นทะเบียน",
      renew: "คำขอต่ออายุทะเบียน",
      amendment: "คำขอแก้ไขใบรับรอง",
    }[t] ?? t
  );
}

function statusColor(s) {
  return (
    {
      draft: "grey",
      pending: "info",
      reject_request: "error",
      need_edit: "warning",
      reviewing: "info",
      signing: "info",
      approved: "success",
    }[s] ?? "grey"
  );
}

function statusLabel(s) {
  return (
    {
      draft: "แบบร่าง",
      pending: "รอตรวจสอบ",
      reject_request: "ปฏิเสธคำขอ",
      need_edit: "รอแก้ไขคำขอ",
      reviewing: "รอพิจารณา",
      signing: "รอลงนาม",
      approved: "ได้รับอนุญาต",
    }[s] ?? s
  );
}
</script>
