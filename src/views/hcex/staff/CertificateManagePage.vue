<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">จัดการใบทะเบียน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขทะเบียน:
          <span class="text-hcex-staff font-weight-medium">{{
            route.params.id
          }}</span>
        </p>
      </div>
    </div>

    <v-row>
      <!-- ── Left: form ── -->
      <v-col cols="12" md="7">
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-file-pen" color="hcex-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >บันทึกการดำเนินการ</span
            >
          </div>
          <v-card-text class="pa-5">
            <!-- การดำเนินการ -->
            <div class="field-label mb-1">
              <div>การดำเนินการ</div>
              <div class="field-label-en">Action</div>
            </div>
            <v-radio-group
              v-model="form.action"
              color="hcex-staff"
              inline
              class="mb-2"
            >
              <v-radio value="active" class="mr-6">
                <template #label>
                  <div class="d-flex align-center ga-2">
                    <v-icon
                      icon="fas fa-circle-check"
                      color="success"
                      size="18"
                    />
                    <span class="font-weight-medium">มีผล</span>
                  </div>
                </template>
              </v-radio>
              <v-radio value="suspend" class="mr-6">
                <template #label>
                  <div class="d-flex align-center ga-2">
                    <v-icon
                      icon="fas fa-circle-pause"
                      color="warning"
                      size="18"
                    />
                    <span class="font-weight-medium">ระงับ</span>
                  </div>
                </template>
              </v-radio>
              <v-radio value="suspend_temp" class="mr-6">
                <template #label>
                  <div class="d-flex align-center ga-2">
                    <v-icon icon="fas fa-clock" color="info" size="18" />
                    <span class="font-weight-medium">พักใช้</span>
                  </div>
                </template>
              </v-radio>
              <v-radio value="revoke">
                <template #label>
                  <div class="d-flex align-center ga-2">
                    <v-icon icon="fas fa-ban" color="error" size="18" />
                    <span class="font-weight-medium">เพิกถอน</span>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>

            <!-- วันที่เริ่มต้น / วันที่สิ้นสุด (เฉพาะ เพิกถอน) -->
            <template v-if="form.action === 'revoke'">
              <v-row dense class="mt-2">
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    <div>วันที่เริ่มต้น</div>
                    <div class="field-label-en">Start Date</div>
                  </div>
                  <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    min-width="0"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="startDateBE"
                        variant="outlined"
                        density="compact"
                        rounded="lg"
                        hide-details
                        readonly
                        placeholder="วว/ดด/ปปปป"
                        prepend-inner-icon="fas fa-calendar"
                      />
                    </template>
                    <v-date-picker
                      v-model="form.startDate"
                      hide-header
                      locale="th"
                      @update:model-value="startDateMenu = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1">
                    <div>วันที่สิ้นสุด</div>
                    <div class="field-label-en">End Date</div>
                  </div>
                  <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    min-width="0"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="endDateBE"
                        variant="outlined"
                        density="compact"
                        rounded="lg"
                        hide-details
                        readonly
                        placeholder="วว/ดด/ปปปป"
                        prepend-inner-icon="fas fa-calendar"
                      />
                    </template>
                    <v-date-picker
                      v-model="form.endDate"
                      hide-header
                      locale="th"
                      @update:model-value="endDateMenu = false"
                    />
                  </v-menu>
                </v-col>
              </v-row>
              <div class="text-caption text-medium-emphasis mt-1 mb-4">
                <v-icon icon="fas fa-circle-info" size="11" class="mr-1" />
                จำนวน {{ daysBetween }} วัน
              </div>
            </template>

            <!-- แนบไฟล์ -->
            <div class="field-label mb-1 mt-2">
              <div>เอกสารประกอบ</div>
              <div class="field-label-en">Supporting Document</div>
            </div>
            <v-file-input
              v-model="form.files"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              multiple
              prepend-icon=""
              prepend-inner-icon="fas fa-paperclip"
              placeholder="เลือกไฟล์เอกสาร"
              accept=".pdf,.jpg,.jpeg,.png"
              class="mb-4"
            />

            <!-- หมายเหตุ -->
            <div class="field-label mb-1">
              <div>หมายเหตุ</div>
              <div class="field-label-en">Remarks</div>
            </div>
            <v-textarea
              v-model="form.remark"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              rows="4"
              placeholder="ระบุเหตุผลในการดำเนินการ..."
              class="mb-5"
            />

            <!-- Actions -->
            <v-row no-gutters class="ga-2">
              <v-col>
                <v-btn
                  variant="tonal"
                  color="grey"
                  block
                  rounded="lg"
                  @click="router.back()"
                >
                  ยกเลิก
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  :color="actionColor"
                  variant="flat"
                  block
                  rounded="lg"
                  :prepend-icon="actionIcon"
                  :disabled="!form.action"
                  @click="confirmDialog = true"
                >
                  {{ actionLabel }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: history table ── -->
      <v-col cols="12" md="5">
        <v-card rounded="xl" elevation="0" class="section-card">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon
              icon="fas fa-clock-rotate-left"
              color="hcex-staff"
              size="15"
            />
            <span class="text-subtitle-2 font-weight-bold"
              >ประวัติสถานะใบทะเบียน</span
            >
          </div>
          <v-table density="compact" class="pa-2">
            <thead>
              <tr>
                <th style="width: 48px">ลำดับ</th>
                <th>วัน / เวลาที่อัพเดท</th>
                <th>สถานะ</th>
                <th>ชื่อเจ้าหน้าที่</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in history" :key="i">
                <td class="text-body-2 text-medium-emphasis text-center">
                  {{ i + 1 }}
                </td>
                <td class="text-body-2">{{ row.datetime }}</td>
                <td>
                  <v-chip
                    :color="historyColor(row.status)"
                    size="x-small"
                    variant="tonal"
                    :prepend-icon="historyIcon(row.status)"
                  >
                    {{ historyLabel(row.status) }}
                  </v-chip>
                </td>
                <td class="text-body-2">{{ row.officer }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <v-icon
            :icon="actionIcon"
            :color="actionColor"
            size="40"
            class="mb-3"
          />
          <h3 class="text-h6 font-weight-bold mb-2">
            ยืนยันการ{{ actionLabel }}
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            คุณต้องการ{{ actionLabel }}ใบทะเบียน
            <strong>{{ route.params.id }}</strong> ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                block
                rounded="lg"
                @click="confirmDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                :color="actionColor"
                block
                rounded="lg"
                @click="submitAction"
              >
                ยืนยัน
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="360">
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ดำเนินการสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            บันทึกการ{{ actionLabelDone }}ใบทะเบียนเรียบร้อยแล้ว
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-btn
            color="hcex-staff"
            block
            rounded="lg"
            @click="router.push({ name: 'HCEXstaffRegistry' })"
          >
            กลับรายการใบทะเบียน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useLocale } from "vuetify";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const confirmDialog = ref(false);
const successDialog = ref(false);

const startDateMenu = ref(false);
const endDateMenu = ref(false);

const form = reactive({
  action: route.query.status ?? null,
  files: [],
  remark: "",
  startDate: new Date(),
  endDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 180);
    return d;
  })(),
});

function toDateBEStr(d) {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear() + 543}`;
}

const startDateBE = computed(() => toDateBEStr(form.startDate));
const endDateBE = computed(() => toDateBEStr(form.endDate));

const daysBetween = computed(() => {
  if (!form.startDate || !form.endDate) return 0;
  const s = new Date(form.startDate);
  s.setHours(0, 0, 0, 0);
  const e = new Date(form.endDate);
  e.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((e - s) / 86400000));
});

const actionMap = {
  active: {
    label: "เปิดใช้งาน",
    labelDone: "เปิดใช้งาน",
    color: "success",
    icon: "fas fa-circle-check",
  },
  suspend: {
    label: "ระงับ",
    labelDone: "ระงับ",
    color: "warning",
    icon: "fas fa-circle-pause",
  },
  suspend_temp: {
    label: "พักใช้",
    labelDone: "พักใช้",
    color: "info",
    icon: "fas fa-clock",
  },
  revoke: {
    label: "เพิกถอน",
    labelDone: "เพิกถอน",
    color: "error",
    icon: "fas fa-ban",
  },
};

const actionColor = computed(
  () => actionMap[form.action]?.color ?? "hcex-staff",
);
const actionIcon = computed(
  () => actionMap[form.action]?.icon ?? "fas fa-file-pen",
);
const actionLabel = computed(
  () => actionMap[form.action]?.label ?? "ดำเนินการ",
);
const actionLabelDone = computed(
  () => actionMap[form.action]?.labelDone ?? "ดำเนินการ",
);

function submitAction() {
  confirmDialog.value = false;
  successDialog.value = true;
}

const history = [
  {
    datetime: "20/03/2569 10:30",
    status: "active",
    officer: "นายประเสริฐ มีสุข",
  },
  {
    datetime: "01/02/2569 09:15",
    status: "suspend",
    officer: "นางสาววิมล สุวรรณ",
  },
  {
    datetime: "15/01/2569 14:00",
    status: "active",
    officer: "นายประเสริฐ มีสุข",
  },
];

function historyColor(s) {
  return (
    {
      active: "success",
      suspend: "warning",
      suspend_temp: "info",
      revoke: "error",
    }[s] ?? "grey"
  );
}

function historyIcon(s) {
  return (
    {
      active: "fas fa-circle-check",
      suspend: "fas fa-circle-pause",
      suspend_temp: "fas fa-clock",
      revoke: "fas fa-ban",
    }[s] ?? "fas fa-circle"
  );
}

function historyLabel(s) {
  return (
    {
      active: "มีผล",
      suspend: "ระงับ",
      suspend_temp: "พักใช้",
      revoke: "เพิกถอน",
    }[s] ?? s
  );
}
</script>

<style scoped>
.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.field-label-en {
  font-size: 0.72rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-weight: 400;
}
</style>
