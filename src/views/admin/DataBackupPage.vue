<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">Data Backup</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">ระบบสำรองข้อมูลของแต่ละระบบ</p>
      </div>
      <v-btn color="admin" rounded="lg" prepend-icon="fas fa-plus" @click="openBackupDialog">สำรองข้อมูลใหม่</v-btn>
    </div>

    <!-- Backup Type Buttons -->
    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
      <v-card-text class="pa-5">
        <div class="text-body-2 font-weight-bold mb-3">ประเภทการสำรองข้อมูล</div>
        <v-row dense>
          <v-col v-for="bt in backupTypes" :key="bt.label" cols="12" sm="4">
            <v-card rounded="lg" class="backup-type-card pa-4 text-center" @click="setSelectedBackupType(bt.value)">
              <div class="backup-type-icon mx-auto mb-2" :class="selectedBackupType === bt.value ? 'bg-admin' : ''" :style="selectedBackupType !== bt.value ? 'background: rgba(var(--v-border-color), 0.08)' : ''">
                <v-icon :icon="bt.icon" :color="selectedBackupType === bt.value ? 'white' : 'medium-emphasis'" size="20" />
              </div>
              <div class="text-body-2 font-weight-medium">{{ bt.label }}</div>
              <div class="text-caption text-medium-emphasis">{{ bt.desc }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Backup History Table -->
    <v-card rounded="xl" elevation="0" class="section-card">
      <v-card-title class="pa-5 pb-3 section-title">
        <v-icon icon="fas fa-history" color="admin" class="mr-2" size="16" />ประวัติการสำรองข้อมูล
      </v-card-title>
      <v-divider />
      <v-data-table :headers="headers" :items="backups" rounded="xl" hover>
        <template #item.status="{ item }">
          <v-chip :color="item.status === 'Completed' ? 'success' : item.status === 'Failed' ? 'error' : 'warning'" size="small" variant="tonal">
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.actions>
          <v-btn size="x-small" color="admin" variant="tonal" rounded="lg" prepend-icon="fas fa-download">Download</v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Backup Dialog -->
    <v-dialog v-model="backupDialog" max-width="460" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon icon="fas fa-database" color="admin" size="18" />สำรองข้อมูลใหม่
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label"><div>ระบบที่ต้องการสำรอง <span class="req">*</span></div><div class="field-label-en">System to Backup</div></div>
              <v-autocomplete v-model="backupForm.system" :items="['DOA System', 'GAP System', 'HCEX System', 'ทุกระบบ']" variant="outlined" density="compact" rounded="lg" hide-details />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3"><div>รูปแบบการสำรอง <span class="req">*</span></div><div class="field-label-en">Backup Format</div></div>
              <v-radio-group v-model="backupForm.type" color="admin" inline hide-details>
                <v-radio value="full" label="Full Backup" />
                <v-radio value="incremental" label="Incremental Backup" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="closeBackupDialog">ยกเลิก</v-btn>
          <v-btn color="admin" rounded="lg" prepend-icon="fas fa-database" @click="startBackup">เริ่มสำรอง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const backupDialog = ref(false);
function openBackupDialog() {
  backupDialog.value = true;
}
function closeBackupDialog() {
  backupDialog.value = false;
}
function setSelectedBackupType(value) {
  selectedBackupType.value = value;
}
const selectedBackupType = ref("database");

const backupTypes = [
  { label: "Backup Database", value: "database", icon: "fas fa-database", desc: "สำรองข้อมูลฐานข้อมูล" },
  { label: "Backup Files", value: "files", icon: "fas fa-folder", desc: "สำรองไฟล์และเอกสาร" },
  { label: "Backup Configuration", value: "config", icon: "fas fa-gear", desc: "สำรองการตั้งค่าระบบ" },
];

const backupForm = reactive({ system: "DOA System", type: "full" });

const backups = ref([
  { name: "Backup_2026_03_16", system: "DOA System", date: "16/03/2569", size: "2.1 GB", status: "Completed" },
  { name: "Backup_2026_03_15", system: "GAP System", date: "15/03/2569", size: "1.8 GB", status: "Completed" },
  { name: "Backup_2026_03_14", system: "ทุกระบบ", date: "14/03/2569", size: "5.2 GB", status: "Completed" },
  { name: "Backup_2026_03_13", system: "HCEX System", date: "13/03/2569", size: "0.9 GB", status: "Failed" },
]);

const headers = [
  { title: "Backup Name", key: "name", sortable: true },
  { title: "System", key: "system", sortable: true },
  { title: "Date", key: "date", sortable: true },
  { title: "Size", key: "size" },
  { title: "Status", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

function startBackup() {
  const d = new Date();
  const name = `Backup_${d.getFullYear()}_${String(d.getMonth()+1).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`;
  backups.value.unshift({ name, system: backupForm.system, date: d.toLocaleDateString("th-TH"), size: "—", status: "Completed" });
  backupDialog.value = false;
}
</script>

<style scoped>
.backup-type-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); cursor: pointer; transition: box-shadow 0.2s; }
.backup-type-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
.backup-type-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
</style>
