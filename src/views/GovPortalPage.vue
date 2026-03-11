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
            <div class="text-body-2 font-weight-bold text-white" style="line-height:1.2">กรมวิชาการเกษตร</div>
            <div class="text-caption" style="color:rgba(255,255,255,0.6);line-height:1.2">Department of Agriculture</div>
          </div>
        </div>

        <v-spacer />

        <!-- Right: time + notification + user -->
        <div class="d-flex align-center ga-2">
          <!-- Clock -->
          <div class="topbar-time d-none d-sm-flex align-center ga-2">
            <v-icon icon="fas fa-calendar" size="13" style="color:rgba(255,255,255,0.6)" />
            <span class="text-caption" style="color:rgba(255,255,255,0.75)">{{ currentDate }}</span>
          </div>

          <v-divider vertical class="mx-1" style="opacity:0.2;height:40px" />

          <!-- Mode toggle -->
          <div class="mode-toggle-group d-flex align-center">
            <button
              class="mode-btn"
              :class="{ 'mode-btn--active': mode === 'officer' }"
              @click="mode = 'officer'"
            >
              <v-icon icon="fas fa-user-tie" size="12" class="mr-1" />
              เจ้าหน้าที่
            </button>
            <button
              class="mode-btn"
              :class="{ 'mode-btn--active': mode === 'user' }"
              @click="mode = 'user'"
            >
              <v-icon icon="fas fa-user" size="12" class="mr-1" />
              ผู้ใช้งาน
            </button>
          </div>

          <v-divider vertical class="mx-1" style="opacity:0.2;height:40px" />

          <!-- Dark mode toggle -->
          <v-btn
            icon
            variant="text"
            size="small"
            style="color:rgba(255,255,255,0.8)"
            @click="themeStore.toggle()"
          >
            <v-icon :icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'" size="16" />
            <v-tooltip activator="parent" location="bottom">
              {{ themeStore.isDark ? 'โหมดสว่าง' : 'โหมดมืด' }}
            </v-tooltip>
          </v-btn>

          <!-- Notification bell -->
          <v-btn
            icon
            variant="text"
            size="small"
            style="color:rgba(255,255,255,0.8)"
            class="position-relative"
          >
            <v-icon icon="fas fa-bell" size="16" />
            <span class="notif-dot" />
            <v-tooltip activator="parent" location="bottom">แจ้งเตือน (2)</v-tooltip>
          </v-btn>

          <!-- User menu -->
          <v-menu location="bottom end" :offset="8">
            <template #activator="{ props }">
              <div class="user-pill d-flex align-center ga-2" v-bind="props">
                <div class="user-avatar-sm">
                  <span class="text-caption font-weight-bold">นส</span>
                </div>
                <div class="d-none d-sm-block">
                  <div class="text-caption font-weight-semibold text-white" style="line-height:1.2">{{ user.name }}</div>
                  <div class="text-caption" style="color:rgba(255,255,255,0.55);line-height:1.2;font-size:10px">{{ user.role }}</div>
                </div>
                <v-icon icon="fas fa-chevron-down" size="10" style="color:rgba(255,255,255,0.5)" />
              </div>
            </template>

            <v-card min-width="200" elevation="8" rounded="xl" class="mt-1">
              <v-card-text class="pb-2">
                <div class="d-flex align-center ga-3 mb-3">
                  <div class="user-avatar-md">
                    <span class="text-body-2 font-weight-bold">นส</span>
                  </div>
                  <div>
                    <div class="text-body-2 font-weight-bold">{{ user.name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
                  </div>
                </div>
                <v-divider class="mb-2" />
              </v-card-text>
              <v-list density="compact" nav class="pt-0 pb-2">
                <v-list-item prepend-icon="fas fa-user" title="ข้อมูลส่วนตัว" rounded="lg" />
                <v-list-item prepend-icon="fas fa-key" title="เปลี่ยนรหัสผ่าน" rounded="lg" />
                <v-divider class="my-1" />
                <v-list-item
                  prepend-icon="fas fa-right-from-bracket"
                  title="ออกจากระบบ"
                  rounded="lg"
                  base-color="error"
                  @click="router.push('/')"
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
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-6">

          <!-- Greeting -->
          <div>
            <p class="text-body-2 mb-1" style="color:rgba(255,255,255,0.65)">ยินดีต้อนรับ</p>
            <h1 class="text-h5 font-weight-bold text-white mb-1">{{ user.name }}</h1>
            <div class="d-flex align-center ga-2 flex-wrap">
              <v-chip size="x-small" color="white" variant="outlined" style="color:rgba(255,255,255,0.85)">
                <v-icon start icon="fas fa-shield-halved" size="10" />
                {{ user.role }}
              </v-chip>
              <v-chip size="x-small" color="white" variant="outlined" style="color:rgba(255,255,255,0.85)">
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
                <v-icon :icon="stat.icon" size="14" style="color:rgba(255,255,255,0.7)" />
                <span class="text-caption" style="color:rgba(255,255,255,0.65)">{{ stat.label }}</span>
              </div>
              <div class="d-flex align-center ga-2">
                <span class="text-h6 font-weight-bold text-white">{{ stat.value }}</span>
                <v-chip v-if="stat.badge" size="x-small" :color="stat.badgeColor" variant="flat">
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
          <span class="text-body-2 ml-1">ระบบจะปิดปรับปรุงในวันที่ 15 มีนาคม 2568 เวลา 00:00–06:00 น.</span>
        </v-alert>

        <!-- ── Active Systems ───────── -->
        <div class="section-label mb-4">
          <div class="d-flex align-center ga-3">
            <div class="section-label-dot bg-success" />
            <span class="text-body-1 font-weight-bold">ระบบพร้อมให้บริการ</span>
            <v-chip size="x-small" color="success" variant="tonal">{{ activeSystems.length }} ระบบ</v-chip>
          </div>
        </div>

        <v-row class="mb-2">
          <v-col
            v-for="system in activeSystems"
            :key="system.id"
            cols="12" sm="6" md="4"
          >
            <v-card
              class="sys-card sys-card--active h-100"
              @click="router.push(system.route)"
            >
              <!-- Top accent bar -->
              <div class="sys-card-accent" :style="{ background: `rgb(var(--v-theme-${system.color}))` }" />

              <v-card-text class="pa-5 d-flex flex-column">
                <div class="d-flex justify-space-between align-start mb-4">
                  <div class="sys-icon-box" :style="{ background: `rgba(var(--v-theme-${system.color}), 0.1)` }">
                    <v-icon :icon="system.icon" :color="system.color" size="24" />
                  </div>
                  <v-chip size="x-small" :color="system.color" variant="tonal" prepend-icon="fas fa-circle">
                    พร้อมใช้งาน
                  </v-chip>
                </div>

                <div class="sys-id-label text-caption text-medium-emphasis mb-1">ระบบที่ {{ system.id }}</div>
                <h3 class="text-body-1 font-weight-bold mb-2">{{ system.name }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-4 flex-grow-1">{{ system.desc }}</p>

                <!-- Tags -->
                <div class="d-flex flex-wrap ga-1 mb-4">
                  <v-chip
                    v-for="tag in system.tags"
                    :key="tag"
                    size="x-small"
                    variant="tonal"
                    :color="system.color"
                  >{{ tag }}</v-chip>
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
            <div class="section-label-dot" style="background:rgba(var(--v-theme-on-surface),0.2)" />
            <span class="text-body-1 font-weight-bold text-medium-emphasis">ไม่มีสิทธิการเข้าถึง</span>
            <v-chip size="x-small" color="grey" variant="tonal">{{ inactiveSystems.length }} ระบบ</v-chip>
          </div>
          <p class="text-caption text-medium-emphasis mt-1 ml-4">หากต้องการใช้งาน ให้ท่านยื่นคำขอการใช้งานก่อน</p>
        </div>

        <v-row>
          <v-col
            v-for="system in inactiveSystems"
            :key="system.id"
            cols="12" sm="6" md="4"
          >
            <v-card class="sys-card sys-card--disabled h-100">
              <v-card-text class="pa-5 d-flex flex-column">
                <div class="d-flex justify-space-between align-start mb-4">
                  <div class="sys-icon-box" style="background:rgba(var(--v-border-color),0.08)">
                    <v-icon :icon="system.icon" color="medium-emphasis" size="22" />
                  </div>
                  <v-chip size="x-small" color="grey" variant="outlined" prepend-icon="fas fa-hourglass-half">
                    ไม่มีสิทธิการเข้าถึง
                  </v-chip>
                </div>

                <div class="sys-id-label text-caption text-medium-emphasis mb-1">ระบบที่ {{ system.id }}</div>
                <h3 class="text-body-2 font-weight-bold text-medium-emphasis mb-2">{{ system.name }}</h3>
                <p class="text-caption text-disabled mb-4 flex-grow-1">{{ system.desc }}</p>

                <div class="coming-soon-bar">
                  <v-icon icon="fas fa-clock" size="12" class="mr-1" />
                  <span class="text-caption">เปิดให้บริการ {{ system.eta }}</span>
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
      <div class="portal-body-inner d-flex flex-column flex-sm-row align-center justify-space-between ga-2">
        <p class="text-caption text-medium-emphasis mb-0">
          © 2568 กรมวิชาการเกษตร · Department of Agriculture · กระทรวงเกษตรและสหกรณ์
        </p>
        <div class="d-flex ga-3">
          <a class="text-caption text-medium-emphasis portal-footer-link" href="#">นโยบายความเป็นส่วนตัว</a>
          <a class="text-caption text-medium-emphasis portal-footer-link" href="#">ติดต่อสอบถาม</a>
          <a class="text-caption text-medium-emphasis portal-footer-link" href="#">v1.0.0</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'

const router = useRouter()
const themeStore = useThemeStore()

const mode = ref<'officer' | 'user'>('officer')

const heroStats = [
  { label: 'คำขอที่รอดำเนินการ', value: '3', icon: 'fas fa-file-pen', badge: 'ใหม่', badgeColor: 'warning' },
  { label: 'ใบรับรองที่มีผล', value: '12', icon: 'fas fa-certificate', badge: null, badgeColor: '' },
  { label: 'ใบรับรองใกล้หมดอายุ', value: '1', icon: 'fas fa-triangle-exclamation', badge: 'แจ้งเตือน', badgeColor: 'error' },
]

const user = {
  name: 'นิธิพร เทิบจันทึก',
  role: 'เจ้าหน้าที่วิชาการเกษตร',
  dept: 'กองพัฒนาระบบและรับรองมาตรฐานสินค้าพืช',
  email: 'nitiporn@doa.go.th',
}

const currentDate = computed(() =>
  new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
)


interface SystemItem {
  id: number
  name: string
  desc: string
  icon: string
  color: string
  active: boolean
  route: string
  tags?: string[]
  eta?: string
}

const systems = computed<SystemItem[]>(() => [
  {
    id: 1,
    name: 'ระบบการรับรองมาตรฐาน GAP พืช',
    desc: 'ยื่นคำขอรับรองแหล่งผลิต ติดตามสถานะ และจัดการใบรับรอง GAP พืชครบวงจร',
    icon: 'fas fa-seedling',
    color: 'primary',
    active: true,
    route: mode.value === 'officer' ? '/officer/dashboard' : '/app/dashboard',
    tags: mode.value === 'officer' ? ['จัดการคำขอ', 'ตรวจแปลง', 'ออกใบรับรอง'] : ['ยื่นคำขอ', 'ติดตามสถานะ', 'ใบรับรอง'],
  },
  {
    id: 2,
    name: 'ระบบรับรองมาตรฐานเกษตรอินทรีย์ (ORG)',
    desc: 'ยื่นคำขอรับรองและต่ออายุมาตรฐานเกษตรอินทรีย์ ติดตามสถานะการรับรอง',
    icon: 'fas fa-leaf',
    color: 'success',
    active: false,
    route: '#',
    eta: 'ไตรมาส 1/2569',
  },
  {
    id: 3,
    name: 'ระบบออกใบรับรองสุขอนามัยพืช (HC)',
    desc: 'ออกใบรับรองสุขอนามัยพืช (Phytosanitary Certificate) สำหรับสินค้าส่งออก',
    icon: 'fas fa-file-shield',
    color: 'info',
    active: false,
    route: '#',
    eta: 'ไตรมาส 2/2569',
  },
  {
    id: 4,
    name: 'ระบบนำเข้าผลิตภัณฑ์ HC',
    desc: 'ยื่นคำขอนำเข้าผลิตภัณฑ์พืชและเอกสารสุขอนามัยพืชนำเข้า',
    icon: 'fas fa-truck-ramp-box',
    color: 'warning',
    active: false,
    route: '#',
    eta: 'ไตรมาส 2/2569',
  },
  {
    id: 5,
    name: 'ระบบจดทะเบียนผู้ส่งออก',
    desc: 'ขึ้นทะเบียน ต่ออายุ และจัดการใบอนุญาตผู้ส่งออกสินค้าเกษตร',
    icon: 'fas fa-ship',
    color: 'secondary',
    active: false,
    route: '#',
    eta: 'ไตรมาส 3/2569',
  },
  {
    id: 6,
    name: 'ระบบ DOA & CB',
    desc: 'ระบบรับรองความสามารถห้องปฏิบัติการ (CB) และบริการตรวจสอบกรมวิชาการเกษตร',
    icon: 'fas fa-flask-vial',
    color: 'error',
    active: false,
    route: '#',
    eta: 'ไตรมาส 3/2569',
  },
  {
    id: 7,
    name: 'ระบบบริหารจัดการ (Backend Admin)',
    desc: 'สำหรับผู้ดูแลระบบ — จัดการข้อมูลผู้ใช้ สิทธิ์การเข้าถึง และการตั้งค่าระบบ',
    icon: 'fas fa-screwdriver-wrench',
    color: 'primary',
    active: false,
    route: '#',
    eta: 'ไตรมาส 4/2569',
  },
])

const activeSystems = computed(() => systems.value.filter(s => s.active))
const inactiveSystems = computed(() => systems.value.filter(s => !s.active))
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
.user-pill:hover { background: rgba(255, 255, 255, 0.1); }

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
  background: linear-gradient(135deg,
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
    linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.70)),
    linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.55) 100%);

    
}

.portal-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 90% 50%, rgba(255,255,255,0.10) 0%, transparent 60%),
    radial-gradient(ellipse at 10% 80%, rgba(255,255,255,0.06) 0%, transparent 50%);
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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
  transition: background 0.18s, color 0.18s;
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
