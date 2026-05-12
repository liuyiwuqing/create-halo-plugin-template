<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'
import type { DataTableColumn } from '@/types/ui'
import { formatCellValue } from '@/lib/template'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const props = withDefaults(
  defineProps<{
    rows: T[]
    columns: DataTableColumn<T>[]
    rowKey?: string | ((row: T) => string)
    loading?: boolean
    emptyDescription?: string
    mobileTitleKey?: keyof T | string
    mobileDescriptionKey?: keyof T | string
  }>(),
  {
    rowKey: 'id',
    loading: false,
    emptyDescription: '暂无数据',
    mobileTitleKey: '',
    mobileDescriptionKey: '',
  },
)

const resolveRowKey = (row: T, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  const record = row as Record<string, unknown>
  return String(record[props.rowKey] ?? record.id ?? record.key ?? index)
}

const visibleMobileColumns = computed(() =>
  props.columns.filter((column) => column.mobileVisible !== false),
)

const getCellValue = (row: T, key: keyof T | string) => {
  return (row as Record<string, unknown>)[String(key)]
}

const formatValue = (row: T, column: DataTableColumn<T>) => {
  const value = getCellValue(row, column.key)
  if (column.formatter) {
    return column.formatter(value, row, column)
  }
  return formatCellValue(value)
}

const resolveMobileTitle = (row: T) => {
  if (props.mobileTitleKey) {
    return formatCellValue(getCellValue(row, props.mobileTitleKey))
  }
  const firstColumn = props.columns[0]
  return firstColumn ? formatValue(row, firstColumn) : resolveRowKey(row, 0)
}

const resolveMobileDescription = (row: T) => {
  if (!props.mobileDescriptionKey) {
    return ''
  }
  return formatCellValue(getCellValue(row, props.mobileDescriptionKey))
}
</script>

<template>
  <div class="data-table-view">
    <div class="data-table-view__desktop">
      <div v-if="loading" class="grid gap-2">
        <Skeleton v-for="index in 5" :key="index" class="h-12 w-full" />
      </div>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="column in columns"
              :key="String(column.key)"
              :align="column.align"
              :style="{ width: column.width ? `${column.width}px` : undefined }"
            >
              {{ column.label }}
            </TableHead>
            <TableHead v-if="$slots.actions" align="center" class="w-36">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, index) in rows" :key="resolveRowKey(row, index)">
            <TableCell
              v-for="column in columns"
              :key="String(column.key)"
              :align="column.align"
              :style="{ minWidth: column.minWidth ? `${column.minWidth}px` : undefined }"
            >
              <slot
                :name="`cell-${String(column.key)}`"
                :row="row"
                :value="getCellValue(row, column.key)"
              >
                {{ formatValue(row, column) }}
              </slot>
            </TableCell>
            <TableCell v-if="$slots.actions" align="center">
              <slot name="actions" :row="row" />
            </TableCell>
          </TableRow>
          <TableRow v-if="!rows.length">
            <TableCell :colspan="columns.length + ($slots.actions ? 1 : 0)" align="center">
              <span class="text-muted-foreground">{{ emptyDescription }}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="data-table-view__mobile">
      <article
        v-for="(row, index) in rows"
        :key="resolveRowKey(row, index)"
        class="data-table-view__card"
      >
        <header class="data-table-view__card-header">
          <div class="data-table-view__card-title-group">
            <h2 class="data-table-view__card-title">
              <slot name="mobile-title" :row="row">
                {{ resolveMobileTitle(row) }}
              </slot>
            </h2>
            <p v-if="resolveMobileDescription(row)" class="data-table-view__card-description">
              {{ resolveMobileDescription(row) }}
            </p>
          </div>

          <div v-if="$slots['mobile-status']" class="data-table-view__card-status">
            <slot name="mobile-status" :row="row" />
          </div>
        </header>

        <dl class="data-table-view__card-meta">
          <div v-for="column in visibleMobileColumns" :key="String(column.key)">
            <dt>{{ column.label }}</dt>
            <dd>
              <slot
                :name="`cell-${String(column.key)}`"
                :row="row"
                :value="getCellValue(row, column.key)"
              >
                {{ formatValue(row, column) }}
              </slot>
            </dd>
          </div>
        </dl>

        <div v-if="$slots.actions" class="data-table-view__card-actions">
          <slot name="actions" :row="row" />
        </div>
      </article>

      <p
        v-if="!rows.length"
        class="m-0 rounded-lg bg-muted p-6 text-center text-sm text-muted-foreground"
      >
        {{ emptyDescription }}
      </p>
    </div>
  </div>
</template>
