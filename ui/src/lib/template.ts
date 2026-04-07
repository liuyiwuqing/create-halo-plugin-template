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
      return 'primary'
    case 'success':
      return 'success'
    case 'warning':
    case 'recommended':
      return 'warning'
    case 'danger':
      return 'danger'
    default:
      return 'info'
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
