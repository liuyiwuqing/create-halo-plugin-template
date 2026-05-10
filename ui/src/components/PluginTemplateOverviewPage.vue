<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { t } from '@/i18n'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import BasicPage from '@/components/ui/BasicPage.vue'
import PluginUiProvider from '@/components/ui/PluginUiProvider.vue'
import { useTemplateOverview } from '@/composables/useTemplateOverview'
import { formatChecklistStatus, toBadgeVariant } from '@/lib/template'

const props = defineProps<{
  audience: 'console' | 'uc'
}>()

const { overview, loading, errorMessage, stats, features, checklist, load } =
  useTemplateOverview(props.audience)

onMounted(load)
</script>

<template>
  <PluginUiProvider :audience="audience">
    <BasicPage :title="t('dashboard.title')" :description="t('dashboard.description')">
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="load">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
          {{ t('common.refresh') }}
        </Button>
      </template>

      <Alert v-if="errorMessage" variant="destructive">
        <AlertTitle>{{ t('dashboard.title') }}</AlertTitle>
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <template v-if="loading">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton v-for="i in 3" :key="i" class="h-28 rounded-lg" />
        </div>
        <Skeleton class="h-56 rounded-lg" />
        <Skeleton class="h-72 rounded-lg" />
      </template>

      <template v-else>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="item in stats" :key="item.key">
            <CardHeader class="pb-2">
              <CardDescription>{{ item.label }}</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-3xl font-bold">{{ item.value }}</p>
              <p v-if="item.helper" class="mt-1 text-xs text-muted-foreground">
                {{ item.helper }}
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{{ t('dashboard.features.title') }}</CardTitle>
              <CardDescription>{{ t('dashboard.features.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{{ t('dashboard.features.name') }}</TableHead>
                    <TableHead>{{ t('dashboard.features.area') }}</TableHead>
                    <TableHead class="text-right">{{ t('dashboard.features.status') }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="item in features" :key="item.key">
                    <TableCell class="font-medium">{{ item.title }}</TableCell>
                    <TableCell>{{ item.area }}</TableCell>
                    <TableCell class="text-right">
                      <Badge :variant="item.enabled ? 'default' : 'secondary'">
                        {{ item.enabled ? t('common.enabled') : t('common.disabled') }}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{{ t('dashboard.checklist.title') }}</CardTitle>
              <CardDescription>{{ t('dashboard.checklist.description') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{{ t('dashboard.checklist.task') }}</TableHead>
                    <TableHead>{{ t('dashboard.checklist.audience') }}</TableHead>
                    <TableHead class="text-right">{{ t('dashboard.checklist.status') }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="item in checklist" :key="item.key">
                    <TableCell class="font-medium">{{ item.title }}</TableCell>
                    <TableCell>{{ item.audience }}</TableCell>
                    <TableCell class="text-right">
                      <Badge :variant="toBadgeVariant(item.status)">
                        {{ formatChecklistStatus(item.status) }}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{{ t('dashboard.context.title') }}</CardTitle>
            <CardDescription>{{ t('dashboard.context.description') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-1">
                <dt class="text-sm text-muted-foreground">Setting 资源</dt>
                <dd class="text-sm font-medium">{{ overview?.settingName || '—' }}</dd>
              </div>
              <div class="space-y-1">
                <dt class="text-sm text-muted-foreground">ConfigMap 资源</dt>
                <dd class="text-sm font-medium">{{ overview?.configMapName || '—' }}</dd>
              </div>
              <div class="space-y-1">
                <dt class="text-sm text-muted-foreground">API 输出目录</dt>
                <dd class="text-sm font-medium">{{ overview?.generatedClientPath || '—' }}</dd>
              </div>
              <div class="space-y-1">
                <dt class="text-sm text-muted-foreground">路由前缀</dt>
                <dd class="text-sm font-medium">{{ overview?.consolePath || '/halo-plugin-template' }}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </template>
    </BasicPage>
  </PluginUiProvider>
</template>
