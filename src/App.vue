<template>
  <v-app :theme="themeStore.currentTheme">
    <router-view />
  </v-app>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()
</script>
