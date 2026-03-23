<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5 flex-wrap ga-3">
      <div>
        <h1 class="page-title mb-1">รายการคำขอรับรองแบบกลุ่ม</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">จัดการคำขอรับรองมาตรฐาน GAP สำหรับกลุ่มเกษตรกร</p>
      </div>
      <v-btn color="gap-staff" prepend-icon="fas fa-users-plus">ยื่นคำขอกลุ่มใหม่</v-btn>
    </div>

    <!-- Search -->
    <v-card class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="5">
            <v-text-field v-model="search" label="ค้นหาชื่อกลุ่ม / เลขที่คำขอ" prepend-inner-icon="fas fa-search" clearable hide-details />
          </v-col>
          <v-col cols="6" sm="3">
            <v-autocomplete v-model="filterStatus" label="สถานะ" :items="statusOptions" item-title="label" item-value="value" clearable hide-details />
          </v-col>
          <v-col cols="6" sm="3">
            <v-autocomplete v-model="filterCert" label="ประเภทใบรับรอง" :items="['มกษ. 9001', 'มกษ. 3502']" clearable hide-details />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Group Cards -->
    <v-row>
      <v-col v-for="group in filteredGroups" :key="group.id" cols="12" md="6">
        <v-card class="group-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-start justify-space-between mb-3">
              <div class="d-flex align-center ga-3">
                <div class="group-icon-box">
                  <v-icon icon="fas fa-users" color="secondary" size="20" />
                </div>
                <div>
                  <div class="text-body-1 font-weight-bold">{{ group.groupName }}</div>
                  <div class="text-caption text-medium-emphasis">{{ group.requestNo }}</div>
                </div>
              </div>
              <v-chip size="small" :color="getStatusColor(group.status)" variant="tonal" :prepend-icon="getStatusIcon(group.status)">
                {{ getStatusLabel(group.status) }}
              </v-chip>
            </div>

            <v-divider class="mb-3" />

            <v-row dense>
              <v-col cols="6"><info-item icon="fas fa-users" label="สมาชิก" :value="`${group.memberCount} ราย`" /></v-col>
              <v-col cols="6"><info-item icon="fas fa-map" label="แปลงรวม" :value="`${group.totalArea} ไร่`" /></v-col>
              <v-col cols="6"><info-item icon="fas fa-seedling" label="ชนิดพืช" :value="group.crop" /></v-col>
              <v-col cols="6"><info-item icon="fas fa-location-dot" label="จังหวัด" :value="group.province" /></v-col>
              <v-col cols="6"><info-item icon="fas fa-certificate" label="ใบรับรอง" :value="group.certType" /></v-col>
              <v-col cols="6"><info-item icon="fas fa-calendar" label="วันที่ยื่น" :value="group.submittedAt" /></v-col>
            </v-row>

            <v-divider class="my-3" />

            <!-- ICS Status -->
            <div class="d-flex align-center ga-2 mb-3">
              <span class="text-caption text-medium-emphasis">ระบบควบคุมภายใน (ICS):</span>
              <v-chip
                v-for="ics in group.icsStatus" :key="ics.label"
                size="x-small"
                :color="ics.ok ? 'success' : 'error'"
                variant="tonal"
              >
                {{ ics.label }}
              </v-chip>
            </div>

            <div class="d-flex ga-2">
              <v-btn color="gap-staff" variant="tonal" size="small" prepend-icon="fas fa-eye" class="flex-grow-1">
                ดูรายละเอียด
              </v-btn>
              <v-btn color="secondary" variant="tonal" size="small" prepend-icon="fas fa-users">
                รายชื่อสมาชิก
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-empty-state v-if="filteredGroups.length === 0" icon="fas fa-users" headline="ไม่พบรายการ" text="ไม่พบคำขอกลุ่มที่ตรงกับเงื่อนไขที่เลือก" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'

const search       = ref('')
const filterStatus = ref<string | null>(null)
const filterCert   = ref<string | null>(null)

const statusOptions = [
  { label: 'รอตรวจคำขอ',    value: 'reviewing'    },
  { label: 'รอนัดตรวจแปลง', value: 'scheduling'   },
  { label: 'รอเสนอ CC',      value: 'pending_cc'   },
  { label: 'อนุมัติแล้ว',    value: 'approved'     },
  { label: 'ออกใบรับรองแล้ว', value: 'cert_issued' },
]

const InfoItem = defineComponent({
  props: { icon: String, label: String, value: String },
  setup(props) {
    return () => h('div', { class: 'd-flex align-center ga-1' }, [
      h('v-icon', { icon: props.icon, size: 12, class: 'text-medium-emphasis' }),
      h('span', { class: 'text-caption text-medium-emphasis' }, `${props.label}: `),
      h('span', { class: 'text-caption font-weight-medium' }, props.value),
    ])
  },
})

const groupApplications = [
  {
    id: 'GRP-001', requestNo: 'GAP-GRP-2568-00005', groupName: 'กลุ่มเกษตรกรผู้ปลูกมะม่วงบ้านดอนแก้ว',
    memberCount: 18, totalArea: 245, crop: 'มะม่วง', province: 'เชียงใหม่',
    certType: 'มกษ. 9001', submittedAt: '10 ม.ค. 68', status: 'scheduling',
    icsStatus: [{ label: 'นโยบาย', ok: true }, { label: 'ตรวจภายใน', ok: true }, { label: 'ข้อร้องเรียน', ok: false }],
  },
  {
    id: 'GRP-002', requestNo: 'GAP-GRP-2568-00004', groupName: 'สหกรณ์การเกษตรกลุ่มลำไยเชียงราย',
    memberCount: 32, totalArea: 480, crop: 'ลำไย', province: 'เชียงราย',
    certType: 'มกษ. 9001', submittedAt: '5 ม.ค. 68', status: 'pending_cc',
    icsStatus: [{ label: 'นโยบาย', ok: true }, { label: 'ตรวจภายใน', ok: true }, { label: 'ข้อร้องเรียน', ok: true }],
  },
  {
    id: 'GRP-003', requestNo: 'GAP-GRP-2568-00003', groupName: 'กลุ่มเกษตรกรพริกเกษตรอินทรีย์สระแก้ว',
    memberCount: 12, totalArea: 96, crop: 'พริก', province: 'สระแก้ว',
    certType: 'มกษ. 3502', submittedAt: '2 ม.ค. 68', status: 'approved',
    icsStatus: [{ label: 'นโยบาย', ok: true }, { label: 'ตรวจภายใน', ok: true }, { label: 'Traceability', ok: true }],
  },
  {
    id: 'GRP-004', requestNo: 'GAP-GRP-2568-00002', groupName: 'กลุ่มผู้ปลูกข้าวโพดเพชรบูรณ์',
    memberCount: 25, totalArea: 312, crop: 'ข้าวโพดหวาน', province: 'เพชรบูรณ์',
    certType: 'มกษ. 9001', submittedAt: '28 ธ.ค. 67', status: 'reviewing',
    icsStatus: [{ label: 'นโยบาย', ok: true }, { label: 'ตรวจภายใน', ok: false }],
  },
]

const filteredGroups = computed(() => {
  let items = groupApplications
  if (filterStatus.value) items = items.filter(i => i.status === filterStatus.value)
  if (filterCert.value)   items = items.filter(i => i.certType === filterCert.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    items = items.filter(i => i.groupName.includes(q) || i.requestNo.toLowerCase().includes(q))
  }
  return items
})

function getStatusColor(s: string) {
  const m: Record<string, string> = { reviewing: 'warning', scheduling: 'info', pending_cc: 'gap-staff', cc_reviewing: 'error', approved: 'success', cert_issued: 'success' }
  return m[s] ?? 'grey'
}
function getStatusIcon(s: string) {
  const m: Record<string, string> = { reviewing: 'fas fa-magnifying-glass', scheduling: 'fas fa-calendar-clock', pending_cc: 'fas fa-paper-plane', cc_reviewing: 'fas fa-gavel', approved: 'fas fa-circle-check', cert_issued: 'fas fa-certificate' }
  return m[s] ?? 'fas fa-circle'
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = { reviewing: 'รอตรวจคำขอ', scheduling: 'รอนัดตรวจแปลง', pending_cc: 'รอเสนอ CC', cc_reviewing: 'อยู่ระหว่าง CC', approved: 'อนุมัติแล้ว', cert_issued: 'ออกใบรับรองแล้ว' }
  return m[s] ?? s
}
</script>

<style scoped>
.group-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); transition: box-shadow 0.2s; }
.group-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
.group-icon-box {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(var(--v-theme-secondary), 0.1);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
</style>
