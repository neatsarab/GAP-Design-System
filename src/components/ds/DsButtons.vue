<template>
  <div>
    <!-- Variants -->
    <div class="ds-subtitle mb-3">Variants</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-btn color="primary" variant="elevated">elevated</v-btn>
        <v-btn color="primary" variant="tonal">tonal</v-btn>
        <v-btn color="primary" variant="outlined">outlined</v-btn>
        <v-btn color="primary" variant="text">text</v-btn>
        <v-btn color="primary" variant="plain">plain</v-btn>
        <v-btn color="primary" variant="flat">flat</v-btn>
      </v-card-text>
    </v-card>

    <!-- Semantic Colors -->
    <div class="ds-subtitle mb-3">Semantic Colors</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-btn color="primary">primary</v-btn>
        <v-btn color="secondary">secondary</v-btn>
        <v-btn color="success">success</v-btn>
        <v-btn color="warning">warning</v-btn>
        <v-btn color="error">error</v-btn>
        <v-btn color="info">info</v-btn>
        <v-btn color="grey">grey</v-btn>
      </v-card-text>
    </v-card>

    <!-- Sizes -->
    <div class="ds-subtitle mb-3">Sizes</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-btn color="primary" size="x-small">x-small</v-btn>
        <v-btn color="primary" size="small">small</v-btn>
        <v-btn color="primary" size="default">default</v-btn>
        <v-btn color="primary" size="large">large</v-btn>
        <v-btn color="primary" size="x-large">x-large</v-btn>
      </v-card-text>
    </v-card>

    <!-- States -->
    <div class="ds-subtitle mb-3">States</div>
    <v-card class="mb-5">
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-btn color="primary" :loading="loadingDemo" @click="triggerLoad"
          >loading</v-btn
        >
        <v-btn color="primary" disabled>disabled</v-btn>
        <v-btn color="error" variant="outlined">outlined error</v-btn>
      </v-card-text>
    </v-card>

    <!-- Icons -->
    <div class="ds-subtitle mb-3">Icons</div>
    <v-card>
      <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
        <v-btn color="primary" prepend-icon="fas fa-plus">เพิ่มคำขอ</v-btn>
        <v-btn color="success" prepend-icon="fas fa-circle-check"
          >อนุมัติ</v-btn
        >
        <v-btn
          color="error"
          prepend-icon="fas fa-circle-xmark"
          variant="outlined"
          >ปฏิเสธ</v-btn
        >
        <v-btn color="primary" append-icon="fas fa-download" variant="tonal"
          >ดาวน์โหลด</v-btn
        >
        <v-btn icon color="primary" variant="tonal" size="small">
          <v-icon icon="fas fa-eye" />
        </v-btn>
        <v-btn icon color="warning" variant="tonal" size="small">
          <v-icon icon="fas fa-pencil" />
        </v-btn>
        <v-btn icon color="error" variant="tonal" size="small">
          <v-icon icon="fas fa-trash" />
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const loadingDemo = ref(false);

function triggerLoad() {
  loadingDemo.value = true;
  setTimeout(() => {
    loadingDemo.value = false;
  }, 2000);
}
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary));
  opacity: 0.75;
  margin-top: 8px;
}
</style>
