<script setup lang="ts">
import { t } from '@/i18n'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ResponsiveColumn } from '@/types'
import { formatCellValue } from '@/lib/template'

const props = withDefaults(
  defineProps<{
    rows: Record<string, unknown>[]
    columns: ResponsiveColumn[]
    rowKey?: string
    emptyDescription?: string
  }>(),
  {
    rowKey: 'key',
    emptyDescription: '',
  },
)

const resolveRowKey = (row: Record<string, unknown>) =>
  String(row[props.rowKey] ?? row.id ?? row.title ?? Math.random())
</script>

<template>
  <div>
    <div class="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="col in columns"
              :key="col.key"
              :class="{ 'text-right': col.align === 'right', 'text-center': col.align === 'center' }"
            >
              {{ col.label }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="rows.length === 0">
            <TableCell :colspan="columns.length" class="h-24 text-center text-muted-foreground">
              {{ emptyDescription || t('common.noData') }}
            </TableCell>
          </TableRow>
          <TableRow v-for="row in rows" :key="resolveRowKey(row)">
            <TableCell
              v-for="col in columns"
              :key="col.key"
              :class="{ 'text-right': col.align === 'right', 'text-center': col.align === 'center' }"
            >
              <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
                {{ formatCellValue(row[col.key]) }}
              </slot>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="space-y-3 md:hidden">
      <div
        v-if="rows.length === 0"
        class="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
      >
        {{ emptyDescription || t('common.noData') }}
      </div>
      <div
        v-for="row in rows"
        :key="resolveRowKey(row)"
        class="space-y-2 rounded-lg border bg-card p-4"
      >
        <div v-for="col in columns" :key="col.key" class="flex items-start justify-between gap-2">
          <span class="text-xs text-muted-foreground">{{ col.label }}</span>
          <span class="text-right text-sm">
            <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
              {{ formatCellValue(row[col.key]) }}
            </slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
