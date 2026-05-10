<script setup lang="ts">
import { Eye, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { t } from '@/i18n'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import EmptyState from '@/components/ui/EmptyState.vue'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTemplateRecords } from '@/composables/useTemplateRecords'
import { TEMPLATE_RECORD_STATUSES, formatRecordDate, getRecordStatusLabel, getRecordStatusMeta } from '@/lib/template-records'
import { toBadgeVariant } from '@/lib/template'
import type { PluginTemplateRecord } from '@/types'

const router = useRouter()
const selectedIds = ref<string[]>([])
const confirmVisible = ref(false)
const pendingDeleteRecord = ref<PluginTemplateRecord | null>(null)

const {
  filters,
  records,
  loading,
  deletingId,
  errorMessage,
  page,
  size,
  total,
  load,
  search,
  resetFilters,
  remove,
} = useTemplateRecords()

const selectedCount = computed(() => selectedIds.value.length)
const allSelected = computed(
  () => records.value.length > 0 && selectedIds.value.length === records.value.length,
)

const syncSelection = () => {
  const idSet = new Set(records.value.map((item) => item.id))
  selectedIds.value = selectedIds.value.filter((id) => idSet.has(id))
}

watch(records, syncSelection)

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
    return
  }
  selectedIds.value = records.value.map((item) => item.id)
}

const toggleSelect = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((item) => item !== id)
    return
  }
  selectedIds.value.push(id)
}

const openCreatePage = () => {
  router.push({ name: 'PluginTemplateConsoleCreate' })
}

const openEditPage = (record: PluginTemplateRecord) => {
  router.push({ name: 'PluginTemplateConsoleEdit', params: { id: record.id } })
}

const openDetailPage = (record: PluginTemplateRecord) => {
  router.push({ name: 'PluginTemplateConsoleDetail', params: { id: record.id } })
}

const requestDeleteRecord = (record: PluginTemplateRecord) => {
  pendingDeleteRecord.value = record
  confirmVisible.value = true
}

const deleteRecord = async () => {
  if (!pendingDeleteRecord.value) return
  try {
    await remove(pendingDeleteRecord.value.id)
    toast.success(t('records.deleteSuccess'))
    confirmVisible.value = false
    pendingDeleteRecord.value = null
  } catch (error) {
    toast.error(error instanceof Error ? error.message : t('records.deleteError'))
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  load()
}

const handleSizeChange = () => {
  page.value = 1
  load()
}

onMounted(load)
</script>

<template>
  <PageHeader :title="t('records.title')" :description="t('records.description')">
    <template #actions>
      <Button variant="outline" size="sm" :disabled="loading" @click="load">
        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
        {{ t('common.refresh') }}
      </Button>
      <Button size="sm" @click="openCreatePage">
        <Plus class="mr-2 h-4 w-4" />
        {{ t('records.create') }}
      </Button>
    </template>
  </PageHeader>

  <Alert v-if="errorMessage" variant="destructive" class="mb-4">
    <AlertTitle>{{ t('records.title') }}</AlertTitle>
    <AlertDescription>{{ errorMessage }}</AlertDescription>
  </Alert>

  <Card class="mb-4 border-border/70">
    <CardContent class="p-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="relative lg:w-80">
          <Search class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="filters.keyword"
            :placeholder="t('records.filters.searchPlaceholder')"
            class="pl-8"
            @keyup.enter="search"
          />
        </div>
        <Select v-model="filters.status" class="w-full lg:w-[170px]">
          <option value="">{{ t('records.filters.allStatus') }}</option>
          <option v-for="item in TEMPLATE_RECORD_STATUSES" :key="item.value" :value="item.value">
            {{ getRecordStatusLabel(item.value) }}
          </option>
        </Select>
        <Select
          :model-value="filters.enabled === '' ? '' : String(filters.enabled)"
          class="w-full lg:w-[150px]"
          @update:model-value="filters.enabled = $event === '' ? '' : $event === 'true'"
        >
          <option value="">{{ t('records.filters.allEnabled') }}</option>
          <option value="true">{{ t('common.enable') }}</option>
          <option value="false">{{ t('common.disable') }}</option>
        </Select>

        <div class="flex gap-2 lg:ml-auto">
          <Button variant="ghost" size="sm" @click="resetFilters">{{ t('common.reset') }}</Button>
          <Button size="sm" :disabled="loading" @click="search">
            <Search class="mr-2 h-4 w-4" />
            {{ t('common.search') }}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  <div v-if="records.length === 0 && !loading">
    <EmptyState :title="t('records.empty')" :action-text="t('records.create')" @action="openCreatePage" />
  </div>

  <div v-else class="space-y-3">
    <Card class="hidden border-border/70 md:block">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[44px]">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  :aria-label="t('records.selectAll')"
                  class="h-4 w-4 rounded border-input bg-background"
                  @change="toggleSelectAll"
                />
              </TableHead>
              <TableHead class="min-w-[180px]">{{ t('records.table.title') }}</TableHead>
              <TableHead>{{ t('records.table.status') }}</TableHead>
              <TableHead>{{ t('records.table.enabled') }}</TableHead>
              <TableHead class="text-right">{{ t('records.table.priority') }}</TableHead>
              <TableHead>{{ t('records.table.publishTime') }}</TableHead>
              <TableHead>{{ t('records.table.updateTime') }}</TableHead>
              <TableHead class="text-right">{{ t('common.actions') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in records" :key="row.id">
              <TableCell>
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(row.id)"
                  class="h-4 w-4 rounded border-input bg-background"
                  @change="toggleSelect(row.id)"
                />
              </TableCell>
              <TableCell class="font-medium">
                <button
                  type="button"
                  class="text-left hover:text-primary hover:underline"
                  @click="openDetailPage(row)"
                >
                  {{ row.title }}
                </button>
              </TableCell>
              <TableCell>
                <Badge :variant="toBadgeVariant(getRecordStatusMeta(row.status).tone)">
                  {{ getRecordStatusLabel(row.status) }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="row.enabled ? 'default' : 'secondary'">
                  {{ row.enabled ? t('common.enabled') : t('common.disabled') }}
                </Badge>
              </TableCell>
              <TableCell class="text-right tabular-nums">{{ row.priority ?? 0 }}</TableCell>
              <TableCell class="text-muted-foreground">{{ formatRecordDate(row.publishTime) }}</TableCell>
              <TableCell class="text-muted-foreground">{{ formatRecordDate(row.updateTime) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button variant="ghost" size="icon-sm" @click="openDetailPage(row)">
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" @click="openEditPage(row)">
                    <Pencil class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" class="text-destructive" @click="requestDeleteRecord(row)">
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <div class="space-y-3 md:hidden">
      <Card v-for="record in records" :key="record.id" class="border-border/70">
        <CardContent class="space-y-3 p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <button
                type="button"
                class="truncate text-left text-sm font-semibold hover:text-primary hover:underline"
                @click="openDetailPage(record)"
              >
                {{ record.title }}
              </button>
              <p class="mt-1 text-xs text-muted-foreground">{{ record.id }}</p>
            </div>
            <input
              type="checkbox"
              :checked="selectedIds.includes(record.id)"
              class="mt-0.5 h-4 w-4 rounded border-input bg-background"
              @change="toggleSelect(record.id)"
            />
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p class="text-muted-foreground">{{ t('records.table.status') }}</p>
              <p>{{ getRecordStatusLabel(record.status) }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">{{ t('records.table.enabled') }}</p>
              <p>{{ record.enabled ? t('common.enabled') : t('common.disabled') }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">{{ t('records.table.priority') }}</p>
              <p>{{ record.priority ?? 0 }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">{{ t('records.table.updateTime') }}</p>
              <p>{{ formatRecordDate(record.updateTime) }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" size="sm" @click="openEditPage(record)">
              {{ t('common.edit') }}
            </Button>
            <Button variant="destructive" size="sm" @click="requestDeleteRecord(record)">
              {{ t('common.delete') }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-sm text-muted-foreground">
        {{ t('pagination.total', { total }) }}
      </p>
      <div class="flex items-center gap-4">
        <Select
          :model-value="String(size)"
          class="w-[110px]"
          @update:model-value="size = Number($event); handleSizeChange()"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </Select>
        <Pagination
          :total="total"
          :items-per-page="size"
          :sibling-count="1"
          :default-page="page"
          @update:page="handlePageChange"
        >
          <PaginationContent>
            <PaginationPrevious />
            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>
    </div>

    <div v-if="selectedCount > 0" class="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      {{ t('records.selected', { count: selectedCount }) }}
      <button type="button" class="ml-2 font-medium text-foreground hover:underline" @click="selectedIds = []">
        {{ t('records.clearSelection') }}
      </button>
    </div>
  </div>

  <AlertDialog :open="confirmVisible" @update:open="confirmVisible = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('records.deleteTitle') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ t('records.deleteDescription') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="confirmVisible = false">{{ t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          :disabled="!!deletingId"
          @click="deleteRecord"
        >
          {{ t('common.delete') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
