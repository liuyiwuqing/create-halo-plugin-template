import { defineStore } from 'pinia'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isLocaleCode, readStoredLocale } from '@/lib/preferences'
import { setI18nLocale } from '@/i18n'
import type { LocaleCode } from '@/types'

interface LocaleState {
  locale: LocaleCode
}

export const useLocaleStore = defineStore('plugin-template-locale', {
  state: (): LocaleState => ({
    locale: readStoredLocale(),
  }),
  actions: {
    setLocale(locale: LocaleCode) {
      this.locale = locale
      setI18nLocale(locale)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
      }
    },
    hydrate() {
      const locale = readStoredLocale()
      this.locale = isLocaleCode(locale) ? locale : DEFAULT_LOCALE
      setI18nLocale(this.locale)
    },
  },
})
