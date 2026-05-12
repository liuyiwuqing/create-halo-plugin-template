import type {
  PluginTemplateChecklistItem as RawPluginTemplateChecklistItem,
  PluginTemplateFeatureItem as RawPluginTemplateFeatureItem,
  PluginTemplateOverview as RawPluginTemplateOverview,
  PluginTemplateRecord as RawPluginTemplateRecord,
  PluginTemplateRecordCreateRequest,
  PluginTemplateRecordList as RawPluginTemplateRecordList,
  PluginTemplateRecordUpdateRequest,
  PluginTemplateStatItem as RawPluginTemplateStatItem,
} from '@/api/generated'
import type {
  PluginTemplateOverview,
  PluginTemplateRecordFormPayload,
  PluginTemplateRecordListQuery,
  PluginTemplateRecordListView,
  PluginTemplateRecordView,
} from '@/types'

export type RawTemplateOverview = RawPluginTemplateOverview & {
  enableConsoleDashboard?: boolean
  enableUcDashboard?: boolean
  enableAttachmentProvider?: boolean
  accentColor?: string
  density?: string
  supportLink?: string
}

export const normalizeStats = (stats?: RawPluginTemplateStatItem[]) =>
  (stats ?? []).map((item, index) => ({
    key: item.key || `stat-${index}`,
    label: item.label || '未命名指标',
    value: item.value || '—',
    helper: item.helper || '',
    tone: item.tone || 'info',
  }))

export const normalizeFeatures = (features?: RawPluginTemplateFeatureItem[]) =>
  (features ?? []).map((item, index) => ({
    key: item.key || `feature-${index}`,
    title: item.title || '未命名能力',
    area: item.area || 'General',
    description: item.description || '',
    enabled: Boolean(item.enabled),
  }))

export const normalizeChecklist = (checklist?: RawPluginTemplateChecklistItem[]) =>
  (checklist ?? []).map((item, index) => ({
    key: item.key || `checklist-${index}`,
    title: item.title || '未命名检查项',
    description: item.description || '',
    audience: item.audience || 'all',
    status: item.status || 'todo',
  }))

export const normalizeOverview = (overview: RawTemplateOverview): PluginTemplateOverview => ({
  pluginName: overview.pluginName || 'halo-plugin-template',
  displayName: overview.displayName || 'Halo Plugin Template',
  audience: overview.audience || 'console',
  audienceLabel: overview.audienceLabel || 'Console',
  consolePath: overview.consolePath || '/halo-plugin-template',
  ucPath: overview.ucPath || '/halo-plugin-template',
  settingName: overview.settingName || 'halo-plugin-template-settings',
  configMapName: overview.configMapName || 'halo-plugin-template-configmap',
  generatedClientPath: overview.generatedClientPath || 'ui/src/api/generated',
  generatedAt: overview.generatedAt || '',
  enableConsoleDashboard: overview.enableConsoleDashboard ?? true,
  enableUcDashboard: overview.enableUcDashboard ?? true,
  enableAttachmentProvider: overview.enableAttachmentProvider ?? true,
  accentColor: overview.accentColor || '#2457F5',
  density: overview.density || 'balanced',
  supportLink: overview.supportLink || 'https://docs.halo.run/developer-guide/plugin/introduction',
  stats: normalizeStats(overview.stats),
  features: normalizeFeatures(overview.features),
  checklist: normalizeChecklist(overview.checklist),
})

const normalizeOptional = (value?: string | null) => {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

const formatRecordDateTime = (value?: string | null) => {
  const normalized = normalizeOptional(value)
  if (!normalized) {
    return '—'
  }

  const isoMatch = normalized.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/)
  if (isoMatch) {
    return `${isoMatch[1]} ${isoMatch[2]}`
  }

  return normalized
}

const resolveRecordStatus = (status?: string | null) => {
  const normalized = normalizeOptional(status) || 'draft'
  switch (normalized) {
    case 'draft':
      return { status: normalized, statusLabel: '草稿', statusTone: 'warning' }
    case 'published':
      return { status: normalized, statusLabel: '已发布', statusTone: 'success' }
    case 'active':
      return { status: normalized, statusLabel: '启用', statusTone: 'success' }
    case 'archived':
      return { status: normalized, statusLabel: '已归档', statusTone: 'info' }
    case 'disabled':
      return { status: normalized, statusLabel: '已禁用', statusTone: 'danger' }
    default:
      return { status: normalized, statusLabel: normalized, statusTone: 'info' }
  }
}

export const normalizeTemplateRecord = (
  record: RawPluginTemplateRecord,
): PluginTemplateRecordView => {
  const status = resolveRecordStatus(record.status)

  return {
    ...record,
    id: normalizeOptional(record.id) || '—',
    title: normalizeOptional(record.title) || '未命名记录',
    description: normalizeOptional(record.description) || '—',
    status: status.status,
    statusLabel: status.statusLabel,
    statusTone: status.statusTone,
    createTime: normalizeOptional(record.createTime) || '',
    updateTime: normalizeOptional(record.updateTime) || '',
    createTimeLabel: formatRecordDateTime(record.createTime),
    updateTimeLabel: formatRecordDateTime(record.updateTime),
  }
}

export const normalizeTemplateRecordList = (
  result: RawPluginTemplateRecordList,
): PluginTemplateRecordListView => ({
  ...result,
  items: (result.items || []).map((item) => normalizeTemplateRecord(item)),
})

export const toTemplateRecordListRequest = (query: PluginTemplateRecordListQuery = {}) => ({
  page: query.page && query.page > 0 ? query.page : 1,
  size: query.size && query.size > 0 ? query.size : 10,
  sort: query.sort?.length ? query.sort : undefined,
  status: normalizeOptional(query.status),
  keyword: normalizeOptional(query.keyword),
})

const normalizedTitle = (title: string) => title.trim()

export const toTemplateRecordCreateRequest = (
  payload: PluginTemplateRecordFormPayload,
): PluginTemplateRecordCreateRequest => ({
  id: normalizeOptional(payload.id),
  title: normalizedTitle(payload.title),
  description: normalizeOptional(payload.description),
  status: normalizeOptional(payload.status),
})

export const toTemplateRecordUpdateRequest = (
  payload: PluginTemplateRecordFormPayload,
): PluginTemplateRecordUpdateRequest => ({
  title: normalizedTitle(payload.title),
  description: normalizeOptional(payload.description),
  status: normalizeOptional(payload.status),
})
