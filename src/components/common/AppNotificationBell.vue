<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    max-width="380"
    offset="8"
    location="bottom end"
  >
    <template #activator="{ props: menuProps }">
      <v-btn icon variant="text" v-bind="menuProps">
        <v-badge
          :content="unreadCount"
          :model-value="unreadCount > 0"
          color="error"
          max="99"
        >
          <v-icon icon="fas fa-bell" />
        </v-badge>
      </v-btn>
    </template>

    <v-card rounded="xl" min-width="340">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between px-4 py-3 border-b">
        <span class="text-subtitle-2 font-weight-bold">การแจ้งเตือน</span>
        <v-btn
          v-if="unreadCount > 0"
          variant="text"
          size="small"
          color="primary"
          @click="$emit('mark-all-read')"
        >
          อ่านทั้งหมด
        </v-btn>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="pa-4">
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="list-item-avatar"
          class="mb-2"
        />
      </div>

      <!-- Empty -->
      <div v-else-if="!notifications?.length" class="py-8 text-center">
        <v-icon
          icon="fas fa-bell-slash"
          color="grey-lighten-1"
          size="32"
          class="mb-2"
        />
        <div class="text-body-2 text-medium-emphasis">ไม่มีการแจ้งเตือน</div>
      </div>

      <!-- List -->
      <v-list v-else lines="two" class="pa-0">
        <v-list-item
          v-for="n in notifications"
          :key="n.id"
          :class="{ 'unread-item': !n.read }"
          class="px-4 py-3"
          @click="$emit('click-item', n.id)"
        >
          <template #prepend>
            <div
              class="notif-icon rounded-lg d-flex align-center justify-center mr-3 flex-shrink-0"
              :style="{
                background: `rgba(var(--v-theme-${typeColor(n.type)}),0.12)`,
              }"
            >
              <v-icon
                :icon="n.icon ?? typeIcon(n.type)"
                :color="typeColor(n.type)"
                size="16"
              />
            </div>
          </template>

          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ n.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ n.message }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex flex-column align-end ga-1">
              <span class="text-caption text-disabled">{{ n.time }}</span>
              <div v-if="!n.read" class="unread-dot" />
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

defineEmits(["mark-all-read", "click-item"]);

const menuOpen = ref(false);

const unreadCount = computed(
  () => (props.notifications ?? []).filter((n) => !n.read).length,
);

function typeColor(type) {
  const map = {
    info: "info",
    success: "success",
    warning: "warning",
    error: "error",
  };
  return map[type];
}

function typeIcon(type) {
  const map = {
    info: "fas fa-circle-info",
    success: "fas fa-circle-check",
    warning: "fas fa-triangle-exclamation",
    error: "fas fa-circle-xmark",
  };
  return map[type];
}
</script>

<style scoped>
.notif-icon {
  width: 36px;
  height: 36px;
}
.unread-item {
  background: rgba(var(--v-theme-primary), 0.04);
}
.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
}
</style>
