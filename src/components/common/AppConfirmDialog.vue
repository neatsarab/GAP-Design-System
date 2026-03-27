<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="xl">
      <v-card-text class="text-center pa-8">
        <div
          class="icon-box rounded-circle d-inline-flex align-center justify-center mb-4"
          :style="{ background: `rgba(var(--v-theme-${iconColor}),0.12)` }"
        >
          <v-icon :icon="icon" :color="iconColor" size="28" />
        </div>
        <div class="text-h6 font-weight-bold mb-2">{{ title }}</div>
        <div class="text-body-2 text-medium-emphasis">{{ message }}</div>
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-0 d-flex ga-2">
        <v-btn
          variant="text"
          :disabled="loading"
          class="flex-grow-1"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          :loading="loading"
          class="flex-grow-1"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: "ยืนยันการดำเนินการ" },
  message: { type: String, default: "คุณต้องการดำเนินการนี้ใช่หรือไม่?" },
  confirmText: { type: String, default: "ยืนยัน" },
  cancelText: { type: String, default: "ยกเลิก" },
  confirmColor: { type: String, default: "error" },
  icon: { type: String, default: "fas fa-circle-exclamation" },
  iconColor: { type: String, default: "error" },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

function handleCancel() {
  emit("cancel");
  emit("update:modelValue", false);
}
</script>

<style scoped>
.icon-box {
  width: 64px;
  height: 64px;
}
</style>
