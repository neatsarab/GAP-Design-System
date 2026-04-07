<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">รายการคำขอพิจารณาผล Lab</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          คำขอพิจารณาผลตรวจทางห้องปฏิบัติการของสินค้าแปรรูปด้านพืช
        </p>
      </div>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="6">
            <div class="field-label">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="เลขคำขอ / ชื่อบริษัท / รหัสผลิตภัณฑ์"
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
              <div>วัตถุประสงค์การสุ่มเก็บตัวอย่าง</div>
              <div class="field-label-en">Objective</div>
            </div>
            <v-autocomplete
              v-model="filters.objective"
              :items="objectiveOptions"
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
              <div>สถานะ</div>
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
                  placeholder="เลือกวันที่"
                  hide-details
                  variant="outlined"
                  rounded="lg"
                  style="cursor: pointer"
                  @click:clear.stop="dateFromObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateFromObj"
                color="hcex-staff"
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
                  :model-value="dateToBE"
                  readonly
                  clearable
                  prepend-inner-icon="fas fa-calendar"
                  placeholder="เลือกวันที่"
                  hide-details
                  variant="outlined"
                  rounded="lg"
                  style="cursor: pointer"
                  @click:clear.stop="dateToObj = null"
                />
              </template>
              <v-date-picker
                v-model="dateToObj"
                color="hcex-staff"
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
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">เลขคำขอ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Request No.</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.companyName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">บริษัทผู้ผลิต</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Manufacturer</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.productName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">ผลิตภัณฑ์</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Product</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.objective="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">วัตถุประสงค์</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Objective</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.submittedDate="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">วันที่ยื่น</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Submit Date</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>
        <template #header.status="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div class="text-body-2 font-weight-medium" style="line-height: 1.3">สถานะ</div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1.2">Status</div>
            </span>
            <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="14" />
          </span>
        </template>

        <template #item.objective="{ item }">
          <v-chip size="x-small" :color="objectiveColor(item.objective)" variant="tonal">
            {{ objectiveLabel(item.objective) }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              v-if="item.status === 'pending' || item.status === 'reviewing'"
              size="small"
              color="hcex-staff"
              variant="tonal"
              rounded="lg"
              prepend-icon="fas fa-flask"
              @click.stop="
                router.push({
                  name: 'HCEXstaffLabApplicationDetail',
                  params: { id: item.requestNo },
                })
              "
            >
              พิจารณาผล
            </v-btn>
            <v-btn
              v-else
              icon
              size="small"
              color="hcex-staff"
              variant="text"
              @click.stop="
                router.push({
                  name: 'HCEXstaffLabApplicationDetail',
                  params: { id: item.requestNo },
                })
              "
            >
              <v-icon icon="fas fa-eye" size="15" />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const router = useRouter();
const search = ref("");

const dateFromMenu = ref(false);
const dateFromObj = ref(null);
const dateToMenu = ref(false);
const dateToObj = ref(null);

function toThaiDate(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear() + 543}`;
}

const dateFromBE = computed(() => toThaiDate(dateFromObj.value));
const dateToBE = computed(() => toThaiDate(dateToObj.value));

watch(dateFromObj, (v) => { filters.dateFrom = v ? v.toISOString().slice(0, 10) : ""; });
watch(dateToObj, (v) => { filters.dateTo = v ? v.toISOString().slice(0, 10) : ""; });

function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  submittedDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const filters = reactive({
  dateFrom: "",
  dateTo: "",
  objective: null,
  status: null,
});

const objectiveOptions = [
  { label: "ขอใบรับรองสุขอนามัย (Issuance of HC)", value: "hc" },
  { label: "แนบทะเบียนประวัติ (Lot by Lot)", value: "lot" },
  { label: "ทั้งระบบการผลิต (Whole Product System)", value: "whole" },
];

const statusOptions = [
  { label: "รอตรวจสอบ", value: "pending" },
  { label: "อยู่ระหว่างตรวจสอบ", value: "reviewing" },
  { label: "รอแก้ไข", value: "need_edit" },
  { label: "ผ่านการพิจารณา", value: "approved" },
  { label: "ไม่ผ่านการพิจารณา", value: "rejected" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "บริษัทผู้ผลิต", key: "companyName", sortable: true },
  { title: "ผลิตภัณฑ์", key: "productName", sortable: true },
  { title: "วัตถุประสงค์", key: "objective", sortable: true },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const allItems = [
  {
    requestNo: "LAB-0001",
    companyName: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
    productName: "มะม่วงอบแห้ง (Dried Mango)",
    objective: "hc",
    submittedDate: "03/01/2569",
    status: "reviewing",
  },
  {
    requestNo: "LAB-0002",
    companyName: "บริษัท กรีนโปร เอ็กซ์พอร์ต จำกัด",
    productName: "ลำไยอบแห้ง (Dried Longan)",
    objective: "lot",
    submittedDate: "10/01/2569",
    status: "pending",
  },
  {
    requestNo: "LAB-0003",
    companyName: "บริษัท เอเชีย แปรรูปพืช จำกัด",
    productName: "พริกแห้ง (Dried Chili)",
    objective: "whole",
    submittedDate: "18/02/2569",
    status: "approved",
  },
  {
    requestNo: "LAB-0004",
    companyName: "ห้างหุ้นส่วนจำกัด ไทยออร์แกนิค",
    productName: "ข้าวโพดหวานแช่แข็ง (Frozen Sweet Corn)",
    objective: "hc",
    submittedDate: "25/02/2569",
    status: "need_edit",
  },
  {
    requestNo: "LAB-0005",
    companyName: "บริษัท เฟรช เพลนท์ จำกัด",
    productName: "ถั่วงอก (Bean Sprout)",
    objective: "hc",
    submittedDate: "05/03/2569",
    status: "pending",
  },
  {
    requestNo: "LAB-0006",
    companyName: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
    productName: "กระเทียมดอง (Pickled Garlic)",
    objective: "lot",
    submittedDate: "12/03/2569",
    status: "reviewing",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.requestNo.toLowerCase().includes(q) ||
        i.companyName.toLowerCase().includes(q) ||
        i.productName.toLowerCase().includes(q)
    );
  }
  if (filters.objective)
    items = items.filter((i) => i.objective === filters.objective);
  if (filters.status)
    items = items.filter((i) => i.status === filters.status);
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
  filters.objective = null;
  filters.status = null;
  dateFromObj.value = null;
  dateToObj.value = null;
}

function objectiveColor(o) {
  return { hc: "primary", lot: "info", whole: "success" }[o] ?? "grey";
}

function objectiveLabel(o) {
  return (
    {
      hc: "Issuance of HC",
      lot: "Lot by Lot",
      whole: "Whole Product System",
    }[o] ?? o
  );
}

function statusColor(s) {
  return (
    {
      pending: "info",
      reviewing: "info",
      need_edit: "warning",
      approved: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}

function statusLabel(s) {
  return (
    {
      pending: "รอตรวจสอบ",
      reviewing: "อยู่ระหว่างตรวจสอบ",
      need_edit: "รอแก้ไข",
      approved: "ผ่านการพิจารณา",
      rejected: "ไม่ผ่านการพิจารณา",
    }[s] ?? s
  );
}
</script>
