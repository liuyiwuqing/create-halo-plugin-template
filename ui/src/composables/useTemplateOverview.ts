import { computed, ref } from 'vue'
import { templateConsoleApi, templateUcApi } from '@/api'
import type { PluginTemplateOverview } from '@/types'

type Audience = 'console' | 'uc'

export const useTemplateOverview = (audience: Audience) => {
  const overview = ref<PluginTemplateOverview | null>(null)
  const loading = ref(false)
  const errorMessage = ref('')

  const load = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
      const response =
        audience === 'console'
          ? await templateConsoleApi.getOverview()
          : await templateUcApi.getOverview()
      overview.value = response
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '模板概览加载失败'
    } finally {
      loading.value = false
    }
  }

  return {
    overview,
    loading,
    errorMessage,
    stats: computed(() => overview.value?.stats ?? []),
    features: computed(() => overview.value?.features ?? []),
    checklist: computed(() => overview.value?.checklist ?? []),
    load,
  }
}
