<template>
  <div>
    <div class="ds-subtitle mb-3">Font Awesome Icons ({{ iconList.length }} icons)</div>
    <v-row dense>
      <v-col
        v-for="item in iconList"
        :key="item.icon"
        cols="6" sm="4" md="3" lg="2"
      >
        <v-card class="text-center pa-3" variant="outlined">
          <v-icon :icon="item.icon" color="primary" size="24" class="mb-2" />
          <div class="text-caption text-medium-emphasis" style="font-size:10px;word-break:break-all">
            {{ item.icon.replace('fas fa-', '') }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const iconList = [
  'fas fa-leaf',               'fas fa-seedling',          'fas fa-file-lines',         'fas fa-file-pen',
  'fas fa-certificate',        'fas fa-clipboard-check',   'fas fa-calendar-days',      'fas fa-location-dot',
  'fas fa-user',               'fas fa-users',             'fas fa-user-gear',           'fas fa-user-tie',
  'fas fa-paper-plane',        'fas fa-circle-check',      'fas fa-circle-xmark',        'fas fa-ban',
  'fas fa-clock',              'fas fa-bell',              'fas fa-download',            'fas fa-camera',
  'fas fa-magnifying-glass',   'fas fa-plus',              'fas fa-pencil',              'fas fa-trash',
  'fas fa-eye',                'fas fa-floppy-disk',       'fas fa-gear',                'fas fa-gauge',
  'fas fa-right-from-bracket', 'fas fa-file-magnifying-glass', 'fas fa-ruler-combined', 'fas fa-calendar-plus',
  'fas fa-paperclip',          'fas fa-tags',              'fas fa-circle-info',         'fas fa-timeline',
].map(icon => ({ icon }))
</script>

<style scoped>
.ds-subtitle {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary)); opacity: 0.75;
}
</style>
