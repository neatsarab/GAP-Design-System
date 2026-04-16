<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-3">
      <div>
        <h1 class="text-h6 font-weight-bold mb-1">จัดการ Masterdata</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ข้อมูลอ้างอิงที่ใช้ในระบบทั้งหมด
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="admin" class="mb-4">
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
        <v-icon :icon="tab.icon" size="14" class="mr-2" />
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- ── ประเภทพืช/สินค้า ── -->
      <v-window-item value="plant">
        <MasterdataTable
          title="ประเภทพืช / สินค้าเกษตร"
          subtitle="Plant / Agricultural Product Types"
          :headers="plantHeaders"
          :items="plantItems"
          @add="openAdd('plant')"
          @edit="(item) => openEdit('plant', item)"
          @delete="(item) => openDelete('plant', item)"
        />
      </v-window-item>

      <!-- ── ประเทศปลายทาง ── -->
      <v-window-item value="country">
        <MasterdataTable
          title="ประเทศปลายทาง"
          subtitle="Destination Countries"
          :headers="countryHeaders"
          :items="countryItems"
          @add="openAdd('country')"
          @edit="(item) => openEdit('country', item)"
          @delete="(item) => openDelete('country', item)"
        />
      </v-window-item>

      <!-- ── ประเภทใบรับรอง ── -->
      <v-window-item value="certtype">
        <MasterdataTable
          title="ประเภทใบรับรอง"
          subtitle="Certificate Types"
          :headers="certTypeHeaders"
          :items="visibleCertTypeItems"
          @add="openAdd('certtype')"
          @edit="(item) => openEdit('certtype', item)"
          @delete="(item) => openDelete('certtype', item)"
        />
      </v-window-item>

      <!-- ── ค่าธรรมเนียม ── -->
      <v-window-item value="fee">
        <MasterdataTable
          title="อัตราค่าธรรมเนียม"
          subtitle="Fee Rates"
          :headers="feeHeaders"
          :items="visibleFeeItems"
          @add="openAdd('fee')"
          @edit="(item) => openEdit('fee', item)"
          @delete="(item) => openDelete('fee', item)"
        />
      </v-window-item>

      <!-- ── หน่วยงาน/ระบบ ── -->
      <v-window-item value="system">
        <MasterdataTable
          title="ระบบและหน่วยงาน"
          subtitle="Systems & Units"
          :headers="systemHeaders"
          :items="visibleSystemItems"
          @add="openAdd('system')"
          @edit="(item) => openEdit('system', item)"
          @delete="(item) => openDelete('system', item)"
        />
      </v-window-item>
    </v-window>

    <!-- Add/Edit dialog -->
    <v-dialog v-model="formDialog" max-width="480" rounded="xl">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon
            :icon="editingItem ? 'fas fa-pencil' : 'fas fa-plus'"
            color="admin"
            size="18"
          />
          <span class="text-body-1 font-weight-bold">
            {{ editingItem ? "แก้ไขข้อมูล" : "เพิ่มข้อมูลใหม่" }}
          </span>
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            @click="formDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col
              v-for="field in currentFields"
              :key="field.key"
              cols="12"
              :sm="field.half ? 6 : 12"
            >
              <div class="field-label mb-1">
                <div>{{ field.label }}</div>
                <div class="field-label-en">{{ field.labelEn }}</div>
              </div>
              <v-select
                v-if="field.type === 'select'"
                v-model="formData[field.key]"
                :items="field.options"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                :readonly="field.key === 'system' && !!restrictedSystem"
                :append-inner-icon="
                  field.key === 'system' && restrictedSystem
                    ? 'fas fa-lock'
                    : undefined
                "
              />
              <v-text-field
                v-else
                v-model="formData[field.key]"
                :placeholder="field.placeholder"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 pt-0 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            flex="1"
            @click="formDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="admin"
            variant="flat"
            rounded="lg"
            flex="1"
            @click="saveForm"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirm dialog -->
    <v-dialog v-model="deleteDialog" max-width="380" rounded="xl">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <v-icon
            icon="fas fa-triangle-exclamation"
            size="40"
            color="error"
            class="mb-3"
          />
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการลบ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ต้องการลบรายการนี้ออกจากระบบใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 pt-0 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            flex="1"
            @click="deleteDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
            flex="1"
            @click="confirmDelete"
            >ลบ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useAdminStore } from "@/stores/admin.store";

const adminStore = useAdminStore();

const officerSystemMap = {
  adminsso01: "GAP",
  adminsso02: "ORG",
};
const restrictedSystem = computed(
  () => officerSystemMap[adminStore.username] ?? null,
);

// ── Tabs ───────────────────────────────────────────
const tabs = [
  { value: "plant", label: "ประเภทพืช/สินค้า", icon: "fas fa-seedling" },
  { value: "country", label: "ประเทศปลายทาง", icon: "fas fa-globe" },
  { value: "certtype", label: "ประเภทใบรับรอง", icon: "fas fa-certificate" },
  { value: "fee", label: "ค่าธรรมเนียม", icon: "fas fa-money-bill-wave" },
  { value: "system", label: "ระบบ/หน่วยงาน", icon: "fas fa-layer-group" },
];
const activeTab = ref("plant");

// ── Plant ───────────────────────────────────────────
const plantHeaders = [
  { title: "รหัส", key: "code", width: 120 },
  { title: "ชื่อ (ไทย)", key: "nameTh" },
  { title: "ชื่อ (อังกฤษ)", key: "nameEn" },
  { title: "หมวดหมู่", key: "category", width: 160 },
  { title: "สถานะ", key: "status", width: 120 },
  { title: "", key: "actions", sortable: false, align: "end", width: 120 },
];
const plantItems = ref([
  {
    id: 1,
    code: "PLT-001",
    nameTh: "มะม่วง",
    nameEn: "Mango",
    category: "ผลไม้",
    status: "active",
  },
  {
    id: 2,
    code: "PLT-002",
    nameTh: "ทุเรียน",
    nameEn: "Durian",
    category: "ผลไม้",
    status: "active",
  },
  {
    id: 3,
    code: "PLT-003",
    nameTh: "ลำไย",
    nameEn: "Longan",
    category: "ผลไม้",
    status: "active",
  },
  {
    id: 4,
    code: "PLT-004",
    nameTh: "กระเทียม",
    nameEn: "Garlic",
    category: "พืชผัก",
    status: "active",
  },
  {
    id: 5,
    code: "PLT-005",
    nameTh: "ข้าวโพด",
    nameEn: "Corn",
    category: "พืชไร่",
    status: "active",
  },
  {
    id: 6,
    code: "PLT-006",
    nameTh: "มะม่วงอบแห้ง",
    nameEn: "Dried Mango",
    category: "สินค้าแปรรูป",
    status: "active",
  },
]);

// ── Country ─────────────────────────────────────────
const countryHeaders = [
  { title: "รหัสประเทศ", key: "code", width: 140 },
  { title: "ชื่อประเทศ (ไทย)", key: "nameTh" },
  { title: "ชื่อประเทศ (อังกฤษ)", key: "nameEn" },
  { title: "สถานะ", key: "status", width: 120 },
  { title: "", key: "actions", sortable: false, align: "end", width: 120 },
];
const countryItems = ref([
  { id: 1, code: "CN", nameTh: "จีน", nameEn: "China", status: "active" },
  { id: 2, code: "JP", nameTh: "ญี่ปุ่น", nameEn: "Japan", status: "active" },
  {
    id: 3,
    code: "KR",
    nameTh: "เกาหลีใต้",
    nameEn: "South Korea",
    status: "active",
  },
  {
    id: 4,
    code: "VN",
    nameTh: "เวียดนาม",
    nameEn: "Vietnam",
    status: "active",
  },
  {
    id: 5,
    code: "SG",
    nameTh: "สิงคโปร์",
    nameEn: "Singapore",
    status: "active",
  },
  {
    id: 6,
    code: "EU",
    nameTh: "สหภาพยุโรป",
    nameEn: "European Union",
    status: "active",
  },
]);

// ── CertType ─────────────────────────────────────────
const certTypeHeaders = [
  { title: "รหัส", key: "code", width: 120 },
  { title: "ชื่อใบรับรอง", key: "nameTh" },
  { title: "ระบบ", key: "system", width: 120 },
  { title: "อายุ (ปี)", key: "validYears", width: 110 },
  { title: "สถานะ", key: "status", width: 120 },
  { title: "", key: "actions", sortable: false, align: "end", width: 120 },
];
const certTypeItems = ref([
  {
    id: 1,
    code: "GAP-01",
    nameTh: "ใบรับรอง GAP มาตรฐานพืช",
    system: "GAP",
    validYears: 3,
    status: "active",
  },
  {
    id: 2,
    code: "HC-01",
    nameTh: "กมพ.1 ใบรับรองสุขอนามัยพืช",
    system: "HC",
    validYears: 1,
    status: "active",
  },
  {
    id: 3,
    code: "HC-02",
    nameTh: "กมพ.1-1 ใบรับรองกลุ่มอ่าว",
    system: "HC",
    validYears: 1,
    status: "active",
  },
  {
    id: 4,
    code: "ORG-01",
    nameTh: "ใบรับรองเกษตรอินทรีย์",
    system: "ORG",
    validYears: 3,
    status: "active",
  },
  {
    id: 5,
    code: "EL-01",
    nameTh: "ใบรับรองเกษตรกรผู้ปลูกลำไย",
    system: "EL",
    validYears: 2,
    status: "active",
  },
]);

// ── Fee ──────────────────────────────────────────────
const feeHeaders = [
  { title: "รหัส", key: "code", width: 120 },
  { title: "รายการ", key: "nameTh" },
  { title: "ระบบ", key: "system", width: 120 },
  { title: "ค่าธรรมเนียม (บาท)", key: "amount", width: 180 },
  { title: "สถานะ", key: "status", width: 120 },
  { title: "", key: "actions", sortable: false, align: "end", width: 120 },
];
const feeItems = ref([
  {
    id: 1,
    code: "FEE-001",
    nameTh: "ค่าธรรมเนียมยื่นคำขอ GAP",
    system: "GAP",
    amount: 300,
    status: "active",
  },
  {
    id: 2,
    code: "FEE-002",
    nameTh: "ค่าธรรมเนียมยื่นคำขอ HC",
    system: "HC",
    amount: 500,
    status: "active",
  },
  {
    id: 3,
    code: "FEE-003",
    nameTh: "ค่าธรรมเนียมยื่นคำขอ HCEX",
    system: "HCEX",
    amount: 500,
    status: "active",
  },
  {
    id: 4,
    code: "FEE-004",
    nameTh: "ค่าธรรมเนียมยื่นคำขอ ORG",
    system: "ORG",
    amount: 400,
    status: "active",
  },
  {
    id: 5,
    code: "FEE-005",
    nameTh: "ค่าธรรมเนียมต่ออายุ GAP",
    system: "GAP",
    amount: 200,
    status: "active",
  },
]);

// ── System ───────────────────────────────────────────
const systemHeaders = [
  { title: "รหัสระบบ", key: "code", width: 120 },
  { title: "ชื่อระบบ", key: "nameTh" },
  { title: "หน่วยงานรับผิดชอบ", key: "unit" },
  { title: "สถานะ", key: "status", width: 120 },
  { title: "", key: "actions", sortable: false, align: "end", width: 120 },
];
const systemItems = ref([
  {
    id: 1,
    code: "GAP",
    nameTh: "ระบบ GAP มาตรฐานพืช",
    unit: "กลุ่มพัฒนาระบบตรวจรับรอง",
    status: "active",
  },
  {
    id: 2,
    code: "ORG",
    nameTh: "ระบบเกษตรอินทรีย์",
    unit: "กลุ่มพัฒนาระบบตรวจรับรอง",
    status: "active",
  },
  {
    id: 3,
    code: "HC",
    nameTh: "ระบบสุขอนามัยพืช",
    unit: "กลุ่มควบคุมพืชและวัสดุการเกษตร",
    status: "active",
  },
  {
    id: 4,
    code: "HCEX",
    nameTh: "ระบบสุขอนามัยพืชส่งออก",
    unit: "กลุ่มควบคุมพืชและวัสดุการเกษตร",
    status: "active",
  },
  {
    id: 5,
    code: "EL",
    nameTh: "ระบบทะเบียนเกษตรกร",
    unit: "กลุ่มทะเบียนเกษตรกร",
    status: "active",
  },
  {
    id: 6,
    code: "CB",
    nameTh: "ระบบหน่วยรับรอง",
    unit: "กลุ่มหน่วยรับรอง",
    status: "active",
  },
]);

// ── Form fields per tab ──────────────────────────────
const fieldsByTab = {
  plant: [
    {
      key: "code",
      label: "รหัส",
      labelEn: "Code",
      placeholder: "PLT-XXX",
      half: true,
    },
    {
      key: "category",
      label: "หมวดหมู่",
      labelEn: "Category",
      placeholder: "ผลไม้",
      half: true,
    },
    {
      key: "nameTh",
      label: "ชื่อ (ไทย)",
      labelEn: "Name (Thai)",
      placeholder: "ชื่อพืชภาษาไทย",
    },
    {
      key: "nameEn",
      label: "ชื่อ (อังกฤษ)",
      labelEn: "Name (English)",
      placeholder: "Plant name in English",
    },
    {
      key: "status",
      label: "สถานะ",
      labelEn: "Status",
      type: "select",
      options: [
        { label: "ใช้งาน", value: "active" },
        { label: "ปิดใช้งาน", value: "inactive" },
      ],
      half: true,
    },
  ],
  country: [
    {
      key: "code",
      label: "รหัสประเทศ",
      labelEn: "Country Code",
      placeholder: "CN",
      half: true,
    },
    {
      key: "status",
      label: "สถานะ",
      labelEn: "Status",
      type: "select",
      options: [
        { label: "ใช้งาน", value: "active" },
        { label: "ปิดใช้งาน", value: "inactive" },
      ],
      half: true,
    },
    {
      key: "nameTh",
      label: "ชื่อประเทศ (ไทย)",
      labelEn: "Name (Thai)",
      placeholder: "ชื่อประเทศภาษาไทย",
    },
    {
      key: "nameEn",
      label: "ชื่อประเทศ (อังกฤษ)",
      labelEn: "Name (English)",
      placeholder: "Country name in English",
    },
  ],
  certtype: [
    {
      key: "code",
      label: "รหัส",
      labelEn: "Code",
      placeholder: "HC-XX",
      half: true,
    },
    {
      key: "system",
      label: "ระบบ",
      labelEn: "System",
      type: "select",
      options: ["GAP", "ORG", "HC", "HCEX", "EL", "CB"].map((s) => ({
        label: s,
        value: s,
      })),
      half: true,
    },
    {
      key: "nameTh",
      label: "ชื่อใบรับรอง",
      labelEn: "Certificate Name",
      placeholder: "ชื่อใบรับรอง",
    },
    {
      key: "validYears",
      label: "อายุ (ปี)",
      labelEn: "Valid Years",
      placeholder: "3",
      half: true,
    },
    {
      key: "status",
      label: "สถานะ",
      labelEn: "Status",
      type: "select",
      options: [
        { label: "ใช้งาน", value: "active" },
        { label: "ปิดใช้งาน", value: "inactive" },
      ],
      half: true,
    },
  ],
  fee: [
    {
      key: "code",
      label: "รหัส",
      labelEn: "Code",
      placeholder: "FEE-XXX",
      half: true,
    },
    {
      key: "system",
      label: "ระบบ",
      labelEn: "System",
      type: "select",
      options: ["GAP", "ORG", "HC", "HCEX", "EL", "CB"].map((s) => ({
        label: s,
        value: s,
      })),
      half: true,
    },
    {
      key: "nameTh",
      label: "รายการ",
      labelEn: "Fee Item",
      placeholder: "รายละเอียดค่าธรรมเนียม",
    },
    {
      key: "amount",
      label: "จำนวนเงิน (บาท)",
      labelEn: "Amount (THB)",
      placeholder: "500",
      half: true,
    },
    {
      key: "status",
      label: "สถานะ",
      labelEn: "Status",
      type: "select",
      options: [
        { label: "ใช้งาน", value: "active" },
        { label: "ปิดใช้งาน", value: "inactive" },
      ],
      half: true,
    },
  ],
  system: [
    {
      key: "code",
      label: "รหัสระบบ",
      labelEn: "System Code",
      placeholder: "GAP",
      half: true,
    },
    {
      key: "status",
      label: "สถานะ",
      labelEn: "Status",
      type: "select",
      options: [
        { label: "ใช้งาน", value: "active" },
        { label: "ปิดใช้งาน", value: "inactive" },
      ],
      half: true,
    },
    {
      key: "nameTh",
      label: "ชื่อระบบ",
      labelEn: "System Name",
      placeholder: "ชื่อระบบ",
    },
    {
      key: "unit",
      label: "หน่วยงานรับผิดชอบ",
      labelEn: "Responsible Unit",
      placeholder: "ชื่อหน่วยงาน",
    },
  ],
};

const currentFields = computed(() => fieldsByTab[activeTab.value] ?? []);

// ── Filtered items (ถ้า restricted จะกรองเฉพาะระบบของตน) ──
const visibleCertTypeItems = computed(() =>
  restrictedSystem.value
    ? certTypeItems.value.filter((i) => i.system === restrictedSystem.value)
    : certTypeItems.value,
);
const visibleFeeItems = computed(() =>
  restrictedSystem.value
    ? feeItems.value.filter((i) => i.system === restrictedSystem.value)
    : feeItems.value,
);
const visibleSystemItems = computed(() =>
  restrictedSystem.value
    ? systemItems.value.filter((i) => i.code === restrictedSystem.value)
    : systemItems.value,
);

// ── Dialog state ─────────────────────────────────────
const formDialog = ref(false);
const deleteDialog = ref(false);
const editingItem = ref(null);
const deletingTab = ref(null);
const deletingItem = ref(null);
const formData = reactive({});

const itemSets = {
  plant: plantItems,
  country: countryItems,
  certtype: certTypeItems,
  fee: feeItems,
  system: systemItems,
};

function openAdd(tab) {
  editingItem.value = null;
  currentFields.value.forEach((f) => (formData[f.key] = ""));
  formData.status = "active";
  if (restrictedSystem.value) formData.system = restrictedSystem.value;
  formDialog.value = true;
}

function openEdit(tab, item) {
  editingItem.value = { tab, item };
  Object.assign(formData, { ...item });
  formDialog.value = true;
}

function saveForm() {
  const tab = editingItem.value?.tab ?? activeTab.value;
  const set = itemSets[tab];
  if (editingItem.value) {
    const idx = set.value.findIndex((i) => i.id === editingItem.value.item.id);
    if (idx !== -1) Object.assign(set.value[idx], { ...formData });
  } else {
    const newId = Math.max(0, ...set.value.map((i) => i.id)) + 1;
    set.value.push({ id: newId, ...formData });
  }
  formDialog.value = false;
}

function openDelete(tab, item) {
  deletingTab.value = tab;
  deletingItem.value = item;
  deleteDialog.value = true;
}

function confirmDelete() {
  const set = itemSets[deletingTab.value];
  const idx = set.value.findIndex((i) => i.id === deletingItem.value.id);
  if (idx !== -1) set.value.splice(idx, 1);
  deleteDialog.value = false;
}
</script>

<script>
// ── Inline sub-component: MasterdataTable ────────────
import { defineComponent, h } from "vue";
import {
  VCard,
  VCardText,
  VDataTable,
  VBtn,
  VIcon,
  VChip,
} from "vuetify/components";

const MasterdataTable = defineComponent({
  name: "MasterdataTable",
  props: {
    title: String,
    subtitle: String,
    headers: Array,
    items: Array,
  },
  emits: ["add", "edit", "delete"],
  setup(props, { emit }) {
    return () =>
      h("div", [
        h(
          "div",
          {
            class:
              "d-flex align-center justify-space-between mb-4 flex-wrap ga-2",
          },
          [
            h("div", [
              h("div", { class: "text-body-1 font-weight-bold" }, props.title),
              h(
                "div",
                { class: "text-caption text-medium-emphasis" },
                props.subtitle,
              ),
            ]),
            h(
              VBtn,
              {
                color: "admin",
                variant: "flat",
                rounded: "lg",
                size: "small",
                prependIcon: "fas fa-plus",
                onClick: () => emit("add"),
              },
              () => "เพิ่มข้อมูล",
            ),
          ],
        ),
        h(VCard, { rounded: "xl", elevation: 0, class: "table-card" }, () =>
          h(
            VDataTable,
            {
              headers: props.headers,
              items: props.items,
              itemsPerPage: 10,
              rounded: "xl",
            },
            {
              "item.status": ({ item }) =>
                h(
                  VChip,
                  {
                    size: "small",
                    color: item.status === "active" ? "success" : "grey",
                    variant: "tonal",
                  },
                  () => (item.status === "active" ? "ใช้งาน" : "ปิดใช้งาน"),
                ),
              "item.amount": ({ item }) =>
                h(
                  "span",
                  { class: "text-body-2" },
                  item.amount
                    ? `${Number(item.amount).toLocaleString()} บาท`
                    : "-",
                ),
              "item.actions": ({ item }) =>
                h("div", { class: "d-flex ga-1 justify-end" }, [
                  h(VBtn, {
                    size: "x-small",
                    color: "info",
                    variant: "tonal",
                    rounded: "lg",
                    icon: "fas fa-pencil",
                    onClick: () => emit("edit", item),
                  }),
                  h(VBtn, {
                    size: "x-small",
                    color: "error",
                    variant: "tonal",
                    rounded: "lg",
                    icon: "fas fa-trash",
                    onClick: () => emit("delete", item),
                  }),
                ]),
            },
          ),
        ),
      ]);
  },
});

export default { components: { MasterdataTable } };
</script>

<style scoped>
.field-label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  line-height: 1.3;
}
.field-label-en {
  font-size: 11px;
  opacity: 0.7;
}
.table-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
