<template>
  <!--
    AppStatusChip.vue
    ─────────────────────────────────────────────────────────────────────────────
    Component แสดงสถานะ GAP ในรูปแบบ Vuetify v-chip
    รองรับ: size, showIcon, showLabel, tooltip

    Usage:
      <AppStatusChip status="CERT_ISSUED" />
      <AppStatusChip status="REJECTED" size="small" />
      <AppStatusChip status="DOC_REVIEW" :show-icon="false" />
      <AppStatusChip status="APPROVED" :show-label="false" />
      <AppStatusChip status="SUBMITTED" show-tooltip />
    ─────────────────────────────────────────────────────────────────────────────
  -->
  <v-tooltip
    v-if="showTooltip"
    :text="statusDef.descriptionTh"
    location="top"
    max-width="280"
  >
    <template #activator="{ props: tooltipProps }">
      <v-chip
        v-bind="tooltipProps"
        :color="cfg.color"
        :size="size"
        :variant="cfg.variant"
        :prepend-icon="showIcon ? cfg.icon : undefined"
        label
        class="gap-status-chip font-weight-medium"
      >
        <template v-if="showLabel">{{ cfg.label }}</template>
      </v-chip>
    </template>
  </v-tooltip>

  <v-chip
    v-else
    :color="cfg.color"
    :size="size"
    :variant="cfg.variant"
    :prepend-icon="showIcon ? cfg.icon : undefined"
    label
    class="gap-status-chip font-weight-medium"
  >
    <template v-if="showLabel">{{ cfg.label }}</template>
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { getStatusDef } from '@/config/gap-status.config'
import type { GapStatus } from '@/types/gap-status.types'

// ── Status Config (UX spec — ใช้ Vuetify named colors) ───────────────────────

type ChipVariant = 'flat' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'plain'

interface StatusConfig {
  color:       string
  colorDark?:  string   // override สำหรับ dark mode
  icon:        string
  label:       string
  variant:     ChipVariant
  variantDark?: ChipVariant
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  //                                        ── Light ────────────────────  ── Dark override ───────────
  DRAFT:                { color: 'blue-grey-darken-1', colorDark: 'blue-grey-lighten-2', icon: 'fas fa-file-pen',                  label: 'ร่าง',               variant: 'tonal', variantDark: 'flat' },
  SUBMITTED:            { color: 'blue-darken-2',      colorDark: 'blue-lighten-2',      icon: 'fas fa-paper-plane',               label: 'ยื่นคำขอแล้ว',        variant: 'tonal', variantDark: 'flat' },
  DOC_REVIEW:           { color: 'indigo-darken-1',    colorDark: 'indigo-lighten-3',    icon: 'fas fa-file-magnifying-glass',     label: 'ตรวจสอบเอกสาร',      variant: 'tonal', variantDark: 'flat' },
  INSPECTION_SCHEDULED: { color: 'cyan-darken-2',      colorDark: 'cyan-lighten-2',      icon: 'fas fa-calendar-check',            label: 'นัดตรวจแปลงแล้ว',    variant: 'tonal', variantDark: 'flat' },
  INSPECTING:           { color: 'orange-darken-2',    colorDark: 'orange-lighten-1',    icon: 'fas fa-magnifying-glass-location', label: 'กำลังตรวจแปลง',      variant: 'tonal', variantDark: 'flat' },
  APPROVED:             { color: 'green-darken-3',     colorDark: 'green-lighten-2',     icon: 'fas fa-circle-check',              label: 'อนุมัติแล้ว',         variant: 'tonal', variantDark: 'flat' },
  REJECTED:             { color: 'red-darken-2',       colorDark: 'red-lighten-2',       icon: 'fas fa-circle-xmark',              label: 'ไม่ผ่านการรับรอง',    variant: 'tonal', variantDark: 'flat' },
  CANCELLED:            { color: 'blue-grey-darken-3', colorDark: 'blue-grey-lighten-1', icon: 'fas fa-ban',                       label: 'ยกเลิก',             variant: 'tonal', variantDark: 'flat' },
  CERT_ISSUED:          { color: 'green-darken-2',     colorDark: 'green-lighten-1',     icon: 'fas fa-award',                     label: 'ออกใบรับรองแล้ว',     variant: 'tonal', variantDark: 'flat' },
  CERT_EXPIRED:         { color: 'amber-darken-3',     colorDark: 'amber-lighten-1',     icon: 'fas fa-clock-rotate-left',         label: 'ใบรับรองหมดอายุ',     variant: 'tonal', variantDark: 'flat' },
}

const FALLBACK_CONFIG: StatusConfig = {
  color:   'grey',
  icon:    'fas fa-circle-question',
  label:   'ไม่ทราบสถานะ',
  variant: 'tonal',
}

const { current: currentTheme } = useTheme()
const isDark = computed(() => currentTheme.value.dark)

// ── Props ────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  /** Status code จาก API หรือ store */
  status: GapStatus | string

  /** Vuetify chip size */
  size?: 'x-small' | 'small' | 'default' | 'large'

  /** แสดง icon หน้า label หรือไม่ */
  showIcon?: boolean

  /** แสดง label text หรือไม่ */
  showLabel?: boolean

  /** แสดง tooltip คำอธิบายสถานะเมื่อ hover */
  showTooltip?: boolean
}>(), {
  size:        'small',
  showIcon:    true,
  showLabel:   true,
  showTooltip: false,
})

// ── Computed ─────────────────────────────────────────────────────────────────

/** ดึง StatusConfig และ resolve dark-mode overrides */
const cfg = computed(() => {
  const base = STATUS_CONFIG[props.status] ?? FALLBACK_CONFIG
  if (!isDark.value) return { color: base.color, icon: base.icon, label: base.label, variant: base.variant }
  return {
    color:   base.colorDark   ?? base.color,
    icon:    base.icon,
    label:   base.label,
    variant: base.variantDark ?? base.variant,
  }
})

/** ดึง description จาก gap-status.config สำหรับ tooltip */
const statusDef = computed(() => getStatusDef(props.status))
</script>

<style scoped>
.gap-status-chip {
  letter-spacing: 0.01em;
  white-space: nowrap;
}

/* ── icon size สม่ำเสมอกับ chip size ── */
.gap-status-chip :deep(.v-icon) {
  font-size: 12px !important;
}
.gap-status-chip.v-chip--size-default :deep(.v-icon) {
  font-size: 14px !important;
}
.gap-status-chip.v-chip--size-large :deep(.v-icon) {
  font-size: 16px !important;
}
</style>
