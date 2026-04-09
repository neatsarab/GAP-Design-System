<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">รายการรอตรวจ LAB</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ตัวอย่างสินค้าที่รอการตรวจวิเคราะห์ทางห้องปฏิบัติการ
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
              placeholder="เลขคำขอ / ผู้ประกอบการ / ชื่อผลิตภัณฑ์"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <div class="field-label">
              <div>ประเภทการตรวจ</div>
              <div class="field-label-en">Lab Type</div>
            </div>
            <v-autocomplete
              v-model="filters.labType"
              :items="labTypeOptions"
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
          <v-col
            cols="auto"
            class="ml-auto d-flex align-end"
            style="padding-bottom: 4px"
          >
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
        <template #header.operatorName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                ผู้ประกอบการ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Operator
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.productName="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                ชื่อผลิตภัณฑ์
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Product Name
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.labType="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                ประเภทการตรวจ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Lab Type
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>
        <template #header.sentDate="{ column, isSorted, getSortIcon }">
          <span class="d-inline-flex align-center ga-1">
            <span>
              <div
                class="text-body-2 font-weight-medium"
                style="line-height: 1.3"
              >
                วันที่ส่งตรวจ
              </div>
              <div
                class="text-caption text-medium-emphasis"
                style="line-height: 1.2"
              >
                Sent Date
              </div>
            </span>
            <v-icon
              v-if="isSorted(column)"
              :icon="getSortIcon(column)"
              size="14"
            />
          </span>
        </template>

        <template #item.labType="{ item }">
          <div class="d-flex flex-wrap ga-1">
            <v-chip
              v-for="t in item.labType"
              :key="t"
              size="x-small"
              :color="labTypeColor(t)"
              variant="tonal"
            >
              {{ labTypeLabel(t) }}
            </v-chip>
          </div>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="hcex-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-microscope"
            @click.stop="
              router.push({
                name: 'HCEXstaffLabResultRecord',
                params: { id: item.requestNo },
              })
            "
          >
            บันทึกผล
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
const search = ref("");

const filters = reactive({ labType: null });

const labTypeOptions = [
  { label: "จุลชีววิทยา", value: "micro" },
  { label: "เคมี", value: "chem" },
  { label: "สารปนเปื้อน", value: "contam" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ผู้ประกอบการ", key: "operatorName", sortable: true },
  { title: "ชื่อผลิตภัณฑ์", key: "productName", sortable: true },
  { title: "ประเภทการตรวจ", key: "labType", sortable: false },
  { title: "วันที่ส่งตรวจ", key: "sentDate", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

function beDateToTs(str) {
  if (!str) return 0;
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y - 543, m - 1, d).getTime();
}

const customKeySort = {
  sentDate: (a, b) => beDateToTs(a) - beDateToTs(b),
};

const allItems = [
  {
    requestNo: "LABW-0001",
    operatorName: "บริษัท ไทยฟู้ดส์ แปรรูป จำกัด",
    productName: "มะม่วงอบแห้ง (Dried Mango)",
    labType: ["micro", "chem"],
    sentDate: "03/04/2569",
  },
  {
    requestNo: "LABW-0002",
    operatorName: "บริษัท กรีนโปร เอ็กซ์พอร์ต จำกัด",
    productName: "ลำไยอบแห้ง (Dried Longan)",
    labType: ["micro"],
    sentDate: "05/04/2569",
  },
  {
    requestNo: "LABW-0003",
    operatorName: "บริษัท เอเชีย แปรรูปพืช จำกัด",
    productName: "พริกแห้ง (Dried Chili)",
    labType: ["chem", "contam"],
    sentDate: "01/04/2569",
  },
  {
    requestNo: "LABW-0004",
    operatorName: "ห้างหุ้นส่วนจำกัด ไทยออร์แกนิค",
    productName: "ข้าวโพดหวานแช่แข็ง (Frozen Sweet Corn)",
    labType: ["micro", "chem", "contam"],
    sentDate: "28/03/2569",
  },
  {
    requestNo: "LABW-0005",
    operatorName: "บริษัท เฟรช เพลนท์ จำกัด",
    productName: "ถั่วงอก (Bean Sprout)",
    labType: ["micro"],
    sentDate: "06/04/2569",
  },
];

const filteredItems = computed(() => {
  // แสดงเฉพาะรายการที่ต้องตรวจจุลชีววิทยา
  let items = allItems.filter((i) => i.labType.includes("micro"));
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.requestNo.toLowerCase().includes(q) ||
        i.operatorName.toLowerCase().includes(q) ||
        i.productName.toLowerCase().includes(q),
    );
  }
  if (filters.labType)
    items = items.filter((i) => i.labType.includes(filters.labType));
  return items;
});

function clearFilters() {
  search.value = "";
  filters.labType = null;
}

function labTypeColor(t) {
  return { micro: "info", chem: "warning", contam: "error" }[t] ?? "grey";
}

function labTypeLabel(t) {
  return { micro: "จุล", chem: "เคมี", contam: "ปนเปื้อน" }[t] ?? t;
}
</script>
