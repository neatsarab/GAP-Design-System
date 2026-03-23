import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(
    localStorage.getItem('gap-theme') === 'dark'
  )

  const currentTheme = computed(() =>
    isDark.value ? 'gapDark' : 'gapLight'
  )

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('gap-theme', isDark.value ? 'dark' : 'light')
  }

  function setDark(value) {
    isDark.value = value
    localStorage.setItem('gap-theme', value ? 'dark' : 'light')
  }

  return { isDark, currentTheme, toggle, setDark }
})
