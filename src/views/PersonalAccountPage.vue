<template>
  <div class="poa-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- Top bar -->
    <div class="poa-topbar">
      <div class="poa-topbar-inner">
        <div class="d-flex align-center ga-3">
          <div class="topbar-logo">
            <v-icon icon="fas fa-leaf" size="18" color="white" />
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
        <div class="d-flex align-center ga-2">
          <v-btn
            variant="text"
            size="small"
            style="color: rgba(255, 255, 255, 0.8)"
            :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
            @click="themeStore.toggle()"
          >
            {{ themeStore.isDark ? "โหมดสว่าง" : "โหมดมืด" }}
          </v-btn>
          <div class="user-pill d-flex align-center ga-2">
            <div class="d-none d-sm-block">
              <div
                class="text-caption font-weight-semibold text-white lh-tight"
              >
                {{ currentThaiDInfo.nameTh }}
              </div>
              <div
                class="text-caption"
                style="
                  color: rgba(255, 255, 255, 0.55);
                  line-height: 1.2;
                  font-size: 10px;
                "
              >
                บุคคลธรรมดา
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="poa-body">
      <div class="poa-body-inner">
        <!-- Back + heading -->
        <div class="d-flex align-center ga-3 mb-6">
          <v-btn
            icon="fas fa-arrow-left"
            variant="tonal"
            size="small"
            rounded="lg"
            @click="router.back()"
          />
          <div>
            <h1 class="page-title mb-0">จัดการบัญชีส่วนตัว</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              ข้อมูลส่วนตัวที่ดึงจาก ThaiD และการจัดการบัญชี
            </p>
          </div>
        </div>

        <!-- User summary card -->
        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
          <v-card-text class="pa-4">
            <div class="d-flex align-center ga-3">
              <div
                class="flex-shrink-0"
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 10px;
                  background: rgba(var(--v-theme-success), 0.12);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <v-icon icon="fas fa-id-card" size="18" color="success" />
              </div>
              <div class="flex-grow-1">
                <div class="text-body-1 font-weight-bold">
                  {{ currentThaiDInfo.nameTh }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ currentThaiDInfo.nameEn }}
                </div>
              </div>
              <v-chip
                size="small"
                color="success"
                variant="tonal"
                prepend-icon="fas fa-circle-check"
              >
                เชื่อมต่อ ThaiD แล้ว
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Tabs -->
        <v-tabs v-model="activeTab" color="success" class="mb-5">
          <v-tab value="info">
            <v-icon start icon="fas fa-id-card" size="14" />
            ข้อมูลส่วนตัว
          </v-tab>
          <v-tab value="contact">
            <v-icon start icon="fas fa-address-book" size="14" />
            ข้อมูลติดต่อ
          </v-tab>
        </v-tabs>

        <!-- ── Tab: ข้อมูลส่วนตัว (ThaiD) ── -->
        <template v-if="activeTab === 'info'">
          <!-- ThaiD data card -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-database" color="success" size="15" />
                  <span class="text-body-2 font-weight-bold">
                    ข้อมูลจากระบบ ThaiD (กรมการปกครอง)
                  </span>
                </div>
                <div class="d-flex align-center ga-2">
                  <span class="text-caption text-medium-emphasis">
                    อัปเดตล่าสุด: {{ currentThaiDInfo.updatedAt }}
                  </span>
                  <v-chip
                    size="x-small"
                    color="success"
                    variant="tonal"
                    prepend-icon="fas fa-circle-check"
                  >
                    ยืนยันแล้ว
                  </v-chip>
                </div>
              </div>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="dbd-label">เลขประจำตัวประชาชน</div>
                  <div class="dbd-value">{{ currentThaiDInfo.idCard }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label">วันเกิด</div>
                  <div class="dbd-value">{{ currentThaiDInfo.dob }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label mt-3">ชื่อ-นามสกุล (ภาษาไทย)</div>
                  <div class="dbd-value">{{ currentThaiDInfo.nameTh }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label mt-3">ชื่อ-นามสกุล (ภาษาอังกฤษ)</div>
                  <div class="dbd-value">{{ currentThaiDInfo.nameEn }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label mt-3">เพศ</div>
                  <div class="dbd-value">{{ currentThaiDInfo.gender }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label mt-3">สัญชาติ</div>
                  <div class="dbd-value">
                    {{ currentThaiDInfo.nationality }}
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="dbd-label mt-3">ที่อยู่ตามบัตรประชาชน</div>
                  <div class="dbd-value">{{ currentThaiDInfo.address }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ThaiD refresh request section -->
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <span class="text-body-1 font-weight-bold"
                >คำขออัปเดตข้อมูลจาก ThaiD</span
              >
              <div class="text-caption text-medium-emphasis mt-0-5">
                หากข้อมูลในบัตรประชาชนมีการเปลี่ยนแปลง
                สามารถยื่นขอให้ระบบดึงข้อมูลใหม่ได้
              </div>
            </div>
            <v-btn
              color="success"
              rounded="lg"
              prepend-icon="fas fa-rotate"
              :disabled="hasPendingThaiDRequest"
              @click="thaidRefreshConfirmDialog = true"
            >
              ยื่นขอดึงข้อมูลจาก ThaiD ใหม่
            </v-btn>
          </div>

          <v-alert
            v-if="hasPendingThaiDRequest"
            type="warning"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="mb-4"
            prepend-icon="fas fa-clock"
          >
            <span class="text-body-2">
              มีคำขออัปเดต ThaiD ที่รอการตรวจสอบจากเจ้าหน้าที่อยู่ —
              ไม่สามารถยื่นคำขอใหม่ได้จนกว่าจะได้รับการตรวจสอบ
            </span>
          </v-alert>

          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              v-if="thaidRefreshRequests.length === 0"
              class="pa-10 text-center"
            >
              <v-icon
                icon="fas fa-rotate"
                size="40"
                color="medium-emphasis"
                style="opacity: 0.3"
              />
              <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
                ยังไม่มีประวัติคำขออัปเดตข้อมูลจาก ThaiD
              </p>
            </div>

            <template v-else>
              <div
                v-for="(req, idx) in thaidRefreshRequests"
                :key="req.id"
                class="branch-row"
                :class="{
                  'branch-row--last': idx === thaidRefreshRequests.length - 1,
                }"
              >
                <div class="branch-icon-box flex-shrink-0">
                  <v-icon icon="fas fa-rotate" color="success" size="15" />
                </div>
                <div class="flex-grow-1 overflow-hidden">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-body-2 font-weight-medium"
                      >คำขออัปเดตข้อมูล ThaiD</span
                    >
                    <v-chip
                      size="x-small"
                      :color="
                        req.status === 'pending'
                          ? 'warning'
                          : req.status === 'approved'
                            ? 'success'
                            : 'error'
                      "
                      variant="tonal"
                      :prepend-icon="
                        req.status === 'pending'
                          ? 'fas fa-clock'
                          : req.status === 'approved'
                            ? 'fas fa-circle-check'
                            : 'fas fa-circle-xmark'
                      "
                    >
                      {{
                        req.status === "pending"
                          ? "รอตรวจสอบ"
                          : req.status === "approved"
                            ? "อนุมัติแล้ว"
                            : "ปฏิเสธแล้ว"
                      }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ยื่นเมื่อ {{ req.submittedAt }}
                    <template v-if="req.reviewedAt">
                      · ตรวจสอบเมื่อ {{ req.reviewedAt }}</template
                    >
                  </div>
                  <div
                    v-if="req.changedFields"
                    class="text-caption text-medium-emphasis mt-0-5"
                  >
                    รายการที่เปลี่ยน: {{ req.changedFields }}
                  </div>
                  <div
                    v-if="req.note"
                    class="text-caption text-medium-emphasis mt-0-5"
                  >
                    หมายเหตุ: {{ req.note }}
                  </div>
                </div>
              </div>
            </template>
          </v-card>
        </template>

        <!-- ── Tab: ข้อมูลติดต่อ ── -->
        <template v-if="activeTab === 'contact'">
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-2 mb-1">
                <v-icon icon="fas fa-address-book" color="success" size="15" />
                <span class="text-body-2 font-weight-bold">ข้อมูลติดต่อ</span>
                <v-chip
                  size="x-small"
                  color="info"
                  variant="tonal"
                  prepend-icon="fas fa-pen"
                >
                  แก้ไขได้
                </v-chip>
              </div>
              <div class="text-caption text-medium-emphasis mb-4">
                ข้อมูลนี้จะถูกดึงไปใช้อัตโนมัติในการยื่นขอใช้บริการ
              </div>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    อีเมล <span class="req">*</span>
                    <span class="field-label-en">Email</span>
                  </div>
                  <v-text-field
                    v-model="contactForm.email"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    prepend-inner-icon="fas fa-envelope"
                    placeholder="example@email.com"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    เบอร์โทรศัพท์ <span class="req">*</span>
                    <span class="field-label-en">Phone</span>
                  </div>
                  <v-text-field
                    v-model="contactForm.phone"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    prepend-inner-icon="fas fa-phone"
                    placeholder="0XX-XXX-XXXX"
                  />
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="success"
                  rounded="lg"
                  prepend-icon="fas fa-floppy-disk"
                  @click="saveContact"
                >
                  บันทึกข้อมูลติดต่อ
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </div>
    </div>

    <!-- ── ThaiD Refresh Confirm Dialog ── -->
    <v-dialog v-model="thaidRefreshConfirmDialog" max-width="640" persistent>
      <v-card rounded="xl">
        <!-- Loading state -->
        <template v-if="thaidFetchLoading">
          <v-card-text class="pa-10 text-center">
            <v-progress-circular
              indeterminate
              color="success"
              size="56"
              width="5"
              class="mb-5"
            />
            <div class="text-body-1 font-weight-bold mb-1">
              กำลังดึงข้อมูลจาก ThaiD
            </div>
            <div class="text-body-2 text-medium-emphasis">
              เชื่อมต่อกับระบบ ThaiD (กรมการปกครอง) กรุณารอสักครู่...
            </div>
          </v-card-text>
        </template>

        <!-- Comparison state -->
        <template v-else>
          <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
            <v-icon icon="fas fa-rotate" color="success" size="18" />
            ยื่นขอดึงข้อมูลจาก ThaiD ใหม่
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <div class="text-body-2 text-medium-emphasis mb-4">
              ระบบได้ดึงข้อมูลล่าสุดจาก ThaiD แล้ว
              โปรดตรวจสอบรายการที่เปลี่ยนแปลงก่อนยื่นคำขอ
            </div>

            <v-alert
              v-if="thaidChangedFields.length > 0"
              type="warning"
              variant="tonal"
              density="compact"
              rounded="lg"
              class="mb-4"
              prepend-icon="fas fa-triangle-exclamation"
            >
              พบ {{ thaidChangedFields.length }} รายการที่มีการเปลี่ยนแปลง
              (แถวที่เน้นสีเหลือง) — หากต้องการให้ระบบอัปเดตตามข้อมูลใหม่
              กรุณายื่นคำขอ
            </v-alert>

            <v-alert
              v-else
              type="success"
              variant="tonal"
              density="compact"
              rounded="lg"
              class="mb-4"
              prepend-icon="fas fa-circle-check"
            >
              ข้อมูลใน ThaiD ตรงกับข้อมูลในระบบ — ไม่มีการเปลี่ยนแปลง
            </v-alert>

            <table class="dbd-compare-table w-100">
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>ข้อมูลปัจจุบัน</th>
                  <th>ข้อมูลใหม่จาก ThaiD</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="field in thaidCompareFields"
                  :key="field.key"
                  :class="{ 'dbd-row-changed': field.changed }"
                >
                  <td class="text-caption font-weight-medium">
                    {{ field.label }}
                  </td>
                  <td class="text-caption">{{ field.current }}</td>
                  <td
                    class="text-caption"
                    :class="{ 'text-warning font-weight-bold': field.changed }"
                  >
                    {{ field.newVal }}
                    <v-icon
                      v-if="field.changed"
                      icon="fas fa-arrow-left"
                      size="10"
                      color="warning"
                      class="ml-1"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
          <v-divider />
          <v-card-actions class="pa-5 ga-2">
            <v-spacer />
            <v-btn
              variant="tonal"
              color="grey"
              rounded="lg"
              @click="thaidRefreshConfirmDialog = false"
              >ยกเลิก</v-btn
            >
            <v-btn
              color="success"
              rounded="lg"
              prepend-icon="fas fa-paper-plane"
              @click="submitThaiDRefresh"
            >
              ยื่นคำขออัปเดต
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>

    <!-- ── Save Contact Success Snackbar ── -->
    <v-snackbar
      v-model="contactSavedSnackbar"
      color="success"
      rounded="lg"
      timeout="3000"
      location="bottom right"
    >
      <v-icon icon="fas fa-circle-check" class="mr-2" />
      บันทึกข้อมูลติดต่อเรียบร้อยแล้ว
    </v-snackbar>

    <!-- ── ThaiD Refresh Submitted Dialog ── -->
    <v-dialog v-model="thaidSubmittedDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="confirm-ring confirm-ring--success mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="success" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            คำขออัปเดตข้อมูลจาก ThaiD ถูกส่งให้เจ้าหน้าที่ตรวจสอบแล้ว
            ระบบจะแจ้งผลการพิจารณาผ่านอีเมลที่ลงทะเบียนไว้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="success"
            rounded="lg"
            block
            @click="thaidSubmittedDialog = false"
          >
            รับทราบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const router = useRouter();
const themeStore = useThemeStore();

const activeTab = ref("info");

// ── ThaiD Info (current) ──
const currentThaiDInfo = ref({
  idCard: "3 1005 01234 56 7",
  nameTh: "นายสมชาย ใจดี",
  nameEn: "MR. SOMCHAI JAIDEE",
  dob: "01/01/2510",
  gender: "ชาย",
  nationality: "ไทย",
  address: "88/1 หมู่ 3 ตำบลบางกะปิ อำเภอบางกะปิ กรุงเทพมหานคร 10240",
  updatedAt: "01/04/2569",
});

// Mock "new" ThaiD data (simulates fresh pull from ThaiD)
const newThaiDInfo = {
  idCard: "3 1005 01234 56 7",
  nameTh: "นายสมชาย ใจดี",
  nameEn: "MR. SOMCHAI JAIDEE",
  dob: "01/01/2510",
  gender: "ชาย",
  nationality: "ไทย",
  address: "99/5 หมู่ 7 ตำบลลาดพร้าว เขตลาดพร้าว กรุงเทพมหานคร 10230", // เปลี่ยน
};

const thaidCompareFieldDefs = [
  { key: "idCard", label: "เลขประจำตัวประชาชน" },
  { key: "nameTh", label: "ชื่อ-นามสกุล (ภาษาไทย)" },
  { key: "nameEn", label: "ชื่อ-นามสกุล (ภาษาอังกฤษ)" },
  { key: "dob", label: "วันเกิด" },
  { key: "gender", label: "เพศ" },
  { key: "nationality", label: "สัญชาติ" },
  { key: "address", label: "ที่อยู่ตามบัตรประชาชน" },
];

const thaidCompareFields = computed(() =>
  thaidCompareFieldDefs.map((f) => ({
    key: f.key,
    label: f.label,
    current: currentThaiDInfo.value[f.key],
    newVal: newThaiDInfo[f.key],
    changed: currentThaiDInfo.value[f.key] !== newThaiDInfo[f.key],
  })),
);

const thaidChangedFields = computed(() =>
  thaidCompareFields.value.filter((f) => f.changed),
);

// ── ThaiD Refresh Requests ──
const thaidRefreshRequests = ref([
  {
    id: 1,
    submittedAt: "10/03/2569",
    reviewedAt: "12/03/2569",
    status: "approved",
    changedFields: "ที่อยู่ตามบัตรประชาชน",
    note: "อัปเดตที่อยู่ตามทะเบียนบ้านใหม่",
  },
]);
let nextReqId = 2;

const hasPendingThaiDRequest = computed(() =>
  thaidRefreshRequests.value.some((r) => r.status === "pending"),
);

// ── Dialogs ──
const thaidRefreshConfirmDialog = ref(false);
const thaidFetchLoading = ref(false);
const thaidSubmittedDialog = ref(false);

watch(thaidRefreshConfirmDialog, (val) => {
  if (val) {
    thaidFetchLoading.value = true;
    setTimeout(() => {
      thaidFetchLoading.value = false;
    }, 1400);
  }
});

function submitThaiDRefresh() {
  const changedLabels =
    thaidChangedFields.value.map((f) => f.label).join(", ") || null;
  thaidRefreshRequests.value.unshift({
    id: nextReqId++,
    submittedAt: new Date().toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    reviewedAt: null,
    status: "pending",
    changedFields: changedLabels,
    note: null,
  });
  thaidRefreshConfirmDialog.value = false;
  thaidSubmittedDialog.value = true;
}

// ── Contact form ──
const contactForm = reactive({
  email: "somchai.jaidee@example.co.th",
  phone: "081-234-5678",
  address: "",
});

const contactSavedSnackbar = ref(false);

function saveContact() {
  contactSavedSnackbar.value = true;
}
</script>

<style scoped>
/* ── Root & Topbar (shared pattern) ── */
.poa-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.poa-topbar {
  background: linear-gradient(135deg, #1a6b36 0%, #2e7d52 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  position: sticky;
  top: 0;
  z-index: 100;
}

.poa-topbar-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-pill {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 4px 10px;
}

.poa-body {
  flex: 1;
  padding: 32px 16px 64px;
}

.poa-body-inner {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.2;
}

/* ── Cards ── */
.section-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* ── Branch rows (shared for request list) ── */
.branch-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.07);
  transition: background 0.15s;
}
.branch-row:hover {
  background: rgba(var(--v-theme-on-surface), 0.03);
}
.branch-row--last {
  border-bottom: none;
}

.branch-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(var(--v-theme-success), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Field labels ── */
.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.field-label-en {
  font-weight: 400;
  opacity: 0.55;
}
.req {
  color: rgb(var(--v-theme-error));
  font-size: 0.9em;
}

/* ── DBD info display ── */
.dbd-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.55);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.dbd-value {
  font-size: 0.88rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  margin-top: 2px;
}

/* ── Compare table ── */
.dbd-compare-table {
  border-collapse: collapse;
  font-size: 0.82rem;
  width: 100%;
}
.dbd-compare-table th {
  background: rgba(var(--v-theme-on-surface), 0.05);
  font-weight: 600;
  padding: 8px 10px;
  text-align: left;
  border-bottom: 2px solid rgba(var(--v-theme-on-surface), 0.1);
}
.dbd-compare-table td {
  padding: 7px 10px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.07);
  vertical-align: top;
}
.dbd-row-changed {
  background: rgba(255, 193, 7, 0.1);
}
.text-warning {
  color: rgb(var(--v-theme-warning)) !important;
}

/* ── Confirm ring ── */
.confirm-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-ring--success {
  background: rgba(var(--v-theme-success), 0.12);
  border: 2px solid rgba(var(--v-theme-success), 0.3);
}

/* ── Dark mode adjustments ── */
.is-dark .section-card {
  border-color: rgba(255, 255, 255, 0.08);
}
.is-dark .branch-row {
  border-color: rgba(255, 255, 255, 0.07);
}
.is-dark .dbd-compare-table th {
  background: rgba(255, 255, 255, 0.06);
}
.is-dark .dbd-compare-table td {
  border-color: rgba(255, 255, 255, 0.07);
}
.is-dark .dbd-row-changed {
  background: rgba(255, 193, 7, 0.08);
}
</style>
