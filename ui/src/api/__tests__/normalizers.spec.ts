import { describe, expect, it } from 'vitest'
import {
  normalizeOverview,
  normalizeTemplateRecord,
  toTemplateRecordCreateRequest,
  toTemplateRecordListRequest,
  toTemplateRecordUpdateRequest,
  type RawTemplateOverview,
} from '@/api/normalizers'

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

describe('normalizeTemplateRecord', () => {
  it('maps record fields into stable display values', () => {
    const normalized = normalizeTemplateRecord({
      apiVersion: 'plugintemplate.halo.run/v1alpha1',
      kind: 'PluginTemplateRecord',
      metadata: {
        name: 'plugin-template-record-demo',
      },
      id: 'demo',
      title: '  示例记录  ',
      description: '',
      status: 'draft',
      createTime: '2026-05-10T10:00:30Z',
      updateTime: '2026-05-11T08:15:00Z',
    })

    expect(normalized.id).toBe('demo')
    expect(normalized.title).toBe('示例记录')
    expect(normalized.description).toBe('—')
    expect(normalized.status).toBe('draft')
    expect(normalized.statusLabel).toBe('草稿')
    expect(normalized.statusTone).toBe('warning')
    expect(normalized.createTimeLabel).toBe('2026-05-10 10:00')
    expect(normalized.updateTimeLabel).toBe('2026-05-11 08:15')
  })

  it('falls back unknown status to raw text label', () => {
    const normalized = normalizeTemplateRecord({
      apiVersion: 'plugintemplate.halo.run/v1alpha1',
      kind: 'PluginTemplateRecord',
      metadata: {
        name: 'plugin-template-record-demo',
      },
      id: 'demo',
      title: 'Record',
      status: 'custom-status',
    })

    expect(normalized.status).toBe('custom-status')
    expect(normalized.statusLabel).toBe('custom-status')
    expect(normalized.statusTone).toBe('info')
  })
})

describe('template record request mapping', () => {
  it('normalizes list query params for wrapper request', () => {
    expect(toTemplateRecordListRequest()).toEqual({
      page: 1,
      size: 10,
      sort: undefined,
      status: undefined,
      keyword: undefined,
    })

    expect(
      toTemplateRecordListRequest({
        page: 3,
        size: 20,
        sort: ['updateTime,asc'],
        status: '  draft  ',
        keyword: '  halo  ',
      }),
    ).toEqual({
      page: 3,
      size: 20,
      sort: ['updateTime,asc'],
      status: 'draft',
      keyword: 'halo',
    })
  })

  it('normalizes create/update payload values', () => {
    expect(
      toTemplateRecordCreateRequest({
        id: '  record-1  ',
        title: '  示例  ',
        description: '  描述  ',
        status: '  draft  ',
      }),
    ).toEqual({
      id: 'record-1',
      title: '示例',
      description: '描述',
      status: 'draft',
    })

    expect(
      toTemplateRecordUpdateRequest({
        title: '  更新标题  ',
        description: '   ',
        status: '  archived  ',
      }),
    ).toEqual({
      title: '更新标题',
      description: undefined,
      status: 'archived',
    })
  })
})
