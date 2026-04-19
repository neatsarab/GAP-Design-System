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
            <div class="text-body-2 font-weight-bold text-white lh-tight">
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
                  <v-icon icon="fas fa-user" size="14" />
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
                    <v-icon icon="fas fa-user" size="20" />
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
                  prepend-icon="fas fa-right-from-bracket"
                  title="ออกจากระบบ"
                  rounded="lg"
                  base-color="error"
                  @click="goToLogin"
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
              <v-chip size="x-small" color="white" variant="outlined">
                <v-icon start icon="fas fa-shield-halved" size="10" />
                {{ user.role }}
              </v-chip>
              <v-chip size="x-small" color="white" variant="outlined">
                <v-icon start icon="fas fa-building" size="10" />
                {{ user.dept }}
              </v-chip>
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
            >ระบบจะปิดปรับปรุงในวันที่ 15 มีนาคม 2569 เวลา 00:00–06:00 น.</span
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
              @click="goToSystem(system.route)"
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
                <!-- <p class="text-body-2 text-medium-emphasis mb-4 flex-grow-1">
                  {{ system.desc }}
                </p> -->

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
                  @click.stop="goToSystem(system.route)"
                >
                  เข้าใช้งาน
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- ── No Access Systems ──── -->
        <div v-if="inactiveSystems.length > 0" class="section-label mt-8 mb-4">
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
            หากต้องการใช้งาน ให้ท่านติดต่อผู้ดูแลระบบ
          </p>
        </div>

        <v-row v-if="inactiveSystems.length > 0">
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

                <h3
                  class="text-body-2 font-weight-bold text-medium-emphasis mb-2"
                >
                  {{ system.name }}
                </h3>
                <!-- <p class="text-caption text-disabled mb-4 flex-grow-1">
                  {{ system.desc }}
                </p> -->

                <div class="coming-soon-bar">
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
          © 2569 กรมวิชาการเกษตร · Department of Agriculture ·
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

<script setup>
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";
import { useSessionStore } from "@/stores/session.store";

const router = useRouter();
const themeStore = useThemeStore();
const sessionStore = useSessionStore();

function goToLogin() {
  sessionStore.clearSession();
  router.push({ name: "Login" });
}

function goToSystem(systemRoute) {
  router.push(systemRoute);
}

const heroStats = [
  {
    label: "คำขอรอพิจารณา",
    value: "8",
    icon: "fas fa-file-pen",
    badge: "ใหม่",
    badgeColor: "warning",
  },
  {
    label: "นัดหมายตรวจแปลง",
    value: "5",
    icon: "fas fa-calendar-check",
    badge: null,
    badgeColor: "",
  },
  {
    label: "รออนุมัติ",
    value: "3",
    icon: "fas fa-hourglass-half",
    badge: "ด่วน",
    badgeColor: "error",
  },
];

const user = {
  name: "นิธิพร เทิบจันทึก",
  role: "เจ้าหน้าที่วิชาการเกษตร",
  dept: "กองพัฒนาระบบและรับรองมาตรฐานสินค้าพืช",
  email: "nitiporn@doa.go.th",
};

const currentDate = new Date().toLocaleDateString("th-TH", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

const systems = [
  {
    id: 1,
    name: "ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) พืช",
    desc: "ตรวจประเมิน พิจารณา และออกใบรับรองมาตรฐาน GAP ให้แก่เกษตรกรหรือผู้ประกอบการ",
    icon: "fas fa-seedling",
    color: "gap-staff",
    active: true,
    route: { name: "staffDashboard" },
    tags: ["ตรวจประเมิน", "พิจารณาคำขอ", "ออกใบรับรอง"],
  },
  {
    id: 2,
    name: "ระบบการรับรองมาตรฐาน ORG (Organic Agriculture) พืช",
    desc: "ตรวจประเมิน พิจารณา และออกใบรับรองมาตรฐานเกษตรอินทรีย์ให้แก่แหล่งผลิต",
    icon: "fas fa-leaf",
    color: "org-staff",
    active: true,
    route: { name: "ORGStaffDashboard" },
    tags: ["ตรวจประเมิน", "พิจารณาคำขอ", "ออกใบรับรอง"],
  },
  {
    id: 3,
    name: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)",
    desc: "ตรวจสอบ พิจารณา และอนุมัติการขึ้นทะเบียนโรงงานผลิตหรือแปรรูปสินค้าพืชกับกรมวิชาการเกษตร",
    icon: "fas fa-industry",
    color: "doa-staff",
    active: true,
    route: { name: "DOAStaffDashboard" },
    tags: ["ตรวจสอบ", "พิจารณาคำขอ", "ออกใบทะเบียน"],
  },
  {
    id: 4,
    name: "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body : CB)",
    desc: "ตรวจสอบและบริหารจัดการการขึ้นทะเบียนหน่วยรับรองที่ทำหน้าที่ตรวจประเมินโรงงานผลิตสินค้าพืช",
    icon: "fas fa-certificate",
    color: "cb-staff",
    active: true,
    route: { name: "CBStaffDashboard" },
    tags: ["ตรวจสอบ", "พิจารณาคำขอ", "ออกใบทะเบียน"],
  },
  {
    id: 5,
    name: "ระบบจดทะเบียนผู้ส่งออก",
    desc: "ตรวจสอบและพิจารณาคำขอขึ้นทะเบียนเป็นผู้ส่งออกสินค้าพืชกับกรมวิชาการเกษตร",
    icon: "fas fa-ship",
    color: "export-staff",
    active: true,
    route: { name: "ExportStaffDashboard" },
    tags: ["ตรวจสอบ", "พิจารณาคำขอ", "ออกใบทะเบียน"],
  },
  {
    id: 6,
    name: "ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ",
    desc: "ตรวจสอบและออกใบรับรองสุขอนามัย สำหรับพืชควบคุมเฉพาะ",
    icon: "fas fa-virus",
    color: "hc-staff",
    active: true,
    route: { name: "HCstaffDashboard" },
    tags: ["ตรวจสอบ", "พิจารณาคำขอ", "ออกใบรับรอง"],
  },
  {
    id: 7,
    name: "ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช",
    desc: "ตรวจสอบและออกใบรับรองสุขอนามัย สำหรับสินค้าแปรรูปด้านพืชเพื่อการส่งออก",
    icon: "fas fa-file-medical",
    color: "hcex-staff",
    active: true,
    route: { name: "HCEXstaffDashboard" },
    tags: ["ตรวจสอบ", "พิจารณาคำขอ", "ออกใบรับรอง"],
  },
  {
    id: 8,
    name: "ระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment List: EL)",
    desc: "บริหารจัดการบัญชีรายชื่อโรงคัดบรรจุที่ได้รับการอนุญาตสำหรับการส่งออกสินค้า",
    icon: "fas fa-warehouse",
    color: "el-staff",
    active: true,
    route: { name: "ELStaffDashboard" },
    tags: ["ตรวจสอบ", "พิจารณาคำขอ", "บัญชีรายชื่อ"],
  },
];

const activeSystems = systems.filter((s) => s.active);
const inactiveSystems = systems.filter((s) => !s.active);
</script>
