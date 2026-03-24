<template>
  <div>
    <!-- GAP Checklist Expansion Panels -->
    <div class="ds-subtitle mb-3">Expansion Panels — GAP Checklist</div>
    <v-expansion-panels class="mb-6" variant="accordion">
      <v-expansion-panel v-for="(cat, ci) in gapChecklist" :key="ci">
        <v-expansion-panel-title>
          <div class="d-flex align-center ga-3">
            <v-icon icon="fas fa-list-check" color="primary" size="16" />
            <span class="font-weight-medium">{{ cat.title }}</span>
            <v-chip size="x-small" color="success" variant="tonal" class="ml-2">
              {{ cat.items.filter((i) => i.result === "PASS").length }}/{{
                cat.items.length
              }}
              ผ่าน
            </v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table density="compact">
            <tbody>
              <tr v-for="(item, ii) in cat.items" :key="ii">
                <td class="text-body-2 py-2">{{ item.label }}</td>
                <td class="text-right py-2" style="width: 120px">
                  <div class="d-flex ga-1 justify-end">
                    <v-btn
                      :color="item.result === 'PASS' ? 'success' : 'grey'"
                      :variant="item.result === 'PASS' ? 'flat' : 'outlined'"
                      size="x-small"
                      @click="setItemResult(item, 'PASS')"
                      >ผ่าน</v-btn
                    >
                    <v-btn
                      :color="item.result === 'FAIL' ? 'error' : 'grey'"
                      :variant="item.result === 'FAIL' ? 'flat' : 'outlined'"
                      size="x-small"
                      @click="setItemResult(item, 'FAIL')"
                      >ไม่ผ่าน</v-btn
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Notification List -->
    <div class="ds-subtitle mb-3">Notification List</div>
    <v-card>
      <v-list lines="two">
        <template v-for="(n, i) in notifications" :key="n.id">
          <v-list-item class="px-5 py-3">
            <template #prepend>
              <div
                class="notif-icon rounded-lg d-flex align-center justify-center mr-3"
                :style="`background:rgba(var(--v-theme-${n.color}),0.12)`"
              >
                <v-icon :icon="n.icon" :color="n.color" size="16" />
              </div>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">{{
              n.message
            }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{
              n.date
            }}</v-list-item-subtitle>
            <template #append>
              <v-chip :color="n.chipColor" size="x-small" variant="tonal">{{
                n.status
              }}</v-chip>
            </template>
          </v-list-item>
          <v-divider v-if="i < notifications.length - 1" inset />
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const gapChecklist = ref([
  {
    title: "1. แหล่งน้ำ",
    items: [
      { label: "แหล่งน้ำไม่มีการปนเปื้อนสารเคมี", result: "PASS" },
      { label: "มีระบบการจัดการน้ำอย่างเหมาะสม", result: "PASS" },
      { label: "มีการตรวจวิเคราะห์คุณภาพน้ำ", result: null },
    ],
  },
  {
    title: "2. พื้นที่ปลูก",
    items: [
      { label: "พื้นที่ไม่มีสารปนเปื้อนในดิน", result: "PASS" },
      { label: "ไม่อยู่ใกล้แหล่งมลพิษ", result: null },
    ],
  },
  {
    title: "3. วัตถุอันตรายทางการเกษตร",
    items: [
      { label: "ใช้สารเคมีตามคำแนะนำ", result: null },
      { label: "มีการเก็บรักษาสารเคมีอย่างปลอดภัย", result: null },
    ],
  },
]);

function setItemResult(item, result) {
  item.result = result;
}

const notifications = [
  {
    id: 1,
    icon: "fas fa-paper-plane",
    color: "blue",
    message: "คำขอ GAP-2569-001 ถูกยื่นแล้ว",
    date: "1 มี.ค. 67",
    status: "ใหม่",
    chipColor: "blue",
  },
  {
    id: 2,
    icon: "fas fa-calendar",
    color: "purple",
    message: "นัดตรวจแปลง 15 มี.ค. เวลา 09:00",
    date: "3 มี.ค. 67",
    status: "แจ้งเตือน",
    chipColor: "purple",
  },
  {
    id: 3,
    icon: "fas fa-circle-check",
    color: "success",
    message: "คำขอ GAP-2569-002 ผ่านการอนุมัติแล้ว",
    date: "5 มี.ค. 67",
    status: "สำเร็จ",
    chipColor: "green",
  },
  {
    id: 4,
    icon: "fas fa-clock",
    color: "warning",
    message: "ใบรับรอง GAP-C-0089 จะหมดอายุใน 30 วัน",
    date: "7 มี.ค. 67",
    status: "เร่งด่วน",
    chipColor: "orange",
  },
];
</script>

<style scoped>
.notif-icon {
  width: 36px;
  height: 36px;
}
.ds-subtitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary));
  opacity: 0.75;
}
</style>
