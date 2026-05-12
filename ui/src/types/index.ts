import type {
  PluginTemplateChecklistItem as GeneratedPluginTemplateChecklistItem,
  PluginTemplateFeatureItem as GeneratedPluginTemplateFeatureItem,
  PluginTemplateOverview as GeneratedPluginTemplateOverview,
  PluginTemplateRecord as GeneratedPluginTemplateRecord,
  PluginTemplateRecordList as GeneratedPluginTemplateRecordList,
  PluginTemplateStatItem as GeneratedPluginTemplateStatItem,
} from '@/api/generated'

export interface PluginTemplateStatItem extends GeneratedPluginTemplateStatItem {
  key: string
  label: string
  value: string
  helper: string
  tone: string
}

export interface PluginTemplateFeatureItem extends GeneratedPluginTemplateFeatureItem {
  key: string
  title: string
  area: string
  description: string
  enabled: boolean
}

export interface PluginTemplateChecklistItem extends GeneratedPluginTemplateChecklistItem {
  key: string
  title: string
  description: string
  audience: string
  status: string
}

export interface PluginTemplateOverview extends GeneratedPluginTemplateOverview {
  pluginName: string
  displayName: string
  audience: string
  audienceLabel: string
  consolePath: string
  ucPath: string
  settingName: string
  configMapName: string
  generatedClientPath: string
  generatedAt: string
  enableConsoleDashboard: boolean
  enableUcDashboard: boolean
  enableAttachmentProvider: boolean
  accentColor: string
  density: string
  supportLink: string
  stats: PluginTemplateStatItem[]
  features: PluginTemplateFeatureItem[]
  checklist: PluginTemplateChecklistItem[]
}

export interface PluginTemplateRecordView extends GeneratedPluginTemplateRecord {
  id: string
  title: string
  description: string
  status: string
  statusLabel: string
  statusTone: string
  createTime: string
  updateTime: string
  createTimeLabel: string
  updateTimeLabel: string
}

export interface PluginTemplateRecordListView extends GeneratedPluginTemplateRecordList {
  items: PluginTemplateRecordView[]
}

export interface PluginTemplateRecordListQuery {
  page?: number
  size?: number
  sort?: string[]
  status?: string
  keyword?: string
}

export interface PluginTemplateRecordFormPayload {
  id?: string
  title: string
  description?: string
  status?: string
}
