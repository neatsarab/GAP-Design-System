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
            <v-icon
              v-else-if="step.error"
              icon="fas fa-xmark"
              size="14"
            />
            <v-icon
              v-else
              :icon="step.icon"
              size="14"
            />
          </div>
          <div class="mt-2 text-center" style="min-width:80px">
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
          :class="['step-connector flex-grow-1 mb-7', { 'step-connector--done': idx < modelValue - 1 }]"
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

<script setup lang="ts">
export interface StepItem {
  title: string
  subtitle?: string
  icon: string
  complete?: boolean
  error?: boolean
}

interface Props {
  modelValue: number
  steps: StepItem[]
  linear?: boolean
  hideActions?: boolean
  nextText?: string
  backText?: string
  submitText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  linear: true,
  hideActions: false,
  nextText: 'ถัดไป',
  backText: 'ย้อนกลับ',
  submitText: 'ยืนยัน',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  submit: []
  'step-change': [step: number]
}>()

function stepState(idx: number) {
  const step = props.steps[idx]
  const stepNum = idx + 1
  if (step.error) return 'step-circle--error'
  if (step.complete || stepNum < props.modelValue) return 'step-circle--done'
  if (stepNum === props.modelValue) return 'step-circle--active'
  return 'step-circle--pending'
}

function stepTextColor(idx: number) {
  const stepNum = idx + 1
  if (props.steps[idx].error) return 'text-error'
  if (stepNum === props.modelValue) return 'text-primary'
  if (stepNum < props.modelValue) return 'text-success'
  return 'text-disabled'
}

function next() {
  const next = props.modelValue + 1
  emit('update:modelValue', next)
  emit('step-change', next)
}

function prev() {
  const prev = props.modelValue - 1
  emit('update:modelValue', prev)
  emit('step-change', prev)
}
</script>

<style scoped>
.step-circle {
  width: 36px;
  height: 36px;
  transition: background 0.3s, color 0.3s;
}
.step-circle--active  { background: rgb(var(--v-theme-primary)); color: white; }
.step-circle--done    { background: rgb(var(--v-theme-success)); color: white; }
.step-circle--error   { background: rgb(var(--v-theme-error));   color: white; }
.step-circle--pending { background: rgba(0,0,0,0.08); color: rgba(0,0,0,0.38); }

.step-connector {
  height: 2px;
  background: rgba(0,0,0,0.1);
  margin: 0 8px;
  transition: background 0.3s;
}
.step-connector--done { background: rgb(var(--v-theme-success)); }
</style>
