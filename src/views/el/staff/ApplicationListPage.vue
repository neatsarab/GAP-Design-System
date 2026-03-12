<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">รายการคำขอ EL</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">
        คำขอขึ้นทะเบียนโรงคัดบรรจุทั้งหมดในระบบ
      </p>
    </div>

    <!-- Filter Card -->
    <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
      <v-card-text class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="4">
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
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="typeFilter"
              :items="typeOptions"
              item-title="label"
              item-value="value"
              placeholder="ชนิดพืชทั้งหมด"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
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
          <v-col cols="12" sm="6" md="2">
            <v-btn
              variant="tonal"
              color="grey"
              rounded="lg"
              block
              @click="clearFilters"
            >
              ล้างตัวกรอง
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chip Tabs -->
    <v-chip-group v-model="activeTab" mandatory color="el-staff" class="mb-4">
      <v-chip value="all" variant="tonal" rounded="lg">ทั้งหมด</v-chip>
      <v-chip value="submitted" variant="tonal" rounded="lg">
        รอตรวจสอบ
        <v-badge color="warning" content="7" inline class="ml-1" />
      </v-chip>
      <v-chip value="inspection_scheduled" variant="tonal" rounded="lg">
        นัดตรวจแล้ว
        <v-badge color="el-staff" content="3" inline class="ml-1" />
      </v-chip>
      <v-chip value="pending_committee" variant="tonal" rounded="lg">
        รอ กตม.
        <v-badge color="secondary" content="2" inline class="ml-1" />
      </v-chip>
      <v-chip value="approved" variant="tonal" rounded="lg">อนุมัติ</v-chip>
      <v-chip value="rejected" variant="tonal" rounded="lg">ไม่ผ่าน</v-chip>
    </v-chip-group>

    <!-- Table -->
    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        rounded="xl"
        hover
        @click:row="(_, { item }) => router.push(`/el/staff/applications/${item.id}`)"
      >
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="el-staff"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-eye"
            @click.stop="router.push(`/el/staff/applications/${item.id}`)"
          >
            ดูรายละเอียด
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
const typeFilter = ref<string | null>(null);
const statusFilter = ref<string | null>(null);
const activeTab = ref("all");

const typeOptions = [
  { label: "ทุเรียน", value: "ทุเรียน" },
  { label: "มังคุด", value: "มังคุด" },
  { label: "ลำไย", value: "ลำไย" },
  { label: "ลิ้นจี่", value: "ลิ้นจี่" },
];

const statusOptions = [
  { label: "ยื่นแล้ว", value: "submitted" },
  { label: "อยู่ระหว่างตรวจสอบ", value: "under_review" },
  { label: "นัดตรวจแล้ว", value: "inspection_scheduled" },
  { label: "รอ กตม.", value: "pending_committee" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ไม่ผ่าน", value: "rejected" },
  { label: "รอแก้ไข", value: "revision_required" },
];

const headers = [
  { title: "เลขคำขอ", key: "requestNo", sortable: true },
  { title: "โรงคัดบรรจุ", key: "establishmentName", sortable: true },
  { title: "ชนิดพืช", key: "cropType", sortable: true },
  { title: "จังหวัด", key: "province", sortable: true },
  { title: "วันที่ยื่น", key: "submittedDate", sortable: true },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const allItems = [
  { id: "EL-2568-00010", requestNo: "EL-2568-00010", establishmentName: "บ.สยามฟาร์มเอ็กซ์พอร์ต จก.", cropType: "ทุเรียน", province: "จันทบุรี", submittedDate: "11 มี.ค. 2568", status: "submitted" },
  { id: "EL-2568-00009", requestNo: "EL-2568-00009", establishmentName: "บ.อีสานโปรดิ๊วซ จก.", cropType: "มังคุด", province: "ระยอง", submittedDate: "10 มี.ค. 2568", status: "submitted" },
  { id: "EL-2568-00008", requestNo: "EL-2568-00008", establishmentName: "บ.เชียงใหม่ฟรุ๊ต จก.", cropType: "ลำไย", province: "เชียงใหม่", submittedDate: "08 มี.ค. 2568", status: "inspection_scheduled" },
  { id: "EL-2568-00007", requestNo: "EL-2568-00007", establishmentName: "บ.ตะวันออกการเกษตร จก.", cropType: "ทุเรียน", province: "ชลบุรี", submittedDate: "07 มี.ค. 2568", status: "submitted" },
  { id: "EL-2568-00006", requestNo: "EL-2568-00006", establishmentName: "บ.นครปฐมฟาร์ม จก.", cropType: "ลิ้นจี่", province: "นครปฐม", submittedDate: "05 มี.ค. 2568", status: "under_review" },
  { id: "EL-2568-00005", requestNo: "EL-2568-00005", establishmentName: "บ.สยามฟาร์ม จก.", cropType: "ทุเรียน", province: "จันทบุรี", submittedDate: "01 มี.ค. 2568", status: "pending_committee" },
  { id: "EL-2568-00004", requestNo: "EL-2568-00004", establishmentName: "บ.ภาคใต้โปรดิ๊วซ จก.", cropType: "มังคุด", province: "สุราษฎร์ธานี", submittedDate: "25 ก.พ. 2568", status: "pending_committee" },
  { id: "EL-2568-00003", requestNo: "EL-2568-00003", establishmentName: "บ.เชียงรายฟรุ๊ต จก.", cropType: "ลำไย", province: "เชียงราย", submittedDate: "20 ก.พ. 2568", status: "inspection_scheduled" },
  { id: "EL-2568-00002", requestNo: "EL-2568-00002", establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.", cropType: "ทุเรียน", province: "กรุงเทพฯ", submittedDate: "10 ก.พ. 2568", status: "under_review" },
  { id: "EL-2568-00001", requestNo: "EL-2568-00001", establishmentName: "บ.กรีนฟาร์ม จก.", cropType: "ลิ้นจี่", province: "ลำพูน", submittedDate: "05 ก.พ. 2568", status: "approved" },
];

const filteredItems = computed(() => {
  let items = allItems;
  if (activeTab.value !== "all") {
    items = items.filter((i) => i.status === activeTab.value);
  }
  if (typeFilter.value) {
    items = items.filter((i) => i.cropType === typeFilter.value);
  }
  if (statusFilter.value) {
    items = items.filter((i) => i.status === statusFilter.value);
  }
  return items;
});

function clearFilters() {
  search.value = "";
  typeFilter.value = null;
  statusFilter.value = null;
  activeTab.value = "all";
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    draft: "grey",
    submitted: "primary",
    under_review: "info",
    inspection_scheduled: "secondary",
    pending_committee: "warning",
    approved: "success",
    rejected: "error",
    revision_required: "warning",
  };
  return map[status] ?? "grey";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "แบบร่าง",
    submitted: "รอตรวจสอบ",
    under_review: "อยู่ระหว่างตรวจสอบ",
    inspection_scheduled: "นัดตรวจแล้ว",
    pending_committee: "รอ กตม.",
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
