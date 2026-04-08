import { describe, expect, it } from 'vitest'
import { buildAudienceLabel, formatCellValue, formatChecklistStatus, toTagType } from './template'

describe('template helpers', () => {
  it('maps known audiences to readable labels', () => {
    expect(buildAudienceLabel('console')).toBe('Console')
    expect(buildAudienceLabel('uc')).toBe('User Center')
    expect(buildAudienceLabel('other')).toBe('Unknown')
  })

  it('normalizes cell values', () => {
    expect(formatCellValue('hello')).toBe('hello')
    expect(formatCellValue(true)).toBe('是')
    expect(formatCellValue(false)).toBe('否')
    expect(formatCellValue('')).toBe('—')
  })

  it('maps semantic tones to Element Plus tags', () => {
    expect(toTagType('primary')).toBe('primary')
    expect(toTagType('now')).toBe('primary')
    expect(toTagType('success')).toBe('success')
    expect(toTagType('done')).toBe('success')
    expect(toTagType('recommended')).toBe('warning')
    expect(toTagType('todo')).toBe('warning')
    expect(toTagType('unknown')).toBe('info')
  })

  it('formats checklist statuses for display', () => {
    expect(formatChecklistStatus('done')).toBe('已完成')
    expect(formatChecklistStatus('recommended')).toBe('建议处理')
    expect(formatChecklistStatus('todo')).toBe('待处理')
    expect(formatChecklistStatus('optional')).toBe('按需处理')
    expect(formatChecklistStatus('other')).toBe('other')
  })
})
