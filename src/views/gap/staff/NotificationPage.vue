<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">ติดตาม-แจ้งเตือน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">การแจ้งเตือนและสถานะที่ต้องติดตาม</p>
      </div>
      <v-btn variant="tonal" color="grey" prepend-icon="fas fa-check-double" size="small" @click="markAllRead">
        อ่านทั้งหมด
      </v-btn>
    </div>

    <!-- Filter Tabs -->
    <v-chip-group v-model="activeFilter" class="mb-4" mandatory selected-class="v-chip--selected">
      <v-chip value="all"     color="gap-staff" variant="tonal" filter size="small">ทั้งหมด ({{ notifications.length }})</v-chip>
      <v-chip value="unread"  color="error"   variant="tonal" filter size="small">ยังไม่อ่าน ({{ unreadCount }})</v-chip>
      <v-chip value="action"  color="warning" variant="tonal" filter size="small">ต้องดำเนินการ</v-chip>
    </v-chip-group>

    <v-card>
      <v-list lines="three" class="pa-0">
        <template v-for="(notif, i) in filteredNotifs" :key="notif.id">
          <v-list-item
            class="notif-item"
            :class="{ 'notif-item--unread': !notif.read }"
            @click="markRead(notif)"
          >
            <template v-slot:prepend>
              <div class="notif-icon-box mr-3" :style="`background:rgba(var(--v-theme-${notif.color}),0.12)`">
                <v-icon :icon="notif.icon" :color="notif.color" size="18" />
              </div>
            </template>

            <v-list-item-title class="text-body-2 font-weight-medium d-flex align-center ga-2">
              {{ notif.title }}
              <v-badge v-if="!notif.read" dot color="error" inline />
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption mt-1">{{ notif.message }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text-caption text-medium-emphasis">{{ notif.time }}</v-list-item-subtitle>

            <template v-slot:append>
              <div class="d-flex flex-column align-end ga-1">
                <v-chip v-if="notif.actionRequired" size="x-small" color="warning" variant="flat">
                  ต้องดำเนินการ
                </v-chip>
                <v-chip size="x-small" :color="notif.color" variant="tonal">{{ notif.tag }}</v-chip>
              </div>
            </template>
          </v-list-item>
          <v-divider v-if="i < filteredNotifs.length - 1" />
        </template>
        <v-empty-state v-if="filteredNotifs.length === 0" icon="fas fa-bell-slash"
          headline="ไม่มีการแจ้งเตือน" text="ไม่พบการแจ้งเตือนในหมวดที่เลือก" />
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeFilter = ref('all')

interface Notif {
  id: number; title: string; message: string; time: string; icon: string; color: string; tag: string; read: boolean; actionRequired: boolean
}

const notifications = ref<Notif[]>([
  { id: 1,  title: 'คำขอใหม่รอตรวจสอบ',          message: 'GAP-2568-00042 · นายอำนาจ วีระชัย ยื่นคำขอรับรองแบบเดี่ยว (พริก · สระแก้ว)',     time: '15 ม.ค. 68 09:15',  icon: 'fas fa-file-pen',      color: 'warning',  tag: 'คำขอใหม่',         read: false, actionRequired: true  },
  { id: 2,  title: 'ใบรับรองใกล้หมดอายุ',          message: 'GAP-CERT-2568-0034 · น.ส.รัตนา พงศ์ไพร จะหมดอายุใน 30 วัน (17 ก.พ. 68)',          time: '15 ม.ค. 68 08:00',  icon: 'fas fa-triangle-exclamation', color: 'warning',  tag: 'ใบรับรอง',         read: false, actionRequired: true  },
  { id: 3,  title: 'ผลการประชุม CC รอบันทึก',      message: 'GAP-2568-00034 · น.ส.มาลี รุ่งเรือง ประชุม CC เสร็จสิ้นแล้ว รอบันทึกผล',           time: '14 ม.ค. 68 16:30',  icon: 'fas fa-gavel',         color: 'error',    tag: 'CC',               read: false, actionRequired: true  },
  { id: 4,  title: 'คำขอรอนัดตรวจแปลง (5 รายการ)', message: 'มีคำขอ 5 รายการที่ตรวจสอบเอกสารผ่านแล้ว รอการนัดหมายตรวจแปลง',                     time: '14 ม.ค. 68 10:00',  icon: 'fas fa-calendar-clock','color': 'info',   tag: 'ตรวจแปลง',         read: false, actionRequired: true  },
  { id: 5,  title: 'บันทึกผลตรวจแล้ว',             message: 'GAP-2568-00039 · น.ส.วิไล สุขใส ผลการตรวจแปลงถูกบันทึกแล้ว รอเสนอ CC',              time: '13 ม.ค. 68 14:20',  icon: 'fas fa-clipboard-check', color: 'secondary', tag: 'ผลตรวจ',          read: true,  actionRequired: false },
  { id: 6,  title: 'ออกใบรับรองสำเร็จ',            message: 'GAP-CERT-2568-0035 · นายสมชาย ใจดี ออกใบรับรองมาตรฐาน GAP เรียบร้อยแล้ว',           time: '12 ม.ค. 68 11:05',  icon: 'fas fa-certificate',   color: 'success',  tag: 'ใบรับรอง',         read: true,  actionRequired: false },
  { id: 7,  title: 'คำขอกลุ่มใหม่',               message: 'GAP-GRP-2568-00005 · กลุ่มเกษตรกรผู้ปลูกมะม่วงบ้านดอนแก้ว ยื่นคำขอกลุ่ม 18 สมาชิก', time: '11 ม.ค. 68 09:00',  icon: 'fas fa-users',         color: 'gap-staff',  tag: 'คำขอกลุ่ม',         read: true,  actionRequired: false },
  { id: 8,  title: 'ส่งกลับแก้ไขสำเร็จ',          message: 'GAP-2568-00040 · นายชัยพร ดีงาม ได้รับการแจ้งให้แก้ไขเอกสารแล้ว',                    time: '10 ม.ค. 68 15:45',  icon: 'fas fa-arrow-rotate-left', color: 'warning',  tag: 'แก้ไขเอกสาร',      read: true,  actionRequired: false },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredNotifs = computed(() => {
  if (activeFilter.value === 'unread')  return notifications.value.filter(n => !n.read)
  if (activeFilter.value === 'action')  return notifications.value.filter(n => n.actionRequired)
  return notifications.value
})

function markRead(notif: Notif) {
  notif.read = true
}

function markAllRead() {
  notifications.value.forEach(n => n.read = true)
}
</script>

<style scoped>
.notif-item { cursor: pointer; transition: background 0.15s; }
.notif-item:hover { background: rgba(var(--v-theme-gap-staff), 0.04); }
.notif-item--unread { background: rgba(var(--v-theme-gap-staff), 0.02); }
.notif-icon-box {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
</style>
