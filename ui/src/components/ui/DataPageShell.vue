<script setup lang="ts">
import { VEmpty, VLoading, VPagination } from '@halo-dev/components'
import type { DataPagination } from '@/types/ui'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

withDefaults(
  defineProps<{
    title: string
    description?: string
    loading?: boolean
    initialLoading?: boolean
    errorMessage?: string
    empty?: boolean
    emptyTitle?: string
    emptyMessage?: string
    pagination?: DataPagination
  }>(),
  {
    description: '',
    loading: false,
    initialLoading: false,
    errorMessage: '',
    empty: false,
    emptyTitle: '暂无数据',
    emptyMessage: '当前没有可展示的数据。',
    pagination: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:page', value: number): void
  (event: 'update:size', value: number): void
}>()
</script>

<template>
  <section class="data-page-shell" :aria-busy="loading">
    <header class="data-page-shell__header">
      <div class="data-page-shell__heading">
        <h1 class="data-page-shell__title">{{ title }}</h1>
        <p v-if="description" class="data-page-shell__description">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="data-page-shell__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="data-page-shell__panel">
      <div v-if="$slots.filters" class="data-page-shell__filters">
        <slot name="filters" />
      </div>

      <VLoading v-if="initialLoading" />

      <div v-else-if="errorMessage" class="data-page-shell__alert">
        <Alert variant="warning">
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
      </div>

      <VEmpty v-else-if="empty" :title="emptyTitle" :message="emptyMessage">
        <template v-if="$slots.emptyActions" #actions>
          <slot name="emptyActions" />
        </template>
      </VEmpty>

      <div v-else class="data-page-shell__content">
        <slot />
      </div>

      <div v-if="pagination" class="data-page-shell__pagination">
        <VPagination
          :page="pagination.page"
          :size="pagination.size"
          page-label="页"
          size-label="条 / 页"
          :total-label="`共 ${pagination.total} 项数据`"
          :total="pagination.total"
          :size-options="pagination.sizeOptions || [10, 20, 50, 100]"
          @update:page="emit('update:page', $event)"
          @update:size="emit('update:size', $event)"
        />
      </div>
    </div>
  </section>
</template>
