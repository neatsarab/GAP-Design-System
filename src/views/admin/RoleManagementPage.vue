<template>
  <div>
    <transition :name="transitionName" mode="out-in">

      <!-- ════════════════════════════════════════
           LIST VIEW
      ════════════════════════════════════════ -->
      <div v-if="viewMode === 'list'" key="list">

        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="page-title mb-1">Role Management</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">จัดการชื่อบทบาทและการมองเห็นเมนูแยกตามระบบ</p>
          </div>
          <v-btn color="admin" rounded="lg" prepend-icon="fas fa-plus" @click="openAdd">เพิ่มบทบาท</v-btn>
        </div>

        <!-- System Tabs -->
        <v-tabs v-model="activeSystem" color="admin" class="mb-4" show-arrows>
          <v-tab v-for="sys in systems" :key="sys.code" :value="sys.code">
            <v-icon :icon="sys.icon" size="14" class="mr-2" />{{ sys.short }}
          </v-tab>
        </v-tabs>

        <!-- System info bar -->
        <v-card rounded="xl" elevation="0" class="pa-4 mb-5 d-flex align-center ga-3" :style="`border-left: 4px solid rgb(var(--v-theme-admin))`">
          <div class="sys-icon-box rounded-lg" style="background: rgba(var(--v-theme-admin), 0.1)">
            <v-icon :icon="currentSystem?.icon" color="admin" size="20" />
          </div>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-bold">{{ currentSystem?.label }}</div>
            <div class="text-caption text-medium-emphasis">{{ currentRoles.length }} บทบาท · {{ currentSystem?.short }}</div>
          </div>
          <v-chip size="small" color="admin" variant="tonal">{{ activeSystem }}</v-chip>
        </v-card>

        <!-- Role list -->
        <v-card rounded="xl" elevation="0" class="role-list-card">
          <!-- Empty state -->
          <div v-if="currentRoles.length === 0" class="pa-10 text-center">
            <v-icon icon="fas fa-user-tag" size="40" color="medium-emphasis" class="mb-3" />
            <div class="text-body-2 text-medium-emphasis mb-4">ยังไม่มีบทบาทสำหรับระบบ {{ currentSystem?.short }}</div>
            <v-btn color="admin" variant="tonal" rounded="lg" prepend-icon="fas fa-plus" @click="openAdd">เพิ่มบทบาทแรก</v-btn>
          </div>

          <template v-for="(role, idx) in currentRoles" :key="role.id">
            <div class="role-list-row">
              <div class="role-accent-bar" />
              <div class="role-index text-caption font-weight-bold text-medium-emphasis">
                {{ String(idx + 1).padStart(2, "0") }}
              </div>
              <div class="role-info flex-grow-1">
                <div class="d-flex align-center ga-2 mb-1">
                  <span class="text-body-2 font-weight-bold">{{ role.name }}</span>
                  <v-chip size="x-small" color="admin" variant="tonal" class="menu-count-chip">
                    <v-icon icon="fas fa-grip" size="9" class="mr-1" />{{ role.menus.length }} เมนู
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mb-1">{{ role.description || "ไม่มีคำอธิบาย" }}</div>
                <div class="d-flex flex-wrap ga-1">
                  <v-chip v-for="menuKey in role.menus" :key="menuKey" size="x-small" variant="outlined" color="on-surface-variant" class="menu-chip">
                    {{ menuLabel(menuKey) }}
                  </v-chip>
                  <span v-if="role.menus.length === 0" class="text-caption text-disabled">ไม่มีเมนู</span>
                </div>
              </div>
              <div class="role-actions d-flex ga-1 align-center flex-shrink-0">
                <v-btn size="x-small" variant="tonal" color="admin" rounded="lg" @click="openEdit(role)">
                  <v-icon icon="fas fa-pen" size="11" class="mr-1" />แก้ไข
                </v-btn>
                <v-btn size="x-small" variant="text" color="error" rounded="lg" icon="fas fa-trash" @click="openDelete(role)" />
              </div>
            </div>
            <v-divider v-if="idx < currentRoles.length - 1" />
          </template>
        </v-card>

      </div>

      <!-- ════════════════════════════════════════
           FORM VIEW (Add / Edit)
      ════════════════════════════════════════ -->
      <div v-else key="form">

        <!-- Form header -->
        <div class="d-flex align-center ga-3 mb-6">
          <v-btn icon="fas fa-arrow-left" variant="tonal" color="on-surface-variant" rounded="lg" size="small" @click="cancelEdit" />
          <div class="flex-grow-1">
            <div class="d-flex align-center ga-2">
              <h1 class="page-title mb-0">{{ editingId !== null ? "แก้ไขบทบาท" : "เพิ่มบทบาทใหม่" }}</h1>
              <v-chip size="small" color="admin" variant="tonal">{{ currentSystem?.short }}</v-chip>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
              {{ currentSystem?.label }}
            </p>
          </div>
          <v-btn variant="tonal" color="grey" rounded="lg" @click="cancelEdit">ยกเลิก</v-btn>
          <v-btn color="admin" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="saveForm">บันทึก</v-btn>
        </div>

        <!-- Basic info card -->
        <v-card rounded="xl" elevation="0" class="pa-6 mb-5">
          <div class="section-label mb-4">ข้อมูลบทบาท</div>
          <v-row>
            <v-col cols="12" sm="4">
              <div class="field-label">
                <div>ชื่อบทบาท <span class="req">*</span></div>
                <div class="field-label-en">Role Name</div>
              </div>
              <v-text-field
                v-model="form.name"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เช่น เจ้าหน้าที่ตรวจสอบ"
                autofocus
              />
            </v-col>
            <v-col cols="12" sm="8">
              <div class="field-label">
                <div>คำอธิบาย</div>
                <div class="field-label-en">Description</div>
              </div>
              <v-text-field
                v-model="form.description"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="อธิบายหน้าที่ของบทบาทนี้"
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- Menu permissions card -->
        <v-card rounded="xl" elevation="0" class="pa-6">
          <div class="d-flex align-center justify-space-between mb-5">
            <div>
              <div class="section-label mb-1">การมองเห็นเมนู</div>
              <div class="text-caption text-medium-emphasis">
                เลือกเมนูที่บทบาทนี้สามารถเข้าถึงได้ ·
                <strong>{{ form.menus.length }}</strong> / {{ allMenuKeysForSystem.length }} เมนู
              </div>
            </div>
            <div class="d-flex ga-2">
              <v-btn size="small" variant="tonal" color="admin" rounded="lg" @click="selectAll">เลือกทั้งหมด</v-btn>
              <v-btn size="small" variant="tonal" color="grey" rounded="lg" @click="clearAll">ล้างทั้งหมด</v-btn>
            </div>
          </div>

          <v-row dense>
            <v-col v-for="group in menuGroupsForSystem" :key="group.group" cols="12" sm="6" md="4" lg="3">
              <div class="menu-group-block rounded-xl overflow-hidden mb-3">
                <div class="d-flex align-center justify-space-between menu-group-header px-4 py-3">
                  <div class="d-flex align-center ga-2">
                    <v-icon :icon="group.icon" size="13" color="admin" />
                    <span class="text-body-2 font-weight-bold">{{ group.group }}</span>
                    <v-chip size="x-small" variant="tonal" color="admin" class="menu-count-chip">
                      {{ group.items.filter(i => form.menus.includes(i.key)).length }}/{{ group.items.length }}
                    </v-chip>
                  </div>
                  <v-checkbox
                    :model-value="isGroupAllSelected(group)"
                    :indeterminate="isGroupPartial(group)"
                    color="admin"
                    hide-details
                    density="compact"
                    @click="toggleGroup(group)"
                  />
                </div>
                <div
                  v-for="item in group.items"
                  :key="item.key"
                  class="menu-toggle-row d-flex align-center justify-space-between px-4 py-2 cursor-pointer"
                  :class="{ 'menu-toggle-row--on': form.menus.includes(item.key) }"
                  @click="toggleMenu(item.key)"
                >
                  <div class="flex-grow-1 mr-2">
                    <div class="text-body-2">{{ item.label }}</div>
                    <div v-if="item.sub" class="text-caption text-medium-emphasis">{{ item.sub }}</div>
                  </div>
                  <v-switch :model-value="form.menus.includes(item.key)" color="admin" hide-details density="compact" readonly />
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Bottom action bar -->
          <v-divider class="mt-2 mb-4" />
          <div class="d-flex justify-end ga-2">
            <v-btn variant="tonal" color="grey" rounded="lg" @click="cancelEdit">ยกเลิก</v-btn>
            <v-btn color="admin" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="saveForm">บันทึก</v-btn>
          </div>
        </v-card>

      </div>

    </transition>

    <!-- ── Delete Confirm Dialog ── -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="delete-ring mx-auto mb-4">
            <v-icon icon="fas fa-trash" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลบบทบาท</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการลบบทบาท
            <strong>{{ deletingRole?.name }}</strong> ใช่หรือไม่?<br />
            <span class="text-caption text-error"
              >การกระทำนี้ไม่สามารถย้อนกลับได้</span
            >
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="deleteDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="error" rounded="lg" block @click="doDelete">ลบ</v-btn>
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
          snackbarColor === 'success'
            ? 'fas fa-circle-check'
            : 'fas fa-circle-xmark'
        "
        class="mr-2"
      />
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

// ── Systems ─────────────────────────────────────────────
const systems = [
  {
    code: "GAP",
    short: "GAP",
    label: "ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) พืช",
    icon: "fas fa-seedling",
  },
  {
    code: "ORG",
    short: "ORG",
    label: "ระบบการรับรองมาตรฐาน ORG (Organic Agriculture) พืช",
    icon: "fas fa-leaf",
  },
  {
    code: "DOA",
    short: "DOA",
    label: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)",
    icon: "fas fa-industry",
  },
  {
    code: "CB",
    short: "CB",
    label:
      "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body : CB)",
    icon: "fas fa-certificate",
  },
  {
    code: "HC",
    short: "HC",
    label: "ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ",
    icon: "fas fa-virus",
  },
  {
    code: "HCEX",
    short: "HC-EX",
    label: "ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช",
    icon: "fas fa-file-medical",
  },
  {
    code: "EL",
    short: "EL",
    label:
      "ระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment List: EL)",
    icon: "fas fa-warehouse",
  },
];

const activeSystem = ref("GAP");
const currentSystem = computed(() =>
  systems.find((s) => s.code === activeSystem.value),
);

// ── Menu structure per system ──────────────────────────
// Common menus available in most systems
const baseMenuGroups = [
  {
    group: "ภาพรวม",
    icon: "fas fa-gauge",
    items: [{ key: "dashboard", label: "แดชบอร์ด", sub: "Dashboard" }],
  },
  {
    group: "คำขอ",
    icon: "fas fa-file-lines",
    items: [
      { key: "applications", label: "รายการคำขอ", sub: "Application List" },
      { key: "lab", label: "รายการรอตรวจ Lab", sub: "Lab Waiting List" },
      { key: "lab_review", label: "รายการรอพิจารณาผล Lab", sub: "Lab Review" },
      { key: "reviews", label: "รายการรอพิจารณา", sub: "Review List" },
      { key: "signing", label: "รายการรอลงนาม", sub: "Signing List" },
    ],
  },
  {
    group: "ใบรับรอง",
    icon: "fas fa-certificate",
    items: [
      { key: "registry", label: "รายการใบรับรอง", sub: "Certificate Registry" },
    ],
  },
  {
    group: "รายงาน",
    icon: "fas fa-chart-bar",
    items: [{ key: "reports", label: "รายงาน", sub: "Reports" }],
  },
  {
    group: "จัดการ",
    icon: "fas fa-sliders",
    items: [
      {
        key: "access_requests",
        label: "คำขอลงทะเบียนใช้งาน",
        sub: "Access Requests",
      },
      { key: "masterdata", label: "Masterdata", sub: "Master Data" },
    ],
  },
];

// System-specific overrides (menus that differ or are extra)
const systemMenuOverrides = {
  GAP: baseMenuGroups,
  ORG: baseMenuGroups,
  DOA: [
    {
      group: "ภาพรวม",
      icon: "fas fa-gauge",
      items: [{ key: "dashboard", label: "แดชบอร์ด", sub: "Dashboard" }],
    },
    {
      group: "ทะเบียน",
      icon: "fas fa-file-lines",
      items: [
        {
          key: "registration",
          label: "รายการขึ้นทะเบียน",
          sub: "Registration List",
        },
        {
          key: "reg_detail",
          label: "รายละเอียดการขึ้นทะเบียน",
          sub: "Registration Detail",
        },
      ],
    },
    {
      group: "รายงาน",
      icon: "fas fa-chart-bar",
      items: [{ key: "reports", label: "รายงาน", sub: "Reports" }],
    },
    {
      group: "จัดการ",
      icon: "fas fa-sliders",
      items: [
        {
          key: "access_requests",
          label: "คำขอลงทะเบียนใช้งาน",
          sub: "Access Requests",
        },
        { key: "masterdata", label: "Masterdata", sub: "Master Data" },
      ],
    },
  ],
  CB: [
    {
      group: "ภาพรวม",
      icon: "fas fa-gauge",
      items: [{ key: "dashboard", label: "แดชบอร์ด", sub: "Dashboard" }],
    },
    {
      group: "คำขอ",
      icon: "fas fa-file-lines",
      items: [
        { key: "applications", label: "รายการคำขอ", sub: "Application List" },
        { key: "reviews", label: "รายการรอพิจารณา", sub: "Review List" },
      ],
    },
    {
      group: "รายงาน",
      icon: "fas fa-chart-bar",
      items: [{ key: "reports", label: "รายงาน", sub: "Reports" }],
    },
    {
      group: "จัดการ",
      icon: "fas fa-sliders",
      items: [
        {
          key: "access_requests",
          label: "คำขอลงทะเบียนใช้งาน",
          sub: "Access Requests",
        },
        { key: "masterdata", label: "Masterdata", sub: "Master Data" },
      ],
    },
  ],
  HC: baseMenuGroups,
  HCEX: baseMenuGroups,
  EL: [
    {
      group: "ภาพรวม",
      icon: "fas fa-gauge",
      items: [{ key: "dashboard", label: "แดชบอร์ด", sub: "Dashboard" }],
    },
    {
      group: "ทะเบียน",
      icon: "fas fa-list",
      items: [
        { key: "el_list", label: "รายการโรงคัดบรรจุ", sub: "EL List" },
        { key: "el_review", label: "รายการรอพิจารณา", sub: "Review List" },
      ],
    },
    {
      group: "รายงาน",
      icon: "fas fa-chart-bar",
      items: [{ key: "reports", label: "รายงาน", sub: "Reports" }],
    },
    {
      group: "จัดการ",
      icon: "fas fa-sliders",
      items: [
        {
          key: "access_requests",
          label: "คำขอลงทะเบียนใช้งาน",
          sub: "Access Requests",
        },
        { key: "masterdata", label: "Masterdata", sub: "Master Data" },
      ],
    },
  ],
};

const menuGroupsForSystem = computed(
  () => systemMenuOverrides[activeSystem.value] ?? baseMenuGroups,
);

const allMenuKeysForSystem = computed(() =>
  menuGroupsForSystem.value.flatMap((g) => g.items.map((i) => i.key)),
);

function menuLabel(key) {
  for (const g of menuGroupsForSystem.value.length
    ? menuGroupsForSystem.value
    : baseMenuGroups) {
    const found = g.items.find((i) => i.key === key);
    if (found) return found.label;
  }
  // fallback: search all groups across all systems
  for (const sysGroups of Object.values(systemMenuOverrides)) {
    for (const g of sysGroups) {
      const found = g.items.find((i) => i.key === key);
      if (found) return found.label;
    }
  }
  return key;
}

// ── Roles data per system ───────────────────────────────
let nextId = 100;
const rolesBySystem = reactive({
  GAP: [
    {
      id: 1,
      name: "เจ้าหน้าที่ตรวจสอบ",
      description: "ตรวจสอบและดำเนินการคำขอ",
      menus: ["dashboard", "applications", "lab", "lab_review", "registry"],
    },
    {
      id: 2,
      name: "ผู้อนุมัติ",
      description: "พิจารณาและอนุมัติคำขอ",
      menus: ["dashboard", "applications", "reviews", "registry", "reports"],
    },
    {
      id: 3,
      name: "เจ้าหน้าที่ลงนาม",
      description: "ลงนามออกใบรับรอง",
      menus: ["dashboard", "signing", "registry"],
    },
    {
      id: 4,
      name: "ผู้ดูแลระบบ",
      description: "จัดการระบบและข้อมูลทั้งหมด",
      menus: [
        "dashboard",
        "applications",
        "lab",
        "lab_review",
        "reviews",
        "signing",
        "registry",
        "reports",
        "access_requests",
        "masterdata",
      ],
    },
  ],
  ORG: [
    {
      id: 10,
      name: "เจ้าหน้าที่ตรวจสอบ",
      description: "ตรวจสอบและดำเนินการคำขอ",
      menus: ["dashboard", "applications", "lab", "reviews", "registry"],
    },
    {
      id: 11,
      name: "ผู้อนุมัติ",
      description: "พิจารณาและอนุมัติคำขอ",
      menus: ["dashboard", "reviews", "registry", "reports"],
    },
    {
      id: 12,
      name: "ผู้ดูแลระบบ",
      description: "จัดการระบบและข้อมูลทั้งหมด",
      menus: [
        "dashboard",
        "applications",
        "lab",
        "reviews",
        "registry",
        "reports",
        "access_requests",
        "masterdata",
      ],
    },
  ],
  DOA: [
    {
      id: 20,
      name: "เจ้าหน้าที่ทะเบียน",
      description: "ดูแลการขึ้นทะเบียนโรงงาน",
      menus: ["dashboard", "registration", "reg_detail"],
    },
    {
      id: 21,
      name: "ผู้อนุมัติ",
      description: "อนุมัติการขึ้นทะเบียน",
      menus: ["dashboard", "registration", "reg_detail", "reports"],
    },
    {
      id: 22,
      name: "ผู้ดูแลระบบ",
      description: "จัดการระบบและข้อมูลทั้งหมด",
      menus: [
        "dashboard",
        "registration",
        "reg_detail",
        "reports",
        "access_requests",
        "masterdata",
      ],
    },
  ],
  CB: [
    {
      id: 30,
      name: "เจ้าหน้าที่ตรวจสอบ",
      description: "ตรวจสอบคำขอ CB",
      menus: ["dashboard", "applications"],
    },
    {
      id: 31,
      name: "ผู้อนุมัติ",
      description: "พิจารณาและอนุมัติ",
      menus: ["dashboard", "applications", "reviews", "reports"],
    },
    {
      id: 32,
      name: "ผู้ดูแลระบบ",
      description: "จัดการระบบและข้อมูลทั้งหมด",
      menus: [
        "dashboard",
        "applications",
        "reviews",
        "reports",
        "access_requests",
        "masterdata",
      ],
    },
  ],
  HC: [
    {
      id: 50,
      name: "เจ้าหน้าที่ตรวจสอบ",
      description: "ตรวจสอบคำขอ HC",
      menus: ["dashboard", "applications", "lab", "lab_review"],
    },
    {
      id: 51,
      name: "เจ้าหน้าที่ LAB",
      description: "บันทึกและพิจารณาผล Lab",
      menus: ["dashboard", "lab", "lab_review"],
    },
    {
      id: 52,
      name: "ผู้อนุมัติ",
      description: "พิจารณาและอนุมัติ",
      menus: ["dashboard", "reviews", "registry", "reports"],
    },
    {
      id: 53,
      name: "เจ้าหน้าที่ลงนาม",
      description: "ลงนามออกใบ HC",
      menus: ["dashboard", "signing", "registry"],
    },
    {
      id: 54,
      name: "ผู้ดูแลระบบ",
      description: "จัดการระบบและข้อมูลทั้งหมด",
      menus: [
        "dashboard",
        "applications",
        "lab",
        "lab_review",
        "reviews",
        "signing",
        "registry",
        "reports",
        "access_requests",
        "masterdata",
      ],
    },
  ],
  HCEX: [
    {
      id: 60,
      name: "เจ้าหน้าที่ตรวจสอบ",
      description: "ตรวจสอบคำขอ HC-EX",
      menus: ["dashboard", "applications", "lab", "lab_review"],
    },
    {
      id: 61,
      name: "เจ้าหน้าที่ LAB",
      description: "บันทึกและพิจารณาผล Lab",
      menus: ["dashboard", "lab", "lab_review"],
    },
    {
      id: 62,
      name: "ผู้อนุมัติ",
      description: "พิจารณาและอนุมัติ",
      menus: ["dashboard", "reviews", "registry", "reports"],
    },
    {
      id: 63,
      name: "เจ้าหน้าที่ลงนาม",
      description: "ลงนามออกใบ HC-EX",
      menus: ["dashboard", "signing", "registry"],
    },
    {
      id: 64,
      name: "ผู้ดูแลระบบ",
      description: "จัดการระบบและข้อมูลทั้งหมด",
      menus: [
        "dashboard",
        "applications",
        "lab",
        "lab_review",
        "reviews",
        "signing",
        "registry",
        "reports",
        "access_requests",
        "masterdata",
      ],
    },
  ],
  EL: [
    {
      id: 70,
      name: "เจ้าหน้าที่ตรวจสอบ",
      description: "ตรวจสอบรายการโรงคัดบรรจุ",
      menus: ["dashboard", "el_list", "el_review"],
    },
    {
      id: 71,
      name: "ผู้อนุมัติ",
      description: "พิจารณาและอนุมัติ",
      menus: ["dashboard", "el_list", "el_review", "reports"],
    },
    {
      id: 72,
      name: "ผู้ดูแลระบบ",
      description: "จัดการระบบและข้อมูลทั้งหมด",
      menus: [
        "dashboard",
        "el_list",
        "el_review",
        "reports",
        "access_requests",
        "masterdata",
      ],
    },
  ],
});

const currentRoles = computed(() => rolesBySystem[activeSystem.value] ?? []);

// ── View mode ────────────────────────────────────────────
const viewMode = ref("list");
const transitionName = ref("page-forward");

function goToForm() {
  transitionName.value = "page-forward";
  viewMode.value = "form";
}
function goToList() {
  transitionName.value = "page-back";
  viewMode.value = "list";
}

// ── Form ────────────────────────────────────────────────
const editingId = ref(null);
const form = reactive({ name: "", description: "", menus: [] });

function openAdd() {
  editingId.value = null;
  Object.assign(form, { name: "", description: "", menus: [] });
  goToForm();
}
function openEdit(role) {
  editingId.value = role.id;
  Object.assign(form, { name: role.name, description: role.description, menus: [...role.menus] });
  goToForm();
}
function cancelEdit() {
  editingId.value = null;
  goToList();
}
function toggleMenu(key) {
  const idx = form.menus.indexOf(key);
  if (idx === -1) form.menus.push(key);
  else form.menus.splice(idx, 1);
}
function selectAll() {
  form.menus = [...allMenuKeysForSystem.value];
}
function clearAll() {
  form.menus = [];
}

function isGroupAllSelected(group) {
  return group.items.every((i) => form.menus.includes(i.key));
}
function isGroupPartial(group) {
  const keys = group.items.map((i) => i.key);
  const count = keys.filter((k) => form.menus.includes(k)).length;
  return count > 0 && count < keys.length;
}
function toggleGroup(group) {
  if (isGroupAllSelected(group)) {
    group.items.forEach((i) => {
      const idx = form.menus.indexOf(i.key);
      if (idx !== -1) form.menus.splice(idx, 1);
    });
  } else {
    group.items.forEach((i) => {
      if (!form.menus.includes(i.key)) form.menus.push(i.key);
    });
  }
}
function saveForm() {
  const list = rolesBySystem[activeSystem.value];
  if (editingId.value !== null) {
    const idx = list.findIndex((r) => r.id === editingId.value);
    if (idx !== -1)
      Object.assign(list[idx], {
        name: form.name,
        description: form.description,
        menus: [...form.menus],
      });
    showSnackbar("success", "แก้ไขบทบาทเรียบร้อยแล้ว");
  } else {
    list.push({
      id: nextId++,
      name: form.name,
      description: form.description,
      menus: [...form.menus],
    });
    showSnackbar("success", "เพิ่มบทบาทเรียบร้อยแล้ว");
  }
  editingId.value = null;
  goToList();
}

// ── Delete ──────────────────────────────────────────────
const deleteDialog = ref(false);
const deletingRole = ref(null);

function openDelete(role) {
  deletingRole.value = role;
  deleteDialog.value = true;
}
function doDelete() {
  const list = rolesBySystem[activeSystem.value];
  const idx = list.findIndex((r) => r.id === deletingRole.value.id);
  if (idx !== -1) list.splice(idx, 1);
  deleteDialog.value = false;
  showSnackbar("error", `ลบบทบาท "${deletingRole.value.name}" แล้ว`);
}

// ── Snackbar ────────────────────────────────────────────
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
/* ── Page transitions ── */
.page-forward-enter-active,
.page-forward-leave-active,
.page-back-enter-active,
.page-back-leave-active {
  transition: all 0.22s ease;
}
.page-forward-enter-from { opacity: 0; transform: translateX(32px); }
.page-forward-leave-to   { opacity: 0; transform: translateX(-32px); }
.page-back-enter-from    { opacity: 0; transform: translateX(-32px); }
.page-back-leave-to      { opacity: 0; transform: translateX(32px); }

.page-title {
  font-size: 1.375rem;
  font-weight: 700;
}
.section-label {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.7;
}
.field-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.field-label-en {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.6;
}
.req {
  color: rgb(var(--v-theme-error));
}
/* ── Role list ── */
.role-list-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
}
.role-list-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 20px;
  transition: background 0.12s;
}
.role-list-row:hover:not(.role-list-row--editing) {
  background: rgba(var(--v-theme-admin), 0.03);
}
.role-list-row--editing {
  background: rgba(var(--v-theme-admin), 0.04);
}
.role-list-row--editing .role-accent-bar {
  background: rgb(var(--v-theme-admin)) !important;
}
.role-list-row--dimmed {
  opacity: 0.45;
  pointer-events: none;
}
.role-accent-bar {
  width: 3px;
  min-height: 40px;
  border-radius: 4px;
  background: rgba(var(--v-theme-admin), 0.22);
  flex-shrink: 0;
  align-self: stretch;
  transition: background 0.15s;
}
.role-accent-bar--add {
  background: rgba(var(--v-theme-admin), 0.6);
}
.role-list-row:hover:not(.role-list-row--editing) .role-accent-bar {
  background: rgba(var(--v-theme-admin), 0.55);
}
.role-index {
  width: 22px;
  flex-shrink: 0;
  padding-top: 6px;
  text-align: center;
}
.role-info {
  min-width: 0;
  flex: 1;
}
.role-actions {
  flex-shrink: 0;
}
.menu-count-chip {
  font-size: 0.65rem !important;
}
.menu-chip {
  font-size: 0.65rem !important;
  opacity: 0.75;
}

/* ── Inline menu editor ── */
.inline-edit-menus {
  background: rgba(var(--v-theme-admin), 0.02);
}
.menu-group-block {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.menu-group-header {
  background: rgba(var(--v-theme-admin), 0.05);
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.menu-toggle-row {
  border-bottom: 1px solid
    rgba(var(--v-border-color), calc(var(--v-border-opacity) * 0.6));
  transition: background 0.1s;
}
.menu-toggle-row:last-child {
  border-bottom: none;
}
.menu-toggle-row:hover {
  background: rgba(var(--v-theme-admin), 0.04);
}
.menu-toggle-row--on {
  background: rgba(var(--v-theme-admin), 0.06) !important;
}

/* ── Misc ── */
.sys-icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.delete-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
