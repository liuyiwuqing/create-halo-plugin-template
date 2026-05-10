import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/types'

export const THEME_LABEL_KEY: Record<ThemeMode, string> = {
  light: 'theme.light',
  dark: 'theme.dark',
  'business-blue': 'theme.businessBlue',
}

export const isDarkTheme = (mode: ThemeMode) => mode !== 'light'

export const useTheme = () => {
  const themeStore = useThemeStore()

  const mode = computed(() => themeStore.mode)
  const isDark = computed(() => isDarkTheme(themeStore.mode))

  const setTheme = (value: ThemeMode) => {
    themeStore.setTheme(value)
  }

  return {
    mode,
    isDark,
    setTheme,
  }
}
