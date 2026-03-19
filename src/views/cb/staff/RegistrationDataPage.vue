<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="page-title mb-1">ข้อมูลทะเบียน CB</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">รายการใบรับรองหน่วยรับรองโรงงานผลิตสินค้าพืช</p>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="cb-staff" class="mb-5">
      <v-tab value="all">
        ใบรับรองทั้งหมด
        <v-chip size="x-small" color="cb-staff" variant="tonal" class="ml-2">{{ allItems.length }}</v-chip>
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
      <v-data-table
        :headers="headers"
        :items="currentItems"
        rounded="xl"
        hover
      >
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'active' ? 'success' : item.status === 'expiring' ? 'warning' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ item.status === "active" ? "Active" : item.status === "expiring" ? "ใกล้หมดอายุ" : "หมดอายุ" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="cb-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="openDetail(item)"
          >
            ดู
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="580">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between text-body-1 font-weight-bold">
          <span>
            <v-icon icon="fas fa-certificate" color="cb-staff" class="mr-2" size="18" />
            รายละเอียดใบรับรอง
          </span>
          <v-chip
            v-if="selected"
            :color="selected.status === 'active' ? 'success' : selected.status === 'expiring' ? 'warning' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ selected.status === "active" ? "Active" : selected.status === "expiring" ? "ใกล้หมดอายุ" : "หมดอายุ" }}
          </v-chip>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5" v-if="selected">
          <v-row dense>
            <v-col cols="6"><div class="info-label">Running No.</div><div class="info-value">{{ selected.runNo }}</div></v-col>
            <v-col cols="6"><div class="info-label">ประเภท</div><div class="info-value">{{ selected.certType }}</div></v-col>
            <v-col cols="12"><div class="info-label">ชื่อหน่วยรับรอง</div><div class="info-value">{{ selected.cbName }}</div></v-col>
            <v-col cols="6"><div class="info-label">วันที่ออกใบรับรอง</div><div class="info-value">{{ selected.issueDate }}</div></v-col>
            <v-col cols="6"><div class="info-label">วันหมดอายุ</div><div class="info-value">{{ selected.expireDate }}</div></v-col>
            <v-col cols="12" v-if="selected.countries?.length">
              <div class="info-label">ประเทศ</div>
              <div class="d-flex flex-wrap ga-1 mt-1">
                <v-chip v-for="c in selected.countries" :key="c" size="x-small" color="cb-staff" variant="tonal">{{ c }}</v-chip>
              </div>
            </v-col>
            <v-col cols="12" v-if="selected.cropType">
              <div class="info-label">พืช</div>
              <div class="info-value">{{ selected.cropType }}</div>
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

interface CertRecord {
  id: string;
  runNo: string;
  cbName: string;
  certType: string;
  issueDate: string;
  expireDate: string;
  status: "active" | "expiring" | "expired";
  countries?: string[];
  cropType?: string;
}

const allItems: CertRecord[] = [
  { id: "c1", runNo: "001", cbName: "บ.ไทยเซอร์ติฟาย จก.",   certType: "Certification Body", issueDate: "01/01/2566", expireDate: "01/01/2569", status: "active",   countries: ["ไทย", "จีน"], cropType: "ทุเรียน" },
  { id: "c2", runNo: "002", cbName: "บ.สยามแล็บ จก.",         certType: "Certification Body", issueDate: "15/03/2566", expireDate: "15/03/2569", status: "active",   countries: ["ญี่ปุ่น"], cropType: "มังคุด" },
  { id: "c3", runNo: "003", cbName: "บ.กรีนเซิร์ต จก.",      certType: "Certification Body", issueDate: "01/06/2565", expireDate: "01/06/2568", status: "expiring", countries: ["เกาหลีใต้"], cropType: "ลำไย" },
  { id: "c4", runNo: "004", cbName: "บ.อีสานเซอร์ต จก.",     certType: "Certification Body", issueDate: "10/01/2563", expireDate: "10/01/2566", status: "expired",  countries: ["ไทย"], cropType: "ลิ้นจี่" },
  { id: "c5", runNo: "005", cbName: "บ.เหนือเซอร์ติฟาย จก.", certType: "Certification Body", issueDate: "20/07/2562", expireDate: "20/07/2565", status: "expired",  countries: ["ไทย"], cropType: "มะม่วง" },
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
  { title: "ชื่อหน่วยรับรอง", key: "cbName", sortable: true },
  { title: "ประเภท", key: "certType", sortable: false },
  { title: "วันที่ออกใบรับรอง", key: "issueDate", sortable: true },
  { title: "วันหมดอายุ", key: "expireDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const selected = ref<CertRecord | null>(null);
function openDetail(item: CertRecord) { selected.value = item; detailDialog.value = true; }
</script>

<style scoped>
.info-label { font-size: 11px; color: rgba(var(--v-theme-on-surface), 0.5); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
.info-value { font-size: 14px; font-weight: 500; }
</style>
