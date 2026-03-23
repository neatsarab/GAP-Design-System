<template>
  <div class="portal-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- ══════════════════════════════════════════
         TOP NAV BAR
    ══════════════════════════════════════════ -->
    <div class="portal-topbar">
      <div class="portal-topbar-inner">
        <!-- Brand -->
        <div class="d-flex align-center ga-3">
          <div class="topbar-logo">
            <v-icon icon="fas fa-leaf" size="20" color="white" />
          </div>
          <div>
            <div
              class="text-body-2 font-weight-bold text-white lh-tight"
              
            >
              กรมวิชาการเกษตร
            </div>
            <div
              class="text-caption"
              style="color: rgba(255, 255, 255, 0.6); line-height: 1.2"
            >
              Department of Agriculture
            </div>
          </div>
        </div>

        <v-spacer />

        <!-- Right: time + notification + user -->
        <div class="d-flex align-center ga-2">
          <!-- Clock -->
          <div class="topbar-time d-none d-sm-flex align-center ga-2">
            <v-icon
              icon="fas fa-calendar"
              size="13"
              style="color: rgba(255, 255, 255, 0.6)"
            />
            <span
              class="text-caption"
              style="color: rgba(255, 255, 255, 0.75)"
              >{{ currentDate }}</span
            >
          </div>

          <v-divider vertical class="mx-1" style="opacity: 0.2; height: 40px" />

          <!-- Dark mode toggle -->
          <v-btn
            icon
            variant="text"
            size="small"
            style="color: rgba(255, 255, 255, 0.8)"
            @click="themeStore.toggle()"
          >
            <v-icon
              :icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
              size="16"
            />
            <v-tooltip activator="parent" location="bottom">
              {{ themeStore.isDark ? "โหมดสว่าง" : "โหมดมืด" }}
            </v-tooltip>
          </v-btn>

          <!-- Notification bell -->
          <v-btn
            icon
            variant="text"
            size="small"
            style="color: rgba(255, 255, 255, 0.8)"
            class="position-relative"
          >
            <v-icon icon="fas fa-bell" size="16" />
            <span class="notif-dot" />
            <v-tooltip activator="parent" location="bottom"
              >แจ้งเตือน (2)</v-tooltip
            >
          </v-btn>

          <!-- User menu -->
          <v-menu location="bottom end" :offset="8">
            <template #activator="{ props }">
              <div class="user-pill d-flex align-center ga-2" v-bind="props">
                <div class="user-avatar-sm">
                  <span class="text-caption font-weight-bold">นส</span>
                </div>
                <div class="d-none d-sm-block">
                  <div
                    class="text-caption font-weight-semibold text-white lh-tight"
                    
                  >
                    {{ user.name }}
                  </div>
                  <div
                    class="text-caption"
                    style="
                      color: rgba(255, 255, 255, 0.55);
                      line-height: 1.2;
                      font-size: 10px;
                    "
                  >
                    {{ user.role }}
                  </div>
                </div>
                <v-icon
                  icon="fas fa-chevron-down"
                  size="10"
                  style="color: rgba(255, 255, 255, 0.5)"
                />
              </div>
            </template>

            <v-card min-width="200" elevation="8" rounded="xl" class="mt-1">
              <v-card-text class="pb-2">
                <div class="d-flex align-center ga-3 mb-3">
                  <div class="user-avatar-md">
                    <span class="text-body-2 font-weight-bold">นส</span>
                  </div>
                  <div>
                    <div class="text-body-2 font-weight-bold">
                      {{ user.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
                <v-divider class="mb-2" />
              </v-card-text>
              <v-list density="compact" nav class="pt-0 pb-2">
                <v-list-item
                  prepend-icon="fas fa-user"
                  title="ข้อมูลส่วนตัว"
                  rounded="lg"
                />
                <v-list-item
                  prepend-icon="fas fa-key"
                  title="เปลี่ยนรหัสผ่าน"
                  rounded="lg"
                />
                <v-divider class="my-1" />
                <v-list-item
                  v-if="mode === 'user'"
                  prepend-icon="fas fa-arrow-left"
                  title="ย้อนกลับเลือกประเภท"
                  subtitle="บุคคล / นิติบุคคล / กลุ่ม"
                  rounded="lg"
                  @click="router.push('/select-company')"
                />
                <v-list-item
                  prepend-icon="fas fa-right-from-bracket"
                  title="ออกจากระบบ"
                  rounded="lg"
                  base-color="error"
                  @click="router.push('/login')"
                />
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         HERO SECTION
    ══════════════════════════════════════════ -->
    <div class="portal-hero">
      <div class="portal-hero-inner">
        <div
          class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-6"
        >
          <!-- Greeting -->
          <div>
            <p
              class="text-body-2 mb-1"
              style="color: rgba(255, 255, 255, 0.65)"
            >
              ยินดีต้อนรับ
            </p>
            <h1 class="page-title text-white mb-1">
              {{ user.name }}
            </h1>
            <div class="d-flex align-center ga-2 flex-wrap">
              <template v-if="mode === 'user'">
                <v-chip size="x-small" color="white" variant="outlined">
                  <v-icon
                    start
                    :icon="
                      entityType === 'juristic'
                        ? 'fas fa-building'
                        : entityType === 'group'
                          ? 'fas fa-people-group'
                          : 'fas fa-user'
                    "
                    size="10"
                  />
                  {{
                    entityType === "juristic"
                      ? "นิติบุคคล"
                      : entityType === "group"
                        ? "กลุ่ม"
                        : "บุคคลธรรมดา"
                  }}
                </v-chip>
                <v-chip
                  v-if="entityType === 'juristic' && companyName"
                  size="x-small"
                  color="white"
                  variant="outlined"
                >
                  <v-icon start icon="fas fa-briefcase" size="10" />
                  {{ companyName }}
                </v-chip>
                <v-chip
                  v-if="entityType === 'group' && groupName"
                  size="x-small"
                  color="white"
                  variant="outlined"
                >
                  <v-icon start icon="fas fa-people-group" size="10" />
                  {{ groupName }}
                </v-chip>
              </template>
              <template v-else>
                <v-chip size="x-small" color="white" variant="outlined">
                  <v-icon start icon="fas fa-shield-halved" size="10" />
                  {{ user.role }}
                </v-chip>
                <v-chip size="x-small" color="white" variant="outlined">
                  <v-icon start icon="fas fa-building" size="10" />
                  {{ user.dept }}
                </v-chip>
              </template>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="d-flex ga-3 flex-wrap">
            <div
              v-for="stat in heroStats"
              :key="stat.label"
              class="hero-stat-card"
            >
              <div class="d-flex align-center ga-2 mb-1">
                <v-icon
                  :icon="stat.icon"
                  size="14"
                  style="color: rgba(255, 255, 255, 0.7)"
                />
                <span
                  class="text-caption"
                  style="color: rgba(255, 255, 255, 0.65)"
                  >{{ stat.label }}</span
                >
              </div>
              <div class="d-flex align-center ga-2">
                <span class="text-h6 font-weight-bold text-white">{{
                  stat.value
                }}</span>
                <v-chip
                  v-if="stat.badge"
                  size="x-small"
                  :color="stat.badgeColor"
                  variant="flat"
                >
                  {{ stat.badge }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         BODY
    ══════════════════════════════════════════ -->
    <div class="portal-body">
      <div class="portal-body-inner">
        <!-- ── Announcement Banner ─── -->
        <v-alert
          class="mb-6"
          color="info"
          variant="tonal"
          rounded="xl"
          density="compact"
          prepend-icon="fas fa-bullhorn"
          closable
        >
          <span class="text-body-2 font-weight-medium">ประกาศ:</span>
          <span class="text-body-2 ml-1"
            >ระบบจะปิดปรับปรุงในวันที่ 15 มีนาคม 2568 เวลา 00:00–06:00 น.</span
          >
        </v-alert>

        <!-- ── Active Systems ───────── -->
        <div class="section-label mb-4">
          <div class="d-flex align-center ga-3">
            <div class="section-label-dot bg-success" />
            <span class="text-body-1 font-weight-bold">ระบบพร้อมให้บริการ</span>
            <v-chip size="x-small" color="success" variant="tonal"
              >{{ activeSystems.length }} ระบบ</v-chip
            >
          </div>
        </div>

        <v-row class="mb-2">
          <v-col
            v-for="system in activeSystems"
            :key="system.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="sys-card sys-card--active h-100"
              @click="router.push(system.route)"
            >
              <!-- Top accent bar -->
              <div
                class="sys-card-accent"
                :style="{ background: `rgb(var(--v-theme-${system.color}))` }"
              />

              <v-card-text class="pa-5 d-flex flex-column">
                <div class="d-flex justify-space-between align-start mb-4">
                  <div
                    class="sys-icon-box"
                    :style="{
                      background: `rgba(var(--v-theme-${system.color}), 0.1)`,
                    }"
                  >
                    <v-icon
                      :icon="system.icon"
                      :color="system.color"
                      size="24"
                    />
                  </div>
                  <v-chip
                    size="x-small"
                    :color="system.color"
                    variant="tonal"
                    prepend-icon="fas fa-circle"
                  >
                    พร้อมใช้งาน
                  </v-chip>
                </div>

                <!-- <div class="sys-id-label text-caption text-medium-emphasis mb-1">ระบบที่ {{ system.id }}</div> -->
                <h3
                  class="text-body-1 font-weight-bold mb-2"
                  style="
                    min-height: 3em;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  "
                >
                  {{ system.name }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-4 flex-grow-1">
                  {{ system.desc }}
                </p>

                <!-- Tags -->
                <div class="d-flex flex-wrap ga-1 mb-4">
                  <v-chip
                    v-for="tag in system.tags"
                    :key="tag"
                    size="x-small"
                    variant="tonal"
                    :color="system.color"
                    >{{ tag }}</v-chip
                  >
                </div>

                <v-btn
                  :color="system.color"
                  variant="elevated"
                  size="small"
                  rounded="lg"
                  block
                  append-icon="fas fa-arrow-right"
                  @click.stop="router.push(system.route)"
                >
                  เข้าใช้งาน
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- ── Coming Soon Systems ──── -->
        <div class="section-label mt-8 mb-4">
          <div class="d-flex align-center ga-3">
            <div
              class="section-label-dot"
              style="background: rgba(var(--v-theme-on-surface), 0.2)"
            />
            <span class="text-body-1 font-weight-bold text-medium-emphasis"
              >ไม่มีสิทธิการเข้าถึง</span
            >
            <v-chip size="x-small" color="grey" variant="tonal"
              >{{ inactiveSystems.length }} ระบบ</v-chip
            >
          </div>
          <p class="text-caption text-medium-emphasis mt-1 ml-4">
            หากต้องการใช้งาน ให้ท่านยื่นคำขอการใช้งานก่อน
          </p>
        </div>

        <v-row>
          <v-col
            v-for="system in inactiveSystems"
            :key="system.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="sys-card sys-card--disabled h-100">
              <v-card-text class="pa-5 d-flex flex-column">
                <div class="d-flex justify-space-between align-start mb-4">
                  <div
                    class="sys-icon-box"
                    style="background: rgba(var(--v-border-color), 0.08)"
                  >
                    <v-icon
                      :icon="system.icon"
                      color="medium-emphasis"
                      size="22"
                    />
                  </div>
                  <v-chip
                    size="x-small"
                    color="grey"
                    variant="outlined"
                    prepend-icon="fas fa-ban"
                  >
                    ไม่มีสิทธิการเข้าถึง
                  </v-chip>
                </div>

                <!-- <div class="sys-id-label text-caption text-medium-emphasis mb-1">ระบบที่ {{ system.id }}</div> -->
                <h3
                  class="text-body-2 font-weight-bold text-medium-emphasis mb-2"
                >
                  {{ system.name }}
                </h3>
                <p class="text-caption text-disabled mb-4 flex-grow-1">
                  {{ system.desc }}
                </p>

                <div v-if="system.noAccess" class="coming-soon-bar coming-soon-bar--noaccess">
                  <v-icon icon="fas fa-ban" size="12" class="mr-1" />
                  <span class="text-caption">กลุ่มนี้ยังไม่ได้รับสิทธิ์ — ยื่นคำขอเพิ่มสิทธิ์</span>
                </div>
                <div v-else class="coming-soon-bar">
                  <v-icon icon="fas fa-clock" size="12" class="mr-1" />
                  <span class="text-caption">{{ system.eta }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         FOOTER
    ══════════════════════════════════════════ -->
    <div class="portal-footer">
      <div
        class="portal-body-inner d-flex flex-column flex-sm-row align-center justify-space-between ga-2"
      >
        <p class="text-caption text-medium-emphasis mb-0">
          © 2568 กรมวิชาการเกษตร · Department of Agriculture ·
          กระทรวงเกษตรและสหกรณ์
        </p>
        <div class="d-flex ga-3">
          <a
            class="text-caption text-medium-emphasis portal-footer-link"
            href="#"
            >นโยบายความเป็นส่วนตัว</a
          >
          <a
            class="text-caption text-medium-emphasis portal-footer-link"
            href="#"
            >ติดต่อสอบถาม</a
          >
          <a
            class="text-caption text-medium-emphasis portal-footer-link"
            href="#"
            >v1.0.0</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();
const sessionStore = useSessionStore();

const initialMode =
  (route.query.mode as string) === "admin"
    ? "admin"
    : (route.query.mode as string) === "user"
      ? "user"
      : "staff";
const mode = ref<"staff" | "user" | "admin">(initialMode);

const entityType = computed(
  () => (route.query.entityType as string) || "personal",
);
const personalName = computed(() => (route.query.personalName as string) || "");
const companyName = computed(() => (route.query.companyName as string) || "");
const groupName = computed(() => (route.query.groupName as string) || "");
const groupId = computed(() => (route.query.groupId as string) || "");
const groupSystems = computed(() => {
  const raw = route.query.groupSystems as string;
  return raw ? raw.split(",").map((s) => s.trim()) : [];
});

// sync session store when entering portal
watch(
  () => [entityType.value, personalName.value, companyName.value, groupName.value, groupId.value, groupSystems.value] as const,
  ([type, pName, cName, gName, gId, gSystems]) => {
    if (mode.value === "user") {
      const name =
        type === "juristic" ? cName : type === "group" ? gName : pName;
      sessionStore.setContext(
        type as "personal" | "juristic" | "group",
        name,
        type === "group" ? (gId as string) : "",
        type === "group" ? (gSystems as string[]) : [],
      );
    }
  },
  { immediate: true },
);

const isGroupMode = computed(
  () => mode.value === "user" && entityType.value === "group",
);

const heroStats = [
  {
    label: "คำขอที่รอดำเนินการ",
    value: "3",
    icon: "fas fa-file-pen",
    badge: "ใหม่",
    badgeColor: "warning",
  },
  {
    label: "ใบรับรองที่มีผล",
    value: "12",
    icon: "fas fa-certificate",
    badge: null,
    badgeColor: "",
  },
  {
    label: "ใบรับรองใกล้หมดอายุ",
    value: "1",
    icon: "fas fa-triangle-exclamation",
    badge: "แจ้งเตือน",
    badgeColor: "error",
  },
];

const user = {
  name: "นิธิพร เทิบจันทึก",
  role: "เจ้าหน้าที่วิชาการเกษตร",
  dept: "กองพัฒนาระบบและรับรองมาตรฐานสินค้าพืช",
  email: "nitiporn@doa.go.th",
};

const currentDate = computed(() =>
  new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }),
);

interface SystemItem {
  id: number;
  name: string;
  desc: string;
  icon: string;
  color: string;
  active: boolean;
  route: string;
  tags?: string[];
  eta?: string;
  noAccess?: boolean;
}

const systems = computed<SystemItem[]>(() => [
  {
    id: 1,
    name: "ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices)",
    desc: "ยื่นคำขอ ตรวจประเมิน และออกใบรับรองมาตรฐาน GAP ให้แก่เกษตรกรหรือผู้ประกอบการ",
    icon: "fas fa-seedling",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "gap-staff"
          : "gap-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/gap/admin/dashboard"
        : mode.value === "staff"
          ? "/gap/staff/dashboard"
          : "/gap/user/dashboard",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["จัดการคำขอ", "ตรวจแปลง", "ออกใบรับรอง"]
          : ["ยื่นคำขอ", "ติดตามสถานะ", "ใบรับรอง"],
  },
  {
    id: 2,
    name: "ระบบการรับรองมาตรฐาน ORG (Organic Agricultural)",
    desc: "ยื่นคำขอ ตรวจประเมิน และออกใบรับรองมาตรฐานเกษตรอินทรีย์ให้แก่แหล่งผลิต",
    icon: "fas fa-leaf",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "org-staff"
          : "org-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/org/admin/dashboard"
        : mode.value === "staff"
          ? "/org/staff/dashboard"
          : "/org/user/dashboard",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["ตรวจเอกสาร", "นัดตรวจแปลง", "รายงานผล"]
          : ["ยื่นคำขอ", "ติดตามสถานะ", "ใบรับรอง ORG"],
  },
  {
    id: 3,
    name: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช DOA",
    desc: "ยื่นคำขอ ตรวจสอบ และอนุมัติการขึ้นทะเบียนโรงงานผลิตหรือแปรรูปสินค้าพืชกับกรมวิชาการเกษตร",
    icon: "fas fa-industry",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "doa-staff"
          : "doa-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/doa/admin/dashboard"
        : mode.value === "staff"
          ? "/doa/staff/dashboard"
          : "/doa/user/dashboard",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["ตรวจเอกสาร", "นัดตรวจโรงงาน", "รายงานผล"]
          : ["ยื่นคำขอ", "ติดตามสถานะ", "ทะเบียนโรงงาน"],
  },
  {
    id: 4,
    name: "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body)",
    desc: "ยื่นคำขอและบริหารจัดการการขึ้นทะเบียนหน่วยรับรองที่ทำหน้าที่ตรวจประเมินโรงงานผลิตสินค้าพืช",
    icon: "fas fa-certificate",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "cb-staff"
          : "cb-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/cb/admin/dashboard"
        : mode.value === "staff"
          ? "/cb/staff/dashboard"
          : "/cb/user/dashboard",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["ตรวจเอกสาร", "ตรวจประเมิน CB", "รายงานผล"]
          : ["ยื่นคำขอขึ้นทะเบียน", "ติดตามสถานะ", "ใบรับรอง CB"],
  },
  {
    id: 5,
    name: "ระบบจดทะเบียนผู้ส่งออก",
    desc: "ยื่นคำขอและขึ้นทะเบียนเป็นผู้ส่งออกสินค้าพืชกับกรมวิชาการเกษตร",
    icon: "fas fa-ship",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "export-staff"
          : "export-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/export/admin/dashboard"
        : mode.value === "staff"
          ? "/export/staff/dashboard"
          : "/export/user/dashboard",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["ตรวจเอกสาร", "ตรวจสอบทะเบียน", "รายงานผล"]
          : ["จดทะเบียน", "ติดตามสถานะ", "ใบอนุญาตส่งออก"],
  },
  {
    id: 6,
    name: "ระบบออกใบรับรองสุขอนามัยพืช (Health Certificate) ตามประกาศพืชควบคุมเฉพาะ",
    desc: "ยื่นคำขอ ตรวจสอบ และออกใบรับรองสุขอนามัยพืชสำหรับพืชควบคุมเฉพาะ",
    icon: "fas fa-virus",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "hc-staff"
          : "hc-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/hc/admin/dashboard"
        : mode.value === "staff"
          ? "/hc/staff"
          : "/hc/user",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["ตรวจสอบคำขอ", "ตรวจ Lab", "ลงนาม"]
          : ["ขอใบรับรอง", "ติดตามสถานะ", "ดาวน์โหลด"],
  },
  {
    id: 7,
    name: "ระบบออกใบรับรองสุขอนามัยพืช (Health Certificate) สินค้าแปรรูปด้านพืช",
    desc: "ยื่นคำขอและออกใบรับรองสุขอนามัยพืชสำหรับสินค้าแปรรูปด้านพืชเพื่อการส่งออก",
    icon: "fas fa-file-medical",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "hcex-staff"
          : "hcex-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/hcex/admin/dashboard"
        : mode.value === "staff"
          ? "/hcex/staff/dashboard"
          : "/hcex/user/dashboard",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["ตรวจสอบคำขอ", "พิจารณา Lab", "ลงนาม"]
          : ["ยื่นคำขอ", "เลือกผล Lab", "ดาวน์โหลดใบรับรอง"],
  },
  {
    id: 8,
    name: "ระบบการควบคุมพิเศษระบบบัญชีรายชื่อโรงคัดบรรจุ (Establishment List)",
    desc: "บริหารจัดการบัญชีรายชื่อโรงคัดบรรจุที่ได้รับการอนุญาตสำหรับการส่งออกสินค้า",
    icon: "fas fa-warehouse",
    color:
      mode.value === "admin"
        ? "admin"
        : mode.value === "staff"
          ? "el-staff"
          : "el-user",
    active: true,
    route:
      mode.value === "admin"
        ? "/el/admin/dashboard"
        : mode.value === "staff"
          ? "/el/staff/dashboard"
          : "/el/user/dashboard",
    tags:
      mode.value === "admin"
        ? ["จัดการผู้ใช้", "ตั้งค่าระบบ", "รายงาน"]
        : mode.value === "staff"
          ? ["ตรวจเอกสาร", "นัดตรวจแปลง", "บันทึกผล"]
          : ["ยื่นคำขอ", "ติดตามสถานะ", "ใบทะเบียน EL"],
  },
]);

// Map system id → systems key used in group.systems
const groupSystemKey: Record<number, string> = { 1: "GAP", 2: "ORG" };

const activeSystems = computed(() => {
  if (isGroupMode.value) {
    return systems.value.filter((s) => {
      if (s.id !== 1 && s.id !== 2) return false;
      const key = groupSystemKey[s.id];
      return groupSystems.value.includes(key);
    });
  }
  return systems.value.filter((s) => s.active);
});

const inactiveSystems = computed(() => {
  if (isGroupMode.value) {
    return [1, 2]
      .filter((id) => {
        const key = groupSystemKey[id];
        return !groupSystems.value.includes(key);
      })
      .map((id) => {
        const base = systems.value.find((s) => s.id === id)!;
        return { ...base, active: false, noAccess: true, eta: "ไม่มีสิทธิ์เข้าถึง" };
      });
  }
  return systems.value.filter((s) => !s.active);
});
</script>

<style scoped>
/* ─── Root ─── */
.portal-root {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

/* ─── Top Bar ─── */
.portal-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgb(var(--v-theme-primary));
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
/* Dark: primary = #A5D6A7 (เขียวอ่อนมาก) — ใช้ opacity ต่ำบน dark bg ให้ได้โทนเขียวเข้ม */
.is-dark .portal-topbar {
  background: rgba(var(--v-theme-primary), 0.18);
}

.portal-topbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
}

.topbar-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-pill {
  padding: 6px 10px 6px 6px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background 0.15s;
}
.user-pill:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar-sm {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.user-avatar-md {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  flex-shrink: 0;
}

.notif-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(var(--v-theme-error));
  border: 1.5px solid transparent;
}

/* ─── Hero ─── */
.portal-hero {
  /* Light: primary (#4CAF6E) → rgba ที่ 70% ให้ gradient เขียวเข้ม→เขียวอ่อน */
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.65) 100%
  );
  padding: 36px 24px 48px;
  position: relative;
  overflow: hidden;
}

/* Dark: primary = #A5D6A7 (เขียวอ่อน) ต้องการ bg เข้มพอสำหรับ text ขาว
   ใช้ dark overlay ทับ gradient เขียว → ได้โทนเขียวเข้มที่อ่านออก */
.is-dark .portal-hero {
  background:
    linear-gradient(rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.7)),
    linear-gradient(
      135deg,
      rgb(var(--v-theme-primary)) 0%,
      rgba(var(--v-theme-primary), 0.55) 100%
    );
}

.portal-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 90% 50%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 10% 80%,
      rgba(255, 255, 255, 0.06) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.portal-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-stat-card {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  padding: 14px 18px;
  min-width: 140px;
  backdrop-filter: blur(6px);
}

/* ─── Body ─── */
.portal-body {
  flex: 1;
  padding: 36px 24px;
}

.portal-body-inner {
  max-width: 1200px;
  margin: 0 auto;
}

/* ─── Section Labels ─── */
.section-label-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ─── System Cards ─── */
.sys-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.sys-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.sys-card--active {
  cursor: pointer;
}

.sys-card--active:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.1) !important;
}

.sys-card--disabled {
  cursor: default;
  opacity: 0.65;
}

.sys-icon-box {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sys-id-label {
  font-size: 11px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.coming-soon-bar {
  display: flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 8px;
  background: rgba(var(--v-border-color), 0.06);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  color: rgba(var(--v-theme-on-surface), 0.45);
  font-size: 12px;
}
.coming-soon-bar--noaccess {
  background: rgba(var(--v-theme-error), 0.06);
  border-color: rgba(var(--v-theme-error), 0.2);
  color: rgba(var(--v-theme-error), 0.75);
}

/* ─── Footer ─── */
.portal-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface-variant), 0.4);
}

.portal-footer-link {
  text-decoration: none;
  transition: color 0.15s;
}
.portal-footer-link:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

/* ─── Mode Toggle ─── */
.mode-toggle-group {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 3px;
  gap: 2px;
}
.mode-btn {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s,
    color 0.18s;
  white-space: nowrap;
}
.mode-btn:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}
.mode-btn--active {
  background: rgba(255, 255, 255, 0.22) !important;
  color: white !important;
}
</style>
