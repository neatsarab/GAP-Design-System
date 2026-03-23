<template>
  <div>
    <v-skeleton-loader v-if="loading" type="list-item-avatar@4" />

    <v-timeline
      v-else-if="items.length"
      side="end"
      density="compact"
      truncate-line="both"
    >
      <v-timeline-item
        v-for="item in items"
        :key="item.id"
        :dot-color="item.iconColor ?? 'primary'"
        size="small"
      >
        <template #icon>
          <v-icon :icon="item.icon" size="12" color="white" />
        </template>

        <template #opposite>
          <div class="text-caption text-disabled text-right" style="min-width:70px">
            <div>{{ item.date }}</div>
            <div v-if="item.time">{{ item.time }}</div>
          </div>
        </template>

        <v-card variant="flat" class="border" rounded="lg">
          <v-card-text class="pa-3">
            <div class="text-body-2 font-weight-medium">{{ item.title }}</div>
            <div v-if="item.description" class="text-caption text-medium-emphasis mt-1">
              {{ item.description }}
            </div>
            <div v-if="item.user" class="text-caption text-disabled mt-1">
              <v-icon icon="fas fa-user" size="10" class="mr-1" />{{ item.user }}
            </div>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    <AppEmptyState
      v-else
      icon="fas fa-timeline"
      title="ไม่มีประวัติ"
    />
  </div>
</template>

<script setup>
import AppEmptyState from './AppEmptyState.vue'

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
</script>
