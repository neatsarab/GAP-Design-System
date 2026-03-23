<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ข้อมูลทะเบียน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ทะเบียนผู้ส่งออกและโรงงาน/สถานที่ผลิตสินค้าแปรรูปด้านพืช</p>
      </div>
      <v-btn variant="tonal" color="hcex-staff" prepend-icon="fas fa-download">ส่งออก Excel</v-btn>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in stats" :key="s.label" cols="6" sm="3">
        <v-card rounded="xl" elevation="0">
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div class="stat-icon" :style="`background:rgba(var(--v-theme-${s.color}),0.12)`">
              <v-icon :icon="s.icon" :color="s.color" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">{{ s.value }}</div>
              <div class="text-caption text-medium-emphasis">{{ s.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="hcex-staff" class="mb-4">
      <v-tab value="exporters" prepend-icon="fas fa-building">ผู้ส่งออก</v-tab>
      <v-tab value="factories" prepend-icon="fas fa-industry">โรงงาน/สถานที่ผลิต</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <!-- Tab: ผู้ส่งออก -->
      <v-tabs-window-item value="exporters">
        <!-- Filters -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
          <v-card-text class="pa-4">
            <v-row dense align="center">
              <v-col cols="12" sm="5">
                <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
                <v-text-field v-model="exporterSearch" placeholder="ค้นหาชื่อบริษัท / เลขทะเบียน" prepend-inner-icon="fas fa-search" variant="outlined" density="compact" rounded="lg" hide-details clearable />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto" class="ml-auto">
              <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left" @click="exporterSearch = ''; exporterTabFilter = 'all'">ล้างตัวกรอง</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Chip tabs -->
        <v-chip-group v-model="exporterTabFilter" class="mb-4" mandatory>
          <v-chip value="all" color="hcex-staff" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
            <v-badge :content="exporters.length" inline color="hcex-staff" class="ml-1" />
          </v-chip>
          <v-chip value="active" color="success" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
            <v-badge :content="countExporterByStatus('active')" inline color="success" class="ml-1" />
          </v-chip>
          <v-chip value="expiring" color="warning" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
            <v-badge :content="countExporterByStatus('expiring')" inline color="warning" class="ml-1" />
          </v-chip>
          <v-chip value="expired" color="error" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
            <v-badge :content="countExporterByStatus('expired')" inline color="error" class="ml-1" />
          </v-chip>
        </v-chip-group>

        <v-card rounded="xl" elevation="0" class="data-card">
          <v-data-table :headers="exporterHeaders" :items="filteredExporters" :search="exporterSearch" hover>
            <template #item.regNo="{ item }">
              <span class="text-body-2 font-weight-medium text-hcex-staff">{{ item.regNo }}</span>
            </template>
            <template #item.expireDate="{ item }">
              <span :class="item.certStatus === 'expiring' ? 'text-warning font-weight-medium' : item.certStatus === 'expired' ? 'text-error' : ''">{{ item.expireDate }}</span>
            </template>
            <template #item.certStatus="{ item }">
              <v-chip size="small" :color="statusColor(item.certStatus)" variant="tonal" :prepend-icon="statusIcon(item.certStatus)">
                {{ statusLabel(item.certStatus) }}
              </v-chip>
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex ga-1">
                <v-btn size="small" variant="text" color="hcex-staff" icon="fas fa-eye" />
                <v-btn size="small" variant="text" color="success" icon="fas fa-download" :disabled="item.certStatus === 'expired'" />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-tabs-window-item>

      <!-- Tab: โรงงาน -->
      <v-tabs-window-item value="factories">
        <!-- Filters -->
        <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
          <v-card-text class="pa-4">
            <v-row dense align="center">
              <v-col cols="12" sm="5">
                <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
                <v-text-field v-model="factorySearch" placeholder="ค้นหาชื่อโรงงาน / เลขทะเบียน" prepend-inner-icon="fas fa-search" variant="outlined" density="compact" rounded="lg" hide-details clearable />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto" class="ml-auto">
              <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left" @click="factorySearch = ''; factoryTabFilter = 'all'">ล้างตัวกรอง</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Chip tabs -->
        <v-chip-group v-model="factoryTabFilter" class="mb-4" mandatory>
          <v-chip value="all" color="hcex-staff" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
            <v-badge :content="factories.length" inline color="hcex-staff" class="ml-1" />
          </v-chip>
          <v-chip value="active" color="success" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
            <v-badge :content="countFactoryByStatus('active')" inline color="success" class="ml-1" />
          </v-chip>
          <v-chip value="expiring" color="warning" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
            <v-badge :content="countFactoryByStatus('expiring')" inline color="warning" class="ml-1" />
          </v-chip>
          <v-chip value="expired" color="error" variant="tonal" filter size="small">
            <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
            <v-badge :content="countFactoryByStatus('expired')" inline color="error" class="ml-1" />
          </v-chip>
        </v-chip-group>

        <v-card rounded="xl" elevation="0" class="data-card">
          <v-data-table :headers="factoryHeaders" :items="filteredFactories" :search="factorySearch" hover>
            <template #item.regNo="{ item }">
              <span class="text-body-2 font-weight-medium text-hcex-staff">{{ item.regNo }}</span>
            </template>
            <template #item.expireDate="{ item }">
              <span :class="item.certStatus === 'expiring' ? 'text-warning font-weight-medium' : item.certStatus === 'expired' ? 'text-error' : ''">{{ item.expireDate }}</span>
            </template>
            <template #item.certStatus="{ item }">
              <v-chip size="small" :color="statusColor(item.certStatus)" variant="tonal" :prepend-icon="statusIcon(item.certStatus)">
                {{ statusLabel(item.certStatus) }}
              </v-chip>
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex ga-1">
                <v-btn size="small" variant="text" color="hcex-staff" icon="fas fa-eye" />
                <v-btn size="small" variant="text" color="success" icon="fas fa-download" :disabled="item.certStatus === 'expired'" />
              </div>
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
const exporterTabFilter = ref("all");
const factorySearch = ref("");
const factoryTabFilter = ref("all");

interface Exporter {
  id: string;
  regNo: string;
  companyName: string;
  taxId: string;
  registeredDate: string;
  expireDate: string;
  certStatus: "active" | "expiring" | "expired";
}

interface Factory {
  id: string;
  regNo: string;
  factoryName: string;
  location: string;
  productType: string;
  registeredDate: string;
  expireDate: string;
  certStatus: "active" | "expiring" | "expired";
}

const exporters: Exporter[] = [
  { id: "exp-001", regNo: "EXP-2568-00001", companyName: "บริษัท ไทยฟู้ดโปรเซส จำกัด",    taxId: "0105560012345", registeredDate: "01/01/2568", expireDate: "01/01/2571", certStatus: "active"   },
  { id: "exp-002", regNo: "EXP-2568-00002", companyName: "บริษัท เกษตรแปรรูปไทย จำกัด",   taxId: "0105561023456", registeredDate: "15/02/2568", expireDate: "15/02/2571", certStatus: "active"   },
  { id: "exp-003", regNo: "EXP-2568-00003", companyName: "ห้างหุ้นส่วน สินทวีผลผลิต",     taxId: "0993562034567", registeredDate: "10/06/2567", expireDate: "01/04/2568", certStatus: "expiring" },
  { id: "exp-004", regNo: "EXP-2568-00004", companyName: "บริษัท อาหารส่งออกไทย จำกัด",   taxId: "0105563045678", registeredDate: "20/09/2568", expireDate: "20/09/2571", certStatus: "active"   },
  { id: "exp-005", regNo: "EXP-2567-00098", companyName: "บริษัท สยามผลผลิตพืช จำกัด",    taxId: "0105554056789", registeredDate: "01/01/2565", expireDate: "01/01/2568", certStatus: "expired"  },
];

const factories: Factory[] = [
  { id: "fac-001", regNo: "FAC-2568-00001", factoryName: "โรงงานแปรรูปอาหาร ไทยฟู้ดโปรเซส สาขา 1", location: "นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี",   productType: "อาหารกระป๋อง/อาหารแช่แข็ง", registeredDate: "01/01/2568", expireDate: "01/01/2571", certStatus: "active"   },
  { id: "fac-002", regNo: "FAC-2568-00002", factoryName: "โรงงานแปรรูปผลไม้ เกษตรแปรรูปไทย",       location: "นิคมอุตสาหกรรมบ้านโพธิ์ ฉะเชิงเทรา", productType: "ผลไม้แปรรูป/น้ำผลไม้",        registeredDate: "15/02/2568", expireDate: "15/02/2571", certStatus: "active"   },
  { id: "fac-003", regNo: "FAC-2568-00003", factoryName: "โรงงานผักอบแห้ง สินทวีผลผลิต",           location: "ต.หนองจ๊อม อ.สันทราย เชียงใหม่",    productType: "ผักอบแห้ง/สมุนไพรแห้ง",       registeredDate: "10/06/2567", expireDate: "01/04/2568", certStatus: "expiring" },
  { id: "fac-004", regNo: "FAC-2567-00089", factoryName: "โรงงานข้าวบรรจุภัณฑ์ สยามผลผลิตพืช",    location: "ต.บึงเนียม อ.เมือง ขอนแก่น",        productType: "ข้าวสาร/ข้าวบรรจุหีบห่อ",     registeredDate: "01/01/2565", expireDate: "01/01/2568", certStatus: "expired"  },
];

const stats = computed(() => [
  { label: "ทั้งหมด",     icon: "fas fa-building-wheat", color: "primary", value: exporters.length + factories.length },
  { label: "มีผล",         icon: "fas fa-circle-check",   color: "success",    value: countExporterByStatus("active") + countFactoryByStatus("active") },
  { label: "ใกล้หมดอายุ", icon: "fas fa-clock",           color: "warning",    value: countExporterByStatus("expiring") + countFactoryByStatus("expiring") },
  { label: "หมดอายุ",      icon: "fas fa-circle-xmark",   color: "error",      value: countExporterByStatus("expired") + countFactoryByStatus("expired") },
]);

function countExporterByStatus(s: string) { return exporters.filter((i) => i.certStatus === s).length; }
function countFactoryByStatus(s: string) { return factories.filter((i) => i.certStatus === s).length; }

const filteredExporters = computed(() => {
  let items = exporters;
  if (exporterTabFilter.value !== "all") items = items.filter((i) => i.certStatus === exporterTabFilter.value);
  if (exporterSearch.value) {
    const q = exporterSearch.value.toLowerCase();
    items = items.filter((i) => i.companyName.toLowerCase().includes(q) || i.regNo.toLowerCase().includes(q) || i.taxId.includes(q));
  }
  return items;
});

const filteredFactories = computed(() => {
  let items = factories;
  if (factoryTabFilter.value !== "all") items = items.filter((i) => i.certStatus === factoryTabFilter.value);
  if (factorySearch.value) {
    const q = factorySearch.value.toLowerCase();
    items = items.filter((i) => i.factoryName.toLowerCase().includes(q) || i.regNo.toLowerCase().includes(q) || i.location.toLowerCase().includes(q));
  }
  return items;
});

const exporterHeaders = [
  { title: "เลขทะเบียน",     key: "regNo",           width: 160 },
  { title: "ชื่อบริษัท",     key: "companyName",     width: 250 },
  { title: "เลขนิติบุคคล",   key: "taxId",           width: 140 },
  { title: "วันที่ขึ้นทะเบียน", key: "registeredDate", width: 150 },
  { title: "วันหมดอายุ",      key: "expireDate",      width: 130 },
  { title: "สถานะ",           key: "certStatus",      width: 140 },
  { title: "",                key: "actions",         width: 150, sortable: false },
];

const factoryHeaders = [
  { title: "เลขทะเบียน",      key: "regNo",          width: 160 },
  { title: "ชื่อโรงงาน",      key: "factoryName",    width: 250 },
  { title: "สถานที่",          key: "location",       width: 200 },
  { title: "ประเภทผลิตภัณฑ์", key: "productType",    width: 180 },
  { title: "วันหมดอายุ",       key: "expireDate",     width: 130 },
  { title: "สถานะ",            key: "certStatus",     width: 140 },
  { title: "",                 key: "actions",        width: 150, sortable: false },
];

function statusColor(s: string) {
  return { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey";
}
function statusIcon(s: string) {
  return { active: "fas fa-circle-check", expiring: "fas fa-clock", expired: "fas fa-circle-xmark" }[s] ?? "fas fa-circle";
}
function statusLabel(s: string) {
  return { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s;
}
</script>

<style scoped>
.stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
</style>
