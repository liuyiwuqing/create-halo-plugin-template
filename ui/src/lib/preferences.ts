import type { LocaleCode, ThemeMode } from '@/types'

export const THEME_STORAGE_KEY = 'halo-plugin-template:theme'
export const LOCALE_STORAGE_KEY = 'halo-plugin-template:locale'

export const DEFAULT_THEME: ThemeMode = 'light'
export const DEFAULT_LOCALE: LocaleCode = 'zh-CN'

export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'business-blue']
export const LOCALE_CODES: LocaleCode[] = ['zh-CN', 'en-US']

export const isThemeMode = (value: unknown): value is ThemeMode =>
  THEME_MODES.includes(value as ThemeMode)

export const isLocaleCode = (value: unknown): value is LocaleCode =>
  LOCALE_CODES.includes(value as LocaleCode)

export const readStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeMode(value) ? value : DEFAULT_THEME
}

export const readStoredLocale = (): LocaleCode => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const value = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return isLocaleCode(value) ? value : DEFAULT_LOCALE
}
