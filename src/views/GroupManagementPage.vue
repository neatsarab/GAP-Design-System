<template>
  <div class="gm-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- Top bar -->
    <div class="gm-topbar">
      <div class="gm-topbar-inner">
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
            <div class="user-avatar-sm">
              <span class="text-caption font-weight-bold">นส</span>
            </div>
            <div class="d-none d-sm-block">
              <div
                class="text-caption font-weight-semibold text-white lh-tight"
              >
                นิธิพร เทิบจันทึก
              </div>
              <div
                class="text-caption"
                style="
                  color: rgba(255, 255, 255, 0.55);
                  line-height: 1.2;
                  font-size: 10px;
                "
              >
                ผู้ประกอบการ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="gm-body">
      <div class="gm-body-inner">
        <!-- Back + heading -->
        <div class="d-flex align-center ga-3 mb-6">
          <v-btn
            icon="fas fa-arrow-left"
            variant="tonal"
            size="small"
            rounded="lg"
            @click="router.push('/select-company')"
          />
          <div>
            <h1 class="page-title mb-0">จัดการกลุ่ม</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              เพิ่มสมาชิกและจัดการข้อมูลกลุ่ม
            </p>
          </div>
        </div>

        <!-- Group info card -->
        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
          <v-card-text class="pa-4">
            <div class="d-flex align-center ga-3">
              <div class="group-icon-box flex-shrink-0">
                <v-icon icon="fas fa-people-group" size="18" color="warning" />
              </div>
              <div class="flex-grow-1">
                <div class="d-flex align-center ga-2 flex-wrap">
                  <span class="text-body-1 font-weight-bold">{{
                    currentGroup.nameTh
                  }}</span>
                  <v-chip size="x-small" color="warning" variant="tonal">
                    {{ currentGroup.memberCount }} สมาชิก
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ currentGroup.nameEn }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  เลขทะเบียน: {{ currentGroup.regNo }}
                </div>
              </div>
              <div class="d-flex flex-wrap ga-1 d-none d-sm-flex">
                <v-chip
                  v-for="sys in currentGroup.systems"
                  :key="sys"
                  size="x-small"
                  color="warning"
                  variant="tonal"
                >
                  {{ sys }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ── Section: สมาชิก ── -->
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center ga-2">
            <span class="text-body-1 font-weight-bold">สมาชิกกลุ่ม</span>
            <v-chip size="x-small" color="warning" variant="tonal"
              >{{ members.length }} คน</v-chip
            >
          </div>
          <v-btn
            color="warning"
            rounded="lg"
            prepend-icon="fas fa-user-plus"
            @click="showAddMember = !showAddMember"
            >เพิ่มสมาชิก</v-btn
          >
        </div>

        <!-- Add member panel -->
        <v-expand-transition>
          <v-card
            v-if="showAddMember"
            rounded="xl"
            elevation="0"
            class="section-card mb-4 pa-4"
          >
            <div class="text-body-2 font-weight-bold mb-3">
              ค้นหาสมาชิกที่ต้องการเพิ่ม
            </div>

            <v-alert
              v-if="juristicInGroup"
              color="warning"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-triangle-exclamation"
              class="mb-3"
            >
              <span class="text-caption"
                >มีนิติบุคคลในกลุ่มแล้ว 1 ราย —
                ไม่สามารถเพิ่มนิติบุคคลอื่นได้อีก</span
              >
            </v-alert>

            <div class="d-flex ga-2 mb-3">
              <v-text-field
                v-model="memberSearch"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ค้นหาด้วยเลขบัตรประชาชน หรือเลขทะเบียนนิติบุคคล"
                prepend-inner-icon="fas fa-magnifying-glass"
                style="flex: 1"
                @keyup.enter="searchMember"
              />
              <v-btn
                color="warning"
                rounded="lg"
                :loading="memberLoading"
                @click="searchMember"
                >ค้นหา</v-btn
              >
            </div>

            <v-expand-transition>
              <div v-if="memberResult">
                <v-card
                  rounded="lg"
                  variant="outlined"
                  class="mb-2 pa-3 d-flex align-center ga-3"
                >
                  <v-icon
                    :icon="
                      memberResult.isJuristic
                        ? 'fas fa-building'
                        : 'fas fa-user'
                    "
                    :color="memberResult.isJuristic ? 'info' : 'success'"
                    size="16"
                  />
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">
                      {{ memberResult.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ memberResult.idNo }}
                    </div>
                  </div>
                  <v-chip
                    v-if="memberResult.isJuristic"
                    size="x-small"
                    color="info"
                    variant="tonal"
                    >นิติบุคคล</v-chip
                  >
                  <v-btn
                    size="small"
                    color="warning"
                    rounded="lg"
                    :disabled="
                      (memberResult.isJuristic && juristicInGroup) ||
                      alreadyInGroup(memberResult.idNo)
                    "
                    @click="addMember"
                    >เพิ่ม</v-btn
                  >
                </v-card>
                <div
                  v-if="memberResult.isJuristic && juristicInGroup"
                  class="text-caption text-error mb-2"
                >
                  <v-icon
                    icon="fas fa-circle-xmark"
                    size="11"
                    class="mr-1"
                  />ไม่สามารถเพิ่มนิติบุคคลซ้ำได้
                </div>
                <div
                  v-else-if="alreadyInGroup(memberResult.idNo)"
                  class="text-caption text-error mb-2"
                >
                  <v-icon
                    icon="fas fa-circle-xmark"
                    size="11"
                    class="mr-1"
                  />บุคคลนี้เป็นสมาชิกอยู่แล้ว
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </v-expand-transition>

        <!-- Member list -->
        <v-card rounded="xl" elevation="0" class="section-card mb-6">
          <div
            v-for="(member, i) in members"
            :key="member.id"
            class="member-row"
            :class="{ 'member-row--last': i === members.length - 1 }"
          >
            <div class="member-icon-box flex-shrink-0">
              <v-icon
                :icon="member.isJuristic ? 'fas fa-building' : 'fas fa-user'"
                :color="member.isJuristic ? 'info' : 'success'"
                size="16"
              />
            </div>
            <div class="flex-grow-1">
              <div class="d-flex align-center ga-2 flex-wrap">
                <span class="text-body-2 font-weight-medium">{{
                  member.name
                }}</span>
                <v-chip
                  v-if="member.id === currentLeaderId"
                  size="x-small"
                  color="warning"
                  variant="tonal"
                  prepend-icon="fas fa-star"
                  >หัวหน้ากลุ่ม</v-chip
                >
                <v-chip
                  v-if="member.id === currentGroup.creatorId"
                  size="x-small"
                  color="success"
                  variant="tonal"
                  prepend-icon="fas fa-crown"
                  >ผู้สร้างกลุ่ม</v-chip
                >
                <v-chip
                  v-if="member.isJuristic"
                  size="x-small"
                  color="info"
                  variant="tonal"
                  >นิติบุคคล</v-chip
                >
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ member.idNo }}
              </div>
            </div>
            <v-btn
              v-if="isCurrentUserCreator && member.id !== currentLeaderId"
              size="small"
              variant="tonal"
              color="warning"
              prepend-icon="fas fa-crown"
              rounded="lg"
              @click="confirmChangeLeader(member.id)"
              >ตั้งเป็นหัวหน้า</v-btn
            >
            <v-btn
              v-if="member.id !== currentLeaderId"
              size="small"
              variant="text"
              color="error"
              icon="fas fa-user-minus"
              @click="confirmRemove(i)"
            />
          </div>
        </v-card>
      </div>
    </div>
  </div>

  <!-- Confirm remove dialog -->
  <v-dialog v-model="removeDialog" max-width="400" persistent>
    <v-card rounded="xl">
      <v-card-text class="pa-6 text-center">
        <div class="confirm-icon mx-auto mb-4">
          <v-icon icon="fas fa-user-minus" size="28" color="error" />
        </div>
        <h3 class="text-body-1 font-weight-bold mb-2">นำสมาชิกออกจากกลุ่ม?</h3>
        <p v-if="removeTarget" class="text-body-2 text-medium-emphasis mb-0">
          {{ removeTarget.name }} จะถูกนำออกจากกลุ่มนี้
        </p>
      </v-card-text>
      <v-card-actions class="px-6 pb-5 ga-2">
        <v-spacer />
        <v-btn
          variant="tonal"
          color="grey"
          rounded="lg"
          @click="removeDialog = false"
          >ยกเลิก</v-btn
        >
        <v-btn color="error" rounded="lg" @click="removeMember">ยืนยัน</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirm change leader dialog -->
  <v-dialog v-model="leaderDialog" max-width="400" persistent>
    <v-card rounded="xl">
      <v-card-text class="pa-6 text-center">
        <div class="confirm-icon confirm-icon--warning mx-auto mb-4">
          <v-icon icon="fas fa-star" size="28" color="warning" />
        </div>
        <h3 class="text-body-1 font-weight-bold mb-2">
          ยืนยันการตั้งหัวหน้ากลุ่ม?
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ newLeaderName }} จะเป็นหัวหน้ากลุ่มคนใหม่
        </p>
      </v-card-text>
      <v-card-actions class="px-6 pb-5 ga-2">
        <v-spacer />
        <v-btn
          variant="tonal"
          color="grey"
          rounded="lg"
          @click="leaderDialog = false"
          >ยกเลิก</v-btn
        >
        <v-btn color="warning" rounded="lg" @click="applyChangeLeader"
          >ยืนยัน</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();

interface Member {
  id: string;
  name: string;
  idNo: string;
  isJuristic: boolean;
}

interface GroupData {
  id: string;
  nameTh: string;
  nameEn: string;
  regNo: string;
  memberCount: number;
  systems: string[];
  leaderId: string;
  creatorId: string;
  members: Member[];
}

const mockGroups: GroupData[] = [
  {
    id: "gr1",
    nameTh: "กลุ่มเกษตรกรอินทรีย์บ้านนาดี",
    nameEn: "Ban Na Di Organic Farmers Group",
    regNo: "GRP-68-0001",
    memberCount: 24,
    systems: ["ORG", "GAP"],
    leaderId: "u2",
    creatorId: "u1",
    members: [
      {
        id: "u1",
        name: "นาย สมชาย ใจดี",
        idNo: "1 1001 00001 23 4",
        isJuristic: false,
      },
      {
        id: "u2",
        name: "นาง วิมล แสงทอง",
        idNo: "1 1001 00002 34 5",
        isJuristic: false,
      },
      {
        id: "u3",
        name: "นาย ประสิทธิ์ ดีงาม",
        idNo: "1 1001 00003 45 6",
        isJuristic: false,
      },
      {
        id: "u4",
        name: "นางสาว รัตนา สวยงาม",
        idNo: "1 1001 00004 56 7",
        isJuristic: false,
      },
      {
        id: "u5",
        name: "นาย บุญมา มากดี",
        idNo: "1 1001 00005 67 8",
        isJuristic: false,
      },
    ],
  },
  {
    id: "gr2",
    nameTh: "วิสาหกิจชุมชนสวนผักปลอดภัย อ.แม่ริม",
    nameEn: "Mae Rim Safe Vegetable Community Enterprise",
    regNo: "GRP-68-0034",
    memberCount: 12,
    systems: ["GAP"],
    leaderId: "u10",
    creatorId: "u10",
    members: [
      {
        id: "u10",
        name: "นาย เชิดชัย แก้วมา",
        idNo: "1 5001 00010 11 2",
        isJuristic: false,
      },
      {
        id: "u11",
        name: "นาง สุดา พรมมา",
        idNo: "1 5001 00011 22 3",
        isJuristic: false,
      },
      {
        id: "u12",
        name: "นาย ไพรัช หินแก้ว",
        idNo: "1 5001 00012 33 4",
        isJuristic: false,
      },
      {
        id: "u13",
        name: "นางสาว กาญจนา ทองดี",
        idNo: "1 5001 00013 44 5",
        isJuristic: false,
      },
      {
        id: "u14",
        name: "นาย วินัย บุญชู",
        idNo: "1 5001 00014 55 6",
        isJuristic: false,
      },
    ],
  },
];

// Current user mock — เป็นหัวหน้าของ gr1
const currentUserId = "u1";

const groupId = computed(() => (route.query.groupId as string) ?? "gr1");
const currentGroup = computed(
  () => mockGroups.find((g) => g.id === groupId.value) ?? mockGroups[0],
);

const members = ref<Member[]>([...currentGroup.value.members]);
const currentLeaderId = ref(currentGroup.value.leaderId);

const isCurrentUserCreator = computed(
  () => currentGroup.value.creatorId === currentUserId,
);

// ── เพิ่มสมาชิก ──
const showAddMember = ref(false);
const memberSearch = ref("");
const memberLoading = ref(false);
const memberResult = ref<Member | null>(null);

const juristicInGroup = computed(() => members.value.some((m) => m.isJuristic));

function alreadyInGroup(idNo: string) {
  return members.value.some((m) => m.idNo === idNo);
}

function searchMember() {
  if (!memberSearch.value.trim()) return;
  memberLoading.value = true;
  memberResult.value = null;
  setTimeout(() => {
    memberLoading.value = false;
    const isJuristic =
      memberSearch.value.startsWith("0") && memberSearch.value.length === 13;
    memberResult.value = isJuristic
      ? {
          id: `m${Date.now()}`,
          name: "บริษัท ตัวอย่าง จำกัด",
          idNo: memberSearch.value,
          isJuristic: true,
        }
      : {
          id: `m${Date.now()}`,
          name: "นาย ตัวอย่าง ชื่อจริง",
          idNo: memberSearch.value,
          isJuristic: false,
        };
  }, 800);
}

function addMember() {
  if (!memberResult.value) return;
  if (memberResult.value.isJuristic && juristicInGroup.value) return;
  if (alreadyInGroup(memberResult.value.idNo)) return;
  members.value.push({ ...memberResult.value });
  memberResult.value = null;
  memberSearch.value = "";
}

// ── นำสมาชิกออก ──
const removeDialog = ref(false);
const removeIndex = ref(-1);
const removeTarget = computed(() =>
  removeIndex.value >= 0 ? members.value[removeIndex.value] : null,
);

function confirmRemove(i: number) {
  removeIndex.value = i;
  removeDialog.value = true;
}

function removeMember() {
  if (removeIndex.value >= 0) {
    members.value.splice(removeIndex.value, 1);
    removeIndex.value = -1;
  }
  removeDialog.value = false;
}

// ── ตั้งหัวหน้า ──
const newLeaderId = ref("");
const leaderDialog = ref(false);

const newLeaderName = computed(
  () => members.value.find((m) => m.id === newLeaderId.value)?.name ?? "",
);

function confirmChangeLeader(memberId: string) {
  newLeaderId.value = memberId;
  leaderDialog.value = true;
}

function applyChangeLeader() {
  currentLeaderId.value = newLeaderId.value;
  newLeaderId.value = "";
  leaderDialog.value = false;
}

// Lock scroll when dialog open
watch([removeDialog, leaderDialog], (values) => {
  const lock = values.some(Boolean);
  document.body.style.overflow = lock ? "hidden" : "";
  document.documentElement.style.overflow = lock ? "hidden" : "";
});
</script>

<style scoped>
.gm-root {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.gm-topbar {
  background: rgb(var(--v-theme-primary));
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
}
.is-dark .gm-topbar {
  background: rgba(var(--v-theme-primary), 0.18);
}
.gm-topbar-inner {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.topbar-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-pill {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 5px 12px 5px 6px;
}
.user-avatar-sm {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.gm-body {
  padding: 40px 20px;
}
.gm-body-inner {
  max-width: 860px;
  margin: 0 auto;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
}

.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.group-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(var(--v-theme-warning), 0.1);
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Member row */
.member-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: background 0.15s;
}
.member-row:hover {
  background: rgba(var(--v-theme-warning), 0.02);
}
.member-row--last {
  border-bottom: none;
}

.member-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(var(--v-border-color), 0.06);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Field label */
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 5px;
}
.req {
  color: rgb(var(--v-theme-error));
}

/* Confirm icon */
.confirm-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
  border: 1px solid rgba(var(--v-theme-error), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-icon--warning {
  background: rgba(var(--v-theme-warning), 0.1);
  border-color: rgba(var(--v-theme-warning), 0.2);
}
</style>
