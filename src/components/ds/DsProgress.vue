<template>
  <div>
    <!-- Linear Progress -->
    <div class="ds-subtitle mb-3">Linear Progress</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-column ga-4 pa-5">
        <div>
          <div class="text-caption text-medium-emphasis mb-2">
            Indeterminate
          </div>
          <v-progress-linear color="primary" indeterminate rounded="lg" />
        </div>
        <div v-for="p in linearItems" :key="p.label">
          <div class="d-flex justify-space-between mb-1">
            <span class="text-caption text-medium-emphasis">{{ p.label }}</span>
            <span class="text-caption font-weight-bold">{{ p.value }}%</span>
          </div>
          <v-progress-linear
            :model-value="p.value"
            :color="p.color"
            rounded="lg"
            height="8"
            :striped="p.striped"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Circular Progress -->
    <div class="ds-subtitle mb-3">Circular Progress</div>
    <v-card class="mb-5">
      <v-card-text
        class="d-flex flex-wrap ga-6 align-center justify-center pa-6"
      >
        <v-progress-circular indeterminate color="primary" />
        <v-progress-circular
          :model-value="65"
          color="primary"
          size="60"
          width="5"
          >65%</v-progress-circular
        >
        <v-progress-circular
          :model-value="82"
          color="success"
          size="60"
          width="5"
          >82%</v-progress-circular
        >
        <v-progress-circular
          :model-value="35"
          color="warning"
          size="60"
          width="5"
          >35%</v-progress-circular
        >
        <v-progress-circular
          :model-value="100"
          color="success"
          size="60"
          width="5"
        >
          <v-icon icon="fas fa-check" size="20" color="success" />
        </v-progress-circular>
      </v-card-text>
    </v-card>

    <!-- Skeleton Loader -->
    <div class="ds-subtitle mb-3">Skeleton Loader</div>
    <v-row>
      <v-col cols="12" md="4">
        <v-skeleton-loader type="card" />
      </v-col>
      <v-col cols="12" md="4">
        <v-skeleton-loader type="list-item-avatar@3" />
      </v-col>
      <v-col cols="12" md="4">
        <v-skeleton-loader type="article" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const linearItems = [
  { label: "ขั้นตอนการอนุมัติ", value: 65, color: "primary", striped: false },
  {
    label: "เอกสารที่ตรวจสอบแล้ว",
    value: 82,
    color: "success",
    striped: false,
  },
  { label: "ใบรับรองที่ใกล้หมด", value: 87, color: "warning", striped: true },
];
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary));
  opacity: 0.75;
}
</style>
