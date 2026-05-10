import { computed } from 'vue'
import { useLocaleStore } from '@/stores/locale'
import type { LocaleCode } from '@/types'

export const LOCALE_LABEL_KEY: Record<LocaleCode, string> = {
  'zh-CN': 'locale.zhCN',
  'en-US': 'locale.enUS',
}

export const useLocale = () => {
  const localeStore = useLocaleStore()

  const locale = computed(() => localeStore.locale)
  const setLocale = (value: LocaleCode) => localeStore.setLocale(value)

  return {
    locale,
    setLocale,
  }
}
