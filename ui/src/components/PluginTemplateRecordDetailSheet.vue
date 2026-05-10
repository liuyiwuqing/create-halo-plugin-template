<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { formatRecordDate, getRecordStatusLabel, getRecordStatusMeta } from '@/lib/template-records'
import { toBadgeVariant } from '@/lib/template'
import type { PluginTemplateRecord } from '@/types'

const props = defineProps<{
  open: boolean
  record: PluginTemplateRecord | null
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'edit', record: PluginTemplateRecord): void
  (event: 'delete', record: PluginTemplateRecord): void
}>()

const visible = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})
</script>

<template>
  <Sheet v-model:open="visible">
    <SheetContent side="right" class="flex flex-col overflow-y-auto sm:max-w-md">
      <SheetHeader v-if="record">
        <SheetTitle>{{ record.title }}</SheetTitle>
        <SheetDescription class="font-mono text-xs">ID: {{ record.id }}</SheetDescription>
      </SheetHeader>

      <div v-if="record" class="flex-1 space-y-6 py-6">
        <div class="flex flex-wrap items-center gap-2">
          <Badge :variant="toBadgeVariant(getRecordStatusMeta(record.status).tone)">
            {{ getRecordStatusLabel(record.status) }}
          </Badge>
          <Badge :variant="record.enabled ? 'default' : 'secondary'">
            {{ record.enabled ? t('common.enabled') : t('common.disabled') }}
          </Badge>
        </div>

        <Separator />

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-muted-foreground">{{ t('records.table.priority') }}</p>
              <p class="mt-1 text-sm font-semibold tabular-nums">{{ record.priority ?? 0 }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-muted-foreground">{{ t('records.table.publishTime') }}</p>
              <p class="mt-1 text-sm">{{ formatRecordDate(record.publishTime) || '—' }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-muted-foreground">{{ t('records.detail.createTime') }}</p>
              <p class="mt-1 text-sm">{{ formatRecordDate(record.createTime) || '—' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-muted-foreground">{{ t('records.table.updateTime') }}</p>
              <p class="mt-1 text-sm">{{ formatRecordDate(record.updateTime) || '—' }}</p>
            </div>
          </div>
        </div>

        <template v-if="record.description">
          <Separator />
          <div>
            <p class="text-xs font-medium text-muted-foreground">{{ t('records.form.description') }}</p>
            <p class="mt-2 text-sm leading-relaxed">{{ record.description }}</p>
          </div>
        </template>
      </div>

      <SheetFooter v-if="record" class="gap-2 border-t pt-4">
        <Button variant="outline" class="flex-1" @click="emit('edit', record)">
          {{ t('common.edit') }}
        </Button>
        <Button variant="destructive" class="flex-1" @click="emit('delete', record)">
          {{ t('common.delete') }}
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
