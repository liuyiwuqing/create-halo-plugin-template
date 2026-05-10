<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { templateConsoleApi } from '@/api'
import { t } from '@/i18n'
import { formatRecordDate, getRecordStatusLabel, getRecordStatusMeta } from '@/lib/template-records'
import { toBadgeVariant } from '@/lib/template'
import type { PluginTemplateRecord } from '@/types'
import EmptyState from '@/components/ui/EmptyState.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GlobalLoading from '@/components/ui/GlobalLoading.vue'
import PageHeader from '@/components/layout/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const record = ref<PluginTemplateRecord | null>(null)
const recordId = computed(() => String(route.params.id || ''))

const loadRecord = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    record.value = await templateConsoleApi.getRecordById(recordId.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('detailPage.notFound')
  } finally {
    loading.value = false
  }
}

const goList = () => {
  router.push({ name: 'PluginTemplateConsoleList' })
}

const goEdit = () => {
  if (!record.value) return
  router.push({ name: 'PluginTemplateConsoleEdit', params: { id: record.value.id } })
}

onMounted(loadRecord)
</script>

<template>
  <PageHeader :title="t('detailPage.title')" :description="t('detailPage.description')">
    <template #actions>
      <Button variant="outline" size="sm" @click="goList">{{ t('common.back') }}</Button>
      <Button v-if="record" size="sm" @click="goEdit">{{ t('common.edit') }}</Button>
    </template>
  </PageHeader>

  <GlobalLoading v-if="loading" />

  <EmptyState
    v-else-if="!record"
    :title="t('detailPage.notFound')"
    :description="errorMessage"
    :action-text="t('notFound.action')"
    @action="goList"
  />

  <div v-else class="grid grid-cols-1 gap-4 xl:grid-cols-3">
    <Card class="border-border/70 xl:col-span-2">
      <CardHeader>
        <CardTitle>{{ record.title }}</CardTitle>
        <CardDescription>{{ t('detailPage.summary') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm leading-relaxed text-muted-foreground">
          {{ record.description || '—' }}
        </p>
      </CardContent>
    </Card>

    <Card class="border-border/70">
      <CardHeader>
        <CardTitle>{{ t('detailPage.metadata') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">{{ t('records.table.status') }}</span>
          <Badge :variant="toBadgeVariant(getRecordStatusMeta(record.status).tone)">
            {{ getRecordStatusLabel(record.status) }}
          </Badge>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">{{ t('records.table.enabled') }}</span>
          <Badge :variant="record.enabled ? 'default' : 'secondary'">
            {{ record.enabled ? t('common.enabled') : t('common.disabled') }}
          </Badge>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">{{ t('records.table.priority') }}</span>
          <span class="font-medium">{{ record.priority ?? 0 }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">{{ t('records.table.publishTime') }}</span>
          <span class="font-medium">{{ formatRecordDate(record.publishTime) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">{{ t('records.table.updateTime') }}</span>
          <span class="font-medium">{{ formatRecordDate(record.updateTime) }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
