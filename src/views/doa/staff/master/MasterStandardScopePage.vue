<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">ขอบข่ายมาตรฐาน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">จัดการรายการขอบข่ายมาตรฐานที่ใช้ในระบบ</p>
      </div>
      <v-btn color="doa-staff" rounded="lg" prepend-icon="fas fa-plus" @click="openAdd">เพิ่มมาตรฐาน</v-btn>
    </div>

    <!-- Search / Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5" md="4">
            <v-text-field
              v-model="search"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              placeholder="ค้นหารหัส / ชื่อมาตรฐาน..."
              prepend-inner-icon="fas fa-magnifying-glass"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-autocomplete
              v-model="filterCategory"
              :items="categoryOptions"
              item-title="label"
              item-value="value"
              placeholder="หมวดหมู่ทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="3" md="2">
            <v-autocomplete
              v-model="filterStatus"
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

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        rounded="xl"
        hover
      >
        <template #item.no="{ index }">{{ index + 1 }}</template>

        <template #item.category="{ item }">
          <v-chip size="small" variant="tonal" color="doa-staff">{{ item.category }}</v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="item.status === 'active' ? 'success' : 'default'"
          >
            {{ item.status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn size="x-small" variant="tonal" color="doa-staff" rounded="lg" icon="fas fa-pen" @click="openEdit(item)" />
            <v-btn size="x-small" variant="tonal" color="error" rounded="lg" icon="fas fa-trash" @click="openDelete(item)" />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="560" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon :icon="editingItem ? 'fas fa-pen' : 'fas fa-plus'" color="doa-staff" size="18" />
          {{ editingItem ? 'แก้ไขขอบข่ายมาตรฐาน' : 'เพิ่มขอบข่ายมาตรฐาน' }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12" sm="4">
              <div class="field-label"><div>รหัสมาตรฐาน <span class="req">*</span></div><div class="field-label-en">Standard Code</div></div>
              <v-text-field v-model="form.code" variant="outlined" density="compact" rounded="lg" hide-details placeholder="เช่น มกษ.9023" />
            </v-col>
            <v-col cols="12" sm="8">
              <div class="field-label"><div>หมวดหมู่ <span class="req">*</span></div><div class="field-label-en">Category</div></div>
              <v-autocomplete v-model="form.category" :items="categoryOptions" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2"><div>ชื่อมาตรฐาน (ภาษาไทย) <span class="req">*</span></div><div class="field-label-en">Standard Name (Thai)</div></div>
              <v-text-field v-model="form.nameTh" variant="outlined" density="compact" rounded="lg" hide-details placeholder="ชื่อเต็มภาษาไทย" />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2"><div>Standard Name (English)</div><div class="field-label-en">Standard Name (English)</div></div>
              <v-text-field v-model="form.nameEn" variant="outlined" density="compact" rounded="lg" hide-details placeholder="Full name in English" />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2"><div>คำอธิบาย</div><div class="field-label-en">Description</div></div>
              <v-textarea v-model="form.description" variant="outlined" density="compact" rounded="lg" hide-details rows="2" placeholder="รายละเอียดเพิ่มเติม..." />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2"><div>สถานะ</div><div class="field-label-en">Status</div></div>
              <v-switch v-model="form.isActive" color="doa-staff" :label="form.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'" hide-details density="compact" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="formDialog = false">ยกเลิก</v-btn>
          <v-btn color="doa-staff" rounded="lg" @click="saveForm">{{ editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มมาตรฐาน' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="delete-ring mx-auto mb-4">
            <v-icon icon="fas fa-trash" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลบขอบข่ายมาตรฐาน</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการลบ <strong>{{ deletingItem?.code }}</strong> ใช่หรือไม่?<br>การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="deleteDialog = false">ยกเลิก</v-btn>
          <v-btn color="error" rounded="lg" block @click="confirmDelete">ลบ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

interface StandardScope {
  id: number;
  code: string;
  nameTh: string;
  nameEn: string;
  category: string;
  description: string;
  status: "active" | "inactive";
}

const search = ref("");
const filterCategory = ref<string | null>(null);
const filterStatus = ref<string | null>(null);

const categoryOptions = [
  { label: "GMP", value: "GMP" },
  { label: "GAP", value: "GAP" },
  { label: "HACCP", value: "HACCP" },
  { label: "อื่น ๆ", value: "OTHER" },
];

const statusOptions = [
  { label: "ใช้งาน", value: "active" },
  { label: "ปิดใช้งาน", value: "inactive" },
];

const headers = [
  { title: "ลำดับ", key: "no", sortable: false, width: "60px" },
  { title: "รหัสมาตรฐาน", key: "code", sortable: true },
  { title: "ชื่อมาตรฐาน (ไทย)", key: "nameTh", sortable: true },
  { title: "Standard Name", key: "nameEn", sortable: false },
  { title: "หมวดหมู่", key: "category", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const items = ref<StandardScope[]>([
  { id: 1, code: "มกษ. 9023-2550", nameTh: "การปฏิบัติที่ดีสำหรับโรงคัดบรรจุผักและผลไม้สด", nameEn: "Good Manufacturing Practice for Fresh Fruit and Vegetable Packing Houses", category: "GMP", description: "", status: "active" },
  { id: 2, code: "มกษ. 9041-2556", nameTh: "การปฏิบัติที่ดีสำหรับโรงงานผลิตสินค้าเกษตรอินทรีย์", nameEn: "Good Manufacturing Practice for Organic Agricultural Products", category: "GMP", description: "", status: "active" },
  { id: 3, code: "มกษ. 4402-2552", nameTh: "การปฏิบัติทางการเกษตรที่ดีสำหรับข้าว", nameEn: "Good Agricultural Practice for Rice", category: "GAP", description: "", status: "active" },
  { id: 4, code: "มกษ. 9001-2556", nameTh: "เกษตรอินทรีย์ เล่ม 1 การผลิต แปรรูป แสดงฉลาก และจำหน่ายผลิตผลและผลิตภัณฑ์เกษตรอินทรีย์", nameEn: "Organic Agriculture Part 1", category: "GAP", description: "", status: "inactive" },
]);

let nextId = 5;

const filteredItems = computed(() => {
  let result = items.value;
  if (filterCategory.value) result = result.filter((i) => i.category === filterCategory.value);
  if (filterStatus.value) result = result.filter((i) => i.status === filterStatus.value);
  return result;
});

// Form
const formDialog = ref(false);
const editingItem = ref<StandardScope | null>(null);
const form = reactive({ code: "", nameTh: "", nameEn: "", category: "", description: "", isActive: true });

function openAdd() {
  editingItem.value = null;
  form.code = ""; form.nameTh = ""; form.nameEn = ""; form.category = ""; form.description = ""; form.isActive = true;
  formDialog.value = true;
}

function openEdit(item: StandardScope) {
  editingItem.value = item;
  form.code = item.code; form.nameTh = item.nameTh; form.nameEn = item.nameEn;
  form.category = item.category; form.description = item.description; form.isActive = item.status === "active";
  formDialog.value = true;
}

function saveForm() {
  if (editingItem.value) {
    const idx = items.value.findIndex((i) => i.id === editingItem.value!.id);
    if (idx !== -1) {
      items.value[idx] = { ...editingItem.value, code: form.code, nameTh: form.nameTh, nameEn: form.nameEn, category: form.category, description: form.description, status: form.isActive ? "active" : "inactive" };
    }
  } else {
    items.value.push({ id: nextId++, code: form.code, nameTh: form.nameTh, nameEn: form.nameEn, category: form.category, description: form.description, status: form.isActive ? "active" : "inactive" });
  }
  formDialog.value = false;
}

// Delete
const deleteDialog = ref(false);
const deletingItem = ref<StandardScope | null>(null);

function openDelete(item: StandardScope) {
  deletingItem.value = item;
  deleteDialog.value = true;
}

function confirmDelete() {
  items.value = items.value.filter((i) => i.id !== deletingItem.value?.id);
  deleteDialog.value = false;
}
</script>

<style scoped>
.delete-ring { width: 60px; height: 60px; border-radius: 50%; background: rgba(var(--v-theme-error), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
