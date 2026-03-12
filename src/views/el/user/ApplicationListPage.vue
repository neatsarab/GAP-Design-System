<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">รายการคำขอ EL</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          คำขอขึ้นทะเบียนโรงคัดบรรจุทั้งหมดของคุณ
        </p>
      </div>
      <v-btn
        color="el-user"
        prepend-icon="fas fa-file-pen"
        rounded="lg"
        @click="router.push('/el/user/applications/new')"
      >
        ยื่นคำขอใหม่
      </v-btn>
    </div>

    <!-- Filter Card -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="5">
            <v-text-field
              v-model="search"
              placeholder="ค้นหาเลขคำขอ / ชื่อโรงคัดบรรจุ"
              prepend-inner-icon="fas fa-magnifying-glass"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
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

    <!-- Chip-group tabs -->
    <v-chip-group v-model="activeTab" mandatory color="el-user" class="mb-4">
      <v-chip value="all" variant="tonal" rounded="lg">ทั้งหมด</v-chip>
      <v-chip value="in_progress" variant="tonal" rounded="lg">
        อยู่ระหว่างดำเนินการ
        <v-badge color="el-user" content="1" inline class="ml-1" />
      </v-chip>
      <v-chip value="approved" variant="tonal" rounded="lg">อนุมัติแล้ว</v-chip>
      <v-chip value="revision" variant="tonal" rounded="lg">ต้องแก้ไข</v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        rounded="xl"
        hover
        @click:row="(_, { item }) => router.push(`/el/user/applications/${item.id}`)"
      >
        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            size="small"
            variant="tonal"
          >
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="el-user"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/el/user/applications/${item.id}`)"
          >
            ติดตามสถานะ
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const search = ref("");
const statusFilter = ref<string | null>(null);
const activeTab = ref("all");

const statusOptions = [
  { label: "แบบร่าง", value: "draft" },
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "อยู่ระหว่างตรวจสอบ", value: "under_review" },
  { label: "นัดตรวจแล้ว", value: "inspection_scheduled" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ไม่ผ่าน", value: "rejected" },
  { label: "รอแก้ไข", value: "revision_required" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "ชื่อโรงคัดบรรจุ", key: "establishmentName", sortable: true },
  { title: "ชนิดพืช", key: "cropType", sortable: true },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  {
    id: "EL-2568-00002",
    requestNo: "EL-2568-00002",
    establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.",
    cropType: "ทุเรียน",
    submittedDate: "10 ก.พ. 2568",
    status: "under_review",
  },
  {
    id: "EL-2568-00001",
    requestNo: "EL-2568-00001",
    establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.",
    cropType: "มังคุด",
    submittedDate: "15 ม.ค. 2568",
    status: "approved",
  },
  {
    id: "EL-2567-00015",
    requestNo: "EL-2567-00015",
    establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.",
    cropType: "ลำไย",
    submittedDate: "20 ธ.ค. 2567",
    status: "revision_required",
  },
  {
    id: "EL-2567-00008",
    requestNo: "EL-2567-00008",
    establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.",
    cropType: "ลิ้นจี่",
    submittedDate: "05 ส.ค. 2567",
    status: "approved",
  },
  {
    id: "EL-2567-00003",
    requestNo: "EL-2567-00003",
    establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.",
    cropType: "ทุเรียน",
    submittedDate: "10 เม.ย. 2567",
    status: "draft",
  },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (activeTab.value === "in_progress") {
    items = items.filter((i) => ["submitted", "under_review", "inspection_scheduled"].includes(i.status));
  } else if (activeTab.value === "approved") {
    items = items.filter((i) => i.status === "approved");
  } else if (activeTab.value === "revision") {
    items = items.filter((i) => i.status === "revision_required");
  }
  if (statusFilter.value) {
    items = items.filter((i) => i.status === statusFilter.value);
  }
  return items;
});

function statusColor(status: string): string {
  const map: Record<string, string> = {
    draft: "grey",
    submitted: "primary",
    under_review: "info",
    inspection_scheduled: "secondary",
    approved: "success",
    rejected: "error",
    revision_required: "warning",
  };
  return map[status] ?? "grey";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "แบบร่าง",
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    inspection_scheduled: "นัดตรวจแล้ว",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่ผ่าน",
    revision_required: "รอแก้ไข",
  };
  return map[status] ?? status;
}
</script>

<style scoped>
.filter-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.data-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
