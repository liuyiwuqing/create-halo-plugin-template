import type {
  PluginTemplateChecklistItem as GeneratedPluginTemplateChecklistItem,
  PluginTemplateFeatureItem as GeneratedPluginTemplateFeatureItem,
  PluginTemplateOverview as GeneratedPluginTemplateOverview,
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

export interface ResponsiveColumn {
  key: string
  label: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
}
