import type { TagProps } from 'element-plus'
import type { ResponsiveColumn } from '@/types'

export const featureColumns: ResponsiveColumn[] = [
  { key: 'title', label: '能力', minWidth: 180 },
  { key: 'area', label: '区域', minWidth: 120 },
  { key: 'description', label: '说明', minWidth: 280 },
  { key: 'enabled', label: '状态', minWidth: 120, align: 'right' },
]

export const checklistColumns: ResponsiveColumn[] = [
  { key: 'title', label: '检查项', minWidth: 180 },
  { key: 'audience', label: '受众', minWidth: 120 },
  { key: 'description', label: '说明', minWidth: 260 },
  { key: 'status', label: '状态', minWidth: 120, align: 'right' },
]

export const toTagType = (tone?: string): TagProps['type'] => {
  switch (tone) {
    case 'primary':
    case 'now':
      return 'primary'
    case 'success':
    case 'done':
    case 'auto':
      return 'success'
    case 'warning':
    case 'recommended':
    case 'todo':
      return 'warning'
    case 'danger':
      return 'danger'
    default:
      return 'info'
  }
}

export const formatChecklistStatus = (status?: string) => {
  switch (status) {
    case 'done':
      return '已完成'
    case 'auto':
      return '已自动完成'
    case 'recommended':
      return '建议处理'
    case 'now':
      return '当前处理'
    case 'optional':
      return '按需处理'
    case 'todo':
      return '待处理'
    case 'success':
      return '已完成'
    default:
      return formatCellValue(status)
  }
}

export const buildAudienceLabel = (audience: string) => {
  if (audience === 'console') {
    return 'Console'
  }
  if (audience === 'uc') {
    return 'User Center'
  }
  return 'Unknown'
}

export const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }
  return String(value)
}
