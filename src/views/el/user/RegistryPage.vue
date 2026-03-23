<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ข้อมูลโรงคัดบรรจุของฉัน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการโรงคัดบรรจุที่ได้รับอนุญาตทั้งหมดของคุณ
        </p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="el-user" prepend-icon="fas fa-download"
          >ส่งออก Excel</v-btn
        >
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in stats" :key="s.label" cols="6" sm="3">
        <v-card rounded="xl" elevation="0">
          <v-card-text class="pa-4 d-flex align-center ga-3">
            <div
              class="stat-icon"
              :style="`background:rgba(var(--v-theme-${s.color}),0.12)`"
            >
              <v-icon :icon="s.icon" :color="s.color" size="20" />
            </div>
            <div>
              <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">
                {{ s.value }}
              </div>
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
          <v-col cols="12" sm="6">
            <div class="field-label mb-1">
              <div>ค้นหา</div>
              <div class="field-label-en">Search</div>
            </div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขทะเบียน / ชื่อโรงคัดบรรจุ"
              prepend-inner-icon="fas fa-search"
              variant="outlined"
              density="compact"
              rounded="lg"
              clearable
              hide-details
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="auto" class="ml-auto">
          <v-btn
            variant="tonal"
            color="grey"
            size="small"
            prepend-icon="fas fa-rotate-left"
            @click="
              search = '';
              filterTab = 'all';
            "
            >ล้างตัวกรอง</v-btn
          >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip tabs -->
    <v-chip-group v-model="filterTab" class="mb-4" mandatory>
      <v-chip value="all" color="el-user" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge :content="items.length" inline color="el-user" class="ml-1" />
      </v-chip>
      <v-chip
        value="active"
        color="success"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start icon="fas fa-circle-check" size="12" /> มีผล
        <v-badge
          :content="countByStatus('active')"
          inline
          color="success"
          class="ml-1"
        />
      </v-chip>
      <v-chip
        value="expiring"
        color="warning"
        variant="tonal"
        filter
        size="small"
      >
        <v-icon start icon="fas fa-clock" size="12" /> ใกล้หมดอายุ
        <v-badge
          :content="countByStatus('expiring')"
          inline
          color="warning"
          class="ml-1"
        />
      </v-chip>
      <v-chip value="expired" color="error" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
        <v-badge
          :content="countByStatus('expired')"
          inline
          color="error"
          class="ml-1"
        />
      </v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        hover
      >
        <template #item.regNo="{ item }">
          <span class="text-body-2 font-weight-bold text-el-user">{{
            item.regNo
          }}</span>
        </template>

        <template #item.certStatus="{ item }">
          <v-chip
            size="small"
            :color="statusColor(item.certStatus)"
            variant="tonal"
            :prepend-icon="statusIcon(item.certStatus)"
          >
            {{ statusLabel(item.certStatus) }}
          </v-chip>
        </template>

        <template #item.expireDate="{ item }">
          <span
            :class="
              item.certStatus === 'expiring'
                ? 'text-warning font-weight-medium'
                : item.certStatus === 'expired'
                  ? 'text-error'
                  : ''
            "
          >
            {{ item.expireDate }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn
              size="small"
              variant="text"
              color="el-user"
              icon="fas fa-eye"
            />
            <v-btn
              size="small"
              variant="text"
              color="success"
              icon="fas fa-download"
              :disabled="item.certStatus === 'expired'"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const filterTab = ref("all");
const search = ref("");


const items = [
  {
    regNo: "EL-2568-00038",
    packingHouseName: "โรงคัดบรรจุไทยฟรุ๊ตส์ สาขา 1",
    location: "ระยอง",
    capacity: "50 ตัน/วัน",
    registeredDate: "10 ม.ค. 68",
    expireDate: "10 ม.ค. 71",
    certStatus: "active",
  },
  {
    regNo: "EL-2568-00022",
    packingHouseName: "โรงคัดบรรจุไทยฟรุ๊ตส์ สาขา 2",
    location: "จันทบุรี",
    capacity: "30 ตัน/วัน",
    registeredDate: "5 ม.ค. 68",
    expireDate: "5 ม.ค. 71",
    certStatus: "active",
  },
  {
    regNo: "EL-2568-00015",
    packingHouseName: "โรงแพ็คผักสดครอบครัวดี",
    location: "นครปฐม",
    capacity: "20 ตัน/วัน",
    registeredDate: "20 ธ.ค. 67",
    expireDate: "20 ธ.ค. 68",
    certStatus: "expiring",
  },
  {
    regNo: "EL-2567-00080",
    packingHouseName: "ห้างคัดบรรจุสยามผลไม้",
    location: "เชียงใหม่",
    capacity: "15 ตัน/วัน",
    registeredDate: "1 ม.ค. 67",
    expireDate: "1 ม.ค. 68",
    certStatus: "expired",
  },
];

function countByStatus(status) {
  return items.filter((i) => i.certStatus === status).length;
}

const stats = [
  {
    label: "ทั้งหมด",
    icon: "fas fa-warehouse",
    color: "primary",
    value: items.length,
  },
  {
    label: "มีผล",
    icon: "fas fa-circle-check",
    color: "success",
    value: countByStatus("active"),
  },
  {
    label: "ใกล้หมดอายุ",
    icon: "fas fa-clock",
    color: "warning",
    value: countByStatus("expiring"),
  },
  {
    label: "หมดอายุแล้ว",
    icon: "fas fa-circle-xmark",
    color: "error",
    value: countByStatus("expired"),
  },
];

const filteredItems = computed(() => {
  if (filterTab.value === "all") return items;
  return items.filter((i) => i.certStatus === filterTab.value);
});

const headers = [
  { title: "เลขทะเบียน", key: "regNo", width: 150 },
  { title: "ชื่อโรงคัดบรรจุ", key: "packingHouseName", width: 230 },
  { title: "ที่ตั้ง", key: "location", width: 120 },
  { title: "กำลังผลิต", key: "capacity", width: 130 },
  { title: "วันที่จดทะเบียน", key: "registeredDate", width: 140 },
  { title: "วันหมดอายุ", key: "expireDate", width: 120 },
  { title: "สถานะ", key: "certStatus", width: 150 },
  { title: "", key: "actions", width: 130, sortable: false },
];

function statusColor(s) {
  return (
    { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey"
  );
}
function statusIcon(s) {
  return (
    {
      active: "fas fa-circle-check",
      expiring: "fas fa-clock",
      expired: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}
function statusLabel(s) {
  return (
    { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s
  );
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
