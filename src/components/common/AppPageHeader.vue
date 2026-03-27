<template>
  <div class="app-page-header mb-6">
    <!-- Breadcrumbs -->
    <v-breadcrumbs
      v-if="breadcrumbs?.length"
      :items="breadcrumbs"
      density="compact"
      class="pa-0 mb-3"
    >
      <template #divider>
        <v-icon icon="fas fa-chevron-right" size="10" />
      </template>
      <template #title="{ item }">
        <router-link
          v-if="item.to"
          :to="item.to"
          class="text-decoration-none text-medium-emphasis text-caption"
        >
          {{ item.title }}
        </router-link>
        <span v-else class="text-caption font-weight-medium">{{
          item.title
        }}</span>
      </template>
    </v-breadcrumbs>

    <!-- Header row -->
    <div class="d-flex align-center justify-space-between ga-4 flex-wrap">
      <div class="d-flex align-center ga-3">
        <!-- Icon box -->
        <div
          v-if="icon"
          class="page-icon-box rounded-xl d-flex align-center justify-center flex-shrink-0"
          style="background: rgba(var(--v-theme-primary), 0.1)"
        >
          <v-icon :icon="icon" color="primary" size="20" />
        </div>

        <div>
          <v-skeleton-loader v-if="loading" type="heading" width="200" />
          <h1 v-else class="page-title">{{ title }}</h1>
          <p v-if="subtitle" class="text-body-2 text-medium-emphasis mt-1 mb-0">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Actions slot -->
      <div class="d-flex ga-2 flex-wrap">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  icon: String,
  breadcrumbs: Array,
  loading: { type: Boolean, default: false },
});
</script>

<style scoped>
.page-icon-box {
  width: 44px;
  height: 44px;
}
</style>
