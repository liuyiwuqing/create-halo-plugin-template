import type {
  PluginTemplateChecklistItem as RawPluginTemplateChecklistItem,
  PluginTemplateFeatureItem as RawPluginTemplateFeatureItem,
  PluginTemplateOverview as RawPluginTemplateOverview,
  PluginTemplateStatItem as RawPluginTemplateStatItem,
} from '@/api/generated'
import type { PluginTemplateOverview } from '@/types'

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
