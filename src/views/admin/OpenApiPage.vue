<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">Open API Management</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">บริหารจัดการ API สำหรับเชื่อมต่อกับหน่วยงานภายนอก</p>
      </div>
      <v-btn color="admin" rounded="lg" prepend-icon="fas fa-plus" @click="openAdd">เพิ่ม API</v-btn>
    </div>

    <!-- Summary chips -->
    <div class="d-flex ga-2 flex-wrap mb-5">
      <v-chip color="success" variant="tonal" prepend-icon="fas fa-circle">Active: {{ items.filter(i => i.status === 'Active').length }}</v-chip>
      <v-chip color="default" variant="tonal" prepend-icon="fas fa-circle">Inactive: {{ items.filter(i => i.status === 'Inactive').length }}</v-chip>
    </div>

    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="items" rounded="xl" hover>
        <template #item.method="{ item }">
          <v-chip size="x-small" :color="methodColor(item.method)" variant="tonal" class="font-weight-bold">{{ item.method }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <v-switch v-model="item.active" color="success" density="compact" hide-details @update:model-value="item.status = item.active ? 'Active' : 'Inactive'" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn size="x-small" variant="tonal" color="admin" rounded="lg" icon="fas fa-pen" @click="openEdit(item)" />
            <v-btn size="x-small" variant="tonal" color="error" rounded="lg" icon="fas fa-trash" @click="openDelete(item)" />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon :icon="editingItem ? 'fas fa-pen' : 'fas fa-plus'" color="admin" size="18" />
          {{ editingItem ? 'แก้ไข API' : 'เพิ่ม API' }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label"><div>API Name <span class="req">*</span></div><div class="field-label-en">API Name</div></div>
              <v-text-field v-model="form.name" variant="outlined" density="compact" rounded="lg" hide-details placeholder="ชื่อ API" />
            </v-col>
            <v-col cols="12" sm="8">
              <div class="field-label mt-3"><div>Endpoint <span class="req">*</span></div><div class="field-label-en">Endpoint</div></div>
              <v-text-field v-model="form.endpoint" variant="outlined" density="compact" rounded="lg" hide-details placeholder="/api/..." />
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label mt-3"><div>Method <span class="req">*</span></div><div class="field-label-en">Method</div></div>
              <v-autocomplete v-model="form.method" :items="['GET', 'POST', 'PUT', 'DELETE']" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3"><div>Description</div><div class="field-label-en">Description</div></div>
              <v-textarea v-model="form.description" variant="outlined" density="compact" rounded="lg" hide-details rows="2" placeholder="รายละเอียด API..." />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3"><div>สถานะ</div><div class="field-label-en">Status</div></div>
              <v-switch v-model="form.isActive" color="admin" :label="form.isActive ? 'Active' : 'Inactive'" hide-details density="compact" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="closeFormDialog">ยกเลิก</v-btn>
          <v-btn color="admin" rounded="lg" @click="saveForm">{{ editingItem ? 'บันทึก' : 'เพิ่ม API' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="delete-ring mx-auto mb-4">
            <v-icon icon="fas fa-trash" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลบ API</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">ต้องการลบ <strong>{{ deletingItem?.name }}</strong> ใช่หรือไม่?</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="closeDeleteDialog">ยกเลิก</v-btn>
          <v-btn color="error" rounded="lg" block @click="confirmDelete">ลบ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";


const items = ref([
  { id: 1, name: "Get Factory Data", endpoint: "/api/factory", method: "GET", description: "ดึงข้อมูลโรงงาน", status: "Active", active: true },
  { id: 2, name: "Submit Request", endpoint: "/api/request", method: "POST", description: "ยื่นคำขอ", status: "Active", active: true },
  { id: 3, name: "Update Certificate", endpoint: "/api/certificate", method: "PUT", description: "อัปเดตใบรับรอง", status: "Inactive", active: false },
]);

let nextId = 4;

const headers = [
  { title: "API Name", key: "name", sortable: true },
  { title: "Endpoint", key: "endpoint" },
  { title: "Method", key: "method", sortable: true },
  { title: "Description", key: "description" },
  { title: "สถานะ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

function methodColor(m) {
  return m === "GET" ? "success" : m === "POST" ? "info" : m === "PUT" ? "warning" : "error";
}

// Form
const formDialog = ref(false);
const editingItem = ref(null);
const form = reactive({ name: "", endpoint: "", method: "GET", description: "", isActive: true });

function openAdd() {
  editingItem.value = null;
  form.name = ""; form.endpoint = ""; form.method = "GET"; form.description = ""; form.isActive = true;
  formDialog.value = true;
}
function openEdit(item) {
  editingItem.value = item;
  form.name = item.name; form.endpoint = item.endpoint; form.method = item.method;
  form.description = item.description; form.isActive = item.active;
  formDialog.value = true;
}
function saveForm() {
  const status = form.isActive ? "Active" : "Inactive";
  if (editingItem.value) {
    const idx = items.value.findIndex(i => i.id === editingItem.value.id);
    if (idx !== -1) items.value[idx] = { ...editingItem.value, name: form.name, endpoint: form.endpoint, method: form.method, description: form.description, status, active: form.isActive };
  } else {
    items.value.push({ id: nextId++, name: form.name, endpoint: form.endpoint, method: form.method, description: form.description, status, active: form.isActive });
  }
  formDialog.value = false;
}

function closeFormDialog() {
  formDialog.value = false;
}

// Delete
const deleteDialog = ref(false);
const deletingItem = ref(null);
function closeDeleteDialog() {
  deleteDialog.value = false;
}
function openDelete(item) { deletingItem.value = item; deleteDialog.value = true; }
function confirmDelete() { items.value = items.value.filter(i => i.id !== deletingItem.value?.id); deleteDialog.value = false; }
</script>

<style scoped>
.delete-ring { width: 60px; height: 60px; border-radius: 50%; background: rgba(var(--v-theme-error), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
