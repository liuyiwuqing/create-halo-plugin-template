import type {
  PluginTemplateRecord as RawPluginTemplateRecord,
  PluginTemplateRecordList as RawPluginTemplateRecordList,
} from '@/api/generated'
import { t } from '@/i18n'
import type {
  PluginTemplateRecord,
  PluginTemplateRecordFilters,
  PluginTemplateRecordForm,
  PluginTemplateRecordList,
  TemplateRecordSort,
  TemplateRecordStatus,
} from '@/types'

export const TEMPLATE_RECORD_STATUSES: Array<{
  label: string
  value: TemplateRecordStatus
  tone: string
}> = [
  { label: '草稿', value: 'DRAFT', tone: 'info' },
  { label: '已发布', value: 'PUBLISHED', tone: 'success' },
  { label: '已归档', value: 'ARCHIVED', tone: 'warning' },
]

export const createDefaultRecordFilters = (): PluginTemplateRecordFilters => ({
  keyword: '',
  status: '',
  enabled: '',
})

export const createDefaultRecordForm = (): PluginTemplateRecordForm => ({
  title: '',
  status: 'DRAFT',
  enabled: true,
  priority: 0,
  publishTime: '',
  description: '',
})

export const createRecordFormFromRecord = (
  record: PluginTemplateRecord,
): PluginTemplateRecordForm => ({
  id: record.id,
  title: record.title,
  status: resolveRecordStatus(record.status),
  enabled: record.enabled ?? true,
  priority: record.priority ?? 0,
  publishTime: record.publishTime ?? '',
  description: record.description ?? '',
})

export const buildRecordPayload = (
  form: PluginTemplateRecordForm,
): PluginTemplateRecord => ({
  apiVersion: 'plugintemplate.halo.run/v1alpha1',
  kind: 'PluginTemplateRecord',
  metadata: {
    name: form.id ? `plugin-template-record-${form.id}` : '',
  },
  id: form.id ?? '',
  title: form.title.trim(),
  status: form.status,
  enabled: form.enabled,
  priority: Number(form.priority) || 0,
  publishTime: form.publishTime || undefined,
  description: form.description.trim() || undefined,
})

export const buildRecordListRequest = (params: {
  page: number
  size: number
  filters: PluginTemplateRecordFilters
  sort?: TemplateRecordSort
}) => ({
  page: params.page,
  size: params.size,
  sort: resolveRecordSort(params.sort),
  keyword: params.filters.keyword || undefined,
  status: params.filters.status || undefined,
  enabled: params.filters.enabled === '' ? undefined : params.filters.enabled,
})

export const normalizeRecord = (record: Partial<RawPluginTemplateRecord>): PluginTemplateRecord => ({
  apiVersion: record.apiVersion || 'plugintemplate.halo.run/v1alpha1',
  kind: record.kind || 'PluginTemplateRecord',
  metadata: record.metadata || { name: '' },
  id: record.id || '',
  title: record.title || t('common.noData'),
  status: resolveRecordStatus(record.status),
  enabled: record.enabled ?? true,
  priority: record.priority ?? 0,
  publishTime: record.publishTime || '',
  description: record.description || '',
  createTime: record.createTime || '',
  updateTime: record.updateTime || '',
})

export const normalizeRecordList = (
  result: Partial<RawPluginTemplateRecordList>,
): PluginTemplateRecordList => ({
  first: result.first ?? true,
  hasNext: result.hasNext ?? false,
  hasPrevious: result.hasPrevious ?? false,
  items: (result.items ?? []).map(normalizeRecord),
  last: result.last ?? true,
  page: result.page ?? 1,
  size: result.size ?? 10,
  total: result.total ?? 0,
  totalPages: result.totalPages ?? 0,
})

export const getRecordStatusMeta = (status?: string) =>
  (TEMPLATE_RECORD_STATUSES.find((item) => item.value === status) ?? TEMPLATE_RECORD_STATUSES[0])

export const getRecordStatusLabel = (status?: string) => {
  const resolvedStatus = resolveRecordStatus(status)
  return t(`records.status.${resolvedStatus}`)
}

export const formatRecordDate = (value?: string) => {
  if (!value) {
    return '—'
  }
  return value.replace('T', ' ').replace(/\.\d+.*$/, '').replace(/\+.*$/, '')
}

const resolveRecordStatus = (status?: string): TemplateRecordStatus => {
  if (status === 'PUBLISHED' || status === 'ARCHIVED') {
    return status
  }
  return 'DRAFT'
}

const resolveRecordSort = (sort: TemplateRecordSort = 'default') => {
  if (sort === 'updated') {
    return ['updateTime,desc', 'priority,desc']
  }
  if (sort === 'priority') {
    return ['priority,desc', 'updateTime,desc']
  }
  return ['priority,desc', 'createTime,desc']
}
