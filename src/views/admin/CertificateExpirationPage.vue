<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">Certificate Expiration</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ติดตามสถานะข้อมูลใบรับรอง
        </p>
      </div>
      <v-btn color="admin" rounded="lg" prepend-icon="fas fa-plus" @click="openAdd">
        เพิ่ม Certificate
      </v-btn>
    </div>

    <!-- Alert: expiring soon -->
    <v-alert
      v-if="expiringSoon.length"
      color="warning"
      variant="tonal"
      rounded="xl"
      class="mb-5"
      prepend-icon="fas fa-triangle-exclamation"
    >
      มี <strong>{{ expiringSoon.length }}</strong> Certificate ที่จะหมดอายุภายใน 30 วัน
    </v-alert>

    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="certificates" rounded="xl" hover>
        <template #item.status="{ item }">
          <v-chip
            :color="certStatusColor(item.status)"
            size="small"
            variant="tonal"
            :prepend-icon="certStatusIcon(item.status)"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.daysLeft="{ item }">
          <span
            class="text-body-2 font-weight-medium"
            :class="
              item.daysLeft < 0
                ? 'text-error'
                : item.daysLeft <= 30
                  ? 'text-warning'
                  : 'text-success'
            "
          >
            {{ item.daysLeft < 0 ? "หมดอายุแล้ว" : item.daysLeft + " วัน" }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              size="x-small"
              color="admin"
              variant="tonal"
              rounded="lg"
              prepend-icon="fas fa-rotate"
              @click="openRenew(item)"
              >Renew</v-btn
            >
            <v-btn
              size="x-small"
              color="warning"
              variant="tonal"
              rounded="lg"
              icon="fas fa-pen"
              @click="openEdit(item)"
            />
            <v-btn
              size="x-small"
              color="error"
              variant="tonal"
              rounded="lg"
              icon="fas fa-ban"
              @click="openCancel(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon :icon="editingItem ? 'fas fa-pen' : 'fas fa-plus'" color="admin" size="18" />
          {{ editingItem ? "แก้ไข Certificate" : "เพิ่ม Certificate" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label">Certificate Name <span class="req">*</span></div>
              <v-text-field
                v-model="form.name"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อ Certificate"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">Domain <span class="req">*</span></div>
              <v-text-field
                v-model="form.domain"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="example.doa.go.th"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">Expiration Date <span class="req">*</span></div>
              <v-text-field
                v-model="form.expiry"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="DD/MM/YYYY"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">สถานะ</div>
              <v-autocomplete
                v-model="form.status"
                :items="['Valid', 'Expiring Soon', 'Expired']"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="formDialog = false">ยกเลิก</v-btn>
          <v-btn color="admin" rounded="lg" @click="saveForm">
            {{ editingItem ? "บันทึก" : "เพิ่ม" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Renew Dialog -->
    <v-dialog v-model="renewDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="renew-ring mx-auto mb-4">
            <v-icon icon="fas fa-rotate" color="admin" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Renew Certificate</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการต่ออายุ <strong>{{ renewingItem?.name }}</strong> ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="renewDialog = false">ยกเลิก</v-btn>
          <v-btn color="admin" rounded="lg" block @click="confirmRenew">Renew</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cancel Dialog -->
    <v-dialog v-model="cancelDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="cancel-ring mx-auto mb-4">
            <v-icon icon="fas fa-ban" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยกเลิก Certificate</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการยกเลิก <strong>{{ cancellingItem?.name }}</strong> ใช่หรือไม่?<br />
            <span class="text-caption">Certificate จะถูกตั้งสถานะเป็น Expired</span>
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="cancelDialog = false">ปิด</v-btn>
          <v-btn color="error" rounded="lg" block @click="confirmCancel">ยกเลิก Certificate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" rounded="lg" location="bottom end" :timeout="2500">
      <v-icon :icon="snackbarColor === 'success' ? 'fas fa-circle-check' : 'fas fa-circle-info'" class="mr-2" />
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const certificates = ref([
  { id: 1, name: "SSL Certificate", domain: "doa.go.th", expiry: "30/12/2026", status: "Valid", daysLeft: 289 },
  { id: 2, name: "API Certificate", domain: "api.doa.go.th", expiry: "15/11/2026", status: "Valid", daysLeft: 244 },
  { id: 3, name: "Auth Certificate", domain: "auth.doa.go.th", expiry: "01/04/2026", status: "Expiring Soon", daysLeft: 16 },
]);

let nextId = 4;

const headers = [
  { title: "Certificate Name", key: "name", sortable: true },
  { title: "Domain", key: "domain" },
  { title: "Expiration Date", key: "expiry", sortable: true },
  { title: "เหลือ", key: "daysLeft", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const expiringSoon = computed(() =>
  certificates.value.filter((c) => c.daysLeft <= 30 && c.daysLeft >= 0),
);

function certStatusColor(s) {
  return s === "Valid" ? "success" : s === "Expiring Soon" ? "warning" : "error";
}
function certStatusIcon(s) {
  return s === "Valid" ? "fas fa-circle-check" : s === "Expiring Soon" ? "fas fa-clock" : "fas fa-circle-xmark";
}

// Add / Edit
const formDialog = ref(false);
const editingItem = ref(null);
const form = reactive({ name: "", domain: "", expiry: "", status: "Valid" });

function openAdd() {
  editingItem.value = null;
  Object.assign(form, { name: "", domain: "", expiry: "", status: "Valid" });
  formDialog.value = true;
}
function openEdit(item) {
  editingItem.value = item;
  Object.assign(form, { name: item.name, domain: item.domain, expiry: item.expiry, status: item.status });
  formDialog.value = true;
}
function saveForm() {
  if (editingItem.value) {
    const idx = certificates.value.findIndex((c) => c.id === editingItem.value.id);
    if (idx !== -1) Object.assign(certificates.value[idx], { name: form.name, domain: form.domain, expiry: form.expiry, status: form.status });
    showSnackbar("success", "แก้ไข Certificate เรียบร้อยแล้ว");
  } else {
    certificates.value.push({ id: nextId++, name: form.name, domain: form.domain, expiry: form.expiry, status: form.status, daysLeft: 365 });
    showSnackbar("success", "เพิ่ม Certificate เรียบร้อยแล้ว");
  }
  formDialog.value = false;
}

// Renew
const renewDialog = ref(false);
const renewingItem = ref(null);
function openRenew(item) { renewingItem.value = item; renewDialog.value = true; }
function confirmRenew() {
  const idx = certificates.value.findIndex((c) => c.id === renewingItem.value.id);
  if (idx !== -1) Object.assign(certificates.value[idx], { status: "Valid", daysLeft: 365, expiry: "09/04/2027" });
  renewDialog.value = false;
  showSnackbar("success", `Renew ${renewingItem.value.name} เรียบร้อยแล้ว`);
}

// Cancel
const cancelDialog = ref(false);
const cancellingItem = ref(null);
function openCancel(item) { cancellingItem.value = item; cancelDialog.value = true; }
function confirmCancel() {
  const idx = certificates.value.findIndex((c) => c.id === cancellingItem.value.id);
  if (idx !== -1) Object.assign(certificates.value[idx], { status: "Expired", daysLeft: -1 });
  cancelDialog.value = false;
  showSnackbar("error", `ยกเลิก ${cancellingItem.value.name} เรียบร้อยแล้ว`);
}

// Snackbar
const snackbar = ref(false);
const snackbarColor = ref("success");
const snackbarText = ref("");
function showSnackbar(color, text) {
  snackbarColor.value = color;
  snackbarText.value = text;
  snackbar.value = true;
}
</script>

<style scoped>
.renew-ring,
.cancel-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.renew-ring { background: rgba(var(--v-theme-admin), 0.1); }
.cancel-ring { background: rgba(var(--v-theme-error), 0.1); }
.field-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.req { color: rgb(var(--v-theme-error)); }
</style>
