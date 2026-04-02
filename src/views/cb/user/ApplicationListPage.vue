<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          การขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช
        </p>
      </div>
      <v-btn
        color="cb-user"
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
              <div>เลขคำขอ</div>
              <div class="field-label-en">Request No.</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขคำขอ"
              prepend-inner-icon="fas fa-search"
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
                color="cb-user"
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
                color="cb-user"
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
        <template #header.requestNo="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                เลขคำขอ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Request No.
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.type="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                ประเภทคำขอ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Request Type
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.submittedDate="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                วันที่ยื่น
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Submit Date
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.status="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                สถานะคำขอ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Status
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>

        <template #item.type="{ item }">
          <v-chip size="x-small" :color="typeColor(item.type)" variant="tonal">
            {{ typeLabel(item.type) }}
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
          <div class="d-flex align-center ga-1">
            <v-tooltip v-if="item.note" text="ดูหมายเหตุ" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="orange"
                  @click.stop="openNote(item)"
                >
                  <v-icon icon="fas fa-comment-dots" size="14" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-btn
              v-if="item.status === 'need_edit'"
              size="x-small"
              variant="tonal"
              color="warning"
              prepend-icon="fas fa-pencil"
              @click.stop="
                router.push({
                  name: 'CBUserEditApplication',
                  params: { id: item.requestNo },
                })
              "
            >
              แก้ไขคำขอ
            </v-btn>
            <v-tooltip text="ดูรายละเอียด" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  variant="text"
                  color="cb-user"
                  @click.stop="
                    router.push({
                      name: 'CBUserApplicationDetail',
                      params: { id: item.requestNo },
                    })
                  "
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
                  color="warning"
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

    <!-- Note Dialog -->
    <v-dialog v-model="noteDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
          <v-icon icon="fas fa-comment-dots" color="orange" size="18" />
          <span class="text-subtitle-1 font-weight-bold">หมายเหตุ</span>
          <v-chip
            v-if="noteItem"
            size="x-small"
            variant="tonal"
            color="cb-user"
            class="ml-1"
          >{{ noteItem.requestNo }}</v-chip>
          <v-spacer />
          <v-btn icon size="x-small" variant="text" @click="noteDialog = false">
            <v-icon icon="fas fa-xmark" size="14" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <p class="text-body-2 mb-0" style="white-space: pre-line">{{ noteItem?.note }}</p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 pt-0">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="noteDialog = false">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, shallowRef } from "vue";
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

function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  submittedDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const router = useRouter();
const search = ref("");

const noteDialog = ref(false);
const noteItem = shallowRef(null);

function openNote(item) {
  noteItem.value = item;
  noteDialog.value = true;
}

function goToNewApplication() {
  router.push({ name: "CBUserApplicationType" });
}

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  type: null,
  status: null,
});

const typeOptions = [
  { label: "ขึ้นทะเบียน", value: "register" },
  { label: "ต่ออายุ", value: "renew" },
  { label: "เพิ่ม / ลดขอบข่าย", value: "scope" },
  { label: "แก้ไขใบทะเบียน", value: "amend" },
  { label: "ยกเลิกใบทะเบียน", value: "cancel" },
];

const statusOptions = [
  { label: "แบบร่าง", value: "draft" },
  { label: "รอตรวจสอบ", value: "pending" },
  { label: "รอแก้ไขคำขอ", value: "need_edit" },
  { label: "รอพิจารณา", value: "reviewing" },
  { label: "รอลงนาม", value: "signing" },
  { label: "ได้รับอนุญาต", value: "approved" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true, minWidth: "130" },
  { title: "ประเภทคำขอ", key: "type", sortable: true, minWidth: "140" },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true, minWidth: "120" },
  { title: "สถานะคำขอ", key: "status", sortable: true, minWidth: "140" },
  { title: "", key: "actions", sortable: false, align: "end", width: "80" },
];

const allItems = [
  {
    requestNo: "CB-0001",
    type: "register",
    submittedDate: "18/02/2569",
    status: "pending",
  },
  {
    requestNo: "CB-0002",
    type: "renew",
    submittedDate: "05/03/2569",
    status: "approved",
  },
  {
    requestNo: "CB-0003",
    type: "scope",
    submittedDate: "10/03/2569",
    status: "draft",
  },
  {
    requestNo: "CB-0004",
    type: "register",
    submittedDate: "12/03/2569",
    status: "reviewing",
  },
  {
    requestNo: "CB-0005",
    type: "amend",
    submittedDate: "15/03/2569",
    status: "need_edit",
    note: "กรุณาแนบหลักฐานประกอบการแก้ไขให้ครบถ้วน และตรวจสอบข้อมูลผู้ยื่นคำขอให้ถูกต้อง",
  },
  {
    requestNo: "CB-0006",
    type: "renew",
    submittedDate: "20/03/2569",
    status: "signing",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter((i) => i.requestNo.toLowerCase().includes(q));
  }
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
  search.value = "";
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.type = null;
  filters.status = null;
  dateFromObj.value = null;
  dateToObj.value = null;
}

function typeColor(t) {
  return (
    {
      register: "primary",
      renew: "primary",
      scope: "info",
      amend: "warning",
      cancel: "error",
    }[t] ?? "primary"
  );
}

function typeLabel(t) {
  return (
    {
      register: "ขึ้นทะเบียน",
      renew: "ต่ออายุ",
      scope: "เพิ่ม / ลดขอบข่าย",
      amend: "แก้ไขใบทะเบียน",
      cancel: "ยกเลิกใบทะเบียน",
    }[t] ?? t
  );
}

function statusColor(s) {
  return (
    {
      draft: "grey",
      pending: "info",
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
      need_edit: "รอแก้ไขคำขอ",
      reviewing: "รอพิจารณา",
      signing: "รอลงนาม",
      approved: "ได้รับอนุญาต",
    }[s] ?? s
  );
}
</script>

<style scoped>
:deep(.v-data-table__table) {
  width: 100%;
}
</style>
