import type { Component } from 'vue'
import type {
  PluginTemplateChecklistItem as GeneratedPluginTemplateChecklistItem,
  PluginTemplateFeatureItem as GeneratedPluginTemplateFeatureItem,
  PluginTemplateOverview as GeneratedPluginTemplateOverview,
  PluginTemplateRecord as GeneratedPluginTemplateRecord,
  PluginTemplateRecordList as GeneratedPluginTemplateRecordList,
  PluginTemplateStatItem as GeneratedPluginTemplateStatItem,
} from '@/api/generated'

export type ThemeMode = 'light' | 'dark' | 'business-blue'
export type LocaleCode = 'zh-CN' | 'en-US'

export interface ShellNavItem {
  key: string
  label: string
  to: string
  icon?: Component
}

export interface BreadcrumbItem {
  key: string
  label: string
  to?: string
}

export interface TableFilterState {
  keyword: string
  status: string
  enabled: '' | 'true' | 'false'
}

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

export type TemplateRecordStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type TemplateRecordSort = 'default' | 'priority' | 'updated'

export interface PluginTemplateRecord extends GeneratedPluginTemplateRecord {
  id: string
  title: string
  status: TemplateRecordStatus
  description?: string
  enabled?: boolean
  priority?: number
  publishTime?: string
  createTime?: string
  updateTime?: string
}

export interface PluginTemplateRecordList extends GeneratedPluginTemplateRecordList {
  items: PluginTemplateRecord[]
}

export interface PluginTemplateRecordFilters {
  keyword: string
  status: TemplateRecordStatus | ''
  enabled: boolean | ''
}

export interface PluginTemplateRecordForm {
  id?: string
  title: string
  status: TemplateRecordStatus
  enabled: boolean
  priority: number
  publishTime: string
  description: string
}

export interface ResponsiveColumn {
  key: string
  label: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
}
