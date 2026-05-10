import { defineStore } from 'pinia'
import { DEFAULT_THEME, THEME_STORAGE_KEY, isThemeMode, readStoredTheme } from '@/lib/preferences'
import type { ThemeMode } from '@/types'

interface ThemeState {
  mode: ThemeMode
}

export const useThemeStore = defineStore('plugin-template-theme', {
  state: (): ThemeState => ({
    mode: readStoredTheme(),
  }),
  getters: {
    isDark: (state) => state.mode !== 'light',
  },
  actions: {
    setTheme(mode: ThemeMode) {
      this.mode = mode
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, mode)
      }
    },
    hydrate() {
      const mode = readStoredTheme()
      this.mode = isThemeMode(mode) ? mode : DEFAULT_THEME
    },
  },
})
