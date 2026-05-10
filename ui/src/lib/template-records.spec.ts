import { describe, expect, it } from 'vitest'
import {
  buildRecordListRequest,
  buildRecordPayload,
  createDefaultRecordFilters,
  createDefaultRecordForm,
  createRecordFormFromRecord,
  getRecordStatusMeta,
  normalizeRecord,
  normalizeRecordList,
} from './template-records'

describe('template record helpers', () => {
  it('creates stable default form and filter values', () => {
    expect(createDefaultRecordFilters()).toEqual({
      keyword: '',
      status: '',
      enabled: '',
    })
    expect(createDefaultRecordForm()).toMatchObject({
      title: '',
      status: 'DRAFT',
      enabled: true,
      priority: 0,
      publishTime: '',
      description: '',
    })
  })

  it('builds list request params from filters', () => {
    expect(
      buildRecordListRequest({
        page: 2,
        size: 20,
        filters: {
          keyword: 'Alpha',
          status: 'PUBLISHED',
          enabled: false,
        },
      }),
    ).toEqual({
      page: 2,
      size: 20,
      sort: ['priority,desc', 'createTime,desc'],
      keyword: 'Alpha',
      status: 'PUBLISHED',
      enabled: false,
    })
  })

  it('omits empty optional list filters', () => {
    expect(
      buildRecordListRequest({
        page: 1,
        size: 10,
        filters: createDefaultRecordFilters(),
      }),
    ).toMatchObject({
      keyword: undefined,
      status: undefined,
      enabled: undefined,
    })
  })

  it('builds payloads for create and update forms', () => {
    const payload = buildRecordPayload({
      id: 'abc',
      title: '  标题  ',
      status: 'ARCHIVED',
      enabled: false,
      priority: 5,
      publishTime: '2026-04-07T10:00:00',
      description: '  备注  ',
    })

    expect(payload).toMatchObject({
      apiVersion: 'plugintemplate.halo.run/v1alpha1',
      kind: 'PluginTemplateRecord',
      id: 'abc',
      title: '标题',
      status: 'ARCHIVED',
      enabled: false,
      priority: 5,
      publishTime: '2026-04-07T10:00:00',
      description: '备注',
      metadata: {
        name: 'plugin-template-record-abc',
      },
    })
  })

  it('normalizes raw records and list responses', () => {
    const record = normalizeRecord({
      id: 'abc',
      title: 'Alpha',
      status: 'UNKNOWN',
      enabled: undefined,
      priority: undefined,
    })

    expect(record.status).toBe('DRAFT')
    expect(record.enabled).toBe(true)
    expect(record.priority).toBe(0)
    expect(normalizeRecordList({ items: [record], total: 1 }).items[0].title).toBe('Alpha')
  })

  it('creates form state from an existing record', () => {
    expect(
      createRecordFormFromRecord({
        apiVersion: '',
        kind: '',
        metadata: { name: 'plugin-template-record-abc' },
        id: 'abc',
        title: 'Alpha',
        status: 'PUBLISHED',
        enabled: false,
        priority: 8,
        description: 'Done',
      }),
    ).toMatchObject({
      id: 'abc',
      title: 'Alpha',
      status: 'PUBLISHED',
      enabled: false,
      priority: 8,
      description: 'Done',
    })
  })

  it('maps status metadata for table display', () => {
    expect(getRecordStatusMeta('PUBLISHED')).toMatchObject({
      label: '已发布',
      tone: 'success',
    })
    expect(getRecordStatusMeta('OTHER').label).toBe('草稿')
  })
})
