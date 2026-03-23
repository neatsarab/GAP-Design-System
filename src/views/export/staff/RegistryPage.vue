<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ทะเบียนผู้ส่งออก</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">รายการผู้ได้รับอนุญาตส่งออกสินค้าเกษตรทั้งหมด</p>
      </div>
      <v-btn variant="tonal" color="export-staff" prepend-icon="fas fa-download">ส่งออก Excel</v-btn>
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

    <!-- Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5">
            <div class="field-label mb-1"><div>ค้นหา</div><div class="field-label-en">Search</div></div>
            <v-text-field v-model="search" placeholder="ค้นหาเลขทะเบียน / ชื่อบริษัท" prepend-inner-icon="fas fa-search" variant="outlined" density="compact" rounded="lg" clearable hide-details />
          </v-col>
          <v-col cols="12" sm="3">
            <div class="field-label mb-1"><div>ประเภทสินค้า</div><div class="field-label-en">Product Type</div></div>
            <v-select v-model="filterProduct" :items="productOptions" variant="outlined" density="compact" rounded="lg" clearable hide-details />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="auto" class="ml-auto">
          <v-btn variant="tonal" color="grey" size="small" prepend-icon="fas fa-rotate-left" @click="search = ''; filterProduct = null; filterTab = 'all'">ล้างตัวกรอง</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip tabs -->
    <v-chip-group v-model="filterTab" class="mb-4" mandatory>
      <v-chip value="all" color="export-staff" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge :content="items.length" inline color="export-staff" class="ml-1" />
      </v-chip>
      <v-chip value="active" color="success" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
        <v-badge :content="countByStatus('active')" inline color="success" class="ml-1" />
      </v-chip>
      <v-chip value="expiring" color="warning" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
        <v-badge :content="countByStatus('expiring')" inline color="warning" class="ml-1" />
      </v-chip>
      <v-chip value="expired" color="error" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
        <v-badge :content="countByStatus('expired')" inline color="error" class="ml-1" />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="filteredItems" :search="search" hover>
        <template #item.regNo="{ item }">
          <span class="text-body-2 font-weight-bold text-export-staff">{{ item.regNo }}</span>
        </template>

        <template #item.productType="{ item }">
          <v-chip size="x-small" color="export-staff" variant="tonal">{{ item.productType }}</v-chip>
        </template>

        <template #item.certStatus="{ item }">
          <v-chip size="small" :color="statusColor(item.certStatus)" variant="tonal" :prepend-icon="statusIcon(item.certStatus)">
            {{ statusLabel(item.certStatus) }}
          </v-chip>
        </template>

        <template #item.expireDate="{ item }">
          <span :class="item.certStatus === 'expiring' ? 'text-warning font-weight-medium' : item.certStatus === 'expired' ? 'text-error' : ''">
            {{ item.expireDate }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const filterTab = ref("all");
const filterProduct = ref(null);

const productOptions = ["พืชสด", "สินค้าแปรรูป", "เมล็ดพันธุ์", "ปุ๋ย/สารเคมี"];


const items = [
  { regNo: "EXP-2568-00025", companyName: "บริษัท ไทยฟรุ๊ต เอ็กซ์พอร์ต จำกัด", productType: "พืชสด", exportCountry: "จีน, ญี่ปุ่น", registeredDate: "10 ม.ค. 68", expireDate: "10 ม.ค. 71", certStatus: "active" },
  { regNo: "EXP-2568-00021", companyName: "บริษัท สยามอะกรี จำกัด", productType: "สินค้าแปรรูป", exportCountry: "เกาหลีใต้", registeredDate: "5 ม.ค. 68", expireDate: "5 ม.ค. 71", certStatus: "active" },
  { regNo: "EXP-2568-00018", companyName: "ห้างหุ้นส่วนจำกัด ทวีผล", productType: "พืชสด", exportCountry: "สิงคโปร์", registeredDate: "20 ธ.ค. 67", expireDate: "20 ธ.ค. 68", certStatus: "expiring" },
  { regNo: "EXP-2568-00015", companyName: "บริษัท กรีนทรอปิค จำกัด", productType: "เมล็ดพันธุ์", exportCountry: "สหรัฐอเมริกา", registeredDate: "15 ธ.ค. 67", expireDate: "15 ธ.ค. 68", certStatus: "expiring" },
  { regNo: "EXP-2567-00098", companyName: "บริษัท ซันไชน์ ฟูดส์ จำกัด", productType: "สินค้าแปรรูป", exportCountry: "ยุโรป", registeredDate: "1 ม.ค. 67", expireDate: "1 ม.ค. 68", certStatus: "expired" },
  { regNo: "EXP-2568-00010", companyName: "บริษัท ออร์กาสยาม จำกัด", productType: "พืชสด", exportCountry: "ฮ่องกง", registeredDate: "8 ม.ค. 68", expireDate: "8 ม.ค. 71", certStatus: "active" },
];

function countByStatus(status) {
  return items.filter((i) => i.certStatus === status).length;
}

const stats = [
  { label: "ทั้งหมด", icon: "fas fa-ship", color: "primary", value: items.length },
  { label: "มีผล", icon: "fas fa-circle-check", color: "success", value: countByStatus("active") },
  { label: "ใกล้หมดอายุ", icon: "fas fa-clock", color: "warning", value: countByStatus("expiring") },
  { label: "หมดอายุแล้ว", icon: "fas fa-circle-xmark", color: "error", value: countByStatus("expired") },
];

const filteredItems = computed(() => {
  let result = items;
  if (filterTab.value !== "all") result = result.filter((i) => i.certStatus === filterTab.value);
  if (filterProduct.value) result = result.filter((i) => i.productType === filterProduct.value);
  return result;
});

const headers = [
  { title: "เลขทะเบียน", key: "regNo", width: 150 },
  { title: "ชื่อบริษัท / ผู้ประกอบการ", key: "companyName", width: 250 },
  { title: "ประเภทสินค้า", key: "productType", width: 130 },
  { title: "ประเทศส่งออก", key: "exportCountry", width: 160 },
  { title: "วันที่จดทะเบียน", key: "registeredDate", width: 140 },
  { title: "วันหมดอายุ", key: "expireDate", width: 120 },
  { title: "สถานะ", key: "certStatus", width: 150 },
];

function statusColor(s) {
  return { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey";
}
function statusIcon(s) {
  return { active: "fas fa-circle-check", expiring: "fas fa-clock", expired: "fas fa-circle-xmark" }[s] ?? "fas fa-circle";
}
function statusLabel(s) {
  return { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s;
}
</script>

<style scoped>
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
