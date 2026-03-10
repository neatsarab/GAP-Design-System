<template>
  <div class="text-center py-12 px-4">
    <div
      class="icon-box rounded-circle d-inline-flex align-center justify-center mb-5"
      style="background: rgba(0,0,0,0.04)"
    >
      <v-icon :icon="icon" :color="iconColor" size="40" />
    </div>

    <div class="text-h6 font-weight-bold mb-2">{{ title }}</div>

    <div v-if="message" class="text-body-2 text-medium-emphasis mb-6 mx-auto" style="max-width:320px">
      {{ message }}
    </div>

    <v-btn
      v-if="actionLabel"
      :color="actionColor"
      variant="flat"
      prepend-icon="fas fa-plus"
      rounded="lg"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  iconColor?: string
  title?: string
  message?: string
  actionLabel?: string
  actionColor?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'fas fa-inbox',
  iconColor: 'grey-lighten-1',
  title: 'ไม่พบข้อมูล',
  actionColor: 'primary',
})

defineEmits<{ action: [] }>()
</script>

<style scoped>
.icon-box {
  width: 80px;
  height: 80px;
}
</style>
