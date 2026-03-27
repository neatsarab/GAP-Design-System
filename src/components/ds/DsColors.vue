<template>
  <div>
    <div class="ds-subtitle mb-3">Theme Colors</div>
    <v-row class="mb-6">
      <v-col
        v-for="c in themeColors"
        :key="c.key"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card>
          <div
            :style="`height:60px;border-radius:12px 12px 0 0;background:rgb(var(--v-theme-${c.key}))`"
          />
          <v-card-text class="pa-3">
            <div class="text-caption font-weight-bold text-capitalize">
              {{ c.label }}
            </div>
            <code
              class="text-caption text-medium-emphasis"
              style="font-size: 10px; background: transparent"
              >{{ c.hex }}</code
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="ds-subtitle mb-3">Status Colors</div>
    <v-row>
      <v-col
        v-for="s in statusColors"
        :key="s.status"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card>
          <div
            :class="`bg-${s.vuetify}`"
            style="height: 44px; border-radius: 12px 12px 0 0"
          />
          <v-card-text class="pa-3">
            <div class="text-caption font-weight-bold" style="font-size: 10px">
              {{ s.label }}
            </div>
            <div
              class="text-caption text-medium-emphasis"
              style="font-size: 10px"
            >
              {{ s.status }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ isDark: { type: Boolean, default: false } });

const lightThemeColors = [
  { key: "primary", label: "primary", hex: "#4CAF6E" },
  { key: "secondary", label: "secondary", hex: "#FF8F00" },
  { key: "success", label: "success", hex: "#43A047" },
  { key: "warning", label: "warning", hex: "#FB8C00" },
  { key: "error", label: "error", hex: "#FF5252" },
  { key: "info", label: "info", hex: "#1E88E5" },
  { key: "background", label: "background", hex: "#F5F5F5" },
  { key: "surface", label: "surface", hex: "#FFFFFF" },
  { key: "surface-variant", label: "surface-variant", hex: "#E9F7EF" },
];
const darkThemeColors = [
  { key: "primary", label: "primary", hex: "#A5D6A7" },
  { key: "secondary", label: "secondary", hex: "#FFB300" },
  { key: "success", label: "success", hex: "#A5D6A7" },
  { key: "warning", label: "warning", hex: "#FFCC80" },
  { key: "error", label: "error", hex: "#EF9A9A" },
  { key: "info", label: "info", hex: "#90CAF9" },
  { key: "background", label: "background", hex: "#111111" },
  { key: "surface", label: "surface", hex: "#1c1c1c" },
  { key: "surface-variant", label: "surface-variant", hex: "#2a2a2a" },
];

const themeColors = computed(() =>
  props.isDark ? darkThemeColors : lightThemeColors,
);

const statusColors = [
  { status: "DRAFT", vuetify: "grey", label: "ร่าง" },
  { status: "SUBMITTED", vuetify: "blue", label: "ยื่นแล้ว" },
  { status: "DOC_REVIEW", vuetify: "orange", label: "ตรวจเอกสาร" },
  { status: "INSPECTION_SCHEDULED", vuetify: "purple", label: "นัดตรวจ" },
  { status: "INSPECTING", vuetify: "indigo", label: "กำลังตรวจ" },
  { status: "APPROVED", vuetify: "green", label: "อนุมัติ" },
  { status: "REJECTED", vuetify: "red", label: "ไม่ผ่าน" },
  { status: "CERT_ISSUED", vuetify: "teal", label: "ออกใบรับรอง" },
  { status: "CERT_EXPIRED", vuetify: "brown", label: "หมดอายุ" },
];
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary));
  opacity: 0.75;
}
</style>
