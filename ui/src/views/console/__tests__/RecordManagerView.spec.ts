import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import RecordManagerView from '../RecordManagerView.vue'

const apiMocks = vi.hoisted(() => ({
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/api', () => ({
  templateRecordConsoleApi: {
    list: apiMocks.list,
    get: apiMocks.get,
    create: apiMocks.create,
    update: apiMocks.update,
    delete: apiMocks.delete,
  },
}))

vi.mock('@halo-dev/components', () => ({
  Dialog: {
    warning: vi.fn(),
  },
  IconAddCircle: { template: '<span />' },
  IconRefreshLine: { template: '<span />' },
  IconSearch: { template: '<span />' },
  IconWindowLine: { template: '<span data-test="window-icon" />' },
  Toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
  VAlert: {
    props: ['title', 'description'],
    template: '<section data-test="alert">{{ title }}{{ description }}</section>',
  },
  VButton: {
    props: ['type', 'size', 'loading', 'disabled'],
    template: '<button type="button" :disabled="disabled"><slot name="icon" /><slot /></button>',
  },
  VCard: {
    props: ['bodyClass'],
    template:
      '<section data-test="card"><header><slot name="header" /></header><main><slot /></main><footer><slot name="footer" /></footer></section>',
  },
  VDescription: {
    template: '<dl data-test="description"><slot /></dl>',
  },
  VDescriptionItem: {
    props: ['label', 'content'],
    template: '<div><dt>{{ label }}</dt><dd>{{ content }}</dd></div>',
  },
  VEmpty: {
    props: ['title', 'message'],
    template:
      '<section data-test="empty">{{ title }}{{ message }}<slot name="actions" /></section>',
  },
  VEntity: {
    template:
      '<article data-test="entity"><slot name="start" /><slot name="end" /><slot name="footer" /></article>',
  },
  VEntityContainer: {
    template: '<section data-test="entity-container"><slot /></section>',
  },
  VEntityField: {
    props: ['title', 'description'],
    template: '<div><span>{{ title }}</span><span>{{ description }}</span><slot /></div>',
  },
  VLoading: {
    template: '<div data-test="loading">加载中</div>',
  },
  VModal: {
    ...defineComponent({
      props: ['title', 'width', 'fullscreen'],
      emits: ['close'],
      setup(_, { emit }) {
        return {
          close: () => emit('close'),
        }
      },
      template:
        '<section data-test="modal" :data-fullscreen="fullscreen"><h2>{{ title }}</h2><div data-test="modal-actions"><slot name="actions" /></div><slot /><footer><slot name="footer" /></footer></section>',
    }),
  },
  VPageHeader: {
    props: ['title'],
    template: '<header>{{ title }}<slot name="actions" /></header>',
  },
  VPagination: {
    props: ['page', 'size', 'total', 'sizeOptions'],
    template: '<nav data-test="pagination" />',
  },
  VSpace: {
    template: '<div><slot /></div>',
  },
  VTag: {
    props: ['theme', 'rounded'],
    template: '<span data-test="tag"><slot /></span>',
  },
}))

describe('RecordManagerView', () => {
  afterEach(() => {
    document.documentElement.className = ''
    document.body.className = ''
  })

  it('opens create modal with fullscreen action and submit button', async () => {
    apiMocks.list.mockResolvedValue({
      items: [],
      total: 0,
    })

    const wrapper = mount(RecordManagerView, {
      props: {
        embedded: true,
      },
      global: {
        directives: {
          permission: {},
        },
      },
    })

    await flushPromises()

    const createButton = wrapper.findAll('button').find((button) => button.text() === '新增数据')

    expect(createButton).toBeTruthy()

    await createButton?.trigger('click')

    expect(wrapper.get('[data-test="modal"]').text()).toContain('新增示例数据')
    expect(wrapper.get('[data-test="modal-actions"] button').attributes('title')).toBe('全屏')
    expect(wrapper.get('[data-test="modal-actions"]').text()).toBe('')
    expect(wrapper.get('[data-test="modal"]').text()).toContain('确认新增')
  })

  it('locks page scroll only while the modal is fullscreen', async () => {
    apiMocks.list.mockResolvedValue({
      items: [],
      total: 0,
    })

    const wrapper = mount(RecordManagerView, {
      props: {
        embedded: true,
      },
      global: {
        directives: {
          permission: {},
        },
      },
    })

    await flushPromises()

    const createButton = wrapper.findAll('button').find((button) => button.text() === '新增数据')
    await createButton?.trigger('click')

    expect(document.body.classList.contains('record-modal-page-scroll-locked')).toBe(false)

    await wrapper.get('[data-test="modal-actions"] button').trigger('click')

    expect(document.documentElement.classList.contains('record-modal-page-scroll-locked')).toBe(true)
    expect(document.body.classList.contains('record-modal-page-scroll-locked')).toBe(true)

    await wrapper.get('[data-test="modal"] footer button').trigger('click')

    expect(document.documentElement.classList.contains('record-modal-page-scroll-locked')).toBe(false)
    expect(document.body.classList.contains('record-modal-page-scroll-locked')).toBe(false)
  })

  it('opens record detail modal after async detail loading', async () => {
    apiMocks.list.mockResolvedValue({
      items: [
        {
          id: 'demo',
          title: '示例记录',
          description: '用于测试详情弹窗',
          status: 'draft',
          statusLabel: '草稿',
          statusTone: 'warning',
          createTimeLabel: '2026-05-12 10:00',
          updateTimeLabel: '2026-05-12 11:00',
        },
      ],
      total: 1,
    })
    apiMocks.get.mockResolvedValue({
      id: 'demo',
      title: '示例记录',
      description: '详情描述',
      status: 'draft',
      statusLabel: '草稿',
      statusTone: 'warning',
      createTimeLabel: '2026-05-12 10:00',
      updateTimeLabel: '2026-05-12 11:00',
    })

    const wrapper = mount(RecordManagerView, {
      props: {
        embedded: true,
      },
      global: {
        directives: {
          permission: {},
        },
      },
    })

    await flushPromises()

    const detailButton = wrapper.findAll('button').find((button) => button.text() === '详情')

    expect(detailButton).toBeTruthy()

    await detailButton?.trigger('click')
    expect(wrapper.get('[data-test="modal"]').text()).toContain('示例数据详情')

    await flushPromises()

    expect(apiMocks.get).toHaveBeenCalledWith('demo')
    expect(wrapper.get('textarea').element.value).toBe('详情描述')
    expect(wrapper.get('[data-test="description"]').text()).toContain('2026-05-12 11:00')
  })

  it('opens record edit modal after async detail loading', async () => {
    apiMocks.list.mockResolvedValue({
      items: [
        {
          id: 'demo',
          title: '示例记录',
          description: '用于测试编辑弹窗',
          status: 'active',
          statusLabel: '启用',
          statusTone: 'success',
          createTimeLabel: '2026-05-12 10:00',
          updateTimeLabel: '2026-05-12 11:00',
        },
      ],
      total: 1,
    })
    apiMocks.get.mockResolvedValue({
      id: 'demo',
      title: '示例记录',
      description: '编辑描述',
      status: 'active',
      statusLabel: '启用',
      statusTone: 'success',
      createTimeLabel: '2026-05-12 10:00',
      updateTimeLabel: '2026-05-12 11:00',
    })

    const wrapper = mount(RecordManagerView, {
      props: {
        embedded: true,
      },
      global: {
        directives: {
          permission: {},
        },
      },
    })

    await flushPromises()

    const editButton = wrapper.findAll('button').find((button) => button.text() === '编辑')

    expect(editButton).toBeTruthy()

    await editButton?.trigger('click')
    expect(wrapper.get('[data-test="modal"]').text()).toContain('编辑示例数据')

    await flushPromises()

    expect(apiMocks.get).toHaveBeenCalledWith('demo')
    expect(wrapper.get('textarea').element.value).toBe('编辑描述')
  })
})
