<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">ข้อมูลทะเบียน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ทะเบียนผู้ส่งออกและโรงงาน/สถานที่ผลิตสินค้าแปรรูปด้านพืช
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="hcex-staff" class="mb-4">
      <v-tab value="exporters" prepend-icon="fas fa-building">ผู้ส่งออก</v-tab>
      <v-tab value="factories" prepend-icon="fas fa-industry">โรงงาน/สถานที่ผลิต</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <!-- Tab: ผู้ส่งออก -->
      <v-tabs-window-item value="exporters">
        <!-- Filters -->
        <v-card class="mb-4">
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="5">
                <div class="field-label mb-1">ค้นหา <span class="field-label-en">Search</span></div>
                <v-text-field
                  v-model="exporterSearch"
                  prepend-inner-icon="fas fa-search"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="6" sm="3">
                <div class="field-label mb-1">สถานะ <span class="field-label-en">Status</span></div>
                <v-autocomplete
                  v-model="exporterStatusFilter"
                  :items="registryStatusOptions"
                  item-title="label"
                  item-value="value"
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
                  @click="exporterSearch = ''; exporterStatusFilter = null"
                >
                  ล้างตัวกรอง
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card>
          <v-data-table
            :headers="exporterHeaders"
            :items="filteredExporters"
            hover
          >
            <template #item.regNo="{ item }">
              <span class="text-body-2 font-weight-medium text-warning">{{ item.regNo }}</span>
            </template>
            <template #item.status="{ item }">
              <v-chip
                size="small"
                :color="item.status === 'active' ? 'success' : 'error'"
                variant="tonal"
                :prepend-icon="item.status === 'active' ? 'fas fa-circle-check' : 'fas fa-ban'"
              >
                {{ item.status === "active" ? "ใช้งาน" : "ระงับ" }}
              </v-chip>
            </template>
            <template #item.actions>
              <v-btn
                size="small"
                variant="tonal"
                color="hcex-staff"
                prepend-icon="fas fa-eye"
              >
                ดูรายละเอียด
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-tabs-window-item>

      <!-- Tab: โรงงาน -->
      <v-tabs-window-item value="factories">
        <!-- Filters -->
        <v-card class="mb-4">
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="5">
                <div class="field-label mb-1">ค้นหา <span class="field-label-en">Search</span></div>
                <v-text-field
                  v-model="factorySearch"
                  prepend-inner-icon="fas fa-search"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="6" sm="3">
                <div class="field-label mb-1">สถานะ <span class="field-label-en">Status</span></div>
                <v-autocomplete
                  v-model="factoryStatusFilter"
                  :items="registryStatusOptions"
                  item-title="label"
                  item-value="value"
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
                  @click="factorySearch = ''; factoryStatusFilter = null"
                >
                  ล้างตัวกรอง
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card>
          <v-data-table
            :headers="factoryHeaders"
            :items="filteredFactories"
            hover
          >
            <template #item.regNo="{ item }">
              <span class="text-body-2 font-weight-medium text-warning">{{ item.regNo }}</span>
            </template>
            <template #item.status="{ item }">
              <v-chip
                size="small"
                :color="item.status === 'active' ? 'success' : 'error'"
                variant="tonal"
                :prepend-icon="item.status === 'active' ? 'fas fa-circle-check' : 'fas fa-ban'"
              >
                {{ item.status === "active" ? "ใช้งาน" : "ระงับ" }}
              </v-chip>
            </template>
            <template #item.actions>
              <v-btn
                size="small"
                variant="tonal"
                color="hcex-staff"
                prepend-icon="fas fa-eye"
              >
                ดูรายละเอียด
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const activeTab = ref("exporters");
const exporterSearch = ref("");
const exporterStatusFilter = ref<string | null>(null);
const factorySearch = ref("");
const factoryStatusFilter = ref<string | null>(null);

const registryStatusOptions = [
  { label: "ใช้งาน", value: "active" },
  { label: "ระงับ", value: "suspended" },
];

interface Exporter {
  id: string;
  regNo: string;
  companyName: string;
  taxId: string;
  address: string;
  status: string;
}

interface Factory {
  id: string;
  regNo: string;
  factoryName: string;
  location: string;
  productType: string;
  status: string;
}

const exporters: Exporter[] = [
  {
    id: "exp-001",
    regNo: "EXP-2568-00001",
    companyName: "บริษัท ไทยฟู้ดโปรเซส จำกัด",
    taxId: "0105560012345",
    address: "123 ถ.สุขุมวิท แขวงพระโขนง กรุงเทพฯ 10260",
    status: "active",
  },
  {
    id: "exp-002",
    regNo: "EXP-2568-00002",
    companyName: "บริษัท เกษตรแปรรูปไทย จำกัด",
    taxId: "0105561023456",
    address: "456 ถ.พหลโยธิน แขวงลาดยาว กรุงเทพฯ 10900",
    status: "active",
  },
  {
    id: "exp-003",
    regNo: "EXP-2568-00003",
    companyName: "ห้างหุ้นส่วน สินทวีผลผลิต",
    taxId: "0993562034567",
    address: "78 ถ.เชียงใหม่-ลำพูน ต.หนองหอย อ.เมือง เชียงใหม่ 50000",
    status: "active",
  },
  {
    id: "exp-004",
    regNo: "EXP-2568-00004",
    companyName: "บริษัท อาหารส่งออกไทย จำกัด",
    taxId: "0105563045678",
    address: "90 นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี 20000",
    status: "active",
  },
  {
    id: "exp-005",
    regNo: "EXP-2567-00098",
    companyName: "บริษัท สยามผลผลิตพืช จำกัด",
    taxId: "0105554056789",
    address: "12 ถ.มิตรภาพ ต.ในเมือง อ.เมือง ขอนแก่น 40000",
    status: "suspended",
  },
];

const factories: Factory[] = [
  {
    id: "fac-001",
    regNo: "FAC-2568-00001",
    factoryName: "โรงงานแปรรูปอาหาร ไทยฟู้ดโปรเซส สาขา 1",
    location: "นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี",
    productType: "อาหารกระป๋อง/อาหารแช่แข็ง",
    status: "active",
  },
  {
    id: "fac-002",
    regNo: "FAC-2568-00002",
    factoryName: "โรงงานแปรรูปผลไม้ เกษตรแปรรูปไทย",
    location: "นิคมอุตสาหกรรมบ้านโพธิ์ ฉะเชิงเทรา",
    productType: "ผลไม้แปรรูป/น้ำผลไม้",
    status: "active",
  },
  {
    id: "fac-003",
    regNo: "FAC-2568-00003",
    factoryName: "โรงงานผักอบแห้ง สินทวีผลผลิต",
    location: "ต.หนองจ๊อม อ.สันทราย เชียงใหม่",
    productType: "ผักอบแห้ง/สมุนไพรแห้ง",
    status: "active",
  },
  {
    id: "fac-004",
    regNo: "FAC-2567-00089",
    factoryName: "โรงงานข้าวบรรจุภัณฑ์ สยามผลผลิตพืช",
    location: "ต.บึงเนียม อ.เมือง ขอนแก่น",
    productType: "ข้าวสาร/ข้าวบรรจุหีบห่อ",
    status: "suspended",
  },
];

const filteredExporters = computed(() => {
  let items = exporters;
  if (exporterStatusFilter.value) items = items.filter((i) => i.status === exporterStatusFilter.value);
  if (exporterSearch.value) {
    const q = exporterSearch.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.companyName.toLowerCase().includes(q) ||
        i.regNo.toLowerCase().includes(q) ||
        i.taxId.includes(q),
    );
  }
  return items;
});

const filteredFactories = computed(() => {
  let items = factories;
  if (factoryStatusFilter.value) items = items.filter((i) => i.status === factoryStatusFilter.value);
  if (factorySearch.value) {
    const q = factorySearch.value.toLowerCase();
    items = items.filter(
      (i) =>
        i.factoryName.toLowerCase().includes(q) ||
        i.regNo.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q),
    );
  }
  return items;
});

const exporterHeaders = [
  { title: "เลขทะเบียน", key: "regNo", width: 160 },
  { title: "ชื่อบริษัท", key: "companyName", width: 250 },
  { title: "เลขนิติบุคคล", key: "taxId", width: 140 },
  { title: "ที่อยู่", key: "address" },
  { title: "สถานะ", key: "status", width: 110 },
  { title: "", key: "actions", width: 150, sortable: false },
];

const factoryHeaders = [
  { title: "เลขทะเบียน", key: "regNo", width: 160 },
  { title: "ชื่อโรงงาน", key: "factoryName", width: 260 },
  { title: "สถานที่", key: "location", width: 220 },
  { title: "ประเภทผลิตภัณฑ์", key: "productType", width: 200 },
  { title: "สถานะ", key: "status", width: 110 },
  { title: "", key: "actions", width: 150, sortable: false },
];
</script>

<style scoped>
.field-label { font-size: 12px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.75); }
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
</style>
