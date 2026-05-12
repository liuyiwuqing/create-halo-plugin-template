<script setup lang="ts">
import {
  Dialog,
  IconAddCircle,
  IconRefreshLine,
  IconSearch,
  Toast,
} from '@halo-dev/components'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  templateRecordConsoleApi,
  type PluginTemplateRecordFormPayload,
  type PluginTemplateRecordView,
} from '@/api'
import type { DataPagination, DataTableColumn, SelectOption } from '@/types/ui'
import DataFormModal from '@/components/ui/DataFormModal.vue'
import DataPageShell from '@/components/ui/DataPageShell.vue'
import DataTableView from '@/components/ui/DataTableView.vue'
import SelectField from '@/components/ui/SelectField.vue'
import UiStatusPill from '@/components/ui/UiStatusPill.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type ModalMode = 'create' | 'edit' | 'detail'

const rows = ref<PluginTemplateRecordView[]>([])
const loading = ref(false)
const errorMessage = ref('')
const page = ref(1)
const size = ref(10)
const total = ref(0)
const skipNextPageLoad = ref(false)
const skipNextFilterLoad = ref(false)
let filterReloadTimer: ReturnType<typeof window.setTimeout> | undefined

const keyword = ref('')
const status = ref('')

const modalVisible = ref(false)
const modalMode = ref<ModalMode>('create')
const modalLoading = ref(false)
const submitting = ref(false)
const currentRecordId = ref('')
const currentRecord = ref<PluginTemplateRecordView>()

const formState = reactive<PluginTemplateRecordFormPayload>({
  id: '',
  title: '',
  description: '',
  status: 'draft',
})

const statusOptions: SelectOption[] = [
  { label: '全部状态', value: '' },
  { label: '草稿', value: 'draft' },
  { label: '启用', value: 'active' },
  { label: '已发布', value: 'published' },
  { label: '已归档', value: 'archived' },
]

const formStatusOptions = statusOptions.filter((option) => option.value)

const columns: DataTableColumn<PluginTemplateRecordView>[] = [
  { key: 'id', label: '记录 ID', minWidth: 190 },
  { key: 'title', label: '标题', minWidth: 210, mobileVisible: false },
  { key: 'statusLabel', label: '状态', width: 140, mobileVisible: false },
  { key: 'createTimeLabel', label: '创建时间', minWidth: 170 },
  { key: 'updateTimeLabel', label: '更新时间', minWidth: 170 },
]

const showInitialLoading = computed(() => loading.value && rows.value.length === 0)
const isDetailMode = computed(() => modalMode.value === 'detail')
const isEditMode = computed(() => modalMode.value === 'edit')
const modalTitle = computed(() => {
  if (modalMode.value === 'create') {
    return '新增示例数据'
  }
  if (modalMode.value === 'edit') {
    return '编辑示例数据'
  }
  return '示例数据详情'
})
const modalConfirmText = computed(() => (isEditMode.value ? '保存修改' : '确认新增'))
const hasActiveFilters = computed(() => Boolean(keyword.value || status.value))
const pagination = computed<DataPagination>(() => ({
  page: page.value,
  size: size.value,
  total: total.value,
  sizeOptions: [10, 20, 50, 100],
}))

const assignForm = (record?: PluginTemplateRecordView) => {
  formState.id = record?.id || ''
  formState.title = record?.title || ''
  formState.description = record?.description === '—' ? '' : record?.description || ''
  formState.status = record?.status || 'draft'
}

const resetForm = () => {
  currentRecord.value = undefined
  currentRecordId.value = ''
  formState.id = ''
  formState.title = ''
  formState.description = ''
  formState.status = 'draft'
}

const resolveErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { title?: string; detail?: string } } })
      .response
    const detail = response?.data?.detail || response?.data?.title
    if (detail) {
      return detail
    }
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

const loadRecords = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await templateRecordConsoleApi.list({
      page: page.value,
      size: size.value,
      sort: ['updateTime,desc'],
      keyword: keyword.value,
      status: status.value,
    })
    rows.value = result.items
    total.value = result.total
  } catch (error) {
    rows.value = []
    total.value = 0
    errorMessage.value = resolveErrorMessage(error, '示例数据加载失败，请稍后重试。')
    Toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

const clearFilterReloadTimer = () => {
  if (filterReloadTimer) {
    window.clearTimeout(filterReloadTimer)
    filterReloadTimer = undefined
  }
}

const reloadRecordsFromFilters = async () => {
  clearFilterReloadTimer()
  if (page.value !== 1) {
    skipNextPageLoad.value = true
    page.value = 1
  }
  await loadRecords()
}

const scheduleFilterReload = () => {
  clearFilterReloadTimer()
  filterReloadTimer = window.setTimeout(() => {
    void reloadRecordsFromFilters()
  }, 300)
}

const handleSearch = async () => {
  await reloadRecordsFromFilters()
}

const handleResetFilters = async () => {
  skipNextFilterLoad.value = true
  clearFilterReloadTimer()
  keyword.value = ''
  status.value = ''
  await reloadRecordsFromFilters()
}

const handleRefresh = async () => {
  await loadRecords()
}

const replaceRow = (record: PluginTemplateRecordView) => {
  const index = rows.value.findIndex((item) => item.id === record.id)
  if (index >= 0) {
    rows.value.splice(index, 1, record)
    return
  }
  rows.value.unshift(record)
  rows.value = rows.value.slice(0, size.value)
  total.value = total.value + 1
}

const prependCreatedRow = (record: PluginTemplateRecordView) => {
  if (page.value !== 1) {
    skipNextPageLoad.value = true
    page.value = 1
    rows.value = [record]
    total.value = total.value + 1
    return
  }
  replaceRow(record)
}

const removeRow = (recordId: string) => {
  const nextRows = rows.value.filter((item) => item.id !== recordId)
  if (nextRows.length !== rows.value.length) {
    rows.value = nextRows
    total.value = Math.max(0, total.value - 1)
  }
}

const scheduleRecordsReloadAfterMutation = () => {
  window.setTimeout(() => {
    void loadRecords()
  }, 1000)
}

const openModal = (mode: ModalMode) => {
  modalMode.value = mode
  modalVisible.value = true
}

const loadRecordDetail = async (recordId: string) => {
  modalLoading.value = true
  try {
    const record = await templateRecordConsoleApi.get(recordId)
    currentRecord.value = record
    assignForm(record)
  } catch (error) {
    const message = resolveErrorMessage(error, '加载详情失败，请稍后重试。')
    Toast.error(message)
  } finally {
    modalLoading.value = false
  }
}

const handleOpenCreate = () => {
  resetForm()
  openModal('create')
}

const handleOpenDetail = async (record: PluginTemplateRecordView) => {
  resetForm()
  currentRecordId.value = record.id
  openModal('detail')
  await loadRecordDetail(record.id)
}

const handleOpenEdit = async (record: PluginTemplateRecordView) => {
  resetForm()
  currentRecordId.value = record.id
  openModal('edit')
  await loadRecordDetail(record.id)
}

const handleDelete = async (record: PluginTemplateRecordView) => {
  Dialog.warning({
    title: '删除示例数据',
    description: `确定删除「${record.title}」吗？该操作不可恢复。`,
    confirmType: 'danger',
    confirmText: '删除',
    cancelText: '取消',
    onConfirm: async () => {
      try {
        const shouldLoadPreviousPage = rows.value.length === 1 && page.value > 1
        await templateRecordConsoleApi.delete(record.id)
        removeRow(record.id)
        Toast.success('删除成功')
        if (shouldLoadPreviousPage) {
          skipNextPageLoad.value = true
          page.value = page.value - 1
        }
        scheduleRecordsReloadAfterMutation()
      } catch (error) {
        Toast.error(resolveErrorMessage(error, '删除失败，请稍后重试。'))
      }
    },
  })
}

const handleSubmit = async () => {
  const title = formState.title?.trim()
  if (!title) {
    Toast.warning('标题不能为空')
    return
  }

  const payload: PluginTemplateRecordFormPayload = {
    id: formState.id,
    title,
    description: formState.description,
    status: formState.status,
  }

  submitting.value = true
  try {
    if (isEditMode.value) {
      if (!currentRecordId.value) {
        Toast.warning('缺少记录 ID，无法更新。')
        return
      }
      const record = await templateRecordConsoleApi.update(currentRecordId.value, payload)
      replaceRow(record)
      Toast.success('更新成功')
    } else {
      const record = await templateRecordConsoleApi.create(payload)
      prependCreatedRow(record)
      Toast.success('新增成功')
    }
    modalVisible.value = false
    resetForm()
    scheduleRecordsReloadAfterMutation()
  } catch (error) {
    Toast.error(
      resolveErrorMessage(
        error,
        isEditMode.value ? '更新失败，请稍后重试。' : '新增失败，请稍后重试。',
      ),
    )
  } finally {
    submitting.value = false
  }
}

const handleModalVisibleChange = (visible: boolean) => {
  modalVisible.value = visible
  if (!visible) {
    resetForm()
  }
}

watch([page, size], () => {
  if (skipNextPageLoad.value) {
    skipNextPageLoad.value = false
    return
  }
  void loadRecords()
})

watch([keyword, status], () => {
  if (skipNextFilterLoad.value) {
    skipNextFilterLoad.value = false
    return
  }
  scheduleFilterReload()
})

onMounted(() => {
  void loadRecords()
})

onBeforeUnmount(() => {
  clearFilterReloadTimer()
})
</script>

<template>
  <DataPageShell
    title="示例数据管理"
    description="管理插件模板的真实 CRUD 示例记录"
    :loading="loading"
    :initial-loading="showInitialLoading"
    :error-message="errorMessage"
    :empty="!rows.length"
    empty-title="暂无示例数据"
    empty-message="当前没有记录，请先新增一条示例数据。"
    :pagination="rows.length ? pagination : undefined"
    @update:page="page = $event"
    @update:size="size = $event"
  >
    <template #actions>
      <Button variant="outline" @click="handleRefresh">
        <IconRefreshLine :class="{ 'animate-spin': loading }" />
        刷新
      </Button>
      <Button @click="handleSearch">
        <IconSearch />
        查询
      </Button>
      <Button
        v-permission="['plugin:halo-plugin-template:manage']"
        @click="handleOpenCreate"
      >
        <IconAddCircle />
        新增数据
      </Button>
    </template>

    <template #filters>
      <div class="record-filter-grid">
        <Input
          v-model="keyword"
          placeholder="输入关键词后回车搜索"
          @keyup.enter="handleSearch"
        />
        <SelectField
          v-model="status"
          label="记录状态"
          :options="statusOptions"
          placeholder="请选择状态"
          compact
        />
        <Button
          v-if="hasActiveFilters"
          variant="outline"
          @click="handleResetFilters"
        >
          重置筛选
        </Button>
      </div>
    </template>

    <template #emptyActions>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" @click="handleRefresh">刷新</Button>
        <Button
          v-permission="['plugin:halo-plugin-template:manage']"
          @click="handleOpenCreate"
        >
          新增数据
        </Button>
      </div>
    </template>

    <DataTableView
      :rows="rows"
      :columns="columns"
      :loading="loading"
      mobile-title-key="title"
      mobile-description-key="description"
      empty-description="暂无示例数据"
    >
      <template #cell-id="{ row }">
        <button class="record-id-link" type="button" @click="handleOpenDetail(row)">
          {{ row.id }}
        </button>
      </template>
      <template #cell-title="{ row }">
        <div class="record-title-cell">
          <span>{{ row.title }}</span>
          <small>{{ row.description }}</small>
        </div>
      </template>
      <template #cell-statusLabel="{ row }">
        <UiStatusPill :label="row.statusLabel" :tone="row.statusTone" />
      </template>
      <template #mobile-status="{ row }">
        <UiStatusPill :label="row.statusLabel" :tone="row.statusTone" />
      </template>
      <template #actions="{ row }">
        <div class="record-table-actions">
          <Button variant="ghost" size="sm" @click="handleOpenDetail(row)">
            详情
          </Button>
          <Button
            v-permission="['plugin:halo-plugin-template:manage']"
            size="sm"
            @click="handleOpenEdit(row)"
          >
            编辑
          </Button>
          <Button
            v-permission="['plugin:halo-plugin-template:manage']"
            variant="destructive"
            size="sm"
            @click="handleDelete(row)"
          >
            删除
          </Button>
        </div>
      </template>
    </DataTableView>

    <DataFormModal
      :title="modalTitle"
      :visible="modalVisible"
      :loading="modalLoading"
      :submitting="submitting"
      :readonly="isDetailMode"
      :confirm-text="modalConfirmText"
      @update:visible="handleModalVisibleChange"
      @confirm="handleSubmit"
    >
      <form class="record-form" @submit.prevent="handleSubmit">
        <label v-show="!isEditMode" class="record-form__item">
          <span class="record-field-label">
            <span>记录 ID</span>
            <span class="record-field-label__aside">可选</span>
          </span>
          <Input
            v-model="formState.id"
            :disabled="isDetailMode"
            maxlength="64"
            placeholder="留空自动生成"
          />
          <p v-if="!isDetailMode" class="record-field-help">留空时由系统生成。</p>
        </label>

        <label class="record-form__item">
          <span class="record-field-label">
            <span>标题</span>
            <span class="text-destructive">*</span>
          </span>
          <Input
            v-model="formState.title"
            :disabled="isDetailMode"
            maxlength="120"
            placeholder="请输入标题"
          />
        </label>

        <SelectField
          v-model="formState.status"
          label="状态"
          :options="formStatusOptions"
          :disabled="isDetailMode"
          :clearable="false"
          placeholder="请选择状态"
        />

        <label class="record-form__item record-form__item--textarea">
          <span class="record-field-label">描述</span>
          <Textarea
            v-model="formState.description"
            :disabled="isDetailMode"
            maxlength="1000"
            placeholder="请输入描述"
          />
          <p v-if="!isDetailMode" class="record-field-help">用于补充说明，可留空。</p>
        </label>

        <div v-show="isDetailMode && currentRecord" class="record-detail-meta">
          <div class="record-detail-meta__item">
            <span>创建时间</span>
            <strong>{{ currentRecord?.createTimeLabel || '—' }}</strong>
          </div>
          <div class="record-detail-meta__item">
            <span>更新时间</span>
            <strong>{{ currentRecord?.updateTimeLabel || '—' }}</strong>
          </div>
        </div>
      </form>
    </DataFormModal>
  </DataPageShell>
</template>

<style scoped>
.record-filter-grid {
  display: grid;
  grid-template-columns: minmax(260px, 560px) 280px auto;
  align-items: center;
  gap: 12px;
}

.record-id-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--foreground);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.record-id-link:hover {
  text-decoration: underline;
}

.record-title-cell {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.record-title-cell span {
  color: var(--foreground);
  font-weight: 600;
}

.record-title-cell small {
  overflow: hidden;
  color: var(--muted-foreground);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-table-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .record-filter-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .record-table-actions {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
}

@media (max-width: 420px) {
  .record-table-actions {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr;
  }
}
</style>
