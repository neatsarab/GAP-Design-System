<template>
  <v-navigation-drawer
    :model-value="drawer"
    :rail="rail"
    permanent
    :color="isDark ? '#1e1e1e' : 'white'"
    :style="isDark ? 'border-right:1px solid #2a2a2a' : 'border-right:1px solid #E0E0E0'"
    @update:model-value="$emit('update:drawer', $event)"
  >
    <!-- Brand / Logo -->
    <v-list-item nav class="py-4 px-4">
      <template v-slot:prepend>
        <div
          class="d-flex align-center justify-center rounded-lg mr-3"
          :style="`width:40px;height:44px;flex-shrink:0;background:${isDark ? 'rgba(76,175,110,0.15)' : '#E9F7EF'}`"
        >
          <v-icon icon="fas fa-leaf" color="primary" size="20" />
        </div>
      </template>
      <v-list-item-title
        class="font-weight-medium"
        :style="`font-size:14px;line-height:1.4;color:${isDark ? '#EEEEEE' : '#424242'}`"
      >
        ระบบรับรองแหล่งผลิต GAP พืช
      </v-list-item-title>
      <v-list-item-subtitle :style="`font-size:10px;color:${isDark ? '#757575' : '#616161'}`">
        กรมวิชาการเกษตร
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-btn
          :icon="rail ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"
          variant="text"
          :color="isDark ? 'grey-lighten-1' : 'grey-darken-1'"
          size="small"
          @click="$emit('update:rail', !rail)"
        />
      </template>
    </v-list-item>

    <!-- User Card -->
    <div v-if="!rail" class="px-4 mb-2">
      <div
        class="rounded-lg pa-3 d-flex align-center ga-2"
        :style="isDark
          ? 'background:rgba(76,175,110,0.1);border:1px solid rgba(76,175,110,0.35)'
          : 'background:#E9F7EF;border:1px solid #4CAF6E'"
      >
        <v-avatar color="primary" size="32">
          <v-icon icon="fas fa-user" size="16" color="white" />
        </v-avatar>
        <div class="flex-grow-1 overflow-hidden">
          <div
            class="text-truncate font-weight-medium"
            :style="`font-size:14px;color:${isDark ? '#4CAF6E' : '#357E4E'}`"
          >นิธิพร เทิบจันทึก</div>
          <div :style="`font-size:11px;color:${isDark ? '#616161' : '#757575'}`">เลขทะเบียน : 19903004</div>
        </div>
        <v-icon icon="fas fa-chevron-down" size="12" color="primary" />
      </div>
    </div>

    <v-divider class="mx-3" :color="isDark ? '#2a2a2a' : '#E0E0E0'" />

    <v-list density="compact" nav class="mt-1 px-2">

      <!-- Design Tokens -->
      <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">Design Tokens</div>
      <v-list-item
        v-for="section in navSections.slice(0, 2)"
        :key="section.id"
        :prepend-icon="section.icon"
        :title="section.title"
        :value="section.id"
        :active="activeSection === section.id"
        :active-color="isDark ? '#4CAF6E' : '#357E4E'"
        :color="isDark ? '#9E9E9E' : '#616161'"
        rounded="lg"
        class="mb-1"
        :style="activeSection === section.id
          ? (isDark ? 'background:rgba(76,175,110,0.15)' : 'background:#E9F7EF')
          : ''"
        @click="$emit('navigate', section.id)"
      />

      <!-- Components -->
      <v-divider class="mx-2 my-2" :color="isDark ? '#2a2a2a' : '#E0E0E0'" />
      <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">Components</div>
      <v-list-item
        v-for="section in navSections.slice(2, 9)"
        :key="section.id"
        :prepend-icon="section.icon"
        :title="section.title"
        :value="section.id"
        :active="activeSection === section.id"
        :active-color="isDark ? '#4CAF6E' : '#357E4E'"
        :color="isDark ? '#9E9E9E' : '#616161'"
        rounded="lg"
        class="mb-1"
        :style="activeSection === section.id
          ? (isDark ? 'background:rgba(76,175,110,0.15)' : 'background:#E9F7EF')
          : ''"
        @click="$emit('navigate', section.id)"
      />

      <!-- Patterns -->
      <v-divider class="mx-2 my-2" :color="isDark ? '#2a2a2a' : '#E0E0E0'" />
      <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">Patterns</div>
      <v-list-item
        v-for="section in navSections.slice(9)"
        :key="section.id"
        :prepend-icon="section.icon"
        :title="section.title"
        :value="section.id"
        :active="activeSection === section.id"
        :active-color="isDark ? '#4CAF6E' : '#357E4E'"
        :color="isDark ? '#9E9E9E' : '#616161'"
        rounded="lg"
        class="mb-1"
        :style="activeSection === section.id
          ? (isDark ? 'background:rgba(76,175,110,0.15)' : 'background:#E9F7EF')
          : ''"
        @click="$emit('navigate', section.id)"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>

defineProps({ isDark: Boolean, drawer: Boolean, rail: Boolean, navSections: Array, activeSection: String })

defineEmits(['update:drawer', 'update:rail', 'navigate'])
</script>

<style scoped>
.sidebar-group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 12px 4px;
}
</style>
