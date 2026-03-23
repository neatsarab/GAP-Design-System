<template>
  <v-app-bar flat height="70" :style="appBarStyle">

    <!-- Hamburger -->
    <v-btn
      icon="fas fa-bars"
      variant="text"
      size="small"
      class="ml-2"
      @click="$emit('update:rail', !rail)"
    />

    <!-- Search -->
    <div class="d-none d-sm-block ml-3" style="width:210px">
      <v-text-field
        placeholder="ค้นหา..."
        prepend-inner-icon="fas fa-magnifying-glass"
        variant="solo-filled"
        density="compact"
        hide-details
        flat
        rounded="lg"
        bg-color="surface-variant"
      />
    </div>

    <v-spacer />

    <div class="d-flex align-center ga-1 mr-3">
      <!-- Theme toggle -->
      <v-tooltip :text="isDark ? 'Light Mode' : 'Dark Mode'" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="isDark ? 'fas fa-sun' : 'fas fa-moon'"
            variant="text"
            size="small"
            @click="$emit('toggle-theme')"
          />
        </template>
      </v-tooltip>

      <!-- Notification bell -->
      <div class="position-relative mr-1">
        <v-btn variant="text" size="small" icon>
          <v-badge color="error" content="4" floating>
            <v-icon icon="fas fa-bell" size="20" color="primary" />
          </v-badge>
        </v-btn>
      </div>

      <!-- User chip -->
      <v-chip
        variant="outlined"
        color="primary"
        class="mr-3"
        :style="isDark ? '' : 'background:#E9F7EF;'"
        prepend-icon="fas fa-user"
      >
        นิธิพร เทิบจันทึก
        <v-icon icon="fas fa-chevron-down" size="12" class="ml-1" />
      </v-chip>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ isDark: Boolean, rail: Boolean })

defineEmits(['update:rail', 'toggle-theme'])

const appBarStyle = computed(() => ({
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  background: props.isDark
    ? 'rgba(28, 28, 28, 0.92)'
    : 'rgba(255, 255, 255, 0.92)',
  borderBottom: props.isDark
    ? '1px solid rgba(51, 51, 51, 0.8)'
    : '1px solid rgba(224, 224, 224, 0.8)',
}))
</script>
