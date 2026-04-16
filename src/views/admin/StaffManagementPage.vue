<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">User Management</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          กำหนดสิทธิ์การใช้งานระบบให้กับเจ้าหน้าที่
        </p>
      </div>
      <v-btn
        color="admin"
        rounded="lg"
        prepend-icon="fas fa-user-plus"
        @click="openAdd"
      >
        เพิ่มเจ้าหน้าที่
      </v-btn>
    </div>

    <!-- Stats -->
    <div class="d-flex ga-3 flex-wrap mb-5">
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">
          เจ้าหน้าที่ทั้งหมด
        </div>
        <div class="text-h6 font-weight-bold">{{ staffList.length }}</div>
      </v-card>
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">ใช้งานอยู่</div>
        <div class="text-h6 font-weight-bold text-success">
          {{ staffList.filter((s) => s.enabled).length }}
        </div>
      </v-card>
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">ระงับการใช้งาน</div>
        <div class="text-h6 font-weight-bold text-error">
          {{ staffList.filter((s) => !s.enabled).length }}
        </div>
      </v-card>
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">
          ระบบที่มีทั้งหมด
        </div>
        <div class="text-h6 font-weight-bold">{{ systemOptions.length }}</div>
      </v-card>
    </div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="pa-4 mb-4">
      <v-row dense align="end">
        <v-col cols="12" sm="4">
          <div class="filter-label">
            <div>ค้นหา</div>
            <div class="filter-label-en">Search</div>
          </div>
          <v-text-field
            v-model="search"
            placeholder="ชื่อ / รหัส / อีเมล"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            prepend-inner-icon="fas fa-magnifying-glass"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="3">
          <div class="filter-label">
            <div>ตำแหน่ง</div>
            <div class="filter-label-en">Position</div>
          </div>
          <v-autocomplete
            v-model="filterRole"
            :items="['ทั้งหมด', ...roleOptions]"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="3">
          <div class="filter-label">
            <div>ระบบ</div>
            <div class="filter-label-en">System</div>
          </div>
          <v-autocomplete
            v-model="filterSystem"
            :items="[{ title: 'ทั้งหมด', value: 'ทั้งหมด' }, ...systemOptions.map((s) => ({ title: s.label, value: s.code }))]"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <div class="filter-label">
            <div>สถานะ</div>
            <div class="filter-label-en">Status</div>
          </div>
          <v-autocomplete
            v-model="filterStatus"
            :items="['ทั้งหมด', 'ใช้งาน', 'ระงับ']"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Table -->
    <v-card rounded="xl" elevation="0">
      <v-data-table
        :headers="headers"
        :items="filteredStaff"
        :items-per-page="10"
        rounded="xl"
        hover
      >
        <template #item.fullName="{ item }">
          <div class="d-flex align-center ga-2 py-1">
            <v-avatar color="admin" size="34" variant="tonal">
              <v-icon icon="fas fa-user" size="15" color="admin" />
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ item.fullName }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>
        <template #item.role="{ item }">
          <v-chip size="small" color="admin" variant="tonal">{{
            item.role
          }}</v-chip>
        </template>
        <template #item.systems="{ item }">
          <div class="d-flex flex-wrap ga-1 py-1">
            <v-chip
              v-for="sys in item.systems"
              :key="sys"
              size="x-small"
              :color="systemColor(sys)"
              variant="tonal"
              class="font-weight-bold"
            >
              {{ sys }}
            </v-chip>
          </div>
        </template>
        <template #item.enabled="{ item }">
          <v-chip
            :color="item.enabled ? 'success' : 'error'"
            size="small"
            variant="tonal"
            :prepend-icon="item.enabled ? 'fas fa-circle-check' : 'fas fa-ban'"
          >
            {{ item.enabled ? "ใช้งาน" : "ระงับ" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-tooltip text="แก้ไขสิทธิ์" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  variant="tonal"
                  color="warning"
                  rounded="lg"
                  icon="fas fa-pen"
                  @click="openEdit(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip
              :text="item.enabled ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'"
              location="top"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  :color="item.enabled ? 'error' : 'success'"
                  variant="tonal"
                  rounded="lg"
                  :icon="item.enabled ? 'fas fa-ban' : 'fas fa-circle-check'"
                  @click="toggleStaff(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="620" persistent scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon
            :icon="editingItem ? 'fas fa-user-pen' : 'fas fa-user-plus'"
            color="admin"
            size="18"
          />
          {{ editingItem ? "แก้ไขข้อมูลเจ้าหน้าที่" : "เพิ่มเจ้าหน้าที่" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <!-- ข้อมูลส่วนตัว -->
          <div class="section-label mb-3">ข้อมูลส่วนตัว</div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ชื่อ-นามสกุล <span class="req">*</span></div>
                <div class="field-label-en">Full Name</div>
              </div>
              <v-text-field
                v-model="form.fullName"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อ นามสกุล"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>รหัสพนักงาน <span class="req">*</span></div>
                <div class="field-label-en">Employee ID</div>
              </div>
              <v-text-field
                v-model="form.code"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="DOA-XXXXX"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>อีเมล <span class="req">*</span></div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="email@doa.go.th"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>เบอร์โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                v-model="form.phone"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="0xx-xxx-xxxx"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- ตำแหน่งและสิทธิ์ -->
          <div class="section-label mb-3">ตำแหน่งและสิทธิ์การใช้งาน</div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ตำแหน่ง <span class="req">*</span></div>
                <div class="field-label-en">Position / Role</div>
              </div>
              <v-autocomplete
                v-model="form.role"
                :items="roleOptions"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เลือกตำแหน่ง"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>สถานะ</div>
                <div class="field-label-en">Status</div>
              </div>
              <v-switch
                v-model="form.enabled"
                :color="form.enabled ? 'success' : 'error'"
                :label="form.enabled ? 'ใช้งาน' : 'ระงับการใช้งาน'"
                hide-details
                density="compact"
              />
            </v-col>
          </v-row>

          <div class="field-label mt-4 mb-3">
            <div>ระบบที่สามารถใช้งานได้ <span class="req">*</span></div>
            <div class="field-label-en">Accessible Systems</div>
          </div>
          <v-row dense>
            <v-col v-for="sys in systemOptions" :key="sys.code" cols="12" sm="6">
              <v-card
                rounded="lg"
                elevation="0"
                class="pa-3 d-flex align-center ga-2 cursor-pointer system-card"
                :class="{ 'system-card--active': form.systems.includes(sys.code) }"
                :style="
                  form.systems.includes(sys.code)
                    ? `border: 1.5px solid rgb(var(--v-theme-${systemColor(sys.code)})); background: rgba(var(--v-theme-${systemColor(sys.code)}), 0.06)`
                    : 'border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity))'
                "
                @click="toggleSystem(sys.code)"
              >
                <v-checkbox
                  :model-value="form.systems.includes(sys.code)"
                  :color="systemColor(sys.code)"
                  hide-details
                  density="compact"
                  readonly
                />
                <div class="flex-grow-1 text-body-2 font-weight-medium">{{ sys.label }}</div>
              </v-card>
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
            @click="formDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="admin"
            rounded="lg"
            prepend-icon="fas fa-floppy-disk"
            @click="saveForm"
          >
            {{ editingItem ? "บันทึก" : "เพิ่มเจ้าหน้าที่" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Toggle Confirm Dialog -->
    <v-dialog v-model="toggleDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="toggle-ring mx-auto mb-4"
            :style="
              togglingItem?.enabled
                ? 'background: rgba(var(--v-theme-error),0.1)'
                : 'background: rgba(var(--v-theme-success),0.1)'
            "
          >
            <v-icon
              :icon="
                togglingItem?.enabled ? 'fas fa-ban' : 'fas fa-circle-check'
              "
              :color="togglingItem?.enabled ? 'error' : 'success'"
              size="26"
            />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">
            {{ togglingItem?.enabled ? "ระงับการใช้งาน" : "เปิดใช้งาน" }}
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการ{{ togglingItem?.enabled ? "ระงับ" : "เปิด" }}การใช้งานของ
            <strong>{{ togglingItem?.fullName }}</strong> ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="toggleDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            :color="togglingItem?.enabled ? 'error' : 'success'"
            rounded="lg"
            block
            @click="confirmToggle"
          >
            {{ togglingItem?.enabled ? "ระงับ" : "เปิดใช้งาน" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      rounded="lg"
      location="bottom end"
      :timeout="2500"
    >
      <v-icon
        :icon="
          snackbarColor === 'success' ? 'fas fa-circle-check' : 'fas fa-ban'
        "
        class="mr-2"
      />
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const roleOptions = [
  "เจ้าหน้าที่ตรวจสอบ",
  "ผู้อนุมัติ",
  "เจ้าหน้าที่ LAB",
  "เจ้าหน้าที่ลงนาม",
  "ผู้บังคับบัญชา",
  "ผู้ดูแลระบบ",
];

const systemOptions = [
  { code: "GAP", label: "ระบบรับรองมาตรฐาน GAP" },
  { code: "HC", label: "ระบบสุขอนามัยพืช" },
  { code: "HCEX", label: "ระบบใบรับรองสุขอนามัยส่งออก" },
  { code: "ORG", label: "ระบบเกษตรอินทรีย์" },
  { code: "EL", label: "ระบบขึ้นทะเบียน e-Licensing" },
  { code: "CB", label: "ระบบ Certified Body" },
  { code: "EXPORT", label: "ระบบส่งออก" },
  { code: "DOA", label: "ระบบกรมวิชาการเกษตร" },
];

function systemColor(sys) {
  const map = {
    GAP: "green",
    HC: "blue",
    HCEX: "indigo",
    ORG: "orange",
    EL: "teal",
    CB: "purple",
    EXPORT: "cyan",
    DOA: "admin",
  };
  return map[sys] ?? "grey";
}

// Staff data
const staffList = ref([
  {
    id: 1,
    fullName: "นายสมศักดิ์ มีสุข",
    code: "DOA-00101",
    email: "somsak@doa.go.th",
    phone: "081-111-1111",
    role: "เจ้าหน้าที่ตรวจสอบ",
    systems: ["GAP", "HC"],
    enabled: true,
    createdAt: "2025-10-01",
  },
  {
    id: 2,
    fullName: "นางสาวรัตนา ใจงาม",
    code: "DOA-00102",
    email: "rattana@doa.go.th",
    phone: "082-222-2222",
    role: "ผู้อนุมัติ",
    systems: ["GAP", "HC", "HCEX", "ORG"],
    enabled: true,
    createdAt: "2025-10-05",
  },
  {
    id: 3,
    fullName: "นายวิทยา เก่งกาจ",
    code: "DOA-00103",
    email: "wittaya@doa.go.th",
    phone: "083-333-3333",
    role: "เจ้าหน้าที่ LAB",
    systems: ["HCEX"],
    enabled: true,
    createdAt: "2025-11-01",
  },
  {
    id: 4,
    fullName: "นางมณี ทองดี",
    code: "DOA-00104",
    email: "manee@doa.go.th",
    phone: "084-444-4444",
    role: "เจ้าหน้าที่ลงนาม",
    systems: ["GAP", "EXPORT", "CB"],
    enabled: true,
    createdAt: "2025-11-15",
  },
  {
    id: 5,
    fullName: "นายประพันธ์ ศรีวิไล",
    code: "DOA-00105",
    email: "praphan@doa.go.th",
    phone: "085-555-5555",
    role: "ผู้บังคับบัญชา",
    systems: ["GAP", "HC", "HCEX", "ORG", "EL", "CB", "EXPORT"],
    enabled: true,
    createdAt: "2025-12-01",
  },
  {
    id: 6,
    fullName: "นางสาวสุดา พรหมมา",
    code: "DOA-00106",
    email: "suda@doa.go.th",
    phone: "086-666-6666",
    role: "เจ้าหน้าที่ตรวจสอบ",
    systems: ["EL", "CB"],
    enabled: false,
    createdAt: "2026-01-10",
  },
  {
    id: 7,
    fullName: "นายชัยวัฒน์ อินทรา",
    code: "DOA-00107",
    email: "chaiwat@doa.go.th",
    phone: "087-777-7777",
    role: "เจ้าหน้าที่ตรวจสอบ",
    systems: ["ORG", "EXPORT"],
    enabled: true,
    createdAt: "2026-02-01",
  },
]);

let nextId = 8;

const headers = [
  { title: "เจ้าหน้าที่", key: "fullName" },
  { title: "รหัสพนักงาน", key: "code", sortable: true },
  { title: "ตำแหน่ง", key: "role", sortable: true },
  { title: "ระบบที่ใช้งานได้", key: "systems", sortable: false },
  { title: "สถานะ", key: "enabled", sortable: true },
  { title: "วันที่เพิ่ม", key: "createdAt", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

// Filters
const search = ref("");
const filterRole = ref("ทั้งหมด");
const filterSystem = ref("ทั้งหมด");
const filterStatus = ref("ทั้งหมด");

const filteredStaff = computed(() =>
  staffList.value.filter((s) => {
    const q = search.value?.toLowerCase() ?? "";
    if (
      q &&
      !s.fullName.toLowerCase().includes(q) &&
      !s.code.toLowerCase().includes(q) &&
      !s.email.toLowerCase().includes(q)
    )
      return false;
    if (filterRole.value !== "ทั้งหมด" && s.role !== filterRole.value)
      return false;
    if (
      filterSystem.value !== "ทั้งหมด" &&
      !s.systems.includes(filterSystem.value)
    )
      return false;
    if (filterStatus.value === "ใช้งาน" && !s.enabled) return false;
    if (filterStatus.value === "ระงับ" && s.enabled) return false;
    return true;
  }),
);

// Form
const formDialog = ref(false);
const editingItem = ref(null);
const form = reactive({
  fullName: "",
  code: "",
  email: "",
  phone: "",
  role: "",
  systems: [],
  enabled: true,
});

function openAdd() {
  editingItem.value = null;
  Object.assign(form, {
    fullName: "",
    code: "",
    email: "",
    phone: "",
    role: "",
    systems: [],
    enabled: true,
  });
  formDialog.value = true;
}
function openEdit(item) {
  editingItem.value = item;
  Object.assign(form, {
    fullName: item.fullName,
    code: item.code,
    email: item.email,
    phone: item.phone,
    role: item.role,
    systems: [...item.systems],
    enabled: item.enabled,
  });
  formDialog.value = true;
}
function toggleSystem(sys) {
  const idx = form.systems.indexOf(sys);
  if (idx === -1) form.systems.push(sys);
  else form.systems.splice(idx, 1);
}
function saveForm() {
  if (editingItem.value) {
    const idx = staffList.value.findIndex((s) => s.id === editingItem.value.id);
    if (idx !== -1)
      Object.assign(staffList.value[idx], {
        fullName: form.fullName,
        code: form.code,
        email: form.email,
        phone: form.phone,
        role: form.role,
        systems: [...form.systems],
        enabled: form.enabled,
      });
    showSnackbar("success", "แก้ไขข้อมูลเจ้าหน้าที่เรียบร้อยแล้ว");
  } else {
    const today = new Date().toISOString().split("T")[0];
    staffList.value.push({
      id: nextId++,
      fullName: form.fullName,
      code: form.code,
      email: form.email,
      phone: form.phone,
      role: form.role,
      systems: [...form.systems],
      enabled: form.enabled,
      createdAt: today,
    });
    showSnackbar("success", "เพิ่มเจ้าหน้าที่เรียบร้อยแล้ว");
  }
  formDialog.value = false;
}

// Toggle Enable/Disable
const toggleDialog = ref(false);
const togglingItem = ref(null);
function toggleStaff(item) {
  togglingItem.value = item;
  toggleDialog.value = true;
}
function confirmToggle() {
  const idx = staffList.value.findIndex((s) => s.id === togglingItem.value.id);
  if (idx !== -1) staffList.value[idx].enabled = !staffList.value[idx].enabled;
  const isNowEnabled = staffList.value[idx]?.enabled;
  toggleDialog.value = false;
  showSnackbar(
    isNowEnabled ? "success" : "error",
    isNowEnabled
      ? `เปิดใช้งาน ${togglingItem.value.fullName} เรียบร้อยแล้ว`
      : `ระงับการใช้งาน ${togglingItem.value.fullName} เรียบร้อยแล้ว`,
  );
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
.section-label {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.7;
}
.field-label,
.filter-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.field-label-en,
.filter-label-en {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.6;
  font-weight: 400;
}
.req {
  color: rgb(var(--v-theme-error));
}
.toggle-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.system-card {
  transition: all 0.15s;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
