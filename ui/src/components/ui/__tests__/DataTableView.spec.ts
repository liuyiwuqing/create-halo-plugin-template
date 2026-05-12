import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DataTableView from '../DataTableView.vue'
import type { DataTableColumn } from '@/types/ui'

interface Row {
  id: string
  title: string
  status: string
}

const rows: Row[] = [
  { id: 'record-a', title: '第一条记录', status: 'draft' },
  { id: 'record-b', title: '第二条记录', status: 'published' },
]

const columns: DataTableColumn<Row>[] = [
  { key: 'id', label: '记录 ID' },
  { key: 'title', label: '标题' },
  { key: 'status', label: '状态', formatter: (value) => `状态：${value}` },
]

describe('DataTableView', () => {
  it('renders desktop columns and formatted cell values', () => {
    const wrapper = mount(DataTableView<Row>, {
      props: {
        rows,
        columns,
      },
    })

    expect(wrapper.text()).toContain('记录 ID')
    expect(wrapper.text()).toContain('第一条记录')
    expect(wrapper.text()).toContain('状态：draft')
  })

  it('renders mobile cards with configured title and description', () => {
    const wrapper = mount(DataTableView<Row>, {
      props: {
        rows,
        columns,
        mobileTitleKey: 'title',
        mobileDescriptionKey: 'status',
      },
    })

    expect(wrapper.findAll('.data-table-view__card')).toHaveLength(2)
    expect(wrapper.find('.data-table-view__card-title').text()).toBe('第一条记录')
    expect(wrapper.find('.data-table-view__card-description').text()).toBe('draft')
  })

  it('renders named cell slots', () => {
    const wrapper = mount(DataTableView<Row>, {
      props: {
        rows,
        columns,
      },
      slots: {
        'cell-status': '<strong class="custom-status">{{ params.value }}</strong>',
      },
    })

    expect(wrapper.find('.custom-status').text()).toBe('draft')
  })

  it('renders empty state when rows are empty', () => {
    const wrapper = mount(DataTableView<Row>, {
      props: {
        rows: [],
        columns,
        emptyDescription: '没有记录',
      },
    })

    expect(wrapper.text()).toContain('没有记录')
  })
})
