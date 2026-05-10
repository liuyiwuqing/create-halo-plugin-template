<script setup lang="ts">
import { Plus, RefreshCw, Search } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { t } from '@/i18n'
import { toast } from 'vue-sonner'
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
import BasicPage from '@/components/ui/BasicPage.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
import PluginTemplateRecordFormDialog from '@/components/PluginTemplateRecordFormDialog.vue'
import PluginTemplateRecordTable from '@/components/PluginTemplateRecordTable.vue'
import PluginUiProvider from '@/components/ui/PluginUiProvider.vue'
import { useTemplateRecords } from '@/composables/useTemplateRecords'
import { TEMPLATE_RECORD_STATUSES } from '@/lib/template-records'
import type { PluginTemplateRecord, PluginTemplateRecordForm } from '@/types'

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

const dialogVisible = ref(false)
const editingRecord = ref<PluginTemplateRecord | null>(null)
const confirmVisible = ref(false)
const pendingDeleteRecord = ref<PluginTemplateRecord | null>(null)

const openCreateDialog = () => {
  editingRecord.value = null
  dialogVisible.value = true
}

const openEditDialog = (record: PluginTemplateRecord) => {
  editingRecord.value = record
  dialogVisible.value = true
}

const saveRecord = async (form: PluginTemplateRecordForm) => {
  try {
    await save(form)
    dialogVisible.value = false
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
  <PluginUiProvider audience="console">
    <BasicPage :title="t('records.title')" :description="t('records.description')" sticky>
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="load">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
          {{ t('common.refresh') }}
        </Button>
        <Button size="sm" @click="openCreateDialog">
          <Plus class="mr-2 h-4 w-4" />
          {{ t('records.create') }}
        </Button>
      </template>

      <Alert v-if="errorMessage" variant="destructive">
        <AlertTitle>{{ t('records.title') }}</AlertTitle>
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <!-- Toolbar -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative sm:max-w-xs">
          <Search class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="filters.keyword"
            :placeholder="t('records.filters.searchPlaceholder')"
            class="pl-8"
            @keyup.enter="search"
          />
        </div>
        <Select v-model="filters.status" class="w-full sm:w-[140px]">
          <option value="">{{ t('records.filters.allStatus') }}</option>
          <option
            v-for="item in TEMPLATE_RECORD_STATUSES"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </Select>
        <Select
          :model-value="filters.enabled === '' ? '' : String(filters.enabled)"
          class="w-full sm:w-[120px]"
          @update:model-value="filters.enabled = $event === '' ? '' : $event === 'true'"
        >
          <option value="">{{ t('records.filters.allEnabled') }}</option>
          <option value="true">{{ t('common.enable') }}</option>
          <option value="false">{{ t('common.disable') }}</option>
        </Select>
        <div class="flex gap-2 sm:ml-auto">
          <Button variant="ghost" size="sm" @click="resetFilters">
            {{ t('common.reset') }}
          </Button>
          <Button size="sm" :disabled="loading" @click="search">
            <Search class="mr-2 h-4 w-4" />
            {{ t('common.search') }}
          </Button>
        </div>
      </div>

      <!-- Table -->
      <div class="rounded-lg border">
        <PluginTemplateRecordTable
          :records="records"
          :loading="loading"
          :deleting-id="deletingId"
          @create="openCreateDialog"
          @edit="openEditDialog"
          @delete="requestDeleteRecord"
        />
      </div>

      <!-- Pagination -->
      <div v-if="total > 0" class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-sm text-muted-foreground">
          {{ t('pagination.total', { total }) }}
        </p>
        <div class="flex items-center gap-4">
          <Select
            :model-value="String(size)"
            class="w-[100px]"
            @update:model-value="size = Number($event); handleSizeChange()"
          >
            <option value="10">10 条/页</option>
            <option value="20">20 条/页</option>
            <option value="50">50 条/页</option>
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
    </BasicPage>

    <!-- Form Dialog -->
    <PluginTemplateRecordFormDialog
      v-model="dialogVisible"
      :record="editingRecord"
      :saving="saving"
      @save="saveRecord"
    />

    <!-- Delete Confirmation -->
    <AlertDialog :open="confirmVisible" @update:open="confirmVisible = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ t('records.deleteTitle') }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ t('records.deleteDescription') }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="confirmVisible = false">
            {{ t('common.cancel') }}
          </AlertDialogCancel>
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
  </PluginUiProvider>
</template>
