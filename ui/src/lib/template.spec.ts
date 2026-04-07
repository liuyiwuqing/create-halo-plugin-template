import { describe, expect, it } from 'vitest'
import { buildAudienceLabel, formatCellValue, toTagType } from './template'

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
    expect(toTagType('success')).toBe('success')
    expect(toTagType('recommended')).toBe('warning')
    expect(toTagType('unknown')).toBe('info')
  })
})
