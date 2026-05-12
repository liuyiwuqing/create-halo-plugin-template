import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import PluginTemplateConsoleWorkbench from '../PluginTemplateConsoleWorkbench.vue'

vi.mock('@halo-dev/components', () => ({
  IconExternalLinkLine: { template: '<span />' },
  IconPlug: { template: '<span />' },
  VButton: {
    template: '<button type="button"><slot name="icon" /><slot /></button>',
  },
  VCard: {
    props: ['bodyClass'],
    template:
      '<section data-test="card"><header><slot name="header" /></header><div><slot /></div></section>',
  },
  VPageHeader: {
    props: ['title'],
    template:
      '<header data-test="page-header"><slot name="icon" /><h1>{{ title }}</h1><slot name="actions" /></header>',
  },
  VTabbar: {
    props: ['activeId', 'items'],
    emits: ['update:activeId'],
    template: `<nav data-test="tabbar"><button v-for="item in items" :key="item.id" type="button" @click="$emit('update:activeId', item.id)">{{ item.label }}</button></nav>`,
  },
}))

vi.mock('@/components/PluginTemplateOverviewPage.vue', () => ({
  default: {
    name: 'PluginTemplateOverviewPage',
    template: '<div data-test="overview-page">模板概览内容</div>',
  },
}))

vi.mock('@/views/console/RecordManagerView.vue', () => ({
  default: {
    name: 'RecordManagerView',
    template: '<div data-test="record-manager">示例数据管理内容</div>',
  },
}))

describe('PluginTemplateConsoleWorkbench', () => {
  it('switches from overview to record manager tab content', async () => {
    const wrapper = mount(PluginTemplateConsoleWorkbench)

    expect(wrapper.get('[data-test="page-header"]').text()).toContain('Halo Plugin Template')
    expect(wrapper.get('[data-test="overview-page"]').text()).toContain('模板概览内容')
    expect(wrapper.find('[data-test="record-manager"]').exists()).toBe(false)

    const recordTab = wrapper.findAll('button').find((button) => button.text() === '示例数据管理')

    expect(recordTab).toBeTruthy()

    await recordTab?.trigger('click')
    await nextTick()

    expect(wrapper.find('[data-test="overview-page"]').exists()).toBe(false)
    expect(wrapper.get('[data-test="record-manager"]').text()).toContain('示例数据管理内容')
  })
})
