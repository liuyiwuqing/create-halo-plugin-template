import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE, readStoredLocale } from './lib/preferences'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'
import type { LocaleCode } from './types'

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const

export const i18n = createI18n({
  legacy: false,
  locale: readStoredLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})

export const t = i18n.global.t

export const setI18nLocale = (locale: LocaleCode) => {
  i18n.global.locale.value = locale
}
