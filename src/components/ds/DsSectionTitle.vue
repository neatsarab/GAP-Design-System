<template>
  <div class="mb-5">
    <div class="d-flex align-center ga-3 mb-4">
      <div
        class="rounded-lg d-flex align-center justify-center"
        style="width:34px;height:34px;flex-shrink:0;background:rgba(var(--v-theme-primary),0.12)"
      >
        <v-icon :icon="icon" color="primary" size="17" />
      </div>
      <h2 class="text-h6 font-weight-bold">{{ title }}</h2>
    </div>
    <v-divider />
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: string; title: string }>()
</script>
