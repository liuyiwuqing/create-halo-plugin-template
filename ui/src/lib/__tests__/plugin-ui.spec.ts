import { describe, expect, it } from 'vitest'
import { buildShellStyles, resolveElementSize } from '@/lib/plugin-ui'

describe('plugin-ui helpers', () => {
  it('maps density to element-plus size tokens', () => {
    expect(resolveElementSize('compact')).toBe('small')
    expect(resolveElementSize('balanced')).toBe('default')
    expect(resolveElementSize('relaxed')).toBe('large')
    expect(resolveElementSize(undefined)).toBe('default')
  })

  it('creates shell style variables only when an accent color is present', () => {
    expect(buildShellStyles('')).toBeUndefined()
    expect(buildShellStyles()).toBeUndefined()
    expect(buildShellStyles('#2457F5')).toEqual({
      '--halo-plugin-template-color-primary': '#2457F5',
    })
  })
})
