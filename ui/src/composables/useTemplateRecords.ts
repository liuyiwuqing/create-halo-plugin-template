import { computed, reactive, ref } from 'vue'
import { templateConsoleApi } from '@/api'
import { t } from '@/i18n'
import { createDefaultRecordFilters } from '@/lib/template-records'
import type {
  PluginTemplateRecord,
  PluginTemplateRecordFilters,
  PluginTemplateRecordForm,
} from '@/types'

export const useTemplateRecords = () => {
  const filters = reactive<PluginTemplateRecordFilters>(createDefaultRecordFilters())
  const records = ref<PluginTemplateRecord[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deletingId = ref('')
  const errorMessage = ref('')
  const page = ref(1)
  const size = ref(10)
  const total = ref(0)

  const load = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const result = await templateConsoleApi.listRecords({
        page: page.value,
        size: size.value,
        filters,
      })
      records.value = result.items
      page.value = result.page || page.value
      size.value = result.size || size.value
      total.value = result.total
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : t('records.loadError')
    } finally {
      loading.value = false
    }
  }

  const search = async () => {
    page.value = 1
    await load()
  }

  const resetFilters = async () => {
    Object.assign(filters, createDefaultRecordFilters())
    await search()
  }

  const save = async (form: PluginTemplateRecordForm) => {
    saving.value = true
    try {
      if (form.id) {
        await templateConsoleApi.updateRecord(form.id, form)
      } else {
        await templateConsoleApi.createRecord(form)
      }
      await load()
    } finally {
      saving.value = false
    }
  }

  const remove = async (id: string) => {
    deletingId.value = id
    try {
      await templateConsoleApi.deleteRecord(id)
      if (records.value.length === 1 && page.value > 1) {
        page.value -= 1
      }
      await load()
    } finally {
      deletingId.value = ''
    }
  }

  return {
    filters,
    records,
    loading,
    saving,
    deletingId,
    errorMessage,
    page,
    size,
    total,
    hasRecords: computed(() => records.value.length > 0),
    load,
    search,
    resetFilters,
    save,
    remove,
  }
}
