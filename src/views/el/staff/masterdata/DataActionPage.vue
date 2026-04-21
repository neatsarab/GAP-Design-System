<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
      <div>
        <h1 class="text-h6 font-weight-bold mb-1">ประเภทพืช / สินค้าเกษตร</h1>
        <p class="text-caption text-medium-emphasis">Plant / Agricultural Product Types</p>
      </div>
      <v-btn color="el-staff" prepend-icon="fas fa-plus" size="small" class="px-4">เพิ่มข้อมูล</v-btn>
    </div>

    <v-card rounded="xl" elevation="0" class="border">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        hover
        class="plant-table"
      >
        <template #item.status="{ item }">
          <v-chip color="success" size="x-small" variant="tonal" class="font-weight-medium">
            ใช้งาน
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn icon size="x-small" variant="text" color="blue-darken-1">
              <v-icon icon="fas fa-pencil" size="14" />
            </v-btn>
            <v-btn icon size="x-small" variant="text" color="red-darken-1">
              <v-icon icon="fas fa-trash-can" size="14" />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const headers = [
  { title: "รหัส", key: "id", width: "15%" },
  { title: "ชื่อ (ไทย)", key: "nameTh" },
  { title: "ชื่อ (อังกฤษ)", key: "nameEn" },
  { title: "หมวดหมู่", key: "category" },
  { title: "สถานะ", key: "status", align: "start" },
  { title: "", key: "actions", sortable: false, align: "end", width: "100px" },
];

const allItems = ref([
  { id: "PLT-001", nameTh: "มะม่วง", nameEn: "Mango", category: "ผลไม้", status: "active" },
  { id: "PLT-002", nameTh: "ทุเรียน", nameEn: "Durian", category: "ผลไม้", status: "active" },
  { id: "PLT-003", nameTh: "ลำไย", nameEn: "Longan", category: "ผลไม้", status: "active" },
  { id: "PLT-004", nameTh: "กระเทียม", nameEn: "Garlic", category: "พืชผัก", status: "active" },
  { id: "PLT-005", nameTh: "ข้าวโพด", nameEn: "Corn", category: "พืชไร่", status: "active" },
  { id: "PLT-006", nameTh: "มะม่วงอบแห้ง", nameEn: "Dried Mango", category: "สินค้าแปรรูป", status: "active" },
]);

const filteredItems = computed(() => allItems.value);
</script>

<style scoped>
.plant-table :deep(thead th) {
  background-color: #fcfcfc !important;
  color: #757575 !important;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  text-transform: uppercase;
}

.plant-table :deep(tbody td) {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  color: #424242 !important;
  font-size: 0.9rem !important;
}

.v-btn {
  opacity: 0.7;
}
.v-btn:hover {
  opacity: 1;
}
</style>