<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">ผลิตภัณฑ์</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          จัดการรายการผลิตภัณฑ์ที่ใช้ในระบบ
        </p>
      </div>
      <v-btn
        color="doa-staff"
        rounded="lg"
        prepend-icon="fas fa-plus"
        @click="openAdd"
        >เพิ่มผลิตภัณฑ์</v-btn
      >
    </div>

    <!-- Search / Filter -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="5" md="4">
            <div class="field-label">
              <div>ค้นหาขอบข่ายมาตรฐาน</div>
              <div class="field-label-en">Status</div>
            </div>
            <v-text-field
              v-model="search"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              placeholder="ค้นหารหัส / ชื่อผลิตภัณฑ์..."
              prepend-inner-icon="fas fa-magnifying-glass"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <div class="field-label">
              <div>ประเภทสินค้าทั้งหมด</div>
              <div class="field-label-en">Status</div>
            </div>
            <v-autocomplete
              v-model="filterType"
              :items="typeOptions"
              item-title="label"
              item-value="value"
              placeholder="ประเภทสินค้าทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="3" md="4">
            <div class="field-label">
              <div>สถานะ</div>
              <div class="field-label-en">Status</div>
            </div>
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
        :search="search"
        rounded="xl"
        hover
      >
        <template #item.no="{ index }">{{ index + 1 }}</template>

        <template #item.type="{ item }">
          <v-chip size="small" variant="tonal" color="doa-staff">{{
            typeLabel(item.type)
          }}</v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="item.status === 'active' ? 'success' : 'default'"
          >
            {{ item.status === "active" ? "ใช้งาน" : "ปิดใช้งาน" }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              size="x-small"
              variant="tonal"
              color="warning"
              rounded="lg"
              icon="fas fa-pen"
              @click="openEdit(item)"
            />
            <v-btn
              size="x-small"
              variant="tonal"
              color="error"
              rounded="lg"
              icon="fas fa-trash"
              @click="openDelete(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon
            :icon="editingItem ? 'fas fa-pen' : 'fas fa-plus'"
            color="doa-staff"
            size="18"
          />
          {{ editingItem ? "แก้ไขผลิตภัณฑ์" : "เพิ่มผลิตภัณฑ์" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12" sm="4">
              <div class="field-label">
                <div>รหัสผลิตภัณฑ์ <span class="req">*</span></div>
                <div class="field-label-en">Product Code</div>
              </div>
              <v-text-field
                v-model="form.code"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เช่น PRD-001"
              />
            </v-col>
            <v-col cols="12" sm="8">
              <div class="field-label">
                <div>ประเภทสินค้า <span class="req">*</span></div>
                <div class="field-label-en">Product Type</div>
              </div>
              <v-autocomplete
                v-model="form.type"
                :items="typeOptions"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2">
                <div>ชื่อผลิตภัณฑ์ (ภาษาไทย) <span class="req">*</span></div>
                <div class="field-label-en">Product Name (Thai)</div>
              </div>
              <v-text-field
                v-model="form.nameTh"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อเต็มภาษาไทย"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2">
                <div>Product Name (English)</div>
                <div class="field-label-en">Product Name (English)</div>
              </div>
              <v-text-field
                v-model="form.nameEn"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="Full name in English"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2">
                <div>หน่วย</div>
                <div class="field-label-en">Unit</div>
              </div>
              <v-text-field
                v-model="form.unit"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เช่น กก., ตัน, ลิตร"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-2">
                <div>สถานะ</div>
                <div class="field-label-en">Status</div>
              </div>
              <v-switch
                v-model="form.isActive"
                color="doa-staff"
                :label="form.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'"
                hide-details
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="closeFormDialog"
            >ยกเลิก</v-btn
          >
          <v-btn
            variant="flat"
            color="doa-staff"
            rounded="lg"
            @click="saveForm"
            >{{ editingItem ? "บันทึกการแก้ไข" : "เพิ่มผลิตภัณฑ์" }}</v-btn
          >
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
          <h3 class="text-h6 font-weight-bold mb-2">ลบผลิตภัณฑ์</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการลบ
            <strong>{{ deletingItem?.nameTh }}</strong>
            ใช่หรือไม่?<br />การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="closeDeleteDialog"
            >ยกเลิก</v-btn
          >
          <v-btn color="error" rounded="lg" block @click="confirmDelete"
            >ลบ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const search = ref("");
const filterType = ref(null);
const filterStatus = ref(null);

const typeOptions = [
  { label: "พืชผัก", value: "vegetable" },
  { label: "ผลไม้", value: "fruit" },
  { label: "ธัญพืช", value: "grain" },
  { label: "สมุนไพร", value: "herb" },
  { label: "อื่น ๆ", value: "other" },
];

const statusOptions = [
  { label: "ใช้งาน", value: "active" },
  { label: "ปิดใช้งาน", value: "inactive" },
];

const headers = [
  { title: "ลำดับ", key: "no", sortable: false, width: "60px" },
  { title: "รหัสสินค้า", key: "code", sortable: true },
  { title: "ชื่อผลิตภัณฑ์ (ไทย)", key: "nameTh", sortable: true },
  { title: "Product Name", key: "nameEn", sortable: false },
  { title: "ประเภท", key: "type", sortable: true },
  { title: "หน่วย", key: "unit", sortable: false },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const items = ref([
  {
    id: 1,
    code: "PRD-001",
    nameTh: "มะม่วง",
    nameEn: "Mango",
    type: "fruit",
    unit: "กก.",
    status: "active",
  },
  {
    id: 2,
    code: "PRD-002",
    nameTh: "กล้วยหอม",
    nameEn: "Banana",
    type: "fruit",
    unit: "กก.",
    status: "active",
  },
  {
    id: 3,
    code: "PRD-003",
    nameTh: "ข้าวโพดฝักอ่อน",
    nameEn: "Baby Corn",
    type: "vegetable",
    unit: "กก.",
    status: "active",
  },
  {
    id: 4,
    code: "PRD-004",
    nameTh: "ข้าวหอมมะลิ",
    nameEn: "Jasmine Rice",
    type: "grain",
    unit: "ตัน",
    status: "active",
  },
  {
    id: 5,
    code: "PRD-005",
    nameTh: "กระเจี๊ยบแดง",
    nameEn: "Roselle",
    type: "herb",
    unit: "กก.",
    status: "inactive",
  },
]);

let nextId = 6;

const filteredItems = computed(() => {
  let result = items.value;
  if (filterType.value)
    result = result.filter((i) => i.type === filterType.value);
  if (filterStatus.value)
    result = result.filter((i) => i.status === filterStatus.value);
  return result;
});

function clearFilters() {
  search.value = "";
  filterType.value = "";
  filterStatus.value = "";
}

function typeLabel(t) {
  return typeOptions.find((o) => o.value === t)?.label ?? t;
}

// Form
const formDialog = ref(false);
function closeFormDialog() {
  formDialog.value = false;
}
function closeDeleteDialog() {
  deleteDialog.value = false;
}
const editingItem = ref(null);
const form = reactive({
  code: "",
  nameTh: "",
  nameEn: "",
  type: "",
  unit: "",
  isActive: true,
});

function openAdd() {
  editingItem.value = null;
  form.code = "";
  form.nameTh = "";
  form.nameEn = "";
  form.type = "";
  form.unit = "";
  form.isActive = true;
  formDialog.value = true;
}

function openEdit(item) {
  editingItem.value = item;
  form.code = item.code;
  form.nameTh = item.nameTh;
  form.nameEn = item.nameEn;
  form.type = item.type;
  form.unit = item.unit;
  form.isActive = item.status === "active";
  formDialog.value = true;
}

function saveForm() {
  if (editingItem.value) {
    const idx = items.value.findIndex((i) => i.id === editingItem.value.id);
    if (idx !== -1) {
      items.value[idx] = {
        ...editingItem.value,
        code: form.code,
        nameTh: form.nameTh,
        nameEn: form.nameEn,
        type: form.type,
        unit: form.unit,
        status: form.isActive ? "active" : "inactive",
      };
    }
  } else {
    items.value.push({
      id: nextId++,
      code: form.code,
      nameTh: form.nameTh,
      nameEn: form.nameEn,
      type: form.type,
      unit: form.unit,
      status: form.isActive ? "active" : "inactive",
    });
  }
  formDialog.value = false;
}

// Delete
const deleteDialog = ref(false);
const deletingItem = ref(null);

function openDelete(item) {
  deletingItem.value = item;
  deleteDialog.value = true;
}

function confirmDelete() {
  items.value = items.value.filter((i) => i.id !== deletingItem.value?.id);
  deleteDialog.value = false;
}
</script>

<style scoped>
.delete-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
