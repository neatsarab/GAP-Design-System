<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">ทะเบียนโรงคัดบรรจุ EL</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        รายชื่อโรงคัดบรรจุที่ขึ้นทะเบียนในระบบ Establishment List
      </p>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col
        v-for="stat in stats"
        :key="stat.label"
        cols="12"
        sm="4"
      >
        <v-card rounded="xl" elevation="0" class="stat-card">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <div
                class="stat-icon-box rounded-xl"
                :style="{ background: `rgba(var(--v-theme-${stat.color}), 0.1)` }"
              >
                <v-icon :icon="stat.icon" :color="stat.color" size="20" />
              </div>
              <span class="text-h4 font-weight-bold">{{ stat.value }}</span>
            </div>
            <div class="text-body-2 font-weight-medium">{{ stat.label }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Card -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="5">
            <div class="field-label mb-1">ค้นหา <span class="field-label-en">Search</span></div>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขทะเบียน / ชื่อโรงคัดบรรจุ"
              prepend-inner-icon="fas fa-magnifying-glass"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <div class="field-label mb-1">สถานะ <span class="field-label-en">Status</span></div>
            <v-autocomplete
              v-model="statusFilter"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              placeholder="สถานะทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip Tabs -->
    <v-chip-group v-model="activeTab" mandatory color="el-staff" class="mb-4">
      <v-chip value="all" variant="tonal" rounded="lg">ทั้งหมด</v-chip>
      <v-chip value="active" variant="tonal" rounded="lg">มีผล</v-chip>
      <v-chip value="expiring_soon" variant="tonal" rounded="lg">ใกล้หมดอายุ</v-chip>
      <v-chip value="expired" variant="tonal" rounded="lg">หมดอายุ</v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        rounded="xl"
        hover
      >
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions>
          <v-btn
            size="small"
            color="el-staff"
            variant="tonal"
            rounded="lg"
            icon="fas fa-eye"
          />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const search = ref("");
const statusFilter = ref<string | null>(null);
const activeTab = ref("all");

const stats = [
  { label: "ขึ้นทะเบียนแล้ว", value: 45, icon: "fas fa-warehouse", color: "success" },
  { label: "ใกล้หมดอายุ (90 วัน)", value: 5, icon: "fas fa-clock", color: "warning" },
  { label: "หมดอายุ", value: 3, icon: "fas fa-circle-xmark", color: "error" },
];

const statusOptions = [
  { label: "มีผล", value: "active" },
  { label: "ใกล้หมดอายุ", value: "expiring_soon" },
  { label: "หมดอายุ", value: "expired" },
];

const headers = [
  { title: "เลขทะเบียน", key: "regNo", sortable: true },
  { title: "ชื่อโรงคัดบรรจุ", key: "establishmentName", sortable: true },
  { title: "ชนิดพืช", key: "cropType", sortable: true },
  { title: "จังหวัด", key: "province", sortable: true },
  { title: "วันที่ขึ้นทะเบียน", key: "registeredDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  { id: 1, regNo: "EL-REG-2568-00045", establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.", cropType: "ทุเรียน", province: "กรุงเทพฯ", registeredDate: "15 ม.ค. 2568", expireDate: "14 ม.ค. 2570", status: "active" },
  { id: 2, regNo: "EL-REG-2568-00044", establishmentName: "บ.สยามฟาร์ม จก.", cropType: "มังคุด", province: "จันทบุรี", registeredDate: "10 ม.ค. 2568", expireDate: "09 ม.ค. 2570", status: "active" },
  { id: 3, regNo: "EL-REG-2567-00038", establishmentName: "บ.เชียงใหม่ฟรุ๊ต จก.", cropType: "ลำไย", province: "เชียงใหม่", registeredDate: "20 มิ.ย. 2567", expireDate: "01 เม.ย. 2568", status: "expiring_soon" },
  { id: 4, regNo: "EL-REG-2567-00032", establishmentName: "บ.อีสานโปรดิ๊วซ จก.", cropType: "ทุเรียน", province: "ระยอง", registeredDate: "05 มี.ค. 2567", expireDate: "15 มี.ค. 2568", status: "expiring_soon" },
  { id: 5, regNo: "EL-REG-2566-00020", establishmentName: "บ.กรีนฟาร์ม จก.", cropType: "ลิ้นจี่", province: "ลำพูน", registeredDate: "10 ส.ค. 2566", expireDate: "09 ส.ค. 2568", status: "expiring_soon" },
  { id: 6, regNo: "EL-REG-2565-00015", establishmentName: "บ.นครปฐมฟาร์ม จก.", cropType: "ทุเรียน", province: "นครปฐม", registeredDate: "12 พ.ค. 2565", expireDate: "11 พ.ค. 2567", status: "expired" },
  { id: 7, regNo: "EL-REG-2565-00010", establishmentName: "บ.ภาคใต้โปรดิ๊วซ จก.", cropType: "มังคุด", province: "สุราษฎร์ธานี", registeredDate: "03 ม.ค. 2565", expireDate: "02 ม.ค. 2567", status: "expired" },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (activeTab.value !== "all") {
    items = items.filter((i) => i.status === activeTab.value);
  }
  if (statusFilter.value) {
    items = items.filter((i) => i.status === statusFilter.value);
  }
  return items;
});

function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: "success",
    expiring_soon: "warning",
    expired: "error",
  };
  return map[status] ?? "grey";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "มีผล",
    expiring_soon: "ใกล้หมดอายุ",
    expired: "หมดอายุ",
  };
  return map[status] ?? status;
}
</script>

<style scoped>
.field-label { font-size: 12px; font-weight: 600; color: rgba(var(--v-theme-on-surface), 0.75); }
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
.stat-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.stat-icon-box {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.filter-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.data-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
