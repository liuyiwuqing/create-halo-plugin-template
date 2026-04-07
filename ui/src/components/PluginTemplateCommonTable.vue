<script setup lang="ts">
import { ElEmpty, ElTable, ElTableColumn } from 'element-plus'
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
    emptyDescription: '暂无数据',
  },
)

const resolveRowKey = (row: Record<string, unknown>) =>
  String(row[props.rowKey] ?? row.id ?? row.title ?? Math.random())
</script>

<template>
  <div>
    <div class="halo-plugin-template-admin-table-desktop">
      <ElTable :data="rows" style="width: 100%" :row-key="resolveRowKey">
        <ElTableColumn
          v-for="column in columns"
          :key="column.key"
          :prop="column.key"
          :label="column.label"
          :min-width="column.minWidth"
          :align="column.align"
        >
          <template #default="{ row }">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ formatCellValue(row[column.key]) }}
            </slot>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <div v-if="rows.length" class="halo-plugin-template-admin-table-mobile">
      <article
        v-for="row in rows"
        :key="resolveRowKey(row)"
        class="halo-plugin-template-admin-table-card"
      >
        <div
          v-for="column in columns"
          :key="column.key"
          class="halo-plugin-template-admin-table-card-row"
        >
          <span class="halo-plugin-template-admin-table-card-label">{{ column.label }}</span>
          <div class="halo-plugin-template-admin-table-card-value">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ formatCellValue(row[column.key]) }}
            </slot>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="halo-plugin-template-admin-table-mobile">
      <ElEmpty :description="emptyDescription" />
    </div>
  </div>
</template>
