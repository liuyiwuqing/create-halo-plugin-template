<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Inbox,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { t } from '@/i18n'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import TableSkeleton from '@/components/ui/skeleton/TableSkeleton.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import PluginTemplateRecordFormSheet from '@/components/PluginTemplateRecordFormSheet.vue'
import PluginTemplateRecordDetailSheet from '@/components/PluginTemplateRecordDetailSheet.vue'
import { useTemplateRecords } from '@/composables/useTemplateRecords'
import {
  TEMPLATE_RECORD_STATUSES,
  formatRecordDate,
  getRecordStatusLabel,
  getRecordStatusMeta,
} from '@/lib/template-records'
import { toBadgeVariant } from '@/lib/template'
import type { PluginTemplateRecord, PluginTemplateRecordForm } from '@/types'

const selectedIds = ref<string[]>([])
const confirmVisible = ref(false)
const batchConfirmVisible = ref(false)
const pendingDeleteRecord = ref<PluginTemplateRecord | null>(null)
const formSheetOpen = ref(false)
const editingRecord = ref<PluginTemplateRecord | null>(null)
const detailSheetVisible = ref(false)
const viewingRecord = ref<PluginTemplateRecord | null>(null)
const showFilters = ref(false)

const {
  filters,
  records,
  loading,
  saving,
  deletingId,
  errorMessage,
  page,
  size,
  total,
  load,
  search,
  resetFilters,
  save,
  remove,
} = useTemplateRecords()

const totalPages = computed(() => Math.ceil(total.value / size.value) || 1)
const selectedCount = computed(() => selectedIds.value.length)
const allSelected = computed(
  () => records.value.length > 0 && selectedIds.value.length === records.value.length,
)
const someSelected = computed(
  () => selectedIds.value.length > 0 && selectedIds.value.length < records.value.length,
)
const hasActiveFilters = computed(
  () => !!filters.keyword || !!filters.status || filters.enabled !== '',
)

watch(records, () => {
  const idSet = new Set(records.value.map((item) => item.id))
  selectedIds.value = selectedIds.value.filter((id) => idSet.has(id))
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
    return
  }
  selectedIds.value = records.value.map((item) => item.id)
}

const toggleSelect = (id: string) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const openCreateForm = () => {
  editingRecord.value = null
  formSheetOpen.value = true
}

const openEditForm = (record: PluginTemplateRecord) => {
  editingRecord.value = record
  formSheetOpen.value = true
}

const openDetailSheet = (record: PluginTemplateRecord) => {
  viewingRecord.value = record
  detailSheetVisible.value = true
}

const handleSave = async (form: PluginTemplateRecordForm) => {
  try {
    await save(form)
    formSheetOpen.value = false
    toast.success(form.id ? t('records.updateSuccess') : t('records.createSuccess'))
  } catch (error) {
    toast.error(error instanceof Error ? error.message : t('records.saveError'))
  }
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
    if (detailSheetVisible.value) {
      detailSheetVisible.value = false
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : t('records.deleteError'))
  }
}

const batchDelete = async () => {
  const ids = [...selectedIds.value]
  try {
    for (const id of ids) {
      await remove(id)
    }
    selectedIds.value = []
    batchConfirmVisible.value = false
    toast.success(t('records.batchDeleteSuccess', { count: ids.length }))
  } catch (error) {
    toast.error(error instanceof Error ? error.message : t('records.deleteError'))
  }
}

const handleDetailEdit = (record: PluginTemplateRecord) => {
  detailSheetVisible.value = false
  openEditForm(record)
}

const handleDetailDelete = (record: PluginTemplateRecord) => {
  detailSheetVisible.value = false
  requestDeleteRecord(record)
}

const handleFormClose = (open: boolean) => {
  formSheetOpen.value = open
  if (!open) {
    editingRecord.value = null
  }
}

const goToPage = (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return
  page.value = newPage
  load()
}

const paginationPages = computed(() => {
  const current = page.value
  const last = totalPages.value
  const delta = 2
  const pages: (number | string)[] = []

  pages.push(1)

  if (current - delta > 2) {
    pages.push('...')
  }

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    if (!pages.includes(i)) pages.push(i)
  }

  if (current + delta < last - 1) {
    pages.push('...')
  }

  if (last > 1 && !pages.includes(last)) {
    pages.push(last)
  }

  return pages
})

onMounted(load)
</script>

<template>
  <!-- Page Header -->
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">{{ t('records.title') }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('records.description') }}</p>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" :disabled="loading" @click="load">
        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
        {{ t('common.refresh') }}
      </Button>
      <Button variant="outline" size="sm" @click="showFilters = !showFilters">
        <Filter class="mr-2 h-4 w-4" />
        {{ showFilters ? t('records.filters.hide') : t('records.filters.show') }}
      </Button>
      <Button size="sm" @click="openCreateForm">
        <Plus class="mr-2 h-4 w-4" />
        {{ t('records.create') }}
      </Button>
    </div>
  </div>

  <!-- Search -->
  <div class="relative mb-4">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      v-model="filters.keyword"
      :placeholder="t('records.filters.searchPlaceholder')"
      class="pl-10"
      @keyup.enter="search"
    />
  </div>

  <!-- Filters Panel -->
  <div v-if="showFilters" class="flex gap-4 flex-wrap mb-4 p-4 border rounded-lg bg-muted/50">
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium">{{ t('records.table.status') }}</label>
      <Select v-model="filters.status" class="w-[150px]" @update:model-value="search">
        <option value="">{{ t('records.filters.allStatus') }}</option>
        <option v-for="item in TEMPLATE_RECORD_STATUSES" :key="item.value" :value="item.value">
          {{ getRecordStatusLabel(item.value) }}
        </option>
      </Select>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium">{{ t('records.table.enabled') }}</label>
      <Select
        :model-value="filters.enabled === '' ? '' : String(filters.enabled)"
        class="w-[130px]"
        @update:model-value="(v: string | boolean | number) => { filters.enabled = v === '' ? '' : v === 'true'; search() }"
      >
        <option value="">{{ t('records.filters.allEnabled') }}</option>
        <option value="true">{{ t('common.enabled') }}</option>
        <option value="false">{{ t('common.disabled') }}</option>
      </Select>
    </div>

    <div v-if="hasActiveFilters" class="flex flex-col gap-1.5 justify-end">
      <Button variant="ghost" size="sm" @click="resetFilters">
        {{ t('records.filters.clear') }}
      </Button>
    </div>
  </div>

  <!-- Bulk Actions Toolbar -->
  <div v-if="selectedCount > 0" class="flex items-center gap-4 p-3 bg-muted rounded-lg mb-4">
    <span class="text-sm font-medium">
      {{ t('records.selected', { count: selectedCount }) }}
    </span>
    <Button variant="destructive" size="sm" @click="batchConfirmVisible = true">
      <Trash2 class="mr-2 h-4 w-4" />
      {{ t('records.batchDelete') }}
    </Button>
    <Button variant="ghost" size="sm" @click="selectedIds = []">
      <X class="mr-2 h-4 w-4" />
      {{ t('records.clearSelection') }}
    </Button>
  </div>

  <!-- Table Loading -->
  <div v-if="loading && records.length === 0" class="rounded-md border">
    <TableSkeleton :rows="5" :columns="7" />
  </div>

  <!-- Table -->
  <template v-else-if="records.length > 0">
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox
                :model-value="allSelected"
                :indeterminate="someSelected"
                :aria-label="t('records.selectAll')"
                @update:model-value="toggleSelectAll"
              />
            </TableHead>
            <TableHead>{{ t('records.table.title') }}</TableHead>
            <TableHead>{{ t('records.table.status') }}</TableHead>
            <TableHead>{{ t('records.table.enabled') }}</TableHead>
            <TableHead class="text-right">{{ t('records.table.priority') }}</TableHead>
            <TableHead>{{ t('records.table.updateTime') }}</TableHead>
            <TableHead class="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="row in records"
            :key="row.id"
            :class="selectedIds.includes(row.id) ? 'bg-muted/50' : undefined"
          >
            <TableCell>
              <Checkbox
                :model-value="selectedIds.includes(row.id)"
                @update:model-value="toggleSelect(row.id)"
              />
            </TableCell>
            <TableCell>
              <button
                type="button"
                class="font-medium text-left transition-colors hover:text-primary"
                @click="openDetailSheet(row)"
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
            <TableCell class="text-muted-foreground">{{ formatRecordDate(row.updateTime) }}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="openEditForm(row)">
                    <Pencil class="mr-2 h-4 w-4" />
                    {{ t('common.edit') }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" @click="requestDeleteRecord(row)">
                    <Trash2 class="mr-2 h-4 w-4" />
                    {{ t('common.delete') }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-muted-foreground">
        {{ t('pagination.showing', { from: (page - 1) * size + 1, to: Math.min(page * size, total), total }) }}
      </p>
      <div class="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :disabled="page === 1"
          @click="goToPage(1)"
        >
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :disabled="page === 1"
          @click="goToPage(page - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>

        <template v-for="(p, idx) in paginationPages" :key="idx">
          <span v-if="p === '...'" class="px-2 text-muted-foreground">...</span>
          <Button
            v-else
            :variant="p === page ? 'default' : 'outline'"
            size="sm"
            class="h-8 w-8"
            @click="goToPage(p as number)"
          >
            {{ p }}
          </Button>
        </template>

        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :disabled="page === totalPages"
          @click="goToPage(page + 1)"
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :disabled="page === totalPages"
          @click="goToPage(totalPages)"
        >
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </template>

  <!-- Empty State -->
  <div v-else-if="!loading" class="flex flex-col items-center justify-center py-16 text-center">
    <Inbox class="h-16 w-16 text-muted-foreground mb-4" />
    <h3 class="text-xl font-semibold mb-2">{{ t('records.empty') }}</h3>
    <p class="text-muted-foreground mb-4">{{ t('records.emptyDescription') }}</p>
    <Button @click="openCreateForm">
      <Plus class="mr-2 h-4 w-4" />
      {{ t('records.create') }}
    </Button>
  </div>

  <!-- Form Sheet -->
  <PluginTemplateRecordFormSheet
    :open="formSheetOpen"
    :record="editingRecord"
    :saving="saving"
    @update:open="handleFormClose"
    @save="handleSave"
  />

  <!-- Detail Sheet -->
  <PluginTemplateRecordDetailSheet
    :open="detailSheetVisible"
    :record="viewingRecord"
    @update:open="detailSheetVisible = $event"
    @edit="handleDetailEdit"
    @delete="handleDetailDelete"
  />

  <!-- Single Delete Confirmation -->
  <AlertDialog :open="confirmVisible" @update:open="confirmVisible = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('records.deleteTitle') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ t('records.deleteDescription', { title: pendingDeleteRecord?.title }) }}
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

  <!-- Batch Delete Confirmation -->
  <AlertDialog :open="batchConfirmVisible" @update:open="batchConfirmVisible = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('records.batchDeleteTitle') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ t('records.batchDeleteDescription', { count: selectedCount }) }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="batchConfirmVisible = false">{{ t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          :disabled="!!deletingId"
          @click="batchDelete"
        >
          {{ t('records.batchDelete') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
