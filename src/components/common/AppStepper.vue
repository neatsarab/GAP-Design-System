<template>
  <div class="app-stepper">
    <!-- Step indicators -->
    <div class="d-flex align-center mb-8">
      <template v-for="(step, idx) in steps" :key="idx">
        <!-- Step circle -->
        <div class="d-flex flex-column align-center">
          <div
            :class="[
              'step-circle d-flex align-center justify-center rounded-circle',
              stepState(idx),
            ]"
          >
            <v-icon
              v-if="step.complete && !step.error"
              icon="fas fa-check"
              size="14"
            />
            <v-icon v-else-if="step.error" icon="fas fa-xmark" size="14" />
            <v-icon v-else :icon="step.icon" size="14" />
          </div>
          <div class="mt-2 text-center" style="min-width: 80px">
            <div :class="['text-caption font-weight-bold', stepTextColor(idx)]">
              {{ step.title }}
            </div>
            <div v-if="step.subtitle" class="text-caption text-disabled">
              {{ step.subtitle }}
            </div>
          </div>
        </div>

        <!-- Connector -->
        <div
          v-if="idx < steps.length - 1"
          :class="[
            'step-connector flex-grow-1 mb-7',
            { 'step-connector--done': idx < modelValue - 1 },
          ]"
        />
      </template>
    </div>

    <!-- Step content -->
    <div class="step-content">
      <slot :name="`step-${modelValue}`" />
    </div>

    <!-- Actions -->
    <div v-if="!hideActions" class="d-flex ga-3 mt-6 justify-end">
      <v-btn
        v-if="modelValue > 1"
        variant="outlined"
        color="grey"
        prepend-icon="fas fa-chevron-left"
        :disabled="loading"
        @click="prev"
      >
        {{ backText }}
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="modelValue < steps.length"
        color="primary"
        variant="flat"
        append-icon="fas fa-chevron-right"
        :loading="loading"
        @click="next"
      >
        {{ nextText }}
      </v-btn>
      <v-btn
        v-else
        color="success"
        variant="flat"
        prepend-icon="fas fa-check"
        :loading="loading"
        @click="$emit('submit')"
      >
        {{ submitText }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Number,
  steps: Array,
  linear: { type: Boolean, default: true },
  hideActions: { type: Boolean, default: false },
  nextText: { type: String, default: "ถัดไป" },
  backText: { type: String, default: "ย้อนกลับ" },
  submitText: { type: String, default: "ยืนยัน" },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submit", "step-change"]);

function stepState(idx) {
  const step = props.steps[idx];
  const stepNum = idx + 1;
  if (step.error) return "step-circle--error";
  if (step.complete || stepNum < props.modelValue) return "step-circle--done";
  if (stepNum === props.modelValue) return "step-circle--active";
  return "step-circle--pending";
}

function stepTextColor(idx) {
  const stepNum = idx + 1;
  if (props.steps[idx].error) return "text-error";
  if (stepNum === props.modelValue) return "text-primary";
  if (stepNum < props.modelValue) return "text-success";
  return "text-disabled";
}

function next() {
  const next = props.modelValue + 1;
  emit("update:modelValue", next);
  emit("step-change", next);
}

function prev() {
  const prev = props.modelValue - 1;
  emit("update:modelValue", prev);
  emit("step-change", prev);
}
</script>
