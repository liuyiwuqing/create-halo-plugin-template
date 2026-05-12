import { describe, expect, it } from 'vitest'
import { buildShellStyles, resolveDensityClass } from '@/lib/plugin-ui'

describe('plugin-ui helpers', () => {
  it('maps density to shell classes', () => {
    expect(resolveDensityClass('compact')).toBe('halo-plugin-template-admin-shell--compact')
    expect(resolveDensityClass('balanced')).toBe('halo-plugin-template-admin-shell--balanced')
    expect(resolveDensityClass('relaxed')).toBe('halo-plugin-template-admin-shell--relaxed')
    expect(resolveDensityClass(undefined)).toBe('halo-plugin-template-admin-shell--balanced')
  })

  it('creates shell style variables only when an accent color is present', () => {
    expect(buildShellStyles('')).toBeUndefined()
    expect(buildShellStyles()).toBeUndefined()
    expect(buildShellStyles('#2457F5')).toEqual({
      '--halo-plugin-template-color-primary': '#2457F5',
    })
  })
})
