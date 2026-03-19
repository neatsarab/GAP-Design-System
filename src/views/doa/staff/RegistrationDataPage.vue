<template>
  <div>
    <div class="mb-6">
      <h1 class="page-title mb-1">ข้อมูลทะเบียน DOA</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">รายการทะเบียนโรงงานผลิตสินค้าพืชที่ได้รับการขึ้นทะเบียนแล้ว</p>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="doa-staff" class="mb-5">
      <v-tab value="all">
        ทะเบียนทั้งหมด
        <v-chip size="x-small" color="doa-staff" variant="tonal" class="ml-2">{{ allItems.length }}</v-chip>
      </v-tab>
      <v-tab value="active">
        ใบรับรองที่มีอายุ
        <v-chip size="x-small" color="success" variant="tonal" class="ml-2">{{ activeItems.length }}</v-chip>
      </v-tab>
      <v-tab value="expired">
        ใบรับรองที่หมดอายุ
        <v-chip size="x-small" color="error" variant="tonal" class="ml-2">{{ expiredItems.length }}</v-chip>
      </v-tab>
    </v-tabs>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table :headers="headers" :items="currentItems" rounded="xl" hover>
        <template #item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'success' : item.status === 'expiring' ? 'warning' : 'error'" size="small" variant="tonal">
            {{ item.status === 'active' ? 'Active' : item.status === 'expiring' ? 'ใกล้หมดอายุ' : 'หมดอายุ' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn size="small" color="doa-staff" variant="tonal" rounded="lg" prepend-icon="fas fa-eye" @click.stop="openDetail(item)">ดู</v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="600">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between text-body-1 font-weight-bold">
          <span><v-icon icon="fas fa-industry" color="doa-staff" class="mr-2" size="18" />รายละเอียดทะเบียน</span>
          <v-chip v-if="selected" :color="selected.status === 'active' ? 'success' : selected.status === 'expiring' ? 'warning' : 'error'" size="small" variant="tonal">
            {{ selected.status === 'active' ? 'Active' : selected.status === 'expiring' ? 'ใกล้หมดอายุ' : 'หมดอายุ' }}
          </v-chip>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5" v-if="selected">
          <v-row dense>
            <v-col cols="6"><div class="info-label">Running No.</div><div class="info-value">{{ selected.runNo }}</div></v-col>
            <v-col cols="6"><div class="info-label">ประเภทสถานประกอบการ</div><div class="info-value">{{ selected.factoryType }}</div></v-col>
            <v-col cols="12"><div class="info-label">ชื่อโรงงาน</div><div class="info-value">{{ selected.factoryName }}</div></v-col>
            <v-col cols="12"><div class="info-label">ที่อยู่</div><div class="info-value">{{ selected.address }}</div></v-col>
            <v-col cols="6"><div class="info-label">วันที่ออกใบรับรอง</div><div class="info-value">{{ selected.issueDate }}</div></v-col>
            <v-col cols="6"><div class="info-label">วันหมดอายุ</div><div class="info-value">{{ selected.expireDate }}</div></v-col>
            <v-col cols="12">
              <div class="info-label">ขอบข่ายมาตรฐาน</div>
              <div class="d-flex flex-wrap ga-1 mt-1">
                <v-chip v-for="s in selected.standards" :key="s" size="x-small" color="doa-staff" variant="tonal">{{ s }}</v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-spacer />
          <v-btn variant="tonal" color="grey" rounded="lg" @click="detailDialog = false">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const activeTab = ref("all");
const detailDialog = ref(false);

interface RegItem {
  id: string; runNo: string; factoryName: string; factoryType: string;
  address: string; standards: string[]; issueDate: string; expireDate: string;
  status: "active" | "expiring" | "expired";
}

const allItems: RegItem[] = [
  { id: "r1", runNo: "001", factoryName: "บ.สยามฟู้ด จก.", factoryType: "โรงงานแปรรูป", address: "88/1 ต.บางปะกง อ.บางปะกง จ.ฉะเชิงเทรา", standards: ["มกษ. 9023-2550", "มกษ. 9024-2550"], issueDate: "01/01/2566", expireDate: "01/01/2569", status: "active" },
  { id: "r2", runNo: "002", factoryName: "บ.ไทยโปรเซส จก.", factoryType: "โรงคัดบรรจุ", address: "200 ถ.มิตรภาพ อ.เมือง จ.นครราชสีมา", standards: ["มกษ. 9023-2550"], issueDate: "15/03/2565", expireDate: "15/03/2568", status: "expiring" },
  { id: "r3", runNo: "003", factoryName: "บ.กรีนฟู้ด จก.", factoryType: "โรงงานแปรรูป", address: "55 ม.4 ต.สระแก้ว อ.เมือง จ.สระแก้ว", standards: ["ISO 22000"], issueDate: "10/01/2563", expireDate: "10/01/2566", status: "expired" },
];

const activeItems = computed(() => allItems.filter((i) => i.status === "active" || i.status === "expiring"));
const expiredItems = computed(() => allItems.filter((i) => i.status === "expired"));
const currentItems = computed(() => {
  if (activeTab.value === "active") return activeItems.value;
  if (activeTab.value === "expired") return expiredItems.value;
  return allItems;
});

const headers = [
  { title: "Running No.", key: "runNo", sortable: true },
  { title: "ชื่อโรงงาน", key: "factoryName", sortable: true },
  { title: "ประเภท", key: "factoryType", sortable: false },
  { title: "วันที่ออกใบรับรอง", key: "issueDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const selected = ref<RegItem | null>(null);
function openDetail(item: RegItem) { selected.value = item; detailDialog.value = true; }
</script>

<style scoped>
.info-label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
.info-value { font-size: 14px; font-weight: 500; margin-bottom: 10px; }
</style>
