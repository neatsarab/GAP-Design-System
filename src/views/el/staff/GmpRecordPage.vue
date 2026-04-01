<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToInspectionNew"
      />
      <div>
        <h1 class="page-title mb-0">ผลตรวจ GMP / HACCP</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          บันทึกและแสดงผลการตรวจมาตรฐาน GMP และ HACCP
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="el-staff" class="mb-5">
      <v-tab value="gmp-haccp">GMP / HACCP</v-tab>
      <v-tab value="analysis">ผลตรวจวิเคราะห์</v-tab>
      <v-tab value="exam">ผลสอบ</v-tab>
    </v-tabs>

    <!-- ─── Tab: GMP / HACCP ─── -->
    <template v-if="activeTab === 'gmp-haccp'">
      <!-- GMP Section -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title
          class="pa-5 pb-3 d-flex align-center justify-space-between section-title"
        >
          <span>
            <v-icon
              icon="fas fa-industry"
              color="el-staff"
              class="mr-2"
              size="18"
            />
            GMP
          </span>
          <v-btn
            color="el-staff"
            variant="tonal"
            size="small"
            rounded="lg"
            prepend-icon="fas fa-plus"
            @click="openDialog('gmp')"
          >
            สร้างใหม่
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-table density="comfortable" class="pa-2">
          <thead>
            <tr>
              <th style="width: 80px">ดู / แก้ไข</th>
              <th>ครั้งที่ตรวจ</th>
              <th>กำหนดตรวจ</th>
              <th>วันที่ตรวจ</th>
              <th>ผู้ตรวจ</th>
              <th>ผลการตรวจ</th>
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="gmpRecords.length === 0">
              <td
                colspan="7"
                class="text-center text-medium-emphasis py-5 text-body-2"
              >
                ไม่มีข้อมูล
              </td>
            </tr>
            <tr v-for="(row, idx) in gmpRecords" :key="row.id">
              <td>
                <v-btn
                  icon="fas fa-pen"
                  variant="text"
                  size="x-small"
                  color="warning"
                  @click="openEditDialog('gmp', idx)"
                />
              </td>
              <td>{{ row.round }}</td>
              <td class="text-medium-emphasis">
                {{ row.scheduledDate || "—" }}
              </td>
              <td>{{ row.inspectedDate }}</td>
              <td>{{ row.inspector }}</td>
              <td>
                <v-chip
                  :color="row.result === 'pass' ? 'success' : 'error'"
                  size="x-small"
                  variant="tonal"
                >
                  {{ row.result === "pass" ? "ผ่าน" : "ไม่ผ่าน" }}
                </v-chip>
              </td>
              <td class="text-medium-emphasis text-body-2">
                {{ row.remark || "—" }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- HACCP Section -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title
          class="pa-5 pb-3 d-flex align-center justify-space-between section-title"
        >
          <span>
            <v-icon
              icon="fas fa-shield-halved"
              color="el-staff"
              class="mr-2"
              size="18"
            />
            HACCP
          </span>
          <v-btn
            color="el-staff"
            variant="tonal"
            size="small"
            rounded="lg"
            prepend-icon="fas fa-plus"
            @click="openDialog('haccp')"
          >
            สร้างใหม่
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-table density="comfortable" class="pa-2">
          <thead>
            <tr>
              <th style="width: 80px">ดู / แก้ไข</th>
              <th>ครั้งที่ตรวจ</th>
              <th>กำหนดตรวจ</th>
              <th>วันที่ตรวจ</th>
              <th>ผู้ตรวจ</th>
              <th>ผลการตรวจ</th>
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="haccpRecords.length === 0">
              <td
                colspan="7"
                class="text-center text-medium-emphasis py-5 text-body-2"
              >
                ไม่มีข้อมูล
              </td>
            </tr>
            <tr v-for="(row, idx) in haccpRecords" :key="row.id">
              <td>
                <v-btn
                  icon="fas fa-pen"
                  variant="text"
                  size="x-small"
                  color="warning"
                  @click="openEditDialog('haccp', idx)"
                />
              </td>
              <td>{{ row.round }}</td>
              <td class="text-medium-emphasis">
                {{ row.scheduledDate || "—" }}
              </td>
              <td>{{ row.inspectedDate }}</td>
              <td>{{ row.inspector }}</td>
              <td>
                <v-chip
                  :color="row.result === 'pass' ? 'success' : 'error'"
                  size="x-small"
                  variant="tonal"
                >
                  {{ row.result === "pass" ? "ผ่าน" : "ไม่ผ่าน" }}
                </v-chip>
              </td>
              <td class="text-medium-emphasis text-body-2">
                {{ row.remark || "—" }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </template>

    <!-- ─── Tab: ผลตรวจวิเคราะห์ ─── -->
    <template v-if="activeTab === 'analysis'">
      <v-card rounded="xl" elevation="0" class="section-card">
        <v-card-text class="pa-10 text-center">
          <v-icon icon="fas fa-flask" color="el-staff" size="36" class="mb-3" />
          <div class="text-body-1 font-weight-medium mb-1">ผลตรวจวิเคราะห์</div>
          <div class="text-body-2 text-medium-emphasis">
            ยังไม่มีข้อมูลในส่วนนี้
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- ─── Tab: ผลสอบ ─── -->
    <template v-if="activeTab === 'exam'">
      <v-card rounded="xl" elevation="0" class="section-card">
        <v-card-text class="pa-10 text-center">
          <v-icon
            icon="fas fa-file-circle-check"
            color="el-staff"
            size="36"
            class="mb-3"
          />
          <div class="text-body-1 font-weight-medium mb-1">ผลสอบ</div>
          <div class="text-body-2 text-medium-emphasis">
            ยังไม่มีข้อมูลในส่วนนี้
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialog" max-width="520">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
          <v-icon
            :icon="
              dialogType === 'gmp' ? 'fas fa-industry' : 'fas fa-shield-halved'
            "
            color="el-staff"
            class="mr-2"
            size="18"
          />
          {{ dialogMode === "add" ? "สร้างใหม่" : "แก้ไข" }} —
          {{ dialogType === "gmp" ? "GMP" : "HACCP" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label mb-1">
                <div>ครั้งที่ตรวจ</div>
                <div class="field-label-en">Inspection Round</div>
              </div>
              <v-text-field
                v-model="dialogItem.round"
                type="number"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-1">
                <div>กำหนดตรวจ</div>
                <div class="field-label-en">Scheduled Date</div>
              </div>
              <v-text-field
                v-model="dialogItem.scheduledDate"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-1">
                <div>วันที่ตรวจ</div>
                <div class="field-label-en">Inspection Date</div>
              </div>
              <v-text-field
                v-model="dialogItem.inspectedDate"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-1">
                <div>ผู้ตรวจ</div>
                <div class="field-label-en">Inspector Name</div>
              </div>
              <v-autocomplete
                v-model="dialogItem.inspector"
                :items="inspectorOptions"
                item-title="name"
                item-value="name"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-1">
                <div>ผลการตรวจ</div>
                <div class="field-label-en">Inspection Result</div>
              </div>
              <v-autocomplete
                v-model="dialogItem.result"
                :items="[
                  { title: 'ผ่าน', value: 'pass' },
                  { title: 'ไม่ผ่าน', value: 'fail' },
                ]"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mb-1">
                <div>หมายเหตุ</div>
                <div class="field-label-en">Remarks</div>
              </div>
              <v-textarea
                v-model="dialogItem.remark"
                variant="outlined"
                density="compact"
                rounded="lg"
                rows="3"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" @click="closeDialog"
            >ยกเลิก</v-btn
          >
          <v-spacer />
          <v-btn
            color="el-staff"
            rounded="lg"
            prepend-icon="fas fa-floppy-disk"
            @click="saveRecord"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToInspectionNew() {
  router.push({ name: "ELStaffInspectionNew" });
}

const activeTab = ref("gmp-haccp");

const gmpRecords = ref([
  {
    id: 1,
    round: 1,
    scheduledDate: "",
    inspectedDate: "29/11/2011",
    inspector: "น.ส.วรัญญา ปานเกตุ",
    result: "pass",
    remark: "โรงคัดบรรจุได้รับการขึ้นทะเบียนพืชพักแล้ว ตั้งแต่ 29/11/2011",
  },
]);

const haccpRecords = ref([
  {
    id: 1,
    round: 1,
    scheduledDate: "",
    inspectedDate: "29/11/2011",
    inspector: "น.ส.วรัญญา ปานเกตุ",
    result: "pass",
    remark: "โรงคัดบรรจุได้รับการขึ้นทะเบียนพืชพักแล้ว ตั้งแต่ 29/11/2011",
  },
]);

const inspectorOptions = [
  { name: "นิธิพร เทิบจันทึก" },
  { name: "สมชาย วิชาการ" },
  { name: "น.ส.วรัญญา ปานเกตุ" },
];

const dialog = ref(false);

function closeDialog() {
  dialog.value = false;
}

const dialogMode = ref("add");
const dialogType = ref("gmp");
const dialogIndex = ref(-1);
const dialogItem = ref({
  round: 1,
  scheduledDate: "",
  inspectedDate: "",
  inspector: "",
  result: "pass",
  remark: "",
});

let idCounter = 100;

function openDialog(type) {
  dialogType.value = type;
  dialogMode.value = "add";
  const list = type === "gmp" ? gmpRecords.value : haccpRecords.value;
  dialogItem.value = {
    round: list.length + 1,
    scheduledDate: "",
    inspectedDate: "",
    inspector: "",
    result: "pass",
    remark: "",
  };
  dialogIndex.value = -1;
  dialog.value = true;
}

function openEditDialog(type, index) {
  dialogType.value = type;
  dialogMode.value = "edit";
  dialogIndex.value = index;
  const list = type === "gmp" ? gmpRecords.value : haccpRecords.value;
  const { id: _id, ...rest } = list[index];
  dialogItem.value = { ...rest };
  dialog.value = true;
}

function saveRecord() {
  const list =
    dialogType.value === "gmp" ? gmpRecords.value : haccpRecords.value;
  if (dialogMode.value === "add") {
    list.push({ id: idCounter++, ...dialogItem.value });
  } else {
    Object.assign(list[dialogIndex.value], dialogItem.value);
  }
  dialog.value = false;
}
</script>
