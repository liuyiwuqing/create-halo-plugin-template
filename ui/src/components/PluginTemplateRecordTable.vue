<script setup lang="ts">
import { MoreHorizontal, Plus } from 'lucide-vue-next'
import { t } from '@/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRecordDate, getRecordStatusMeta } from '@/lib/template-records'
import { toBadgeVariant } from '@/lib/template'
import type { PluginTemplateRecord } from '@/types'

defineProps<{
  records: PluginTemplateRecord[]
  loading: boolean
  deletingId?: string
}>()

const emit = defineEmits<{
  (event: 'create'): void
  (event: 'edit', record: PluginTemplateRecord): void
  (event: 'delete', record: PluginTemplateRecord): void
}>()
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading && !records.length" class="space-y-3 p-4">
      <Skeleton v-for="i in 4" :key="i" class="h-12 w-full" />
    </div>

    <template v-else>
      <!-- Desktop table -->
      <div class="hidden md:block">
        <Table v-if="records.length">
          <TableHeader>
            <TableRow>
              <TableHead class="min-w-[200px]">{{ t('records.table.title') }}</TableHead>
              <TableHead class="w-[100px]">{{ t('records.table.status') }}</TableHead>
              <TableHead class="w-[80px]">{{ t('records.table.enabled') }}</TableHead>
              <TableHead class="w-[80px] text-right">{{ t('records.table.priority') }}</TableHead>
              <TableHead class="w-[160px]">{{ t('records.table.publishTime') }}</TableHead>
              <TableHead class="w-[160px]">{{ t('records.table.updateTime') }}</TableHead>
              <TableHead class="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in records" :key="row.id">
              <TableCell>
                <div>
                  <p class="font-medium">{{ row.title }}</p>
                  <p class="text-xs text-muted-foreground">{{ row.id }}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="toBadgeVariant(getRecordStatusMeta(row.status).tone)">
                  {{ getRecordStatusMeta(row.status).label }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="row.enabled ? 'default' : 'secondary'">
                  {{ row.enabled ? t('common.enabled') : t('common.disabled') }}
                </Badge>
              </TableCell>
              <TableCell class="text-right tabular-nums">
                {{ row.priority ?? 0 }}
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ formatRecordDate(row.publishTime) }}
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ formatRecordDate(row.updateTime) }}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="emit('edit', row)">
                      {{ t('common.edit') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-destructive focus:text-destructive"
                      @click="emit('delete', row)"
                    >
                      {{ t('common.delete') }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12"
        >
          <p class="text-sm text-muted-foreground">{{ t('records.empty') }}</p>
          <Button @click="emit('create')">
            <Plus class="mr-2 h-4 w-4" />
            {{ t('records.create') }}
          </Button>
        </div>
      </div>

      <!-- Mobile card list -->
      <div class="space-y-3 md:hidden">
        <div
          v-if="!records.length"
          class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12"
        >
          <p class="text-sm text-muted-foreground">{{ t('records.empty') }}</p>
          <Button @click="emit('create')">
            <Plus class="mr-2 h-4 w-4" />
            {{ t('records.create') }}
          </Button>
        </div>

        <div
          v-for="record in records"
          :key="record.id"
          class="rounded-lg border bg-card p-4 space-y-3"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="font-medium truncate">{{ record.title }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ record.description || record.id }}</p>
            </div>
            <Badge :variant="toBadgeVariant(getRecordStatusMeta(record.status).tone)">
              {{ getRecordStatusMeta(record.status).label }}
            </Badge>
          </div>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-xs text-muted-foreground">{{ t('records.table.enabled') }}</span>
              <p>{{ record.enabled ? t('common.enabled') : t('common.disabled') }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">{{ t('records.table.priority') }}</span>
              <p>{{ record.priority ?? 0 }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">{{ t('records.table.publishTime') }}</span>
              <p>{{ formatRecordDate(record.publishTime) }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">{{ t('records.table.updateTime') }}</span>
              <p>{{ formatRecordDate(record.updateTime) }}</p>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <Button variant="outline" size="sm" @click="emit('edit', record)">
              {{ t('common.edit') }}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              :loading="deletingId === record.id"
              @click="emit('delete', record)"
            >
              {{ t('common.delete') }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
