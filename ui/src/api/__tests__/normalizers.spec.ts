import { describe, expect, it } from 'vitest'
import { normalizeOverview, type RawTemplateOverview } from '@/api/normalizers'

describe('normalizeOverview', () => {
  it('fills defaults for sparse backend payloads', () => {
    const normalized = normalizeOverview({} as RawTemplateOverview)

    expect(normalized.pluginName).toBe('halo-plugin-template')
    expect(normalized.consolePath).toBe('/halo-plugin-template')
    expect(normalized.enableConsoleDashboard).toBe(true)
    expect(normalized.enableUcDashboard).toBe(true)
    expect(normalized.enableAttachmentProvider).toBe(true)
    expect(normalized.accentColor).toBe('#2457F5')
    expect(normalized.density).toBe('balanced')
    expect(normalized.stats).toEqual([])
    expect(normalized.features).toEqual([])
    expect(normalized.checklist).toEqual([])
  })

  it('normalizes nested collections into stable UI models', () => {
    const normalized = normalizeOverview({
      pluginName: 'hello-world',
      displayName: 'Hello World',
      audience: 'uc',
      audienceLabel: 'User Center',
      consolePath: '/hello-world',
      ucPath: '/hello-world',
      settingName: 'hello-world-settings',
      configMapName: 'hello-world-configmap',
      generatedClientPath: 'ui/src/api/generated',
      generatedAt: '2026-04-07T12:00:00Z',
      enableConsoleDashboard: false,
      enableUcDashboard: true,
      enableAttachmentProvider: false,
      accentColor: '#102030',
      density: 'compact',
      supportLink: 'https://example.com/help',
      stats: [{ label: 'Routes', value: '2' }],
      features: [{ title: 'UC 页面', enabled: false }],
      checklist: [{ title: '生成 API', status: 'done' }],
    } as RawTemplateOverview)

    expect(normalized.pluginName).toBe('hello-world')
    expect(normalized.enableConsoleDashboard).toBe(false)
    expect(normalized.enableAttachmentProvider).toBe(false)
    expect(normalized.stats[0]).toMatchObject({
      key: 'stat-0',
      label: 'Routes',
      value: '2',
      tone: 'info',
    })
    expect(normalized.features[0]).toMatchObject({
      key: 'feature-0',
      title: 'UC 页面',
      area: 'General',
      enabled: false,
    })
    expect(normalized.checklist[0]).toMatchObject({
      key: 'checklist-0',
      title: '生成 API',
      audience: 'all',
      status: 'done',
    })
  })
})
