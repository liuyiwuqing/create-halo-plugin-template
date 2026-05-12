<script setup lang="ts">
import {
  Dialog,
  IconAddCircle,
  IconRefreshLine,
  IconSearch,
  IconWindowLine,
  Toast,
  VAlert,
  VButton,
  VCard,
  VDescription,
  VDescriptionItem,
  VEmpty,
  VLoading,
  VModal,
  VPageHeader,
  VPagination,
  VSpace,
  VTag,
} from '@halo-dev/components'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  templateRecordConsoleApi,
  type PluginTemplateRecordFormPayload,
  type PluginTemplateRecordView,
} from '@/api'
import type { DataPagination, SelectOption } from '@/types/ui'
import { toTagTheme } from '@/lib/template'

type ModalMode = 'create' | 'edit' | 'detail'

const props = withDefaults(
  defineProps<{
    embedded?: boolean
  }>(),
  {
    embedded: false,
  },
)

const rows = ref<PluginTemplateRecordView[]>([])
const loading = ref(false)
const errorMessage = ref('')
const page = ref(1)
const size = ref(10)
const total = ref(0)
const skipNextPageLoad = ref(false)
const skipNextFilterLoad = ref(false)
let filterReloadTimer: number | undefined

const keyword = ref('')
const status = ref('')

const modalVisible = ref(false)
const modal = ref<InstanceType<typeof VModal> | null>(null)
const modalMode = ref<ModalMode>('create')
const modalLoading = ref(false)
const modalFullscreen = ref(false)
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
const modalWidth = 960
const fullscreenScrollLockClass = 'record-modal-page-scroll-locked'
const pagination = computed<DataPagination>(() => ({
  page: page.value,
  size: size.value,
  total: total.value,
  sizeOptions: [10, 20, 50, 100],
}))

const setFullscreenScrollLock = (locked: boolean) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle(fullscreenScrollLockClass, locked)
  document.body.classList.toggle(fullscreenScrollLockClass, locked)
}

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
  modalFullscreen.value = false
  setFullscreenScrollLock(false)
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
    modal.value?.close()
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

const closeModal = () => {
  modal.value?.close()
}

const toggleModalFullscreen = () => {
  const nextFullscreen = !modalFullscreen.value
  modalFullscreen.value = nextFullscreen
  setFullscreenScrollLock(modalVisible.value && nextFullscreen)
}

const handleModalClose = () => {
  modalVisible.value = false
  modalFullscreen.value = false
  setFullscreenScrollLock(false)
  resetForm()
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

watch([modalVisible, modalFullscreen], ([visible, fullscreen]) => {
  setFullscreenScrollLock(visible && fullscreen)
})

onMounted(() => {
  void loadRecords()
})

onBeforeUnmount(() => {
  clearFilterReloadTimer()
  setFullscreenScrollLock(false)
})
</script>

<template>
  <section :class="['record-manager', props.embedded ? 'grid gap-4' : '']" :aria-busy="loading">
    <VPageHeader v-if="!props.embedded" title="示例数据管理">
      <template #actions>
        <VButton class="w-full sm:w-auto" type="secondary" @click="handleRefresh">
          <template #icon>
            <IconRefreshLine :class="{ 'is-spinning': loading }" />
          </template>
          刷新
        </VButton>
        <VButton class="w-full sm:w-auto" type="secondary" @click="handleSearch">
          <template #icon>
            <IconSearch />
          </template>
          查询
        </VButton>
        <VButton
          v-permission="['plugin:halo-plugin-template:manage']"
          class="w-full sm:w-auto"
          type="primary"
          @click="handleOpenCreate"
        >
          <template #icon>
            <IconAddCircle />
          </template>
          新增数据
        </VButton>
      </template>
    </VPageHeader>

    <div :class="props.embedded ? '' : 'm-0 md:m-4'">
      <VCard :body-class="['!p-0']">
        <template #header>
          <div class="record-toolbar">
            <div class="record-toolbar__header">
              <div class="record-toolbar__intro">
                <p class="record-toolbar__title">示例数据管理</p>
                <p class="record-toolbar__description">管理插件模板的真实 CRUD 示例记录。</p>
              </div>

              <div class="record-toolbar__actions" aria-label="示例数据操作">
                <VButton
                  v-if="hasActiveFilters"
                  class="record-action-button"
                  type="secondary"
                  @click="handleResetFilters"
                >
                  重置筛选
                </VButton>
                <VButton class="record-action-button" type="secondary" @click="handleSearch">
                  <template #icon>
                    <IconSearch />
                  </template>
                  查询
                </VButton>
                <VButton
                  v-permission="['plugin:halo-plugin-template:manage']"
                  class="record-action-button record-action-button--primary"
                  type="primary"
                  @click="handleOpenCreate"
                >
                  <template #icon>
                    <IconAddCircle />
                  </template>
                  新增数据
                </VButton>
                <VButton class="record-action-button" type="secondary" @click="handleRefresh">
                  <template #icon>
                    <IconRefreshLine :class="{ 'is-spinning': loading }" />
                  </template>
                  刷新列表
                </VButton>
              </div>
            </div>

            <div class="record-toolbar__filter-panel" aria-label="示例数据筛选条件">
              <label class="halo-field record-toolbar__keyword">
                <span class="sr-only">关键词</span>
                <input
                  v-model="keyword"
                  class="halo-input record-toolbar__search-input"
                  type="search"
                  placeholder="输入关键词后回车搜索"
                  @keyup.enter="handleSearch"
                />
              </label>

              <label class="halo-field record-toolbar__status">
                <span class="sr-only">记录状态</span>
                <select v-model="status" class="halo-select">
                  <option
                    v-for="option in statusOptions"
                    :key="`${option.value}`"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </template>

        <div class="px-4 py-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p class="m-0 text-sm text-gray-500">
              当前列表按更新时间倒序展示，筛选变更后会自动刷新。
            </p>
            <VTag rounded>共 {{ total }} 项数据</VTag>
          </div>
        </div>

        <VAlert v-if="errorMessage" type="warning" title="加载失败" :description="errorMessage" />

        <VLoading v-if="showInitialLoading" />

        <VEmpty
          v-else-if="!rows.length"
          title="暂无示例数据"
          message="当前没有记录，请先新增一条示例数据。"
        >
          <template #actions>
            <VSpace>
              <VButton type="secondary" @click="handleRefresh">刷新</VButton>
              <VButton
                v-permission="['plugin:halo-plugin-template:manage']"
                type="primary"
                @click="handleOpenCreate"
              >
                新增数据
              </VButton>
            </VSpace>
          </template>
        </VEmpty>

        <div v-else class="record-data">
          <div class="record-table-wrap">
            <table class="record-table">
              <thead>
                <tr>
                  <th scope="col">标题 / ID</th>
                  <th scope="col">描述</th>
                  <th scope="col">状态</th>
                  <th scope="col">创建时间</th>
                  <th scope="col">更新时间</th>
                  <th scope="col" class="record-table__actions-head">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in rows" :key="record.id">
                  <td class="record-table__identity">
                    <button
                      type="button"
                      class="record-title-button"
                      @click="handleOpenDetail(record)"
                    >
                      {{ record.title }}
                    </button>
                    <small>{{ record.id }}</small>
                  </td>
                  <td class="record-table__description">
                    <span>{{ record.description }}</span>
                  </td>
                  <td>
                    <VTag :theme="toTagTheme(record.statusTone)" rounded>
                      {{ record.statusLabel }}
                    </VTag>
                  </td>
                  <td class="record-table__time">{{ record.createTimeLabel }}</td>
                  <td class="record-table__time">{{ record.updateTimeLabel }}</td>
                  <td>
                    <div class="record-row-actions">
                      <VButton size="sm" type="secondary" @click="handleOpenDetail(record)">
                        详情
                      </VButton>
                      <VButton
                        v-permission="['plugin:halo-plugin-template:manage']"
                        size="sm"
                        type="primary"
                        @click="handleOpenEdit(record)"
                      >
                        编辑
                      </VButton>
                      <VButton
                        v-permission="['plugin:halo-plugin-template:manage']"
                        size="sm"
                        type="danger"
                        @click="handleDelete(record)"
                      >
                        删除
                      </VButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="record-card-list">
            <article v-for="record in rows" :key="`card-${record.id}`" class="record-mobile-card">
              <div class="record-mobile-card__header">
                <div class="record-mobile-card__identity">
                  <button
                    type="button"
                    class="record-title-button"
                    @click="handleOpenDetail(record)"
                  >
                    {{ record.title }}
                  </button>
                  <small>{{ record.id }}</small>
                </div>
                <VTag :theme="toTagTheme(record.statusTone)" rounded>
                  {{ record.statusLabel }}
                </VTag>
              </div>

              <p class="record-mobile-card__description">{{ record.description }}</p>

              <dl class="record-mobile-card__meta">
                <div>
                  <dt>创建时间</dt>
                  <dd>{{ record.createTimeLabel }}</dd>
                </div>
                <div>
                  <dt>更新时间</dt>
                  <dd>{{ record.updateTimeLabel }}</dd>
                </div>
              </dl>

              <div class="record-mobile-card__actions">
                <VButton size="sm" type="secondary" @click="handleOpenDetail(record)">
                  详情
                </VButton>
                <VButton
                  v-permission="['plugin:halo-plugin-template:manage']"
                  size="sm"
                  type="primary"
                  @click="handleOpenEdit(record)"
                >
                  编辑
                </VButton>
                <VButton
                  v-permission="['plugin:halo-plugin-template:manage']"
                  size="sm"
                  type="danger"
                  @click="handleDelete(record)"
                >
                  删除
                </VButton>
              </div>
            </article>
          </div>
        </div>

        <template #footer>
          <div class="overflow-x-auto">
            <VPagination
              :page="pagination.page"
              :size="pagination.size"
              page-label="页"
              size-label="条 / 页"
              :total-label="`共 ${pagination.total} 项数据`"
              :total="pagination.total"
              :size-options="pagination.sizeOptions || [10, 20, 50, 100]"
              @update:page="page = $event"
              @update:size="size = $event"
            />
          </div>
        </template>
      </VCard>
    </div>

    <VModal
      v-if="modalVisible"
      ref="modal"
      :title="modalTitle"
      :width="modalWidth"
      :fullscreen="modalFullscreen"
      :class="['record-modal-shell', { 'record-modal--fullscreen': modalFullscreen }]"
      mount-to-body
      @close="handleModalClose"
    >
      <template #actions>
        <button
          class="record-modal__fullscreen-button"
          type="button"
          :title="modalFullscreen ? '退出全屏' : '全屏'"
          :aria-label="modalFullscreen ? '退出全屏' : '全屏'"
          @click="toggleModalFullscreen"
        >
          <IconWindowLine />
        </button>
      </template>

      <div class="record-modal">
        <VLoading v-if="modalLoading" />

        <form v-else class="record-form" @submit.prevent="handleSubmit">
          <label v-show="!isEditMode" class="halo-field record-form__item">
            <span>
              记录 ID
              <small>可选</small>
            </span>
            <input
              v-model="formState.id"
              class="halo-input"
              :disabled="isDetailMode"
              maxlength="64"
              placeholder="留空自动生成"
            />
            <em v-if="!isDetailMode">留空时由系统生成。</em>
          </label>

          <label class="halo-field record-form__item">
            <span>标题 <strong>*</strong></span>
            <input
              v-model="formState.title"
              class="halo-input"
              :disabled="isDetailMode"
              maxlength="120"
              placeholder="请输入标题"
            />
          </label>

          <label class="halo-field record-form__item record-form__item--compact">
            <span>状态</span>
            <select v-model="formState.status" class="halo-select" :disabled="isDetailMode">
              <option
                v-for="option in formStatusOptions"
                :key="`${option.value}`"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="halo-field record-form__item record-form__item--wide">
            <span>描述</span>
            <textarea
              v-model="formState.description"
              class="halo-textarea"
              :disabled="isDetailMode"
              maxlength="1000"
              placeholder="请输入描述"
            />
            <em v-if="!isDetailMode">用于补充说明，可留空。</em>
          </label>

          <div v-if="isDetailMode && currentRecord" class="record-form__item--wide">
            <VDescription>
              <VDescriptionItem label="创建时间" :content="currentRecord.createTimeLabel" />
              <VDescriptionItem label="更新时间" :content="currentRecord.updateTimeLabel" />
            </VDescription>
          </div>
        </form>
      </div>

      <template #footer>
        <VButton type="secondary" @click="closeModal">
          {{ isDetailMode ? '关闭' : '取消' }}
        </VButton>
        <VButton
          v-show="!isDetailMode"
          type="primary"
          :loading="submitting"
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '处理中' : modalConfirmText }}
        </VButton>
      </template>
    </VModal>
  </section>
</template>
