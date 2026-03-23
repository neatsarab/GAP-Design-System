<template>
  <v-card>
    <v-card-text class="pa-0">
      <template v-for="(t, i) in typographyList" :key="t.class">
        <div class="d-flex align-center px-5 py-4 ga-4 flex-wrap">
          <div style="min-width:280px;flex:1">
            <div :class="t.class">{{ t.sample }}</div>
          </div>
          <div class="d-flex align-center ga-2 flex-shrink-0">
            <code
              class="text-caption px-2 py-1 rounded-lg"
              style="background:rgba(var(--v-theme-surface-variant),1);font-size:11px;font-family:monospace"
            >
              .{{ t.class }}
            </code>
            <span class="text-caption text-medium-emphasis">{{ t.desc }}</span>
          </div>
        </div>
        <v-divider v-if="i < typographyList.length - 1" />
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
const typographyList = [
  { class: 'text-h4 font-weight-bold',        sample: 'Heading 4 — ชื่อหน้า Dashboard',              desc: 'Font size 34px · Bold' },
  { class: 'text-h5',                          sample: 'Heading 5 — ชื่อ Card หลัก',                  desc: 'Font size 24px' },
  { class: 'text-h6 font-weight-bold',         sample: 'Heading 6 — ชื่อ Section',                    desc: 'Font size 20px · Bold' },
  { class: 'text-subtitle-1 font-weight-bold', sample: 'Subtitle 1 — หัวข้อย่อย',                    desc: 'Font size 16px · Bold' },
  { class: 'text-subtitle-2',                  sample: 'Subtitle 2 — ชื่อ Field Label',               desc: 'Font size 14px · Medium' },
  { class: 'text-body-1',                      sample: 'Body 1 — เนื้อหาหลัก ข้อความทั่วไปในระบบ',    desc: 'Font size 16px' },
  { class: 'text-body-2',                      sample: 'Body 2 — ข้อความใน List, Table, Card',        desc: 'Font size 14px' },
  { class: 'text-caption text-grey-darken-1',  sample: 'Caption — หมายเหตุ วันที่ Label เล็ก',        desc: 'Font size 12px' },
  { class: 'text-overline',                    sample: 'OVERLINE — หัวหมวดหมู่',                      desc: 'Font size 10px · Uppercase' },
]
</script>
