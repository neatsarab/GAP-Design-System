<template>
  <v-card
    :to="to"
    :ripple="!!to"
    :class="['app-stat-card', { 'app-stat-card--clickable': !!to }]"
    height="100%"
  >
    <v-skeleton-loader v-if="loading" type="list-item-two-line" />

    <v-card-text v-else class="pa-5">
      <div class="d-flex align-start justify-space-between ga-3">
        <!-- Icon Box -->
        <div
          class="stat-icon-box rounded-lg d-flex align-center justify-center flex-shrink-0"
          :style="{ background: `rgba(var(--v-theme-${iconColor ?? 'primary'}),0.12)` }"
        >
          <v-icon :icon="icon" :color="iconColor ?? 'primary'" size="22" />
        </div>

        <!-- Trend chip -->
        <v-chip
          v-if="trend !== undefined"
          :color="trend >= 0 ? 'success' : 'error'"
          size="x-small"
          variant="tonal"
          class="flex-shrink-0"
        >
          <v-icon
            :icon="trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
            size="10"
            start
          />
          {{ Math.abs(trend) }}%
        </v-chip>
      </div>

      <div class="mt-4">
        <div class="text-h4 font-weight-bold">{{ value }}</div>
        <div class="text-body-2 text-medium-emphasis mt-1">{{ label }}</div>
        <div v-if="trendLabel && trend !== undefined" class="text-caption text-disabled mt-1">
          {{ trendLabel }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  iconColor?: string
  label: string
  value: string | number
  trend?: number
  trendLabel?: string
  loading?: boolean
  to?: string
}

withDefaults(defineProps<Props>(), {
  iconColor: 'primary',
  loading: false,
})
</script>

<style scoped>
.stat-icon-box {
  width: 44px;
  height: 44px;
}
.app-stat-card--clickable {
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.app-stat-card--clickable:hover {
  transform: translateY(-2px);
}
</style>
