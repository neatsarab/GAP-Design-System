<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ใบรับรองสินค้าแปรรูปด้านพืช</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          รายการใบรับรองสุขอนามัย (Health Certificate)
          สินค้าแปรรูปด้านพืชทั้งหมด
        </p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="hcex-user" prepend-icon="fas fa-download"
          >ส่งออก Excel</v-btn
        >
        <v-btn
          color="hcex-user"
          prepend-icon="fas fa-file-pen"
          @click="goToNewApplication"
          >ขอใบรับรองใหม่</v-btn
        >
      </div>
    </div>

    <!-- Stats -->
    <v-row class="mb-5">
      <v-col v-for="s in certStats" :key="s.label" cols="6" sm="3">
        <v-card>
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

    <!-- Filter & Search -->
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
              placeholder="ค้นหาเลขใบรับรอง / ผู้รับสินค้า"
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
      <v-chip value="all" color="hcex-user" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-list" size="12" /> ทั้งหมด
        <v-badge
          :content="certs.length"
          inline
          color="hcex-user"
          class="ml-1"
        />
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
          :content="certs.filter((c) => c.certStatus === 'active').length"
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
          :content="certs.filter((c) => c.certStatus === 'expiring').length"
          inline
          color="warning"
          class="ml-1"
        />
      </v-chip>
      <v-chip value="expired" color="error" variant="tonal" filter size="small">
        <v-icon start icon="fas fa-circle-xmark" size="12" /> หมดอายุ
        <v-badge
          :content="certs.filter((c) => c.certStatus === 'expired').length"
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
        :items="filteredCerts"
        :search="search"
        hover
      >
        <template #item.certNo="{ item }">
          <span class="text-body-2 font-weight-bold text-hcex-user">{{
            item.certNo
          }}</span>
        </template>

        <template #item.certType="{ item }">
          <v-chip size="x-small" color="hcex-user" variant="tonal">{{
            item.certType
          }}</v-chip>
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

        <template #item.expiry="{ item }">
          <span
            :class="
              item.certStatus === 'expiring'
                ? 'text-hcex-user font-weight-medium'
                : item.certStatus === 'expired'
                  ? 'text-error'
                  : ''
            "
          >
            {{ item.expiry }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn
              size="small"
              variant="text"
              color="hcex-user"
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

function goToNewApplication() {
  router.push({ name: "HCEXUserApplicationType" });
}

const filterTab = ref("all");
const search = ref("");

const certStats = [
  {
    label: "ใบรับรองมีผล",
    icon: "fas fa-circle-check",
    color: "success",
    value: 3,
  },
  { label: "ใกล้หมดอายุ", icon: "fas fa-clock", color: "primary", value: 1 },
  {
    label: "หมดอายุแล้ว",
    icon: "fas fa-circle-xmark",
    color: "error",
    value: 1,
  },
  { label: "ทั้งหมด", icon: "fas fa-industry", color: "primary", value: 5 },
];

const certs = [
  {
    certNo: "THHCEX-2569-00008",
    requestNo: "HCEX-2569-00008",
    certType: "กมพ.1",
    consignee: "Seoul Food Distribution",
    destination: "เกาหลีใต้",
    issuedAt: "15 ม.ค. 68",
    expiry: "15 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHCEX-2569-00005",
    requestNo: "HCEX-2569-00005",
    certType: "กมพ.1-3",
    consignee: "SG Fresh Market Pte.",
    destination: "สิงคโปร์",
    issuedAt: "5 ม.ค. 68",
    expiry: "5 ม.ค. 69",
    certStatus: "active",
  },
  {
    certNo: "THHCEX-2569-00003",
    requestNo: "HCEX-2569-00003",
    certType: "กมพ.1-2",
    consignee: "HK Agri Import Ltd.",
    destination: "ฮ่องกง",
    issuedAt: "28 ธ.ค. 67",
    expiry: "28 ธ.ค. 68",
    certStatus: "expiring",
  },
  {
    certNo: "THHCEX-2569-00045",
    requestNo: "HCEX-2569-00045",
    certType: "กมพ.1",
    consignee: "Japan Foods Co., Ltd.",
    destination: "ญี่ปุ่น",
    issuedAt: "10 ม.ค. 67",
    expiry: "10 ม.ค. 68",
    certStatus: "expired",
  },
  {
    certNo: "THHCEX-2569-00002",
    requestNo: "HCEX-2569-00002",
    certType: "กมพ.1-1",
    consignee: "Beijing Trading Corp.",
    destination: "จีน",
    issuedAt: "20 ธ.ค. 67",
    expiry: "20 ธ.ค. 68",
    certStatus: "active",
  },
];

const filteredCerts = computed(() => {
  if (filterTab.value === "all") return certs;
  return certs.filter((c) => c.certStatus === filterTab.value);
});

const headers = [
  { title: "เลขใบรับรอง", key: "certNo", width: 190 },
  { title: "ประเภทคำขอ", key: "certType", width: 120 },
  { title: "ผู้รับสินค้า", key: "consignee", width: 200 },
  { title: "ประเทศปลายทาง", key: "destination", width: 130 },
  { title: "วันที่ออก", key: "issuedAt", width: 120 },
  { title: "วันหมดอายุ", key: "expiry", width: 120 },
  { title: "สถานะ", key: "certStatus", width: 150 },
  { title: "", key: "actions", width: 150, sortable: false },
];

function statusColor(s) {
  return (
    { active: "success", expiring: "primary", expired: "error" }[s] ?? "grey"
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
